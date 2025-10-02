-- ==============================================
-- SUBSCRIPTION & E-COMMERCE TABLES
-- Design-Rite v3 - Phase 6
-- ==============================================
-- Purpose: Comprehensive subscription management + e-commerce ready
-- Features: Subscriptions, payments, products, orders, dropship
-- Run after: SUPABASE_AUTH_001_unify_schema.sql
-- ==============================================

-- ==============================================
-- SUBSCRIPTIONS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,

  -- Subscription Details
  tier TEXT NOT NULL CHECK (tier IN ('starter', 'professional', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'cancelled', 'paused')),
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'annual')) DEFAULT 'monthly',
  amount INTEGER NOT NULL, -- in cents (e.g., 4900 for $49.00)
  currency TEXT DEFAULT 'usd',

  -- Trial Information
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  is_trial BOOLEAN GENERATED ALWAYS AS (trial_end IS NOT NULL AND trial_end > NOW()) STORED,

  -- Billing Dates
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,

  -- Cancellation
  cancel_at TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON subscriptions(next_billing_date);

COMMENT ON TABLE subscriptions IS 'User subscription management with Stripe integration';
COMMENT ON COLUMN subscriptions.amount IS 'Subscription amount in cents (e.g., 4900 = $49.00)';
COMMENT ON COLUMN subscriptions.is_trial IS 'Computed: true if trial_end > NOW()';

-- ==============================================
-- PAYMENTS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

  -- Stripe Details
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  stripe_invoice_id TEXT,

  -- Payment Details
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed', 'refunded', 'partially_refunded')),
  payment_method TEXT, -- 'card', 'bank_account', etc.

  -- Card Details (last 4 digits only - PCI compliant)
  card_brand TEXT, -- 'visa', 'mastercard', 'amex', etc.
  card_last4 TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,

  -- Invoice/Receipt
  description TEXT,
  receipt_url TEXT,
  invoice_pdf TEXT,

  -- Refund Information
  refunded_amount INTEGER DEFAULT 0,
  refund_reason TEXT,
  refunded_at TIMESTAMPTZ,

  -- Failure Information
  failure_code TEXT,
  failure_message TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at DESC);

COMMENT ON TABLE payments IS 'Payment transaction history with Stripe integration';
COMMENT ON COLUMN payments.amount IS 'Payment amount in cents';
COMMENT ON COLUMN payments.card_last4 IS 'Last 4 digits of card - PCI compliant storage';

-- ==============================================
-- SUBSCRIPTION HISTORY TABLE (Audit Log)
-- ==============================================

CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

  -- Action Details
  action TEXT NOT NULL CHECK (action IN (
    'created', 'upgraded', 'downgraded', 'cancelled',
    'reactivated', 'payment_failed', 'payment_succeeded',
    'trial_started', 'trial_ended', 'paused', 'resumed'
  )),

  -- Before/After State
  old_tier TEXT,
  new_tier TEXT,
  old_status TEXT,
  new_status TEXT,
  old_amount INTEGER,
  new_amount INTEGER,

  -- Reason/Notes
  reason TEXT,
  notes TEXT,

  -- Who performed the action
  performed_by UUID REFERENCES auth.users(id), -- admin who made change (if manual)
  is_automatic BOOLEAN DEFAULT true,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sub_history_user ON subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_sub_history_subscription ON subscription_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_sub_history_action ON subscription_history(action);
CREATE INDEX IF NOT EXISTS idx_sub_history_created ON subscription_history(created_at DESC);

COMMENT ON TABLE subscription_history IS 'Audit log of all subscription changes';

-- ==============================================
-- PRODUCTS TABLE (E-Commerce Ready)
-- ==============================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Stripe Integration
  stripe_product_id TEXT UNIQUE,
  stripe_price_id TEXT,

  -- Product Information
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('subscription', 'physical', 'digital', 'service')),
  category TEXT, -- 'camera', 'nvr', 'access_control', 'cable', 'poe_switch', etc.
  subcategory TEXT, -- 'bullet_camera', 'turret_camera', 'dome_camera', etc.

  -- Pricing
  price INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  cost INTEGER, -- vendor cost in cents (for margin calculation)
  margin_percent NUMERIC(5,2), -- profit margin percentage

  -- Inventory (null = unlimited/digital/subscription)
  stock_quantity INTEGER,
  low_stock_threshold INTEGER DEFAULT 10,
  track_inventory BOOLEAN DEFAULT false,

  -- Product Identifiers
  sku TEXT UNIQUE,
  upc TEXT,
  manufacturer_part_number TEXT,

  -- Vendor/Dropship Information
  vendor TEXT,
  vendor_product_id TEXT,
  is_dropship BOOLEAN DEFAULT false,
  dropship_fee INTEGER, -- in cents

  -- Physical Properties (for shipping)
  weight_oz NUMERIC(8,2), -- weight in ounces
  length_in NUMERIC(8,2), -- length in inches
  width_in NUMERIC(8,2),
  height_in NUMERIC(8,2),

  -- Media
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb, -- array of image URLs
  datasheet_url TEXT,

  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,

  -- SEO
  slug TEXT UNIQUE,
  meta_title TEXT,
  meta_description TEXT,

  -- Metadata
  specifications JSONB DEFAULT '{}'::jsonb, -- product specs
  tags TEXT[] DEFAULT '{}', -- searchable tags
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

COMMENT ON TABLE products IS 'Product catalog for subscriptions and physical equipment';
COMMENT ON COLUMN products.price IS 'Retail price in cents';
COMMENT ON COLUMN products.cost IS 'Vendor/wholesale cost in cents';
COMMENT ON COLUMN products.margin_percent IS 'Profit margin as percentage (e.g., 35.00 = 35%)';

-- ==============================================
-- ORDERS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Order Identification
  order_number TEXT UNIQUE NOT NULL,

  -- Stripe Payment
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,

  -- Order Totals (all in cents)
  subtotal INTEGER NOT NULL,
  shipping_amount INTEGER DEFAULT 0,
  tax_amount INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',

  -- Order Status
  status TEXT NOT NULL CHECK (status IN (
    'pending', 'paid', 'processing', 'shipped', 'delivered',
    'cancelled', 'refunded', 'partially_refunded'
  )),

  -- Shipping Information
  shipping_address JSONB, -- {name, line1, line2, city, state, zip, country, phone}
  shipping_method TEXT, -- 'standard', 'expedited', 'overnight'
  tracking_number TEXT,
  tracking_url TEXT,
  carrier TEXT, -- 'ups', 'fedex', 'usps'
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  -- Billing Information
  billing_address JSONB,

  -- Customer Notes
  customer_notes TEXT,
  internal_notes TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

COMMENT ON TABLE orders IS 'Customer orders for products and equipment';
COMMENT ON COLUMN orders.order_number IS 'Unique order number (e.g., DR-2025-00001)';

-- ==============================================
-- ORDER ITEMS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Item Details (stored at purchase time)
  product_name TEXT NOT NULL,
  product_sku TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL, -- in cents (price at time of purchase)
  total_price INTEGER NOT NULL, -- quantity * unit_price

  -- Vendor/Dropship
  vendor TEXT,
  vendor_order_id TEXT,
  vendor_status TEXT CHECK (vendor_status IN ('pending', 'ordered', 'shipped', 'delivered', 'cancelled')),

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_vendor_status ON order_items(vendor_status);

COMMENT ON TABLE order_items IS 'Line items for each order';
COMMENT ON COLUMN order_items.unit_price IS 'Price per unit at time of purchase (cents)';

-- ==============================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Subscriptions Policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Payments Policies
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON payments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Products Policies (public read, admin write)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Orders Policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Order Items Policies
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- ==============================================
-- FUNCTIONS
-- ==============================================

-- Function: Update order total when items change
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE orders
  SET
    subtotal = (
      SELECT COALESCE(SUM(total_price), 0)
      FROM order_items
      WHERE order_id = NEW.order_id
    ),
    total_amount = (
      SELECT COALESCE(SUM(total_price), 0) + shipping_amount + tax_amount - discount_amount
      FROM order_items
      WHERE order_id = NEW.order_id
    ),
    updated_at = NOW()
  WHERE id = NEW.order_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_order_total
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION calculate_order_total();

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- VIEWS FOR ADMIN ANALYTICS
-- ==============================================

-- Subscription Analytics View
CREATE OR REPLACE VIEW admin_subscription_analytics AS
SELECT
  COUNT(*) FILTER (WHERE status = 'active') as active_count,
  COUNT(*) FILTER (WHERE status = 'trialing') as trial_count,
  COUNT(*) FILTER (WHERE status = 'past_due') as past_due_count,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_count,
  SUM(amount) FILTER (WHERE status = 'active') / 100.0 as mrr,
  AVG(EXTRACT(EPOCH FROM (NOW() - created_at))/86400) as avg_customer_age_days,
  COUNT(*) FILTER (WHERE tier = 'starter') as starter_count,
  COUNT(*) FILTER (WHERE tier = 'professional') as professional_count,
  COUNT(*) FILTER (WHERE tier = 'enterprise') as enterprise_count
FROM subscriptions;

COMMENT ON VIEW admin_subscription_analytics IS 'Real-time subscription metrics for admin dashboard';

-- ==============================================
-- SAMPLE DATA (Optional - for testing)
-- ==============================================

-- Uncomment to insert sample products
/*
INSERT INTO products (name, description, type, category, price, cost, sku, is_active) VALUES
  ('4MP IP Bullet Camera', 'Outdoor bullet camera with night vision', 'physical', 'camera', 19900, 12000, 'CAM-BULLET-4MP', true),
  ('16 Channel NVR', '16 channel network video recorder with 2TB HDD', 'physical', 'nvr', 49900, 30000, 'NVR-16CH-2TB', true),
  ('24 Port PoE Switch', 'Managed PoE+ switch with 400W power budget', 'physical', 'network', 39900, 25000, 'SWITCH-24P-POE', true),
  ('Professional Plan', 'Monthly subscription to Design-Rite Professional', 'subscription', 'subscription', 14900, 0, 'SUB-PRO-MONTHLY', true),
  ('Enterprise Plan', 'Monthly subscription to Design-Rite Enterprise', 'subscription', 'subscription', 49900, 0, 'SUB-ENT-MONTHLY', true);
*/

-- ==============================================
-- MIGRATION COMPLETE
-- ==============================================

-- Verification queries (run these to check migration success):
-- SELECT COUNT(*) FROM subscriptions;
-- SELECT COUNT(*) FROM payments;
-- SELECT COUNT(*) FROM products;
-- SELECT COUNT(*) FROM orders;
-- SELECT * FROM admin_subscription_analytics;

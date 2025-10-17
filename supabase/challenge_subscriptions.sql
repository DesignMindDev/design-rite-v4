-- =====================================================
-- Design Rite Challenge - Subscriptions & Profiles
-- =====================================================
-- Created: 2025-10-16
-- Purpose: Track trial and paid subscriptions with Stripe integration

-- =====================================================
-- 1. USER PROFILES TABLE
-- =====================================================
-- Extends auth.users with additional profile information

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT,
  job_title TEXT,
  company_size TEXT,
  pain_point TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS user_profiles_company_idx ON public.user_profiles(company);

-- =====================================================
-- 2. SUBSCRIPTIONS TABLE
-- =====================================================
-- Tracks both trial and paid subscriptions with Stripe sync

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Stripe Integration
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,

  -- Subscription Status
  status TEXT NOT NULL CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid')),
  plan_id TEXT NOT NULL, -- 'trial', 'starter', 'professional'

  -- Trial Information
  trial_ends_at TIMESTAMPTZ,
  trial_started_at TIMESTAMPTZ,

  -- Billing Period
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,

  -- Pricing
  amount_cents INTEGER,
  currency TEXT DEFAULT 'usd',
  interval TEXT, -- 'month', 'year'

  -- Discount/Coupon
  coupon_code TEXT,
  discount_percent INTEGER,

  -- Metadata
  source TEXT DEFAULT 'design_rite_challenge', -- Where signup came from
  campaign_name TEXT,

  -- Payment Method
  payment_method_last4 TEXT,
  payment_method_brand TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  canceled_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,

  -- Constraints
  UNIQUE(user_id, stripe_subscription_id)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_id_idx ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS subscriptions_trial_ends_at_idx ON public.subscriptions(trial_ends_at);

-- =====================================================
-- 3. SUBSCRIPTION EVENTS TABLE
-- =====================================================
-- Audit trail for all subscription changes (from Stripe webhooks)

CREATE TABLE IF NOT EXISTS public.subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Event Details
  event_type TEXT NOT NULL, -- 'trial_started', 'payment_succeeded', 'subscription_canceled', etc.
  stripe_event_id TEXT,

  -- Event Data
  previous_status TEXT,
  new_status TEXT,
  amount_cents INTEGER,

  -- Metadata
  metadata JSONB,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription events
CREATE POLICY "Users can view own subscription events"
  ON public.subscription_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS subscription_events_subscription_id_idx ON public.subscription_events(subscription_id);
CREATE INDEX IF NOT EXISTS subscription_events_user_id_idx ON public.subscription_events(user_id);
CREATE INDEX IF NOT EXISTS subscription_events_event_type_idx ON public.subscription_events(event_type);
CREATE INDEX IF NOT EXISTS subscription_events_created_at_idx ON public.subscription_events(created_at DESC);

-- =====================================================
-- 4. HELPER FUNCTIONS
-- =====================================================

-- Function to get active subscription for a user
CREATE OR REPLACE FUNCTION get_active_subscription(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  status TEXT,
  plan_id TEXT,
  trial_ends_at TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  is_trialing BOOLEAN,
  is_active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.status,
    s.plan_id,
    s.trial_ends_at,
    s.current_period_end,
    (s.status = 'trialing' AND s.trial_ends_at > NOW()) as is_trialing,
    (s.status IN ('trialing', 'active')) as is_active
  FROM public.subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status IN ('trialing', 'active', 'past_due')
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has access (active trial or paid subscription)
CREATE OR REPLACE FUNCTION user_has_access(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_has_access BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = p_user_id
      AND status IN ('trialing', 'active')
      AND (
        (status = 'trialing' AND trial_ends_at > NOW())
        OR status = 'active'
      )
  ) INTO v_has_access;

  RETURN v_has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. VIEWS FOR ANALYTICS
-- =====================================================

-- Active subscriptions summary
CREATE OR REPLACE VIEW v_active_subscriptions AS
SELECT
  s.id,
  s.user_id,
  up.full_name,
  up.company,
  s.status,
  s.plan_id,
  s.trial_ends_at,
  s.current_period_end,
  CASE
    WHEN s.status = 'trialing' THEN 'Trial'
    WHEN s.status = 'active' THEN 'Paid'
    ELSE 'Other'
  END as subscription_type,
  s.amount_cents,
  s.created_at
FROM public.subscriptions s
JOIN public.user_profiles up ON s.user_id = up.id
WHERE s.status IN ('trialing', 'active');

-- Trial conversion tracking
CREATE OR REPLACE VIEW v_trial_conversions AS
SELECT
  s.user_id,
  up.full_name,
  up.company,
  s.trial_started_at,
  s.trial_ends_at,
  s.status,
  CASE
    WHEN s.status = 'active' AND s.trial_started_at IS NOT NULL THEN 'Converted'
    WHEN s.status = 'trialing' THEN 'In Trial'
    WHEN s.status IN ('canceled', 'incomplete') THEN 'Not Converted'
    ELSE 'Unknown'
  END as conversion_status,
  s.created_at
FROM public.subscriptions s
JOIN public.user_profiles up ON s.user_id = up.id
WHERE s.trial_started_at IS NOT NULL;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Next steps:
-- 1. Update create-account API to create user + profile
-- 2. Update Stripe webhook to sync subscription data
-- 3. Test trial signup flow with payment collection

# 🚀 Stripe Setup - Do This Right Now

**Time Required:** 10 minutes
**Goal:** Get your subscription system working

---

## **Step 1: Open Stripe Dashboard** (1 min)

1. Go to: https://dashboard.stripe.com/test/products
2. Make sure you're in **Test Mode** (toggle in top-right corner)

---

## **Step 2: Create Product #1 - Starter** (3 min)

**Click "+ Add product"**

### Product Information:
```
Name: Design-Rite Starter
Description: Perfect for small integrators getting started with AI-powered security design
```

### Pricing:
```
Price: $49.00
Billing period: Monthly
Currency: USD

✅ Check "Offer customers a free trial"
Trial period length: 14 days
```

**Click "Add product"**

### Copy the Price ID:
- Look for the Price ID (starts with `price_`)
- Example: `price_1ABC123xyz...`
- **Copy it** - you'll need it in Step 4

---

## **Step 3: Create Product #2 - Professional** (3 min)

**Click "+ Add product"** again

### Product Information:
```
Name: Design-Rite Professional
Description: For established integrators scaling their business with unlimited assessments
```

### Pricing:
```
Price: $199.00
Billing period: Monthly
Currency: USD

✅ Check "Offer customers a free trial"
Trial period length: 14 days
```

**Click "Add product"**

### Copy the Price ID:
- Copy the Price ID (starts with `price_`)
- **Save it** for Step 4

---

## **Step 4: Create Product #3 - Enterprise** (3 min)

**Click "+ Add product"** again

### Product Information:
```
Name: Design-Rite Enterprise
Description: For large organizations with multiple facilities and advanced integration needs
```

### Pricing:
```
Price: $499.00
Billing period: Monthly
Currency: USD

✅ Check "Offer customers a free trial"
Trial period length: 14 days
```

**Click "Add product"**

### Copy the Price ID:
- Copy the Price ID (starts with `price_`)
- **Save it** for Step 4

---

## **Step 5: Update Environment Variables** (2 min)

Open your `.env.local` file and update these 3 lines with your NEW Price IDs:

```bash
# Replace these with your actual Price IDs from Stripe:
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_YOUR_NEW_STARTER_ID
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL=price_YOUR_NEW_PROFESSIONAL_ID
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE=price_YOUR_NEW_ENTERPRISE_ID
```

**Example (yours will be different):**
```bash
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_1QRSTuvwxy123456
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL=price_1ABCDefghi789012
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE=price_1XYZabcdef345678
```

---

## **Step 6: Restart Your Server** (30 sec)

In your terminal:
1. Press `Ctrl+C` to stop the server
2. Run: `npm run dev`
3. Wait for "Ready in..."

---

## **Step 7: Test It!** (1 min)

1. Go to: http://localhost:3003/subscribe
2. Click "Start 14-Day Free Trial" on any tier
3. You should be redirected to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. You should redirect to dashboard! 🎉

---

## **✅ Success Checklist:**

- [ ] Created 3 products in Stripe Dashboard
- [ ] Each product has 14-day trial enabled
- [ ] Copied all 3 Price IDs
- [ ] Updated `.env.local` with new Price IDs
- [ ] Restarted dev server
- [ ] Tested checkout flow successfully

---

## **🚨 Troubleshooting:**

**Still getting errors?**
1. Verify Price IDs start with `price_` (not `prod_`)
2. Make sure you're in Test Mode in Stripe
3. Check `.env.local` has no extra spaces or quotes
4. Restart server after any `.env.local` changes

**Can't find Price ID?**
- In Stripe Dashboard → Products → Click on product
- Look for "Pricing" section
- Price ID is shown next to the price amount

---

## **🎯 What's Next:**

Once this works in test mode, you'll:
1. Switch Stripe to Live Mode
2. Create the same 3 products in Live Mode
3. Update production environment variables
4. Accept real payments! 💰

---

**Need help?** Just ask!

**Ready to test?** Follow steps 1-7 above right now! ⚡

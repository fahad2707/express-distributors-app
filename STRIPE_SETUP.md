# 💳 Stripe Setup Guide

## Quick Fix: Disable Stripe for Now (Development)

If you just want to test the website without payments, you can leave Stripe keys empty. The checkout button will be disabled but you can still browse and add to cart.

## Option 1: Add Stripe Test Keys (Recommended for Testing)

### Step 1: Get Stripe Test Keys

1. Go to: https://stripe.com
2. Sign up for a free account (or login)
3. Go to **Developers** → **API keys**
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`)

### Step 2: Add Keys to .env Files

**Backend (`backend/.env`):**
```env
STRIPE_SECRET_KEY=pk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Step 3: Restart Your App

```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

## Option 2: Leave Empty (No Payments)

If you don't want to set up Stripe right now:

1. Make sure `frontend/.env.local` has:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

2. The checkout button will be disabled
3. You can still:
   - Browse products
   - Add to cart
   - View orders (if created via admin)

## Test Cards (When Stripe is Set Up)

Once you add Stripe keys, you can use these test cards:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date, any CVC, and any ZIP code.

## Current Status

✅ **Website works without Stripe** - You can browse and add to cart
⚠️ **Checkout disabled** - Until you add Stripe keys
✅ **No errors** - Code handles missing keys gracefully

## Next Steps

1. **For now**: Just browse and test the website
2. **Later**: Add Stripe keys when ready for payments
3. **Production**: Use real Stripe keys (starts with `pk_live_` and `sk_live_`)

The error is now fixed - the website will work without Stripe keys!




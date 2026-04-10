# DUM & DONE Restaurant Website - Setup Guide

## Overview
Complete Pakistani restaurant ordering system with **Email OTP Authentication** and **Email Notifications** (no WhatsApp needed).

---

## What's Been Changed

### 1. **Authentication System** ✅
- Changed from **Phone OTP** to **Email OTP**
- Firebase stores OTP temporarily (10-minute expiry)
- Customer logs in with email → receives 6-digit OTP → creates account with name
- Email-based identification for orders

### 2. **Order Notifications** ✅
- Removed WhatsApp integration completely
- Created **Email notification system** that sends to:
  - **Customer**: Order confirmation email with full details
  - **Admin/Business**: New order notification email
  - **Customer**: Thank you email after delivery (when you implement order status)

### 3. **Database Schema Updated** ✅
- Customer model now uses `email` field instead of phone
- Order model updated: `emailConfirmationSent` (was `whatsappConfirmationSent`)
- Email notification types added

### 4. **Files Removed** ✅
- Deleted `/lib/whatsapp.ts` - no longer needed
- Deleted `/app/api/webhooks/whatsapp/route.ts` - no longer needed

### 5. **Files Created/Updated** ✅
- `/lib/email.ts` - Email notification service with 3 functions:
  - `sendOrderConfirmationEmail()` - Send to customer
  - `sendOrderNotificationToAdmin()` - Send to business
  - `sendThankYouEmail()` - Send after delivery
- `/app/auth/login/page.tsx` - Complete email OTP flow
- `/lib/auth-context.tsx` - Email authentication context
- `/lib/firestore.ts` - Added `getCustomerByEmail()` function

---

## Configuration Required

### 1. **Firebase Setup** (Already in place)
Already configured in:
- `/lib/firebase.ts` - Firebase config
- `/lib/firestore.ts` - Database operations
- `/app/auth/login/page.tsx` - Auth UI

You'll need your Firebase environment variables (should already be set).

### 2. **Email API Configuration** ⚠️ REQUIRED

You mentioned you have a backend email service. Update this file:

**File: `/lib/email.ts` (Line ~1)**

```typescript
const EMAIL_API_ENDPOINT = process.env.NEXT_PUBLIC_EMAIL_API_ENDPOINT || 'https://your-backend-email-api.com/send-email';
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@dumanddone.com';
```

**In your v0 project Settings → Vars, add:**
- `NEXT_PUBLIC_EMAIL_API_ENDPOINT` - Your backend email API URL
- `NEXT_PUBLIC_ADMIN_EMAIL` - Admin/business email address

### 3. **Email API Format**

When you're ready, share your backend email API format. The current implementation sends this JSON payload:

**For Customer Confirmation Email:**
```json
{
  "to": "customer@example.com",
  "subject": "Order Confirmation - DUM & DONE (Order #XXXXX)",
  "template": "order_confirmation_customer",
  "data": {
    "customerName": "Muhammad Ali",
    "orderId": "ABC12345",
    "items": "• Biryani (x2) - ₨500\n• Naan (x1) - ₨100",
    "subtotal": 600,
    "deliveryFee": 0,
    "total": 600,
    "deliveryAddress": "123 Main Street, Karachi",
    "estimatedDeliveryTime": 30,
    "paymentMethod": "Cash on Delivery",
    "restaurantName": "DUM & DONE",
    "restaurantPhone": "+92-XXX-XXXXXXX",
    "restaurantEmail": "admin@dumanddone.com"
  }
}
```

**For Admin Notification Email:**
```json
{
  "to": "admin@dumanddone.com",
  "subject": "New Order Received - #ABC12345 from Muhammad Ali",
  "template": "order_notification_admin",
  "data": {
    "orderId": "ABC12345",
    "customerName": "Muhammad Ali",
    "customerEmail": "muhammad@example.com",
    "customerPhone": "03001234567",
    "items": "• Biryani (x2) - ₨500 [Note: Extra spicy]\n• Naan (x1) - ₨100",
    "subtotal": 600,
    "deliveryFee": 0,
    "total": 600,
    "deliveryAddress": "123 Main Street, Karachi",
    "deliveryCoordinates": "24.8607, 67.0011",
    "estimatedDeliveryTime": 30,
    "paymentMethod": "COD",
    "specialInstructions": "Ring bell twice",
    "orderTime": "4/10/2026 2:30:45 PM"
  }
}
```

---

## How It Works - User Flow

### Customer Login
1. Customer enters email on `/auth/login`
2. System generates 6-digit OTP
3. **Calls your email API** to send OTP
4. Customer enters OTP
5. New customers add their name
6. Account created, user logged in

### Order Placement
1. Customer browses menu at `/menu`
2. Adds items to cart
3. Goes to checkout `/checkout`
4. Selects delivery location (GPS or manual)
5. Selects payment method (COD for now)
6. Clicks "Place Order"
7. Order saved to Firestore
8. **Calls your email API twice:**
   - Confirmation email to customer
   - Notification email to admin
9. Shows confirmation page with order details

### Order History
- Customers can view all their orders at `/orders`
- Orders linked by customer email

---

## Testing the System

### Step 1: Test Authentication
1. Go to `http://localhost:3000/auth/login`
2. Enter your email
3. Check your email for OTP (when your email API is connected)
4. Enter OTP and name
5. Should redirect to home page logged in

### Step 2: Test Ordering
1. Go to `/menu`
2. Add items to cart
3. Go to checkout
4. Select location and payment method
5. Place order
6. Check that confirmation emails sent to both email addresses

---

## Customization Needed

### 1. **Update Email Templates**
In `/lib/email.ts`, adjust:
- Email subject lines
- Restaurant contact details
- Review links
- Email content

### 2. **Update Admin Email**
In `/lib/email.ts` line ~5:
```typescript
const ADMIN_EMAIL = 'your-business@email.com';
```

Or add to environment variables.

### 3. **Add Your Restaurant Details**
In `/lib/email.ts`, update:
- Restaurant name
- Restaurant phone
- Restaurant email

---

## Next Steps

1. **Provide your backend email API endpoint** - This is critical for the system to work
2. **Share the API format your backend expects** - Update `/lib/email.ts` if different
3. **Add environment variables** to v0 project Settings:
   - `NEXT_PUBLIC_EMAIL_API_ENDPOINT`
   - `NEXT_PUBLIC_ADMIN_EMAIL`
4. **Test the complete flow** - Login, order, verify emails sent

---

## File Structure

```
app/
  ├── auth/login/page.tsx          ← Email OTP login
  ├── menu/page.tsx                ← Browse menu
  ├── checkout/page.tsx            ← Place order
  ├── order-confirmation/          ← Order receipt
  ├── orders/page.tsx              ← Order history
  ├── api/
  │   └── orders/route.ts          ← Trigger email API
  └── page.tsx                     ← Home page

lib/
  ├── auth-context.tsx             ← Email OTP auth logic
  ├── email.ts                     ← Email notification service ⭐
  ├── firestore.ts                 ← Database operations
  ├── types.ts                     ← TypeScript types
  └── firebase.ts                  ← Firebase config
```

---

## Support

When ready to implement, please share:
1. Your backend email API endpoint URL
2. Expected request/response format for your email API
3. Available email templates or format you support

This way I can update the email service to match exactly what your backend needs.

# Express Distributors - Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Database Setup

1. Create a PostgreSQL database:
```bash
createdb express_distributors
```

2. Update database connection in `backend/.env`:
```
DATABASE_URL=postgresql://username:password@localhost:5432/express_distributors
```

3. Run migrations:
```bash
cd backend
npm run migrate
```

4. (Optional) Seed sample data:
```bash
npm run seed
```

### 3. Environment Variables

#### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/express_distributors
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Twilio (for OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

FRONTEND_URL=http://localhost:3000
```

#### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 4. Start Development Servers

From the root directory:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

Or start them separately:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## Default Admin Credentials

After running migrations, you can login with:
- Email: `admin@expressdistributors.com`
- Password: `admin123`

**⚠️ IMPORTANT: Change the default admin password in production!**

## Features Overview

### Customer Features
- OTP-based phone authentication
- Browse products by category
- Horizontal swipeable product rows
- Shopping cart
- Stripe payment integration
- Order tracking with real-time status updates

### Admin Features
- Product management (CRUD)
- Category management
- POS system with barcode scanning
- Order management and status updates
- Invoice generation (PDF) and email sending
- Analytics dashboard with charts
- Inventory management with low-stock alerts

## API Endpoints

### Authentication
- `POST /api/auth/request-otp` - Request OTP
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/admin/login` - Admin login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/barcode/:barcode` - Get product by barcode
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### POS
- `POST /api/pos/sale` - Create POS sale (Admin)
- `GET /api/pos/sales` - Get POS sales (Admin)

### Invoices
- `GET /api/invoices` - Get all invoices (Admin)
- `GET /api/invoices/:id/pdf` - Download invoice PDF (Admin)
- `POST /api/invoices/:id/send-email` - Send invoice via email (Admin)

### Analytics
- `GET /api/analytics/sales` - Get sales analytics (Admin)
- `GET /api/analytics/revenue` - Get revenue trends (Admin)

## Production Deployment

1. Build the frontend:
```bash
cd frontend && npm run build
```

2. Build the backend:
```bash
cd backend && npm run build
```

3. Set `NODE_ENV=production` in environment variables

4. Use a process manager like PM2:
```bash
pm2 start dist/server.js --name express-distributors-api
```

5. Serve frontend with a reverse proxy (nginx) or deploy to Vercel/Netlify

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists

### OTP Not Sending
- In development, OTP is logged to console
- Configure Twilio credentials for production SMS

### Stripe Payment Issues
- Use test keys for development
- Configure webhook endpoint for production

## Support

For issues or questions, please refer to the project documentation or contact support.





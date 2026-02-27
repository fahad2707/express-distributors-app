# 🚀 Quick Start Guide

## Step 1: Install Dependencies

```bash
# From the project root directory
npm run install:all
```

This will install dependencies for root, frontend, and backend.

## Step 2: Set Up Database

### Option A: Using PostgreSQL (Recommended)

1. Make sure PostgreSQL is installed and running
2. Create a database:
```bash
createdb express_distributors
```

### Option B: Quick Test (Skip Database for Now)

You can run the frontend without the database to see the UI, but API calls won't work.

## Step 3: Configure Environment Variables

### Backend (`backend/.env`)
Create `backend/.env` file:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/express_distributors
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# For development, OTP will be logged to console (no Twilio needed)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Stripe (use test keys)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=

# Email (optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
Create `frontend/.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

## Step 4: Run Database Migrations

```bash
cd backend
npm run migrate
```

This will:
- Create all database tables
- Create default admin user (email: `admin@expressdistributors.com`, password: `admin123`)

## Step 5: Start the Application

### Option A: Run Both Frontend and Backend Together
```bash
# From project root
npm run dev
```

### Option B: Run Separately (in different terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 6: Access the Website

- **Frontend (Customer Store)**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **Backend API**: http://localhost:5000

## Default Login Credentials

### Admin Login
- Email: `admin@expressdistributors.com`
- Password: `admin123`

### Customer Login
- Use any phone number (e.g., `+1234567890`)
- OTP will be logged to the backend console in development mode
- Check your terminal running the backend to see the OTP code

## Troubleshooting

### Port Already in Use
If port 3000 or 5000 is already in use:
- Frontend: Change port in `frontend/package.json` scripts
- Backend: Change `PORT` in `backend/.env`

### Database Connection Error
- Make sure PostgreSQL is running: `pg_isready`
- Check your DATABASE_URL format
- Ensure database exists: `psql -l | grep express_distributors`

### Dependencies Not Installing
- Make sure you have Node.js 18+ installed
- Try deleting `node_modules` and `package-lock.json` and reinstalling
- Use `npm install` instead of `yarn` if you have issues

## Quick Test Without Database

If you just want to see the UI without setting up the database:

1. Start only the frontend:
```bash
cd frontend
npm install
npm run dev
```

2. Visit http://localhost:3000
3. Note: API calls will fail, but you can see the UI structure

## Next Steps

- Add products via Admin Panel
- Test the POS system
- Explore the analytics dashboard
- Customize the design and branding





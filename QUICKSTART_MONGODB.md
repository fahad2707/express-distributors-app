# 🚀 Quick Start with MongoDB

## Step 1: Set Up MongoDB

Choose one option:

### Option A: MongoDB Atlas (Cloud - Recommended for Beginners)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create a free cluster
4. Get your connection string (see MONGODB_SETUP.md for details)

### Option B: Local MongoDB
- Install MongoDB on your computer
- See MONGODB_SETUP.md for installation instructions

## Step 2: Create .env Files

See **HOW_TO_CREATE_ENV_FILES.md** for step-by-step instructions.

**Quick version:**
1. Create `backend/.env` file with:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/express_distributors
JWT_SECRET=my-super-secret-key-12345
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

2. Create `frontend/.env.local` file with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Step 3: Install Dependencies

```bash
cd /Users/gb/Desktop/asif
npm run install:all
```

This will install all packages needed for frontend and backend.

## Step 4: Set Up Database

```bash
cd backend
npm run migrate
```

This creates the default admin user.

## Step 5: (Optional) Add Sample Data

```bash
cd backend
npm run seed
```

This adds sample categories and products.

## Step 6: Start the Application

```bash
# From project root
npm run dev
```

This starts both frontend and backend servers.

## Step 7: Open in Browser

- **Customer Store**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login

## Default Login

**Admin:**
- Email: `admin@expressdistributors.com`
- Password: `admin123`

**Customer:**
- Use any phone number (e.g., `+1234567890`)
- Check backend console for OTP code

## That's It! 🎉

Your application should now be running. If you encounter any issues, check the troubleshooting sections in the other guides.





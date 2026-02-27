# 🎯 Simple Setup Guide for Beginners

## What You Need

1. **Node.js** installed (download from nodejs.org)
2. **MongoDB** account (free at mongodb.com/atlas) OR MongoDB installed locally
3. **A code editor** (VS Code recommended)

## Step-by-Step Setup

### 1️⃣ Create MongoDB Database

**Easiest Way (Recommended):**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free, no credit card)
3. Create a free cluster
4. Get your connection string (see MONGODB_SETUP.md)

### 2️⃣ Create .env Files

**See HOW_TO_CREATE_ENV_FILES.md for detailed instructions!**

**Quick version:**
- Create `backend/.env` file
- Create `frontend/.env.local` file
- Copy the content from HOW_TO_CREATE_ENV_FILES.md

### 3️⃣ Install Everything

Open terminal in the project folder and run:
```bash
npm run install:all
```

Wait for it to finish (takes a few minutes).

### 4️⃣ Set Up Database

```bash
cd backend
npm run migrate
```

This creates the admin user.

### 5️⃣ Start the App

```bash
# Go back to project root
cd ..
npm run dev
```

### 6️⃣ Open Website

- Go to: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

## Login Info

**Admin:**
- Email: `admin@expressdistributors.com`
- Password: `admin123`

**Customer:**
- Phone: Any number (e.g., `+1234567890`)
- OTP: Check the terminal/console where backend is running

## Need Help?

1. **Can't create .env files?** → See HOW_TO_CREATE_ENV_FILES.md
2. **MongoDB setup?** → See MONGODB_SETUP.md
3. **Something not working?** → Check the error message in terminal

## Common Issues

**"Cannot find module"**
→ Run `npm run install:all` again

**"MongoDB connection failed"**
→ Check your MONGODB_URI in backend/.env

**"Port already in use"**
→ Close other apps using port 3000 or 5000

## That's It! 🎉

Once it's running, you can:
- Browse products as a customer
- Manage products as admin
- Use the POS system
- View analytics





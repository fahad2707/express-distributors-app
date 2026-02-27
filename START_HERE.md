# 👋 START HERE - Complete Beginner's Guide

Welcome! This guide will help you get the website running step by step.

## 📋 What You'll Need

1. **Node.js** (download from https://nodejs.org - get the LTS version)
2. **MongoDB Atlas account** (free cloud database - we'll set this up)
3. **A text editor** (VS Code is recommended)

## 🎯 Quick Start (5 Steps)

### Step 1: Set Up MongoDB (5 minutes)

**Option A: MongoDB Atlas (Easiest - Recommended!)**

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Click "Sign Up" (it's free, no credit card needed)
3. Fill in your details and create account
4. Click "Build a Database"
5. Choose **FREE** (M0) tier
6. Click "Create"
7. Wait for cluster to be created (2-3 minutes)
8. Click "Database Access" → "Add New Database User"
   - Username: `admin` (or any name)
   - Password: Create a strong password (save it!)
   - Click "Add User"
9. Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"
10. Go back to "Database" → Click "Connect" on your cluster
11. Choose "Connect your application"
12. Copy the connection string (looks like: `mongodb+srv://...`)

**📝 Save this connection string - you'll need it!**

### Step 2: Create .env Files (2 minutes)

**See HOW_TO_CREATE_ENV_FILES.md for detailed instructions!**

**Quick Method:**

1. Open the `backend` folder
2. Create a new file named `.env` (exactly that name, with the dot!)
3. Paste this content (replace YOUR_CONNECTION_STRING with the one from Step 1):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=YOUR_CONNECTION_STRING_HERE
JWT_SECRET=my-super-secret-key-12345-change-this
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

4. Save the file

5. Open the `frontend` folder
6. Create a new file named `.env.local`
7. Paste this:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

8. Save the file

### Step 3: Install Dependencies (3-5 minutes)

Open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
cd /Users/gb/Desktop/asif
npm run install:all
```

Wait for it to finish (this downloads all the code libraries needed).

### Step 4: Set Up Database (30 seconds)

```bash
cd backend
npm run migrate
```

You should see: "✅ Default admin created"

### Step 5: Start the Website (10 seconds)

```bash
# Go back to project root
cd ..
npm run dev
```

Wait for it to say "Ready" (takes about 30 seconds).

## 🌐 Open Your Website!

Open your web browser and go to:
- **Main website**: http://localhost:3000
- **Admin panel**: http://localhost:3000/admin/login

## 🔑 Login Information

**Admin Login:**
- Email: `admin@expressdistributors.com`
- Password: `admin123`

**Customer Login:**
- Phone: Any number (try `+1234567890`)
- OTP: Look at your terminal where `npm run dev` is running - you'll see the OTP code printed there!

## ✅ Success Checklist

- [ ] MongoDB Atlas account created
- [ ] Connection string copied
- [ ] `.env` file created in `backend` folder
- [ ] `.env.local` file created in `frontend` folder
- [ ] Dependencies installed (`npm run install:all`)
- [ ] Database migrated (`npm run migrate`)
- [ ] Website running (`npm run dev`)
- [ ] Can access http://localhost:3000

## 🆘 Having Problems?

### "Cannot find module" error
→ Run `npm run install:all` again

### "MongoDB connection failed"
→ Check your MONGODB_URI in `backend/.env` - make sure it's correct!

### "Port 3000 already in use"
→ Close other apps or change the port

### Can't create .env file
→ See HOW_TO_CREATE_ENV_FILES.md for detailed help

### Still stuck?
→ Check the error message in your terminal - it usually tells you what's wrong!

## 🎉 You're Done!

Once it's running, you can:
- Browse products
- Add products as admin
- Use the POS system
- View analytics

Enjoy your new website! 🚀





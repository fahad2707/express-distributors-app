# 📝 How to Create .env Files (Beginner's Guide)

## What is a .env file?

A `.env` file is a text file that stores configuration settings (like passwords, API keys, etc.) for your application. It's like a secret notebook that only your app can read.

## Step-by-Step Guide

### Step 1: Open Your Project Folder

1. Open Finder (on Mac) or File Explorer (on Windows)
2. Navigate to: `/Users/gb/Desktop/asif`

### Step 2: Create Backend .env File

1. **Go to the `backend` folder**
   - Double-click the `backend` folder

2. **Create a new file**
   - Right-click in the folder
   - Select "New Document" or "New Text File"
   - Name it exactly: `.env` (with the dot at the beginning!)
   - ⚠️ **Important**: The file must be named `.env` (not `env.txt` or `.env.txt`)

3. **Open the file and paste this content:**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/express_distributors
JWT_SECRET=my-super-secret-key-change-this-in-production-12345
JWT_EXPIRES_IN=7d

# Twilio (leave empty for now - OTP will work in console)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Stripe (leave empty for now - you can add later)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email (leave empty for now - you can add later)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

FRONTEND_URL=http://localhost:3000
```

4. **Save the file** (Cmd+S or Ctrl+S)

### Step 3: Create Frontend .env.local File

1. **Go back to the main project folder** (`asif`)
2. **Go to the `frontend` folder**
   - Double-click the `frontend` folder

3. **Create a new file**
   - Right-click in the folder
   - Select "New Document" or "New Text File"
   - Name it exactly: `.env.local` (with the dot at the beginning!)

4. **Open the file and paste this content:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

5. **Save the file**

## Alternative: Using Terminal (Easier Method)

If you're comfortable with terminal, you can create the files using these commands:

### For Backend:
```bash
cd /Users/gb/Desktop/asif/backend
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/express_distributors
JWT_SECRET=my-super-secret-key-change-this-in-production-12345
JWT_EXPIRES_IN=7d
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
FRONTEND_URL=http://localhost:3000
EOF
```

### For Frontend:
```bash
cd /Users/gb/Desktop/asif/frontend
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
EOF
```

## How to Check if Files Were Created Correctly

1. In Finder/File Explorer, make sure "Show hidden files" is enabled
   - On Mac: Press `Cmd + Shift + .` (period)
   - On Windows: View → Show → Hidden items

2. You should see:
   - `backend/.env`
   - `frontend/.env.local`

## Important Notes

✅ **DO:**
- Keep these files secret (don't share them)
- Use different values for production
- Add `.env` to `.gitignore` (already done in this project)

❌ **DON'T:**
- Commit these files to GitHub
- Share your JWT_SECRET with anyone
- Use production keys in development

## What Each Setting Means

- **PORT**: Which port the backend runs on (5000)
- **MONGODB_URI**: Where your MongoDB database is located
- **JWT_SECRET**: Secret key for authentication (make it random and long!)
- **FRONTEND_URL**: Where your frontend is running (3000)

## Need Help?

If you're having trouble:
1. Make sure the file names are EXACTLY `.env` and `.env.local` (with the dot!)
2. Make sure there are no spaces in the file names
3. Try using the terminal method above
4. Check that you're in the correct folders

## Next Steps

After creating the .env files:
1. Install MongoDB (see MongoDB setup guide)
2. Run `npm run install:all` to install dependencies
3. Run `cd backend && npm run migrate` to set up the database
4. Run `npm run dev` to start the application





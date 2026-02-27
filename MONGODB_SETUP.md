# 🍃 MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Easiest & Free!)

MongoDB Atlas is a free cloud database. Perfect for beginners!

### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free (no credit card needed)
3. Choose the **FREE** tier (M0)

### Step 2: Create a Cluster
1. After signing up, click "Build a Database"
2. Choose **FREE** (M0) tier
3. Select a cloud provider (AWS is fine)
4. Choose a region closest to you
5. Click "Create"

### Step 3: Create Database User
1. Go to "Database Access" in the left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (remember these!)
5. Set privileges to "Atlas admin"
6. Click "Add User"

### Step 4: Allow Network Access
1. Go to "Network Access" in the left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - Or add your IP address for better security
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 6: Update Your .env File
1. Open `backend/.env`
2. Replace `MONGODB_URI` with your connection string:
```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/express_distributors?retryWrites=true&w=majority
```
3. Replace `yourusername` and `yourpassword` with your actual credentials
4. The `express_distributors` part is your database name (you can change it)

## Option 2: Local MongoDB (On Your Computer)

### For Mac:
```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

### For Windows:
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a Windows Service (recommended)
5. MongoDB will start automatically

### For Linux:
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Update .env for Local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/express_distributors
```

## Verify MongoDB is Running

### Check Local MongoDB:
```bash
# Mac/Linux
mongosh

# Or check if service is running
brew services list  # Mac
sudo systemctl status mongod  # Linux
```

### Check MongoDB Atlas:
- Go to your Atlas dashboard
- You should see your cluster status as "Running"

## Test Connection

After setting up, test your connection:

```bash
cd backend
npm run migrate
```

If you see "✅ MongoDB connected successfully", you're all set!

## Troubleshooting

### "Connection refused" Error
- Make sure MongoDB is running
- Check your MONGODB_URI is correct
- For Atlas: Make sure your IP is whitelisted

### "Authentication failed" Error
- Check your username and password
- Make sure you URL-encoded special characters in password
- For Atlas: Verify database user exists

### Can't Connect to Atlas
- Check your internet connection
- Verify your IP is whitelisted in Network Access
- Make sure cluster is running (not paused)

## Recommended: Use MongoDB Atlas

For beginners, **MongoDB Atlas (Option 1) is recommended** because:
- ✅ No installation needed
- ✅ Free tier available
- ✅ Works from anywhere
- ✅ Automatic backups
- ✅ Easy to set up

## Next Steps

After MongoDB is set up:
1. ✅ Your `.env` file has the correct `MONGODB_URI`
2. Run `cd backend && npm run migrate` to create admin user
3. Run `cd backend && npm run seed` to add sample data (optional)
4. Start your app with `npm run dev`





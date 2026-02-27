# ⚡ Quick Fix: Products Not Loading

## The Problem
"Failed to load products" means the **backend is not running** or **not connected**.

## ✅ Quick Fix (3 Steps)

### Step 1: Check Backend Status
Open your terminal where you ran `npm run dev`. You should see:
```
🚀 Server running on port 5000
```

If you DON'T see this, the backend is not running!

### Step 2: Start Backend
```bash
# Make sure you're in the project root
cd /Users/gb/Desktop/asif

# Start both frontend and backend
npm run dev
```

**Wait for:**
- ✅ Backend: `🚀 Server running on port 5000`
- ✅ Frontend: `Ready` (shows localhost:3000)

### Step 3: Check MongoDB
In the backend terminal, you should see:
```
✅ MongoDB connected successfully
```

If you see MongoDB errors:
1. Check `backend/.env` file
2. Verify `MONGODB_URI` is correct
3. Make sure MongoDB is running

## 🔍 Verify It's Working

1. **Test backend directly:**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"status":"ok"}`

2. **Test products API:**
   ```bash
   curl http://localhost:5000/api/products
   ```
   Should return JSON with products

3. **Refresh browser** at http://localhost:3000

## 🎯 Most Likely Issue

**99% of the time**, the issue is:
- Backend not running
- MongoDB not connected
- Database not seeded

**Fix all three:**
```bash
# 1. Seed database
cd backend && npm run seed

# 2. Start everything
cd .. && npm run dev
```

## ✅ Success Indicators

When everything works:
- ✅ Backend terminal: "MongoDB connected"
- ✅ Backend terminal: "Server running on port 5000"
- ✅ Frontend terminal: "Ready"
- ✅ Browser: Products showing on homepage
- ✅ No error messages

**That's it!** 🎉




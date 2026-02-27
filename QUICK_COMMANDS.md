# 🚀 Quick Command Reference

## Important: Run Commands from Correct Folders!

### ❌ Wrong Way
```bash
# Don't run from root
cd /Users/gb/Desktop/asif
npm run seed  # ❌ This won't work!
```

### ✅ Correct Way

**Seed Database (Add Sample Products):**
```bash
cd /Users/gb/Desktop/asif/backend
npm run seed
```

**Run Migration (Create Admin User):**
```bash
cd /Users/gb/Desktop/asif/backend
npm run migrate
```

**Start the App:**
```bash
# From ROOT folder
cd /Users/gb/Desktop/asif
npm run dev
```

## 📁 Folder Structure

```
asif/                    ← ROOT (run npm run dev from here)
├── package.json         ← install:all, dev scripts here
├── frontend/
│   └── package.json     ← frontend scripts
└── backend/
    └── package.json     ← seed, migrate scripts here
```

## 🎯 Common Commands

### Setup (First Time)
```bash
# 1. Install dependencies (from root)
cd /Users/gb/Desktop/asif
npm run install:all

# 2. Create admin user (from backend)
cd backend
npm run migrate

# 3. Add sample products (from backend)
npm run seed

# 4. Start app (from root)
cd ..
npm run dev
```

### Daily Use
```bash
# Start the app (from root)
cd /Users/gb/Desktop/asif
npm run dev
```

## 🔍 How to Check Where You Are

```bash
# See current location
pwd

# Should show:
# /Users/gb/Desktop/asif          ← Root (for npm run dev)
# /Users/gb/Desktop/asif/backend  ← Backend (for npm run seed/migrate)
# /Users/gb/Desktop/asif/frontend ← Frontend (usually don't need to be here)
```

## ⚡ Quick Navigation

```bash
# Go to root
cd /Users/gb/Desktop/asif

# Go to backend
cd /Users/gb/Desktop/asif/backend

# Go back to root from backend
cd ..

# Go back to root from frontend
cd ..
```





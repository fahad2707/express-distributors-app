# ⚠️ Common Mistakes & Solutions

## ❌ Error: "Missing script: install:all"

**Problem:** You're running the command from the wrong folder!

**Solution:**
```bash
# You're probably here:
cd /Users/gb/Desktop/asif/frontend  ❌

# You need to be here:
cd /Users/gb/Desktop/asif  ✅

# Then run:
npm run install:all
```

## How to Check Your Current Location

```bash
# See where you are
pwd

# Should show: /Users/gb/Desktop/asif
# NOT: /Users/gb/Desktop/asif/frontend
# NOT: /Users/gb/Desktop/asif/backend
```

## Quick Fix

If you're in `frontend` or `backend` folder:

```bash
# Go back to root
cd ..

# Or go directly to root
cd /Users/gb/Desktop/asif

# Now run the command
npm run install:all
```

## Folder Structure Reminder

```
asif/                    ← YOU NEED TO BE HERE
├── package.json         ← install:all script is here
├── frontend/
│   └── package.json    ← Don't run from here
└── backend/
    └── package.json    ← Don't run from here
```

## Other Common Issues

### "Command not found: npm"
→ Install Node.js from nodejs.org

### "Permission denied"
→ Don't use `sudo` - if needed, fix permissions:
```bash
sudo chown -R $(whoami) /Users/gb/Desktop/asif
```

### "Port already in use"
→ Close other apps using port 3000 or 5000





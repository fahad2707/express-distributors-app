# 🚀 How to Start and See Your Website

## Step-by-Step Instructions

### Step 1: Make Sure MongoDB is Running

**If using MongoDB Atlas (Cloud):**
- Your connection string should be in `backend/.env` as `MONGODB_URI`
- Make sure it's correct and your IP is whitelisted

**If using Local MongoDB:**
- Make sure MongoDB is running: `mongod` or `brew services start mongodb-community`

### Step 2: Seed the Database (Add Products)

```bash
# Go to backend folder
cd /Users/gb/Desktop/asif/backend

# Run seed command
npm run seed
```

**Expected Output:**
```
✅ MongoDB connected successfully
✅ Default admin created
✅ Database seeded successfully
   - 8 categories created
   - 64 products created
```

### Step 3: Start the Website

```bash
# Go back to root folder
cd /Users/gb/Desktop/asif

# Start both frontend and backend
npm run dev
```

**Wait for:**
- Backend: `🚀 Server running on port 5000`
- Frontend: `Ready` (usually shows localhost:3000)

**If admin pages show "Failed to load dashboard/products/…":**  
The frontend talks to the backend at `http://localhost:5000`. Ensure the backend is running on port 5000 (you should see "Server running on port 5000" in the terminal). If you only started the frontend, run `npm run dev` from the project root so both start, or run `cd backend && npm run dev` in a separate terminal.

### Step 4: Open Your Browser

Visit: **http://localhost:3000**

You should see:
- ✨ Beautiful homepage with products
- 🏷️ Category filters at the top
- 🛍️ Product grid with images
- 🔍 Search functionality
- 🛒 Shopping cart icon

## 🎯 What You'll See

### Homepage Features:
- **Hero Section**: Clean, minimal header
- **Category Filter**: Click categories to filter products
- **Product Grid**: Beautiful product cards with:
  - Product images (or gradient placeholders)
  - Product names and descriptions
  - Prices
  - Stock status
  - Quick add to cart (hover on desktop)
- **Search Bar**: Search products by name
- **Responsive**: Works on mobile, tablet, desktop

### Navigation:
- **Cart Icon**: Top right (shows item count)
- **Login**: Top right (if not logged in)
- **Orders**: Top right (if logged in)

## 🔑 Login Information

### Admin Panel:
- URL: http://localhost:3000/admin/login
- Email: `admin@expressdistributors.com`
- Password: `admin123`

### Customer Login:
- URL: http://localhost:3000/login
- Phone: Any number (e.g., `+1234567890`)
- OTP: Check backend terminal console for the code

## ⚡ Quick Commands Reference

```bash
# From ROOT folder (/Users/gb/Desktop/asif)
npm run dev              # Start website
npm run install:all      # Install dependencies

# From BACKEND folder (/Users/gb/Desktop/asif/backend)
npm run seed            # Add 64 products
npm run migrate         # Create admin user
npm run dev             # Start backend only
```

## 🐛 Troubleshooting

### "MongoDB connection failed"
- Check your `MONGODB_URI` in `backend/.env`
- Make sure MongoDB is running
- For Atlas: Check IP whitelist

### "Port 3000 already in use"
- Close other apps using port 3000
- Or change port in `frontend/package.json`

### "No products showing"
- Make sure you ran `npm run seed` in backend folder
- Check browser console for errors
- Verify MongoDB connection

### "Can't add to cart"
- You need to login first
- Click "Login" in top right
- Use phone number and OTP from backend console

## ✅ Success Checklist

- [ ] MongoDB connected (check backend terminal)
- [ ] Database seeded (64 products added)
- [ ] Website running (both frontend and backend)
- [ ] Can see products on homepage
- [ ] Can filter by categories
- [ ] Can search products
- [ ] Can add items to cart (after login)

## 🎨 Design Features You'll See

- **Minimal & Clean**: No clutter, lots of whitespace
- **Smooth Animations**: Hover effects on products
- **Professional**: Modern gradient accents
- **Fast Loading**: Optimized images and lazy loading
- **Responsive**: Perfect on all screen sizes

## 🚀 You're Ready!

Once you see the homepage with products, you're all set! 

**Enjoy your beautiful e-commerce website!** 🎉




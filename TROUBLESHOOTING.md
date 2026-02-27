# 🔧 Troubleshooting Guide

## ❌ "Failed to load products" Error

### Most Common Cause: Backend Not Running

**Solution:**

1. **Check if backend is running:**
   ```bash
   # Open a new terminal
   # You should see backend running on port 5000
   ```

2. **Start the backend:**
   ```bash
   cd /Users/gb/Desktop/asif
   npm run dev
   ```

3. **Wait for both servers to start:**
   - Backend: `🚀 Server running on port 5000`
   - Frontend: `Ready` (usually shows localhost:3000)

4. **Refresh browser**

### Other Common Issues

#### MongoDB Not Connected

**Symptoms:**
- Backend running but products not loading
- Backend terminal shows MongoDB connection errors

**Solution:**
1. Check `backend/.env` file
2. Verify `MONGODB_URI` is correct
3. Make sure MongoDB is running (Atlas or local)
4. Restart backend: `cd backend && npm run dev`

#### Database Not Seeded

**Symptoms:**
- Backend running, MongoDB connected
- But no products showing

**Solution:**
```bash
cd /Users/gb/Desktop/asif/backend
npm run seed
```

#### Port Already in Use

**Symptoms:**
- Can't start backend or frontend
- Error: "Port 3000/5000 already in use"

**Solution:**
```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Then restart
npm run dev
```

#### CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- API calls failing

**Solution:**
1. Check `backend/.env` has: `FRONTEND_URL=http://localhost:3000`
2. Restart backend

## ✅ Quick Checklist

- [ ] Backend is running (check terminal)
- [ ] MongoDB is connected (check backend terminal)
- [ ] Database is seeded (`npm run seed`)
- [ ] `.env` files are configured
- [ ] No port conflicts
- [ ] Browser refreshed

## 🆘 Still Not Working?

1. **Check backend terminal** for error messages
2. **Check browser console** (F12) for errors
3. **Verify MongoDB connection** in backend terminal
4. **Try accessing API directly**: http://localhost:5000/api/products

## 📞 Quick Test

Test if backend is working:
```bash
curl http://localhost:5000/health
```

Should return: `{"status":"ok","timestamp":"..."}`

If this fails, backend is not running!




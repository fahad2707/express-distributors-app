# Fix: Cannot login to admin / "Failed to load products"

Follow these steps **in order** from the **project root** (`/Users/gb/Desktop/asif`).

---

## If backend fails with "Lifecycle script dev failed" or "EPERM" / "operation not permitted"

The backend dev script was changed from `tsx watch` to `tsx` so it no longer uses a file watcher that can hit permission errors on some systems. Just run `npm run dev` again from the project root. If you need auto-reload on file changes, restart the backend manually after editing code.

---

## 1. Backend must be running

The website and admin panel call the API at `http://localhost:5000/api`. If the backend is not running, you will see:
- **Website:** "Failed to load products" or "Cannot reach server"
- **Admin login:** "Login failed" or "Cannot reach server"

**Do this:**
```bash
cd /Users/gb/Desktop/asif
npm run dev
```
This starts **both** backend (port 5000) and frontend (port 3000). Leave this terminal open.

If you prefer to run them separately:
- Terminal 1: `cd /Users/gb/Desktop/asif/backend && npm run dev`
- Terminal 2: `cd /Users/gb/Desktop/asif/frontend && npm run dev`

**Check:** Open http://localhost:5000/health in your browser. You should see `{"status":"ok",...}`. If you get "Cannot connect", the backend is not running or not on port 5000.

---

## 2. Backend .env (MongoDB + JWT)

The backend needs a `.env` file in the **backend** folder with at least:

```bash
cd /Users/gb/Desktop/asif/backend
```

Create or edit `.env`:

```
MONGODB_URI=mongodb://localhost:27017/express_distributors
JWT_SECRET=your-secret-key-at-least-20-chars
```

- If you use **MongoDB Atlas**, set `MONGODB_URI` to your Atlas connection string and ensure your IP is whitelisted.
- `JWT_SECRET` can be any long random string. If it is missing, admin login will fail with "Server misconfiguration".

---

## 3. Create the admin user (required for admin login)

If you never ran the migration, there is no admin user, so login will always say "Invalid credentials".

**Do this (one time):**
```bash
cd /Users/gb/Desktop/asif/backend
npm run migrate
```

You should see: `✅ Default admin created` and:
- **Email:** admin@expressdistributors.com  
- **Password:** admin123  

Then use those on the admin login page.

---

## 4. Load products (so the website is not empty)

If the database has no categories/products, the website will load but show no products.

**Do this (one time, or to reset sample data):**
```bash
cd /Users/gb/Desktop/asif/backend
npm run seed
```

You should see: `✅ Database seeded successfully` and counts for categories and products. Refresh the website; products should appear.

---

## 5. Use the same address for frontend and API

- Open the **website** at: **http://localhost:3000** (or http://127.0.0.1:3000).
- Open **admin login** at: **http://localhost:3000/admin/login** (or http://127.0.0.1:3000/admin/login).

The backend is set to accept requests from both `localhost` and `127.0.0.1`. If you use a different host/port for the frontend, you may need to set `FRONTEND_URL` in the backend `.env` to that URL.

---

## 6. Frontend API URL (if backend is on another port/host)

By default the frontend uses `http://localhost:5000/api`. If your backend runs on a different URL:

In **frontend** create or edit `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Change the URL if your backend is not on port 5000. Then restart the frontend (`npm run dev` in the frontend folder or run `npm run dev` from the project root again).

---

## Quick checklist

| Step | Command / Check |
|------|------------------|
| Backend running | `npm run dev` from project root (or run backend separately). Check http://localhost:5000/health |
| Backend .env | `backend/.env` has `MONGODB_URI` and `JWT_SECRET` |
| Admin user exists | `cd backend && npm run migrate` |
| Products exist | `cd backend && npm run seed` |
| Admin login | Email: **admin@expressdistributors.com**, Password: **admin123** |

After these, both **admin login** and **website products** should work. If something still fails, the exact error message on screen (or in the browser Network tab for the failing request) will indicate the next fix.

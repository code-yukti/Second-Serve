# 🚀 QUICK START GUIDE

## For Testing the Website

### 1. Start the Backend Server
```bash
cd "Second Serve/src/server"
node server.js
```

Server will start on: **http://localhost:5000**

### 2. Open the Website
Open your browser and go to:
```
http://localhost:5000
```

### 3. Test Accounts

**Donor Login:**
- Email: `rajesh@example.com`
- Password: `donor123`

**NGO Login:**
- Email: `foodforall@ngo.com`
- Password: `ngo123`

---

## For Accessing Admin Dashboard

### 1. Make Sure Backend is Running
```bash
cd "Second Serve/src/server"
node server.js
```

### 2. Open Admin Dashboard
Open this file in your browser:
```
Second Serve/ADMIN_DASHBOARD/admin-login.html
```

### 3. Admin Credentials
- **Username:** `secondserve_admin`
- **Secret Key:** `FL@2026$ecur3K3y!`

### 4. Dashboard Features
- ✅ View all users and their details
- ✅ View all donations
- ✅ Real-time analytics with charts
- ✅ Export data as JSON
- ✅ Monitor system health
- ✅ Database statistics

---

## For GitHub Deployment

### What to Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Second Serve food donation platform"
git remote add origin <your-repo-url>
git push -u origin main
```

### What NOT to Push (Already in .gitignore)
- ❌ `ADMIN_DASHBOARD/` folder
- ❌ `node_modules/`
- ❌ `database.db`
- ❌ `.env` files
- ❌ `uploads/` folder

The `.gitignore` file ensures these won't be pushed!

---

## For Database Reset

If you want fresh test data:
```bash
cd "Second Serve/src/server"
node init-database.js
```

This creates:
- 9 test users (4 donors, 4 NGOs, 1 admin)
- 9 sample donations

---

## Troubleshooting

**Server won't start?**
```bash
cd "Second Serve/src/server"
npm install
node server.js
```

**Database missing?**
```bash
node init-database.js
```

**Admin dashboard not loading data?**
- Check if backend is running on port 5000
- Open browser console for errors

---

## File Structure Overview

```
Second Serve/
├── index.html, login.html, signup.html, donate.html
├── Backend/
│   ├── server.js (START HERE)
│   ├── db.js
│   ├── init-database.js
│   └── routes/
├── script/ (Frontend JavaScript)
├── style/ (CSS files)
└── ADMIN_DASHBOARD/ (LOCAL ONLY - NOT FOR GITHUB)
    ├── admin-login.html
    ├── dashboard.html
    └── README.md
```

---

## Quick Commands

**Install:**
```bash
cd "Second Serve/src/server" && npm install
```

**Initialize DB:**
```bash
cd "Second Serve/src/server" && node init-database.js
```

**Run Server:**
```bash
cd "Second Serve/src/server" && node server.js
```

**Check Database:**
Open `ADMIN_DASHBOARD/admin-login.html` in browser

---

## Important Notes

1. **Admin Dashboard** is for LOCAL USE ONLY
2. Never push `ADMIN_DASHBOARD/` to GitHub
3. Backend must be running for website to work
4. Use test accounts for demonstration
5. Database resets every time you run `init-database.js`

---

**That's it! You're ready to go! 🎉**

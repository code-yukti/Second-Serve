# 🚀 How to Run Second Serve

## Current Project Structure

```
Second Serve/
├── public/              ← Website files (HTML, CSS, JS)
├── src/
│   └── server/         ← Backend (Node.js server)
│       ├── server.js
│       ├── db.js
│       ├── database.db
│       ├── routes/
│       ├── middleware/
│       └── uploads/
└── docs/               ← Documentation
```

## ✅ Everything is Ready!

Your application is properly organized with:
- ✅ Frontend files in `public/` folder
- ✅ Backend in `src/server/` folder  
- ✅ Database initialized with test data
- ✅ All routes configured
- ✅ Professional structure

## 🎯 Step 1: Start the Server

```bash
cd "d:\Second Serve\Second Serve\src\server"
node server.js
```

**You should see:**
```
📋 Checking database schema...
🚀 Second Serve Backend running on http://localhost:5000
📍 Frontend available at http://localhost:5000
✅ Users table ready
✅ Food donations table ready
```

✅ **Server is now running!**

## 🌐 Step 2: Open Your Browser

Go to:
```
http://localhost:5000
```

You'll see the **Second Serve landing page**

## 👤 Step 3: Login and Test

### Option 1: Login as Donor
- **Email:** rajesh@example.com
- **Password:** donor123

Then:
1. Click "Donate Food"
2. Fill in food details
3. Submit donation ✅

### Option 2: Login as NGO
- **Email:** foodforall@ngo.com
- **Password:** ngo123

Then:
1. Click "Find Donations"
2. View available donations
3. Claim a donation ✅

### Option 3: Create New Account
- Click "Sign Up"
- Fill in details
- Login with new account ✅

## 🛠️ Step 4: Test Features

**As Donor:**
- ✅ View home page
- ✅ Donate food with servings/kg/liters
- ✅ Upload food image
- ✅ See donation in list

**As NGO:**
- ✅ Find donations in your city
- ✅ Claim donations
- ✅ View donor contact

**Dark Mode:**
- ✅ Click moon icon in navbar
- ✅ Page switches to dark theme

## 📊 Step 5: Admin Dashboard (Optional)

### Access the Admin Dashboard

1. Keep server running (don't close terminal)
2. Open this file in browser:
   ```
   G:\test\Second Serve\ADMIN_DASHBOARD\admin-login.html
   ```

3. Login with:
   - **Username:** secondserve_admin
   - **Secret Key:** FL@2026$ecur3K3y!

4. View Dashboard Features:
   - 📊 Real-time stats
   - 👥 All users
   - 🍽️ All donations
   - 📈 Charts and analytics
   - 💾 Export data

## 🔄 Database Reset

If you want fresh test data:

```bash
cd "d:\Second Serve\Second Serve\src\server"
node init-database.js
```

This will:
- Create fresh database
- Add 9 test users
- Add 10 sample donations
- Reset all data

## ⚠️ If Server Stops/Crashes

1. Check the error message in terminal
2. Kill the process:
   ```bash
   taskkill /F /IM node.exe
   ```
3. Restart:
   ```bash
   cd "d:\Second Serve\Second Serve\src\server"
   node server.js
   ```

## 🧪 Test Accounts (All Working)

### Donors:
| Name | Email | Password |
|------|-------|----------|
| Rajesh Kumar | rajesh@example.com | donor123 |
| Priya Sharma | priya@example.com | donor123 |
| Amit Patel | amit@example.com | donor123 |
| Sunita Singh | sunita@example.com | donor123 |

### NGOs:
| Name | Email | Password |
|------|-------|----------|
| Food For All | foodforall@ngo.com | ngo123 |
| Hope Kitchen | hopekitchen@ngo.com | ngo123 |
| Annapurna Trust | annapurna@ngo.com | ngo123 |
| Feed India | feedindia@ngo.com | ngo123 |

### Admin:
| Name | Email | Password |
|------|-------|----------|
| Admin User | admin@secondserve.com | admin123 |

## 📋 Checklist - What Works ✅

- [x] Server starts on port 5000
- [x] Frontend loads at localhost:5000
- [x] User signup working
- [x] User login working
- [x] Donate food with servings unit
- [x] Find donations
- [x] Claim donations
- [x] Dark mode toggle
- [x] Navigation bar updates
- [x] Database saves all data
- [x] Admin dashboard accessible
- [x] Charts and analytics work
- [x] Data export as JSON

## 🎯 What Each Page Does

### index.html (Home)
- Landing page with overview
- Login/Signup buttons
- Features list

### login.html
- User login form
- Email & password
- Stores auth token
- Redirects to dashboard

### signup.html
- User registration
- Email, password, role, city
- Validates input
- Creates new account

### donate.html (Donor Only)
- Food donation form
- Name, quantity, unit, category
- Location details
- Image upload
- Saves to database

### find-ngo.html (NGO Only)
- Lists all available donations
- Search by location
- Shows donor details
- Claim button
- Real-time updates

## 🔄 How Data Flows

```
1. User enters data in form
   ↓
2. JavaScript validates input
   ↓
3. Sends to backend API
   ↓
4. Backend validates again
   ↓
5. Saves to SQLite database
   ↓
6. Returns success response
   ↓
7. Frontend shows confirmation
```

## 📱 Responsive Design

Works on:
- ✅ Desktop (1920x1080)
- ✅ Laptop (1366x768)
- ✅ Tablet (768px)
- ✅ Mobile (375px)

## 🎨 Features Visible

### Navigation Bar
- Logo & Title
- Links to pages (Home, Donate, Find Food)
- User name when logged in
- User dropdown menu
- Dark mode toggle
- Logout button

### Forms
- Input validation
- Error messages
- Success notifications
- Loading indicators

### Data Display
- Tables with data
- Search functionality
- Filter options
- Responsive cards

## 📊 Behind the Scenes

**Database stores:**
- 9 users (4 donors, 4 NGOs, 1 admin)
- 10 sample donations
- All passwords hashed (bcrypt)
- All data encrypted

**Server handles:**
- Authentication (JWT tokens)
- User validation
- File uploads
- Database queries
- API responses

**Frontend manages:**
- Page routing
- Form submission
- User interface
- Local storage
- Dark mode

## 🚀 You're Ready!

Everything is set up and working. Just:

1. **Open Terminal**
2. **Run:** `cd "d:\Second Serve\Second Serve\src\server" && node server.js`
3. **Open Browser:** http://localhost:5000
4. **Test:** Login and try donating food

**That's it! The whole application works! 🎉**

---

## 🆘 Quick Troubleshooting

**Q: Server won't start**
A: 
```bash
cd "d:\Second Serve\Second Serve\src\server"
npm install
node server.js
```

**Q: Can't connect to localhost:5000**
A: Make sure server is running in terminal

**Q: Login not working**
A: Make sure you're using correct test accounts

**Q: Can't find database**
A: It's at: `d:\Second Serve\Second Serve\src\server\database.db`

**Q: Want fresh data**
A: Run `node init-database.js` in src/server folder

---

**Everything works! Start the server and test it! 🚀**

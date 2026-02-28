# 🍽️ FEEDLINK - Food Donation Platform

A modern, production-ready food donation platform connecting donors (restaurants, hotels, individuals) with NGOs to reduce food waste and support communities in need.

## ✨ Features

### For Donors
- 🥘 Post food donations with detailed information
- 📸 Upload food images
- 📍 Specify pickup locations with landmarks
- 📊 Track donation status in real-time
- 🌙 Dark mode support

### For NGOs
- 🔍 Discover nearby food donations
- 🗺️ Browse donations by location
- ✅ Claim donations for immediate pickup
- 📞 Direct contact with donors
- 📈 Track claimed donations

### Admin Features
- 👥 Manage all users (view, edit, delete)
- 🍽️ Monitor all donations
- 📊 Real-time analytics with charts
- 💾 Database backups and exports
- 🖥️ System monitoring

## 🏗️ Project Structure

```
FEEDLINK-main/
├── public/                # Frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── donate.html
│   ├── find-ngo.html
│   ├── script/           # JavaScript files
│   └── style/            # CSS stylesheets
│
├── src/
│   └── server/           # Backend (Node.js + Express)
│       ├── server.js     # Main server file
│       ├── db.js         # Database setup
│       ├── init-database.js
│       ├── middleware/   # Express middleware
│       ├── routes/       # API endpoints
│       ├── uploads/      # User images
│       └── database.db   # SQLite database
│
├── docs/                 # Documentation
│   ├── API.md           # API reference
│   ├── DATABASE.md      # Schema documentation
│   └── SETUP.md         # Setup instructions
│
├── ADMIN_DASHBOARD/     # Local admin tools (not for GitHub)
│   ├── admin-login.html
│   ├── dashboard.html
│   ├── style.css
│   └── script.js
│
└── .gitignore          # Git exclusions
```

## 🚀 Quick Start

### Installation
```bash
# Clone repository
git clone <your-repo-url>
cd FEEDLINK-main

# Install dependencies
npm install
cd src/server && npm install && cd ../..

# Initialize database
cd src/server && node init-database.js && cd ../..
```

### Running
```bash
# Start server (from src/server directory)
cd src/server
node server.js
```

Then open: **http://localhost:5000**

### Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Donor | rajesh@example.com | donor123 |
| NGO | foodforall@ngo.com | ngo123 |
| Admin | admin@feedlink.com | admin123 |

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Font Awesome Icons
- Responsive Design

### Backend
- **Node.js** with Express.js
- **SQLite3** Database
- **JWT** Authentication
- **Bcrypt** Password Hashing
- **Multer** File Uploads
- **CORS** Enabled

## 📊 Database Schema

### Main Tables
- **users** - User accounts (donor, NGO, admin)
- **food_donations** - Donation listings

### Key Features
- Proper foreign keys and constraints
- CHECK constraints for data integrity
- Indexes on frequently queried columns
- Support for 7 unit types (kg, liters, servings, etc.)

[See detailed schema →](docs/DATABASE.md)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - User login

### Donations
- `POST /api/food/donate` - Create donation
- `GET /api/food/donations` - View donations

### Admin
- `GET /api/admin/users` - All users
- `GET /api/admin/donations` - All donations
- `GET /api/admin/stats` - Platform statistics

[Full API docs →](docs/API.md)

## 🔐 Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT token-based authentication
- ✅ Protected API routes with middleware
- ✅ SQL injection prevention
- ✅ CORS properly configured
- ✅ Input validation & sanitization

## 📱 Admin Dashboard (Local)

A professional admin interface for database management:

**Access:** Open `ADMIN_DASHBOARD/admin-login.html`  
**Credentials:**
- Username: `feedlink_admin`
- Secret Key: `FL@2026$ecur3K3y!`

**Features:**
- 📊 Real-time analytics with charts
- 👥 User management
- 🍽️ Donation management
- 📈 Comprehensive analytics
- 💾 Data export (JSON)
- 🖥️ System monitoring

⚠️ **Important:** This folder is NOT pushed to GitHub. It's for local development only!

## 📚 Documentation

- [Setup & Installation](docs/SETUP.md) - Complete setup guide
- [API Reference](docs/API.md) - All endpoints
- [Database Schema](docs/DATABASE.md) - Table structures
- [Quick Start](QUICK_START.md) - Quick reference
- [Credentials](CREDENTIALS.md) - Login details

## 🎯 Use Cases

### Scenario 1: Restaurant Donation
1. Restaurant logs in
2. Posts leftover biryani (10 servings)
3. Sets expiry time and pickup location
4. NGO claims donation
5. NGO picks up and distributes to people in need

### Scenario 2: NGO Manager
1. NGO logs in
2. Searches for donations in their city
3. Views food details and donor contact
4. Claims donation for pickup
5. Completes delivery

### Scenario 3: Admin Monitoring
1. Admin logs in to dashboard
2. Views all users and donations
3. Checks analytics (donations by city, category)
4. Exports data for reports
5. Manages spam/inappropriate entries

## 🚀 Deployment

### Local Development
```bash
cd src/server
node server.js
```

### Production Deployment
See [Setup Guide](docs/SETUP.md) for:
- Docker deployment
- Heroku deployment
- AWS EC2 deployment
- Database migration
- Security hardening

## 🔄 Database Operations

### Initialize with Test Data
```bash
cd src/server
node init-database.js
```

### View Database
```bash
sqlite3 src/server/database.db
.tables
SELECT * FROM users;
```

### Export Data
Use admin dashboard → Export button (JSON format)

## 📈 Performance

- Optimized queries with indexes
- Efficient pagination
- Frontend caching with localStorage
- Responsive image loading
- Minimal dependencies

## 🔍 Troubleshooting

**Server won't start?**
```bash
cd src/server && npm install && node server.js
```

**Database errors?**
```bash
cd src/server && node init-database.js
```

**Port already in use?**
```bash
# Change port in server.js or kill existing process
taskkill /F /IM node.exe  # Windows
killall node              # Mac/Linux
```

[More troubleshooting →](docs/SETUP.md#troubleshooting)

## 🎓 Learning Resources

- Express.js: https://expressjs.com/
- SQLite: https://www.sqlite.org/
- JWT: https://jwt.io/
- Bcrypt: https://www.npmjs.com/package/bcryptjs

## 📝 License

This project is open source under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🙌 Credits

Built as a comprehensive solution for food donation management with:
- Professional folder structure
- Complete documentation
- Admin monitoring dashboard
- Production-ready code
- Hackathon-ready features

## 📞 Support

- 📖 Check [documentation](docs/)
- 🐛 Report issues on GitHub
- 💬 Discuss in GitHub Discussions

---

**Made with ❤️ to reduce food waste and help communities**

**Ready to deploy?** [See deployment guide →](docs/SETUP.md#deployment)


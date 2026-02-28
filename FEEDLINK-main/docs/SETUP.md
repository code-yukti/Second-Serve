# Setup & Installation Guide

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git
- A modern web browser

## Installation Steps

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd FEEDLINK-main
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd src/server
npm install
cd ../..
```

### 3. Initialize Database
```bash
cd src/server
node init-database.js
```

This creates:
- SQLite database (`database.db`)
- All required tables with proper constraints
- 9 test users (4 donors, 4 NGOs, 1 admin)
- 10 sample donations

### 4. Start the Server
```bash
cd src/server
node server.js
```

You should see:
```
📋 Checking database schema...
🚀 FeedLink Backend running on http://localhost:5000
📍 Frontend available at http://localhost:5000
✅ Users table ready
✅ Food donations table ready
```

### 5. Access the Application
Open your browser and navigate to:
```
http://localhost:5000
```

## Project Structure

```
FEEDLINK-main/
├── public/                    # Frontend static files
│   ├── index.html            # Landing page
│   ├── login.html            # User login
│   ├── signup.html           # Registration
│   ├── donate.html           # Donation form
│   ├── find-ngo.html         # Find donations
│   ├── script/               # JavaScript files
│   │   ├── all.js            # Global functionality
│   │   ├── login.js          # Login handler
│   │   ├── signup.js         # Registration handler
│   │   ├── donate.js         # Donation handler
│   │   └── api-utils.js      # API utilities
│   └── style/                # CSS files
│       ├── all.css           # Global styles
│       ├── login.css         # Login page
│       ├── signup.css        # Registration page
│       └── donate.css        # Donation page
│
├── src/                       # Source code
│   └── server/               # Backend server
│       ├── server.js         # Express app entry
│       ├── db.js             # Database setup
│       ├── init-database.js  # Database seeding
│       ├── package.json      # Backend dependencies
│       ├── middleware/       # Express middleware
│       │   └── auth.middleware.js
│       ├── routes/           # API endpoints
│       │   ├── auth.routes.js
│       │   ├── food.routes.js
│       │   ├── ngo.routes.js
│       │   └── admin.routes.js
│       ├── uploads/          # User uploaded images
│       └── database.db       # SQLite database
│
├── docs/                      # Documentation
│   ├── API.md                # API documentation
│   └── DATABASE.md           # Database schema
│
├── ADMIN_DASHBOARD/          # Local admin tools (NOT for GitHub)
│   ├── admin-login.html
│   ├── dashboard.html
│   ├── style.css
│   ├── script.js
│   └── README.md
│
├── .gitignore                # Git exclusions
├── README.md                 # Project overview
├── QUICK_START.md            # Quick reference
├── PROJECT_SUMMARY.md        # Completion summary
├── CREDENTIALS.md            # Login credentials
└── package.json              # Root dependencies
```

## Development Workflow

### Running in Development Mode

```bash
# Terminal 1: Start the server
cd src/server
npm install  # if needed
node server.js

# Terminal 2: Browse to http://localhost:5000
```

### Making Changes

**Frontend Changes:**
- Edit files in `public/` directory
- Changes auto-reflect in browser
- No restart needed

**Backend Changes:**
- Edit files in `src/server/`
- Restart server (Ctrl+C, then `node server.js`)
- Test via API endpoints

**Database Changes:**
- Modify schema in `src/server/db.js`
- Restart server
- Optionally reinitialize: `node init-database.js`

## Test Accounts

### Donor
```
Email: rajesh@example.com
Password: donor123
```

### NGO
```
Email: foodforall@ngo.com
Password: ngo123
```

### Admin
```
Email: admin@feedlink.com
Password: admin123
```

## Admin Dashboard (Local Only)

### Access
1. Ensure backend is running
2. Open `ADMIN_DASHBOARD/admin-login.html` in browser
3. Login credentials:
   - Username: `feedlink_admin`
   - Secret Key: `FL@2026$ecur3K3y!`

### Features
- View all users and donations
- Real-time analytics with charts
- Export data as JSON
- Monitor system health
- Manage database

**⚠️ Important:** This folder is NOT pushed to GitHub and should only be used locally!

## Deployment

### Preparing for Production

1. **Update Configuration**
   ```bash
   # Create .env file with production values
   echo "NODE_ENV=production" > .env
   echo "PORT=5000" >> .env
   echo "JWT_SECRET=your-secret-key" >> .env
   ```

2. **Optimize Build**
   ```bash
   # Minify CSS and JavaScript
   npm install -g minify
   ```

3. **Set Up HTTPS**
   - Use a reverse proxy (nginx)
   - Obtain SSL certificate
   - Configure proper CORS

4. **Database Migration**
   - Export data from SQLite
   - Migrate to PostgreSQL/MySQL if needed
   - Update connection strings

5. **Environment Setup**
   - Configure CDN for uploads
   - Set up email service
   - Configure analytics

### Deploying to Cloud

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### AWS EC2
```bash
# SSH into instance
ssh -i key.pem ubuntu@instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo and start
git clone <repo>
cd FEEDLINK-main/src/server
npm install
node server.js
```

#### Docker
Create `Dockerfile`:
```dockerfile
FROM node:16
WORKDIR /app
COPY . .
RUN cd src/server && npm install
EXPOSE 5000
CMD ["node", "src/server/server.js"]
```

Build and run:
```bash
docker build -t feedlink .
docker run -p 5000:5000 feedlink
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Database Connection Error
```bash
# Check if database.db exists
ls src/server/database.db

# Reinitialize if needed
cd src/server
node init-database.js
```

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Ensure backend is running on port 5000
- Check `.gitignore` for API configuration
- Frontend should access `http://localhost:5000`

## Common Tasks

### Reset Database
```bash
cd src/server
node init-database.js
```

### View Database Contents
```bash
# Install SQLite CLI
brew install sqlite3  # macOS
apt-get install sqlite3  # Linux

# Open database
sqlite3 src/server/database.db

# View tables
.tables

# View schema
.schema food_donations

# Query data
SELECT * FROM users;
```

### Export Data
Use admin dashboard or:
```bash
sqlite3 src/server/database.db << EOF
.headers on
.mode json
SELECT * FROM food_donations;
EOF
```

### Update Backend Code
```bash
cd src/server
# Make changes to .js files
# Restart: Ctrl+C then node server.js
```

## Performance Tips

1. **Enable Caching**
   - Cache API responses in frontend
   - Use browser localStorage

2. **Optimize Queries**
   - Use indexed columns in WHERE clause
   - Implement pagination for large datasets

3. **Monitor Database**
   - Check query performance
   - Analyze slow queries
   - Optimize indexes as needed

4. **Frontend Optimization**
   - Minify CSS/JavaScript
   - Optimize images
   - Use lazy loading

## Security Checklist

- [ ] Change JWT secret in production
- [ ] Use HTTPS for all connections
- [ ] Implement rate limiting
- [ ] Sanitize user inputs
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted domains
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Support & Resources

- **Documentation**: See `docs/` folder
- **API Docs**: `docs/API.md`
- **Database Schema**: `docs/DATABASE.md`
- **Quick Start**: `QUICK_START.md`
- **Issue Tracker**: GitHub Issues

## Next Steps

1. Test the application with test accounts
2. Review API documentation
3. Understand database schema
4. Customize frontend if needed
5. Prepare for deployment
6. Set up monitoring

---

**Happy coding! 🚀**

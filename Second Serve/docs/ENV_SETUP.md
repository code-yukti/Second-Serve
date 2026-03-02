# Environment Variables Setup Guide

## 🔒 Security Notice

**IMPORTANT:** Never commit your `.env` file to GitHub! It contains sensitive credentials that should remain private.

## Quick Start

### 1. Local Development Setup

1. Navigate to the server directory:
   ```bash
   cd "Second Serve/src/server"
   ```

2. Copy the example environment file:
   ```bash
   # On Windows PowerShell
   Copy-Item .env.example .env

   # On Linux/Mac
   cp .env.example .env
   ```

3. Edit the `.env` file with your credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ADMIN_USERNAME=your-admin-username
   ADMIN_SECRET_KEY=your-admin-secret-key
   ```

4. Install dependencies (including dotenv):
   ```bash
   npm install
   ```

5. Start the server:
   ```bash
   npm start
   ```

## 📋 Environment Variables Reference

### Required Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | `5000` | Yes |
| `NODE_ENV` | Environment mode | `development` or `production` | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | `YourRandomSecretKey123!` | Yes |
| `ADMIN_USERNAME` | Admin dashboard username | `adminUser` | Yes |
| `ADMIN_SECRET_KEY` | Admin dashboard password | `SecurePassword123!` | Yes |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (for production) | `postgresql://user:pass@host:5432/db` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `https://yourdomain.com` |

## 🚀 Deployment to Vercel

### Step 1: Push Code to GitHub

Make sure your `.env` file is NOT pushed to GitHub (it should already be in `.gitignore`).

```bash
git status  # Verify .env is not listed
git add .
git commit -m "Update environment configuration"
git push origin main
```

### Step 2: Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `JWT_SECRET` | Your secure JWT secret | Production, Preview, Development |
   | `ADMIN_USERNAME` | Your admin username | Production, Preview, Development |
   | `ADMIN_SECRET_KEY` | Your admin secret key | Production, Preview, Development |
   | `NODE_ENV` | `production` | Production |
   | `PORT` | `5000` | All |

4. Click **Save** for each variable

### Step 3: Deploy

```bash
# Deploy to Vercel
vercel --prod
```

Or use the Vercel dashboard to deploy from GitHub.

## 🔐 Security Best Practices

### 1. Generate Strong Secrets

For JWT_SECRET, use a long random string:

```javascript
// Node.js - Generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Different Credentials for Production

**Never use the same credentials in development and production!**

- Use simple credentials for local development
- Use strong, unique credentials for production
- Store production credentials securely (e.g., password manager)

### 3. Rotate Credentials Regularly

Change your JWT_SECRET and admin credentials periodically:
- After any security incident
- Every 3-6 months as a best practice
- When team members with access leave

### 4. Audit Access

- Keep track of who has access to production credentials
- Review Vercel project member access regularly
- Use Vercel's team features for proper access control

## 🔧 Troubleshooting

### Error: "JWT_SECRET is not defined"

**Solution:** Make sure you have:
1. Created the `.env` file in `src/server/` directory
2. Added `JWT_SECRET=your-secret-key` to the file
3. Restarted the server after creating `.env`

### Error: "dotenv is not installed"

**Solution:**
```bash
cd "Second Serve/src/server"
npm install dotenv
```

### Admin Login Not Working After Deployment

**Solution:**
1. Check Vercel environment variables are set correctly
2. Verify variable names match exactly (case-sensitive)
3. Check Vercel deployment logs for errors
4. Make sure the admin-login.html API_BASE_URL points to your production URL

### Local Server Shows "Invalid Token"

**Solution:**
- Delete browser localStorage and cookies
- Log out and log in again
- Make sure JWT_SECRET hasn't changed mid-session

## 📱 Updating Frontend API URL for Production

Before deploying, update the API URL in `admin-login.html`:

```javascript
// For local development
const API_BASE_URL = 'http://localhost:5000/api';

// For production (update this to your Vercel URL)
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : 'https://your-app.vercel.app/api';
```

## ✅ Verification Checklist

Before deploying to production:

- [ ] `.env` file is in `.gitignore`
- [ ] `.env` file is NOT committed to GitHub
- [ ] Strong JWT_SECRET generated (32+ characters)
- [ ] Production admin credentials are different from development
- [ ] All environment variables added to Vercel
- [ ] Server starts without errors locally
- [ ] Admin login works locally with .env credentials
- [ ] Code pushed to GitHub (without .env)
- [ ] Vercel environment variables configured
- [ ] Production deployment successful
- [ ] Admin login works on production

## 📞 Support

If you encounter issues:
1. Check the server console for error messages
2. Verify all environment variables are set correctly
3. Review Vercel deployment logs
4. Ensure `.env` file exists and has correct format

---

**Remember:** Security is not optional! Keep your credentials safe and never expose them publicly.

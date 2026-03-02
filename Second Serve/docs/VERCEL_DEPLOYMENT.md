# 🚀 Vercel Deployment Guide

Step-by-step guide to deploy Second Serve on Vercel with proper security.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Your code pushed to a GitHub repository
- Environment variables ready (see [ENV_SETUP.md](ENV_SETUP.md))

## 🔐 Pre-Deployment Security Check

Before deploying, verify:

✅ `.env` file is in `.gitignore`  
✅ No sensitive credentials in your code  
✅ All secrets use environment variables  
✅ `.env` file is NOT in your GitHub repository  

```bash
# Check what's being committed
git status

# .env should NOT appear in the list
# If it does, add it to .gitignore immediately
```

## 📦 Step 1: Prepare Your Code

1. **Verify Environment Variables Setup**

   Make sure your code uses `process.env` for all secrets:
   ```javascript
   // ✅ Good - uses environment variable
   const secret = process.env.JWT_SECRET;

   // ❌ Bad - hardcoded secret
   const secret = "my-secret-key";
   ```

2. **Update API URLs for Production**

   Edit `Second Serve/public/admin-login.html`:
   ```javascript
   // Dynamic API URL based on environment
   const API_BASE_URL = window.location.hostname === 'localhost' 
       ? 'http://localhost:5000/api'
       : window.location.origin + '/api';
   ```

3. **Verify vercel.json Configuration**

   Your `vercel.json` should already be configured:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "Second Serve/src/server/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "Second Serve/src/server/server.js" },
       { "src": "/health", "dest": "Second Serve/src/server/server.js" },
       { "src": "/uploads/(.*)", "dest": "Second Serve/src/server/server.js" },
       { "src": "/(.*)", "dest": "Second Serve/public/$1" }
     ]
   }
   ```

## 🌐 Step 2: Push to GitHub

```bash
# Add all changes
git add .

# Commit (verify .env is NOT included)
git status  # Check this first!
git commit -m "Prepare for Vercel deployment"

# Push to GitHub
git push origin main
```

## 🔧 Step 3: Connect to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your Second Serve repository
5. Configure the project:
   - **Framework Preset:** Other
   - **Root Directory:** Leave as is (or set to root)
   - **Build Command:** Leave empty
   - **Output Directory:** Leave empty
6. Click **"Deploy"** (Don't worry, we'll add environment variables next)

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

## 🔐 Step 4: Configure Environment Variables

**CRITICAL STEP:** Add your environment variables to Vercel.

### Using Vercel Dashboard:

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:

   | Variable Name | Value | Environments |
   |--------------|-------|--------------|
   | `JWT_SECRET` | `[Your secure random string]` | Production, Preview, Development |
   | `ADMIN_USERNAME` | `[Your admin username]` | Production, Preview, Development |
   | `ADMIN_SECRET_KEY` | `[Your admin secret key]` | Production, Preview, Development |
   | `NODE_ENV` | `production` | Production |
   | `PORT` | `5000` | All |

   **Important:**
   - Click **"Add"** after each variable
   - Select **all three environments** for each variable
   - Use STRONG, UNIQUE values for production (different from development)

4. Click **"Save"** when done

### Using Vercel CLI:

```bash
# Set environment variables
vercel env add JWT_SECRET
# Enter your secret when prompted
# Select: Production, Preview, Development

vercel env add ADMIN_USERNAME
# Enter your admin username

vercel env add ADMIN_SECRET_KEY
# Enter your admin secret key

vercel env add NODE_ENV
# Enter: production
# Select: Production only
```

## 🔄 Step 5: Redeploy with Environment Variables

After adding environment variables, trigger a new deployment:

### Via Dashboard:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Check **"Use existing Build Cache"** is unchecked
4. Click **"Redeploy"**

### Via CLI:
```bash
vercel --prod
```

## ✅ Step 6: Verify Deployment

1. **Check Deployment Status**
   - Wait for deployment to complete (usually 1-2 minutes)
   - Check for any errors in the build logs

2. **Test Your Application**
   - Visit your Vercel URL: `https://your-app.vercel.app`
   - Verify the homepage loads correctly
   - Test user login/signup
   - Test food donation features

3. **Test Admin Dashboard**
   - Go to: `https://your-app.vercel.app/admin-login.html`
   - Try logging in with your credentials
   - Verify the dashboard loads and displays data

4. **Check API Endpoints**
   - Visit: `https://your-app.vercel.app/health`
   - Should return: `{"status":"OK","message":"Second Serve backend is running"}`

## 🔍 Troubleshooting

### Error: "JWT_SECRET is not defined"

**Solution:**
- Verify environment variables are set in Vercel dashboard
- Make sure you selected all environments (Production, Preview, Development)
- Redeploy after adding variables

### Error: "Cannot find module 'dotenv'"

**Solution:**
```bash
# Make sure dotenv is in dependencies (not devDependencies)
cd "Second Serve/src/server"
npm install --save dotenv
git add package.json
git commit -m "Add dotenv to dependencies"
git push
```

### Admin Login Returns 401 Error

**Solution:**
- Check ADMIN_USERNAME and ADMIN_SECRET_KEY are set correctly in Vercel
- Variable names are case-sensitive
- No extra spaces in the values
- Redeploy after fixing

### Database Not Working on Vercel

**Note:** SQLite databases are **ephemeral** on Vercel (reset on each deployment).

**Solutions:**
1. **For Testing:** Accept that data will reset with each deployment
2. **For Production:** Migrate to PostgreSQL (see [VERCEL_DATABASE_MIGRATION.md](../VERCEL_DATABASE_MIGRATION.md))

### Static Files (Images) Not Loading

**Solution:**
- Verify file paths in HTML/CSS are relative
- Check the `routes` in `vercel.json` are correct
- Uploaded images (multer uploads) won't persist on Vercel - use cloud storage (AWS S3, Cloudinary)

## 🔒 Security Checklist After Deployment

- [ ] Visited GitHub repository to confirm .env is not visible
- [ ] Changed admin credentials from development values
- [ ] JWT_SECRET is a strong random string (32+ characters)
- [ ] All environment variables properly set in Vercel
- [ ] Admin login works on production
- [ ] No secrets visible in browser console or network tab
- [ ] HTTPS is working (Vercel provides this automatically)

## 🔄 Making Updates

After your initial deployment, when you make changes:

```bash
# Make your changes locally
# Test locally first

# Commit and push
git add .
git commit -m "Your update description"
git push origin main

# Vercel will automatically deploy the changes
```

## 📊 Monitoring Your Deployment

1. **View Logs**
   - Vercel Dashboard → Your Project → **View Function Logs**
   - Check for any runtime errors

2. **Analytics**
   - Vercel Dashboard → Your Project → **Analytics**
   - Monitor traffic and performance

3. **Error Tracking**
   - Check deployment logs regularly
   - Set up monitoring (Sentry, LogRocket, etc.)

## 🎯 Production Best Practices

1. **Use Custom Domain**
   - In Vercel Dashboard → Settings → Domains
   - Add your custom domain for a professional look

2. **Enable Branch Deployments**
   - Test changes on preview deployments before production
   - Push to a dev branch first, then merge to main

3. **Set Up Monitoring**
   - Use Vercel Analytics
   - Consider third-party monitoring (UptimeRobot, Pingdom)

4. **Regular Backups**
   - Export data regularly if using SQLite
   - Or migrate to PostgreSQL for automatic backups

5. **Security Headers**
   - Vercel provides security headers by default
   - Add custom headers in vercel.json if needed

## 🆘 Getting Help

If you encounter issues:

1. **Check Vercel Logs**
   - Dashboard → Your Project → View Function Logs

2. **Common Issues**
   - [Vercel Documentation](https://vercel.com/docs)
   - [Vercel Community](https://github.com/vercel/vercel/discussions)

3. **Environment Variables**
   - Double-check spelling and values
   - Verify environments are selected correctly

4. **Build Errors**
   - Check if your code runs locally first
   - Verify all dependencies are in package.json

---

## 🎉 You're Live!

Congratulations! Your Second Serve application is now live on Vercel.

**Next Steps:**
- Share your app URL with users
- Set up a custom domain
- Monitor usage and performance
- Consider migrating to PostgreSQL for production data persistence

**Your Vercel URL:**
```
https://your-app-name.vercel.app
```

---

**Remember:** Keep your environment variables secure and never share them publicly!

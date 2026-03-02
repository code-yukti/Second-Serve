# 🚀 Quick Reference - Environment Variables

## 📋 Fast Setup (2 Minutes)

```bash
# 1. Navigate to server directory
cd "D:\Second Serve\Second Serve\src\server"

# 2. Copy environment template
copy .env.example .env

# 3. Edit .env file (change the values!)
notepad .env

# 4. Install dependencies
npm install

# 5. Start server
node server.js
```

## 🔑 Environment Variables

### Required in `.env` file:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this
ADMIN_USERNAME=your-admin-username
ADMIN_SECRET_KEY=your-admin-secret-key
```

## 🚀 For Vercel Deployment

### In Vercel Dashboard → Settings → Environment Variables:

| Name | Example Value | Environment |
|------|---------------|-------------|
| `JWT_SECRET` | `SecondServe_2026_RandomKey!` | All |
| `ADMIN_USERNAME` | `admin` | All |
| `ADMIN_SECRET_KEY` | `YourSecurePassword123!` | All |
| `NODE_ENV` | `production` | Production only |
| `PORT` | `5000` | All |

## ✅ Quick Checklist

- [ ] `.env` file created in `src/server/`
- [ ] Strong JWT_SECRET (32+ chars)
- [ ] Admin credentials changed from template
- [ ] `npm install` completed
- [ ] Server starts: `node server.js`
- [ ] `.env` NOT in git: `git status`
- [ ] Code pushed to GitHub
- [ ] Vercel env vars configured
- [ ] Deployed and tested

## 🔐 Generate Strong JWT Secret

```bash
# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🆘 Troubleshooting

### "JWT_SECRET is not defined"
- Check `.env` file exists in `src/server/`
- Restart server after creating `.env`

### "dotenv is not installed"
```bash
cd "D:\Second Serve\Second Serve\src\server"
npm install dotenv
```

### Admin login fails on Vercel
- Verify env vars in Vercel Dashboard
- Check spelling (case-sensitive!)
- Redeploy after adding vars

## 📚 Full Documentation

- [ENV_SETUP.md](ENV_SETUP.md) - Complete environment setup
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Deployment guide
- [SECURITY.md](SECURITY.md) - Security best practices
- [SECURITY_IMPLEMENTATION.md](SECURITY_IMPLEMENTATION.md) - What changed

## 🎯 Key Points

1. **Never commit `.env`** - It's in .gitignore
2. **Different credentials** for dev vs production
3. **Vercel needs env vars** in dashboard, not in code
4. **Strong secrets** - Use random 32+ character strings
5. **Test locally first** before deploying

---

**Your app is now secure!** 🔒

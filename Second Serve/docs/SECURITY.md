# 🔒 Security Guide

## Overview

This document outlines the security measures implemented in Second Serve and best practices for maintaining secure operations.

## 🛡️ Implemented Security Features

### 1. Environment Variables for Secrets

All sensitive credentials are stored in environment variables, not hardcoded:

- ✅ JWT secret tokens
- ✅ Admin credentials
- ✅ Database connection strings
- ✅ API keys (if any)

**Files:**
- `.env` - Contains actual secrets (NEVER commit to Git)
- `.env.example` - Template without actual values (safe to commit)

### 2. Password Security

- **Hashing:** All user passwords are hashed using bcrypt with salt rounds
- **No Plain Text:** Passwords are never stored or logged in plain text
- **Minimum Length:** 6 characters enforced (adjust in production)

**Implementation:**
```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```

### 3. JWT Token Authentication

- Tokens expire after session
- Signed with secret key from environment variables
- Verified on protected routes

**Protected Routes:**
- All `/api/admin/*` routes
- User-specific endpoints

### 4. Admin Authentication

- **Server-Side Validation:** Admin credentials verified via API, not client-side
- **No Exposed Credentials:** Admin passwords not stored in frontend code
- **Secure Login Flow:** Credentials sent via POST request to backend

### 5. Input Validation

- Email format validation
- Password length requirements
- Required field checks
- SQL injection prevention via parameterized queries

### 6. CORS Configuration

- Configured to allow necessary origins
- Can be restricted in production using environment variables

## ⚠️ Known Security Considerations

### 1. SQLite in Production

**Issue:** SQLite is suitable for development but has limitations for production:
- No built-in user authentication
- File-based (vulnerable if server is compromised)
- Limited concurrent write operations

**Recommendation:** Migrate to PostgreSQL for production (see [VERCEL_DATABASE_MIGRATION.md](../VERCEL_DATABASE_MIGRATION.md))

### 2. File Uploads

**Current:** Files uploaded via multer to local filesystem

**Considerations:**
- Vercel: Uploaded files are ephemeral (reset on deployment)
- No file type validation beyond basic checks
- No file size limits enforced

**Recommendation for Production:**
- Use cloud storage (AWS S3, Cloudinary, etc.)
- Implement file type validation
- Set file size limits
- Scan uploads for malware

### 3. Rate Limiting

**Current:** No rate limiting implemented

**Risk:** Vulnerable to:
- Brute force attacks on login
- API abuse
- DDoS attacks

**Recommendation:** Implement rate limiting:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. Session Management

**Current:** Simple localStorage-based admin sessions

**Limitations:**
- No server-side session validation
- No session expiration mechanism
- Vulnerable to XSS if session tokens are accessible

**Recommendation:**
- Implement server-side sessions with Redis
- Add session expiration
- Use httpOnly cookies for sensitive tokens

## 📋 Security Checklist

### Before Deployment

- [ ] All secrets moved to environment variables
- [ ] `.env` file is in `.gitignore`
- [ ] `.env` not committed to repository
- [ ] Strong JWT_SECRET (32+ random characters)
- [ ] Admin credentials changed from defaults
- [ ] Different credentials for dev vs production
- [ ] All dependencies up to date (`npm audit`)
- [ ] No console.log with sensitive data in production code
- [ ] HTTPS enabled (Vercel provides this automatically)

### After Deployment

- [ ] Verify no secrets exposed in frontend code
- [ ] Check browser developer tools / network tab
- [ ] Test admin login with wrong credentials (should fail)
- [ ] Verify JWT tokens are working
- [ ] Check CORS settings are appropriate
- [ ] Review Vercel environment variables
- [ ] Monitor logs for suspicious activity

## 🔐 Best Practices

### 1. Strong Passwords

Generate strong secrets using:

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32

# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 2. Regular Security Audits

```bash
# Check for vulnerable dependencies
npm audit

# Fix automatically if possible
npm audit fix

# For breaking changes
npm audit fix --force
```

### 3. Keep Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update to latest versions
npm install package@latest
```

### 4. Monitor Logs

Regularly check:
- Failed login attempts
- Unusual API activity
- Error patterns
- Performance issues

### 5. Backup Strategy

- Regular database exports
- Store backups securely (encrypted)
- Test restore procedures
- Keep multiple backup versions

## 🚨 Incident Response

### If API Key is Exposed

1. **Immediately:** Rotate the exposed key
   - Change in `.env` locally
   - Update in Vercel dashboard
   - Redeploy application

2. **Notify:** If it's a third-party API key, inform the provider

3. **Investigate:** Check logs to see if the key was used maliciously

4. **Prevent:** Review how the key was exposed and fix the root cause

### If Database is Compromised

1. **Immediate Actions:**
   - Take the application offline
   - Change all admin credentials
   - Reset JWT secret
   - Backup current database state (for forensics)

2. **Investigation:**
   - Review access logs
   - Identify compromise method
   - Assess data breach scope

3. **Recovery:**
   - Restore from clean backup
   - Patch security vulnerability
   - Redeploy with new credentials
   - Notify affected users if personal data was accessed

### If Admin Access is Compromised

1. **Immediately:**
   - Change ADMIN_USERNAME and ADMIN_SECRET_KEY
   - Update in Vercel dashboard
   - Redeploy application
   - Clear all admin sessions

2. **Audit:**
   - Review admin actions in logs
   - Check for unauthorized changes
   - Verify database integrity

3. **Prevention:**
   - Use stronger admin credentials
   - Enable 2FA (if implementing)
   - Limit admin access to trusted locations/IPs

## 🛠️ Implementing Additional Security

### 1. Add Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
// server.js
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});

app.use('/api/', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.'
});

app.use('/api/auth/login', authLimiter);
app.use('/api/admin/login', authLimiter);
```

### 2. Add Helmet for Security Headers

```bash
npm install helmet
```

```javascript
// server.js
const helmet = require('helmet');
app.use(helmet());
```

### 3. Implement HTTPS Redirect

```javascript
// In production, force HTTPS
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### 4. Add Input Sanitization

```bash
npm install express-validator
```

```javascript
const { body, validationResult } = require('express-validator');

router.post('/signup',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... rest of signup logic
  }
);
```

## 📚 Security Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### Tools
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Scan for vulnerabilities
- [Snyk](https://snyk.io/) - Continuous security scanning
- [OWASP ZAP](https://www.zaproxy.org/) - Security testing

### Learning
- [Web Security Academy](https://portswigger.net/web-security)
- [Hack The Box](https://www.hackthebox.eu/)
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)

## 📞 Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email security concerns to: [your-email@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We'll respond within 48 hours and work on a fix.

---

## ⚡ Quick Reference

### Rotate JWT Secret

1. Generate new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Update `.env` locally
3. Update Vercel environment variable
4. Redeploy: `vercel --prod`
5. All users will need to log in again

### Change Admin Credentials

1. Update `.env`:
   ```env
   ADMIN_USERNAME=newUsername
   ADMIN_SECRET_KEY=newSecretKey
   ```
2. Update Vercel environment variables
3. Redeploy application
4. Test admin login with new credentials

### Emergency Lockdown

If under attack:
1. Take app offline (stop Vercel deployment)
2. Investigate the issue
3. Fix vulnerability
4. Rotate all credentials
5. Redeploy with fixes

---

**Remember:** Security is an ongoing process, not a one-time setup. Stay vigilant!

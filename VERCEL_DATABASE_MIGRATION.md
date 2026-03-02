# 🚨 CRITICAL: Database Migration Required for Vercel Deployment

## ⚠️ The Problem

**SQLite DOES NOT work on Vercel** because:
- Vercel uses **serverless functions** with ephemeral (temporary) filesystems
- Your `database.db` file gets **deleted after each deployment**
- The filesystem is **read-only** in production
- This is why your app deploys but the database doesn't work

## ✅ Solution Options

You MUST migrate to a cloud database. Here are your best options:

---

### **Option 1: Vercel Postgres (RECOMMENDED - Easiest)**

✅ **Best for**: Quick deployment, integrated with Vercel
✅ **Free tier**: 256 MB storage, 60 hours compute/month
✅ **Setup time**: 5-10 minutes

#### Steps:
1. Go to your Vercel project dashboard
2. Click **Storage** tab → **Create Database** → **Postgres**
3. Follow the wizard to create database
4. Vercel automatically adds connection environment variables
5. Install PostgreSQL driver: `npm install pg`
6. Update `db.js` to use PostgreSQL (see code below)

---

### **Option 2: Supabase (FREE & POWERFUL)**

✅ **Best for**: Full-featured, generous free tier
✅ **Free tier**: 500 MB database, 2 GB file storage
✅ **Setup time**: 10 minutes

#### Steps:
1. Sign up at https://supabase.com
2. Create new project
3. Get connection string from Project Settings → Database
4. Add to Vercel environment variables
5. Install: `npm install pg`
6. Update `db.js` (see code below)

---

### **Option 3: Neon (Serverless PostgreSQL)**

✅ **Best for**: Serverless-native, auto-scaling
✅ **Free tier**: 0.5 GB storage, always-on
✅ **Setup time**: 10 minutes

#### Steps:
1. Sign up at https://neon.tech
2. Create database
3. Copy connection string
4. Add to Vercel environment variables
5. Install: `npm install pg`
6. Update `db.js` (see code below)

---

### **Option 4: MongoDB Atlas (NoSQL Alternative)**

✅ **Best for**: If you prefer NoSQL
✅ **Free tier**: 512 MB storage
✅ **Setup time**: 15 minutes

Requires more code changes (schema changes from SQL to NoSQL)

---

## 📝 Code Changes Required

### Step 1: Install PostgreSQL Driver

```bash
cd "Second Serve/src/server"
npm install pg
```

### Step 2: Update db.js

**Replace the entire db.js file with this PostgreSQL version:**

```javascript
const { Pool } = require('pg');

// Use environment variable for database connection
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.stack);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release();
  }
});

// Create tables
const initDatabase = async () => {
  console.log('📋 Checking database schema...');

  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        "fullName" TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('donor', 'ngo', 'admin')),
        "donorType" TEXT CHECK("donorType" IN ('individual', 'restaurant', 'hotel', 'event', 'other') OR "donorType" IS NULL),
        city TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT,
        pincode TEXT,
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table ready');

    // Food donations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS food_donations (
        id SERIAL PRIMARY KEY,
        donor_id INTEGER NOT NULL,
        "foodName" TEXT NOT NULL,
        quantity INTEGER NOT NULL CHECK(quantity > 0),
        unit TEXT NOT NULL CHECK(unit IN ('servings', 'kg', 'liters', 'plates', 'packets', 'containers', 'boxes')),
        vegetarian TEXT NOT NULL CHECK(vegetarian IN ('yes', 'no')),
        category TEXT NOT NULL CHECK(category IN ('cooked', 'raw', 'packaged', 'fruits', 'vegetables', 'bakery', 'other')),
        expiry TIMESTAMP NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        pincode TEXT NOT NULL,
        landmark TEXT,
        description TEXT,
        image TEXT,
        "contactPhone" TEXT NOT NULL,
        status TEXT DEFAULT 'available' CHECK(status IN ('available', 'claimed', 'completed', 'expired', 'cancelled')),
        claimed_by INTEGER,
        claimed_at TIMESTAMP,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (donor_id) REFERENCES users(id),
        FOREIGN KEY (claimed_by) REFERENCES users(id)
      )
    `);
    console.log('✅ Food donations table ready');

    // NGO profiles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ngo_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL,
        "ngoName" TEXT NOT NULL,
        registration_number TEXT UNIQUE NOT NULL,
        description TEXT,
        website TEXT,
        "serviceAreas" TEXT,
        verification_status TEXT DEFAULT 'pending' CHECK(verification_status IN ('pending', 'verified', 'rejected')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('✅ NGO profiles table ready');

    console.log('🎉 Database initialization complete!');
  } catch (err) {
    console.error('❌ Error initializing database:', err);
  }
};

// Initialize on startup
initDatabase();

// Export pool for queries
module.exports = pool;
```

### Step 3: Update Your Route Files

In all route files (auth.routes.js, food.routes.js, etc.), update query syntax:

**SQLite syntax:**
```javascript
db.run("INSERT INTO users...", [values], function(err) {
  const userId = this.lastID; // SQLite way
});

db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
  // row is the result
});
```

**PostgreSQL syntax:**
```javascript
const result = await pool.query("INSERT INTO users... RETURNING id", [values]);
const userId = result.rows[0].id; // PostgreSQL way

const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
const row = result.rows[0]; // First row
```

**Key differences:**
- Use `$1, $2, $3` instead of `?` for parameters
- Use `await pool.query()` instead of callbacks
- Results are in `result.rows` array
- Use `RETURNING id` to get inserted ID
- Use `SERIAL` instead of `AUTOINCREMENT`
- Use `TIMESTAMP` instead of `DATETIME`

---

## 🔧 Environment Variables Setup

### In Vercel Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add:
   ```
   DATABASE_URL = postgresql://username:password@host:5432/database
   NODE_ENV = production
   JWT_SECRET = your-secret-key
   ```

### For Local Development:
Create `.env` file in `Second Serve/src/server/`:
```env
DATABASE_URL=postgresql://localhost:5432/secondserve_dev
NODE_ENV=development
JWT_SECRET=your-local-secret
```

Install dotenv:
```bash
npm install dotenv
```

Add to top of server.js:
```javascript
require('dotenv').config();
```

---

## 🚀 Deployment Steps

1. **Choose a database provider** (Vercel Postgres, Supabase, or Neon)
2. **Get connection string** from provider
3. **Add DATABASE_URL** to Vercel environment variables
4. **Update db.js** to PostgreSQL version
5. **Update route files** to use PostgreSQL query syntax
6. **Test locally** with PostgreSQL
7. **Push to GitHub**
8. **Redeploy on Vercel**

---

## ❓ Which Option Should You Choose?

| Provider | Best For | Ease | Features |
|----------|----------|------|----------|
| **Vercel Postgres** | Simple integration | ⭐⭐⭐⭐⭐ | Basic |
| **Supabase** | Full features | ⭐⭐⭐⭐ | Auth, Storage, APIs |
| **Neon** | Serverless native | ⭐⭐⭐⭐ | Auto-scaling |
| **MongoDB Atlas** | NoSQL preference | ⭐⭐⭐ | NoSQL |

**My recommendation**: Start with **Vercel Postgres** for simplest integration, or **Supabase** for more features.

---

## 📚 Next Steps

1. Read this document carefully
2. Choose a database provider
3. Follow the setup steps for that provider
4. Update your code (I can help with this!)
5. Test and deploy

**Need help migrating the code?** Let me know which database you choose and I'll help you update all the route files!

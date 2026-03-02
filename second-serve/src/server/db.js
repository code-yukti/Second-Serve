const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.configure("busyTimeout", 5000);

db.serialize(() => {
  console.log("📋 Checking database schema...");

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('donor', 'ngo', 'admin')),
      donorType TEXT CHECK(donorType IN ('individual', 'restaurant', 'hotel', 'event', 'other') OR donorType IS NULL),
      city TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT,
      pincode TEXT,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("❌ Error creating users table:", err);
    else console.log("✅ Users table ready");
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS food_donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      donor_id INTEGER NOT NULL,
      foodName TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK(quantity > 0),
      unit TEXT NOT NULL CHECK(unit IN ('servings', 'kg', 'liters', 'plates', 'packets', 'containers', 'boxes')),
      vegetarian TEXT NOT NULL CHECK(vegetarian IN ('yes', 'no')),
      category TEXT NOT NULL CHECK(category IN ('cooked', 'raw', 'packaged', 'fruits', 'vegetables', 'bakery', 'other')),
      expiry DATETIME NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      pincode TEXT NOT NULL,
      landmark TEXT,
      description TEXT,
      image TEXT,
      contactPhone TEXT NOT NULL,
      status TEXT DEFAULT 'available' CHECK(status IN ('available', 'claimed', 'completed', 'expired', 'cancelled')),
      claimed_by INTEGER,
      claimed_at DATETIME,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(donor_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(claimed_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `, (err) => {
    if (err) console.error("❌ Error creating food_donations table:", err);
    else console.log("✅ Food donations table ready");
  });

  // Create indexes
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_city ON users(city)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_food_donor ON food_donations(donor_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_food_status ON food_donations(status)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_food_city ON food_donations(city)`);
});

// Enable error logging
db.on('error', (err) => {
  console.error("❌ Database error:", err);
});

module.exports = db;

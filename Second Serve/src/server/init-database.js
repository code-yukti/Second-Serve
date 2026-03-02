/**
 * Database Initialization Script
 * Creates tables and inserts test data for Second Serve
 */

const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const db = new sqlite3.Database("./database.db");

console.log("🗄️  Initializing Second Serve Database...\n");

db.serialize(async () => {
  
  // ============================================
  // CREATE TABLES
  // ============================================
  
  console.log("📋 Creating tables...");
  
  // 1. USERS TABLE
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
    else console.log("✅ Users table created");
  });

  // 2. FOOD DONATIONS TABLE
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
    else console.log("✅ Food donations table created");
  });

  // 3. CREATE INDEXES
  console.log("\n📊 Creating indexes...");
  
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_city ON users(city)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_food_donor ON food_donations(donor_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_food_status ON food_donations(status)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_food_city ON food_donations(city)`);
  
  console.log("✅ Indexes created");

  // ============================================
  // INSERT TEST DATA
  // ============================================
  
  console.log("\n📝 Inserting test data...\n");

  // Hash passwords for test users
  const password1 = await bcrypt.hash("donor123", 10);
  const password2 = await bcrypt.hash("ngo123", 10);
  const password3 = await bcrypt.hash("admin123", 10);
  const password4 = await bcrypt.hash("test123", 10);

  // Insert Test Users
  const users = [
    // Donors
    ["Rajesh Kumar", "rajesh@example.com", password1, "donor", "restaurant", "Delhi", "9876543210", "123 MG Road", "110001"],
    ["Priya Sharma", "priya@example.com", password1, "donor", "individual", "Mumbai", "9876543211", "456 Marine Drive", "400001"],
    ["Amit Patel", "amit@example.com", password4, "donor", "hotel", "Bangalore", "9876543212", "789 Brigade Road", "560001"],
    ["Sunita Singh", "sunita@example.com", password4, "donor", "event", "Pune", "9876543213", "321 FC Road", "411001"],
    
    // NGOs
    ["Food For All Foundation", "foodforall@ngo.com", password2, "ngo", null, "Delhi", "9876543220", "50 NGO Complex", "110002"],
    ["Hope Kitchen", "hope@ngo.com", password2, "ngo", null, "Mumbai", "9876543221", "75 Charity Lane", "400002"],
    ["Annapurna Trust", "annapurna@ngo.com", password4, "ngo", null, "Bangalore", "9876543222", "100 Service Road", "560002"],
    ["Feed India Mission", "feedindia@ngo.com", password4, "ngo", null, "Chennai", "9876543223", "200 Anna Nagar", "600001"],
    
    // Admin
    ["Admin User", "admin@secondserve.com", password3, "admin", null, "Delhi", "9876543299", "Second Serve HQ", "110001"]
  ];

  const userStmt = db.prepare(`
    INSERT INTO users (fullName, email, password, role, donorType, city, phone, address, pincode)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  users.forEach((user, index) => {
    userStmt.run(user, (err) => {
      if (err) console.error(`❌ Error inserting user ${index + 1}:`, err.message);
      else console.log(`✅ User created: ${user[0]} (${user[3]})`);
    });
  });

  userStmt.finalize(() => {
    console.log("\n🍲 Inserting sample food donations...\n");

    // Insert Sample Food Donations
    const donations = [
      // Available donations
      [1, "Vegetable Biryani", 50, "plates", "yes", "cooked", "2026-01-30 20:00:00", "123 MG Road", "Delhi", "110001", "Near Metro Station", "Fresh veg biryani from restaurant closing", "uploads/biryani.jpg", "9876543210", "available"],
      [1, "Paneer Butter Masala", 30, "plates", "yes", "cooked", "2026-01-30 19:00:00", "123 MG Road", "Delhi", "110001", "Near Metro Station", "Leftover from event", "uploads/paneer.jpg", "9876543210", "available"],
      [2, "Mixed Fruit Basket", 20, "kg", "yes", "fruits", "2026-02-05 10:00:00", "456 Marine Drive", "Mumbai", "400001", "Opposite Beach", "Fresh seasonal fruits", "uploads/fruits.jpg", "9876543211", "available"],
      [3, "Breakfast Items", 100, "packets", "yes", "packaged", "2026-02-10 08:00:00", "789 Brigade Road", "Bangalore", "560001", "Near Tech Park", "Packaged bread, buns, cookies", "uploads/breakfast.jpg", "9876543212", "available"],
      [4, "Wedding Leftovers", 200, "plates", "no", "cooked", "2026-01-29 23:00:00", "321 FC Road", "Pune", "411001", "Marriage Hall", "Mixed veg and non-veg items", "uploads/wedding.jpg", "9876543213", "available"],
      
      // Claimed donations
      [1, "Rice and Dal", 40, "kg", "yes", "cooked", "2026-01-29 18:00:00", "123 MG Road", "Delhi", "110001", "Restaurant", "Bulk rice and dal", "uploads/rice.jpg", "9876543210", "claimed", 5],
      [2, "Vegetable Curry", 25, "plates", "yes", "cooked", "2026-01-29 17:00:00", "456 Marine Drive", "Mumbai", "400001", "Home", "Homemade vegetable curry", "uploads/curry.jpg", "9876543211", "claimed", 6],
      
      // Completed donations
      [3, "Bread Packets", 50, "packets", "yes", "packaged", "2026-01-28 10:00:00", "789 Brigade Road", "Bangalore", "560001", "Bakery", "Unsold bread from bakery", "uploads/bread.jpg", "9876543212", "completed", 7],
      [2, "Fresh Vegetables", 30, "kg", "yes", "vegetables", "2026-01-27 15:00:00", "456 Marine Drive", "Mumbai", "400001", "Market", "Surplus vegetables", "uploads/vegetables.jpg", "9876543211", "completed", 6]
    ];

    const donationStmt = db.prepare(`
      INSERT INTO food_donations (
        donor_id, foodName, quantity, unit, vegetarian, category, expiry,
        address, city, pincode, landmark, description, image, contactPhone, status, claimed_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    donations.forEach((donation, index) => {
      donationStmt.run(donation, (err) => {
        if (err) console.error(`❌ Error inserting donation ${index + 1}:`, err.message);
        else console.log(`✅ Donation created: ${donation[1]} (${donation[14]})`);
      });
    });

    donationStmt.finalize(() => {
      console.log("\n" + "=".repeat(60));
      console.log("🎉 Database initialization completed successfully!");
      console.log("=".repeat(60));
      console.log("\n📝 TEST ACCOUNTS CREATED:\n");
      console.log("👤 DONOR ACCOUNT:");
      console.log("   Email: rajesh@example.com");
      console.log("   Password: donor123");
      console.log("   Role: Donor (Restaurant)\n");
      
      console.log("🏢 NGO ACCOUNT:");
      console.log("   Email: foodforall@ngo.com");
      console.log("   Password: ngo123");
      console.log("   Role: NGO\n");
      
      console.log("👑 ADMIN ACCOUNT:");
      console.log("   Email: admin@secondserve.com");
      console.log("   Password: admin123");
      console.log("   Role: Admin\n");
      
      console.log("📊 DATABASE SUMMARY:");
      db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        console.log(`   • Users: ${row.count}`);
      });
      db.get("SELECT COUNT(*) as count FROM food_donations", (err, row) => {
        console.log(`   • Food Donations: ${row.count}`);
      });
      db.get("SELECT COUNT(*) as count FROM food_donations WHERE status='available'", (err, row) => {
        console.log(`   • Available Donations: ${row.count}`);
        console.log("\n✅ You can now start testing the website!");
        console.log("🚀 Run: npm start\n");
        
        db.close();
      });
    });
  });
});

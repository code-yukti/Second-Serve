const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

// Admin Login - Secure authentication endpoint
router.post("/login", (req, res) => {
  const { username, secretKey } = req.body;

  if (!username || !secretKey) {
    return res.status(400).json({ 
      success: false, 
      message: "Username and secret key are required" 
    });
  }

  // Verify against environment variables
  const adminUsername = process.env.ADMIN_USERNAME || 'secondserveAdmin294';
  const adminSecretKey = process.env.ADMIN_SECRET_KEY || 'arunabha@294';

  if (username === adminUsername && secretKey === adminSecretKey) {
    console.log(`✅ Admin logged in successfully: ${username}`);
    return res.json({ 
      success: true, 
      message: "Authentication successful" 
    });
  } else {
    console.log(`❌ Failed admin login attempt: ${username}`);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid credentials" 
    });
  }
});

// Get all users
router.get("/users", (req, res) => {
  db.all("SELECT id, fullName, email, role, donorType, city, phone, status, created_at FROM users ORDER BY id", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get all food donations
router.get("/donations", (req, res) => {
  db.all(
    `SELECT 
      fd.id, fd.donor_id, fd.foodName, fd.quantity, fd.unit, 
      fd.vegetarian, fd.category, fd.expiry, fd.address, fd.city, 
      fd.pincode, fd.landmark, fd.description, fd.contactPhone, 
      fd.status, fd.claimed_by, fd.created_at,
      u.fullName as donor_name, u.email as donor_email, u.phone as donor_phone
    FROM food_donations fd
    LEFT JOIN users u ON fd.donor_id = u.id
    ORDER BY fd.id DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Get database statistics
router.get("/stats", (req, res) => {
  db.serialize(() => {
    let stats = {};
    
    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
      stats.totalUsers = row?.count || 0;
    });
    
    db.get("SELECT COUNT(*) as count FROM users WHERE role='donor'", (err, row) => {
      stats.totalDonors = row?.count || 0;
    });
    
    db.get("SELECT COUNT(*) as count FROM users WHERE role='ngo'", (err, row) => {
      stats.totalNGOs = row?.count || 0;
    });
    
    db.get("SELECT COUNT(*) as count FROM food_donations", (err, row) => {
      stats.totalDonations = row?.count || 0;
    });
    
    db.get("SELECT COUNT(*) as count FROM food_donations WHERE status='available'", (err, row) => {
      stats.availableDonations = row?.count || 0;
    });
    
    db.get("SELECT COUNT(*) as count FROM food_donations WHERE status='claimed'", (err, row) => {
      stats.claimedDonations = row?.count || 0;
    });
    
    db.get("SELECT COUNT(*) as count FROM food_donations WHERE status='completed'", (err, row) => {
      stats.completedDonations = row?.count || 0;
      res.json(stats);
    });
  });
});

// Delete user by ID
router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM users WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, message: "User deleted successfully", changes: this.changes });
  });
});

// Delete donation by ID
router.delete("/donations/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM food_donations WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Donation not found" });
    res.json({ success: true, message: "Donation deleted successfully", changes: this.changes });
  });
});

// Delete all donations
router.delete("/donations", (req, res) => {
  db.run("DELETE FROM food_donations", [], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: "All donations deleted successfully", changes: this.changes });
  });
});

module.exports = router;

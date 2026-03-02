const express = require("express");
const multer = require("multer");
const db = require("../db");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Helper function to format donation with imageUrl
const formatDonation = (donation) => ({
  ...donation,
  imageUrl: donation.image ? `/${donation.image}` : null,
});

// Get all featured donations (available for pickup)
router.get("/featured", (req, res) => {
  console.log("📍 Fetching featured donations...");
  db.all(
    `SELECT 
      fd.id, fd.donor_id, fd.foodName, fd.quantity, fd.unit,
      fd.vegetarian, fd.category, fd.expiry, fd.address, fd.city,
      fd.pincode, fd.landmark, fd.description, fd.image, fd.contactPhone,
      fd.status, fd.created_at,
      u.fullName as donor_name
    FROM food_donations fd
    LEFT JOIN users u ON fd.donor_id = u.id
    WHERE fd.status='available'
    ORDER BY fd.created_at DESC
    LIMIT 20`,
    [],
    (err, rows) => {
      if (err) {
        console.error("❌ Error fetching donations:", err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log(`✅ Found ${rows?.length || 0} featured donations`);
      
      const donations = (rows || []).map(row => ({
        ...row,
        imageUrl: row.image ? `/${row.image}` : null,
        categories: row.category ? row.category.split(',').map(c => c.trim()) : [],
        expiresAt: row.expiry,
        expiryTime: row.expiry
      }));
      
      res.json({ donations });
    }
  );
});

// Get nearby donations by coordinates
router.get("/nearby", (req, res) => {
  const { lat, lng, radius } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and longitude required" });
  }

  // Simple distance calculation (for production, use PostGIS)
  db.all(
    `SELECT 
      fd.id, fd.donor_id, fd.foodName, fd.quantity, fd.unit,
      fd.vegetarian, fd.category, fd.expiry, fd.address, fd.city,
      fd.pincode, fd.landmark, fd.description, fd.image, fd.contactPhone,
      fd.status, fd.created_at,
      u.fullName as donor_name
    FROM food_donations fd
    LEFT JOIN users u ON fd.donor_id = u.id
    WHERE fd.status='available'
    ORDER BY fd.created_at DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const donations = rows.map(row => ({
        ...row,
        imageUrl: row.image ? `/${row.image}` : null,
        categories: row.category ? row.category.split(',').map(c => c.trim()) : [],
        expiresAt: row.expiry,
        expiryTime: row.expiry
      }));
      
      res.json({ donations });
    }
  );
});

// Request pickup for a donation
router.post("/:id/request-pickup", auth, (req, res) => {
  const { id } = req.params;
  const ngoId = req.user.id;

  if (!ngoId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  db.run(
    "UPDATE food_donations SET status='claimed', claimed_by=? WHERE id=?",
    [ngoId, id],
    function(err) {
      if (err) {
        console.error("❌ Pickup request error:", err);
        return res.status(500).json({ message: "Failed to request pickup", error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: "Donation not found" });
      }

      console.log(`✅ Pickup requested for donation ${id} by NGO ${ngoId}`);
      res.json({ message: "Pickup request sent successfully" });
    }
  );
});

// Get dashboard statistics
router.get("/statistics/dashboard", (req, res) => {
  let stats = {};
  let completed = 0;
  
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    stats.totalUsers = row?.count || 0;
    completed++;
    if (completed === 7) return res.json(stats);
  });
  
  db.get("SELECT COUNT(*) as count FROM users WHERE role='donor'", (err, row) => {
    stats.totalDonors = row?.count || 0;
    completed++;
    if (completed === 7) return res.json(stats);
  });
  
  db.get("SELECT COUNT(*) as count FROM users WHERE role='ngo'", (err, row) => {
    stats.totalNGOs = row?.count || 0;
    completed++;
    if (completed === 7) return res.json(stats);
  });
  
  db.get("SELECT COUNT(*) as count FROM food_donations", (err, row) => {
    stats.totalDonations = row?.count || 0;
    completed++;
    if (completed === 7) return res.json(stats);
  });
  
  db.get("SELECT COUNT(*) as count FROM food_donations WHERE status='available'", (err, row) => {
    stats.availableDonations = row?.count || 0;
    completed++;
    if (completed === 7) return res.json(stats);
  });
  
  db.get("SELECT COUNT(*) as count FROM food_donations WHERE status='claimed'", (err, row) => {
    stats.claimedDonations = row?.count || 0;
    completed++;
    if (completed === 7) return res.json(stats);
  });
  
  db.get("SELECT COUNT(*) as count FROM food_donations WHERE status='completed'", (err, row) => {
    stats.completedDonations = row?.count || 0;
    completed++;
    if (completed === 7) return res.json(stats);
  });
});



router.post("/donate", auth, upload.single("foodImage"), async (req, res) => {
  try {
    const d = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "Food image is required" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const expiry = `${d.expiryDate} ${d.expiryTime}`;

    console.log(`📝 New donation from user ${req.user.id}: ${d.foodName}`);

    db.run(
      `INSERT INTO food_donations 
      (donor_id, foodName, quantity, unit, vegetarian, category, expiry,
       address, city, pincode, landmark, description, image, contactPhone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, d.foodName, d.quantity, d.unit,
        d.vegetarian, d.category, expiry,
        d.address, d.city, d.pincode,
        d.landmark, d.description,
        req.file.path, d.contactPhone
      ],
      function (err) {
        if (err) {
          console.error("❌ Donation error:", err);
          return res.status(500).json({ message: "Failed to post donation", error: err.message });
        }
        
        console.log(`✅ Donation posted successfully with ID: ${this.lastID}`);
        res.json({ 
          message: "Food posted successfully",
          donationId: this.lastID
        });
      }
    );
  } catch (error) {
    console.error("❌ Donation exception:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

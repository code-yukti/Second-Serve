const express = require("express");
const db = require("../db");
const router = express.Router();

// Get all NGOs
router.get("/", (req, res) => {
  const { search } = req.query;

  let query = "SELECT id, fullName, email, phone, city, address, pincode, created_at FROM users WHERE role='ngo'";
  let params = [];

  if (search) {
    query += " AND (fullName LIKE ? OR city LIKE ? OR address LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += " ORDER BY fullName ASC";

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("❌ Error fetching NGOs:", err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`✅ Found ${rows?.length || 0} NGOs`);
    res.json(rows);
  });
});

// Alias for /ngos/all
router.get("/all", (req, res) => {
  const { search } = req.query;

  let query = "SELECT id, fullName, email, phone, city, address, pincode, created_at FROM users WHERE role='ngo'";
  let params = [];

  if (search) {
    query += " AND (fullName LIKE ? OR city LIKE ? OR address LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += " ORDER BY fullName ASC";

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("❌ Error fetching NGOs:", err);
      return res.status(500).json({ error: err.message });
    }
    
    res.json(rows);
  });
});

// Get NGO by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get(
    "SELECT * FROM users WHERE role='ngo' AND id=?",
    [id],
    (err, row) => {
      if (err) {
        console.error("❌ Error fetching NGO:", err);
        return res.status(500).json({ error: err.message });
      }
      
      if (!row) {
        return res.status(404).json({ error: "NGO not found" });
      }

      res.json(row);
    }
  );
});

// Get nearby NGOs (by latitude/longitude)
router.get("/nearby", (req, res) => {
  const { lat, lng, radius } = req.query;

  db.all(
    "SELECT id, fullName, email, phone, city, address, pincode, created_at FROM users WHERE role='ngo' ORDER BY city ASC",
    [],
    (err, rows) => {
      if (err) {
        console.error("❌ Error fetching nearby NGOs:", err);
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});

// Get NGO's claimed donations
router.get("/:id/donations", (req, res) => {
  const { id } = req.params;

  db.all(
    `SELECT fd.* FROM food_donations fd
    WHERE fd.claimed_by=? AND fd.status IN ('claimed', 'completed')
    ORDER BY fd.claimed_at DESC`,
    [id],
    (err, rows) => {
      if (err) {
        console.error("❌ Error fetching NGO donations:", err);
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});

module.exports = router;

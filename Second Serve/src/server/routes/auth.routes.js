const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();

/* SIGNUP */
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, userType, donorType, city, phone } = req.body;

    // Validation
    if (!fullName || !email || !password || !userType || !city || !phone) {
      console.log("❌ Missing fields in signup");
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!['donor', 'ngo', 'admin'].includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashed = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (fullName, email, password, role, donorType, city, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fullName, email, hashed, userType, donorType || null, city, phone],
      function (err) {
        if (err) {
          console.error("Signup error:", err);
          if (err.message.includes("UNIQUE constraint failed")) {
            return res.status(400).json({ message: "Email already registered" });
          }
          return res.status(400).json({ message: err.message || "Signup failed" });
        }

        console.log(`✅ New user registered: ${email} (${userType})`);
        const token = jwt.sign({ id: this.lastID, role: userType }, process.env.JWT_SECRET || "SECOND_SERVE_SECRET");
        res.json({ 
          token,
          user: {
            id: this.lastID,
            email,
            fullName,
            role: userType
          },
          message: "Signup successful!"
        });
      }
    );
  } catch (error) {
    console.error("Signup exception:", error);
    res.status(500).json({ message: error.message });
  }
});

/* LOGIN */
router.post("/login", (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }

    db.get(
      `SELECT * FROM users WHERE email=? AND role=?`,
      [email, userType],
      async (err, user) => {
        if (err) {
          console.error("Login database error:", err);
          return res.status(500).json({ message: "Database error" });
        }

        if (!user) {
          console.log(`❌ Login failed: User not found - ${email} (${userType})`);
          return res.status(400).json({ message: "Invalid email or role" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          console.log(`❌ Login failed: Wrong password - ${email}`);
          return res.status(400).json({ message: "Wrong password" });
        }

        console.log(`✅ User logged in: ${email} (${userType})`);
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "SECOND_SERVE_SECRET");
        res.json({ 
          token,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
          },
          message: "Login successful!"
        });
      }
    );
  } catch (error) {
    console.error("Login exception:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

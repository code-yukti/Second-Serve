const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

require("./db");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const ngoRoutes = require("./routes/ngo.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Serve static frontend files
const frontendPath = path.join(__dirname, "../../public");
console.log("📁 Frontend path:", frontendPath);
console.log("📁 Frontend exists:", fs.existsSync(frontendPath));
if (fs.existsSync(frontendPath)) {
  console.log("📂 Files in frontend:", fs.readdirSync(frontendPath).slice(0, 5));
}

app.use(express.static(frontendPath, { 
  type: "text/html",
  maxAge: "1h"
}));

/* Health Check (used by test-connection.html) */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Second Serve backend is running",
    environment: process.env.VERCEL ? "production" : "development"
  });
});

/* Root route - serve index.html */
app.get("/", (req, res) => {
  const indexPath = path.join(frontendPath, "index.html");
  console.log("📄 Serving index.html from:", indexPath);
  console.log("📄 File exists:", fs.existsSync(indexPath));
  
  if (!fs.existsSync(indexPath)) {
    console.error("❌ index.html not found at:", indexPath);
    return res.status(404).send("<h1>Frontend not found</h1><p>index.html is missing from static directory</p>");
  }
  
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("❌ Error sending index.html:", err.message);
      res.status(500).send("Error loading homepage");
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/admin", adminRoutes);

/* 404 handler - serve index.html for SPA routing */
app.use((req, res) => {
  const indexPath = path.join(frontendPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ message: "Resource not found" });
  }
});

/* Error handling middleware */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message, err.stack);
  res.status(500).json({ 
    message: "Internal Server Error", 
    error: process.env.VERCEL ? "Check function logs" : err.message 
  });
});

// Export for Vercel serverless
module.exports = app;

// Start server only in local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Second Serve Backend running on http://localhost:${PORT}`);
    console.log(`📍 Frontend available at http://localhost:${PORT}`);
  });
}

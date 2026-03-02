const express = require("express");
const cors = require("cors");
const path = require("path");

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
app.use(express.static(frontendPath));

/* Health Check (used by test-connection.html) */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Second Serve backend is running",
  });
});

/* Root route - serve index.html */
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/admin", adminRoutes);

/* 404 handler - serve index.html for SPA routing */
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
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

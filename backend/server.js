const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load Environment Variables
dotenv.config();

// Database
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const workerRoutes = require("./routes/workerRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const statsRoutes = require("./routes/statsRoutes");
const workerDashboardRoutes = require("./routes/workerDashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aiRoutes = require("./routes/aiRoutes");

// NEW: Vernacular Voice-First Profile Assistant
const voiceProfileRoutes = require("./routes/voiceProfileRoutes");

const app = express();

// ====================
// Connect Database
// ====================
connectDB();

// ====================
// CORS Configuration
// ====================
const configuredOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "https://rozgaar-setu-frontend.onrender.com",
  ...configuredOrigins,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin is explicitly allowed or matches render domain / localhost
      const isAllowed =
        defaultAllowedOrigins.includes(origin) ||
        origin.endsWith(".onrender.com") ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);

      if (isAllowed) {
        return callback(null, true);
      }

      console.warn("CORS blocked request from origin:", origin);
      return callback(new Error("CORS Not Allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ====================
// Middleware
// ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====================
// Health Check Endpoint
// ====================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : mongoose.connection.readyState === 2
        ? "connecting"
        : "disconnected",
  });
});

// ====================
// Existing Routes
// ====================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/worker-dashboard", workerDashboardRoutes);
app.use("/api/admin", adminRoutes);

// ====================
// AI Routes
// ====================
// Existing Rozgaar Saathi AI
app.use("/api/ai", aiRoutes);

// New Vernacular Voice-First Profile Assistant (Vaani AI)
app.use("/api/ai-profile", voiceProfileRoutes);

// ====================
// Home Route
// ====================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rozgaar Setu Backend Running Successfully",
    version: "1.0.0",
  });
});

// ====================
// 404 Route
// ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// ====================
// Global Error Handler
// ====================
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message || err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ====================
// Start Server
// ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});

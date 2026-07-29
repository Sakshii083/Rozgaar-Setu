const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

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

const app = express();

// Connect Database
connectDB();

// ====================
// Middleware
// ====================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====================
// CORS Configuration
// ====================

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
  })
);

// ====================
// Routes
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
// Home Route
// ====================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Rozgaar Setu Backend Running Successfully",
  });
});

// ====================
// 404 Route (Express 5 Compatible)
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
  console.error(err);

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
  console.log(`🚀 Server Running on Port ${PORT}`);
});
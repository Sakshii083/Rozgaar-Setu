const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
console.log(process.env.MONGO_URI);

const connectDB = require("./config/db");
const workerRoutes = require("./routes/workerRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const app = express();
const dashboardRoutes = require("./routes/dashboardRoutes");
const statsRoutes = require("./routes/statsRoutes");
const workerDashboardRoutes = require("./routes/workerDashboardRoutes");

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/workers", workerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/worker-dashboard", workerDashboardRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Rozgaar Setu Backend is Running Successfully!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
app.use("/api/dashboard", dashboardRoutes);
});
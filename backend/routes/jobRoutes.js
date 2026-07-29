const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
} = require("../controllers/jobController");

// ==============================
// Public Routes
// ==============================

// Get all jobs
router.get("/", getJobs);

// Get single job
router.get("/:id", getJobById);

// ==============================
// Protected Routes
// ==============================

// Employer posts a new job
router.post("/", auth, createJob);

// Employer deletes own job
router.delete("/:id", auth, deleteJob);

module.exports = router;
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

// ==============================
// Public Routes
// ==============================

// Get all jobs (with query filters: ?skill=&city=&jobType=&search=)
router.get("/", getJobs);

// ==============================
// Protected Routes
// ==============================

// Employer gets their own jobs (must be declared BEFORE :id)
router.get("/my/posted", auth, getMyJobs);

// Get single job by ID
router.get("/:id", getJobById);

// Employer posts a new job
router.post("/", auth, createJob);

// Employer updates own job
router.put("/:id", auth, updateJob);

// Employer deletes own job
router.delete("/:id", auth, deleteJob);

module.exports = router;

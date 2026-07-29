const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  applyJob,
  getEmployerApplications,
  getWorkerApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

// ==============================
// Worker Routes
// ==============================

// Apply for a job
router.post("/apply", auth, applyJob);

// Get logged-in worker's applications
router.get("/my", auth, getWorkerApplications);

// ==============================
// Employer Routes
// ==============================

// Get all applications for employer
router.get("/", auth, getEmployerApplications);

// Accept / Reject application
router.put("/:id", auth, updateApplicationStatus);

module.exports = router;
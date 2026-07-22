const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  applyJob,
  getEmployerApplications,
  getWorkerApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

// Worker
router.post("/apply", auth, applyJob);

router.get("/my", auth, getWorkerApplications);

// Employer
router.get("/", auth, getEmployerApplications);

router.put("/:id", auth, updateApplicationStatus);

module.exports = router;
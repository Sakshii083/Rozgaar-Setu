const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  createJob,
  getJobs,
} = require("../controllers/jobController");

router.post("/", auth, createJob);

router.get("/", getJobs);

module.exports = router;
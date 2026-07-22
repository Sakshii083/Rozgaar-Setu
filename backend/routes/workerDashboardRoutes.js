const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getWorkerStats,
} = require("../controllers/workerDashboardController");

router.get("/", auth, getWorkerStats);

module.exports = router;
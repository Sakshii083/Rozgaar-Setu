const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getEmployerStats,
} = require("../controllers/dashboardController");

router.get("/employer", auth, getEmployerStats);

module.exports = router;
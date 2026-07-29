const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getAdminStats,
} = require("../controllers/adminController");

// Admin Dashboard
router.get("/stats", auth, getAdminStats);

module.exports = router;
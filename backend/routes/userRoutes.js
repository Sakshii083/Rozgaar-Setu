const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  getEmployers,
} = require("../controllers/userController");

// Public employer directory
router.get("/employers", getEmployers);

// Logged-in user profile
router.get("/profile", auth, getProfile);

// Update logged-in user profile
router.put("/profile", auth, updateProfile);

module.exports = router;
const express = require("express");

const router = express.Router();

const {
  parseJobProfile,
} = require("../controllers/aiController");

router.post("/parse", parseJobProfile);

module.exports = router;

const express = require("express");
const Worker = require("../models/Worker");

const router = express.Router();
router.get("/search", async (req, res) => {
  try {
    const { skill, city } = req.query;

    const query = {};

    if (skill && skill.trim()) {
      query.skill = {
        $regex: skill.trim(),
        $options: "i",
      };
    }

    if (city && city.trim()) {
      query.city = {
        $regex: city.trim(),
        $options: "i",
      };
    }

    const workers = await Worker.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    console.error("Worker Search Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search workers",
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const worker = await Worker.create(req.body);

    res.status(201).json({
      success: true,
      message: "Worker Registered Successfully!",
      worker,
    });
  } catch (error) {
    console.error("Worker Registration Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

module.exports = router;
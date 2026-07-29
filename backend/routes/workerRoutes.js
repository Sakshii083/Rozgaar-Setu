const express = require("express");
const Worker = require("../models/Worker");

const router = express.Router();

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
const express = require("express");
const Worker = require("../models/Worker");
const User = require("../models/User");

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { skill, city } = req.query;

    const workerQuery = {};
    const userQuery = { role: { $in: ["worker", "professional"] } };

    if (skill && skill.trim()) {
      const skillRegex = { $regex: skill.trim(), $options: "i" };
      workerQuery.skill = skillRegex;
      userQuery.$or = [
        { skill: skillRegex },
        { skills: skillRegex },
        { about: skillRegex },
      ];
    }

    if (city && city.trim()) {
      const cityRegex = { $regex: city.trim(), $options: "i" };
      workerQuery.city = cityRegex;
      userQuery.city = cityRegex;
    }

    // Query both collections
    const [workersFromCollection, usersAsWorkers] = await Promise.all([
      Worker.find(workerQuery).sort({ createdAt: -1 }).limit(50),
      User.find(userQuery).select("-password").sort({ createdAt: -1 }).limit(50),
    ]);

    // Format User records to match worker format
    const formattedUserWorkers = usersAsWorkers
      .filter((u) => u.skill || (u.skills && u.skills.length > 0))
      .map((u) => ({
        _id: u._id,
        fullName: u.name,
        phone: u.phone,
        email: u.email,
        skill: u.skill || u.skills?.[0] || "Worker",
        skills: u.skills || [],
        experience: u.experience ? `${u.experience} Years` : "Experienced",
        city: u.city || "Local",
        area: u.serviceAreas?.[0] || u.city || "Local Area",
        availability: u.available ? "Available Today" : "Unavailable",
        wage: u.dailyWage || 0,
        about: u.about || u.profileSummary || "",
      }));

    // Combine and sort by createdAt
    const allWorkers = [...workersFromCollection, ...formattedUserWorkers];

    res.status(200).json({
      success: true,
      count: allWorkers.length,
      workers: allWorkers,
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

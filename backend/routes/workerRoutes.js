const express = require("express");
const Worker = require("../models/Worker");
const User = require("../models/User");

const router = express.Router();

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/search", async (req, res) => {
  try {
    const rawSkill = req.query.skill ? String(req.query.skill).trim() : "";
    const rawCity = req.query.city ? String(req.query.city).trim() : "";

    // Ignore placeholder / wildcard values like "all"
    const skill = (rawSkill.toLowerCase() === "all" || rawSkill.toLowerCase() === "any trade") ? "" : rawSkill;
    const city = (rawCity.toLowerCase() === "all" || rawCity.toLowerCase() === "any city") ? "" : rawCity;

    let skillRegex = null;
    if (skill) {
      skillRegex = new RegExp(`(^|\\b)${escapeRegex(skill)}(\\b|$)`, "i");
    }

    let cityRegex = null;
    if (city) {
      let cityPattern = escapeRegex(city);
      if (city.toLowerCase() === "belagavi" || city.toLowerCase() === "belgaum") {
        cityPattern = "(?:Belagavi|Belgaum)";
      }
      cityRegex = new RegExp(`(^|\\b)${cityPattern}(\\b|$)`, "i");
    }

    // Build Worker collection query (must satisfy both skill and city conditions)
    const workerQuery = {};
    const workerAnd = [];

    if (skillRegex) {
      workerAnd.push({ skill: skillRegex });
    }

    if (cityRegex) {
      workerAnd.push({
        $or: [
          { city: cityRegex },
          { area: cityRegex },
        ],
      });
    }

    if (workerAnd.length > 0) {
      workerQuery.$and = workerAnd;
    }

    // Build User collection query for worker/professional roles
    const userQuery = { role: { $in: ["worker", "professional"] } };
    const userAnd = [];

    if (skillRegex) {
      userAnd.push({
        $or: [
          { skill: skillRegex },
          { skills: skillRegex },
        ],
      });
    }

    if (cityRegex) {
      userAnd.push({
        $or: [
          { city: cityRegex },
          { serviceAreas: cityRegex },
        ],
      });
    }

    if (userAnd.length > 0) {
      userQuery.$and = userAnd;
    }

    // Query both collections in parallel
    const [workersFromCollection, usersAsWorkers] = await Promise.all([
      Worker.find(workerQuery).sort({ createdAt: -1 }).limit(100),
      User.find(userQuery).select("-password").sort({ createdAt: -1 }).limit(100),
    ]);

    // Format User records into standard worker shape
    const formattedUserWorkers = usersAsWorkers
      .filter((u) => u.skill || (u.skills && u.skills.length > 0))
      .map((u) => ({
        _id: u._id,
        fullName: u.name,
        phone: u.phone,
        email: u.email,
        skill: u.skill || u.skills?.[0] || "Worker",
        skills: u.skills || (u.skill ? [u.skill] : []),
        experience: u.experience ? `${u.experience} Years` : "Experienced",
        city: u.city || "Local",
        area: u.serviceAreas?.[0] || u.city || "Local Area",
        serviceAreas: u.serviceAreas || (u.city ? [u.city] : []),
        availability: u.available ? "Available Today" : "Unavailable",
        wage: u.dailyWage || 0,
        about: u.about || u.profileSummary || "",
      }));

    // Combine collections
    const allWorkers = [...workersFromCollection, ...formattedUserWorkers];

    // Secondary strict filter in JavaScript to guarantee 100% precision on AND criteria
    const matchedWorkers = allWorkers.filter((w) => {
      if (skillRegex) {
        const workerSkill = w.skill || "";
        const workerSkills = Array.isArray(w.skills) ? w.skills : [];
        const matchesSkill =
          skillRegex.test(workerSkill) ||
          workerSkills.some((s) => skillRegex.test(s));
        if (!matchesSkill) return false;
      }

      if (cityRegex) {
        const workerCity = w.city || "";
        const workerArea = w.area || "";
        const workerServiceAreas = Array.isArray(w.serviceAreas) ? w.serviceAreas : [];
        const matchesCity =
          cityRegex.test(workerCity) ||
          cityRegex.test(workerArea) ||
          workerServiceAreas.some((a) => cityRegex.test(a));
        if (!matchesCity) return false;
      }

      return true;
    });

    res.status(200).json({
      success: true,
      count: matchedWorkers.length,
      workers: matchedWorkers,
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

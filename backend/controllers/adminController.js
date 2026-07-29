const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// ===============================
// Admin Dashboard Stats
// ===============================
const getAdminStats = async (req, res) => {
  try {
    const workers = await User.countDocuments({ role: "worker" });

    const employers = await User.countDocuments({
      role: "employer",
    });

    const jobs = await Job.countDocuments();

    const applications = await Application.countDocuments();

    res.status(200).json({
      workers,
      employers,
      jobs,
      applications,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getAdminStats,
};
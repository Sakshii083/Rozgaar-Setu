const User = require("../models/User");
const Job = require("../models/Job");

const getStats = async (req, res) => {
  try {
    const workers = await User.countDocuments({
      role: "worker",
    });

    const employers = await User.countDocuments({
      role: "employer",
    });

    const jobs = await Job.countDocuments();

    const cities = await Job.distinct("city");

    res.status(200).json({
      workers,
      employers,
      jobs,
      cities: cities.length,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getStats,
};
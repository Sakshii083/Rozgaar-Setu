const User = require("../models/User");
const Job = require("../models/Job");
const Worker = require("../models/Worker");

const getStats = async (req, res) => {
  try {
    const [workerUsers, standaloneWorkers, employers, jobs, jobCities, workerCities] =
      await Promise.all([
        User.countDocuments({ role: { $in: ["worker", "professional"] } }),
        Worker.countDocuments(),
        User.countDocuments({ role: "employer" }),
        Job.countDocuments(),
        Job.distinct("city"),
        Worker.distinct("city"),
      ]);

    const workers = workerUsers + standaloneWorkers;
    const allCities = new Set([...jobCities, ...workerCities].filter(Boolean));

    res.status(200).json({
      workers,
      employers,
      jobs,
      cities: allCities.size,
    });
  } catch (error) {
    console.error("Stats Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getStats,
};

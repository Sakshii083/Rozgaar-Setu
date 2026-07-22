const Application = require("../models/Application");
const Job = require("../models/Job");

const getWorkerStats = async (req, res) => {
  try {
    const workerId = req.user.id;

    const availableJobs = await Job.countDocuments();

    const applications = await Application.find({
      worker: workerId,
    });

    const accepted = applications.filter(
      (app) => app.status === "Accepted"
    ).length;

    const pending = applications.filter(
      (app) => app.status === "Pending"
    ).length;

    const rejected = applications.filter(
      (app) => app.status === "Rejected"
    ).length;

    res.status(200).json({
      availableJobs,
      applications: applications.length,
      accepted,
      pending,
      rejected,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  getWorkerStats,
};
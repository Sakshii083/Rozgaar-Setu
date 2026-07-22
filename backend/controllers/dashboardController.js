const Job = require("../models/Job");
const Application = require("../models/Application");

const getEmployerStats = async (req, res) => {
  try {
    const employerId = req.user.id;

    // Jobs posted by this employer
    const jobs = await Job.find({ employer: employerId });

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: { $in: jobIds },
    });

    const accepted = applications.filter(
      (app) => app.status === "Accepted"
    ).length;

    const rejected = applications.filter(
      (app) => app.status === "Rejected"
    ).length;

    res.json({
      jobsPosted: jobs.length,
      applications: applications.length,
      accepted,
      rejected,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getEmployerStats,
};
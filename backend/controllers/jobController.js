const Job = require("../models/Job");

// Create Job
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      skill,
      city,
      salary,
      jobType,
    } = req.body;

    const job = await Job.create({
      employer: req.user.id,
      title,
      description,
      skill,
      city,
      salary,
      jobType,
    });

    res.status(201).json({
      success: true,
      message: "Job Posted Successfully",
      job,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("employer", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createJob,
  getJobs,
};
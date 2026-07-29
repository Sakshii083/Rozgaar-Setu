const Job = require("../models/Job");

// ==============================
// Create Job
// ==============================
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

    // Validation
    if (
      !title ||
      !description ||
      !skill ||
      !city ||
      !salary ||
      !jobType
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

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
    console.error("Create Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Get All Jobs
// ==============================
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("employer", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });

  } catch (error) {
    console.error("Get Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Get Single Job
// ==============================
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("employer", "name email phone");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });

  } catch (error) {
    console.error("Get Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Delete Job
// ==============================
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job Deleted Successfully",
    });

  } catch (error) {
    console.error("Delete Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
};
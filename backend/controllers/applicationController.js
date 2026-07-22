const Application = require("../models/Application");
const Job = require("../models/Job");

// ==============================
// Apply for Job
// ==============================

const applyJob = async (req, res) => {
  try {
    const workerId = req.user.id;
    const { jobId } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const alreadyApplied = await Application.findOne({
      worker: workerId,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You have already applied for this job.",
      });
    }

    const application = await Application.create({
      worker: workerId,
      employer: job.postedBy,
      job: jobId,
      status: "Pending",
    });

    res.status(201).json({
      message: "Application submitted successfully.",
      application,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==============================
// Employer Applications
// ==============================

const getEmployerApplications = async (req, res) => {
  try {

    const employerId = req.user.id;

    const applications = await Application.find({
      employer: employerId,
    })
      .populate("worker")
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// ==============================
// Worker Applications
// ==============================

const getWorkerApplications = async (req, res) => {
  try {

    const workerId = req.user.id;

    const applications = await Application.find({
      worker: workerId,
    })
      .populate("job")
      .populate("employer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// ==============================
// Update Status
// ==============================

const updateApplicationStatus = async (req, res) => {

  try {

    const { id } = req.params;

    const { status } = req.body;

    const application = await Application.findById(id);

    if (!application) {

      return res.status(404).json({
        message: "Application not found",
      });

    }

    application.status = status;

    await application.save();

    res.status(200).json({
      message: "Application updated successfully.",
      application,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  applyJob,
  getEmployerApplications,
  getWorkerApplications,
  updateApplicationStatus,
};
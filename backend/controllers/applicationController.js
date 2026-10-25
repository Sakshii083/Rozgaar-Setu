const Application = require("../models/Application");
const Job = require("../models/Job");

// ==============================
// Apply for Job
// ==============================
const applyJob = async (req, res) => {
  try {
    const workerId = req.user.id;
    // Accept either jobId or { jobId } in request body
    const jobId = typeof req.body === "object" ? req.body.jobId : req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required.",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Workers cannot apply to their own posted jobs
    if (job.employer && job.employer.toString() === workerId) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own job listing.",
      });
    }

    const alreadyApplied = await Application.findOne({
      worker: workerId,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    const application = await Application.create({
      worker: workerId,
      employer: job.employer,
      job: jobId,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
    });

  } catch (error) {
    console.error("Apply Job Error:", error);

    res.status(500).json({
      success: false,
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

    // Retrieve all jobs posted by this employer
    const employerJobs = await Job.find({ employer: employerId }).select("_id");
    const jobIds = employerJobs.map((j) => j._id);

    // Find applications where employer is explicitly set or job matches
    const applications = await Application.find({
      $or: [
        { employer: employerId },
        { job: { $in: jobIds } },
      ],
    })
      .populate("worker", "name email phone city skill skills experience dailyWage about")
      .populate("job", "title city salary jobType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    console.error("Get Employer Applications Error:", error);

    res.status(500).json({
      success: false,
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
      .populate("job", "title city salary jobType skill description")
      .populate("employer", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    console.error("Get Worker Applications Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Update Status (Authorization check)
// ==============================
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be Pending, Accepted, or Rejected.",
      });
    }

    const application = await Application.findById(id).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Authorization check: User must be the employer who posted the job
    const isEmployer =
      (application.employer && application.employer.toString() === req.user.id) ||
      (application.job && application.job.employer && application.job.employer.toString() === req.user.id);

    if (!isEmployer && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only update applications for your own job postings.",
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Application updated successfully.",
      application,
    });

  } catch (error) {
    console.error("Update Application Status Error:", error);

    res.status(500).json({
      success: false,
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

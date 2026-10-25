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
      title: title.trim(),
      description: description.trim(),
      skill: skill.trim(),
      city: city.trim(),
      salary: Number(salary),
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
// Get All Jobs (with filtering)
// ==============================
const getJobs = async (req, res) => {
  try {
    const { skill, city, jobType, search } = req.query;
    const query = {};

    if (skill && skill.trim()) {
      query.skill = { $regex: skill.trim(), $options: "i" };
    }

    if (city && city.trim()) {
      query.city = { $regex: city.trim(), $options: "i" };
    }

    if (jobType && jobType.trim()) {
      query.jobType = jobType.trim();
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { skill: { $regex: search.trim(), $options: "i" } },
        { city: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const jobs = await Job.find(query)
      .populate("employer", "name email phone city")
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
      .populate("employer", "name email phone city");

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
// Get Employer's Own Jobs
// ==============================
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get My Jobs Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Update Job (Employer Only)
// ==============================
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.employer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You do not own this job listing.",
      });
    }

    const { title, description, skill, city, salary, jobType, status } = req.body;

    if (title) job.title = title.trim();
    if (description) job.description = description.trim();
    if (skill) job.skill = skill.trim();
    if (city) job.city = city.trim();
    if (salary !== undefined) job.salary = Number(salary);
    if (jobType) job.jobType = jobType;
    if (status) job.status = status;

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update Job Error:", error);
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

    if (job.employer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You cannot delete another employer's job.",
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
  getMyJobs,
  updateJob,
  deleteJob,
};

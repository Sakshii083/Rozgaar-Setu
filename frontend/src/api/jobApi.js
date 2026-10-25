import API from "./axios";

// Get all jobs (supports query parameters e.g. { skill, city, jobType, search })
export const getJobs = (params) => API.get("/jobs", { params });

// Get a single job by ID
export const getJobById = (id) => API.get(`/jobs/${id}`);

// Employer gets their own posted jobs
export const getMyJobs = () => API.get("/jobs/my/posted");

// Create a job
export const createJob = (data) => API.post("/jobs", data);

// Update a job
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);

// Delete a job
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// Apply for a job - ensures payload is always { jobId }
export const applyJob = (payload) => {
  const data = typeof payload === "object" ? payload : { jobId: payload };
  return API.post("/applications/apply", data);
};

// Calculate job matching score
export const calculateJobMatch = (job, requirements) => {
  if (!job || !requirements) {
    return 0;
  }

  let score = 0;
  let total = 0;

  const normalize = (value) =>
    String(value || "").toLowerCase().trim();

  const jobSkill = normalize(
    job.skill || job.category || job.title || job.jobTitle
  );

  const requestedSkill = normalize(
    requirements.skill || requirements.skills || requirements.jobTitle
  );

  if (requestedSkill) {
    total += 1;

    if (
      jobSkill.includes(requestedSkill) ||
      requestedSkill.includes(jobSkill)
    ) {
      score += 1;
    }
  }

  const jobLocation = normalize(
    job.location || job.city || job.address
  );

  const requestedLocation = normalize(
    requirements.location || requirements.city
  );

  if (requestedLocation) {
    total += 1;

    if (
      jobLocation.includes(requestedLocation) ||
      requestedLocation.includes(jobLocation)
    ) {
      score += 1;
    }
  }

  const jobSalary = Number(job.salary || 0);
  const requestedSalary = Number(
    String(requirements.salary || requirements.wage || requirements.budget || 0).replace(/[^\d.]/g, "")
  );

  if (requestedSalary > 0 && jobSalary > 0) {
    total += 1;

    if (jobSalary >= requestedSalary * 0.8) {
      score += 1;
    }
  }

  // If no comparable requirements were detected, return zero
  if (total === 0) {
    return 0;
  }

  return Math.round((score / total) * 100);
};

import API from "./axios";

// Get all jobs
export const getJobs = () => API.get("/jobs");

// Get a single job by ID
export const getJobById = (id) => API.get(`/jobs/${id}`);

// Create a job
export const createJob = (data) => API.post("/jobs", data);

// Delete a job
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// Apply for a job
export const applyJob = (jobId) =>
  API.post(`/applications/${jobId}`);

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
    requirements.salary || requirements.budget || 0
  );

  if (requestedSalary > 0 && jobSalary > 0) {
    total += 1;

    if (jobSalary >= requestedSalary) {
      score += 1;
    }
  }

  // If no comparable requirements were detected,
  // return zero instead of inventing a match.
  if (total === 0) {
    return 0;
  }

  return Math.round((score / total) * 100);
};
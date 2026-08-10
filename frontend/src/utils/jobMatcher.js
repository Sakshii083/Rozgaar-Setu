export const calculateJobMatch = (job, aiData) => {
  let score = 0;
  const reasons = [];

  // ==============================
  // Skill Match - 40 points
  // ==============================

  const jobSkill = String(job?.skill || "")
    .toLowerCase()
    .trim();

  const aiSkill = String(aiData?.skill || "")
    .toLowerCase()
    .trim();

  if (
    jobSkill &&
    aiSkill &&
    jobSkill === aiSkill
  ) {
    score += 40;
    reasons.push("Skill matches");
  }

  // ==============================
  // City Match - 30 points
  // ==============================

  const jobCity = String(job?.city || "")
    .toLowerCase()
    .trim();

  const aiCity = String(aiData?.city || "")
    .toLowerCase()
    .trim();

  if (
    jobCity &&
    aiCity &&
    jobCity === aiCity
  ) {
    score += 30;
    reasons.push("Location matches");
  }

  // ==============================
  // Wage Match - 20 points
  // ==============================

  const aiWage = parseInt(
    String(aiData?.wage || "").replace(/[^\d]/g, ""),
    10
  );

  const jobSalary = parseInt(
    String(job?.salary || "").replace(/[^\d]/g, ""),
    10
  );

  if (
    aiWage &&
    jobSalary &&
    jobSalary >= aiWage
  ) {
    score += 20;
    reasons.push("Wage matches");
  }

  // ==============================
  // Job Type Match - 10 points
  // ==============================

  const aiJobType = String(aiData?.jobType || "")
    .toLowerCase()
    .trim();

  const jobJobType = String(job?.jobType || "")
    .toLowerCase()
    .trim();

  if (
    aiJobType &&
    jobJobType &&
    aiJobType === jobJobType
  ) {
    score += 10;
    reasons.push("Job type matches");
  }

  // ==============================
  // Final Result
  // ==============================

  return {
    score,
    reasons,
  };
};
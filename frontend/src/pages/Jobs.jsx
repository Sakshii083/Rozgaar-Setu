import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getJobs } from "../api/jobApi";
import { applyJob, getWorkerApplications } from "../api/applicationApi";
import { useLanguage } from "../context/LanguageContext";

function Jobs() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [applyingJob, setApplyingJob] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");

  const skills = [
    "Plumber",
    "Electrician",
    "Painter",
    "Carpenter",
    "Mason",
    "Driver",
    "Tailor",
    "Cook",
    "Housekeeper",
    "Welder",
    "Mechanic",
  ];

  const cities = [
    "Pune",
    "Bengaluru",
    "Mumbai",
    "Hyderabad",
    "Belgaum",
    "Delhi",
    "Nagpur",
    "Nashik",
  ];

  const jobTypes = [
    "Daily Wage",
    "Part Time",
    "Full Time",
    "Contract",
  ];

  useEffect(() => {
    fetchJobs();
    checkExistingApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getJobs();
      setJobs(res.data.jobs || []);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingApplications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await getWorkerApplications();
      const apps = res.data.applications || [];
      const ids = new Set(apps.map((a) => (a.job?._id || a.job)));
      setAppliedJobIds(ids);
    } catch (err) {
      // Ignore if user is employer or unauthenticated
    }
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to apply for this job listing.");
      navigate("/login");
      return;
    }

    try {
      setApplyingJob(jobId);

      // Explicitly send object { jobId } conforming to backend contract
      await applyJob({ jobId });

      alert("✅ Application submitted successfully! The employer can now review your profile.");
      setAppliedJobIds((prev) => new Set([...prev, jobId]));
    } catch (error) {
      console.error("Application failed:", error);
      alert(
        error.response?.data?.message ||
          "Unable to submit application. Please verify you are logged in as a worker."
      );
    } finally {
      setApplyingJob(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSkill("");
    setSelectedCity("");
    setSelectedJobType("");
  };

  // Client-side filtering on loaded jobs
  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      job.title?.toLowerCase().includes(term) ||
      job.description?.toLowerCase().includes(term) ||
      job.skill?.toLowerCase().includes(term) ||
      job.city?.toLowerCase().includes(term);

    const matchesSkill =
      !selectedSkill ||
      job.skill?.toLowerCase() === selectedSkill.toLowerCase();

    const matchesCity =
      !selectedCity ||
      job.city?.toLowerCase() === selectedCity.toLowerCase();

    const matchesType =
      !selectedJobType || job.jobType === selectedJobType;

    return matchesSearch && matchesSkill && matchesCity && matchesType;
  });

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden flex flex-col bg-[#F7F9FC]">
      <Navbar />

      <main className="flex-1 min-h-0 flex flex-col p-2.5 sm:p-3.5 max-w-7xl mx-auto w-full md:overflow-hidden">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-2 border-b border-slate-200 shrink-0 gap-1">
          <div>
            <h1 className="text-base sm:text-lg font-black text-[#173B57]">
              💼 Browse Available Jobs
            </h1>
            <p className="text-[11px] text-slate-500">
              Explore verified local openings across trades. Apply directly with your worker profile.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-[#173B57]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#173B57]">
              {filteredJobs.length} of {jobs.length} Jobs
            </span>
            <span className="font-semibold text-[#0F9D8A] text-[11px]">● Live Openings</span>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-2.5 shadow-2xs mb-2.5 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 text-xs">
            {/* Keyword Search */}
            <input
              type="text"
              placeholder="Search keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0F9D8A] focus:bg-white"
            />

            {/* Skill Filter */}
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0F9D8A] focus:bg-white"
            >
              <option value="">All Skills</option>
              {skills.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0F9D8A] focus:bg-white"
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Job Type Filter */}
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0F9D8A] focus:bg-white"
            >
              <option value="">All Types</option>
              {jobTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Clear Filters Button */}
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200 col-span-2 sm:col-span-1"
            >
              ↻ Reset
            </button>
          </div>
        </div>

        {/* JOB LISTINGS */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {loading ? (
            <div className="py-16 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-3 border-slate-200 border-t-[#0F9D8A]"></div>
              <p className="mt-3 text-xs font-semibold text-slate-500">Loading active opportunities...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-xs">
              <div className="text-3xl">🔍</div>
              <h2 className="mt-2 text-sm font-bold text-slate-800">
                No Jobs Matching Your Criteria
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Try selecting different skills, cities, or clear your filters to view all openings.
              </p>
              <button
                onClick={clearFilters}
                className="mt-3 rounded-lg bg-[#173B57] px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job) => {
                const isAlreadyApplied = appliedJobIds.has(job._id);
                const isApplying = applyingJob === job._id;

                return (
                  <div
                    key={job._id}
                    className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs hover:border-[#0F9D8A] transition text-xs"
                  >
                    <div>
                      {/* Badge & Title */}
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="rounded-full bg-[#0F9D8A]/10 px-2 py-0.5 text-[10px] font-bold text-[#0F9D8A]">
                          {job.jobType || "Daily Wage"}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {job.skill || "General"}
                        </span>
                      </div>

                      <h2 className="mt-2 text-sm font-black text-[#173B57] line-clamp-1">
                        {job.title}
                      </h2>

                      <p className="mt-1 text-[11px] leading-snug text-slate-600 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Details Grid */}
                      <div className="mt-2.5 space-y-1 rounded-lg bg-[#F7F9FC] p-2 text-[11px] text-slate-700">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Location:</span>
                          <span className="font-semibold text-slate-800">📍 {job.city}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-400">Wage / Salary:</span>
                          <span className="font-bold text-[#0F9D8A]">₹{job.salary}</span>
                        </div>

                        {job.employer?.name && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Employer:</span>
                            <span className="font-medium text-slate-800">👤 {job.employer.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      {isAlreadyApplied ? (
                        <div className="rounded-lg bg-green-50 py-1.5 text-center text-xs font-bold text-green-700 border border-green-200">
                          ✓ Applied
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApply(job._id)}
                          disabled={isApplying}
                          className="w-full rounded-lg bg-[#173B57] py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-[#0f2638] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isApplying ? "Submitting..." : "✅ Apply Now"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Jobs;

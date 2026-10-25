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
    <div className="min-h-screen bg-[#F7F9FC]">
      <Navbar />

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="text-center">
            <span className="inline-block rounded-full bg-[#173B57]/10 px-4 py-1 text-xs font-bold text-[#173B57] uppercase">
              💼 Employment Opportunities
            </span>
            <h1 className="mt-3 text-3xl font-black text-[#173B57] sm:text-4xl">
              Browse Available Jobs
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Explore local openings across trades. Apply directly with your worker profile.
            </p>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {/* Keyword Search */}
              <input
                type="text"
                placeholder="Search by job title or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0F9D8A] focus:bg-white"
              />

              {/* Skill Filter */}
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0F9D8A] focus:bg-white"
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
                className="rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0F9D8A] focus:bg-white"
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
                className="rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0F9D8A] focus:bg-white"
              >
                <option value="">All Employment Types</option>
                {jobTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Clear Filters Button */}
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
              >
                ↻ Reset Filters
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Showing {filteredJobs.length} of {jobs.length} total jobs</span>
              {jobs.length > 0 && <span className="font-semibold text-[#0F9D8A]">● Real-time Listings</span>}
            </div>
          </div>

          {/* JOB LISTINGS */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F9D8A]"></div>
              <p className="mt-4 text-sm font-semibold text-slate-600">Loading active opportunities...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-[#E2E8F0] bg-white p-12 text-center shadow-sm">
              <div className="text-4xl">🔍</div>
              <h2 className="mt-3 text-lg font-bold text-slate-800">
                No Jobs Matching Your Criteria
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Try selecting different skills, cities, or clear your filters to view all openings.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 rounded-xl bg-[#173B57] px-5 py-2.5 text-xs font-bold text-white shadow-xs"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job) => {
                const isAlreadyApplied = appliedJobIds.has(job._id);
                const isApplying = applyingJob === job._id;

                return (
                  <div
                    key={job._id}
                    className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div>
                      {/* Badge & Title */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded-full bg-[#0F9D8A]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#0F9D8A]">
                          {job.jobType || "Daily Wage"}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {job.skill || "General"}
                        </span>
                      </div>

                      <h2 className="mt-3 text-lg font-black text-[#173B57]">
                        {job.title}
                      </h2>

                      <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
                        {job.description}
                      </p>

                      {/* Details Grid */}
                      <div className="mt-4 space-y-1.5 rounded-xl bg-[#F7F9FC] p-3 text-xs text-slate-700">
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
                    <div className="mt-6 pt-3 border-t border-slate-100">
                      {isAlreadyApplied ? (
                        <div className="rounded-xl bg-green-50 py-2.5 text-center text-xs font-bold text-green-700 border border-green-200">
                          ✓ Applied
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApply(job._id)}
                          disabled={isApplying}
                          className="w-full rounded-xl bg-[#173B57] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#0f2638] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isApplying ? "Submitting Application..." : "✅ Apply Now"}
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

      <Footer />
    </div>
  );
}

export default Jobs;

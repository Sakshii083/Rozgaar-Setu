import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import DashboardCharts from "../components/DashboardCharts";
import Loader from "../components/Loader";

import { getEmployerStats } from "../api/dashboardApi";
import { getMyJobs, deleteJob } from "../api/jobApi";
import { getEmployerApplications } from "../api/applicationApi";
import { useLanguage } from "../context/LanguageContext";

function EmployerDashboard() {
  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const user = getStoredUser();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [myJobs, setMyJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  const [stats, setStats] = useState({
    jobsPosted: 0,
    applications: 0,
    accepted: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes, appsRes] = await Promise.all([
        getEmployerStats(),
        getMyJobs(),
        getEmployerApplications(),
      ]);

      if (statsRes.data) {
        setStats(statsRes.data);
      }

      setMyJobs(jobsRes.data.jobs || []);
      const apps = appsRes.data.applications || [];
      setRecentApplications(apps.slice(0, 5));
    } catch (error) {
      console.error("Employer Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) {
      return;
    }

    try {
      await deleteJob(jobId);
      alert("Job deleted successfully.");
      fetchDashboardData();
    } catch (error) {
      console.error("Delete job error:", error);
      alert(error.response?.data?.message || "Failed to delete job.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  const successRate =
    stats.applications > 0
      ? Math.round((stats.accepted / stats.applications) * 100)
      : 0;

  return (
    <DashboardLayout>
      {/* HEADER BANNER */}
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-[#173B57] via-[#1c4769] to-[#0F9D8A] p-6 text-white shadow-lg sm:p-8">
        <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-[#F4B942]">
          Employer Portal
        </span>

        <h1 className="mt-2 text-2xl font-black sm:text-3xl">
          {t("employerDashboard.welcome") || "Welcome back"},{" "}
          {user?.name || "Employer"} 👋
        </h1>

        <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-200">
          {t("employerDashboard.welcomeDescription") ||
            "Manage your job postings, review applicant profiles, and connect directly with local skilled workers."}
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link
            to="/post-job"
            className="rounded-xl bg-[#F4B942] px-4 py-2.5 text-xs font-bold text-[#202938] shadow-sm transition hover:bg-[#dca029]"
          >
            ➕ Post New Job
          </Link>

          <Link
            to="/applications"
            className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#173B57] shadow-sm transition hover:bg-slate-100"
          >
            📋 Manage Applications ({stats.applications})
          </Link>

          <Link
            to="/workers"
            className="rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20"
          >
            👷 Discover Workers
          </Link>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title={t("employerDashboard.jobsPosted") || "Jobs Posted"}
          value={stats.jobsPosted}
          icon="💼"
          color="text-[#173B57]"
        />

        <DashboardCard
          title={t("employerDashboard.applications") || "Total Applicants"}
          value={stats.applications}
          icon="📄"
          color="text-[#0F9D8A]"
        />

        <DashboardCard
          title={t("employerDashboard.accepted") || "Accepted Hires"}
          value={stats.accepted}
          icon="✅"
          color="text-green-600"
        />

        <DashboardCard
          title={t("employerDashboard.rejected") || "Rejected"}
          value={stats.rejected}
          icon="❌"
          color="text-red-600"
        />
      </div>

      {/* HIRING OVERVIEW & RECENT APPLICANTS */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* RECENT APPLICATIONS */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#173B57]">
                Recent Job Applicants
              </h2>
              <p className="text-xs text-slate-500">Workers who applied for your listings</p>
            </div>
            <Link to="/applications" className="text-xs font-bold text-[#0F9D8A] hover:underline">
              View All Applications →
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <div className="text-3xl">📭</div>
              <p className="mt-2 text-xs">No applications received yet for your posted jobs.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app._id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-[#F7F9FC] p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      👤 {app.worker?.name || "Applicant"}
                    </h3>
                    <p className="text-xs font-semibold text-[#0F9D8A]">
                      Applied for: {app.job?.title || "Job"}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-slate-500">
                      <span>📍 {app.worker?.city || "Local"}</span>
                      {app.worker?.phone && <span>📞 {app.worker.phone}</span>}
                      {app.worker?.experience && <span>⏳ {app.worker.experience} yrs exp</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        app.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : app.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {app.status}
                    </span>

                    <Link
                      to="/applications"
                      className="rounded-lg bg-[#173B57] px-3 py-1 text-xs font-bold text-white"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK METRICS */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#173B57] mb-1">
              📊 Hiring Summary
            </h2>
            <p className="text-xs text-slate-500 mb-4">Acceptance conversion rate</p>

            <div className="rounded-2xl bg-[#F7F9FC] p-5 text-center">
              <span className="text-3xl font-black text-[#0F9D8A]">
                {successRate}%
              </span>
              <p className="mt-1 text-xs font-bold text-slate-700">
                Application Acceptance Rate
              </p>
              <p className="mt-2 text-[11px] text-slate-500">
                {stats.accepted} accepted of {stats.applications} total applicants
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <Link
              to="/post-job"
              className="block w-full rounded-xl bg-[#173B57] py-2.5 text-center text-xs font-bold text-white transition hover:bg-[#0f2638]"
            >
              ➕ Post Another Job
            </Link>
            <Link
              to="/workers"
              className="block w-full rounded-xl border border-[#0F9D8A] py-2 text-center text-xs font-bold text-[#0F9D8A] transition hover:bg-[#0F9D8A]/10"
            >
              👷 Search Worker Directory
            </Link>
          </div>
        </div>
      </div>

      {/* MY POSTED JOBS MANAGEMENT */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#173B57]">
              My Active Job Postings ({myJobs.length})
            </h2>
            <p className="text-xs text-slate-500">Manage listings or remove filled positions</p>
          </div>

          <Link
            to="/post-job"
            className="rounded-xl bg-[#0F9D8A] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0b7c6d]"
          >
            ➕ Post New Job
          </Link>
        </div>

        {myJobs.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            <div className="text-3xl">💼</div>
            <p className="mt-2 text-xs">You have not posted any job listings yet.</p>
            <Link
              to="/post-job"
              className="mt-3 inline-block rounded-xl bg-[#173B57] px-4 py-2 text-xs font-bold text-white"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myJobs.map((job) => (
              <div
                key={job._id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-[#F7F9FC] p-4 text-xs"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="rounded-full bg-[#0F9D8A]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#0F9D8A]">
                      {job.jobType || "Daily Wage"}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {job.skill}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-slate-900">
                    {job.title}
                  </h3>

                  <p className="mt-1 text-slate-600 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="mt-3 space-y-1 text-slate-700 font-medium">
                    <p>📍 Location: {job.city}</p>
                    <p>💰 Wage: ₹{job.salary}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 pt-3 border-t border-slate-200">
                  <Link
                    to="/applications"
                    className="flex-1 rounded-lg bg-[#173B57] py-1.5 text-center font-bold text-white hover:bg-[#0f2638]"
                  >
                    Applicants
                  </Link>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 font-bold text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default EmployerDashboard;

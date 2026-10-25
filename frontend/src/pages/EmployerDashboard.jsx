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
      <div className="mb-3.5 rounded-2xl bg-gradient-to-r from-[#173B57] via-[#1c4769] to-[#0F9D8A] p-4 text-white shadow-md">
        <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#F4B942]">
          Employer Portal
        </span>

        <h1 className="mt-1 text-lg font-black sm:text-xl">
          {t("employerDashboard.welcome") || "Welcome back"},{" "}
          {user?.name || "Employer"} 👋
        </h1>

        <p className="mt-0.5 max-w-xl text-xs text-slate-200">
          {t("employerDashboard.welcomeDescription") ||
            "Manage your job postings, review applicant profiles, and connect directly with local skilled workers."}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            to="/post-job"
            className="rounded-lg bg-[#F4B942] px-3 py-1.5 text-xs font-bold text-[#202938] shadow-2xs transition hover:bg-[#dca029]"
          >
            ➕ Post New Job
          </Link>

          <Link
            to="/applications"
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#173B57] shadow-2xs transition hover:bg-slate-100"
          >
            📋 Applications ({stats.applications})
          </Link>

          <Link
            to="/workers"
            className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20"
          >
            👷 Workers Directory
          </Link>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="mb-3.5 grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-4">
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
      <div className="mb-3.5 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* RECENT APPLICATIONS */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs lg:col-span-2">
          <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-sm font-bold text-[#173B57]">
                Recent Job Applicants
              </h2>
              <p className="text-[11px] text-slate-500">Workers who applied for your listings</p>
            </div>
            <Link to="/applications" className="text-xs font-bold text-[#0F9D8A] hover:underline">
              View All →
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="py-6 text-center text-slate-500">
              <div className="text-2xl">📭</div>
              <p className="mt-1 text-xs">No applications received yet for your posted jobs.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentApplications.map((app) => (
                <div
                  key={app._id}
                  className="flex flex-col justify-between gap-2 rounded-lg border border-slate-200 bg-[#F7F9FC] p-2.5 sm:flex-row sm:items-center text-xs"
                >
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      👤 {app.worker?.name || "Applicant"}
                    </h3>
                    <p className="text-[11px] font-semibold text-[#0F9D8A]">
                      Applied for: {app.job?.title || "Job"}
                    </p>
                    <div className="mt-0.5 flex flex-wrap gap-x-3 text-[10px] text-slate-500">
                      <span>📍 {app.worker?.city || "Local"}</span>
                      {app.worker?.phone && <span>📞 {app.worker.phone}</span>}
                      {app.worker?.experience && <span>⏳ {app.worker.experience} yrs exp</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
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
                      className="rounded-lg bg-[#173B57] px-2.5 py-1 text-[11px] font-bold text-white"
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
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#173B57] mb-0.5">
              📊 Hiring Summary
            </h2>
            <p className="text-[11px] text-slate-500 mb-2.5">Acceptance conversion rate</p>

            <div className="rounded-xl bg-[#F7F9FC] p-3 text-center">
              <span className="text-2xl font-black text-[#0F9D8A]">
                {successRate}%
              </span>
              <p className="mt-0.5 text-xs font-bold text-slate-700">
                Application Acceptance Rate
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                {stats.accepted} accepted of {stats.applications} total applicants
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
            <Link
              to="/post-job"
              className="block w-full rounded-lg bg-[#173B57] py-1.5 text-center text-xs font-bold text-white transition hover:bg-[#0f2638]"
            >
              ➕ Post Another Job
            </Link>
            <Link
              to="/workers"
              className="block w-full rounded-lg border border-[#0F9D8A] py-1.5 text-center text-xs font-bold text-[#0F9D8A] transition hover:bg-[#0F9D8A]/10"
            >
              👷 Search Workers
            </Link>
          </div>
        </div>
      </div>

      {/* MY POSTED JOBS MANAGEMENT */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs">
        <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-bold text-[#173B57]">
              My Active Job Postings ({myJobs.length})
            </h2>
            <p className="text-[11px] text-slate-500">Manage listings or remove filled positions</p>
          </div>

          <Link
            to="/post-job"
            className="rounded-lg bg-[#0F9D8A] px-3 py-1 text-xs font-bold text-white transition hover:bg-[#0b7c6d]"
          >
            ➕ Post Job
          </Link>
        </div>

        {myJobs.length === 0 ? (
          <div className="py-6 text-center text-slate-500">
            <div className="text-2xl">💼</div>
            <p className="mt-1 text-xs">You have not posted any job listings yet.</p>
            <Link
              to="/post-job"
              className="mt-2 inline-block rounded-lg bg-[#173B57] px-3 py-1.5 text-xs font-bold text-white"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
            {myJobs.map((job) => (
              <div
                key={job._id}
                className="flex flex-col justify-between rounded-lg border border-slate-200 bg-[#F7F9FC] p-3 text-xs"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="rounded-full bg-[#0F9D8A]/10 px-2 py-0.5 text-[10px] font-bold text-[#0F9D8A]">
                      {job.jobType || "Daily Wage"}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {job.skill}
                    </span>
                  </div>

                  <h3 className="mt-1.5 text-xs font-bold text-slate-900 line-clamp-1">
                    {job.title}
                  </h3>

                  <p className="mt-0.5 text-slate-600 line-clamp-2 text-[11px]">
                    {job.description}
                  </p>

                  <div className="mt-2 space-y-0.5 text-slate-700 font-medium text-[11px]">
                    <p>📍 Location: {job.city}</p>
                    <p>💰 Wage: ₹{job.salary}</p>
                  </div>
                </div>

                <div className="mt-2.5 flex gap-1.5 pt-2 border-t border-slate-200">
                  <Link
                    to="/applications"
                    className="flex-1 rounded-lg bg-[#173B57] py-1 text-center font-bold text-white hover:bg-[#0f2638] text-[11px]"
                  >
                    Applicants
                  </Link>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 font-bold text-red-600 hover:bg-red-100 text-[11px]"
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

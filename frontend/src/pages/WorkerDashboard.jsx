import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import DashboardCharts from "../components/DashboardCharts";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import JobCard from "../components/JobCard";

import { getJobs } from "../api/jobApi";
import { getWorkerStats } from "../api/workerDashboardApi";
import { getWorkerApplications } from "../api/applicationApi";
import { useLanguage } from "../context/LanguageContext";

function WorkerDashboard() {
  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return null;
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && typeof parsedUser === "object" && !Array.isArray(parsedUser)) {
        return parsedUser;
      }
      return null;
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      return null;
    }
  };

  const user = getStoredUser();
  const { t } = useLanguage();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({
    availableJobs: 0,
    applications: 0,
    accepted: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, statsRes, applicationsRes] = await Promise.all([
        getJobs(),
        getWorkerStats(),
        getWorkerApplications(),
      ]);

      setJobs(jobsRes.data.jobs || []);
      if (statsRes.data) {
        setStats({
          availableJobs: statsRes.data.availableJobs || 0,
          applications: statsRes.data.applications || 0,
          accepted: statsRes.data.accepted || 0,
          pending: statsRes.data.pending || 0,
          rejected: statsRes.data.rejected || 0,
        });
      }

      const apps = applicationsRes.data.applications || applicationsRes.data || [];
      setApplications(Array.isArray(apps) ? apps : []);
    } catch (error) {
      console.error("Worker Dashboard Data Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.city?.toLowerCase().includes(search.toLowerCase()) ||
      job.skill?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* WELCOME BANNER */}
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-[#173B57] via-[#1c4769] to-[#0F9D8A] p-6 text-white shadow-lg sm:p-8">
        <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-[#F4B942]">
          Worker Workspace
        </span>

        <h1 className="mt-2 text-2xl font-black sm:text-3xl">
          {t("workerDashboard.welcome") || "Welcome back"},{" "}
          {user?.name || "Worker"} 👋
        </h1>

        <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-200">
          {t("workerDashboard.welcomeDescription") ||
            "Discover matching local jobs, manage your applications, and keep your trade profile up to date."}
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link
            to="/edit-profile"
            className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#173B57] shadow-sm transition hover:bg-slate-100"
          >
            👤 {t("workerDashboard.editProfile") || "Edit Profile"}
          </Link>

          <Link
            to="/voice-profile"
            className="rounded-xl bg-[#F4B942] px-4 py-2.5 text-xs font-bold text-[#202938] shadow-sm transition hover:bg-[#dca029]"
          >
            🎙️ Update Profile with Vaani AI
          </Link>

          <Link
            to="/jobs"
            className="rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20"
          >
            💼 Browse All Jobs
          </Link>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title={t("workerDashboard.availableJobs") || "Available Jobs"}
          value={stats.availableJobs}
          icon="💼"
          color="text-[#173B57]"
        />

        <DashboardCard
          title={t("workerDashboard.applications") || "Applications"}
          value={stats.applications}
          icon="📄"
          color="text-[#0F9D8A]"
        />

        <DashboardCard
          title={t("workerDashboard.accepted") || "Accepted"}
          value={stats.accepted}
          icon="✅"
          color="text-green-600"
        />

        <DashboardCard
          title={t("workerDashboard.pending") || "Pending"}
          value={stats.pending}
          icon="⏳"
          color="text-[#F4B942]"
        />
      </div>

      {/* PROFILE SUMMARY CARD */}
      <div className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-[#173B57]">
            {t("workerDashboard.myProfile") || "My Profile Overview"}
          </h2>
          <Link
            to="/edit-profile"
            className="text-xs font-bold text-[#0F9D8A] hover:underline"
          >
            Edit Profile →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          <div className="rounded-xl bg-[#F7F9FC] p-3">
            <span className="text-slate-400 block">Primary Trade:</span>
            <span className="font-bold text-slate-800 text-sm">{user?.skill || "Not added"}</span>
          </div>

          <div className="rounded-xl bg-[#F7F9FC] p-3">
            <span className="text-slate-400 block">City:</span>
            <span className="font-bold text-slate-800 text-sm">📍 {user?.city || "Not added"}</span>
          </div>

          <div className="rounded-xl bg-[#F7F9FC] p-3">
            <span className="text-slate-400 block">Experience:</span>
            <span className="font-bold text-slate-800 text-sm">
              {user?.experience ? `${user.experience} Years` : "Not added"}
            </span>
          </div>

          <div className="rounded-xl bg-[#F7F9FC] p-3">
            <span className="text-slate-400 block">Expected Daily Wage:</span>
            <span className="font-bold text-[#0F9D8A] text-sm">
              ₹{user?.dailyWage || "0"}/day
            </span>
          </div>

          <div className="rounded-xl bg-[#F7F9FC] p-3">
            <span className="text-slate-400 block">Phone:</span>
            <span className="font-bold text-slate-800 text-sm">📞 {user?.phone || "Not added"}</span>
          </div>

          <div className="rounded-xl bg-[#F7F9FC] p-3">
            <span className="text-slate-400 block">Status:</span>
            <span className="font-bold text-green-700 text-sm">
              {user?.available !== false ? "● Available for Work" : "○ Not Available"}
            </span>
          </div>

          {user?.about && (
            <div className="sm:col-span-2 lg:col-span-3 rounded-xl bg-[#F7F9FC] p-3">
              <span className="text-slate-400 block mb-0.5">About Me:</span>
              <p className="text-slate-700">{user.about}</p>
            </div>
          )}
        </div>
      </div>

      {/* MY APPLICATIONS SECTION */}
      <div className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-[#173B57]">
            {t("workerDashboard.myApplications") || "My Applications"} ({applications.length})
          </h2>
          <Link to="/applications" className="text-xs font-bold text-[#0F9D8A] hover:underline">
            View All →
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            <div className="text-3xl">📭</div>
            <p className="mt-2 text-xs">
              {t("workerDashboard.noApplications") || "You haven't applied for any jobs yet."}
            </p>
            <Link
              to="/jobs"
              className="mt-3 inline-block rounded-xl bg-[#173B57] px-4 py-2 text-xs font-bold text-white"
            >
              Browse Open Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => (
              <div
                key={app._id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-[#F7F9FC] p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {app.job?.title || "Job Listing"}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>📍 {app.job?.city || "Local"}</span>
                    <span>💰 ₹{app.job?.salary || "N/A"}</span>
                    {app.employer?.name && <span>👤 Employer: {app.employer.name}</span>}
                  </div>
                </div>

                <div>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                      app.status === "Accepted"
                        ? "bg-green-100 text-green-800"
                        : app.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {app.status === "Accepted"
                      ? "✓ Accepted"
                      : app.status === "Rejected"
                      ? "✕ Rejected"
                      : "⏳ Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AVAILABLE JOBS SECTION */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-[#173B57]">
            {t("workerDashboard.availableJobs") || "Recent Job Opportunities"}
          </h2>

          <div className="w-full sm:w-64">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by title, trade, city..."
            />
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <div className="text-3xl">🔍</div>
            <p className="mt-2 text-xs">
              {t("workerDashboard.noMatchingJobs") || "No matching jobs found."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredJobs.slice(0, 6).map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default WorkerDashboard;

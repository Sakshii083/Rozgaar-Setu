import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import DashboardCharts from "../components/DashboardCharts";
import Loader from "../components/Loader";

import { getEmployerStats } from "../api/dashboardApi";
import { useLanguage } from "../context/LanguageContext";

function EmployerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    jobsPosted: 0,
    applications: 0,
    accepted: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getEmployerStats();
      setStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  const successRate =
    stats.applications > 0
      ? Math.round(
          (stats.accepted / stats.applications) * 100
        )
      : 0;

  return (
    <DashboardLayout>

      {/* COMPACT HEADER */}

      <div className="mb-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-4 text-white shadow">

        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

          <div>
            <h1 className="text-2xl font-bold">
              {t("employerDashboard.welcome")},{" "}
              {user?.name} 👋
            </h1>

            <p className="mt-1 text-sm text-blue-100">
              {t("employerDashboard.welcomeDescription")}
            </p>
          </div>

          <div className="flex gap-2">

            <Link
              to="/post-job"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-gray-100"
            >
              ➕ {t("employerDashboard.postNewJob")}
            </Link>

            <Link
              to="/applications"
              className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold hover:bg-blue-900"
            >
              📋 {t("employerDashboard.viewApplications")}
            </Link>

          </div>

        </div>

      </div>

      {/* LIVE STATS */}

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">

        <DashboardCard
          title={t("employerDashboard.jobsPosted")}
          value={stats.jobsPosted}
          icon="💼"
          color="text-blue-600"
        />

        <DashboardCard
          title={t("employerDashboard.applications")}
          value={stats.applications}
          icon="📄"
          color="text-green-600"
        />

        <DashboardCard
          title={t("employerDashboard.accepted")}
          value={stats.accepted}
          icon="✅"
          color="text-purple-600"
        />

        <DashboardCard
          title={t("employerDashboard.rejected")}
          value={stats.rejected}
          icon="❌"
          color="text-red-600"
        />

      </div>

      {/* MAIN DASHBOARD */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">

        {/* ANALYTICS */}

        <div className="rounded-xl bg-white p-4 shadow-sm xl:col-span-2">

          <div className="mb-3 flex items-center justify-between">

            <h2 className="text-lg font-bold">
              📊 {t("employerDashboard.hiringSummary")}
            </h2>

            <span className="rounded-full bg-purple-50 px-3 py-1 text-sm font-semibold text-purple-600">
              {successRate}% {t("employerDashboard.success")}
            </span>

          </div>

          <DashboardCharts stats={stats} />

        </div>

        {/* QUICK ACTIONS */}

        <div className="space-y-3">

          <Link
            to="/post-job"
            className="block rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >

            <div className="mb-2 text-3xl">➕</div>

            <h2 className="text-lg font-bold">
              {t("employerDashboard.postJobTitle")}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {t("employerDashboard.postJobDescription")}
            </p>

          </Link>

          <Link
            to="/applications"
            className="block rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >

            <div className="mb-2 text-3xl">📋</div>

            <h2 className="text-lg font-bold">
              {t("employerDashboard.manageApplications")}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {t(
                "employerDashboard.manageApplicationsDescription"
              )}
            </p>

          </Link>

          <Link
            to="/workers"
            className="block rounded-xl bg-blue-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >

            <div className="mb-2 text-3xl">👷</div>

            <h2 className="text-lg font-bold text-blue-800">
              Find Workers
            </h2>

            <p className="mt-1 text-sm text-blue-600">
              Search skilled workers by skill and location.
            </p>

          </Link>

        </div>

      </div>

      {/* HIRING STATUS */}

      <div className="mt-4 grid grid-cols-3 gap-3">

        <div className="rounded-xl bg-white p-4 text-center shadow-sm">

          <p className="text-xs font-medium text-gray-500">
            {t("employerDashboard.jobsPosted")}
          </p>

          <p className="mt-1 text-2xl font-bold text-blue-600">
            {stats.jobsPosted}
          </p>

        </div>

        <div className="rounded-xl bg-white p-4 text-center shadow-sm">

          <p className="text-xs font-medium text-gray-500">
            {t("employerDashboard.applications")}
          </p>

          <p className="mt-1 text-2xl font-bold text-green-600">
            {stats.applications}
          </p>

        </div>

        <div className="rounded-xl bg-white p-4 text-center shadow-sm">

          <p className="text-xs font-medium text-gray-500">
            {t("employerDashboard.successRate")}
          </p>

          <p className="mt-1 text-2xl font-bold text-purple-600">
            {successRate}%
          </p>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default EmployerDashboard;
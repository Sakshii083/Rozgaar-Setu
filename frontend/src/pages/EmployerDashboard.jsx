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

      {/* WELCOME */}

      <div className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white shadow-lg">

        <h1 className="text-4xl font-bold">
          {t("employerDashboard.welcome")},{" "}
          {user?.name} 👋
        </h1>

        <p className="mt-3 text-blue-100">
          {t("employerDashboard.welcomeDescription")}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">

          <Link
            to="/post-job"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-gray-100"
          >
            ➕ {t("employerDashboard.postNewJob")}
          </Link>

          <Link
            to="/applications"
            className="rounded-xl bg-blue-800 px-6 py-3 font-semibold transition hover:bg-blue-900"
          >
            📋 {t("employerDashboard.viewApplications")}
          </Link>

        </div>

      </div>

      {/* STATISTICS */}

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

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

      {/* ANALYTICS */}

      <div className="mb-8">
        <DashboardCharts stats={stats} />
      </div>

      {/* QUICK ACTIONS */}

      <div className="mb-8 grid gap-6 md:grid-cols-2">

        <Link
          to="/post-job"
          className="rounded-2xl bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >

          <div className="mb-4 text-5xl">
            ➕
          </div>

          <h2 className="text-2xl font-bold">
            {t("employerDashboard.postJobTitle")}
          </h2>

          <p className="mt-3 text-gray-500">
            {t("employerDashboard.postJobDescription")}
          </p>

        </Link>

        <Link
          to="/applications"
          className="rounded-2xl bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >

          <div className="mb-4 text-5xl">
            📋
          </div>

          <h2 className="text-2xl font-bold">
            {t("employerDashboard.manageApplications")}
          </h2>

          <p className="mt-3 text-gray-500">
            {t(
              "employerDashboard.manageApplicationsDescription"
            )}
          </p>

        </Link>

      </div>

      {/* HIRING SUMMARY */}

      <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg">

        <h2 className="mb-6 text-2xl font-bold">
          {t("employerDashboard.hiringSummary")}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          <div className="rounded-xl border p-6 text-center">

            <h3 className="text-lg font-semibold text-gray-600">
              {t("employerDashboard.jobsPosted")}
            </h3>

            <p className="mt-4 text-5xl font-bold text-blue-600">
              {stats.jobsPosted}
            </p>

          </div>

          <div className="rounded-xl border p-6 text-center">

            <h3 className="text-lg font-semibold text-gray-600">
              {t("employerDashboard.applications")}
            </h3>

            <p className="mt-4 text-5xl font-bold text-green-600">
              {stats.applications}
            </p>

          </div>

          <div className="rounded-xl border p-6 text-center">

            <h3 className="text-lg font-semibold text-gray-600">
              {t("employerDashboard.successRate")}
            </h3>

            <p className="mt-4 text-5xl font-bold text-purple-600">
              {successRate}%
            </p>

          </div>

        </div>

      </div>

      {/* RECENT ACTIVITY */}

      <div className="rounded-2xl bg-white p-8 shadow-lg">

        <h2 className="mb-6 text-2xl font-bold">
          {t("employerDashboard.recentActivity")}
        </h2>

        <div className="space-y-5">

          <div className="flex items-center justify-between border-b pb-4">

            <div>

              <h3 className="font-semibold">
                💼 {t("employerDashboard.jobsPosted")}
              </h3>

              <p className="text-gray-500">
                {stats.jobsPosted}{" "}
                {t("employerDashboard.activeJobPosts")}
              </p>

            </div>

            <span className="font-semibold text-blue-600">
              {t("employerDashboard.live")}
            </span>

          </div>

          <div className="flex items-center justify-between border-b pb-4">

            <div>

              <h3 className="font-semibold">
                📄{" "}
                {t("employerDashboard.applicationsReceived")}
              </h3>

              <p className="text-gray-500">
                {stats.applications}{" "}
                {t("employerDashboard.totalApplications")}
              </p>

            </div>

            <span className="font-semibold text-green-600">
              {t("employerDashboard.updated")}
            </span>

          </div>

          <div className="flex items-center justify-between">

            <div>

              <h3 className="font-semibold">
                ✅{" "}
                {t("employerDashboard.hiringProgress")}
              </h3>

              <p className="text-gray-500">
                {stats.accepted}{" "}
                {t("employerDashboard.accepted")}{" "}
                •{" "}
                {stats.rejected}{" "}
                {t("employerDashboard.rejected")}
              </p>

            </div>

            <span className="font-semibold text-purple-600">
              {successRate}%{" "}
              {t("employerDashboard.success")}
            </span>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default EmployerDashboard;
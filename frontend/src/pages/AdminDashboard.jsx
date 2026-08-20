import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import DashboardCharts from "../components/DashboardCharts";
import Loader from "../components/Loader";

import { getAdminStats } from "../api/adminDashboardApi";
import { useLanguage } from "../context/LanguageContext";

function AdminDashboard() {
  const { t } = useLanguage();

  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    workers: 0,
    employers: 0,
    jobs: 0,
    applications: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getAdminStats();
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

  return (
    <DashboardLayout>

      {/* Welcome Banner */}

      <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 p-8 text-white shadow-lg">

        <h1 className="text-4xl font-bold">
          {t("admin.welcome")}, {user?.name} 👋
        </h1>

        <p className="mt-3 text-purple-100">
          {t("admin.description")}
        </p>

      </div>

      {/* Statistics */}

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title={t("admin.workers")}
          value={stats.workers}
          icon="👷"
          color="text-blue-600"
        />

        <DashboardCard
          title={t("admin.employers")}
          value={stats.employers}
          icon="🏢"
          color="text-green-600"
        />

        <DashboardCard
          title={t("admin.jobs")}
          value={stats.jobs}
          icon="💼"
          color="text-purple-600"
        />

        <DashboardCard
          title={t("admin.applications")}
          value={stats.applications}
          icon="📄"
          color="text-red-600"
        />

      </div>

      {/* Charts */}

      <div className="mb-8">
        <DashboardCharts stats={stats} />
      </div>

      {/* Platform Summary */}

      <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg">

        <h2 className="mb-6 text-2xl font-bold">
          {t("admin.platformSummary")}
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div className="rounded-xl border p-6">

            <h3 className="text-lg font-semibold">
              {t("admin.totalWorkers")}
            </h3>

            <p className="mt-3 text-4xl font-bold text-blue-600">
              {stats.workers}
            </p>

          </div>

          <div className="rounded-xl border p-6">

            <h3 className="text-lg font-semibold">
              {t("admin.totalEmployers")}
            </h3>

            <p className="mt-3 text-4xl font-bold text-green-600">
              {stats.employers}
            </p>

          </div>

          <div className="rounded-xl border p-6">

            <h3 className="text-lg font-semibold">
              {t("admin.activeJobs")}
            </h3>

            <p className="mt-3 text-4xl font-bold text-purple-600">
              {stats.jobs}
            </p>

          </div>

          <div className="rounded-xl border p-6">

            <h3 className="text-lg font-semibold">
              {t("admin.totalApplications")}
            </h3>

            <p className="mt-3 text-4xl font-bold text-red-600">
              {stats.applications}
            </p>

          </div>

        </div>

      </div>

      {/* System Overview */}

      <div className="rounded-2xl bg-white p-8 shadow-lg">

        <h2 className="mb-6 text-2xl font-bold">
          {t("admin.systemOverview")}
        </h2>

        <div className="space-y-5">

          {/* Workers */}

          <div className="flex justify-between border-b pb-4">

            <div>

              <h3 className="font-semibold">
                👷 {t("admin.registeredWorkers")}
              </h3>

              <p className="text-gray-500">
                {stats.workers}{" "}
                {t("admin.workersRegistered")}
              </p>

            </div>

            <span className="font-semibold text-blue-600">
              {t("admin.active")}
            </span>

          </div>

          {/* Employers */}

          <div className="flex justify-between border-b pb-4">

            <div>

              <h3 className="font-semibold">
                🏢 {t("admin.registeredEmployers")}
              </h3>

              <p className="text-gray-500">
                {stats.employers}{" "}
                {t("admin.employersRegistered")}
              </p>

            </div>

            <span className="font-semibold text-green-600">
              {t("admin.active")}
            </span>

          </div>

          {/* Jobs */}

          <div className="flex justify-between border-b pb-4">

            <div>

              <h3 className="font-semibold">
                💼 {t("admin.jobsPosted")}
              </h3>

              <p className="text-gray-500">
                {stats.jobs}{" "}
                {t("admin.jobsAvailable")}
              </p>

            </div>

            <span className="font-semibold text-purple-600">
              {t("admin.live")}
            </span>

          </div>

          {/* Applications */}

          <div className="flex justify-between">

            <div>

              <h3 className="font-semibold">
                📄 {t("admin.applicationsTitle")}
              </h3>

              <p className="text-gray-500">
                {stats.applications}{" "}
                {t("admin.applicationsSubmitted")}
              </p>

            </div>

            <span className="font-semibold text-red-600">
              {t("admin.updated")}
            </span>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default AdminDashboard;
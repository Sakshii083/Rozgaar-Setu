import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import DashboardCharts from "../components/DashboardCharts";
import Loader from "../components/Loader";

import { getAdminStats } from "../api/adminDashboardApi";

function AdminDashboard() {
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
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">
          Welcome Admin, {user?.name} 👋
        </h1>

        <p className="mt-3 text-purple-100">
          Monitor the entire Rozgaar Setu platform from one place.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <DashboardCard
          title="Workers"
          value={stats.workers}
          icon="👷"
          color="text-blue-600"
        />

        <DashboardCard
          title="Employers"
          value={stats.employers}
          icon="🏢"
          color="text-green-600"
        />

        <DashboardCard
          title="Jobs"
          value={stats.jobs}
          icon="💼"
          color="text-purple-600"
        />

        <DashboardCard
          title="Applications"
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
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

        <h2 className="text-2xl font-bold mb-6">
          Platform Summary
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold text-lg">
              Total Workers
            </h3>

            <p className="text-4xl font-bold text-blue-600 mt-3">
              {stats.workers}
            </p>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold text-lg">
              Total Employers
            </h3>

            <p className="text-4xl font-bold text-green-600 mt-3">
              {stats.employers}
            </p>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold text-lg">
              Active Jobs
            </h3>

            <p className="text-4xl font-bold text-purple-600 mt-3">
              {stats.jobs}
            </p>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold text-lg">
              Total Applications
            </h3>

            <p className="text-4xl font-bold text-red-600 mt-3">
              {stats.applications}
            </p>
          </div>

        </div>

      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold mb-6">
          System Overview
        </h2>

        <div className="space-y-5">

          <div className="flex justify-between border-b pb-4">
            <div>
              <h3 className="font-semibold">
                👷 Registered Workers
              </h3>

              <p className="text-gray-500">
                {stats.workers} workers registered
              </p>
            </div>

            <span className="text-blue-600 font-semibold">
              Active
            </span>
          </div>

          <div className="flex justify-between border-b pb-4">
            <div>
              <h3 className="font-semibold">
                🏢 Registered Employers
              </h3>

              <p className="text-gray-500">
                {stats.employers} employers registered
              </p>
            </div>

            <span className="text-green-600 font-semibold">
              Active
            </span>
          </div>

          <div className="flex justify-between border-b pb-4">
            <div>
              <h3 className="font-semibold">
                💼 Jobs Posted
              </h3>

              <p className="text-gray-500">
                {stats.jobs} jobs available
              </p>
            </div>

            <span className="text-purple-600 font-semibold">
              Live
            </span>
          </div>

          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">
                📄 Applications
              </h3>

              <p className="text-gray-500">
                {stats.applications} applications submitted
              </p>
            </div>

            <span className="text-red-600 font-semibold">
              Updated
            </span>
          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default AdminDashboard;
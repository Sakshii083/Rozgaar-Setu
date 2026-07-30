import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import DashboardCharts from "../components/DashboardCharts";
import Loader from "../components/Loader";

import { getEmployerStats } from "../api/dashboardApi";

function EmployerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

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
      ? Math.round((stats.accepted / stats.applications) * 100)
      : 0;

  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">
          Welcome, {user?.name} 👋
        </h1>

        <p className="mt-3 text-blue-100">
          Manage your jobs, review applications and hire skilled workers.
        </p>

        <div className="flex flex-wrap gap-4 mt-8">
          <Link
            to="/post-job"
            className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            + Post New Job
          </Link>

          <Link
            to="/applications"
            className="bg-blue-800 hover:bg-blue-900 px-6 py-3 rounded-xl font-semibold transition"
          >
            View Applications
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <DashboardCard
          title="Jobs Posted"
          value={stats.jobsPosted}
          icon="💼"
          color="text-blue-600"
        />

        <DashboardCard
          title="Applications"
          value={stats.applications}
          icon="📄"
          color="text-green-600"
        />

        <DashboardCard
          title="Accepted"
          value={stats.accepted}
          icon="✅"
          color="text-purple-600"
        />

        <DashboardCard
          title="Rejected"
          value={stats.rejected}
          icon="❌"
          color="text-red-600"
        />

      </div>

      {/* Dashboard Analytics */}
      <div className="mb-8">
        <DashboardCharts stats={stats} />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">

        <Link
          to="/post-job"
          className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition"
        >
          <div className="text-5xl mb-4">➕</div>

          <h2 className="text-2xl font-bold">
            Post a New Job
          </h2>

          <p className="text-gray-500 mt-3">
            Create and publish a new job for workers.
          </p>
        </Link>

        <Link
          to="/applications"
          className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition"
        >
          <div className="text-5xl mb-4">📋</div>

          <h2 className="text-2xl font-bold">
            Manage Applications
          </h2>

          <p className="text-gray-500 mt-3">
            Review, accept or reject worker applications.
          </p>
        </Link>

      </div>

      {/* Hiring Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

        <h2 className="text-2xl font-bold mb-6">
          Hiring Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="border rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-600">
              Jobs Posted
            </h3>

            <p className="text-5xl font-bold text-blue-600 mt-4">
              {stats.jobsPosted}
            </p>
          </div>

          <div className="border rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-600">
              Applications
            </h3>

            <p className="text-5xl font-bold text-green-600 mt-4">
              {stats.applications}
            </p>
          </div>

          <div className="border rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-600">
              Success Rate
            </h3>

            <p className="text-5xl font-bold text-purple-600 mt-4">
              {successRate}%
            </p>
          </div>

        </div>

      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold mb-6">
          Recent Activity
        </h2>

        <div className="space-y-5">

          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-semibold">
                💼 Jobs Posted
              </h3>

              <p className="text-gray-500">
                {stats.jobsPosted} active job posts
              </p>
            </div>

            <span className="text-blue-600 font-semibold">
              Live
            </span>
          </div>

          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-semibold">
                📄 Applications Received
              </h3>

              <p className="text-gray-500">
                {stats.applications} total applications
              </p>
            </div>

            <span className="text-green-600 font-semibold">
              Updated
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">
                ✅ Hiring Progress
              </h3>

              <p className="text-gray-500">
                {stats.accepted} Accepted • {stats.rejected} Rejected
              </p>
            </div>

            <span className="text-purple-600 font-semibold">
              {successRate}% Success
            </span>
          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default EmployerDashboard;
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

function WorkerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({
    availableJobs: 0,
    applications: 0,
    accepted: 0,
    pending: 0,
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
      setStats(statsRes.data);

      if (applicationsRes.data.applications) {
        setApplications(applicationsRes.data.applications);
      } else {
        setApplications(applicationsRes.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.city.toLowerCase().includes(search.toLowerCase()) ||
      job.skill.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold">
          Welcome, {user?.name} 👋
        </h1>

        <p className="mt-2 text-blue-100">
          Find jobs near you and keep your profile updated.
        </p>

        <Link
          to="/edit-profile"
          className="inline-block mt-6 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
        >
          Edit Profile
        </Link>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Available Jobs"
          value={stats.availableJobs}
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
          title="Pending"
          value={stats.pending}
          icon="⏳"
          color="text-orange-600"
        />
      </div>

      {/* Charts */}
      <DashboardCharts stats={stats} />

      {/* Profile */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          My Profile
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-xl p-5">
            <p className="text-gray-500">Email</p>
            <h3 className="font-semibold">{user?.email}</h3>
          </div>

          <div className="border rounded-xl p-5">
            <p className="text-gray-500">Phone</p>
            <h3 className="font-semibold">{user?.phone}</h3>
          </div>

          <div className="border rounded-xl p-5">
            <p className="text-gray-500">City</p>
            <h3 className="font-semibold">
              {user?.city || "Not Added"}
            </h3>
          </div>

          <div className="border rounded-xl p-5">
            <p className="text-gray-500">Skill</p>
            <h3 className="font-semibold">
              {user?.skill || "Not Added"}
            </h3>
          </div>

          <div className="border rounded-xl p-5">
            <p className="text-gray-500">Experience</p>
            <h3 className="font-semibold">
              {user?.experience || 0} Years
            </h3>
          </div>

          <div className="border rounded-xl p-5">
            <p className="text-gray-500">Daily Wage</p>
            <h3 className="font-semibold">
              ₹ {user?.dailyWage || 0}
            </h3>
          </div>

          <div className="md:col-span-2 border rounded-xl p-5">
            <p className="text-gray-500">About Me</p>

            <p className="mt-2">
              {user?.about || "No description added yet."}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs by title, city or skill..."
        />
      </div>

      {/* Available Jobs */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Available Jobs
          </h2>

          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
            {filteredJobs.length} Jobs
          </span>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-500">
              No matching jobs found.
            </h3>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
              />
            ))}
          </div>
        )}
      </div>

      {/* My Applications */}
      <div className="bg-white rounded-2xl shadow-md p-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            My Applications
          </h2>

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
            {applications.length} Applications
          </span>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            You haven't applied for any jobs yet.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="border rounded-xl p-5 flex flex-col md:flex-row md:justify-between md:items-center"
              >
                <div>
                  <h3 className="text-xl font-bold">
                    {application.job?.title}
                  </h3>

                  <p className="text-gray-600">
                    📍 {application.job?.city}
                  </p>

                  <p className="text-gray-600">
                    ₹ {application.job?.salary}
                  </p>

                  <p className="text-gray-600">
                    Employer: {application.employer?.name}
                  </p>
                </div>

                <div className="mt-4 md:mt-0">
                  <span
                    className={`px-5 py-2 rounded-full font-semibold ${
                      application.status === "Accepted"
                        ? "bg-green-100 text-green-700"
                        : application.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {application.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default WorkerDashboard;
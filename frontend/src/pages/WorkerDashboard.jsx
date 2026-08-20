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
  const user = JSON.parse(localStorage.getItem("user"));
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
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, statsRes, applicationsRes] =
        await Promise.all([
          getJobs(),
          getWorkerStats(),
          getWorkerApplications(),
        ]);

      setJobs(jobsRes.data.jobs || []);
      setStats(statsRes.data);

      if (applicationsRes.data.applications) {
        setApplications(
          applicationsRes.data.applications
        );
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
      job.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      job.city
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      job.skill
        .toLowerCase()
        .includes(search.toLowerCase())
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

      {/* WELCOME */}

      <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg">

        <h1 className="text-4xl font-bold">
          {t("workerDashboard.welcome")},{" "}
          {user?.name} 👋
        </h1>

        <p className="mt-2 text-blue-100">
          {t("workerDashboard.welcomeDescription")}
        </p>

        <Link
          to="/edit-profile"
          className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-gray-100"
        >
          {t("workerDashboard.editProfile")}
        </Link>

      </div>

      {/* DASHBOARD CARDS */}

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title={t("workerDashboard.availableJobs")}
          value={stats.availableJobs}
          icon="💼"
          color="text-blue-600"
        />

        <DashboardCard
          title={t("workerDashboard.applications")}
          value={stats.applications}
          icon="📄"
          color="text-green-600"
        />

        <DashboardCard
          title={t("workerDashboard.accepted")}
          value={stats.accepted}
          icon="✅"
          color="text-purple-600"
        />

        <DashboardCard
          title={t("workerDashboard.pending")}
          value={stats.pending}
          icon="⏳"
          color="text-orange-600"
        />

      </div>

      {/* CHARTS */}

      <DashboardCharts stats={stats} />

      {/* PROFILE */}

      <div className="mb-8 rounded-2xl bg-white p-8 shadow-md">

        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          {t("workerDashboard.myProfile")}
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div className="rounded-xl border p-5">
            <p className="text-gray-500">
              {t("workerDashboard.email")}
            </p>

            <h3 className="font-semibold">
              {user?.email ||
                t("workerDashboard.notAdded")}
            </h3>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-gray-500">
              {t("workerDashboard.phone")}
            </p>

            <h3 className="font-semibold">
              {user?.phone ||
                t("workerDashboard.notAdded")}
            </h3>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-gray-500">
              {t("workerDashboard.city")}
            </p>

            <h3 className="font-semibold">
              {user?.city ||
                t("workerDashboard.notAdded")}
            </h3>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-gray-500">
              {t("workerDashboard.skill")}
            </p>

            <h3 className="font-semibold">
              {user?.skill ||
                t("workerDashboard.notAdded")}
            </h3>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-gray-500">
              {t("workerDashboard.experience")}
            </p>

            <h3 className="font-semibold">
              {user?.experience || 0}{" "}
              {t("workerDashboard.years")}
            </h3>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-gray-500">
              {t("workerDashboard.dailyWage")}
            </p>

            <h3 className="font-semibold">
              ₹ {user?.dailyWage || 0}
            </h3>
          </div>

          <div className="rounded-xl border p-5 md:col-span-2">

            <p className="text-gray-500">
              {t("workerDashboard.aboutMe")}
            </p>

            <p className="mt-2">
              {user?.about ||
                t("workerDashboard.noDescription")}
            </p>

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="mb-6">

        <SearchBar
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder={t(
            "workerDashboard.searchPlaceholder"
          )}
        />

      </div>

      {/* AVAILABLE JOBS */}

      <div className="rounded-2xl bg-white p-8 shadow-md">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            {t("workerDashboard.availableJobs")}
          </h2>

          <span className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700">
            {filteredJobs.length}{" "}
            {t("workerDashboard.jobs")}
          </span>

        </div>

        {filteredJobs.length === 0 ? (

          <div className="py-16 text-center">

            <div className="text-5xl">
              🔍
            </div>

            <h3 className="mt-4 text-xl text-gray-500">
              {t("workerDashboard.noMatchingJobs")}
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

      {/* MY APPLICATIONS */}

      <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            {t("workerDashboard.myApplications")}
          </h2>

          <span className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">
            {applications.length}{" "}
            {t("workerDashboard.applications")}
          </span>

        </div>

        {applications.length === 0 ? (

          <div className="py-12 text-center text-gray-500">

            <div className="text-4xl">
              📭
            </div>

            <p className="mt-3">
              {t(
                "workerDashboard.noApplications"
              )}
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {applications.map(
              (application) => (

                <div
                  key={application._id}
                  className="flex flex-col rounded-xl border p-5 md:flex-row md:items-center md:justify-between"
                >

                  <div>

                    <h3 className="text-xl font-bold">
                      {application.job?.title}
                    </h3>

                    <p className="text-gray-600">
                      📍{" "}
                      {application.job?.city}
                    </p>

                    <p className="text-gray-600">
                      ₹{" "}
                      {application.job?.salary}
                    </p>

                    <p className="text-gray-600">
                      {t(
                        "workerDashboard.employer"
                      )}
                      :{" "}
                      {application.employer?.name ||
                        t(
                          "workerDashboard.notAvailable"
                        )}
                    </p>

                  </div>

                  <div className="mt-4 md:mt-0">

                    <span
                      className={`rounded-full px-5 py-2 font-semibold ${
                        application.status ===
                        "Accepted"
                          ? "bg-green-100 text-green-700"
                          : application.status ===
                            "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {application.status ===
                      "Accepted"
                        ? t(
                            "workerDashboard.accepted"
                          )
                        : application.status ===
                          "Rejected"
                        ? t(
                            "workerDashboard.rejected"
                          )
                        : t(
                            "workerDashboard.pending"
                          )}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}

export default WorkerDashboard;
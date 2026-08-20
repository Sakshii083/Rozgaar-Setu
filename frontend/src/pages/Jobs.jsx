import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getJobs } from "../api/jobApi";
import { applyJob } from "../api/applicationApi";
import { useLanguage } from "../context/LanguageContext";

function Jobs() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingJob, setApplyingJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getJobs();

      setJobs(res.data.jobs || []);
    } catch (error) {
      console.error("Failed to load jobs:", error);

      alert(t("jobs.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");

    // User is not logged in
    if (!token) {
      alert(t("jobs.loginFirst"));

      navigate("/login");

      return;
    }

    try {
      // Prevent multiple clicks
      setApplyingJob(jobId);

      await applyJob(jobId);

      alert(t("jobs.applicationSuccess"));
    } catch (error) {
      console.error("Application failed:", error);

      alert(
        error.response?.data?.message ||
          t("jobs.applicationError")
      );
    } finally {
      setApplyingJob(null);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 px-5 py-20 text-center">

        <div className="mx-auto max-w-7xl">

          <div className="text-5xl">
            💼
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-slate-800">
            {t("jobs.loading")}
          </h2>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-5 py-10">

      <div className="mx-auto max-w-7xl">

        {/* =========================
            HEADER
        ========================== */}

        <div className="mb-10 text-center">

          <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            💼 {t("jobs.badge")}
          </span>

          <h1 className="mt-4 text-4xl font-bold text-blue-700">
            {t("jobs.title")}
          </h1>

          <p className="mt-3 text-gray-600">
            {t("jobs.description")}
          </p>

        </div>

        {/* =========================
            NO JOBS
        ========================== */}

        {jobs.length === 0 ? (

          <div className="rounded-2xl bg-white p-12 text-center shadow-lg">

            <div className="text-5xl">
              🔍
            </div>

            <h2 className="mt-4 text-xl font-semibold text-gray-700">
              {t("jobs.noJobs")}
            </h2>

            <p className="mt-2 text-gray-500">
              {t("jobs.noJobsDescription")}
            </p>

          </div>

        ) : (

          /* =========================
             JOB GRID
          ========================== */

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {jobs.map((job) => (

              <div
                key={job._id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* =========================
                    JOB TITLE
                ========================== */}

                <div>

                  <h2 className="text-2xl font-bold text-blue-600">
                    {job.title}
                  </h2>

                  <p className="mt-3 leading-7 text-gray-700">
                    {job.description}
                  </p>

                </div>

                {/* =========================
                    JOB DETAILS
                ========================== */}

                <div className="mt-6 space-y-3 text-gray-700">

                  <p>
                    <strong>
                      🛠️ {t("jobs.skill")}:
                    </strong>{" "}
                    {job.skill ||
                      t("jobs.notAvailable")}
                  </p>

                  <p>
                    <strong>
                      📍 {t("jobs.city")}:
                    </strong>{" "}
                    {job.city ||
                      t("jobs.notAvailable")}
                  </p>

                  <p>
                    <strong>
                      💰 {t("jobs.salary")}:
                    </strong>{" "}
                    ₹{job.salary ||
                      t("jobs.notAvailable")}
                  </p>

                  <p>
                    <strong>
                      💼 {t("jobs.jobType")}:
                    </strong>{" "}
                    {job.jobType ||
                      t("jobs.notAvailable")}
                  </p>

                  <p>
                    <strong>
                      👤 {t("jobs.employer")}:
                    </strong>{" "}
                    {job.employer?.name ||
                      t("jobs.notAvailable")}
                  </p>

                  <p>
                    <strong>
                      📞 {t("jobs.phone")}:
                    </strong>{" "}
                    {job.employer?.phone ||
                      t("jobs.notAvailable")}
                  </p>

                </div>

                {/* =========================
                    APPLY BUTTON
                ========================== */}

                <button
                  type="button"
                  onClick={() => handleApply(job._id)}
                  disabled={applyingJob === job._id}
                  className={`mt-7 w-full rounded-xl py-3 font-semibold text-white shadow-md transition ${
                    applyingJob === job._id
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
                  }`}
                >

                  {applyingJob === job._id
                    ? `⏳ ${t("jobs.applying")}`
                    : `✅ ${t("jobs.applyNow")}`}

                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Jobs;
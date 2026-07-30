import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJobs } from "../api/jobApi";
import { applyJob } from "../api/applicationApi";

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getJobs();
      setJobs(res.data.jobs);
    } catch (error) {
      console.error(error);
      alert("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      await applyJob(jobId);
      alert("✅ Application submitted successfully!");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to apply for this job."
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-2xl font-semibold">
        Loading Jobs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">

      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        Available Jobs
      </h1>

      {jobs.length === 0 ? (
        <div className="text-center text-gray-500 text-xl">
          No Jobs Available
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <h2 className="text-2xl font-bold text-blue-600">
                {job.title}
              </h2>

              <p className="mt-3 text-gray-700">
                {job.description}
              </p>

              <div className="mt-5 space-y-2 text-gray-700">

                <p>
                  <strong>Skill:</strong> {job.skill}
                </p>

                <p>
                  <strong>City:</strong> {job.city}
                </p>

                <p>
                  <strong>Salary:</strong> ₹{job.salary}
                </p>

                <p>
                  <strong>Job Type:</strong> {job.jobType}
                </p>

                <p>
                  <strong>Employer:</strong>{" "}
                  {job.employer?.name || "N/A"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {job.employer?.phone || "N/A"}
                </p>

              </div>

              <button
                onClick={() => handleApply(job._id)}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
              >
                Apply Now
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Jobs;
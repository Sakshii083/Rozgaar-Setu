import { useEffect, useState } from "react";
import {
  getEmployerApplications,
  updateApplicationStatus,
} from "../api/applicationApi";

import DashboardLayout from "../layouts/DashboardLayout";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await getEmployerApplications();
      setApplications(res.data.applications || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);

      alert(`Application ${status}`);

      fetchApplications();
    } catch (error) {
      console.error(error);
      alert("Failed to update application");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center text-2xl font-semibold mt-20">
          Loading Applications...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-blue-700 mb-8">
          Job Applications
        </h1>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-10 text-center">
            <h2 className="text-xl text-gray-500">
              No Applications Found
            </h2>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="grid md:grid-cols-2 gap-8">

                  {/* Worker Details */}
                  <div>
                    <h2 className="text-2xl font-bold text-blue-700">
                      {application.worker?.name}
                    </h2>

                    <p className="mt-3">
                      📧 {application.worker?.email}
                    </p>

                    <p>
                      📞 {application.worker?.phone || "N/A"}
                    </p>

                    <p>
                      🏙️ {application.worker?.city || "N/A"}
                    </p>

                    <p>
                      🛠️ {application.worker?.skill || "N/A"}
                    </p>
                  </div>

                  {/* Job Details */}
                  <div>
                    <p>
                      <strong>Job Title:</strong>{" "}
                      {application.job?.title}
                    </p>

                    <p>
                      <strong>Location:</strong>{" "}
                      {application.job?.city}
                    </p>

                    <p>
                      <strong>Salary:</strong> ₹
                      {application.job?.salary}
                    </p>

                    <p className="mt-4">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`font-bold ${
                          application.status === "Accepted"
                            ? "text-green-600"
                            : application.status === "Rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {application.status}
                      </span>
                    </p>
                  </div>

                </div>

                {application.status === "Pending" && (
                  <div className="flex gap-4 mt-6">

                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          application._id,
                          "Accepted"
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          application._id,
                          "Rejected"
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
                    >
                      Reject
                    </button>

                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default Applications;
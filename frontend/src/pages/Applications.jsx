import { useEffect, useState } from "react";
import {
  getEmployerApplications,
  updateApplicationStatus,
} from "../api/applicationApi";

import DashboardLayout from "../layouts/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";

function Applications() {
  const { t } = useLanguage();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await getEmployerApplications();
      setApplications(res.data.applications || []);
    } catch (error) {
      console.error(error);
      alert(t("applications.loadError"));
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

      if (status === "Accepted") {
        alert(t("applications.acceptedSuccess"));
      } else {
        alert(t("applications.rejectedSuccess"));
      }

      fetchApplications();
    } catch (error) {
      console.error(error);
      alert(t("applications.updateError"));
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mt-20 text-center">
          <div className="text-4xl">📋</div>

          <h2 className="mt-4 text-2xl font-semibold text-slate-800">
            {t("applications.loading")}
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADER */}

        <div className="mb-8">

          <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            📋 {t("applications.badge")}
          </span>

          <h1 className="mt-4 text-4xl font-bold text-blue-700">
            {t("applications.title")}
          </h1>

          <p className="mt-2 text-gray-600">
            {t("applications.description")}
          </p>

        </div>

        {/* NO APPLICATIONS */}

        {applications.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-lg">

            <div className="text-5xl">
              📭
            </div>

            <h2 className="mt-4 text-xl font-semibold text-gray-500">
              {t("applications.noApplications")}
            </h2>

            <p className="mt-2 text-gray-400">
              {t("applications.noApplicationsDescription")}
            </p>

          </div>
        ) : (

          /* APPLICATION LIST */

          <div className="space-y-6">

            {applications.map((application) => (

              <div
                key={application._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition hover:shadow-xl"
              >

                <div className="grid gap-8 md:grid-cols-2">

                  {/* WORKER DETAILS */}

                  <div>

                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
                        👤
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-blue-700">
                          {application.worker?.name ||
                            t("applications.notAvailable")}
                        </h2>

                        <p className="text-sm text-gray-500">
                          {t("applications.applicant")}
                        </p>
                      </div>

                    </div>

                    <div className="mt-5 space-y-2 text-gray-700">

                      <p>
                        📧{" "}
                        <strong>
                          {t("applications.email")}:
                        </strong>{" "}
                        {application.worker?.email ||
                          t("applications.notAvailable")}
                      </p>

                      <p>
                        📞{" "}
                        <strong>
                          {t("applications.phone")}:
                        </strong>{" "}
                        {application.worker?.phone ||
                          t("applications.notAvailable")}
                      </p>

                      <p>
                        🏙️{" "}
                        <strong>
                          {t("applications.city")}:
                        </strong>{" "}
                        {application.worker?.city ||
                          t("applications.notAvailable")}
                      </p>

                      <p>
                        🛠️{" "}
                        <strong>
                          {t("applications.skill")}:
                        </strong>{" "}
                        {application.worker?.skill ||
                          t("applications.notAvailable")}
                      </p>

                    </div>

                  </div>

                  {/* JOB DETAILS */}

                  <div>

                    <h3 className="mb-4 text-lg font-bold text-slate-800">
                      💼 {t("applications.jobDetails")}
                    </h3>

                    <div className="space-y-3 text-gray-700">

                      <p>
                        <strong>
                          {t("applications.jobTitle")}:
                        </strong>{" "}
                        {application.job?.title ||
                          t("applications.notAvailable")}
                      </p>

                      <p>
                        <strong>
                          {t("applications.location")}:
                        </strong>{" "}
                        {application.job?.city ||
                          t("applications.notAvailable")}
                      </p>

                      <p>
                        <strong>
                          {t("applications.salary")}:
                        </strong>{" "}
                        ₹{application.job?.salary ||
                          t("applications.notAvailable")}
                      </p>

                      <p className="pt-2">

                        <strong>
                          {t("applications.status")}:
                        </strong>{" "}

                        <span
                          className={`ml-2 rounded-full px-3 py-1 text-sm font-bold ${
                            application.status === "Accepted"
                              ? "bg-green-100 text-green-700"
                              : application.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {application.status === "Accepted"
                            ? t("applications.accepted")
                            : application.status === "Rejected"
                            ? t("applications.rejected")
                            : t("applications.pending")}
                        </span>

                      </p>

                    </div>

                  </div>

                </div>

                {/* ACTION BUTTONS */}

                {application.status === "Pending" && (

                  <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusUpdate(
                          application._id,
                          "Accepted"
                        )
                      }
                      className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-green-700"
                    >
                      ✅ {t("applications.accept")}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusUpdate(
                          application._id,
                          "Rejected"
                        )
                      }
                      className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-red-700"
                    >
                      ❌ {t("applications.reject")}
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
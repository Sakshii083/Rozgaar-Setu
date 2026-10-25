import { useEffect, useState } from "react";
import {
  getEmployerApplications,
  getWorkerApplications,
  updateApplicationStatus,
} from "../api/applicationApi";

import DashboardLayout from "../layouts/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";

function Applications() {
  const { t } = useLanguage();

  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const user = getStoredUser();
  const isEmployer = user?.role === "employer" || user?.role === "admin";

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = isEmployer
        ? await getEmployerApplications()
        : await getWorkerApplications();

      const apps = res.data.applications || res.data || [];
      setApplications(Array.isArray(apps) ? apps : []);
    } catch (error) {
      console.error("Error loading applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateApplicationStatus(id, status);
      alert(`Application marked as ${status}.`);
      fetchApplications();
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.message || "Failed to update application status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F9D8A]"></div>
          <p className="mt-4 text-xs font-semibold text-slate-500">Loading applications...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-3.5 flex flex-col justify-between gap-1.5 sm:flex-row sm:items-center border-b border-[#E2E8F0] pb-2.5">
          <div>
            <h1 className="text-lg font-black text-[#173B57]">
              {isEmployer ? "Candidate Applications" : "My Job Applications"}
            </h1>
            <p className="text-[11px] text-slate-500">
              {isEmployer
                ? "Review skilled candidates who applied for your job listings"
                : "Track the status of your applications submitted to employers"}
            </p>
          </div>

          <span className="self-start rounded-full bg-[#173B57]/10 px-2.5 py-0.5 text-xs font-bold text-[#173B57]">
            {applications.length} Applications
          </span>
        </div>

        {/* EMPTY STATE */}
        {applications.length === 0 ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-2xs">
            <div className="text-3xl">📭</div>
            <h2 className="mt-2 text-sm font-bold text-slate-800">
              No Applications Found
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {isEmployer
                ? "You haven't received applications yet. Try posting more job listings or browse workers directly."
                : "You haven't applied to any jobs yet. Check the Jobs section to find matching work."}
            </p>
          </div>
        ) : (
          /* APPLICATION CARDS */
          <div className="space-y-2.5">
            {applications.map((app) => (
              <div
                key={app._id}
                className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs transition hover:shadow-xs text-xs"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  {/* LEFT: WORKER / APPLICANT PROFILE */}
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#173B57] text-base font-bold text-white">
                        👤
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-[#202938]">
                          {isEmployer
                            ? app.worker?.name || "Applicant"
                            : app.job?.title || "Job Listing"}
                        </h2>
                        <p className="text-[11px] font-semibold text-[#0F9D8A]">
                          {isEmployer
                            ? `Trade: ${app.worker?.skill || "Worker"}`
                            : `Employer: ${app.employer?.name || "Direct Employer"}`}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 space-y-1 rounded-lg bg-[#F7F9FC] p-2 text-[11px] text-slate-700">
                      {isEmployer ? (
                        <>
                          <p>📞 Phone: <span className="font-bold text-slate-900">{app.worker?.phone || "Not available"}</span></p>
                          <p>✉️ Email: {app.worker?.email || "Not available"}</p>
                          <p>📍 Location: {app.worker?.city || "Local area"}</p>
                          {app.worker?.experience && <p>⏳ Experience: {app.worker.experience} years</p>}
                          {app.worker?.dailyWage && <p>💰 Expected Wage: ₹{app.worker.dailyWage}/day</p>}
                        </>
                      ) : (
                        <>
                          <p>📍 Job City: {app.job?.city || "Local"}</p>
                          <p>💼 Employment Type: {app.job?.jobType || "Daily Wage"}</p>
                          <p>💰 Salary / Wage: <span className="font-bold text-[#0F9D8A]">₹{app.job?.salary || "N/A"}</span></p>
                          {app.employer?.phone && <p>📞 Employer Contact: {app.employer.phone}</p>}
                        </>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: JOB DETAILS & STATUS */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {isEmployer ? "Job Applied For" : "Application Status"}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            app.status === "Accepted"
                              ? "bg-green-100 text-green-800"
                              : app.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {app.status === "Accepted"
                            ? "✓ Accepted"
                            : app.status === "Rejected"
                            ? "✕ Rejected"
                            : "⏳ Pending Review"}
                        </span>
                      </div>

                      {isEmployer && (
                        <div className="mt-2 rounded-lg bg-[#F7F9FC] p-2 text-[11px] text-slate-700 space-y-0.5">
                          <p className="font-bold text-slate-900">{app.job?.title || "Job Listing"}</p>
                          <p>📍 Location: {app.job?.city}</p>
                          <p>💰 Wage: ₹{app.job?.salary}</p>
                        </div>
                      )}
                    </div>

                    {/* EMPLOYER ACTION BUTTONS */}
                    {isEmployer && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                        {app.worker?.phone && (
                          <a
                            href={`tel:${app.worker.phone}`}
                            className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            📞 Call
                          </a>
                        )}

                        {app.status === "Pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(app._id, "Accepted")}
                              disabled={updatingId === app._id}
                              className="rounded-lg bg-[#0F9D8A] px-3 py-1 text-xs font-bold text-white transition hover:bg-[#0b7c6d] disabled:opacity-50"
                            >
                              ✅ Accept
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(app._id, "Rejected")}
                              disabled={updatingId === app._id}
                              className="rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Applications;

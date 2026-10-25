import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyJob } from "../api/applicationApi";
import { useLanguage } from "../context/LanguageContext";

function JobCard({ job }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to apply for this job listing.");
      navigate("/login");
      return;
    }

    try {
      setApplying(true);
      const res = await applyJob({
        jobId: job._id,
      });

      alert(res.data.message || "✅ Application submitted successfully!");
      setApplied(true);
    } catch (error) {
      console.error("Apply Job Error:", error);
      alert(
        error.response?.data?.message ||
          "Could not submit application. Please verify you are logged in as a worker."
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-[#0F9D8A]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#0F9D8A]">
            {job.jobType || "Daily Wage"}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            {job.skill || "General"}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-black text-[#173B57]">
          {job.title}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
          {job.description}
        </p>

        <div className="mt-4 space-y-1.5 rounded-xl bg-[#F7F9FC] p-3 text-xs text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-400">Location:</span>
            <span className="font-semibold text-slate-800">📍 {job.city}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Wage / Salary:</span>
            <span className="font-bold text-[#0F9D8A]">₹{job.salary}</span>
          </div>

          {job.employer?.name && (
            <div className="flex justify-between">
              <span className="text-slate-400">Employer:</span>
              <span className="font-medium text-slate-800">👤 {job.employer.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100">
        {applied ? (
          <div className="rounded-xl bg-green-50 py-2.5 text-center text-xs font-bold text-green-700 border border-green-200">
            ✓ Applied
          </div>
        ) : (
          <button
            type="button"
            onClick={handleApply}
            disabled={applying}
            className="w-full rounded-xl bg-[#173B57] py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#0f2638] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {applying ? "Submitting..." : "✅ Apply for Job"}
          </button>
        )}
      </div>
    </div>
  );
}

export default JobCard;

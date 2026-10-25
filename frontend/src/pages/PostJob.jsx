import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createJob } from "../api/jobApi";
import { useLanguage } from "../context/LanguageContext";

function PostJob() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skill: "Plumber",
    city: "",
    salary: "",
    jobType: "Daily Wage",
  });

  const [loading, setLoading] = useState(false);

  const skills = [
    "Plumber",
    "Electrician",
    "Painter",
    "Carpenter",
    "Mason",
    "Driver",
    "Tailor",
    "Cook",
    "Housekeeper",
    "Welder",
    "Mechanic",
    "Other",
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, skill, city, salary, jobType } = formData;

    if (!title || !description || !skill || !city || !salary || !jobType) {
      alert("Please fill in all required job fields.");
      return;
    }

    try {
      setLoading(true);
      await createJob({
        ...formData,
        salary: Number(salary),
      });

      alert("🎉 Job posted successfully! Workers can now find and apply for your listing.");
      navigate("/employer");
    } catch (error) {
      console.error("Job posting error:", error);
      alert(error.response?.data?.message || "Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden flex flex-col bg-[#F7F9FC]">
      <Navbar />

      <main className="flex-1 min-h-0 flex flex-col items-center justify-center p-2.5 sm:p-3.5 md:overflow-y-auto">
        <div className="mx-auto max-w-xl w-full rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5 shadow-lg">
          <div className="text-center border-b border-slate-100 pb-3">
            <div className="flex h-9 w-9 mx-auto items-center justify-center rounded-xl bg-[#173B57] text-lg text-white">
              💼
            </div>
            <h1 className="mt-1.5 text-lg font-black text-[#173B57]">
              Post a New Job Vacancy
            </h1>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Reach thousands of skilled local workers in your city and neighborhood.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-3.5 space-y-2.5 text-xs">
            {/* TITLE */}
            <div>
              <label className="block font-bold text-slate-700">Job Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Experienced Plumber for Residential Renovation"
                className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block font-bold text-slate-700">Job Description *</label>
              <textarea
                rows={2}
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe work scope, location, timings, and required tools..."
                className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white resize-none"
              />
            </div>

            {/* SKILL & EMPLOYMENT TYPE */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <label className="block font-bold text-slate-700">Required Trade *</label>
                <select
                  name="skill"
                  value={formData.skill}
                  onChange={handleChange}
                  className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white"
                >
                  {skills.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700">Employment Type *</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white"
                >
                  <option value="Daily Wage">Daily Wage</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>

            {/* CITY & SALARY */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <label className="block font-bold text-slate-700">City / Location *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Pune, Bengaluru, Mumbai"
                  className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700">Offered Wage / Salary (₹) *</label>
                <input
                  type="number"
                  name="salary"
                  min="1"
                  required
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. 800"
                  className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#173B57] py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#0f2638] disabled:opacity-50"
              >
                {loading ? "Publishing Job..." : "🚀 Publish Job Listing"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default PostJob;

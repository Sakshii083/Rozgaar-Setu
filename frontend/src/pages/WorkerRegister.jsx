import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

function WorkerRegister() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    skill: "Plumber",
    experience: "0 - 1 Year",
    city: "",
    area: "",
    availability: "Available Today",
    wage: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const skills = [
    "Plumber",
    "Electrician",
    "Carpenter",
    "Painter",
    "Mason",
    "Driver",
    "Tailor",
    "Cook",
    "Housekeeper",
    "Welder",
    "Mechanic",
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.city.trim() ||
      !formData.area.trim() ||
      !formData.wage
    ) {
      alert("Please fill in all required worker details.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/workers/register", {
        ...formData,
        wage: Number(formData.wage),
      });

      setSuccess(true);
    } catch (error) {
      console.error("Worker registration error:", error);
      alert(error.response?.data?.message || "Failed to register worker profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Navbar />

      <main className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xl sm:p-10">
          <div className="text-center border-b border-slate-100 pb-6">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-[#0F9D8A] text-2xl text-white">
              👷
            </div>
            <h1 className="mt-3 text-2xl font-black text-[#173B57] sm:text-3xl">
              Register as a Skilled Worker
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Get discovered by local contractors and residential hirers in your city.
            </p>
          </div>

          {success ? (
            <div className="py-10 text-center">
              <div className="text-5xl">🎉</div>
              <h2 className="mt-4 text-xl font-black text-[#173B57]">
                Registration Successful!
              </h2>
              <p className="mt-2 text-xs text-slate-600 max-w-md mx-auto">
                Your profile is now listed in the worker directory. Local employers can now contact you directly via Call or WhatsApp.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/workers"
                  className="rounded-xl bg-[#173B57] px-6 py-3 text-xs font-bold text-white shadow-sm"
                >
                  View Worker Directory
                </Link>

                <Link
                  to="/jobs"
                  className="rounded-xl bg-[#0F9D8A] px-6 py-3 text-xs font-bold text-white shadow-sm"
                >
                  Find Open Jobs
                </Link>

                <Link
                  to="/voice-profile"
                  className="rounded-xl border border-[#0F9D8A] px-6 py-3 text-xs font-bold text-[#0F9D8A]"
                >
                  🎙️ Try Vaani Voice Profile
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Suresh Patil"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700">10-Digit Mobile Number (For Calls & WhatsApp) *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700">Trade / Primary Skill *</label>
                  <select
                    name="skill"
                    value={formData.skill}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                  >
                    {skills.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Experience *</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                  >
                    <option value="0 - 1 Year">0 - 1 Year</option>
                    <option value="2 - 5 Years">2 - 5 Years</option>
                    <option value="5 - 10 Years">5 - 10 Years</option>
                    <option value="10+ Years">10+ Years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Pune, Bengaluru"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Area / Locality *</label>
                  <input
                    type="text"
                    name="area"
                    required
                    placeholder="e.g. Shivaji Nagar, Kothrud"
                    value={formData.area}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700">Availability *</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                  >
                    <option value="Available Today">Available Today</option>
                    <option value="Available This Week">Available This Week</option>
                    <option value="Busy">Busy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Expected Daily Wage (₹) *</label>
                  <input
                    type="number"
                    name="wage"
                    min="1"
                    required
                    placeholder="e.g. 800"
                    value={formData.wage}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#0F9D8A] py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#0b7c6d] disabled:opacity-50"
                >
                  {loading ? "Registering Profile..." : "🚀 Complete Worker Registration"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default WorkerRegister;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import { CITIES } from "../constants/cities";

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
    <div className="min-h-screen md:h-screen md:overflow-hidden flex flex-col bg-[#F7F9FC]">
      <Navbar />

      <main className="flex-1 min-h-0 flex flex-col items-center justify-center p-2.5 sm:p-3.5 md:overflow-y-auto">
        <div className="mx-auto max-w-xl w-full rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5 shadow-lg">
          <div className="text-center border-b border-slate-100 pb-3">
            <div className="flex h-9 w-9 mx-auto items-center justify-center rounded-xl bg-[#0F9D8A] text-lg text-white">
              👷
            </div>
            <h1 className="mt-1.5 text-lg font-black text-[#173B57]">
              Register as a Skilled Worker
            </h1>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Get discovered by local contractors and residential hirers in your city.
            </p>
          </div>

          {success ? (
            <div className="py-6 text-center">
              <div className="text-4xl">🎉</div>
              <h2 className="mt-2 text-lg font-black text-[#173B57]">
                Registration Successful!
              </h2>
              <p className="mt-1 text-xs text-slate-600 max-w-md mx-auto">
                Your profile is now listed in the worker directory. Local employers can contact you directly via Call or WhatsApp.
              </p>

              <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row text-xs">
                <Link
                  to="/workers"
                  className="rounded-lg bg-[#173B57] px-4 py-2 font-bold text-white shadow-xs"
                >
                  View Directory
                </Link>

                <Link
                  to="/jobs"
                  className="rounded-lg bg-[#0F9D8A] px-4 py-2 font-bold text-white shadow-xs"
                >
                  Find Open Jobs
                </Link>

                <Link
                  to="/voice-profile"
                  className="rounded-lg border border-[#0F9D8A] px-4 py-2 font-bold text-[#0F9D8A]"
                >
                  🎙️ Try Vaani AI
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-3.5 space-y-2.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Suresh Patil"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Mobile Number (Call & WhatsApp) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700">Trade / Primary Skill *</label>
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
                  <label className="block font-bold text-slate-700">Experience *</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white"
                  >
                    <option value="0 - 1 Year">0 - 1 Year</option>
                    <option value="2 - 5 Years">2 - 5 Years</option>
                    <option value="5 - 10 Years">5 - 10 Years</option>
                    <option value="10+ Years">10+ Years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700">City *</label>
                  <input
                    type="text"
                    name="city"
                    list="worker-city-options"
                    required
                    placeholder="e.g. Belagavi, Athani, Chikodi"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white"
                  />
                  <datalist id="worker-city-options">
                    {CITIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
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
                    className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700">Availability *</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white"
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
                    className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#0F9D8A] py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#0b7c6d] disabled:opacity-50"
                >
                  {loading ? "Registering Profile..." : "🚀 Complete Worker Registration"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default WorkerRegister;

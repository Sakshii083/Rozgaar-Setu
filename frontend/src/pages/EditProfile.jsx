import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProfile, updateProfile } from "../api/userApi";
import { CITIES } from "../constants/cities";

function EditProfile() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    skill: "",
    experience: "",
    dailyWage: "",
    about: "",
    available: true,
  });

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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      const u = res.data.user || {};

      setFormData({
        name: u.name || "",
        email: u.email || "",
        phone: u.phone || "",
        city: u.city || "",
        skill: u.skill || (u.skills && u.skills[0]) || "",
        experience: u.experience !== undefined ? u.experience : "",
        dailyWage: u.dailyWage !== undefined ? u.dailyWage : "",
        about: u.about || u.profileSummary || "",
        available: u.available ?? true,
      });
    } catch (error) {
      console.error("Load profile error:", error);
      alert("Unable to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return alert("Name is required");
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      return alert("Please enter a valid 10-digit phone number");
    }

    try {
      setSaving(true);
      const res = await updateProfile({
        ...formData,
        experience: formData.experience === "" ? 0 : Number(formData.experience),
        dailyWage: formData.dailyWage === "" ? 0 : Number(formData.dailyWage),
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("✅ Profile updated successfully!");
      navigate("/worker");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Navbar />

      <main className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-xl">
          <div className="bg-gradient-to-r from-[#173B57] via-[#1c4769] to-[#0F9D8A] p-6 text-white sm:p-8">
            <h1 className="text-2xl font-black sm:text-3xl">Edit Worker Profile</h1>
            <p className="mt-1 text-xs text-slate-200">
              Keep your trade details updated to match with relevant local employers.
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F9D8A]"></div>
              <p className="mt-3 text-xs text-slate-500">Loading your profile...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Email Address (Read-only)</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 p-3 text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700">10-Digit Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">City / Location *</label>
                  <input
                    type="text"
                    name="city"
                    list="edit-profile-cities"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Belagavi, Athani, Chikodi"
                    className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                  />
                  <datalist id="edit-profile-cities">
                    {CITIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-bold text-slate-700">Primary Trade / Skill</label>
                  <select
                    name="skill"
                    value={formData.skill}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                  >
                    <option value="">Select skill...</option>
                    {skills.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="0.5"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Expected Daily Wage (₹)</label>
                  <input
                    type="number"
                    min="0"
                    name="dailyWage"
                    value={formData.dailyWage}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                    className="h-4 w-4 rounded accent-[#0F9D8A]"
                  />
                  <span className="font-bold text-slate-800">
                    Currently available for daily or contract work
                  </span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700">About Me / Services Offered</label>
                <textarea
                  rows={4}
                  maxLength={500}
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Detail your skills, types of work handled, and service localities..."
                  className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                />
                <div className="text-right text-[11px] text-slate-400 mt-1">
                  {formData.about.length}/500 characters
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[#0F9D8A] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#0b7c6d] disabled:opacity-50"
                >
                  {saving ? "Saving Changes..." : "💾 Save Profile"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/worker")}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
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

export default EditProfile;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../api/userApi";

function EditProfile() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();

      setFormData({
        name: res.data.user.name || "",
        email: res.data.user.email || "",
        phone: res.data.user.phone || "",
        city: res.data.user.city || "",
        skill: res.data.user.skill || "",
        experience: res.data.user.experience || "",
        dailyWage: res.data.user.dailyWage || "",
        about: res.data.user.about || "",
        available: res.data.user.available ?? true,
      });
    } catch (error) {
      console.error(error);
      alert("Unable to load profile.");
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
      return alert("Enter a valid 10-digit phone number");
    }

    try {
      setSaving(true);

      const res = await updateProfile(formData);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("✅ Profile Updated Successfully!");

      navigate("/worker");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-5">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
          <h1 className="text-4xl font-bold">Edit Worker Profile</h1>

          <p className="mt-2 text-blue-100">
            Keep your profile updated to receive better job opportunities.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 grid md:grid-cols-2 gap-6"
        >
          {/* Name */}

          <div>
            <label className="block font-semibold mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Email */}

          <div>
            <label className="block font-semibold mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full border rounded-lg p-3 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Phone */}

          <div>
            <label className="block font-semibold mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              maxLength={10}
              required
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* City */}

          <div>
            <label className="block font-semibold mb-2">
              City
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Skill */}

          <div>
            <label className="block font-semibold mb-2">
              Primary Skill
            </label>

            <input
              type="text"
              name="skill"
              value={formData.skill}
              onChange={handleChange}
              placeholder="Electrician, Plumber, Carpenter..."
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Experience */}

          <div>
            <label className="block font-semibold mb-2">
              Experience (Years)
            </label>

            <input
              type="number"
              min="0"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Daily Wage */}

          <div>
            <label className="block font-semibold mb-2">
              Daily Wage (₹)
            </label>

            <input
              type="number"
              min="0"
              name="dailyWage"
              value={formData.dailyWage}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Availability */}

          <div className="flex items-center mt-8">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="h-5 w-5 mr-3"
            />

            <label className="font-semibold">
              Available for Work
            </label>
          </div>

          {/* About */}

          <div className="md:col-span-2">
            <label className="block font-semibold mb-2">
              About Me
            </label>

            <textarea
              rows="5"
              maxLength={500}
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Tell employers about your experience and skills..."
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />

            <div className="text-right text-sm text-gray-500 mt-2">
              {formData.about.length}/500 characters
            </div>
          </div>

          {/* Buttons */}

          <div className="md:col-span-2 flex flex-wrap justify-center gap-4 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg transition duration-300"
            >
              {saving ? "Saving..." : "💾 Save Profile"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/worker")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default EditProfile;
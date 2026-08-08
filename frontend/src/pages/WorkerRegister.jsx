import { useState } from "react";
import API from "../api/axios";

function WorkerRegister() {
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
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/workers/register", {
        ...formData,
        wage: Number(formData.wage),
      });

      alert(
        response.data?.message ||
          "Worker Registered Successfully!"
      );

      setFormData({
        fullName: "",
        phone: "",
        skill: "Plumber",
        experience: "0 - 1 Year",
        city: "",
        area: "",
        availability: "Available Today",
        wage: "",
      });
    } catch (error) {
      console.error("Worker registration error:", error);

      alert(
        error.response?.data?.message ||
          "Worker registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-blue-600">
          Skilled Worker Registration
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Register yourself and start receiving job opportunities.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="font-medium">
              Full Name *
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="font-medium">
              Phone Number *
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="font-medium">
              Skill *
            </label>

            <select
              name="skill"
              value={formData.skill}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border p-3"
            >
              <option>Plumber</option>
              <option>Electrician</option>
              <option>Carpenter</option>
              <option>Painter</option>
              <option>Mason</option>
              <option>Driver</option>
              <option>Tailor</option>
              <option>Housekeeper</option>
            </select>
          </div>

          <div>
            <label className="font-medium">
              Experience *
            </label>

            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border p-3"
            >
              <option>0 - 1 Year</option>
              <option>2 - 5 Years</option>
              <option>5 - 10 Years</option>
              <option>10+ Years</option>
            </select>
          </div>

          <div>
            <label className="font-medium">
              City *
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="font-medium">
              Area *
            </label>

            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Enter your area"
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="font-medium">
              Availability *
            </label>

            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border p-3"
            >
              <option>Available Today</option>
              <option>Busy</option>
              <option>Unavailable</option>
            </select>
          </div>

          <div>
            <label className="font-medium">
              Expected Daily Wage (₹) *
            </label>

            <input
              type="number"
              name="wage"
              value={formData.wage}
              onChange={handleChange}
              placeholder="800"
              min="1"
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default WorkerRegister;
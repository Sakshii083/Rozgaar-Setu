import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../api/jobApi";

function PostJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skill: "",
    city: "",
    salary: "",
    jobType: "Daily Wage",
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

    const { title, description, skill, city, salary, jobType } = formData;

    if (
      !title ||
      !description ||
      !skill ||
      !city ||
      !salary ||
      !jobType
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      await createJob(formData);

      alert("🎉 Job Posted Successfully!");

      setFormData({
        title: "",
        description: "",
        skill: "",
        city: "",
        salary: "",
        jobType: "Daily Wage",
      });

      navigate("/employer");

    } catch (error) {
      alert(error.response?.data?.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          Post New Job
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <textarea
            rows="5"
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="skill"
            placeholder="Required Skill"
            value={formData.skill}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="number"
            name="salary"
            placeholder="Salary / Daily Wage"
            value={formData.salary}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option>Daily Wage</option>
            <option>Part Time</option>
            <option>Full Time</option>
            <option>Contract</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Posting Job..." : "Publish Job"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default PostJob;
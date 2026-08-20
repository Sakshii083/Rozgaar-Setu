import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../api/jobApi";
import { useLanguage } from "../context/LanguageContext";

function PostJob() {
  const navigate = useNavigate();
  const { t } = useLanguage();

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

    const {
      title,
      description,
      skill,
      city,
      salary,
      jobType,
    } = formData;

    if (
      !title ||
      !description ||
      !skill ||
      !city ||
      !salary ||
      !jobType
    ) {
      alert(t("postJob.fillAllFields"));
      return;
    }

    try {
      setLoading(true);

      await createJob(formData);

      alert(t("postJob.success"));

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
      alert(
        error.response?.data?.message ||
          t("postJob.error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">

      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg">

        {/* HEADER */}

        <div className="mb-8 text-center">

          <div className="text-5xl">
            💼
          </div>

          <h1 className="mt-3 text-4xl font-bold text-blue-700">
            {t("postJob.title")}
          </h1>

          <p className="mt-2 text-gray-500">
            {t("postJob.description")}
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* JOB TITLE */}

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              {t("postJob.jobTitle")}
            </label>

            <input
              type="text"
              name="title"
              placeholder={t("postJob.jobTitlePlaceholder")}
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              {t("postJob.jobDescription")}
            </label>

            <textarea
              rows="5"
              name="description"
              placeholder={t(
                "postJob.jobDescriptionPlaceholder"
              )}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {/* SKILL */}

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              {t("postJob.requiredSkill")}
            </label>

            <input
              type="text"
              name="skill"
              placeholder={t(
                "postJob.skillPlaceholder"
              )}
              value={formData.skill}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {/* CITY */}

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              {t("postJob.city")}
            </label>

            <input
              type="text"
              name="city"
              placeholder={t(
                "postJob.cityPlaceholder"
              )}
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {/* SALARY */}

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              {t("postJob.salary")}
            </label>

            <input
              type="number"
              name="salary"
              placeholder={t(
                "postJob.salaryPlaceholder"
              )}
              value={formData.salary}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {/* JOB TYPE */}

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              {t("postJob.jobType")}
            </label>

            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="Daily Wage">
                {t("postJob.dailyWage")}
              </option>

              <option value="Part Time">
                {t("postJob.partTime")}
              </option>

              <option value="Full Time">
                {t("postJob.fullTime")}
              </option>

              <option value="Contract">
                {t("postJob.contract")}
              </option>
            </select>
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-4 font-semibold text-white shadow-md transition ${
              loading
                ? "cursor-not-allowed bg-gray-500"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {loading
              ? `⏳ ${t("postJob.posting")}`
              : `🚀 ${t("postJob.publish")}`}
          </button>

        </form>

      </div>

    </div>
  );
}

export default PostJob;
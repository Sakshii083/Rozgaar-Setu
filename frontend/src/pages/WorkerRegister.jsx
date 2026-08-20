import { useState } from "react";
import API from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

function WorkerRegister() {
  const { t } = useLanguage();

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
      alert(t("workerRegister.fillFields"));
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
          t("workerRegister.success")
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
      console.error(
        "Worker registration error:",
        error
      );

      alert(
        error.response?.data?.message ||
          t("workerRegister.error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">

      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-lg">

        {/* HEADER */}

        <div className="text-center">

          <div className="text-5xl">
            👷
          </div>

          <h1 className="mt-3 text-3xl font-bold text-blue-600">
            {t("workerRegister.title")}
          </h1>

          <p className="mt-2 text-gray-500">
            {t("workerRegister.subtitle")}
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* FULL NAME */}

          <div>
            <label className="font-medium text-gray-700">
              {t("workerRegister.fullName")} *
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder={t(
                "workerRegister.fullNamePlaceholder"
              )}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* PHONE */}

          <div>
            <label className="font-medium text-gray-700">
              {t("workerRegister.phone")} *
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* SKILL */}

          <div>
            <label className="font-medium text-gray-700">
              {t("workerRegister.skill")} *
            </label>

            <select
              name="skill"
              value={formData.skill}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="Plumber">
                {t("skills.plumber")}
              </option>

              <option value="Electrician">
                {t("skills.electrician")}
              </option>

              <option value="Carpenter">
                {t("skills.carpenter")}
              </option>

              <option value="Painter">
                {t("skills.painter")}
              </option>

              <option value="Mason">
                {t("skills.mason")}
              </option>

              <option value="Driver">
                {t("skills.driver")}
              </option>

              <option value="Tailor">
                {t("skills.tailor")}
              </option>

              <option value="Housekeeper">
                {t("skills.housekeeper")}
              </option>
            </select>
          </div>

          {/* EXPERIENCE */}

          <div>
            <label className="font-medium text-gray-700">
              {t("workerRegister.experience")} *
            </label>

            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="0 - 1 Year">
                {t("experience.zeroOne")}
              </option>

              <option value="2 - 5 Years">
                {t("experience.twoFive")}
              </option>

              <option value="5 - 10 Years">
                {t("experience.fiveTen")}
              </option>

              <option value="10+ Years">
                {t("experience.tenPlus")}
              </option>
            </select>
          </div>

          {/* CITY */}

          <div>
            <label className="font-medium text-gray-700">
              {t("workerRegister.city")} *
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder={t(
                "workerRegister.cityPlaceholder"
              )}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* AREA */}

          <div>
            <label className="font-medium text-gray-700">
              {t("workerRegister.area")} *
            </label>

            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder={t(
                "workerRegister.areaPlaceholder"
              )}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* AVAILABILITY */}

          <div>
            <label className="font-medium text-gray-700">
              {t("workerRegister.availability")} *
            </label>

            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="Available Today">
                {t("availability.today")}
              </option>

              <option value="Busy">
                {t("availability.busy")}
              </option>

              <option value="Unavailable">
                {t("availability.unavailable")}
              </option>
            </select>
          </div>

          {/* WAGE */}

          <div>
            <label className="font-medium text-gray-700">
              {t("workerRegister.wage")} *
            </label>

            <input
              type="number"
              name="wage"
              value={formData.wage}
              onChange={handleChange}
              placeholder="800"
              min="1"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-3 font-semibold text-white transition ${
              loading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? `⏳ ${t("workerRegister.registering")}`
              : `🚀 ${t("workerRegister.register")}`}
          </button>

        </form>

      </div>
    </div>
  );
}

export default WorkerRegister;
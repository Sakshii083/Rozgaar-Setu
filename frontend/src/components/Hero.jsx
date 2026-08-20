import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchWorkers } from "../api/workerDashboardApi";
import { useLanguage } from "../context/LanguageContext";

function Hero() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [skill, setSkill] = useState("Plumber");
  const [customSkill, setCustomSkill] = useState("");

  const [city, setCity] = useState("Pune");
  const [customCity, setCustomCity] = useState("");

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const skills = [
    { name: "Plumber", icon: "🔧", key: "plumber" },
    { name: "Electrician", icon: "⚡", key: "electrician" },
    { name: "Painter", icon: "🎨", key: "painter" },
    { name: "Carpenter", icon: "🪚", key: "carpenter" },
    { name: "Mason", icon: "🧱", key: "mason" },
    { name: "Driver", icon: "🚗", key: "driver" },
    { name: "Tailor", icon: "🧵", key: "tailor" },
    { name: "Housekeeper", icon: "🧹", key: "housekeeper" },
  ];

  const cities = [
    { name: "Pune", key: "pune", icon: "📍" },
    { name: "Belgaum", key: "belgaum", icon: "📍" },
    { name: "Bengaluru", key: "bengaluru", icon: "📍" },
    { name: "Mumbai", key: "mumbai", icon: "📍" },
    { name: "Hyderabad", key: "hyderabad", icon: "📍" },
  ];

  const handleSkillSelect = (selectedSkill) => {
    setSkill(selectedSkill);
    setCustomSkill("");
    setSearched(false);
    setWorkers([]);
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setCustomCity("");
    setSearched(false);
    setWorkers([]);
  };

  const handleSearch = async () => {
    const selectedSkill =
      skill === "Other" ? customSkill.trim() : skill;

    const selectedCity =
      city === "Other" ? customCity.trim() : city;

    if (!selectedSkill) {
      alert(t("hero.selectSkillError"));
      return;
    }

    if (!selectedCity) {
      alert(t("hero.selectCityError"));
      return;
    }

    try {
      setLoading(true);
      setSearched(false);

      const response = await searchWorkers(
        selectedSkill,
        selectedCity
      );

      setWorkers(response.data.workers || []);
      setSearched(true);
    } catch (error) {
      console.error("Worker search failed:", error);

      alert(
        error.response?.data?.message ||
          t("hero.searchError")
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedSkillIcon =
    skills.find((item) => item.name === skill)?.icon || "✏️";

  const selectedSkillLabel =
    skill === "Other"
      ? customSkill || t("hero.yourSkill")
      : t(`hero.skills.${skills.find((item) => item.name === skill)?.key}`);

  const selectedCityLabel =
    city === "Other"
      ? customCity || t("hero.yourCity")
      : t(`hero.cities.${cities.find((item) => item.name === city)?.key}`);

  return (
    <section className="relative overflow-hidden bg-slate-50 px-6 py-16 md:py-20">

      {/* Background */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-100 opacity-60 blur-3xl" />

      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-blue-50 opacity-70 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}

        <div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {t("hero.badge")}
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
            {t("hero.title1")}

            <span className="block text-blue-600">
              {t("hero.title2")}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            {t("hero.description")}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <button
              onClick={() => navigate("/jobs")}
              className="rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
            >
              {t("hero.findJobs")}
            </button>

            <button
              onClick={() => navigate("/workers")}
              className="rounded-xl border border-slate-200 bg-white px-7 py-4 font-bold text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:text-blue-600"
            >
              {t("hero.findWorkers")}
            </button>

          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
            <span>✓ {t("hero.skillBased")}</span>
            <span>✓ {t("hero.localOpportunities")}</span>
            <span>✓ {t("hero.simpleHiring")}</span>
          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 md:p-8">

          {/* Header */}

          <div className="flex items-start justify-between gap-4">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                {t("hero.searchTitle")}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {t("hero.searchDescription")}
              </p>

            </div>

            <div className="hidden rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 sm:block">
              ● {t("hero.live")}
            </div>

          </div>

          {/* ================= SKILLS ================= */}

          <div className="mt-7">

            <div className="mb-3 flex items-center justify-between">

              <label className="text-sm font-bold text-slate-800">
                {t("hero.skillQuestion")}
              </label>

              <span className="text-xs text-slate-400">
                {t("hero.selectOne")}
              </span>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              {skills.map((item) => {

                const selected = skill === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleSkillSelect(item.name)}
                    className={`group rounded-2xl border p-3 text-left transition-all duration-200 ${
                      selected
                        ? "border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >

                    <div
                      className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl text-lg ${
                        selected
                          ? "bg-blue-600"
                          : "bg-slate-100 group-hover:bg-blue-100"
                      }`}
                    >
                      {item.icon}
                    </div>

                    <p
                      className={`text-sm font-bold ${
                        selected
                          ? "text-blue-700"
                          : "text-slate-700"
                      }`}
                    >
                      {t(`hero.skills.${item.key}`)}
                    </p>

                    {selected && (
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-blue-500">
                        {t("hero.selected")}
                      </p>
                    )}

                  </button>
                );
              })}

              {/* OTHER */}

              <button
                type="button"
                onClick={() => {
                  setSkill("Other");
                  setSearched(false);
                  setWorkers([]);
                }}
                className={`group rounded-2xl border p-3 text-left transition-all duration-200 ${
                  skill === "Other"
                    ? "border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-100"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >

                <div
                  className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl text-lg ${
                    skill === "Other"
                      ? "bg-blue-600"
                      : "bg-slate-100 group-hover:bg-blue-100"
                  }`}
                >
                  ✏️
                </div>

                <p
                  className={`text-sm font-bold ${
                    skill === "Other"
                      ? "text-blue-700"
                      : "text-slate-700"
                  }`}
                >
                  {t("hero.other")}
                </p>

                {skill === "Other" && (
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-blue-500">
                    {t("hero.selected")}
                  </p>
                )}

              </button>

            </div>

            {/* OTHER SKILL INPUT */}

            {skill === "Other" && (
              <div className="mt-3">

                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => {
                    setCustomSkill(e.target.value);
                    setSearched(false);
                  }}
                  placeholder={t("hero.enterSkill")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  {t("hero.skillExample")}
                </p>

              </div>
            )}

          </div>

          {/* ================= CITY ================= */}

          <div className="mt-7">

            <div className="mb-3 flex items-center justify-between">

              <label className="text-sm font-bold text-slate-800">
                {t("hero.locationQuestion")}
              </label>

              <span className="text-xs text-slate-400">
                {t("hero.selectCity")}
              </span>

            </div>

            <div className="flex flex-wrap gap-2">

              {cities.map((item) => {

                const selected = city === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleCitySelect(item.name)}
                    className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                      selected
                        ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {item.icon} {t(`hero.cities.${item.key}`)}
                  </button>
                );
              })}

              {/* OTHER CITY */}

              <button
                type="button"
                onClick={() => {
                  setCity("Other");
                  setSearched(false);
                  setWorkers([]);
                }}
                className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                  city === "Other"
                    ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                ✏️ {t("hero.other")}
              </button>

            </div>

            {/* OTHER CITY INPUT */}

            {city === "Other" && (
              <div className="mt-3">

                <input
                  type="text"
                  value={customCity}
                  onChange={(e) => {
                    setCustomCity(e.target.value);
                    setSearched(false);
                  }}
                  placeholder={t("hero.enterCity")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>
            )}

          </div>

          {/* ================= SUMMARY ================= */}

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">

            <div>

              <p className="text-xs font-medium text-slate-400">
                {t("hero.lookingFor")}
              </p>

              <p className="mt-0.5 font-bold text-slate-900">

                {selectedSkillIcon}{" "}
                {selectedSkillLabel}

                <span className="mx-2 text-slate-300">
                  •
                </span>

                📍 {selectedCityLabel}

              </p>

            </div>

            <span className="hidden text-xs font-semibold text-slate-400 sm:block">
              {t("hero.realWorkers")}
            </span>

          </div>

          {/* ================= SEARCH BUTTON ================= */}

          <button
            onClick={handleSearch}
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? t("hero.findingMatches")
              : `🔎 ${t("hero.searchWorkers")}`}
          </button>

          {/* ================= RESULTS ================= */}

          {searched && (
            <div className="mt-6">

              {workers.length === 0 ? (

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center">

                  <div className="text-2xl">
                    🔍
                  </div>

                  <p className="mt-2 font-semibold text-slate-700">
                    {t("hero.noWorkers")}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {t("hero.tryAnother")}
                  </p>

                </div>

              ) : (

                <div>

                  <div className="mb-3 flex items-center justify-between">

                    <p className="font-bold text-slate-900">
                      {workers.length} {t("hero.workersFound")}
                    </p>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      ● {t("hero.live")}
                    </span>

                  </div>

                  <div className="space-y-3">

                    {workers.slice(0, 3).map((worker) => (

                      <div
                        key={worker._id}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <h3 className="font-bold text-slate-900">
                              {worker.fullName}
                            </h3>

                            <p className="text-sm font-medium text-blue-600">
                              {worker.skill}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              📍 {worker.area}, {worker.city}
                            </p>

                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              worker.availability === "Available Today"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {worker.availability}
                          </span>

                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-sm">

                          <span className="text-slate-500">
                            {worker.experience}
                          </span>

                          <strong className="text-slate-900">
                            ₹{worker.wage}/day
                          </strong>

                        </div>

                      </div>

                    ))}

                  </div>

                  {workers.length > 3 && (
                    <button
                      onClick={() => navigate("/workers")}
                      className="mt-4 w-full rounded-xl border border-blue-200 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                      {t("hero.viewAll")} ({workers.length})
                    </button>
                  )}

                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </section>
  );
}

export default Hero;
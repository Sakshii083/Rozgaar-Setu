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

  const selectedSkillItem = skills.find(
    (item) => item.name === skill
  );

  const selectedSkillLabel =
    skill === "Other"
      ? customSkill || t("hero.yourSkill")
      : selectedSkillItem
      ? t(`hero.skills.${selectedSkillItem.key}`)
      : skill;

  const selectedCityItem = cities.find(
    (item) => item.name === city
  );

  const selectedCityLabel =
    city === "Other"
      ? customCity || t("hero.yourCity")
      : selectedCityItem
      ? t(`hero.cities.${selectedCityItem.key}`)
      : city;

  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 py-6 md:px-6 md:py-8">

      {/* Background */}
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-100 opacity-50 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-blue-50 opacity-60 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-6 lg:grid-cols-[0.85fr_1.15fr]">

        {/* LEFT SIDE */}

        <div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {t("hero.badge")}
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
            {t("hero.title1")}

            <span className="block text-blue-600">
              {t("hero.title2")}
            </span>
          </h1>

          <p className="mt-3 max-w-xl text-base leading-6 text-slate-600">
            {t("hero.description")}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">

            <button
              onClick={() => navigate("/jobs")}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-700"
            >
              {t("hero.findJobs")}
            </button>

            <button
              onClick={() => navigate("/workers")}
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
            >
              {t("hero.findWorkers")}
            </button>

          </div>

          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            <span>✓ {t("hero.skillBased")}</span>
            <span>✓ {t("hero.localOpportunities")}</span>
            <span>✓ {t("hero.simpleHiring")}</span>
          </div>

        </div>

        {/* RIGHT SEARCH PANEL */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">

          {/* HEADER */}

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {t("hero.searchTitle")}
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {t("hero.searchDescription")}
              </p>
            </div>

            <div className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
              ● {t("hero.live")}
            </div>

          </div>

          {/* SKILLS */}

          <div className="mt-4">

            <div className="mb-2 flex items-center justify-between">

              <label className="text-xs font-bold text-slate-800">
                {t("hero.skillQuestion")}
              </label>

              <span className="text-[10px] text-slate-400">
                {t("hero.selectOne")}
              </span>

            </div>

            <div className="grid grid-cols-4 gap-2">

              {skills.map((item) => {

                const selected = skill === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleSkillSelect(item.name)}
                    className={`rounded-xl border p-2 text-left transition ${
                      selected
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-100"
                        : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >

                    <div
                      className={`mb-1 flex h-7 w-7 items-center justify-center rounded-lg text-sm ${
                        selected
                          ? "bg-blue-600"
                          : "bg-slate-100"
                      }`}
                    >
                      {item.icon}
                    </div>

                    <p
                      className={`truncate text-[11px] font-bold ${
                        selected
                          ? "text-blue-700"
                          : "text-slate-700"
                      }`}
                    >
                      {t(`hero.skills.${item.key}`)}
                    </p>

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
                className={`rounded-xl border p-2 text-left transition ${
                  skill === "Other"
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-100"
                    : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >

                <div
                  className={`mb-1 flex h-7 w-7 items-center justify-center rounded-lg text-sm ${
                    skill === "Other"
                      ? "bg-blue-600"
                      : "bg-slate-100"
                  }`}
                >
                  ✏️
                </div>

                <p className="text-[11px] font-bold text-slate-700">
                  {t("hero.other")}
                </p>

              </button>

            </div>

            {skill === "Other" && (
              <input
                type="text"
                value={customSkill}
                onChange={(e) => {
                  setCustomSkill(e.target.value);
                  setSearched(false);
                }}
                placeholder={t("hero.enterSkill")}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-blue-500"
              />
            )}

          </div>

          {/* CITY */}

          <div className="mt-4">

            <div className="mb-2 flex items-center justify-between">

              <label className="text-xs font-bold text-slate-800">
                {t("hero.locationQuestion")}
              </label>

              <span className="text-[10px] text-slate-400">
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
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      selected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {item.icon} {t(`hero.cities.${item.key}`)}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setCity("Other");
                  setSearched(false);
                  setWorkers([]);
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  city === "Other"
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                ✏️ {t("hero.other")}
              </button>

            </div>

            {city === "Other" && (
              <input
                type="text"
                value={customCity}
                onChange={(e) => {
                  setCustomCity(e.target.value);
                  setSearched(false);
                }}
                placeholder={t("hero.enterCity")}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-blue-500"
              />
            )}

          </div>

          {/* SELECTED SUMMARY */}

          <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">

            <div>

              <p className="text-[10px] text-slate-400">
                {t("hero.lookingFor")}
              </p>

              <p className="text-sm font-bold text-slate-900">
                {selectedSkillIcon} {selectedSkillLabel}
                <span className="mx-1 text-slate-300">•</span>
                📍 {selectedCityLabel}
              </p>

            </div>

            <span className="text-[10px] font-semibold text-slate-400">
              {t("hero.realWorkers")}
            </span>

          </div>

          {/* SEARCH */}

          <button
            onClick={handleSearch}
            disabled={loading}
            className="mt-3 w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? t("hero.findingMatches")
              : `🔎 ${t("hero.searchWorkers")}`}
          </button>

          {/* RESULTS */}

          {searched && (
            <div className="mt-4">

              {workers.length === 0 ? (

                <div className="rounded-xl bg-slate-50 p-4 text-center">

                  <div className="text-xl">🔍</div>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {t("hero.noWorkers")}
                  </p>

                  <p className="text-xs text-slate-500">
                    {t("hero.tryAnother")}
                  </p>

                </div>

              ) : (

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <p className="text-sm font-bold text-slate-900">
                      {workers.length} {t("hero.workersFound")}
                    </p>

                    <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
                      ● {t("hero.live")}
                    </span>

                  </div>

                  <div className="space-y-2">

                    {workers.slice(0, 2).map((worker) => (

                      <div
                        key={worker._id}
                        className="rounded-xl bg-slate-50 p-3"
                      >

                        <div className="flex items-center justify-between">

                          <div>

                            <h3 className="text-sm font-bold text-slate-900">
                              {worker.fullName}
                            </h3>

                            <p className="text-xs font-medium text-blue-600">
                              {worker.skill}
                            </p>

                            <p className="text-[11px] text-slate-500">
                              📍 {worker.area}, {worker.city}
                            </p>

                          </div>

                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                              worker.availability ===
                              "Available Today"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {worker.availability}
                          </span>

                        </div>

                        <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-xs">

                          <span className="text-slate-500">
                            {worker.experience}
                          </span>

                          <strong>
                            ₹{worker.wage}/day
                          </strong>

                        </div>

                      </div>

                    ))}

                  </div>

                  {workers.length > 2 && (
                    <button
                      onClick={() => navigate("/workers")}
                      className="mt-2 w-full rounded-lg border border-blue-200 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
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
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
    { name: "Belagavi", key: "belagavi", icon: "📍" },
    { name: "Athani", key: "athani", icon: "📍" },
    { name: "Chikodi", key: "chikodi", icon: "📍" },
    { name: "Gokak", key: "gokak", icon: "📍" },
    { name: "Hukkeri", key: "hukkeri", icon: "📍" },
    { name: "Nippani", key: "nippani", icon: "📍" },
    { name: "Sankeshwar", key: "sankeshwar", icon: "📍" },
    { name: "Nagargali", key: "nagargali", icon: "📍" },
    { name: "Halsi", key: "halsi", icon: "📍" },
    { name: "Khanapur", key: "khanapur", icon: "📍" },
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
    const selectedSkill = skill === "Other" ? customSkill.trim() : skill;
    const selectedCity = city === "Other" ? customCity.trim() : city;

    if (!selectedSkill) {
      alert(t("hero.selectSkillError") || "Please select or enter a skill.");
      return;
    }

    if (!selectedCity) {
      alert(t("hero.selectCityError") || "Please select or enter a city.");
      return;
    }

    try {
      setLoading(true);
      setSearched(false);

      const response = await searchWorkers(selectedSkill, selectedCity);
      setWorkers(response.data.workers || []);
      setSearched(true);
    } catch (error) {
      console.error("Worker search failed:", error);
      alert(
        error.response?.data?.message ||
          t("hero.searchError") ||
          "Unable to search workers right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedSkillIcon =
    skills.find((item) => item.name === skill)?.icon || "✏️";

  const selectedSkillItem = skills.find((item) => item.name === skill);
  const selectedSkillLabel =
    skill === "Other"
      ? customSkill || t("hero.yourSkill") || "Other Skill"
      : selectedSkillItem
      ? t(`hero.skills.${selectedSkillItem.key}`)
      : skill;

  const selectedCityItem = cities.find((item) => item.name === city);
  const selectedCityLabel =
    city === "Other"
      ? customCity || t("hero.yourCity") || "Other City"
      : selectedCityItem
      ? t(`hero.cities.${selectedCityItem.key}`)
      : city;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F9FC] to-white px-4 py-8 md:px-8 md:py-14">
      {/* Subtle decorative circles */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#0F9D8A]/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#173B57]/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        {/* LEFT COLUMN: HERO HEADLINE & CTAs */}
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0F9D8A]/30 bg-[#0F9D8A]/10 px-4 py-1.5 text-xs font-bold text-[#0F9D8A] shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#0F9D8A] animate-pulse" />
            {t("hero.badge") || "Connecting Local Talent with Local Opportunities"}
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-[#173B57] sm:text-5xl lg:text-5xl">
            Connecting Local Talent with{" "}
            <span className="text-[#0F9D8A]">
              Local Opportunities.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Find meaningful work, discover skilled plumbers, electricians, carpenters, painters, and drivers, and connect with verified opportunities in your neighborhood.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/jobs")}
              className="rounded-xl bg-[#173B57] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#173B57]/20 transition hover:bg-[#0f2638]"
            >
              💼 {t("hero.findJobs") || "Find Jobs →"}
            </button>

            <button
              onClick={() => navigate("/workers")}
              className="rounded-xl border-2 border-[#0F9D8A] bg-white px-6 py-3.5 text-sm font-bold text-[#0F9D8A] shadow-xs transition hover:bg-[#0F9D8A] hover:text-white"
            >
              👷 {t("hero.findWorkers") || "Find Workers"}
            </button>

            <a
              href="#sathi"
              className="rounded-xl bg-[#F4B942] px-6 py-3.5 text-sm font-bold text-[#202938] shadow-md transition hover:bg-[#dca029]"
            >
              🤖 Try Rozgaar Saathi
            </a>
          </div>

          {/* Quick value badges */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="text-[#0F9D8A]">✓</span> Verified Skills
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#0F9D8A]">✓</span> Zero Middleman Cut
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#0F9D8A]">✓</span> Multilingual Voice Tools
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE LOCAL WORKER SEARCH PANEL */}
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xl lg:p-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-[#173B57] sm:text-xl">
                {t("hero.searchTitle") || "Find skilled workers near you"}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Choose a trade and city to discover available workers.
              </p>
            </div>

            <div className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
              ● Live Database
            </div>
          </div>

          {/* SKILL SELECTOR */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#173B57]">
                {t("hero.skillQuestion") || "What skill do you need?"}
              </label>
              <span className="text-[10px] font-medium text-slate-400">
                Select one
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
                        ? "border-[#0F9D8A] bg-[#0F9D8A]/10 ring-1 ring-[#0F9D8A]"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`mb-1 flex h-7 w-7 items-center justify-center rounded-lg text-sm ${
                        selected ? "bg-[#0F9D8A] text-white" : "bg-slate-100"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <p
                      className={`truncate text-[11px] font-bold ${
                        selected ? "text-[#0F9D8A]" : "text-slate-700"
                      }`}
                    >
                      {t(`hero.skills.${item.key}`) || item.name}
                    </p>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setSkill("Other");
                  setSearched(false);
                  setWorkers([]);
                }}
                className={`rounded-xl border p-2 text-left transition ${
                  skill === "Other"
                    ? "border-[#0F9D8A] bg-[#0F9D8A]/10 ring-1 ring-[#0F9D8A]"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`mb-1 flex h-7 w-7 items-center justify-center rounded-lg text-sm ${
                    skill === "Other" ? "bg-[#0F9D8A] text-white" : "bg-slate-100"
                  }`}
                >
                  ✏️
                </div>
                <p className="text-[11px] font-bold text-slate-700">
                  {t("hero.other") || "Other"}
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
                placeholder={t("hero.enterSkill") || "Enter the trade/skill you need..."}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white"
              />
            )}
          </div>

          {/* CITY SELECTOR */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#173B57]">
                {t("hero.locationQuestion") || "Where do you need them?"}
              </label>
              <span className="text-[10px] font-medium text-slate-400">
                City / Location
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {cities.map((item) => {
                const selected = city === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleCitySelect(item.name)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      selected
                        ? "border-[#173B57] bg-[#173B57] text-white font-bold"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {item.icon} {t(`hero.cities.${item.key}`) || item.name}
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
                    ? "border-[#173B57] bg-[#173B57] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                ✏️ {t("hero.other") || "Other"}
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
                placeholder={t("hero.enterCity") || "Enter your city..."}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white"
              />
            )}
          </div>

          {/* SEARCH SUMMARY & ACTION */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-[#F7F9FC] px-3.5 py-2.5 text-xs">
            <div>
              <p className="text-[10px] font-semibold text-slate-400">SEARCHING FOR</p>
              <p className="font-bold text-[#173B57]">
                {selectedSkillIcon} {selectedSkillLabel} • 📍 {selectedCityLabel}
              </p>
            </div>
            <span className="font-semibold text-[#0F9D8A]">Verified Database</span>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="mt-3 w-full rounded-xl bg-[#0F9D8A] py-3 text-sm font-bold text-white shadow-md shadow-[#0F9D8A]/20 transition hover:bg-[#0b7c6d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Searching Local Workers..." : `🔍 Search ${selectedSkillLabel}s in ${selectedCityLabel}`}
          </button>

          {/* WORKER SEARCH RESULTS */}
          {searched && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              {workers.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-4 text-center">
                  <div className="text-2xl">🔍</div>
                  <p className="mt-1 text-xs font-bold text-slate-700">
                    {t("hero.noWorkers") || "No workers found for this exact criteria"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Try searching nearby cities or browse all workers in the directory.
                  </p>
                  <button
                    onClick={() => navigate("/workers")}
                    className="mt-3 rounded-lg bg-[#173B57] px-3 py-1.5 text-xs font-bold text-white"
                  >
                    View All Registered Workers
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-bold text-[#173B57]">
                      {workers.length} {t("hero.workersFound") || "Workers Found"}
                    </p>
                    <span className="text-[10px] font-bold text-green-700">● Available</span>
                  </div>

                  <div className="space-y-2.5">
                    {workers.slice(0, 2).map((w) => (
                      <div
                        key={w._id}
                        className="rounded-xl border border-slate-200 bg-[#F7F9FC] p-3 text-xs"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900">
                              👤 {w.fullName || "Worker"}
                            </h4>
                            <p className="font-semibold text-[#0F9D8A]">
                              🛠️ {w.skill}
                            </p>
                            <p className="text-slate-500 text-[11px]">
                              📍 {w.area ? `${w.area}, ` : ""}{w.city}
                            </p>
                          </div>
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">
                            ₹{w.wage || "N/A"}/day
                          </span>
                        </div>

                        {w.phone && (
                          <div className="mt-2 flex gap-2 pt-2 border-t border-slate-200">
                            <a
                              href={`tel:${w.phone}`}
                              className="flex-1 rounded-lg bg-[#0F9D8A] py-1 text-center text-[11px] font-bold text-white transition hover:bg-[#0b7c6d]"
                            >
                              📞 Call
                            </a>
                            <a
                              href={`https://wa.me/91${String(w.phone).replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 rounded-lg bg-emerald-500 py-1 text-center text-[11px] font-bold text-white transition hover:bg-emerald-600"
                            >
                              💬 WhatsApp
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {workers.length > 2 && (
                    <button
                      onClick={() => navigate("/workers")}
                      className="mt-3 w-full rounded-xl border border-[#0F9D8A] py-2 text-xs font-bold text-[#0F9D8A] hover:bg-[#0F9D8A]/5 transition"
                    >
                      {t("hero.viewAll") || "View all workers"} ({workers.length}) →
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

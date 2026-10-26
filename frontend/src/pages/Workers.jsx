import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIFeatures from "../components/AIFeatures";
import { useLanguage } from "../context/LanguageContext";
import { searchWorkers } from "../api/workerDashboardApi";
import { CITIES } from "../constants/cities";

function Workers() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(() => searchParams.get("skill") || "");
  const [city, setCity] = useState(() => searchParams.get("city") || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

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
  ];

  // 10 operational cities
  const cities = CITIES;

  // Reactively re-load whenever searchParams in URL change
  useEffect(() => {
    const paramSkill = searchParams.get("skill") || "";
    const paramCity = searchParams.get("city") || "";
    setSkill(paramSkill);
    setCity(paramCity);
    loadWorkers(paramSkill, paramCity);
  }, [searchParams]);

  const loadWorkers = async (filterSkill = skill, filterCity = city) => {
    try {
      setLoading(true);
      const res = await searchWorkers(filterSkill, filterCity);
      setWorkers(res.data.workers || []);
    } catch (error) {
      console.error("Worker search error:", error);
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams();
    if (skill) nextParams.set("skill", skill);
    if (city) nextParams.set("city", city);
    setSearchParams(nextParams);
    loadWorkers(skill, city);
  };

  const clearSearch = () => {
    setSkill("");
    setCity("");
    setSearchTerm("");
    setSearchParams({});
    loadWorkers("", "");
  };

  const getWhatsAppNumber = (phone) => {
    if (!phone) return "";
    const number = String(phone).replace(/\D/g, "");
    if (number.startsWith("91")) {
      return number;
    }
    return `91${number}`;
  };

  const filteredWorkers = workers.filter((w) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      w.fullName?.toLowerCase().includes(term) ||
      w.skill?.toLowerCase().includes(term) ||
      w.city?.toLowerCase().includes(term) ||
      w.area?.toLowerCase().includes(term) ||
      w.about?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden flex flex-col bg-[#F7F9FC]">
      <Navbar />

      <main className="flex-1 min-h-0 flex flex-col p-2.5 sm:p-3.5 max-w-7xl mx-auto w-full md:overflow-hidden">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-2 border-b border-slate-200 shrink-0 gap-1">
          <div>
            <h1 className="text-base sm:text-lg font-black text-[#173B57]">
              👷 {t("workers.title") || "Discover Skilled Workers Near You"}
            </h1>
            <p className="text-[11px] text-slate-500">
              {t("workers.subtitle") || "Hire trusted tradespeople directly in your neighborhood. Zero commission deductions."}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-[#0F9D8A]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#0F9D8A]">
              {filteredWorkers.length} {t("workers.available") || "Workers"}
            </span>
            <span className="font-semibold text-green-700 text-[11px]">● {t("hero.benefits.directContact") || "Direct Contact"}</span>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <form
          onSubmit={handleSearch}
          className="rounded-xl border border-[#E2E8F0] bg-white p-2.5 shadow-2xs mb-2.5 shrink-0"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 text-xs">
            <input
              type="text"
              placeholder={t("workers.search") || "Search by name, skill..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0F9D8A] focus:bg-white"
            />

            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0F9D8A] focus:bg-white"
            >
              <option value="">{t("workers.selectSkill") || "All Skills / Trades"}</option>
              {skills.map((item) => (
                <option key={item} value={item}>
                  {t("hero.skills." + item.toLowerCase()) || item}
                </option>
              ))}
            </select>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0F9D8A] focus:bg-white"
            >
              <option value="">{t("workers.selectCity") || "All Cities"}</option>
              {cities.map((item) => (
                <option key={item} value={item}>
                  {t("hero.cities." + item.toLowerCase()) || item}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-lg bg-[#173B57] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#0f2638]"
            >
              🔍 {t("common.search") || "Filter"}
            </button>

            <button
              type="button"
              onClick={clearSearch}
              className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
            >
              ↻ {t("workers.clear") || "Reset"}
            </button>
          </div>
        </form>

        {/* ROZGAAR SAATHI AI DISCOVERY INTEGRATION */}
        <div className="mb-2 rounded-xl border border-[#0F9D8A]/30 bg-[#0F9D8A]/5 px-3 py-2 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base">🤖</span>
            <div>
              <span className="font-bold text-[#173B57]">{t("ai.title") || "Rozgaar Saathi AI"}:</span>{" "}
              <span className="text-slate-600 hidden sm:inline">{t("ai.description") || "Search using voice or natural language"}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="rounded-lg bg-[#0F9D8A] px-3 py-1 font-bold text-white text-xs hover:bg-[#0b7c6d] transition shrink-0"
          >
            {showAIAssistant ? "✕ Close" : "🤖 " + (t("ai.title") || "Ask Rozgaar Saathi")}
          </button>
        </div>

        {showAIAssistant && (
          <div className="mb-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs shrink-0 max-h-64 overflow-y-auto">
            <AIFeatures compact />
          </div>
        )}

        {/* WORKERS GRID */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {loading ? (
            <div className="py-16 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-3 border-slate-200 border-t-[#0F9D8A]"></div>
              <p className="mt-3 text-xs font-semibold text-slate-500">Finding workers in your area...</p>
            </div>
          ) : filteredWorkers.length === 0 ? (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-xs">
              <div className="text-3xl">🔍</div>
              <h2 className="mt-2 text-sm font-bold text-slate-800">
                No workers found for this skill and location. Try another skill or city.
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Try selecting another trade or town, or reset filters to see all available workers.
              </p>
              <button
                onClick={clearSearch}
                className="mt-3 rounded-lg bg-[#173B57] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0f2638]"
              >
                ↻ Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredWorkers.map((worker, index) => (
                <div
                  key={worker._id || index}
                  className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs hover:border-[#0F9D8A] transition text-xs"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#173B57]/10 text-base font-bold text-[#173B57]">
                          👷
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-[#202938]">
                            {worker.fullName || "Skilled Worker"}
                          </h2>
                          <p className="text-[11px] font-semibold text-[#0F9D8A]">
                            🛠️ {worker.skill}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          worker.availability === "Available Today" || worker.availability === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {worker.availability || "Available"}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[11px]">
                      <div className="rounded-lg bg-[#F7F9FC] p-1.5">
                        <span className="block text-[9px] text-slate-400">Location</span>
                        <span className="font-semibold text-slate-800">📍 {worker.city || "Local"}</span>
                      </div>
                      <div className="rounded-lg bg-[#F7F9FC] p-1.5">
                        <span className="block text-[9px] text-slate-400">Experience</span>
                        <span className="font-semibold text-slate-800">{worker.experience || "Experienced"}</span>
                      </div>
                      <div className="rounded-lg bg-[#F7F9FC] p-1.5">
                        <span className="block text-[9px] text-slate-400">Service Area</span>
                        <span className="font-semibold text-slate-800 truncate block">{worker.area || worker.city || "City-wide"}</span>
                      </div>
                      <div className="rounded-lg bg-[#F7F9FC] p-1.5">
                        <span className="block text-[9px] text-slate-400">Daily Wage</span>
                        <span className="font-bold text-[#0F9D8A]">₹{worker.wage || "N/A"}/day</span>
                      </div>
                    </div>

                    {worker.about && (
                      <p className="mt-2 text-[11px] text-slate-500 line-clamp-1">
                        "{worker.about}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-3 grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedWorker(worker)}
                      className="rounded-lg border border-slate-200 py-1.5 text-center text-[11px] font-bold text-slate-700 transition hover:bg-slate-100"
                    >
                      👁 View
                    </button>

                    {worker.phone ? (
                      <a
                        href={`tel:${worker.phone}`}
                        className="rounded-lg bg-[#0F9D8A] py-1.5 text-center text-[11px] font-bold text-white transition hover:bg-[#0b7c6d]"
                      >
                        📞 Call
                      </a>
                    ) : (
                      <button disabled className="rounded-lg bg-slate-100 py-1.5 text-[11px] font-bold text-slate-400">
                        📞 Call
                      </button>
                    )}

                    {worker.phone ? (
                      <a
                        href={`https://wa.me/${getWhatsAppNumber(worker.phone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-emerald-500 py-1.5 text-center text-[11px] font-bold text-white transition hover:bg-emerald-600"
                      >
                        💬 Chat
                      </a>
                    ) : (
                      <button disabled className="rounded-lg bg-slate-100 py-1.5 text-[11px] font-bold text-slate-400">
                        💬 Chat
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* WORKER DETAILS MODAL */}
      {selectedWorker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setSelectedWorker(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173B57] text-2xl text-white">
                  👷
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#173B57]">
                    {selectedWorker.fullName}
                  </h3>
                  <p className="text-xs font-bold text-[#0F9D8A]">
                    🛠️ {selectedWorker.skill}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedWorker(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-[#F7F9FC] p-3">
                <span className="block text-slate-400">City / Region</span>
                <span className="font-bold text-slate-800">📍 {selectedWorker.city || "Local"}</span>
              </div>
              <div className="rounded-xl bg-[#F7F9FC] p-3">
                <span className="block text-slate-400">Locality</span>
                <span className="font-bold text-slate-800">{selectedWorker.area || selectedWorker.city || "City-wide"}</span>
              </div>
              <div className="rounded-xl bg-[#F7F9FC] p-3">
                <span className="block text-slate-400">Experience</span>
                <span className="font-bold text-slate-800">{selectedWorker.experience || "Experienced"}</span>
              </div>
              <div className="rounded-xl bg-[#F7F9FC] p-3">
                <span className="block text-slate-400">Daily Wage</span>
                <span className="font-bold text-[#0F9D8A]">₹{selectedWorker.wage || "N/A"}/day</span>
              </div>
            </div>

            {selectedWorker.about && (
              <div className="mt-4 rounded-xl bg-[#F7F9FC] p-4 text-xs text-slate-700">
                <span className="font-bold text-[#173B57] block mb-1">About Worker:</span>
                <p className="leading-relaxed">{selectedWorker.about}</p>
              </div>
            )}

            {selectedWorker.phone && (
              <div className="mt-6 flex gap-3">
                <a
                  href={`tel:${selectedWorker.phone}`}
                  className="flex-1 rounded-xl bg-[#0F9D8A] py-3 text-center text-xs font-bold text-white shadow-md transition hover:bg-[#0b7c6d]"
                >
                  📞 Call Worker Directly
                </a>
                <a
                  href={`https://wa.me/${getWhatsAppNumber(selectedWorker.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl bg-emerald-500 py-3 text-center text-xs font-bold text-white shadow-md transition hover:bg-emerald-600"
                >
                  💬 Open WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Workers;

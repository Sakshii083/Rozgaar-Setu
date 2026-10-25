import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import { searchWorkers } from "../api/workerDashboardApi";

function Workers() {
  const { t } = useLanguage();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState("");
  const [city, setCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorker, setSelectedWorker] = useState(null);

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

  const cities = [
    "Pune",
    "Bengaluru",
    "Mumbai",
    "Hyderabad",
    "Belgaum",
    "Delhi",
    "Nagpur",
    "Nashik",
  ];

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      setLoading(true);
      const res = await searchWorkers(skill, city);
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
    loadWorkers();
  };

  const clearSearch = () => {
    setSkill("");
    setCity("");
    setSearchTerm("");
    setTimeout(() => {
      loadWorkers();
    }, 0);
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
    <div className="min-h-screen bg-[#F7F9FC]">
      <Navbar />

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="text-center">
            <span className="inline-block rounded-full bg-[#0F9D8A]/10 px-4 py-1 text-xs font-bold text-[#0F9D8A] uppercase">
              👷 Verified Local Tradespeople
            </span>
            <h1 className="mt-3 text-3xl font-black text-[#173B57] sm:text-4xl">
              Discover Skilled Workers Near You
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Hire trusted plumbers, electricians, masons, carpenters, and drivers directly. Zero commission deductions.
            </p>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <form
            onSubmit={handleSearch}
            className="mt-8 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <input
                type="text"
                placeholder="Search by name, skill, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0F9D8A] focus:bg-white"
              />

              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0F9D8A] focus:bg-white"
              >
                <option value="">All Skills / Trades</option>
                {skills.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0F9D8A] focus:bg-white"
              >
                <option value="">All Cities</option>
                {cities.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <button
                type="submit"
                className="rounded-xl bg-[#173B57] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#0f2638]"
              >
                🔍 Search Workers
              </button>

              <button
                type="button"
                onClick={clearSearch}
                className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
              >
                ↻ Clear Filters
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Showing {filteredWorkers.length} workers</span>
              <span className="font-semibold text-[#0F9D8A]">● Direct Contact Enabled</span>
            </div>
          </form>

          {/* WORKERS GRID */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F9D8A]"></div>
              <p className="mt-4 text-sm font-semibold text-slate-600">Finding workers in your area...</p>
            </div>
          ) : filteredWorkers.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-[#E2E8F0] bg-white p-12 text-center shadow-sm">
              <div className="text-4xl">🔍</div>
              <h2 className="mt-3 text-lg font-bold text-slate-800">
                No Workers Found for This Criteria
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Try selecting another skill or nearby city, or clear filters to see all registered workers.
              </p>
              <button
                onClick={clearSearch}
                className="mt-4 rounded-xl bg-[#173B57] px-5 py-2.5 text-xs font-bold text-white"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredWorkers.map((worker, index) => (
                <div
                  key={worker._id || index}
                  className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#173B57]/10 text-xl font-bold text-[#173B57]">
                          👷
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-[#202938]">
                            {worker.fullName || "Skilled Worker"}
                          </h2>
                          <p className="text-xs font-semibold text-[#0F9D8A]">
                            🛠️ {worker.skill}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          worker.availability === "Available Today" || worker.availability === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {worker.availability || "Available"}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-[#F7F9FC] p-2">
                        <span className="block text-[10px] text-slate-400">Location</span>
                        <span className="font-semibold text-slate-800">📍 {worker.city || "Local"}</span>
                      </div>
                      <div className="rounded-lg bg-[#F7F9FC] p-2">
                        <span className="block text-[10px] text-slate-400">Experience</span>
                        <span className="font-semibold text-slate-800">{worker.experience || "Experienced"}</span>
                      </div>
                      <div className="rounded-lg bg-[#F7F9FC] p-2">
                        <span className="block text-[10px] text-slate-400">Service Area</span>
                        <span className="font-semibold text-slate-800">{worker.area || worker.city || "City-wide"}</span>
                      </div>
                      <div className="rounded-lg bg-[#F7F9FC] p-2">
                        <span className="block text-[10px] text-slate-400">Expected Wage</span>
                        <span className="font-bold text-[#0F9D8A]">₹{worker.wage || "N/A"}/day</span>
                      </div>
                    </div>

                    {worker.about && (
                      <p className="mt-3 text-xs text-slate-500 line-clamp-2">
                        "{worker.about}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedWorker(worker)}
                      className="rounded-xl border border-slate-200 py-2 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                    >
                      👁 View
                    </button>

                    {worker.phone ? (
                      <a
                        href={`tel:${worker.phone}`}
                        className="rounded-xl bg-[#0F9D8A] py-2 text-center text-xs font-bold text-white transition hover:bg-[#0b7c6d]"
                      >
                        📞 Call
                      </a>
                    ) : (
                      <button disabled className="rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-400">
                        📞 Call
                      </button>
                    )}

                    {worker.phone ? (
                      <a
                        href={`https://wa.me/${getWhatsAppNumber(worker.phone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-emerald-500 py-2 text-center text-xs font-bold text-white transition hover:bg-emerald-600"
                      >
                        💬 Chat
                      </a>
                    ) : (
                      <button disabled className="rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-400">
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

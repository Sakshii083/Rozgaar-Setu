import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getEmployers } from "../api/employerApi";
import { useLanguage } from "../context/LanguageContext";
import { CITIES } from "../constants/cities";

function Employers() {
  const { t } = useLanguage();

  const [employers, setEmployers] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState(null);

  // 10 operational cities
  const cities = CITIES;

  useEffect(() => {
    loadEmployers();
  }, []);

  const loadEmployers = async () => {
    try {
      setLoading(true);
      const res = await getEmployers(search, city);
      setEmployers(res.data.employers || []);
    } catch (error) {
      console.error("Employer search error:", error);
      setEmployers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadEmployers();
  };

  const clearSearch = () => {
    setSearch("");
    setCity("");
    setTimeout(() => {
      loadEmployers();
    }, 0);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Navbar />

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-[#173B57]/10 px-4 py-1 text-xs font-bold text-[#173B57] uppercase">
              🏢 Employer Network
            </span>
            <h1 className="mt-3 text-3xl font-black text-[#173B57] sm:text-4xl">
              Verified Local Employers & Contractors
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Discover contractors, property managers, and businesses hiring skilled local tradespeople.
            </p>
          </div>

          {/* SEARCH CONTROLS */}
          <form
            onSubmit={handleSearch}
            className="mt-8 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <input
                type="text"
                placeholder="Search employer name or business..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0F9D8A] focus:bg-white"
              />

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
                🔍 Search Employers
              </button>

              <button
                type="button"
                onClick={clearSearch}
                className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
              >
                ↻ Clear Filters
              </button>
            </div>
          </form>

          {/* EMPLOYER LISTINGS */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F9D8A]"></div>
              <p className="mt-4 text-sm font-semibold text-slate-600">Loading registered employers...</p>
            </div>
          ) : employers.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-[#E2E8F0] bg-white p-12 text-center shadow-sm">
              <div className="text-4xl">🏢</div>
              <h2 className="mt-3 text-lg font-bold text-slate-800">
                No Employers Found
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Try searching a different city or term.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {employers.map((emp) => (
                <div
                  key={emp._id}
                  className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#173B57] text-xl font-bold text-white">
                        🏢
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-[#202938]">{emp.name}</h2>
                        <span className="rounded-full bg-[#0F9D8A]/10 px-2 py-0.5 text-[10px] font-bold text-[#0F9D8A]">
                          Registered Employer
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-1 rounded-xl bg-[#F7F9FC] p-3 text-xs text-slate-700">
                      <p>📍 Location: <span className="font-semibold text-slate-900">{emp.city || "Local area"}</span></p>
                      {emp.about && (
                        <p className="mt-1 text-slate-500 line-clamp-2">"{emp.about}"</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedEmployer(emp)}
                      className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      View Details
                    </button>

                    {emp.phone && (
                      <a
                        href={`tel:${emp.phone}`}
                        className="flex-1 rounded-xl bg-[#0F9D8A] py-2 text-center text-xs font-bold text-white hover:bg-[#0b7c6d]"
                      >
                        📞 Contact
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* EMPLOYER DETAIL MODAL */}
      {selectedEmployer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setSelectedEmployer(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173B57] text-2xl text-white">
                  🏢
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#173B57]">{selectedEmployer.name}</h3>
                  <span className="text-xs text-[#0F9D8A] font-bold">Verified Employer</span>
                </div>
              </div>

              <button onClick={() => setSelectedEmployer(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-2 text-xs">
              <div className="rounded-xl bg-[#F7F9FC] p-3">
                <span className="block text-slate-400">Location:</span>
                <span className="font-bold text-slate-800">{selectedEmployer.city || "Not specified"}</span>
              </div>

              {selectedEmployer.phone && (
                <div className="rounded-xl bg-[#F7F9FC] p-3">
                  <span className="block text-slate-400">Contact Number:</span>
                  <span className="font-bold text-slate-800">{selectedEmployer.phone}</span>
                </div>
              )}

              {selectedEmployer.about && (
                <div className="rounded-xl bg-[#F7F9FC] p-3">
                  <span className="block text-slate-400">About Company:</span>
                  <p className="mt-1 leading-relaxed text-slate-700">{selectedEmployer.about}</p>
                </div>
              )}
            </div>

            {selectedEmployer.phone && (
              <div className="mt-6 flex gap-2">
                <a
                  href={`tel:${selectedEmployer.phone}`}
                  className="flex-1 rounded-xl bg-[#0F9D8A] py-3 text-center text-xs font-bold text-white shadow-md hover:bg-[#0b7c6d]"
                >
                  📞 Call Employer
                </a>
                <a
                  href={`https://wa.me/91${String(selectedEmployer.phone).replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl bg-emerald-500 py-3 text-center text-xs font-bold text-white shadow-md hover:bg-emerald-600"
                >
                  💬 WhatsApp
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

export default Employers;

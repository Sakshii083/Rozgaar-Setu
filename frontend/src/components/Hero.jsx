import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchWorkers } from "../api/workerDashboardApi";

function Hero() {
  const navigate = useNavigate();

  const [skill, setSkill] = useState("Plumber");
  const [city, setCity] = useState("");

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!city.trim()) {
      alert("Please enter your city");
      return;
    }

    try {
      setLoading(true);

      const response = await searchWorkers(skill, city);

      setWorkers(response.data.workers || []);
      setSearched(true);
    } catch (error) {
      console.error("Worker search failed:", error);
      alert("Unable to search workers right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 px-6 py-20">
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-100 blur-3xl opacity-60" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">

        {/* LEFT SIDE */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Connecting local talent with local opportunities
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
            Find the right work.
            <span className="block text-blue-600">
              Find the right people.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Rozgaar Setu connects skilled workers with employers based on
            <strong className="text-slate-900"> skill, location, availability </strong>
            and <strong className="text-slate-900">expected wage.</strong>
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/jobs")}
              className="rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
            >
              Find Jobs →
            </button>

            <button
              onClick={() => navigate("/workers")}
              className="rounded-xl border border-slate-200 bg-white px-7 py-4 font-bold text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-blue-300"
            >
              Find Workers
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
            <span>✓ Skill based</span>
            <span>✓ Local opportunities</span>
            <span>✓ Simple hiring</span>
          </div>
        </div>

        {/* RIGHT SIDE - LIVE SEARCH */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 md:p-8">

          <h2 className="text-xl font-bold text-slate-900">
            Find skilled people near you
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Search real workers registered on Rozgaar Setu.
          </p>

          {/* SKILL */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              What skill do you need?
            </label>

            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

          {/* CITY */}
          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Where do you need them?
            </label>

            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city e.g. Belgaum"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* SEARCH */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Finding matches..." : "Search Local Workers →"}
          </button>

          {/* RESULTS */}
          {searched && (
            <div className="mt-6">
              {workers.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <p className="font-semibold text-slate-700">
                    No workers found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Try another skill or nearby city.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-bold text-slate-900">
                      {workers.length} worker
                      {workers.length !== 1 ? "s" : ""} found
                    </p>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      LIVE
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
                      className="mt-4 w-full rounded-xl border border-blue-200 py-3 font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      View all {workers.length} workers →
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
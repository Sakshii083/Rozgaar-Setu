import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { searchWorkers } from "../api/workerDashboardApi";

function Workers() {
  const { t } = useLanguage();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [skill, setSkill] = useState("");
  const [city, setCity] = useState("");

  const [selectedWorker, setSelectedWorker] = useState(null);

  const skills = [
    "Plumber",
    "Electrician",
    "Painter",
    "Carpenter",
    "Mason",
    "Driver",
    "Tailor",
    "Housekeeper",
    "Other",
  ];

  const cities = [
    "Pune",
    "Belgaum",
    "Bengaluru",
    "Mumbai",
    "Hyderabad",
    "Other",
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-5 md:px-6">

      {/* HEADER */}

      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">

        <div>
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
            👷 {t("workers.title") || "Find Workers"}
          </h1>

          <p className="text-sm text-gray-500">
            {t("workers.subtitle") ||
              "Find skilled workers based on skill and location"}
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          {workers.length} {t("workers.available") || "Workers Found"}
        </div>

      </div>

      {/* SEARCH */}

      <form
        onSubmit={handleSearch}
        className="mb-5 rounded-xl bg-white p-4 shadow-sm"
      >

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
          >
            <option value="">
              {t("workers.selectSkill") || "All Skills"}
            </option>

            {skills.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
          >
            <option value="">
              {t("workers.selectCity") || "All Cities"}
            </option>

            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            🔍 {t("workers.search") || "Search"}
          </button>

          <button
            type="button"
            onClick={clearSearch}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            ↻ {t("workers.clear") || "Clear"}
          </button>

        </div>

      </form>

      {/* WORKERS */}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>

            <p className="text-sm text-gray-500">
              {t("workers.loading") || "Finding workers..."}
            </p>
          </div>
        </div>
      ) : workers.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">

          <div className="mb-3 text-5xl">🔍</div>

          <h2 className="text-xl font-bold text-gray-700">
            {t("workers.noWorkers") || "No workers found"}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try another skill or city.
          </p>

        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

          {workers.map((worker, index) => (

            <div
              key={worker._id || index}
              className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              {/* WORKER HEADER */}

              <div className="flex items-start justify-between gap-3">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl">
                    👷
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-800">
                      {worker.fullName || "Worker"}
                    </h2>

                    <p className="text-sm font-medium text-blue-600">
                      {worker.skill || "Skilled Worker"}
                    </p>
                  </div>

                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    worker.availability === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {worker.availability || "Available"}
                </span>

              </div>

              {/* DETAILS */}

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">

                <div className="rounded-lg bg-gray-50 p-2">
                  <span className="block text-xs text-gray-400">
                    Location
                  </span>

                  <span className="font-medium text-gray-700">
                    📍 {worker.city || "Not Available"}
                  </span>
                </div>

                <div className="rounded-lg bg-gray-50 p-2">
                  <span className="block text-xs text-gray-400">
                    Experience
                  </span>

                  <span className="font-medium text-gray-700">
                    {worker.experience || "Not Available"}
                  </span>
                </div>

                <div className="rounded-lg bg-gray-50 p-2">
                  <span className="block text-xs text-gray-400">
                    Area
                  </span>

                  <span className="font-medium text-gray-700">
                    {worker.area || "Not Available"}
                  </span>
                </div>

                <div className="rounded-lg bg-gray-50 p-2">
                  <span className="block text-xs text-gray-400">
                    Wage
                  </span>

                  <span className="font-medium text-gray-700">
                    ₹{worker.wage || "Not Available"}
                  </span>
                </div>

              </div>

              {/* ACTIONS */}

              <div className="mt-4 grid grid-cols-3 gap-2">

                <button
                  onClick={() => setSelectedWorker(worker)}
                  className="rounded-lg bg-blue-600 px-2 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  👁 View
                </button>

                {worker.phone ? (
                  <a
                    href={`tel:${worker.phone}`}
                    className="rounded-lg bg-green-600 px-2 py-2 text-center text-sm font-semibold text-white hover:bg-green-700"
                  >
                    📞 Call
                  </a>
                ) : (
                  <button
                    disabled
                    className="rounded-lg bg-gray-200 px-2 py-2 text-sm text-gray-400"
                  >
                    📞 Call
                  </button>
                )}

                {worker.phone ? (
                  <a
                    href={`https://wa.me/${getWhatsAppNumber(
                      worker.phone
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-emerald-500 px-2 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-600"
                  >
                    💬 Chat
                  </a>
                ) : (
                  <button
                    disabled
                    className="rounded-lg bg-gray-200 px-2 py-2 text-sm text-gray-400"
                  >
                    💬 Chat
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>
      )}

      {/* WORKER DETAILS MODAL */}

      {selectedWorker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedWorker(null)}
        >

          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-5 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-3xl">
                  👷
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedWorker.fullName}
                  </h2>

                  <p className="text-blue-600">
                    {selectedWorker.skill}
                  </p>
                </div>

              </div>

              <button
                onClick={() => setSelectedWorker(null)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-400">Phone</p>
                <p className="font-semibold">
                  {selectedWorker.phone || "Not Available"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-400">Location</p>
                <p className="font-semibold">
                  {selectedWorker.city || "Not Available"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-400">Area</p>
                <p className="font-semibold">
                  {selectedWorker.area || "Not Available"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-400">Experience</p>
                <p className="font-semibold">
                  {selectedWorker.experience || "Not Available"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-400">Expected Wage</p>
                <p className="font-semibold">
                  ₹{selectedWorker.wage || "Not Available"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-400">Availability</p>
                <p className="font-semibold">
                  {selectedWorker.availability || "Not Available"}
                </p>
              </div>

            </div>

            <div className="mt-5 flex gap-3">

              {selectedWorker.phone && (
                <>
                  <a
                    href={`tel:${selectedWorker.phone}`}
                    className="flex-1 rounded-lg bg-green-600 px-4 py-3 text-center font-semibold text-white hover:bg-green-700"
                  >
                    📞 Call Worker
                  </a>

                  <a
                    href={`https://wa.me/${getWhatsAppNumber(
                      selectedWorker.phone
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-lg bg-emerald-500 px-4 py-3 text-center font-semibold text-white hover:bg-emerald-600"
                  >
                    💬 WhatsApp
                  </a>
                </>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Workers;
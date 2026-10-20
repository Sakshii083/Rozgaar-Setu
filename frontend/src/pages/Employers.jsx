import { useEffect, useState } from "react";
import { getEmployers } from "../api/employerApi";
import { useLanguage } from "../context/LanguageContext";

function Employers() {
  const { t } = useLanguage();

  const [employers, setEmployers] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState(null);

  const cities = [
    "Pune",
    "Belgaum",
    "Bengaluru",
    "Mumbai",
    "Hyderabad",
    "Other",
  ];

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
    <div className="min-h-screen bg-gray-50 px-4 py-5 md:px-6">

      {/* HEADER */}

      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">

        <div>
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
            🏢 {t("employers.title") || "Find Employers"}
          </h1>

          <p className="text-sm text-gray-500">
            {t("employers.subtitle") ||
              "Discover employers and available opportunities"}
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          {employers.length} Employers
        </div>

      </div>

      {/* SEARCH */}

      <form
        onSubmit={handleSearch}
        className="mb-5 rounded-xl bg-white p-4 shadow-sm"
      >

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

          <input
            type="text"
            placeholder="Search employer or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
          />

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
          >

            <option value="">
              All Cities
            </option>

            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}

          </select>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            🔍 Search
          </button>

          <button
            type="button"
            onClick={clearSearch}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-100"
          >
            ↻ Clear
          </button>

        </div>

      </form>

      {/* EMPLOYERS */}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>

            <p className="text-sm text-gray-500">
              Finding employers...
            </p>

          </div>

        </div>
      ) : employers.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">

          <div className="mb-3 text-5xl">
            🔍
          </div>

          <h2 className="text-xl font-bold text-gray-700">
            No employers found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try another search or city.
          </p>

        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

          {employers.map((employer) => (

            <div
              key={employer._id}
              className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              {/* EMPLOYER HEADER */}

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl">
                  🏢
                </div>

                <div className="min-w-0">

                  <h2 className="truncate font-bold text-gray-800">
                    {employer.name}
                  </h2>

                  <p className="text-sm text-blue-600">
                    Employer
                  </p>

                </div>

              </div>

              {/* DETAILS */}

              <div className="mt-4 space-y-2 text-sm">

                <div className="rounded-lg bg-gray-50 p-2.5">
                  📍{" "}
                  <span className="font-medium">
                    {employer.city || "Location not available"}
                  </span>
                </div>

                <div className="rounded-lg bg-gray-50 p-2.5">
                  📞{" "}
                  <span className="font-medium">
                    {employer.phone || "Contact not available"}
                  </span>
                </div>

                {employer.about && (
                  <p className="line-clamp-2 text-gray-500">
                    {employer.about}
                  </p>
                )}

              </div>

              {/* ACTIONS */}

              <div className="mt-4 grid grid-cols-2 gap-2">

                <button
                  onClick={() => setSelectedEmployer(employer)}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  👁 View Profile
                </button>

                {employer.phone ? (
                  <a
                    href={`tel:${employer.phone}`}
                    className="rounded-lg bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-green-700"
                  >
                    📞 Contact
                  </a>
                ) : (
                  <button
                    disabled
                    className="rounded-lg bg-gray-200 px-3 py-2 text-sm text-gray-400"
                  >
                    📞 Contact
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>
      )}

      {/* EMPLOYER MODAL */}

      {selectedEmployer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedEmployer(null)}
        >

          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-5 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-3xl">
                  🏢
                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedEmployer.name}
                  </h2>

                  <p className="text-blue-600">
                    Employer
                  </p>

                </div>

              </div>

              <button
                onClick={() => setSelectedEmployer(null)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>

            </div>

            <div className="space-y-3">

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-400">
                  Location
                </p>

                <p className="font-semibold">
                  📍 {selectedEmployer.city || "Not Available"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-400">
                  Phone
                </p>

                <p className="font-semibold">
                  📞 {selectedEmployer.phone || "Not Available"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-400">
                  About
                </p>

                <p className="text-sm text-gray-700">
                  {selectedEmployer.about ||
                    "No employer description available."}
                </p>
              </div>

            </div>

            {selectedEmployer.phone && (
              <div className="mt-5 flex gap-3">

                <a
                  href={`tel:${selectedEmployer.phone}`}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-3 text-center font-semibold text-white hover:bg-green-700"
                >
                  📞 Call
                </a>

                <a
                  href={`https://wa.me/91${String(
                    selectedEmployer.phone
                  ).replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-lg bg-emerald-500 px-4 py-3 text-center font-semibold text-white hover:bg-emerald-600"
                >
                  💬 WhatsApp
                </a>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default Employers;
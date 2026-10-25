import { useEffect, useState } from "react";
import { getStats } from "../api/statsApi";
import { useLanguage } from "../context/LanguageContext";

function Stats() {
  const { t } = useLanguage();

  const [stats, setStats] = useState({
    workers: 0,
    jobs: 0,
    employers: 0,
    cities: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const res = await getStats();
        if (isMounted) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const statsData = [
    {
      number: stats.workers,
      title: t("stats.workers") || "Registered Workers",
      icon: "👷",
    },
    {
      number: stats.jobs,
      title: t("stats.jobs") || "Job Listings",
      icon: "💼",
    },
    {
      number: stats.employers,
      title: t("stats.employers") || "Active Employers",
      icon: "🏢",
    },
    {
      number: stats.cities,
      title: t("stats.cities") || "Cities Covered",
      icon: "📍",
    },
  ];

  return (
    <section className="border-y border-[#E2E8F0] bg-[#173B57] py-6 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <p className="py-2 text-center text-xs text-slate-300">
            {t("stats.loading") || "Loading live platform activity..."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {statsData.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white/5 p-4 text-center backdrop-blur-xs transition hover:bg-white/10"
              >
                <div className="text-2xl">{stat.icon}</div>
                <h3 className="mt-2 text-2xl font-black text-[#F4B942] sm:text-3xl">
                  {stat.number}
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-200">
                  {stat.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Stats;

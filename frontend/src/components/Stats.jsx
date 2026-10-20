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
      title: t("stats.workers"),
      icon: "👷",
    },
    {
      number: stats.jobs,
      title: t("stats.jobs"),
      icon: "💼",
    },
    {
      number: stats.employers,
      title: t("stats.employers"),
      icon: "🏢",
    },
    {
      number: stats.cities,
      title: t("stats.cities"),
      icon: "📍",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-white md:py-4">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-2 text-center">
          <h2 className="text-lg font-bold md:text-xl">
            {t("stats.title")}
          </h2>
        </div>

        {loading ? (
          <p className="py-2 text-center text-sm">
            {t("stats.loading")}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {statsData.map((stat) => (
              <div
                key={stat.title}
                className="rounded-lg bg-white/10 p-2 text-center backdrop-blur-sm transition hover:bg-white/20"
              >
                <div className="text-lg">{stat.icon}</div>

                <h3 className="mt-1 text-xl font-bold">
                  {stat.number}
                </h3>

                <p className="mt-1 text-xs font-medium text-blue-50 md:text-sm">
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
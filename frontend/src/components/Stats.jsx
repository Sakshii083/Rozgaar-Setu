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
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getStats();
      setStats(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-blue-600 py-6 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-lg font-semibold">
            {t("stats.loading")}
          </h2>
        </div>
      </section>
    );
  }

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
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-8 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-5 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            {t("stats.title")}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

          {statsData.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm transition hover:bg-white/20"
            >
              <div className="text-2xl">
                {stat.icon}
              </div>

              <h2 className="mt-1 text-3xl font-bold">
                {stat.number}
              </h2>

              <p className="mt-1 text-sm font-medium text-blue-50">
                {stat.title}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Stats;
import { useEffect, useState } from "react";
import { getStats } from "../api/statsApi";

function Stats() {
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
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-semibold">
            Loading statistics...
          </h2>
        </div>
      </section>
    );
  }

  const statsData = [
    {
      number: stats.workers,
      title: "Workers",
    },
    {
      number: stats.jobs,
      title: "Jobs",
    },
    {
      number: stats.employers,
      title: "Employers",
    },
    {
      number: stats.cities,
      title: "Cities",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

          {statsData.map((stat) => (
            <div
              key={stat.title}
              className="hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-5xl font-bold">
                {stat.number}
              </h2>

              <p className="mt-3 text-lg">
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
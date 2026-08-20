import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import { useLanguage } from "../context/LanguageContext";

function DashboardCharts({ stats }) {
  const { t } = useLanguage();

  const accepted = stats?.accepted || 0;
  const pending = stats?.pending || 0;
  const rejected = stats?.rejected || 0;

  const pieData = [
    {
      name: t("charts.accepted"),
      value: accepted,
    },
    {
      name: t("charts.pending"),
      value: pending,
    },
    {
      name: t("charts.rejected"),
      value: rejected,
    },
  ];

  const barData = [
    {
      name: t("charts.applications"),
      Accepted: accepted,
      Pending: pending,
      Rejected: rejected,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#facc15",
    "#ef4444",
  ];

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-2">

      {/* =========================
          PIE CHART
      ========================== */}

      <div className="rounded-2xl bg-white p-6 shadow-lg">

        <h2 className="mb-6 text-xl font-bold text-slate-800">
          {t("charts.applicationStatus")}
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <PieChart>

            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>
        </ResponsiveContainer>

      </div>

      {/* =========================
          BAR CHART
      ========================== */}

      <div className="rounded-2xl bg-white p-6 shadow-lg">

        <h2 className="mb-6 text-xl font-bold text-slate-800">
          {t("charts.applicationsOverview")}
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart data={barData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
            />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="Accepted"
              fill="#22c55e"
              name={t("charts.accepted")}
            />

            <Bar
              dataKey="Pending"
              fill="#facc15"
              name={t("charts.pending")}
            />

            <Bar
              dataKey="Rejected"
              fill="#ef4444"
              name={t("charts.rejected")}
            />

          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default DashboardCharts;
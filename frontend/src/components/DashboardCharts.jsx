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
} from "recharts";

function DashboardCharts({ stats }) {
  const pieData = [
    { name: "Accepted", value: stats.accepted },
    { name: "Pending", value: stats.pending },
    { name: "Rejected", value: stats.rejected },
  ];

  const barData = [
    {
      name: "Applications",
      Accepted: stats.accepted,
      Pending: stats.pending,
      Rejected: stats.rejected,
    },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <div className="grid lg:grid-cols-2 gap-8 mt-10">

      {/* Pie Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">
          Application Status
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">
          Applications Overview
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="Accepted" fill="#22c55e" />

            <Bar dataKey="Pending" fill="#facc15" />

            <Bar dataKey="Rejected" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default DashboardCharts;
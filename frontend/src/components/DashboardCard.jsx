import React from "react";

function DashboardCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-blue-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h2 className={`text-3xl font-bold mt-2 ${color}`}>
            {value}
          </h2>
        </div>

        <div className="text-4xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
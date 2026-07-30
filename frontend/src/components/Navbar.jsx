import React from "react";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-white shadow-sm rounded-xl p-5 flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-700">
          Dashboard
        </h1>

        <p className="text-gray-500">
          Welcome back, {user?.name} 👋
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
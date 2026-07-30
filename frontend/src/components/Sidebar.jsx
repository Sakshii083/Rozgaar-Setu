import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menu = [
    {
      name: "Dashboard",
      path: user?.role === "employer" ? "/employer" : "/worker",
      icon: "🏠",
    },
    {
      name: "Edit Profile",
      path: "/edit-profile",
      icon: "👤",
    },
    {
      name: "Jobs",
      path: "/jobs",
      icon: "💼",
    },
    {
      name: "Applications",
      path: "/applications",
      icon: "📄",
    },
  ];

  return (
    <div className="w-64 bg-blue-700 text-white min-h-screen p-6">

      <h1 className="text-3xl font-bold mb-10">
        Rozgaar Setu
      </h1>

      <nav className="space-y-3">

        {menu.map((item) => (

          <Link
            key={item.name}
            to={item.path}
            className={`block px-4 py-3 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-white text-blue-700"
                : "hover:bg-blue-600"
            }`}
          >
            {item.icon} {item.name}
          </Link>

        ))}

      </nav>

      <button
        onClick={logout}
        className="mt-12 bg-red-500 hover:bg-red-600 px-5 py-3 rounded-lg w-full"
      >
        Logout
      </button>

    </div>
  );
}

export default Sidebar;
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useLanguage();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const dashboardPath =
    user?.role === "employer"
      ? "/employer"
      : user?.role === "admin"
      ? "/admin"
      : "/worker";

  const menu = [
    {
      name: t("dashboard.dashboard"),
      path: dashboardPath,
      icon: "🏠",
    },
    {
      name: t("dashboard.editProfile"),
      path: "/edit-profile",
      icon: "👤",
    },
    {
      name: t("dashboard.jobs"),
      path: "/jobs",
      icon: "💼",
    },
    {
      name: t("dashboard.applications"),
      path: "/applications",
      icon: "📄",
    },
  ];

  return (
    <div className="min-h-screen w-64 bg-blue-700 p-6 text-white">

      {/* LOGO */}

      <h1 className="mb-10 text-3xl font-bold">
        Rozgaar Setu
      </h1>

      {/* MENU */}

      <nav className="space-y-3">

        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block rounded-lg px-4 py-3 transition ${
              location.pathname === item.path
                ? "bg-white text-blue-700"
                : "hover:bg-blue-600"
            }`}
          >
            {item.icon} {item.name}
          </Link>
        ))}

      </nav>

      {/* LOGOUT */}

      <button
        onClick={logout}
        className="mt-12 w-full rounded-lg bg-red-500 px-5 py-3 transition hover:bg-red-600"
      >
        🚪 {t("dashboard.logout")}
      </button>

    </div>
  );
}

export default Sidebar;
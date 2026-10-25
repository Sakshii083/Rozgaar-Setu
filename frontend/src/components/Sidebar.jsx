import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Sidebar({ onNavigate, isMobile = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const user = getStoredUser();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onNavigate) onNavigate();
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
      name: t("dashboard.dashboard") || "Dashboard",
      path: dashboardPath,
      icon: "🏠",
    },
    {
      name: "Browse Jobs",
      path: "/jobs",
      icon: "💼",
    },
    {
      name: "Find Workers",
      path: "/workers",
      icon: "👷",
    },
    {
      name: t("dashboard.applications") || "Applications",
      path: "/applications",
      icon: "📄",
    },
  ];

  if (user?.role === "worker") {
    menu.push({
      name: "Edit Profile",
      path: "/edit-profile",
      icon: "👤",
    });
    menu.push({
      name: "Vaani Voice AI",
      path: "/voice-profile",
      icon: "🎙️",
    });
  }

  if (user?.role === "employer") {
    menu.push({
      name: "Post a Job",
      path: "/post-job",
      icon: "➕",
    });
  }

  const containerClasses = isMobile
    ? "flex flex-col h-full justify-between"
    : "flex flex-col h-full justify-between bg-[#173B57] p-3.5 text-white";

  return (
    <div className={containerClasses}>
      <div>
        {/* LOGO */}
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 mb-4"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F9D8A] text-base font-black text-white shadow-xs">
            R
          </div>
          <div>
            <h1 className="text-base font-black text-white tracking-tight">
              Rozgaar<span className="text-[#F4B942]"> Setu</span>
            </h1>
            <p className="text-[9px] text-slate-300 font-medium">Dashboard</p>
          </div>
        </Link>

        {/* User Card */}
        {user && (
          <div className="mb-3.5 rounded-xl bg-white/10 p-2.5 text-xs backdrop-blur-xs">
            <p className="font-bold text-white truncate text-[11px]">{user.name}</p>
            <p className="text-[10px] capitalize text-[#F4B942] font-semibold">{user.role}</p>
          </div>
        )}

        {/* NAVIGATION LINKS */}
        <nav className="space-y-1">
          {menu.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
                  active
                    ? "bg-[#0F9D8A] text-white shadow-xs"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-3 border-t border-white/10 space-y-1.5">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
        >
          <span>🌐</span>
          <span>Homepage</span>
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500/20 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500 hover:text-white"
        >
          <span>🚪</span>
          <span>{t("dashboard.logout") || "Logout"}</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

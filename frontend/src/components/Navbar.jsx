import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return null;
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && typeof parsedUser === "object" && !Array.isArray(parsedUser)) {
        return parsedUser;
      }
      return null;
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      return null;
    }
  };

  const user = getStoredUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { language, changeLanguage, t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    setUserDropdownOpen(false);
    navigate("/login");
  };

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "worker") return "/worker";
    if (user.role === "employer") return "/employer";
    if (user.role === "admin") return "/admin";
    return "/worker";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173B57] text-lg font-black text-white shadow-md shadow-[#173B57]/20">
            R
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-[#173B57]">
              Rozgaar<span className="text-[#0F9D8A]"> Setu</span>
            </span>
            <p className="hidden text-[10px] font-semibold text-slate-500 sm:block">
              Local Skills. Local Opportunities.
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            to="/"
            className={`text-sm font-semibold transition ${
              location.pathname === "/"
                ? "text-[#0F9D8A] font-bold"
                : "text-slate-700 hover:text-[#173B57]"
            }`}
          >
            {t("nav.home") || "Home"}
          </Link>

          <Link
            to="/jobs"
            className={`text-sm font-semibold transition ${
              location.pathname === "/jobs"
                ? "text-[#0F9D8A] font-bold"
                : "text-slate-700 hover:text-[#173B57]"
            }`}
          >
            {t("nav.jobs") || "Find Jobs"}
          </Link>

          <Link
            to="/workers"
            className={`text-sm font-semibold transition ${
              location.pathname === "/workers"
                ? "text-[#0F9D8A] font-bold"
                : "text-slate-700 hover:text-[#173B57]"
            }`}
          >
            {t("nav.workers") || "Find Workers"}
          </Link>

          <Link
            to="/#sathi"
            className="flex items-center gap-1 text-sm font-semibold text-slate-700 transition hover:text-[#0F9D8A]"
          >
            <span>🤖</span>
            <span>Rozgaar Saathi</span>
          </Link>

          <Link
            to="/voice-profile"
            className="flex items-center gap-1 text-sm font-semibold text-slate-700 transition hover:text-[#0F9D8A]"
          >
            <span>🎙️</span>
            <span>Vaani AI</span>
          </Link>

          <Link
            to="/about"
            className={`text-sm font-semibold transition ${
              location.pathname === "/about"
                ? "text-[#0F9D8A] font-bold"
                : "text-slate-700 hover:text-[#173B57]"
            }`}
          >
            About
          </Link>
        </nav>

        {/* DESKTOP RIGHT ACTIONS */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* LANGUAGE SELECTOR */}
          <div className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] px-3 py-1.5 text-xs">
            <span className="text-sm">🌐</span>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="cursor-pointer bg-transparent text-xs font-bold text-slate-700 outline-none"
              aria-label={t("nav.language") || "Language"}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="mr">मराठी</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>

          {/* AUTHENTICATION STATE */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-bold text-[#173B57] transition hover:bg-slate-100"
              >
                {t("nav.login") || "Login"}
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-[#173B57] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#0f2638]"
              >
                {t("nav.getStarted") || "Get Started"}
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 transition hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F9D8A] font-bold text-white text-xs">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <div className="text-left">
                  <p className="max-w-[100px] truncate text-xs font-bold text-slate-800">
                    {user.name}
                  </p>
                  <p className="text-[10px] capitalize text-[#0F9D8A] font-semibold">
                    {user.role}
                  </p>
                </div>

                <span className="text-slate-400 text-xs">▼</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-xl z-50">
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setUserDropdownOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#F7F9FC] hover:text-[#173B57]"
                  >
                    📊 {t("nav.dashboard") || "Dashboard"}
                  </Link>

                  <Link
                    to="/applications"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#F7F9FC] hover:text-[#173B57]"
                  >
                    📄 Applications
                  </Link>

                  {user.role === "worker" && (
                    <>
                      <Link
                        to="/edit-profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#F7F9FC] hover:text-[#173B57]"
                      >
                        👤 Edit Profile
                      </Link>
                      <Link
                        to="/voice-profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block rounded-xl px-4 py-2.5 text-xs font-bold text-[#0F9D8A] hover:bg-[#0F9D8A]/10"
                      >
                        🎙️ Vaani Voice Profile
                      </Link>
                    </>
                  )}

                  {user.role === "employer" && (
                    <Link
                      to="/post-job"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block rounded-xl px-4 py-2.5 text-xs font-bold text-[#0F9D8A] hover:bg-[#0F9D8A]/10"
                    >
                      ➕ Post New Job
                    </Link>
                  )}

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl px-4 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-50"
                  >
                    🚪 {t("nav.logout") || "Logout"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Language Selector */}
          <select
            value={language}
            onChange={handleLanguageChange}
            className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2 py-1.5 text-xs font-bold text-slate-700 outline-none"
            aria-label="Language"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="kn">KN</option>
            <option value="mr">MR</option>
            <option value="te">TE</option>
          </select>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-xl border border-[#E2E8F0] p-2 text-slate-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE COLLAPSIBLE MENU */}
      {menuOpen && (
        <div className="border-t border-[#E2E8F0] bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-2.5 hover:bg-[#F7F9FC]"
            >
              🏠 {t("nav.home") || "Home"}
            </Link>

            <Link
              to="/jobs"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-2.5 hover:bg-[#F7F9FC]"
            >
              💼 {t("nav.jobs") || "Find Jobs"}
            </Link>

            <Link
              to="/workers"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-2.5 hover:bg-[#F7F9FC]"
            >
              👷 {t("nav.workers") || "Find Workers"}
            </Link>

            <Link
              to="/#sathi"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-2.5 hover:bg-[#F7F9FC] text-[#0F9D8A]"
            >
              🤖 Rozgaar Saathi (AI Discovery)
            </Link>

            <Link
              to="/voice-profile"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-2.5 hover:bg-[#F7F9FC] text-[#0F9D8A]"
            >
              🎙️ Vaani AI (Voice Profile)
            </Link>

            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-2.5 hover:bg-[#F7F9FC]"
            >
              ℹ️ About Rozgaar Setu
            </Link>

            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-2.5 hover:bg-[#F7F9FC]"
            >
              📞 Contact & Help
            </Link>

            <div className="my-2 border-t border-slate-100" />

            {!user ? (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-[#173B57] py-2.5 text-center font-bold text-[#173B57]"
                >
                  {t("nav.login") || "Login"}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-[#173B57] py-2.5 text-center font-bold text-white shadow-sm"
                >
                  {t("nav.getStarted") || "Get Started"}
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-1 pt-1">
                <div className="px-4 py-2 bg-slate-50 rounded-xl mb-1">
                  <p className="text-xs font-bold text-slate-800">{user.name}</p>
                  <p className="text-[10px] uppercase font-bold text-[#0F9D8A]">{user.role}</p>
                </div>

                <Link
                  to={getDashboardPath()}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-2.5 font-bold text-[#173B57] hover:bg-[#F7F9FC]"
                >
                  📊 {t("nav.dashboard") || "Dashboard"}
                </Link>

                <Link
                  to="/applications"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-2.5 hover:bg-[#F7F9FC]"
                >
                  📄 View Applications
                </Link>

                {user.role === "worker" && (
                  <Link
                    to="/edit-profile"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-4 py-2.5 hover:bg-[#F7F9FC]"
                  >
                    👤 Edit Profile
                  </Link>
                )}

                {user.role === "employer" && (
                  <Link
                    to="/post-job"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-4 py-2.5 text-[#0F9D8A] hover:bg-[#F7F9FC]"
                  >
                    ➕ Post a Job
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="rounded-xl px-4 py-2.5 text-left font-bold text-red-600 hover:bg-red-50 mt-1"
                >
                  🚪 {t("nav.logout") || "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

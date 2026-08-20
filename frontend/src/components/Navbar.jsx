import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [menuOpen, setMenuOpen] = useState(false);

  const { language, changeLanguage, t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);
    navigate("/login");
  };

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

        {/* LOGO */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-md shadow-blue-200">
            R
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Rozgaar<span className="text-blue-600"> Setu</span>
            </h1>

            <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
              Local Skills. Local Opportunities.
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}

        <nav className="hidden items-center gap-7 md:flex">

          <Link
            to="/"
            className="text-sm font-semibold text-slate-700 transition hover:text-blue-600"
          >
            {t("nav.home")}
          </Link>

          <Link
            to="/jobs"
            className="text-sm font-semibold text-slate-700 transition hover:text-blue-600"
          >
            {t("nav.jobs")}
          </Link>

          <Link
            to="/workers"
            className="text-sm font-semibold text-slate-700 transition hover:text-blue-600"
          >
            {t("nav.workers")}
          </Link>

        </nav>

        {/* RIGHT SIDE */}

        <div className="hidden items-center gap-3 md:flex">

          {/* LANGUAGE SELECTOR */}

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">

            <span className="text-base">
              🌐
            </span>

            <select
              value={language}
              onChange={handleLanguageChange}
              className="cursor-pointer bg-transparent text-sm font-semibold text-slate-700 outline-none"
              aria-label={t("nav.language")}
            >
              <option value="en">
                English
              </option>

              <option value="hi">
                हिन्दी
              </option>

              <option value="kn">
                ಕನ್ನಡ
              </option>

              <option value="mr">
                मराठी
              </option>

              <option value="te">
                తెలుగు
              </option>
            </select>

          </div>

          {/* USER / AUTH */}

          {!user ? (
            <>

              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {t("nav.login")}
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
              >
                {t("nav.getStarted")}
              </Link>

            </>
          ) : (

            <div className="relative">

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <div className="text-left">

                  <p className="text-sm font-semibold text-slate-800">
                    {user.name}
                  </p>

                  <p className="text-xs capitalize text-slate-400">
                    {user.role}
                  </p>

                </div>

                <span className="text-slate-400">
                  {menuOpen ? "⌃" : "⌄"}
                </span>

              </button>

              {menuOpen && (

                <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">

                  <Link
                    to={
                      user.role === "worker"
                        ? "/worker"
                        : user.role === "employer"
                        ? "/employer"
                        : "/professional"
                    }
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {t("nav.dashboard")}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    {t("nav.logout")}
                  </button>

                </div>

              )}

            </div>

          )}

        </div>

        {/* MOBILE MENU BUTTON */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 md:hidden"
        >
          ☰
        </button>

      </div>

      {/* MOBILE NAVIGATION */}

      {menuOpen && (

        <div className="border-t border-slate-100 bg-white px-6 py-4 md:hidden">

          <div className="flex flex-col gap-2">

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              {t("nav.home")}
            </Link>

            <Link
              to="/jobs"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              {t("nav.jobs")}
            </Link>

            <Link
              to="/workers"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              {t("nav.workers")}
            </Link>

            {/* MOBILE LANGUAGE */}

            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3">

              <p className="mb-2 text-xs font-semibold text-slate-400">
                {t("nav.language")}
              </p>

              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full rounded-lg bg-white p-3 text-sm font-semibold text-slate-700 outline-none"
              >
                <option value="en">
                  English
                </option>

                <option value="hi">
                  हिन्दी
                </option>

                <option value="kn">
                  ಕನ್ನಡ
                </option>

                <option value="mr">
                  मराठी
                </option>

                <option value="te">
                  తెలుగు
                </option>
              </select>

            </div>

            {!user ? (

              <>

                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 font-semibold text-blue-600 hover:bg-blue-50"
                >
                  {t("nav.login")}
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white"
                >
                  {t("nav.getStarted")}
                </Link>

              </>

            ) : (

              <>

                <Link
                  to={
                    user.role === "worker"
                      ? "/worker"
                      : user.role === "employer"
                      ? "/employer"
                      : "/professional"
                  }
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 font-semibold text-blue-600 hover:bg-blue-50"
                >
                  {t("nav.dashboard")}
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-lg px-4 py-3 text-left font-semibold text-red-600 hover:bg-red-50"
                >
                  {t("nav.logout")}
                </button>

              </>

            )}

          </div>

        </div>

      )}

    </header>
  );
}

export default Navbar;
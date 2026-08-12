import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

        {/* Logo */}
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

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-semibold text-slate-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/jobs"
            className="text-sm font-semibold text-slate-700 transition hover:text-blue-600"
          >
            Find Jobs
          </Link>

          <Link
            to="/workers"
            className="text-sm font-semibold text-slate-700 transition hover:text-blue-600"
          >
            Find Workers
          </Link>
        </nav>

        {/* Right side */}
        <div className="hidden items-center gap-3 md:flex">

          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
              >
                Get Started
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
                    Go to Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 md:hidden"
        >
          ☰
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 md:hidden">

          <div className="flex flex-col gap-2">

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>

            <Link
              to="/jobs"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Find Jobs
            </Link>

            <Link
              to="/workers"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Find Workers
            </Link>

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 font-semibold text-blue-600 hover:bg-blue-50"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white"
                >
                  Get Started
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
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-lg px-4 py-3 text-left font-semibold text-red-600 hover:bg-red-50"
                >
                  Logout
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
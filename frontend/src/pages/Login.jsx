import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useLanguage } from "../context/LanguageContext";

function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const res = await loginUser(formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      switch (res.data.user?.role) {
        case "worker":
        case "professional":
          navigate("/worker");
          break;
        case "employer":
          navigate("/employer");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen md:h-screen items-center justify-center bg-[#F7F9FC] p-3 sm:p-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-xl">
        {/* LOGO & HEADING */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#173B57] text-lg font-black text-white shadow-xs">
              R
            </div>
          </Link>

          <h1 className="mt-2 text-xl font-black text-[#173B57]">
            {t("login.title") || "Welcome Back"}
          </h1>

          <p className="mt-0.5 text-[11px] text-slate-500">
            {t("login.subtitle") || "Login to access your employment dashboard"}
          </p>
        </div>

        {/* ERROR ALERT */}
        {errorMessage && (
          <div role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2 text-xs font-semibold text-red-700">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-[#0F9D8A] focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700">Password *</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-[#0F9D8A] focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-lg bg-[#173B57] py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#0f2638] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "🔐 Login to Account"}
          </button>
        </form>

        <div className="mt-4 border-t border-slate-100 pt-3 text-center text-xs text-slate-600">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-bold text-[#0F9D8A] hover:underline">
            Register Here
          </Link>
        </div>

        <div className="mt-2 text-center">
          <Link to="/" className="text-[11px] text-slate-400 hover:text-slate-600">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

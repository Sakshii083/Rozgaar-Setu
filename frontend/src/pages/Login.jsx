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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert(t("login.fillFields"));
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser(formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert(t("login.success"));

      switch (res.data.user.role) {
        case "worker":
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
      alert(
        error.response?.data?.message ||
          t("login.error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >

        {/* HEADER */}

        <div className="mb-8 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg shadow-blue-200">
            R
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            {t("login.title")}
          </h1>

          <p className="mt-2 text-gray-500">
            {t("login.subtitle")}
          </p>

        </div>

        {/* EMAIL */}

        <div className="mb-5">

          <label className="mb-2 block font-semibold text-gray-700">
            {t("login.email")}
          </label>

          <input
            type="email"
            name="email"
            placeholder={t(
              "login.emailPlaceholder"
            )}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            value={formData.email}
            onChange={handleChange}
          />

        </div>

        {/* PASSWORD */}

        <div className="mb-6">

          <label className="mb-2 block font-semibold text-gray-700">
            {t("login.password")}
          </label>

          <input
            type="password"
            name="password"
            placeholder={t(
              "login.passwordPlaceholder"
            )}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            value={formData.password}
            onChange={handleChange}
          />

        </div>

        {/* LOGIN */}

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl py-3 font-semibold text-white transition ${
            loading
              ? "cursor-not-allowed bg-gray-500"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? `⏳ ${t("login.loggingIn")}`
            : `🔐 ${t("login.button")}`}
        </button>

        {/* REGISTER */}

        <p className="mt-6 text-center text-gray-600">

          {t("login.noAccount")}{" "}

          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            {t("login.register")}
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Login;
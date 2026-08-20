import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { useLanguage } from "../context/LanguageContext";

function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "worker",
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

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.role
    ) {
      alert(t("register.fillFields"));
      return;
    }

    try {
      setLoading(true);

      const res = await registerUser(formData);

      alert(
        res.data.message ||
          t("register.success")
      );

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          t("register.error")
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
            {t("register.title")}
          </h1>

          <p className="mt-2 text-gray-500">
            {t("register.subtitle")}
          </p>

        </div>

        {/* NAME */}

        <div className="mb-4">

          <label className="mb-2 block font-semibold text-gray-700">
            {t("register.fullName")}
          </label>

          <input
            type="text"
            name="name"
            placeholder={t(
              "register.fullNamePlaceholder"
            )}
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* EMAIL */}

        <div className="mb-4">

          <label className="mb-2 block font-semibold text-gray-700">
            {t("register.email")}
          </label>

          <input
            type="email"
            name="email"
            placeholder={t(
              "register.emailPlaceholder"
            )}
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* PHONE */}

        <div className="mb-4">

          <label className="mb-2 block font-semibold text-gray-700">
            {t("register.phone")}
          </label>

          <input
            type="tel"
            name="phone"
            placeholder={t(
              "register.phonePlaceholder"
            )}
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* PASSWORD */}

        <div className="mb-4">

          <label className="mb-2 block font-semibold text-gray-700">
            {t("register.password")}
          </label>

          <input
            type="password"
            name="password"
            placeholder={t(
              "register.passwordPlaceholder"
            )}
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* ROLE */}

        <div className="mb-6">

          <label className="mb-2 block font-semibold text-gray-700">
            {t("register.role")}
          </label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            <option value="worker">
              {t("register.worker")}
            </option>

            <option value="employer">
              {t("register.employer")}
            </option>

            <option value="professional">
              {t("register.professional")}
            </option>
          </select>

        </div>

        {/* REGISTER BUTTON */}

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
            ? `⏳ ${t("register.registering")}`
            : `🚀 ${t("register.button")}`}
        </button>

        {/* LOGIN */}

        <p className="mt-6 text-center text-gray-600">

          {t("register.haveAccount")}{" "}

          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            {t("register.login")}
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Register;
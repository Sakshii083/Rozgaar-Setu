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

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const res = await registerUser({
        ...formData,
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
      });

      alert(res.data.message || "Account registered successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(
        error.response?.data?.message || "Registration failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen md:h-screen items-center justify-center bg-[#F7F9FC] p-3 sm:p-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5 shadow-xl">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#173B57] text-base font-black text-white shadow-xs">
              R
            </div>
          </Link>

          <h1 className="mt-1.5 text-lg font-black text-[#173B57]">
            {t("register.title") || "Create an Account"}
          </h1>

          <p className="mt-0.5 text-[11px] text-slate-500">
            {t("register.subtitle") || "Join Rozgaar Setu to connect with local jobs and talent"}
          </p>
        </div>

        {errorMessage && (
          <div role="alert" className="mt-2.5 rounded-lg border border-red-200 bg-red-50 p-2 text-xs font-semibold text-red-700">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-3 space-y-2 text-xs">
          <div>
            <label className="block font-bold text-slate-700">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={handleChange}
              className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs text-slate-800 outline-none transition focus:border-[#0F9D8A] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700">Email *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs text-slate-800 outline-none transition focus:border-[#0F9D8A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700">Phone *</label>
              <input
                type="tel"
                name="phone"
                required
                maxLength={10}
                placeholder="10-digit mobile"
                value={formData.phone}
                onChange={handleChange}
                className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs text-slate-800 outline-none transition focus:border-[#0F9D8A] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700">Password *</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="Min 6 chars"
                value={formData.password}
                onChange={handleChange}
                className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs text-slate-800 outline-none transition focus:border-[#0F9D8A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-0.5 w-full rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#0F9D8A] focus:bg-white"
              >
                <option value="worker">👷 Worker</option>
                <option value="employer">🏢 Employer</option>
                <option value="professional">👨‍🎓 Pro</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-[#0F9D8A] py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#0b7c6d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "🚀 Register Free"}
          </button>
        </form>

        <div className="mt-3 border-t border-slate-100 pt-2.5 text-center text-xs text-slate-600">
          <span>Already registered? </span>
          <Link to="/login" className="font-bold text-[#173B57] hover:underline">
            Login
          </Link>
        </div>

        <div className="mt-1.5 text-center">
          <Link to="/" className="text-[11px] text-slate-400 hover:text-slate-600">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;

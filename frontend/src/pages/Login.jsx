import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";

function Login() {
  const navigate = useNavigate();

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
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser(formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful!");

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
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border rounded p-3 mb-4"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border rounded p-3 mb-6"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-5">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold"
          >
            Register
          </Link>
        </p>
      </form>

    </div>
  );
}

export default Login;
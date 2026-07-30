import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "worker",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log("Register button clicked");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser(formData);

      alert(res.data.message);

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message || "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <select
          name="role"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        >
          <option value="worker">Worker</option>
          <option value="employer">Employer</option>
          <option value="professional">Professional</option>
        </select>

        <button
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;
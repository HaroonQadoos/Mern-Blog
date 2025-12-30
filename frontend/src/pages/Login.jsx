import React, { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      toast.success("user login successfully");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full max-w-lg p-6">
        <legend className="fieldset-legend text-lg font-bold">Login</legend>
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <label className="label mt-4">Email</label>
        <input
          type="email"
          name="email"
          className="input w-full focus:outline-none rounded-3xl"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <label className="label mt-4">Password</label>
        <input
          type="password"
          name="password"
          className="input w-full focus:outline-none rounded-3xl"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          className="btn btn-neutral w-full mt-6 rounded-3xl hover:text-white/90"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-700 hover:underline">
            Sign Up
          </Link>
        </p>
      </fieldset>
    </div>
  );
};

export default Login;

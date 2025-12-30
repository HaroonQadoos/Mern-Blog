import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.placeholder.toLowerCase()]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/register", formData);
      localStorage.setItem("signupPending", "true");
      toast.success("Signup request submitted. Waiting for admin approval.");

      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="fieldset bg-base-200 border-base-300 rounded-box w-full max-w-lg p-6"
      >
        <legend className="fieldset-legend text-lg font-bold">Signup</legend>

        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <label className="label mt-4">Username</label>
        <input
          type="username"
          className="input w-full focus:outline-none rounded-3xl"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />

        <label className="label mt-4">Email</label>
        <input
          type="email"
          className="input w-full focus:outline-none rounded-3xl"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <label className="label mt-4">Password</label>
        <input
          type="password"
          className="input w-full focus:outline-none rounded-3xl"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="btn btn-neutral w-full mt-6 rounded-3xl hover:text-white/90"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Signup"}
        </button>

        {/* Login Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-700 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;

import React, { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let newErrors = {};
    if (!formData.email) newErrors.email = "This is required";
    if (!formData.password) newErrors.password = "This is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // stop if errors
    }
    try {
      const { data } = await api.post("/auth/login", formData);
      toast.success("User logged in successfully");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c2541] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-10 rounded-box space-y-4"
      >
        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-[#f1f5f9]">Welcome Back!</h1>
          <p className="text-slate-300">Login to access your account.</p>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="label text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="
                input w-full h-12 rounded-3xl
                bg-[#1c2541] text-[#f1f5f9]
                border border-[#f1f5f9]/40
                focus:border-[#f1f5f9]/80
                transition-all duration-200
                focus:outline-none
              "
            />{" "}
            {errors.email && (
              <p className="text-white text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password with Eye */}
          <div>
            <label className="label text-slate-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="
                  input w-full h-12 pr-12 rounded-3xl
                  bg-[#1c2541] text-[#f1f5f9]
                  border border-[#f1f5f9]/40
                  focus:border-[#f1f5f9]/80 
                  transition-all duration-200
                  focus:outline-none
                "
              />
              {errors.password && (
                <p className="text-white text-sm">{errors.password}</p>
              )}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#f1f5f9]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full h-12 rounded-3xl
            bg-[#f1f5f9] hover:bg-[#e2e8f0]
            text-[#1c2541] font-medium
            transition-colors duration-200
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup Link */}
        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#f1f5f9] hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
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

    let newErrors = {};

    if (!formData.username) newErrors.username = "This is required";
    if (!formData.email) newErrors.email = "This is required";
    if (!formData.password) newErrors.password = "This is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // stop if errors
    }

    try {
      setLoading(true);
      await api.post("/auth/register", formData);
      localStorage.setItem("signupPending", "true");
      toast.success("Signup request submitted. Waiting for admin approval.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
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
          <h1 className="text-2xl font-bold text-[#f1f5f9]">Welcome!</h1>
          <p className="text-slate-300">
            Create your account and start sharing.
          </p>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {/* Username */}
          <div>
            <label className="label text-slate-300">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className=" input w-full h-12 rounded-3xl
  bg-[#1c2541] text-[#f1f5f9]
  border border-[#f1f5f9]/40
  focus:border-[#f1f5f9]/80
  focus:outline-none
  transition-colors duration-200"
              placeholder="Username"
            />{" "}
            {errors.username && (
              <p className="text-white text-sm">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="label text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className=" input w-full h-12 rounded-3xl
  bg-[#1c2541] text-[#f1f5f9]
  border border-[#f1f5f9]/40
  focus:border-[#f1f5f9]/80
  focus:outline-none
  transition-colors duration-200"
              placeholder="Email"
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
                className=" input w-full h-12 rounded-3xl
  bg-[#1c2541] text-[#f1f5f9]
  border border-[#f1f5f9]/40
  focus:border-[#f1f5f9]/80
  focus:outline-none
  transition-colors duration-200"
                placeholder="Password"
              />{" "}
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
            transition-colors duration-200 cursor-pointer
          "
        >
          {loading ? "Creating account..." : "Signup"}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-[#f1f5f9] hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Leaf } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data.message || "Login failed"
        );
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 mb-4">
            <Leaf className="h-8 w-8 text-emerald-400" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome Back
          </h1>

          <p className="text-slate-400 text-center text-sm">
            Log in to manage your green shopping space
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-5 text-center text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-205 shadow-glass"
          >
            <LogIn className="h-5 w-5" />
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-slate-400 mt-6 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
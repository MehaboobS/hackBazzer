import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaFacebook, FaGoogle, FaLinkedin, FaMicrosoft } from "react-icons/fa";
import { login as authLogin } from "../store/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await axios.post("/api/user/login", {
        username: username.trim(),
        password,
      });
      dispatch(authLogin(response.data.user));
      toast.success(response.data.message || "Logged in successfully!");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid username or password";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/user/auth/google";
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 text-xl text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-center text-2xl font-bold text-gray-900">
          Sign in to HackBazzer
        </h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Welcome back! Sign in to buy or sell projects
        </p>

        <div className="mt-5 flex justify-center space-x-3">
          <button
            type="button"
            className="rounded-md bg-gray-100 p-2.5 hover:bg-gray-200"
          >
            <FaFacebook className="text-lg text-blue-600" />
          </button>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="rounded-md bg-gray-100 p-2.5 hover:bg-gray-200"
          >
            <FaGoogle className="text-lg text-red-500" />
          </button>
          <button
            type="button"
            className="rounded-md bg-gray-100 p-2.5 hover:bg-gray-200"
          >
            <FaLinkedin className="text-lg text-blue-500" />
          </button>
          <button
            type="button"
            className="rounded-md bg-gray-100 p-2.5 hover:bg-gray-200"
          >
            <FaMicrosoft className="text-lg text-green-500" />
          </button>
        </div>

        <div className="my-5 flex items-center">
          <hr className="flex-grow border-gray-200" />
          <span className="mx-3 text-xs uppercase text-gray-400">or</span>
          <hr className="flex-grow border-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username"
              required
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-50 p-2.5 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 p-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Continue →"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/user/signup"
            className="font-semibold text-purple-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

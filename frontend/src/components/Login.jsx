import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFacebook, FaGoogle, FaLinkedin, FaMicrosoft } from "react-icons/fa";
import { login as authLogin } from "../store/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    console.log("hello i am close method"); // Redirect to Home Page
  };

  const handleClick = async () => {
    try {
      setError("");
      const response = await axios.post("/api/user/login", { username, password });
      console.log(response);
      console.log(response.data);
      dispatch(authLogin(response.data.user));
      alert(response.data.message);
    } catch (err) {
      console.error("Login error:", err.response?.data?.message || "Something went wrong");
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google login page
    window.location.href = "/api/user/auth/google";
    navigate('/')
  };

  return (
    <div className="m-4 flex items-center justify-center backdrop-blur-md">
      {/* Modal Box */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        {/* Close Button */}
        <button 
          onClick={handleClose} 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center">Sign in to Final Round AI</h2>
        <p className="text-gray-500 text-center mt-1">Welcome back! Please sign in to continue</p>

        {/* Social Login Buttons */}
        <div className="flex justify-center space-x-3 mt-4">
          <button className="bg-gray-200 p-2 rounded-md hover:bg-gray-300">
            <FaFacebook className="text-blue-600 text-lg" />
          </button>
          <button 
            onClick={handleGoogleLogin} 
            className="bg-gray-200 p-2 rounded-md hover:bg-gray-300"
          >
            <FaGoogle className="text-red-500 text-lg" />
          </button>
          <button className="bg-gray-200 p-2 rounded-md hover:bg-gray-300">
            <FaLinkedin className="text-blue-500 text-lg" />
          </button>
          <button className="bg-gray-200 p-2 rounded-md hover:bg-gray-300">
            <FaMicrosoft className="text-green-500 text-lg" />
          </button>
        </div>

        {/* Separator */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your email"
            className="w-full border rounded-md p-2 focus:ring focus:ring-orange-300 outline-none"
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border rounded-md p-2 focus:ring focus:ring-orange-300 outline-none"
          />
        </div>

        {/* Continue Button */}
        <button 
          onClick={handleClick}
          className="w-full bg-orange-500 text-white p-2 rounded-md mt-4 hover:bg-orange-600 transition"
        >
          Continue →
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        {/* Signup Link */}
        <p className="text-center text-gray-500 mt-3">
          Don't have an account? <a href="#" className="text-orange-500 font-semibold">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

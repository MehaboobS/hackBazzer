import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { logout } from "../store/authSlice";

export default function LogoutBtn({ onAfterLogout }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const response = await axios.get("/api/user/lg");
      dispatch(logout());
      toast.success(response.data?.message || "Logged out successfully!");
      onAfterLogout?.();
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log out");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-lg border border-gray-200 px-3.5 py-1.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
    >
      Log out
    </button>
  );
}

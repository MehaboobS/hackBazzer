import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { login as authLogin } from "./store/authSlice";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;
    axios
      .get("/api/user/me")
      .then((res) => {
        if (active && res.data?.authenticated && res.data?.user) {
          dispatch(authLogin(res.data.user));
        }
      })
      .catch(() => {
        // Ignore session check failures on initial load
      });
    return () => {
      active = false;
    };
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} HackBazzer — Project Marketplace &amp; Storefront
      </footer>
    </div>
  );
}

export default App;

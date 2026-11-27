import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  SparklesIcon,
  ShoppingBagIcon,
  RocketLaunchIcon,
  CodeBracketSquareIcon,
  CpuChipIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { Card } from "../components";

const CATEGORIES = [
  {
    name: "Software",
    description: "Full-stack web apps, SaaS kits, AI tools & APIs",
    icon: CodeBracketSquareIcon,
    color: "from-purple-500 to-indigo-600",
  },
  {
    name: "Hardware",
    description: "IoT prototypes, Arduino/Raspberry Pi builds & schematics",
    icon: CpuChipIcon,
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "Miscellaneous",
    description: "Design systems, templates, datasets & automation scripts",
    icon: Squares2X2Icon,
    color: "from-amber-500 to-orange-600",
  },
];

export default function Home() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const cartCount = useSelector((state) => state.cart.items.length);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    let active = true;
    axios
      .get("/api/listings")
      .then((res) => {
        if (active && Array.isArray(res.data)) {
          setFeaturedProjects(res.data.slice(0, 6));
        }
      })
      .catch(() => {
        // Storefront still renders hero & categories if catalog fetch fails
      })
      .finally(() => {
        if (active) setLoadingProjects(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const marqueePhrase = authStatus
    ? `✨ Welcome to the HackBazzer, ${userData?.username || "Builder"}! • Explore Ready-to-Launch Projects • Instant Source Code Access • Track Purchases in My Orders • Sell Your Own Builds • `
    : "🚀 Welcome to the HackBazzer • Buy & Sell Production-Ready Tech Projects • Software, Hardware & AI Kits • Secure Instant Checkout • ";

  return (
    <div className="bg-gray-50">
      {/* Moving Text Marquee Banner */}
      <div className="overflow-hidden bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 py-2.5 text-white shadow-sm">
        <div className="animate-marquee whitespace-nowrap text-sm font-semibold tracking-wide">
          <span className="mx-6">{marqueePhrase}</span>
          <span className="mx-6" aria-hidden="true">
            {marqueePhrase}
          </span>
        </div>
      </div>

      {/* Distinct Authenticated vs Guest Hero */}
      {authStatus ? (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 px-4 py-16 text-white lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-pink-300 ring-1 ring-white/20">
                  <SparklesIcon className="h-4 w-4" />
                  Member Storefront • Signed in as {userData?.username}
                </span>

                <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                  <span className="animate-gradient-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                    Welcome to the HackBazzer
                  </span>
                </h1>

                <p className="mt-4 text-lg text-purple-100/90">
                  Ready to ship faster, {userData?.username}? Discover verified full-stack &amp;
                  hardware projects, manage your purchased source code in{" "}
                  <span className="font-semibold text-white">My Orders</span>, or list your own
                  creation for sale.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/market"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
                  >
                    <RocketLaunchIcon className="h-4 w-4" />
                    Shop Marketplace
                  </Link>
                  <Link
                    to="/orders"
                    className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/25"
                  >
                    <ShoppingBagIcon className="h-4 w-4" />
                    My Orders
                  </Link>
                  <Link
                    to="/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-purple-900 transition hover:bg-purple-50"
                  >
                    + Sell a Project
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:w-96">
                <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-wider text-purple-200">Catalog</p>
                  <p className="mt-1 text-2xl font-bold">Live Projects</p>
                  <Link to="/market" className="mt-2 inline-block text-xs text-pink-300 hover:underline">
                    Browse all →
                  </Link>
                </div>
                <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-wider text-purple-200">Orders</p>
                  <p className="mt-1 text-2xl font-bold">Purchases</p>
                  <Link to="/orders" className="mt-2 inline-block text-xs text-pink-300 hover:underline">
                    View history →
                  </Link>
                </div>
                <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-wider text-purple-200">Cart</p>
                  <p className="mt-1 text-2xl font-bold">{cartCount} Items</p>
                  <Link to="/cart" className="mt-2 inline-block text-xs text-pink-300 hover:underline">
                    Go to cart →
                  </Link>
                </div>
                <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-wider text-purple-200">Creator Hub</p>
                  <p className="mt-1 text-2xl font-bold">Earn Money</p>
                  <Link to="/create" className="mt-2 inline-block text-xs text-pink-300 hover:underline">
                    Upload now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative isolate overflow-hidden bg-white px-4 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center rounded-full bg-purple-50 px-4 py-1.5 text-xs font-semibold text-purple-700 ring-1 ring-purple-200">
              One-Stop Project E-Commerce Marketplace
            </span>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              Buy &amp; Sell Innovative{" "}
              <span className="animate-gradient-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
                Projects on HackBazzer
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Discover production-ready software apps, hardware builds, and developer starter
              kits—or monetize your own creations with instant checkout and order tracking.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/user/signup"
                className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
              >
                Get Started Free
              </Link>
              <Link
                to="/market"
                className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                Explore Marketplace →
              </Link>
              <Link
                to="/user/login"
                className="text-sm font-semibold text-purple-700 hover:underline"
              >
                Already a member? Sign in
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Shop by Category */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link to="/market" className="text-sm font-semibold text-purple-700 hover:underline">
            View all categories →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/market?category=${encodeURIComponent(cat.name)}`}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md"
              >
                <div
                  className={`inline-flex rounded-xl bg-gradient-to-br ${cat.color} p-3 text-white`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-purple-700">
                  {cat.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{cat.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Projects Storefront Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Projects</h2>
            <p className="text-sm text-gray-500">
              Hand-picked projects ready to buy, clone, and deploy
            </p>
          </div>
          <Link
            to="/market"
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Browse All Projects
          </Link>
        </div>

        {loadingProjects ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-xl border border-gray-200 bg-white p-4"
              />
            ))}
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <Card key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            No projects listed yet.{" "}
            <Link to="/create" className="font-semibold text-purple-600 hover:underline">
              Be the first to list one!
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

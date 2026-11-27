import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  ShoppingBagIcon,
  CheckBadgeIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export default function MyOrders() {
  const authStatus = useSelector((state) => state.auth.status);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authStatus) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError("");

    axios
      .get("/api/payments/my-orders")
      .then((res) => {
        if (active) {
          setOrders(res.data?.orders || []);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.error ||
              err.message ||
              "Unable to load your orders."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authStatus]);

  if (!authStatus) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-purple-600" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Sign in to view My Orders
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Log in to track your purchased projects, payment receipts, and source repository links.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/user/login"
              className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Log in
            </Link>
            <Link
              to="/user/signup"
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
          <p className="mt-1 text-sm text-gray-600">
            View your completed project purchases, receipts, and source code access
          </p>
        </div>
        <Link
          to="/market"
          className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
        >
          Continue Shopping
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[1, 2].map((idx) => (
            <div
              key={idx}
              className="h-36 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-3 text-lg font-bold text-gray-900">No orders yet</h2>
          <p className="mt-1 text-sm text-gray-500">
            Explore the marketplace and purchase a project to see it listed here.
          </p>
          <Link
            to="/market"
            className="mt-5 inline-block rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Browse Projects
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => {
            const lineItems =
              Array.isArray(order.items) && order.items.length > 0
                ? order.items
                : order.projectId
                  ? [
                      {
                        projectId: order.projectId,
                        name: order.projectId?.name || order.projectName,
                        price: order.amount,
                        image: order.projectId?.image,
                      },
                    ]
                  : [];

            return (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm">
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <p className="text-xs uppercase text-gray-500">Order Placed</p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.paidAt || order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-500">Total Paid</p>
                      <p className="font-bold text-purple-700">
                        ₹{Number(order.amount).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-500">Order ID</p>
                      <p className="font-mono text-xs text-gray-700">{order.orderId}</p>
                    </div>
                    {order.paymentId && (
                      <div>
                        <p className="text-xs uppercase text-gray-500">Payment ID</p>
                        <p className="font-mono text-xs text-gray-700">{order.paymentId}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      <CheckBadgeIcon className="h-4 w-4" />
                      Paid ({order.method || order.mode})
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100 px-6">
                  {lineItems.length > 0 ? (
                    lineItems.map((item, idx) => {
                      const proj =
                        typeof item.projectId === "object" && item.projectId !== null
                          ? item.projectId
                          : null;
                      const projId = proj?._id || item.projectId;
                      return (
                        <div
                          key={projId || idx}
                          className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image || proj?.image || "/api/placeholder/120/90"}
                              alt={item.name || proj?.name || "Project"}
                              className="h-16 w-24 rounded-lg border border-gray-200 object-cover"
                            />
                            <div>
                              <h3 className="font-bold text-gray-900">
                                {item.name || proj?.name || order.projectName || "Project"}
                              </h3>
                              {proj?.category && (
                                <span className="mt-1 inline-block rounded bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                                  {proj.category}
                                </span>
                              )}
                              <p className="mt-1 text-sm font-semibold text-gray-700">
                                ₹{Number(item.price ?? order.amount).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {proj?.github && (
                              <a
                                href={proj.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
                              >
                                GitHub Repo
                                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                              </a>
                            )}
                            {proj?.demo && (
                              <a
                                href={proj.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg bg-pink-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-600"
                              >
                                Live Demo
                                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                              </a>
                            )}
                            {projId && (
                              <Link
                                to={`/singleCard/${projId}`}
                                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                              >
                                View Project
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-4 text-sm text-gray-700">
                      {order.projectName || "Project Purchase"} — ₹
                      {Number(order.amount).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI" },
  { id: "card", label: "Card" },
  { id: "netbanking", label: "NetBanking" },
];

export default function PaymentModal({ order, project, onSuccess, onClose }) {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("success@razorpay");
  const [bank, setBank] = useState("HDFC Bank");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!order) return null;

  const formattedAmount = `₹${Number(order.amount || project?.price || 0).toFixed(2)}`;

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/payments/verify", {
        orderId: order.orderId,
        method,
      });
      if (data?.payment) {
        onSuccess(data.payment);
      } else {
        setError("Unexpected response while verifying payment.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Payment verification failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-purple-700 px-6 py-4 text-white">
          <div>
            <p className="text-xs uppercase tracking-wider text-purple-200">
              HackBazzer Checkout
            </p>
            <h3 id="checkout-modal-title" className="text-lg font-bold">
              {project?.name || order.projectName || "Project Purchase"}
            </h3>
          </div>
          <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-gray-900">
            Test Mode
          </span>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4 p-6">
          <div className="flex items-center justify-between rounded-lg bg-purple-50 px-4 py-3">
            <div>
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="font-mono text-xs text-gray-700">{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total Payable</p>
              <p className="text-xl font-bold text-purple-800">{formattedAmount}</p>
            </div>
          </div>

          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Demo checkout is active because Razorpay keys in{" "}
            <code className="font-mono">backend/.env</code> are placeholders. Add real{" "}
            <code className="font-mono">RAZORPAY_KEY_ID</code> and{" "}
            <code className="font-mono">RAZORPAY_KEY_SECRET</code> to use live Razorpay Checkout.
          </p>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMethod(item.id)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    method === item.id
                      ? "border-purple-600 bg-purple-600 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {method === "upi" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                UPI ID
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-500"
              />
            </div>
          )}

          {method === "card" && (
            <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
              <p className="font-medium">Test Visa Card</p>
              <p className="font-mono text-xs">4111 •••• •••• 1111 | Exp 12/30</p>
            </div>
          )}

          {method === "netbanking" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Select Bank
              </label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-500"
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="State Bank of India">State Bank of India</option>
                <option value="Axis Bank">Axis Bank</option>
              </select>
            </div>
          )}

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 disabled:opacity-60"
            >
              {submitting ? "Verifying..." : `Pay ${formattedAmount}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

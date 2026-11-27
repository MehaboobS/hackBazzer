import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { TrashIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { removeFromCart, clearCart } from "../store/cartSlice";
import { PaymentModal } from "../components";
import { startCheckout } from "../utils/payment";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const currentUser = useSelector((state) => state.auth.userData);
  const [checkingOut, setCheckingOut] = useState(false);
  const [demoOrder, setDemoOrder] = useState(null);
  const [error, setError] = useState("");

  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setError("");
    setCheckingOut(true);

    await startCheckout({
      projectIds: items.map((item) => item._id),
      amount: totalAmount,
      description: `HackBazzer Cart (${items.length} project${items.length > 1 ? "s" : ""})`,
      currentUser,
      onDemoOrder: (order) => setDemoOrder(order),
      onSuccess: () => {
        dispatch(clearCart());
        toast.success("Payment successful! Your orders are ready.");
        navigate("/orders");
      },
      onError: (msg) => {
        setError(msg);
        toast.error(msg);
      },
      onFinally: () => setCheckingOut(false),
    });
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-12 shadow-xs">
          <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Your Cart is Empty
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Browse projects in the marketplace and add them to your cart to purchase together.
          </p>
          <Link
            to="/market"
            className="mt-6 inline-block rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Explore Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
      <p className="mt-1 text-sm text-gray-600">
        {items.length} project{items.length > 1 ? "s" : ""} ready for checkout
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image || "/api/placeholder/160/120"}
                  alt={item.name}
                  className="h-20 w-28 rounded-xl border border-gray-100 object-cover"
                />
                <div>
                  <Link
                    to={`/singleCard/${item._id}`}
                    className="text-lg font-bold text-gray-900 hover:text-purple-700"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-0.5 text-xs font-medium text-purple-600">
                    {item.category}
                  </p>
                  <p className="mt-1 text-base font-bold text-gray-900">
                    ₹{Number(item.price).toFixed(2)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  dispatch(removeFromCart(item._id));
                  toast.success(`Removed ${item.name} from cart`);
                }}
                className="inline-flex items-center gap-1.5 self-start rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 sm:self-center"
              >
                <TrashIcon className="h-4 w-4" />
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
          <div className="mt-4 space-y-2 border-b border-gray-100 pb-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items ({items.length})</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Platform Fee</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between text-lg font-extrabold text-gray-900">
            <span>Total</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={checkingOut}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
          >
            {checkingOut ? "Preparing Checkout..." : `Checkout ₹${totalAmount.toFixed(2)}`}
          </button>
        </div>
      </div>

      {demoOrder && (
        <PaymentModal
          order={demoOrder}
          project={{ name: `Cart (${items.length} projects)`, price: totalAmount }}
          onSuccess={() => {
            setDemoOrder(null);
            dispatch(clearCart());
            toast.success("Payment successful! Your orders are ready.");
            navigate("/orders");
          }}
          onClose={() => setDemoOrder(null)}
        />
      )}
    </div>
  );
}

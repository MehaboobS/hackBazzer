import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import PaymentModal from "./PaymentModal";
import { addToCart } from "../store/cartSlice";
import { startCheckout } from "../utils/payment";

export default function SingleCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [allReviews, setAllReviews] = useState([]);
  const [user] = useState("123456789");
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [demoOrder, setDemoOrder] = useState(null);
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  const currentUser = useSelector((state) => state.auth.userData);
  const inCart = useSelector((state) =>
    state.cart.items.some((item) => item._id === project?._id)
  );

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    try {
      const res = await axios.get(`/api/listings/project/${id}/allReviews`);
      if (res?.data?.reviews) {
        setAllReviews(res.data.reviews);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  }, [id]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`/api/listings/project/${id}`);
        setProject(response.data || null);
      } catch {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    fetchReviews();
  }, [id, fetchReviews]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`/api/listings/project/${id}`);
      toast.success("Project deleted");
      navigate("/market");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleStarClick = (starValue) => {
    setReview({ ...review, rating: starValue });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/listings/project/${id}/reviews`, review);
      setReview({ rating: 0, comment: "" });
      await fetchReviews();
      toast.success("Review submitted successfully!");
    } catch {
      toast.error("Failed to submit review");
    }
  };

  const handleAddToCart = () => {
    if (!project) return;
    if (inCart) {
      toast("Already in your cart");
      return;
    }
    dispatch(addToCart(project));
    toast.success(`${project.name} added to cart!`);
  };

  const handlePayment = async () => {
    if (!project) return;
    setPaymentError("");
    setPaying(true);

    await startCheckout({
      projectId: project._id,
      amount: project.price,
      description: project.name,
      currentUser,
      onDemoOrder: (order) => setDemoOrder(order),
      onSuccess: (payment) => {
        setPaymentReceipt(payment);
        toast.success("Payment successful! Saved to My Orders.");
      },
      onError: (msg) => {
        setPaymentError(msg);
        toast.error(msg);
      },
      onFinally: () => setPaying(false),
    });
  };

  if (loading) {
    return <div className="p-10 text-center text-purple-700">Loading...</div>;
  }
  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }
  if (!project) {
    return (
      <div className="p-10 text-center text-purple-700">Project not found</div>
    );
  }

  const isAuthor = project?.createdBy?._id === user;

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-white via-pink-50 to-purple-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={project.image || "/api/placeholder/800/600"}
                alt={project.name}
                className="h-64 w-full object-cover md:h-full"
              />
            </div>
            <div className="p-6 md:w-1/2">
              <span className="inline-block rounded-full bg-purple-100 px-3 py-0.5 text-xs font-semibold text-purple-700">
                {project.category}
              </span>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                {project.name}
              </h1>
              <p className="mt-2 text-gray-700">{project.description}</p>
              <p className="mt-3 text-2xl font-extrabold text-purple-700">
                ₹{Number(project.price).toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Created on {new Date(project.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-4 flex gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                  >
                    GitHub
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600"
                  >
                    Live Demo
                  </a>
                )}
              </div>

              {isAuthor ? (
                <div className="mt-6 flex gap-3">
                  <Link
                    to={`/listings/edit/${project._id}`}
                    className="rounded-lg bg-pink-400 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                        inCart
                          ? "border-green-300 bg-green-50 text-green-700"
                          : "border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100"
                      }`}
                    >
                      {inCart ? "In Cart ✓" : "Add to Cart"}
                    </button>
                    <button
                      type="button"
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:opacity-95 disabled:opacity-60"
                      onClick={handlePayment}
                      disabled={paying || Boolean(paymentReceipt)}
                    >
                      {paying
                        ? "Opening Checkout..."
                        : paymentReceipt
                          ? "Purchased ✓"
                          : "Buy Now"}
                    </button>
                  </div>

                  {paymentError && (
                    <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                      {paymentError}
                    </p>
                  )}

                  {paymentReceipt && (
                    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Payment Successful</p>
                        <span className="rounded bg-green-200 px-2 py-0.5 text-xs font-medium uppercase">
                          {paymentReceipt.mode === "demo"
                            ? "Test Mode"
                            : "Verified"}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs">
                        Payment ID: {paymentReceipt.paymentId}
                      </p>
                      <p className="font-mono text-xs">
                        Order ID: {paymentReceipt.orderId}
                      </p>
                      <p className="mt-1 text-xs">
                        Amount Paid: ₹{Number(paymentReceipt.amount).toFixed(2)}{" "}
                        ({paymentReceipt.method || "online"})
                      </p>
                      <Link
                        to="/orders"
                        className="mt-2 inline-block text-xs font-semibold text-green-800 underline"
                      >
                        View in My Orders →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-purple-100 p-6">
            <h2 className="mb-4 text-2xl font-bold text-purple-700">
              Leave a Review
            </h2>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="text-3xl focus:outline-none"
                    >
                      {star <= review.rating ? (
                        <span className="text-pink-500">★</span>
                      ) : (
                        <span className="text-gray-400">☆</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Write your comment"
                value={review.comment}
                onChange={(e) =>
                  setReview({ ...review, comment: e.target.value })
                }
                className="mb-4 w-full rounded-lg border border-purple-300 px-3 py-2"
                rows={3}
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Submit Review
              </button>
            </form>
          </div>

          <div className="border-t border-purple-100 bg-purple-50/60 p-6">
            <h2 className="mb-4 text-2xl font-bold text-purple-700">
              All Reviews
            </h2>
            {allReviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allReviews.map((r, index) => (
                  <div key={r._id || index} className="rounded-xl bg-white p-4 shadow-xs">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-lg font-semibold text-purple-700">
                        {r.stars} / 5
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {demoOrder && (
        <PaymentModal
          order={demoOrder}
          project={project}
          onSuccess={(payment) => {
            setPaymentReceipt(payment);
            setDemoOrder(null);
            toast.success("Payment successful! Saved to My Orders.");
          }}
          onClose={() => setDemoOrder(null)}
        />
      )}
    </div>
  );
}

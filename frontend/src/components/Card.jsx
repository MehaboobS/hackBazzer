import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { addToCart } from "../store/cartSlice";

const Card = ({ project }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inCart = useSelector((state) =>
    state.cart.items.some((item) => item._id === project._id)
  );

  const detailsPath = `/singleCard/${project._id}`;

  const handleCardClick = (e) => {
    if (e.target.closest("a, button")) return;
    navigate(detailsPath);
  };

  const handleCardKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(detailsPath);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (inCart) {
      toast("Already in your cart");
      return;
    }
    dispatch(addToCart(project));
    toast.success(`${project.name} added to cart!`);
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <div className="h-48 w-full overflow-hidden">
        <img
          src={project.image || "/api/placeholder/400/320"}
          alt={project.name}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      </div>

      <div className="flex flex-grow flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-lg font-bold text-gray-900 hover:text-purple-700">
            {project.name}
          </h3>
          <span className="whitespace-nowrap rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
            {project.category}
          </span>
        </div>

        <p className="mb-4 line-clamp-3 flex-grow text-sm text-gray-600">
          {project.description}
        </p>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-xl font-extrabold text-gray-900">
            ₹{Number(project.price).toFixed(2)}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            to={detailsPath}
            className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-3 py-2 text-center text-xs font-semibold text-white transition hover:opacity-95"
          >
            Buy / Details
          </Link>
          <button
            type="button"
            onClick={handleAddToCart}
            className={`inline-flex items-center justify-center gap-1 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              inCart
                ? "border-green-300 bg-green-50 text-green-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-purple-300 hover:text-purple-700"
            }`}
          >
            <ShoppingCartIcon className="h-4 w-4" />
            {inCart ? "In Cart ✓" : "Add to Cart"}
          </button>
        </div>

        {(project.github || project.demo) && (
          <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
            {project.github && (
              <a
                href={project.github}
                className="flex-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-center text-xs font-medium text-gray-700 hover:bg-gray-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                className="flex-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-center text-xs font-medium text-blue-700 hover:bg-blue-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;

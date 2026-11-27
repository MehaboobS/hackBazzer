import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import LogoutBtn from "./LogoutBtn";

const navItems = [
  { name: "Home", to: "/" },
  { name: "Marketplace", to: "/market" },
  { name: "Sell Project", to: "/create" },
  { name: "My Orders", to: "/orders" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const cartCount = useSelector((state) => state.cart.items.length);

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive ? "text-purple-700" : "text-gray-700 hover:text-purple-700"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 lg:px-8"
        aria-label="Global"
      >
        <div className="flex items-center gap-2 lg:flex-1">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-sm font-black text-white shadow-sm">
              HB
            </span>
            <span className="text-lg font-extrabold tracking-tight text-gray-900">
              Hack<span className="text-purple-600">Bazzer</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Link
            to="/cart"
            className="relative rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            aria-label="Cart"
          >
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navItems.map((item) => (
            <NavLink key={item.name} to={item.to} className={linkClass}>
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-4">
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:border-purple-300 hover:text-purple-700"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="ml-0.5 rounded-full bg-pink-500 px-1.5 py-0.5 text-xs font-bold leading-none text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {authStatus ? (
            <div className="flex items-center gap-3">
              <Link
                to="/orders"
                className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 ring-1 ring-purple-200 hover:bg-purple-100"
              >
                <ShoppingBagIcon className="h-3.5 w-3.5" />
                <span>{userData?.username || "Account"}</span>
              </Link>
              <LogoutBtn />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/user/login"
                className="text-sm font-semibold text-gray-700 hover:text-purple-700"
              >
                Log in
              </Link>
              <Link
                to="/user/signup"
                className="rounded-lg bg-purple-600 px-3.5 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-purple-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>

      <Dialog
        as="div"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50 bg-black/30" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-extrabold text-gray-900"
            >
              Hack<span className="text-purple-600">Bazzer</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200">
              <div className="space-y-2 py-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Cart ({cartCount})
                </Link>
              </div>
              <div className="py-6">
                {authStatus ? (
                  <div className="space-y-3">
                    <p className="px-3 text-sm font-medium text-purple-700">
                      Signed in as {userData?.username}
                    </p>
                    <LogoutBtn onAfterLogout={() => setMobileMenuOpen(false)} />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/user/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/user/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg bg-purple-600 px-3 py-2.5 text-center text-base font-semibold text-white hover:bg-purple-700"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

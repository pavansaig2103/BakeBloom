import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const links = [
  ["Home", "/"],
  ["Gallery", "/cakes"],
  ["Design Enquiry", "/custom-order"],
  ["Saved", "/cart"],
  ["Admin", "/admin"]
];

export default function Navbar() {
  const { count } = useCart();
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-blush text-lg font-bold text-white shadow-soft">CC</span>
          <span>
            <span className="block font-display text-2xl font-bold text-ganache">Cakes and Crunches</span>
            <span className="text-xs uppercase tracking-[0.18em] text-berry">Design Portal</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          {links.map(([label, href]) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition hover:bg-white hover:text-berry ${isActive ? "bg-white text-berry shadow-sm" : "text-cocoa"}`
              }
            >
              {label === "Saved" ? `Saved (${count})` : label}
            </NavLink>
          ))}
          {isLoggedIn && (
            <button onClick={logout} className="rounded-full bg-cocoa px-4 py-2 text-white transition hover:bg-berry">
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

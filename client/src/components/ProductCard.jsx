import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-soft transition duration-300 hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden bg-blush/30">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-berry">{product.category}</p>
            <h3 className="mt-2 font-display text-xl font-bold text-ganache">{product.name}</h3>
          </div>
          <span className="rounded-full bg-butter/70 px-3 py-1 text-sm font-bold">★ {product.rating}</span>
        </div>
        <p className="mt-3 min-h-12 text-sm leading-6 text-cocoa/70">{product.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <p className="text-xl font-extrabold text-ganache">₹{product.price}</p>
          <Link to={`/cakes/${product._id}`} className="rounded-full bg-cocoa px-5 py-2 text-sm font-bold text-white transition hover:bg-berry">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

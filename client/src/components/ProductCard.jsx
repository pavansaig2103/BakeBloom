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
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-berry">{product.referenceId || "Reference Design"}</p>
            <h3 className="mt-2 font-display text-xl font-bold text-ganache">{product.name}</h3>
          </div>
          <span className="rounded-full bg-butter/70 px-3 py-1 text-sm font-bold">{product.availability || "Ref"}</span>
        </div>
        <div className="mt-4 grid gap-2 text-sm text-cocoa/70">
          <p><strong>Occasion:</strong> {product.occasion || product.category}</p>
          <p><strong>Theme:</strong> {product.theme || "Signature"}</p>
          <p><strong>Flavor:</strong> {product.flavour || "Customizable"}</p>
          <p><strong>Size:</strong> {product.size || product.weight || "Customizable"}</p>
          <p><strong>Price range:</strong> {product.priceRange || `Rs. ${product.price}`}</p>
        </div>
        {!!product.tags?.length && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-cocoa/65">{tag}</span>)}
          </div>
        )}
        <p className="mt-3 min-h-12 text-sm leading-6 text-cocoa/70">{product.description}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link to={`/cakes/${product._id}`} className="rounded-full border border-cocoa/15 px-4 py-2 text-center text-sm font-bold text-cocoa transition hover:border-berry hover:text-berry">
            View Details
          </Link>
          <Link to={`/cakes/${product._id}`} className="rounded-full bg-cocoa px-4 py-2 text-center text-sm font-bold text-white transition hover:bg-berry">
            Request Similar
          </Link>
        </div>
      </div>
    </article>
  );
}

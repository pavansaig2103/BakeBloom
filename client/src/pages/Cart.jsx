import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, removeItem, total } = useCart();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-ganache">Saved Inspirations</h1>
      {items.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-soft">
          <p className="font-semibold">No reference designs saved yet.</p>
          <Link to="/cakes" className="mt-5 inline-block rounded-full bg-cocoa px-6 py-3 font-bold text-white">Browse Gallery</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.cartId} className="grid gap-4 rounded-3xl bg-white p-4 shadow-soft sm:grid-cols-[130px_1fr_auto]">
                <img src={item.image} alt={item.name} className="h-32 w-full rounded-2xl object-cover sm:w-32" />
                <div>
                  <h2 className="font-display text-2xl font-bold text-ganache">{item.name}</h2>
                  <p className="mt-2 text-sm text-cocoa/70">Reference ID: {item.referenceId || "To be assigned"}</p>
                  <p className="text-sm text-cocoa/70">Preferred flavor: {item.flavour} | Weight: {item.size}</p>
                  <p className="text-sm text-cocoa/70">Notes: {item.message || "None"}</p>
                  <p className="text-sm text-cocoa/70">Required date: {item.deliveryDate || "To be confirmed"}</p>
                  <p className="text-sm text-cocoa/70">Quantity: {item.quantity}</p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                  <p className="text-xl font-extrabold">Rs. {item.price * item.quantity}</p>
                  <button onClick={() => removeItem(item.cartId)} className="mt-3 rounded-full bg-blush/25 px-4 py-2 text-sm font-bold text-berry">Remove</button>
                </div>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="font-display text-2xl font-bold text-ganache">Enquiry Summary</h2>
            <div className="mt-5 flex justify-between border-b border-cocoa/10 pb-4">
              <span>Estimated design value</span>
              <strong>Rs. {total}</strong>
            </div>
            <div className="mt-4 flex justify-between">
              <span>Final quote</span>
              <strong>After consultation</strong>
            </div>
            <Link to="/checkout" className="mt-6 block rounded-full bg-cocoa px-6 py-3 text-center font-bold text-white transition hover:bg-berry">Submit Design Enquiry</Link>
          </aside>
        </div>
      )}
    </section>
  );
}

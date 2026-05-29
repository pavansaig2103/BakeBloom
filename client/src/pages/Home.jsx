import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

const categories = ["Birthday Cakes", "Chocolate Cakes", "Cupcakes", "Pastries"];

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data.slice(0, 4))).catch(() => setProducts([]));
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(110deg,#fff8ed_0%,#fff8ed_45%,#f7b7c9_100%)]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-20">
          <div>
            <p className="font-bold uppercase tracking-[0.22em] text-berry">Fresh daily, made with care</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-tight text-ganache sm:text-6xl">
              Freshly Baked Cakes for Every Celebration
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-cocoa/75">
              Explore signature cakes, sweet pastries, and custom designs prepared by our bakery team with premium ingredients.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/cakes" className="rounded-full bg-cocoa px-7 py-3 font-bold text-white shadow-soft transition hover:bg-berry">Order Now</Link>
              <Link to="/custom-order" className="rounded-full border border-cocoa/20 bg-white px-7 py-3 font-bold text-cocoa transition hover:border-berry hover:text-berry">Customize Cake</Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1557925923-cd4648e211a0?auto=format&fit=crop&w=1000&q=85"
              alt="Decorated bakery cake"
              className="h-[360px] w-full rounded-[2rem] object-cover shadow-soft sm:h-[470px]"
            />
            <div className="absolute -bottom-6 left-6 rounded-3xl bg-white p-5 shadow-soft">
              <p className="font-display text-3xl font-bold text-ganache">4.9★</p>
              <p className="text-sm text-cocoa/70">Loved by 2,000+ celebrations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-ganache">Featured Categories</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category} to="/cakes" className="rounded-3xl bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:text-berry">
              <p className="text-3xl">●</p>
              <h3 className="mt-5 font-display text-2xl font-bold">{category}</h3>
              <p className="mt-2 text-sm text-cocoa/65">Freshly baked favorites for every table.</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold text-ganache">Best Selling Cakes</h2>
          <Link to="/cakes" className="font-bold text-berry">View all</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        {["Fresh Ingredients", "Same-Day Delivery", "Custom Designs"].map((item) => (
          <div key={item} className="rounded-3xl bg-white p-7 shadow-soft">
            <h3 className="font-display text-2xl font-bold text-ganache">{item}</h3>
            <p className="mt-3 leading-7 text-cocoa/70">Thoughtful bakery service that keeps celebrations smooth, sweet, and beautifully made.</p>
          </div>
        ))}
      </section>

      <section className="bg-white/65 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-ganache">Happy Customers</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {["The cake arrived fresh and looked exactly like the design we wanted.", "Beautiful packaging, soft sponge, and a smooth ordering experience.", "BakeBloom made our birthday party feel extra special."].map((quote, index) => (
              <blockquote key={quote} className="rounded-3xl bg-cream p-6 shadow-soft">
                <p className="leading-7 text-cocoa/75">“{quote}”</p>
                <footer className="mt-4 font-bold text-berry">Customer {index + 1}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

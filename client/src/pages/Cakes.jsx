import React, { useEffect, useMemo, useState } from "react";
import api from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Cakes() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data)).catch(() => setProducts([]));
  }, []);

  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const categoryMatch = category === "All" || product.category === category;
        const priceMatch = product.price <= maxPrice;
        const searchMatch = product.name.toLowerCase().includes(search.toLowerCase());
        return categoryMatch && priceMatch && searchMatch;
      }),
    [products, category, maxPrice, search]
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-bold uppercase tracking-[0.2em] text-berry">Our bakery shelf</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-ganache">Cakes & Sweet Treats</h1>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cakes" className="input" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <label className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold shadow-sm">
            Max ₹{maxPrice}
            <input type="range" min="150" max="2500" step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="mt-2 w-full accent-berry" />
          </label>
        </div>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
      {filtered.length === 0 && <p className="mt-10 rounded-3xl bg-white p-8 text-center font-semibold shadow-soft">No cakes match your filters.</p>}
    </section>
  );
}

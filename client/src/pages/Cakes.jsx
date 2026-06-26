import React, { useEffect, useMemo, useState } from "react";
import api from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

const priceRanges = ["All", "Under Rs. 750", "Rs. 750 - Rs. 1500", "Rs. 1500 - Rs. 2500", "Rs. 2500+"];
const quickCategories = ["Birthday", "Wedding", "Anniversary", "Corporate", "Festival", "Brownies", "Cookies", "Pastries", "Sweet Boxes"];

export default function Cakes() {
  const [products, setProducts] = useState([]);
  const [occasion, setOccasion] = useState("All");
  const [theme, setTheme] = useState("All");
  const [flavour, setFlavour] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data)).catch(() => setProducts([]));
  }, []);

  const filterValues = (key) => ["All", ...new Set(products.map((product) => product[key]).filter(Boolean))];

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const occasionMatch = occasion === "All" || product.occasion === occasion || product.category === occasion;
        const themeMatch = theme === "All" || product.theme === theme;
        const flavourMatch = flavour === "All" || product.flavour === flavour;
        const priceMatch = priceRange === "All" || product.priceRange === priceRange;
        const searchText = `${product.name} ${product.referenceId} ${product.description} ${product.theme} ${product.priceRange} ${product.price} ${product.occasion} ${product.category} ${(product.tags || []).join(" ")}`.toLowerCase();
        return occasionMatch && themeMatch && flavourMatch && priceMatch && searchText.includes(search.toLowerCase());
      }),
    [products, occasion, theme, flavour, priceRange, search]
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-bold uppercase tracking-[0.2em] text-berry">Design inspiration gallery</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-ganache">Cake Designs for Cakes and Crunches</h1>
          <p className="mt-3 max-w-2xl leading-7 text-cocoa/70">
            Browse completed cake designs by occasion, theme, flavor, and price range, then use any design as a reference for a faster enquiry.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, theme, price, occasion" className="input" />
          <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="input">
            {filterValues("occasion").map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="input">
            {filterValues("theme").map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={flavour} onChange={(e) => setFlavour(e.target.value)} className="input">
            {filterValues("flavour").map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="input">
            {priceRanges.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {["All", ...quickCategories].map((item) => (
          <button key={item} onClick={() => setOccasion(item)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${occasion === item ? "bg-cocoa text-white" : "bg-white text-cocoa shadow-sm hover:text-berry"}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
      {filtered.length === 0 && <p className="mt-10 rounded-3xl bg-white p-8 text-center font-semibold shadow-soft">No cake designs match your filters.</p>}
    </section>
  );
}

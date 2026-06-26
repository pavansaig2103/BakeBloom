import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

const categories = [
  {
    name: "Birthday Cakes",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80",
    copy: "Theme cakes, truffle cakes, photo cakes, and custom toppers."
  },
  {
    name: "Wedding Cakes",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=80",
    copy: "Elegant tiered designs, florals, pastels, and premium finishes."
  },
  {
    name: "Brownies & Cookies",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
    copy: "Gift boxes, party trays, and crunchy dessert add-ons."
  },
  {
    name: "Festival Sweet Boxes",
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80",
    copy: "Curated dessert boxes for celebrations, teams, and family gifting."
  }
];

const orderSteps = [
  "Pick a cake design you like",
  "Share your date, flavour, size, and budget",
  "Confirm the final design and price",
  "Collect from store or choose delivery"
];

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data)).catch(() => setProducts([]));
  }, []);

  const featured = useMemo(
    () => [...products].sort((a, b) => Number(b.isPopular) - Number(a.isPopular)).slice(0, 4),
    [products]
  );

  const whatsappText = encodeURIComponent("Hi Cakes and Crunches, I want to browse cake designs and place an enquiry.");

  return (
    <>
      <section className="relative overflow-hidden bg-cream">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1557925923-cd4648e211a0?auto=format&fit=crop&w=1600&q=85"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-20">
          <div>
            <p className="font-bold uppercase tracking-[0.22em] text-berry">Cakes and Crunches</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-tight text-ganache sm:text-6xl">
              Custom cakes made easier to choose, personalise, and order.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-cocoa/75">
              Browse real cake references by occasion, theme, flavour, size, and budget. Pick a design you love and send your enquiry in minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/cakes" className="rounded-full bg-cocoa px-7 py-3 font-bold text-white shadow-soft transition hover:bg-berry">
                Browse Cake Designs
              </Link>
              <Link to="/custom-order" className="rounded-full border border-cocoa/20 bg-white px-7 py-3 font-bold text-cocoa transition hover:border-berry hover:text-berry">
                Start Design Enquiry
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85"
              alt="Chocolate cake from Cakes and Crunches"
              className="h-[360px] w-full rounded-[2rem] object-cover shadow-soft sm:h-[500px]"
            />
            <div className="absolute bottom-5 left-5 max-w-xs rounded-3xl bg-white/95 p-5 shadow-soft">
              <p className="font-display text-3xl font-bold text-ganache">Fresh custom designs</p>
              <p className="mt-1 text-sm text-cocoa/70">Birthdays, weddings, corporate events, festivals, and dessert boxes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-bold uppercase tracking-[0.18em] text-berry">Featured designs</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ganache">Customer favourites</h2>
          </div>
          <Link to="/cakes" className="font-bold text-berry">View full gallery</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
        {!featured.length && <p className="mt-8 rounded-3xl bg-white p-8 text-center font-semibold shadow-soft">Cake designs will appear here once added.</p>}
      </section>

      <section className="bg-white/65 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-bold uppercase tracking-[0.18em] text-berry">Popular categories</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ganache">Find the right sweet for every celebration</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.name} to="/cakes" className="group overflow-hidden rounded-3xl bg-cream shadow-soft transition hover:-translate-y-1">
                <img src={category.image} alt={category.name} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <h3 className="font-display text-2xl font-bold text-ganache">{category.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-cocoa/70">{category.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="font-bold uppercase tracking-[0.18em] text-berry">How to order</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ganache">From design idea to celebration-ready cake</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {orderSteps.map((step, index) => (
            <div key={step} className="rounded-3xl bg-white p-6 shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-berry font-bold text-white">{index + 1}</span>
              <p className="mt-4 font-bold text-cocoa">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-3xl bg-cocoa p-7 text-white shadow-soft md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold">Need help choosing a cake?</h2>
            <p className="mt-2 text-white/75">Send your occasion date, budget, and favourite design reference on WhatsApp.</p>
          </div>
          <a
            href={`https://wa.me/919876543210?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white px-7 py-3 text-center font-bold text-cocoa transition hover:bg-butter"
          >
            WhatsApp Cakes and Crunches
          </a>
        </div>
      </section>
    </>
  );
}

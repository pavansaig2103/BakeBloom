import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

const categories = ["Birthday", "Anniversary", "Wedding", "Corporate"];

const infoSections = [
  {
    title: "Problem They Face",
    body: "Currently, cake design photos are scattered across WhatsApp, Instagram, spreadsheets, and manual records. This makes it difficult for customers to quickly find design references and for staff to convert enquiries into confirmed orders."
  },
  {
    title: "What We Are Building",
    body: "Cake Photo Gallery & Design Inspiration Portal stores completed cake designs in one centralized system. Customers can browse designs by occasion, theme, flavor, and price range. Staff can manage designs, track enquiries, and view analytics from the admin dashboard."
  },
  {
    title: "Benefits for Cakes and Crunches",
    body: "The portal gives staff a searchable design library, helps customers select references faster, improves enquiry quality, and supports faster conversion from interest to confirmed cake requests."
  }
];

const workflow = [
  "Admin logs into dashboard",
  "Staff adds cake design details through a validated form",
  "Designs are organized by occasion, theme, flavor, and price range",
  "Customers browse gallery and select a reference design",
  "Customer sends enquiry through WhatsApp or enquiry form",
  "Staff tracks enquiry status",
  "Admin views reports and analytics",
  "System is deployed through public URL"
];

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
            <p className="font-bold uppercase tracking-[0.22em] text-berry">Cakes and Crunches</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-tight text-ganache sm:text-6xl">
              Cake Photo Gallery & Design Inspiration Portal
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-cocoa/75">
              A centralized gallery of completed cake designs where customers browse by occasion, theme, flavor, and price range, then use a design as reference while sending an enquiry.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/cakes" className="rounded-full bg-cocoa px-7 py-3 font-bold text-white shadow-soft transition hover:bg-berry">Explore Gallery</Link>
              <Link to="/custom-order" className="rounded-full border border-cocoa/20 bg-white px-7 py-3 font-bold text-cocoa transition hover:border-berry hover:text-berry">Submit Design Enquiry</Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1557925923-cd4648e211a0?auto=format&fit=crop&w=1000&q=85"
              alt="Decorated cake design reference"
              className="h-[360px] w-full rounded-[2rem] object-cover shadow-soft sm:h-[470px]"
            />
            <div className="absolute -bottom-6 left-6 rounded-3xl bg-white p-5 shadow-soft">
              <p className="font-display text-3xl font-bold text-ganache">Fast enquiries</p>
              <p className="text-sm text-cocoa/70">Reference-led ordering for staff and customers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-ganache">Browse by Occasion</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category} to="/cakes" className="rounded-3xl bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:text-berry">
              <p className="text-3xl text-berry">Ref</p>
              <h3 className="mt-5 font-display text-2xl font-bold">{category}</h3>
              <p className="mt-2 text-sm text-cocoa/65">Completed cake references organized for faster selection.</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold text-ganache">Popular Cake Designs</h2>
          <Link to="/cakes" className="font-bold text-berry">View gallery</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        {infoSections.map((section) => (
          <div key={section.title} className="rounded-3xl bg-white p-7 shadow-soft">
            <h3 className="font-display text-2xl font-bold text-ganache">{section.title}</h3>
            <p className="mt-3 leading-7 text-cocoa/70">{section.body}</p>
          </div>
        ))}
      </section>

      <section className="bg-white/65 py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-berry">How the System Works</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-ganache">From design upload to confirmed request</h2>
            <p className="mt-5 leading-8 text-cocoa/75">
              The portal keeps the customer-facing gallery and admin management connected, helping Cakes and Crunches convert enquiries faster.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {workflow.map((item, index) => (
              <div key={item} className="rounded-2xl bg-cream p-4 font-semibold shadow-sm">
                <span className="text-berry">{index + 1}. </span>{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-7 shadow-soft">
          <h2 className="font-display text-3xl font-bold text-ganache">Technology Stack</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {["Frontend: React, HTML, CSS, JavaScript", "Backend: Node.js, Express.js", "Database: MongoDB with in-memory fallback", "Charts: CSS dashboard charts"].map((item) => (
              <p key={item} className="rounded-2xl bg-cream p-4 font-semibold text-cocoa/75">{item}</p>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-cocoa/65">PostgreSQL/MySQL schema can be added as per internship requirement; this prototype includes a SQL schema file for database design review.</p>
        </div>
      </section>
    </>
  );
}

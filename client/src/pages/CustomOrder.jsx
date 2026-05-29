import React, { useState } from "react";
import api from "../api.js";

export default function CustomOrder() {
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    theme: "",
    weight: "",
    flavour: "Chocolate",
    occasion: "",
    budget: "",
    requiredDate: "",
    notes: ""
  });

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/custom-cake-requests", { ...form, budget: Number(form.budget || 0) });
    setSuccess(true);
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-bold uppercase tracking-[0.2em] text-berry">Design your dream cake</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-ganache">Custom Cake Order</h1>
          <p className="mt-5 leading-8 text-cocoa/75">Share your theme, flavour, date, and budget. Our bakery team will shape it into a celebration centerpiece.</p>
        </div>
        <form onSubmit={submit} className="rounded-[2rem] bg-white p-6 shadow-soft sm:p-8">
          {success ? (
            <div className="rounded-3xl bg-cream p-6 text-center">
              <h2 className="font-display text-3xl font-bold text-ganache">Request submitted</h2>
              <p className="mt-4 leading-7 text-cocoa/75">Your custom cake request has been submitted. Our bakery team will contact you soon.</p>
            </div>
          ) : (
            <div className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="field">Customer name<input required className="input mt-2" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></label>
                <label className="field">Phone number<input required className="input mt-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
                <label className="field">Theme<input required className="input mt-2" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} placeholder="Princess, football, floral" /></label>
                <label className="field">Weight<input required className="input mt-2" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="1.5kg" /></label>
                <label className="field">Flavour<select className="input mt-2" value={form.flavour} onChange={(e) => setForm({ ...form, flavour: e.target.value })}>{["Chocolate", "Vanilla", "Red Velvet", "Butterscotch", "Black Forest"].map((item) => <option key={item}>{item}</option>)}</select></label>
                <label className="field">Occasion<input className="input mt-2" value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} /></label>
                <label className="field">Budget<input className="input mt-2" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></label>
                <label className="field">Required date<input required className="input mt-2" type="date" value={form.requiredDate} onChange={(e) => setForm({ ...form, requiredDate: e.target.value })} /></label>
              </div>
              <label className="field">Reference image<input className="input mt-2 file:mr-4 file:rounded-full file:border-0 file:bg-blush file:px-4 file:py-2 file:font-bold file:text-white" type="file" /></label>
              <label className="field">Additional notes<textarea className="input mt-2 min-h-28" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
              <button className="rounded-full bg-cocoa px-7 py-3 font-bold text-white transition hover:bg-berry">Submit</button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

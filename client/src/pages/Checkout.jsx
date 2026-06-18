import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { useCart } from "../context/CartContext.jsx";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState(null);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    deliveryDate: "",
    deliverySlot: "10:00 AM - 12:00 PM",
    paymentMode: "Pay at Store"
  });

  const submit = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/orders", { ...form, items, totalAmount: total });
    setConfirmation(data);
    clearCart();
  };

  if (items.length === 0 && !confirmation) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <h1 className="font-display text-3xl font-bold">Save a reference design first.</h1>
          <Link to="/cakes" className="mt-5 inline-block rounded-full bg-cocoa px-6 py-3 font-bold text-white">Browse Gallery</Link>
        </div>
      </section>
    );
  }

  if (confirmation) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-soft">
          <p className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush text-3xl text-white">OK</p>
          <h1 className="mt-5 font-display text-4xl font-bold text-ganache">Design enquiry submitted</h1>
          <div className="mx-auto mt-6 max-w-md rounded-3xl bg-cream p-5 text-left leading-8">
            <p><strong>Enquiry ID:</strong> {confirmation._id}</p>
            <p><strong>Customer:</strong> {confirmation.customerName}</p>
            <p><strong>Required date:</strong> {confirmation.deliveryDate}, {confirmation.deliverySlot}</p>
            <p><strong>Estimated value:</strong> Rs. {confirmation.totalAmount}</p>
          </div>
          <button onClick={() => navigate("/")} className="mt-7 rounded-full bg-cocoa px-7 py-3 font-bold text-white">Back Home</button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-ganache">Submit Design Enquiry</h1>
      <form onSubmit={submit} className="mt-8 grid gap-5 rounded-[2rem] bg-white p-6 shadow-soft sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="field">Full name<input required className="input mt-2" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></label>
          <label className="field">Phone number<input required className="input mt-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <label className="field">Email<input className="input mt-2" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label className="field">Required date<input required className="input mt-2" type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} /></label>
          <label className="field">Preferred contact slot
            <select className="input mt-2" value={form.deliverySlot} onChange={(e) => setForm({ ...form, deliverySlot: e.target.value })}>
              {["10:00 AM - 12:00 PM", "12:00 PM - 2:00 PM", "4:00 PM - 6:00 PM", "6:00 PM - 9:00 PM"].map((slot) => <option key={slot}>{slot}</option>)}
            </select>
          </label>
          <label className="field">Payment preference
            <select className="input mt-2" value={form.paymentMode} onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}>
              <option>Pay at Store</option>
              <option>Cash on Delivery</option>
            </select>
          </label>
        </div>
        <label className="field">Address or event location<textarea required className="input mt-2 min-h-28" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
        <div className="flex flex-col gap-4 rounded-3xl bg-cream p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xl font-bold">Estimated value: Rs. {total}</p>
          <button className="rounded-full bg-cocoa px-7 py-3 font-bold text-white transition hover:bg-berry">Submit Enquiry</button>
        </div>
      </form>
    </section>
  );
}

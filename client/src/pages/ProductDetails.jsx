import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api.js";
import { useCart } from "../context/CartContext.jsx";

const flavours = ["Chocolate", "Vanilla", "Red Velvet", "Butterscotch", "Black Forest"];
const sizes = ["500g", "1kg", "1.5kg", "2kg"];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({ flavour: "Chocolate", size: "1kg", message: "", deliveryDate: "", quantity: 1 });

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data)).catch(() => setProduct(null));
  }, [id]);

  if (!product) {
    return <div className="mx-auto max-w-7xl px-4 py-16 font-semibold">Loading design details...</div>;
  }

  const addToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      referenceId: product.referenceId,
      ...form,
      quantity: Number(form.quantity)
    });
    navigate("/cart");
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Cakes and Crunches, I liked this cake design: ${product.name}, Reference ID: ${product.referenceId}. I want to order a similar design.`
  );

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <img src={product.image} alt={product.name} className="h-[360px] w-full rounded-[2rem] object-cover shadow-soft lg:h-[620px]" />
      <div className="rounded-[2rem] bg-white p-6 shadow-soft sm:p-8">
        <p className="font-bold uppercase tracking-[0.2em] text-berry">Design Details</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-ganache">{product.name}</h1>
        <div className="mt-5 grid gap-3 rounded-3xl bg-cream p-5 text-sm text-cocoa/75 sm:grid-cols-2">
          <p><strong>Reference ID:</strong> {product.referenceId}</p>
          <p><strong>Occasion:</strong> {product.occasion || product.category}</p>
          <p><strong>Theme:</strong> {product.theme}</p>
          <p><strong>Flavor:</strong> {product.flavour}</p>
          <p><strong>Weight:</strong> {product.weight}</p>
          <p><strong>Price Range:</strong> {product.priceRange}</p>
        </div>
        <p className="mt-5 leading-8 text-cocoa/75">{product.description}</p>
        <div className="mt-8 grid gap-4">
          <label className="field">Preferred flavor
            <select className="input mt-2" value={form.flavour} onChange={(e) => setForm({ ...form, flavour: e.target.value })}>
              {flavours.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="field">Preferred weight
            <select className="input mt-2" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
              {sizes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="field">Notes for similar design
            <input className="input mt-2" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Need this in blue and gold" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field">Required date
              <input className="input mt-2" type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} />
            </label>
            <label className="field">Quantity
              <input className="input mt-2" type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </label>
          </div>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button onClick={addToCart} className="rounded-full bg-cocoa px-7 py-4 font-bold text-white transition hover:bg-berry">Use as Reference</button>
          <a href={`https://wa.me/919876543210?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="rounded-full bg-berry px-7 py-4 text-center font-bold text-white transition hover:bg-cocoa">WhatsApp Enquiry</a>
        </div>
        <Link to="/cakes" className="mt-4 block text-center font-bold text-berry">Back to gallery</Link>
      </div>
    </section>
  );
}

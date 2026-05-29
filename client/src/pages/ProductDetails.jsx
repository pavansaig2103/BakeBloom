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
    return <div className="mx-auto max-w-7xl px-4 py-16 font-semibold">Loading cake details...</div>;
  }

  const addToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      ...form,
      quantity: Number(form.quantity)
    });
    navigate("/cart");
  };

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <img src={product.image} alt={product.name} className="h-[360px] w-full rounded-[2rem] object-cover shadow-soft lg:h-[620px]" />
      <div className="rounded-[2rem] bg-white p-6 shadow-soft sm:p-8">
        <p className="font-bold uppercase tracking-[0.2em] text-berry">{product.category}</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-ganache">{product.name}</h1>
        <p className="mt-4 text-3xl font-extrabold">₹{product.price}</p>
        <p className="mt-4 leading-8 text-cocoa/75">{product.description}</p>
        <div className="mt-8 grid gap-4">
          <label className="field">Flavour
            <select className="input mt-2" value={form.flavour} onChange={(e) => setForm({ ...form, flavour: e.target.value })}>
              {flavours.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="field">Size
            <select className="input mt-2" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
              {sizes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="field">Custom message on cake
            <input className="input mt-2" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Happy Birthday Anaya" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field">Delivery date
              <input className="input mt-2" type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} />
            </label>
            <label className="field">Quantity
              <input className="input mt-2" type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </label>
          </div>
        </div>
        <button onClick={addToCart} className="mt-8 w-full rounded-full bg-cocoa px-7 py-4 font-bold text-white transition hover:bg-berry">Add to Cart</button>
        <Link to="/cakes" className="mt-4 block text-center font-bold text-berry">Back to cakes</Link>
      </div>
    </section>
  );
}

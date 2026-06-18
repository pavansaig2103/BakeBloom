import React, { useEffect, useMemo, useState } from "react";
import api from "../api.js";

const statuses = ["New", "Contacted", "Confirmed", "Cancelled"];
const initialDesignForm = {
  title: "",
  description: "",
  imageUrl: "",
  occasion: "Birthday",
  theme: "",
  flavor: "Chocolate",
  weight: "1kg",
  priceRange: "Rs. 750 - Rs. 1500",
  referenceId: "",
  price: 1200,
  isPopular: false,
  isActive: true
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(initialDesignForm);
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    Promise.all([
      api.get("/orders").then((res) => res.data).catch(() => []),
      api.get("/products").then((res) => res.data).catch(() => []),
      api.get("/custom-cake-requests").then((res) => res.data).catch(() => [])
    ]).then(([orderData, productData, requestData]) => {
      setOrders(orderData);
      setDesigns(productData);
      setRequests(requestData);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const allEnquiries = useMemo(() => [...orders, ...requests], [orders, requests]);
  const occasionCounts = countBy(designs, (item) => item.occasion || item.category || "General");
  const statusCounts = countBy(allEnquiries, (item) => item.status || "New");
  const priceCounts = countBy(designs, (item) => item.priceRange || "Not set");
  const popularOccasion = topEntry(occasionCounts)?.[0] || "No data";
  const requestedPriceRange = topEntry(priceCounts)?.[0] || "No data";
  const mostViewed = [...designs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  const recentEnquiries = [...allEnquiries].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 6);

  const stats = [
    ["Total Cake Designs", designs.length],
    ["Total Enquiries", allEnquiries.length],
    ["Popular Occasion", popularOccasion],
    ["Confirmed Requests", allEnquiries.filter((item) => item.status === "Confirmed").length]
  ];

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
    setOrders((current) => current.map((order) => (order._id === id ? { ...order, status } : order)));
  };

  const updateCustomStatus = async (id, status) => {
    await api.patch(`/custom-cake-requests/${id}/status`, { status });
    setRequests((current) => current.map((request) => (request._id === id ? { ...request, status } : request)));
  };

  const saveDesign = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      name: form.title,
      description: form.description,
      imageUrl: form.imageUrl,
      image: form.imageUrl,
      occasion: form.occasion,
      category: form.occasion,
      theme: form.theme,
      flavor: form.flavor,
      flavour: form.flavor,
      weight: form.weight,
      priceRange: form.priceRange,
      referenceId: form.referenceId,
      price: Number(form.price || 0),
      isPopular: form.isPopular,
      isActive: form.isActive
    };
    const { data } = await api.post("/products", payload);
    setDesigns((current) => [data, ...current]);
    setForm(initialDesignForm);
    setSaving(false);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-bold uppercase tracking-[0.2em] text-berry">Cakes and Crunches admin</p>
          <h1 className="font-display text-4xl font-bold text-ganache">Gallery Management Dashboard</h1>
        </div>
        <button onClick={loadData} className="rounded-full bg-white px-5 py-2 font-bold text-berry shadow-sm">Refresh</button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-3xl bg-white p-6 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-berry">{label}</p>
            <p className="mt-3 text-3xl font-extrabold text-ganache">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Chart title="Occasion Distribution" data={occasionCounts} />
        <Chart title="Enquiry Status Distribution" data={statusCounts} />
        <Chart title="Price Range Demand" data={priceCounts} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-bold text-ganache">Manage Cake Designs</h2>
          <form onSubmit={saveDesign} className="mt-5 grid gap-4">
            <label className="field">Title<input required className="input mt-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
            <label className="field">Description<textarea required className="input mt-2 min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <label className="field">Image URL<input required className="input mt-2" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="field">Occasion<input className="input mt-2" value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} /></label>
              <label className="field">Theme<input required className="input mt-2" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} /></label>
              <label className="field">Flavor<input className="input mt-2" value={form.flavor} onChange={(e) => setForm({ ...form, flavor: e.target.value })} /></label>
              <label className="field">Weight<input className="input mt-2" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></label>
              <label className="field">Price range<input className="input mt-2" value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })} /></label>
              <label className="field">Reference ID<input required className="input mt-2" value={form.referenceId} onChange={(e) => setForm({ ...form, referenceId: e.target.value })} /></label>
              <label className="field">Estimated price<input className="input mt-2" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 font-bold text-cocoa"><input type="checkbox" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })} /> Popular</label>
              <label className="flex items-center gap-2 font-bold text-cocoa"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
            </div>
            <button disabled={saving} className="rounded-full bg-cocoa px-7 py-3 font-bold text-white transition hover:bg-berry disabled:opacity-60">
              {saving ? "Saving..." : "Add Cake Design"}
            </button>
          </form>
        </section>

        <section className="overflow-hidden rounded-3xl bg-white shadow-soft">
          <div className="border-b border-cocoa/10 p-6">
            <h2 className="font-display text-2xl font-bold text-ganache">Manage Enquiries</h2>
            <p className="mt-2 text-sm text-cocoa/65">Recent enquiries from saved references and custom design requests.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-[0.15em] text-cocoa/65">
                <tr>
                  <th className="px-5 py-4">Enquiry ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Reference</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cocoa/10">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-5 py-4 font-mono text-xs">{order._id}</td>
                    <td className="px-5 py-4 font-semibold">{order.customerName}</td>
                    <td className="px-5 py-4">{order.phone}</td>
                    <td className="px-5 py-4">{order.items?.map((item) => item.referenceId || item.name).join(", ")}</td>
                    <td className="px-5 py-4">
                      <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className="input min-w-36">
                        {statuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-5 py-4 font-mono text-xs">{request._id}</td>
                    <td className="px-5 py-4 font-semibold">{request.customerName}</td>
                    <td className="px-5 py-4">{request.phone}</td>
                    <td className="px-5 py-4">{request.occasion || request.theme || "Custom request"}</td>
                    <td className="px-5 py-4">
                      <select value={request.status || "New"} onChange={(e) => updateCustomStatus(request._id, e.target.value)} className="input min-w-36">
                        {statuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {allEnquiries.length === 0 && <p className="p-8 text-center font-semibold text-cocoa/70">No enquiries yet.</p>}
        </section>
      </div>

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="font-display text-2xl font-bold text-ganache">Reports</h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-4">
          <ReportCard label="Popular occasion" value={popularOccasion} />
          <ReportCard label="Most requested price range" value={requestedPriceRange} />
          <ReportCard label="Most viewed cake designs" value={mostViewed.map((item) => item.name).join(", ") || "No data"} />
          <ReportCard label="Recent customer enquiries" value={recentEnquiries.map((item) => item.customerName).join(", ") || "No data"} />
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="font-display text-2xl font-bold text-ganache">Admin Overview</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <ReportCard label="Problem They Face" value="Design photos are scattered across WhatsApp, Instagram, spreadsheets, and manual records." />
          <ReportCard label="What We Are Building" value="A centralized Cake Photo Gallery & Design Inspiration Portal with gallery, enquiry tracking, and analytics." />
          <ReportCard label="Technology Stack" value="React, HTML, CSS, JavaScript, Node.js, Express.js, MongoDB, and SQL schema for internship database design." />
        </div>
      </section>
    </section>
  );
}

function Chart({ title, data }) {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, value]) => value), 1);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft">
      <h2 className="font-display text-2xl font-bold text-ganache">{title}</h2>
      <div className="mt-5 grid gap-4">
        {entries.length === 0 ? (
          <p className="text-sm font-semibold text-cocoa/60">No data available</p>
        ) : entries.map(([label, value]) => (
          <div key={label}>
            <div className="mb-2 flex justify-between text-sm font-bold text-cocoa/70">
              <span>{label}</span>
              <span>{value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-cream">
              <div className="h-full rounded-full bg-berry" style={{ width: `${Math.max((value / max) * 100, 8)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReportCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-cream p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-berry">{label}</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-cocoa/75">{value}</p>
    </div>
  );
}

function countBy(items, selector) {
  return items.reduce((acc, item) => {
    const key = selector(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function topEntry(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
}

import React, { useEffect, useMemo, useState } from "react";
import api from "../api.js";

const statuses = ["Pending", "Accepted", "Preparing", "Packed", "Out for Delivery", "Delivered", "Rejected"];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => api.get("/orders").then((res) => setOrders(res.data)).catch(() => setOrders([]));

  useEffect(() => {
    loadOrders();
  }, []);

  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((order) => order.status === "Pending").length,
      preparing: orders.filter((order) => order.status === "Preparing").length,
      delivered: orders.filter((order) => order.status === "Delivered").length
    }),
    [orders]
  );

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
    setOrders((current) => current.map((order) => (order._id === id ? { ...order, status } : order)));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-bold uppercase tracking-[0.2em] text-berry">Prototype admin</p>
          <h1 className="font-display text-4xl font-bold text-ganache">Order Dashboard</h1>
        </div>
        <button onClick={loadOrders} className="rounded-full bg-white px-5 py-2 font-bold text-berry shadow-sm">Refresh</button>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total Orders", stats.total],
          ["Pending Orders", stats.pending],
          ["Preparing Orders", stats.preparing],
          ["Delivered Orders", stats.delivered]
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl bg-white p-6 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-berry">{label}</p>
            <p className="mt-3 text-4xl font-extrabold text-ganache">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-[0.15em] text-cocoa/65">
              <tr>
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Items</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Delivery Date</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa/10">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-5 py-4 font-mono text-xs">{order._id}</td>
                  <td className="px-5 py-4 font-semibold">{order.customerName}</td>
                  <td className="px-5 py-4">{order.phone}</td>
                  <td className="px-5 py-4">{order.items?.map((item) => `${item.quantity}x ${item.name}`).join(", ")}</td>
                  <td className="px-5 py-4 font-bold">₹{order.totalAmount}</td>
                  <td className="px-5 py-4">{order.deliveryDate}</td>
                  <td className="px-5 py-4">
                    <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className="input min-w-44">
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && <p className="p-8 text-center font-semibold text-cocoa/70">No orders yet.</p>}
      </div>
    </section>
  );
}

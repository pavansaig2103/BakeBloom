import React, { useEffect, useMemo, useState } from "react";
import api from "../api.js";

const enquiryStatuses = ["New", "Contacted", "Design Shared", "Confirmed", "Completed", "Cancelled"];
const orderStatuses = ["Confirmed", "Preparing", "Ready", "Delivered", "Completed", "Cancelled"];
const paymentStatuses = ["Pending", "Advance Paid", "Fully Paid"];
const categories = ["Birthday", "Wedding", "Anniversary", "Corporate", "Festival", "Brownies", "Cookies", "Pastries", "Sweet Boxes"];
const priceRanges = ["Under Rs. 750", "Rs. 750 - Rs. 1500", "Rs. 1500 - Rs. 2500", "Rs. 2500+"];
const blankDesign = {
  name: "",
  category: "Birthday",
  occasion: "Birthday",
  theme: "",
  flavour: "Chocolate",
  size: "1kg",
  weight: "1kg",
  price: 1200,
  priceRange: "Rs. 750 - Rs. 1500",
  image: "",
  description: "",
  availability: "Available",
  tags: "",
  referenceId: "",
  isPopular: false,
  isActive: true
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(blankDesign);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [convert, setConvert] = useState({ enquiryId: "", finalPrice: "", deliveryDate: "", paymentStatus: "Pending", notes: "" });

  const loadData = async () => {
    setLoading(true);
    const [orderData, productData, requestData] = await Promise.all([
      api.get("/orders").then((res) => res.data).catch(() => []),
      api.get("/products").then((res) => res.data).catch(() => []),
      api.get("/custom-cake-requests").then((res) => res.data).catch(() => [])
    ]);
    setOrders(orderData);
    setDesigns(productData);
    setRequests(requestData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const analytics = useMemo(() => {
    const confirmedOrderIds = new Set(orders.map((order) => order.enquiryId).filter(Boolean));
    const confirmedEnquiries = requests.filter((request) => request.status === "Confirmed" && !confirmedOrderIds.has(request._id));
    const confirmedOrders = [
      ...orders.filter((order) => ["Confirmed", "Preparing", "Ready", "Delivered", "Completed"].includes(order.status || order.orderStatus)),
      ...confirmedEnquiries
    ];
    const pendingFollowUps = requests.filter((item) => ["New", "Contacted", "Design Shared"].includes(item.status || "New"));
    const categoryCounts = countBy([...designs, ...requests], (item) => item.category || item.occasion || "General");
    return {
      confirmedOrders,
      pendingFollowUps,
      popularCategory: topEntry(categoryCounts)?.[0] || "No data",
      categoryCounts,
      occasionCounts: countBy(requests, (item) => item.occasion || item.category || "General"),
      statusCounts: countBy(requests, (item) => item.status || "New"),
      themeCounts: countBy(designs, (item) => item.theme || "Signature"),
      monthlyOrders: countBy(orders, (item) => monthLabel(item.deliveryDate || item.createdAt)),
      priceCounts: countBy([...requests, ...designs], (item) => item.priceRange || budgetRange(item.budget || item.price))
    };
  }, [orders, designs, requests]);

  const recentActivity = [...requests.map((item) => ({ ...item, type: "Enquiry" })), ...orders.map((item) => ({ ...item, type: "Order" }))]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    .slice(0, 7);

  const alerts = [
    ...requests.filter((item) => (item.status || "New") === "New").slice(0, 4)
      .map((item) => ({ title: `New enquiry from ${item.customerName}`, body: `${item.selectedDesign || item.theme} for ${dateText(item.requiredDate)}`, badge: "New" })),
    ...analytics.pendingFollowUps.slice(0, 4).map((item) => ({ title: `${item.customerName} needs follow-up`, body: `${item.selectedDesign || item.theme} for ${dateText(item.requiredDate)}`, badge: item.status || "New" })),
    ...orders.filter((item) => daysUntil(item.deliveryDate) <= 3 && daysUntil(item.deliveryDate) >= 0 && (item.status || item.orderStatus) !== "Completed").slice(0, 4)
      .map((item) => ({ title: `Delivery due ${dateText(item.deliveryDate)}`, body: `${item.customerName} - ${item.selectedCake || item.items?.[0]?.name || "Cake order"}`, badge: "High Priority" })),
    ...orders.filter((item) => (item.paymentStatus || "Pending") !== "Fully Paid").slice(0, 4)
      .map((item) => ({ title: `Payment ${item.paymentStatus || "Pending"}`, body: `${item.customerName} - Rs. ${item.finalPrice || item.totalAmount || 0}`, badge: item.paymentStatus || "Pending" })),
    ...requests.filter((item) => !item.phone || !item.requiredDate || !item.budget).slice(0, 3)
      .map((item) => ({ title: "Incomplete customer details", body: item.customerName || "Unnamed enquiry", badge: "Pending" }))
  ].slice(0, 8);

  const stats = [
    ["Total Cake Designs", designs.length, "Active gallery references"],
    ["Total Enquiries", requests.length, "Customer/staff leads"],
    ["Confirmed Orders", analytics.confirmedOrders.length, "Converted business"],
    ["Pending Follow-ups", analytics.pendingFollowUps.length, "Need staff action"],
    ["Popular Category", analytics.popularCategory, "Most visible collection"]
  ];

  const saveDesign = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.theme.trim() || !form.image.trim() || Number(form.price) <= 0) {
      setMessage("Please fill cake name, theme, image URL, and valid price.");
      return;
    }
    setSaving(true);
    const payload = { ...form, weight: form.size, tags: form.tags };
    try {
      const request = editingId ? api.patch(`/products/${editingId}`, payload) : api.post("/products", payload);
      const { data } = await request;
      setDesigns((current) => (editingId ? current.map((item) => (item._id === editingId ? data : item)) : [data, ...current]));
      setForm(blankDesign);
      setEditingId(null);
      setMessage(editingId ? "Cake design updated successfully." : "Cake design added successfully.");
    } catch (error) {
      setMessage(apiError(error, "Could not save cake design."));
    } finally {
      setSaving(false);
    }
  };

  const editDesign = (design) => {
    setActiveTab("Cake Designs");
    setEditingId(design._id);
    setForm({ ...blankDesign, ...design, size: design.size || design.weight || "1kg", tags: (design.tags || []).join(", ") });
  };

  const deleteDesign = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setDesigns((current) => current.filter((item) => item._id !== id));
      setMessage("Cake design deleted.");
    } catch (error) {
      setMessage(apiError(error, "Could not delete cake design."));
    }
  };

  const updateEnquiryStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/custom-cake-requests/${id}/status`, { status });
      setRequests((current) => current.map((item) => (item._id === id ? data : item)));
      setMessage(`Enquiry status saved as ${status}.`);
    } catch (error) {
      setMessage(apiError(error, "Could not update enquiry status."));
      await loadData();
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/orders/${id}/status`, { status });
      setOrders((current) => current.map((item) => (item._id === id ? data : item)));
      setMessage(`Order status saved as ${status}.`);
    } catch (error) {
      setMessage(apiError(error, "Could not update order status."));
      await loadData();
    }
  };

  const updatePaymentStatus = async (id, paymentStatus) => {
    try {
      const { data } = await api.patch(`/orders/${id}/payment-status`, { paymentStatus });
      setOrders((current) => current.map((item) => (item._id === id ? data : item)));
      setMessage(`Payment status saved as ${paymentStatus}.`);
    } catch (error) {
      setMessage(apiError(error, "Could not update payment status."));
      await loadData();
    }
  };

  const convertToOrder = async (event) => {
    event.preventDefault();
    if (!convert.enquiryId || Number(convert.finalPrice) <= 0 || !convert.deliveryDate) {
      setMessage("Select an enquiry, final price, and delivery date before converting.");
      return;
    }
    try {
      const { data } = await api.post(`/custom-cake-requests/${convert.enquiryId}/convert-to-order`, convert);
      setOrders((current) => [data, ...current]);
      setConvert({ enquiryId: "", finalPrice: "", deliveryDate: "", paymentStatus: "Pending", notes: "" });
      setMessage("Confirmed enquiry converted into order.");
      await loadData();
    } catch (error) {
      setMessage(apiError(error, "Could not convert enquiry into order."));
    }
  };

  const exportCsv = (type) => {
    const rows = type === "orders" ? orders : requests;
    const header = type === "orders"
      ? ["customerName", "phone", "selectedCake", "finalPrice", "deliveryDate", "paymentStatus", "status"]
      : ["customerName", "phone", "occasion", "selectedDesign", "budget", "requiredDate", "status"];
    downloadCsv(`${type}-report.csv`, rows, header);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-bold uppercase tracking-[0.2em] text-berry">Cakes and Crunches admin</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-ganache">Bakery Gallery & Order Command Center</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Dashboard", "Cake Designs", "Enquiries", "Orders", "Reports"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeTab === tab ? "bg-cocoa text-white" : "bg-white text-cocoa shadow-sm hover:text-berry"}`}>
              {tab}
            </button>
          ))}
          <button onClick={loadData} className="rounded-full bg-berry px-4 py-2 text-sm font-bold text-white">Refresh</button>
        </div>
      </div>

      {message && <div className="mt-5 rounded-2xl bg-white p-4 font-semibold text-berry shadow-soft">{message}</div>}
      {loading && <div className="mt-5 rounded-2xl bg-white p-5 font-bold shadow-soft">Loading bakery dashboard...</div>}

      {activeTab === "Dashboard" && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {stats.map(([label, value, hint]) => <StatCard key={label} label={label} value={value} hint={hint} />)}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <section className="rounded-3xl bg-white p-6 shadow-soft">
              <h2 className="font-display text-2xl font-bold text-ganache">Business Visibility</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <BarChart title="Enquiries by Occasion" data={analytics.occasionCounts} />
                <BarChart title="Monthly Confirmed Orders" data={analytics.monthlyOrders} />
                <BarChart title="Popular Cake Themes" data={analytics.themeCounts} />
                <BarChart title="Price Range Demand" data={analytics.priceCounts} />
              </div>
            </section>
            <section className="rounded-3xl bg-white p-6 shadow-soft">
              <h2 className="font-display text-2xl font-bold text-ganache">Alerts & Follow-ups</h2>
              <div className="mt-5 grid gap-3">
                {alerts.length ? alerts.map((alert) => <AlertCard key={`${alert.title}-${alert.body}`} alert={alert} />) : <Empty text="No urgent alerts right now." />}
              </div>
            </section>
          </div>
          <ActivityList items={recentActivity} />
        </>
      )}

      {activeTab === "Cake Designs" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <DesignForm form={form} setForm={setForm} saveDesign={saveDesign} saving={saving} editingId={editingId} cancel={() => { setForm(blankDesign); setEditingId(null); }} />
          <section className="rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="font-display text-2xl font-bold text-ganache">Cake Gallery Management</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {designs.map((design) => (
                <article key={design._id} className="overflow-hidden rounded-2xl border border-cocoa/10 bg-cream">
                  <img src={design.image} alt={design.name} className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-xl font-bold text-ganache">{design.name}</h3>
                      <Badge text={design.availability || (design.isActive ? "Available" : "Hidden")} />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-cocoa/70">{design.category} | {design.theme} | {design.priceRange}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => editDesign(design)} className="rounded-full bg-cocoa px-4 py-2 text-sm font-bold text-white">Edit</button>
                      <button onClick={() => deleteDesign(design._id)} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-berry">Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {!designs.length && <Empty text="No cake designs added yet." />}
          </section>
        </div>
      )}

      {activeTab === "Enquiries" && (
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="font-display text-2xl font-bold text-ganache">Customer Enquiry Workflow</h2>
            <button onClick={() => exportCsv("enquiries")} className="rounded-full bg-cocoa px-5 py-2 font-bold text-white">Export CSV</button>
          </div>
          <DataTable columns={["Customer", "Design", "Budget", "Date", "Status", "WhatsApp"]}>
            {requests.map((request) => (
              <tr key={request._id}>
                <Td><strong>{request.customerName}</strong><br /><span>{request.phone}</span></Td>
                <Td>{request.selectedDesign || request.theme}<br /><span>{request.occasion} | {request.flavour}</span><br /><span className="mt-2 inline-block"><Badge text={request.status || "New"} /></span></Td>
                <Td>Rs. {request.budget || 0}</Td>
                <Td>{dateText(request.requiredDate)}</Td>
                <Td><select className="input min-w-40" value={request.status || "New"} onChange={(event) => updateEnquiryStatus(request._id, event.target.value)}>{enquiryStatuses.map((status) => <option key={status}>{status}</option>)}</select></Td>
                <Td><a className="rounded-full bg-berry px-4 py-2 text-sm font-bold text-white" href={whatsappLink(request)} target="_blank" rel="noreferrer">Message</a></Td>
              </tr>
            ))}
          </DataTable>
          {!requests.length && <Empty text="No enquiries yet. Create one from the gallery or design enquiry page." />}
          <form onSubmit={convertToOrder} className="mt-6 grid gap-4 rounded-2xl bg-cream p-5 md:grid-cols-6">
            <label className="field md:col-span-2">Convert confirmed enquiry<select className="input mt-2" value={convert.enquiryId} onChange={(e) => setConvert({ ...convert, enquiryId: e.target.value })}><option value="">Select confirmed enquiry</option>{requests.filter((item) => item.status === "Confirmed").map((item) => <option key={item._id} value={item._id}>{item.customerName} - {item.selectedDesign || item.theme}</option>)}</select></label>
            <label className="field">Final price<input className="input mt-2" type="number" value={convert.finalPrice} onChange={(e) => setConvert({ ...convert, finalPrice: e.target.value })} /></label>
            <label className="field">Delivery date<input className="input mt-2" type="date" value={convert.deliveryDate} onChange={(e) => setConvert({ ...convert, deliveryDate: e.target.value })} /></label>
            <label className="field">Payment<select className="input mt-2" value={convert.paymentStatus} onChange={(e) => setConvert({ ...convert, paymentStatus: e.target.value })}>{paymentStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
            <button className="self-end rounded-full bg-cocoa px-5 py-3 font-bold text-white">Confirm Order</button>
          </form>
        </section>
      )}

      {activeTab === "Orders" && (
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="font-display text-2xl font-bold text-ganache">Confirmed Order History</h2>
            <button onClick={() => exportCsv("orders")} className="rounded-full bg-cocoa px-5 py-2 font-bold text-white">Export CSV</button>
          </div>
          <DataTable columns={["Customer", "Cake", "Final Price", "Delivery", "Payment", "Order Status"]}>
            {orders.map((order) => (
              <tr key={order._id}>
                <Td><strong>{order.customerName}</strong><br /><span>{order.phone}</span></Td>
                <Td>{order.selectedCake || order.items?.[0]?.name || "Cake order"}<br /><span>{order.notes || order.items?.[0]?.message || "No notes"}</span></Td>
                <Td>Rs. {order.finalPrice || order.totalAmount}</Td>
                <Td>{dateText(order.deliveryDate)}</Td>
                <Td><select className="input min-w-36" value={order.paymentStatus || "Pending"} onChange={(event) => updatePaymentStatus(order._id, event.target.value)}>{paymentStatuses.map((status) => <option key={status}>{status}</option>)}</select></Td>
                <Td><select className="input min-w-36" value={order.status || order.orderStatus || "Confirmed"} onChange={(event) => updateOrderStatus(order._id, event.target.value)}>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></Td>
              </tr>
            ))}
          </DataTable>
          {!orders.length && <Empty text="No confirmed orders yet." />}
        </section>
      )}

      {activeTab === "Reports" && (
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <ReportPanel title="Enquiries by Occasion" data={analytics.occasionCounts} />
          <ReportPanel title="Confirmed Orders by Month" data={analytics.monthlyOrders} />
          <ReportPanel title="Popular Categories" data={analytics.categoryCounts} />
          <ReportPanel title="Price-range Demand" data={analytics.priceCounts} />
          <ReportPanel title="Confirmed vs Cancelled Enquiries" data={pickKeys(analytics.statusCounts, ["Confirmed", "Cancelled"])} />
          <div className="rounded-3xl bg-white p-6 shadow-soft lg:col-span-2">
            <h2 className="font-display text-2xl font-bold text-ganache">Management Summary</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Summary label="Best category" value={analytics.popularCategory} />
              <Summary label="Fast action needed" value={`${analytics.pendingFollowUps.length} pending follow-ups`} />
              <Summary label="Order value" value={`Rs. ${orders.reduce((sum, order) => sum + Number(order.finalPrice || order.totalAmount || 0), 0)}`} />
            </div>
          </div>
        </section>
      )}
    </section>
  );
}

function DesignForm({ form, setForm, saveDesign, saving, editingId, cancel }) {
  return (
    <form onSubmit={saveDesign} className="h-fit rounded-3xl bg-white p-6 shadow-soft">
      <h2 className="font-display text-2xl font-bold text-ganache">{editingId ? "Edit Cake Design" : "Add Cake Design"}</h2>
      <div className="mt-5 grid gap-4">
        <label className="field">Cake name<input required className="input mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label className="field">Image URL<input required className="input mt-2" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></label>
        <label className="field">Description<textarea required className="input mt-2 min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field">Category<select className="input mt-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, occasion: e.target.value })}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="field">Occasion<input className="input mt-2" value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} /></label>
          <label className="field">Theme<input required className="input mt-2" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} /></label>
          <label className="field">Flavour<input className="input mt-2" value={form.flavour} onChange={(e) => setForm({ ...form, flavour: e.target.value })} /></label>
          <label className="field">Size<input className="input mt-2" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value, weight: e.target.value })} /></label>
          <label className="field">Price range<select className="input mt-2" value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })}>{priceRanges.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="field">Estimated price<input className="input mt-2" type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
          <label className="field">Availability<select className="input mt-2" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}>{["Available", "Made to Order", "Seasonal", "Hidden"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="field">Reference ID<input className="input mt-2" value={form.referenceId} onChange={(e) => setForm({ ...form, referenceId: e.target.value })} /></label>
          <label className="field">Tags<input className="input mt-2" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="floral, pink, premium" /></label>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 font-bold text-cocoa"><input type="checkbox" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })} /> Popular</label>
          <label className="flex items-center gap-2 font-bold text-cocoa"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
        </div>
        <div className="flex flex-wrap gap-3">
          <button disabled={saving} className="rounded-full bg-cocoa px-7 py-3 font-bold text-white disabled:opacity-60">{saving ? "Saving..." : editingId ? "Update Design" : "Add Design"}</button>
          {editingId && <button type="button" onClick={cancel} className="rounded-full bg-cream px-7 py-3 font-bold text-cocoa">Cancel</button>}
        </div>
      </div>
    </form>
  );
}

function StatCard({ label, value, hint }) {
  return <div className="rounded-3xl bg-white p-5 shadow-soft"><p className="text-xs font-bold uppercase tracking-[0.16em] text-berry">{label}</p><p className="mt-3 text-3xl font-extrabold text-ganache">{value}</p><p className="mt-2 text-sm text-cocoa/60">{hint}</p></div>;
}

function BarChart({ title, data }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = Math.max(...entries.map(([, value]) => value), 1);
  return <div><h3 className="font-bold text-ganache">{title}</h3><div className="mt-3 grid gap-3">{entries.length ? entries.map(([label, value]) => <div key={label}><div className="mb-1 flex justify-between text-xs font-bold text-cocoa/70"><span>{label}</span><span>{value}</span></div><div className="h-3 overflow-hidden rounded-full bg-cream"><div className="h-full rounded-full bg-berry" style={{ width: `${Math.max((value / max) * 100, 10)}%` }} /></div></div>) : <p className="text-sm text-cocoa/60">No data yet.</p>}</div></div>;
}

function ReportPanel({ title, data }) {
  return <section className="rounded-3xl bg-white p-6 shadow-soft"><h2 className="font-display text-2xl font-bold text-ganache">{title}</h2><div className="mt-5"><BarChart title="" data={data} /></div></section>;
}

function ActivityList({ items }) {
  return <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft"><h2 className="font-display text-2xl font-bold text-ganache">Recent Activity</h2><div className="mt-5 grid gap-3">{items.map((item) => <div key={`${item.type}-${item._id}`} className="flex flex-col gap-2 rounded-2xl bg-cream p-4 sm:flex-row sm:items-center sm:justify-between"><p className="font-bold">{item.type}: {item.customerName || item.name}</p><Badge text={item.status || item.orderStatus || "Updated"} /></div>)}{!items.length && <Empty text="No recent activity yet." />}</div></section>;
}

function DataTable({ columns, children }) {
  return <div className="mt-5 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-cream text-xs uppercase tracking-[0.14em] text-cocoa/65"><tr>{columns.map((column) => <th key={column} className="px-5 py-4">{column}</th>)}</tr></thead><tbody className="divide-y divide-cocoa/10">{children}</tbody></table></div>;
}

function Td({ children }) {
  return <td className="px-5 py-4 align-top text-cocoa/80">{children}</td>;
}

function Badge({ text }) {
  const tone =
    text === "High Priority" || text === "New" || text === "Cancelled"
      ? "bg-berry text-white"
      : text === "Confirmed" || text === "Completed" || text === "Delivered" || text === "Fully Paid"
        ? "bg-cocoa text-white"
        : text === "Preparing" || text === "Ready" || text === "Contacted" || text === "Design Shared" || text === "Advance Paid"
          ? "bg-butter text-cocoa"
          : "bg-cream text-cocoa";
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${tone}`}>{text}</span>;
}

function AlertCard({ alert }) {
  return <div className="rounded-2xl bg-cream p-4"><div className="flex items-start justify-between gap-3"><p className="font-bold text-ganache">{alert.title}</p><Badge text={alert.badge} /></div><p className="mt-2 text-sm text-cocoa/65">{alert.body}</p></div>;
}

function Summary({ label, value }) {
  return <div className="rounded-2xl bg-cream p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-berry">{label}</p><p className="mt-3 text-xl font-extrabold text-ganache">{value}</p></div>;
}

function Empty({ text }) {
  return <p className="rounded-2xl bg-cream p-5 text-center font-semibold text-cocoa/65">{text}</p>;
}

function countBy(items, selector) {
  return items.reduce((acc, item) => {
    const key = selector(item) || "Not set";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function topEntry(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
}

function pickKeys(source, keys) {
  return keys.reduce((acc, key) => {
    acc[key] = source[key] || 0;
    return acc;
  }, {});
}

function budgetRange(value) {
  const amount = Number(value || 0);
  if (amount <= 750) return "Under Rs. 750";
  if (amount <= 1500) return "Rs. 750 - Rs. 1500";
  if (amount <= 2500) return "Rs. 1500 - Rs. 2500";
  return "Rs. 2500+";
}

function monthLabel(date) {
  if (!date) return "Unscheduled";
  return new Date(date).toLocaleString("en-IN", { month: "short", year: "numeric" });
}

function dateText(date) {
  if (!date) return "To be confirmed";
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function daysUntil(date) {
  if (!date) return 999;
  return Math.ceil((new Date(date) - new Date()) / 86400000);
}

function whatsappLink(request) {
  const text = encodeURIComponent(`Hi ${request.customerName}, Cakes and Crunches here. We are following up on your ${request.selectedDesign || request.theme} enquiry for ${dateText(request.requiredDate)}. Budget noted: Rs. ${request.budget || "to confirm"}.`);
  return `https://wa.me/91${String(request.phone || "").replace(/\D/g, "").slice(-10)}?text=${text}`;
}

function downloadCsv(filename, rows, headers) {
  const csv = [headers.join(","), ...rows.map((row) => headers.map((key) => JSON.stringify(row[key] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function apiError(error, fallback) {
  return error?.response?.data?.message || fallback;
}

import axios from "axios";

const localApiUrl =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5108/api"
    : "/api";

const remote = axios.create({
  baseURL: import.meta.env.VITE_API_URL || localApiUrl
});

const storeKey = "cakes_demo_store_v4";
const now = () => new Date().toISOString();
const upcomingDate = (days) => new Date(Date.now() + 86400000 * days).toISOString().slice(0, 10);
const uid = () => `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const seedStore = () => {
  const products = [
    design("Chocolate Truffle Birthday Cake", "Birthday", "Birthday", "Chocolate Truffle", "Belgian Chocolate", "1.5kg", 1899, "Rs. 1500 - Rs. 2500", "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80", "Rich chocolate truffle cake with drip finish, birthday topper, and custom name message.", true),
    design("Floral Wedding Cake", "Wedding", "Wedding", "Floral", "Rose Pistachio", "2kg", 3499, "Rs. 2500+", "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=80", "Elegant floral wedding cake with soft pastel cream and premium finish.", true),
    design("Red Velvet Anniversary Cake", "Anniversary", "Anniversary", "Romantic", "Red Velvet", "1kg", 1599, "Rs. 1500 - Rs. 2500", "https://images.unsplash.com/photo-1616690710400-a16d146927c5?auto=format&fit=crop&w=900&q=80", "Romantic red velvet anniversary cake with cream cheese frosting.", true),
    design("Brownie Box", "Brownies", "Gifting", "Assorted", "Chocolate", "Box of 9", 699, "Under Rs. 750", "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80", "Assorted fudgy brownie box for gifting and parties.", false),
    design("Festival Sweet Box", "Sweet Boxes", "Festival", "Festive", "Mixed", "Gift box", 1299, "Rs. 750 - Rs. 1500", "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80", "Curated festive sweet box with brownies, cookies, and dessert bites.", false),
    design("Corporate Cupcakes", "Corporate", "Corporate", "Minimal", "Mixed", "Box of 12", 899, "Rs. 750 - Rs. 1500", "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=900&q=80", "Cupcake set for office celebrations and team gifting.", true)
  ];
  const floral = products.find((item) => item.name === "Floral Wedding Cake");
  const corporate = products.find((item) => item.name === "Corporate Cupcakes");
  const confirmedId = uid();
  return {
    products,
    requests: [
      enquiry({ customerName: "Priya Sharma", phone: "9876543210", selectedDesign: "Chocolate Truffle Birthday Cake", category: "Birthday", occasion: "Birthday", theme: "Chocolate Truffle", flavour: "Belgian Chocolate", budget: 2200, requiredDate: upcomingDate(7), notes: "Wants a chocolate theme cake with name written on top.", status: "New" }),
      enquiry({ _id: confirmedId, customerName: "Ananya Mehta", phone: "9876502222", cakeDesignId: floral._id, selectedDesign: floral.name, selectedDesignImage: floral.image, category: "Wedding", occasion: "Wedding", theme: "Floral", flavour: "Rose Pistachio", budget: 3500, requiredDate: upcomingDate(14), notes: "Two-tier pastel floral cake for engagement ceremony.", status: "Confirmed" }),
      enquiry({ customerName: "Rohan Kapoor", phone: "9876503333", selectedDesign: "Red Velvet Anniversary Cake", category: "Anniversary", occasion: "Anniversary", theme: "Romantic", flavour: "Red Velvet", budget: 1800, requiredDate: upcomingDate(5), notes: "Heart design with Happy Anniversary message.", status: "Contacted" })
    ],
    orders: [
      order({ enquiryId: confirmedId, customerName: "Ananya Mehta", phone: "9876502222", selectedCake: "Floral Wedding Cake", finalPrice: 3600, deliveryDate: upcomingDate(14), paymentStatus: "Advance Paid", status: "Confirmed" }),
      order({ customerName: "Aarav Nair", phone: "9876504444", selectedCake: corporate.name, finalPrice: 1800, deliveryDate: upcomingDate(2), paymentStatus: "Pending", status: "Preparing" })
    ]
  };
};

function design(name, category, occasion, theme, flavour, size, price, priceRange, image, description, isPopular) {
  return { _id: uid(), name, category, occasion, theme, flavour, size, weight: size, price, priceRange, image, description, availability: "Available", tags: [category, theme, flavour], referenceId: name.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 24), isPopular, isActive: true, rating: 4.8, views: 100, createdAt: now(), updatedAt: now() };
}

function enquiry(payload) {
  const status = payload.status || "New";
  return { _id: payload._id || uid(), cakeDesignId: payload.cakeDesignId || "", selectedDesignImage: payload.selectedDesignImage || "", weight: payload.weight || payload.size || "1kg", size: payload.size || payload.weight || "1kg", fulfillmentType: payload.fulfillmentType || "Pickup", priority: status === "New" ? "High Priority" : status, createdAt: now(), updatedAt: now(), ...payload, status };
}

function order(payload) {
  return { _id: uid(), email: "", address: "", items: [{ name: payload.selectedCake, price: payload.finalPrice, quantity: 1, deliveryDate: payload.deliveryDate }], totalAmount: payload.finalPrice, notes: "", paymentMode: "UPI", orderStatus: payload.status || "Confirmed", createdAt: now(), updatedAt: now(), ...payload };
}

function readStore() {
  const raw = localStorage.getItem(storeKey);
  if (!raw) {
    const seeded = seedStore();
    writeStore(seeded);
    return seeded;
  }
  return JSON.parse(raw);
}

function writeStore(store) {
  localStorage.setItem(storeKey, JSON.stringify(store));
}

function collectionFor(path) {
  if (path.startsWith("/products")) return "products";
  if (path.startsWith("/custom-cake-requests")) return "requests";
  if (path.startsWith("/orders")) return "orders";
  return null;
}

function localResponse(data) {
  return Promise.resolve({ data, status: 200, localFallback: true });
}

const localApi = {
  get(path) {
    const store = readStore();
    const collection = collectionFor(path);
    if (!collection) return localResponse({ status: "ok", storage: "localStorage" });
    const id = path.split("/")[2];
    return localResponse(id ? store[collection].find((item) => item._id === id) : store[collection]);
  },
  post(path, payload = {}) {
    const store = readStore();
    if (path === "/products") {
      const record = { ...payload, _id: uid(), tags: Array.isArray(payload.tags) ? payload.tags : String(payload.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean), createdAt: now(), updatedAt: now() };
      store.products.unshift(record);
      writeStore(store);
      return localResponse(record);
    }
    if (path === "/custom-cake-requests") {
      const record = enquiry({ ...payload, status: "New" });
      store.requests.unshift(record);
      writeStore(store);
      return localResponse(record);
    }
    const convertMatch = path.match(/^\/custom-cake-requests\/(.+)\/convert-to-order$/);
    if (convertMatch) {
      const request = store.requests.find((item) => item._id === convertMatch[1]);
      if (!request || request.status !== "Confirmed") return Promise.reject({ response: { data: { message: "Only confirmed enquiries can be converted into orders" } } });
      const record = order({ enquiryId: request._id, customerName: request.customerName, phone: request.phone, selectedCake: request.selectedDesign || request.theme, finalPrice: Number(payload.finalPrice || payload.totalAmount), deliveryDate: payload.deliveryDate || request.requiredDate, paymentStatus: payload.paymentStatus || "Pending", status: "Confirmed", notes: payload.notes || request.notes });
      store.orders.unshift(record);
      writeStore(store);
      return localResponse(record);
    }
    if (path === "/orders") {
      const record = order({ ...payload, finalPrice: Number(payload.finalPrice || payload.totalAmount), status: payload.status || "Confirmed" });
      store.orders.unshift(record);
      writeStore(store);
      return localResponse(record);
    }
    return localResponse({});
  },
  patch(path, payload = {}) {
    const store = readStore();
    const statusMatch = path.match(/^\/custom-cake-requests\/(.+)\/status$/);
    const orderStatusMatch = path.match(/^\/orders\/(.+)\/status$/);
    const paymentMatch = path.match(/^\/orders\/(.+)\/payment-status$/);
    const productMatch = path.match(/^\/products\/(.+)$/);
    const requestMatch = path.match(/^\/custom-cake-requests\/(.+)$/);
    const apply = (collection, id, updates) => {
      const index = store[collection].findIndex((item) => item._id === id);
      if (index === -1) return null;
      store[collection][index] = { ...store[collection][index], ...updates, updatedAt: now() };
      writeStore(store);
      return store[collection][index];
    };
    if (statusMatch) return localResponse(apply("requests", statusMatch[1], { status: payload.status, priority: payload.status }));
    if (orderStatusMatch) return localResponse(apply("orders", orderStatusMatch[1], { status: payload.status, orderStatus: payload.status }));
    if (paymentMatch) return localResponse(apply("orders", paymentMatch[1], { paymentStatus: payload.paymentStatus }));
    if (productMatch) return localResponse(apply("products", productMatch[1], payload));
    if (requestMatch) return localResponse(apply("requests", requestMatch[1], payload));
    return localResponse({});
  },
  delete(path) {
    const store = readStore();
    const collection = collectionFor(path);
    const id = path.split("/")[2];
    if (collection && id) {
      store[collection] = store[collection].filter((item) => item._id !== id);
      writeStore(store);
    }
    return localResponse({ message: "Deleted" });
  }
};

function shouldFallback(error) {
  return !error.response || error.response.status === 404 || error.response.status >= 500;
}

const api = {
  get(path, config) {
    return remote.get(path, config).catch((error) => (shouldFallback(error) ? localApi.get(path) : Promise.reject(error)));
  },
  post(path, payload, config) {
    return remote.post(path, payload, config).catch((error) => (shouldFallback(error) ? localApi.post(path, payload) : Promise.reject(error)));
  },
  patch(path, payload, config) {
    return remote.patch(path, payload, config).catch((error) => (shouldFallback(error) ? localApi.patch(path, payload) : Promise.reject(error)));
  },
  delete(path, config) {
    return remote.delete(path, config).catch((error) => (shouldFallback(error) ? localApi.delete(path) : Promise.reject(error)));
  }
};

export default api;

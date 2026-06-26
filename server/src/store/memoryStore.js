import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { sampleProducts } from "../data/sampleProducts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../../data");
const dataFile = path.join(dataDir, "store.json");
const now = () => new Date().toISOString();
const upcomingDate = (days) => new Date(Date.now() + 86400000 * days).toISOString().slice(0, 10);

function seedStore() {
  const products = sampleProducts.map((product) => ({
    ...product,
    _id: randomUUID(),
    size: product.size || product.weight || "1kg",
    availability: product.availability || "Available",
    tags: product.tags || [product.occasion, product.theme, product.flavour].filter(Boolean),
    createdAt: now(),
    updatedAt: now()
  }));

  const chocolateCake = products.find((product) => product.name.includes("Chocolate")) || products[0];

  return {
    products,
    requests: [
      {
        _id: randomUUID(),
        customerName: "Riya Sharma",
        phone: "9876501234",
        cakeDesignId: products[0]?._id || "",
        selectedDesign: products[0]?.name || "Royal Berry Birthday Cake",
        selectedDesignImage: products[0]?.image || "",
        category: "Birthday",
        occasion: "Birthday",
        theme: "Floral",
        flavour: "Vanilla Berry",
        weight: "1kg",
        size: "1kg",
        budget: 1500,
        requiredDate: upcomingDate(3),
        fulfillmentType: "Pickup",
        notes: "Need pastel pink finish with name topper.",
        status: "Design Shared",
        priority: "Pending",
        createdAt: now(),
        updatedAt: now()
      },
      {
        _id: randomUUID(),
        customerName: "Priya Sharma",
        phone: "9876543210",
        cakeDesignId: chocolateCake?._id || "",
        selectedDesign: "Chocolate Truffle Birthday Cake",
        selectedDesignImage: chocolateCake?.image || "",
        category: "Birthday",
        occasion: "Birthday",
        theme: "Chocolate Truffle",
        flavour: "Belgian Chocolate",
        weight: "1.5kg",
        size: "1.5kg",
        budget: 2200,
        requiredDate: upcomingDate(7),
        fulfillmentType: "Delivery",
        notes: "Wants a chocolate theme cake with name written on top.",
        status: "New",
        priority: "High Priority",
        createdAt: now(),
        updatedAt: now()
      }
    ],
    orders: [],
    meta: { seedVersion: 3 }
  };
}

function loadStore() {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  if (!existsSync(dataFile)) {
    const seeded = seedStore();
    writeFileSync(dataFile, JSON.stringify(seeded, null, 2));
    return seeded;
  }

  const parsed = JSON.parse(readFileSync(dataFile, "utf-8"));
  return ensureSeedData({
    products: parsed.products || [],
    requests: parsed.requests || [],
    orders: parsed.orders || [],
    meta: parsed.meta || {}
  });
}

function ensureSeedData(store) {
  let changed = false;
  const hasPriya = store.requests.some((request) => request.phone === "9876543210" || request.customerName === "Priya Sharma");

  if (!hasPriya) {
    const seeded = seedStore();
    const priyaRequest = seeded.requests.find((request) => request.customerName === "Priya Sharma");
    store.requests.unshift(priyaRequest);
    changed = true;
  }

  if (store.meta?.seedVersion !== 3) {
    store.products = store.products.filter((product) => !["Persistence Test Truffle Cake", "Submission Test Chocolate Cake"].includes(product.name));
    store.requests = store.requests.filter((request) => !["Workflow Demo", "Blocked Convert", "Submission Client"].includes(request.customerName));
    store.orders = store.orders.filter((order) => !["Workflow Demo", "Submission Client"].includes(order.customerName));

    const priyaRequest = store.requests.find((request) => request.phone === "9876543210" || request.customerName === "Priya Sharma");
    if (priyaRequest) {
      Object.assign(priyaRequest, {
        customerName: "Priya Sharma",
        phone: "9876543210",
        selectedDesign: "Chocolate Truffle Birthday Cake",
        category: "Birthday",
        occasion: "Birthday",
        theme: "Chocolate Truffle",
        flavour: "Belgian Chocolate",
        weight: "1.5kg",
        size: "1.5kg",
        budget: 2200,
        requiredDate: upcomingDate(7),
        fulfillmentType: "Delivery",
        notes: "Wants a chocolate theme cake with name written on top.",
        status: "New",
        priority: "High Priority",
        updatedAt: now()
      });
    }

    store.orders = store.orders.filter((order) => !(order.phone === "9876543210" || order.customerName === "Priya Sharma"));
    store.meta = { ...(store.meta || {}), seedVersion: 3 };
    changed = true;
  }

  store.products = store.products.map((product) => ({
    ...product,
    size: product.size || product.weight || "1kg",
    availability: product.availability || "Available",
    tags: product.tags || []
  }));

  if (changed) saveStore(store);
  return store;
}

export const memoryStore = loadStore();

export function saveStore(store = memoryStore) {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  writeFileSync(dataFile, JSON.stringify(store, null, 2));
}

memoryStore.createProduct = (payload) => {
  const record = { ...payload, _id: randomUUID(), createdAt: now(), updatedAt: now() };
  memoryStore.products.unshift(record);
  saveStore();
  return record;
};

export function createRecord(collection, payload) {
  const record = { ...payload, _id: randomUUID(), createdAt: now(), updatedAt: now() };
  memoryStore[collection].unshift(record);
  saveStore();
  return record;
}

export function updateRecord(collection, id, payload) {
  const index = memoryStore[collection].findIndex((record) => record._id === id);
  if (index === -1) return null;
  memoryStore[collection][index] = { ...memoryStore[collection][index], ...payload, updatedAt: now() };
  saveStore();
  return memoryStore[collection][index];
}

export function deleteRecord(collection, id) {
  const index = memoryStore[collection].findIndex((record) => record._id === id);
  if (index === -1) return false;
  memoryStore[collection].splice(index, 1);
  saveStore();
  return true;
}

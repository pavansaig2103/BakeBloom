import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { sampleProducts } from "../data/sampleProducts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
  ? path.join("/tmp", "bakebloom")
  : path.resolve(__dirname, "../../data");
const dataFile = path.join(dataDir, "store.json");
const now = () => new Date().toISOString();
const upcomingDate = (days) => new Date(Date.now() + 86400000 * days).toISOString().slice(0, 10);

function seedStore() {
  const requiredProducts = [
    {
      name: "Chocolate Truffle Birthday Cake",
      category: "Birthday",
      price: 1899,
      image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80",
      description: "Rich chocolate truffle cake with drip finish, birthday topper, and custom name message.",
      rating: 4.9,
      occasion: "Birthday",
      theme: "Chocolate Truffle",
      flavour: "Belgian Chocolate",
      weight: "1.5kg",
      priceRange: "Rs. 1500 - Rs. 2500",
      referenceId: "CC-BD-TRUFFLE",
      isPopular: true,
      isActive: true,
      views: 210
    },
    {
      name: "Floral Wedding Cake",
      category: "Wedding",
      price: 3499,
      image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=80",
      description: "Elegant floral wedding cake with soft pastel cream, delicate piping, and premium finish.",
      rating: 4.8,
      occasion: "Wedding",
      theme: "Floral",
      flavour: "Rose Pistachio",
      weight: "2kg",
      priceRange: "Rs. 2500+",
      referenceId: "CC-WD-FLORAL",
      isPopular: true,
      isActive: true,
      views: 188
    },
    {
      name: "Red Velvet Anniversary Cake",
      category: "Anniversary",
      price: 1599,
      image: "https://images.unsplash.com/photo-1616690710400-a16d146927c5?auto=format&fit=crop&w=900&q=80",
      description: "Romantic red velvet anniversary cake with cream cheese frosting and heart detail.",
      rating: 4.9,
      occasion: "Anniversary",
      theme: "Romantic",
      flavour: "Red Velvet",
      weight: "1kg",
      priceRange: "Rs. 1500 - Rs. 2500",
      referenceId: "CC-AN-REDVELVET",
      isPopular: true,
      isActive: true,
      views: 166
    },
    {
      name: "Brownie Box",
      category: "Brownies",
      price: 699,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
      description: "Assorted fudgy brownie box for gifting, parties, and dessert tables.",
      rating: 4.7,
      occasion: "Gifting",
      theme: "Assorted",
      flavour: "Chocolate",
      weight: "Box of 9",
      priceRange: "Under Rs. 750",
      referenceId: "CC-BR-BOX",
      isPopular: false,
      isActive: true,
      views: 124
    },
    {
      name: "Festival Sweet Box",
      category: "Sweet Boxes",
      price: 1299,
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
      description: "Curated festive sweet box with brownies, cookies, and premium dessert bites.",
      rating: 4.6,
      occasion: "Festival",
      theme: "Festive",
      flavour: "Mixed",
      weight: "Gift box",
      priceRange: "Rs. 750 - Rs. 1500",
      referenceId: "CC-FS-SWEETBOX",
      isPopular: false,
      isActive: true,
      views: 132
    },
    {
      name: "Corporate Cupcakes",
      category: "Corporate",
      price: 899,
      image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=900&q=80",
      description: "Cupcake set for office celebrations, brand events, and team gifting.",
      rating: 4.8,
      occasion: "Corporate",
      theme: "Minimal",
      flavour: "Mixed",
      weight: "Box of 12",
      priceRange: "Rs. 750 - Rs. 1500",
      referenceId: "CC-CO-CUPCAKES",
      isPopular: true,
      isActive: true,
      views: 145
    }
  ];

  const mergedProducts = [
    ...requiredProducts,
    ...sampleProducts.filter((product) => !requiredProducts.some((required) => required.name === product.name)).slice(0, 2)
  ];

  const products = mergedProducts.map((product) => ({
    ...product,
    _id: randomUUID(),
    size: product.size || product.weight || "1kg",
    availability: product.availability || "Available",
    tags: product.tags || [product.occasion, product.theme, product.flavour].filter(Boolean),
    createdAt: now(),
    updatedAt: now()
  }));

  const chocolateCake = products.find((product) => product.name === "Chocolate Truffle Birthday Cake") || products[0];
  const floralCake = products.find((product) => product.name === "Floral Wedding Cake") || products[1] || products[0];
  const redVelvetCake = products.find((product) => product.name === "Red Velvet Anniversary Cake") || products[2] || products[0];

  const confirmedEnquiryId = randomUUID();
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
      },
      {
        _id: confirmedEnquiryId,
        customerName: "Ananya Mehta",
        phone: "9876502222",
        cakeDesignId: floralCake?._id || "",
        selectedDesign: "Floral Wedding Cake",
        selectedDesignImage: floralCake?.image || "",
        category: "Wedding",
        occasion: "Wedding",
        theme: "Floral",
        flavour: "Rose Pistachio",
        weight: "2kg",
        size: "2kg",
        budget: 3500,
        requiredDate: upcomingDate(14),
        fulfillmentType: "Delivery",
        notes: "Two-tier pastel floral cake for engagement ceremony.",
        status: "Confirmed",
        priority: "Confirmed",
        createdAt: now(),
        updatedAt: now()
      },
      {
        _id: randomUUID(),
        customerName: "Rohan Kapoor",
        phone: "9876503333",
        cakeDesignId: redVelvetCake?._id || "",
        selectedDesign: "Red Velvet Anniversary Cake",
        selectedDesignImage: redVelvetCake?.image || "",
        category: "Anniversary",
        occasion: "Anniversary",
        theme: "Romantic",
        flavour: "Red Velvet",
        weight: "1kg",
        size: "1kg",
        budget: 1800,
        requiredDate: upcomingDate(5),
        fulfillmentType: "Pickup",
        notes: "Heart design with Happy Anniversary message.",
        status: "Contacted",
        priority: "Pending",
        createdAt: now(),
        updatedAt: now()
      }
    ],
    orders: [
      {
        _id: randomUUID(),
        enquiryId: confirmedEnquiryId,
        customerName: "Ananya Mehta",
        phone: "9876502222",
        email: "",
        address: "MG Road, Bengaluru",
        selectedCake: "Floral Wedding Cake",
        items: [
          {
            productId: floralCake?._id || "",
            name: "Floral Wedding Cake",
            flavour: "Rose Pistachio",
            size: "2kg",
            message: "Pastel floral engagement cake.",
            deliveryDate: upcomingDate(14),
            quantity: 1,
            price: 3600,
            image: floralCake?.image || ""
          }
        ],
        totalAmount: 3600,
        finalPrice: 3600,
        deliveryDate: upcomingDate(14),
        deliverySlot: "4:00 PM - 6:00 PM",
        fulfillmentType: "Delivery",
        notes: "Confirmed order. Keep flowers pastel pink and white.",
        paymentMode: "UPI",
        paymentStatus: "Advance Paid",
        status: "Confirmed",
        orderStatus: "Confirmed",
        createdAt: now(),
        updatedAt: now()
      },
      {
        _id: randomUUID(),
        customerName: "Aarav Nair",
        phone: "9876504444",
        email: "",
        address: "Whitefield, Bengaluru",
        selectedCake: "Corporate Cupcakes",
        items: [
          {
            productId: products.find((product) => product.name === "Corporate Cupcakes")?._id || "",
            name: "Corporate Cupcakes",
            flavour: "Mixed",
            size: "Box of 24",
            message: "Assorted office celebration cupcakes.",
            deliveryDate: upcomingDate(2),
            quantity: 2,
            price: 1800,
            image: products.find((product) => product.name === "Corporate Cupcakes")?.image || ""
          }
        ],
        totalAmount: 1800,
        finalPrice: 1800,
        deliveryDate: upcomingDate(2),
        deliverySlot: "10:00 AM - 12:00 PM",
        fulfillmentType: "Delivery",
        notes: "Pending balance before dispatch.",
        paymentMode: "Pay at Store",
        paymentStatus: "Pending",
        status: "Preparing",
        orderStatus: "Preparing",
        createdAt: now(),
        updatedAt: now()
      }
    ],
    meta: { seedVersion: 4 }
  };
}

function loadStore() {
  try {
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
  } catch (error) {
    console.warn("Using non-persistent demo store:", error.message);
    const seeded = seedStore();
    return seeded;
  }
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

  if (store.meta?.seedVersion !== 4) {
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
    if (store.products.length < 6 || store.requests.length < 3 || store.orders.length < 2) {
      const seeded = seedStore();
      store.products = mergeByName(store.products, seeded.products);
      store.requests = mergeByPhoneAndName(store.requests, seeded.requests);
      store.orders = mergeByPhoneAndCake(store.orders, seeded.orders);
    }
    store.meta = { ...(store.meta || {}), seedVersion: 4 };
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
  try {
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
    writeFileSync(dataFile, JSON.stringify(store, null, 2));
  } catch (error) {
    console.warn("Demo store changes are in-memory only:", error.message);
  }
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

function mergeByName(current, seeded) {
  const names = new Set(current.map((item) => item.name));
  return [...current, ...seeded.filter((item) => !names.has(item.name))];
}

function mergeByPhoneAndName(current, seeded) {
  const keys = new Set(current.map((item) => `${item.phone}-${item.customerName}`));
  return [...current, ...seeded.filter((item) => !keys.has(`${item.phone}-${item.customerName}`))];
}

function mergeByPhoneAndCake(current, seeded) {
  const keys = new Set(current.map((item) => `${item.phone}-${item.selectedCake}`));
  return [...current, ...seeded.filter((item) => !keys.has(`${item.phone}-${item.selectedCake}`))];
}

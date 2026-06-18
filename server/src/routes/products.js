import express from "express";
import Product from "../models/Product.js";
import { memoryStore } from "../store/memoryStore.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    if (req.app.locals.useMemory) {
      return res.json(memoryStore.products);
    }
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = normalizeProduct(req.body);
    if (req.app.locals.useMemory) {
      return res.status(201).json(memoryStore.createProduct(payload));
    }
    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (req.app.locals.useMemory) {
      const product = memoryStore.products.find((item) => item._id === req.params.id);
      return product ? res.json(product) : res.status(404).json({ message: "Product not found" });
    }
    const product = await Product.findById(req.params.id);
    return product ? res.json(product) : res.status(404).json({ message: "Product not found" });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const payload = normalizeProduct(req.body);
    if (req.app.locals.useMemory) {
      const index = memoryStore.products.findIndex((item) => item._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: "Cake design not found" });
      memoryStore.products[index] = { ...memoryStore.products[index], ...payload, updatedAt: new Date().toISOString() };
      return res.json(memoryStore.products[index]);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true });
    return product ? res.json(product) : res.status(404).json({ message: "Cake design not found" });
  } catch (error) {
    next(error);
  }
});

function normalizeProduct(body) {
  const price = Number(body.price ?? 0);
  return {
    name: body.name || body.title,
    category: body.category || body.occasion || "Celebration",
    price,
    image: body.image || body.imageUrl,
    description: body.description,
    rating: Number(body.rating || 4.7),
    occasion: body.occasion || body.category || "Celebration",
    theme: body.theme || "Signature",
    flavour: body.flavour || body.flavor || "Vanilla",
    weight: body.weight || "1kg",
    priceRange: body.priceRange || toPriceRange(price),
    referenceId: body.referenceId,
    isPopular: Boolean(body.isPopular),
    isActive: body.isActive !== false,
    views: Number(body.views || 0)
  };
}

function toPriceRange(price) {
  if (price <= 750) return "Under Rs. 750";
  if (price <= 1500) return "Rs. 750 - Rs. 1500";
  if (price <= 2500) return "Rs. 1500 - Rs. 2500";
  return "Rs. 2500+";
}

export default router;

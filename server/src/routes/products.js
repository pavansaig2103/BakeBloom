import express from "express";
import Product from "../models/Product.js";
import { deleteRecord, memoryStore, updateRecord } from "../store/memoryStore.js";

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
    const validationError = validateProduct(payload);
    if (validationError) return res.status(400).json({ message: validationError });
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
    const validationError = validateProduct(payload);
    if (validationError) return res.status(400).json({ message: validationError });
    if (req.app.locals.useMemory) {
      const product = updateRecord("products", req.params.id, payload);
      return product ? res.json(product) : res.status(404).json({ message: "Cake design not found" });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true });
    return product ? res.json(product) : res.status(404).json({ message: "Cake design not found" });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (req.app.locals.useMemory) {
      return deleteRecord("products", req.params.id)
        ? res.json({ message: "Cake design deleted" })
        : res.status(404).json({ message: "Cake design not found" });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    return product ? res.json({ message: "Cake design deleted" }) : res.status(404).json({ message: "Cake design not found" });
  } catch (error) {
    next(error);
  }
});

function normalizeProduct(body) {
  const price = Number(body.price ?? 0);
  const tags = Array.isArray(body.tags)
    ? body.tags
    : String(body.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
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
    size: body.size || body.weight || "1kg",
    priceRange: body.priceRange || toPriceRange(price),
    availability: body.availability || "Available",
    tags,
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

function validateProduct(payload) {
  if (!payload.name?.trim()) return "Cake name is required";
  if (!payload.image?.trim()) return "Image URL is required";
  if (!payload.description?.trim()) return "Description is required";
  if (!payload.theme?.trim()) return "Theme is required";
  if (!payload.price || Number(payload.price) <= 0) return "Valid price is required";
  return "";
}

export default router;

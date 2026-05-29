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

export default router;

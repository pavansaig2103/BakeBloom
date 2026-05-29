import express from "express";
import Order from "../models/Order.js";
import { createRecord, memoryStore, updateRecord } from "../store/memoryStore.js";

const router = express.Router();
const statuses = ["Pending", "Accepted", "Preparing", "Packed", "Out for Delivery", "Delivered", "Rejected"];

router.post("/", async (req, res, next) => {
  try {
    const payload = { ...req.body, status: "Pending" };
    if (req.app.locals.useMemory) {
      return res.status(201).json(createRecord("orders", payload));
    }
    const order = await Order.create(payload);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    if (req.app.locals.useMemory) {
      return res.json(memoryStore.orders);
    }
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!statuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    if (req.app.locals.useMemory) {
      const order = updateRecord("orders", req.params.id, { status });
      return order ? res.json(order) : res.status(404).json({ message: "Order not found" });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    return order ? res.json(order) : res.status(404).json({ message: "Order not found" });
  } catch (error) {
    next(error);
  }
});

export default router;

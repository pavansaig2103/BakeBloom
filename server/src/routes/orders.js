import express from "express";
import Order from "../models/Order.js";
import { createRecord, memoryStore, updateRecord } from "../store/memoryStore.js";

const router = express.Router();
const statuses = ["New", "Contacted", "Confirmed", "Cancelled"];

router.post("/", async (req, res, next) => {
  try {
    const payload = { ...req.body, status: "New" };
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
      return res.status(400).json({ message: "Invalid enquiry status" });
    }

    if (req.app.locals.useMemory) {
      const order = updateRecord("orders", req.params.id, { status });
      return order ? res.json(order) : res.status(404).json({ message: "Enquiry not found" });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    return order ? res.json(order) : res.status(404).json({ message: "Enquiry not found" });
  } catch (error) {
    next(error);
  }
});

export default router;

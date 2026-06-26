import express from "express";
import Order from "../models/Order.js";
import { createRecord, memoryStore, updateRecord } from "../store/memoryStore.js";

const router = express.Router();
const statuses = ["Confirmed", "Preparing", "Ready", "Delivered", "Completed", "Cancelled"];
const paymentStatuses = ["Pending", "Advance Paid", "Fully Paid"];

router.post("/", async (req, res, next) => {
  try {
    const payload = normalizeOrder(req.body);
    const validationError = validateOrder(payload);
    if (validationError) return res.status(400).json({ message: validationError });
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
      const order = updateRecord("orders", req.params.id, { status, orderStatus: status });
      return order ? res.json(order) : res.status(404).json({ message: "Order not found" });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status, orderStatus: status }, { new: true });
    return order ? res.json(order) : res.status(404).json({ message: "Order not found" });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/payment-status", async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;
    if (!paymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    if (req.app.locals.useMemory) {
      const order = updateRecord("orders", req.params.id, { paymentStatus });
      return order ? res.json(order) : res.status(404).json({ message: "Order not found" });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus }, { new: true });
    return order ? res.json(order) : res.status(404).json({ message: "Order not found" });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (req.app.locals.useMemory) {
      const order = memoryStore.orders.find((item) => item._id === req.params.id);
      return order ? res.json(order) : res.status(404).json({ message: "Order not found" });
    }
    const order = await Order.findById(req.params.id);
    return order ? res.json(order) : res.status(404).json({ message: "Order not found" });
  } catch (error) {
    next(error);
  }
});

function normalizeOrder(body) {
  const totalAmount = Number(body.totalAmount || body.finalPrice || 0);
  if (body.status && !statuses.includes(body.status)) {
    throw new Error("Invalid order status");
  }
  if (body.paymentStatus && !paymentStatuses.includes(body.paymentStatus)) {
    throw new Error("Invalid payment status");
  }
  return {
    ...body,
    totalAmount,
    finalPrice: Number(body.finalPrice || totalAmount),
    deliverySlot: body.deliverySlot || "To be confirmed",
    paymentStatus: body.paymentStatus || "Pending",
    status: body.status || body.orderStatus || "Confirmed",
    orderStatus: body.orderStatus || body.status || "Confirmed"
  };
}

function validateOrder(payload) {
  if (!payload.customerName?.trim()) return "Customer name is required";
  if (!payload.phone?.trim()) return "Phone number is required";
  if (!payload.deliveryDate) return "Delivery date is required";
  if (!payload.totalAmount || Number(payload.totalAmount) <= 0) return "Final price is required";
  return "";
}

export default router;

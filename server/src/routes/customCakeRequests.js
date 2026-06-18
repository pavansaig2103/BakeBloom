import express from "express";
import CustomCakeRequest from "../models/CustomCakeRequest.js";
import { createRecord, memoryStore } from "../store/memoryStore.js";

const router = express.Router();
const statuses = ["New", "Contacted", "Confirmed", "Cancelled"];

router.post("/", async (req, res, next) => {
  try {
    const payload = { ...req.body, status: "New" };
    if (req.app.locals.useMemory) {
      return res.status(201).json(createRecord("requests", payload));
    }
    const request = await CustomCakeRequest.create(payload);
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    if (req.app.locals.useMemory) {
      return res.json(memoryStore.requests);
    }
    const requests = await CustomCakeRequest.find().sort({ createdAt: -1 });
    res.json(requests);
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
      const index = memoryStore.requests.findIndex((request) => request._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: "Enquiry not found" });
      memoryStore.requests[index] = { ...memoryStore.requests[index], status, updatedAt: new Date().toISOString() };
      return res.json(memoryStore.requests[index]);
    }

    const request = await CustomCakeRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    return request ? res.json(request) : res.status(404).json({ message: "Enquiry not found" });
  } catch (error) {
    next(error);
  }
});

export default router;

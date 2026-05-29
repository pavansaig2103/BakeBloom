import express from "express";
import CustomCakeRequest from "../models/CustomCakeRequest.js";
import { createRecord, memoryStore } from "../store/memoryStore.js";

const router = express.Router();

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

export default router;

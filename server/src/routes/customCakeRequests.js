import express from "express";
import CustomCakeRequest from "../models/CustomCakeRequest.js";
import Order from "../models/Order.js";
import { createRecord, memoryStore, updateRecord } from "../store/memoryStore.js";

const router = express.Router();
const statuses = ["New", "Contacted", "Design Shared", "Confirmed", "Completed", "Cancelled"];

router.post("/", async (req, res, next) => {
  try {
    const payload = normalizeRequest(req.body);
    const validationError = validateRequest(payload);
    if (validationError) return res.status(400).json({ message: validationError });
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
      const request = updateRecord("requests", req.params.id, { status, priority: priorityForStatus(status) });
      return request ? res.json(request) : res.status(404).json({ message: "Enquiry not found" });
    }

    const request = await CustomCakeRequest.findByIdAndUpdate(req.params.id, { status, priority: priorityForStatus(status) }, { new: true });
    return request ? res.json(request) : res.status(404).json({ message: "Enquiry not found" });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const payload = normalizeRequest(req.body, false);
    const validationError = validateRequest(payload, false);
    if (validationError) return res.status(400).json({ message: validationError });
    if (req.app.locals.useMemory) {
      const request = updateRecord("requests", req.params.id, payload);
      return request ? res.json(request) : res.status(404).json({ message: "Enquiry not found" });
    }
    const request = await CustomCakeRequest.findByIdAndUpdate(req.params.id, payload, { new: true });
    return request ? res.json(request) : res.status(404).json({ message: "Enquiry not found" });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/convert-to-order", async (req, res, next) => {
  try {
    const finalPrice = Number(req.body.finalPrice || req.body.totalAmount || 0);
    if (!finalPrice) return res.status(400).json({ message: "Final price is required" });

    if (req.app.locals.useMemory) {
      const request = memoryStore.requests.find((item) => item._id === req.params.id);
      if (!request) return res.status(404).json({ message: "Enquiry not found" });
      const ruleError = validateConversion(request);
      if (ruleError) return res.status(400).json({ message: ruleError });
      const order = createRecord("orders", buildOrderPayload(request, req.body, finalPrice));
      return res.status(201).json(order);
    }

    const request = await CustomCakeRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Enquiry not found" });
    const ruleError = validateConversion(request);
    if (ruleError) return res.status(400).json({ message: ruleError });
    const order = await Order.create(buildOrderPayload(request.toObject(), req.body, finalPrice));
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

function normalizeRequest(body, forceNewStatus = true) {
  const status = forceNewStatus ? "New" : body.status;
  const weight = body.weight || body.size || "1kg";
  return {
    customerName: body.customerName,
    phone: body.phone,
    cakeDesignId: body.cakeDesignId || body.productId || "",
    selectedDesign: body.selectedDesign || body.designName || body.theme,
    selectedDesignImage: body.selectedDesignImage || body.image || "",
    category: body.category || body.occasion || "Custom",
    theme: body.theme || body.selectedDesign || "Custom",
    weight,
    size: body.size || weight,
    flavour: body.flavour || body.flavor || "Chocolate",
    occasion: body.occasion || "",
    budget: Number(body.budget || 0),
    requiredDate: body.requiredDate || body.occasionDate,
    fulfillmentType: body.fulfillmentType || "Pickup",
    followUpDate: body.followUpDate || "",
    notes: body.notes || body.customNotes || "",
    ...(status ? { status, priority: priorityForStatus(status) } : {})
  };
}

function validateRequest(payload, requireCoreFields = true) {
  if (requireCoreFields && !payload.customerName?.trim()) return "Customer name is required";
  if (requireCoreFields && !payload.phone?.trim()) return "Phone number is required";
  if (payload.phone && String(payload.phone).replace(/\D/g, "").length < 10) return "Enter a valid phone number";
  if (requireCoreFields && !payload.requiredDate) return "Occasion date is required";
  if (payload.status && !statuses.includes(payload.status)) return "Invalid enquiry status";
  return "";
}

function buildOrderPayload(request, body, finalPrice) {
  const deliveryDate = body.deliveryDate || request.requiredDate;
  return {
    enquiryId: request._id,
    customerName: body.customerName || request.customerName,
    phone: body.phone || request.phone,
    email: body.email || "",
    address: body.address || "",
    selectedCake: request.selectedDesign || request.theme,
    items: [
      {
        productId: request.cakeDesignId,
        name: request.selectedDesign || request.theme,
        flavour: request.flavour,
        size: request.size || request.weight,
        message: request.notes,
        deliveryDate,
        quantity: Number(body.quantity || 1),
        price: finalPrice,
        image: request.selectedDesignImage
      }
    ],
    totalAmount: finalPrice,
    finalPrice,
    deliveryDate,
    deliverySlot: body.deliverySlot || "To be confirmed",
    fulfillmentType: body.fulfillmentType || request.fulfillmentType || "Pickup",
    notes: body.notes || request.notes || "",
    paymentMode: body.paymentMode || "Pay at Store",
    paymentStatus: body.paymentStatus || "Pending",
    status: "Confirmed",
    orderStatus: body.orderStatus || "Confirmed"
  };
}

function validateConversion(request) {
  if (request.status === "Cancelled") return "Cancelled enquiries cannot be converted into orders";
  if (request.status !== "Confirmed") return "Only confirmed enquiries can be converted into orders";
  return "";
}

function priorityForStatus(status) {
  if (status === "Confirmed") return "Confirmed";
  if (status === "Completed") return "Completed";
  if (status === "Cancelled") return "Cancelled";
  if (status === "New") return "High Priority";
  return "Pending";
}

export default router;

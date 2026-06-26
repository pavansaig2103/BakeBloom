import mongoose from "mongoose";

const customCakeRequestSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    cakeDesignId: String,
    selectedDesign: String,
    selectedDesignImage: String,
    category: String,
    theme: { type: String, required: true },
    size: String,
    weight: { type: String, required: true },
    flavour: { type: String, required: true },
    occasion: String,
    budget: Number,
    requiredDate: { type: String, required: true },
    fulfillmentType: { type: String, default: "Pickup" },
    followUpDate: String,
    notes: String,
    status: { type: String, enum: ["New", "Contacted", "Design Shared", "Confirmed", "Completed", "Cancelled"], default: "New" },
    priority: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

export default mongoose.model("CustomCakeRequest", customCakeRequestSchema);

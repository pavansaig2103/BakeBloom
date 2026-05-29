import mongoose from "mongoose";

const customCakeRequestSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    theme: { type: String, required: true },
    weight: { type: String, required: true },
    flavour: { type: String, required: true },
    occasion: String,
    budget: Number,
    requiredDate: { type: String, required: true },
    notes: String,
    status: { type: String, default: "New" }
  },
  { timestamps: true }
);

export default mongoose.model("CustomCakeRequest", customCakeRequestSchema);

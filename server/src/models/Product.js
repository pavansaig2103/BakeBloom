import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    occasion: { type: String, default: "Celebration" },
    theme: { type: String, default: "Signature" },
    flavour: { type: String, default: "Vanilla" },
    weight: { type: String, default: "1kg" },
    priceRange: { type: String, default: "Rs. 1000 - Rs. 1500" },
    referenceId: { type: String, unique: true, sparse: true },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);

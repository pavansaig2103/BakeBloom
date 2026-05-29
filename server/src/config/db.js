import mongoose from "mongoose";
import Product from "../models/Product.js";
import { sampleProducts } from "../data/sampleProducts.js";

export async function connectDatabase() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bakebloom";

  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(sampleProducts);
      console.log("Seeded bakery products");
    }
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.warn("MongoDB unavailable, using in-memory prototype data:", error.message);
    return false;
  }
}

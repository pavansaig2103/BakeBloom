import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: String,
    name: String,
    flavour: String,
    size: String,
    message: String,
    deliveryDate: String,
    quantity: Number,
    price: Number,
    image: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    address: { type: String, required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    deliveryDate: { type: String, required: true },
    deliverySlot: { type: String, required: true },
    paymentMode: { type: String, default: "Cash on Delivery" },
    status: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

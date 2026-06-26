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
    address: { type: String, default: "" },
    enquiryId: String,
    selectedCake: String,
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    finalPrice: Number,
    deliveryDate: { type: String, required: true },
    deliverySlot: { type: String, default: "To be confirmed" },
    fulfillmentType: { type: String, default: "Pickup" },
    notes: String,
    paymentMode: { type: String, default: "Pay at Store" },
    paymentStatus: { type: String, enum: ["Pending", "Advance Paid", "Fully Paid"], default: "Pending" },
    status: { type: String, enum: ["Confirmed", "Preparing", "Ready", "Delivered", "Completed", "Cancelled"], default: "Confirmed" },
    orderStatus: { type: String, enum: ["Confirmed", "Preparing", "Ready", "Delivered", "Completed", "Cancelled"], default: "Confirmed" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

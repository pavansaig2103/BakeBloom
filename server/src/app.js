import cors from "cors";
import express from "express";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import customCakeRequestsRouter from "./routes/customCakeRequests.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", storage: req.app.locals.useMemory ? "memory" : "mongodb" });
});

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/custom-cake-requests", customCakeRequestsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong", error: error.message });
});

export default app;

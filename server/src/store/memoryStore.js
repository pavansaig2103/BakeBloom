import { randomUUID } from "crypto";
import { sampleProducts } from "../data/sampleProducts.js";

const now = () => new Date().toISOString();

export const memoryStore = {
  products: sampleProducts.map((product) => ({
    ...product,
    _id: randomUUID(),
    createdAt: now(),
    updatedAt: now()
  })),
  orders: [],
  requests: []
};

memoryStore.createProduct = (payload) => {
  const record = { ...payload, _id: randomUUID(), createdAt: now(), updatedAt: now() };
  memoryStore.products.unshift(record);
  return record;
};

export function createRecord(collection, payload) {
  const record = { ...payload, _id: randomUUID(), createdAt: now(), updatedAt: now() };
  memoryStore[collection].unshift(record);
  return record;
}

export function updateRecord(collection, id, payload) {
  const index = memoryStore[collection].findIndex((record) => record._id === id);
  if (index === -1) return null;
  memoryStore[collection][index] = { ...memoryStore[collection][index], ...payload, updatedAt: now() };
  return memoryStore[collection][index];
}

import dotenv from "dotenv";
import app from "../server/src/app.js";
import { connectDatabase } from "../server/src/config/db.js";

dotenv.config();

let initPromise;

async function initialize() {
  if (!initPromise) {
    initPromise = connectDatabase().then((connected) => {
      app.locals.useMemory = !connected;
    });
  }

  await initPromise;
}

export default async function handler(req, res) {
  await initialize();
  return app(req, res);
}

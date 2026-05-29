import dotenv from "dotenv";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5108;
const connected = await connectDatabase();
app.locals.useMemory = !connected;

app.listen(port, () => {
  console.log(`BakeBloom API running on http://localhost:${port}`);
});

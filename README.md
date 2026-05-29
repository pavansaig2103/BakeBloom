# BakeBloom — Online Cake Ordering System

BakeBloom is a clean full-stack bakery and cake shop e-commerce prototype. Customers can browse seeded cakes, customize product options, add items to cart, place cash/pay-at-store orders, submit custom cake requests, and update orders from a simple admin dashboard.

## Folder Structure

```text
bakebloom/
  client/
    src/
      components/
      context/
      pages/
      api.js
      App.jsx
      main.jsx
      styles.css
    package.json
    tailwind.config.js
    postcss.config.js
  server/
    src/
      config/
      data/
      models/
      routes/
      store/
      app.js
      server.js
    package.json
    .env.example
  package.json
  README.md
```

## Setup

1. Install dependencies:

```bash
npm install
npm run install:all
```

2. Optional MongoDB setup:

```bash
cp server/.env.example server/.env
```

Set `MONGO_URI` if your MongoDB runs somewhere else. If MongoDB is not available, the API starts with in-memory prototype data so the app can still be explored.

3. Run the full app:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5108`

If port `5108` is already in use, start the backend on another port and point Vite at it:

```bash
cd server
$env:PORT="5110"; npm run start

cd ../client
$env:VITE_API_URL="http://localhost:5110/api"; npm run dev
```

## API Routes

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/orders`
- `GET /api/orders`
- `PATCH /api/orders/:id/status`
- `POST /api/custom-cake-requests`
- `GET /api/custom-cake-requests`

## Vercel Deployment

This project includes `vercel.json` and `api/index.js` so Vercel can deploy the React frontend and the Express API together.

Recommended Vercel environment variable:

```text
MONGO_URI=mongodb+srv://...
```

Without `MONGO_URI`, the API falls back to in-memory demo data. That is fine for previewing the prototype, but orders will not persist reliably between serverless function cold starts.

## Notes

- Payment mode is prototype-only: Cash on Delivery or Pay at Store.
- Admin dashboard is directly accessible at `/admin`.
- Product data is seeded automatically when MongoDB is connected and empty.

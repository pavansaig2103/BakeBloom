# Cake Photo Gallery & Design Inspiration Portal

## Cakes and Crunches

This project is a full-stack cake design gallery and enquiry management system built for **Cakes and Crunches**. It helps the shop maintain a centralized collection of completed cake designs so customers can browse references and staff can manage design enquiries from one dashboard.

The system is designed for a bakery where customers often choose cake designs from photos shared through WhatsApp, Instagram, or previous orders. Instead of keeping those references scattered, this portal organizes them into a searchable gallery.

## Project Objective

The main objective of this project is to provide a simple and professional portal where:

- Customers can browse cake design references.
- Designs can be filtered by occasion, theme, flavor, and price range.
- Customers can save selected designs as inspiration.
- Customers can submit a design enquiry.
- Staff can manage cake designs and track enquiries from the admin dashboard.
- Admin can view basic reports and analytics about designs and enquiries.

## Problem Statement

Cake design photos are often stored in different places such as WhatsApp chats, Instagram posts, spreadsheets, and manual records. This makes it difficult for customers to quickly find suitable references and also makes it harder for staff to convert enquiries into confirmed cake requests.

## Solution

The Cake Photo Gallery & Design Inspiration Portal stores completed cake designs in one centralized system. Customers can browse the gallery, view design details, save references, and submit enquiries. Staff can use the admin dashboard to add new cake designs, monitor enquiries, update enquiry status, and view reports.

## Main Modules

### Public Side

- Home page with project overview
- Cake design gallery
- Filters for occasion, theme, flavor, and price range
- Cake design cards with reference ID and design details
- Design detail page
- WhatsApp enquiry button with pre-filled message
- Saved Inspirations page
- Submit Design Enquiry page
- Custom design enquiry form

### Admin Side

- Admin dashboard
- Total cake designs count
- Total enquiries count
- Popular occasion summary
- Confirmed requests count
- Recent enquiries table
- Manage Cake Designs form
- Manage Enquiries section
- Enquiry status update
- Reports section
- Basic visual charts for:
  - Occasion distribution
  - Enquiry status distribution
  - Price range demand

## Cake Design Fields

Each cake design includes:

- Title
- Description
- Image URL
- Occasion
- Theme
- Flavor
- Weight
- Price range
- Reference ID
- Popular status
- Active status

## Enquiry Statuses

The system uses these enquiry statuses:

- New
- Contacted
- Confirmed
- Cancelled

## Technology Stack

### Frontend

- React
- HTML
- CSS
- JavaScript
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB support
- In-memory fallback data for local running
- SQL schema file included for database design reference

### Other

- Vite
- Axios
- React Router

## Folder Structure

```text
BakeBloom-main/
  client/
    src/
      components/
      context/
      pages/
      api.js
      App.jsx
      main.jsx
      styles.css
  server/
    src/
      config/
      data/
      models/
      routes/
      store/
      app.js
      server.js
  database/
    schema.sql
  package.json
  README.md
```

## API Routes

### Cake Designs

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PATCH /api/products/:id`

### Enquiries

- `POST /api/orders`
- `GET /api/orders`
- `PATCH /api/orders/:id/status`

### Custom Design Enquiries

- `POST /api/custom-cake-requests`
- `GET /api/custom-cake-requests`
- `PATCH /api/custom-cake-requests/:id/status`

## Database Schema

The project includes a SQL schema file:

```text
database/schema.sql
```

It contains tables for:

- `cake_designs`
- `customers`
- `enquiries`
- `audit_logs`
- `users`

The running project currently uses MongoDB support with an in-memory fallback, so the project can run locally even if MongoDB is not connected.

## How to Run the Project

If VS Code terminal opens in the outer folder:

```powershell
cd C:\Users\LEGION\Downloads\BakeBloom-main
```

Install dependencies:

```powershell
npm.cmd run install:all
```

Run the project:

```powershell
npm.cmd run dev
```

If you are already inside the inner project folder, use:

```powershell
cd C:\Users\LEGION\Downloads\BakeBloom-main\BakeBloom-main
npm.cmd install
npm.cmd run install:all
npm.cmd run dev
```

Open the frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:5108
```

Admin dashboard:

```text
http://localhost:5173/admin
```

## Team Role Split

- Student 1 - Frontend: Home page, gallery page, filters, design details, saved inspirations, enquiry forms
- Student 2 - Backend: Express API, models, routes, enquiry status handling, database schema
- Student 3 - Testing & Documentation: Manual testing, route checking, README, project presentation support

## Project Summary

This project converts scattered cake design references into a structured gallery and enquiry management portal. It gives Cakes and Crunches a clean way to display previous cake designs, helps customers choose references faster, and helps staff track enquiries through a simple admin dashboard.

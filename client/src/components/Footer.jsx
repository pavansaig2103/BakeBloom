import React from "react";

export default function Footer() {
  return (
    <footer className="mt-16 bg-ganache text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="font-display text-2xl font-bold">Cakes and Crunches</h3>
          <p className="mt-3 text-sm text-cream/75">Cake Photo Gallery & Design Inspiration Portal for managing completed design references and customer enquiries.</p>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="mt-3 text-sm text-cream/75">Phone: +91 98765 43210</p>
          <p className="text-sm text-cream/75">Email: hello@cakesandcrunches.in</p>
        </div>
        <div>
          <h4 className="font-semibold">Visit Us</h4>
          <p className="mt-3 text-sm text-cream/75">12 Sugar Lane, Celebration Market</p>
          <p className="text-sm text-cream/75">Open daily: 8:00 AM - 10:00 PM</p>
        </div>
      </div>
    </footer>
  );
}

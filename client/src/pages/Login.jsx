import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "admin@cakesandcrunches.com", password: "admin123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  const submit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      login(form);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <img
          src="https://images.unsplash.com/photo-1557925923-cd4648e211a0?auto=format&fit=crop&w=1000&q=85"
          alt="Cakes and Crunches bakery counter"
          className="h-72 w-full object-cover lg:h-full"
        />
      </div>
      <form onSubmit={submit} className="self-center rounded-3xl bg-white p-6 shadow-soft sm:p-8">
        <p className="font-bold uppercase tracking-[0.18em] text-berry">Admin access</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-ganache">Sign in to manage orders</h1>
        <p className="mt-3 leading-7 text-cocoa/70">Use the demo admin account to manage cake designs, enquiries, orders, alerts, and reports.</p>
        <div className="mt-6 grid gap-5">
          <label className="field">Email
            <input
              className="input mt-2"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label className="field">Password
            <input
              className="input mt-2"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          {error && <p className="rounded-2xl bg-cream p-3 text-sm font-bold text-berry">{error}</p>}
          <button disabled={loading} className="rounded-full bg-cocoa px-7 py-3 font-bold text-white transition hover:bg-berry disabled:opacity-60">
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>
      </form>
    </section>
  );
}

import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const sessionKey = "cakes_admin_session";
const demoUser = {
  email: "admin@cakesandcrunches.com",
  password: "admin123",
  name: "Cakes and Crunches Admin"
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(sessionKey));
    } catch {
      return null;
    }
  });

  const login = ({ email, password }) => {
    if (email.trim().toLowerCase() !== demoUser.email || password !== demoUser.password) {
      throw new Error("Invalid email or password");
    }
    const session = { email: demoUser.email, name: demoUser.name, loggedInAt: new Date().toISOString() };
    localStorage.setItem(sessionKey, JSON.stringify(session));
    setUser(session);
    return session;
  };

  const logout = () => {
    localStorage.removeItem(sessionKey);
    setUser(null);
  };

  const value = useMemo(() => ({ user, isLoggedIn: Boolean(user), login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}

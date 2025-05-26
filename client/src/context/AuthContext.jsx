// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper pentru Base64URL → JSON
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Citește tokenul o singură dată la inițializare
  const storedToken = localStorage.getItem("token");
  const payload = storedToken ? parseJwt(storedToken) : null;

  // Stările se instanțiază SINCRON din payload
  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(
    payload ? { username: payload.username, email: payload.email } : null
  );

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    const pl = parseJwt(newToken);
    if (pl) {
      setUser({ username: pl.username, email: pl.email });
    }

    navigate("/dashboard", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

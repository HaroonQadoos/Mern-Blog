// src/context/AuthContext.jsx
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [signupPending, setSignupPending] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        setSignupPending(false);
      } catch {
        // Check localStorage for pending signup
        const pending = localStorage.getItem("signupPending");
        if (pending) setSignupPending(true);
      }
    };
    fetchCurrentUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setSignupPending(false);
    localStorage.removeItem("signupPending");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const markPending = () => {
    setSignupPending(true);
    localStorage.setItem("signupPending", "true");
  };

  return (
    <AuthContext.Provider
      value={{ user, signupPending, login, logout, markPending }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

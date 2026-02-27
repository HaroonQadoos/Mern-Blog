import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingUsersCount, setPendingUsersCount] = useState(0);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userRes = await api.get("/auth/me");
        const user = userRes.data;

        if (!user) {
          navigate("/login");
          return;
        }

        setCurrentUser(user);

        // 🔐 Only admin-related lightweight data
        if (user.role === "admin") {
          const usersRes = await api.get("/auth");
          const pending = usersRes.data.filter((u) => u.status === "pending");
          setPendingUsersCount(pending.length);
        }
      } catch (error) {
        setCurrentUser(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [navigate]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        loading,
        pendingUsersCount,
        setPendingUsersCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

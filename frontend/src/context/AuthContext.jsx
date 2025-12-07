import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";

// Backend base URL from .env (Vite)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null);        // Backend user profile (MongoDB)
  const [role, setRole] = useState(null);        // REAL role from backend
  const [loading, setLoading] = useState(true);

  // Frontend-only "view as role" for Admin demo
  const [viewAsRole, setViewAsRole] = useState(null);

  // This is what the UI will use everywhere
  const effectiveRole = viewAsRole || role;

  // -------- LOGIN ----------
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will fire and load backend profile
  };

  // -------- LOGOUT ----------
  const logout = async () => {
    await signOut(auth);
    setFirebaseUser(null);
    setUser(null);
    setRole(null);
    setViewAsRole(null);
  };

  // -------- FETCH BACKEND USER ----------
  const fetchBackendUser = async (fbUser) => {
    if (!fbUser) {
      setUser(null);
      setRole(null);
      return;
    }

    try {
      const token = await fbUser.getIdToken();

      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch /api/auth/me");
        setUser(null);
        setRole(null);
        return;
      }

      const data = await res.json();
      setUser(data);
      setRole(data.role); // REAL role from backend
    } catch (err) {
      console.error("Error fetching backend user:", err);
      setUser(null);
      setRole(null);
    }
  };

  // -------- FIREBASE AUTH STATE LISTENER ----------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        setLoading(true);
        await fetchBackendUser(fbUser);
        setLoading(false);
      } else {
        setUser(null);
        setRole(null);
        setViewAsRole(null);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const value = {
    firebaseUser,
    user,                  // backend profile
    role: effectiveRole,   // what UI should use
    realRole: role,        // original backend role (for security/info)
    loading,
    login,
    logout,
    viewAsRole,
    setViewAsRole,         // used only by admin in header
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

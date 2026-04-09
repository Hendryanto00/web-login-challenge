import { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;
    api
      .get("/dashboard")
      .then((res) => {
        if (!cancelled) {
          setUser(res.data.user);
          setStatus("ok");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("denied");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-[100dvh] min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div
          className="h-11 w-11 shrink-0 animate-spin rounded-full border-[3px] border-indigo-500/30 border-t-indigo-600 dark:border-indigo-400/25 dark:border-t-indigo-400"
          role="status"
          aria-label="Memuat"
        />
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
  );
}

export function useAuthUser() {
  const ctx = useContext(AuthContext);
  return ctx;
}

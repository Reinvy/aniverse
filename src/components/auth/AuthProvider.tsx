"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  premiumTier: string;
  username: string | null;
  bio: string | null;
  avatar: string | null;
  coinBalance: number;
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "aniverse_token";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ── Fetch current user from token ──────────────────────────
  const fetchUser = useCallback(async (token: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setStoredToken(null);
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Initialize on mount ────────────────────────────────────
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  // ── Login ───────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          const error =
            data.errors?._form ||
            data.errors?.email ||
            data.errors?.password ||
            "Login failed";
          return { ok: false, error };
        }

        setStoredToken(data.token);
        setUser(data.user);
        // Navigation happens in the login page after this returns
        return { ok: true };
      } catch {
        return { ok: false, error: "Network error. Please try again." };
      }
    },
    [],
  );

  // ── Register ────────────────────────────────────────────────
  const register = useCallback(
    async (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
          const error =
            result.errors?._form ||
            result.errors?.email ||
            result.errors?.firstName ||
            result.errors?.lastName ||
            result.errors?.password ||
            "Registration failed";
          return { ok: false, error };
        }

        setStoredToken(result.token);
        setUser(result.user);
        // Navigation happens in the register page after this returns
        return { ok: true };
      } catch {
        return { ok: false, error: "Network error. Please try again." };
      }
    },
    [],
  );

  // ── Logout ──────────────────────────────────────────────────
  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

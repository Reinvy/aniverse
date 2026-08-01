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
    // Set cookie for middleware (expires in 7 days)
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    // Clear cookie
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
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
        setIsLoading(false);
        return true;
      } else {
        setStoredToken(null);
        setUser(null);
        setIsLoading(false);
        return false;
      }
    } catch {
      setUser(null);
      setIsLoading(false);
      return false;
    }
  }, []);

  // ── Initialize on mount ────────────────────────────────────
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
        // Await user fetch BEFORE returning — ensures user is set before navigation
        const userOk = await fetchUser(data.token);
        if (!userOk) {
          return { ok: false, error: "Failed to verify session" };
        }
        return { ok: true };
      } catch {
        return { ok: false, error: "Network error. Please try again." };
      }
    },
    [fetchUser],
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
        // Await user fetch BEFORE returning
        const userOk = await fetchUser(result.token);
        if (!userOk) {
          return { ok: false, error: "Failed to verify session" };
        }
        return { ok: true };
      } catch {
        return { ok: false, error: "Network error. Please try again." };
      }
    },
    [fetchUser],
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

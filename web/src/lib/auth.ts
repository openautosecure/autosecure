import { useEffect, useState } from "react";

export const AUTH_EVENT = "autosec:auth";

const STORAGE_KEY = "autosecure-token";

export function getAuthToken(): string | null {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

export function setAuthToken(token: string) {
  try { localStorage.setItem(STORAGE_KEY, token); } catch {}
  window.dispatchEvent(new Event(AUTH_EVENT));
}

/** Fire-and-forget logout: clears HttpOnly cookie server-side. */
export function clearAuthToken() {
  localStorage.removeItem(STORAGE_KEY);
  fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
  window.dispatchEvent(new Event(AUTH_EVENT));
}

/**
 * Auth state — checks session by pinging /api/me (cookie sent automatically).
 * null = still loading, true = authenticated, false = not authenticated.
 */
export function useAuth(): { isAuthenticated: boolean | null } {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const check = () => {
    fetch("/api/me", { credentials: "include" })
      .then(r => setIsAuthenticated(r.ok))
      .catch(() => setIsAuthenticated(false));
  };

  useEffect(() => {
    check();
    window.addEventListener(AUTH_EVENT, check);
    return () => window.removeEventListener(AUTH_EVENT, check);
  }, []);

  return { isAuthenticated };
}

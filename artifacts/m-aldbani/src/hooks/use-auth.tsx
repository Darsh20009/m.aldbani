import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useGetMe } from "@workspace/api-client-react";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Track whether a token is stored so we skip the /me call when logged out
  const [hasToken, setHasToken] = useState(() => !!localStorage.getItem("token"));

  const { data: me, isLoading, error } = useGetMe<User>({
    query: {
      retry: false,
      // Only fetch /me when there is actually a stored token
      enabled: hasToken,
      // Keep result fresh for 10 min — no re-fetch on every navigation
      staleTime: 10 * 60 * 1000,
    } as any,
  });

  // Sync user from server response
  useEffect(() => {
    if (me) setUser(me as User);
  }, [me]);

  // If server rejects the stored token (401/403), clear it immediately so
  // the app stops hammering the API with invalid credentials on every render.
  useEffect(() => {
    if (!error) return;
    const status =
      (error as any)?.response?.status ??
      (error as any)?.status ??
      (error as any)?.statusCode;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      setHasToken(false);
      setUser(null);
    }
  }, [error]);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setHasToken(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setHasToken(false);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      // Only show "loading" while we still have a token AND are waiting on /me
      isLoading: hasToken && isLoading,
      login,
      logout,
    }),
    [user, hasToken, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

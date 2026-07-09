import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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
  
  // The generated useGetMe hook's query-options type requires a queryKey even though
  // the client supplies one internally — cast is safe, this is a known codegen quirk.
  const { data: me, isLoading } = useGetMe<User>({
    query: { retry: false } as any,
  });

  useEffect(() => {
    if (me) {
      setUser(me);
    }
  }, [me]);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

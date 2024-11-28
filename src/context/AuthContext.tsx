import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../services/api";

interface User {
  uid: string;
  email: string;
  name: string;
  role: string;
  hospital?: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (idToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const login = async (idToken: string) => {
    try {
      localStorage.setItem("token", idToken);
      setToken(idToken);

      const response = await api.post("/auth/login", { idToken });
      setUser(response.data.user);

      if (response.data.user.role === "medico") {
        router.push("/doctors/index");
      } else if (response.data.user.role === "paciente") {
        router.push("/patients/dashboard");
      } else {
        throw new Error("Papel desconhecido.");
      }
    } catch (error) {
      console.error("Erro ao autenticar:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
          setToken(savedToken);
          const response = await api.get("/user/logged", {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error("Erro ao recuperar o usuário:", error);
        logout();
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};

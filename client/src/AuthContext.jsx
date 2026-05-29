import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("truck_expense_token"),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    localStorage.setItem("truck_expense_token", token);
    api.setToken(token);

    api
      .get("/auth/me")
      .then((response) => setUser(response.data.data))
      .catch(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("truck_expense_token");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    setToken(response.data.data.token);
    setUser(response.data.data.user);
    return response.data.data;
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    setToken(response.data.data.token);
    setUser(response.data.data.user);
    return response.data.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("truck_expense_token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

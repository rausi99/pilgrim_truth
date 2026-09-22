import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCurrentUser } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("pilgrim_truth_token")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser(token);

        setUser(data.user);

        localStorage.setItem(
          "pilgrim_truth_user",
          JSON.stringify(data.user)
        );
      } catch (error) {
        console.error("Session error:", error);

        localStorage.removeItem("pilgrim_truth_token");
        localStorage.removeItem("pilgrim_truth_user");

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = (data) => {
    localStorage.setItem(
      "pilgrim_truth_token",
      data.token
    );

    localStorage.setItem(
      "pilgrim_truth_user",
      JSON.stringify(data.user)
    );

    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("pilgrim_truth_token");
    localStorage.removeItem("pilgrim_truth_user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
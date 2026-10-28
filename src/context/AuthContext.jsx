
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );

  const [loading, setLoading] = useState(false);

  // Keep Axios authorization synchronized with the token.
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  // Save authenticated user and token.
  const login = useCallback((userData, accessToken) => {
    if (!accessToken) {
      throw new Error("Authentication token is missing.");
    }

    if (!userData) {
      throw new Error("User information is missing.");
    }

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // Set immediately before other API calls.
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    setToken(accessToken);
    setUser(userData);
  }, []);

  // Login using the Express API.
  const loginUser = useCallback(
    async (credentials) => {
      setLoading(true);

      try {
        const response = await api.post("/auth/login", {
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        });

        const data = response.data;
        const accessToken = data.token || data.accessToken;

        if (!accessToken) {
          throw new Error("Authentication token is missing.");
        }

        // Supports your backend's root-level response.
        const userData = data.user || {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        };

        login(userData, accessToken);

        return data;
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  // Clear authentication.
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete api.defaults.headers.common.Authorization;

    setToken("");
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    loginUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}

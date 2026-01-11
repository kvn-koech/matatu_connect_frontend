import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, logoutUser } from "../api/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from local storage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("mc_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from local storage:", error);
      localStorage.removeItem("mc_user");
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      setUser(data.user);
      localStorage.setItem("mc_user", JSON.stringify(data.user));
      localStorage.setItem("access_token", data.access_token);
      return data.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signup = async (data) => {
    try {
      const response = await registerUser(data);
      // Check if response contains user data directly or if we need to login after
      // Based on auth.py: returns {message, user}
      // We might not get a token immediately on register unless we modify backend to return it.
      // For now, let's assume we might need to login or we just redirect.
      // But to keep consistency with "login" state:
      if (response.user) {
        // We don't have a token here based on the backend code seen (only returns message & user)
        // So the user stays logged out until they sign in OR we auto-login manually.
        // For better UX, usually we auto-login.
        // But since backend register doesn't return token, we can't set "access_token".
        // Ideally backend should return token on register.
        // For now, let's just return success and let the component navigate.
        return response.user;
      }
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    localStorage.removeItem("mc_user");
    navigate("/login");
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

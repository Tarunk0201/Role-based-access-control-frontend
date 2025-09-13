import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (token, role) => {
    setToken(token);
    setRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, role, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

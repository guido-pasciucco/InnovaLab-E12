import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  // Al iniciar, leemos el rol guardado en localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem("rol");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  // Cada vez que cambie el rol, lo guardamos en localStorage
  useEffect(() => {
    if (role) {
      localStorage.setItem("rol", role);
    }
  }, [role]);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

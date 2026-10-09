import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({'user':null, 'rol': null});

  // Al iniciar, leemos el rol guardado en localStorage

  const getRol = () => {
    return authData.rol
  }

  const limpiarUsuario = ()=> {
    const usuarioLimpio = {'user': null, 'rol':null}
    setAuthData(usuarioLimpio)
  }

  

  return (
    <AuthContext.Provider value={{ getRol, limpiarUsuario, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

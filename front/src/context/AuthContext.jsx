import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    message: null,
    access_token: null,
    token_type: null,
    usuario: {
      id: null,
      nombre: null,
      email: null,
      activo: null,
      rol: {
        id: null,
        nombre: null,
      },
      created_at: null,
    },
  });

  // Al iniciar, leemos el rol guardado

  const getRol = () => {
    console.log("obtuvimos el rol del usuario:", authData.usuario.rol.nombre);
    return authData.usuario.rol.nombre;
  };

  const getTypeAndToken = () => {
    return {
      token_type: authData.token_type,
      access_token: authData.access_token,
    };
  }

  const limpiarUsuario = () => {
    const usuarioLimpio = {
      message: null,
      access_token: null,
      token_type: null,
      usuario: {
        id: null,
        nombre: null,
        email: null,
        activo: null,
        rol: {
          id: null,
          nombre: null,
        },
        created_at: null,
      },
    };
    setAuthData(usuarioLimpio);
  };

  return (
    <AuthContext.Provider value={{ getRol, limpiarUsuario, setAuthData, getTypeAndToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// useApi.jsx
import { useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function useApi() {
  const { getTypeAndToken } = useContext(AuthContext);
  const { token_type, access_token } = getTypeAndToken();

  // useMemo para no recrear la instancia en cada render
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://localhost:8000/api/v1",
    });

    instance.interceptors.request.use((config) => {
      if (token_type && access_token) {
        config.headers.Authorization = `${token_type} ${access_token}`;
      }
      return config;
    });

    return instance;
  }, [token_type, access_token]);

  return api;
}

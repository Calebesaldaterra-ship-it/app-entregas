import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => { const u = localStorage.getItem('usuario'); if (u) setUsuario(JSON.parse(u)); setCarregando(false); }, []);
  async function login(email, senha) {
    const { data } = await API.post('/auth/login', { email, senha });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data;
  }
  function logout() { localStorage.removeItem('token'); localStorage.removeItem('usuario'); setUsuario(null); }
  return <AuthContext.Provider value={{ usuario, login, logout, carregando }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
export { API };
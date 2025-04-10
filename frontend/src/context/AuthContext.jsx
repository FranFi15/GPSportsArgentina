// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const navigate = useNavigate();

  const login = async (usuario, contraseña) => {
    try {
      const response = await fetch('/api/auth/admin/login', { // Reemplaza con la URL de tu API de inicio de sesión
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, contraseña }),
      });

      if (response.ok) {
        const data = await response.json();
        const authToken = data.token; // Asume que el backend devuelve el token en un campo llamado 'token'
        setToken(authToken);
        localStorage.setItem('token', authToken);
        setIsAuthenticated(true);
        navigate('/admin');
        return true;
      } else {
        setIsAuthenticated(false);
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setIsAuthenticated(false);
      console.error('Error al iniciar sesión:', error);
      throw error; // Propaga el error para que LoginPage pueda manejarlo
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
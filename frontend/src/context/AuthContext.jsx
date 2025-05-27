// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

// Exportación por defecto del componente Provider
export default function AuthProvider({ children }) { // Cambiado a exportación por defecto
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const navigate = useNavigate();
    const location = useLocation();
    const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:5000'; // Añade un fallback para desarrollo

    const login = async (usuario, contraseña) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, contraseña }),
            });

            if (response.ok) {
                const data = await response.json();
                const authToken = data.token;
                setToken(authToken);
                sessionStorage.setItem('token', authToken);
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
            throw error;
        }
    };

    const logout = useCallback(() => {
        setToken(null);
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    }, [navigate]);

    useEffect(() => {
        const checkTokenExpiration = () => {
            const storedToken = sessionStorage.getItem('token');
            if (storedToken) {
                try {
                    const decodedToken = jwtDecode(storedToken);
                    const currentTime = Date.now() / 1000;
                    if (decodedToken.exp < currentTime) {
                        logout();
                    } else {
                        setToken(storedToken);
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    logout();
                }
            } else {
                setIsAuthenticated(false);
            }
        };

        checkTokenExpiration();

        // Si necesitas re-chequear en cambios de ruta, puedes usar un listener o simplemente ejecutarlo
        // en cada render del componente si es ligero, o en el useEffect de nuevo si es crucial.
        // El `unlisten` para `useLocation` ya no es como en v5 de react-router-dom.
        // El `useEffect` con `location` en la dependencia ya maneja esto.
        // const unlisten = location.listen(checkTokenExpiration); // Esto no es v6, eliminar
        // return unlisten; // Esto no es v6, eliminar
    }, [navigate, logout, location]); // location como dependencia es correcto si usas `useLocation` para re-evaluar

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Exportación nombrada del hook
export const useAuth = () => {
    return useContext(AuthContext);
};
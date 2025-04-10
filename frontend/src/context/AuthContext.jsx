// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const navigate = useNavigate();
    const location = useLocation();

    const login = async (usuario, contraseña) => {
        try {
            const response = await fetch('/api/auth/admin/login', {
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

        const unlisten = () => {
            checkTokenExpiration();
        };

        unlisten();

        return () => {
            // No hay nada específico que limpiar aquí con 'useLocation' en v6.
        };
    }, [navigate, logout, location]);

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
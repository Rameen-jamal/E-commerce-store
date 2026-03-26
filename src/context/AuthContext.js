import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load user from localStorage on app start
    useEffect(() => {
        const savedUser = localStorage.getItem('user');

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        // Attach token interceptor ONCE
        const interceptor = api.interceptors.request.use((config) => {
            const storedUser = localStorage.getItem('user');

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);

                if (parsedUser?.token) {
                    config.headers.Authorization = `Bearer ${parsedUser.token}`;
                }
            }

            return config;
        });

        return () => {
            api.interceptors.request.eject(interceptor);
        };
    }, []);

    // REGISTER
    const register = async (name, email, password) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await api.post('/api/users/register', {
                name,
                email,
                password
            });

            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));

            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    // LOGIN
    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await api.post('/api/users/login', {
                email,
                password
            });

            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));

            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    // LOGOUT
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, error, register, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
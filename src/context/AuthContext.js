import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext();
axios.defaults.baseURL = 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
        setUser(JSON.parse(savedUser));
    }

    const interceptor = axios.interceptors.request.use((config) => {
        const savedUser = localStorage.getItem('user');

        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);

            if (parsedUser?.token) {
                config.headers.Authorization = `Bearer ${parsedUser.token}`;
            }
        }

        return config;
    });
    return () => {
        axios.interceptors.request.eject(interceptor);
    };

}, []);
    const register = async (name, email, password) => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.post('/api/users/register', { name, email, password });
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
    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.post('/api/users/login', { email, password });
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
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 
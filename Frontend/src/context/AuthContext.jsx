import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on page load
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/auth/me');
                setUser(res.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = (userData) => setUser(userData);

    const logout = async () => {
        await axios.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
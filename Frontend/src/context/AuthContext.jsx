import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const savedUser = localStorage.getItem('rentmate_user');
        const savedToken = localStorage.getItem('rentmate_token');

        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setLoading(false);
          return;
        }

        const res = await axios.get('/auth/me');
        setUser(res.data);
      } catch {
        setUser(null);
        localStorage.removeItem('rentmate_token');
        localStorage.removeItem('rentmate_user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    if (userData.token) {
      localStorage.setItem('rentmate_token', userData.token);
    }
    localStorage.setItem('rentmate_user', JSON.stringify({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone
    }));
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      localStorage.removeItem('rentmate_token');
      localStorage.removeItem('rentmate_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
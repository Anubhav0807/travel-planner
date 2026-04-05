import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load stored auth on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Set auth header whenever token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  async function loadStoredAuth() {
    try {
      const storedToken = await AsyncStorage.getItem('access_token');
      const storedRefreshToken = await AsyncStorage.getItem('refresh_token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        // Set the header immediately
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        // Try to refresh token
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${storedRefreshToken}`;
          const res = await api.post('/api/auth/refresh');
          const newToken = res.data.data.access_token;
          setToken(newToken);
          await AsyncStorage.setItem('access_token', newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        } catch (err) {
          // Refresh failed, use existing token — it may still work
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      }
    } catch (err) {
      console.log('Failed to load auth:', err);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await api.post('/api/auth/login', { email, password });
    const { user: userData, access_token, refresh_token } = res.data.data;

    setUser(userData);
    setToken(access_token);

    await AsyncStorage.multiSet([
      ['access_token', access_token],
      ['refresh_token', refresh_token],
      ['user', JSON.stringify(userData)],
    ]);

    return res.data;
  }

  async function register(name, email, password, phone) {
    const res = await api.post('/api/auth/register', { name, email, password, phone });
    const { user: userData, access_token, refresh_token } = res.data.data;

    setUser(userData);
    setToken(access_token);

    await AsyncStorage.multiSet([
      ['access_token', access_token],
      ['refresh_token', refresh_token],
      ['user', JSON.stringify(userData)],
    ]);

    return res.data;
  }

  async function logout() {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      // Ignore logout errors
    }
    setUser(null);
    setToken(null);
    await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
  }

  async function updateProfile(data) {
    const res = await api.put('/api/users/me', data);
    const updated = res.data.data;
    setUser(updated);
    await AsyncStorage.setItem('user', JSON.stringify(updated));
    return res.data;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

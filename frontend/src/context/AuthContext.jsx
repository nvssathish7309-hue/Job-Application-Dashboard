import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
          if (err.response && err.response.status === 401) {
            console.warn('Session expired or invalid token (401)');
            logout();
          } else {
            console.warn('Unable to verify user session due to network/server error:', err.message);
          }
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, [token]);

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const socialLogin = (userData) => {
    const fakeToken = 'mock_sso_token_' + Date.now();
    const userObj = {
      _id: 'sso-' + Date.now(),
      firstName: userData.firstName || 'Social',
      lastName: userData.lastName || 'User',
      email: (userData.email || '').toLowerCase().trim(),
      role: userData.role || 'CANDIDATE',
      department: userData.role === 'CANDIDATE' ? 'Applicant Portal' : 'Recruiting Team',
      avatar: userData.avatar || '',
      provider: userData.provider || 'google'
    };
    setToken(fakeToken);
    setUser(userObj);
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('user', JSON.stringify(userObj));
    return { success: true, data: { token: fakeToken, user: userObj } };
  };

  const updateCurrentUser = (updatedData) => {
    setUser(prev => {
      let fName = updatedData.firstName;
      let lName = updatedData.lastName;

      if ((!fName || lName === undefined) && updatedData.name) {
        const parts = updatedData.name.trim().split(/\s+/);
        fName = parts[0] || '';
        lName = parts.slice(1).join(' ') || '';
      }

      const newUser = {
        ...prev,
        ...updatedData,
        ...(fName !== undefined ? { firstName: fName } : {}),
        ...(lName !== undefined ? { lastName: lName } : {})
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });

    window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: updatedData }));
    window.dispatchEvent(new CustomEvent('teamMembersUpdated'));
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const hasRole = (allowedRoles) => {
    if (!user) return false;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, socialLogin, logout, updateCurrentUser, hasRole, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

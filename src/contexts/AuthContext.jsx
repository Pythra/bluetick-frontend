import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AuthContext = createContext();

const TOKEN_REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://bluetick.fly.dev';

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const refreshInFlight = useRef(null);

  const persistSession = useCallback((newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
  }, []);

  const applyTokenFromResponse = useCallback((response) => {
    const newToken = response.headers.get('X-Auth-Token');
    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const refreshAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      return false;
    }

    if (refreshInFlight.current) {
      return refreshInFlight.current;
    }

    const refreshPromise = (async () => {
      try {
        const response = await fetch(`${apiUrl}/api/auth/refresh`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.token) {
          persistSession(data.token, data.user);
          return true;
        }

        if (response.status === 401 || response.status === 403) {
          logout();
        }

        return false;
      } catch (error) {
        console.error('Session refresh error:', error);
        return false;
      } finally {
        refreshInFlight.current = null;
      }
    })();

    refreshInFlight.current = refreshPromise;
    return refreshPromise;
  }, [apiUrl, logout, persistSession]);

  const authFetch = useCallback(
    async (url, options = {}) => {
      const storedToken = localStorage.getItem('token');
      const isFormData = options.body instanceof FormData;
      const headers = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers || {}),
      };

      if (storedToken) {
        headers.Authorization = `Bearer ${storedToken}`;
      }

      let response = await fetch(url, { ...options, headers });
      applyTokenFromResponse(response);

      if ((response.status === 401 || response.status === 403) && storedToken) {
        const refreshed = await refreshAuth();
        if (refreshed) {
          const newToken = localStorage.getItem('token');
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          };
          response = await fetch(url, { ...options, headers: retryHeaders });
          applyTokenFromResponse(response);
        }
      }

      return response;
    },
    [applyTokenFromResponse, refreshAuth]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      refreshAuth().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshAuth]);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      refreshAuth();
    }, TOKEN_REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [token, refreshAuth]);

  const signup = async (email, password, passwordConfirmation, firstName, lastName, phone) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          passwordConfirmation,
          firstName,
          lastName,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      persistSession(data.token, data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      persistSession(data.token, data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login with Google');
      }

      persistSession(data.token, data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const getAuthHeaders = () => {
    const activeToken = localStorage.getItem('token') || token;
    if (!activeToken) return {};
    return {
      Authorization: `Bearer ${activeToken}`,
      'Content-Type': 'application/json',
    };
  };

  const value = {
    apiUrl,
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    signup,
    login,
    loginWithGoogle,
    logout,
    getAuthHeaders,
    authFetch,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

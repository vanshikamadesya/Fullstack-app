import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, AuthContextType } from '../types/auth';
import { loginAPI, getMeAPI, logoutAPI } from '../services/auth.api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      if (localStorage.getItem('isLoggedIn') === 'true') {
        try {
          const { user: fetchedUser } = await getMeAPI();
          setUser(fetchedUser);
        } catch {
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    await loginAPI(credentials);
    localStorage.setItem('isLoggedIn', 'true');
  
    // ✅ Wait 100ms to let browser set the session cookie
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    const { user: fetchedUser } = await getMeAPI();
    setUser(fetchedUser);
    navigate('/dashboard');
  };
  

  const logout = async () => {
    try {
      await logoutAPI();
    } catch {}
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    navigate('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

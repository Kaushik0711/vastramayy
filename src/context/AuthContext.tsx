import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CustomerProfile, AdminUser } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  customer: CustomerProfile | null;
  admin: AdminUser | null;
  isLoading: boolean;
  loginCustomer: (email: string) => Promise<CustomerProfile>;
  logoutCustomer: () => Promise<void>;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      try {
        const [storedCustomer, storedAdmin] = await Promise.all([
          authService.getCurrentCustomer(),
          authService.getCurrentAdmin(),
        ]);
        setCustomer(storedCustomer);
        setAdmin(storedAdmin);
      } catch (err) {
        console.error('Failed to load auth state:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSessions();
  }, []);

  const loginCustomer = async (email: string) => {
    const profile = await authService.loginCustomer(email);
    setCustomer(profile);
    return profile;
  };

  const logoutCustomer = async () => {
    await authService.logoutCustomer();
    setCustomer(null);
  };

  const loginAdmin = async (email: string, pass: string) => {
    const res = await authService.loginAdmin(email, pass);
    if (res.success && res.user) {
      setAdmin(res.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const logoutAdmin = async () => {
    await authService.logoutAdmin();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        admin,
        isLoading,
        loginCustomer,
        logoutCustomer,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

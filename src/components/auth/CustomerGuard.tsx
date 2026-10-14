/**
 * Customer Authentication Route Guard
 * 
 * ARCHITECTURAL NOTICE:
 * Client-side route guards in single-page applications are designed for UX guidance
 * (redirecting unauthenticated users to the login screen and preserving return URLs).
 * They DO NOT provide actual data security. Production security is strictly enforced
 * on backend endpoints via authenticated JWT / Session HttpOnly cookie validation.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface CustomerGuardProps {
  children: React.ReactNode;
}

export const CustomerGuard: React.FC<CustomerGuardProps> = ({ children }) => {
  const { customer, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
        <p className="text-xs text-brand-espresso/60 font-medium">Verifying atelier credentials...</p>
      </div>
    );
  }

  if (!customer) {
    // Redirect to login while preserving the attempted destination
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }

  return <>{children}</>;
};

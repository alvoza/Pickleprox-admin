'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signIn as cognitoSignIn,
  signOut as cognitoSignOut,
  getCurrentSession,
  isAdmin,
  getUserFromSession,
} from '@/lib/auth';
import type { AdminUser } from '@/types/models';

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const session = await getCurrentSession();
      if (session && isAdmin(session)) {
        setUser(getUserFromSession(session));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signIn = async (email: string, password: string) => {
    const session = await cognitoSignIn(email, password);
    if (!isAdmin(session)) {
      await cognitoSignOut();
      throw new Error('You do not have admin access. Contact an administrator.');
    }
    setUser(getUserFromSession(session));
  };

  const signOut = async () => {
    await cognitoSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

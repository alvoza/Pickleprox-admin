'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signIn as cognitoSignIn,
  signOut as cognitoSignOut,
  getCurrentSession,
  isAdmin,
  getUserFromSession,
} from '@/lib/auth';
import { api } from '@/lib/api';
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

  const loadManagedEntities = useCallback(async (adminUser: AdminUser): Promise<AdminUser> => {
    // Load managed courts/groups for non-super-admin users
    if (adminUser.isSuperAdmin) return adminUser;

    try {
      if (adminUser.isCourtManager) {
        const result = await api.admin.getMyCourts();
        if (result.data) {
          adminUser.managedCourtIds = result.data.courtIds;
        }
      }
      if (adminUser.isGroupAdmin) {
        const result = await api.admin.getMyGroups();
        if (result.data) {
          adminUser.managedGroupIds = result.data.groupIds;
        }
      }
    } catch (e) {
      console.error('Failed to load managed entities:', e);
    }

    return adminUser;
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const session = await getCurrentSession();
      if (session && isAdmin(session)) {
        const adminUser = getUserFromSession(session);
        const enriched = await loadManagedEntities(adminUser);
        setUser(enriched);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [loadManagedEntities]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signIn = async (email: string, password: string) => {
    const session = await cognitoSignIn(email, password);
    if (!isAdmin(session)) {
      await cognitoSignOut();
      throw new Error('You do not have admin access. Contact an administrator.');
    }
    const adminUser = getUserFromSession(session);
    const enriched = await loadManagedEntities(adminUser);
    setUser(enriched);
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

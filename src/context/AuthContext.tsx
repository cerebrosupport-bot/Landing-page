import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  auth,
  checkIsAuthorizedAdmin,
  loginAdminWithEmail,
  loginAdminWithGoogle,
  logoutAdmin,
  PRIMARY_ADMIN_EMAIL,
  sendAdminPasswordReset,
} from '../firebase';

interface AuthContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  isPrimaryAdmin: boolean;
  checkingAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        setAuthReady(true);
        return;
      }

      setCheckingAdmin(true);
      const authorized = await checkIsAuthorizedAdmin(
        nextUser.uid,
        nextUser.email,
        nextUser.emailVerified
      );
      setIsAdmin(authorized);
      setCheckingAdmin(false);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const isPrimaryAdmin = Boolean(
    user &&
      user.emailVerified &&
      user.email &&
      user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()
  );

  const signInWithGoogle = async () => {
    await loginAdminWithGoogle();
  };

  const signInWithEmail = async (email: string, password: string) => {
    await loginAdminWithEmail(email, password);
  };

  const resetPassword = async (email: string) => {
    await sendAdminPasswordReset(email);
  };

  const logout = async () => {
    await logoutAdmin();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        isAdmin,
        isPrimaryAdmin,
        checkingAdmin,
        signInWithGoogle,
        signInWithEmail,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

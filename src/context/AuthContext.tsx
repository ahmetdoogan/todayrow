"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { User, Session, SupabaseClient } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  supabase: SupabaseClient;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: (credential?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  supabase,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  signInWithGoogle: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setUser(currentSession?.user ?? null);
        setSession(currentSession);
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (currentSession?.user) {
        setUser(currentSession.user);
        setSession(currentSession);
        await supabase.auth.setSession(currentSession);
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      window.location.href = '/auth/verify';
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.setItem('lastLogoutTime', Date.now().toString());
      
      setUser(null);
      setSession(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Signout error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async (credential?: string) => {
    try {
      let authResponse;
      
      if (credential) {
        authResponse = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: credential,
        });
      } else {
        authResponse = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          }
        });
      }

      const { data, error } = authResponse;
      if (error) throw error;

      if (data.session) {
        setUser(data.session.user);
        setSession(data.session);
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <AuthContext.Provider 
      value={{
        user,
        session,
        supabase,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
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
  signInWithGoogle: () => Promise<void>;
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
        if (currentSession?.user) {
          setUser(currentSession.user);
          setSession(currentSession);
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.email);

        setUser(session?.user ?? null);
        setSession(session);

        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const { data: existingSub, error: subError } = await supabase
              .from('subscriptions')
              .select('id')
              .eq('user_id', session.user.id)
              .maybeSingle();

            if (subError) {
              console.error("Check subscription error:", subError);
            } else if (!existingSub) {
              const { error: insertErr } = await supabase
                .from('subscriptions')
                .insert({ user_id: session.user.id });
              if (insertErr) {
                console.error("Insert subscription error:", insertErr);
              } else {
                console.log("Inserted free_trial for user:", session.user.id);
              }
            }
          } catch (subCatchErr) {
            console.error("Subscription insert flow error:", subCatchErr);
          }
        }
      }
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data: { session: currentSession }, error } =
        await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (currentSession?.user) {
        setUser(currentSession.user);
        setSession(currentSession);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      window.location.href = "/auth/verify";
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Signout error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Yükleniyor...
      </div>
    );
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

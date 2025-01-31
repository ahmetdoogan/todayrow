"use client";
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const contextValue = useMemo(() => ({
    user,
    session,
    supabase,
    signIn: async (email: string, password: string) => {
      try {
        const { data: { session: currentSession }, error } =
          await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        if (currentSession?.user) {
          setUser(currentSession.user);
          setSession(currentSession);
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    signUp: async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        router.push('/auth/verify');
      } catch (error) {
        console.error("Signup error:", error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
        setSession(null);
        router.push('/');
      } catch (error) {
        console.error("Signout error:", error);
        throw error;
      }
    },
    signInWithGoogle: async () => {
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
    },
  }), [user, session, router]);

  useEffect(() => {
    let isSubscribed = true;

    const checkUser = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (isSubscribed && currentSession?.user) {
          setUser(currentSession.user);
          setSession(currentSession);
          setIsLoading(false);
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.email);

        if (!isSubscribed) return;

        setUser(session?.user ?? null);
        setSession(session);
        setIsLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          router.push('/dashboard');
        }
      }
    );

    return () => {
      isSubscribed = false;
      authListener.subscription?.unsubscribe();
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
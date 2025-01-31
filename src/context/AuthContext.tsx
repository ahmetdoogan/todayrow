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
  const [initialized, setInitialized] = useState(false);

  // State değişikliklerini tek bir yerde yönetelim
  const updateAuthState = (newUser: User | null, newSession: Session | null) => {
    setUser(newUser);
    setSession(newSession);
    setIsLoading(false);
  };

  const contextValue = useMemo(() => ({
    user,
    session,
    supabase,
    signIn: async (email: string, password: string) => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession }, error } =
          await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        if (currentSession?.user) {
          updateAuthState(currentSession.user, currentSession);
          router.push('/dashboard');
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Login error:", error);
        throw error;
      }
    },
    signUp: async (email: string, password: string) => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        router.push('/auth/verify');
      } catch (error) {
        setIsLoading(false);
        console.error("Signup error:", error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        updateAuthState(null, null);
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
    if (initialized) return;

    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          // Free trial kontrolü
          const { data: existingSub } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', currentSession.user.id)
            .single();

          if (!existingSub) {
            const currentDate = new Date();
            const trialEnd = new Date();
            trialEnd.setDate(currentDate.getDate() + 14);

            await supabase
              .from('subscriptions')
              .insert({
                user_id: currentSession.user.id,
                status: 'free_trial',
                trial_start: currentDate.toISOString(),
                trial_end: trialEnd.toISOString(),
                subscription_type: 'free',
                created_at: currentDate.toISOString(),
                updated_at: currentDate.toISOString()
              });
          }

          updateAuthState(currentSession.user, currentSession);
        } else {
          updateAuthState(null, null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        updateAuthState(null, null);
      } finally {
        setInitialized(true);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!initialized) return;

      console.log("Auth state change:", event);
      
      if (event === 'SIGNED_OUT') {
        updateAuthState(null, null);
      } else if (session?.user) {
        updateAuthState(session.user, session);
      }
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, [initialized, router]);

  if (isLoading && !initialized) {
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
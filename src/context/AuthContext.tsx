"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { User, Session, SupabaseClient } from '@supabase/supabase-js';
import { UserTracker } from '@/lib/analytics/user-tracking';
import { setUserId } from '@/lib/analytics/ga-manager';

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
  const [sessionStartTime] = useState<number>(Date.now());

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          setSession(currentSession);
          // GA'da user_id'yi ayarla
          setUserId(currentSession.user.id);
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setSession(session);

      // Auth state değişikliklerini izle
      if (event && session?.user) {
        UserTracker.trackAuthStateChange(event, session.user);
      }

      // Oturum kapandığında süreyi kaydet
      if (event === 'SIGNED_OUT' && user) {
        UserTracker.trackSessionDuration(user.id, sessionStartTime);
      }
    });

    return () => subscription.unsubscribe();
  }, [sessionStartTime, user]);

  const signIn = async (email: string, password: string) => {
    try {
      const {
        data: { session: currentSession },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (currentSession?.user) {
        setUser(currentSession.user);
        setSession(currentSession);
        await (supabase.auth as any).setSession(currentSession);
        
        // Giriş başarılı olduğunda engagement izle
        UserTracker.trackUserEngagement(currentSession.user.id, 'login_success', {
          method: 'email'
        });
        
        await new Promise((resolve) => setTimeout(resolve, 500));
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login error:", error);
      // Hatalı giriş denemelerini izle
      if (user) {
        UserTracker.trackUserEngagement(user.id, 'login_error', {
          error_type: (error as Error).message
        });
      }
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

      // Yeni kayıt başarılı olduğunda izle
      if (data.user) {
        UserTracker.trackUserEngagement(data.user.id, 'signup_success', {
          method: 'email'
        });
      }

      window.location.href = "/auth/verify";
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if ((window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.cancel();
      }

      // Çıkış yapmadan önce oturum süresini kaydet
      if (user) {
        UserTracker.trackSessionDuration(user.id, sessionStartTime);
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      localStorage.setItem("lastLogoutTime", Date.now().toString());

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

      // Google ile giriş başarılı olduğunda izle
      if (user) {
        UserTracker.trackUserEngagement(user.id, 'login_success', {
          method: 'google'
        });
      }
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
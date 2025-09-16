import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type ExtendedUser = User & {
  skillsphere_enabled?: boolean;
  full_name?: string;
  user_type?: string;
};

const ensureUserProfile = async (user: User) => {
  if (!supabase) return;

  try {
    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (!existingProfile) {
      // Profile doesn't exist, create it
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          user_type: 'student',
          full_name: user.user_metadata?.full_name || null,
          skillsphere_enabled: false, // default
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        throw insertError;
      }
      return { skillsphere_enabled: false, full_name: user.user_metadata?.full_name || null };
    }

    return existingProfile;
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    return { skillsphere_enabled: false };
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.error(error);
        setSession(session);

        if (session?.user) {
          const profile = await ensureUserProfile(session.user);
          setUser({ ...session.user, ...profile });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          const profile = await ensureUserProfile(session.user);
          setUser({ ...session.user, ...profile });
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    setUser(null);
    setSession(null);
  };

  return { user, session, loading, signOut, isAuthenticated: !!user };
};

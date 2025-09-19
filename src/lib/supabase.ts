import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Handle auth state changes and clear stale tokens
supabase.auth.onAuthStateChange((event, session) => {
  if ((event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') && !session) {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('sb-') && key.includes('-auth-token')) {
        localStorage.removeItem(key)
      }
    })
  }
})

// Auth helper functions
export const authHelpers = {

    resetPassword: async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      return { data, error };
    } catch (err: any) {
      console.error("resetPassword error:", err);
      return { error: err.message || "Unknown error" };
    }
  },
  // Sign up with email and password
  signUp: async (email: string, password: string, userData?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Send magic link
  sendMagicLink: async (email: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/magic-link-callback`
        }
      })
      return { data, error }
    } catch (err: any) {
      console.error("sendMagicLink error:", err)
      return { error: err.message || "Unknown error" }
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Resend confirmation email
  resendConfirmation: async (email: string) => {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email
    })
    return { data, error }
  },

  // Verify OTP
  verifyOTP: async (email: string, token: string, type: 'signup' | 'email') => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type
    })
    return { data, error }
  },

  // Get user profile
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Log user activity
  logActivity: async (userId: string, activityType: string, details: any = {}) => {
    const { data, error } = await supabase
      .from('user_activity_logs')
      .insert({
        user_id: userId,
        activity_type: activityType,
        activity_details: details
      })
    return { data, error }
  }
}

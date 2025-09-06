import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const authHelpers = {
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

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
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

  // Create OTP verification
  createOTPVerification: async (email: string, phone: string, otpCode: string, otpType: string = 'registration') => {
    const { data, error } = await supabase
      .from('otp_verifications')
      .insert({
        email,
        phone,
        otp_code: otpCode,
        otp_type: otpType
      })
      .select()
      .single()
    return { data, error }
  },

  // Verify OTP
  verifyOTP: async (email: string, otpCode: string) => {
    const { data, error } = await supabase
      .from('otp_verifications')
      .update({ 
        is_verified: true, 
        verified_at: new Date().toISOString(),
        attempts: supabase.raw('attempts + 1')
      })
      .eq('email', email)
      .eq('otp_code', otpCode)
      .eq('is_verified', false)
      .gt('expires_at', new Date().toISOString())
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
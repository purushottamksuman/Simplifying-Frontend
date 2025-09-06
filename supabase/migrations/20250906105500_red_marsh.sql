/*
  # Fix user creation trigger and magic link functionality

  1. Database Functions
    - Update handle_new_user trigger function to handle magic link users
    - Add proper error handling for user profile creation
    - Ensure compatibility with Supabase auth system

  2. Security Updates
    - Update RLS policies to allow magic link authentication
    - Add proper permissions for user creation flow

  3. Trigger Updates
    - Fix trigger function to handle all user creation scenarios
    - Add logging for debugging user creation issues
*/

-- Drop existing trigger and function to recreate them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the trigger execution for debugging
  RAISE LOG 'handle_new_user trigger fired for user: %', NEW.id;
  
  -- Insert into user_profiles with proper error handling
  INSERT INTO public.user_profiles (
    id,
    email,
    phone,
    user_type,
    full_name,
    country_code,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.phone, ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'country_code', '+91'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    phone = COALESCE(EXCLUDED.phone, user_profiles.phone),
    user_type = COALESCE(EXCLUDED.user_type, user_profiles.user_type),
    full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
    country_code = COALESCE(EXCLUDED.country_code, user_profiles.country_code),
    updated_at = NOW();

  RAISE LOG 'User profile created/updated for user: %', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    -- Don't fail the auth process, just log the error
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update RLS policies to allow magic link users
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (uid() = id);

-- Add policy for system to insert profiles during user creation
CREATE POLICY "System can insert user profiles"
  ON user_profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Ensure the trigger function has proper permissions
GRANT EXECUTE ON FUNCTION handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user() TO anon;
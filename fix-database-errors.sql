-- Fix Database Errors for User Registration
-- Run this in your Supabase SQL Editor

-- 1. Disable the problematic trigger that's causing 500 errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Drop the problematic function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Ensure RLS is enabled on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow trigger function to insert user profiles" ON public.users;

-- 5. Create proper RLS policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. Ensure user_role enum exists
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('LANDLORD', 'TENANT', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 7. Verify the users table structure
-- This should show the correct structure with phone as nullable
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position; 
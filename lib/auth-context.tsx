'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth, User } from './supabase-utils'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<User | null>
  signUp: (email: string, password: string, userData: any) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const checkUser = async () => {
      try {
        const profile = await auth.getCurrentUserProfile()
        if (profile) {
          setUser(profile)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        // Don't throw error for missing sessions - this is normal during signup
        if (error instanceof Error && error.message.includes('Auth session missing')) {
          console.log('No active session found - this is normal for new users')
        }
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await auth.signIn(email, password)
      const profile = await auth.getCurrentUserProfile()
      setUser(profile)
      return profile // Return profile for role-based routing
    } catch (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // This function is not directly used in the current context,
      // as the sign-in logic is now handled by auth.signIn.
      // Keeping it for now, but it might be removed if not used elsewhere.
      // await supabase.auth.signUp(email, password, userData)
      // Note: User will need to verify email before they can sign in
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      // This function is not directly used in the current context,
      // as the sign-out logic is now handled by auth.signOut.
      // Keeping it for now, but it might be removed if not used elsewhere.
      // await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      throw error
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    try {
      // This function is not directly used in the current context,
      // as the profile update logic is now handled by auth.updateProfile.
      // Keeping it for now, but it might be removed if not used elsewhere.
      // const updatedProfile = await supabase.auth.updateProfile(updates)
      // setUser(updatedProfile)
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
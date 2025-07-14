'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth } from './supabase-utils'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  role: 'LANDLORD' | 'TENANT' | 'ADMIN'
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
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
        const currentUser = await auth.getCurrentUser()
        if (currentUser) {
          const profile = await auth.getCurrentUserProfile()
          setUser(profile)
        }
      } catch (error) {
        console.error('Auth check error:', error)
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
    } catch (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      await auth.signUp(email, password, userData)
      // Note: User will need to verify email before they can sign in
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      await auth.signOut()
      setUser(null)
    } catch (error) {
      throw error
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const updatedProfile = await auth.updateProfile(updates)
      setUser(updatedProfile)
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
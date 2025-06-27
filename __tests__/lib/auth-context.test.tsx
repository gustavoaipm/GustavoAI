import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { auth } from '@/lib/supabase-utils'

// Mock the supabase utils
jest.mock('@/lib/supabase-utils', () => ({
  auth: {
    getCurrentUser: jest.fn(),
    getCurrentUserProfile: jest.fn(),
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    updateProfile: jest.fn(),
  },
}))

// Test component to access auth context
const TestComponent = () => {
  const { user, loading, signIn, signUp, signOut, updateProfile } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <button onClick={() => signIn('test@example.com', 'password')} data-testid="signin">
        Sign In
      </button>
      <button onClick={() => signUp('test@example.com', 'password', {})} data-testid="signup">
        Sign Up
      </button>
      <button onClick={() => signOut()} data-testid="signout">
        Sign Out
      </button>
      <button onClick={() => updateProfile({ first_name: 'Updated' })} data-testid="update">
        Update Profile
      </button>
    </div>
  )
}

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  role: 'LANDLORD' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AuthProvider', () => {
    it('should render children', () => {
      render(
        <AuthProvider>
          <div data-testid="child">Test Child</div>
        </AuthProvider>
      )
      
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('should check for existing session on mount', async () => {
      const mockGetCurrentUser = auth.getCurrentUser as jest.MockedFunction<typeof auth.getCurrentUser>
      const mockGetCurrentUserProfile = auth.getCurrentUserProfile as jest.MockedFunction<typeof auth.getCurrentUserProfile>
      
      mockGetCurrentUser.mockResolvedValue(mockUser as any)
      mockGetCurrentUserProfile.mockResolvedValue(mockUser)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(mockGetCurrentUser).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(mockGetCurrentUserProfile).toHaveBeenCalled()
      })
    })

    it('should handle auth check errors gracefully', async () => {
      const mockGetCurrentUser = auth.getCurrentUser as jest.MockedFunction<typeof auth.getCurrentUser>
      mockGetCurrentUser.mockRejectedValue(new Error('Auth error'))

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Auth check error:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe('useAuth hook', () => {
    it('should provide auth methods', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(screen.getByTestId('signin')).toBeInTheDocument()
      expect(screen.getByTestId('signup')).toBeInTheDocument()
      expect(screen.getByTestId('signout')).toBeInTheDocument()
      expect(screen.getByTestId('update')).toBeInTheDocument()
    })

    it('should handle sign in', async () => {
      const mockSignIn = auth.signIn as jest.MockedFunction<typeof auth.signIn>
      const mockGetCurrentUserProfile = auth.getCurrentUserProfile as jest.MockedFunction<typeof auth.getCurrentUserProfile>
      
      mockSignIn.mockResolvedValue(undefined)
      mockGetCurrentUserProfile.mockResolvedValue(mockUser)

      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await user.click(screen.getByTestId('signin'))

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password')
      })

      await waitFor(() => {
        expect(mockGetCurrentUserProfile).toHaveBeenCalled()
      })
    })

    it('should handle sign up', async () => {
      const mockSignUp = auth.signUp as jest.MockedFunction<typeof auth.signUp>
      mockSignUp.mockResolvedValue(undefined)

      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await user.click(screen.getByTestId('signup'))

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password', {})
      })
    })

    it('should handle sign out', async () => {
      const mockSignOut = auth.signOut as jest.MockedFunction<typeof auth.signOut>
      mockSignOut.mockResolvedValue(undefined)

      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await user.click(screen.getByTestId('signout'))

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled()
      })
    })

    it('should handle profile update', async () => {
      const mockUpdateProfile = auth.updateProfile as jest.MockedFunction<typeof auth.updateProfile>
      mockUpdateProfile.mockResolvedValue(mockUser)

      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await user.click(screen.getByTestId('update'))

      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalledWith({ first_name: 'Updated' })
      })
    })

    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<TestComponent />)
      }).toThrow('useAuth must be used within an AuthProvider')

      consoleSpy.mockRestore()
    })
  })

  describe('Error handling', () => {
    it('should handle sign in errors', async () => {
      const mockSignIn = auth.signIn as jest.MockedFunction<typeof auth.signIn>
      mockSignIn.mockRejectedValue(new Error('Invalid credentials'))

      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await user.click(screen.getByTestId('signin'))

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalled()
      })
    })

    it('should handle sign up errors', async () => {
      const mockSignUp = auth.signUp as jest.MockedFunction<typeof auth.signUp>
      mockSignUp.mockRejectedValue(new Error('Email already exists'))

      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await user.click(screen.getByTestId('signup'))

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalled()
      })
    })

    it('should handle sign out errors', async () => {
      const mockSignOut = auth.signOut as jest.MockedFunction<typeof auth.signOut>
      mockSignOut.mockRejectedValue(new Error('Sign out failed'))

      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await user.click(screen.getByTestId('signout'))

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled()
      })
    })
  })
}) 
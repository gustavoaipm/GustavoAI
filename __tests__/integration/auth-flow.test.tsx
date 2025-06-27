import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/__tests__/utils/test-utils'
import RegisterPage from '@/app/register/page'
import LoginPage from '@/app/login/page'
import DashboardPage from '@/app/dashboard/page'
import { useAuth } from '@/lib/auth-context'

// Mock the auth context
jest.mock('@/lib/auth-context', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams(),
}))

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+1234567890',
  role: 'LANDLORD' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('Authentication Flow Integration', () => {
  const mockSignUp = jest.fn()
  const mockSignIn = jest.fn()
  const mockSignOut = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: mockSignIn,
      signUp: mockSignUp,
      signOut: mockSignOut,
      updateProfile: jest.fn(),
    })
  })

  describe('Complete Registration Flow', () => {
    it('should allow user to register and then login', async () => {
      const user = userEvent.setup()
      
      // Step 1: Register
      mockSignUp.mockResolvedValue(undefined)
      
      render(<RegisterPage />)

      // Fill out registration form
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.type(screen.getByLabelText(/phone number/i), '+1234567890')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')

      // Submit registration
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith('john@example.com', 'password123', {
          first_name: 'John',
          last_name: 'Doe',
          phone: '+1234567890',
          role: 'LANDLORD',
        })
      })

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login?message=Registration successful! Please check your email to verify your account.')
      })

      // Step 2: Login
      mockSignIn.mockResolvedValue(undefined)
      
      render(<LoginPage />)

      // Fill out login form
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')

      // Submit login
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('john@example.com', 'password123')
      })

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('should handle registration errors and allow retry', async () => {
      const user = userEvent.setup()
      
      // First attempt fails
      mockSignUp.mockRejectedValueOnce(new Error('Email already exists'))
      
      render(<RegisterPage />)

      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email address/i), 'existing@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')

      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('Email already exists')).toBeInTheDocument()
      })

      // Second attempt succeeds
      mockSignUp.mockResolvedValueOnce(undefined)
      
      await user.clear(screen.getByLabelText(/email address/i))
      await user.type(screen.getByLabelText(/email address/i), 'new@example.com')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.queryByText('Email already exists')).not.toBeInTheDocument()
      })
    })
  })

  describe('Complete Login Flow', () => {
    it('should allow user to login and access dashboard', async () => {
      const user = userEvent.setup()
      
      // Step 1: Login
      mockSignIn.mockResolvedValue(undefined)
      
      render(<LoginPage />)

      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')

      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('john@example.com', 'password123')
      })

      // Step 2: Access Dashboard
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        signIn: mockSignIn,
        signUp: mockSignUp,
        signOut: mockSignOut,
        updateProfile: jest.fn(),
      })

      render(<DashboardPage />)

      expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument()
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('should handle login errors and allow retry', async () => {
      const user = userEvent.setup()
      
      // First attempt fails
      mockSignIn.mockRejectedValueOnce(new Error('Invalid credentials'))
      
      render(<LoginPage />)

      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'wrongpassword')

      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      })

      // Second attempt succeeds
      mockSignIn.mockResolvedValueOnce(undefined)
      
      await user.clear(screen.getByLabelText(/^password$/i))
      await user.type(screen.getByLabelText(/^password$/i), 'correctpassword')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument()
      })
    })
  })

  describe('Dashboard Access Control', () => {
    it('should redirect unauthenticated users to login', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        signIn: mockSignIn,
        signUp: mockSignUp,
        signOut: mockSignOut,
        updateProfile: jest.fn(),
      })

      render(<DashboardPage />)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })

    it('should allow authenticated users to access dashboard', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        signIn: mockSignIn,
        signUp: mockSignUp,
        signOut: mockSignOut,
        updateProfile: jest.fn(),
      })

      render(<DashboardPage />)

      expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should allow users to sign out from dashboard', async () => {
      const user = userEvent.setup()
      mockSignOut.mockResolvedValue(undefined)
      
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        signIn: mockSignIn,
        signUp: mockSignUp,
        signOut: mockSignOut,
        updateProfile: jest.fn(),
      })

      render(<DashboardPage />)

      const signOutButton = screen.getByRole('button', { name: /sign out/i })
      await user.click(signOutButton)

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/')
      })
    })
  })

  describe('Form Validation Across Pages', () => {
    it('should validate email format consistently', async () => {
      const user = userEvent.setup()
      
      // Test registration form
      render(<RegisterPage />)
      
      await user.type(screen.getByLabelText(/email address/i), 'invalid-email')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })

      // Test login form
      render(<LoginPage />)
      
      await user.type(screen.getByLabelText(/email address/i), 'invalid-email')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
    })

    it('should validate required fields consistently', async () => {
      const user = userEvent.setup()
      
      // Test registration form
      render(<RegisterPage />)
      
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText(/first name must be at least 2 characters/i)).toBeInTheDocument()
        expect(screen.getByText(/last name must be at least 2 characters/i)).toBeInTheDocument()
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
      })

      // Test login form
      render(<LoginPage />)
      
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading states during form submission', async () => {
      const user = userEvent.setup()
      
      // Test registration loading
      mockSignUp.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<RegisterPage />)

      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')

      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText(/creating account\.\.\./i)).toBeInTheDocument()
      })

      // Test login loading
      mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<LoginPage />)

      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')

      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument()
      })
    })

    it('should show loading state in dashboard', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        signIn: mockSignIn,
        signUp: mockSignUp,
        signOut: mockSignOut,
        updateProfile: jest.fn(),
      })

      render(<DashboardPage />)

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })
}) 
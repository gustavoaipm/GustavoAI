import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/__tests__/utils/test-utils'
import LoginPage from '@/app/login/page'
import { useAuth } from '@/lib/auth-context'

// Mock the auth context
jest.mock('@/lib/auth-context', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock Next.js router and search params
const mockPush = jest.fn()
const mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}))

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe('LoginPage', () => {
  const mockSignIn = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockSearchParams.clear()
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: mockSignIn,
      signUp: jest.fn(),
      signOut: jest.fn(),
      updateProfile: jest.fn(),
    })
  })

  describe('Rendering', () => {
    it('should render the login form', () => {
      render(<LoginPage />)

      expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument()
      expect(screen.getByText(/forgot your password/i)).toBeInTheDocument()
    })

    it('should render GustavoAI logo link', () => {
      render(<LoginPage />)

      const logo = screen.getByText('GustavoAI')
      expect(logo).toBeInTheDocument()
      expect(logo.closest('a')).toHaveAttribute('href', '/')
    })

    it('should render link to register page', () => {
      render(<LoginPage />)

      const registerLink = screen.getByText(/create a new account/i)
      expect(registerLink).toBeInTheDocument()
      expect(registerLink.closest('a')).toHaveAttribute('href', '/register')
    })
  })

  describe('Success Message Display', () => {
    it('should display success message from URL params', () => {
      mockSearchParams.set('message', 'Registration successful!')
      
      render(<LoginPage />)

      expect(screen.getByText('Registration successful!')).toBeInTheDocument()
    })

    it('should not display message when no URL params', () => {
      render(<LoginPage />)

      expect(screen.queryByText(/registration successful/i)).not.toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('should show validation error for invalid email', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const emailInput = screen.getByLabelText(/email address/i)
      await user.type(emailInput, 'invalid-email')

      // Trigger validation by clicking submit
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
    })

    it('should show validation error for empty password', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const emailInput = screen.getByLabelText(/email address/i)
      await user.type(emailInput, 'test@example.com')

      // Submit without password
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup()
      mockSignIn.mockResolvedValue(undefined)
      
      render(<LoginPage />)

      // Fill out the form
      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
      })

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('should handle login errors', async () => {
      const user = userEvent.setup()
      const errorMessage = 'Invalid credentials'
      mockSignIn.mockRejectedValue(new Error(errorMessage))
      
      render(<LoginPage />)

      // Fill out the form
      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'wrongpassword')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })

    it('should show loading state during submission', async () => {
      const user = userEvent.setup()
      mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<LoginPage />)

      // Fill out the form
      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument()
      })
    })
  })

  describe('Password Visibility', () => {
    it('should toggle password visibility', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const passwordInput = screen.getByLabelText(/^password$/i)

      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password')

      // Toggle password visibility
      const passwordToggle = screen.getAllByRole('button')[0] // Eye icon
      await user.click(passwordToggle)

      expect(passwordInput).toHaveAttribute('type', 'text')

      // Toggle back to hidden
      await user.click(passwordToggle)

      expect(passwordInput).toHaveAttribute('type', 'password')
    })
  })

  describe('Remember Me Checkbox', () => {
    it('should have remember me checkbox unchecked by default', () => {
      render(<LoginPage />)

      const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i })
      expect(rememberMeCheckbox).not.toBeChecked()
    })

    it('should allow toggling remember me checkbox', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i })
      
      await user.click(rememberMeCheckbox)
      expect(rememberMeCheckbox).toBeChecked()

      await user.click(rememberMeCheckbox)
      expect(rememberMeCheckbox).not.toBeChecked()
    })
  })

  describe('Forgot Password Link', () => {
    it('should render forgot password link', () => {
      render(<LoginPage />)

      const forgotPasswordLink = screen.getByText(/forgot your password/i)
      expect(forgotPasswordLink).toBeInTheDocument()
      expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/forgot-password')
    })
  })

  describe('Google OAuth Button', () => {
    it('should render Google sign in button', () => {
      render(<LoginPage />)

      const googleButton = screen.getByRole('button', { name: /sign in with google/i })
      expect(googleButton).toBeInTheDocument()
    })

    it('should have Google icon in the button', () => {
      render(<LoginPage />)

      const googleButton = screen.getByRole('button', { name: /sign in with google/i })
      const svg = googleButton.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Form Accessibility', () => {
    it('should have proper form labels', () => {
      render(<LoginPage />)

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    })

    it('should have proper button types', () => {
      render(<LoginPage />)

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('should disable submit button during loading', async () => {
      const user = userEvent.setup()
      mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<LoginPage />)

      // Fill out the form
      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })
    })
  })

  describe('Error Handling', () => {
    it('should clear previous errors on new submission', async () => {
      const user = userEvent.setup()
      
      // First submission with error
      mockSignIn.mockRejectedValueOnce(new Error('Invalid credentials'))
      
      render(<LoginPage />)

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'wrongpassword')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      })

      // Second submission with success
      mockSignIn.mockResolvedValueOnce(undefined)
      
      await user.clear(screen.getByLabelText(/^password$/i))
      await user.type(screen.getByLabelText(/^password$/i), 'correctpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument()
      })
    })
  })
}) 
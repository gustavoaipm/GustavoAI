import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/__tests__/utils/test-utils'
import RegisterPage from '@/app/register/page'
import { useAuth } from '@/lib/auth-context'

// Mock the auth context
jest.mock('@/lib/auth-context', () => ({
  useAuth: jest.fn(),
}))

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe('RegisterPage', () => {
  const mockSignUp = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: jest.fn(),
      signUp: mockSignUp,
      signOut: jest.fn(),
      updateProfile: jest.fn(),
    })
  })

  describe('Rendering', () => {
    it('should render the registration form', () => {
      render(<RegisterPage />)

      expect(screen.getByText('Create your account')).toBeInTheDocument()
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/i am a/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    it('should render GustavoAI logo link', () => {
      render(<RegisterPage />)

      const logo = screen.getByText('GustavoAI')
      expect(logo).toBeInTheDocument()
      expect(logo.closest('a')).toHaveAttribute('href', '/')
    })

    it('should render link to login page', () => {
      render(<RegisterPage />)

      const loginLink = screen.getByText(/sign in to your existing account/i)
      expect(loginLink).toBeInTheDocument()
      expect(loginLink.closest('a')).toHaveAttribute('href', '/login')
    })
  })

  describe('Form Validation', () => {
    it('should show validation error for invalid email', async () => {
      const user = userEvent.setup()
      render(<RegisterPage />)

      const emailInput = screen.getByLabelText(/email address/i)
      await user.type(emailInput, 'invalid-email')

      // Trigger validation by clicking submit
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
    })

    it('should show validation error for short password', async () => {
      const user = userEvent.setup()
      render(<RegisterPage />)

      const passwordInput = screen.getByLabelText(/^password$/i)
      await user.type(passwordInput, '123')

      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
      })
    })

    it('should show validation error for short first name', async () => {
      const user = userEvent.setup()
      render(<RegisterPage />)

      const firstNameInput = screen.getByLabelText(/first name/i)
      await user.type(firstNameInput, 'A')

      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/first name must be at least 2 characters/i)).toBeInTheDocument()
      })
    })

    it('should show validation error for short last name', async () => {
      const user = userEvent.setup()
      render(<RegisterPage />)

      const lastNameInput = screen.getByLabelText(/last name/i)
      await user.type(lastNameInput, 'B')

      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/last name must be at least 2 characters/i)).toBeInTheDocument()
      })
    })

    it('should show validation error for mismatched passwords', async () => {
      const user = userEvent.setup()
      render(<RegisterPage />)

      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'differentpassword')

      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup()
      mockSignUp.mockResolvedValue(undefined)
      
      render(<RegisterPage />)

      // Fill out the form
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.type(screen.getByLabelText(/phone number/i), '+1234567890')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

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
    })

    it('should handle registration errors', async () => {
      const user = userEvent.setup()
      const errorMessage = 'Email already exists'
      mockSignUp.mockRejectedValue(new Error(errorMessage))
      
      render(<RegisterPage />)

      // Fill out the form
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })

    it('should show loading state during submission', async () => {
      const user = userEvent.setup()
      mockSignUp.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<RegisterPage />)

      // Fill out the form
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/creating account\.\.\./i)).toBeInTheDocument()
      })
    })
  })

  describe('Password Visibility', () => {
    it('should toggle password visibility', async () => {
      const user = userEvent.setup()
      render(<RegisterPage />)

      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

      // Initially passwords should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(confirmPasswordInput).toHaveAttribute('type', 'password')

      // Toggle password visibility
      const passwordToggle = screen.getAllByRole('button')[0] // First eye icon
      await user.click(passwordToggle)

      expect(passwordInput).toHaveAttribute('type', 'text')

      // Toggle confirm password visibility
      const confirmPasswordToggle = screen.getAllByRole('button')[1] // Second eye icon
      await user.click(confirmPasswordToggle)

      expect(confirmPasswordInput).toHaveAttribute('type', 'text')
    })
  })

  describe('Role Selection', () => {
    it('should default to LANDLORD role', () => {
      render(<RegisterPage />)

      const roleSelect = screen.getByLabelText(/i am a/i) as HTMLSelectElement
      expect(roleSelect.value).toBe('LANDLORD')
    })

    it('should allow selecting TENANT role', async () => {
      const user = userEvent.setup()
      render(<RegisterPage />)

      const roleSelect = screen.getByLabelText(/i am a/i)
      await user.selectOptions(roleSelect, 'TENANT')

      expect(roleSelect).toHaveValue('TENANT')
    })
  })

  describe('Optional Fields', () => {
    it('should submit form without phone number', async () => {
      const user = userEvent.setup()
      mockSignUp.mockResolvedValue(undefined)
      
      render(<RegisterPage />)

      // Fill out required fields only
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith('john@example.com', 'password123', {
          first_name: 'John',
          last_name: 'Doe',
          phone: '',
          role: 'LANDLORD',
        })
      })
    })
  })
}) 
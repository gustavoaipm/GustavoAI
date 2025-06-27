import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '@/lib/auth-context'

// Mock user data for testing
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+1234567890',
  role: 'LANDLORD' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

// Mock auth context values
export const mockAuthContext = {
  user: null,
  loading: false,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
}

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authContext?: Partial<typeof mockAuthContext>
}

const AllTheProviders = ({ children, authContext = mockAuthContext }: { 
  children: React.ReactNode
  authContext?: Partial<typeof mockAuthContext>
}) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { authContext, ...renderOptions } = options
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders authContext={authContext}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Form testing helpers
export const fillForm = async (user: any, formData: Record<string, string>) => {
  for (const [name, value] of Object.entries(formData)) {
    const input = document.querySelector(`[name="${name}"]`) as HTMLInputElement
    if (input) {
      await user.type(input, value)
    }
  }
}

export const submitForm = async (user: any, submitButtonText?: string) => {
  const button = submitButtonText 
    ? document.querySelector(`button[type="submit"]`) as HTMLButtonElement
    : document.querySelector('form') as HTMLFormElement
  
  if (button) {
    await user.click(button)
  }
}

// Validation testing helpers
export const expectValidationError = (errorMessage: string) => {
  expect(document.querySelector(`[data-testid="error-${errorMessage}"]`)).toBeInTheDocument()
}

export const expectNoValidationErrors = () => {
  expect(document.querySelectorAll('[data-testid^="error-"]')).toHaveLength(0)
} 
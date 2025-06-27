import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/__tests__/utils/test-utils'
import DashboardPage from '@/app/dashboard/page'
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

describe('DashboardPage', () => {
  const mockSignOut = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: mockSignOut,
      updateProfile: jest.fn(),
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner when loading', () => {
      render(<DashboardPage />)

      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument() // Spinner
    })
  })

  describe('Authentication Redirect', () => {
    it('should redirect to login when user is not authenticated', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: mockSignOut,
        updateProfile: jest.fn(),
      })

      render(<DashboardPage />)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })

    it('should not redirect when user is authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: mockSignOut,
        updateProfile: jest.fn(),
      })

      render(<DashboardPage />)

      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Authenticated Dashboard', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: mockSignOut,
        updateProfile: jest.fn(),
      })
    })

    it('should render dashboard with user information', () => {
      render(<DashboardPage />)

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument()
      expect(screen.getByText('GustavoAI')).toBeInTheDocument()
    })

    it('should render all dashboard navigation items', () => {
      render(<DashboardPage />)

      const expectedItems = [
        'Properties',
        'Tenants', 
        'Payments',
        'Maintenance',
        'Calendar',
        'Notifications',
        'Analytics'
      ]

      expectedItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument()
      })
    })

    it('should render quick overview stats', () => {
      render(<DashboardPage />)

      expect(screen.getByText('Quick Overview')).toBeInTheDocument()
      expect(screen.getByText('Properties')).toBeInTheDocument()
      expect(screen.getByText('Active Tenants')).toBeInTheDocument()
      expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
      expect(screen.getByText('Pending Tasks')).toBeInTheDocument()
    })

    it('should show correct stat values', () => {
      render(<DashboardPage />)

      expect(screen.getByText('0')).toBeInTheDocument() // Properties count
      expect(screen.getByText('$0')).toBeInTheDocument() // Monthly rent
    })
  })

  describe('Navigation Links', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: mockSignOut,
        updateProfile: jest.fn(),
      })
    })

    it('should have correct href attributes for navigation items', () => {
      render(<DashboardPage />)

      const propertiesLink = screen.getByText('Properties').closest('a')
      const tenantsLink = screen.getByText('Tenants').closest('a')
      const paymentsLink = screen.getByText('Payments').closest('a')
      const maintenanceLink = screen.getByText('Maintenance').closest('a')

      expect(propertiesLink).toHaveAttribute('href', '/dashboard/properties')
      expect(tenantsLink).toHaveAttribute('href', '/dashboard/tenants')
      expect(paymentsLink).toHaveAttribute('href', '/dashboard/payments')
      expect(maintenanceLink).toHaveAttribute('href', '/dashboard/maintenance')
    })

    it('should have hover effects on navigation items', () => {
      render(<DashboardPage />)

      const navigationItems = screen.getAllByRole('link')
      
      navigationItems.forEach(item => {
        expect(item).toHaveClass('hover:shadow-md')
      })
    })
  })

  describe('Sign Out Functionality', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: mockSignOut,
        updateProfile: jest.fn(),
      })
    })

    it('should render sign out button', () => {
      render(<DashboardPage />)

      const signOutButton = screen.getByRole('button', { name: /sign out/i })
      expect(signOutButton).toBeInTheDocument()
    })

    it('should call signOut when sign out button is clicked', async () => {
      const user = userEvent.setup()
      mockSignOut.mockResolvedValue(undefined)

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

    it('should handle sign out errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockSignOut.mockRejectedValue(new Error('Sign out failed'))

      render(<DashboardPage />)

      const signOutButton = screen.getByRole('button', { name: /sign out/i })
      await user.click(signOutButton)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Sign out error:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Dashboard Items', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: mockSignOut,
        updateProfile: jest.fn(),
      })
    })

    it('should render dashboard items with correct descriptions', () => {
      render(<DashboardPage />)

      expect(screen.getByText('Manage your properties')).toBeInTheDocument()
      expect(screen.getByText('View and manage tenants')).toBeInTheDocument()
      expect(screen.getByText('Track rent and payments')).toBeInTheDocument()
      expect(screen.getByText('Schedule and track maintenance')).toBeInTheDocument()
      expect(screen.getByText('View scheduled events')).toBeInTheDocument()
      expect(screen.getByText('View system notifications')).toBeInTheDocument()
      expect(screen.getByText('View property analytics')).toBeInTheDocument()
    })

    it('should render dashboard items with correct icons', () => {
      render(<DashboardPage />)

      // Check that icons are present (they should be in the DOM as SVGs)
      const navigationItems = screen.getAllByRole('link')
      navigationItems.forEach(item => {
        const icon = item.querySelector('svg')
        expect(icon).toBeInTheDocument()
      })
    })

    it('should have correct color classes for different items', () => {
      render(<DashboardPage />)

      const navigationItems = screen.getAllByRole('link')
      
      // Check that items have different background colors
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500']
      
      colors.forEach(color => {
        const itemWithColor = document.querySelector(`.${color}`)
        expect(itemWithColor).toBeInTheDocument()
      })
    })
  })

  describe('Responsive Design', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: mockSignOut,
        updateProfile: jest.fn(),
      })
    })

    it('should have responsive grid layout', () => {
      render(<DashboardPage />)

      const dashboardGrid = document.querySelector('.grid')
      expect(dashboardGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
    })

    it('should have responsive stats layout', () => {
      render(<DashboardPage />)

      const statsGrid = document.querySelector('.grid-cols-1.md\\:grid-cols-4')
      expect(statsGrid).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: mockSignOut,
        updateProfile: jest.fn(),
      })
    })

    it('should have proper heading structure', () => {
      render(<DashboardPage />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard')
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Quick Overview')
    })

    it('should have proper button labels', () => {
      render(<DashboardPage />)

      const signOutButton = screen.getByRole('button', { name: /sign out/i })
      expect(signOutButton).toBeInTheDocument()
    })

    it('should have proper link text', () => {
      render(<DashboardPage />)

      const navigationLinks = screen.getAllByRole('link')
      navigationLinks.forEach(link => {
        expect(link).toHaveTextContent()
      })
    })
  })

  describe('Error Boundaries', () => {
    it('should handle auth context errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      mockUseAuth.mockImplementation(() => {
        throw new Error('Auth context error')
      })

      expect(() => {
        render(<DashboardPage />)
      }).toThrow('Auth context error')

      consoleSpy.mockRestore()
    })
  })
}) 
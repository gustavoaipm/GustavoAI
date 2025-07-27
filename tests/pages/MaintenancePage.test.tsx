import React from 'react'
import { render, screen } from '@testing-library/react'
import MaintenancePage from '@/app/dashboard/maintenance/page'
import { AuthProvider } from '@/lib/auth-context'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/dashboard/maintenance',
}))

// Mock Supabase utilities
jest.mock('@/lib/supabase-utils', () => ({
  maintenance: {
    getAll: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockResolvedValue({ success: true }),
  },
}))

// Mock auth context
jest.mock('@/lib/auth-context', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'owner@example.com' },
    loading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock window.alert
global.alert = jest.fn()

describe('MaintenancePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the maintenance page title', async () => {
    render(
      <AuthProvider>
        <MaintenancePage />
      </AuthProvider>
    )

    expect(screen.getByText('Maintenance Requests')).toBeInTheDocument()
    expect(screen.getByText('View and manage all maintenance requests for your properties')).toBeInTheDocument()
  })

  it('renders the new request button', async () => {
    render(
      <AuthProvider>
        <MaintenancePage />
      </AuthProvider>
    )

    expect(screen.getByText('New Request')).toBeInTheDocument()
  })

  it('renders the status filter', async () => {
    render(
      <AuthProvider>
        <MaintenancePage />
      </AuthProvider>
    )

    expect(screen.getByText('Status:')).toBeInTheDocument()
    expect(screen.getByDisplayValue('all')).toBeInTheDocument()
  })

  it('shows loading state initially', async () => {
    render(
      <AuthProvider>
        <MaintenancePage />
      </AuthProvider>
    )

    // The component should show loading initially
    expect(screen.getByText('Loading maintenance requests...')).toBeInTheDocument()
  })

  it('renders the maintenance table structure', async () => {
    render(
      <AuthProvider>
        <MaintenancePage />
      </AuthProvider>
    )

    // Check that the table headers are present
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Property / Unit')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Vendor')).toBeInTheDocument()
    expect(screen.getByText('Scheduled Time')).toBeInTheDocument()
  })

  it('renders the navigation correctly', async () => {
    render(
      <AuthProvider>
        <MaintenancePage />
      </AuthProvider>
    )

    // Check that the navigation links are present
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Properties')).toBeInTheDocument()
    expect(screen.getByText('Tenants')).toBeInTheDocument()
    expect(screen.getByText('Payments')).toBeInTheDocument()
  })

  it('renders the page layout correctly', async () => {
    render(
      <AuthProvider>
        <MaintenancePage />
      </AuthProvider>
    )

    // Check that the main page structure is present
    expect(screen.getByText('Maintenance Requests')).toBeInTheDocument()
    expect(screen.getByText('New Request')).toBeInTheDocument()
    expect(screen.getByText('Status:')).toBeInTheDocument()
  })
}) 
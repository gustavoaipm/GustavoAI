import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TenantVerifyPage from '@/app/auth/tenant-verify/page';
import { AuthProvider } from '@/lib/auth-context';
import { NotificationProvider } from '@/lib/notification-context';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue('test-token-123'),
  }),
}));

// Mock supabase-utils
jest.mock('@/lib/supabase-utils', () => ({
  tenantInvitations: {
    getByToken: jest.fn().mockResolvedValue({
      id: 'invitation-1',
      email: 'tenant@example.com',
      first_name: 'John',
      last_name: 'Doe',
      phone: '555-123-4567',
      lease_start: '2024-01-01',
      lease_end: '2024-12-31',
      rent_amount: 1200,
      security_deposit: 2400,
      unit: {
        unit_number: '1A',
        property: {
          name: 'Test Property',
          address: '123 Main St'
        }
      },
      landlord: {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'landlord@example.com'
      }
    }),
  },
  auth: {
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    updateProfile: jest.fn(),
    getCurrentUserProfile: jest.fn().mockResolvedValue(null),
  },
}));

// Mock supabase client
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn().mockResolvedValue({
        data: { user: { id: 'user-123', email: 'tenant@example.com' } },
        error: null
      }),
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
    }),
  },
}));

// Mock global fetch
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ success: true }),
});

describe('TenantVerifyPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the tenant verification page and allows account creation', async () => {
    render(
      <AuthProvider>
        <NotificationProvider>
          <TenantVerifyPage />
        </NotificationProvider>
      </AuthProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Welcome to Test Property')).toBeInTheDocument();
    });

    // Fill in password fields
    const passwordInput = screen.getByLabelText(/Create Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    // Submit the form
    const submitButton = screen.getByText('Create Account & Access Portal');
    fireEvent.click(submitButton);

    // Wait for the success message
    await waitFor(() => {
      expect(screen.getByText('Welcome to Your New Home!')).toBeInTheDocument();
    });
  });
}); 
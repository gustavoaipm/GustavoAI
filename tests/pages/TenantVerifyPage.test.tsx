import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TenantVerifyPage from '@/app/auth/tenant-verify/page';
import { AuthProvider } from '@/lib/auth-context';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: (key: string) => (key === 'token' ? 'mock-token' : null),
  }),
}));

// Mock supabase-utils
jest.mock('@/lib/supabase-utils', () => ({
  tenantInvitations: {},
  auth: {
    signUp: jest.fn().mockResolvedValue({
      user: { id: 'tenant-1', email: 'tenant@example.com' },
    }),
    getCurrentUserProfile: jest.fn().mockResolvedValue(null), // Added to silence auth-context error
  },
}));

// Mock fetch for API routes
// @ts-ignore
global.fetch = jest.fn((url, options) => {
  if (url.includes('/api/tenant-invitation')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({
        invitation: {
          id: 'inv-1',
          email: 'tenant@example.com',
          first_name: 'Jane',
          last_name: 'Doe',
          phone: '555-1234',
          lease_start: '2024-08-01',
          lease_end: '2025-08-01',
          rent_amount: 1200,
          security_deposit: 1200,
          unit: {
            unit_number: '1A',
            property: { name: 'Test Property', address: '123 Main St' },
          },
          landlord: {
            first_name: 'Land',
            last_name: 'Lord',
            email: 'landlord@example.com',
          },
        },
      }),
    });
  }
  if (url.includes('/api/tenant-verify')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({
        success: true,
        tenant: { id: 'tenant-1', email: 'tenant@example.com', property_id: 'property-1' },
      }),
    });
  }
  if (url.includes('/api/tenant-invitations')) {
    return Promise.resolve({ ok: true, json: async () => ({}) });
  }
  return Promise.resolve({ ok: true, json: async () => ({}) });
}) as any;

describe('TenantVerifyPage', () => {
  it('allows a tenant to verify invitation and create an account', async () => {
    render(
      <AuthProvider>
        <TenantVerifyPage />
      </AuthProvider>
    );

    // Wait for invitation to load
    await screen.findByText(/Welcome to Test Property/i);

    // Fill out password fields
    fireEvent.change(screen.getByLabelText(/Create Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Account & Access Portal/i }));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/Your account has been successfully created/i)).toBeInTheDocument();
    });

    // Check that signUp was called with correct info
    const { auth } = require('@/lib/supabase-utils');
    expect(auth.signUp).toHaveBeenCalledWith(
      'tenant@example.com',
      'password123',
      expect.objectContaining({
        first_name: 'Jane',
        last_name: 'Doe',
        phone: '555-1234',
        role: 'TENANT',
      })
    );
  });
}); 
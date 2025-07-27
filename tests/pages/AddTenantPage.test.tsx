global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: {
          user: {
            id: 'user-1',
            user_metadata: { first_name: 'Land', last_name: 'Lord' }
          }
        }
      }),
    },
  },
}));

beforeAll(() => {
  window.alert = jest.fn();
});

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  useParams: () => ({}),
  useSearchParams: () => ({
    get: () => null,
  }),
  usePathname: () => '/',
}));

jest.mock('@/lib/supabase-utils', () => ({
  tenants: {
    getAvailableUnits: jest.fn().mockResolvedValue([
      { id: 'unit-1', unit_number: '1', rent_amount: 1200, property: { name: 'Test Property', address: '123 Main St' }, bedrooms: 2, bathrooms: 1 }
    ]),
    getAll: jest.fn().mockResolvedValue([]),
  },
  tenantInvitations: {
    create: jest.fn().mockResolvedValue({ verification_token: 'token-123', expires_at: '2025-01-01' }),
  },
  auth: {
    getCurrentUserProfile: jest.fn().mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'LANDLORD',
      created_at: '',
      updated_at: '',
    }),
    signIn: jest.fn(),
    signOut: jest.fn(),
    updateProfile: jest.fn(),
  },
}));

jest.mock('@/lib/auth-context', () => {
  const actual = jest.requireActual('@/lib/auth-context');
  return {
    ...actual,
    useAuth: () => ({
      user: { id: 'user-1', email: 'test@example.com', role: 'LANDLORD' },
      loading: false,
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddTenantPage from '@/app/dashboard/tenants/new/page';
import { AuthProvider } from '@/lib/auth-context';

describe('AddTenantPage', () => {
  it('submits the form and creates a tenant invitation', async () => {
    render(
      <AuthProvider>
        <AddTenantPage />
      </AuthProvider>
    );

    // Wait for the form to be present
    await screen.findByLabelText(/First Name/i);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '555-1234' } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/Emergency Contact Name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Emergency Contact Phone/i), { target: { value: '555-5678' } });
    fireEvent.change(screen.getByLabelText(/Lease Start Date/i), { target: { value: '2024-08-01' } });
    fireEvent.change(screen.getByLabelText(/Lease End Date/i), { target: { value: '2025-08-01' } });
    fireEvent.change(screen.getByLabelText(/Select Unit/i), { target: { value: 'unit-1' } });

    // Wait for selected unit details to appear (ensures selectedUnit is set)
    await waitFor(() => {
      expect(screen.getByText(/Selected Unit Details/i)).toBeInTheDocument();
    });

    // Set rent and security deposit again after selecting the unit
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '1200' } });
    fireEvent.change(screen.getByLabelText(/Security Deposit/i), { target: { value: '1200' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Tenant/i }));
    console.log('Submitted form');

    // Wait for the tenant invitation creation to be called
    const { tenantInvitations } = require('@/lib/supabase-utils');
    await waitFor(() => {
      expect(tenantInvitations.create).toHaveBeenCalled();
    });
  });
}); 
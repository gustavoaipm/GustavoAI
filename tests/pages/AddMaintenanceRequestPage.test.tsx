import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewMaintenanceRequestPage from '@/app/dashboard/maintenance/new/page';
import { AuthProvider } from '@/lib/auth-context';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useParams: () => ({}),
  useSearchParams: () => ({ get: () => null }),
}));

// Mock supabase-utils and supabaseClient
jest.mock('@/lib/supabase-utils', () => ({
  properties: {
    getAll: jest.fn().mockResolvedValue([
      {
        id: 'property-1',
        name: 'Test Property',
        units: [
          { id: 'unit-1', unit_number: '1', property: { id: 'property-1', name: 'Test Property' } },
          { id: 'unit-2', unit_number: '2', property: { id: 'property-1', name: 'Test Property' } },
        ],
      },
    ]),
  },
  maintenance: {
    create: jest.fn().mockResolvedValue({ id: 'maintenance-1' }),
  },
}));

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null }) }) }),
    }),
  },
}));

jest.mock('@/lib/auth-context', () => {
  const actual = jest.requireActual('@/lib/auth-context');
  return {
    ...actual,
    useAuth: () => ({
      user: { id: 'owner-1', email: 'owner@example.com', role: 'LANDLORD' },
      loading: false,
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe('NewMaintenanceRequestPage', () => {
  it('creates a new maintenance request for the entire property as a property owner', async () => {
    render(
      <AuthProvider>
        <NewMaintenanceRequestPage />
      </AuthProvider>
    );

    // Wait for property and unit dropdowns to load
    await screen.findByLabelText(/Property/i);
    await screen.findByLabelText(/Unit/i);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test maintenance issue' } });
    fireEvent.change(screen.getByLabelText(/^Property/i), { target: { value: 'property-1' } });
    fireEvent.change(screen.getByLabelText(/^Unit/i), { target: { value: 'unit-1' } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-08-01' } });
    fireEvent.change(screen.getByLabelText('Time *'), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText(/Service Type/i), { target: { value: 'CLEANING' } });
    const preferredTimesInput = screen.getAllByLabelText(/Preferred Times/i)[0].parentElement?.querySelector('input');
    if (preferredTimesInput) {
      fireEvent.change(preferredTimesInput, { target: { value: '2024-08-01T10:00' } });
    }

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }));

    // Wait for the maintenance.create call
    const { maintenance } = require('@/lib/supabase-utils');
    await waitFor(() => {
      expect(maintenance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Test maintenance issue',
          property_id: 'property-1',
          unit_id: 'unit-1',
          type: 'CLEANING',
        })
      );
    });

    // Check for success message
    await screen.findByText(/Request submitted!/i);
  });
}); 
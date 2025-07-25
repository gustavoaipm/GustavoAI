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
  properties: {
    create: jest.fn().mockResolvedValue({ id: 'property-123' }),
    delete: jest.fn(),
  },
  units: {
    create: jest.fn().mockResolvedValue({}),
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

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddPropertyPage from '@/app/dashboard/properties/new/page';
import { AuthProvider } from '@/lib/auth-context';

describe('AddPropertyPage', () => {
  it('submits the form and creates a property and unit', async () => {
    render(
      <AuthProvider>
        <AddPropertyPage />
      </AuthProvider>
    );

    // Wait for the form to be present
    await screen.findByLabelText(/Property Name/i);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Property Name/i), { target: { value: 'Test Property' } });
    fireEvent.change(screen.getByLabelText(/Property Type/i), { target: { value: 'APARTMENT' } });
    fireEvent.change(screen.getByLabelText(/Street Address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText(/ZIP Code/i), { target: { value: '10001' } });
    fireEvent.change(screen.getByLabelText(/Total Units/i), { target: { value: '1' } });

    // Optionally fill out unit fields
    fireEvent.change(screen.getAllByPlaceholderText(/A/)[0], { target: { value: '1' } });
    fireEvent.change(screen.getAllByPlaceholderText(/800/)[0], { target: { value: '900' } });
    fireEvent.change(screen.getAllByPlaceholderText(/1200.00/)[0], { target: { value: '1500' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Property/i }));

    // Wait for the property and unit creation to be called
    const { properties, units } = require('@/lib/supabase-utils');
    await waitFor(() => {
      expect(properties.create).toHaveBeenCalled();
      expect(units.create).toHaveBeenCalled();
    });
  });
}); 
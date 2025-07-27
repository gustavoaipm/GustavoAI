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
  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();
  });

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

    // Fill out complete unit information (required for APARTMENT properties)
    fireEvent.change(screen.getAllByPlaceholderText(/A/)[0], { target: { value: '1' } }); // Unit number
    fireEvent.change(screen.getAllByPlaceholderText(/2/)[0], { target: { value: '2' } }); // Bedrooms
    fireEvent.change(screen.getAllByPlaceholderText(/1/)[0], { target: { value: '1' } }); // Bathrooms
    fireEvent.change(screen.getAllByPlaceholderText(/800/)[0], { target: { value: '900' } }); // Square feet
    fireEvent.change(screen.getAllByPlaceholderText(/1200.00/)[0], { target: { value: '1500' } }); // Rent

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Property/i }));

    // Wait for the property and unit creation to be called
    const { properties, units } = require('@/lib/supabase-utils');
    await waitFor(() => {
      expect(properties.create).toHaveBeenCalled();
      expect(units.create).toHaveBeenCalled();
    });
  });

  it('shows error for APARTMENT property without complete unit information', async () => {
    // Mock window.alert
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <AuthProvider>
        <AddPropertyPage />
      </AuthProvider>
    );

    // Wait for the form to be present
    await screen.findByLabelText(/Property Name/i);

    // Fill out the form but skip unit information
    fireEvent.change(screen.getByLabelText(/Property Name/i), { target: { value: 'Test Property' } });
    fireEvent.change(screen.getByLabelText(/Property Type/i), { target: { value: 'APARTMENT' } });
    fireEvent.change(screen.getByLabelText(/Street Address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText(/ZIP Code/i), { target: { value: '10001' } });
    fireEvent.change(screen.getByLabelText(/Total Units/i), { target: { value: '1' } });

    // Clear the rent amount field specifically (this is what makes validation fail)
    const rentInputs = screen.getAllByPlaceholderText(/1200.00/);
    if (rentInputs.length > 0) {
      fireEvent.change(rentInputs[0], { target: { value: '' } }); // Clear rent amount
    }

    // Submit the form without filling unit details
    fireEvent.click(screen.getByRole('button', { name: /Create Property/i }));

    // Wait for the error alert
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        'Apartments and condos must have at least one unit with complete information (unit number, bedrooms, bathrooms, and rent).'
      );
    });

    // Verify that property creation was not called
    const { properties } = require('@/lib/supabase-utils');
    expect(properties.create).not.toHaveBeenCalled();

    mockAlert.mockRestore();
  });

  it('creates HOUSE property with default unit when no units provided', async () => {
    // Mock window.alert to catch any error messages
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <AuthProvider>
        <AddPropertyPage />
      </AuthProvider>
    );

    // Wait for the form to be present
    await screen.findByLabelText(/Property Name/i);

    // Fill out the form for HOUSE property
    fireEvent.change(screen.getByLabelText(/Property Name/i), { target: { value: 'Test House' } });
    fireEvent.change(screen.getByLabelText(/Property Type/i), { target: { value: 'HOUSE' } });
    fireEvent.change(screen.getByLabelText(/Street Address/i), { target: { value: '456 Oak St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'CA' } });
    fireEvent.change(screen.getByLabelText(/ZIP Code/i), { target: { value: '90210' } });
    
    // Set total units to 0 to ensure no units are created initially
    fireEvent.change(screen.getByLabelText(/Total Units/i), { target: { value: '0' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Create Property/i });
    fireEvent.click(submitButton);

    // Wait for the property and default unit creation to be called
    const { properties, units } = require('@/lib/supabase-utils');
    await waitFor(() => {
      expect(properties.create).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(units.create).toHaveBeenCalledWith(
        expect.objectContaining({
          unit_number: '1',
          bedrooms: 1,
          bathrooms: 1,
          rent_amount: 0,
          description: 'Default unit representing the entire property',
        })
      );
    });

    // Check if any alerts were shown
    if (mockAlert.mock.calls.length > 0) {
      console.log('Alerts shown:', mockAlert.mock.calls);
    }

    mockAlert.mockRestore();
  });
}); 
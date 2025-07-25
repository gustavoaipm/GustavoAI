import { render, screen } from '@testing-library/react';
import DashboardNav from '@/app/components/DashboardNav';
import { AuthProvider } from '@/lib/auth-context';

describe('DashboardNav', () => {
  it('renders navigation links', () => {
    render(
      <AuthProvider>
        <DashboardNav />
      </AuthProvider>
    );
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Properties/i)).toBeInTheDocument();
    expect(screen.getByText(/Tenants/i)).toBeInTheDocument();
    expect(screen.getByText(/Payments/i)).toBeInTheDocument();
    expect(screen.getByText(/Maintenance/i)).toBeInTheDocument();
  });
}); 
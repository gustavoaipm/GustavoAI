import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationProvider, useNotification } from '@/lib/notification-context';
import Notification from '@/app/components/Notification';

// Test component that uses the notification hook
function TestComponent() {
  const { showNotification } = useNotification();
  
  return (
    <div>
      <button onClick={() => showNotification({
        type: 'success',
        title: 'Test Success',
        message: 'This is a test success message'
      })}>
        Show Success
      </button>
      <button onClick={() => showNotification({
        type: 'error',
        title: 'Test Error',
        message: 'This is a test error message'
      })}>
        Show Error
      </button>
    </div>
  );
}

describe('Notification System', () => {
  it('renders notification provider without crashing', () => {
    render(
      <NotificationProvider>
        <div>Test Content</div>
      </NotificationProvider>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows success notification when triggered', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    fireEvent.click(screen.getByText('Show Success'));
    
    expect(screen.getByText('Test Success')).toBeInTheDocument();
    expect(screen.getByText('This is a test success message')).toBeInTheDocument();
  });

  it('shows error notification when triggered', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    fireEvent.click(screen.getByText('Show Error'));
    
    expect(screen.getByText('Test Error')).toBeInTheDocument();
    expect(screen.getByText('This is a test error message')).toBeInTheDocument();
  });
}); 
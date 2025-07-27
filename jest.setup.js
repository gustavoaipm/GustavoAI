require('@testing-library/jest-dom');

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: { onAuthStateChange: jest.fn(), signInWithOAuth: jest.fn() },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    // Add more mocks as needed
  }),
}));
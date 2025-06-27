import { auth } from '@/lib/supabase-utils'
import { supabase } from '@/lib/supabase'

// Mock the supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      update: jest.fn().mockReturnThis(),
    })),
  },
}))

const mockSupabase = supabase as jest.Mocked<typeof supabase>

describe('Supabase Utils - Auth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('signUp', () => {
    it('should call supabase auth signUp with correct parameters', async () => {
      const mockSignUpResponse = {
        data: { user: { id: 'test-user-id' } },
        error: null,
      }
      mockSupabase.auth.signUp.mockResolvedValue(mockSignUpResponse)

      const email = 'test@example.com'
      const password = 'password123'
      const userData = {
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1234567890',
        role: 'LANDLORD' as const,
      }

      const result = await auth.signUp(email, password, userData)

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email,
        password,
        options: {
          data: userData,
        },
      })
      expect(result).toEqual(mockSignUpResponse.data)
    })

    it('should throw error when signUp fails', async () => {
      const mockError = new Error('Sign up failed')
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: mockError,
      })

      await expect(
        auth.signUp('test@example.com', 'password123', {
          first_name: 'John',
          last_name: 'Doe',
        })
      ).rejects.toThrow('Sign up failed')
    })
  })

  describe('signIn', () => {
    it('should call supabase auth signInWithPassword with correct parameters', async () => {
      const mockSignInResponse = {
        data: { user: { id: 'test-user-id' } },
        error: null,
      }
      mockSupabase.auth.signInWithPassword.mockResolvedValue(mockSignInResponse)

      const email = 'test@example.com'
      const password = 'password123'

      const result = await auth.signIn(email, password)

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email,
        password,
      })
      expect(result).toEqual(mockSignInResponse.data)
    })

    it('should throw error when signIn fails', async () => {
      const mockError = new Error('Invalid credentials')
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: mockError,
      })

      await expect(
        auth.signIn('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials')
    })
  })

  describe('signOut', () => {
    it('should call supabase auth signOut', async () => {
      const mockSignOutResponse = { error: null }
      mockSupabase.auth.signOut.mockResolvedValue(mockSignOutResponse)

      await auth.signOut()

      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    })

    it('should throw error when signOut fails', async () => {
      const mockError = new Error('Sign out failed')
      mockSupabase.auth.signOut.mockResolvedValue({ error: mockError })

      await expect(auth.signOut()).rejects.toThrow('Sign out failed')
    })
  })

  describe('getCurrentUser', () => {
    it('should call supabase auth getUser and return user', async () => {
      const mockUser = { id: 'test-user-id', email: 'test@example.com' }
      const mockGetUserResponse = {
        data: { user: mockUser },
        error: null,
      }
      mockSupabase.auth.getUser.mockResolvedValue(mockGetUserResponse)

      const result = await auth.getCurrentUser()

      expect(mockSupabase.auth.getUser).toHaveBeenCalled()
      expect(result).toEqual(mockUser)
    })

    it('should throw error when getUser fails', async () => {
      const mockError = new Error('Get user failed')
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: mockError,
      })

      await expect(auth.getCurrentUser()).rejects.toThrow('Get user failed')
    })
  })

  describe('getCurrentUserProfile', () => {
    it('should get user profile from database', async () => {
      const mockUser = { id: 'test-user-id', email: 'test@example.com' }
      const mockProfile = {
        id: 'test-user-id',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'LANDLORD',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockFrom = mockSupabase.from as jest.MockedFunction<typeof mockSupabase.from>
      const mockSelect = jest.fn().mockReturnThis()
      const mockEq = jest.fn().mockReturnThis()
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      })

      mockFrom.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      } as any)

      const result = await auth.getCurrentUserProfile()

      expect(mockSupabase.auth.getUser).toHaveBeenCalled()
      expect(mockFrom).toHaveBeenCalledWith('users')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('id', 'test-user-id')
      expect(mockSingle).toHaveBeenCalled()
      expect(result).toEqual(mockProfile)
    })

    it('should return null when no user is authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await auth.getCurrentUserProfile()

      expect(result).toBeNull()
    })

    it('should throw error when getCurrentUser fails', async () => {
      const mockError = new Error('Get user failed')
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: mockError,
      })

      await expect(auth.getCurrentUserProfile()).rejects.toThrow('Get user failed')
    })

    it('should throw error when profile fetch fails', async () => {
      const mockUser = { id: 'test-user-id', email: 'test@example.com' }
      const mockError = new Error('Profile fetch failed')

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockFrom = mockSupabase.from as jest.MockedFunction<typeof mockSupabase.from>
      const mockSelect = jest.fn().mockReturnThis()
      const mockEq = jest.fn().mockReturnThis()
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      })

      mockFrom.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      } as any)

      await expect(auth.getCurrentUserProfile()).rejects.toThrow('Profile fetch failed')
    })
  })

  describe('updateProfile', () => {
    it('should update user profile in database', async () => {
      const mockUser = { id: 'test-user-id', email: 'test@example.com' }
      const mockUpdatedProfile = {
        id: 'test-user-id',
        email: 'test@example.com',
        first_name: 'Updated',
        last_name: 'Doe',
        role: 'LANDLORD',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockFrom = mockSupabase.from as jest.MockedFunction<typeof mockSupabase.from>
      const mockUpdate = jest.fn().mockReturnThis()
      const mockEq = jest.fn().mockReturnThis()
      const mockSelect = jest.fn().mockReturnThis()
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockUpdatedProfile,
        error: null,
      })

      mockFrom.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      } as any)

      const updates = { first_name: 'Updated' }
      const result = await auth.updateProfile(updates)

      expect(mockSupabase.auth.getUser).toHaveBeenCalled()
      expect(mockFrom).toHaveBeenCalledWith('users')
      expect(mockUpdate).toHaveBeenCalledWith(updates)
      expect(mockEq).toHaveBeenCalledWith('id', 'test-user-id')
      expect(mockSelect).toHaveBeenCalled()
      expect(mockSingle).toHaveBeenCalled()
      expect(result).toEqual(mockUpdatedProfile)
    })

    it('should throw error when no user is authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      await expect(
        auth.updateProfile({ first_name: 'Updated' })
      ).rejects.toThrow('No user found')
    })

    it('should throw error when getCurrentUser fails', async () => {
      const mockError = new Error('Get user failed')
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: mockError,
      })

      await expect(
        auth.updateProfile({ first_name: 'Updated' })
      ).rejects.toThrow('Get user failed')
    })

    it('should throw error when profile update fails', async () => {
      const mockUser = { id: 'test-user-id', email: 'test@example.com' }
      const mockError = new Error('Update failed')

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockFrom = mockSupabase.from as jest.MockedFunction<typeof mockSupabase.from>
      const mockUpdate = jest.fn().mockReturnThis()
      const mockEq = jest.fn().mockReturnThis()
      const mockSelect = jest.fn().mockReturnThis()
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      })

      mockFrom.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      } as any)

      await expect(
        auth.updateProfile({ first_name: 'Updated' })
      ).rejects.toThrow('Update failed')
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network error')
      mockSupabase.auth.signIn.mockRejectedValue(networkError)

      await expect(
        auth.signIn('test@example.com', 'password123')
      ).rejects.toThrow('Network error')
    })

    it('should handle null error responses', async () => {
      mockSupabase.auth.signIn.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      // This should not throw an error since error is null
      const result = await auth.signIn('test@example.com', 'password123')
      expect(result).toEqual({ user: null })
    })
  })
}) 
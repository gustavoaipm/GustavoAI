import { formatPhoneNumber, unformatPhoneNumber, isValidPhoneNumber } from '@/lib/utils'

describe('Phone Number Formatting', () => {
  describe('formatPhoneNumber', () => {
    it('should format a 10-digit number correctly', () => {
      expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567')
    })

    it('should format partial numbers correctly', () => {
      expect(formatPhoneNumber('555')).toBe('(555')
      expect(formatPhoneNumber('555123')).toBe('(555) 123')
      expect(formatPhoneNumber('555123456')).toBe('(555) 123-456')
    })

    it('should handle empty input', () => {
      expect(formatPhoneNumber('')).toBe('')
    })

    it('should limit to 10 digits', () => {
      expect(formatPhoneNumber('555123456789')).toBe('(555) 123-4567')
    })

    it('should remove non-digits', () => {
      expect(formatPhoneNumber('555-123-4567')).toBe('(555) 123-4567')
      expect(formatPhoneNumber('(555) 123-4567')).toBe('(555) 123-4567')
      expect(formatPhoneNumber('555.123.4567')).toBe('(555) 123-4567')
    })
  })

  describe('unformatPhoneNumber', () => {
    it('should remove all formatting', () => {
      expect(unformatPhoneNumber('(555) 123-4567')).toBe('5551234567')
      expect(unformatPhoneNumber('555-123-4567')).toBe('5551234567')
      expect(unformatPhoneNumber('555.123.4567')).toBe('5551234567')
    })

    it('should handle already unformatted numbers', () => {
      expect(unformatPhoneNumber('5551234567')).toBe('5551234567')
    })

    it('should handle empty input', () => {
      expect(unformatPhoneNumber('')).toBe('')
    })
  })

  describe('isValidPhoneNumber', () => {
    it('should return true for valid 10-digit numbers', () => {
      expect(isValidPhoneNumber('(555) 123-4567')).toBe(true)
      expect(isValidPhoneNumber('5551234567')).toBe(true)
    })

    it('should return false for incomplete numbers', () => {
      expect(isValidPhoneNumber('(555) 123')).toBe(false)
      expect(isValidPhoneNumber('555123')).toBe(false)
    })

    it('should return false for empty input', () => {
      expect(isValidPhoneNumber('')).toBe(false)
    })

    it('should return false for numbers with more than 10 digits', () => {
      expect(isValidPhoneNumber('555123456789')).toBe(false)
    })
  })
}) 
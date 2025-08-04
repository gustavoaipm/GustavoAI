/**
 * Formats a phone number as the user types
 * Converts input like "5551234567" to "(555) 123-4567"
 */
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  const phoneNumber = value.replace(/\D/g, '')
  
  // Limit to 10 digits
  const trimmed = phoneNumber.slice(0, 10)
  
  // Format based on length
  if (trimmed.length === 0) return ''
  if (trimmed.length <= 3) return `(${trimmed}`
  if (trimmed.length <= 6) return `(${trimmed.slice(0, 3)}) ${trimmed.slice(3)}`
  
  return `(${trimmed.slice(0, 3)}) ${trimmed.slice(3, 6)}-${trimmed.slice(6)}`
}

/**
 * Removes formatting from a phone number
 * Converts "(555) 123-4567" to "5551234567"
 */
export const unformatPhoneNumber = (value: string): string => {
  return value.replace(/\D/g, '')
}

/**
 * Validates if a phone number is complete (10 digits)
 */
export const isValidPhoneNumber = (value: string): boolean => {
  const digits = value.replace(/\D/g, '')
  return digits.length === 10
} 
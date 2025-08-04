'use client'

import { useState, useEffect, forwardRef } from 'react'
import { formatPhoneNumber, unformatPhoneNumber } from '@/lib/utils'

interface PhoneInputProps {
  id: string
  label: string
  value?: string
  onChange?: (value: string) => void
  required?: boolean
  placeholder?: string
  className?: string
  error?: string
  // React Hook Form support
  name?: string
  onBlur?: () => void
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({
  id,
  label,
  value = '',
  onChange,
  required = false,
  placeholder = "(555) 123-4567",
  className = "form-input",
  error,
  name,
  onBlur
}, ref) => {
  const [displayValue, setDisplayValue] = useState('')

  // Initialize display value when component mounts or value changes externally
  useEffect(() => {
    if (value) {
      setDisplayValue(formatPhoneNumber(value))
    } else {
      setDisplayValue('')
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const formattedValue = formatPhoneNumber(inputValue)
    
    setDisplayValue(formattedValue)
    
    // Pass the unformatted value to the parent component
    const unformattedValue = unformatPhoneNumber(formattedValue)
    if (onChange) {
      onChange(unformattedValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].includes(e.keyCode)) {
      return
    }
    
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) {
      return
    }
    
    // Allow numbers only
    if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
      return
    }
    
    // Prevent other keys
    e.preventDefault()
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </label>
      <input
        ref={ref}
        type="tel"
        id={id}
        name={name}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${className} mt-1 ${error ? 'border-red-500' : ''}`}
        required={required}
        maxLength={14} // (XXX) XXX-XXXX
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

PhoneInput.displayName = 'PhoneInput'

export default PhoneInput 
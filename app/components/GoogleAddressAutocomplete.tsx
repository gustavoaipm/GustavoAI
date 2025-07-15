'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPinIcon } from '@heroicons/react/24/outline'

interface AddressAutocompleteProps {
  value: string
  onChange: (address: string) => void
  onAddressSelect: (addressData: {
    address: string
    city: string
    state: string
    zipCode: string
  }) => void
  placeholder?: string
  className?: string
  required?: boolean
}

// Google Maps API types
interface GoogleMapsAutocomplete {
  getPlace(): GoogleMapsPlace
  addListener(event: string, callback: () => void): void
}

interface GoogleMapsPlace {
  address_components?: GoogleMapsAddressComponent[]
  formatted_address?: string
}

interface GoogleMapsAddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

interface GoogleMapsPlaces {
  Autocomplete: new (
    input: HTMLInputElement,
    options: {
      types: string[]
      componentRestrictions: { country: string }
      fields: string[]
    }
  ) => GoogleMapsAutocomplete
}

interface GoogleMaps {
  maps: {
    places: GoogleMapsPlaces
    event: {
      clearInstanceListeners(autocomplete: GoogleMapsAutocomplete): void
    }
  }
}

declare global {
  interface Window {
    google: GoogleMaps
  }
}

export default function GoogleAddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Enter address...",
  className = "",
  required = false
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<GoogleMapsAutocomplete | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if API key is provided
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'your-google-maps-api-key-here') {
      setError('Google Maps API key not configured')
      return
    }

    // Load Google Maps API if not already loaded
    if (!window.google) {
      setIsLoading(true)
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        setIsLoading(false)
        initializeAutocomplete()
      }
      script.onerror = () => {
        setIsLoading(false)
        setError('Failed to load Google Maps API')
      }
      document.head.appendChild(script)
    } else {
      initializeAutocomplete()
    }

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [])

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address']
      })

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace()
        
        if (place?.address_components) {
          const addressData = {
            address: '',
            city: '',
            state: '',
            zipCode: ''
          }

          // Parse address components
          for (const component of place.address_components) {
            const types = component.types

            if (types.includes('street_number')) {
              addressData.address = component.long_name + ' '
            } else if (types.includes('route')) {
              addressData.address += component.long_name
            } else if (types.includes('locality')) {
              addressData.city = component.long_name
            } else if (types.includes('administrative_area_level_1')) {
              addressData.state = component.short_name
            } else if (types.includes('postal_code')) {
              addressData.zipCode = component.long_name
            }
          }

          // Update the form with parsed address data
          onAddressSelect(addressData)
          if (place.formatted_address) {
            onChange(place.formatted_address)
          }
        }
      })
    } catch (error) {
      console.error('Error initializing Google Maps autocomplete:', error)
      setError('Failed to initialize address autocomplete')
    }
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm">
        {error} - Please enter address manually
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`form-input pl-10 ${className}`}
          placeholder={placeholder}
          required={required}
          disabled={isLoading}
        />
        <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          </div>
        )}
      </div>
      {isLoading && (
        <p className="text-xs text-gray-500 mt-1">Loading address autocomplete...</p>
      )}
    </div>
  )
} 
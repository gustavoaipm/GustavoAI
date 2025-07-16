'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeftIcon,
  HomeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PlusIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/auth-context'
import DashboardNav from '@/app/components/DashboardNav'

interface PropertyFormData {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  propertyType: 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'COMMERCIAL'
  totalUnits: number
  description: string
}

interface UnitFormData {
  unitNumber: string
  bedrooms: number
  bathrooms: number
  squareFeet: number | ''
  rentAmount: number | ''
  description: string
}

const propertyTypes = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'CONDO', label: 'Condo' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
  { value: 'COMMERCIAL', label: 'Commercial' }
]

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export default function EditPropertyPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'APARTMENT',
    totalUnits: 1,
    description: ''
  })

  const [units, setUnits] = useState<UnitFormData[]>([
    {
      unitNumber: '1',
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: '',
      rentAmount: '',
      description: ''
    }
  ])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && propertyId) {
      fetchProperty()
    }
  }, [user, propertyId])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        const property = data.property
        
        setFormData({
          name: property.name,
          address: property.address,
          city: property.city,
          state: property.state,
          zipCode: property.zipCode,
          propertyType: property.propertyType,
          totalUnits: property.totalUnits || 1,
          description: property.description || ''
        })

        // Set units if they exist
        if (property.units && property.units.length > 0) {
          setUnits(property.units.map((unit: any) => ({
            unitNumber: unit.unitNumber,
            bedrooms: unit.bedrooms,
            bathrooms: unit.bathrooms,
            squareFeet: unit.squareFeet || '',
            rentAmount: unit.rentAmount,
            description: unit.description || ''
          })))
        }
      } else {
        router.push('/dashboard/properties')
      }
    } catch (error) {
      console.error('Error fetching property:', error)
      router.push('/dashboard/properties')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof PropertyFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUnitChange = (index: number, field: keyof UnitFormData, value: string | number) => {
    setUnits(prev => prev.map((unit, i) => 
      i === index ? { ...unit, [field]: value } : unit
    ))
  }

  const addUnit = () => {
    setUnits(prev => [...prev, {
      unitNumber: `${prev.length + 1}`,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: '',
      rentAmount: '',
      description: ''
    }])
  }

  const duplicateUnit = (index: number) => {
    const unitToDuplicate = units[index]
    const newUnitNumber = `${units.length + 1}`
    
    setUnits(prev => [...prev, {
      unitNumber: newUnitNumber,
      bedrooms: unitToDuplicate.bedrooms,
      bathrooms: unitToDuplicate.bathrooms,
      squareFeet: unitToDuplicate.squareFeet,
      rentAmount: unitToDuplicate.rentAmount,
      description: unitToDuplicate.description
    }])
    
    // Update total units count
    updateTotalUnits(units.length + 1)
  }

  const duplicateAllUnits = () => {
    if (units.length === 0) return
    
    const unitToDuplicate = units[0] // Use the first unit as template
    const unitsToAdd = formData.totalUnits - units.length
    
    const newUnits: UnitFormData[] = []
    for (let i = 0; i < unitsToAdd; i++) {
      newUnits.push({
        unitNumber: `${units.length + i + 1}`,
        bedrooms: unitToDuplicate.bedrooms,
        bathrooms: unitToDuplicate.bathrooms,
        squareFeet: unitToDuplicate.squareFeet,
        rentAmount: unitToDuplicate.rentAmount,
        description: unitToDuplicate.description
      })
    }
    
    setUnits(prev => [...prev, ...newUnits])
  }

  const removeUnit = (index: number) => {
    if (units.length > 1) {
      setUnits(prev => prev.filter((_, i) => i !== index))
    }
  }

  const updateTotalUnits = (totalUnits: number) => {
    setFormData(prev => ({ ...prev, totalUnits }))
    
    // Adjust units array to match total units
    if (totalUnits > units.length) {
      // Add more units
      const newUnits = [...units]
      for (let i = units.length; i < totalUnits; i++) {
        newUnits.push({
          unitNumber: `${i + 1}`,
          bedrooms: 1,
          bathrooms: 1,
          squareFeet: '',
          rentAmount: '',
          description: ''
        })
      }
      setUnits(newUnits)
    } else if (totalUnits < units.length) {
      // Remove excess units
      setUnits(prev => prev.slice(0, totalUnits))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          units
        })
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/dashboard/properties/${propertyId}`)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to update property'}`)
      }
    } catch (error) {
      console.error('Error updating property:', error)
      alert('Failed to update property. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
            <p className="mt-2 text-gray-600">Update property information</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <div className="flex items-center mb-6">
              <HomeIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Property Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="form-input"
                  placeholder="e.g., Sunset Apartments Unit 3B"
                />
              </div>

              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  id="propertyType"
                  required
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value as any)}
                  className="form-select"
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card">
            <div className="flex items-center mb-6">
              <MapPinIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Address</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="form-input"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="form-input"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    id="state"
                    required
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="form-input"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="card">
            <div className="flex items-center mb-6">
              <HomeIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Unit Details</h2>
            </div>
            {units.map((unit, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4 p-4 border rounded">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={unit.bedrooms}
                    onChange={e => handleUnitChange(idx, 'bedrooms', parseInt(e.target.value))}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.5"
                    value={unit.bathrooms}
                    onChange={e => handleUnitChange(idx, 'bathrooms', parseFloat(e.target.value))}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Square Feet
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={unit.squareFeet}
                    onChange={e => handleUnitChange(idx, 'squareFeet', e.target.value ? parseInt(e.target.value) : '')}
                    className="form-input"
                    placeholder="1200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={unit.rentAmount}
                      onChange={e => handleUnitChange(idx, 'rentAmount', e.target.value ? parseFloat(e.target.value) : '')}
                      className="form-input pl-10"
                      placeholder="1500.00"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="card">
            <div className="flex items-center mb-6">
              <DocumentTextIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Description</h2>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Property Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="form-textarea"
                placeholder="Describe the property, amenities, and any special features..."
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 
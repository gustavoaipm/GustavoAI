'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import GoogleAddressAutocomplete from '@/app/components/GoogleAddressAutocomplete'

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

export default function AddPropertyPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
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

  const handleInputChange = (field: keyof PropertyFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddressSelect = (addressData: {
    address: string
    city: string
    state: string
    zipCode: string
  }) => {
    setFormData(prev => ({
      ...prev,
      address: addressData.address,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode
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
    
    const newUnits = []
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          units: units.map(unit => ({
            ...unit,
            squareFeet: unit.squareFeet || null,
            rentAmount: parseFloat(unit.rentAmount.toString())
          }))
        })
      })

      if (response.ok) {
        const result = await response.json()
        router.push('/dashboard/properties')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to create property'}`)
      }
    } catch (error) {
      console.error('Error creating property:', error)
      alert('Failed to create property. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
            <p className="mt-2 text-gray-600">Add a new property to your portfolio</p>
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
                <GoogleAddressAutocomplete
                  value={formData.address}
                  onChange={(address) => handleInputChange('address', address)}
                  onAddressSelect={handleAddressSelect}
                  placeholder="Start typing an address..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Start typing to see address suggestions from Google Maps
                </p>
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
              <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="totalUnits" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Units *
                </label>
                <input
                  type="number"
                  id="totalUnits"
                  required
                  min="1"
                  value={formData.totalUnits}
                  onChange={(e) => updateTotalUnits(parseInt(e.target.value))}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Units */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <HomeIcon className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Units</h2>
              </div>
              <div className="flex items-center space-x-3">
                {units.length > 0 && units.length < formData.totalUnits && (
                  <button
                    type="button"
                    onClick={duplicateAllUnits}
                    className="btn-secondary flex items-center"
                    title="Duplicate the first unit to fill all remaining slots"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                    Duplicate All
                  </button>
                )}
                <button
                  type="button"
                  onClick={addUnit}
                  className="btn-secondary flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Unit
                </button>
              </div>
            </div>
            
            {units.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Use the "Duplicate" button on any unit to copy its layout and specifications. 
                  Perfect for properties with multiple units of the same type!
                </p>
              </div>
            )}
            
            <div className="space-y-6">
              {units.map((unit, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Unit {unit.unitNumber}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => duplicateUnit(index)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        title="Duplicate this unit layout"
                      >
                        <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                        Duplicate
                      </button>
                      {units.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeUnit(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={unit.unitNumber}
                        onChange={(e) => handleUnitChange(index, 'unitNumber', e.target.value)}
                        className="form-input"
                        placeholder="A, 101, 2B"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrooms *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={unit.bedrooms}
                        onChange={(e) => handleUnitChange(index, 'bedrooms', parseInt(e.target.value))}
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
                        onChange={(e) => handleUnitChange(index, 'bathrooms', parseFloat(e.target.value))}
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
                        onChange={(e) => handleUnitChange(index, 'squareFeet', e.target.value ? parseInt(e.target.value) : '')}
                        className="form-input"
                        placeholder="1200"
                      />
                    </div>

                    <div className="md:col-span-2">
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
                          onChange={(e) => handleUnitChange(index, 'rentAmount', e.target.value ? parseFloat(e.target.value) : '')}
                          className="form-input pl-10"
                          placeholder="1500.00"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Description
                      </label>
                      <textarea
                        rows={3}
                        value={unit.description}
                        onChange={(e) => handleUnitChange(index, 'description', e.target.value)}
                        className="form-textarea"
                        placeholder="Describe this specific unit..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                  Creating...
                </>
              ) : (
                'Create Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 
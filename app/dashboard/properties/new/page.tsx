'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { properties } from '@/lib/supabase-utils'
import { units } from '@/lib/supabase-utils'
import DashboardNav from '@/app/components/DashboardNav'
import { HomeIcon, MapPinIcon, BuildingOfficeIcon, PlusIcon, DocumentDuplicateIcon, TrashIcon } from '@heroicons/react/24/outline'
import GoogleAddressAutocomplete from '@/app/components/GoogleAddressAutocomplete'
import { supabase } from '@/lib/supabaseClient'

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
  unit_number: string
  bedrooms: number
  bathrooms: number
  square_feet: number | ''
  rent_amount: number | ''
  description: string
}

const propertyTypes = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'CONDO', label: 'Condo' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
  { value: 'COMMERCIAL', label: 'Commercial' },
]

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export default function AddPropertyPage() {
  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'APARTMENT',
    totalUnits: 1,
    description: '',
  })

  const [unitList, setUnitList] = useState<UnitFormData[]>([
    {
      unit_number: '1',
      bedrooms: 1,
      bathrooms: 1,
      square_feet: '',
      rent_amount: '',
      description: '',
    }
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  const handleInputChange = (field: keyof PropertyFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
      zipCode: addressData.zipCode,
    }))
  }

  const handleUnitChange = (index: number, field: keyof UnitFormData, value: string | number) => {
    setUnitList(prev => prev.map((unit, i) => 
      i === index ? { ...unit, [field]: value } : unit
    ))
  }

  const addUnit = () => {
    const newUnitNumber = (unitList.length + 1).toString()
    setUnitList(prev => [...prev, {
      unit_number: newUnitNumber,
      bedrooms: 1,
      bathrooms: 1,
      square_feet: '',
      rent_amount: '',
      description: '',
    }])
  }

  const duplicateUnit = (index: number) => {
    const unitToDuplicate = unitList[index]
    const newUnitNumber = (unitList.length + 1).toString()
    setUnitList(prev => [...prev, {
      ...unitToDuplicate,
      unit_number: newUnitNumber,
    }])
  }

  const duplicateAllUnits = () => {
    const baseUnit = unitList[0]
    const newUnits: UnitFormData[] = []
    
    for (let i = 1; i <= formData.totalUnits; i++) {
      newUnits.push({
        ...baseUnit,
        unit_number: i.toString(),
      })
    }
    
    setUnitList(newUnits)
  }

  const removeUnit = (index: number) => {
    if (unitList.length > 1) {
      setUnitList(prev => prev.filter((_, i) => i !== index))
    }
  }

  const updateTotalUnits = (totalUnits: number) => {
    handleInputChange('totalUnits', totalUnits)
    
    if (totalUnits > unitList.length) {
      // Add missing units
      const newUnits: UnitFormData[] = []
      for (let i = 1; i <= totalUnits; i++) {
        if (i <= unitList.length) {
          newUnits.push(unitList[i - 1])
        } else {
          newUnits.push({
            unit_number: i.toString(),
            bedrooms: 1,
            bathrooms: 1,
            square_feet: '',
            rent_amount: '',
            description: '',
          })
        }
      }
      setUnitList(newUnits)
    } else if (totalUnits < unitList.length) {
      // Remove excess units
      setUnitList(prev => prev.slice(0, totalUnits))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate unit requirements based on property type
    const requiresUnits = ['APARTMENT', 'CONDO'].includes(formData.propertyType)
    const hasValidUnits = unitList && unitList.length > 0 && unitList.some(unit => 
      unit.unit_number && unit.bedrooms && unit.bathrooms && unit.rent_amount
    )

    if (requiresUnits && !hasValidUnits) {
      alert('Apartments and condos must have at least one unit with complete information (unit number, bedrooms, bathrooms, and rent).')
      setIsSubmitting(false)
      return
    }

    let property = null;
    try {
      // Create property using Supabase
      const propertyData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        property_type: formData.propertyType,
        description: formData.description,
        total_units: formData.totalUnits,
        status: 'AVAILABLE' as 'AVAILABLE',
        images: [],
        owner_id: '', // will be set by backend
      };

      property = await properties.create(propertyData);

      // Handle units based on property type
      if (unitList && unitList.length > 0 && hasValidUnits) {
        // Create provided units
        for (const unitData of unitList) {
          if (unitData.unit_number && unitData.bedrooms && unitData.bathrooms && unitData.rent_amount) {
            await units.create({
              property_id: property.id,
              unit_number: unitData.unit_number,
              bedrooms: unitData.bedrooms,
              bathrooms: unitData.bathrooms,
              square_feet: unitData.square_feet || undefined,
              rent_amount: parseFloat(unitData.rent_amount.toString()),
              status: 'AVAILABLE',
              description: unitData.description,
            });
          }
        }
      } else if (['HOUSE', 'TOWNHOUSE'].includes(formData.propertyType)) {
        // Create default unit for HOUSE/TOWNHOUSE without units
        await units.create({
          property_id: property.id,
          unit_number: '1',
          bedrooms: 1,
          bathrooms: 1,
          square_feet: undefined,
          rent_amount: 0,
          status: 'AVAILABLE',
          description: 'Default unit representing the entire property',
        });
      }
      // For COMMERCIAL properties, no units are created if none provided

      router.push('/dashboard/properties');
    } catch (error) {
      // If property was created but units failed, delete the property
      if (property && property.id) {
        try {
          await properties.delete(property.id);
        } catch (deleteError) {
          console.error('Failed to rollback property:', deleteError);
        }
      }
      console.error('Error creating property or units:', error);
      alert('Failed to create property or units. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (user) {
      setLoading(false)
    } else if (!loading) {
      router.push('/login')
    }
  }, [user, loading, router])

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
                {typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== 'your-google-maps-api-key-here' ? (
                  <GoogleAddressAutocomplete
                    value={formData.address}
                    onChange={(address) => handleInputChange('address', address)}
                    onAddressSelect={handleAddressSelect}
                    placeholder="Start typing an address..."
                    required
                  />
                ) : (
                  <input
                    type="text"
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="form-input"
                    placeholder="123 Main Street"
                  />
                )}
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
              <BuildingOfficeIcon className="h-6 w-6 text-primary-600 mr-3" />
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
                  min="0"
                  required
                  value={formData.totalUnits}
                  onChange={(e) => updateTotalUnits(parseInt(e.target.value))}
                  className="form-input"
                  placeholder="1"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe the property..."
                />
              </div>
            </div>
          </div>

          {/* Units */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Units</h2>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={duplicateAllUnits}
                  className="btn-secondary text-sm"
                >
                  <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                  Duplicate All
                </button>
                <button
                  type="button"
                  onClick={addUnit}
                  className="btn-primary text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Unit
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {unitList.map((unit: UnitFormData, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Unit {unit.unit_number}</h3>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => duplicateUnit(index)}
                        className="btn-secondary text-sm"
                      >
                        <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                        Duplicate
                      </button>
                      {unitList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeUnit(index)}
                          className="btn-danger text-sm"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Number
                      </label>
                      <input
                        type="text"
                        value={unit.unit_number}
                        onChange={(e) => handleUnitChange(index, 'unit_number', e.target.value)}
                        className="form-input"
                        placeholder="A"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={unit.bedrooms}
                        onChange={(e) => handleUnitChange(index, 'bedrooms', parseInt(e.target.value))}
                        className="form-input"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={unit.bathrooms}
                        onChange={(e) => handleUnitChange(index, 'bathrooms', parseFloat(e.target.value))}
                        className="form-input"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Square Feet
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={unit.square_feet}
                        onChange={(e) => handleUnitChange(index, 'square_feet', e.target.value ? parseInt(e.target.value) : '')}
                        className="form-input"
                        placeholder="800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Rent ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={unit.rent_amount}
                        onChange={(e) => handleUnitChange(index, 'rent_amount', e.target.value ? parseFloat(e.target.value) : '')}
                        className="form-input"
                        placeholder="1200.00"
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={unit.description}
                        onChange={(e) => handleUnitChange(index, 'description', e.target.value)}
                        className="form-textarea"
                        rows={2}
                        placeholder="Describe this unit..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/properties')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Creating Property...' : 'Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 
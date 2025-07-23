'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { properties } from '@/lib/supabase-utils'
import DashboardNav from '@/app/components/DashboardNav'
import { 
  HomeIcon, 
  PlusIcon, 
  TrashIcon, 
  DocumentDuplicateIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

interface PropertyFormData {
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  property_type: 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'COMMERCIAL'
  total_units: number
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

export default function EditPropertyPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string
  
  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    property_type: 'APARTMENT',
    total_units: 1,
    description: ''
  })
  
  const [units, setUnits] = useState<UnitFormData[]>([{
    unit_number: '1',
    bedrooms: 1,
    bathrooms: 1,
    square_feet: '',
    rent_amount: '',
    description: ''
  }])
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user && propertyId) {
      fetchProperty()
    }
  }, [user, propertyId])

  const fetchProperty = async () => {
    try {
      const property = await properties.getById(propertyId)
      
      setFormData({
        name: property.name,
        address: property.address,
        city: property.city,
        state: property.state,
        zip_code: property.zip_code,
        property_type: property.property_type,
        total_units: property.total_units || 1,
        description: property.description || ''
      })

      // Set units if they exist
      if (property.units && property.units.length > 0) {
        setUnits(property.units.map((unit: any) => ({
          unit_number: unit.unit_number,
          bedrooms: unit.bedrooms,
          bathrooms: unit.bathrooms,
          square_feet: unit.square_feet || '',
          rent_amount: unit.rent_amount,
          description: unit.description || ''
        })))
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
      unit_number: `${prev.length + 1}`,
      bedrooms: 1,
      bathrooms: 1,
      square_feet: '',
      rent_amount: '',
      description: ''
    }])
  }

  const duplicateUnit = (index: number) => {
    const unitToDuplicate = units[index]
    const newUnitNumber = `${units.length + 1}`
    
    setUnits(prev => [...prev, {
      unit_number: newUnitNumber,
      bedrooms: unitToDuplicate.bedrooms,
      bathrooms: unitToDuplicate.bathrooms,
      square_feet: unitToDuplicate.square_feet,
      rent_amount: unitToDuplicate.rent_amount,
      description: unitToDuplicate.description
    }])
    
    // Update total units count
    updateTotalUnits(units.length + 1)
  }

  const duplicateAllUnits = () => {
    if (units.length === 0) return
    
    const unitToDuplicate = units[0] // Use the first unit as template
    const unitsToAdd = formData.total_units - units.length
    
    const newUnits: UnitFormData[] = []
    for (let i = 0; i < unitsToAdd; i++) {
      newUnits.push({
        unit_number: `${units.length + i + 1}`,
        bedrooms: unitToDuplicate.bedrooms,
        bathrooms: unitToDuplicate.bathrooms,
        square_feet: unitToDuplicate.square_feet,
        rent_amount: unitToDuplicate.rent_amount,
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
    setFormData(prev => ({ ...prev, total_units: totalUnits }))
    
    // Adjust units array to match total units
    if (totalUnits > units.length) {
      // Add more units
      const newUnits = [...units]
      for (let i = units.length; i < totalUnits; i++) {
        newUnits.push({
          unit_number: `${i + 1}`,
          bedrooms: 1,
          bathrooms: 1,
          square_feet: '',
          rent_amount: '',
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
      // Update property
      await properties.update(propertyId, {
        ...formData,
        total_units: units.length
      })

      // Note: Unit updates would need to be handled separately
      // For now, we'll just update the property data
      
      router.push(`/dashboard/properties/${propertyId}`)
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
              <p className="mt-2 text-gray-600">Update property information</p>
            </div>
            <button
              onClick={() => router.push(`/dashboard/properties/${propertyId}`)}
              className="btn-outline flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Property
            </button>
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
                  placeholder="Sunset Apartments"
                />
              </div>

              <div>
                <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  id="property_type"
                  required
                  value={formData.property_type}
                  onChange={(e) => handleInputChange('property_type', e.target.value as any)}
                  className="form-select"
                >
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="CONDO">Condo</option>
                  <option value="TOWNHOUSE">Townhouse</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
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
                <input
                  type="text"
                  id="state"
                  required
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="form-input"
                  placeholder="NY"
                />
              </div>

              <div>
                <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  id="zip_code"
                  required
                  value={formData.zip_code}
                  onChange={(e) => handleInputChange('zip_code', e.target.value)}
                  className="form-input"
                  placeholder="10001"
                />
              </div>

              <div>
                <label htmlFor="total_units" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Units *
                </label>
                <input
                  type="number"
                  id="total_units"
                  required
                  min="1"
                  value={formData.total_units}
                  onChange={(e) => updateTotalUnits(parseInt(e.target.value))}
                  className="form-input"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="form-textarea"
                  placeholder="Describe the property..."
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
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={addUnit}
                  className="btn-secondary flex items-center text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Unit
                </button>
                {units.length > 0 && (
                  <button
                    type="button"
                    onClick={duplicateAllUnits}
                    className="btn-outline flex items-center text-sm"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                    Duplicate All
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {units.map((unit, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Unit {unit.unit_number}</h3>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => duplicateUnit(index)}
                        className="btn-outline text-sm"
                      >
                        <DocumentDuplicateIcon className="h-4 w-4" />
                      </button>
                      {units.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeUnit(index)}
                          className="btn-outline text-red-600 hover:bg-red-50 text-sm"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Number
                      </label>
                      <input
                        type="text"
                        value={unit.unit_number}
                        onChange={(e) => handleUnitChange(index, 'unit_number', e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={unit.bedrooms}
                        onChange={(e) => handleUnitChange(index, 'bedrooms', parseInt(e.target.value))}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bathrooms
                      </label>
                      <input
                        type="number"
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
                        value={unit.square_feet}
                        onChange={(e) => handleUnitChange(index, 'square_feet', e.target.value ? parseInt(e.target.value) : '')}
                        className="form-input"
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Rent *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={unit.rent_amount}
                        onChange={(e) => handleUnitChange(index, 'rent_amount', e.target.value ? parseFloat(e.target.value) : '')}
                        className="form-input"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={unit.description}
                        onChange={(e) => handleUnitChange(index, 'description', e.target.value)}
                        className="form-textarea"
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
              onClick={() => router.push(`/dashboard/properties/${propertyId}`)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center"
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
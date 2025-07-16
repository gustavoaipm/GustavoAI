'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  UserGroupIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/auth-context'
import DashboardNav from '@/app/components/DashboardNav'

interface Unit {
  id: string
  unitNumber: string
  bedrooms: number
  bathrooms: number
  squareFeet: number | null
  rentAmount: number
  property: {
    name: string
    address: string
  }
}

interface TenantFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  emergencyContact: string
  emergencyPhone: string
  leaseStart: string
  leaseEnd: string
  rentAmount: number | ''
  securityDeposit: number | ''
  unitId: string
}

export default function AddTenantPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([])
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [isLoadingUnits, setIsLoadingUnits] = useState(true)

  const [formData, setFormData] = useState<TenantFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    emergencyContact: '',
    emergencyPhone: '',
    leaseStart: '',
    leaseEnd: '',
    rentAmount: '',
    securityDeposit: '',
    unitId: ''
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchAvailableUnits()
    }
  }, [user])

  const fetchAvailableUnits = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenants/available-units`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setAvailableUnits(data)
      }
    } catch (error) {
      console.error('Error fetching available units:', error)
    } finally {
      setIsLoadingUnits(false)
    }
  }

  const handleInputChange = (field: keyof TenantFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-fill rent amount when unit is selected
    if (field === 'unitId') {
      const unit = availableUnits.find(u => u.id === value)
      if (unit) {
        setSelectedUnit(unit)
        setFormData(prev => ({
          ...prev,
          unitId: String(value),
          rentAmount: unit.rentAmount
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          rentAmount: parseFloat(formData.rentAmount.toString()),
          securityDeposit: parseFloat(formData.securityDeposit.toString()),
          dateOfBirth: formData.dateOfBirth || null,
          emergencyContact: formData.emergencyContact || null,
          emergencyPhone: formData.emergencyPhone || null,
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert('Tenant created successfully! An invitation email has been sent to the tenant.')
        router.push('/dashboard/tenants')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to create tenant'}`)
      }
    } catch (error) {
      console.error('Error creating tenant:', error)
      alert('Failed to create tenant. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading || isLoadingUnits) {
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
            <h1 className="text-3xl font-bold text-gray-900">Add New Tenant</h1>
            <p className="mt-2 text-gray-600">Add a new tenant and send them an invitation to join the portal</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <div className="flex items-center mb-6">
              <UserGroupIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="form-input"
                  placeholder="John"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="form-input"
                  placeholder="Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="form-input"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="form-input"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="card">
            <div className="flex items-center mb-6">
              <PhoneIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Emergency Contact</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="form-input"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  className="form-input"
                  placeholder="(555) 987-6543"
                />
              </div>
            </div>
          </div>

          {/* Unit Assignment */}
          <div className="card">
            <div className="flex items-center mb-6">
              <BuildingOfficeIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Unit Assignment</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="unitId" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Unit *
                </label>
                <select
                  id="unitId"
                  required
                  value={formData.unitId}
                  onChange={(e) => handleInputChange('unitId', e.target.value)}
                  className="form-select"
                >
                  <option value="">Choose a unit</option>
                  {availableUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.property.name} - Unit {unit.unitNumber} ({unit.bedrooms} bed, {unit.bathrooms} bath) - {formatCurrency(unit.rentAmount)}
                    </option>
                  ))}
                </select>
                {availableUnits.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">No available units found. Please add properties and units first.</p>
                )}
              </div>

              {selectedUnit && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Unit Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Property:</span>
                      <p className="font-medium">{selectedUnit.property.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Address:</span>
                      <p className="font-medium">{selectedUnit.property.address}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Unit:</span>
                      <p className="font-medium">{selectedUnit.unitNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Bedrooms:</span>
                      <p className="font-medium">{selectedUnit.bedrooms}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Bathrooms:</span>
                      <p className="font-medium">{selectedUnit.bathrooms}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Square Feet:</span>
                      <p className="font-medium">{selectedUnit.squareFeet ? `${selectedUnit.squareFeet.toLocaleString()}` : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lease Information */}
          <div className="card">
            <div className="flex items-center mb-6">
              <CalendarIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Lease Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="leaseStart" className="block text-sm font-medium text-gray-700 mb-2">
                  Lease Start Date *
                </label>
                <input
                  type="date"
                  id="leaseStart"
                  required
                  value={formData.leaseStart}
                  onChange={(e) => handleInputChange('leaseStart', e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="leaseEnd" className="block text-sm font-medium text-gray-700 mb-2">
                  Lease End Date *
                </label>
                <input
                  type="date"
                  id="leaseEnd"
                  required
                  value={formData.leaseEnd}
                  onChange={(e) => handleInputChange('leaseEnd', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="card">
            <div className="flex items-center mb-6">
              <CurrencyDollarIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Financial Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="rentAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="rentAmount"
                    required
                    min="0"
                    step="0.01"
                    value={formData.rentAmount}
                    onChange={(e) => handleInputChange('rentAmount', e.target.value ? parseFloat(e.target.value) : '')}
                    className="form-input pl-10"
                    placeholder="1500.00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="securityDeposit" className="block text-sm font-medium text-gray-700 mb-2">
                  Security Deposit *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="securityDeposit"
                    required
                    min="0"
                    step="0.01"
                    value={formData.securityDeposit}
                    onChange={(e) => handleInputChange('securityDeposit', e.target.value ? parseFloat(e.target.value) : '')}
                    className="form-input pl-10"
                    placeholder="1500.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Email Invitation Notice */}
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-start">
              <EnvelopeIcon className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-blue-900 mb-2">Email Invitation</h3>
                <p className="text-blue-700">
                  When you create this tenant, an invitation email will be automatically sent to {formData.email || 'the tenant'} with
                  a secure link to complete their account setup. The tenant will be able to set their password and 
                  immediately access their tenant portal.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/tenants')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.unitId}
              className="btn-primary flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Tenant...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Create Tenant & Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 
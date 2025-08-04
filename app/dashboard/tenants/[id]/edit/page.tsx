'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { tenants } from '@/lib/supabase-utils'
import { supabase } from '@/lib/supabaseClient'
import DashboardNav from '@/app/components/DashboardNav'
import PhoneInput from '@/app/components/PhoneInput'
import { 
  UserGroupIcon, 
  HomeIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface TenantFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  emergency_contact: string
  emergency_phone: string
  status: 'ACTIVE' | 'INACTIVE' | 'EVICTED' | 'MOVED_OUT'
  lease_start: string
  lease_end: string
  rent_amount: number | ''
  security_deposit: number | ''
  unit_id: string
}

interface Unit {
  id: string
  unit_number: string
  bedrooms: number
  bathrooms: number
  square_feet: number | null
  rent_amount: number
  status: string
  property_id: string
  property: {
    name: string
    address: string
  }
}

export default function EditTenantPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const tenantId = params.id as string
  
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([])
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [isLoadingUnits, setIsLoadingUnits] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<TenantFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    emergency_contact: '',
    emergency_phone: '',
    status: 'ACTIVE',
    lease_start: '',
    lease_end: '',
    rent_amount: '',
    security_deposit: '',
    unit_id: ''
  })

  useEffect(() => {
    if (user && tenantId) {
      fetchTenant()
      fetchAvailableUnits()
    }
  }, [user, tenantId])

  const fetchTenant = async () => {
    try {
      const tenant = await tenants.getById(tenantId)
      
      setFormData({
        first_name: tenant.first_name,
        last_name: tenant.last_name,
        email: tenant.email,
        phone: tenant.phone,
        date_of_birth: tenant.date_of_birth || '',
        emergency_contact: tenant.emergency_contact || '',
        emergency_phone: tenant.emergency_phone || '',
        status: tenant.status,
        lease_start: tenant.lease_start,
        lease_end: tenant.lease_end,
        rent_amount: tenant.rent_amount,
        security_deposit: tenant.security_deposit,
        unit_id: tenant.unit_id
      })

      // Set selected unit
      setSelectedUnit(tenant.unit)
    } catch (error) {
      console.error('Error fetching tenant:', error)
      router.push('/dashboard/tenants')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableUnits = async () => {
    try {
      // Get all units (not just available ones) for editing
      const data = await tenants.getAllUnits()
      setAvailableUnits(data)
    } catch (error) {
      console.error('Error fetching units:', error)
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
    if (field === 'unit_id') {
      const unit = availableUnits.find(u => u.id === value)
      if (unit) {
        setSelectedUnit(unit)
        setFormData(prev => ({
          ...prev,
          unit_id: String(value),
          rent_amount: unit.rent_amount
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get current user ID for landlord_id
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) throw new Error('User not authenticated')

      if (!selectedUnit) throw new Error('No unit selected')

      // Update tenant
      await tenants.update(tenantId, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth || null,
        emergency_contact: formData.emergency_contact || null,
        emergency_phone: formData.emergency_phone || null,
        status: formData.status,
        lease_start: formData.lease_start,
        lease_end: formData.lease_end,
        rent_amount: parseFloat(formData.rent_amount.toString()),
        security_deposit: parseFloat(formData.security_deposit.toString()),
        unit_id: selectedUnit.id,
        landlord_id: currentUser.id
      })

      router.push(`/dashboard/tenants/${tenantId}`)
    } catch (error) {
      console.error('Error updating tenant:', error)
      alert('Failed to update tenant. Please try again.')
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

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tenant...</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <button
              onClick={() => router.push(`/dashboard/tenants/${tenantId}`)}
              className="mr-4 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Tenant</h1>
              <p className="mt-2 text-gray-600">Update tenant information and lease details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
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
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="first_name"
                  required
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="form-input"
                  placeholder="John"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="last_name"
                  required
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
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

              <PhoneInput
                id="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                placeholder="(555) 123-4567"
                required
              />

              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  required
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as any)}
                  className="form-select"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="EVICTED">Evicted</option>
                  <option value="MOVED_OUT">Moved Out</option>
                </select>
              </div>

              <div>
                <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  id="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                  className="form-input"
                  placeholder="Emergency contact name"
                />
              </div>

              <PhoneInput
                id="emergency_phone"
                label="Emergency Contact Phone"
                value={formData.emergency_phone}
                onChange={(value) => handleInputChange('emergency_phone', value)}
                placeholder="(555) 987-6543"
              />
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
                <label htmlFor="lease_start" className="block text-sm font-medium text-gray-700 mb-2">
                  Lease Start Date *
                </label>
                <input
                  type="date"
                  id="lease_start"
                  required
                  value={formData.lease_start}
                  onChange={(e) => handleInputChange('lease_start', e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="lease_end" className="block text-sm font-medium text-gray-700 mb-2">
                  Lease End Date *
                </label>
                <input
                  type="date"
                  id="lease_end"
                  required
                  value={formData.lease_end}
                  onChange={(e) => handleInputChange('lease_end', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Property Assignment */}
          <div className="card">
            <div className="flex items-center mb-6">
              <HomeIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Property Assignment</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="unit_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Unit *
                </label>
                <select
                  id="unit_id"
                  required
                  value={formData.unit_id}
                  onChange={(e) => handleInputChange('unit_id', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select a unit</option>
                  {availableUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.property.name} - Unit {unit.unit_number} ({unit.bedrooms} bed, {unit.bathrooms} bath)
                    </option>
                  ))}
                </select>
                {availableUnits.length === 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    <ExclamationTriangleIcon className="h-4 w-4 inline mr-1" />
                    No units found. Please add units to your properties first.
                  </p>
                )}
              </div>

              {selectedUnit && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Selected Unit Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Property:</span>
                      <p className="font-medium">{selectedUnit.property.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Unit:</span>
                      <p className="font-medium">{selectedUnit.unit_number}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Size:</span>
                      <p className="font-medium">{selectedUnit.bedrooms} bed, {selectedUnit.bathrooms} bath</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Rent:</span>
                      <p className="font-medium">{formatCurrency(selectedUnit.rent_amount)}</p>
                    </div>
                  </div>
                </div>
              )}
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
                <label htmlFor="rent_amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent *
                </label>
                <input
                  type="number"
                  id="rent_amount"
                  required
                  min="0"
                  step="0.01"
                  value={formData.rent_amount}
                  onChange={(e) => handleInputChange('rent_amount', parseFloat(e.target.value) || '')}
                  className="form-input"
                  placeholder="1500.00"
                />
              </div>

              <div>
                <label htmlFor="security_deposit" className="block text-sm font-medium text-gray-700 mb-2">
                  Security Deposit *
                </label>
                <input
                  type="number"
                  id="security_deposit"
                  required
                  min="0"
                  step="0.01"
                  value={formData.security_deposit}
                  onChange={(e) => handleInputChange('security_deposit', parseFloat(e.target.value) || '')}
                  className="form-input"
                  placeholder="1500.00"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push(`/dashboard/tenants/${tenantId}`)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Tenant'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 
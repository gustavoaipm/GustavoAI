'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardNav from '@/app/components/DashboardNav'
import { utilities, properties, tenants } from '@/lib/supabase-utils'
import { useAuth } from '@/lib/auth-context'
import { 
  ArrowLeftIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const UTILITY_TYPES = [
  { value: 'ELECTRIC', label: 'Electricity' },
  { value: 'WATER', label: 'Water' },
  { value: 'GAS', label: 'Gas' },
  { value: 'SEWER', label: 'Sewer' },
  { value: 'TRASH', label: 'Trash' },
  { value: 'INTERNET', label: 'Internet' },
  { value: 'CABLE', label: 'Cable' },
  { value: 'OTHER', label: 'Other' }
]

const BILLING_FREQUENCIES = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'ANNUALLY', label: 'Annually' }
]

const UNIT_OF_MEASUREMENT_OPTIONS = {
  ELECTRIC: ['kWh', 'MWh'],
  WATER: ['gallons', 'cubic feet', 'cubic meters'],
  GAS: ['therms', 'cubic feet', 'cubic meters'],
  SEWER: ['gallons', 'cubic feet'],
  TRASH: ['pickups', 'tons', 'cubic yards'],
  INTERNET: ['MB', 'GB', 'TB'],
  CABLE: ['channels', 'services'],
  OTHER: ['units', 'items', 'services']
}

export default function NewUtilityPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [form, setForm] = useState({
    unit_id: '',
    property_id: '',
    tenant_id: '',
    utility_type: 'ELECTRIC',
    utility_name: '',
    provider_name: '',
    account_number: '',
    is_included_in_rent: false,
    is_submetered: false,
    billing_frequency: 'MONTHLY',
    base_rate: '',
    unit_of_measurement: '',
    late_fee_percentage: '5.00',
    grace_period_days: '5',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [propertiesList, setProperties] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [tenantsList, setTenants] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role !== 'TENANT') {
      fetchProperties()
      fetchTenants()
    }
  }, [user])

  const fetchProperties = async () => {
    try {
      const data = await properties.getAll()
      setProperties(data)
      // Flatten all units for selection
      const allUnits = data.flatMap((p: any) =>
        (p.units || []).map((u: any) => ({ ...u, property: { id: p.id, name: p.name } }))
      )
      setUnits(allUnits)
    } catch (err) {
      setError('Failed to load properties/units.')
    }
  }

  const fetchTenants = async () => {
    try {
      const data = await tenants.getAll()
      setTenants(data)
    } catch (err) {
      setError('Failed to load tenants.')
    }
  }

  const handlePropertyChange = (propertyId: string) => {
    const selectedProperty = propertiesList.find(p => p.id === propertyId)
    const propertyUnits = selectedProperty?.units || []
    const propertyTenants = tenantsList.filter(t => t.property_id === propertyId)
    
    setUnits(propertyUnits.map((u: any) => ({ ...u, property: { id: propertyId, name: selectedProperty.name } })))
    setForm(prev => ({
      ...prev,
      property_id: propertyId,
      unit_id: '',
      tenant_id: ''
    }))
  }

  const handleUnitChange = (unitId: string) => {
    const selectedUnit = units.find(u => u.id === unitId)
    const unitTenants = tenantsList.filter(t => t.unit_id === unitId)
    
    setForm(prev => ({
      ...prev,
      unit_id: unitId,
      tenant_id: unitTenants.length === 1 ? unitTenants[0].id : ''
    }))
  }

  const handleUtilityTypeChange = (utilityType: string) => {
    const defaultName = UTILITY_TYPES.find(t => t.value === utilityType)?.label || ''
    const defaultUnit = UNIT_OF_MEASUREMENT_OPTIONS[utilityType as keyof typeof UNIT_OF_MEASUREMENT_OPTIONS]?.[0] || ''
    
    setForm(prev => ({
      ...prev,
      utility_type: utilityType,
      utility_name: prev.utility_name || defaultName,
      unit_of_measurement: prev.unit_of_measurement || defaultUnit
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.unit_id || !form.property_id || !form.utility_name) {
      setError('Please fill in all required fields.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const utilityData = {
        ...form,
        base_rate: form.base_rate ? parseFloat(form.base_rate) : undefined,
        late_fee_percentage: parseFloat(form.late_fee_percentage),
        grace_period_days: parseInt(form.grace_period_days),
        tenant_id: form.tenant_id || undefined
      }

      await utilities.create(utilityData)
      setSuccess(true)
      
      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/utilities')
      }, 2000)
    } catch (err) {
      setError('Failed to create utility. Please try again.')
      console.error('Error creating utility:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (user?.role === 'TENANT') {
    router.push('/dashboard/tenant-portal')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Add New Utility</h2>
            <p className="mt-1 text-sm text-gray-500">
              Set up a new utility service for a unit
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 rounded-md bg-green-50 p-4">
              <div className="flex">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Success!</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Utility has been created successfully. Redirecting...</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  <BoltIcon className="h-5 w-5 inline mr-2" />
                  Utility Information
                </h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Property Selection */}
                  <div className="sm:col-span-2">
                    <label htmlFor="property_id" className="block text-sm font-medium text-gray-700">
                      Property <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="property_id"
                      value={form.property_id}
                      onChange={(e) => handlePropertyChange(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    >
                      <option value="">Select a property</option>
                      {propertiesList.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name} - {property.address}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Unit Selection */}
                  <div className="sm:col-span-2">
                    <label htmlFor="unit_id" className="block text-sm font-medium text-gray-700">
                      Unit <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="unit_id"
                      value={form.unit_id}
                      onChange={(e) => handleUnitChange(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                      disabled={!form.property_id}
                    >
                      <option value="">Select a unit</option>
                      {units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          Unit {unit.unit_number} - {unit.bedrooms} bed, {unit.bathrooms} bath
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tenant Selection */}
                  <div className="sm:col-span-2">
                    <label htmlFor="tenant_id" className="block text-sm font-medium text-gray-700">
                      Tenant (Optional)
                    </label>
                    <select
                      id="tenant_id"
                      value={form.tenant_id}
                      onChange={(e) => setForm(prev => ({ ...prev, tenant_id: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      disabled={!form.unit_id}
                    >
                      <option value="">No tenant assigned</option>
                      {tenantsList
                        .filter(t => t.unit_id === form.unit_id)
                        .map((tenant) => (
                          <option key={tenant.id} value={tenant.id}>
                            {tenant.first_name} {tenant.last_name} - {tenant.email}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Utility Type */}
                  <div>
                    <label htmlFor="utility_type" className="block text-sm font-medium text-gray-700">
                      Utility Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="utility_type"
                      value={form.utility_type}
                      onChange={(e) => handleUtilityTypeChange(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    >
                      {UTILITY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Utility Name */}
                  <div>
                    <label htmlFor="utility_name" className="block text-sm font-medium text-gray-700">
                      Utility Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="utility_name"
                      value={form.utility_name}
                      onChange={(e) => setForm(prev => ({ ...prev, utility_name: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="e.g., Electricity, Water, Internet"
                      required
                    />
                  </div>

                  {/* Provider Name */}
                  <div>
                    <label htmlFor="provider_name" className="block text-sm font-medium text-gray-700">
                      Provider Name
                    </label>
                    <input
                      type="text"
                      id="provider_name"
                      value={form.provider_name}
                      onChange={(e) => setForm(prev => ({ ...prev, provider_name: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="e.g., PG&E, Comcast, Verizon"
                    />
                  </div>

                  {/* Account Number */}
                  <div>
                    <label htmlFor="account_number" className="block text-sm font-medium text-gray-700">
                      Account Number
                    </label>
                    <input
                      type="text"
                      id="account_number"
                      value={form.account_number}
                      onChange={(e) => setForm(prev => ({ ...prev, account_number: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Utility account number"
                    />
                  </div>

                  {/* Billing Frequency */}
                  <div>
                    <label htmlFor="billing_frequency" className="block text-sm font-medium text-gray-700">
                      Billing Frequency
                    </label>
                    <select
                      id="billing_frequency"
                      value={form.billing_frequency}
                      onChange={(e) => setForm(prev => ({ ...prev, billing_frequency: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      {BILLING_FREQUENCIES.map((freq) => (
                        <option key={freq.value} value={freq.value}>
                          {freq.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Base Rate */}
                  <div>
                    <label htmlFor="base_rate" className="block text-sm font-medium text-gray-700">
                      Base Rate (per unit)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        id="base_rate"
                        value={form.base_rate}
                        onChange={(e) => setForm(prev => ({ ...prev, base_rate: e.target.value }))}
                        className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Unit of Measurement */}
                  <div>
                    <label htmlFor="unit_of_measurement" className="block text-sm font-medium text-gray-700">
                      Unit of Measurement
                    </label>
                    <select
                      id="unit_of_measurement"
                      value={form.unit_of_measurement}
                      onChange={(e) => setForm(prev => ({ ...prev, unit_of_measurement: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="">Select unit</option>
                      {UNIT_OF_MEASUREMENT_OPTIONS[form.utility_type as keyof typeof UNIT_OF_MEASUREMENT_OPTIONS]?.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Late Fee Percentage */}
                  <div>
                    <label htmlFor="late_fee_percentage" className="block text-sm font-medium text-gray-700">
                      Late Fee Percentage
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        step="0.01"
                        id="late_fee_percentage"
                        value={form.late_fee_percentage}
                        onChange={(e) => setForm(prev => ({ ...prev, late_fee_percentage: e.target.value }))}
                        className="block w-full pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="5.00"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Grace Period */}
                  <div>
                    <label htmlFor="grace_period_days" className="block text-sm font-medium text-gray-700">
                      Grace Period (days)
                    </label>
                    <input
                      type="number"
                      id="grace_period_days"
                      value={form.grace_period_days}
                      onChange={(e) => setForm(prev => ({ ...prev, grace_period_days: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="5"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="sm:col-span-2 space-y-4">
                    <div className="flex items-center">
                      <input
                        id="is_included_in_rent"
                        type="checkbox"
                        checked={form.is_included_in_rent}
                        onChange={(e) => setForm(prev => ({ ...prev, is_included_in_rent: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_included_in_rent" className="ml-2 block text-sm text-gray-900">
                        Included in rent
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="is_submetered"
                        type="checkbox"
                        checked={form.is_submetered}
                        onChange={(e) => setForm(prev => ({ ...prev, is_submetered: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_submetered" className="ml-2 block text-sm text-gray-900">
                        Unit has separate meter
                      </label>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="sm:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Additional notes about this utility service..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Utility'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

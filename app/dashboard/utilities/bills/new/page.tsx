'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardNav from '@/app/components/DashboardNav'
import { utilities, utilityBills, properties, tenants } from '@/lib/supabase-utils'
import { useAuth } from '@/lib/auth-context'
import { 
  ArrowLeftIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BoltIcon
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

export default function NewUtilityBillPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [form, setForm] = useState({
    utility_id: '',
    unit_id: '',
    property_id: '',
    tenant_id: '',
    billing_period_start: '',
    billing_period_end: '',
    due_date: '',
    amount: '',
    usage_amount: '',
    usage_unit: '',
    rate_per_unit: '',
    base_charges: '',
    late_fee: '',
    total_amount: '',
    invoice_number: '',
    meter_reading_previous: '',
    meter_reading_current: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [propertiesList, setProperties] = useState<any[]>([])
  const [utilitiesList, setUtilitiesList] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [tenantsList, setTenants] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role !== 'TENANT') {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const [propertiesData, utilitiesData, tenantsData] = await Promise.all([
        properties.getAll(),
        utilities.getAll(),
        tenants.getAll()
      ])
      
      setProperties(propertiesData)
      setUtilitiesList(utilitiesData)
      setTenants(tenantsData)
      
      // Flatten all units for selection
      const allUnits = propertiesData.flatMap((p: any) =>
        (p.units || []).map((u: any) => ({ ...u, property: { id: p.id, name: p.name } }))
      )
      setUnits(allUnits)
    } catch (err) {
      setError('Failed to load data.')
    }
  }

  const handlePropertyChange = (propertyId: string) => {
    const selectedProperty = propertiesList.find(p => p.id === propertyId)
    const propertyUnits = selectedProperty?.units || []
    const propertyUtilities = utilitiesList.filter(u => u.property_id === propertyId)
    const propertyTenants = tenantsList.filter(t => t.property_id === propertyId)
    
    setUnits(propertyUnits.map((u: any) => ({ ...u, property: { id: propertyId, name: selectedProperty.name } })))
    setForm(prev => ({
      ...prev,
      property_id: propertyId,
      unit_id: '',
      utility_id: '',
      tenant_id: ''
    }))
  }

  const handleUnitChange = (unitId: string) => {
    const unitUtilities = utilitiesList.filter(u => u.unit_id === unitId)
    const unitTenants = tenantsList.filter(t => t.unit_id === unitId)
    
    setForm(prev => ({
      ...prev,
      unit_id: unitId,
      utility_id: unitUtilities.length === 1 ? unitUtilities[0].id : '',
      tenant_id: unitTenants.length === 1 ? unitTenants[0].id : ''
    }))
  }

  const handleUtilityChange = (utilityId: string) => {
    const utility = utilitiesList.find(u => u.id === utilityId)
    if (utility) {
      setForm(prev => ({
        ...prev,
        utility_id: utilityId,
        usage_unit: utility.unit_of_measurement || prev.usage_unit
      }))
    }
  }

  const calculateTotal = () => {
    const amount = parseFloat(form.amount) || 0
    const lateFee = parseFloat(form.late_fee) || 0
    const total = amount + lateFee
    setForm(prev => ({ ...prev, total_amount: total.toString() }))
  }

  useEffect(() => {
    calculateTotal()
  }, [form.amount, form.late_fee])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.utility_id || !form.unit_id || !form.property_id || !form.amount || !form.total_amount) {
      setError('Please fill in all required fields.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const billData = {
        ...form,
        amount: parseFloat(form.amount),
        total_amount: parseFloat(form.total_amount),
        usage_amount: form.usage_amount ? parseFloat(form.usage_amount) : undefined,
        rate_per_unit: form.rate_per_unit ? parseFloat(form.rate_per_unit) : undefined,
        base_charges: form.base_charges ? parseFloat(form.base_charges) : undefined,
        late_fee: form.late_fee ? parseFloat(form.late_fee) : undefined,
        meter_reading_previous: form.meter_reading_previous ? parseFloat(form.meter_reading_previous) : undefined,
        meter_reading_current: form.meter_reading_current ? parseFloat(form.meter_reading_current) : undefined,
        tenant_id: form.tenant_id || undefined
      }

      await utilityBills.create(billData)
      setSuccess(true)
      
      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/utilities')
      }, 2000)
    } catch (err) {
      setError('Failed to create utility bill. Please try again.')
      console.error('Error creating utility bill:', err)
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
            <h2 className="text-2xl font-bold text-gray-900">Add New Utility Bill</h2>
            <p className="mt-1 text-sm text-gray-500">
              Create a new utility bill for a unit
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
                    <p>Utility bill has been created successfully. Redirecting...</p>
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
                  Bill Information
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

                  {/* Utility Selection */}
                  <div className="sm:col-span-2">
                    <label htmlFor="utility_id" className="block text-sm font-medium text-gray-700">
                      Utility <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="utility_id"
                      value={form.utility_id}
                      onChange={(e) => handleUtilityChange(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                      disabled={!form.unit_id}
                    >
                      <option value="">Select a utility</option>
                      {utilitiesList
                        .filter(u => u.unit_id === form.unit_id)
                        .map((utility) => (
                          <option key={utility.id} value={utility.id}>
                            {utility.utility_name} ({utility.utility_type})
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

                  {/* Billing Period */}
                  <div>
                    <label htmlFor="billing_period_start" className="block text-sm font-medium text-gray-700">
                      Billing Period Start <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="billing_period_start"
                      value={form.billing_period_start}
                      onChange={(e) => setForm(prev => ({ ...prev, billing_period_start: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="billing_period_end" className="block text-sm font-medium text-gray-700">
                      Billing Period End <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="billing_period_end"
                      value={form.billing_period_end}
                      onChange={(e) => setForm(prev => ({ ...prev, billing_period_end: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  {/* Due Date */}
                  <div>
                    <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="due_date"
                      value={form.due_date}
                      onChange={(e) => setForm(prev => ({ ...prev, due_date: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  {/* Invoice Number */}
                  <div>
                    <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      id="invoice_number"
                      value={form.invoice_number}
                      onChange={(e) => setForm(prev => ({ ...prev, invoice_number: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Utility company invoice number"
                    />
                  </div>

                  {/* Usage Amount */}
                  <div>
                    <label htmlFor="usage_amount" className="block text-sm font-medium text-gray-700">
                      Usage Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="usage_amount"
                      value={form.usage_amount}
                      onChange={(e) => setForm(prev => ({ ...prev, usage_amount: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Usage Unit */}
                  <div>
                    <label htmlFor="usage_unit" className="block text-sm font-medium text-gray-700">
                      Usage Unit
                    </label>
                    <input
                      type="text"
                      id="usage_unit"
                      value={form.usage_unit}
                      onChange={(e) => setForm(prev => ({ ...prev, usage_unit: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="kWh, gallons, etc."
                    />
                  </div>

                  {/* Rate Per Unit */}
                  <div>
                    <label htmlFor="rate_per_unit" className="block text-sm font-medium text-gray-700">
                      Rate Per Unit
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        id="rate_per_unit"
                        value={form.rate_per_unit}
                        onChange={(e) => setForm(prev => ({ ...prev, rate_per_unit: e.target.value }))}
                        className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Base Charges */}
                  <div>
                    <label htmlFor="base_charges" className="block text-sm font-medium text-gray-700">
                      Base Charges
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        id="base_charges"
                        value={form.base_charges}
                        onChange={(e) => setForm(prev => ({ ...prev, base_charges: e.target.value }))}
                        className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Bill Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        id="amount"
                        value={form.amount}
                        onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  {/* Late Fee */}
                  <div>
                    <label htmlFor="late_fee" className="block text-sm font-medium text-gray-700">
                      Late Fee
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        id="late_fee"
                        value={form.late_fee}
                        onChange={(e) => setForm(prev => ({ ...prev, late_fee: e.target.value }))}
                        className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Total Amount (Read-only) */}
                  <div>
                    <label htmlFor="total_amount" className="block text-sm font-medium text-gray-700">
                      Total Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        id="total_amount"
                        value={form.total_amount}
                        readOnly
                        className="block w-full pl-7 pr-12 border-gray-300 rounded-md bg-gray-50 text-gray-500 sm:text-sm"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  {/* Meter Readings */}
                  <div>
                    <label htmlFor="meter_reading_previous" className="block text-sm font-medium text-gray-700">
                      Previous Meter Reading
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="meter_reading_previous"
                      value={form.meter_reading_previous}
                      onChange={(e) => setForm(prev => ({ ...prev, meter_reading_previous: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label htmlFor="meter_reading_current" className="block text-sm font-medium text-gray-700">
                      Current Meter Reading
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="meter_reading_current"
                      value={form.meter_reading_current}
                      onChange={(e) => setForm(prev => ({ ...prev, meter_reading_current: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="0.00"
                    />
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
                      placeholder="Additional notes about this utility bill..."
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
                {isSubmitting ? 'Creating...' : 'Create Bill'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

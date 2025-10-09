'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardNav from '@/app/components/DashboardNav'
import { utilityBills, utilities, tenants } from '@/lib/supabase-utils'
import { useAuth } from '@/lib/auth-context'
import { 
  ArrowLeftIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface UtilityBillFormData {
  utility_id: string
  unit_id: string
  property_id: string
  tenant_id: string
  billing_period_start: string
  billing_period_end: string
  due_date: string
  amount: number | ''
  usage_amount: number | ''
  usage_unit: string
  rate_per_unit: number | ''
  base_charges: number | ''
  late_fee: number | ''
  total_amount: number | ''
  invoice_number: string
  meter_reading_previous: number | ''
  meter_reading_current: number | ''
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  notes: string
}

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'OVERDUE', label: 'Overdue' },
  { value: 'CANCELLED', label: 'Cancelled' }
]

export default function EditUtilityBillPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const params = useParams()
  const billId = params.id as string

  const [form, setForm] = useState<UtilityBillFormData>({
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
    status: 'PENDING',
    notes: ''
  })

  const [utilitiesList, setUtilitiesList] = useState<any[]>([])
  const [tenantsList, setTenantsList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && billId) {
      fetchData()
    }
  }, [user, billId])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError('')

      // Fetch the bill data
      const bill = await utilityBills.getById(billId)
      
      // Set form data
      setForm({
        utility_id: bill.utility_id,
        unit_id: bill.unit_id,
        property_id: bill.property_id,
        tenant_id: bill.tenant_id || '',
        billing_period_start: bill.billing_period_start,
        billing_period_end: bill.billing_period_end,
        due_date: bill.due_date,
        amount: bill.amount,
        usage_amount: bill.usage_amount || '',
        usage_unit: bill.usage_unit || '',
        rate_per_unit: bill.rate_per_unit || '',
        base_charges: bill.base_charges || '',
        late_fee: bill.late_fee || '',
        total_amount: bill.total_amount,
        invoice_number: bill.invoice_number || '',
        meter_reading_previous: bill.meter_reading_previous || '',
        meter_reading_current: bill.meter_reading_current || '',
        status: bill.status,
        notes: bill.notes || ''
      })

      // Fetch utilities and tenants for dropdowns
      const [utilitiesData, tenantsData] = await Promise.all([
        utilities.getAll(),
        tenants.getAll()
      ])
      
      setUtilitiesList(utilitiesData || [])
      setTenantsList(tenantsData || [])

    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load utility bill data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.utility_id || !form.unit_id || !form.property_id) {
      setError('Please fill in all required fields.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const billData = {
        utility_id: form.utility_id,
        unit_id: form.unit_id,
        property_id: form.property_id,
        tenant_id: form.tenant_id || null,
        billing_period_start: form.billing_period_start,
        billing_period_end: form.billing_period_end,
        due_date: form.due_date,
        amount: Number(form.amount),
        usage_amount: form.usage_amount ? Number(form.usage_amount) : null,
        usage_unit: form.usage_unit || null,
        rate_per_unit: form.rate_per_unit ? Number(form.rate_per_unit) : null,
        base_charges: form.base_charges ? Number(form.base_charges) : null,
        late_fee: form.late_fee ? Number(form.late_fee) : null,
        total_amount: Number(form.total_amount),
        invoice_number: form.invoice_number || null,
        meter_reading_previous: form.meter_reading_previous ? Number(form.meter_reading_previous) : null,
        meter_reading_current: form.meter_reading_current ? Number(form.meter_reading_current) : null,
        status: form.status,
        notes: form.notes || null
      }

      await utilityBills.update(billId, billData)
      setSuccess(true)
      
      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/utilities')
      }, 2000)
    } catch (err) {
      setError('Failed to update utility bill. Please try again.')
      console.error('Error updating utility bill:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof UtilityBillFormData, value: string | number) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateTotal = () => {
    const amount = Number(form.amount) || 0
    const lateFee = Number(form.late_fee) || 0
    const total = amount + lateFee
    setForm(prev => ({ ...prev, total_amount: total }))
  }

  // Auto-calculate total when amount or late_fee changes
  useEffect(() => {
    calculateTotal()
  }, [form.amount, form.late_fee])

  if (loading || isLoading) {
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
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
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
            <h2 className="text-2xl font-bold text-gray-900">Edit Utility Bill</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update utility bill information
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
                    <p>Utility bill has been updated successfully. Redirecting...</p>
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
                  <CurrencyDollarIcon className="h-5 w-5 inline mr-2" />
                  Bill Information
                </h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Utility Selection */}
                  <div className="sm:col-span-2">
                    <label htmlFor="utility_id" className="block text-sm font-medium text-gray-700">
                      Utility <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="utility_id"
                      value={form.utility_id}
                      onChange={(e) => handleInputChange('utility_id', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    >
                      <option value="">Select a utility</option>
                      {utilitiesList.map((utility) => (
                        <option key={utility.id} value={utility.id}>
                          {utility.utility_name} - {utility.unit?.property?.name} Unit {utility.unit?.unit_number}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tenant Selection */}
                  <div className="sm:col-span-2">
                    <label htmlFor="tenant_id" className="block text-sm font-medium text-gray-700">
                      Tenant
                    </label>
                    <select
                      id="tenant_id"
                      value={form.tenant_id}
                      onChange={(e) => handleInputChange('tenant_id', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="">No tenant assigned</option>
                      {tenantsList.map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>
                          {tenant.first_name} {tenant.last_name} - {tenant.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Billing Period Start */}
                  <div>
                    <label htmlFor="billing_period_start" className="block text-sm font-medium text-gray-700">
                      Billing Period Start <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="billing_period_start"
                      value={form.billing_period_start}
                      onChange={(e) => handleInputChange('billing_period_start', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  {/* Billing Period End */}
                  <div>
                    <label htmlFor="billing_period_end" className="block text-sm font-medium text-gray-700">
                      Billing Period End <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="billing_period_end"
                      value={form.billing_period_end}
                      onChange={(e) => handleInputChange('billing_period_end', e.target.value)}
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
                      onChange={(e) => handleInputChange('due_date', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="status"
                      value={form.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Base Amount */}
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Base Amount <span className="text-red-500">*</span>
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
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="0.00"
                        required
                      />
                    </div>
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
                      onChange={(e) => handleInputChange('usage_amount', e.target.value)}
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
                      onChange={(e) => handleInputChange('usage_unit', e.target.value)}
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
                        onChange={(e) => handleInputChange('rate_per_unit', e.target.value)}
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
                        onChange={(e) => handleInputChange('base_charges', e.target.value)}
                        className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="0.00"
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
                        onChange={(e) => handleInputChange('late_fee', e.target.value)}
                        className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Total Amount */}
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
                        onChange={(e) => handleInputChange('total_amount', e.target.value)}
                        className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="0.00"
                        required
                      />
                    </div>
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
                      onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Invoice number"
                    />
                  </div>

                  {/* Meter Reading Previous */}
                  <div>
                    <label htmlFor="meter_reading_previous" className="block text-sm font-medium text-gray-700">
                      Previous Meter Reading
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="meter_reading_previous"
                      value={form.meter_reading_previous}
                      onChange={(e) => handleInputChange('meter_reading_previous', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Meter Reading Current */}
                  <div>
                    <label htmlFor="meter_reading_current" className="block text-sm font-medium text-gray-700">
                      Current Meter Reading
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="meter_reading_current"
                      value={form.meter_reading_current}
                      onChange={(e) => handleInputChange('meter_reading_current', e.target.value)}
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
                      onChange={(e) => handleInputChange('notes', e.target.value)}
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
                {isSubmitting ? 'Updating...' : 'Update Bill'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

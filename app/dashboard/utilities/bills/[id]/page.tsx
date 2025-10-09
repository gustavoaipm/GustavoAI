'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import DashboardNav from '@/app/components/DashboardNav'
import { utilityBills } from '@/lib/supabase-utils'
import { useAuth } from '@/lib/auth-context'
import { 
  ArrowLeftIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

const STATUS_LABELS = {
  PENDING: 'Pending',
  PAID: 'Paid',
  OVERDUE: 'Overdue',
  CANCELLED: 'Cancelled'
}

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800'
}

export default function UtilityBillDetailPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const params = useParams()
  const billId = params.id as string

  const [bill, setBill] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && billId) {
      fetchBill()
    }
  }, [user, billId])

  const fetchBill = async () => {
    try {
      setIsLoading(true)
      setError('')
      const billData = await utilityBills.getById(billId)
      setBill(billData)
    } catch (err) {
      console.error('Error fetching bill:', err)
      setError('Failed to load utility bill data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this utility bill? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      await utilityBills.delete(billId)
      router.push('/dashboard/utilities')
    } catch (err) {
      setError('Failed to delete utility bill. Please try again.')
      console.error('Error deleting bill:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const isOverdue = (dueDate: string, status: string) => {
    return status === 'PENDING' && new Date(dueDate) < new Date()
  }

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="rounded-md bg-red-50 p-4">
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
        </div>
      </div>
    )
  }

  if (!bill) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-sm font-medium text-gray-900">Bill not found</h3>
            <p className="mt-1 text-sm text-gray-500">The utility bill you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  const daysUntilDue = getDaysUntilDue(bill.due_date)
  const overdue = isOverdue(bill.due_date, bill.status)

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
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Utility Bill Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {bill.utility?.utility_name} - {bill.unit?.property?.name} Unit {bill.unit?.unit_number}
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                <Link
                  href={`/dashboard/utilities/bills/${bill.id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PencilIcon className="-ml-1 mr-2 h-5 w-5" />
                  Edit Bill
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Bill Information */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    <BoltIcon className="h-5 w-5 inline mr-2" />
                    Bill Information
                  </h3>
                  
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Utility</dt>
                      <dd className="mt-1 text-sm text-gray-900">{bill.utility?.utility_name}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Property & Unit</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {bill.unit?.property?.name} - Unit {bill.unit?.unit_number}
                      </dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Billing Period</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(bill.billing_period_start)} - {formatDate(bill.billing_period_end)}
                      </dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(bill.due_date)}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Provider</dt>
                      <dd className="mt-1 text-sm text-gray-900">{bill.utility?.provider_name || 'N/A'}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[bill.status as keyof typeof STATUS_COLORS]}`}>
                          {STATUS_LABELS[bill.status as keyof typeof STATUS_LABELS]}
                        </span>
                        {overdue && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                            Overdue
                          </span>
                        )}
                        {!overdue && bill.status === 'PENDING' && daysUntilDue <= 3 && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            Due Soon
                          </span>
                        )}
                      </dd>
                    </div>
                    
                    {bill.tenant && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Tenant</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {bill.tenant.first_name} {bill.tenant.last_name}
                        </dd>
                      </div>
                    )}
                    
                    {bill.invoice_number && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Invoice Number</dt>
                        <dd className="mt-1 text-sm text-gray-900">{bill.invoice_number}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Usage Information */}
              {(bill.usage_amount || bill.meter_reading_previous || bill.meter_reading_current) && (
                <div className="mt-6 bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Usage Information
                    </h3>
                    
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      {bill.usage_amount && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Usage Amount</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {bill.usage_amount} {bill.usage_unit || bill.utility?.unit_of_measurement || 'units'}
                          </dd>
                        </div>
                      )}
                      
                      {bill.rate_per_unit && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Rate Per Unit</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formatCurrency(bill.rate_per_unit)}/{bill.usage_unit || bill.utility?.unit_of_measurement || 'unit'}
                          </dd>
                        </div>
                      )}
                      
                      {bill.meter_reading_previous && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Previous Meter Reading</dt>
                          <dd className="mt-1 text-sm text-gray-900">{bill.meter_reading_previous}</dd>
                        </div>
                      )}
                      
                      {bill.meter_reading_current && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Current Meter Reading</dt>
                          <dd className="mt-1 text-sm text-gray-900">{bill.meter_reading_current}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              )}

              {/* Notes */}
              {bill.notes && (
                <div className="mt-6 bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Notes
                    </h3>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{bill.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    <CurrencyDollarIcon className="h-5 w-5 inline mr-2" />
                    Payment Summary
                  </h3>
                  
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Base Amount</dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">
                        {formatCurrency(bill.amount)}
                      </dd>
                    </div>
                    
                    {bill.base_charges && bill.base_charges > 0 && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Base Charges</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatCurrency(bill.base_charges)}
                        </dd>
                      </div>
                    )}
                    
                    {bill.late_fee && bill.late_fee > 0 && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Late Fee</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatCurrency(bill.late_fee)}
                        </dd>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-4">
                      <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                      <dd className="mt-1 text-2xl font-bold text-gray-900">
                        {formatCurrency(bill.total_amount)}
                      </dd>
                    </div>
                    
                    {bill.status === 'PAID' && bill.paid_date && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Paid Date</dt>
                        <dd className="mt-1 text-sm text-green-600 flex items-center">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          {formatDate(bill.paid_date)}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import DashboardNav from '@/app/components/DashboardNav'
import { utilities } from '@/lib/supabase-utils'
import { useAuth } from '@/lib/auth-context'
import { 
  ArrowLeftIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
  HomeIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

const UTILITY_TYPE_LABELS = {
  ELECTRIC: 'Electricity',
  WATER: 'Water',
  GAS: 'Gas',
  SEWER: 'Sewer',
  TRASH: 'Trash',
  INTERNET: 'Internet',
  CABLE: 'Cable',
  OTHER: 'Other'
}

const BILLING_FREQUENCY_LABELS = {
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  ANNUALLY: 'Annually'
}

export default function UtilityDetailPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const params = useParams()
  const utilityId = params.id as string

  const [utility, setUtility] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && utilityId) {
      fetchUtility()
    }
  }, [user, utilityId])

  const fetchUtility = async () => {
    try {
      setIsLoading(true)
      setError('')
      const utilityData = await utilities.getById(utilityId)
      setUtility(utilityData)
    } catch (err) {
      console.error('Error fetching utility:', err)
      setError('Failed to load utility data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this utility? This action cannot be undone and will also delete all associated utility bills.')) {
      return
    }

    try {
      setIsDeleting(true)
      await utilities.delete(utilityId)
      router.push('/dashboard/utilities')
    } catch (err) {
      setError('Failed to delete utility. Please try again.')
      console.error('Error deleting utility:', err)
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

  if (!utility) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-sm font-medium text-gray-900">Utility not found</h3>
            <p className="mt-1 text-sm text-gray-500">The utility you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
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
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  {utility.utility_name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {utility.unit?.property?.name} - Unit {utility.unit?.unit_number}
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                <Link
                  href={`/dashboard/utilities/${utility.id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PencilIcon className="-ml-1 mr-2 h-5 w-5" />
                  Edit Utility
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
            {/* Main Utility Information */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    <BoltIcon className="h-5 w-5 inline mr-2" />
                    Utility Information
                  </h3>
                  
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Utility Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{utility.utility_name}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Type</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {UTILITY_TYPE_LABELS[utility.utility_type as keyof typeof UTILITY_TYPE_LABELS]}
                      </dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Property & Unit</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <div className="flex items-center">
                          <HomeIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {utility.unit?.property?.name} - Unit {utility.unit?.unit_number}
                        </div>
                      </dd>
                    </div>
                    
                    {utility.tenant && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Tenant</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {utility.tenant.first_name} {utility.tenant.last_name}
                          </div>
                        </dd>
                      </div>
                    )}
                    
                    {utility.provider_name && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Provider</dt>
                        <dd className="mt-1 text-sm text-gray-900">{utility.provider_name}</dd>
                      </div>
                    )}
                    
                    {utility.account_number && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Account Number</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-mono">{utility.account_number}</dd>
                      </div>
                    )}
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Billing Frequency</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {utility.billing_frequency ? 
                          BILLING_FREQUENCY_LABELS[utility.billing_frequency as keyof typeof BILLING_FREQUENCY_LABELS] : 
                          'Not specified'
                        }
                      </dd>
                    </div>
                    
                    {utility.unit_of_measurement && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Unit of Measurement</dt>
                        <dd className="mt-1 text-sm text-gray-900">{utility.unit_of_measurement}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Billing Information */}
              {(utility.base_rate || utility.late_fee_percentage || utility.grace_period_days) && (
                <div className="mt-6 bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Billing Information
                    </h3>
                    
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      {utility.base_rate && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Base Rate</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formatCurrency(utility.base_rate)}
                            {utility.unit_of_measurement && ` / ${utility.unit_of_measurement}`}
                          </dd>
                        </div>
                      )}
                      
                      {utility.late_fee_percentage && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Late Fee Percentage</dt>
                          <dd className="mt-1 text-sm text-gray-900">{utility.late_fee_percentage}%</dd>
                        </div>
                      )}
                      
                      {utility.grace_period_days && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Grace Period</dt>
                          <dd className="mt-1 text-sm text-gray-900">{utility.grace_period_days} days</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              )}

              {/* Notes */}
              {utility.notes && (
                <div className="mt-6 bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Notes
                    </h3>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{utility.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Status and Settings */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Status & Settings
                  </h3>
                  
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          utility.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {utility.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Included in Rent</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          utility.is_included_in_rent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {utility.is_included_in_rent ? 'Yes' : 'No'}
                        </span>
                      </dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Separate Meter</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          utility.is_submetered ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {utility.is_submetered ? 'Yes' : 'No'}
                        </span>
                      </dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(utility.created_at).toLocaleDateString()}
                      </dd>
                    </div>
                    
                    {utility.updated_at && utility.updated_at !== utility.created_at && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(utility.updated_at).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  
                  <div className="space-y-3">
                    <Link
                      href={`/dashboard/utilities/bills/new?utility_id=${utility.id}`}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Create New Bill
                    </Link>
                    
                    <Link
                      href={`/dashboard/utilities?filter=unit&value=${utility.unit_id}`}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      View All Bills
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

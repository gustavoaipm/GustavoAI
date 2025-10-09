'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DashboardNav from '@/app/components/DashboardNav'
import { utilities, utilityBills } from '@/lib/supabase-utils'
import { useAuth } from '@/lib/auth-context'
import { 
  PlusIcon, 
  BoltIcon, 
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface Utility {
  id: string
  utility_name: string
  utility_type: string
  provider_name: string | null
  account_number: string | null
  is_included_in_rent: boolean | null
  is_submetered: boolean | null
  billing_frequency: string | null
  base_rate: number | null
  unit_of_measurement: string | null
  late_fee_percentage: number | null
  grace_period_days: number | null
  is_active: boolean | null
  unit: {
    id: string
    unit_number: string
    property: {
      id: string
      name: string
      address: string
    }
  }
  tenant: {
    id: string
    first_name: string
    last_name: string
    email: string
  } | null
}

interface UtilityBill {
  id: string
  billing_period_start: string
  billing_period_end: string
  due_date: string
  amount: number
  total_amount: number
  status: string
  usage_amount: number | null
  usage_unit: string | null
  rate_per_unit: number | null
  utility: {
    id: string
    utility_name: string
    utility_type: string
    provider_name: string | null
    unit_of_measurement: string | null
  }
  unit: {
    id: string
    unit_number: string
    property: {
      id: string
      name: string
      address: string
    }
  }
  tenant: {
    id: string
    first_name: string
    last_name: string
    email: string
  } | null
}

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

export default function UtilitiesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [utilitiesList, setUtilitiesList] = useState<Utility[]>([])
  const [utilityBillsList, setUtilityBillsList] = useState<UtilityBill[]>([])
  const [activeTab, setActiveTab] = useState<'utilities' | 'bills'>('utilities')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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
      setIsLoading(true)
      setError('') // Clear any previous errors
      const [utilitiesData, billsData] = await Promise.all([
        utilities.getAll(),
        utilityBills.getAll()
      ])
      setUtilitiesList(utilitiesData || [])
      setUtilityBillsList(billsData || [])
    } catch (err) {
      // Only show error for actual connection/database issues
      console.error('Error fetching utilities:', err)
      if (err instanceof Error && (
        err.message.includes('network') || 
        err.message.includes('connection') || 
        err.message.includes('timeout') ||
        err.message.includes('unauthorized') ||
        err.message.includes('permission')
      )) {
        setError('Failed to load utilities data. Please check your connection and try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUtility = async (id: string) => {
    if (!confirm('Are you sure you want to delete this utility?')) return
    
    try {
      await utilities.delete(id)
      await fetchData()
    } catch (err) {
      setError('Failed to delete utility')
      console.error('Error deleting utility:', err)
    }
  }

  const handleDeleteBill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this utility bill?')) return
    
    try {
      await utilityBills.delete(id)
      await fetchData()
    } catch (err) {
      setError('Failed to delete utility bill')
      console.error('Error deleting bill:', err)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Utilities Management
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage utility services and bills for your properties
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link
                href="/dashboard/utilities/new"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add Utility
              </Link>
              <Link
                href="/dashboard/utilities/bills/new"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add Bill
              </Link>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
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

          {/* Tabs */}
          <div className="mt-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('utilities')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'utilities'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <BoltIcon className="h-5 w-5 inline mr-2" />
                  Utilities ({utilitiesList.length})
                </button>
                <button
                  onClick={() => setActiveTab('bills')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'bills'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <CurrencyDollarIcon className="h-5 w-5 inline mr-2" />
                  Bills ({utilityBillsList.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Utilities Tab */}
          {activeTab === 'utilities' && (
            <div className="mt-6">
              {utilitiesList.length === 0 ? (
                <div className="text-center py-12">
                  <BoltIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No utilities</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding a new utility service.</p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/utilities/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      Add Utility
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {utilitiesList.map((utility) => (
                      <li key={utility.id}>
                        <div className="px-4 py-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <BoltIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {utility.utility_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {utility.unit.property.name} - Unit {utility.unit.unit_number}
                              </div>
                              <div className="text-sm text-gray-500">
                                Provider: {utility.provider_name || 'N/A'} • 
                                Type: {UTILITY_TYPE_LABELS[utility.utility_type as keyof typeof UTILITY_TYPE_LABELS]} • 
                                Frequency: {utility.billing_frequency ? BILLING_FREQUENCY_LABELS[utility.billing_frequency as keyof typeof BILLING_FREQUENCY_LABELS] : 'N/A'}
                              </div>
                              {utility.tenant && (
                                <div className="text-sm text-gray-500">
                                  Tenant: {utility.tenant.first_name} {utility.tenant.last_name}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/dashboard/utilities/${utility.id}`}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </Link>
                            <Link
                              href={`/dashboard/utilities/${utility.id}/edit`}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteUtility(utility.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Bills Tab */}
          {activeTab === 'bills' && (
            <div className="mt-6">
              {utilityBillsList.length === 0 ? (
                <div className="text-center py-12">
                  <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No utility bills</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding a new utility bill.</p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/utilities/bills/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      Add Bill
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {utilityBillsList.map((bill) => {
                      const daysUntilDue = getDaysUntilDue(bill.due_date)
                      const overdue = isOverdue(bill.due_date, bill.status)
                      
                      return (
                        <li key={bill.id}>
                          <div className="px-4 py-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <BoltIcon className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {bill.utility.utility_name} - {bill.unit.property.name} Unit {bill.unit.unit_number}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Period: {formatDate(bill.billing_period_start)} - {formatDate(bill.billing_period_end)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Provider: {bill.utility.provider_name || 'N/A'}
                                    {bill.usage_amount && (
                                      <> • Usage: {bill.usage_amount} {bill.usage_unit || bill.utility.unit_of_measurement}</>
                                    )}
                                    {bill.rate_per_unit && (
                                      <> • Rate: {formatCurrency(bill.rate_per_unit)}/{bill.usage_unit || bill.utility.unit_of_measurement}</>
                                    )}
                                  </div>
                                  {bill.tenant && (
                                    <div className="text-sm text-gray-500">
                                      Tenant: {bill.tenant.first_name} {bill.tenant.last_name}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <div className="text-lg font-medium text-gray-900">
                                    {formatCurrency(bill.total_amount)}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[bill.status as keyof typeof STATUS_COLORS]}`}>
                                      {STATUS_LABELS[bill.status as keyof typeof STATUS_LABELS]}
                                    </span>
                                    {overdue && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                                        Overdue
                                      </span>
                                    )}
                                    {!overdue && bill.status === 'PENDING' && daysUntilDue <= 3 && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        <ClockIcon className="h-3 w-3 mr-1" />
                                        Due Soon
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Due: {formatDate(bill.due_date)}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Link
                                    href={`/dashboard/utilities/bills/${bill.id}`}
                                    className="text-primary-600 hover:text-primary-900"
                                  >
                                    <EyeIcon className="h-5 w-5" />
                                  </Link>
                                  <Link
                                    href={`/dashboard/utilities/bills/${bill.id}/edit`}
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </Link>
                                  <button
                                    onClick={() => handleDeleteBill(bill.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DashboardNav from '@/app/components/DashboardNav'
import { utilities, utilityBills, payments } from '@/lib/supabase-utils'
import { useAuth } from '@/lib/auth-context'
import { 
  BoltIcon, 
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  CalendarIcon
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
  base_charges: number | null
  late_fee: number | null
  invoice_number: string | null
  meter_reading_previous: number | null
  meter_reading_current: number | null
  notes: string | null
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

export default function TenantUtilitiesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [utilitiesList, setUtilitiesList] = useState<Utility[]>([])
  const [utilityBillsList, setUtilityBillsList] = useState<UtilityBill[]>([])
  const [activeTab, setActiveTab] = useState<'utilities' | 'bills'>('bills')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === 'TENANT') {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError('') // Clear any previous errors
      
      // Get tenant's utilities and bills
      const tenantUtilities = await utilities.getByTenant(user?.id || '')
      const tenantBills = await utilityBills.getByTenant(user?.id || '')
      
      setUtilitiesList(tenantUtilities || [])
      setUtilityBillsList(tenantBills || [])
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

  const handlePayBill = async (billId: string) => {
    try {
      // Create a payment record for the utility bill
      const bill = utilityBillsList.find(b => b.id === billId)
      if (!bill) return

      const paymentData = {
        tenant_id: user?.id || '',
        unit_id: bill.unit.id,
        property_id: bill.unit.property.id,
        landlord_id: '', // Will need to get this from the bill or utility data
        amount: bill.total_amount,
        type: 'UTILITY_FEE' as const,
        status: 'PENDING' as const,
        due_date: bill.due_date,
        description: `${bill.utility.utility_name} bill for ${bill.billing_period_start} - ${bill.billing_period_end}`,
        late_fee: null,
        paid_date: null,
        stripe_payment_id: null
      }

      await payments.create(paymentData)
      
      // Update the bill status
      await utilityBills.update(billId, { 
        status: 'PAID',
        paid_date: new Date().toISOString().split('T')[0]
      })
      
      // Refresh data
      await fetchData()
    } catch (err) {
      setError('Failed to process payment')
      console.error('Error processing payment:', err)
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

  if (user?.role !== 'TENANT') {
    router.push('/dashboard')
    return null
  }

  const pendingBills = utilityBillsList.filter(bill => bill.status === 'PENDING')
  const overdueBills = pendingBills.filter(bill => isOverdue(bill.due_date, bill.status))

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                My Utilities
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View and pay your utility bills
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BoltIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Utilities
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {utilitiesList.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending Bills
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {pendingBills.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Overdue Bills
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {overdueBills.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 rounded-md bg-red-50 p-4">
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
                <button
                  onClick={() => setActiveTab('utilities')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'utilities'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <BoltIcon className="h-5 w-5 inline mr-2" />
                  My Utilities ({utilitiesList.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Bills Tab */}
          {activeTab === 'bills' && (
            <div className="mt-6">
              {utilityBillsList.length === 0 ? (
                <div className="text-center py-12">
                  <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No utility bills</h3>
                  <p className="mt-1 text-sm text-gray-500">You don't have any utility bills yet.</p>
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
                                    {bill.utility.utility_name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {bill.unit.property.name} - Unit {bill.unit.unit_number}
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
                                  {bill.invoice_number && (
                                    <div className="text-sm text-gray-500">
                                      Invoice: {bill.invoice_number}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <div className="text-lg font-medium text-gray-900">
                                    {formatCurrency(bill.total_amount)}
                                  </div>
                                  {bill.amount !== bill.total_amount && (
                                    <div className="text-sm text-gray-500">
                                      Base: {formatCurrency(bill.amount)}
                                      {bill.late_fee && bill.late_fee > 0 && (
                                        <> + Late Fee: {formatCurrency(bill.late_fee)}</>
                                      )}
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-2 mt-1">
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
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <CalendarIcon className="h-3 w-3 mr-1" />
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
                                  {bill.status === 'PENDING' && (
                                    <button
                                      onClick={() => handlePayBill(bill.id)}
                                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                      Pay Now
                                    </button>
                                  )}
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

          {/* Utilities Tab */}
          {activeTab === 'utilities' && (
            <div className="mt-6">
              {utilitiesList.length === 0 ? (
                <div className="text-center py-12">
                  <BoltIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No utilities</h3>
                  <p className="mt-1 text-sm text-gray-500">No utility services are configured for your unit.</p>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {utilitiesList.map((utility) => (
                      <li key={utility.id}>
                        <div className="px-4 py-4">
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
                                Type: {UTILITY_TYPE_LABELS[utility.utility_type as keyof typeof UTILITY_TYPE_LABELS]}
                                {utility.is_included_in_rent && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Included in Rent
                                  </span>
                                )}
                              </div>
                              {utility.account_number && (
                                <div className="text-sm text-gray-500">
                                  Account: {utility.account_number}
                                </div>
                              )}
                              {utility.base_rate && (
                                <div className="text-sm text-gray-500">
                                  Base Rate: {formatCurrency(utility.base_rate)}/{utility.unit_of_measurement || 'unit'}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
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

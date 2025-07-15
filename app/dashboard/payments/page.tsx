'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PlusIcon, 
  CurrencyDollarIcon, 
  EyeIcon, 
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  UserIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/auth-context'
import DashboardNav from '@/app/components/DashboardNav'

interface Payment {
  id: string
  amount: number
  type: string
  status: string
  dueDate: string
  paidDate?: string
  lateFee: number
  description?: string
  tenant: {
    firstName: string
    lastName: string
  }
  property: {
    name: string
  }
}

export default function PaymentsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchPayments()
    }
  }, [user])

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'OVERDUE':
        return 'bg-red-100 text-red-800'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />
      case 'OVERDUE':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true
    return payment.status === filter.toUpperCase()
  })

  const totalCollected = payments
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalPending = payments
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalOverdue = payments
    .filter(p => p.status === 'OVERDUE')
    .reduce((sum, p) => sum + p.amount + p.lateFee, 0)

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
              <p className="mt-2 text-gray-600">Track rent collection and payment history</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/payments/new')}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Record Payment
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600">{formatCurrency(totalCollected)}</div>
            <div className="text-gray-600">Total Collected</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-600">{formatCurrency(totalPending)}</div>
            <div className="text-gray-600">Pending Payments</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-600">{formatCurrency(totalOverdue)}</div>
            <div className="text-gray-600">Overdue Amount</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600">{payments.length}</div>
            <div className="text-gray-600">Total Transactions</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['all', 'pending', 'paid', 'overdue'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === filterOption
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'No payment records yet. Start by recording your first payment.'
                : `No ${filter} payments found.`
              }
            </p>
            {filter === 'all' && (
              <button
                onClick={() => router.push('/dashboard/payments/new')}
                className="btn-primary"
              >
                Record First Payment
              </button>
            )}
          </div>
        ) : (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                              <UserIcon className="h-4 w-4 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.tenant.firstName} {payment.tenant.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.property.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </div>
                        {payment.lateFee > 0 && (
                          <div className="text-xs text-red-600">
                            +{formatCurrency(payment.lateFee)} late fee
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">
                          {payment.type.replace('_', ' ').toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatDate(payment.dueDate)}
                        </div>
                        {payment.paidDate && (
                          <div className="text-xs text-gray-500">
                            Paid: {formatDate(payment.paidDate)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(payment.status)}
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => router.push(`/dashboard/payments/${payment.id}`)}
                          className="btn-secondary text-xs"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
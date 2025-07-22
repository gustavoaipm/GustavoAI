'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { tenants } from '@/lib/supabase-utils'
import DashboardNav from '@/app/components/DashboardNav'
import { 
  UserGroupIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  HomeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Tenant {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  date_of_birth: string | null
  emergency_contact: string | null
  emergency_phone: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'EVICTED' | 'MOVED_OUT'
  lease_start: string
  lease_end: string
  rent_amount: number
  security_deposit: number
  unit_id: string
  landlord_id: string
  created_at: string
  updated_at: string
  unit: {
    id: string
    unit_number: string
    bedrooms: number
    bathrooms: number
    square_feet: number | null
    rent_amount: number
    status: string
    property: {
      id: string
      name: string
      address: string
      city: string
      state: string
      zip_code: string
    }
  }
  payments: Array<{
    id: string
    amount: number
    type: string
    status: string
    due_date: string
    paid_date: string | null
    description: string | null
  }>
}

export default function TenantDetailPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const tenantId = params.id as string
  
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user && tenantId) {
      fetchTenant()
    }
  }, [user, tenantId])

  const fetchTenant = async () => {
    try {
      const data = await tenants.getById(tenantId)
      setTenant(data)
    } catch (error) {
      console.error('Error fetching tenant:', error)
      router.push('/dashboard/tenants')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      await tenants.delete(tenantId)
      router.push('/dashboard/tenants')
    } catch (error) {
      console.error('Error deleting tenant:', error)
      alert('Failed to delete tenant. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800'
      case 'EVICTED':
        return 'bg-red-100 text-red-800'
      case 'MOVED_OUT':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getDaysUntilLeaseEnd = () => {
    if (!tenant) return 0
    const today = new Date()
    const leaseEnd = new Date(tenant.lease_end)
    const diffTime = leaseEnd.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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

  if (!tenant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tenant not found</h3>
            <p className="text-gray-600 mb-6">The tenant you're looking for doesn't exist or you don't have permission to view it.</p>
            <button
              onClick={() => router.push('/dashboard/tenants')}
              className="btn-primary"
            >
              Back to Tenants
            </button>
          </div>
        </div>
      </div>
    )
  }

  const daysUntilLeaseEnd = getDaysUntilLeaseEnd()
  const isLeaseExpiringSoon = daysUntilLeaseEnd <= 30 && daysUntilLeaseEnd > 0
  const isLeaseExpired = daysUntilLeaseEnd < 0

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard/tenants')}
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {tenant.first_name} {tenant.last_name}
                </h1>
                <p className="mt-2 text-gray-600">
                  {tenant.unit.property.name} - Unit {tenant.unit.unit_number}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push(`/dashboard/tenants/${tenantId}/edit`)}
                className="btn-secondary flex items-center"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn-outline text-red-600 hover:bg-red-50 flex items-center"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="card">
              <div className="flex items-center mb-6">
                <UserGroupIcon className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Full Name</h3>
                  <p className="text-gray-900">{tenant.first_name} {tenant.last_name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tenant.status)}`}>
                    {tenant.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
                  <div className="flex items-center text-gray-900">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    {tenant.email}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Phone</h3>
                  <div className="flex items-center text-gray-900">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    {tenant.phone}
                  </div>
                </div>

                {tenant.date_of_birth && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Date of Birth</h3>
                    <p className="text-gray-900">{formatDate(tenant.date_of_birth)}</p>
                  </div>
                )}

                {tenant.emergency_contact && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Emergency Contact</h3>
                    <p className="text-gray-900">{tenant.emergency_contact}</p>
                    {tenant.emergency_phone && (
                      <p className="text-gray-600 text-sm">{tenant.emergency_phone}</p>
                    )}
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
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Lease Period</h3>
                  <div className="flex items-center text-gray-900">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {formatDate(tenant.lease_start)} - {formatDate(tenant.lease_end)}
                  </div>
                  {isLeaseExpiringSoon && (
                    <p className="text-yellow-600 text-sm mt-1">
                      ⚠️ Lease expires in {daysUntilLeaseEnd} days
                    </p>
                  )}
                  {isLeaseExpired && (
                    <p className="text-red-600 text-sm mt-1">
                      ⚠️ Lease expired {Math.abs(daysUntilLeaseEnd)} days ago
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Rent</h3>
                  <div className="flex items-center text-gray-900">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    {formatCurrency(tenant.rent_amount)}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Security Deposit</h3>
                  <div className="flex items-center text-gray-900">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    {formatCurrency(tenant.security_deposit)}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
                  <p className="text-gray-900">{formatDate(tenant.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
                </div>
              </div>
              
              {tenant.payments && tenant.payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tenant.payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(payment.due_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(payment.status)}`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No payment history available</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Unit Information */}
            <div className="card">
              <div className="flex items-center mb-6">
                <HomeIcon className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Unit Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Property</h3>
                  <p className="text-gray-900">{tenant.unit.property.name}</p>
                  <p className="text-gray-600 text-sm">{tenant.unit.property.address}</p>
                  <p className="text-gray-600 text-sm">
                    {tenant.unit.property.city}, {tenant.unit.property.state} {tenant.unit.property.zip_code}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Unit</h3>
                  <p className="text-gray-900">Unit {tenant.unit.unit_number}</p>
                  <p className="text-gray-600 text-sm">
                    {tenant.unit.bedrooms} bed, {tenant.unit.bathrooms} bath
                    {tenant.unit.square_feet && ` • ${tenant.unit.square_feet} sq ft`}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Unit Status</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    tenant.unit.status === 'OCCUPIED' ? 'bg-blue-100 text-blue-800' :
                    tenant.unit.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tenant.unit.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Unit Rent</h3>
                  <p className="text-gray-900">{formatCurrency(tenant.unit.rent_amount)}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Payments</span>
                  <span className="font-medium">{tenant.payments?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Paid Payments</span>
                  <span className="font-medium text-green-600">
                    {tenant.payments?.filter(p => p.status === 'PAID').length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending Payments</span>
                  <span className="font-medium text-yellow-600">
                    {tenant.payments?.filter(p => p.status === 'PENDING').length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Overdue Payments</span>
                  <span className="font-medium text-red-600">
                    {tenant.payments?.filter(p => p.status === 'OVERDUE').length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
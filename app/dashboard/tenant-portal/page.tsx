'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { auth } from '@/lib/supabase-utils'
import DashboardNav from '@/app/components/DashboardNav'
import { notifications } from '@/lib/notification-utils'
import { 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  CreditCardIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface TenantData {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  date_of_birth: string
  emergency_contact: string
  emergency_phone: string
  status: string
  lease_start: string
  lease_end: string
  rent_amount: number
  security_deposit: number
  unit: {
    id: string
    unit_number: string
    bedrooms: number
    bathrooms: number
    square_feet: number
    rent_amount: number
    property: {
      id: string
      name: string
      address: string
      city: string
      state: string
      zip_code: string
    }
  } | null
  property: {
    id: string
    name: string
    address: string
    city: string
    state: string
    zip_code: string
  } | null
  landlord: {
    first_name: string
    last_name: string
    email: string
    phone: string
  }
}

export default function TenantPortalPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [tenantData, setTenantData] = useState<TenantData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect non-tenants to appropriate portal
    if (user && user.role !== 'TENANT') {
      if (user.role === 'LANDLORD' || user.role === 'ADMIN') {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
      return
    }

    if (user && user.role === 'TENANT') {
      fetchTenantData()
    }
  }, [user, router])

  const fetchTenantData = async () => {
    try {
      const data = await auth.getCurrentTenantData()
      console.log('Tenant data fetched:', data)
      console.log('Property data:', data?.property)
      console.log('Unit data:', data?.unit)
      console.log('Landlord data:', data?.landlord)
      setTenantData(data)
    } catch (error) {
      console.error('Error fetching tenant data:', error)
      notifications.genericError('fetching tenant data')
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tenant portal...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  // Don't render tenant portal for non-tenants
  if (user.role !== 'TENANT') {
    return null
  }

  if (!tenantData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              This portal is only available to tenants. Please contact your property manager if you believe this is an error.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tenant Portal</h1>
              <p className="mt-2 text-gray-600">Welcome back, {tenantData.first_name}!</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {tenantData.unit ? `Unit ${tenantData.unit.unit_number}` : 'Entire Property'}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {tenantData.unit?.property?.name || 'Property Information Unavailable'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property & Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Information */}
            <div className="card">
              <div className="flex items-center mb-4">
                <HomeIcon className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Property Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Property Name</p>
                  <p className="font-medium">
                    {tenantData.unit?.property?.name || tenantData.property?.name || 'Property Name Unavailable'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">
                    {tenantData.unit?.property?.address || tenantData.property?.address || 'Address Unavailable'}
                  </p>
                </div>
                {tenantData.unit ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Unit Number</p>
                      <p className="font-medium">{tenantData.unit.unit_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Unit Details</p>
                      <p className="font-medium">{tenantData.unit.bedrooms} bed, {tenantData.unit.bathrooms} bath</p>
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Assignment</p>
                    <p className="font-medium text-blue-600">Entire Property</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Monthly Rent</p>
                  <p className="font-medium">{formatCurrency(tenantData.rent_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Security Deposit</p>
                  <p className="font-medium">{formatCurrency(tenantData.security_deposit)}</p>
                </div>
              </div>
            </div>

            {/* Lease Information */}
            <div className="card">
              <div className="flex items-center mb-4">
                <CalendarIcon className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Lease Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Lease Start</p>
                  <p className="font-medium">{formatDate(tenantData.lease_start)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lease End</p>
                  <p className="font-medium">{formatDate(tenantData.lease_end)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    tenantData.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tenantData.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Landlord Information */}
            <div className="card">
              <div className="flex items-center mb-4">
                <UserIcon className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Property Manager</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{tenantData.landlord.first_name} {tenantData.landlord.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{tenantData.landlord.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{tenantData.landlord.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard/maintenance/new')}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
                  Submit Maintenance Request
                </button>
                <button
                  onClick={() => router.push('/dashboard/payments')}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <CreditCardIcon className="h-4 w-4 mr-2" />
                  View Payments
                </button>
                <button
                  onClick={() => router.push('/dashboard/maintenance')}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
                  View Maintenance History
                </button>
              </div>
            </div>

            {/* Personal Information */}
            <div className="card">
              <div className="flex items-center mb-4">
                <UserIcon className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{tenantData.first_name} {tenantData.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{tenantData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{tenantData.phone}</p>
                </div>
                {tenantData.emergency_contact && (
                  <div>
                    <p className="text-sm text-gray-600">Emergency Contact</p>
                    <p className="font-medium">{tenantData.emergency_contact}</p>
                    <p className="text-sm text-gray-500">{tenantData.emergency_phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
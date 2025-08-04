'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  HomeIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  BellIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/auth-context'
import DashboardNav from '@/app/components/DashboardNav'
import { properties, tenants, payments, maintenance } from '@/lib/supabase-utils'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [dashboardStats, setDashboardStats] = useState({
    propertiesCount: 0,
    activeTenantsCount: 0,
    monthlyRent: 0,
    pendingTasksCount: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Redirect tenants to their portal
  useEffect(() => {
    if (!loading && user && user.role === 'TENANT') {
      router.push('/dashboard/tenant-portal')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role !== 'TENANT') {
      fetchDashboardStats()
    }
  }, [user])

  // Refresh stats when component comes into focus (user navigates back)
  useEffect(() => {
    const handleFocus = () => {
      if (user && user.role !== 'TENANT') {
        fetchDashboardStats()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true)
      
      // Fetch all data in parallel
      const [propertiesData, tenantsData, paymentsData, maintenanceData] = await Promise.all([
        properties.getAll(),
        tenants.getAll(),
        payments.getAll(),
        maintenance.getAll()
      ])

      // Calculate properties count
      const propertiesCount = propertiesData?.length || 0

      // Calculate active tenants count
      const activeTenantsCount = tenantsData?.filter(tenant => tenant.status === 'ACTIVE').length || 0

      // Calculate actual monthly income (sum of paid payments from current month)
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      
      const monthlyRent = paymentsData
        ?.filter(payment => {
          if (payment.status !== 'PAID' || payment.type !== 'RENT') return false
          
          // Check if payment was made in current month
          const paymentDate = new Date(payment.paid_date || payment.created_at)
          return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
        })
        .reduce((total, payment) => total + parseFloat(payment.amount.toString()), 0) || 0

      // Calculate pending tasks (maintenance requests that are not completed)
      const pendingTasksCount = maintenanceData
        ?.filter(task => task.status !== 'COMPLETED' && task.status !== 'CANCELLED').length || 0

      setDashboardStats({
        propertiesCount,
        activeTenantsCount,
        monthlyRent,
        pendingTasksCount
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  // Don't render landlord dashboard for tenants
  if (user && user.role === 'TENANT') {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Management Dashboard</h1>
              <p className="mt-2 text-gray-600">Welcome back, {user.first_name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchDashboardStats}
                disabled={statsLoading}
                className="btn-secondary flex items-center"
              >
                <ArrowPathIcon className={`h-4 w-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <HomeIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : dashboardStats.propertiesCount}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Tenants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : dashboardStats.activeTenantsCount}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month's Income</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : `$${dashboardStats.monthlyRent.toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <WrenchScrewdriverIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : dashboardStats.pendingTasksCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/properties" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <HomeIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
                <p className="text-gray-600">Manage your properties and units</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/tenants" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Tenants</h3>
                <p className="text-gray-600">Manage tenant information and leases</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/payments" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Payments</h3>
                <p className="text-gray-600">Track rent payments and financials</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/maintenance" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <WrenchScrewdriverIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Maintenance</h3>
                <p className="text-gray-600">Handle maintenance requests</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/calendar" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Calendar</h3>
                <p className="text-gray-600">Schedule and view events</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/analytics" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                <p className="text-gray-600">View property performance metrics</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
} 
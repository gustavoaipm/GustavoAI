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

  useEffect(() => {
    if (user) {
      fetchDashboardStats()
    }
  }, [user])

  // Refresh stats when component comes into focus (user navigates back)
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
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


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const dashboardItems = [
    {
      title: 'Properties',
      description: 'Manage your properties',
      icon: HomeIcon,
      href: '/dashboard/properties',
      color: 'bg-blue-500',
    },
    {
      title: 'Tenants',
      description: 'View and manage tenants',
      icon: UserGroupIcon,
      href: '/dashboard/tenants',
      color: 'bg-green-500',
    },
    {
      title: 'Payments',
      description: 'Track rent and payments',
      icon: CurrencyDollarIcon,
      href: '/dashboard/payments',
      color: 'bg-yellow-500',
    },
    {
      title: 'Maintenance',
      description: 'Schedule and track maintenance',
      icon: WrenchScrewdriverIcon,
      href: '/dashboard/maintenance',
      color: 'bg-purple-500',
    },
    {
      title: 'Calendar',
      description: 'View scheduled events',
      icon: CalendarIcon,
      href: '/dashboard/calendar',
      color: 'bg-red-500',
    },
    {
      title: 'Notifications',
      description: 'View system notifications',
      icon: BellIcon,
      href: '/dashboard/notifications',
      color: 'bg-indigo-500',
    },
    {
      title: 'Analytics',
      description: 'View property analytics',
      icon: ChartBarIcon,
      href: '/dashboard/analytics',
      color: 'bg-pink-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to your property management dashboard. Here's what you can do:
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            Quick Overview
            <button
              onClick={fetchDashboardStats}
              disabled={statsLoading}
              className="ml-4 p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
              title="Refresh Stats"
            >
              <ArrowPathIcon className={`h-5 w-5 ${statsLoading ? 'animate-spin' : ''}`} />
            </button>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card text-center">
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-primary-600">{dashboardStats.propertiesCount}</div>
                  <div className="text-gray-600">Properties</div>
                </>
              )}
            </div>
            <div className="card text-center">
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-green-600">{dashboardStats.activeTenantsCount}</div>
                  <div className="text-gray-600">Active Tenants</div>
                </>
              )}
            </div>
            <div className="card text-center">
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-yellow-600">${dashboardStats.monthlyRent.toLocaleString()}</div>
                  <div className="text-gray-600">This Month's Income</div>
                </>
              )}
            </div>
            <div className="card text-center">
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-purple-600">{dashboardStats.pendingTasksCount}</div>
                  <div className="text-gray-600">Pending Tasks</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="card hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex items-center">
                <div className={`${item.color} p-3 rounded-lg mr-4`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                <div className="text-gray-400 group-hover:text-primary-600">
                  <ArrowRightOnRectangleIcon className="h-5 w-5 transform rotate-180" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 
'use client'

import { useEffect } from 'react'
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
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/auth-context'
import DashboardNav from '@/app/components/DashboardNav'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])



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

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary-600">0</div>
              <div className="text-gray-600">Properties</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600">0</div>
              <div className="text-gray-600">Active Tenants</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-yellow-600">$0</div>
              <div className="text-gray-600">Monthly Rent</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-purple-600">0</div>
              <div className="text-gray-600">Pending Tasks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
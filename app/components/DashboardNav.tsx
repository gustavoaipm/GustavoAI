'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  BuildingOfficeIcon,
  UserGroupIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  BellIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/auth-context'

export default function DashboardNav() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Different navigation items based on user role
  const getNavItems = () => {
    if (!user) return []

    if (user.role === 'TENANT') {
      return [
        {
          name: 'Tenant Portal',
          href: '/dashboard/tenant-portal',
          icon: HomeIcon,
        },
        {
          name: 'Maintenance',
          href: '/dashboard/maintenance',
          icon: WrenchScrewdriverIcon,
        },
        {
          name: 'Payments',
          href: '/dashboard/payments',
          icon: CurrencyDollarIcon,
        },
        {
          name: 'Utilities',
          href: '/dashboard/utilities/tenant',
          icon: BoltIcon,
        },
        {
          name: 'Calendar',
          href: '/dashboard/calendar',
          icon: CalendarIcon,
        },
      ]
    }

    // LANDLORD and ADMIN navigation
    return [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon,
      },
      {
        name: 'Properties',
        href: '/dashboard/properties',
        icon: BuildingOfficeIcon,
      },
      {
        name: 'Tenants',
        href: '/dashboard/tenants',
        icon: UserGroupIcon,
      },
      {
        name: 'Payments',
        href: '/dashboard/payments',
        icon: CurrencyDollarIcon,
      },
      {
        name: 'Utilities',
        href: '/dashboard/utilities',
        icon: BoltIcon,
      },
      {
        name: 'Maintenance',
        href: '/dashboard/maintenance',
        icon: WrenchScrewdriverIcon,
      },
      {
        name: 'Calendar',
        href: '/dashboard/calendar',
        icon: CalendarIcon,
      },
      {
        name: 'Notifications',
        href: '/dashboard/notifications',
        icon: BellIcon,
      },
      {
        name: 'Analytics',
        href: '/dashboard/analytics',
        icon: ChartBarIcon,
      },
    ]
  }

  const navItems = getNavItems()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link 
                href={user?.role === 'TENANT' ? '/dashboard/tenant-portal' : '/dashboard'} 
                className="text-2xl font-bold text-primary-600"
              >
                GustavoAI
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-gray-900">{user?.first_name}</span>
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {user?.role?.toLowerCase()}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 
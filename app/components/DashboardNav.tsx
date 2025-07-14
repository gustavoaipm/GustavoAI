'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Properties',
      href: '/dashboard/properties',
      icon: HomeIcon,
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

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
                GustavoAI
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-8">
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
            <div className="text-sm text-gray-700">
              Welcome, {user?.first_name} {user?.last_name}
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ChartBarIcon, 
  CurrencyDollarIcon,
  HomeIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/auth-context'

interface AnalyticsData {
  totalProperties: number
  occupiedProperties: number
  totalTenants: number
  activeTenants: number
  totalMonthlyRent: number
  collectedThisMonth: number
  pendingPayments: number
  overduePayments: number
  maintenanceRequests: number
  urgentMaintenance: number
  occupancyRate: number
  rentCollectionRate: number
  monthlyTrends: {
    month: string
    rentCollected: number
    rentDue: number
  }[]
  propertyPerformance: {
    propertyName: string
    rentAmount: number
    occupancyStatus: string
    maintenanceCount: number
  }[]
}

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user, timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics?days=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Mock data for development
      setAnalytics({
        totalProperties: 5,
        occupiedProperties: 4,
        totalTenants: 4,
        activeTenants: 4,
        totalMonthlyRent: 8500,
        collectedThisMonth: 7200,
        pendingPayments: 1300,
        overduePayments: 0,
        maintenanceRequests: 3,
        urgentMaintenance: 1,
        occupancyRate: 80,
        rentCollectionRate: 85,
        monthlyTrends: [
          { month: 'Jan', rentCollected: 8000, rentDue: 8500 },
          { month: 'Feb', rentCollected: 8200, rentDue: 8500 },
          { month: 'Mar', rentCollected: 7800, rentDue: 8500 },
          { month: 'Apr', rentCollected: 8500, rentDue: 8500 },
          { month: 'May', rentCollected: 7200, rentDue: 8500 },
        ],
        propertyPerformance: [
          { propertyName: 'Sunset Apartments', rentAmount: 2000, occupancyStatus: 'Occupied', maintenanceCount: 1 },
          { propertyName: 'Downtown Loft', rentAmount: 1800, occupancyStatus: 'Occupied', maintenanceCount: 0 },
          { propertyName: 'Garden Villa', rentAmount: 2200, occupancyStatus: 'Occupied', maintenanceCount: 2 },
          { propertyName: 'City View Condo', rentAmount: 1500, occupancyStatus: 'Available', maintenanceCount: 0 },
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value}%`
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data</h3>
          <p className="text-gray-600">Add some properties and data to see analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="mt-2 text-gray-600">Property performance insights and trends</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HomeIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Properties</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalProperties}</p>
                <p className="text-xs text-gray-500">{analytics.occupiedProperties} occupied</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tenants</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalTenants}</p>
                <p className="text-xs text-gray-500">{analytics.activeTenants} active</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Rent</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalMonthlyRent)}</p>
                <p className="text-xs text-gray-500">{formatCurrency(analytics.collectedThisMonth)} collected</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(analytics.occupancyRate)}</p>
                <p className="text-xs text-gray-500">{formatPercentage(analytics.rentCollectionRate)} collection rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Monthly Rent</span>
                <span className="font-semibold">{formatCurrency(analytics.totalMonthlyRent)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Collected This Month</span>
                <span className="font-semibold text-green-600">{formatCurrency(analytics.collectedThisMonth)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Payments</span>
                <span className="font-semibold text-yellow-600">{formatCurrency(analytics.pendingPayments)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Overdue Payments</span>
                <span className="font-semibold text-red-600">{formatCurrency(analytics.overduePayments)}</span>
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium">Collection Rate</span>
                <span className="font-semibold text-primary-600">{formatPercentage(analytics.rentCollectionRate)}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Requests</span>
                <span className="font-semibold">{analytics.maintenanceRequests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Urgent Requests</span>
                <span className="font-semibold text-red-600">{analytics.urgentMaintenance}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Regular Requests</span>
                <span className="font-semibold">{analytics.maintenanceRequests - analytics.urgentMaintenance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Property Performance */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Rent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Maintenance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.propertyPerformance.map((property, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{property.propertyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(property.rentAmount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        property.occupancyStatus === 'Occupied' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.occupancyStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.maintenanceCount} requests</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Rent Collection Trends</h3>
          <div className="grid grid-cols-5 gap-4">
            {analytics.monthlyTrends.map((trend, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium text-gray-900">{trend.month}</div>
                <div className="text-lg font-bold text-green-600">{formatCurrency(trend.rentCollected)}</div>
                <div className="text-xs text-gray-500">of {formatCurrency(trend.rentDue)}</div>
                <div className="mt-2">
                  {trend.rentCollected >= trend.rentDue ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mx-auto" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 
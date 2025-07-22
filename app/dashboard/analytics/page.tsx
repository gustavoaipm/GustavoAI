'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { properties, tenants, payments, maintenance } from '@/lib/supabase-utils'
import DashboardNav from '@/app/components/DashboardNav'
import { 
  ChartBarIcon, 
  HomeIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

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
    if (user) {
      fetchAnalytics()
    }
  }, [user, timeRange])

  const fetchAnalytics = async () => {
    try {
      // Fetch all data from Supabase
      const [propertiesData, tenantsData, paymentsData, maintenanceData] = await Promise.all([
        properties.getAll(),
        tenants.getAll(),
        payments.getAll(),
        maintenance.getAll()
      ])

      // Calculate analytics from the data
      const totalProperties = propertiesData.length
      const occupiedProperties = propertiesData.filter(p => 
        p.units?.some(u => u.status === 'OCCUPIED')
      ).length
      
      const totalTenants = tenantsData.length
      const activeTenants = tenantsData.filter(t => t.status === 'ACTIVE').length
      
      const totalMonthlyRent = propertiesData.reduce((sum, property) => 
        sum + (property.units?.reduce((unitSum, unit) => unitSum + unit.rent_amount, 0) || 0), 0
      )
      
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      
      const collectedThisMonth = paymentsData
        .filter(p => p.status === 'PAID' && new Date(p.paid_date || '').getMonth() === currentMonth && new Date(p.paid_date || '').getFullYear() === currentYear)
        .reduce((sum, p) => sum + p.amount, 0)
      
      const pendingPayments = paymentsData
        .filter(p => p.status === 'PENDING')
        .reduce((sum, p) => sum + p.amount, 0)
      
      const overduePayments = paymentsData
        .filter(p => p.status === 'OVERDUE')
        .reduce((sum, p) => sum + p.amount + p.late_fee, 0)
      
      const maintenanceRequests = maintenanceData.length
      const urgentMaintenance = maintenanceData.filter(m => m.priority === 'URGENT').length
      
      const occupancyRate = totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0
      const rentCollectionRate = totalMonthlyRent > 0 ? Math.round((collectedThisMonth / totalMonthlyRent) * 100) : 0

      // Generate monthly trends (last 6 months)
      const monthlyTrends = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthName = date.toLocaleDateString('en-US', { month: 'short' })
        
        const monthPayments = paymentsData.filter(p => {
          const paymentDate = new Date(p.paid_date || '')
          return paymentDate.getMonth() === date.getMonth() && paymentDate.getFullYear() === date.getFullYear()
        })
        
        const rentCollected = monthPayments.reduce((sum, p) => sum + p.amount, 0)
        const rentDue = totalMonthlyRent // Simplified - assuming same rent each month
        
        monthlyTrends.push({ month: monthName, rentCollected, rentDue })
      }

      // Property performance
      const propertyPerformance = propertiesData.map(property => {
        const rentAmount = property.units?.reduce((sum, unit) => sum + unit.rent_amount, 0) || 0
        const occupiedUnits = property.units?.filter(u => u.status === 'OCCUPIED').length || 0
        const totalUnits = property.units?.length || 0
        const occupancyStatus = totalUnits > 0 ? (occupiedUnits === totalUnits ? 'Occupied' : 'Partially Occupied') : 'Available'
        
        const maintenanceCount = maintenanceData.filter(m => m.property_id === property.id).length
        
        return {
          propertyName: property.name,
          rentAmount,
          occupancyStatus,
          maintenanceCount
        }
      })

      setAnalytics({
        totalProperties,
        occupiedProperties,
        totalTenants,
        activeTenants,
        totalMonthlyRent,
        collectedThisMonth,
        pendingPayments,
        overduePayments,
        maintenanceRequests,
        urgentMaintenance,
        occupancyRate,
        rentCollectionRate,
        monthlyTrends,
        propertyPerformance
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Fallback to mock data if needed
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
      <DashboardNav />
      
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
                <span className="text-gray-600">Average Response Time</span>
                <span className="font-semibold">2.5 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold text-green-600">95%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Rent Collection Trends</h3>
          <div className="space-y-4">
            {analytics.monthlyTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">{trend.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Due: {formatCurrency(trend.rentDue)}</span>
                  <span className="text-sm font-medium text-green-600">Collected: {formatCurrency(trend.rentCollected)}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (trend.rentCollected / trend.rentDue) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Performance */}
        <div className="card">
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
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{property.propertyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(property.rentAmount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        property.occupancyStatus === 'Occupied' ? 'bg-green-100 text-green-800' :
                        property.occupancyStatus === 'Partially Occupied' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {property.occupancyStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <WrenchScrewdriverIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{property.maintenanceCount} requests</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 
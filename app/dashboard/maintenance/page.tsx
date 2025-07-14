'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PlusIcon, 
  WrenchScrewdriverIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/auth-context'

interface Maintenance {
  id: string
  title: string
  description: string
  type: string
  priority: string
  status: string
  scheduledDate?: string
  completedDate?: string
  cost?: number
  vendorName?: string
  property: {
    name: string
    address: string
  }
  tenant?: {
    firstName: string
    lastName: string
  }
}

export default function MaintenancePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [maintenance, setMaintenance] = useState<Maintenance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchMaintenance()
    }
  }, [user])

  const fetchMaintenance = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/maintenance`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setMaintenance(data)
      }
    } catch (error) {
      console.error('Error fetching maintenance:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'LOW':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'SCHEDULED':
        return 'bg-purple-100 text-purple-800'
      case 'REQUESTED':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'IN_PROGRESS':
        return <WrenchScrewdriverIcon className="h-5 w-5 text-blue-600" />
      case 'SCHEDULED':
        return <CalendarIcon className="h-5 w-5 text-purple-600" />
      case 'REQUESTED':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />
      case 'CANCELLED':
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-600" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const filteredMaintenance = maintenance.filter(item => {
    if (filter === 'all') return true
    return item.status === filter.toUpperCase()
  })

  const urgentCount = maintenance.filter(m => m.priority === 'URGENT').length
  const pendingCount = maintenance.filter(m => m.status === 'REQUESTED').length
  const inProgressCount = maintenance.filter(m => m.status === 'IN_PROGRESS').length
  const completedCount = maintenance.filter(m => m.status === 'COMPLETED').length

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading maintenance requests...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Maintenance</h1>
              <p className="mt-2 text-gray-600">Manage maintenance requests and scheduling</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/maintenance/new')}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Request
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-600">{urgentCount}</div>
            <div className="text-gray-600">Urgent Requests</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-gray-600">Pending Requests</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600">{inProgressCount}</div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600">{completedCount}</div>
            <div className="text-gray-600">Completed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['all', 'requested', 'scheduled', 'in_progress', 'completed'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === filterOption
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {filterOption.replace('_', ' ').charAt(0).toUpperCase() + filterOption.replace('_', ' ').slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Maintenance List */}
        {filteredMaintenance.length === 0 ? (
          <div className="text-center py-12">
            <WrenchScrewdriverIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance requests</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'No maintenance requests yet. Create your first request to get started.'
                : `No ${filter.replace('_', ' ')} requests found.`
              }
            </p>
            {filter === 'all' && (
              <button
                onClick={() => router.push('/dashboard/maintenance/new')}
                className="btn-primary"
              >
                Create First Request
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMaintenance.map((item) => (
              <div key={item.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <div className="font-medium capitalize">{item.type.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Property:</span>
                    <div className="font-medium">{item.property.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Tenant:</span>
                    <div className="font-medium">
                      {item.tenant ? `${item.tenant.firstName} ${item.tenant.lastName}` : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Cost:</span>
                    <div className="font-medium">{formatCurrency(item.cost)}</div>
                  </div>
                </div>

                {item.scheduledDate && (
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Scheduled: {formatDate(item.scheduledDate)}
                  </div>
                )}

                {item.vendorName && (
                  <div className="text-sm text-gray-600 mb-4">
                    <span className="font-medium">Vendor:</span> {item.vendorName}
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/dashboard/maintenance/${item.id}`)}
                    className="flex-1 btn-secondary flex items-center justify-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/maintenance/${item.id}/edit`)}
                    className="btn-outline"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="btn-outline text-red-600 hover:bg-red-50">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { tenants } from '@/lib/supabase-utils'
import DashboardNav from '@/app/components/DashboardNav'
import { 
  PlusIcon, 
  UserGroupIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface Tenant {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  status: string
  lease_start: string
  lease_end: string
  rent_amount: number
  unit: {
    unit_number: string
    property: {
      name: string
      address: string
    }
  }
}

export default function TenantsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [tenantsList, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchTenants()
    }
  }, [user])

  const fetchTenants = async () => {
    try {
      const data = await tenants.getAll()
      setTenants(data)
    } catch (error) {
      console.error('Error fetching tenants:', error)
    } finally {
      setIsLoading(false)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleDeleteTenant = async (tenantId: string) => {
    if (!confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      return
    }
    try {
      await tenants.delete(tenantId)
      await fetchTenants()
    } catch (error) {
      console.error('Error deleting tenant:', error)
      alert('Failed to delete tenant')
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tenants...</p>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tenants</h1>
              <p className="mt-2 text-gray-600">Manage your tenant relationships</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard/tenants/invitations')}
                className="btn-outline flex items-center"
              >
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                View Invitations
              </button>
              <button
                onClick={() => router.push('/dashboard/tenants/new')}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Tenant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600">{tenantsList.length}</div>
            <div className="text-gray-600">Total Tenants</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600">
              {tenantsList.filter(t => t.status === 'ACTIVE').length}
            </div>
            <div className="text-gray-600">Active Tenants</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {tenantsList.filter(t => t.status === 'MOVED_OUT').length}
            </div>
            <div className="text-gray-600">Moved Out</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600">
              ${tenantsList.reduce((sum, t) => sum + t.rent_amount, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Total Monthly Rent</div>
          </div>
        </div>

        {/* Tenants List */}
        {tenantsList.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants yet</h3>
            <p className="text-gray-600 mb-6">Add your first tenant to get started</p>
            <button
              onClick={() => router.push('/dashboard/tenants/new')}
              className="btn-primary"
            >
              Add Your First Tenant
            </button>
          </div>
        ) : (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lease Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tenantsList.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-600">
                                {tenant.first_name[0]}{tenant.last_name[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {tenant.first_name} {tenant.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tenant.unit?.property?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">
                          {tenant.unit?.unit_number ? `Unit ${tenant.unit.unit_number} - ` : ''}{tenant.unit?.property?.address || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {tenant.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {tenant.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(tenant.lease_start)} - {formatDate(tenant.lease_end)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          ${tenant.rent_amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tenant.status)}`}>
                          {tenant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/tenants/${tenant.id}`)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/tenants/${tenant.id}/edit`)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTenant(tenant.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Tenant"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
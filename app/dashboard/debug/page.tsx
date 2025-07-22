'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { tenants } from '@/lib/supabase-utils'
import DashboardNav from '@/app/components/DashboardNav'

interface DebugData {
  currentUser: string
  allTenants: any[]
  landlordTenants: any[]
  totalTenants: number
  userTenants: number
}

export default function DebugPage() {
  const { user, loading } = useAuth()
  const [debugData, setDebugData] = useState<DebugData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDebug = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await tenants.debugTenants()
      setDebugData(data)
    } catch (err) {
      console.error('Debug error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      runDebug()
    }
  }, [user])

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading debug information...</p>
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Debug Information</h1>
          <p className="mt-2 text-gray-600">Debug tenant visibility issues</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current User Info */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Current User</h2>
            <div className="space-y-2">
              <p><strong>User ID:</strong> {debugData?.currentUser}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>

          {/* Tenant Counts */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Tenant Counts</h2>
            <div className="space-y-2">
              <p><strong>Total Tenants in Database:</strong> {debugData?.totalTenants}</p>
              <p><strong>Tenants for Current User:</strong> {debugData?.userTenants}</p>
            </div>
          </div>

          {/* All Tenants */}
          <div className="card lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">All Tenants in Database</h2>
            {debugData?.allTenants && debugData.allTenants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Landlord ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {debugData.allTenants.map((tenant) => (
                      <tr key={tenant.id} className={tenant.landlord_id === debugData.currentUser ? 'bg-green-50' : ''}>
                        <td className="px-6 py-4 text-sm text-gray-900">{tenant.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{tenant.first_name} {tenant.last_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{tenant.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{tenant.landlord_id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{tenant.unit_id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{tenant.status}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{new Date(tenant.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No tenants found in database</p>
            )}
          </div>

          {/* User's Tenants */}
          <div className="card lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Tenants for Current User</h2>
            {debugData?.landlordTenants && debugData.landlordTenants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {debugData.landlordTenants.map((tenant) => (
                      <tr key={tenant.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">{tenant.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{tenant.first_name} {tenant.last_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{tenant.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{tenant.unit_id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{tenant.status}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{new Date(tenant.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No tenants found for current user</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={runDebug}
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh Debug Data'}
          </button>
        </div>
      </div>
    </div>
  )
} 
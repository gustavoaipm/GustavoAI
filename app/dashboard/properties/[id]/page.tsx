'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { properties } from '@/lib/supabase-utils'
import DashboardNav from '@/app/components/DashboardNav'
import { 
  HomeIcon, 
  MapPinIcon, 
  PencilIcon, 
  TrashIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface Property {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  property_type: string
  total_units: number
  status: string
  description: string | null
  images: string[]
  created_at: string
  updated_at: string
  units: Unit[]
  maintenance: Maintenance[]
}

interface Unit {
  id: string
  unit_number: string
  bedrooms: number
  bathrooms: number
  square_feet: number | null
  rent_amount: number
  status: string
  description: string | null
  images: string[]
  created_at: string
  updated_at: string
  tenants: Tenant[]
  maintenance: Maintenance[]
  payments: Payment[]
}

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
  security_deposit: number
}

interface Maintenance {
  id: string
  title: string
  description: string
  type: string
  priority: string
  status: string
  scheduled_date: string | null
  completed_date: string | null
  cost: number | null
  vendor_name: string | null
  vendor_phone: string | null
  vendor_email: string | null
  notes: string | null
  images: string[]
  created_at: string
}

interface Payment {
  id: string
  amount: number
  type: string
  status: string
  due_date: string
  paid_date: string | null
  late_fee: number
  description: string | null
  tenant: {
    first_name: string
    last_name: string
  }
}

export default function PropertyDetailPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string
  
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user && propertyId) {
      fetchProperty()
    }
  }, [user, propertyId])

  const fetchProperty = async () => {
    try {
      const data = await properties.getById(propertyId)
      setProperty(data)
    } catch (error) {
      console.error('Error fetching property:', error)
      router.push('/dashboard/properties')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      await properties.delete(propertyId)
      router.push('/dashboard/properties')
    } catch (error) {
      console.error('Error deleting property:', error)
      alert('Failed to delete property')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Property not found</h3>
          <button
            onClick={() => router.push('/dashboard/properties')}
            className="btn-primary"
          >
            Back to Properties
          </button>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
              <p className="mt-2 text-gray-600">{property.address}, {property.city}, {property.state} {property.zip_code}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push(`/dashboard/properties/${propertyId}/edit`)}
                className="btn-secondary flex items-center"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn-outline text-red-600 hover:bg-red-50 flex items-center"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Images */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Images</h2>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HomeIcon className="h-16 w-16 text-gray-400" />
                    <p className="ml-4 text-gray-500">No images available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Property Type</h3>
                  <p className="text-gray-900">{property.property_type}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    property.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    property.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Units</h3>
                  <p className="text-gray-900">{property.units?.length || 0}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Available Units</h3>
                  <p className="text-gray-900 text-green-600">
                    {property.units?.filter(u => u.status === 'AVAILABLE').length || 0}/{property.units?.length || 0}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
                  <p className="text-gray-900">{formatDate(property.created_at)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
                  <p className="text-gray-900">{formatDate(property.updated_at)}</p>
                </div>
              </div>

              {property.description && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                  <p className="text-gray-900">{property.description}</p>
                </div>
              )}
            </div>

            {/* Units */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Units</h2>
                <button
                  onClick={() => router.push(`/dashboard/properties/${propertyId}/edit?addUnit=1`)}
                  className="btn-primary text-sm"
                >
                  Add Unit
                </button>
              </div>

              {property.units && property.units.length > 0 ? (
                <div className="space-y-4">
                  {property.units.map((unit) => (
                    <div key={unit.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">Unit {unit.unit_number}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          unit.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                          unit.status === 'OCCUPIED' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {unit.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Bedrooms:</span>
                          <span className="ml-1 font-medium">{unit.bedrooms}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Bathrooms:</span>
                          <span className="ml-1 font-medium">{unit.bathrooms}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Rent:</span>
                          <span className="ml-1 font-medium">{formatCurrency(unit.rent_amount)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Tenants:</span>
                          <span className="ml-1 font-medium">{unit.status === 'OCCUPIED' ? (unit.tenants?.length || 0) : 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HomeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No units added yet</p>
                </div>
              )}
            </div>

            {/* Recent Maintenance */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Maintenance</h2>
                <button
                  onClick={() => router.push(`/dashboard/maintenance/new?propertyId=${propertyId}`)}
                  className="btn-primary text-sm"
                >
                  Add Request
                </button>
              </div>

              {property.maintenance && property.maintenance.length > 0 ? (
                <div className="space-y-4">
                  {property.maintenance.slice(0, 5).map((maintenance) => (
                    <div key={maintenance.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{maintenance.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          maintenance.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          maintenance.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {maintenance.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{maintenance.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {formatDate(maintenance.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <WrenchScrewdriverIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No maintenance requests</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Units</span>
                  <span className="font-medium">{property.units?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Available</span>
                  <span className="font-medium text-green-600">
                    {property.units?.filter(u => u.status === 'AVAILABLE').length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Occupied</span>
                  <span className="font-medium text-blue-600">
                    {property.units?.filter(u => u.status === 'OCCUPIED').length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Tenants</span>
                  <span className="font-medium text-purple-600">
                    {property.units?.filter(u => u.status === 'OCCUPIED').reduce((sum, u) => sum + (u.tenants?.length || 0), 0) || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Rent</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(property.units?.reduce((sum, u) => sum + u.rent_amount, 0) || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/dashboard/properties/${propertyId}/edit?addUnit=1`)}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <HomeIcon className="h-4 w-4 mr-2" />
                  Add Unit
                </button>
                <button
                  onClick={() => router.push(`/dashboard/tenants/new?propertyId=${propertyId}`)}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Add Tenant
                </button>
                <button
                  onClick={() => router.push(`/dashboard/maintenance/new?propertyId=${propertyId}`)}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
                  Maintenance Request
                </button>
                <button
                  onClick={() => router.push(`/dashboard/payments/new?propertyId=${propertyId}`)}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
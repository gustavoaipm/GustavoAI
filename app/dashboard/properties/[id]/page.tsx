'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeftIcon,
  HomeIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/auth-context'
import DashboardNav from '@/app/components/DashboardNav'

interface Property {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  propertyType: string
  totalUnits: number
  status: string
  description: string | null
  images: string[]
  createdAt: string
  updatedAt: string
  units: Unit[]
  maintenance: Maintenance[]
}

interface Unit {
  id: string
  unitNumber: string
  bedrooms: number
  bathrooms: number
  squareFeet: number | null
  rentAmount: number
  status: string
  description: string | null
  images: string[]
  createdAt: string
  updatedAt: string
  tenants: Tenant[]
  maintenance: Maintenance[]
  payments: Payment[]
}

interface Tenant {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: string
  leaseStart: string
  leaseEnd: string
  rentAmount: number
  securityDeposit: number
}

interface Maintenance {
  id: string
  title: string
  description: string
  type: string
  priority: string
  status: string
  scheduledDate: string | null
  completedDate: string | null
  cost: number | null
  vendorName: string | null
  vendorPhone: string | null
  vendorEmail: string | null
  notes: string | null
  images: string[]
  createdAt: string
}

interface Payment {
  id: string
  amount: number
  type: string
  status: string
  dueDate: string
  paidDate: string | null
  lateFee: number
  description: string | null
  tenant: {
    firstName: string
    lastName: string
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
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && propertyId) {
      fetchProperty()
    }
  }, [user, propertyId])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProperty(data.property)
      } else {
        router.push('/dashboard/properties')
      }
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        router.push('/dashboard/properties')
      } else {
        alert('Failed to delete property')
      }
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
              <p className="mt-2 text-gray-600">{property.address}, {property.city}, {property.state} {property.zipCode}</p>
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
                  <p className="text-gray-900">{property.propertyType}</p>
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
                  <p className="text-gray-900">{property.totalUnits}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Available Units</h3>
                  <p className="text-gray-900 text-green-600">
                    {property.units.filter(u => u.status === 'AVAILABLE').length}/{property.totalUnits}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Monthly Rent</h3>
                  <p className="text-gray-900 font-semibold">
                    {formatCurrency(property.units.reduce((sum, u) => sum + u.rentAmount, 0))}
                  </p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Units</h2>
              <div className="space-y-4">
                {property.units.map((unit) => (
                  <div key={unit.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Unit {unit.unitNumber}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <HomeIcon className="h-4 w-4 mr-1" />
                          {unit.bedrooms} bed, {unit.bathrooms} bath
                          {unit.squareFeet && ` • ${unit.squareFeet.toLocaleString()} sq ft`}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          unit.status === 'OCCUPIED' ? 'bg-green-100 text-green-800' :
                          unit.status === 'AVAILABLE' ? 'bg-blue-100 text-blue-800' :
                          unit.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                          unit.status === 'RESERVED' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {unit.status}
                        </span>
                        <span className="text-lg font-semibold text-green-600">
                          {formatCurrency(unit.rentAmount)}
                        </span>
                      </div>
                    </div>

                    {unit.description && (
                      <p className="text-sm text-gray-600 mb-4">{unit.description}</p>
                    )}

                    {/* Unit Tenants */}
                    {unit.tenants && unit.tenants.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Current Tenants</h4>
                        <div className="space-y-2">
                          {unit.tenants.map((tenant) => (
                            <div key={tenant.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <UsersIcon className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="font-medium">{tenant.firstName} {tenant.lastName}</span>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                tenant.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {tenant.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Unit Actions */}
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => router.push(`/dashboard/units/${unit.id}`)}
                        className="btn-secondary flex items-center text-sm"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/units/${unit.id}/edit`)}
                        className="btn-outline text-sm"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Maintenance */}
            {property.maintenance && property.maintenance.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Maintenance</h2>
                <div className="space-y-4">
                  {property.maintenance.slice(0, 3).map((maintenance) => (
                    <div key={maintenance.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{maintenance.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{maintenance.description}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          maintenance.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          maintenance.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {maintenance.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-2">
                        <WrenchScrewdriverIcon className="h-4 w-4 mr-1" />
                        {maintenance.type} • {maintenance.priority} priority
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Units</span>
                  <span className="font-medium">{property.totalUnits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Units</span>
                  <span className="font-medium text-green-600">
                    {property.units?.filter(u => u.status === 'AVAILABLE').length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Occupied Units</span>
                  <span className="font-medium text-blue-600">
                    {property.units?.filter(u => u.status === 'OCCUPIED').length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tenants</span>
                  <span className="font-medium">
                    {property.units?.reduce((sum, u) => sum + (u.tenants?.length || 0), 0) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Maintenance</span>
                  <span className="font-medium">
                    {property.maintenance?.filter(m => m.status !== 'COMPLETED').length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Revenue</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(property.units?.reduce((sum, u) => sum + u.rentAmount, 0) || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Created</span>
                  <div className="font-medium">{formatDate(property.createdAt)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Last Updated</span>
                  <div className="font-medium">{formatDate(property.updatedAt)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Property ID</span>
                  <div className="font-medium font-mono text-xs">{property.id}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push(`/dashboard/properties/${propertyId}/units/new`)}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Unit
                </button>
                <button className="w-full btn-secondary flex items-center justify-center">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Add Tenant
                </button>
                <button className="w-full btn-secondary flex items-center justify-center">
                  <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
                  Create Maintenance Request
                </button>
                <button className="w-full btn-secondary flex items-center justify-center">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  View Documents
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
} 
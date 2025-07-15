'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PlusIcon, 
  HomeIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/auth-context'
import DashboardNav from '@/app/components/DashboardNav'

interface Property {
  id: string
  name: string
  address: string
  city: string
  state: string
  propertyType: string
  totalUnits: number
  status: string
  description: string | null
  images: string[]
  units: Unit[]
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
  tenants: Tenant[]
  maintenance: Maintenance[]
}

interface Tenant {
  id: string
  firstName: string
  lastName: string
  status: string
}

interface Maintenance {
  id: string
  status: string
}

export default function PropertiesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchProperties()
    }
  }, [user])

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties || data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
              <p className="mt-2 text-gray-600">Manage your property portfolio</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/properties/new')}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Property
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600">{properties.length}</div>
            <div className="text-gray-600">Total Properties</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600">
              {properties.reduce((sum, p) => sum + p.units.filter(u => u.status === 'OCCUPIED').length, 0)}
            </div>
            <div className="text-gray-600">Occupied Units</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {properties.reduce((sum, p) => sum + p.units.filter(u => u.status === 'AVAILABLE').length, 0)}
            </div>
            <div className="text-gray-600">Available Units</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600">
              ${properties.reduce((sum, p) => sum + p.units.reduce((unitSum, u) => unitSum + u.rentAmount, 0), 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Total Monthly Rent</div>
          </div>
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first property</p>
            <button
              onClick={() => router.push('/dashboard/properties/new')}
              className="btn-primary"
            >
              Add Your First Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="card hover:shadow-lg transition-shadow">
                {/* Property Image */}
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HomeIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Property Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      property.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      property.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.status}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.city}, {property.state}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Type:</span>
                      <div className="font-medium">{property.propertyType}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Units:</span>
                      <div className="font-medium">{property.totalUnits}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Available:</span>
                      <div className="font-medium text-green-600">
                        {property.units.filter(u => u.status === 'AVAILABLE').length}/{property.totalUnits}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Total Rent:</span>
                      <div className="font-medium text-green-600">
                        ${property.units.reduce((sum, u) => sum + u.rentAmount, 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/dashboard/properties/${property.id}`)}
                      className="flex-1 btn-secondary flex items-center justify-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/properties/${property.id}/edit`)}
                      className="btn-outline"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="btn-outline text-red-600 hover:bg-red-50">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
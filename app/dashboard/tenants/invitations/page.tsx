'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { tenantInvitations } from '@/lib/supabase-utils'
import { supabase } from '@/lib/supabase'
import DashboardNav from '@/app/components/DashboardNav'
import { 
  EnvelopeIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  TrashIcon,
  ArrowLeftIcon,
  UserIcon,
  HomeIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface Invitation {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  lease_start: string
  lease_end: string
  rent_amount: number
  security_deposit: number
  verification_token: string
  expires_at: string
  is_verified: boolean
  verified_at: string | null
  created_at: string
  unit: {
    unit_number: string
    property: {
      name: string
      address: string
    }
  }
}

export default function TenantInvitationsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchInvitations()
    }
  }, [user])

  const fetchInvitations = async () => {
    try {
      // Get current user's invitations
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) return

      const { data, error } = await supabase
        .from('tenant_invitations')
        .select(`
          *,
          unit:units (
            unit_number,
            property:properties (
              name,
              address
            )
          )
        `)
        .eq('landlord_id', currentUser.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setInvitations(data || [])
    } catch (error) {
      console.error('Error fetching invitations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendInvitation = async (invitation: Invitation) => {
    try {
      // Generate new token and expiration
      const newToken = crypto.randomUUID()
      const newExpiresAt = new Date()
      newExpiresAt.setDate(newExpiresAt.getDate() + 7)

      // Update invitation
      const { error } = await supabase
        .from('tenant_invitations')
        .update({
          verification_token: newToken,
          expires_at: newExpiresAt.toISOString()
        })
        .eq('id', invitation.id)

      if (error) throw error

      // Send new invitation email
      const verificationUrl = `${window.location.origin}/auth/tenant-verify?token=${newToken}`
      
      const emailResponse = await fetch('/api/tenant-invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'invitation',
          data: {
            email: invitation.email,
            first_name: invitation.first_name,
            last_name: invitation.last_name,
            property_name: invitation.unit.property.name,
            unit_number: invitation.unit.unit_number,
            landlord_name: `${user?.user_metadata?.first_name || 'Property Manager'} ${user?.user_metadata?.last_name || ''}`,
            verification_url: verificationUrl,
            expires_at: newExpiresAt.toISOString()
          }
        })
      })

      if (!emailResponse.ok) {
        throw new Error('Failed to send invitation email')
      }

      alert('Invitation resent successfully!')
      await fetchInvitations() // Refresh the list
    } catch (error) {
      console.error('Error resending invitation:', error)
      alert('Failed to resend invitation. Please try again.')
    }
  }

  const handleDeleteInvitation = async (invitationId: string) => {
    if (!confirm('Are you sure you want to delete this invitation? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('tenant_invitations')
        .delete()
        .eq('id', invitationId)

      if (error) throw error

      alert('Invitation deleted successfully!')
      await fetchInvitations() // Refresh the list
    } catch (error) {
      console.error('Error deleting invitation:', error)
      alert('Failed to delete invitation. Please try again.')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (invitation: Invitation) => {
    if (invitation.is_verified) return 'bg-green-100 text-green-800'
    if (new Date(invitation.expires_at) < new Date()) return 'bg-red-100 text-red-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const getStatusText = (invitation: Invitation) => {
    if (invitation.is_verified) return 'Verified'
    if (new Date(invitation.expires_at) < new Date()) return 'Expired'
    return 'Pending'
  }

  const getStatusIcon = (invitation: Invitation) => {
    if (invitation.is_verified) return <CheckCircleIcon className="h-4 w-4" />
    if (new Date(invitation.expires_at) < new Date()) return <XCircleIcon className="h-4 w-4" />
    return <ClockIcon className="h-4 w-4" />
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invitations...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Tenant Invitations</h1>
              <p className="mt-2 text-gray-600">Manage pending tenant invitations</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard/tenants')}
                className="btn-outline flex items-center"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Tenants
              </button>
              <button
                onClick={() => router.push('/dashboard/tenants/new')}
                className="btn-primary flex items-center"
              >
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                Send New Invitation
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
            <div className="text-3xl font-bold text-primary-600">{invitations.length}</div>
            <div className="text-gray-600">Total Invitations</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {invitations.filter(i => !i.is_verified && new Date(i.expires_at) > new Date()).length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600">
              {invitations.filter(i => i.is_verified).length}
            </div>
            <div className="text-gray-600">Verified</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-600">
              {invitations.filter(i => !i.is_verified && new Date(i.expires_at) < new Date()).length}
            </div>
            <div className="text-gray-600">Expired</div>
          </div>
        </div>

        {/* Invitations List */}
        {invitations.length === 0 ? (
          <div className="text-center py-12">
            <EnvelopeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invitations yet</h3>
            <p className="text-gray-600 mb-6">Send your first tenant invitation to get started</p>
            <button
              onClick={() => router.push('/dashboard/tenants/new')}
              className="btn-primary"
            >
              Send First Invitation
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
                  {invitations.map((invitation) => (
                    <tr key={invitation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-600">
                                {invitation.first_name[0]}{invitation.last_name[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {invitation.first_name} {invitation.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{invitation.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invitation.unit.property.name}</div>
                        <div className="text-sm text-gray-500">Unit {invitation.unit.unit_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(invitation.lease_start)} - {formatDate(invitation.lease_end)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(invitation.rent_amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(invitation)}
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invitation)}`}>
                            {getStatusText(invitation)}
                          </span>
                        </div>
                        {invitation.is_verified && invitation.verified_at && (
                          <div className="text-xs text-gray-500 mt-1">
                            Verified: {formatDate(invitation.verified_at)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {!invitation.is_verified && new Date(invitation.expires_at) > new Date() && (
                            <button
                              onClick={() => handleResendInvitation(invitation)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Resend
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteInvitation(invitation.id)}
                            className="text-red-600 hover:text-red-900"
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
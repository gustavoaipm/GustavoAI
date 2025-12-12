'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { tenantInvitations } from '@/lib/supabase-utils'
import { auth } from '@/lib/supabase-utils'
import { supabase } from '@/lib/supabaseClient'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  UserIcon,
  HomeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'

interface InvitationData {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  date_of_birth?: string
  emergency_contact?: string
  emergency_phone?: string
  lease_start: string
  lease_end: string
  rent_amount: number
  security_deposit: number
  unit: {
    unit_number: string
    property: {
      name: string
      address: string
    }
  }
  landlord: {
    first_name: string
    last_name: string
    email: string
  }
}

export default function TenantVerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Loading verification...</div>}>
      <TenantVerifyPageContent />
    </Suspense>
  )
}

function TenantVerifyPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'verifying' | 'account-creation' | 'success'>('verifying')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (token) {
      verifyInvitation()
    } else {
      setError('Invalid verification link')
      setIsLoading(false)
    }
  }, [token])

  // Auto-redirect to login after 5 seconds when step is success
  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => {
        router.push('/login')
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [step, router])

  const verifyInvitation = async () => {
    try {
      // Use server-side API to fetch invitation data with related information
      const response = await fetch(`/api/tenant-invitation?token=${token}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch invitation')
      }

      const data = await response.json()
      setInvitation(data.invitation)
      setStep('account-creation')
    } catch (error) {
      console.error('Error verifying invitation:', error)
      setError('This invitation is invalid or has expired. Please contact your property manager.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
      return
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    setPasswordError('')
    setIsVerifying(true)
    setError(null)

    try {
      // 1. Create Supabase Auth user first (for authentication)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: invitation!.email,
        password: password,
        options: {
          data: {
            first_name: invitation!.first_name,
            last_name: invitation!.last_name,
            phone: invitation!.phone,
            role: 'TENANT'
          }
        }
      })

      if (signUpError) {
        console.error('Auth signup error:', signUpError)
        setError(`Failed to create authentication account: ${signUpError.message}`)
        setIsVerifying(false)
        return
      }

      if (!data.user) {
        setError('Failed to create user account')
        setIsVerifying(false)
        return
      }

      // 2. Call server-side API to verify invitation and create tenant row
      const verifyResponse = await fetch('/api/tenant-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token!,
          invitationId: invitation!.id,
          userId: data.user.id
        })
      })

      console.log('Verify response status:', verifyResponse.status)
      const verifyData = await verifyResponse.json()
      console.log('Verify response data:', verifyData)

      if (!verifyResponse.ok) {
        setError(verifyData.error || 'Failed to verify invitation')
        setIsVerifying(false)
        return
      }

      // 3. Sign in the user to establish the session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: invitation!.email,
        password: password
      })

      if (signInError) {
        console.error('Sign in error:', signInError)
        // Don't fail here - the account was created successfully
        // User can sign in manually later
      }

      // 4. (Optional) Send welcome email
      const loginUrl = `${window.location.origin}/login`
      const emailResponse = await fetch('/api/tenant-invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'welcome',
          data: {
            email: invitation!.email,
            first_name: invitation!.first_name,
            last_name: invitation!.last_name,
            property_name: invitation!.unit?.property?.name || 'your property',
            unit_number: invitation!.unit?.unit_number || 'N/A',
            login_url: loginUrl
          }
        })
      })
      if (!emailResponse.ok) {
        console.warn('Failed to send welcome email, but account was created successfully')
      }

      setStep('success')
    } catch (error) {
      console.error('Error creating account:', error)
      setError(`Failed to create account: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsVerifying(false)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your invitation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your New Home!</h1>
          <p className="text-gray-600 mb-6">
            Your account has been successfully created. You can now access your property management portal.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/login')}
              className="w-full btn-primary"
            >
              Sign In to Your Account
            </button>
            <p className="text-sm text-gray-500">
              You will be automatically redirected to the login page in 5 seconds...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="text-center mb-8">
            <HomeIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to {invitation?.unit?.property?.name || 'your property'}
            </h1>
            <p className="text-gray-600 mt-2">Complete your account setup to access your property portal</p>
          </div>

          {/* Property Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <HomeIcon className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Property</p>
                  <p className="font-medium">{invitation?.unit?.property?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Unit</p>
                  <p className="font-medium">Unit {invitation?.unit?.unit_number || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Lease Period</p>
                  <p className="font-medium">
                    {invitation?.lease_start ? formatDate(invitation.lease_start) : 'N/A'} - {invitation?.lease_end ? formatDate(invitation.lease_end) : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Monthly Rent</p>
                  <p className="font-medium">{formatCurrency(invitation?.rent_amount || 0)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Creation Form */}
          <form onSubmit={handleCreateAccount} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Create Password *
              </label>
              <div className="relative">
                <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Enter your password"
                  minLength={8}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Confirm your password"
                />
              </div>
              {passwordError && (
                <p className="text-sm text-red-600 mt-1">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full btn-primary flex items-center justify-center"
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account & Access Portal'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              By creating an account, you agree to the terms and conditions of your lease agreement.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
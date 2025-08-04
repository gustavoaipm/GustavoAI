'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: ('LANDLORD' | 'TENANT' | 'ADMIN')[]
  fallbackPath?: string
  showAccessDenied?: boolean
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackPath = '/dashboard',
  showAccessDenied = true 
}: RoleGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/login')
    return null
  }

  // Check if user has required role
  const hasRequiredRole = user.role && allowedRoles.includes(user.role)

  if (!hasRequiredRole) {
    if (showAccessDenied) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>
            <button
              onClick={() => router.push(fallbackPath)}
              className="btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    } else {
      // Silent redirect
      router.push(fallbackPath)
      return null
    }
  }

  // User has required role, render children
  return <>{children}</>
} 
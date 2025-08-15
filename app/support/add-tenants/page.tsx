'use client'

import Link from 'next/link'
import { 
  UserPlusIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export default function AddTenantsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                GustavoAI
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/support" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Help Center
              </Link>
              <Link href="/login" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Sign In
              </Link>
              <Link href="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserGroupIcon className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Adding and Managing New Tenants
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the tenant management process with our comprehensive guide to adding, organizing, 
              and maintaining tenant information in GustavoAI.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserPlusIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Tenant</h3>
              <p className="text-gray-600 text-sm mb-4">
                Create a new tenant profile and send invitation
              </p>
              <Link 
                href="/dashboard/tenants/new"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add Tenant
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bulk Import</h3>
              <p className="text-gray-600 text-sm mb-4">
                Import multiple tenants from CSV or Excel
              </p>
              <button className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Import CSV
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CogIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Existing</h3>
              <p className="text-gray-600 text-sm mb-4">
                View and edit current tenant information
              </p>
              <Link 
                href="/dashboard/tenants"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                View Tenants
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tenant Information Fields */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Required Tenant Information
          </h2>

          <div className="space-y-6">
            {/* Personal Information */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <UserPlusIcon className="w-6 h-6 text-primary-600 mr-3" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Full Legal Name</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Date of Birth</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Social Security Number</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Driver's License Number</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Primary Phone Number</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Secondary Phone (Optional)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Email Address</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Emergency Contact</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="w-6 h-6 text-green-600 mr-3" />
                Employment & Income
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Current Employer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Job Title</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Employment Start Date</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Monthly Gross Income</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Work Phone Number</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Additional Income Sources</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Pay Stubs (Last 3 Months)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">W-2 or 1099 Forms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental History */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ShieldCheckIcon className="w-6 h-6 text-purple-600 mr-3" />
                Rental History & References
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Previous Landlord Name</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Previous Landlord Phone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Previous Address</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Rent Amount Paid</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Length of Tenancy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Reason for Moving</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Personal References (2)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Professional References</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Process */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Adding a New Tenant: Step-by-Step
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Access Tenant Management</h3>
              </div>
              <div className="ml-12 space-y-2 text-gray-600">
                <p>• Navigate to <strong>Dashboard → Tenants</strong></p>
                <p>• Click the <strong>"Add New Tenant"</strong> button</p>
                <p>• Choose between individual or bulk import options</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Fill Basic Information</h3>
              </div>
              <div className="ml-12 space-y-2 text-gray-600">
                <p>• Enter tenant's personal information (name, contact details)</p>
                <p>• Add employment and income information</p>
                <p>• Include rental history and references</p>
                <p>• Upload required documents (ID, pay stubs, etc.)</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Set Property Assignment</h3>
              </div>
              <div className="ml-12 space-y-2 text-gray-600">
                <p>• Select the property and unit for the tenant</p>
                <p>• Set move-in date and lease terms</p>
                <p>• Define rent amount and payment schedule</p>
                <p>• Configure security deposit requirements</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Send Invitation</h3>
              </div>
              <div className="ml-12 space-y-2 text-gray-600">
                <p>• Review all information for accuracy</p>
                <p>• Customize invitation message if desired</p>
                <p>• Set invitation expiration date</p>
                <p>• Click "Send Invitation" to proceed</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  5
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Monitor Progress</h3>
              </div>
              <div className="ml-12 space-y-2 text-gray-600">
                <p>• Track invitation status in your dashboard</p>
                <p>• Receive notifications when tenant completes application</p>
                <p>• Review submitted information and documents</p>
                <p>• Approve or request additional information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Best Practices for Tenant Management
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Organization</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Use consistent naming conventions</li>
                <li>• Group tenants by property or status</li>
                <li>• Tag tenants for easy filtering</li>
                <li>• Maintain detailed notes and history</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Documentation</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Store all documents securely</li>
                <li>• Use standardized application forms</li>
                <li>• Keep copies of all communications</li>
                <li>• Regular document expiration reviews</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Set clear expectations upfront</li>
                <li>• Use automated reminders</li>
                <li>• Maintain professional tone</li>
                <li>• Document all interactions</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Compliance</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Follow fair housing laws</li>
                <li>• Maintain consistent criteria</li>
                <li>• Regular policy updates</li>
                <li>• Legal document reviews</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Related Help Articles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link 
              href="/support/lease-management"
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-6 text-left transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Lease Management</h3>
                  <p className="text-gray-600 text-sm mt-1">Creating and managing lease agreements</p>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400" />
              </div>
            </Link>

            <Link 
              href="/support/tenant-communication"
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-6 text-left transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Tenant Communication</h3>
                  <p className="text-gray-600 text-sm mt-1">Effective communication strategies</p>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">GustavoAI</h3>
              <p className="text-gray-400">
                Intelligent property management powered by AI.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/#features" className="hover:text-white">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/#demo" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/support" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/support/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/support/status" className="hover:text-white">Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} GustavoAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 
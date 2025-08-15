'use client'

import Link from 'next/link'
import { 
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export default function MaintenanceRequestsPage() {
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
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <WrenchScrewdriverIcon className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Creating & Managing Maintenance Requests
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to efficiently create, track, and manage maintenance requests 
              to keep your properties in excellent condition and tenants satisfied.
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
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Request</h3>
              <p className="text-gray-600 text-sm mb-4">
                Submit a new maintenance request
              </p>
              <Link 
                href="/dashboard/maintenance/new"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                New Request
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Status</h3>
              <p className="text-gray-600 text-sm mb-4">
                Monitor ongoing maintenance work
              </p>
              <Link 
                href="/dashboard/maintenance"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                View Requests
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Vendors</h3>
              <p className="text-gray-600 text-sm mb-4">
                Coordinate with service providers
              </p>
              <Link 
                href="/support/vendor-management"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Vendor Guide
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Request Types */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Types of Maintenance Requests
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Emergency Requests</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Urgent issues that require immediate attention:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Burst pipes or water leaks</li>
                <li>• Electrical failures or safety hazards</li>
                <li>• Heating/cooling system breakdowns</li>
                <li>• Security system malfunctions</li>
                <li>• Fire alarm or safety issues</li>
              </ul>
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-red-800 text-xs font-medium">
                  Emergency requests are prioritized and should be reported immediately by phone or in-app emergency feature.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <ClockIcon className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Urgent Requests</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Issues that need attention within 24-48 hours:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Non-functioning appliances</li>
                <li>• Plumbing issues (non-emergency)</li>
                <li>• HVAC problems affecting comfort</li>
                <li>• Broken locks or security issues</li>
                <li>• Pest control problems</li>
              </ul>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800 text-xs font-medium">
                  Urgent requests are typically addressed within 1-2 business days.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <WrenchScrewdriverIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Routine Requests</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                General maintenance and improvements:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Minor repairs and touch-ups</li>
                <li>• Cosmetic improvements</li>
                <li>• Preventive maintenance</li>
                <li>• Landscaping and exterior work</li>
                <li>• General cleaning and maintenance</li>
              </ul>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-xs font-medium">
                  Routine requests are typically scheduled within 1-2 weeks.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <DocumentTextIcon className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Preventive Maintenance</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Scheduled maintenance to prevent issues:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• HVAC system inspections</li>
                <li>• Plumbing system checks</li>
                <li>• Electrical system reviews</li>
                <li>• Roof and gutter maintenance</li>
                <li>• Seasonal property inspections</li>
              </ul>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-green-800 text-xs font-medium">
                  Preventive maintenance is scheduled quarterly or annually.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creating a Maintenance Request */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How to Create a Maintenance Request
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Access Maintenance Portal</h3>
              </div>
              <div className="ml-12 space-y-2 text-gray-600">
                <p>• Navigate to <strong>Dashboard → Maintenance</strong></p>
                <p>• Click <strong>"Create New Request"</strong> button</p>
                <p>• Select the property and unit (if applicable)</p>
                <p>• Choose request type and priority level</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Describe the Issue</h3>
              </div>
              <div className="ml-12 space-y-2 text-gray-600">
                <p>• Provide a clear, detailed description of the problem</p>
                <p>• Include specific location details (room, area, etc.)</p>
                <p>• Mention when the issue first occurred</p>
                <p>• Note any temporary solutions already attempted</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Add Supporting Information</h3>
              </div>
              <div className="ml-12 space-y-2 text-gray-600">
                <p>• Upload photos or videos of the issue</p>
                <p>• Attach any relevant documents or receipts</p>
                <p>• Specify preferred contact method</p>
                <p>• Indicate if tenant will be present for access</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Submit and Track</h3>
              </div>
              <div className="ml-12 space-y-2 text-gray-600">
                <p>• Review all information for accuracy</p>
                <p>• Submit the request</p>
                <p>• Receive confirmation and tracking number</p>
                <p>• Monitor progress through the dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Best Practices for Maintenance Requests
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Clear Communication</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Use specific, descriptive language</li>
                <li>• Include relevant measurements and details</li>
                <li>• Provide context about when issues occur</li>
                <li>• Mention any safety concerns immediately</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Documentation</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Take clear photos from multiple angles</li>
                <li>• Keep records of all communications</li>
                <li>• Document any temporary fixes applied</li>
                <li>• Save receipts for reimbursable expenses</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Priority Setting</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Assess safety implications first</li>
                <li>• Consider tenant impact and comfort</li>
                <li>• Factor in property damage potential</li>
                <li>• Balance urgency with available resources</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Follow-up</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Monitor request progress regularly</li>
                <li>• Communicate updates to tenants</li>
                <li>• Verify work completion and quality</li>
                <li>• Document resolution and lessons learned</li>
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
              href="/support/vendor-management"
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-6 text-left transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Working with Vendors</h3>
                  <p className="text-gray-600 text-sm mt-1">Learn how to coordinate with service providers</p>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400" />
              </div>
            </Link>

            <Link 
              href="/support/maintenance-scheduling"
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-6 text-left transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Maintenance Scheduling</h3>
                  <p className="text-gray-600 text-sm mt-1">Optimize your maintenance workflow</p>
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
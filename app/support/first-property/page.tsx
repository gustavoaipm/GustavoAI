'use client'

import Link from 'next/link'
import { 
  HomeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CameraIcon,
  MapPinIcon,
  CogIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export default function FirstPropertyPage() {
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
              <HomeIcon className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Setting Up Your First Property
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to add your first property to GustavoAI, from basic information to 
              detailed setup that will help you start managing tenants effectively.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Start Overview */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              Why Proper Property Setup Matters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Accurate property details help with tenant matching</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Better AI insights and recommendations</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Streamlined maintenance and management</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Professional presentation to potential tenants</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Complete Property Setup Guide
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 1: Access Property Management</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Log into your GustavoAI dashboard</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Navigate to <strong>Properties</strong> in the left sidebar</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Click the <strong>"Add New Property"</strong> button</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Choose <strong>"Single Property"</strong> for your first addition</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 2: Basic Property Information</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Enter the <strong>Property Name</strong> (e.g., "Sunset Apartments")</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Input the <strong>Complete Address</strong> including city, state, and ZIP</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Select <strong>Property Type</strong> (Single Family, Multi-Family, etc.)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Choose <strong>Property Status</strong> (Available, Under Renovation, etc.)</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 3: Property Details & Features</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Specify <strong>Number of Units</strong> (1 for single-family, multiple for complexes)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Add <strong>Square Footage</strong> for each unit type</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>List <strong>Amenities</strong> (parking, laundry, pool, etc.)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Include <strong>Special Features</strong> (furnished, pet-friendly, etc.)</span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 4: Financial Information</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Set <strong>Monthly Rent Amount</strong> for each unit type</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Determine <strong>Security Deposit</strong> requirements</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Specify <strong>Utility Inclusions</strong> (water, electricity, internet)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Add any <strong>Additional Fees</strong> (parking, pet rent, etc.)</span>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 5: Property Photos & Media</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Upload <strong>Exterior Photos</strong> showing the building and grounds</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Add <strong>Interior Photos</strong> of key rooms and features</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Include <strong>Floor Plans</strong> if available</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Add <strong>Virtual Tours</strong> or video content</span>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 6: Availability & Scheduling</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Set <strong>Available Move-in Date</strong> for each unit</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Configure <strong>Showing Schedule</strong> and availability</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Set up <strong>Application Deadlines</strong> if applicable</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Enable <strong>Online Application</strong> and scheduling</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Setup Checklist */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Property Setup Checklist
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPinIcon className="w-6 h-6 text-blue-600 mr-3" />
                Location & Basic Info
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Property name and address</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Property type and status</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Number of units</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Square footage</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CogIcon className="w-6 h-6 text-green-600 mr-3" />
                Features & Amenities
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Key amenities listed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Special features noted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Parking information</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Pet policies</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="w-6 h-6 text-purple-600 mr-3" />
                Financial Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Rent amounts set</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Security deposits</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Utility inclusions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Additional fees</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CameraIcon className="w-6 h-6 text-orange-600 mr-3" />
                Media & Availability
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Photos uploaded</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Floor plans added</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Move-in dates set</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-600">Showing schedule</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips for Success */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Tips for Successful Property Setup
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quality Photos Matter</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Use high-resolution, well-lit photos</li>
                <li>• Show both interior and exterior features</li>
                <li>• Highlight unique selling points</li>
                <li>• Keep photos current and accurate</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Accurate Information</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Double-check all addresses and contact info</li>
                <li>• Verify square footage and room counts</li>
                <li>• Confirm rent amounts and fees</li>
                <li>• Update availability dates regularly</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed Descriptions</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Write compelling property descriptions</li>
                <li>• Highlight neighborhood amenities</li>
                <li>• Mention nearby transportation</li>
                <li>• Include local attractions</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Regular Updates</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Keep photos current</li>
                <li>• Update availability status</li>
                <li>• Refresh pricing when needed</li>
                <li>• Monitor market conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready for the Next Step?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Now that your property is set up, learn how to invite and manage tenants
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link 
              href="/support/invite-tenant"
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-6 text-left transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Invite Tenants</h3>
                  <p className="text-gray-600 text-sm mt-1">Learn how to invite and onboard tenants</p>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400" />
              </div>
            </Link>

            <Link 
              href="/support/add-tenants"
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-6 text-left transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Tenant Management</h3>
                  <p className="text-gray-600 text-sm mt-1">Complete guide to managing tenants</p>
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
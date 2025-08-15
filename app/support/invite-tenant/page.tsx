'use client'

import Link from 'next/link'
import { 
  UserPlusIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export default function InviteTenantPage() {
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
              <UserPlusIcon className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Inviting and Onboarding Tenants
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to efficiently invite new tenants, create lease agreements, and set up their portal access 
              for a seamless onboarding experience.
            </p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              Why Use Digital Tenant Onboarding?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Faster processing and reduced paperwork</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Automated document collection and verification</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Professional tenant experience</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Centralized communication and document storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Step-by-Step Tenant Invitation Process
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 1: Prepare Tenant Information</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Collect tenant's full name, email, and phone number</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Gather employment and income verification documents</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Prepare rental application form and requirements</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Set rent amount, security deposit, and move-in date</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 2: Create Digital Invitation</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Navigate to Tenants → Invite New Tenant</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Fill in tenant contact information and property details</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Customize invitation message and requirements</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Set invitation expiration date (recommended: 7 days)</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 3: Send Invitation</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Review invitation details and click "Send Invitation"</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Tenant receives email with secure invitation link</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Track invitation status in your dashboard</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Send follow-up reminders if needed</span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 4: Tenant Application Process</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Tenant clicks invitation link and creates account</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Complete rental application with personal information</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Upload required documents (ID, pay stubs, references)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Submit application for your review</span>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 5: Review and Approval</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Review completed application in your dashboard</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Verify income, employment, and references</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Run background and credit checks if required</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Approve or request additional information</span>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 6: Lease Agreement and Move-in</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Generate digital lease agreement using templates</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Customize terms, rent amount, and move-in date</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Send lease for tenant's digital signature</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Collect security deposit and first month's rent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Best Practices for Tenant Onboarding
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Preparation</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Have all required forms ready before inviting</li>
                <li>• Use clear, professional language</li>
                <li>• Include all necessary disclosures</li>
                <li>• Set realistic application deadlines</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <EnvelopeIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Respond to inquiries within 24 hours</li>
                <li>• Provide clear next steps</li>
                <li>• Use professional but friendly tone</li>
                <li>• Follow up on incomplete applications</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Compliance</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Follow fair housing laws</li>
                <li>• Use legally compliant lease templates</li>
                <li>• Maintain consistent application criteria</li>
                <li>• Document all decisions and communications</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <UserPlusIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tenant Experience</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Make the process as smooth as possible</li>
                <li>• Provide helpful resources and FAQs</li>
                <li>• Offer support during the application</li>
                <li>• Welcome new tenants warmly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Related Help Articles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link 
              href="/support/add-tenants"
              className="bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg p-6 text-left transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Adding New Tenants</h3>
                  <p className="text-gray-600 text-sm mt-1">Complete guide to tenant management</p>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400" />
              </div>
            </Link>

            <Link 
              href="/support/lease-management"
              className="bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg p-6 text-left transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Lease Management</h3>
                  <p className="text-gray-600 text-sm mt-1">Creating and managing lease agreements</p>
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
'use client'

import Link from 'next/link'
import { 
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClockIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export default function LeaseManagementPage() {
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
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <DocumentTextIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Lease Management & Agreements
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create, customize, and manage professional lease agreements with our comprehensive 
              lease management system and legally compliant templates.
            </p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Lease Management Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Template Library</h3>
              <p className="text-gray-600 text-sm">
                Pre-built, legally compliant lease templates for various property types and jurisdictions.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <UserGroupIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Signatures</h3>
              <p className="text-gray-600 text-sm">
                Secure electronic signing with audit trails and legal compliance.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <CogIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customization</h3>
              <p className="text-gray-600 text-sm">
                Easily modify terms, add clauses, and personalize agreements.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <ClockIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Renewal Tracking</h3>
              <p className="text-gray-600 text-sm">
                Automated reminders for lease renewals and expiration dates.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Compliance</h3>
              <p className="text-gray-600 text-sm">
                Built-in compliance checks and local law requirements.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <ArrowRightIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow Automation</h3>
              <p className="text-gray-600 text-sm">
                Streamlined process from creation to execution and storage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Creating a Lease */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Creating a New Lease Agreement
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 1: Access Lease Management</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Navigate to <strong>Dashboard → Leases</strong></span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Click <strong>"Create New Lease"</strong> button</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Select tenant and property from dropdown menus</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 2: Choose Template</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Browse available lease templates by property type</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Select template based on jurisdiction and property type</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Preview template to ensure it meets your needs</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 3: Customize Terms</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Fill in basic lease information (dates, rent, deposit)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Add or modify specific clauses and terms</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Include property-specific rules and policies</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 4: Review & Send</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Review all lease terms and conditions</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Send lease to tenant for digital signature</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Track signature status and completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Essential Lease Terms */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Essential Lease Terms & Clauses
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>• Property Address:</strong> Full legal property description</p>
                  <p><strong>• Tenant Names:</strong> All occupants and co-signers</p>
                  <p><strong>• Lease Term:</strong> Start and end dates</p>
                  <p><strong>• Rent Amount:</strong> Monthly rent and due date</p>
                </div>
                <div>
                  <p><strong>• Security Deposit:</strong> Amount and return conditions</p>
                  <p><strong>• Utilities:</strong> What's included/excluded</p>
                  <p><strong>• Parking:</strong> Parking arrangements and fees</p>
                  <p><strong>• Pet Policy:</strong> Pet rules and deposits</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>• Late Fees:</strong> Amount and grace period</p>
                  <p><strong>• Returned Check Fees:</strong> Bank charges</p>
                  <p><strong>• Rent Increases:</strong> Notice requirements</p>
                  <p><strong>• Payment Methods:</strong> Accepted forms of payment</p>
                </div>
                <div>
                  <p><strong>• Maintenance Costs:</strong> Tenant vs. landlord responsibilities</p>
                  <p><strong>• Insurance:</strong> Required tenant insurance</p>
                  <p><strong>• Subletting:</strong> Rules and restrictions</p>
                  <p><strong>• Early Termination:</strong> Penalties and conditions</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Rules & Maintenance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>• Quiet Hours:</strong> Noise restrictions</p>
                  <p><strong>• Guest Policy:</strong> Overnight guest rules</p>
                  <p><strong>• Smoking Policy:</strong> Smoking restrictions</p>
                  <p><strong>• Decorations:</strong> Wall hanging and modification rules</p>
                </div>
                <div>
                  <p><strong>• Maintenance Requests:</strong> How to report issues</p>
                  <p><strong>• Emergency Procedures:</strong> Contact information</p>
                  <p><strong>• Move-out Requirements:</strong> Cleaning and inspection</p>
                  <p><strong>• Property Access:</strong> Landlord entry rights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Best Practices for Lease Management
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Documentation</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Keep all lease versions and amendments</li>
                <li>• Document all communications and changes</li>
                <li>• Store signed leases securely</li>
                <li>• Maintain digital and physical copies</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Provide clear lease explanations</li>
                <li>• Answer tenant questions promptly</li>
                <li>• Send renewal notices early</li>
                <li>• Maintain professional communication</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Compliance</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Stay updated on local laws</li>
                <li>• Use legally compliant templates</li>
                <li>• Regular legal reviews</li>
                <li>• Follow fair housing guidelines</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Organization</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Use consistent naming conventions</li>
                <li>• Set up automated reminders</li>
                <li>• Regular lease audits</li>
                <li>• Centralized document storage</li>
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

            <Link 
              href="/support/add-tenants"
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-6 text-left transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Adding New Tenants</h3>
                  <p className="text-gray-600 text-sm mt-1">Complete tenant management guide</p>
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
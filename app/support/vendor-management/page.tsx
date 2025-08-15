'use client'

import Link from 'next/link'
import { 
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PhoneIcon,
  DocumentTextIcon,
  StarIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export default function VendorManagementPage() {
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
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserGroupIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Working with Vendors & Service Providers
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to effectively manage relationships with contractors, technicians, 
              and service providers to ensure quality work and reliable property maintenance.
            </p>
          </div>
        </div>
      </div>

      {/* Vendor Management Overview */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-purple-900 mb-3">
              Why Vendor Management Matters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-800">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Ensure quality work and reliable service</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Maintain competitive pricing and terms</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Build long-term professional relationships</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Streamline maintenance and repair processes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Selection Process */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Vendor Selection & Vetting Process
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 1: Identify Service Needs</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Determine the specific service or repair needed</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Assess urgency and timeline requirements</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Define scope of work and quality expectations</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Set budget constraints and payment terms</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 2: Research & Recommendations</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Ask for referrals from other property managers</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Check online reviews and ratings</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Verify licensing and insurance requirements</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Research company history and experience</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 3: Request Quotes & Proposals</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Contact multiple vendors for the same service</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Provide detailed scope of work to each vendor</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Request written estimates with detailed breakdowns</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Ask about warranties, guarantees, and timelines</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 4: Evaluate & Select</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Compare pricing, quality, and service offerings</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Check references and past work examples</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Assess communication and responsiveness</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Consider long-term relationship potential</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Database Management */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Building Your Vendor Database
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Essential Vendor Information</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Company name and contact information</li>
                <li>• Primary contact person and phone/email</li>
                <li>• Services offered and specialties</li>
                <li>• Licensing and insurance details</li>
                <li>• Service areas and availability</li>
                <li>• Pricing structure and payment terms</li>
                <li>• Emergency contact procedures</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <StarIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Tracking</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Work quality ratings and feedback</li>
                <li>• Timeliness and reliability scores</li>
                <li>• Communication effectiveness</li>
                <li>• Cost competitiveness</li>
                <li>• Problem resolution success rate</li>
                <li>• Customer satisfaction ratings</li>
                <li>• Repeat business frequency</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Categories</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Plumbing and electrical services</li>
                <li>• HVAC maintenance and repair</li>
                <li>• General contractors and handymen</li>
                <li>• Landscaping and exterior work</li>
                <li>• Cleaning and janitorial services</li>
                <li>• Pest control and extermination</li>
                <li>• Emergency and 24/7 services</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Compliance & Safety</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• License verification and renewal dates</li>
                <li>• Insurance coverage and limits</li>
                <li>• Safety training and certifications</li>
                <li>• Background checks and screening</li>
                <li>• Drug testing policies</li>
                <li>• Safety record and incident history</li>
                <li>• Compliance with local regulations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Best Practices for Vendor Relationships
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Establish clear communication protocols</li>
                <li>• Provide detailed work specifications</li>
                <li>• Set expectations for timelines and quality</li>
                <li>• Maintain regular contact and updates</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Documentation</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Keep detailed records of all interactions</li>
                <li>• Document work orders and change orders</li>
                <li>• Maintain photo documentation of work</li>
                <li>• Save all invoices and payment records</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quality Control</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Inspect completed work thoroughly</li>
                <li>• Require warranties and guarantees</li>
                <li>• Follow up on any issues promptly</li>
                <li>• Provide feedback for improvement</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Relationship Building</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Pay invoices promptly and fairly</li>
                <li>• Provide positive feedback for good work</li>
                <li>• Offer repeat business opportunities</li>
                <li>• Refer vendors to other property managers</li>
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
              href="/support/maintenance-requests"
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-6 text-left transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Maintenance Requests</h3>
                  <p className="text-gray-600 text-sm mt-1">Creating and managing maintenance requests</p>
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
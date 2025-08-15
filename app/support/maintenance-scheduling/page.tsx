'use client'

import Link from 'next/link'
import { 
  CalendarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export default function MaintenanceSchedulingPage() {
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
              <CalendarIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Maintenance Scheduling & Workflow Optimization
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to efficiently schedule maintenance tasks, coordinate with vendors, 
              and optimize your property maintenance workflow for maximum efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* Scheduling Benefits */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              Benefits of Effective Maintenance Scheduling
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Reduce emergency repairs and costly breakdowns</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Optimize vendor availability and pricing</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Minimize tenant disruption and complaints</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Extend property lifespan and value</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Types of Maintenance Scheduling */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Types of Maintenance Scheduling
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Reactive Scheduling</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Responding to maintenance issues as they arise:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Emergency repairs and urgent issues</li>
                <li>• Tenant-reported problems</li>
                <li>• Unexpected equipment failures</li>
                <li>• Safety and security concerns</li>
              </ul>
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-red-800 text-xs font-medium">
                  While necessary, reactive maintenance is typically more expensive and disruptive than planned maintenance.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <CalendarIcon className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Preventive Scheduling</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Planned maintenance to prevent issues:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Regular system inspections</li>
                <li>• Seasonal maintenance tasks</li>
                <li>• Equipment servicing</li>
                <li>• Cleaning and upkeep</li>
              </ul>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-green-800 text-xs font-medium">
                  Preventive maintenance reduces costs and extends equipment lifespan.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <ChartBarIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Predictive Scheduling</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Data-driven maintenance based on condition monitoring:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Equipment performance monitoring</li>
                <li>• Wear and tear analysis</li>
                <li>• Usage pattern tracking</li>
                <li>• Predictive failure alerts</li>
              </ul>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-xs font-medium">
                  Predictive maintenance optimizes timing and reduces unnecessary work.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <UserGroupIcon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Condition-Based Scheduling</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Maintenance triggered by specific conditions:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Threshold-based triggers</li>
                <li>• Environmental condition monitoring</li>
                <li>• Performance degradation alerts</li>
                <li>• Custom condition rules</li>
              </ul>
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-purple-800 text-xs font-medium">
                  Condition-based scheduling ensures maintenance happens when needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creating a Maintenance Schedule */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How to Create an Effective Maintenance Schedule
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Assess Property Needs</h3>
              </div>
              <div className="ml-12 space-y-2 text-gray-600">
                <p>• Conduct a comprehensive property inspection</p>
                <p>• Review maintenance history and patterns</p>
                <p>• Identify critical systems and equipment</p>
                <p>• Assess tenant comfort and satisfaction levels</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Prioritize Tasks</h3>
              </div>
              <div className="ml-12 space-y-2 text-gray-600">
                <p>• Categorize tasks by urgency and importance</p>
                <p>• Consider safety implications and tenant impact</p>
                <p>• Factor in seasonal requirements and weather</p>
                <p>• Balance preventive vs. reactive maintenance needs</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Set Timelines</h3>
              </div>
              <div className="ml-12 space-y-2 text-gray-600">
                <p>• Establish frequency for recurring tasks</p>
                <p>• Schedule seasonal maintenance appropriately</p>
                <p>• Plan for vendor availability and coordination</p>
                <p>• Consider tenant schedules and access requirements</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Allocate Resources</h3>
              </div>
              <div className="ml-12 space-y-2 text-gray-600">
                <p>• Assign tasks to appropriate team members</p>
                <p>• Coordinate with preferred vendors</p>
                <p>• Budget for materials and labor costs</p>
                <p>• Plan for equipment and tool availability</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  5
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Monitor & Adjust</h3>
              </div>
              <div className="ml-12 space-y-2 text-gray-600">
                <p>• Track schedule adherence and completion rates</p>
                <p>• Gather feedback from tenants and vendors</p>
                <p>• Analyze maintenance costs and effectiveness</p>
                <p>• Adjust schedules based on performance data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Maintenance Calendar */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Seasonal Maintenance Calendar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Spring (March - May)</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• HVAC system inspection and cleaning</li>
                <li>• Roof inspection and gutter cleaning</li>
                <li>• Exterior painting and repairs</li>
                <li>• Landscaping and tree maintenance</li>
                <li>• Window and door weather stripping</li>
                <li>• Deck and patio inspections</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Summer (June - August)</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Air conditioning maintenance</li>
                <li>• Pool and outdoor area upkeep</li>
                <li>• Pest control treatments</li>
                <li>• Exterior lighting maintenance</li>
                <li>• Irrigation system checks</li>
                <li>• Fire safety system testing</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Fall (September - November)</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Heating system inspection</li>
                <li>• Chimney and fireplace cleaning</li>
                <li>• Insulation and weatherization</li>
                <li>• Leaf removal and drainage</li>
                <li>• Exterior door and window checks</li>
                <li>• Winter preparation tasks</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Winter (December - February)</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Heating system maintenance</li>
                <li>• Snow removal and ice prevention</li>
                <li>• Pipe insulation and freeze protection</li>
                <li>• Emergency system testing</li>
                <li>• Indoor air quality checks</li>
                <li>• Energy efficiency audits</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Best Practices for Maintenance Scheduling
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Planning & Organization</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Use digital tools for schedule management</li>
                <li>• Create detailed task descriptions</li>
                <li>• Set realistic timelines and expectations</li>
                <li>• Plan for contingencies and delays</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Notify tenants well in advance</li>
                <li>• Coordinate with vendors and contractors</li>
                <li>• Provide clear access instructions</li>
                <li>• Update schedules when changes occur</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Documentation</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Record all completed maintenance tasks</li>
                <li>• Document issues and resolutions</li>
                <li>• Track costs and time spent</li>
                <li>• Maintain vendor performance records</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Continuous Improvement</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Review schedule effectiveness regularly</li>
                <li>• Gather feedback from all stakeholders</li>
                <li>• Analyze maintenance data and trends</li>
                <li>• Adjust schedules based on results</li>
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
              href="/support/vendor-management"
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-6 text-left transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Vendor Management</h3>
                  <p className="text-gray-600 text-sm mt-1">Working with service providers</p>
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
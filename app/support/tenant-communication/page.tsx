'use client'

import Link from 'next/link'
import { 
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  BellIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function TenantCommunicationPage() {
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
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tenant Communication Strategies
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master effective communication with tenants to build positive relationships, 
              reduce conflicts, and improve property management efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* Communication Channels */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Communication Channels & Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <EnvelopeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Communication</h3>
              <p className="text-gray-600 text-sm">
                Professional email templates for announcements, reminders, and updates.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <PhoneIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone & Text</h3>
              <p className="text-gray-600 text-sm">
                Direct communication for urgent matters and personal touch.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BellIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Push Notifications</h3>
              <p className="text-gray-600 text-sm">
                Instant alerts for important updates and maintenance notifications.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">In-App Messaging</h3>
              <p className="text-gray-600 text-sm">
                Integrated messaging system within the tenant portal.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <DocumentTextIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Written Notices</h3>
              <p className="text-gray-600 text-sm">
                Formal notices for legal requirements and important announcements.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <ClockIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scheduled Updates</h3>
              <p className="text-gray-600 text-sm">
                Automated reminders and regular communication schedules.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Communication Best Practices */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Communication Best Practices
          </h2>

          <div className="space-y-8">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Professional Tone & Language</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Use clear, professional language in all communications</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Avoid jargon and technical terms when possible</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Maintain consistent voice and branding</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Proofread all messages before sending</span>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Timing & Frequency</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Respond to urgent matters within 24 hours</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Send routine updates at consistent intervals</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Avoid excessive communication that may overwhelm tenants</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use appropriate channels for different types of messages</span>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Content & Structure</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Use clear subject lines and headers</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Organize information with bullet points and sections</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Include clear call-to-action when needed</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Provide contact information for follow-up questions</span>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Documentation & Records</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Keep records of all communications</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Document important decisions and agreements</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Use templates for consistency and efficiency</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Maintain communication logs for legal purposes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Communication Templates */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Communication Templates & Examples
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Welcome Message</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                <p><strong>Subject:</strong> Welcome to [Property Name] - Important Move-in Information</p>
                <br />
                <p>Dear [Tenant Name],</p>
                <br />
                <p>Welcome to [Property Name]! We're excited to have you as a tenant and want to ensure your move-in process is smooth and enjoyable.</p>
                <br />
                <p><strong>Key Information:</strong></p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>Move-in date: [Date]</li>
                  <li>Rent due date: [Date]</li>
                  <li>Emergency contact: [Phone]</li>
                  <li>Maintenance portal: [URL]</li>
                </ul>
                <br />
                <p>Please don't hesitate to reach out if you have any questions.</p>
                <br />
                <p>Best regards,<br />[Your Name]<br />[Company Name]</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Update</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                <p><strong>Subject:</strong> Maintenance Update - [Issue Description]</p>
                <br />
                <p>Dear [Tenant Name],</p>
                <br />
                <p>We wanted to provide you with an update on the maintenance request you submitted for [issue description].</p>
                <br />
                <p><strong>Status:</strong> [Current Status]</p>
                <p><strong>Expected Completion:</strong> [Date/Time]</p>
                <p><strong>Next Steps:</strong> [What happens next]</p>
                <br />
                <p>We apologize for any inconvenience and appreciate your patience.</p>
                <br />
                <p>Thank you,<br />[Your Name]<br />[Company Name]</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rent Reminder</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                <p><strong>Subject:</strong> Friendly Reminder - Rent Due [Date]</p>
                <br />
                <p>Dear [Tenant Name],</p>
                <br />
                <p>This is a friendly reminder that your rent payment of $[Amount] is due on [Date].</p>
                <br />
                <p><strong>Payment Options:</strong></p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>Online portal: [URL]</li>
                  <li>Bank transfer: [Account details]</li>
                  <li>Check: [Mailing address]</li>
                </ul>
                <br />
                <p>Please ensure your payment is received by the due date to avoid late fees.</p>
                <br />
                <p>Thank you,<br />[Your Name]<br />[Company Name]</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Handling Difficult Situations */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Handling Difficult Communication Situations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-red-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Late Rent Payments</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Send gentle reminders before due date</li>
                <li>• Follow up immediately after due date</li>
                <li>• Offer payment plans when appropriate</li>
                <li>• Document all communication attempts</li>
                <li>• Maintain professional tone throughout</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Maintenance Complaints</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Acknowledge the issue promptly</li>
                <li>• Provide realistic timelines</li>
                <li>• Keep tenants updated on progress</li>
                <li>• Offer temporary solutions when possible</li>
                <li>• Follow up after completion</li>
              </ul>
            </div>

            <div className="border-l-4 border-yellow-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Noise Complaints</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Address complaints promptly</li>
                <li>• Investigate before taking action</li>
                <li>• Communicate with all parties involved</li>
                <li>• Document incidents and resolutions</li>
                <li>• Follow up to ensure resolution</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Lease Violations</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Document violations with evidence</li>
                <li>• Provide written notice of violations</li>
                <li>• Offer reasonable time to correct</li>
                <li>• Maintain professional communication</li>
                <li>• Follow legal procedures if needed</li>
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
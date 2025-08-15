import Link from 'next/link'
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

// Mock status data - in a real app, this would come from an API
const systemStatus = {
  overall: 'operational',
  lastUpdated: '2025-01-08T12:00:00Z',
  services: [
    {
      name: 'Web Application',
      status: 'operational',
      description: 'Main GustavoAI web platform',
      uptime: '99.99%',
      lastIncident: null
    },
    {
      name: 'API Services',
      status: 'operational',
      description: 'REST API and GraphQL endpoints',
      uptime: '99.95%',
      lastIncident: null
    },
    {
      name: 'Database',
      status: 'operational',
      description: 'Primary database and backups',
      uptime: '99.99%',
      lastIncident: null
    },
    {
      name: 'Payment Processing',
      status: 'operational',
      description: 'Stripe payment integration',
      uptime: '99.98%',
      lastIncident: null
    },
    {
      name: 'Email Services',
      status: 'operational',
      description: 'Transactional emails and notifications',
      uptime: '99.90%',
      lastIncident: null
    },
    {
      name: 'AI Services',
      status: 'operational',
      description: 'Machine learning and AI features',
      uptime: '99.85%',
      lastIncident: null
    }
  ],
  incidents: [
    {
      id: 'inc-001',
      title: 'Scheduled Maintenance - Database Optimization',
      status: 'resolved',
      severity: 'maintenance',
      startTime: '2025-01-07T02:00:00Z',
      endTime: '2025-01-07T04:00:00Z',
      description: 'Routine database maintenance and optimization completed successfully.',
      updates: [
        {
          time: '2025-01-07T04:00:00Z',
          message: 'Maintenance completed successfully. All services are operational.'
        },
        {
          time: '2025-01-07T02:00:00Z',
          message: 'Scheduled maintenance has begun. Some features may be temporarily unavailable.'
        }
      ]
    }
  ]
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    case 'degraded':
      return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
    case 'outage':
      return <XCircleIcon className="w-5 h-5 text-red-500" />
    case 'maintenance':
      return <ClockIcon className="w-5 h-5 text-blue-500" />
    default:
      return <InformationCircleIcon className="w-5 h-5 text-gray-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'operational':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'degraded':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'outage':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'maintenance':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'operational':
      return 'All Systems Operational'
    case 'degraded':
      return 'Partial System Outage'
    case 'outage':
      return 'Major System Outage'
    case 'maintenance':
      return 'Scheduled Maintenance'
    default:
      return 'Unknown Status'
  }
}

export default function StatusPage() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

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

      {/* Status Overview */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              System Status
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Real-time status of GustavoAI services and infrastructure
            </p>
            
            {/* Overall Status */}
            <div className={`inline-flex items-center px-6 py-3 rounded-full border ${getStatusColor(systemStatus.overall)}`}>
              {getStatusIcon(systemStatus.overall)}
              <span className="ml-2 font-semibold">
                {getStatusText(systemStatus.overall)}
              </span>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {formatDate(systemStatus.lastUpdated)}
            </p>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Service Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemStatus.services.map((service) => (
              <div key={service.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {service.description}
                    </p>
                  </div>
                  {getStatusIcon(service.status)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Uptime (30 days)</span>
                    <span className="font-medium">{service.uptime}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-medium ${getStatusColor(service.status).split(' ')[0]}`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Recent Incidents
          </h2>
          
          {systemStatus.incidents.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Recent Incidents
              </h3>
              <p className="text-gray-600">
                All systems have been running smoothly with no recent issues.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {systemStatus.incidents.map((incident) => (
                <div key={incident.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {incident.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(incident.startTime)} - {formatDate(incident.endTime)}
                        </span>
                      </div>
                    </div>
                    {getStatusIcon(incident.status)}
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {incident.description}
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Updates</h4>
                    {incident.updates.map((update, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm text-gray-600">{update.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(update.time)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subscribe to Updates */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Get notified about system status updates, maintenance windows, and incident reports.
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We'll only send you important system updates. Unsubscribe anytime.
              </p>
            </div>
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
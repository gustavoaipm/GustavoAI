import Link from 'next/link'
import { 
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  VideoCameraIcon,
  UserGroupIcon,
  CogIcon
} from '@heroicons/react/24/outline'

const supportCategories = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of GustavoAI',
    icon: BookOpenIcon,
    color: 'bg-blue-500',
    articles: [
      { title: 'Quick Start Guide', href: '/support/getting-started' },
      { title: 'Setting Up Your First Property', href: '/support/first-property' },
      { title: 'Inviting Your First Tenant', href: '/support/invite-tenant' }
    ]
  },
  {
    title: 'Tenant Management',
    description: 'Manage tenants and leases effectively',
    icon: UserGroupIcon,
    color: 'bg-green-500',
    articles: [
      { title: 'Adding New Tenants', href: '/support/add-tenants' },
      { title: 'Managing Lease Agreements', href: '/support/lease-management' },
      { title: 'Tenant Communication', href: '/support/tenant-communication' }
    ]
  },

  {
    title: 'Maintenance Requests',
    description: 'Streamline maintenance workflows',
    icon: CogIcon,
    color: 'bg-orange-500',
    articles: [
      { title: 'Creating Maintenance Requests', href: '/support/maintenance-requests' },
      { title: 'Working with Vendors', href: '/support/vendor-management' },
      { title: 'Maintenance Scheduling', href: '/support/maintenance-scheduling' }
    ]
  }
]

const featuredArticles = [
  {
    title: 'How to Set Up Your First Property',
    excerpt: 'Step-by-step guide to adding your first property to GustavoAI',
    readTime: '5 min read',
    href: '/support/first-property'
  },
  {
    title: 'Getting Started with GustavoAI',
    excerpt: 'Complete guide to setting up your account and first steps',
    readTime: '8 min read',
    href: '/support/getting-started'
  },
  {
    title: 'Tenant Invitation Process',
    excerpt: 'Learn how to invite and onboard new tenants effectively',
    readTime: '6 min read',
    href: '/support/invite-tenant'
  }
]

export default function SupportPage() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Find answers to common questions, learn best practices, and get the most out of GustavoAI.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles, guides, and more..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Categories */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportCategories.map((category) => (
              <div key={category.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                <ul className="space-y-2">
                  {category.articles.map((article) => (
                    <li key={article.title}>
                      <Link 
                        href={article.href}
                        className="text-primary-600 hover:text-primary-700 text-sm block"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Articles - Commented out for now */}
      {/*
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Featured Articles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <div key={article.title} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  <Link href={article.href} className="hover:text-primary-600">
                    {article.title}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                  <Link 
                    href={article.href}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      */}

      {/* Contact Support */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still need help?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Our support team is here to help you get the most out of GustavoAI.
            </p>
            
            <Link 
              href="/support/contact"
              className="inline-flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Contact Support
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
import Link from 'next/link'
import { 
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  HeartIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

const openPositions = []

const benefits = [
  {
    icon: HeartIcon,
    title: 'Health & Wellness',
    description: 'Comprehensive health, dental, and vision coverage for you and your family.'
  },
  {
    icon: AcademicCapIcon,
    title: 'Learning & Development',
    description: 'Annual learning budget, conference attendance, and professional development opportunities.'
  },
  {
    icon: MapPinIcon,
    title: 'Flexible Work',
    description: 'Hybrid work model with flexible hours and remote work options.'
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Competitive Compensation',
    description: 'Competitive salary, equity options, and performance-based bonuses.'
  },
  {
    icon: UserGroupIcon,
    title: 'Team Events',
    description: 'Regular team building activities, happy hours, and company retreats.'
  },
  {
    icon: SparklesIcon,
    title: 'Modern Tools',
    description: 'Latest hardware, software, and tools to help you do your best work.'
  }
]

const values = [
  {
    title: 'Customer Obsession',
    description: 'Everything we do starts with our customers. We listen, learn, and build solutions that truly serve their needs.'
  },
  {
    title: 'Innovation First',
    description: 'We constantly push boundaries and embrace new technologies to solve complex problems in property management.'
  },
  {
    title: 'Collaboration',
    description: 'We believe the best solutions come from diverse teams working together with mutual respect and open communication.'
  },
  {
    title: 'Growth Mindset',
    description: 'We encourage continuous learning, experimentation, and personal development for every team member.'
  }
]

export default function CareersPage() {
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
              <Link href="/#features" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Features
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Link href="/blog" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Blog
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
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Help us revolutionize property management through intelligent AI technology. We're building the future, one property at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#open-positions" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
                View Open Positions
              </a>
              <Link href="/about" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Culture Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Culture
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building a team of passionate individuals who believe in the power of technology to transform traditional industries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Benefits & Perks
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in taking care of our team. Here's what we offer to help you thrive both personally and professionally.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div id="open-positions" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're always looking for talented individuals who are passionate about revolutionizing property management through technology.
            </p>
          </div>
          
          <div className="text-center py-12">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserGroupIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No Open Positions Right Now
              </h3>
              <p className="text-gray-600 mb-8">
                We don't have any specific positions open at the moment, but we're always interested in hearing from talented individuals who are passionate about our mission. Send us your resume and let's start a conversation about how you could contribute to our team.
              </p>
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Send General Application
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Process */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Application Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've designed our hiring process to be transparent, efficient, and focused on finding the right fit for both you and our team.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Apply</h3>
              <p className="text-gray-600 text-sm">
                Submit your application with resume and cover letter
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Initial Call</h3>
              <p className="text-gray-600 text-sm">
                30-minute conversation to learn about your background
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Interview</h3>
              <p className="text-gray-600 text-sm">
                Skills assessment and technical discussion
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-lg">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Interview</h3>
              <p className="text-gray-600 text-sm">
                Meet the team and discuss culture fit
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join Us?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Don't see the perfect role? We're always looking for talented individuals. Send us your resume and let's start a conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
              Send General Application
            </button>
            <Link href="/about" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
              Learn More About Us
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
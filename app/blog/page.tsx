import Link from 'next/link'
import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const featuredPost = {
  title: 'The Future of Property Management: How AI is Transforming the Industry',
  excerpt: 'Discover how artificial intelligence is revolutionizing property management, from automated rent collection to predictive maintenance and intelligent tenant screening.',
  author: 'Sarah Johnson',
  date: '2025-01-08',
  readTime: '8 min read',
  category: 'Industry Insights',
  image: '/blog/ai-future.jpg',
  slug: 'future-of-property-management-ai'
}

const blogPosts = [
  {
    title: '10 Essential Tips for First-Time Property Investors',
    excerpt: 'Starting your property investment journey? Learn the fundamental strategies and best practices that every new investor should know.',
    author: 'Michael Chen',
    date: '2025-01-06',
    readTime: '6 min read',
    category: 'Investment Tips',
    image: '/blog/first-time-investors.jpg',
    slug: 'first-time-property-investors-tips'
  },
  {
    title: 'Maximizing Rental Income: Strategies That Actually Work',
    excerpt: 'Explore proven strategies to increase your rental income while maintaining tenant satisfaction and property value.',
    author: 'Emily Rodriguez',
    date: '2025-01-04',
    readTime: '7 min read',
    category: 'Revenue Optimization',
    image: '/blog/rental-income.jpg',
    slug: 'maximizing-rental-income-strategies'
  },
  {
    title: 'Building Strong Tenant Relationships: A Complete Guide',
    excerpt: 'Learn how to foster positive relationships with your tenants, leading to longer tenancies and better property care.',
    author: 'David Kim',
    date: '2025-01-02',
    readTime: '5 min read',
    category: 'Tenant Management',
    image: '/blog/tenant-relationships.jpg',
    slug: 'building-strong-tenant-relationships'
  },
  {
    title: 'Property Maintenance: Preventive vs. Reactive Approaches',
    excerpt: 'Compare preventive and reactive maintenance strategies to find the best approach for your property portfolio.',
    author: 'Sarah Johnson',
    date: '2024-12-30',
    readTime: '9 min read',
    category: 'Maintenance',
    image: '/blog/maintenance-approaches.jpg',
    slug: 'preventive-vs-reactive-maintenance'
  },
  {
    title: 'Digital Transformation in Real Estate: What You Need to Know',
    excerpt: 'Stay ahead of the curve with insights into the latest digital trends transforming the real estate industry.',
    author: 'Michael Chen',
    date: '2024-12-28',
    readTime: '6 min read',
    category: 'Technology',
    image: '/blog/digital-transformation.jpg',
    slug: 'digital-transformation-real-estate'
  },
  {
    title: 'Tax Strategies for Property Investors: 2025 Edition',
    excerpt: 'Navigate the latest tax regulations and discover strategies to optimize your property investment returns.',
    author: 'Emily Rodriguez',
    date: '2024-12-26',
    readTime: '8 min read',
    category: 'Tax & Finance',
    image: '/blog/tax-strategies.jpg',
    slug: 'tax-strategies-property-investors-2025'
  }
]

const categories = [
  { name: 'Industry Insights', count: 12, color: 'bg-blue-100 text-blue-800' },
  { name: 'Investment Tips', count: 8, color: 'bg-green-100 text-green-800' },
  { name: 'Tenant Management', count: 15, color: 'bg-purple-100 text-purple-800' },
  { name: 'Maintenance', count: 10, color: 'bg-orange-100 text-orange-800' },
  { name: 'Technology', count: 6, color: 'bg-indigo-100 text-indigo-800' },
  { name: 'Tax & Finance', count: 9, color: 'bg-red-100 text-red-800' }
]

export default function BlogPage() {
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
              <Link href="/careers" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Careers
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              GustavoAI Blog
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Insights, tips, and strategies for modern property management. Stay ahead of the curve with expert advice from industry leaders.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-gray-200 h-64 lg:h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                  <p>Featured Image</p>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {featuredPost.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  <Link href={`/blog/${featuredPost.slug}`} className="hover:text-primary-600">
                    {featuredPost.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <Link 
                    href={`/blog/${featuredPost.slug}`}
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                  >
                    <span>Read more</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group"
              >
                <div className={`px-4 py-3 rounded-lg text-center hover:shadow-md transition-shadow ${category.color}`}>
                  <div className="font-medium mb-1">{category.name}</div>
                  <div className="text-sm opacity-75">{category.count} articles</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Articles */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                    <p className="text-sm">Article Image</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary-600">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <UserIcon className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/blog/all"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Get the latest property management insights, tips, and industry news delivered to your inbox.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex space-x-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-transparent rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:border-transparent"
              />
              <button className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-primary-100 mt-2">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
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
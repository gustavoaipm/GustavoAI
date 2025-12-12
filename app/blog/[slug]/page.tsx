'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { blogUtils, BlogArticle } from '@/lib/blog-utils'

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [article, setArticle] = useState<BlogArticle | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        
        // Fetch the article by slug
        const articleData = await blogUtils.getArticleBySlug(slug)
        if (!articleData) {
          router.push('/blog')
          return
        }
        
        setArticle(articleData)

        // Fetch related articles
        const related = await blogUtils.getRelatedArticles(slug, articleData.category, 3)
        setRelatedArticles(related)

      } catch (error) {
        console.error('Error fetching article:', error)
        router.push('/blog')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchArticle()
    }
  }, [slug, router])

  // Helper function to parse markdown content
  const parseMarkdownContent = (content: string) => {
    return content
      // Convert headers (process from most specific to least specific)
      .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-gray-900 mt-10 mb-6">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-12 mb-8">$1</h1>')
      // Convert bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // Convert italic text
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Convert markdown links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline font-medium">$1</a>')
      // Convert unordered lists
      .replace(/^- (.*$)/gim, '<li class="text-gray-700 mb-2">$1</li>')
      // Convert ordered lists
      .replace(/^\d+\. (.*$)/gim, '<li class="text-gray-700 mb-2">$1</li>')
      // Convert line breaks to paragraphs
      .split('\n\n')
      .map(paragraph => {
        const trimmed = paragraph.trim()
        if (trimmed.startsWith('<h') || trimmed.startsWith('<a') || trimmed.startsWith('<li')) {
          return trimmed
        }
        // Handle list items
        if (trimmed.includes('<li class=')) {
          const listItems = trimmed.split('\n').filter(line => line.includes('<li'))
          if (listItems.length > 0) {
            return `<ul class="list-disc list-inside mb-6 space-y-2">${listItems.join('')}</ul>`
          }
        }
        return `<p class="text-gray-700 mb-6 leading-relaxed">${trimmed}</p>`
      })
      .join('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link href="/blog" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
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
              <Link href="/blog" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Blog
              </Link>
              <Link href="/#features" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Features
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

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/blog" className="text-gray-500 hover:text-gray-700 flex items-center">
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to Blog
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Article Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                article.category === 'Technology' ? 'bg-indigo-100 text-indigo-800' :
                article.category === 'Industry Insights' ? 'bg-blue-100 text-blue-800' :
                article.category === 'Investment Tips' ? 'bg-green-100 text-green-800' :
                article.category === 'Tenant Management' ? 'bg-purple-100 text-purple-800' :
                article.category === 'Maintenance' ? 'bg-orange-100 text-orange-800' :
                article.category === 'Tax & Finance' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {article.category}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {article.excerpt}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4" />
                <span>{new Date(article.published_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4" />
                <span>{article.read_time}</span>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: parseMarkdownContent(article.content) 
              }}
            />
          </div>

          {/* Article Footer */}
          <div className="p-8 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Share this article</h3>
                <p className="text-sm text-gray-600">Help others discover this content</p>
              </div>
              <div className="flex space-x-3">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <article key={relatedArticle.slug} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gray-200 h-48 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                      <p className="text-sm">Article Image</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        relatedArticle.category === 'Technology' ? 'bg-indigo-100 text-indigo-700' :
                        relatedArticle.category === 'Industry Insights' ? 'bg-blue-100 text-blue-700' :
                        relatedArticle.category === 'Investment Tips' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {relatedArticle.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      <Link href={`/blog/${relatedArticle.slug}`} className="hover:text-primary-600">
                        {relatedArticle.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {relatedArticle.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-3 h-3" />
                          <span>{relatedArticle.read_time}</span>
                        </div>
                      </div>
                      <Link 
                        href={`/blog/${relatedArticle.slug}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <span>Read more</span>
                        <ArrowRightIcon className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

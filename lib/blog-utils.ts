import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface BlogArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string // Plain text content
  author: string
  category: string
  featured: boolean
  published: boolean
  published_at: string
  read_time: string
  image_url?: string
  meta_description?: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface BlogCategory {
  name: string
  count: number
  color: string
}

// Helper function to convert markdown links to HTML
export const parseMarkdownLinks = (text: string): string => {
  // Convert markdown links [text](url) to HTML
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline">$1</a>')
}

export const blogUtils = {
  // Get all published blog articles
  async getAllArticles(): Promise<BlogArticle[]> {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog articles:', error)
      return []
    }

    return data || []
  },

  // Get featured article
  async getFeaturedArticle(): Promise<BlogArticle | null> {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching featured article:', error)
      return null
    }

    return data
  },

  // Get articles by category
  async getArticlesByCategory(category: string): Promise<BlogArticle[]> {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('published', true)
      .eq('category', category)
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching articles by category:', error)
      return []
    }

    return data || []
  },

  // Get single article by slug
  async getArticleBySlug(slug: string): Promise<BlogArticle | null> {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('published', true)
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching article by slug:', error)
      return null
    }

    return data
  },

  // Get article categories with counts
  async getCategories(): Promise<BlogCategory[]> {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('category')
      .eq('published', true)

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    // Count articles per category
    const categoryCounts = data?.reduce((acc: Record<string, number>, article) => {
      acc[article.category] = (acc[article.category] || 0) + 1
      return acc
    }, {}) || {}

    // Define category colors
    const categoryColors: Record<string, string> = {
      'Industry Insights': 'bg-blue-100 text-blue-800',
      'Investment Tips': 'bg-green-100 text-green-800',
      'Tenant Management': 'bg-purple-100 text-purple-800',
      'Maintenance': 'bg-orange-100 text-orange-800',
      'Technology': 'bg-indigo-100 text-indigo-800',
      'Tax & Finance': 'bg-red-100 text-red-800'
    }

    // Return all categories with counts
    const allCategories = [
      'Industry Insights',
      'Investment Tips',
      'Tenant Management',
      'Maintenance',
      'Technology',
      'Tax & Finance'
    ]

    return allCategories.map(category => ({
      name: category,
      count: categoryCounts[category] || 0,
      color: categoryColors[category] || 'bg-gray-100 text-gray-800'
    }))
  },

  // Search articles
  async searchArticles(query: string): Promise<BlogArticle[]> {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error searching articles:', error)
      return []
    }

    return data || []
  },

  // Get related articles (by category, excluding current article)
  async getRelatedArticles(currentSlug: string, category: string, limit: number = 3): Promise<BlogArticle[]> {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('published', true)
      .eq('category', category)
      .neq('slug', currentSlug)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching related articles:', error)
      return []
    }

    return data || []
  }
}

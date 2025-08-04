import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { NotificationProvider } from '@/lib/notification-context'
import NotificationContainer from '@/app/components/NotificationContainer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GustavoAI - AI Property Manager',
  description: 'Intelligent property management platform that automates tenant management, rent collection, and maintenance scheduling.',
  keywords: 'property management, AI, automation, tenant management, rent collection',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
            <NotificationContainer />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 
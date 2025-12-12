import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { NotificationProvider } from '@/lib/notification-context'
import NotificationContainer from '@/app/components/NotificationContainer'
import ComingSoon from '@/app/components/ComingSoon'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GustavoAI - AI-Powered Property Management',
  description: 'Intelligent property management platform with AI assistance for tenant management, rent collection, and maintenance scheduling.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === 'true'

  return (
    <html lang="en">
      <head>
        {/* Prevent MetaMask from trying to connect */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent MetaMask auto-connection attempts
              if (typeof window !== 'undefined' && window.ethereum) {
                // Override ethereum.request to prevent connection attempts
                const originalRequest = window.ethereum.request;
                window.ethereum.request = function(args) {
                  if (args.method === 'eth_requestAccounts' || args.method === 'eth_accounts') {
                    return Promise.reject(new Error('This application does not support Web3 connections'));
                  }
                  return originalRequest.call(this, args);
                };
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {isComingSoon ? (
          <ComingSoon />
        ) : (
          <AuthProvider>
            <NotificationProvider>
              <div className="min-h-screen bg-gray-50">{children}</div>
              <NotificationContainer />
            </NotificationProvider>
          </AuthProvider>
        )}
      </body>
    </html>
  )
} 
'use client'

import { useMemo, useState } from 'react'
import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ComingSoon() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState<string>('')

  const emailError = useMemo(() => {
    if (!email) return ''
    const parsed = emailSchema.safeParse(email)
    return parsed.success ? '' : parsed.error.issues[0]?.message || 'Invalid email'
  }, [email])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const parsed = emailSchema.safeParse(email)
    if (!parsed.success) {
      setStatus('error')
      setMessage(parsed.error.issues[0]?.message || 'Please enter a valid email address')
      return
    }

    setStatus('submitting')
    setMessage('')

    try {
      const res = await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsed.data }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setStatus('error')
        setMessage(data?.error || 'Something went wrong. Please try again.')
        return
      }

      setStatus('success')
      setMessage(data?.message || "Thanks — you're on the list!")
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 sm:p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
              GustavoAI
            </div>
            <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Something amazing is coming soon
            </h1>
            <p className="mt-3 text-gray-600">
              We&apos;re building an AI-powered property management platform. Leave your email and we&apos;ll let you know when we launch.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="input-field"
                  aria-invalid={!!emailError}
                />
                {emailError ? <p className="mt-2 text-sm text-red-600">{emailError}</p> : null}
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Joining…' : 'Notify me'}
              </button>
            </div>

            {message ? (
              <div
                className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
                  status === 'success'
                    ? 'border-green-200 bg-green-50 text-green-800'
                    : status === 'error'
                      ? 'border-red-200 bg-red-50 text-red-800'
                      : 'border-gray-200 bg-gray-50 text-gray-800'
                }`}
              >
                {message}
              </div>
            ) : null}
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
            <p>In the meantime, we&apos;re heads down building.</p>
          </div>
        </div>
      </div>
    </div>
  )
}



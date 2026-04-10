'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useFirebaseAuth } from '@/lib/firebase-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { sendOTP, verifyOTP, user } = useFirebaseAuth()

  useEffect(() => {
    // If user is already logged in, redirect to order page
    if (user) {
      router.push('/order')
    }

    // Check if this is the OTP verification callback
    const emailParam = searchParams.get('email')
    if (emailParam && window.location.href.includes('oobCode')) {
      handleOtpVerification(emailParam)
    }
  }, [user, router, searchParams])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address')
        setLoading(false)
        return
      }
      
      await sendOTP(email)
      setOtpSent(true)
      setSuccess(`OTP sent to ${email}. Please check your email and click the link to verify.`)
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerification = async (emailFromParam: string) => {
    try {
      await verifyOTP(emailFromParam)
      setSuccess('Email verified successfully! Redirecting...')
      setTimeout(() => router.push('/order'), 2000)
    } catch (err: any) {
      setError('Verification failed. Please try again.')
    }
  }

  const handleResendOtp = async () => {
    setLoading(true)
    setError('')
    try {
      await sendOTP(email)
      setSuccess(`OTP resent to ${email}`)
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <Header />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6 font-semibold"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <Card className="p-8 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-3xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                Welcome to DUM & DONE
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {otpSent ? 'Check your email for the verification link' : 'Sign in or create an account with your email'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">
                {success}
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-white/20 rounded-lg focus:outline-none focus:border-amber-600"
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP via Email'}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-lg">
                  <p className="text-sm text-amber-900 dark:text-amber-200">
                    We&apos;ve sent a verification link to <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-300 mt-2">
                    Click the link in the email to verify your account and log in.
                  </p>
                </div>

                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full text-center py-3 px-4 text-amber-600 hover:text-amber-700 font-semibold border border-amber-600 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                >
                  {loading ? 'Resending...' : 'Resend OTP'}
                </button>

                <button
                  onClick={() => {
                    setOtpSent(false)
                    setEmail('')
                    setError('')
                    setSuccess('')
                  }}
                  className="w-full text-center py-3 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  Use Different Email
                </button>
              </div>
            )}

            <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}

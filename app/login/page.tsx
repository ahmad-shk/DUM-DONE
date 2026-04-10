'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useFirebaseAuth } from '@/lib/firebase-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ArrowLeft, Mail, Shield, Loader2 } from 'lucide-react'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [countdown, setCountdown] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { sendOTP, verifyOTP, user } = useFirebaseAuth()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (user) {
      router.push('/order')
    }

    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [user, router, searchParams])

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

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
      setCountdown(60) // 60 seconds cooldown
      setSuccess(`OTP sent to ${email}. Please check your email.`)
      
      // Focus first OTP input
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    
    // Auto-verify when all digits are entered
    if (value && index === 5 && newOtp.every(digit => digit !== '')) {
      handleVerifyOtp(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      handleVerifyOtp(pastedData)
    }
  }

  const handleVerifyOtp = async (otpString: string) => {
    setLoading(true)
    setError('')
    
    try {
      const result = await verifyOTP(email, otpString)
      
      if (result.success) {
        setSuccess(result.message)
        setTimeout(() => router.push('/order'), 1500)
      } else {
        setError(result.message)
        // Clear OTP on error
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return
    
    setLoading(true)
    setError('')
    setOtp(['', '', '', '', '', ''])
    
    try {
      await sendOTP(email)
      setCountdown(60)
      setSuccess(`OTP resent to ${email}`)
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6 font-semibold"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <Card className="p-8 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-3xl">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            {otpSent ? (
              <Shield className="w-8 h-8 text-amber-600" />
            ) : (
              <Mail className="w-8 h-8 text-amber-600" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            {otpSent ? 'Enter OTP' : 'Welcome'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {otpSent 
              ? `Enter the 6-digit code sent to ${email}` 
              : 'Sign in or create an account with your email'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm text-center">
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
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={loading}
                  className="w-12 h-14 text-center text-2xl font-bold bg-white dark:bg-black border-2 border-gray-300 dark:border-white/20 rounded-lg focus:outline-none focus:border-amber-600 transition-colors disabled:opacity-50"
                />
              ))}
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-2 text-amber-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </div>
            )}

            {/* Resend OTP */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Resend OTP in <span className="font-bold text-amber-600">{countdown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-amber-600 hover:text-amber-700 font-semibold text-sm"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setOtpSent(false)
                setOtp(['', '', '', '', '', ''])
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
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <Header />
      <div className="pt-32 pb-20 px-4">
        <Suspense fallback={
          <div className="max-w-md mx-auto">
            <Card className="p-8 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-3xl">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                <span className="text-gray-600 dark:text-gray-400">Loading...</span>
              </div>
            </Card>
          </div>
        }>
          <LoginContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}

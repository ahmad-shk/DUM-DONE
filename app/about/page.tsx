'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useLanguage } from '@/lib/language-provider'
import { translations } from '@/lib/translations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  UtensilsCrossed,
  Leaf,
  Truck,
  Heart,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle
} from 'lucide-react'

export default function AboutPage() {
  const { lang } = useLanguage()
  const t = translations[lang].aboutPage
  const contact = translations[lang].contact

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const featureIcons = [Leaf, UtensilsCrossed, Truck, Heart]

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <Header />

      {/* Hero Section */}
      <section className="pt-28 md:pt-36 pb-16 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-900/10 dark:to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white font-serif mb-4">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl text-amber-600 dark:text-amber-500 font-medium">
              {t.subtitle}
            </p>
          </div>

          {/* Hero Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/biryani.png"
                alt="Signature Biryani"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl md:mt-12 border-4 border-white/10">
              <Image
                src="/palak_paneer.png"
                alt="Fresh Palak Paneer"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/chapli-kabab.png"
                alt="Authentic Kabab"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Description */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-serif italic">
            {t.description}
          </p>
        </div>
      </section>

      {/* Our Story & Mission */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Our Story */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100 dark:border-zinc-800">
              <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white font-serif mb-4">
                {t.ourStory}
              </h2>
              <div className="w-16 h-1 bg-amber-500 mb-6" />
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t.storyText}
              </p>
            </div>

            {/* Our Mission */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100 dark:border-zinc-800">
              <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white font-serif mb-4">
                {t.ourMission}
              </h2>
              <div className="w-16 h-1 bg-amber-500 mb-6" />
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t.missionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black dark:text-white font-serif mb-12">
            {t.whyChooseUs}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.features.map((feature, index) => {
              const Icon = featureIcons[index]
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-6 text-center shadow-md border border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                    <Icon className="w-7 h-7 text-amber-600 dark:text-amber-500" />
                  </div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#141414] rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Hours */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{contact.hours}</h3>
                <p className="text-gray-400 text-sm whitespace-pre-line">{contact.hoursText}</p>
              </div>

              {/* Address */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{contact.address}</h3>
                <p className="text-gray-400 text-sm whitespace-pre-line">{contact.addressText}</p>
              </div>

              {/* Phone */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Phone</h3>
                <a href={`tel:${contact.phone}`} className="text-gray-400 text-sm hover:text-amber-500 transition-colors">
                  {contact.phone}
                </a>
              </div>

              {/* Email */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Email</h3>
                <a href={`mailto:${contact.email}`} className="text-gray-400 text-sm hover:text-amber-500 transition-colors break-all">
                  {contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-zinc-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white font-serif mb-3">
              {t.contactForm.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t.contactForm.subtitle}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 dark:border-zinc-800">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-500" />
                </div>
                <p className="text-lg text-green-600 dark:text-green-500 font-medium">
                  {t.contactForm.success}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t.contactForm.name}
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl"
                      placeholder={t.contactForm.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t.contactForm.email}
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl"
                      placeholder={t.contactForm.email}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t.contactForm.phone}
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl"
                      placeholder={t.contactForm.phone}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t.contactForm.subject}
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl"
                      placeholder={t.contactForm.subject}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.contactForm.message}
                  </label>
                  <Textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl resize-none"
                    placeholder={t.contactForm.message}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      {t.contactForm.submit}
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

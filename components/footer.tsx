'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/use-language'
import { translations } from '@/lib/translations'
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  const { lang } = useLanguage()
  const t = translations[lang].footer

  return (
    <footer className="bg-gray-100 dark:bg-[#0A0A0A] text-black dark:text-white py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-amber-600 dark:text-amber-500">
              {lang === 'en' ? 'About Us' : 'ہمارے بارے میں'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {lang === 'en'
                ? 'Authentic Pakistani cuisine delivered to your door with fresh ingredients, desi flavors, and traditional recipes.'
                : 'مستند پاکستانی کھانا آپ کے دروازے پر پہنچایا گیا۔ تازہ اجزاء، اور اصلی دیسی ذائقے۔'}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-amber-600 dark:text-amber-500">
              {lang === 'en' ? 'Quick Links' : 'فوری روابط'}
            </h3>
            <div className="flex flex-col space-y-2 text-sm">
              <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                {t.home}
              </Link>
              <Link href="/menu" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                {t.menu}
              </Link>
              <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                {t.about}
              </Link>
              <Link href="/order" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                {t.booking}
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-amber-600 dark:text-amber-500">
              {lang === 'en' ? 'Contact' : 'ہم سے رابطہ کریں۔'}
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+92-3084948853</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>dumanddone.restaurant@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>DHA RAHBAR PHASE 11
                  SECtOR 1, LAHORE</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-amber-600 dark:text-amber-500">
              {lang === 'en' ? 'Follow Us' : 'ہمیں فالو کریں'}
            </h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-2xl font-black text-black dark:text-white p-4">
              <img
                src="../DUM_AND_DONE_LOGO-.png"
                alt="Dum and Dun Kitchen Logo"
                style={{ width: '600px', height: '180px' }} // Dono dimensions barha diye hain
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-right">
              {lang === 'en'
                ? '© 2024 DUM & DONE. All rights reserved.'
                : '© 2024 DUM & DONE. جملہ حقوق محفوظ ہیں۔'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

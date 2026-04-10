"use client"

import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"

export function Contact() {
  const { lang } = useLanguage()
  const t = translations[lang].contact

  return (
    <section id="contact" className="py-16 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Dark Card - Hamesha premium dark look mein rahega */}
        <div className="bg-[#141414] rounded-[2rem] p-10 md:p-16 shadow-2xl border border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-8 md:gap-0">
            
            {/* Column 1: Opening Hours */}
            <div className="flex flex-col items-start space-y-3">
              <h3 className="text-3xl font-medium text-white font-serif">
                {t.hours}
              </h3>
              <div className="text-gray-300 text-sm md:text-base leading-snug whitespace-pre-line">
                {t.hoursText}
              </div>
            </div>

            {/* Divider 1 */}
            <div className="hidden md:block w-[1px] bg-zinc-800 h-32 mx-12" />

            {/* Column 2: Address */}
            <div className="flex flex-col items-start space-y-3">
              <h3 className="text-3xl font-medium text-white font-serif">
                {t.address}
              </h3>
              <div className="text-gray-300 text-sm md:text-base leading-snug whitespace-pre-line uppercase tracking-wide">
                {t.addressText}
              </div>
            </div>

            {/* Divider 2 */}
            <div className="hidden md:block w-[1px] bg-zinc-800 h-32 mx-12" />

            {/* Column 3: Email & Phone */}
            <div className="flex flex-col items-start space-y-3">
              <h3 className="text-3xl font-medium text-white font-serif">
                {t.contactTitle}
              </h3>
              <div className="text-gray-300 text-sm md:text-base leading-snug space-y-1">
                <p>
                  <span className="text-white font-semibold">Phone:</span> {t.phone}
                </p>
                <p>
                  <span className="text-white font-semibold">Email:</span> {t.email}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
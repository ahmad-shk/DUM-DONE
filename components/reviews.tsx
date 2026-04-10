"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"

export function Reviews() {
  const { lang } = useLanguage()
  const t = translations[lang].reviews

  return (
    /* Section background theme ke mutabiq switch hoga */
    <section className="py-16 md:py-24 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Card: Image ki tarah dark background hamesha rahega */}
        <div className="bg-[#181818] rounded-[3rem] overflow-hidden p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center shadow-2xl border border-white/5">

          {/* Left Side: Text Content */}
          <div className="flex-1 flex flex-col justify-between h-full w-full order-2 md:order-1 px-4 md:px-6">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-4xl font-bold text-white font-serif leading-tight">
                {t.title}
              </h2>

              <div className="pt-8 md:pt-12 space-y-4">
                {/* Stars: Exact Gold color */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-lg md:text-2xl text-white font-medium leading-relaxed max-w-lg">
                  "{t.testimonial}"
                </p>

                {/* Customer Name (Optional but adds value) */}
                <p className="text-amber-500 font-semibold tracking-wide uppercase text-sm">
                  — Alex Johnson
                </p>
              </div>
            </div>

            {/* Navigation Arrows: Bottom placement */}
            <div className="flex gap-4 mt-10 md:mt-16">
              <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all group shadow-lg active:scale-90">
                <ChevronLeft className="text-black group-hover:text-white w-6 h-6" />
              </button>
              <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all group shadow-lg active:scale-90">
                <ChevronRight className="text-black group-hover:text-white w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Right Side: Image with specific rounded corners */}
          <div className="flex-1 w-full min-h-[350px] md:min-h-[500px] relative rounded-[2.5rem] overflow-hidden order-1 md:order-2 shadow-inner">
            <Image
              src="/mask-group.jpg"
              alt="Delicious Food"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
            {/* Subtle Overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  )
}
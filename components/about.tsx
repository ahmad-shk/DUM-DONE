"use client"

import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"

export function About() {
  const { lang } = useLanguage()
  const t = translations[lang].about

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title: Authentic Chinese Home-Style Cooking */}
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-black dark:text-white font-serif tracking-tight leading-tight">
          {t.title}
        </h2>

        {/* Layout: Image | Text Box | Image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
          
          {/* Left Image */}
          <div className="relative aspect-[4/5] md:aspect-auto h-[400px] md:h-full rounded-[2rem] overflow-hidden shadow-md">
            <Image 
              src="/image-2.png" 
              alt="About Dish Left"
              fill
              className="object-cover"
            />
          </div>

          {/* Center Text Card (The Black/Grey Box) */}
          <div className="flex flex-col justify-center items-center text-center p-8 md:p-10 bg-gray-50 dark:bg-[#111] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
            <p className="text-lg md:text-xl text-black dark:text-white leading-relaxed font-serif italic">
              {t.description}
            </p>
          </div>

          {/* Right Image */}
          <div className="relative aspect-[4/5] md:aspect-auto h-[400px] md:h-full rounded-[2rem] overflow-hidden shadow-md">
            <Image 
              src="/image-1.png" 
              alt="About Dish Right"
              fill
              className="object-cover"
            />
          </div>
          
        </div>
      </div>
    </section>
  )
}
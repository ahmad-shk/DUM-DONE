"use client"

import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

export function FeaturedDishes() {
  const { lang } = useLanguage()

  const content = {
    en: {
      description: "Shǒugōng jiǎozǐ, xīnxiān miàntiáo hé chuántǒng zhōngshì càiyáo yòngxīn pēng zhì, chuánchéng jīngdiǎn.",
    },
    zh: {
      description: "手工饺子、新鲜面条和传统中式菜肴用心烹制，传承经典。",
    },
  }

  const t = content[lang]

  return (
    // bg-white (Light Mode) aur dark:bg-black (Dark Mode)
    // text-black (Light Mode) aur dark:text-white (Dark Mode)
    <section className="py-16 md:py-24 bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Decorative Background Character - Opacity adjusted for both themes */}
        {/* Decorative Background Character */}
        <div className="absolute top-0 left-0 pointer-events-none select-none">
          <span className="text-[200px] font-bold leading-none 
            text-black opacity-[0.03] 
                  dark:text-white dark:opacity-[0.07]">
            家
          </span>
        </div>

        {/* Top Description Area */}
        <div className="flex justify-end mb-12">
          <p className="max-w-2xl text-right text-lg md:text-xl font-serif italic opacity-80 dark:opacity-90 leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Image Grid UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

          {/* Left - Main Large Image */}
          <div className="relative aspect-[4/3] md:aspect-auto h-full min-h-[400px] rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl group border border-gray-100 dark:border-white/5">
            <Image
              src="/mask-group.jpg"
              alt="Main Featured Dish"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* Right - Two Stacked Smaller Images */}
          <div className="flex flex-col gap-6">
            <div className="relative h-[250px] rounded-3xl overflow-hidden shadow-lg group border border-gray-100 dark:border-white/5">
              <Image
                src="/mask-group.jpg"
                alt="Side Dish 1"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="relative h-[250px] rounded-3xl overflow-hidden shadow-lg group border border-gray-100 dark:border-white/5">
              <Image
                src="/mask-group.jpg"
                alt="Side Dish 2"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
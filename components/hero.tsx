"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import Image from "next/image"

export function Hero() {
  const { lang } = useLanguage()
  const t = getTranslation(lang)


  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden pt-20">
      {/* Background Image */}
      <Image src="/miso-soup-with-seafood.png" alt="Authentic Chinese Kitchen" fill className="object-cover" priority />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/50" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-serif text-balance drop-shadow-lg">
          {t.hero.title}
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
          {/* View Menu Button */}
          <Button
            size="lg"
            className="bg-[#DD0200] hover:bg-[#B30200] text-white w-full sm:w-auto border-none transition-colors duration-300"
            onClick={() => window.location.href = "/menu"}
          >
            {t.hero.viewMenu}
          </Button>

          {/* Place Order Button */}
          <Button
            size="lg"
            variant="outline"
            className="bg-[#000000] hover:bg-[#1A1A1A] text-white hover:text-white border-white w-full sm:w-auto transition-colors duration-300"
            onClick={() => window.location.href = "/login"}
          >
            {t.hero.bookReservation}
          </Button>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
  const { lang } = useLanguage()
  const t = getTranslation(lang)

  // Initialize Embla Carousel with loop and custom spacing for mobile
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: true,
    containScroll: "trimSnaps"
  })

  // Autoplay functionality
  const onSelect = useCallback(() => {
    if (!emblaApi) return
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    const intervalId = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext()
      } else {
        emblaApi.scrollTo(0)
      }
    }, 5000)
    return () => clearInterval(intervalId)
  }, [emblaApi, onSelect])

  const slides = [
    {
      image: "/biryani.png",
      badge: "CHEF'S SPECIAL",
      title: "Ancient Dum Biryani",
      desc: "Slow-cooked saffron rice with premium chicken & spices"
    },
    {
      image: "/daal_chawal.png",
      badge: "BEST SELLER",
      title: "Classic Daal Chawal",
      desc: "Buttery yellow lentils served over premium basmati rice"
    },
    {
      image: "/palak_paneer.png",
      badge: "NEW ARRIVAL",
      title: "Fresh Palak Paneer",
      desc: "Hand-picked spinach with cubes of fresh cottage cheese"
    }
  ]

  return (
    <section className="w-full relative pt-20 bg-gray-50 dark:bg-black overflow-hidden z-0">
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex cursor-grab active:cursor-grabbing py-4 pb-12 pl-4 sm:pl-6 lg:pl-8 touch-pan-y">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className="flex-[0_0_85%] md:flex-[0_0_80%] lg:flex-[0_0_70%] min-w-0 mr-4 md:mr-6 lg:mr-8 relative select-none"
            >
              <div className="relative w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[550px] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-lg bg-gray-200 dark:bg-[#111]">
                <Image 
                  src={slide.image} 
                  alt={slide.title}
                  fill 
                  className="object-cover pointer-events-none" 
                  priority={index === 0}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                
                <div className="absolute inset-0 p-6 md:p-12 lg:p-16 flex flex-col justify-end pointer-events-none">
                  <div className="mb-2 md:mb-4">
                    <span className="bg-[#FF6B00] text-white text-[10px] md:text-sm font-black px-3 py-1.5 rounded-full inline-block tracking-widest uppercase">
                      {slide.badge}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-5xl lg:text-7xl font-black text-white mb-2 md:mb-4 font-serif">
                    {slide.title}
                  </h2>
                  <p className="text-white/90 text-[10px] md:text-xl font-medium max-w-xl line-clamp-2 md:line-clamp-none mb-4">
                    {slide.desc}
                  </p>
                  
                  <div className="mt-4 md:mt-8 relative z-50 pointer-events-auto">
                    <Link href="/menu">
                      <Button
                        type="button"
                        size="lg"
                        className="bg-white hover:bg-[#FF6B00] hover:text-white text-black font-extrabold h-10 md:h-12 px-6 md:px-10 rounded-full shadow-xl active:scale-95 transition-all"
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          window.location.href = "/menu";
                        }}
                      >
                        {t.hero.viewMenu}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

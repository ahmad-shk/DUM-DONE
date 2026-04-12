"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { useLanguage } from "@/lib/language-provider"
import { translations } from "@/lib/translations"

export function Reviews() {
  const { lang } = useLanguage()
  const t = translations[lang].reviews

  return (
    <section className="py-24 bg-background relative overflow-hidden transition-colors duration-500">

      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 dark:to-primary/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main Card */}
        <div className="glass-card bg-foreground text-background dark:bg-[#111] dark:text-white rounded-[3rem] overflow-hidden p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-center shadow-2xl border border-border/10">

          {/* Left Side: Text Content */}
          <div className="flex-1 flex flex-col h-full w-full order-2 lg:order-1 px-4 lg:px-8 relative">
            <Quote className="absolute top-0 left-0 w-24 h-24 text-primary/10 -z-10 -translate-y-1/2 -translate-x-1/4" />

            <div className="space-y-8 z-10 relative">
              <h2 className="text-3xl md:text-5xl font-black font-serif leading-tight">
                {t.title}
              </h2>

              <div className="pt-8 space-y-6">
                {/* Stars */}
                <div className="flex gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-secondary text-secondary drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-xl md:text-3xl font-medium leading-relaxed max-w-2xl text-background/90 dark:text-white/90 font-serif italic">
                  "{t.testimonial}"
                </p>

                {/* Customer Name */}
                <div className="flex items-center gap-4 mt-8">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-primary">
                    <Image src="/mask-group.jpg" alt="Customer" fill className="object-cover" />
                  </div>
                  <p className="text-primary font-bold tracking-wider uppercase text-sm">
                    — Alex Johnson
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-4 mt-12 md:mt-auto pt-12">
              <button className="w-14 h-14 rounded-full bg-background dark:bg-white text-foreground dark:text-black flex items-center justify-center hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary transition-all group shadow-xl active:scale-90">
                <ChevronLeft className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" />
              </button>
              <button className="w-14 h-14 rounded-full bg-background dark:bg-white text-foreground dark:text-black flex items-center justify-center hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary transition-all group shadow-xl active:scale-90">
                <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="flex-1 w-full h-[400px] lg:h-[600px] relative rounded-[2.5rem] overflow-hidden order-1 lg:order-2 shadow-2xl">
            <Image
              src="/biryani.png"
              alt="Special Chicken Biryani"
              fill
              className="object-cover transition-transform duration-1000 hover:scale-110"
              priority
            />
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 right-8 glass-card border-none bg-black/40 text-white rounded-2xl p-6 backdrop-blur-md animate-in slide-in-from-bottom-8 duration-700">
              <h4 className="text-xl font-bold mb-2">Customer Favorite</h4>
              <p className="text-sm text-white/80">Our Special Chicken Biryani is voted #1 for its authentic spices and aroma.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

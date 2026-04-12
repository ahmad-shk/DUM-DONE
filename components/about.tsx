"use client"

import Image from "next/image"
import { useLanguage } from "@/lib/use-language"
import { translations } from "@/lib/translations"
import { CheckCircle2 } from "lucide-react"

export function About() {
  const { lang } = useLanguage()
  const t = translations[lang].about

  return (
    <section className="py-24 relative overflow-hidden bg-background pt-32">
      <div className="absolute inset-0 bg-secondary/5 dark:bg-white/[0.02]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          {/* Left Side Images */}
          <div className="w-full lg:w-1/2 relative min-h-[500px] flex items-center justify-center">
            {/* Main Image: Biryani */}
            <div className="absolute top-0 left-0 w-4/5 h-[380px] rounded-[2rem] overflow-hidden shadow-2xl animate-in slide-in-from-left-8 fade-in duration-1000">
              <Image 
                src="/biryani.png" 
                alt="Signature Biryani"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Secondary Image: Roti */}
            <div className="absolute -bottom-4 right-0 w-3/5 h-[280px] rounded-[2rem] overflow-hidden shadow-2xl glass border-4 border-background animate-in slide-in-from-right-8 fade-in duration-1000 delay-200">
              <Image 
                src="/tandoori_roti.png" 
                alt="Fresh Tandoori Roti"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Third Image: Palak */}
            <div className="absolute top-1/2 -left-8 -translate-y-1/2 w-48 h-48 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-background animate-in zoom-in fade-in duration-1000 delay-500 z-20">
              <Image 
                src="/palak_paneer.png" 
                alt="Fresh Palak"
                fill
                className="object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Right Side Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-8 font-serif leading-tight">
              {t.title}
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light mb-10">
              {t.description}
            </p>

            <div className="space-y-6">
              {t.features?.map((feature: any, i: number) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
                    <CheckCircle2 className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
          
        </div>
      </div>
    </section>
  )
}

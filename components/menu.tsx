"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion" // Effects ke liye
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import { Star, ArrowRight } from "lucide-react"

export function Menu() {
  const [activeCategory, setActiveCategory] = useState("all")
  const { lang } = useLanguage()
  const t = translations[lang].menu

  const filteredItems = activeCategory === "all" 
    ? t.items 
    : t.items.filter((item: any) => item.category.toLowerCase() === activeCategory.toLowerCase())

  return (
    <section id="menu" className="py-16 md:py-24 bg-white dark:bg-black transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 bg-gray-50/50 dark:bg-[#111] p-4 md:p-6 rounded-[2.5rem] border border-gray-200 dark:border-white/5 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-black dark:text-white font-serif tracking-tight">
            {t.title}
          </h2>

          {/* Scrollable Categories for Mobile */}
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <div className="flex flex-nowrap md:flex-wrap gap-4 md:gap-8 justify-start md:center px-2">
              {t.categories.map((category: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(category.toLowerCase())}
                  className={`text-xs md:text-sm font-bold transition-all uppercase tracking-[0.2em] whitespace-nowrap relative py-2 ${
                    activeCategory === category.toLowerCase()
                      ? "text-amber-600"
                      : "text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {category}
                  {activeCategory === category.toLowerCase() && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <Button className="hidden md:flex bg-black dark:bg-white text-white dark:text-black rounded-full px-8 group">
            {t.viewFull}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Menu Grid with Framer Motion */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item: any, idx: number) => (
              <motion.div
                key={item.name} // Unique key zaroori hai animation ke liye
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Card 
                  className="group h-full bg-gray-50 dark:bg-[#0A0A0A] border-none rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={item.image || "/mask-group.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content Box */}
                  <div className="p-4 md:p-6 flex flex-col gap-3">
                    <h3 className="text-sm md:text-lg font-bold text-black dark:text-white leading-tight min-h-[2.5rem] line-clamp-2">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">{item.category}</span>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg md:text-xl font-black text-amber-600 dark:text-amber-500">
                          €{item.price}
                        </p>
                      </div>
                    </div>
                    
                    <button className="w-full mt-auto bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                      Add to Order
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Mobile-only View Full Button */}
        <div className="mt-12 flex justify-center md:hidden">
          <Button className="w-full py-6 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold">
            {t.viewFull}
          </Button>
        </div>
      </div>
    </section>
  )
}

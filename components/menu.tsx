'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'
import { Star, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export function Menu() {
  const [activeCategory, setActiveCategory] = useState('VIEW FULL MENU')
  const { lang } = useLanguage()
  const t = translations[lang].menu
  const { addItem } = useCart()

  const filteredItems =
    activeCategory === 'VIEW FULL MENU'
      ? t.items
      : t.items.filter((item: any) => item.category.toUpperCase() === activeCategory.toUpperCase())

  const handleAddToCart = (item: any) => {
    const itemId = `menu-${item.name.toLowerCase().replace(/\s+/g, '-')}`
    addItem({
      id: itemId,
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image || '/mask-group.jpg',
    })
  }

  return (
    <section id="menu" className="py-16 md:py-24 bg-white dark:bg-black transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 bg-gray-50/50 dark:bg-[#111] p-4 md:p-6 rounded-[2.5rem] border border-gray-200 dark:border-white/5">
          <h2 className="text-3xl font-bold text-black dark:text-white font-serif tracking-tight">
            {t.title}
          </h2>

          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="flex flex-nowrap gap-3 md:gap-6 justify-start px-2">
              {t.categories.map((category: string) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category.toUpperCase())}
                  className={`text-xs md:text-sm font-bold transition-colors uppercase tracking-widest whitespace-nowrap py-2 ${
                    activeCategory === category.toUpperCase()
                      ? 'text-amber-600'
                      : 'text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {category}
                  {activeCategory === category.toUpperCase() && (
                    <div className="h-0.5 bg-amber-600 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredItems.map((item: any) => (
            <Card
              key={item.name}
              className="group h-full bg-gray-50 dark:bg-[#0A0A0A] border-none rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-200 dark:bg-gray-900">
                <Image
                  src={item.image || '/mask-group.jpg'}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  priority={false}
                />
              </div>

              <div className="p-4 md:p-5 flex flex-col flex-grow gap-3">
                <h3 className="text-sm md:text-base font-bold text-black dark:text-white leading-tight line-clamp-2">
                  {item.name}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-base md:text-lg font-bold text-amber-600 dark:text-amber-500">
                    {item.price}
                  </p>
                </div>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full mt-auto bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-200 text-xs md:text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add to Order
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

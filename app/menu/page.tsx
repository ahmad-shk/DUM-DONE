'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'
import { Star, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/lib/cart-context'


export default function MenuPage() {
  const { lang } = useLanguage()
  const t = translations[lang].menu
  const [activeCategory, setActiveCategory] = useState('VIEW FULL MENU')
  const { items: cartItems, addItem } = useCart()

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
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <Header />

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              {lang === 'en' ? 'Our Menu' : 'ہمارا مینو'}
            </h1>
            <p className="text-muted-foreground">
              {lang === 'en' ? 'Discover authentic desi flavors' : 'اصلی دیسی ذائقے دریافت کریں'}
            </p>
          </div>

          {/* Category Tabs - Horizontal */}
          <div className="mb-12">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 sm:pb-0">
              {t.categories.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat.toUpperCase())}
                  className={`px-4 sm:px-6 py-2 text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                    activeCategory === cat.toUpperCase()
                      ? 'text-amber-600'
                      : 'text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {cat}
                  {activeCategory === cat.toUpperCase() && (
                    <div className="h-0.5 bg-amber-600 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item: any) => {
              const itemId = `menu-${item.name.toLowerCase().replace(/\s+/g, '-')}`
              return (
                <Card key={itemId} className="group h-full bg-gray-50 dark:bg-[#0A0A0A] border-none rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
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
              )
            })}
          </div>
        </div>
      </div>



      <Footer />
    </main>
  )
}

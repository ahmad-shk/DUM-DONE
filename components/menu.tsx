'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'
import { Star, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { ItemDetailModal } from '@/components/item-detail-modal'

// Category icons mapping
const categoryIcons: { [key: string]: string } = {
  'VIEW FULL MENU': '🍱',
  'ALL': '🍱',
  'RICE': '🍛',
  'DAAL': '🍲',
  'KABAB': '🍢',
  'VEGETABLE': '🥗',
  'TANDOOR': '🫓',
  'SWEETS': '🍮',
  'DRINKS': '🥤',
}

export function Menu() {
  const [activeCategory, setActiveCategory] = useState('VIEW FULL MENU')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { lang } = useLanguage()
  const t = translations[lang].menu
  const { addItem } = useCart()

  const filteredItems =
    activeCategory === 'VIEW FULL MENU'
      ? t.items
      : t.items.filter((item: any) => item.category.toUpperCase() === activeCategory.toUpperCase())

  const handleAddToCart = (item: any, quantity: number = 1) => {
    const itemId = `menu-${item.name.toLowerCase().replace(/\s+/g, '-')}`
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: itemId,
        name: item.name,
        price: item.price,
        category: item.category,
        image: item.image || '/chapli-kabab.png',
        description: item.description,
      })
    }
  }

  const handleImageClick = (item: any) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  return (
    <section id="menu" className="py-10 md:py-24 bg-white dark:bg-black transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white mb-2">
            {t.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
            Discover authentic desi flavors
          </p>
        </div>

        {/* Categories - Pill Style */}
        <div className="w-full overflow-x-auto no-scrollbar mb-8">
          <div className="flex gap-2 md:gap-3 justify-start md:justify-center pb-2 px-1">
            {t.categories.map((category: string) => {
              const isActive = activeCategory === category.toUpperCase()
              const icon = categoryIcons[category.toUpperCase()] || '🍽️'
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category.toUpperCase())}
                  className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  <span className="text-base md:text-lg">{icon}</span>
                  <span>{category}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {filteredItems.map((item: any) => (
            <Card
              key={item.name}
              className="group h-full bg-gray-50 dark:bg-[#0A0A0A] border-none rounded-xl md:rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer"
              onClick={() => handleImageClick(item)}
            >
              <div 
                className="relative aspect-square w-full overflow-hidden bg-gray-200 dark:bg-gray-900"
              >
                <Image
                  src={item.image || '/chapli-kabab.png'}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  priority={false}
                />
              </div>

              <div className="p-2.5 md:p-4 flex flex-col flex-grow gap-1.5 md:gap-3">
                <h3 className="text-xs md:text-base font-bold text-black dark:text-white leading-tight line-clamp-1">
                  {item.name}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 md:w-3 h-2.5 md:h-3 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm md:text-lg font-bold text-amber-600 dark:text-amber-500">
                    {item.price}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToCart(item)
                  }}
                  className="w-full mt-auto bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-semibold py-1.5 md:py-2 px-2 md:px-3 rounded-lg transition-all duration-200 text-[10px] md:text-sm flex items-center justify-center gap-1 md:gap-2 shadow-md hover:shadow-lg"
                >
                  <ShoppingCart className="w-3 md:w-3.5 h-3 md:h-3.5" />
                  Add to Order
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Item Detail Modal */}
        <ItemDetailModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCart}
        />
      </div>
    </section>
  )
}

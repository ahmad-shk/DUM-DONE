'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux' 
import { addItem } from '@/lib/redux/slices/cartSlice' 
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { useLanguage } from '@/lib/use-language'
import { translations } from '@/lib/translations'
import { Star, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { ItemDetailModal } from '@/components/item-detail-modal'

const categoryIcons: { [key: string]: string } = {
  'VIEW FULL MENU': '🍱',
  'ALL': '🍱',
  'RICE': '🍚',
  'DAAL': '🍲',
  'KABAB': '🍢',
  'VEGETABLE': '🥗',
  'TANDOOR': '🫓',
  'SWEETS': '🍮',
  'DRINKS': '🥤',
}

export default function MenuPage() {
  const dispatch = useDispatch()
  const { lang } = useLanguage()
  const t = translations[lang].menu
  const [activeCategory, setActiveCategory] = useState('VIEW FULL MENU')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredItems =
    activeCategory === 'VIEW FULL MENU'
      ? t.items
      : t.items.filter((item: any) => item.category.toUpperCase() === activeCategory.toUpperCase())

  // FIX 1: TypeScript Error "quantity does not exist"
  const handleAddToCart = (item: any, quantity: number = 1) => {
    const itemId = `menu-${item.name.toLowerCase().replace(/\s+/g, '-')}`
    
    // Agar aapka slice quantity expect nahi kar raha, toh loop ke zariye dispatch karein
    for (let i = 0; i < quantity; i++) {
      dispatch(addItem({
        id: itemId,
        name: item.name,
        price: item.price,
        category: item.category,
        image: item.image || '/chapli-kabab.png',
        description: item.description,
      }))
    }
  }

  const handleItemClick = (item: any) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <Header />

      <div className="pt-24 pb-28 md:pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-black dark:text-white mb-1">
              {lang === 'en' ? 'Our Menu' : 'ہمارا مینو'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {lang === 'en' ? 'Discover authentic desi flavors' : 'اصلی دیسی ذائقے دریافت کریں'}
            </p>
          </div>

          <div className="w-full overflow-x-auto no-scrollbar mb-6">
            <div className="flex gap-2 justify-start md:justify-center pb-2 px-1">
              {t.categories.map((cat: string) => {
                const isActive = activeCategory === cat.toUpperCase()
                const icon = categoryIcons[cat.toUpperCase()] || '🍽️'
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat.toUpperCase())}
                    className={`flex items-center gap-1 px-2.5 py-1.5 md:px-3 md:py-2 rounded-full text-[10px] md:text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    <span className="text-sm md:text-base">{icon}</span>
                    <span>{cat}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {filteredItems.map((item: any) => {
              const itemId = `menu-${item.name.toLowerCase().replace(/\s+/g, '-')}`
              return (
                <Card 
                  key={itemId} 
                  className="group h-full bg-gray-50 dark:bg-zinc-900 border-none rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-gray-200 dark:bg-zinc-800">
                    <Image
                      src={item.image || '/chapli-kabab.png'}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* FIX 2: Tailwind flex-grow to grow */}
                  <div className="p-2.5 md:p-3 flex flex-col grow gap-1 md:gap-2">
                    <h3 className="text-xs md:text-sm font-bold text-black dark:text-white leading-tight line-clamp-1">
                      {item.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2 md:w-2.5 h-2 md:h-2.5 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <p className="text-xs md:text-sm font-bold text-amber-600">
                        {item.price}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart(item)
                      }}
                      className="w-full mt-auto bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-semibold py-1.5 md:py-2 rounded-lg transition-all duration-200 text-[9px] md:text-xs flex items-center justify-center gap-1"
                    >
                      <ShoppingCart className="w-2.5 md:w-3 h-2.5 md:h-3" />
                      Add to Order
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      <ItemDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <Footer />
    </main>
  )
}

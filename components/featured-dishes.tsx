'use client'

import Image from 'next/image'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'
import { useCart } from '@/lib/cart-context'
import { useRouter } from 'next/navigation'
import { Star, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function FeaturedDishes() {
  const { lang } = useLanguage()
  const t = translations[lang].featured
  const { addItem } = useCart()
  const router = useRouter()

  const handleAddToCart = (item: any) => {
    const itemId = `signature-${item.name.toLowerCase().replace(/\s+/g, '-')}`
    addItem({
      id: itemId,
      name: item.name,
      price: item.price,
      category: 'Signature',
      image: item.image || '/mask-group.jpg',
    })
    // setTimeout(() => router.push('/menu'), 300)
  }

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            {t.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.items.map((item: any) => (
            <Card
              key={item.name}
              className="group overflow-hidden bg-gray-50 dark:bg-[#0A0A0A] border-none rounded-2xl hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-900">
                <Image
                  src={item.image || ''}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  priority={false}
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-500 text-amber-500"
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-500">
                    {item.price}
                  </span>
                </div>
                <Button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Order
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

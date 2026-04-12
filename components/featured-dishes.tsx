'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'
import { useCart } from '@/lib/cart-context'
import { useRouter } from 'next/navigation'
import { Plus, Star, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ItemDetailModal } from '@/components/item-detail-modal'

export function FeaturedDishes() {
  const { lang } = useLanguage()
  const t = translations[lang].featured
  const { addItem } = useCart()
  const router = useRouter()
  const [activeCat, setActiveCat] = useState("All")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const categories = [
    { name: "All", icon: "🍱" },
    { name: "Rice", icon: "🍛" },
    { name: "Daal", icon: "🍲" },
    { name: "Kabab", icon: "🍢" },
    { name: "Vegetable", icon: "🥦" },
    { name: "Tandoor", icon: "🫓" },
    { name: "Sweets", icon: "🍮" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' })
        }
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const defaultItems = [
    {
      name: "Special Chicken Biryani",
      description: "Aromatic basmati rice cooked with tender spiced chicken, infused with saffron and traditional herbs.",
      price: "Rs. 450",
      image: "/biryani.png",
      category: "Rice"
    },
    {
      name: "Daal Mash",
      description: "Rich, spiced, and buttery white lentils finished with fried garlic and fresh ginger.",
      price: "Rs. 250",
      image: "/daal_mash.png",
      category: "Daal"
    },
    {
      name: "Palak Paneer",
      description: "Creamy spinach curry cooked with soft cubes of fresh cottage cheese.",
      price: "Rs. 600",
      image: "/palak_paneer.png",
      category: "Vegetable"
    },
    {
      name: "Palak Chicken",
      description: "Tender chicken pieces simmered in a rich, spiced fresh spinach puree.",
      price: "Rs. 800",
      image: "/palak_chicken.png",
      category: "Vegetable"
    },
    {
      name: "Palak Gosht",
      description: "Hearty mutton and fresh spinach thoroughly slow-cooked with aromatic desi spices.",
      price: "Rs. 1400",
      image: "/palak_gosht.png",
      category: "Vegetable"
    },
    {
      name: "Aloo Palak",
      description: "Classic home-style potato and spinach curry, full of flavor and totally vegan.",
      price: "Rs. 250",
      image: "/aloo_palak.png",
      category: "Vegetable"
    },
    {
      name: "Daal Chawal",
      description: "Comforting home-style lentil curry served over premium steamed basmati rice.",
      price: "Rs. 350",
      image: "/daal_chawal.png",
      category: "Rice"
    },
    {
      name: "Meethe Chawal",
      description: "Traditional Zarda - sweet yellow aromatic rice packed with dry fruits.",
      price: "Rs. 400",
      image: "/image-2.png",
      category: "Sweets"
    },
    {
      name: "Gulab Jamun (2 pcs)",
      description: "Classic sweet milk solids balls dipped in delicate rose-scented syrup.",
      price: "Rs. 150",
      image: "/chapli-kabab.png",
      category: "Sweets"
    },
    {
      name: "Fresh Tandoori Roti",
      description: "Hot, soft, and pure whole wheat tandoori roti right from the oven.",
      price: "Rs. 30",
      image: "/tandoori_roti.png",
      category: "Tandoor"
    },
    {
      name: "Butter Naan",
      description: "Fluffy tandoor-baked naan brushed with pure desi ghee and butter.",
      price: "Rs. 70",
      image: "/butter_naan.png",
      category: "Tandoor"
    },
    {
      name: "chapli-kabab.png",
      description: "Traditional Peshawari style minced beef kabab with spices, tomatoes and marrow.",
      price: "Rs. 300",
      image: "/chapli-kabab.png",
      category: "Kabab"
    },
    {
      name: "Chicken Kabab",
      description: "Grilled minced chicken kababs seasoned with fresh aromatic desi herbs and spices.",
      price: "Rs. 250",
      image: "/image-2.png",
      category: "Kabab"
    },
    {
      name: "Beef Kabab",
      description: "Succulent and spiced minced beef seekh kababs grilled to perfection.",
      price: "Rs. 280",
      image: "/chapli-kabab.png",
      category: "Kabab"
    }
  ]

  const itemsToDisplay = (t.items.length > 0 ? t.items : defaultItems).filter(item =>
    activeCat === "All" || item.category === activeCat
  )

  const handleAddToCart = (item: any, quantity: number = 1) => {
    const itemId = `feature-${item.name.toLowerCase().replace(/\s+/g, '-')}`
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: itemId,
        name: item.name,
        price: item.price,
        category: 'Signature',
        image: item.image || '/mask-group.jpg',
        description: item.description,
      })
    }aspect-[4/3]
  }

  const handleImageClick = (item: any) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  return (
    <>
      {/* DESKTOP / PREVIOUS WEB VIEW */}
      <section className="hidden md:block py-16 md:py-24 bg-white dark:bg-black">
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
                <div 
                  className="relative aspect-4/3 overflow-hidden bg-gray-200 dark:bg-gray-900 cursor-pointer"
                  onClick={() => handleImageClick(item)}
                >
                  <Image
                    src={item.image || '/mask-group.jpg'}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex flex-col grow">
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 grow line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-500">
                      {item.price}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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

      {/* MOBILE APP VIEW */}
      <section className="md:hidden bg-gray-50 dark:bg-black pb-24 border-t border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Categories Slider */}
          <div className="w-full overflow-x-auto no-scrollbar py-6 pl-4 sm:pl-6 lg:pl-8 scroll-smooth" ref={scrollRef}>
            <div className="flex gap-4 sm:gap-6 min-w-max pr-4">
              {categories.map((cat) => {
                const isActive = activeCat === cat.name;
                return (
                  <button
                    type="button"
                    key={cat.name}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setActiveCat(cat.name);
                    }}
                    className="flex flex-col items-center gap-2 group relative z-50 pointer-events-auto touch-manipulation"
                  >
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.2rem] flex items-center justify-center text-2xl sm:text-3xl bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 group-hover:shadow-md ${isActive ? 'border-[2.5px] border-[#FF6B00]' : 'border border-gray-100 dark:border-gray-700'}`}>
                      {cat.icon}
                    </div>
                    <span className={`text-xs sm:text-sm font-bold transition-colors ${isActive ? 'text-[#FF6B00]' : 'text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'}`}>
                      {cat.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Item Cards Grid */}
          <div className="px-4 sm:px-6 lg:px-8 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {itemsToDisplay.map((item: any, i: number) => (
                <div
                  key={item.name}
                  className="bg-white dark:bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col group animate-in slide-in-from-bottom-8 fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div 
                    className="relative w-full aspect-4/3 bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(item)}
                  >
                    <Image
                      src={item.image || '/mask-group.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>

                  <div className="p-5 flex flex-col grow">
                    <h3 className="text-lg md:text-xl font-bold text-black dark:text-white mb-1 leading-tight tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {item.description || "Fresh and delicious authentic meal."}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-xl font-black text-black dark:text-white">
                        {item.price}
                      </span>
                      <button
                        type="button"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        className="w-14 h-14 rounded-full bg-[#FF6B00] hover:bg-[#E66000] active:scale-95 text-white flex items-center justify-center shadow-2xl relative z-100 pointer-events-auto cursor-pointer touch-manipulation"
                        aria-label="Add to cart"
                      >
                        <Plus className="w-8 h-8 stroke-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </>
  )
}

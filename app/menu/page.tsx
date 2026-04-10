'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'
import { Star, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface CartItem {
  name: string
  price: string
  quantity: number
}

export default function MenuPage() {
  const { lang } = useLanguage()
  const t = translations[lang].menu
  const [activeCategory, setActiveCategory] = useState('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const router = useRouter()

  const filteredItems = activeCategory === 'all'
    ? t.items
    : t.items.filter((item: any) => item.category.toLowerCase() === activeCategory.toLowerCase())

  const addToCart = (item: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.name === item.name)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prevCart, { name: item.name, price: item.price, quantity: 1 }]
    })
  }

  const removeFromCart = (itemName: string) => {
    setCart(prevCart => prevCart.filter(item => item.name !== itemName))
  }

  const updateQuantity = (itemName: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemName)
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.name === itemName ? { ...item, quantity } : item
        )
      )
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price)
      return total + price * item.quantity
    }, 0).toFixed(2)
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Please add items to your cart')
      return
    }
    // Store cart items in sessionStorage to pass to order page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cartItems', JSON.stringify(cart))
    }
    router.push('/order')
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <Header />

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              {lang === 'en' ? 'Our Menu' : '我们的菜单'}
            </h1>
            <p className="text-muted-foreground">
              {lang === 'en' ? 'Discover authentic Chinese dishes' : '发现正宗的中式菜肴'}
            </p>
          </div>

          {/* Category Tabs - Horizontal */}
          <div className="mb-12">
            <div className="flex gap-2 overflow-x-auto pb-4 sm:pb-0">
              <button
                onClick={() => setActiveCategory('All Items')}
                className={`px-4 sm:px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === 'All Items'
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-secondary/30 text-foreground hover:bg-secondary/50'
                }`}
              >
                {lang === 'en' ? 'All Items' : '全部'}
              </button>
              {['Appetizers', 'Noodles', 'Main Courses', 'Vegetables', 'Jiaozi', 'Beverages'].map((cat: string) => {
                const catTranslations: any = {
                  'Appetizers': lang === 'en' ? 'Appetizers' : '开胃菜',
                  'Noodles': lang === 'en' ? 'Noodles' : '面条',
                  'Main Courses': lang === 'en' ? 'Main Courses' : '主菜',
                  'Vegetables': lang === 'en' ? 'Vegetables' : '蔬菜',
                  'Jiaozi': lang === 'en' ? 'Jiaozi' : '饺子',
                  'Beverages': lang === 'en' ? 'Beverages' : '饮料',
                }
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 sm:px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                      activeCategory === cat
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : 'bg-secondary/30 text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    {catTranslations[cat]}
                  </button>
                )
              })}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item: any, idx: number) => (
                <motion.div
                  key={item.name}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <Card className="h-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-square w-full overflow-hidden bg-secondary/10">
                      <Image
                        src="/mask-group.jpg"
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col gap-3 flex-1">
                      <div>
                        <h3 className="font-bold text-base md:text-lg text-foreground line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            €{item.price}
                          </span>
                        </div>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          {lang === 'en' ? 'Add to Order' : '加入订单'}
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
          >
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-destructive text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
              {cart.length}
            </span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-40 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">
                  {lang === 'en' ? 'Your Order' : '您的订单'}
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-muted-foreground hover:text-foreground text-2xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      €{item.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => updateQuantity(item.name, item.quantity - 1)}
                      className="px-2 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded font-bold text-sm transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.name, item.quantity + 1)}
                      className="px-2 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded font-bold text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="mb-4">
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>{lang === 'en' ? 'Total' : '总计'}:</span>
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    €{getTotalPrice()}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                {lang === 'en' ? 'Continue to Order' : '继续下单'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {showCart && cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCart(false)}
            className="fixed inset-0 bg-black/50 z-30"
          />
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}

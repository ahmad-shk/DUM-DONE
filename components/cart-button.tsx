'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { CartDrawer } from '@/components/cart-drawer'

export function CartButton() {
  const { totalItems } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  if (totalItems === 0) {
    return null
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 z-[999] hover:scale-110 active:scale-95"
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="font-bold text-lg">{totalItems}</span>
      </button>
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

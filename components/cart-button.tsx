'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { CartDrawer } from '@/components/cart-drawer'

export function CartButton() {
  const { totalItems } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenCart = () => {
    // Dispatch custom event to close any open item modals
    window.dispatchEvent(new CustomEvent('closeItemModal'))
    setIsOpen(true)
  }

  if (totalItems === 0) {
    return null
  }

  return (
    <>
      <button
        onClick={handleOpenCart}
        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 bg-amber-600 hover:bg-amber-700 text-white p-3 md:p-4 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 flex items-center gap-2 z-[10001] hover:scale-110 active:scale-95 animate-in zoom-in-50 fade-in duration-300"
        aria-label={`View cart with ${totalItems} items`}
      >
        <ShoppingCart className="w-5 md:w-6 h-5 md:h-6" />
        <span className="font-bold text-sm md:text-lg min-w-[20px] text-center">{totalItems}</span>
      </button>
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

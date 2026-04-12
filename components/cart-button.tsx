'use client'
import { useSelector } from 'react-redux'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { CartDrawer } from '@/components/cart-drawer'

export function CartButton() {
  const cartItems = useSelector((state: any) => state.cart.items)
  const totalItems = cartItems.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0)
  const [isOpen, setIsOpen] = useState(false)

  if (totalItems === 0) return null

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        // bottom-28 se ye WhatsApp button ke upar ya barabar chala jayega
        // Mobile par size chota (w-12 h-12) aur desktop par wapas normal
        className="fixed bottom-28 right-6 z-50 flex items-center justify-center bg-gradient-to-r from-amber-600 to-amber-500 text-white w-12 h-12 md:w-auto md:h-auto md:px-5 md:py-3.5 rounded-full shadow-2xl active:scale-95 transition-all duration-200 border border-white/20"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full border border-white">
            {totalItems}
          </span>
        </div>
        
        {/* Mobile par text hidden rakha hai size chota rakhne ke liye */}
        <span className="hidden md:block font-semibold text-sm ml-2">View Cart</span>
      </button>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
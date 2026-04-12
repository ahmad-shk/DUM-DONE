'use client'
import { useSelector } from 'react-redux'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { CartDrawer } from '@/components/cart-drawer'

export function CartButton() {
  // Redux state se items nikaalna
  const cartItems = useSelector((state: any) => state.cart.items)
  
  // Calculate total quantity
  const totalItems = cartItems.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0)
  
  const [isOpen, setIsOpen] = useState(false)

  // DEBUGGING: Console mein check karein ke items aa rahe hain ya nahi
  // console.log("Cart Items in Redux:", cartItems)

  // Agar aap chahte hain ke button tabhi nazar aaye jab items hon:
  if (totalItems === 0) return null

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-amber-600/50 hover:from-amber-700 hover:to-amber-600 active:scale-95 transition-all duration-200 font-semibold text-sm md:text-base border border-amber-500/30"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          <span className="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-amber-600 shadow-lg">
            {totalItems}
          </span>
        </div>
        <span>View Cart</span>
      </button>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

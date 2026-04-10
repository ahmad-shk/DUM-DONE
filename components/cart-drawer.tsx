'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { X, Minus, Plus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter()
  const { items: cartItems, removeItem, updateQuantity } = useCart()

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, '') || '0')
        return total + price * item.quantity
      }, 0)
      .toFixed(2)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Please add items to your cart')
      return
    }
    onClose()
    router.push('/order')
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-black border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-amber-600 p-2 rounded-full">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-black dark:text-white">Your Order</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
              >
                {/* Item Image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-black dark:text-white line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-amber-600 dark:text-amber-500 font-semibold mt-1">
                      {item.price}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-black dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto p-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A] space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-black dark:text-white">Total:</span>
              <span className="text-amber-600 dark:text-amber-500 text-2xl">
                RS {getTotalPrice()}
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg transition-all duration-200"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

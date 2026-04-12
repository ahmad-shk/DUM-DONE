'use client'

import { useState } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'

interface MenuItem {
  id: string
  name: string
  price: string | number
  description?: string
  image: string
  category?: string
  badge?: string
}

interface ItemDetailModalProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: MenuItem, quantity: number) => void
}

export function ItemDetailModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
}: ItemDetailModalProps) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    if (item) {
      onAddToCart(item, quantity)
      setQuantity(1)
      onClose()
    }
  }

  const handleQuantityChange = (value: number) => {
    if (value > 0) {
      setQuantity(value)
    }
  }

  if (!item) return null

  const price = typeof item.price === 'string' 
    ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) 
    : item.price

  const totalPrice = (price * quantity).toFixed(2)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl p-0 border-0 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
        {/* Close Button */}
        <DialogClose className="absolute top-4 right-4 z-50 rounded-full bg-white dark:bg-gray-800 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <X className="w-5 h-5 text-black dark:text-white" />
        </DialogClose>

        <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
          {/* Image Section */}
          <div className="flex-shrink-0 w-full md:w-80">
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {item.badge && (
                <div className="absolute top-4 left-4 bg-amber-600 text-white font-bold px-4 py-2 rounded-full text-sm">
                  {item.badge}
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Header */}
            <div className="space-y-4">
              {item.category && (
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                  {item.category}
                </p>
              )}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
                  {item.name}
                </h2>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  RS {typeof item.price === 'string' ? item.price : `${item.price}`}
                </p>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  {item.description}
                </p>
              )}
            </div>

            {/* Quantity and Action */}
            <div className="space-y-4 mt-6">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 w-fit">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg transition-all duration-200 active:scale-95"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 text-center font-bold text-lg bg-transparent text-black dark:text-white border-0 outline-none"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg transition-all duration-200 active:scale-95"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Total Price */}
              <div className="text-xl font-bold text-black dark:text-white">
                Total: <span className="text-amber-600 dark:text-amber-400">RS {totalPrice}</span>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

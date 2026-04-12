'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Minus, ShoppingCart } from 'lucide-react'
import Image from 'next/image'

interface MenuItem {
  id?: string
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

  // Reset quantity when modal opens with new item
  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
    }
  }, [isOpen, item])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Listen for close event from cart button
  useEffect(() => {
    const handleCloseModal = () => {
      if (isOpen) {
        onClose()
      }
    }
    window.addEventListener('closeItemModal', handleCloseModal)
    return () => {
      window.removeEventListener('closeItemModal', handleCloseModal)
    }
  }, [isOpen, onClose])

  const handleAddToCart = () => {
    if (item) {
      onAddToCart(item, quantity)
      setQuantity(1)
      onClose()
    }
  }

  const handleQuantityChange = (value: number) => {
    if (value > 0 && value <= 99) {
      setQuantity(value)
    }
  }

  if (!item || !isOpen) return null

  const price = typeof item.price === 'string' 
    ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) 
    : item.price

  const totalPrice = Math.round(price * quantity)

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative w-full max-w-[340px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Image Section - Compact */}
          <div className="relative w-full h-44 bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={item.image || '/placeholder.jpg'}
              alt={item.name}
              fill
              className="object-cover"
              sizes="340px"
              priority
            />
            {item.badge && (
              <span className="absolute top-2 left-2 bg-amber-500 text-white font-medium px-2 py-0.5 rounded-full text-[10px]">
                {item.badge}
              </span>
            )}
          </div>

          {/* Content Section - Compact */}
          <div className="p-4">
            {/* Category */}
            {item.category && (
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {item.category}
              </span>
            )}

            {/* Title & Price Row */}
            <div className="flex items-start justify-between gap-2 mt-1 mb-2">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white leading-tight">
                {item.name}
              </h2>
              <span className="text-base font-bold text-amber-600 dark:text-amber-500 whitespace-nowrap">
                Rs. {price}
              </span>
            </div>

            {/* Description - Truncated */}
            {item.description && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-3">
                {item.description}
              </p>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-3">
              {/* Quantity Selector - Compact */}
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 disabled:opacity-30 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-zinc-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 99}
                  className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 disabled:opacity-30 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 h-9 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add Rs. {totalPrice}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

'use client'

import { ReactNode, useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import { loadCart } from './slices/cartSlice'

export function ReduxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Load cart from localStorage on app startup
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart')
      if (storedCart) {
        try {
          const cartItems = JSON.parse(storedCart)
          store.dispatch(loadCart(cartItems))
        } catch (error) {
          console.error('Error loading cart from localStorage:', error)
        }
      }
    }
  }, [])

  return <Provider store={store}>{children}</Provider>
}

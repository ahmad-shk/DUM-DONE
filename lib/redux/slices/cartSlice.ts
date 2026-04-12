import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: string
  name: string
  price: string
  category: string
  image?: string
  quantity: number
  description?: string
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. addItem reducer
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1; // Agar item pehle se hai toh quantity barhao
      } else {
        state.items.push({ ...action.payload, quantity: 1 }); // Warna naya item add karo
      }
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items))
      }
    },

    // 2. removeItem reducer
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items))
      }
    },

    // 3. updateQuantity reducer
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== id)
      } else {
        const item = state.items.find((item) => item.id === id)
        if (item) {
          item.quantity = quantity
        }
      }
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items))
      }
    },

    // 4. clearCart reducer (Sirf ek baar rakhein)
    clearCart: (state) => {
      state.items = []
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items))
      }
    },

    // 5. loadCart reducer - load from localStorage
    loadCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart, loadCart } = cartSlice.actions
export default cartSlice.reducer

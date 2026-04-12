# Redux Store Setup

This folder contains the Redux store configuration for managing cart data across the application.

## Usage

### In any client component:

```tsx
'use client'

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { addItem, removeItem, updateQuantity, setSelectedItem } from '@/lib/redux/slices/cartSlice'

export function MyComponent() {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.cart.items)
  const selectedItem = useAppSelector((state) => state.cart.selectedItem)

  const handleAddItem = (item) => {
    dispatch(addItem(item))
  }

  const handleSelectItem = (item) => {
    dispatch(setSelectedItem(item))
  }

  return (
    // Your JSX here
  )
}
```

## Store Structure

```
state.cart = {
  items: CartItem[], // Array of items in cart
  selectedItem: CartItem | null // Currently selected item for viewing details
}
```

## Available Actions

- `addItem(item)` - Add item to cart (auto-increments quantity if exists)
- `removeItem(id)` - Remove item from cart
- `updateQuantity({ id, quantity })` - Update item quantity (removes if quantity <= 0)
- `clearCart()` - Clear all items from cart
- `setSelectedItem(item)` - Set the currently selected item

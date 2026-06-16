import { useEffect, useMemo, useState } from 'react'

import { CartContext } from './cart-context'

const CART_KEY = 'mypicks_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product) => {
    setItems(current => {
      const existing = current.find(item => item.id === product.id)

      if (existing) {
        return current.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || '',
          quantity: 1,
        },
      ]
    })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setItems(current => current.filter(item => item.id !== productId))
      return
    }

    setItems(current =>
      current.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const removeItem = (productId) => {
    setItems(current => current.filter(item => item.id !== productId))
  }

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  )

  const value = {
    items,
    itemCount,
    isOpen,
    addItem,
    updateQuantity,
    removeItem,
    clearCart: () => setItems([]),
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

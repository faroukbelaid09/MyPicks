import { useEffect, useMemo } from 'react'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'

import { createCartOrderMessage, createWhatsAppLink } from '../../config/order'
import { useCart } from '../../context/useCart'
import { formatPrice, getPriceAmount } from '../../utils/price'
import styles from './CartDrawer.module.css'

function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart()

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (total, item) => total + getPriceAmount(item.price) * item.quantity,
        0
      ),
    [items]
  )

  const orderItems = items.map(item => ({
    ...item,
    lineTotal: formatPrice(getPriceAmount(item.price) * item.quantity),
  }))

  const checkoutLink = createWhatsAppLink(
    createCartOrderMessage(orderItems, formatPrice(totalAmount))
  )

  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.overlay} onMouseDown={closeCart}>
      <aside
        aria-label="Shopping cart"
        className={styles.drawer}
        onMouseDown={event => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>YOUR ORDER</p>
            <h2>Cart</h2>
          </div>

          <button
            aria-label="Close cart"
            className={styles.iconButton}
            onClick={closeCart}
          >
            <X size={22} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <ShoppingBag size={36} />
            <h3>Your cart is empty</h3>
            <p>Add menu items, then order everything together.</p>
            <button className={styles.continueButton} onClick={closeCart}>
              Browse menu
            </button>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map(item => (
                <article className={styles.item} key={item.id}>
                  {item.image ? (
                    <img src={item.image} alt="" />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <ShoppingBag size={20} />
                    </div>
                  )}

                  <div className={styles.itemInfo}>
                    <div className={styles.itemTop}>
                      <div>
                        <h3>{item.name}</h3>
                        <p>{formatPrice(item.price)}</p>
                      </div>

                      <button
                        aria-label={`Remove ${item.name}`}
                        className={styles.removeButton}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className={styles.itemBottom}>
                      <div className={styles.quantity}>
                        <button
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus size={15} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <strong>
                        {formatPrice(
                          getPriceAmount(item.price) * item.quantity
                        )}
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <footer className={styles.footer}>
              <div className={styles.total}>
                <span>Total</span>
                <strong>{formatPrice(totalAmount)}</strong>
              </div>

              <a
                className={styles.checkoutButton}
                href={checkoutLink}
                target="_blank"
                rel="noreferrer"
              >
                Order cart on WhatsApp
              </a>

              <button className={styles.clearButton} onClick={clearCart}>
                Clear cart
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}

export default CartDrawer

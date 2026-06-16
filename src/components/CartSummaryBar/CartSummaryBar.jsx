import { ShoppingBag } from 'lucide-react'

import { useCart } from '../../context/useCart'
import { formatPrice, getPriceAmount } from '../../utils/price'
import styles from './CartSummaryBar.module.css'

function CartSummaryBar() {
  const { items, itemCount, isOpen, openCart } = useCart()

  if (!itemCount || isOpen) {
    return null
  }

  const totalAmount = items.reduce(
    (total, item) => total + getPriceAmount(item.price) * item.quantity,
    0
  )

  return (
    <button className={styles.bar} onClick={openCart}>
      <span className={styles.icon}>
        <ShoppingBag size={19} />
      </span>
      <span>
        <strong>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </strong>
        <small>{formatPrice(totalAmount)}</small>
      </span>
      <span className={styles.action}>View cart</span>
    </button>
  )
}

export default CartSummaryBar

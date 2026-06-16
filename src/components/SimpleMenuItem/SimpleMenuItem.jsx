import { Plus } from 'lucide-react'

import { useCart } from '../../context/useCart'
import { formatPrice } from '../../utils/price'
import styles from './SimpleMenuItem.module.css'

function SimpleMenuItem({ product }) {
  const { addItem } = useCart()

  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <h3 className={styles.name}>
          {product.name}
        </h3>

        <p className={styles.category}>
          {product.category}
        </p>
      </div>

      <div className={styles.right}>
        <span className={styles.price}>
          {formatPrice(product.price)}
        </span>

        <button
          aria-label={`Add ${product.name} to cart`}
          className={styles.addButton}
          onClick={() => addItem(product)}
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  )
}

export default SimpleMenuItem

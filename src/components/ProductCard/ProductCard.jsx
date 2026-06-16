import { ShoppingCart } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useCart } from '../../context/useCart'
import { formatPrice } from '../../utils/price'
import styles from './ProductCard.module.css'

function ProductCard({ product }) {
  const [loaded, setLoaded] = useState(false)
  const { addItem } = useCart()

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <article className={styles.card}>
        <Link
          to={`/product/${product.id}`}
          className={styles.detailsLink}
        >
          <div className={styles.imageWrapper}>
            <img
              src={product.image}
              alt={product.name}
              onLoad={() => setLoaded(true)}
              className={`${styles.image} ${
                loaded ? styles.loaded : ''
              }`}
            />

            {!loaded && (
              <div className={styles.imageSkeleton} />
            )}

            {product.featured && (
              <span className={styles.badge}>
                Chef Pick
              </span>
            )}
          </div>

          <div className={styles.content}>
            <div className={styles.topRow}>
              <h3>{product.name}</h3>

              <span className={styles.price}>
                {formatPrice(product.price)}
              </span>
            </div>

            <p className={styles.category}>
              {product.category}
            </p>
          </div>
        </Link>

        <button
          className={styles.addButton}
          onClick={() => addItem(product)}
        >
          <ShoppingCart size={17} />
          Add to cart
        </button>
      </article>
    </motion.div>
  )
}

export default ProductCard

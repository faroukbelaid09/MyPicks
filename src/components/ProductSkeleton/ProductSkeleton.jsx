import styles from './ProductSkeleton.module.css'

function ProductSkeleton() {
  return (
    <div className={styles.card}>

      {/* IMAGE */}
      <div className={styles.image}></div>

      {/* TITLE */}
      <div className={styles.title}></div>

      {/* PRICE */}
      <div className={styles.price}></div>

      {/* BUTTON */}
      <div className={styles.button}></div>

    </div>
  )
}

export default ProductSkeleton
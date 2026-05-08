import { useState } from 'react'
import styles from './ProductCard.module.css'

function ProductCard({ product }) {
    const [loaded, setLoaded] = useState(false)

    const handleOrder = () => {
        const message = `Hi MyPicks 👋 I want to order:
${product.name} - ${product.price}`

        window.open(
            `https://wa.me/YOUR_NUMBER?text=${encodeURIComponent(message)}`,
            '_blank'
        )
    }

    return (
        <div className={styles.card}>

            {/* IMAGE */}
            <div className={styles.imageWrapper}>
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className={loaded ? styles.loaded : ''}
                    onLoad={() => setLoaded(true)}
                />
            </div>

            {/* CONTENT */}
            <div className={styles.content}>

                <div className={styles.topRow}>
                    <h3>{product.name}</h3>

                    <span className={styles.price}>
                        {product.price}
                    </span>
                </div>

                <p className={styles.desc}>
                    {product.description}
                </p>

                <button
                    className={styles.orderButton}
                    onClick={handleOrder}
                >
                    Order on WhatsApp
                </button>

            </div>
        </div>
    )
}

export default ProductCard
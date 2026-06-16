import { motion } from 'motion/react'

import ProductCard from '../ProductCard/ProductCard'
import ProductSkeleton from '../ProductSkeleton/ProductSkeleton'
import Container from '../Ui/Container/Container'

import styles from './Featured.module.css'

function Featured({ products, loading }) {
  const featured = products.filter(item => item.featured === true)

  return (
    <section className={styles.featured} id="featured">
      <Container>
        <h2 className={styles.title}>Chef's Picks</h2>

        <div className={styles.grid}>
          {loading
            ? Array(3).fill().map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            : featured.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35 }}
                >
                  <ProductCard product={item} />
                </motion.div>
              ))
          }
        </div>
      </Container>
    </section>
  )
}

export default Featured

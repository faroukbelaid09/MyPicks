import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

import Container from '../Ui/Container/Container'
import ProductCard from '../ProductCard/ProductCard'
import ProductSkeleton from '../ProductSkeleton/ProductSkeleton'

import styles from './Menu.module.css'

const categories = [
  'All',
  'Small Chops',
  'Meals',
  'Drinks',
]

function Menu({ products, loading }) {
  const [activeCategory, setActiveCategory] =
    useState('All')

  // FILTER PRODUCTS
  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter(
          item => item.category === activeCategory
        )

  return (
    <section className={styles.menu} id="menu">
      <Container>

        {/* TITLE */}
        <h2 className={styles.title}>
          Our Menu
        </h2>

        {/* CATEGORY FILTER */}
        <div className={styles.categoriesWrapper}>
          <div className={styles.categories}>

            {categories.map((category) => (
              <button
                key={category}
                className={
                  activeCategory === category
                    ? styles.active
                    : ''
                }
                onClick={() =>
                  setActiveCategory(category)
                }
              >
                {category}
              </button>
            ))}

          </div>
        </div>

        {/* GRID */}
        <div className={styles.grid}>

          {loading ? (
            Array(6).fill().map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          ) : (
            <AnimatePresence mode="wait">

              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}

            </AnimatePresence>
          )}

        </div>

        {/* EMPTY */}
        {!loading &&
          filteredProducts.length === 0 && (
            <p className={styles.empty}>
              No items found 🍽️
            </p>
          )}

      </Container>
    </section>
  )
}

export default Menu
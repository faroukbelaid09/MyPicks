import { useState } from 'react'
import { Search } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

import Container from '../Ui/Container/Container'
import ProductCard from '../ProductCard/ProductCard'
import ProductSkeleton from '../ProductSkeleton/ProductSkeleton'
import SimpleMenuItem from '../SimpleMenuItem/SimpleMenuItem'

import styles from './Menu.module.css'

const categories = [
  'All',
  'Small Chops',
  'Meals',
  'Drinks',
]

function Menu({ products, loading }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categoryProducts =
    activeCategory === 'All'
      ? products
      : products.filter(item => item.category === activeCategory)

  const normalizedSearch = searchQuery.trim().toLowerCase()

  const filteredProducts = normalizedSearch
    ? categoryProducts.filter(item =>
      [
        item.name,
        item.category,
        item.description,
        item.price,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    )
    : categoryProducts

  const cardItems = filteredProducts.filter(p => p.type !== 'simple')
  const simpleItems = filteredProducts.filter(p => p.type === 'simple')

  return (
    <section className={styles.menu} id="menu">
      <Container>
        <h2 className={styles.title}>Our Menu</h2>

        <label className={styles.search}>
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search menu"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
          />
        </label>

        <div className={styles.categoriesWrapper}>
          <div className={styles.categories}>
            {categories.map(category => (
              <button
                key={category}
                className={
                  activeCategory === category
                    ? styles.active
                    : ''
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {Array(6).fill().map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {cardItems.length > 0 && (
              <>
                <h3 className={styles.sectionTitle}>Meals & Specials</h3>

                <div className={styles.grid}>
                  <AnimatePresence mode="popLayout">
                    {cardItems.map(product => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}

            {simpleItems.length > 0 && (
              <>
                <h3 className={styles.sectionTitle}>Drinks & Extras</h3>

                <div className={styles.list}>
                  <AnimatePresence mode="popLayout">
                    {simpleItems.map(product => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SimpleMenuItem product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </>
        )}

        {!loading && filteredProducts.length === 0 && (
          <p className={styles.empty}>No items found.</p>
        )}
      </Container>
    </section>
  )
}

export default Menu

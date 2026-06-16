import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'

import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import Container from '../../components/Ui/Container/Container'
import { createProductOrderMessage, createWhatsAppLink } from '../../config/order'
import { useCart } from '../../context/useCart'
import { formatPrice } from '../../utils/price'

import styles from './ProductDetails.module.css'

const getGalleryImages = (product) => {
  const gallerySource =
    product.gallery ||
    product.gellery ||
    product.images ||
    []

  if (Array.isArray(gallerySource)) {
    return gallerySource.filter(Boolean)
  }

  return []
}

function ProductDetails({ products, loading }) {
  const { id } = useParams()
  const { addItem, openCart } = useCart()

  const product = useMemo(() => {
    return products.find(item => item.id === id)
  }, [products, id])

  const [activeImage, setActiveImage] = useState(0)

  const gallery = useMemo(() => {
    if (!product) {
      return []
    }

    const galleryImages = getGalleryImages(product)

    if (!product.image) {
      return galleryImages
    }

    return [
      product.image,
      ...galleryImages.filter(img => img !== product.image),
    ]
  }, [product])

  if (loading && !product) {
    return (
      <>
        <Navbar />

        <section className={styles.loading}>
          <div className={styles.loadingImage} />

          <div className={styles.loadingContent}>
            <div />
            <div />
            <div />
          </div>
        </section>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Navbar />

        <div className={styles.notFound}>
          <h2>Food item not found</h2>

          <Link to="/">
            Go Back
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />

      <section className={styles.details}>
        <Container>

          <div className={styles.wrapper}>

            {/* GALLERY */}
            <motion.div
              className={styles.gallery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >

              {gallery.length > 0 ? (
                <>
                  <div className={styles.mainImage}>
                    <img
                      src={gallery[activeImage] || gallery[0]}
                      alt={product.name}
                    />
                  </div>

                  <div className={styles.thumbnails}>

                    {gallery.map((img, index) => (
                      <button
                        key={img}
                        onClick={() => setActiveImage(index)}
                        className={
                          activeImage === index
                            ? styles.activeThumb
                            : ''
                        }
                      >
                        <img src={img} alt={product.name} />
                      </button>
                    ))}

                  </div>
                </>
              ) : (
                <div className={styles.noImage}>
                  No image available
                </div>
              )}

            </motion.div>

            {/* CONTENT */}
            <motion.div
              className={styles.content}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >

              <span className={styles.category}>
                {product.category}
              </span>

              <h1>{product.name}</h1>

              <p className={styles.price}>
                {formatPrice(product.price)}
              </p>

              <p className={styles.description}>
                {product.description ||
                  'Fresh homemade Nigerian food made daily with quality ingredients and authentic taste.'}
              </p>

              <div className={styles.actions}>
                <button
                  className={styles.cartBtn}
                  onClick={() => {
                    addItem(product)
                    openCart()
                  }}
                >
                  Add to cart
                </button>

                <a
                  href={createWhatsAppLink(createProductOrderMessage(product))}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.orderBtn}
                >
                  Order this item
                </a>
              </div>

            </motion.div>

          </div>

        </Container>
      </section>

      <Footer />
    </>
  )
}

export default ProductDetails

import { motion } from 'motion/react'
import styles from './Hero.module.css'
import Container from '../ui/Container/Container'

function Hero() {
  return (
    <section className={styles.hero} id="home">
      <Container>
        <div className={styles.wrapper}>

          {/* Text Content */}
          <motion.div
            className={styles.text}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className={styles.tag}>Homemade • Fresh • Daily</p>

            <h1 className={styles.title}>
              Taste Homemade<br />
              Food Made With Love
            </h1>

            <p className={styles.subtitle}>
              Freshly prepared homemade meals crafted with care.
              Order directly on WhatsApp in seconds.
            </p>

            <div className={styles.actions}>
              <a
                href="https://wa.me/YOUR_NUMBER"
                className={styles.primaryBtn}
                target="_blank"
              >
                Order on WhatsApp
              </a>

              <a href="#menu" className={styles.secondaryBtn}>
                View Menu
              </a>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className={styles.imageBox}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
              alt="Homemade Food"
            />
          </motion.div>

        </div>
      </Container>
    </section>
  )
}

export default Hero
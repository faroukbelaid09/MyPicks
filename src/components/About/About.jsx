import { motion } from 'motion/react'

import Container from '../Ui/Container/Container'
import styles from './About.module.css'

function About({ image }) {
  const aboutImage = image || `${import.meta.env.BASE_URL}mypicks-food.jpg`

  return (
    <section className={styles.about} id="about">
      <Container>
        <div className={styles.wrapper}>
          <motion.div
            className={styles.content}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.label}>
              ABOUT MYPICKS
            </span>

            <h2>
              Homemade Nigerian food crafted with flavor, warmth, and care.
            </h2>

            <p>
              MyPicks brings together delicious homemade meals,
              small chops, refreshing drinks, and tasty snacks
              inspired by authentic Nigerian flavors.
            </p>

            <p>
              Every order is prepared with passion using fresh
              ingredients and delivered with the comforting
              feeling of homemade food.
            </p>

            <div className={styles.stats}>
              <div>
                <h3>100%</h3>
                <span>Homemade</span>
              </div>

              <div>
                <h3>Fresh</h3>
                <span>Daily Preparation</span>
              </div>

              <div>
                <h3>Fast</h3>
                <span>WhatsApp Ordering</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.images}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.mainImage}>
              <img
                src={aboutImage}
                alt="MyPicks homemade food"
                loading="lazy"
              />
            </div>

            <motion.div
              className={styles.floatingCard}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <span>Fresh Daily</span>
              <p>Affordable yummy small chops and meals.</p>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

export default About

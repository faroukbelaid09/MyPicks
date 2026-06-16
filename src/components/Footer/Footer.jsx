import { motion } from 'motion/react'

import { createGeneralOrderMessage, createWhatsAppLink } from '../../config/order'
import Container from '../Ui/Container/Container'
import styles from './Footer.module.css'

function Footer() {
  const orderLink = createWhatsAppLink(createGeneralOrderMessage())

  return (
    <footer className={styles.footer} id="footer">
      <Container>
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.brand}>
            <h2>MyPicks</h2>
            <p>
              Affordable yummy homemade Nigerian food,
              snacks, small chops and drinks.
            </p>
          </div>

          <div className={styles.links}>
            <h3>Quick Links</h3>

            <a href="#menu">Menu</a>
            <a href="#featured">Chef's Picks</a>
            <a href="#about">About</a>
          </div>

          <div className={styles.contact}>
            <h3>Order Now</h3>

            <p>Available on WhatsApp</p>

            <a
              href={orderLink}
              target="_blank"
              rel="noreferrer"
            >
              Chat with us
            </a>
          </div>
        </motion.div>

        <div className={styles.bottom}>
          <p>(c) {new Date().getFullYear()} MyPicks. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer

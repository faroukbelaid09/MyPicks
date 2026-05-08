import { motion } from 'motion/react'

import Container from '../Ui/Container/Container'

import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer} id='footer'>

      <Container>

        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >

          {/* BRAND */}
          <div className={styles.brand}>
            <h2>MyPicks</h2>
            <p>
              Affordable yummy homemade Nigerian food,
              snacks, small chops & drinks.
            </p>
          </div>

          {/* LINKS */}
          <div className={styles.links}>
            <h3>Quick Links</h3>

            <a href="#menu">Menu</a>
            <a href="#featured">Chef’s Picks</a>
            <a href="#about">About</a>
          </div>

          {/* CONTACT */}
          <div className={styles.contact}>
            <h3>Order Now</h3>

            <p>Available on WhatsApp</p>

            <a
              href="https://wa.me/YOUR_NUMBER"
              target="_blank"
              rel="noreferrer"
            >
              Chat with us 💬
            </a>
          </div>

        </motion.div>

        {/* BOTTOM */}
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} MyPicks. All rights reserved.</p>
        </div>

      </Container>

    </footer>
  )
}

export default Footer
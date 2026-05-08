import styles from './WhatsAppButton.module.css'
import { motion } from 'motion/react'

function WhatsAppButton() {
  const phoneNumber = 'YOUR_NUMBER'

  const message = encodeURIComponent(
    "Hi MyPicks 👋 I want to place an order"
  )

  const link = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <motion.a
      href={link}
      target="_blank"
      className={styles.button}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <span className={styles.icon}>💬</span>
      <span className={styles.text}>Order on WhatsApp</span>
    </motion.a>
  )
}

export default WhatsAppButton
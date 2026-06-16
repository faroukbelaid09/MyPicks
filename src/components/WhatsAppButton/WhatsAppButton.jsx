import { motion } from 'motion/react'

import { createGeneralOrderMessage, createWhatsAppLink } from '../../config/order'
import styles from './WhatsAppButton.module.css'

function WhatsAppButton() {
  const link = createWhatsAppLink(createGeneralOrderMessage())

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noreferrer"
      className={styles.button}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <span className={styles.icon}>Chat</span>
      <span className={styles.text}>Order on WhatsApp</span>
    </motion.a>
  )
}

export default WhatsAppButton

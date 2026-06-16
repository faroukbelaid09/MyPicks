import { motion } from 'motion/react'

import Container from '../Ui/Container/Container'
import styles from './Testimonials.module.css'

const reviews = [
  {
    name: 'Aisha K.',
    text: 'The small chops were so fresh and tasty! My whole family loved it.',
    rating: 5,
  },
  {
    name: 'Daniel M.',
    text: 'Very affordable and delicious meals. Ordering on WhatsApp is super easy.',
    rating: 5,
  },
  {
    name: 'Grace O.',
    text: "Honestly one of the best homemade food services I've tried in a long time.",
    rating: 5,
  },
]

function Testimonials() {
  return (
    <section className={styles.testimonials} id="reviews">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.title}>What People Say</h2>
        </motion.div>

        <div className={styles.grid}>
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className={styles.stars}>{review.rating}/5</div>

              <p>"{review.text}"</p>

              <span className={styles.name}>
                - {review.name}
              </span>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Testimonials

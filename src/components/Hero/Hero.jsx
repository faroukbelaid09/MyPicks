import { createGeneralOrderMessage, createWhatsAppLink } from '../../config/order'
import Container from '../Ui/Container/Container'
import styles from './Hero.module.css'

function Hero({ image }) {
  const orderLink = createWhatsAppLink(createGeneralOrderMessage())
  const heroImage = image || `${import.meta.env.BASE_URL}hero.jpg`

  return (
    <section className={styles.hero} id="home">
      <Container>
        <div className={styles.wrapper}>
          <div className={`${styles.text} ${styles.textEnter}`}>
            <p className={styles.tag}>Homemade - Fresh - Daily</p>

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
                href={orderLink}
                className={styles.primaryBtn}
                target="_blank"
                rel="noreferrer"
              >
                Order on WhatsApp
              </a>

              <a href="#menu" className={styles.secondaryBtn}>
                View Menu
              </a>
            </div>
          </div>

          <div className={`${styles.imageBox} ${styles.imageEnter}`}>
            <img
              src={heroImage}
              alt="Homemade Food"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Hero

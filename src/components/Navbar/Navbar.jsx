import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import styles from './Navbar.module.css'
import Container from '../ui/Container/Container'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setMenuOpen(prev => !prev)
  const closeMenu = () => setMenuOpen(false)

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#footer' },
  ]

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <Container>
        <div className={styles.inner}>

          {/* Logo */}
          <div className={styles.logo}>MyPicks</div>

          {/* Desktop Nav */}
          <nav className={styles.navLinks}>
            {links.map(link => (
              <a key={link.name} href={link.href}>
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <button className={styles.cta}>
            Order Now
          </button>

          {/* Mobile Button */}
          <button className={styles.menuBtn} onClick={toggleMenu}>
            <Menu size={22} />
          </button>
        </div>
      </Container>

      {/* FULL SCREEN MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close Button */}
            <button className={styles.closeBtn} onClick={closeMenu}>
              <X size={28} />
            </button>

            {/* Links */}
            <motion.nav
              className={styles.mobileLinks}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.08 }
                }
              }}
            >
              {links.map(link => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  {link.name}
                </motion.a>
              ))}
            </motion.nav>

            {/* CTA */}
            <motion.a
              href="https://wa.me/YOUR_NUMBER"
              className={styles.mobileCta}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={closeMenu}
            >
              Order on WhatsApp
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
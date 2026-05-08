import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

import styles from './Navbar.module.css'
import Container from '../ui/Container/Container'
import { createPortal } from 'react-dom'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // LOCK SCROLL WHEN MENU IS OPEN
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [menuOpen])

    // SCROLL EFFECT
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

                    {/* LOGO */}
                    <div className={styles.logo}>MyPicks</div>

                    {/* DESKTOP LINKS */}
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

                    {/* MOBILE MENU BUTTON */}
                    <button
                        className={`${styles.menuBtn} ${menuOpen ? styles.menuActive : ''
                            }`}
                        onClick={toggleMenu}
                    >
                        <Menu size={22} />
                    </button>

                </div>

            </Container>

            {/* MOBILE FULLSCREEN MENU */}
            {menuOpen &&
                createPortal(
                    <motion.div
                        className={styles.mobileMenu}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >

                        <button className={styles.closeBtn} onClick={closeMenu}>
                            <X size={28} />
                        </button>

                        <motion.nav className={styles.mobileLinks}>
                            {links.map(link => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    onClick={closeMenu}
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                        </motion.nav>

                        <motion.a
                            href="https://wa.me/YOUR_NUMBER"
                            className={styles.mobileCta}
                            onClick={closeMenu}
                        >
                            Order on WhatsApp
                        </motion.a>

                    </motion.div>,
                    document.body
                )}
        </header>
    )
}

export default Navbar
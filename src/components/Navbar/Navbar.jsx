import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Menu, ShoppingCart, X } from 'lucide-react'

import { createGeneralOrderMessage, createWhatsAppLink } from '../../config/order'
import { useCart } from '../../context/useCart'
import Container from '../Ui/Container/Container'
import styles from './Navbar.module.css'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { itemCount, openCart } = useCart()

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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleMenu = () => setMenuOpen(prev => !prev)
    const closeMenu = () => setMenuOpen(false)
    const orderLink = createWhatsAppLink(createGeneralOrderMessage())

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
                    <Link
                        aria-label="MyPicks home"
                        className={styles.logo}
                        to="/"
                    >
                        <img
                            src={`${import.meta.env.BASE_URL}mypicks-logo-transparent.png`}
                            alt="MyPicks Snacks and More"
                        />
                    </Link>

                    <nav className={styles.navLinks}>
                        {links.map(link => (
                            <a key={link.name} href={link.href}>
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    <div className={styles.actions}>
                        <a
                            href={orderLink}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.cta}
                        >
                            Order Now
                        </a>

                        <button
                            aria-label={`Open cart with ${itemCount} items`}
                            className={styles.cartButton}
                            onClick={openCart}
                        >
                            <ShoppingCart size={20} />
                            {itemCount > 0 && (
                                <span>{itemCount > 99 ? '99+' : itemCount}</span>
                            )}
                        </button>

                        <button
                            aria-label="Open menu"
                            className={`${styles.menuBtn} ${menuOpen ? styles.menuActive : ''
                                }`}
                            onClick={toggleMenu}
                        >
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </Container>

            {menuOpen &&
                createPortal(
                    <div className={styles.mobileMenu}>
                        <button className={styles.closeBtn} onClick={closeMenu}>
                            <X size={28} />
                        </button>

                        <nav className={styles.mobileLinks}>
                            {links.map(link => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={closeMenu}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>

                        <a
                            href={orderLink}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.mobileCta}
                            onClick={closeMenu}
                        >
                            Order on WhatsApp
                        </a>
                    </div>,
                    document.body
                )}
        </header>
    )
}

export default Navbar

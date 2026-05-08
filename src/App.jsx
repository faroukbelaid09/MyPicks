import { useEffect, useState } from 'react'

import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Featured from './components/Featured/Featured'
import Menu from './components/Menu/Menu'
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton'

import Admin from './pages/Admin/Admin'
import Login from './pages/Login/Login'

import { fetchProducts } from './firebase/products'
import About from './components/About/About'
import Testimonials from './components/Testimonials/Testimonials'
import Footer from './components/Footer/Footer'

function App() {
  const path = window.location.pathname

  // ADMIN ROUTES
  if (path === '/admin') return <Admin />
  if (path === '/login') return <Login />

  // SHARED STATE
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const CACHE_KEY = 'mypicks_products_cache'

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // 1. CACHE FIRST
        const cached = localStorage.getItem(CACHE_KEY)

        if (cached) {
          setProducts(JSON.parse(cached))
          setLoading(false)
        }

        // 2. FIREBASE FETCH
        const data = await fetchProducts()

        setProducts(data)

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify(data)
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <>
      <Navbar />

      <Hero />

      <Featured
        products={products}
        loading={loading}
      />
      <About />
      <Testimonials />
      <Menu
        products={products}
        loading={loading}
      />
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default App
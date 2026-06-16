import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import CartDrawer from './components/CartDrawer/CartDrawer'
import CartSummaryBar from './components/CartSummaryBar/CartSummaryBar'

import { fetchProducts, fetchSiteContent } from './firebase/products'

const Featured = lazy(() => import('./components/Featured/Featured'))
const Menu = lazy(() => import('./components/Menu/Menu'))
const About = lazy(() => import('./components/About/About'))
const Testimonials = lazy(() => import('./components/Testimonials/Testimonials'))
const Footer = lazy(() => import('./components/Footer/Footer'))
const WhatsAppButton = lazy(() => import('./components/WhatsAppButton/WhatsAppButton'))
const Admin = lazy(() => import('./pages/Admin/Admin'))
const Login = lazy(() => import('./pages/Login/Login'))
const ProductDetails = lazy(() => import('./pages/ProductDetails/ProductDetails'))

function RouteFallback() {
  return (
    <div className="route-loading" aria-label="Loading page">
      <span />
    </div>
  )
}

function HomePage({ products, loading, siteContent }) {
  return (
    <>
      <Navbar />
      <Hero image={siteContent.heroImage} />
      <Suspense fallback={null}>
        <Featured products={products} loading={loading} />
        <About image={siteContent.aboutImage} />
        <Testimonials />
        <Menu products={products} loading={loading} />
        <Footer />
        <WhatsAppButton />
      </Suspense>
    </>
  )
}

function App() {
  const [products, setProducts] = useState([])
  const [siteContent, setSiteContent] = useState({})
  const [loading, setLoading] = useState(true)

  const CACHE_KEY = 'mypicks_products_cache'
  const SITE_CONTENT_CACHE_KEY = 'mypicks_site_content_cache'

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY)

        if (cached) {
          setProducts(JSON.parse(cached))
          setLoading(false)
        }

        const cachedSiteContent = localStorage.getItem(SITE_CONTENT_CACHE_KEY)

        if (cachedSiteContent) {
          setSiteContent(JSON.parse(cachedSiteContent))
        }

        const data = await fetchProducts()

        setProducts(data)
        localStorage.setItem(CACHE_KEY, JSON.stringify(data))

        try {
          const content = await fetchSiteContent()

          setSiteContent(content)
          localStorage.setItem(SITE_CONTENT_CACHE_KEY, JSON.stringify(content))
        } catch (err) {
          console.error('Could not load site content', err)
        }
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
      <Suspense fallback={<RouteFallback />}>
      <Routes>
      {/* HOME */}
      <Route
        path="/"
        element={
          <HomePage
            products={products}
            loading={loading}
            siteContent={siteContent}
          />
        }
      />

      {/* PRODUCT PAGE */}
      <Route
        path="/product/:id"
        element={
          <ProductDetails products={products} loading={loading} />
        }
      />

      {/* ADMIN */}
      <Route path="/admin" element={<Admin />} />

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* 404 SAFE FALLBACK */}
      <Route
        path="*"
        element={
          <HomePage
            products={products}
            loading={loading}
            siteContent={siteContent}
          />
        }
      />
      </Routes>
      </Suspense>
      <CartDrawer />
      <CartSummaryBar />
    </>
  )
}

export default App

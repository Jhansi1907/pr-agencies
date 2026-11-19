import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'; import Footer from './components/Footer.jsx'
import Home from './pages/Home/Home.jsx'; import About from './pages/About/About.jsx'
import Services from './pages/Services/Services.jsx'; import Contact from './pages/Contact/Contact.jsx'
export default function App() {
  const loc = useLocation()
  const reduceMotion = useReducedMotion()
  useEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])
  useEffect(() => {
    if (reduceMotion) return undefined

    let previousY = window.scrollY
    let frame = 0
    const updateDirection = () => {
      frame = 0
      const currentY = window.scrollY
      if (Math.abs(currentY - previousY) < 3) return

      document.documentElement.dataset.scrollDirection = currentY < previousY ? 'up' : 'down'
      previousY = currentY
    }
    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateDirection)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
      delete document.documentElement.dataset.scrollDirection
    }
  }, [reduceMotion])
  return (<>
    <Navbar />
    <AnimatePresence mode="wait">
      <motion.main key={loc.pathname} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .45 }}>
        <Routes location={loc}><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/services" element={<Services/>}/><Route path="/contact" element={<Contact/>}/></Routes>
      </motion.main>
    </AnimatePresence>
    <Footer />
  </>)
}

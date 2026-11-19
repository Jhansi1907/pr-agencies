import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV } from '../data'; import { Magnet } from './Anim.jsx'
export default function Navbar() {
  const [s, setS] = useState(false), [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const menuButtonRef = useRef(null)
  const closeButtonRef = useRef(null)
  const menuRef = useRef(null)
  useEffect(() => { const f = () => setS(scrollY > 40); f(); addEventListener('scroll', f); return () => removeEventListener('scroll', f) }, [])
  useEffect(() => { setIsMenuOpen(false) }, [location.pathname])
  useEffect(() => {
    if (!isMenuOpen) return undefined

    const previousBodyOverflow = document.body.style.overflow
    const previousDocumentOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        return
      }

      if (event.key !== 'Tab' || !menuRef.current) return
      const focusableElements = menuRef.current.querySelectorAll('a[href], button:not([disabled])')
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      if (!firstElement || !lastElement) return

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    const handleResize = () => {
      if (window.innerWidth > 900) setIsMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousDocumentOverflow
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
      menuButtonRef.current?.focus()
    }
  }, [isMenuOpen])
  return (<>
    <header className={'nav' + (s ? ' solid' : '')}>
      <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)} aria-label="PR Agencies home">
        <img src="/images/logo/pr-agencies-logo.jpeg" alt="PR Agencies logo" />
      </Link>
      <nav className="links">{NAV.map(([l, p]) => <NavLink key={p} to={p} end className={({ isActive }) => 'l' + (isActive ? ' active' : '')}>{l}</NavLink>)}</nav>
      <div className="nav-cta"><Magnet><Link to="/contact" className="btn primary">Get in Touch</Link></Magnet></div>
      <button
        ref={menuButtonRef}
        className="burger"
        type="button"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
      >
        <span className="burger__line" />
        <span className="burger__line" />
        <span className="burger__line" />
      </button>
    </header>
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          ref={menuRef}
          id="mobile-navigation"
          className="mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          initial={{ x: '100%', opacity: .8 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: .8 }}
          transition={{ duration: .35, ease: [.22, 1, .36, 1] }}
        >
          <div className="mobile__header">
            <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)} aria-label="PR Agencies home">
              <img src="/images/logo/pr-agencies-logo.jpeg" alt="PR Agencies logo" />
            </Link>
            <button
              ref={closeButtonRef}
              className="mobile__close"
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <nav className="mobile__links" aria-label="Mobile pages">
            {NAV.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                end
                className={({ isActive }) => `mobile__link${isActive ? ' active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  </>)
}

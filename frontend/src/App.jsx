import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Upload from './pages/Upload'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminDashboard from './pages/AdminDashboard'
import Auth from './pages/Auth'
import Pricing from './pages/Pricing'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import NotFound from './pages/NotFound'
import Footer from './components/Footer'
import AuthService from './AuthService'
import { HelmetProvider } from 'react-helmet-async'

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => AuthService.isAuthenticated())
  const location = useLocation()

  // Listen for authentication changes
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = AuthService.isAuthenticated()
      setIsAuthenticated(authStatus)
    }

    // Check auth on location change
    checkAuth()

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'pyq_token' || e.key === 'pyq_user') {
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [location.pathname])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])


  const user = AuthService.getUser()
  const isAdmin = user?.role === 'admin'
  // Show Navbar/Footer only for regular authenticated students
  const showShell = isAuthenticated && !isAdmin

  return (
    <div style={{ minHeight: '100vh', visibility: 'visible' }}>
      {showShell && <Navbar />}
      <main>
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            // Not logged in — show auth page for all routes
            <Routes location={location} key={location.pathname}>
              <Route path="*" element={<PageTransition><Auth /></PageTransition>} />
            </Routes>
          ) : isAdmin ? (
            // Admin — only admin dashboard, redirect everything else to /admin
            <Routes location={location} key={location.pathname}>
              <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          ) : (
            // Regular student — all student routes, block /admin
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/browse" element={<PageTransition><Browse /></PageTransition>} />
              <Route path="/upload" element={<PageTransition><Upload /></PageTransition>} />
              <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
              <Route path="/payment-success" element={<PageTransition><PaymentSuccess /></PageTransition>} />
              <Route path="/payment-cancel" element={<PageTransition><PaymentCancel /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
              <Route path="/admin" element={<Navigate to="/" replace />} />
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          )}
        </AnimatePresence>
      </main>
      {showShell && <Footer />}
    </div>
  )
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  )
}

export default App
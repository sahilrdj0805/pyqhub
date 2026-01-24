import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Upload from './pages/Upload'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminDashboard from './pages/AdminDashboard'
import Auth from './pages/Auth'
import Footer from './components/Footer'
import AuthService from './AuthService'

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
  useEffect(() => {
    // Disable browser back/forward buttons more aggressively
    const preventNavigation = () => {
      window.history.pushState(null, '', window.location.pathname)
    }

    const handlePopState = (e) => {
      e.preventDefault()
      e.stopPropagation()
      preventNavigation()
      return false
    }

    // Only apply history manipulation if user is authenticated
    if (isAuthenticated) {
      // Push multiple states to make back button ineffective
      for (let i = 0; i < 10; i++) {
        window.history.pushState(null, '', window.location.pathname)
      }

      window.addEventListener('popstate', handlePopState, true)
      
      // Also disable keyboard shortcuts
      const handleKeyDown = (e) => {
        // Disable Alt+Left, Alt+Right, Backspace navigation
        if ((e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) ||
            (e.key === 'Backspace' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA')) {
          e.preventDefault()
          e.stopPropagation()
          return false
        }
      }

      document.addEventListener('keydown', handleKeyDown, true)

      return () => {
        window.removeEventListener('popstate', handlePopState, true)
        document.removeEventListener('keydown', handleKeyDown, true)
      }
    }
  }, [isAuthenticated])

  return (
    <div style={{ 
      minHeight: '100vh',
      visibility: 'visible'
    }}>
      {isAuthenticated && <Navbar />}
      <main>
        {!isAuthenticated ? (
          <Routes>
            <Route path="*" element={<Auth />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Navigate to="/admin" replace />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        )}
      </main>
      {isAuthenticated && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
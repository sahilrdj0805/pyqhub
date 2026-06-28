import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import AuthService from '../AuthService'

const NAV_ITEMS = [
  { name: 'Home',    path: '/' },
  { name: 'Browse',  path: '/browse' },
  { name: 'Upload',  path: '/upload' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'About',   path: '/about' },
  { name: 'Contact', path: '/contact' },
]

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

const LogOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const MenuIcon = ({ open }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open
      ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
      : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
    }
  </svg>
)

const Navbar = () => {
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user] = useState(() => AuthService.getUser())
  const [credits, setCredits] = useState(() => user?.credits ?? null)
  const [isPro, setIsPro] = useState(() => user?.isPro || false)
  const location = useLocation()
  const dropdownRef = useRef(null)

  const allItems = [...NAV_ITEMS, ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin' }] : [])]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
    }
    window.addEventListener('scroll', onScroll)
    document.addEventListener('mousedown', onClickOutside)
    
    const fetchCredits = () => {
      if (user && user.role !== 'admin') {
        axios.get('/api/payment/check-credits', {
          headers: { Authorization: `Bearer ${AuthService.getToken()}` }
        }).then(res => {
          setIsPro(res.data.isPro)
          if (res.data.credits !== undefined) setCredits(res.data.credits)
        }).catch(err => {
          if (err.response?.status === 402) {
            setIsPro(false)
            setCredits(err.response.data.credits || 0)
          }
        })
      }
    }

    fetchCredits();
    window.addEventListener('creditsUpdated', fetchCredits)

    return () => { 
      window.removeEventListener('scroll', onScroll); 
      document.removeEventListener('mousedown', onClickOutside);
      window.removeEventListener('creditsUpdated', fetchCredits);
    }
  }, [user, location.pathname]) // also re-fetch when location changes (like after a download)

  // Close mobile on route change
  useEffect(() => setMobileOpen(false), [location.pathname])

  const initials = user?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-content">

          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '60%', height: '60%', color: 'white' }}>
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className="logo-text">PYQ Hub</span>
          </Link>

          {/* Desktop links */}
          <ul className="nav-links" style={{ display: 'flex' }}>
            {allItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

            {/* Credit Badge (Students only) */}
            {user && user.role !== 'admin' && (
              <motion.div
                initial={false}
                animate={{
                  background: isPro ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(34,211,238,0.1)',
                  borderColor: isPro ? 'rgba(245,158,11,0.5)' : 'rgba(34,211,238,0.3)',
                  color: isPro ? '#fff' : '#22d3ee',
                  boxShadow: isPro ? '0 4px 14px rgba(245,158,11,0.3)' : '0 0 0 rgba(0,0,0,0)'
                }}
                style={{ 
                  padding: '6px 14px',
                  border: '1px solid',
                  borderRadius: '100px', 
                  fontSize: '0.85rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default',
                  position: 'relative', overflow: 'hidden'
                }}
              >
                <AnimatePresence mode="wait">
                  {isPro ? (
                    <motion.div key="pro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      🌟 PRO
                    </motion.div>
                  ) : (
                    <motion.div key="free" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      🪙 {credits !== null ? (
                        <motion.span key={credits} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                          {credits}
                        </motion.span>
                      ) : (
                        <div style={{ width: '20px', height: '14px', background: 'rgba(34,211,238,0.2)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                      )} Credits
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Profile dropdown */}
            {user && (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 12px 6px 6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '100px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    color: 'var(--text-1)',
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: user.role === 'admin'
                      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                      : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '700', color: 'white',
                  }}>
                    {initials}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-1)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <motion.span
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: 'var(--text-3)', display: 'flex' }}
                  >
                    <ChevronDown />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                        width: '240px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                        overflow: 'hidden',
                        zIndex: 2000,
                      }}
                    >
                      {/* User info */}
                      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-1)', marginBottom: '2px' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginBottom: '8px' }}>
                          {user.email}
                        </div>
                        <span className={`badge ${user.role === 'admin' ? 'badge-yellow' : ''}`} style={{ fontSize: '0.7rem' }}>
                          {user.role === 'admin' ? <><ShieldIcon /> Admin</> : 'Student'}
                        </span>
                      </div>

                      {/* Actions */}
                      <div style={{ padding: '8px' }}>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-2)', textDecoration: 'none',
                              fontSize: '0.875rem', fontWeight: '500',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <ShieldIcon /> Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => { setDropdownOpen(false); AuthService.logout() }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                            padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                            background: 'transparent', border: 'none',
                            color: '#f87171', fontSize: '0.875rem', fontWeight: '500',
                            cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <LogOutIcon /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: 'var(--text-2)', background: 'none', border: 'none', cursor: 'pointer', display: 'none', padding: '6px' }}
            >
              <MenuIcon open={mobileOpen} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', marginTop: '4px' }}
            >
              <div style={{ padding: '16px 0' }}>
                {allItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'block', padding: '10px 4px',
                      color: location.pathname === item.path ? 'var(--blue-lt)' : 'var(--text-2)',
                      textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500',
                      borderRadius: 'var(--radius-sm)', transition: 'all 0.15s',
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
                <div style={{ height: '1px', background: 'var(--border)', margin: '12px 0' }} />
                <button
                  onClick={() => AuthService.logout()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 4px', background: 'none', border: 'none',
                    color: '#f87171', fontSize: '0.9rem', fontWeight: '500',
                    cursor: 'pointer', width: '100%',
                  }}
                >
                  <LogOutIcon /> Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
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

const Navbar = () => {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user]    = useState(() => AuthService.getUser())
  const [credits, setCredits] = useState(() => user?.credits ?? null)
  const [isPro, setIsPro]     = useState(() => user?.isPro || false)
  const location  = useLocation()
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

    fetchCredits()
    window.addEventListener('creditsUpdated', fetchCredits)

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mousedown', onClickOutside)
      window.removeEventListener('creditsUpdated', fetchCredits)
    }
  }, [user, location.pathname])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setDropdownOpen(false) }, [location.pathname])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

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
          <ul className="nav-links">
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
          <div className="nav-right">

            {/* Credit Badge (Students only, desktop) */}
            {user && user.role !== 'admin' && (
              <motion.div
                className="nav-credit-badge"
                initial={false}
                animate={{
                  background: isPro ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(34,211,238,0.1)',
                  borderColor: isPro ? 'rgba(245,158,11,0.5)' : 'rgba(34,211,238,0.3)',
                  color: isPro ? '#fff' : '#22d3ee',
                  boxShadow: isPro ? '0 4px 14px rgba(245,158,11,0.3)' : '0 0 0 rgba(0,0,0,0)'
                }}
              >
                <AnimatePresence mode="wait">
                  {isPro ? (
                    <motion.div key="pro" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                      🌟 PRO
                    </motion.div>
                  ) : (
                    <motion.div key="free" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                      🪙 {credits !== null ? (
                        <motion.span key={credits} initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                          {credits}
                        </motion.span>
                      ) : (
                        <div style={{ width: '20px', height: '12px', background: 'rgba(34,211,238,0.2)', borderRadius: '4px' }} />
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
                  className="nav-profile-btn"
                >
                  <div className="nav-avatar" style={{
                    background: user.role === 'admin'
                      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                      : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  }}>
                    {initials}
                  </div>
                  <span className="nav-username">{user.name?.split(' ')[0]}</span>
                  <motion.span
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: 'var(--text-3)', display: 'flex', flexShrink: 0 }}
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
                        {/* Credits badge in dropdown (mobile sees this too) */}
                        {user.role !== 'admin' && (
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '4px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700,
                            background: isPro ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(34,211,238,0.1)',
                            color: isPro ? '#fff' : '#22d3ee',
                            border: `1px solid ${isPro ? 'rgba(245,158,11,0.4)' : 'rgba(34,211,238,0.3)'}`,
                            marginBottom: 10,
                          }}>
                            {isPro ? '🌟 PRO' : `🪙 ${credits ?? '…'} Credits`}
                          </div>
                        )}
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
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <motion.div animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }} transition={{ duration: 0.2 }} style={{ width: 20, height: 2, background: 'var(--text-2)', borderRadius: 2 }} />
              <motion.div animate={{ opacity: mobileOpen ? 0 : 1 }} transition={{ duration: 0.15 }} style={{ width: 20, height: 2, background: 'var(--text-2)', borderRadius: 2 }} />
              <motion.div animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }} transition={{ duration: 0.2 }} style={{ width: 20, height: 2, background: 'var(--text-2)', borderRadius: 2 }} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0, top: 64,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 998,
              }}
            />
            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed', top: 64, right: 0, bottom: 0,
                width: 'min(300px, 85vw)',
                background: 'var(--bg-surface)',
                borderLeft: '1px solid var(--border)',
                zIndex: 999,
                display: 'flex', flexDirection: 'column',
                overflowY: 'auto',
              }}
            >
              {/* User card at top of drawer */}
              {user && (
                <div style={{
                  padding: '20px',
                  borderBottom: '1px solid var(--border)',
                  background: 'rgba(99,102,241,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      background: user.role === 'admin' ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15, fontWeight: 700, color: 'white',
                    }}>
                      {initials}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                    </div>
                  </div>
                  {user.role !== 'admin' && (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '5px 12px', borderRadius: 100, fontSize: '0.78rem', fontWeight: 700,
                      background: isPro ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(34,211,238,0.1)',
                      color: isPro ? '#fff' : '#22d3ee',
                      border: `1px solid ${isPro ? 'rgba(245,158,11,0.4)' : 'rgba(34,211,238,0.3)'}`,
                    }}>
                      {isPro ? '🌟 PRO Member' : `🪙 ${credits ?? '…'} Credits Left`}
                    </div>
                  )}
                </div>
              )}

              {/* Nav Links */}
              <nav style={{ padding: '12px 8px', flex: 1 }}>
                {allItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={item.path}
                      style={{
                        display: 'flex', alignItems: 'center',
                        padding: '12px 14px',
                        color: location.pathname === item.path ? 'var(--blue-lt)' : 'var(--text-2)',
                        textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500,
                        borderRadius: 'var(--radius-sm)', transition: 'all 0.15s',
                        background: location.pathname === item.path ? 'rgba(99,102,241,0.1)' : 'transparent',
                        marginBottom: 2,
                      }}
                    >
                      {item.name}
                      {location.pathname === item.path && (
                        <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--blue-lt)' }} />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Sign Out */}
              <div style={{ padding: '12px 8px 24px', borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={() => AuthService.logout()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                    background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
                    color: '#f87171', fontSize: '0.9rem', fontWeight: 500,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <LogOutIcon /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
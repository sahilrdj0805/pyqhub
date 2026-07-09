import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthAPI } from '../ApiService'
import AuthService from '../AuthService'
import { useToast } from '../context/ToastContext'

// ── Icons ──────────────────────────────────────────────
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
)
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const EyeIcon = ({ show }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {show
      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
    }
  </svg>
)

const Auth = () => {
  const [mode, setMode]       = useState('signin')   // 'signin' | 'signup' | 'admin'
  const [form, setForm]       = useState({ name: '', email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const isSignup = mode === 'signup'
  const isAdmin  = mode === 'admin'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let response
      if (isSignup) {
        response = await AuthAPI.signup({ name: form.name, email: form.email, password: form.password })
      } else if (isAdmin) {
        response = await AuthAPI.adminLogin({ email: form.email, password: form.password })
      } else {
        response = await AuthAPI.signin({ email: form.email, password: form.password })
      }
      AuthService.setUser(response.user)
      showToast(isSignup ? 'Account created! Redirecting…' : 'Welcome back! Redirecting…', 'success')
      setTimeout(() => {
        window.location.href = isAdmin ? '/admin' : '/'
      }, 1200)
    } catch (err) {
      showToast(err.message || 'Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (next) => {
    setMode(next)
    setForm({ name: '', email: '', password: '' })
  }

  return (
    <div className="auth-section">
      {/* Background blobs */}
      <div className="blob blob-blue"  style={{ top: '5%',  left: '-15%', opacity: 0.5 }} />
      <div className="blob blob-cyan" style={{ bottom: '10%', right: '-10%', opacity: 0.4 }} />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Logo */}
        <div className="auth-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '60%', height: '60%', color: 'white' }}>
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span className="logo-text">PYQ Hub</span>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            {isSignup ? 'Create an account' : isAdmin ? 'Admin sign in' : 'Welcome back'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>
            {isSignup ? 'Join thousands of students on PYQ Hub' : isAdmin ? 'Restricted to administrators only' : 'Sign in to your account to continue'}
          </p>
        </div>

        {/* Mode tabs (only for signin/admin) */}
        {!isSignup && (
          <div className="auth-tabs" style={{ marginBottom: '24px' }}>
            <button
              className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => switchMode('signin')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <UserIcon /> Student
              </span>
            </button>
            <button
              className={`auth-tab ${mode === 'admin' ? 'active' : ''}`}
              onClick={() => switchMode('admin')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <ShieldIcon /> Admin
              </span>
            </button>
          </div>
        )}

        {/* Admin notice */}
        {isAdmin && (
          <div className="alert alert-info" style={{ marginBottom: '20px', fontSize: '0.8rem' }}>
            <ShieldIcon />
            <span>Admin access only. Unauthorized attempts are logged.</span>
          </div>
        )}



        {/* Form */}
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Name (signup only) */}
              {isSignup && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', display: 'flex' }}>
                      <UserIcon />
                    </span>
                    <input
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                      type="text"
                      name="name"
                      placeholder="Sahil Ahmad"
                      value={form.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="form-group">
                <label className="form-label">{isAdmin ? 'Admin Email' : 'Email address'}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', display: 'flex' }}>
                    <MailIcon />
                  </span>
                  <input
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    type="email"
                    name="email"
                    placeholder={isAdmin ? 'admin@example.com' : 'you@example.com'}
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', display: 'flex' }}>
                    <LockIcon />
                  </span>
                  <input
                    className="form-input"
                    style={{ paddingLeft: '38px', paddingRight: '40px' }}
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)',
                      display: 'flex', padding: '2px',
                    }}
                  >
                    <EyeIcon show={showPw} />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%', justifyContent: 'center',
              padding: '13px',
              fontSize: '0.95rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              background: isAdmin ? 'linear-gradient(135deg, #f59e0b, #d97706)' : undefined,
              boxShadow: isAdmin ? '0 0 20px rgba(245,158,11,0.3)' : undefined,
            }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                {isSignup ? 'Creating account…' : 'Signing in…'}
              </>
            ) : (
              isSignup ? 'Create account' : isAdmin ? 'Sign in as Admin' : 'Sign in'
            )}
          </button>
        </form>

        {/* Footer toggle */}
        {!isAdmin && (
          <>
            <div className="auth-divider" style={{ marginTop: '24px' }}>
              <span>{isSignup ? 'Already have an account?' : "Don't have an account?"}</span>
            </div>
            <button
              onClick={() => switchMode(isSignup ? 'signin' : 'signup')}
              className="btn btn-ghost"
              style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
            >
              {isSignup ? 'Sign in instead' : 'Create a free account'}
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default Auth
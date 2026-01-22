import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthAPI } from '../ApiService'
import AuthService from '../AuthService'

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [activeTab, setActiveTab] = useState('user')
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let response
      
      if (isSignUp) {
        response = await AuthAPI.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      } else {
        if (activeTab === 'admin') {
          response = await AuthAPI.adminLogin({
            email: formData.email,
            password: formData.password
          })
        } else {
          response = await AuthAPI.signin({
            email: formData.email,
            password: formData.password
          })
        }
      }
      
      // Store auth data using AuthService
      AuthService.setToken(response.token)
      AuthService.setUser(response.user)
      
      // Show success message
      const successMsg = isSignUp 
        ? '🎉 Account created successfully! Redirecting...'
        : activeTab === 'admin' 
          ? '🛡️ Admin login successful! Welcome back...'
          : '✨ Login successful! Welcome back...'
      
      setSuccess(successMsg)
      
      // Redirect after showing success message
      setTimeout(() => {
        window.history.replaceState(null, '', (activeTab === 'admin' && !isSignUp) ? '/admin' : '/')
        window.location.href = (activeTab === 'admin' && !isSignUp) ? '/admin' : '/'
      }, 1500)
    } catch (error) {
      const errorMsg = error.message === 'Invalid credentials' 
        ? '🚫 Invalid email or password! Please try again.'
        : error.message === 'User not found'
          ? '🚫 Account not found! Please check your email.'
          : `🚫 ${error.message || 'Authentication failed! Please try again.'}`
      
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setFormData({ name: '', email: '', password: '' })
    setError('')
    setSuccess('')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      background: '#0a0a0a',
      backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Error Message - Fixed Position */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          style={{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(239, 68, 68, 0.6)',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: '600',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
            minWidth: '300px'
          }}
        >
          🚫 {error}
        </motion.div>
      )}

      {/* Success Message - Fixed Position */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          style={{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.95), rgba(56, 161, 105, 0.95))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(72, 187, 120, 0.6)',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: '600',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(72, 187, 120, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
            minWidth: '300px'
          }}
        >
          {success}
        </motion.div>
      )}
      {/* Enhanced Background Animation */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
              background: `radial-gradient(circle, rgba(102, 126, 234, ${0.1 - i * 0.02}) 0%, transparent 70%)`,
              borderRadius: '50%',
              top: `${10 + i * 20}%`,
              left: `${5 + i * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8 + i * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ 
          width: '100%', 
          maxWidth: '380px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '32px',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)'
          e.currentTarget.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
          
          // Add shimmer effect
          const shimmer = document.createElement('div')
          shimmer.style.cssText = `
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(102, 126, 234, 0.1), transparent);
            animation: shimmer 2s infinite;
            pointer-events: none;
            z-index: 1;
          `
          e.currentTarget.appendChild(shimmer)
          
          setTimeout(() => {
            if (shimmer.parentNode) shimmer.remove()
          }, 2000)
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {/* Floating particles background for container */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)',
          borderRadius: '24px',
          pointerEvents: 'none'
        }} />
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
          <motion.div 
            whileHover={{ scale: 1.15, rotateY: 15, rotateX: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              width: '60px', 
              height: '60px', 
              background: isSignUp 
                ? 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)'
                : activeTab === 'admin' 
                  ? 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '18px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '2rem',
              margin: '0 auto 15px',
              transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
              transformStyle: 'preserve-3d',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              const shimmer = document.createElement('div')
              shimmer.style.cssText = `
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
                animation: shimmer 1.5s infinite;
                pointer-events: none;
                z-index: 1;
              `
              e.currentTarget.appendChild(shimmer)
              
              setTimeout(() => {
                if (shimmer.parentNode) shimmer.remove()
              }, 1500)
            }}
          >
            <span style={{ position: 'relative', zIndex: 2 }}>
              {isSignUp ? '✨' : activeTab === 'admin' ? '🛡️' : '👤'}
            </span>
          </motion.div>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '800', 
            color: 'white',
            marginBottom: '10px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}>
            {isSignUp ? 'Join PYQ Hub' : 'Welcome Back'}
          </h2>
          <p style={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: '0.9rem' 
          }}>
            {isSignUp ? 'Create your account' : 'Sign in to continue'}
          </p>
        </div>

        {/* Enhanced Tabs - Only show for Sign In */}
        {!isSignUp && (
          <div style={{ 
            display: 'flex', 
            marginBottom: '25px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '6px',
            position: 'relative',
            zIndex: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <motion.div
              style={{
                position: 'absolute',
                top: '6px',
                bottom: '6px',
                left: activeTab === 'user' ? '6px' : '50%',
                right: activeTab === 'user' ? '50%' : '6px',
                background: activeTab === 'admin' 
                  ? 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '10px',
                transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                boxShadow: activeTab === 'admin'
                  ? '0 4px 15px rgba(255, 107, 107, 0.4)'
                  : '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              layout
            />
            
            <button
              onClick={() => setActiveTab('user')}
              style={{
                flex: 1,
                padding: '10px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 1
              }}
            >
              👤 User
            </button>
            
            <button
              onClick={() => setActiveTab('admin')}
              style={{
                flex: 1,
                padding: '10px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 1
              }}
            >
              🛡️ Admin
            </button>
          </div>
        )}

        {/* Enhanced Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '25px', position: 'relative', zIndex: 2 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ minHeight: '140px' }}
            >
              {isSignUp && (
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                      position: 'relative'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4ecdc4'
                      e.target.style.boxShadow = '0 0 0 3px rgba(78, 205, 196, 0.2), 0 8px 25px rgba(78, 205, 196, 0.3)'
                      e.target.style.background = 'rgba(78, 205, 196, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                      e.target.style.boxShadow = 'none'
                      e.target.style.background = 'rgba(255, 255, 255, 0.08)'
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '15px' }}>
                <input
                  type="email"
                  name="email"
                  placeholder={!isSignUp && activeTab === 'admin' ? 'Admin Email' : 'Email'}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
                  }}
                  onFocus={(e) => {
                    const color = isSignUp ? '#4ecdc4' : activeTab === 'admin' ? '#ff6b6b' : '#667eea'
                    e.target.style.borderColor = color
                    e.target.style.boxShadow = `0 0 0 3px ${color}30, 0 8px 25px ${color}40`
                    e.target.style.background = `${color}15`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                    e.target.style.boxShadow = 'none'
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
                  }}
                  onFocus={(e) => {
                    const color = isSignUp ? '#4ecdc4' : activeTab === 'admin' ? '#ff6b6b' : '#667eea'
                    e.target.style.borderColor = color
                    e.target.style.boxShadow = `0 0 0 3px ${color}30, 0 8px 25px ${color}40`
                    e.target.style.background = `${color}15`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                    e.target.style.boxShadow = 'none'
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)'
                  }}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Only keep error in form for fallback */}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '100%',
              padding: '16px',
              background: isSignUp 
                ? 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)'
                : activeTab === 'admin' 
                  ? 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1.05rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: isSignUp 
                ? '0 8px 25px rgba(255, 107, 107, 0.4)'
                : activeTab === 'admin' 
                  ? '0 8px 25px rgba(255, 107, 107, 0.4)'
                  : '0 8px 25px rgba(102, 126, 234, 0.4)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                const shimmer = document.createElement('div')
                shimmer.style.cssText = `
                  position: absolute;
                  top: 0;
                  left: -100%;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                  animation: buttonShimmer 0.8s ease-out;
                  pointer-events: none;
                `
                e.currentTarget.appendChild(shimmer)
                setTimeout(() => shimmer.remove(), 800)
              }
            }}
          >
            {loading ? (
              <>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid rgba(255,255,255,0.3)', 
                  borderTop: '2px solid white', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite' 
                }} />
                {isSignUp ? 'Creating...' : 'Signing In...'}
              </>
            ) : (
              <>
                {isSignUp ? '🚀 Create Account' : `🔑 Sign In${activeTab === 'admin' ? ' as Admin' : ''}`}
              </>
            )}
          </motion.button>
        </form>

        {/* Toggle Mode */}
        <div style={{ textAlign: 'center', paddingTop: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '10px', fontSize: '0.85rem' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <motion.button
            onClick={toggleMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = isSignUp ? '#4a90e2' : '#4ecdc4'
              e.target.style.background = isSignUp ? 'rgba(74, 144, 226, 0.1)' : 'rgba(78, 205, 196, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              e.target.style.background = 'transparent'
            }}
          >
            {isSignUp ? '🔑 Sign In' : '✨ Sign Up'}
          </motion.button>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes focusShimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes buttonShimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  )
}

export default Auth
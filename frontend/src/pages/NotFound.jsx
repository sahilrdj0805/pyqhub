import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '24px'
    }}>
      
      {/* Background Blobs */}
      <div className="blob blob-purple" style={{ top: '20%', left: '10%', opacity: 0.3 }} />
      <div className="blob blob-cyan" style={{ bottom: '20%', right: '10%', opacity: 0.2 }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(8rem, 20vw, 15rem)',
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.05em',
          margin: 0,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(34,211,238,0.05) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextStroke: '2px rgba(99,102,241,0.5)',
          color: 'transparent',
          position: 'relative'
        }}>
          404
        </h1>
        
        <div style={{ marginTop: '-40px' }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text-1)',
            marginBottom: '16px'
          }}>
            Page not found
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'var(--text-3)',
            maxWidth: '500px',
            margin: '0 auto 40px',
            lineHeight: 1.6
          }}>
            Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <Link
            to="/"
            className="btn btn-primary btn-lg"
            style={{
              padding: '16px 32px',
              borderRadius: '100px',
              fontSize: '1.05rem',
              display: 'inline-flex',
              gap: '12px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound

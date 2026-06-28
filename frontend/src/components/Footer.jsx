import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// ── Icons ──────────────────────────────────────────────
const SvgIcon = ({ children, size = 18, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
    {children}
  </svg>
)
const I = {
  Github:  (p) => <SvgIcon {...p}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></SvgIcon>,
  Twitter: (p) => <SvgIcon {...p}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></SvgIcon>,
  Mail:    (p) => <SvgIcon {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></SvgIcon>
}

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      position: 'relative',
      background: 'var(--bg-elevated)',
      borderTop: '1px solid var(--border)',
      padding: '40px 0 20px',
      overflow: 'hidden',
      marginTop: 'auto'
    }}>
      
      {/* Background blobs */}
      <div className="blob blob-purple" style={{ top: '-50%', left: '10%', opacity: 0.15 }} />
      <div className="blob blob-cyan" style={{ top: '-50%', right: '10%', opacity: 0.1 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '32px',
          marginBottom: '32px'
        }}>

          {/* Brand */}
          <div style={{ maxWidth: '400px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
              <div className="logo-icon" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '60%', height: '60%', color: 'white' }}>
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <span className="logo-text" style={{ fontSize: '1.2rem' }}>PYQ Hub</span>
            </Link>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
              A premium platform for students to browse, download, and share previous year question papers. Built to make exam preparation flawless.
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
            <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-1)', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'Browse Papers', path: '/browse' },
                { name: 'Upload Paper', path: '/upload' },
                { name: 'Pricing', path: '/pricing' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' }
              ].map(link => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-2)'}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '20px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', margin: 0 }}>
            © {year} PYQ Hub. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            Made with <span style={{ color: '#ef4444' }}>♥</span> for students
          </p>
        </div>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </footer>
  )
}

export default Footer
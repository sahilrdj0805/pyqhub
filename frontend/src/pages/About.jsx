import React from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'

// ── Icons ──────────────────────────────────────────────
const SvgIcon = ({ children, size = 24, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
    {children}
  </svg>
)
const I = {
  Target: (p) => <SvgIcon {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></SvgIcon>,
  Search: (p) => <SvgIcon {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></SvgIcon>,
  Cloud:  (p) => <SvgIcon {...p}><path d="M17.5 19H9a7 7 0 1 1 6.71-9.9 4.5 4.5 0 1 1 2.79 8.9z"/></SvgIcon>,
  Phone:  (p) => <SvgIcon {...p}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></SvgIcon>,
  Shield: (p) => <SvgIcon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></SvgIcon>,
  Zap:    (p) => <SvgIcon {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></SvgIcon>,
  Award:  (p) => <SvgIcon {...p}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></SvgIcon>,
}

const features = [
  { icon: I.Search, title: 'Smart Search', desc: 'Advanced search functionality to find papers by subject, year, or title quickly.', accent: '#818cf8' },
  { icon: I.Cloud,  title: 'Cloud Storage', desc: 'Secure cloud-based storage ensures your papers are always accessible.', accent: '#22d3ee' },
  { icon: I.Phone,  title: 'Mobile Friendly', desc: 'Responsive design that works perfectly on all devices and screen sizes.', accent: '#facc15' },
  { icon: I.Shield, title: 'Secure Platform', desc: 'User authentication and secure file handling for a safe experience.', accent: '#4ade80' },
  { icon: I.Zap,    title: 'Fast Downloads', desc: 'Optimized file delivery for quick and reliable downloads across the globe.', accent: '#fb923c' },
  { icon: I.Award,  title: 'Quality Control', desc: 'Admin moderation ensures only authentic and quality papers are available.', accent: '#a78bfa' },
]

const stats = [
  { number: '500+', label: 'Question Papers' },
  { number: '1000+', label: 'Active Users' },
  { number: '50+', label: 'Subjects' },
  { number: '5000+', label: 'Downloads' },
]

const stack = ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Cloudinary', 'Framer Motion']

const About = () => {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
      <SEO title="About Us | PYQ Hub" description="Learn more about PYQ Hub and our mission to help students." />
      
      {/* Background blobs */}
      <div className="blob blob-blue" style={{ top: '10%', left: '-10%', opacity: 0.35, width: '40vw', height: '40vw' }} />
      <div className="blob blob-cyan" style={{ top: '40%', right: '-10%', opacity: 0.25, width: '35vw', height: '35vw' }} />
      <div className="blob blob-purple" style={{ bottom: '10%', left: '20%', opacity: 0.3, width: '45vw', height: '45vw' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '80px' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '100px', color: '#818cf8', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Our Story
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px' }}>
            About <span style={{ color: 'transparent', backgroundImage: 'linear-gradient(135deg, #a78bfa, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>PYQ Hub</span>
          </h1>
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', color: 'var(--text-3)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Empowering students with seamless access to previous year question papers. Designed for clarity, built for performance.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '48px',
            textAlign: 'center',
            marginBottom: '80px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #a78bfa, #22d3ee)' }} />
          <div style={{ width: '64px', height: '64px', margin: '0 auto 24px', borderRadius: '16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
            <I.Target size={32} />
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '20px', letterSpacing: '-0.02em' }}>
            Our Mission
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '800px', margin: '0 auto' }}>
            To democratize access to educational resources by providing a comprehensive, fast, and beautiful platform where students can effortlessly find, share, and access past examination papers. We believe that quality education should be barrier-free and beautifully accessible to everyone.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
              Why PYQ Hub?
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (i * 0.05), ease: [0.2, 0.8, 0.2, 1] }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '32px',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${f.accent}50`
                  e.currentTarget.style.boxShadow = `0 12px 40px ${f.accent}15`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${f.accent}15`, border: `1px solid ${f.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.accent, marginBottom: '20px' }}>
                  <f.icon />
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '12px' }}>
                  {f.title}
                </h3>
                <p style={{ color: 'var(--text-3)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Statistics & Tech Stack Wrapper */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          
          {/* Statistics */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '40px',
            }}
          >
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '32px', letterSpacing: '-0.02em' }}>
              Platform Stats
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              {stats.map((stat, i) => (
                <div key={i}>
                  <div style={{ 
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '2.5rem', 
                    fontWeight: 800, 
                    color: 'transparent',
                    backgroundImage: 'linear-gradient(135deg, #a78bfa, #818cf8)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    lineHeight: 1.1,
                    marginBottom: '8px'
                  }}>
                    {stat.number}
                  </div>
                  <div style={{ color: 'var(--text-3)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Technology Stack */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Built With Modern Tech
            </h2>
            <p style={{ color: 'var(--text-3)', marginBottom: '32px', lineHeight: 1.6 }}>
              Engineered for performance and scalability using a robust full-stack architecture.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: 'auto' }}>
              {stack.map((tech, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    borderRadius: '100px',
                    color: 'var(--text-2)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default About
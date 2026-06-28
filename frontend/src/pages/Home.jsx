import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import SEO from '../components/SEO'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }
  })
}

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    title: 'Smart Search',
    desc: 'Find papers by subject, year, or keyword instantly. Filter and sort to narrow down exactly what you need.'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
    title: 'Community Uploads',
    desc: 'Students contribute papers, admin team reviews and approves. Quality-controlled, community-powered.'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Verified Content',
    desc: 'Every paper goes through admin review before being published. No spam, no duplicates — only real papers.'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    title: 'One-Click Download',
    desc: 'View PDFs inline or download instantly using your free credits, or upgrade to PRO for unlimited access.'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    title: 'Secure PRO Tier',
    desc: 'Dual payment gateways integrated securely. Pay with Stripe internationally or Razorpay via UPI in India.'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Growing Community',
    desc: 'Students helping students. Join hundreds of users who are already sharing and downloading papers.'
  }
]

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const Home = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalSubjects: 0, totalPYQs: 0, totalDownloads: 0, rating: 4.9 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/stats')
      setStats(data)
    } catch {
      setStats({ totalUsers: 120, totalSubjects: 18, totalPYQs: 340, totalDownloads: 2100, rating: 4.9 })
    } finally {
      setLoading(false)
    }
  }

  const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n)

  return (
    <div className="home-page">
      <SEO />
      
      {/* Hero Section */}
      <section className="hero-section">
        {/* subtle blobs */}
        <div className="blob blob-blue" style={{ top: '10%', left: '-10%', opacity: 0.6 }} />
        <div className="blob blob-cyan" style={{ bottom: '20%', right: '-5%', opacity: 0.5 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div className="hero-content" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>

            <motion.div className="hero-eyebrow" variants={fadeUp}>
              <span className="hero-eyebrow-dot" />
              <span>Previous Year Question Papers</span>
            </motion.div>

            <motion.h1 className="hero-title" variants={fadeUp} custom={1}>
              Study Smarter,<br />
              <span className="gradient-text">Score Higher.</span>
            </motion.h1>

            <motion.p className="hero-subtitle" variants={fadeUp} custom={2}>
              Access a curated library of previous year question papers. Get 500 free credits on sign up,
              download instantly, and upgrade to PRO for unlimited access.
            </motion.p>

            <motion.div className="hero-buttons" variants={fadeUp} custom={3}>
              <Link to="/browse" className="btn btn-primary btn-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Browse Papers
              </Link>
              <Link to="/upload" className="btn btn-secondary btn-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload a Paper
              </Link>
            </motion.div>

            <motion.div className="hero-meta" variants={fadeUp} custom={4}>
              {['500 Free Credits', 'Admin-verified papers', 'Premium PRO Tier'].map((t) => (
                <div className="hero-meta-item" key={t}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>{t}</span>
                </div>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { label: 'Question Papers', value: loading ? '—' : fmt(stats.totalPYQs) },
              { label: 'Subjects Covered', value: loading ? '—' : fmt(stats.totalSubjects) },
              { label: 'Students Joined', value: loading ? '—' : fmt(stats.totalUsers) },
              { label: 'Total Downloads',  value: loading ? '—' : fmt(stats.totalDownloads || 0) },
            ].map(({ label, value }, i) => (
              <motion.div
                key={label}
                className="stat-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.45 }}
              >
                <div className="stat-number"><span>{value}</span></div>
                <div className="stat-label">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="container">
          <div className="section-header centered">
            <div className="section-divider" />
            <p className="label" style={{ marginBottom: '12px' }}>Platform Features</p>
            <h2 className="heading-lg" style={{ marginBottom: '16px' }}>
              Everything you need to<br />
              <span className="gradient-text">ace your exams</span>
            </h2>
            <p style={{ color: 'var(--text-2)', maxWidth: '480px', margin: '0 auto', fontSize: '1rem' }}>
              Built for students, by students. Simple, fast, and reliable.
            </p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="feature-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.45 }}
              >
                <div className="feature-icon-wrap">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-description">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-box"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* top glow line already done via CSS ::before */}
            <div className="blob blob-blue" style={{ top: '-80px', left: '50%', transform: 'translateX(-50%)', opacity: 0.4 }} />

            <p className="label" style={{ marginBottom: '16px', position: 'relative', zIndex: 1 }}>Get Started Today</p>
            <h2 className="heading-lg" style={{ marginBottom: '16px', position: 'relative', zIndex: 1 }}>
              Join hundreds of students<br />already using <span className="gradient-text">PYQ Hub</span>
            </h2>
            <p style={{ color: 'var(--text-2)', marginBottom: '32px', maxWidth: '460px', margin: '0 auto 32px', position: 'relative', zIndex: 1, fontSize: '0.95rem', lineHeight: '1.7' }}>
              Create a free account to instantly receive 500 credits. Browse papers, contribute to the community, and upgrade to PRO for limitless downloads.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              <Link to="/browse" className="btn btn-primary btn-lg">
                Start Browsing
              </Link>
              <Link to="/about" className="btn btn-ghost btn-lg">
                Learn More
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              {['Free 500 Credits', 'Stripe & Razorpay integrated', 'Mobile friendly'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-2)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

export default Home
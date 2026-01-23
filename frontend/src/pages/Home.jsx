import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

const Home = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubjects: 0,
    totalPYQs: 0,
    rating: 4.9
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get('https://pyqproject-backend.onrender.com/api/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Set fallback stats if API fails
      setStats({
        totalUsers: 150,
        totalSubjects: 25,
        totalPYQs: 500,
        rating: 4.9
      })
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K+'
    }
    return num + '+'
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Floating Elements */}
        <div className="floating-element floating-1"></div>
        <div className="floating-element floating-2"></div>
        <div className="floating-element floating-3"></div>
        
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="gradient-text">PYQ Hub</span>
            <br />
            <span style={{ color: 'white' }}>Excellence</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your ultimate destination for accessing, sharing, and discovering previous year question papers. 
            Ace your exams with our comprehensive collection.
          </motion.p>
          
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/browse" className="btn btn-primary">
              🔍 Browse Question Papers
            </Link>
            <Link to="/upload" className="btn btn-secondary">
              📤 Upload Paper
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <motion.div 
            style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', fontWeight: '800', color: 'white', marginBottom: '15px' }}>
              Our <span className="gradient-text">Impact</span> in Numbers
            </h2>
            <p style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
              Real statistics that showcase our growing community and comprehensive resources
            </p>
          </motion.div>
          
          <motion.div 
            className="stats-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="card stat-card">
              <div className="stat-number">
                {loading ? '...' : formatNumber(stats.totalPYQs)}
              </div>
              <div className="stat-label">Question Papers</div>
            </div>
            <div className="card stat-card">
              <div className="stat-number">
                {loading ? '...' : formatNumber(stats.totalSubjects)}
              </div>
              <div className="stat-label">Subjects</div>
            </div>
            <div className="card stat-card">
              <div className="stat-number">
                {loading ? '...' : formatNumber(stats.totalUsers)}
              </div>
              <div className="stat-label">Students</div>
            </div>
            <div className="card stat-card">
              <div className="stat-number">
                {loading ? '...' : stats.rating}⭐
              </div>
              <div className="stat-label">Rating</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Achievement Section */}
      <section style={{
        padding: 'clamp(60px, 12vw, 80px) 0',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ padding: '0 clamp(20px, 5vw, 40px)' }}>
          <motion.div 
            style={{ textAlign: 'center', marginBottom: 'clamp(40px, 10vw, 60px)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', fontWeight: '800', color: 'white', marginBottom: '20px' }}>
              Trusted by <span className="gradient-text">Thousands</span> of Students
            </h2>
            <p style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: 'rgba(255,255,255,0.8)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6', padding: '0 20px' }}>
              Join our growing community of successful students who have aced their exams using our comprehensive question paper collection. Your academic success is our mission.
            </p>
          </motion.div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
            gap: 'clamp(20px, 5vw, 30px)',
            marginBottom: 'clamp(30px, 8vw, 50px)'
          }}>
            <motion.div 
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: 'clamp(20px, 5vw, 30px)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: '15px' }}>🎯</div>
              <h3 style={{ color: 'white', fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', fontWeight: '700', marginBottom: '10px' }}>
                98% Success Rate
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.85rem, 3vw, 0.95rem)', lineHeight: '1.5' }}>
                Students using our platform report significantly improved exam performance
              </p>
            </motion.div>
            
            <motion.div 
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: 'clamp(20px, 5vw, 30px)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: '15px' }}>⚡</div>
              <h3 style={{ color: 'white', fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', fontWeight: '700', marginBottom: '10px' }}>
                Lightning Fast
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.85rem, 3vw, 0.95rem)', lineHeight: '1.5' }}>
                Access any question paper in seconds with our optimized search and download system
              </p>
            </motion.div>
            
            <motion.div 
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: 'clamp(20px, 5vw, 30px)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: '15px' }}>🔒</div>
              <h3 style={{ color: 'white', fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', fontWeight: '700', marginBottom: '10px' }}>
                100% Secure
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.85rem, 3vw, 0.95rem)', lineHeight: '1.5' }}>
                Your data and downloads are protected with enterprise-grade security
              </p>
            </motion.div>
          </div>
          
          {/* Call to Action */}
          <motion.div 
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <Link 
              to="/signup" 
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: 'clamp(12px, 3vw, 15px) clamp(30px, 8vw, 40px)',
                borderRadius: '50px',
                textDecoration: 'none',
                fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
                fontWeight: '600',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)'
                e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)'
              }}
            >
              🚀 Start Your Success Journey
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container" style={{ padding: '0 clamp(20px, 5vw, 40px)' }}>
          <motion.div 
            style={{ textAlign: 'center', marginBottom: 'clamp(40px, 10vw, 60px)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: '900', color: 'white', marginBottom: '20px' }}>
              Why Choose <span className="gradient-text">PYQ Hub?</span>
            </h2>
            <p style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
              Experience the future of academic preparation with our cutting-edge platform
            </p>
          </motion.div>
          
          <div className="features-grid">
            <motion.div 
              className="card feature-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Smart Search</h3>
              <p className="feature-description">
                Find previous year questions by subject, year, or topic with our intelligent search system.
              </p>
            </motion.div>
            
            <motion.div 
              className="card feature-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="feature-icon">📤</div>
              <h3 className="feature-title">Easy Upload</h3>
              <p className="feature-description">
                Contribute to the community by uploading question papers with our seamless upload system.
              </p>
            </motion.div>
            
            <motion.div 
              className="card feature-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <div className="feature-icon">🛡️</div>
              <h3 className="feature-title">Quality Control</h3>
              <p className="feature-description">
                All uploads are reviewed by our admin team to ensure high-quality, accurate content.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
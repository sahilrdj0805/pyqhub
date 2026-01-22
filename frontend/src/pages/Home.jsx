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
      const response = await axios.get('http://localhost:5000/api/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
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

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div 
            style={{ textAlign: 'center', marginBottom: '60px' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: '900', color: 'white', marginBottom: '20px' }}>
              Why Choose <span className="gradient-text">PYQ Hub?</span>
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto' }}>
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
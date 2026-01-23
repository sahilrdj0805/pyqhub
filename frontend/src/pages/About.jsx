import React from 'react'
import { motion } from 'framer-motion'

const About = () => {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '50px' }}>
      <div className="container">
        {/* Header */}
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '60px' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{ 
            fontSize: 'clamp(2rem, 8vw, 4rem)', 
            fontWeight: '900', 
            color: 'white', 
            marginBottom: '20px'
          }}>
            <span className="gradient-text">About</span> PYQ Hub
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
            color: 'rgba(255,255,255,0.8)', 
            maxWidth: '600px', 
            margin: '0 auto'
          }}>
            Empowering students with easy access to previous year question papers
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div 
          className="card"
          style={{ marginBottom: '40px', textAlign: 'center' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎯</div>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '20px' }}>
            Our Mission
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
            To democratize access to educational resources by providing a comprehensive platform 
            where students can easily find, share, and access previous year question papers. 
            We believe that quality education should be accessible to everyone.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '30px',
          marginBottom: '50px'
        }}>
          {[
            {
              icon: '🔍',
              title: 'Smart Search',
              description: 'Advanced search functionality to find papers by subject, year, or title quickly'
            },
            {
              icon: '☁️',
              title: 'Cloud Storage',
              description: 'Secure cloud-based storage ensures your papers are always accessible'
            },
            {
              icon: '📱',
              title: 'Mobile Friendly',
              description: 'Responsive design that works perfectly on all devices and screen sizes'
            },
            {
              icon: '🔒',
              title: 'Secure Platform',
              description: 'User authentication and secure file handling for a safe experience'
            },
            {
              icon: '⚡',
              title: 'Fast Downloads',
              description: 'Optimized file delivery for quick and reliable downloads'
            },
            {
              icon: '🎯',
              title: 'Quality Control',
              description: 'Admin moderation ensures only authentic and quality papers are available'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: 'white', marginBottom: '10px' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Statistics */}
        <motion.div 
          className="card"
          style={{ textAlign: 'center', marginBottom: '40px' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '30px' }}>
            Platform Statistics
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '30px'
          }}>
            {[
              { number: '500+', label: 'Question Papers' },
              { number: '1000+', label: 'Active Users' },
              { number: '50+', label: 'Subjects' },
              { number: '5000+', label: 'Downloads' }
            ].map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '900', 
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '10px'
                }}>
                  {stat.number}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div 
          className="card"
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '20px' }}>
            Built With Modern Technology
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '30px' }}>
            Powered by the MERN stack for a robust and scalable solution
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: '20px'
          }}>
            {['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Cloudinary'].map((tech, index) => (
              <div
                key={index}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '25px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
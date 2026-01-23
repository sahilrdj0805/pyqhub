import React from 'react'
import { useLocation } from 'react-router-dom'

const Footer = () => {
  const location = useLocation()
  const isAdminPage = location.pathname === '/admin'
  
  // Don't render footer on admin page
  if (isAdminPage) {
    return null
  }
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-section">
          <div className="footer-brand">
            <h3>🎓 PYQ Hub</h3>
            <p>Your ultimate destination for Previous Year Questions. Empowering students with quality academic resources, comprehensive study materials, and a supportive learning community.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <div style={{
              padding: '12px 20px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: '700' }}>1000+</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>Students</div>
            </div>
            <div style={{
              padding: '12px 20px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: '700' }}>500+</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>Papers</div>
            </div>
            <div style={{
              padding: '12px 20px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: '700' }}>50+</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>Subjects</div>
            </div>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <div className="footer-links">
            <a href="/">🏠 Home</a>
            <a href="/browse">📚 Browse PYQs</a>
            <a href="/upload">📤 Upload Questions</a>
            <a href="/about">ℹ️ About Us</a>
            <a href="/contact">📞 Contact Us</a>
          </div>
        </div>
        
        {/* Resources */}
        <div className="footer-section">
          <h3>Resources</h3>
          <div className="footer-links">
            <a href="#">📖 Study Materials</a>
            <a href="#">💡 Exam Tips</a>
            <a href="#">📋 Guidelines</a>
            <a href="#">❓ FAQ</a>
          </div>
        </div>
        
        {/* Contact */}
        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="footer-links">
            <a href="mailto:info@pyqhub.com">✉️ info@pyqhub.com</a>
            <a href="#">🛠️ Support Center</a>
            <a href="#">👥 Community</a>
            <a href="#">💬 Feedback</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2024 PYQ Hub. Made with ❤️ for students by students. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
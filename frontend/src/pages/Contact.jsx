import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { ContactAPI } from '../ApiService'
import { useToast } from '../context/ToastContext'
import SEO from '../components/SEO'

// ── Icons ──────────────────────────────────────────────
const SvgIcon = ({ children, size = 20, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
    {children}
  </svg>
)
const I = {
  Mail:    (p) => <SvgIcon {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></SvgIcon>,
  Phone:   (p) => <SvgIcon {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></SvgIcon>,
  Clock:   (p) => <SvgIcon {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></SvgIcon>,
  Send:    (p) => <SvgIcon {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></SvgIcon>,
  User:    (p) => <SvgIcon {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></SvgIcon>,
  Tag:     (p) => <SvgIcon {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></SvgIcon>,
  Message: (p) => <SvgIcon {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></SvgIcon>,
  Loader:  (p) => <SvgIcon {...p}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></SvgIcon>,
  Plus:    (p) => <SvgIcon {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></SvgIcon>
}

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await ContactAPI.sendMessage(formData)
      showToast("Message sent successfully! We'll get back to you soon.", 'success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      showToast(error.message || 'Failed to send message. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px', position: 'relative' }}>
      <SEO title="Contact Us | PYQ Hub" description="Get in touch with the PYQ Hub team for support or inquiries." />
      
      {/* Background blobs */}
      <div className="blob blob-purple" style={{ top: '10%', left: '5%', opacity: 0.3 }} />
      <div className="blob blob-cyan" style={{ bottom: '20%', right: '5%', opacity: 0.25 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '60px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '100px', color: '#818cf8', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Get in touch
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Contact <span style={{ color: 'transparent', backgroundImage: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>Us</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--text-3)', maxWidth: '600px', margin: '0 auto' }}>
            Have a question, suggestion, or found a bug? We'd love to hear from you. Drop us a message below.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '40px' }}>
          
          {/* Contact Form */}
          <motion.div 
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #a78bfa, #818cf8)' }} />
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '32px', letterSpacing: '-0.02em' }}>
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-2)', fontSize: '0.95rem' }}>Name <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', display: 'flex' }}><I.User size={18} /></div>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className="form-input" style={{ paddingLeft: '44px' }} required />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-2)', fontSize: '0.95rem' }}>Email <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', display: 'flex' }}><I.Mail size={18} /></div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" className="form-input" style={{ paddingLeft: '44px' }} required />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-2)', fontSize: '0.95rem' }}>Subject <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', display: 'flex' }}><I.Tag size={18} /></div>
                  <select name="subject" value={formData.subject} onChange={handleChange} className="form-input" style={{ paddingLeft: '44px', appearance: 'none' }} required>
                    <option value="" disabled>Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                    <option value="bug">Bug Report</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-2)', fontSize: '0.95rem' }}>Message <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-3)', display: 'flex' }}><I.Message size={18} /></div>
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us how we can help you..." className="form-input" style={{ paddingLeft: '44px', paddingTop: '16px', minHeight: '120px', resize: 'vertical' }} required />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.05rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '8px', opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                {isSubmitting ? (
                  <><div style={{ animation: 'spin 1s linear infinite', display: 'flex' }}><I.Loader size={20} /></div> Sending...</>
                ) : (
                  <><I.Send size={20} /> Send Message</>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right Column (Info + FAQ) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Contact Information */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px' }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '24px', letterSpacing: '-0.02em' }}>
                Contact Info
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.1)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><I.Mail size={22} /></div>
                  <div>
                    <div style={{ color: 'var(--text-1)', fontWeight: 600, marginBottom: '2px' }}>Email Support</div>
                    <div style={{ color: 'var(--text-3)', fontSize: '0.95rem' }}>support@pyqhub.com</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(34,211,238,0.1)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><I.Phone size={22} /></div>
                  <div>
                    <div style={{ color: 'var(--text-1)', fontWeight: 600, marginBottom: '2px' }}>Phone Support</div>
                    <div style={{ color: 'var(--text-3)', fontSize: '0.95rem' }}>+91 98765 43210</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(250,204,21,0.1)', color: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><I.Clock size={22} /></div>
                  <div>
                    <div style={{ color: 'var(--text-1)', fontWeight: 600, marginBottom: '2px' }}>Response Time</div>
                    <div style={{ color: 'var(--text-3)', fontSize: '0.95rem' }}>Usually within 24 hours</div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px', flex: 1 }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '24px', letterSpacing: '-0.02em' }}>
                Frequently Asked Questions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { q: 'How do I upload a question paper?', a: 'Go to the Upload page and fill out the form with paper details. Must be a valid PDF.' },
                  { q: 'Are the papers verified?', a: 'Yes, all papers go through manual admin verification before being published on the platform.' },
                  { q: 'Is the platform free to use?', a: 'Yes, PYQ Hub is completely free for all students. We believe in open access.' },
                  { q: 'Can I request specific papers?', a: 'Of course! Contact us with your requirements and we\'ll do our best to help you find them.' }
                ].map((faq, index) => (
                  <div key={index} style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--text-1)', fontWeight: 600, marginBottom: '6px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#818cf8' }}><I.Plus size={16} /></span> {faq.q}
                    </div>
                    <div style={{ color: 'var(--text-3)', fontSize: '0.85rem', lineHeight: 1.6, paddingLeft: '24px' }}>
                      {faq.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Contact
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'

const PaymentCancel = () => {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <SEO title="Payment Cancelled | PYQ Hub" />
      
      <div className="container" style={{ maxWidth: '600px' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '16px' }}>
            Payment Cancelled
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '1.1rem', marginBottom: '32px' }}>
            Your checkout session was cancelled. No charges were made to your account.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/pricing" className="btn btn-primary" style={{ padding: '16px 32px' }}>
              Try Again
            </Link>
            <Link to="/browse" className="btn btn-ghost" style={{ padding: '16px 32px' }}>
              Return to Library
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentCancel

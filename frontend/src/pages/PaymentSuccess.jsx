import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import SEO from '../components/SEO'
import AuthService from '../AuthService'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
  
  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id')
      if (!sessionId) {
        setStatus('error')
        return
      }

      try {
        const token = AuthService.getToken()
        if (!token) {
          navigate('/login')
          return
        }

        // Razorpay already verified in Pricing.jsx popup callback
        if (sessionId.startsWith('razorpay_')) {
          setStatus('success')
          return
        }

        const res = await axios.post('/api/payment/verify-session', 
          { session_id: sessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (res.data.success) {
          // Update local storage so the UI updates
          const user = AuthService.getUser()
          if (user) {
            user.isPro = true
            AuthService.setUser(user)
          }
          setStatus('success')
        } else {
          setStatus('error')
        }
      } catch (err) {
        console.error('Verification failed', err)
        setStatus('error')
      }
    }

    verifyPayment()
  }, [searchParams, navigate])

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <SEO title="Payment Successful | PYQ Hub" />
      
      <div className="container" style={{ maxWidth: '600px' }}>
        {status === 'verifying' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ animation: 'spin 2s linear infinite', margin: '0 auto 24px', width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1' }} />
            <h2 style={{ color: 'var(--text-1)' }}>Verifying your payment...</h2>
            <p style={{ color: 'var(--text-3)' }}>Please don't close this window.</p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(34,197,94,0.2))', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '16px' }}>
              Welcome to <span style={{ color: '#f59e0b' }}>PRO!</span>
            </h1>
            <p style={{ color: 'var(--text-2)', fontSize: '1.1rem', marginBottom: '32px' }}>
              Your payment was successful. You now have unlimited access to download and view all previous year question papers.
            </p>
            <Link to="/browse" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', boxShadow: '0 8px 24px rgba(245,158,11,0.3)' }}>
              Go to Library 📚
            </Link>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '16px' }}>
              Verification Failed
            </h1>
            <p style={{ color: 'var(--text-2)', fontSize: '1.1rem', marginBottom: '32px' }}>
              We couldn't verify your payment. If you were charged, please contact support.
            </p>
            <Link to="/pricing" className="btn btn-primary" style={{ padding: '16px 32px' }}>
              Return to Pricing
            </Link>
          </motion.div>
        )}
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

export default PaymentSuccess

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import SEO from '../components/SEO'
import AuthService from '../AuthService'

const I = {
  Check: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
  Star: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 6.91 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}

const Pricing = () => {
  const [loading, setLoading] = useState(false)
  const user = AuthService.getUser()
  const isPro = user?.isPro || false

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleStripeUpgrade = async () => {
    setLoading('stripe')
    try {
      const token = AuthService.getToken()
      const response = await axios.post('/api/payment/create-checkout-session', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Redirect to Stripe Checkout
      window.location.href = response.data.url
    } catch (err) {
      alert('Failed to initiate Stripe payment. Please try again.')
      setLoading(false)
    }
  }

  const handleRazorpayUpgrade = async () => {
    setLoading('razorpay')
    try {
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        alert('Razorpay SDK failed to load. Are you online?')
        setLoading(false)
        return
      }

      const token = AuthService.getToken()
      const { data } = await axios.post('/api/payment/create-razorpay-order', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const options = {
        key: 'rzp_test_T6fmXseMLZapaz',
        amount: data.order.amount,
        currency: 'INR',
        name: 'PYQ Hub',
        description: 'Upgrade to PRO',
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post('/api/payment/verify-razorpay-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }, {
              headers: { Authorization: `Bearer ${token}` }
            })

            if (verifyRes.data.success) {
              // Update local state to reflect Pro status instantly before redirecting to success page
              const user = AuthService.getUser()
              if (user) {
                user.isPro = true
                AuthService.setUser(user)
              }
              window.location.href = `/payment-success?session_id=razorpay_${response.razorpay_payment_id}`
            }
          } catch (err) {
            alert('Payment verification failed.')
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: '9999999999'
        },
        theme: {
          color: '#f59e0b'
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
      
      paymentObject.on('payment.failed', function () {
        alert('Payment failed. Please try again.')
        setLoading(false)
      })

    } catch (err) {
      console.error(err)
      alert('Failed to initiate Razorpay payment.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', position: 'relative' }}>
      <SEO title="Pricing | PYQ Hub" description="Upgrade to PRO for unlimited PYQ downloads." />
      
      <div className="blob blob-purple" style={{ top: '10%', right: '10%', opacity: 0.3 }} />
      <div className="blob blob-cyan" style={{ bottom: '10%', left: '10%', opacity: 0.3 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '3rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '16px' }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 60px' }}>
            Get the most out of PYQ Hub. Upgrade to PRO for unlimited access to all previous year question papers.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center' }}>
          
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '24px', padding: '40px', textAlign: 'left'
            }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>Free</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '24px' }}>
              $0 <span style={{ fontSize: '1rem', color: 'var(--text-3)', fontWeight: 400 }}>/ forever</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', gap: '12px', color: 'var(--text-2)' }}><I.Check style={{ color: '#4ade80' }}/> 500 Welcome Credits</li>
              <li style={{ display: 'flex', gap: '12px', color: 'var(--text-2)' }}><I.Check style={{ color: '#4ade80' }}/> Costs 50 Credits per Download</li>
              <li style={{ display: 'flex', gap: '12px', color: 'var(--text-2)' }}><I.Check style={{ color: '#4ade80' }}/> Auto-refills every 3 days</li>
              <li style={{ display: 'flex', gap: '12px', color: 'var(--text-3)' }}><I.Check style={{ color: 'var(--text-4)' }}/> Basic Support</li>
            </ul>
            <button disabled={true} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: '16px', border: '1px solid var(--border)', cursor: 'default', color: isPro ? 'var(--text-4)' : 'var(--text-1)' }}>
              {isPro ? 'Basic Plan' : 'Your Current Plan'}
            </button>
          </motion.div>

          {/* PRO Tier */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'linear-gradient(180deg, var(--bg-card) 0%, rgba(245,158,11,0.05) 100%)', 
              border: '2px solid #f59e0b',
              borderRadius: '24px', padding: '48px 40px', textAlign: 'left',
              position: 'relative', boxShadow: '0 24px 64px rgba(245,158,11,0.15)'
            }}
          >
            <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', padding: '6px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <I.Star size={14} /> MOST POPULAR
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>PRO</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '24px' }}>
              $9.99 <span style={{ fontSize: '1rem', color: 'var(--text-3)', fontWeight: 400 }}>/ lifetime</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', gap: '12px', color: 'var(--text-1)', fontWeight: 500 }}><I.Check style={{ color: '#f59e0b' }}/> Unlimited Downloads Forever</li>
              <li style={{ display: 'flex', gap: '12px', color: 'var(--text-1)', fontWeight: 500 }}><I.Check style={{ color: '#f59e0b' }}/> Zero Credits Required</li>
              <li style={{ display: 'flex', gap: '12px', color: 'var(--text-1)', fontWeight: 500 }}><I.Check style={{ color: '#f59e0b' }}/> Instant Access to All Papers</li>
              <li style={{ display: 'flex', gap: '12px', color: 'var(--text-1)', fontWeight: 500 }}><I.Check style={{ color: '#f59e0b' }}/> Priority Email Support</li>
            </ul>
            
            {isPro ? (
              <button 
                disabled={true}
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '16px', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', boxShadow: 'none', fontSize: '1.1rem', cursor: 'default' }}
              >
                You are on PRO 🌟
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={handleStripeUpgrade}
                  disabled={loading}
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '16px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', boxShadow: '0 8px 24px rgba(99,102,241,0.3)', fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading === 'stripe' ? 'Processing...' : 'Pay with Stripe 💳'}
                </button>
                <button 
                  onClick={handleRazorpayUpgrade}
                  disabled={loading}
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '16px', background: 'linear-gradient(135deg, #3399cc, #2288bb)', border: 'none', boxShadow: '0 8px 24px rgba(51,153,204,0.3)', fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading === 'razorpay' ? 'Processing...' : 'Pay with Razorpay 🇮🇳'}
                </button>
              </div>
            )}

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '16px', marginBottom: 0 }}>
              Secure payments via Stripe & Razorpay.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default Pricing

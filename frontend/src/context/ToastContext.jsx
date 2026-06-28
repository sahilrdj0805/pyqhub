import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// SVG Icons
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToast({ message, type, id })
    setTimeout(() => {
      setToast(current => current?.id === id ? null : current)
    }, 4000)
  }, [])

  const closeToast = () => setToast(null)

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Global Toast Render */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: 28,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px 20px',
              background: 'rgba(20, 20, 20, 0.85)',
              border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,0.35)' : 'rgba(34,197,94,0.35)'}`,
              borderRadius: '100px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: toast.type === 'error' ? '#fca5a5' : '#86efac',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(20px)',
              cursor: 'pointer'
            }}
            onClick={closeToast}
          >
            {toast.type === 'error' ? <AlertIcon /> : <CheckIcon />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  )
}

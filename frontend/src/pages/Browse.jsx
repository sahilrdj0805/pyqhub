import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import SEO from '../components/SEO'
import AuthService from '../AuthService'

// ── Icons ──────────────────────────────────────────────
const SvgIcon = ({ children, size = 20, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
    {children}
  </svg>
)
const I = {
  Search:   (p) => <SvgIcon {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></SvgIcon>,
  Book:     (p) => <SvgIcon {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></SvgIcon>,
  File:     (p) => <SvgIcon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></SvgIcon>,
  Eye:      (p) => <SvgIcon {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></SvgIcon>,
  Download: (p) => <SvgIcon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></SvgIcon>,
  Loader:   (p) => <SvgIcon {...p}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></SvgIcon>,
  Grid:     (p) => <SvgIcon {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></SvgIcon>,
  X:        (p) => <SvgIcon {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></SvgIcon>,
}

const Browse = () => {
  const [subjects, setSubjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [pyqs, setPyqs] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [sortBy, setSortBy] = useState('year-desc')
  
  const [selectedPdf, setSelectedPdf] = useState(null)
  const [showOutModal, setShowOutModal] = useState(false)
  
  const searchRef = useRef(null)
  const paperSearchRef = useRef(null)

  useEffect(() => {
    fetchSubjects()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSubjects = async () => {
    try {
      // Use relative API path for Vite proxy
      const response = await axios.get('/api/subjects')
      setSubjects(response.data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const searchPYQs = async (subjectName) => {
    if (!subjectName) {
      setPyqs([])
      return
    }
    setLoading(true)
    try {
      const response = await axios.get(`/api/pyqs/by-subject?subject=${encodeURIComponent(subjectName)}`)
      setPyqs(response.data)
    } catch (error) {
      console.error('Error fetching PYQs:', error)
      setPyqs([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubjectSelect = (subjectName) => {
    setSelectedSubject(subjectName)
    setSearchTerm(subjectName)
    setShowDropdown(false)
    searchPYQs(subjectName)
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setShowDropdown(value.length > 0)
    if (value === '') {
      setSelectedSubject('')
      setPyqs([])
    }
  }

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedPYQs = [...pyqs].sort((a, b) => {
    if (sortBy === 'year-desc') return b.year - a.year
    if (sortBy === 'year-asc') return a.year - b.year
    if (sortBy === 'title-asc') return a.title.localeCompare(b.title)
    if (sortBy === 'title-desc') return b.title.localeCompare(a.title)
    return 0
  })

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px', position: 'relative' }}>
      <SEO title="Browse Papers | PYQ Hub" description="Search and browse thousands of previous year question papers." />
      
      {/* Background blobs */}
      <div className="blob blob-purple" style={{ top: '10%', right: '5%', opacity: 0.3 }} />
      <div className="blob blob-cyan" style={{ bottom: '20%', left: '-5%', opacity: 0.25 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '50px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '100px', color: '#818cf8', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Library
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Browse <span style={{ color: 'transparent', backgroundImage: 'linear-gradient(135deg, #22d3ee, #818cf8)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>Question Papers</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--text-3)', maxWidth: '600px', margin: '0 auto' }}>
            Search for your subject and instantly access high-quality previous year question papers.
          </p>
        </motion.div>

        {/* Primary Search Container */}
        <div style={{ maxWidth: '700px', margin: '0 auto 60px', position: 'relative' }}>
          
          {/* Subject Search Wrapper */}
          <div ref={searchRef} style={{ position: 'relative', zIndex: 1000 }}>
            {/* Subject Search */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', display: 'flex' }}>
                  <I.Search size={22} />
                </div>
                <input
                  type="text"
                  placeholder="Search subject (e.g., Mathematics, Physics...)"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowDropdown(searchTerm.length > 0)}
                  className="form-input"
                  style={{
                    padding: '20px 20px 20px 56px',
                    borderRadius: '20px',
                    fontSize: '1.1rem',
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>
            </motion.div>

          {/* Subject Dropdown Suggestions */}
          <AnimatePresence>
            {showDropdown && filteredSubjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 8, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  maxWidth: '700px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  zIndex: 9999,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  padding: '8px'
                }}
                className="custom-scrollbar"
              >
                {filteredSubjects.map((subject, index) => (
                  <div
                    key={subject._id}
                    onClick={() => handleSubjectSelect(subject.name)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderRadius: '10px',
                      color: 'var(--text-2)',
                      fontSize: '1rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s ease',
                      marginBottom: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(99,102,241,0.1)'
                      e.currentTarget.style.color = '#818cf8'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--text-2)'
                    }}
                  >
                    <I.Book size={18} /> {subject.name}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          </div> {/* End of Subject Search Wrapper */}


        </div>

        {/* Results Info and Sorting */}
        {selectedSubject && (
          <motion.div 
            style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', color: 'var(--text-2)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-3)' }}>
                  <div style={{ animation: 'spin 1.5s linear infinite', display: 'flex' }}><I.Loader size={18}/></div>
                  Fetching papers...
                </div>
              ) : (
                <>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,211,238,0.1)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <I.Grid size={16} />
                  </div>
                  <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                    Found {sortedPYQs.length} papers for <span style={{ color: 'var(--text-1)' }}>{selectedSubject}</span>
                  </span>
                </>
              )}
            </div>

            {/* Sorting Dropdown */}
            {!loading && sortedPYQs.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-3)' }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-1)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="year-desc">Year (Newest First)</option>
                  <option value="year-asc">Year (Oldest First)</option>
                
                </select>
              </div>
            )}
          </motion.div>
        )}

        {/* PYQ Grid Layout */}
        {!selectedSubject ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '60px 20px' }}
          >
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--text-3)' }}>
              <I.Search size={32} />
            </div>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>
              Search for a Subject
            </h3>
            <p style={{ color: 'var(--text-3)' }}>
              Select a subject above to view its question papers.
            </p>
          </motion.div>
        ) : loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: '220px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
                <div style={{ height: '24px', background: 'var(--border)', borderRadius: '12px', width: '40%', marginBottom: '24px', animation: 'pulse 1.5s infinite' }} />
                <div style={{ height: '16px', background: 'var(--border)', borderRadius: '8px', width: '80%', marginBottom: '12px', animation: 'pulse 1.5s infinite' }} />
                <div style={{ height: '16px', background: 'var(--border)', borderRadius: '8px', width: '60%', animation: 'pulse 1.5s infinite' }} />
              </div>
            ))}
          </div>
        ) : sortedPYQs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {sortedPYQs.map((pyq, index) => (
              <motion.div
                key={pyq._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(34,211,238,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(34,211,238,0.1)', color: '#22d3ee', padding: '6px 16px', borderBottomLeftRadius: '16px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  {pyq.year}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', marginTop: '12px' }}>
                  <div style={{ width: 48, height: 48, background: 'rgba(99,102,241,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', flexShrink: 0 }}>
                    <I.File size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px', lineHeight: 1.3 }}>
                      {pyq.title}
                    </h3>
                    <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', fontWeight: 500 }}>
                      {pyq.subject?.name}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                  <button
                    onClick={async () => {
                      try {
                        await axios.get('/api/payment/check-credits', {
                          headers: { Authorization: `Bearer ${AuthService.getToken()}` }
                        })
                        const proxyUrl = `${import.meta.env.VITE_API_URL || ''}/api/pdf/${pyq._id}?url=${encodeURIComponent(pyq.fileUrl)}&token=${AuthService.getToken()}`
                        setSelectedPdf(proxyUrl)
                        // Trigger navbar update slightly after to simulate the backend deduction
                        setTimeout(() => window.dispatchEvent(new Event('creditsUpdated')), 500)
                      } catch (err) {
                        if (err.response?.status === 402) {
                          setShowOutModal(true)
                        } else {
                          console.error(err)
                        }
                      }
                    }}
                    className="btn btn-ghost"
                    style={{ flex: 1, padding: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <I.Eye size={16} /> View
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await axios.get('/api/payment/check-credits', {
                          headers: { Authorization: `Bearer ${AuthService.getToken()}` }
                        })
                        const downloadUrl = `${import.meta.env.VITE_API_URL || ''}/api/download/${pyq._id}?url=${encodeURIComponent(pyq.fileUrl)}&filename=${encodeURIComponent(pyq.title + '.pdf')}&token=${AuthService.getToken()}`
                        window.location.href = downloadUrl
                        // Trigger navbar update
                        setTimeout(() => window.dispatchEvent(new Event('creditsUpdated')), 500)
                      } catch (err) {
                        if (err.response?.status === 402) {
                          setShowOutModal(true)
                        } else {
                          console.error(err)
                        }
                      }
                    }}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <I.Download size={16} /> Download
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '60px 20px' }}
          >
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--text-3)' }}>
              <I.File size={32} />
            </div>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>
              No papers found
            </h3>
            <p style={{ color: 'var(--text-3)' }}>
              We don't have any papers matching your search yet.
            </p>
          </motion.div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {selectedPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(5, 5, 8, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              style={{
                width: '100%',
                maxWidth: '1200px',
                height: 'calc(100vh - 48px)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 24px 64px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-card)'
              }}>
                <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-1)', margin: 0 }}>Document Viewer</h3>
                <button
                  onClick={() => setSelectedPdf(null)}
                  style={{
                    width: '36px', height: '36px',
                    borderRadius: '50%', background: 'rgba(239,68,68,0.1)',
                    color: '#ef4444', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                >
                  <I.X size={18} />
                </button>
              </div>
              <iframe
                src={selectedPdf}
                style={{ flex: 1, width: '100%', border: 'none', background: '#333' }}
                title="PDF Viewer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Out of Credits Modal */}
      <AnimatePresence>
        {showOutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
              zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '24px', padding: '40px', maxWidth: '400px', width: '100%',
                textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(245,158,11,0.1))', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                <I.File size={36} />
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '12px' }}>
                Out of Credits!
              </h2>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '32px' }}>
                You have used up all your free credits for downloading and viewing papers. Wait 3 days for a free refill, or upgrade to PRO for unlimited access!
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={() => window.location.href = '/pricing'}
                  className="btn btn-primary" style={{ padding: '14px', justifyContent: 'center', fontSize: '1rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', boxShadow: '0 8px 24px rgba(245,158,11,0.3)' }}
                >
                  View Pricing (Upgrade) 🌟
                </button>
                <button onClick={() => setShowOutModal(false)} className="btn btn-ghost" style={{ padding: '14px', justifyContent: 'center' }}>
                  Maybe later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Browse
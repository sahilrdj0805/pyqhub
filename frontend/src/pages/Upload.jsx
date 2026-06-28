import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
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
  Upload:   (p) => <SvgIcon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></SvgIcon>,
  File:     (p) => <SvgIcon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></SvgIcon>,
  X:        (p) => <SvgIcon {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></SvgIcon>,
  Type:     (p) => <SvgIcon {...p}><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></SvgIcon>,
  Book:     (p) => <SvgIcon {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></SvgIcon>,
  Calendar: (p) => <SvgIcon {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></SvgIcon>,
  Loader:   (p) => <SvgIcon {...p}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></SvgIcon>,
  Check:    (p) => <SvgIcon {...p}><polyline points="20 6 9 17 4 12"/></SvgIcon>
}

const Upload = () => {
  const [subjects, setSubjects] = useState([])
  const currentYear = new Date().getFullYear()
  
  const [formData, setFormData] = useState({
    title: '',
    subjectName: '',
    year: currentYear
  })
  
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false)
  
  const { showToast } = useToast()
  
  const fileInputRef = useRef(null)
  const subjectRef = useRef(null)

  useEffect(() => {
    fetchSubjects()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (subjectRef.current && !subjectRef.current.contains(event.target)) {
        setShowSubjectDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/api/subjects')
      setSubjects(response.data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
    } else {
      showToast('Please select a PDF file only', 'error')
    }
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
    } else {
      showToast('Please select a PDF file only', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !formData.title || !formData.subjectName || !formData.year) {
      showToast('Please fill all fields and select a PDF file', 'error')
      return
    }

    setUploading(true)

    const uploadFormData = new FormData()
    uploadFormData.append('pdf', file)
    uploadFormData.append('title', formData.title)
    uploadFormData.append('subjectName', formData.subjectName)
    uploadFormData.append('year', formData.year)

    try {
      await axios.post('/api/upload-requests', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      showToast('Upload request submitted successfully! It will be reviewed by our admin team.', 'success')
      
      // Reset form
      setFormData({ title: '', subjectName: '', year: currentYear })
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      
    } catch (error) {
      showToast(error.response?.data?.message || 'Upload failed. Please try again.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px', position: 'relative' }}>
      <SEO title="Upload Paper | PYQ Hub" description="Contribute to the community by uploading previous year question papers." />
      
      {/* Background blobs */}
      <div className="blob blob-purple" style={{ top: '10%', right: '5%', opacity: 0.3 }} />
      <div className="blob blob-cyan" style={{ bottom: '20%', left: '-5%', opacity: 0.25 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '840px' }}>
        {/* Header */}
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '50px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '100px', color: '#818cf8', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Contribute
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Upload <span style={{ color: 'transparent', backgroundImage: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>Question Paper</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--text-3)', maxWidth: '600px', margin: '0 auto' }}>
            Help the community by sharing previous year question papers. All uploads are reviewed by our team.
          </p>
        </motion.div>

        {/* Upload Form */}
        <motion.div 
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: 'clamp(24px, 5vw, 48px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'visible'
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Subtle gradient strip at top */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #a78bfa, #818cf8)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* File Upload Area */}
            <div>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text-1)', fontSize: '1.05rem', fontFamily: 'Space Grotesk, sans-serif' }}>
                Question Paper (PDF) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              
              {!file ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragActive ? '#818cf8' : 'var(--border)'}`,
                    borderRadius: '20px',
                    padding: '48px 24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: dragActive ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.02)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#818cf8'
                    e.currentTarget.style.background = 'rgba(99,102,241,0.05)'
                  }}
                  onMouseLeave={e => {
                    if(!dragActive) {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                    }
                  }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(99,102,241,0.1)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <I.Upload size={32} />
                  </div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>
                    Drag & Drop your PDF here
                  </h3>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.95rem' }}>
                    or <span style={{ color: '#818cf8', textDecoration: 'underline' }}>browse files</span> from your computer (max 10MB)
                  </p>
                  <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileSelect} style={{ display: 'none' }} />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  style={{
                    border: '1px solid rgba(74,222,128,0.3)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    background: 'rgba(74,222,128,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 44, height: 44, background: 'rgba(74,222,128,0.15)', color: '#4ade80', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <I.File size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 600, color: 'var(--text-1)', marginBottom: '4px', fontSize: '0.95rem' }}>{file.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    style={{ width: 36, height: 36, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                  >
                    <I.X size={18} />
                  </button>
                </motion.div>
              )}
            </div>

            {/* Form Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-2)', fontSize: '0.95rem' }}>
                  Paper Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', display: 'flex' }}>
                    <I.Type size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Mid Sem Mathematics 2023"
                    className="form-input"
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>

              {/* Subject Custom Dropdown */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-2)', fontSize: '0.95rem' }}>
                  Subject Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div ref={subjectRef} style={{ position: 'relative' }}>
                  <div 
                    className="form-input"
                    onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                    style={{ 
                      paddingLeft: '44px', 
                      paddingRight: '40px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      borderColor: showSubjectDropdown ? '#818cf8' : 'var(--border)',
                      boxShadow: showSubjectDropdown ? '0 0 0 4px rgba(99,102,241,0.1)' : 'none'
                    }}
                  >
                    <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', display: 'flex' }}>
                      <I.Book size={18} />
                    </div>
                    
                    <span style={{ color: formData.subjectName ? 'var(--text-1)' : 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {formData.subjectName || "Select a subject"}
                    </span>

                    <div style={{ position: 'absolute', right: '16px', top: '50%', transform: `translateY(-50%) rotate(${showSubjectDropdown ? '180deg' : '0deg'})`, transition: 'transform 0.2s ease', color: 'var(--text-3)', display: 'flex' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>

                  <AnimatePresence>
                    {showSubjectDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 8, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          width: '100%',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          borderRadius: '16px',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                          zIndex: 9999,
                          maxHeight: '250px',
                          overflowY: 'auto',
                          padding: '8px'
                        }}
                        className="custom-scrollbar"
                      >
                        {subjects.length > 0 ? (
                          subjects.map(subject => (
                            <div
                              key={subject._id}
                              onClick={() => { setFormData({ ...formData, subjectName: subject.name }); setShowSubjectDropdown(false); }}
                              style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                borderRadius: '10px',
                                color: formData.subjectName === subject.name ? '#818cf8' : 'var(--text-2)',
                                background: formData.subjectName === subject.name ? 'rgba(99,102,241,0.1)' : 'transparent',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                transition: 'all 0.2s ease',
                                marginBottom: '4px'
                              }}
                              onMouseEnter={e => { if (formData.subjectName !== subject.name) { e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; e.currentTarget.style.color = '#818cf8'; } }}
                              onMouseLeave={e => { if (formData.subjectName !== subject.name) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; } }}
                            >
                              {subject.name}
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '12px 16px', color: 'var(--text-3)', fontSize: '0.95rem', textAlign: 'center' }}>
                            No subjects found
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#818cf8' }}>ℹ️</span> You can only upload papers for existing subjects.
                </p>
              </div>
            </div>

            {/* Year Input */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-2)', fontSize: '0.95rem' }}>
                Academic Year <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative', width: '100%', maxWidth: '240px' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', display: 'flex' }}>
                  <I.Calendar size={18} />
                </div>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2015 })}
                  min="2015"
                  max={currentYear}
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !file || !formData.title || !formData.subjectName}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '1.05rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                marginTop: '16px',
                opacity: (uploading || !file || !formData.title || !formData.subjectName) ? 0.6 : 1,
                cursor: (uploading || !file || !formData.title || !formData.subjectName) ? 'not-allowed' : 'pointer',
              }}
            >
              {uploading ? (
                <>
                  <div style={{ animation: 'spin 1s linear infinite', display: 'flex' }}>
                    <I.Loader size={20} />
                  </div>
                  Uploading...
                </>
              ) : (
                <>
                  <I.Upload size={20} /> Submit for Review
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Guidelines */}
        <motion.div
          style={{
            marginTop: '40px',
            padding: '24px',
            background: 'rgba(99,102,241,0.05)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: '16px',
            display: 'flex',
            gap: '20px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div style={{ color: '#818cf8', flexShrink: 0, paddingTop: '2px' }}>
            <I.Check size={24} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>
              Upload Guidelines
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-3)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#4ade80' }}>✓</span> Only PDF files are accepted (max 10MB)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#4ade80' }}>✓</span> Ensure the scanned question paper is clear and readable</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#4ade80' }}>✓</span> All uploads are reviewed by our admin team before publishing</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#4ade80' }}>✓</span> You'll be notified via global toast once your submission is approved</li>
            </ul>
          </div>
        </motion.div>
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

export default Upload
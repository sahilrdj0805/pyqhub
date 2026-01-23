import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const Browse = () => {
  const [subjects, setSubjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [pyqs, setPyqs] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [paperSearchTerm, setPaperSearchTerm] = useState('')
  const [showPaperDropdown, setShowPaperDropdown] = useState(false)
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
      if (paperSearchRef.current && !paperSearchRef.current.contains(event.target)) {
        setShowPaperDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('https://pyqproject-backend.onrender.com/api/subjects')
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
      const response = await axios.get(`https://pyqproject-backend.onrender.com/api/pyqs/by-subject?subject=${encodeURIComponent(subjectName)}`)
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




  const filteredPYQs = pyqs.filter(pyq =>
    pyq.title.toLowerCase().includes(paperSearchTerm.toLowerCase())
  ).sort((a, b) => b.year - a.year)

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
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <span className="gradient-text">Browse</span> Question Papers
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
            color: 'rgba(255,255,255,0.8)', 
            maxWidth: '600px', 
            margin: '0 auto',
            textAlign: 'center',
            padding: '0 20px'
          }}>
            Search for subjects and discover previous year question papers
          </p>
        </motion.div>

        {/* Subject Search */}
        <motion.div 
          className="card"
          style={{ marginBottom: '40px', position: 'relative', zIndex: 1000 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          ref={searchRef}
        >
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: 'white', fontSize: '1rem' }}>
            🔍 Search Subject
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Type subject name (e.g., Mathematics, Physics...)"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowDropdown(searchTerm.length > 0)}
              style={{
                width: '100%',
                padding: '18px 24px',
                borderRadius: '15px',
                border: '2px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '18px',
                backdropFilter: 'blur(10px)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.2)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
        </motion.div>

        {/* Dropdown Suggestions - Outside container */}
        <AnimatePresence>
          {showDropdown && filteredSubjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'fixed',
                top: searchRef.current ? searchRef.current.getBoundingClientRect().bottom + 8 : '300px',
                left: searchRef.current ? searchRef.current.getBoundingClientRect().left : '50%',
                width: searchRef.current ? searchRef.current.getBoundingClientRect().width : '90%',
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '15px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                zIndex: 9999,
                maxHeight: '250px',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#667eea #2a2a2a'
              }}
              className="custom-scrollbar"
            >
              {filteredSubjects.map((subject, index) => (
                <motion.div
                  key={subject._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSubjectSelect(subject.name)}
                  style={{
                    padding: '15px 20px',
                    cursor: 'pointer',
                    borderBottom: index < filteredSubjects.length - 1 ? '1px solid #333' : 'none',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#2a2a2a'
                    e.target.style.color = '#667eea'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent'
                    e.target.style.color = '#ffffff'
                  }}
                >
                  📚 {subject.name}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paper Search (only show when subject is selected) */}
        {selectedSubject && (
          <motion.div 
            className="card"
            style={{ marginBottom: '40px', position: 'relative', zIndex: 999 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            ref={paperSearchRef}
          >
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'white' }}>
              🔍 Search Papers in {selectedSubject}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by paper title..."
                value={paperSearchTerm}
                onChange={(e) => {
                  setPaperSearchTerm(e.target.value)
                  setShowPaperDropdown(e.target.value.length > 0)
                }}
                onFocus={() => setShowPaperDropdown(paperSearchTerm.length > 0)}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  borderRadius: '15px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '16px',
                  backdropFilter: 'blur(10px)',
                  outline: 'none'
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Paper Dropdown Suggestions */}
        <AnimatePresence>
          {showPaperDropdown && selectedSubject && filteredPYQs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'fixed',
                top: paperSearchRef.current ? paperSearchRef.current.getBoundingClientRect().bottom + 8 : '400px',
                left: paperSearchRef.current ? paperSearchRef.current.getBoundingClientRect().left : '50%',
                width: paperSearchRef.current ? paperSearchRef.current.getBoundingClientRect().width : '90%',
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '15px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                zIndex: 9998,
                maxHeight: '200px',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#667eea #2a2a2a'
              }}
              className="custom-scrollbar"
            >
              {filteredPYQs.slice(0, 10).map((pyq, index) => (
                <motion.div
                  key={pyq._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => {
                    setPaperSearchTerm(pyq.title)
                    setShowPaperDropdown(false)
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#2a2a2a'
                    e.target.style.color = '#667eea'
                    e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent'
                    e.target.style.color = '#ffffff'
                  }}
                  style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    borderBottom: index < Math.min(filteredPYQs.length, 10) - 1 ? '1px solid #333' : 'none',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📄</span>
                  <div>
                    <div style={{ fontWeight: '600' }}>{pyq.title}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{pyq.year}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {selectedSubject && (
          <motion.div 
            className="card"
            style={{ marginBottom: '30px', padding: '20px', textAlign: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'white' }}>
              {loading ? '🔄 Loading...' : `📊 Found ${filteredPYQs.length} papers for ${selectedSubject}`}
            </div>
          </motion.div>
        )}

        {/* PYQ Grid */}
        {!selectedSubject ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 20px' }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '10px' }}>
              Search for a Subject
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
              Type in the search box above to find subjects and their question papers
            </p>
          </motion.div>
        ) : loading ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', 
            gap: 'clamp(20px, 4vw, 30px)'
          }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card" style={{ height: '200px', background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ height: '20px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', marginBottom: '15px' }}></div>
                <div style={{ height: '15px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', marginBottom: '10px', width: '70%' }}></div>
                <div style={{ height: '15px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', width: '50%' }}></div>
              </div>
            ))}
          </div>
        ) : filteredPYQs.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', 
            gap: 'clamp(20px, 4vw, 30px)'
          }}>
            {filteredPYQs.map((pyq, index) => (
              <motion.div
                key={pyq._id}
                className="card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{ position: 'relative', cursor: 'pointer' }}
              >
                <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--primary-gradient)', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>
                  {pyq.year}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ width: '50px', height: '50px', background: 'var(--secondary-gradient)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    📄
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                      {pyq.title}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
                      {pyq.subject?.name}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      // Use PDF proxy for proper viewing
                      const proxyUrl = `https://pyqproject-backend.onrender.com/api/pdf/${pyq._id}?url=${encodeURIComponent(pyq.fileUrl)}`
                      window.open(proxyUrl, '_blank')
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'var(--accent-blue)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    👁️ View PDF
                  </button>
                  <button
                    onClick={() => {
                      // Force download using download endpoint
                      const downloadUrl = `https://pyqproject-backend.onrender.com/api/download/${pyq._id}?url=${encodeURIComponent(pyq.fileUrl)}&filename=${encodeURIComponent(pyq.title + '.pdf')}`
                      window.location.href = downloadUrl
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#48bb78',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    📥 Download
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 20px' }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📄</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '10px' }}>
              No papers found for {selectedSubject}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
              Try searching for a different subject
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Browse
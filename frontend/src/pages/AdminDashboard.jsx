import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminAPI } from '../ApiService'
import AuthService from '../AuthService'

const AdminDashboard = () => {
  const [user] = useState(() => AuthService.getUser())
  const [activeModule, setActiveModule] = useState('overview')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubjects: 0,
    totalPYQs: 0,
    pendingRequests: 0,
    totalDownloads: 0,
    popularSubjects: [],
    approvedToday: 0,
    rejectedToday: 0
  })
  const [pendingRequests, setPendingRequests] = useState([])
  const [uploadForm, setUploadForm] = useState({
    title: '',
    subjectName: '',
    year: new Date().getFullYear(),
    file: null
  })
  const [subjects, setSubjects] = useState([])
  const [uploading, setUploading] = useState(false)
  const [processingRequest, setProcessingRequest] = useState(null)
  const [processingAction, setProcessingAction] = useState(null) // 'approve' or 'reject'
  const [users, setUsers] = useState([])
  const [deletingUser, setDeletingUser] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deletingSubject, setDeletingSubject] = useState(null)
  const [confirmDeleteSubject, setConfirmDeleteSubject] = useState(null)
  const [toast, setToast] = useState(null)
  const [viewingSubject, setViewingSubject] = useState(null)
  const [subjectPYQs, setSubjectPYQs] = useState([])
  const [deletingPYQ, setDeletingPYQ] = useState(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchDashboardData()
    fetchSubjects()
    if (activeModule === 'users') {
      fetchUsers()
    }
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeModule])

  const fetchSubjects = async () => {
    try {
      const response = await AdminAPI.getSubjects()
      setSubjects(response)
    } catch (error) {
      console.error('Failed to fetch subjects:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await AdminAPI.getAllUsers()
      setUsers(response)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleDeleteSubject = async (subjectId) => {
    setConfirmDeleteSubject(subjectId)
  }

  const handleDeletePYQ = async (pyqId) => {
    setDeletingPYQ(pyqId)
    try {
      await AdminAPI.deletePYQ(pyqId)
      // Refresh the PYQ list
      await handleViewSubjectPYQs(viewingSubject)
      await fetchDashboardData() // Refresh stats
      showToast('PYQ deleted successfully!', 'success')
    } catch (error) {
      showToast(error.message || 'Failed to delete PYQ', 'error')
    } finally {
      setDeletingPYQ(null)
    }
  }

  const handleViewSubjectPYQs = async (subject) => {
    setViewingSubject(subject)
    try {
      // Use the same endpoint as Browse page
      const response = await fetch(`http://localhost:5000/api/pyqs/by-subject?subject=${encodeURIComponent(subject.name)}`)
      const data = await response.json()
      setSubjectPYQs(data)
    } catch (error) {
      showToast('Failed to fetch PYQs for this subject', 'error')
      setSubjectPYQs([])
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const confirmSubjectDeletion = async () => {
    const subjectId = confirmDeleteSubject
    setConfirmDeleteSubject(null)
    setDeletingSubject(subjectId)
    
    try {
      const response = await AdminAPI.deleteSubject(subjectId)
      await fetchSubjects() // Refresh subjects list
      await fetchDashboardData() // Refresh stats
      showToast(response.message || 'Subject deleted successfully!', 'success')
    } catch (error) {
      showToast(error.message || 'Failed to delete subject', 'error')
    } finally {
      setDeletingSubject(null)
    }
  }

  const handleDeleteUser = async (userId) => {
    setConfirmDelete(userId)
  }

  const confirmDeleteUser = async () => {
    const userId = confirmDelete
    setConfirmDelete(null)
    setDeletingUser(userId)
    
    try {
      await AdminAPI.deleteUser(userId)
      await fetchUsers() // Refresh users list
      await fetchDashboardData() // Refresh stats
      showToast('User deleted successfully!', 'success')
    } catch (error) {
      showToast('Failed to delete user', 'error')
    } finally {
      setDeletingUser(null)
    }
  }

  const fetchDashboardData = async () => {
    try {
      const [requests, dashboardStats] = await Promise.all([
        AdminAPI.getPendingRequests(),
        AdminAPI.getDashboardStats()
      ])
      
      setPendingRequests(requests)
      const newStats = {
        totalUsers: dashboardStats.totalUsers || 0,
        totalSubjects: dashboardStats.totalSubjects || 0,
        totalPYQs: dashboardStats.totalPYQs || 0,
        pendingRequests: dashboardStats.pendingRequests || 0,
        totalDownloads: dashboardStats.totalDownloads || 0,
        approvedToday: dashboardStats.approvedToday || 0,
        rejectedToday: dashboardStats.rejectedToday || 0,
        popularSubjects: dashboardStats.popularSubjects || []
      }
      setStats(newStats)
    } catch (error) {
      if (error.response?.status === 401) {
        AuthService.logout()
        return
      }
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const handleLogout = () => {
    AuthService.logout()
  }

  const handleModuleChange = (module) => {
    if (activeModule === module) {
      setActiveModule('overview')
    } else {
      setActiveModule(module)
    }
  }

  const handleCloseModule = () => {
    setActiveModule('overview')
  }

  const handleApproveRequest = async (requestId) => {
    setProcessingRequest(requestId)
    setProcessingAction('approve')
    try {
      await AdminAPI.approveRequest(requestId)
      await fetchDashboardData() // Refresh data
      showToast('Request approved successfully!', 'success')
    } catch (error) {
      showToast('Failed to approve request', 'error')
    } finally {
      setProcessingRequest(null)
      setProcessingAction(null)
    }
  }

  const handleRejectRequest = async (requestId) => {
    setProcessingRequest(requestId)
    setProcessingAction('reject')
    try {
      await AdminAPI.rejectRequest(requestId)
      await fetchDashboardData() // Refresh data
      showToast('Request rejected successfully!', 'success')
    } catch (error) {
      showToast('Failed to reject request', 'error')
    } finally {
      setProcessingRequest(null)
      setProcessingAction(null)
    }
  }

  const handleViewPYQPDF = (pyq) => {
    // Use same proxy format as Browse page
    const proxyUrl = `http://localhost:5000/api/pdf/${pyq._id}?url=${encodeURIComponent(pyq.fileUrl)}`
    window.open(proxyUrl, '_blank')
  }

  const handleViewPDF = (fileUrl, title, requestId) => {
    // Use PDF proxy for proper viewing (same as Browse page)
    // For upload requests, we'll use a generic ID since they're not PYQs yet
    const proxyUrl = `http://localhost:5000/api/pdf/request-${requestId}?url=${encodeURIComponent(fileUrl)}`
    window.open(proxyUrl, '_blank')
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!uploadForm.file || !uploadForm.title || !uploadForm.subjectName) {
      showToast('Please fill all fields and select a PDF file', 'error')
      return
    }

    setUploading(true)

    const formData = new FormData()
    formData.append('pdf', uploadForm.file)
    formData.append('title', uploadForm.title)
    formData.append('subjectName', uploadForm.subjectName)
    formData.append('year', uploadForm.year)

    try {
      await AdminAPI.uploadPYQ(formData)
      showToast('PYQ uploaded successfully!', 'success')
      setUploadForm({ title: '', subjectName: '', year: new Date().getFullYear(), file: null })
      fetchDashboardData()
    } catch (error) {
      showToast(error.response?.data?.message || 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const StatCard = ({ icon, title, value, color }) => (
    <motion.div
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        rotateX: 5,
        rotateY: 5
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: 'clamp(20px, 5vw, 28px) clamp(16px, 4vw, 20px)',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
        flex: '1',
        minWidth: 'clamp(160px, 40vw, 180px)',
        maxWidth: 'clamp(200px, 45vw, 220px)',
        position: 'relative',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      onMouseEnter={(e) => {
        // Rotating border animation
        e.currentTarget.style.background = `linear-gradient(45deg, ${color}15, rgba(255,255,255,0.03), ${color}15)`
        e.currentTarget.style.borderImage = `linear-gradient(45deg, ${color}, transparent, ${color}) 1`
        e.currentTarget.style.boxShadow = `0 20px 40px ${color}20, 0 0 0 1px ${color}30, inset 0 1px 0 rgba(255,255,255,0.1)`
        
        // Add shimmer effect
        const shimmer = document.createElement('div')
        shimmer.style.cssText = `
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, ${color}20, transparent);
          animation: shimmer 2s infinite;
          pointer-events: none;
          z-index: 1;
        `
        e.currentTarget.appendChild(shimmer)
        
        // Add ripple effect
        const ripple = document.createElement('div')
        ripple.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: ${color}30;
          transform: translate(-50%, -50%);
          animation: ripple 0.8s ease-out;
          pointer-events: none;
          z-index: 0;
        `
        e.currentTarget.appendChild(ripple)
        
        setTimeout(() => {
          if (shimmer.parentNode) shimmer.remove()
          if (ripple.parentNode) ripple.remove()
        }, 2000)
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
        e.currentTarget.style.borderImage = 'none'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Floating particles background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 20% 80%, ${color}10 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${color}08 0%, transparent 50%)`,
        borderRadius: '24px',
        opacity: 0.6
      }} />
      
      {/* Animated icon with 3D effect */}
      <motion.div 
        whileHover={{ 
          scale: 1.2, 
          rotateY: 15,
          rotateX: -10
        }}
        style={{ 
          fontSize: '2.8rem', 
          marginBottom: '16px',
          color: color,
          filter: `drop-shadow(0 4px 8px ${color}40)`,
          position: 'relative',
          zIndex: 2,
          transformStyle: 'preserve-3d'
        }}
      >
        {icon}
      </motion.div>
      
      {/* Animated value with counter effect */}
      <motion.div 
        whileHover={{ scale: 1.1 }}
        style={{ 
          fontSize: '2.2rem', 
          fontWeight: '900', 
          color: 'white',
          marginBottom: '8px',
          position: 'relative',
          zIndex: 2,
          textShadow: `0 2px 4px ${color}40, 0 0 20px ${color}20`
        }}
      >
        {(value || 0).toLocaleString()}
      </motion.div>
      
      {/* Enhanced title with gradient */}
      <div style={{ 
        background: `linear-gradient(135deg, white, ${color})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: '0.9rem',
        fontWeight: '600',
        position: 'relative',
        zIndex: 2,
        letterSpacing: '0.5px'
      }}>
        {title}
      </div>
      
      {/* Rotating border effect */}
      <div style={{
        position: 'absolute',
        top: '-2px',
        left: '-2px',
        right: '-2px',
        bottom: '-2px',
        background: `conic-gradient(from 0deg, ${color}, transparent, ${color})`,
        borderRadius: '26px',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        animation: 'rotate 3s linear infinite',
        zIndex: -1
      }} className="rotating-border" />
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        @keyframes ripple {
          0% { width: 0; height: 0; opacity: 1; }
          100% { width: 300px; height: 300px; opacity: 0; }
        }
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .stat-card:hover .rotating-border {
          opacity: 0.6;
        }
      `}</style>
    </motion.div>
  )

  const QuickActionButton = ({ icon, label, module, isActive }) => (
    <motion.button
      onClick={() => handleModuleChange(module)}
      whileHover={{ 
        scale: 1.08, 
        y: -4,
        rotateX: 5,
        rotateY: 2
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: isActive 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'rgba(255, 255, 255, 0.05)',
        border: isActive 
          ? '1px solid rgba(102, 126, 234, 0.4)'
          : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '20px 28px',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.95rem',
        fontWeight: '600',
        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        minWidth: 'clamp(140px, 35vw, 160px)',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        backdropFilter: 'blur(20px)'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
          e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)'
          e.currentTarget.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.2), 0 0 0 1px rgba(102, 126, 234, 0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
        }
        
        // Add shimmer effect
        const shimmer = document.createElement('div')
        shimmer.style.cssText = `
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 1.5s infinite;
          pointer-events: none;
          z-index: 1;
        `
        e.currentTarget.appendChild(shimmer)
        
        // Add ripple effect
        const ripple = document.createElement('div')
        ripple.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(102, 126, 234, 0.3);
          transform: translate(-50%, -50%);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
          z-index: 0;
        `
        e.currentTarget.appendChild(ripple)
        
        setTimeout(() => {
          if (shimmer.parentNode) shimmer.remove()
          if (ripple.parentNode) ripple.remove()
        }, 1500)
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {/* Background glow effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isActive 
          ? 'radial-gradient(circle at center, rgba(102, 126, 234, 0.1) 0%, transparent 70%)'
          : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
        borderRadius: '16px',
        opacity: 0.8
      }} />
      
      {/* Animated icon with 3D effect */}
      <motion.span 
        whileHover={{ 
          scale: 1.2, 
          rotateY: 10,
          rotateZ: 5
        }}
        style={{ 
          fontSize: '1.4rem',
          position: 'relative',
          zIndex: 2,
          transformStyle: 'preserve-3d',
          filter: isActive 
            ? 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.4))'
            : 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.1))'
        }}
      >
        {icon}
      </motion.span>
      
      {/* Enhanced label */}
      <span style={{
        position: 'relative',
        zIndex: 2,
        textShadow: isActive 
          ? '0 1px 2px rgba(102, 126, 234, 0.3)'
          : '0 1px 2px rgba(0, 0, 0, 0.2)',
        letterSpacing: '0.3px'
      }}>
        {label}
      </span>
      
      {/* Rotating border for active state */}
      {isActive && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          background: 'conic-gradient(from 0deg, #667eea, transparent, #764ba2, transparent, #667eea)',
          borderRadius: '18px',
          opacity: 0.6,
          animation: 'rotate 4s linear infinite',
          zIndex: -1
        }} />
      )}
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        @keyframes ripple {
          0% { width: 0; height: 0; opacity: 1; }
          100% { width: 200px; height: 200px; opacity: 0; }
        }
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.button>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      backgroundImage: 
        'radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)',
      position: 'relative',
      color: 'white'
    }}>
      {/* Top Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 32px)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Left Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              🛡️
            </div>
            <h1 style={{ 
              color: 'white', 
              fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', 
              fontWeight: '800',
              margin: 0 
            }}>
              Admin Dashboard
            </h1>
          </div>

          {/* Right Side - Profile Dropdown */}
          <div className="profile-section" ref={dropdownRef} style={{ position: 'relative' }}>
            <motion.div 
              className="profile-trigger"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '25px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
                transformStyle: 'preserve-3d'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(238, 90, 82, 0.2))'
                e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.4)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                
                // Add shimmer effect
                const shimmer = document.createElement('div')
                shimmer.style.cssText = `
                  position: absolute;
                  top: -50%;
                  left: -50%;
                  width: 200%;
                  height: 200%;
                  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
                  animation: shimmer 1.5s infinite;
                  pointer-events: none;
                  z-index: 1;
                `
                e.currentTarget.appendChild(shimmer)
                
                // Add ripple effect
                const ripple = document.createElement('div')
                ripple.style.cssText = `
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  width: 0;
                  height: 0;
                  border-radius: 50%;
                  background: rgba(255, 107, 107, 0.3);
                  transform: translate(-50%, -50%);
                  animation: ripple 0.8s ease-out;
                  pointer-events: none;
                  z-index: 0;
                `
                e.currentTarget.appendChild(ripple)
                
                setTimeout(() => {
                  if (shimmer.parentNode) shimmer.remove()
                  if (ripple.parentNode) ripple.remove()
                }, 1500)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <motion.div className="profile-avatar" 
                whileHover={{ scale: 1.15, rotateY: 15 }}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
                  position: 'relative',
                  zIndex: 2,
                  transformStyle: 'preserve-3d',
                  filter: 'drop-shadow(0 2px 8px rgba(255, 107, 107, 0.3))'
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </motion.div>
              
              <div className="profile-info" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
                <span style={{
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  lineHeight: '1.2'
                }}>
                  {user?.name}
                </span>
                <span style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Administrator
                </span>
              </div>
              
              <motion.div
                animate={{ rotate: showProfileDropdown ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '12px'
                }}
              >
                ▼
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="profile-dropdown"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    marginTop: '8px',
                    width: '300px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    overflow: 'hidden',
                    zIndex: 1000
                  }}
                >
                  <div className="dropdown-header" style={{
                    padding: '24px',
                    background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                    color: 'white'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        fontWeight: '600'
                      }}>
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
                          {user?.name}
                        </div>
                        <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '6px' }}>
                          {user?.email}
                        </div>
                        <div style={{
                          display: 'inline-block',
                          background: 'rgba(255, 255, 255, 0.2)',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          🛡️ Administrator
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="dropdown-menu" style={{ padding: '12px' }}>

                    
                    <motion.div
                      className="dropdown-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        color: '#333',
                        fontSize: '14px',
                        fontWeight: '500',
                        background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(56, 161, 105, 0.1) 100%)',
                        border: '1px solid rgba(72, 187, 120, 0.2)',
                        margin: '0 8px'
                      }}
                    >
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #48bb78, #38a169)',
                        flexShrink: 0,
                        boxShadow: '0 0 8px rgba(72, 187, 120, 0.4)',
                        animation: 'pulse 2s infinite'
                      }}></div>
                      <div>
                        <div style={{ fontWeight: '700', color: '#2d3748', fontSize: '15px' }}>Status: Active</div>
                        <div style={{ fontSize: '12px', color: '#48bb78', fontWeight: '600' }}>Online and ready</div>
                      </div>
                    </motion.div>
                    
                    <div style={{
                      height: '1px',
                      background: 'rgba(0,0,0,0.1)',
                      margin: '16px 16px 12px 16px'
                    }} />
                    

                    

                    
                    <motion.div
                      whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                      onClick={() => {
                        setShowProfileDropdown(false)
                        handleLogout()
                      }}
                      className="dropdown-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        color: '#ef4444',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>🚪</span>
                      <div>
                        <div style={{ fontWeight: '600' }}>Sign Out</div>
                        <div style={{ fontSize: '12px', color: '#ef4444', opacity: 0.7 }}>End your session</div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ 
        paddingTop: 'clamp(120px, 20vw, 140px)', 
        paddingBottom: '40px',
        paddingLeft: 'clamp(16px, 4vw, 32px)',
        paddingRight: 'clamp(16px, 4vw, 32px)',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Dashboard Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '40px' }}
        >
          <h2 style={{ 
            color: 'white', 
            fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', 
            fontWeight: '700',
            marginBottom: '32px' 
          }}>
            Dashboard Overview
          </h2>
          
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(15px, 3vw, 20px)',
            justifyContent: 'space-between'
          }}>
            <StatCard 
              icon="👥" 
              title="Total Users" 
              value={stats.totalUsers} 
              color="#4ecdc4" 
            />
            <StatCard 
              icon="📚" 
              title="Total Subjects" 
              value={stats.totalSubjects} 
              color="#9b59b6" 
            />
            <StatCard 
              icon="📄" 
              title="Total PYQs" 
              value={stats.totalPYQs} 
              color="#4a90e2" 
            />
            <StatCard 
              icon="⏳" 
              title="Pending Requests" 
              value={stats.pendingRequests} 
              color="#ffc107" 
            />
            <StatCard 
              icon="📥" 
              title="Total Downloads" 
              value={stats.totalDownloads} 
              color="#48bb78" 
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginBottom: '40px' }}
        >
          <h2 style={{ 
            color: 'white', 
            fontSize: '1.8rem', 
            fontWeight: '700',
            marginBottom: '24px' 
          }}>
            Quick Actions
          </h2>
          
          <div style={{ 
            display: 'flex', 
            gap: 'clamp(12px, 3vw, 16px)', 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <QuickActionButton 
              icon="📚" 
              label="Manage Subjects" 
              module="subjects"
              isActive={activeModule === 'subjects'}
            />
            <QuickActionButton 
              icon="📄" 
              label="Pending PYQ Requests" 
              module="pyqs"
              isActive={activeModule === 'pyqs'}
            />
            <QuickActionButton 
              icon="👥" 
              label="Manage Users" 
              module="users"
              isActive={activeModule === 'users'}
            />
            <QuickActionButton 
              icon="📤" 
              label="Upload PYQs" 
              module="upload"
              isActive={activeModule === 'upload'}
            />
            <QuickActionButton 
              icon="📊" 
              label="Analytics" 
              module="analytics"
              isActive={activeModule === 'analytics'}
            />
          </div>
        </motion.div>

        {/* Recent Activity & System Health */}
        {activeModule === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ marginBottom: '40px' }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
              gap: 'clamp(20px, 4vw, 24px)'
            }}>
              {/* Recent Activity */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h3 style={{
                  color: 'white',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  ⚡ Recent Activity
                </h3>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#48bb78',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}>✅</div>
                    <div>
                      <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                        {stats.approvedToday} PYQs approved today
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                        Keep up the great work!
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#4a90e2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}>👥</div>
                    <div>
                      <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                        {stats.totalUsers} total users registered
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                        Growing community
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#9b59b6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}>📚</div>
                    <div>
                      <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                        {stats.totalSubjects} subjects available
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                        Diverse content library
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* System Health */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h3 style={{
                  color: 'white',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🔧 System Health
                </h3>
                
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#48bb78'
                      }}></div>
                      <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Database</span>
                    </div>
                    <span style={{ color: '#48bb78', fontSize: '12px', fontWeight: '600' }}>Online</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#48bb78'
                      }}></div>
                      <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Server</span>
                    </div>
                    <span style={{ color: '#48bb78', fontSize: '12px', fontWeight: '600' }}>Running</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: stats.pendingRequests > 5 ? '#ffc107' : '#48bb78'
                      }}></div>
                      <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Queue Status</span>
                    </div>
                    <span style={{ 
                      color: stats.pendingRequests > 5 ? '#ffc107' : '#48bb78', 
                      fontSize: '12px', 
                      fontWeight: '600' 
                    }}>
                      {stats.pendingRequests > 5 ? 'Busy' : 'Normal'}
                    </span>
                  </div>
                  
                  <div style={{
                    marginTop: '8px',
                    padding: '12px',
                    background: 'rgba(72, 187, 120, 0.1)',
                    border: '1px solid rgba(72, 187, 120, 0.3)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#48bb78', fontSize: '12px', fontWeight: '600' }}>
                      ✨ All systems operational
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}



        {/* Module Content */}
        <AnimatePresence mode="wait">
          {activeModule === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(25px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '36px',
                marginBottom: '40px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ 
                  color: 'white', 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  margin: 0
                }}>
                  Upload PYQ
                </h3>
                <motion.button
                  onClick={handleCloseModule}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px'
                  }}
                >
                  ✕
                </motion.button>
              </div>
              
              <form onSubmit={handleUploadSubmit} style={{ 
                display: 'grid', 
                gap: 'clamp(16px, 3vw, 20px)',
                maxWidth: '100%' 
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    color: 'rgba(255,255,255,0.9)', 
                    marginBottom: '8px',
                    fontWeight: '600' 
                  }}>
                    📝 Paper Title
                  </label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    placeholder="e.g., Mathematics Final Exam 2023"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: 'rgba(255,255,255,0.9)', 
                    marginBottom: '8px',
                    fontWeight: '600' 
                  }}>
                    📚 Subject Name
                  </label>
                  <input
                    type="text"
                    value={uploadForm.subjectName}
                    onChange={(e) => setUploadForm({...uploadForm, subjectName: e.target.value})}
                    placeholder="Enter subject name (e.g., Mathematics, Physics...)"
                    list="admin-subjects-list"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <datalist id="admin-subjects-list">
                    {subjects.map(subject => (
                      <option key={subject._id} value={subject.name} />
                    ))}
                  </datalist>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '6px' }}>
                    💡 You can create new subjects by typing a new name
                  </p>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: 'rgba(255,255,255,0.9)', 
                    marginBottom: '8px',
                    fontWeight: '600' 
                  }}>
                    📅 Year
                  </label>
                  <input
                    type="number"
                    value={uploadForm.year}
                    onChange={(e) => setUploadForm({...uploadForm, year: parseInt(e.target.value)})}
                    min="2000"
                    max={new Date().getFullYear()}
                    required
                    style={{
                      width: '200px',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: 'rgba(255,255,255,0.9)', 
                    marginBottom: '8px',
                    fontWeight: '600' 
                  }}>
                    📄 PDF File
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={uploading}
                  whileHover={{ scale: uploading ? 1 : 1.02 }}
                  whileTap={{ scale: uploading ? 1 : 0.98 }}
                  style={{
                    background: uploading ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #4a90e2 0%, #50c878 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px 24px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {uploading ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      Uploading...
                    </>
                  ) : (
                    <>📤 Upload PYQ</>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}



          {activeModule === 'subjects' && (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(25px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '36px',
                marginBottom: '40px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ 
                  color: 'white', 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  margin: 0
                }}>
                  Manage Subjects ({subjects.length})
                </h3>
                <motion.button
                  onClick={handleCloseModule}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px'
                  }}
                >
                  ✕
                </motion.button>
              </div>
              
              {subjects.length > 0 ? (
                <div style={{ 
                  display: 'grid', 
                  gap: 'clamp(12px, 3vw, 16px)' 
                }}>
                  {subjects.map((subject) => (
                    <motion.div
                      key={subject._id}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -4,
                        rotateX: 2,
                        rotateY: 1
                      }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        padding: 'clamp(16px, 4vw, 24px)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        transformStyle: 'preserve-3d',
                        cursor: 'pointer',
                        flexWrap: 'wrap',
                        gap: 'clamp(8px, 2vw, 12px)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                        e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.3)'
                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(147, 51, 234, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                        
                        // Add shimmer effect
                        const shimmer = document.createElement('div')
                        shimmer.style.cssText = `
                          position: absolute;
                          top: -50%;
                          left: -50%;
                          width: 200%;
                          height: 200%;
                          background: linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.1), transparent);
                          animation: shimmer 2s infinite;
                          pointer-events: none;
                          z-index: 1;
                        `
                        e.currentTarget.appendChild(shimmer)
                        
                        setTimeout(() => {
                          if (shimmer.parentNode) shimmer.remove()
                        }, 2000)
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px',
                          marginBottom: '8px' 
                        }}>
                          <span style={{ fontSize: '1.2rem' }}>📚</span>
                          <div>
                            <div style={{ 
                              color: 'white', 
                              fontWeight: '600',
                              fontSize: '1.1rem' 
                            }}>
                              {subject.name}
                            </div>
                          </div>
                        </div>
                        <div style={{ 
                          color: 'rgba(255,255,255,0.6)', 
                          fontSize: '0.8rem' 
                        }}>
                          Created: {new Date(subject.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <motion.button
                          onClick={() => handleViewSubjectPYQs(subject)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            background: '#4a90e2',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 16px',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          👁️ View PYQs
                        </motion.button>
                        
                        <motion.button
                          onClick={() => handleDeleteSubject(subject._id)}
                          disabled={deletingSubject === subject._id}
                          whileHover={{ scale: deletingSubject === subject._id ? 1 : 1.05 }}
                          whileTap={{ scale: deletingSubject === subject._id ? 1 : 0.95 }}
                          style={{
                            background: deletingSubject === subject._id ? 'rgba(239, 68, 68, 0.5)' : '#ef4444',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 16px',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: deletingSubject === subject._id ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {deletingSubject === subject._id ? (
                            <>
                              <div style={{ width: '14px', height: '14px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                              Deleting...
                            </>
                          ) : (
                            <>🗑️ Delete Subject</>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: 'rgba(255,255,255,0.7)' 
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                    No subjects found.
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeModule === 'pyqs' && (
            <motion.div
              key="pyqs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '40px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ 
                  color: 'white', 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  margin: 0
                }}>
                  Pending Upload Requests ({pendingRequests.length})
                </h3>
                <motion.button
                  onClick={handleCloseModule}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px'
                  }}
                >
                  ✕
                </motion.button>
              </div>
              
              {pendingRequests.length > 0 ? (
                <div style={{ 
                  display: 'grid', 
                  gap: '16px' 
                }}>
                  {pendingRequests.slice(0, 3).map((request, index) => (
                    <div
                      key={request._id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          color: 'white', 
                          fontWeight: '600',
                          marginBottom: '4px' 
                        }}>
                          {request.title || request.subjectName}
                        </div>
                        <div style={{ 
                          color: 'rgba(255,255,255,0.7)', 
                          fontSize: '0.9rem' 
                        }}>
                          Year: {request.year} • Uploaded by: {request.uploadedByUser || 'Anonymous'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <motion.button
                          onClick={() => handleViewPDF(request.fileUrl, request.title, request._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            background: '#4a90e2',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            color: 'white',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          👁️ View PDF
                        </motion.button>
                        <motion.button
                          onClick={() => handleApproveRequest(request._id)}
                          disabled={processingRequest === request._id}
                          whileHover={{ scale: (processingRequest === request._id) ? 1 : 1.05 }}
                          whileTap={{ scale: (processingRequest === request._id) ? 1 : 0.95 }}
                          style={{
                            background: (processingRequest === request._id && processingAction === 'approve') ? 'rgba(72, 187, 120, 0.5)' : '#48bb78',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            color: 'white',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: (processingRequest === request._id) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {(processingRequest === request._id && processingAction === 'approve') ? (
                            <>
                              <div style={{ width: '12px', height: '12px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                              Processing...
                            </>
                          ) : (
                            <>✅ Approve</>
                          )}
                        </motion.button>
                        <motion.button
                          onClick={() => handleRejectRequest(request._id)}
                          disabled={processingRequest === request._id}
                          whileHover={{ scale: (processingRequest === request._id) ? 1 : 1.05 }}
                          whileTap={{ scale: (processingRequest === request._id) ? 1 : 0.95 }}
                          style={{
                            background: (processingRequest === request._id && processingAction === 'reject') ? 'rgba(239, 68, 68, 0.5)' : '#ef4444',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            color: 'white',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: (processingRequest === request._id) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {(processingRequest === request._id && processingAction === 'reject') ? (
                            <>
                              <div style={{ width: '12px', height: '12px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                              Processing...
                            </>
                          ) : (
                            <>❌ Reject</>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: 'rgba(255,255,255,0.7)' 
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                    All caught up! No pending requests.
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeModule === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '40px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ 
                  color: 'white', 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  margin: 0
                }}>
                  📊 Analytics Dashboard
                </h3>
                <motion.button
                  onClick={handleCloseModule}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    width: '32px',
                    height: '32px'
                  }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Key Metrics Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px',
                marginBottom: '32px' 
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📈</div>
                  <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}>
                    {((stats.approvedToday / (stats.approvedToday + stats.rejectedToday)) * 100 || 0).toFixed(1)}%
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Approval Rate</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚡</div>
                  <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}>
                    {(stats.totalDownloads / stats.totalPYQs || 0).toFixed(1)}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Avg Downloads/PYQ</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
                  <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}>
                    {(stats.totalPYQs / stats.totalSubjects || 0).toFixed(1)}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>PYQs per Subject</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
                  <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}>
                    {stats.totalUsers > 0 ? (stats.totalDownloads / stats.totalUsers).toFixed(1) : '0'}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Downloads per User</div>
                </div>
              </div>

              {/* Activity Summary */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '24px',
                marginBottom: '32px' 
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px' }}>
                    📊 Today's Activity
                  </h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>✅ Approved</span>
                      <span style={{ color: '#48bb78', fontWeight: '600' }}>{stats.approvedToday}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>❌ Rejected</span>
                      <span style={{ color: '#ef4444', fontWeight: '600' }}>{stats.rejectedToday}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>⏳ Pending</span>
                      <span style={{ color: '#ffc107', fontWeight: '600' }}>{stats.pendingRequests}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px' }}>
                    📈 Real-time Metrics
                  </h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>Approval Rate</span>
                      <span style={{ color: '#48bb78', fontWeight: '600' }}>
                        {stats.approvedToday + stats.rejectedToday > 0 
                          ? `${((stats.approvedToday / (stats.approvedToday + stats.rejectedToday)) * 100).toFixed(1)}%`
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>Avg Downloads/PYQ</span>
                      <span style={{ color: '#4a90e2', fontWeight: '600' }}>
                        {stats.totalPYQs > 0 ? (stats.totalDownloads / stats.totalPYQs).toFixed(1) : '0'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>PYQs per Subject</span>
                      <span style={{ color: '#9c27b0', fontWeight: '600' }}>
                        {stats.totalSubjects > 0 ? (stats.totalPYQs / stats.totalSubjects).toFixed(1) : '0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Most Popular Subjects */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px'
              }}>
                <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px' }}>
                  🏆 Most Popular Subjects
                </h4>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {stats.popularSubjects && stats.popularSubjects.length > 0 ? (
                    stats.popularSubjects.map((subject, index) => {
                      const colors = ['#ff6b6b', '#4a90e2', '#48bb78', '#9b59b6', '#ffc107']
                      const icons = ['🔢', '⚛️', '🧪', '💻', '📚']
                      const color = colors[index] || '#6c757d'
                      const icon = icons[index] || '📖'
                      
                      return (
                        <motion.div
                          key={subject._id}
                          whileHover={{ scale: 1.02, x: 5 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px 20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: `2px solid ${color}20`,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${color}15`
                            e.currentTarget.style.borderColor = `${color}40`
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                            e.currentTarget.style.borderColor = `${color}20`
                          }}
                        >
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: '700',
                            color: 'white',
                            boxShadow: `0 4px 12px ${color}30`
                          }}>
                            #{index + 1}
                          </div>
                          
                          <div style={{
                            fontSize: '24px',
                            marginRight: '8px'
                          }}>
                            {icon}
                          </div>
                          
                          <div style={{ flex: 1 }}>
                            <div style={{
                              color: 'white',
                              fontSize: '16px',
                              fontWeight: '700',
                              marginBottom: '4px'
                            }}>
                              {subject.name}
                            </div>
                            <div style={{
                              color: 'rgba(255,255,255,0.7)',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}>
                              {subject.totalDownloads.toLocaleString()} downloads • {subject.pyqCount} PYQs
                            </div>
                          </div>
                          
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <div style={{
                              width: '60px',
                              height: '6px',
                              background: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: '3px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${stats.popularSubjects.length > 0 ? (subject.totalDownloads / stats.popularSubjects[0].totalDownloads) * 100 : 0}%`,
                                height: '100%',
                                background: color,
                                borderRadius: '3px',
                                transition: 'width 0.5s ease'
                              }}></div>
                            </div>
                            <span style={{
                              color: color,
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {stats.popularSubjects.length > 0 ? ((subject.totalDownloads / stats.popularSubjects[0].totalDownloads) * 100).toFixed(0) : 0}%
                            </span>
                          </div>
                        </motion.div>
                      )
                    })
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px',
                      color: 'rgba(255,255,255,0.6)'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📊</div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>
                        No download data available yet
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          )}

          {activeModule === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '40px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ 
                  color: 'white', 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  margin: 0
                }}>
                  Manage Users ({users.length})
                </h3>
                <motion.button
                  onClick={handleCloseModule}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px'
                  }}
                >
                  ✕
                </motion.button>
              </div>
              
              {users.length > 0 ? (
                <div style={{ 
                  display: 'grid', 
                  gap: '16px' 
                }}>
                  {users.map((userItem) => (
                    <div
                      key={userItem._id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px',
                          marginBottom: '8px' 
                        }}>
                          <span style={{ fontSize: '1.2rem' }}>
                            {userItem.role === 'admin' ? '🛡️' : '👤'}
                          </span>
                          <div>
                            <div style={{ 
                              color: 'white', 
                              fontWeight: '600',
                              fontSize: '1.1rem' 
                            }}>
                              {userItem.name}
                            </div>
                            <div style={{ 
                              color: 'rgba(255,255,255,0.7)', 
                              fontSize: '0.9rem' 
                            }}>
                              {userItem.email}
                            </div>
                          </div>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          gap: '12px',
                          alignItems: 'center' 
                        }}>
                          <span style={{
                            background: userItem.role === 'admin' ? '#ff6b6b' : '#4a90e2',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: 'white'
                          }}>
                            {userItem.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                          <span style={{ 
                            color: 'rgba(255,255,255,0.6)', 
                            fontSize: '0.8rem' 
                          }}>
                            Joined: {new Date(userItem.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      {user?.role === 'admin' && userItem._id !== user?.id && (
                        <motion.button
                          onClick={() => handleDeleteUser(userItem._id)}
                          disabled={deletingUser === userItem._id}
                          whileHover={{ scale: deletingUser === userItem._id ? 1 : 1.05 }}
                          whileTap={{ scale: deletingUser === userItem._id ? 1 : 0.95 }}
                          style={{
                            background: deletingUser === userItem._id ? 'rgba(239, 68, 68, 0.5)' : '#ef4444',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 16px',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: deletingUser === userItem._id ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {deletingUser === userItem._id ? (
                            <>
                              <div style={{ width: '14px', height: '14px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                              Deleting...
                            </>
                          ) : (
                            <>🗑️ Delete User</>
                          )}
                        </motion.button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: 'rgba(255,255,255,0.7)' 
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👥</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                    No users found.
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subject PYQs Modal */}
      {viewingSubject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 2500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '700',
                margin: 0
              }}>
                📚 {viewingSubject.name} - PYQs ({subjectPYQs.length})
              </h3>
              <motion.button
                onClick={() => setViewingSubject(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px'
                }}
              >
                ✕
              </motion.button>
            </div>
            
            {subjectPYQs.length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {subjectPYQs.map((pyq) => (
                  <div
                    key={pyq._id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        marginBottom: '8px'
                      }}>
                        {pyq.title}
                      </div>
                      <div style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.9rem',
                        display: 'flex',
                        gap: '16px'
                      }}>
                        <span>📅 Year: {pyq.year}</span>
                        <span>📎 Downloads: {pyq.downloadCount || 0}</span>
                        <span>👤 By: {pyq.uploadedBy}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <motion.button
                        onClick={() => handleViewPYQPDF(pyq)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          background: '#4a90e2',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 16px',
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        👁️ View PDF
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleDeletePYQ(pyq._id)}
                        disabled={deletingPYQ === pyq._id}
                        whileHover={{ scale: deletingPYQ === pyq._id ? 1 : 1.05 }}
                        whileTap={{ scale: deletingPYQ === pyq._id ? 1 : 0.95 }}
                        style={{
                          background: deletingPYQ === pyq._id ? 'rgba(239, 68, 68, 0.5)' : '#ef4444',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 16px',
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: deletingPYQ === pyq._id ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {deletingPYQ === pyq._id ? (
                          <>
                            <div style={{ width: '14px', height: '14px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            Deleting...
                          </>
                        ) : (
                          <>🗑️ Delete</>
                        )}
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: 'rgba(255,255,255,0.7)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                  No PYQs found for this subject.
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Custom Confirmation Modal for User Deletion */}
      {confirmDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{
              color: 'white',
              fontSize: '1.3rem',
              fontWeight: '700',
              marginBottom: '12px'
            }}>
              Delete User?
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.95rem',
              marginBottom: '24px',
              lineHeight: '1.5'
            }}>
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <motion.button
                onClick={() => setConfirmDelete(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={confirmDeleteUser}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🗑️ Delete User
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Custom Confirmation Modal for Subject Deletion */}
      {confirmDeleteSubject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{
              color: 'white',
              fontSize: '1.3rem',
              fontWeight: '700',
              marginBottom: '12px'
            }}>
              Delete Subject?
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.95rem',
              marginBottom: '24px',
              lineHeight: '1.5'
            }}>
              Are you sure you want to delete this subject? This will also delete all associated PYQs. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <motion.button
                onClick={() => setConfirmDeleteSubject(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={confirmSubjectDeletion}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🗑️ Delete Subject
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: -20, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3000,
            background: toast.type === 'success' 
              ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' 
              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.95rem',
            fontWeight: '600',
            minWidth: '300px',
            maxWidth: '500px'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>
            {toast.type === 'success' ? '✅' : '❌'}
          </span>
          <span>{toast.message}</span>
          <motion.button
            onClick={() => setToast(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              marginLeft: 'auto'
            }}
          >
            ✕
          </motion.button>
        </motion.div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Admin Footer */}
      <footer style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '20px 32px',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '14px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          © 2024 PYQ Hub Admin Dashboard. Secure administrative access.
        </div>
      </footer>
    </div>
  )
}

export default AdminDashboard
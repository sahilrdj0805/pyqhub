import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminAPI, ContactAPI } from '../ApiService'
import AuthService from '../AuthService'
import { useToast } from '../context/ToastContext'

// ─────────────────────────── ICONS ───────────────────────────
const SvgIcon = ({ children, size = 16, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
    {children}
  </svg>
)
const I = {
  Grid:    (p) => <SvgIcon {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></SvgIcon>,
  Upload:  (p) => <SvgIcon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></SvgIcon>,
  Book:    (p) => <SvgIcon {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></SvgIcon>,
  Users:   (p) => <SvgIcon {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></SvgIcon>,
  Mail:    (p) => <SvgIcon {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></SvgIcon>,
  Check:   (p) => <SvgIcon {...p}><polyline points="20 6 9 17 4 12"/></SvgIcon>,
  X:       (p) => <SvgIcon {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></SvgIcon>,
  Eye:     (p) => <SvgIcon {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></SvgIcon>,
  Trash:   (p) => <SvgIcon {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></SvgIcon>,
  File:    (p) => <SvgIcon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></SvgIcon>,
  Logout:  (p) => <SvgIcon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></SvgIcon>,
  Download:(p) => <SvgIcon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></SvgIcon>,
  Clock:   (p) => <SvgIcon {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></SvgIcon>,
  Alert:   (p) => <SvgIcon {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></SvgIcon>,
  Menu:    (p) => <SvgIcon {...p}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></SvgIcon>,
  Shield:  (p) => <SvgIcon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></SvgIcon>,
  Bar:     (p) => <SvgIcon {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></SvgIcon>,
  ChevL:   (p) => <SvgIcon {...p}><polyline points="15 18 9 12 15 6"/></SvgIcon>,
  Refresh: (p) => <SvgIcon {...p}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></SvgIcon>,
}

// ─────────────────────────── NAV CONFIG ──────────────────────
const NAV = [
  { id: 'overview', label: 'Overview',   Icon: I.Grid,   accent: '#818cf8' },
  { id: 'requests', label: 'Pending',    Icon: I.Clock,  accent: '#facc15' },
  { id: 'upload',   label: 'Upload PYQ', Icon: I.Upload, accent: '#4ade80' },
  { id: 'subjects', label: 'Subjects',   Icon: I.Book,   accent: '#22d3ee' },
  { id: 'users',    label: 'Users',      Icon: I.Users,  accent: '#a78bfa' },
  { id: 'messages', label: 'Messages',   Icon: I.Mail,   accent: '#fb923c' },
]



// ─────────────────────────── CONFIRM MODAL ───────────────────
const ConfirmModal = ({ open, title, description, onConfirm, onCancel }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', zIndex:3000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:20, padding:28, width:'100%', maxWidth:400 }}
          initial={{ scale: 0.93, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 8 }}
          transition={{ type:'spring', stiffness:400, damping:30 }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ width:44, height:44, borderRadius:12, background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.25)', display:'flex', alignItems:'center', justifyContent:'center', color:'#f87171', marginBottom:16 }}>
            <I.Trash size={20}/>
          </div>
          <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:700, color:'var(--text-1)', marginBottom:8, fontSize:'1.05rem' }}>{title}</h3>
          <p style={{ fontSize:'0.875rem', color:'var(--text-2)', lineHeight:1.65, marginBottom:24 }}>{description}</p>
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
            <button className="btn btn-sm" style={{ background:'#ef4444', color:'#fff', border:'none', boxShadow:'0 0 20px rgba(239,68,68,0.3)' }} onClick={onConfirm}>
              <I.Trash size={13}/> Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

// ─────────────────────────── STAT CARD ───────────────────────
const StatCard = ({ label, value, Icon, accent, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    whileHover={{ y: -3, transition: { duration: 0.2 } }}
    style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '20px 22px',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}40`; e.currentTarget.style.boxShadow = `0 8px 32px ${accent}15` }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
  >
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
      <div style={{ width:36, height:36, borderRadius:10, background:`${accent}14`, border:`1px solid ${accent}28`, display:'flex', alignItems:'center', justifyContent:'center', color:accent }}>
        <Icon size={16}/>
      </div>
    </div>
    <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:'1.75rem', fontWeight:700, color: accent, letterSpacing:'-0.04em', lineHeight:1, marginBottom:6 }}>
      {(value || 0).toLocaleString()}
    </div>
    <div style={{ fontSize:'0.78rem', color:'var(--text-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</div>
  </motion.div>
)

// ─────────────────────────── SECTION HEADER ──────────────────
const SectionHeader = ({ title, subtitle, action }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:12, marginBottom:24 }}>
    <div>
      <h1 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:'clamp(1.3rem,4vw,1.8rem)', fontWeight:700, color:'var(--text-1)', letterSpacing:'-0.025em', marginBottom:4 }}>{title}</h1>
      {subtitle && <p style={{ fontSize:'0.85rem', color:'var(--text-3)' }}>{subtitle}</p>}
    </div>
    {action}
  </div>
)

// ─────────────────────────── EMPTY STATE ─────────────────────
const Empty = ({ icon: Icon, title, desc }) => (
  <div style={{ textAlign:'center', padding:'64px 24px' }}>
    <div style={{ width:52, height:52, borderRadius:14, background:'var(--bg-elevated)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-3)', margin:'0 auto 16px' }}>
      <Icon size={22}/>
    </div>
    <p style={{ color:'var(--text-2)', fontWeight:600, marginBottom:4 }}>{title}</p>
    <p style={{ color:'var(--text-3)', fontSize:'0.85rem' }}>{desc}</p>
  </div>
)

// ─────────────────────────── MAIN ────────────────────────────
const AdminDashboard = () => {
  const [user]          = useState(() => AuthService.getUser())
  const [tab, setTab]   = useState('overview')
  const [sideOpen, setSideOpen] = useState(false)
  const [stats, setStats] = useState({ totalUsers:0, totalSubjects:0, totalPYQs:0, pendingRequests:0, totalDownloads:0, approvedToday:0, rejectedToday:0, popularSubjects:[], totalMessages:0, unreadMessages:0 })
  const [pending, setPending]   = useState([])
  const [subjects, setSubjects] = useState([])
  const [users, setUsers]       = useState([])
  const [messages, setMessages] = useState([])
  const [subjectPYQs, setSubjectPYQs] = useState([])
  const [viewSubject, setViewSubject] = useState(null)
  const [confirm, setConfirm]   = useState(null)
  const [processing, setProcessing] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadForm, setUploadForm] = useState({ title:'', subjectName:'', year:new Date().getFullYear(), file:null })
  const [viewMsg, setViewMsg]   = useState(null)
  const [loading, setLoading]   = useState(true)

  const { showToast } = useToast()

  const fetchAll = useCallback(async (force = false) => {
    setLoading(true)
    try {
      if (force || tab === 'overview') {
        const [dash, cStats] = await Promise.all([
          AdminAPI.getDashboardStats(),
          ContactAPI.getContactStats(),
        ])
        setStats({ ...dash, totalMessages: cStats.stats?.totalMessages||0, unreadMessages: cStats.stats?.unreadMessages||0 })
      }
      if (force || tab === 'overview' || tab === 'requests') {
        setPending(await AdminAPI.getPendingRequests())
      }
    } catch (e) {
      if (e?.response?.status === 401) AuthService.logout()
    } finally {
      setLoading(false)
    }
    
    if (force || tab === 'subjects') { try { setSubjects(await AdminAPI.getSubjects()) } catch {} }
    if (force || tab === 'users')    { try { setUsers(await AdminAPI.getAllUsers()) } catch {} }
    if (force || tab === 'messages') { try { const r = await ContactAPI.getAllMessages(); setMessages(r.messages || []) } catch {} }
  }, [tab])

  useEffect(() => { fetchAll(false) }, [fetchAll])

  // Close sidebar on resize above 900px
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 900) setSideOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const switchTab = (id) => { setTab(id); setSideOpen(false) }

  const handleApprove = async (id) => {
    setProcessing(id + '_approve')
    try { await AdminAPI.approveRequest(id); await fetchAll(true); showToast('Request approved!') }
    catch { showToast('Failed to approve', 'error') }
    finally { setProcessing(null) }
  }
  const handleReject = async (id) => {
    setProcessing(id + '_reject')
    try { await AdminAPI.rejectRequest(id); await fetchAll(true); showToast('Request rejected') }
    catch { showToast('Failed to reject', 'error') }
    finally { setProcessing(null) }
  }
  const handleDeleteUser    = (id) => setConfirm({ title:'Delete User', description:'This will permanently remove the user account and all associated data.', action: async()=>{ await AdminAPI.deleteUser(id); await fetchAll(true); showToast('User deleted') } })
  const handleDeleteSubject = (id) => setConfirm({ title:'Delete Subject', description:'This will permanently delete the subject and ALL its PYQs. This cannot be undone.', action: async()=>{ await AdminAPI.deleteSubject(id); await fetchAll(true); showToast('Subject deleted') } })
  const handleDeletePYQ     = (id) => setConfirm({ title:'Delete PYQ', description:'This will permanently delete this question paper.', action: async()=>{ await AdminAPI.deletePYQ(id); if (viewSubject) await loadSubjectPYQs(viewSubject); await fetchAll(true); showToast('PYQ deleted') } })

  const loadSubjectPYQs = async (subject) => {
    setViewSubject(subject)
    try { const r = await fetch(`/api/pyqs/by-subject?subject=${encodeURIComponent(subject.name)}`); setSubjectPYQs(await r.json()) }
    catch { showToast('Failed to load PYQs', 'error') }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!uploadForm.file || !uploadForm.title || !uploadForm.subjectName) { showToast('Fill all fields and select a PDF', 'error'); return }
    setUploading(true)
    const fd = new FormData()
    fd.append('pdf', uploadForm.file); fd.append('title', uploadForm.title)
    fd.append('subjectName', uploadForm.subjectName); fd.append('year', uploadForm.year)
    try { await AdminAPI.uploadPYQ(fd); showToast('PYQ published!'); setUploadForm({ title:'', subjectName:'', year:new Date().getFullYear(), file:null }); await fetchAll(true) }
    catch (err) { showToast(err?.response?.data?.message || 'Upload failed', 'error') }
    finally { setUploading(false) }
  }

  const viewPDF = (url, id) => {
    const backendUrl = import.meta.env.VITE_API_URL || ''
    window.open(`${backendUrl}/api/pdf/${id||'req'}?url=${encodeURIComponent(url)}&token=${AuthService.getToken()}`, '_blank')
  }

  const handleViewMessage = async (msg) => {
    setViewMsg(msg)
    if (msg.status === 'unread') {
      try {
        await ContactAPI.updateMessage(msg._id, { status: 'read' })
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, status: 'read' } : m))
        setStats(prev => ({ ...prev, unreadMessages: Math.max(0, prev.unreadMessages - 1) }))
      } catch (err) {
        console.error('Failed to mark message as read', err)
      }
    }
  }

  // ── SIDEBAR ─────────────────────────────────────────────────
  const Sidebar = ({ mobile = false }) => (
    <aside style={{
      width: 240, minWidth: 240, background:'var(--bg-surface)',
      borderRight:'1px solid var(--border)',
      display:'flex', flexDirection:'column',
      ...(mobile ? {} : { position:'fixed', top:0, left:0, bottom:0, zIndex:100, overflowY:'auto' })
    }}>
      {/* Logo */}
      <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800, color:'#fff', boxShadow:'0 4px 12px rgba(245,158,11,0.35)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '60%', height: '60%', color: 'white' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <div>
            <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:700, fontSize:'1rem', color:'var(--text-1)' }}>Admin Panel</div>
            <div style={{ fontSize:'0.68rem', color:'var(--text-3)', marginTop:1 }}>PYQ Hub</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'10px 0' }}>
        <div style={{ padding:'8px 16px 6px', fontSize:'0.65rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Navigation</div>
        {NAV.map(item => {
          const active = tab === item.id
          const badge = item.id === 'requests' ? stats.pendingRequests : item.id === 'messages' ? stats.unreadMessages : 0
          return (
            <button key={item.id} onClick={() => switchTab(item.id)}
              style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'9px 16px', margin:'1px 8px',
                borderRadius:10, border:'none',
                background: active ? `${item.accent}14` : 'transparent',
                color: active ? item.accent : 'var(--text-2)',
                fontFamily:'Inter,sans-serif', fontSize:'0.875rem', fontWeight:500,
                cursor:'pointer', width:'calc(100% - 16px)', textAlign:'left',
                transition:'all 0.15s',
                borderLeft: active ? `2px solid ${item.accent}` : '2px solid transparent',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='var(--text-1)' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-2)' } }}
            >
              <item.Icon size={15}/>
              <span style={{ flex:1 }}>{item.label}</span>
              {badge > 0 && (
                <span style={{ background:`${item.accent}20`, color:item.accent, border:`1px solid ${item.accent}35`, borderRadius:100, fontSize:'0.68rem', fontWeight:700, padding:'1px 7px', lineHeight:'18px' }}>{badge}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* User section */}
      <div style={{ borderTop:'1px solid var(--border)', padding:'12px 8px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', marginBottom:4 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:700, color:'#fff', flexShrink:0 }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--text-1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
            <div style={{ fontSize:'0.7rem', color:'var(--text-3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={() => AuthService.logout()}
          style={{ display:'flex', alignItems:'center', gap:8, width:'calc(100% - 0px)', padding:'8px 12px', margin:'0', borderRadius:8, border:'none', background:'transparent', color:'#f87171', fontSize:'0.82rem', fontWeight:500, cursor:'pointer', transition:'all 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}
        >
          <I.Logout size={14}/> Sign Out
        </button>
      </div>
    </aside>
  )

  // ── MOBILE TOPBAR ───────────────────────────────────────────
  const MobileTopBar = () => (
    <div style={{ display:'none', position:'sticky', top:0, zIndex:200, background:'var(--bg-surface)', borderBottom:'1px solid var(--border)', padding:'12px 16px', alignItems:'center', justifyContent:'space-between' }} className="admin-mobile-topbar">
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#fff' }}>A</div>
        <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:700, fontSize:'0.95rem', color:'var(--text-1)' }}>Admin Panel</span>
      </div>
      <button onClick={() => setSideOpen(true)}
        style={{ display:'flex', alignItems:'center', justifyContent:'center', width:36, height:36, borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-card)', color:'var(--text-2)', cursor:'pointer' }}>
        <I.Menu size={18}/>
      </button>
    </div>
  )

  // ── PAGE CONTENT ────────────────────────────────────────────
  const renderContent = () => {
    switch (tab) {

      // ── Overview ──────────────────────────────────────────
      case 'overview': {
        const cards = [
          { label:'Question Papers', value:stats.totalPYQs,       Icon:I.File,     accent:'#818cf8' },
          { label:'Subjects',        value:stats.totalSubjects,    Icon:I.Book,     accent:'#22d3ee' },
          { label:'Students',        value:stats.totalUsers,       Icon:I.Users,    accent:'#4ade80' },
          { label:'Total Downloads', value:stats.totalDownloads,   Icon:I.Download, accent:'#a78bfa' },
          { label:'Pending Review',  value:stats.pendingRequests,  Icon:I.Clock,    accent:'#facc15' },
          { label:'Approved Today',  value:stats.approvedToday,    Icon:I.Check,    accent:'#34d399' },
          { label:'Rejected Today',  value:stats.rejectedToday,    Icon:I.X,        accent:'#f87171' },
          { label:'Messages',        value:stats.totalMessages,    Icon:I.Mail,     accent:'#fb923c' },
        ]
        return (
          <div>
            <SectionHeader
              title={`Good ${new Date().getHours()<12?'morning':new Date().getHours()<18?'afternoon':'evening'}, ${user?.name?.split(' ')[0]} 👋`}
              subtitle="Here's what's happening on PYQ Hub today"
              action={
                <button className="btn btn-ghost btn-sm" onClick={fetchAll} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <I.Refresh size={13}/> Refresh
                </button>
              }
            />

            {/* Stat cards grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(170px, 1fr))', gap:14, marginBottom:32 }}>
              {cards.map((c, i) => <StatCard key={c.label} {...c} delay={i * 0.04}/>)}
            </div>

            {/* Quick actions */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Quick Actions</div>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {[
                  { label:'Review Pending', tab:'requests', Icon:I.Clock, color:'#facc15', badge:stats.pendingRequests },
                  { label:'Upload Paper',   tab:'upload',   Icon:I.Upload, color:'#4ade80' },
                  { label:'Manage Subjects',tab:'subjects', Icon:I.Book,   color:'#22d3ee' },
                  { label:'View Users',     tab:'users',    Icon:I.Users,  color:'#a78bfa' },
                ].map(qa => (
                  <button key={qa.tab} onClick={() => switchTab(qa.tab)}
                    style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 16px', border:`1px solid ${qa.color}25`, borderRadius:10, background:`${qa.color}0d`, color:qa.color, fontSize:'0.85rem', fontWeight:600, cursor:'pointer', transition:'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background=`${qa.color}1a`; e.currentTarget.style.borderColor=`${qa.color}45` }}
                    onMouseLeave={e => { e.currentTarget.style.background=`${qa.color}0d`; e.currentTarget.style.borderColor=`${qa.color}25` }}
                  >
                    <qa.Icon size={14}/>
                    {qa.label}
                    {qa.badge > 0 && <span style={{ background:`${qa.color}25`, borderRadius:100, fontSize:'0.68rem', padding:'0 6px' }}>{qa.badge}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular subjects table */}
            {stats.popularSubjects?.length > 0 && (
              <div>
                <div style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Top Subjects</div>
                <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' }}>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead>
                        <tr style={{ background:'var(--bg-elevated)' }}>
                          <th style={{ padding:'11px 16px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Subject</th>
                          <th style={{ padding:'11px 16px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Papers</th>
                          <th style={{ padding:'11px 16px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Downloads</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.popularSubjects.map((s, i) => (
                          <tr key={i} style={{ borderTop:'1px solid var(--border)' }}>
                            <td style={{ padding:'12px 16px', color:'var(--text-1)', fontWeight:500, fontSize:'0.875rem' }}>{s.name}</td>
                            <td style={{ padding:'12px 16px', color:'var(--text-2)', fontSize:'0.875rem' }}>{s.pyqCount}</td>
                            <td style={{ padding:'12px 16px', color:'var(--text-2)', fontSize:'0.875rem' }}>{s.totalDownloads}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      }

      // ── Pending Requests ─────────────────────────────────
      case 'requests':
        return (
          <div>
            <SectionHeader title="Pending Requests" subtitle={`${pending.length} upload${pending.length !== 1 ? 's' : ''} awaiting review`}/>
            {pending.length === 0
              ? <Empty icon={I.Check} title="All clear!" desc="No pending requests right now. Check back later."/>
              : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {pending.map((req, i) => (
                    <motion.div key={req._id}
                      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
                      style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'18px 20px' }}
                    >
                      <div style={{ display:'flex', alignItems:'flex-start', gap:14, flexWrap:'wrap' }}>
                        <div style={{ width:40, height:40, minWidth:40, borderRadius:10, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--blue-lt)' }}>
                          <I.File size={16}/>
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontWeight:600, color:'var(--text-1)', fontSize:'0.9rem', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{req.title}</div>
                          <div style={{ fontSize:'0.78rem', color:'var(--text-3)', display:'flex', gap:12, flexWrap:'wrap' }}>
                            <span>📚 {req.subjectName}</span>
                            <span>📅 {req.year}</span>
                            {req.uploadedBy && <span>👤 {req.uploadedBy?.name || 'Unknown'}</span>}
                          </div>
                        </div>
                        <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => viewPDF(req.fileUrl, 'req')}>
                            <I.Eye size={13}/> Preview
                          </button>
                          <button className="btn btn-sm" disabled={!!processing} onClick={() => handleApprove(req._id)}
                            style={{ background:'rgba(34,197,94,0.12)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.25)', opacity: processing ? 0.6 : 1 }}>
                            {processing === req._id+'_approve' ? <div className="spinner" style={{ width:12,height:12,borderWidth:1.5 }}/> : <I.Check size={13}/>} Approve
                          </button>
                          <button className="btn btn-sm" disabled={!!processing} onClick={() => handleReject(req._id)}
                            style={{ background:'rgba(239,68,68,0.10)', color:'#f87171', border:'1px solid rgba(239,68,68,0.22)', opacity: processing ? 0.6 : 1 }}>
                            {processing === req._id+'_reject' ? <div className="spinner" style={{ width:12,height:12,borderWidth:1.5 }}/> : <I.X size={13}/>} Reject
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            }
          </div>
        )

      // ── Upload PYQ ───────────────────────────────────────
      case 'upload':
        return (
          <div style={{ maxWidth:580 }}>
            <SectionHeader title="Upload PYQ" subtitle="Directly publish a verified question paper to the platform"/>
            <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:28 }}>
              <form onSubmit={handleUpload}>
                <div className="form-group">
                  <label className="form-label">Paper Title</label>
                  <input className="form-input" placeholder="e.g. Mathematics End-Term 2024" value={uploadForm.title} onChange={e => setUploadForm({...uploadForm, title:e.target.value})} required/>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 140px', gap:14 }}>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input className="form-input" placeholder="e.g. Mathematics" list="sub-list" value={uploadForm.subjectName} onChange={e => setUploadForm({...uploadForm, subjectName:e.target.value})} required/>
                    <datalist id="sub-list">{subjects.map(s => <option key={s._id} value={s.name}/>)}</datalist>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <input className="form-input" type="number" min="2000" max={new Date().getFullYear()} value={uploadForm.year} onChange={e => setUploadForm({...uploadForm, year:e.target.value})} required/>
                  </div>
                </div>

                {/* Drop zone */}
                <div className="form-group" style={{ marginBottom:24 }}>
                  <label className="form-label">PDF File</label>
                  <div
                    onClick={() => document.getElementById('admin-pdf').click()}
                    style={{
                      border:`2px dashed ${uploadForm.file ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`,
                      borderRadius:12, padding:'32px 20px', textAlign:'center', cursor:'pointer',
                      background: uploadForm.file ? 'rgba(99,102,241,0.05)' : 'var(--bg-elevated)',
                      transition:'all 0.2s',
                    }}
                    onMouseEnter={e => { if (!uploadForm.file) { e.currentTarget.style.borderColor='rgba(99,102,241,0.4)'; e.currentTarget.style.background='rgba(99,102,241,0.04)' } }}
                    onMouseLeave={e => { if (!uploadForm.file) { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--bg-elevated)' } }}
                  >
                    <input id="admin-pdf" type="file" accept=".pdf" style={{ display:'none' }} onChange={e => setUploadForm({...uploadForm, file:e.target.files[0]})}/>
                    <div style={{ color: uploadForm.file ? 'var(--blue-lt)' : 'var(--text-3)', marginBottom:10, display:'flex', justifyContent:'center' }}>
                      <I.Upload size={28}/>
                    </div>
                    {uploadForm.file
                      ? <div>
                          <div style={{ fontSize:'0.875rem', fontWeight:600, color:'var(--text-1)', marginBottom:4 }}>{uploadForm.file.name}</div>
                          <div style={{ fontSize:'0.75rem', color:'var(--text-3)' }}>{(uploadForm.file.size/1024/1024).toFixed(2)} MB</div>
                        </div>
                      : <div>
                          <div style={{ fontSize:'0.875rem', color:'var(--text-2)', marginBottom:4 }}>Click to select PDF</div>
                          <div style={{ fontSize:'0.75rem', color:'var(--text-3)' }}>Max 50MB</div>
                        </div>
                    }
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:13 }} disabled={uploading}>
                  {uploading ? <><div className="spinner" style={{ width:15,height:15,borderWidth:2 }}/> Uploading…</> : <><I.Upload size={15}/> Publish PYQ</>}
                </button>
              </form>
            </div>
          </div>
        )

      // ── Subjects ─────────────────────────────────────────
      case 'subjects':
        return (
          <div>
            <SectionHeader
              title={viewSubject ? viewSubject.name : 'Subjects'}
              subtitle={viewSubject ? `${subjectPYQs.length} paper${subjectPYQs.length!==1?'s':''}` : `${subjects.length} subjects`}
              action={viewSubject && (
                <button className="btn btn-ghost btn-sm" onClick={() => { setViewSubject(null); setSubjectPYQs([]) }} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <I.ChevL size={13}/> All Subjects
                </button>
              )}
            />
            {!viewSubject ? (
              <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' }}>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead><tr style={{ background:'var(--bg-elevated)' }}>
                      <th style={{ padding:'11px 16px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Subject Name</th>
                      <th style={{ padding:'11px 16px', textAlign:'right', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Actions</th>
                    </tr></thead>
                    <tbody>
                      {subjects.map((sub, i) => (
                        <tr key={sub._id} style={{ borderTop:'1px solid var(--border)' }}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background='transparent'}
                        >
                          <td style={{ padding:'13px 16px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                              <div style={{ width:28, height:28, borderRadius:8, background:'rgba(34,211,238,0.1)', border:'1px solid rgba(34,211,238,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#22d3ee', flexShrink:0 }}>
                                <I.Book size={12}/>
                              </div>
                              <span style={{ color:'var(--text-1)', fontWeight:500, fontSize:'0.875rem' }}>{sub.name}</span>
                            </div>
                          </td>
                          <td style={{ padding:'13px 16px', textAlign:'right' }}>
                            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                              <button className="btn btn-ghost btn-sm" onClick={() => loadSubjectPYQs(sub)}><I.Eye size={13}/> PYQs</button>
                              <button className="btn btn-sm" onClick={() => handleDeleteSubject(sub._id)}
                                style={{ background:'rgba(239,68,68,0.09)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)' }}>
                                <I.Trash size={13}/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              subjectPYQs.length === 0
                ? <Empty icon={I.File} title="No papers yet" desc="This subject doesn't have any question papers yet."/>
                : <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' }}>
                    <div style={{ overflowX:'auto' }}>
                      <table style={{ width:'100%', borderCollapse:'collapse' }}>
                        <thead><tr style={{ background:'var(--bg-elevated)' }}>
                          <th style={{ padding:'11px 16px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Title</th>
                          <th style={{ padding:'11px 16px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Year</th>
                          <th style={{ padding:'11px 16px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>DLs</th>
                          <th style={{ padding:'11px 16px', textAlign:'right', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Actions</th>
                        </tr></thead>
                        <tbody>
                          {subjectPYQs.map(pyq => (
                            <tr key={pyq._id} style={{ borderTop:'1px solid var(--border)' }}
                              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                              onMouseLeave={e => e.currentTarget.style.background='transparent'}
                            >
                              <td style={{ padding:'12px 16px', color:'var(--text-1)', fontWeight:500, fontSize:'0.875rem', maxWidth:240, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{pyq.title}</td>
                              <td style={{ padding:'12px 16px', color:'var(--text-2)', fontSize:'0.875rem' }}>{pyq.year}</td>
                              <td style={{ padding:'12px 16px', color:'var(--text-2)', fontSize:'0.875rem' }}>{pyq.downloadCount||0}</td>
                              <td style={{ padding:'12px 16px', textAlign:'right' }}>
                                <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                                  <button className="btn btn-ghost btn-sm" onClick={() => viewPDF(pyq.fileUrl, pyq._id)}><I.Eye size={13}/> View</button>
                                  <button className="btn btn-sm" onClick={() => handleDeletePYQ(pyq._id)}
                                    style={{ background:'rgba(239,68,68,0.09)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)' }}>
                                    <I.Trash size={13}/>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
            )}
          </div>
        )

      // ── Users ────────────────────────────────────────────
      case 'users':
        return (
          <div>
            <SectionHeader title="Students" subtitle={`${users.length} registered accounts`}/>
            {users.length === 0
              ? <Empty icon={I.Users} title="No users yet" desc="Students will appear here once they sign up."/>
              : <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' }}>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead><tr style={{ background:'var(--bg-elevated)' }}>
                        <th style={{ padding:'11px 16px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Name</th>
                        <th style={{ padding:'11px 16px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Email</th>
                        <th style={{ padding:'11px 16px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Joined</th>
                        <th style={{ padding:'11px 16px', textAlign:'right', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Action</th>
                      </tr></thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u._id} style={{ borderTop:'1px solid var(--border)' }}
                            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                            onMouseLeave={e => e.currentTarget.style.background='transparent'}
                          >
                            <td style={{ padding:'12px 16px' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:700, color:'#fff', flexShrink:0 }}>
                                  {u.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <span style={{ color:'var(--text-1)', fontWeight:500, fontSize:'0.875rem' }}>{u.name}</span>
                              </div>
                            </td>
                            <td style={{ padding:'12px 16px', color:'var(--text-2)', fontSize:'0.875rem' }}>{u.email}</td>
                            <td style={{ padding:'12px 16px', color:'var(--text-3)', fontSize:'0.8rem' }}>{new Date(u.createdAt).toLocaleDateString('en-IN',{ day:'numeric', month:'short', year:'numeric' })}</td>
                            <td style={{ padding:'12px 16px', textAlign:'right' }}>
                              <button className="btn btn-sm" onClick={() => handleDeleteUser(u._id)}
                                style={{ background:'rgba(239,68,68,0.09)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)' }}>
                                <I.Trash size={13}/>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            }
          </div>
        )

      // ── Messages ─────────────────────────────────────────
      case 'messages':
        return (
          <div>
            <SectionHeader title="Messages" subtitle={`${stats.unreadMessages} unread · ${stats.totalMessages} total`}/>
            {messages.length === 0
              ? <Empty icon={I.Mail} title="No messages yet" desc="Contact form messages will appear here."/>
              : <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' }}>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead><tr style={{ background:'var(--bg-elevated)' }}>
                        <th style={{ padding:'11px 16px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>From</th>
                        <th style={{ padding:'11px 16px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Subject</th>
                        <th style={{ padding:'11px 16px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Status</th>
                        <th style={{ padding:'11px 16px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Date</th>
                        <th style={{ padding:'11px 16px', textAlign:'right', fontSize:'0.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>View</th>
                      </tr></thead>
                      <tbody>
                        {messages.map(msg => (
                          <tr key={msg._id} style={{ borderTop:'1px solid var(--border)', cursor:'pointer' }}
                            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                            onMouseLeave={e => e.currentTarget.style.background='transparent'}
                            onClick={() => handleViewMessage(msg)}
                          >
                            <td style={{ padding:'12px 16px' }}>
                              <div style={{ fontWeight: msg.status === 'unread' ? 700 : 500, color:'var(--text-1)', fontSize:'0.875rem' }}>{msg.name}</div>
                              <div style={{ fontSize:'0.75rem', color:'var(--text-3)' }}>{msg.email}</div>
                            </td>
                            <td style={{ padding:'12px 16px', color:'var(--text-2)', fontSize:'0.875rem', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{msg.subject || '(no subject)'}</td>
                            <td style={{ padding:'12px 16px' }}>
                              <span style={{
                                display:'inline-flex', alignItems:'center', gap:5,
                                padding:'3px 10px', borderRadius:100, fontSize:'0.72rem', fontWeight:600,
                                background: msg.status==='unread' ? 'rgba(250,204,21,0.12)' : msg.status==='replied' ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.06)',
                                color: msg.status==='unread' ? '#facc15' : msg.status==='replied' ? '#4ade80' : 'var(--text-3)',
                                border: `1px solid ${msg.status==='unread' ? 'rgba(250,204,21,0.25)' : msg.status==='replied' ? 'rgba(74,222,128,0.25)' : 'var(--border)'}`,
                              }}>
                                {msg.status || 'unread'}
                              </span>
                            </td>
                            <td style={{ padding:'12px 16px', color:'var(--text-3)', fontSize:'0.8rem' }}>{new Date(msg.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding:'12px 16px', textAlign:'right' }}>
                              <button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation();handleViewMessage(msg)}}><I.Eye size={13}/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            }

            {/* Message Modal */}
            <AnimatePresence>
              {viewMsg && (
                <motion.div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', zIndex:3000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  onClick={() => setViewMsg(null)}>
                  <motion.div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:20, padding:28, width:'100%', maxWidth:520, maxHeight:'80vh', overflowY:'auto' }}
                    initial={{ scale:0.94, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.94, y:8 }}
                    transition={{ type:'spring', stiffness:400, damping:30 }}
                    onClick={e=>e.stopPropagation()}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
                      <div>
                        <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:700, color:'var(--text-1)', marginBottom:6, fontSize:'1.05rem' }}>{viewMsg.subject || '(no subject)'}</h3>
                        <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                          <span style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-1)' }}>{viewMsg.name}</span>
                          <span style={{ color:'var(--text-3)', fontSize:'0.75rem' }}>·</span>
                          <span style={{ fontSize:'0.8rem', color:'var(--text-3)' }}>{viewMsg.email}</span>
                        </div>
                      </div>
                      <button className="btn btn-ghost btn-sm" onClick={() => setViewMsg(null)} style={{ padding:'6px 8px', flexShrink:0 }}><I.X size={15}/></button>
                    </div>
                    <div style={{ background:'var(--bg-elevated)', borderRadius:10, padding:'14px 16px', fontSize:'0.9rem', color:'var(--text-2)', lineHeight:1.75, marginBottom:16, whiteSpace:'pre-wrap' }}>
                      {viewMsg.message}
                    </div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-3)' }}>
                      Received {new Date(viewMsg.createdAt).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' })}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )

      default: return null
    }
  }

  // ── RENDER ──────────────────────────────────────────────────
  return (
    <>
      {/* Inject responsive CSS */}
      <style>{`
        .admin-shell { display: flex; min-height: 100vh; background: var(--bg-base); }
        .admin-desktop-sidebar { display: flex; }
        .admin-mobile-topbar { display: none !important; }
        .admin-content { margin-left: 240px; flex: 1; padding: 32px; min-height: 100vh; }

        @media (max-width: 900px) {
          .admin-desktop-sidebar { display: none !important; }
          .admin-mobile-topbar { display: flex !important; }
          .admin-content { margin-left: 0 !important; padding: 20px 16px; }
        }
        @media (max-width: 480px) {
          .admin-content { padding: 16px 12px; }
        }
      `}</style>

      <div className="admin-shell">
        {/* Desktop sidebar */}
        <div className="admin-desktop-sidebar">
          <Sidebar/>
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sideOpen && (
            <>
              <motion.div
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                onClick={() => setSideOpen(false)}
                style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', zIndex:300 }}
              />
              <motion.div
                initial={{ x:-260 }} animate={{ x:0 }} exit={{ x:-260 }}
                transition={{ type:'spring', stiffness:380, damping:32 }}
                style={{ position:'fixed', top:0, left:0, bottom:0, zIndex:400, width:240, overflowY:'auto' }}
              >
                <Sidebar mobile/>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main area */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
          {/* Mobile top bar */}
          <div className="admin-mobile-topbar" style={{
            position:'sticky', top:0, zIndex:200,
            background:'var(--bg-surface)', borderBottom:'1px solid var(--border)',
            padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#fff' }}>A</div>
              <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:700, fontSize:'0.95rem', color:'var(--text-1)' }}>
                {NAV.find(n => n.id === tab)?.label || 'Admin Panel'}
              </span>
            </div>
            <button onClick={() => setSideOpen(true)}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', width:36, height:36, borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-card)', color:'var(--text-2)', cursor:'pointer' }}>
              <I.Menu size={18}/>
            </button>
          </div>

          {/* Page content */}
          <div className="admin-content">
            <AnimatePresence mode="wait">
              <motion.div key={tab}
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
                transition={{ duration:0.2, ease:[0.4,0,0.2,1] }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!confirm}
        title={confirm?.title}
        description={confirm?.description}
        onConfirm={async () => { await confirm.action(); setConfirm(null) }}
        onCancel={() => setConfirm(null)}
      />
    </>
  )
}

export default AdminDashboard
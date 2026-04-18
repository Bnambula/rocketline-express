import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
const P = { fontFamily:"'Sora',sans-serif" }

const NAV = [
  { label:'Home',    to:'/',        icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label:'Book',    to:'/book',    icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
  { label:'Parcels', to:'/parcels', icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
  { label:'Account', to:'/account', icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
]

export default function MobileBottomNav() {
  const navigate  = useNavigate()
  const location  = useLocation()
  return (
    <div className="mobile-nav">
      {NAV.map(n => {
        const active = location.pathname === n.to
        return (
          <button key={n.to} onClick={() => navigate(n.to)}
            style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'6px 0', color:active?'var(--blue)':'var(--text-muted)', background:'none', border:'none', cursor:'pointer', transition:'color .2s' }}>
            {n.icon}
            <span style={{ fontSize:10, ...P, fontWeight:700 }}>{n.label}</span>
            {active && <div style={{ width:20, height:2, borderRadius:1, background:'var(--blue)', marginTop:1 }}/>}
          </button>
        )
      })}
    </div>
  )
}

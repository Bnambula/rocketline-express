import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const ITEMS = [
  { label:'Search', to:'/', icon:<svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> },
  { label:'Bookings', to:'/book', icon:<svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
  { label:'Parcels', to:'/parcels', icon:<svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> },
  { label:'Account', to:'/admin', icon:<svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
]

export default function MobileBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  // Only show on passenger-facing pages
  const hiddenOn = ['/admin','/operator']
  if (hiddenOn.some(p => location.pathname.startsWith(p))) return null

  return (
    <div className="mobile-nav show-mobile">
      {ITEMS.map(item => {
        const active = location.pathname === item.to
        return (
          <button key={item.label} onClick={() => navigate(item.to)} className={`mobile-nav-item${active?' active':''}`}
            style={{ color: active ? 'var(--blue)' : 'var(--gray-text)' }}>
            <span style={{ color: active ? 'var(--blue)' : 'var(--gray-text)', display:'flex' }}>{item.icon}</span>
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

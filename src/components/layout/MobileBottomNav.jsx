import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function MobileBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    { label: 'Search', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>, to: '/' },
    { label: 'Bookings', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>, to: '/book' },
    { label: 'Parcels', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>, to: '/parcels' },
    { label: 'Account', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, to: '/admin' },
  ]

  return (
    <div className="mobile-nav hide-desktop">
      {items.map(item => (
        <button key={item.label} onClick={() => navigate(item.to)}
          className={`mobile-nav-item${location.pathname === item.to ? ' active' : ''}`}>
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  )
}

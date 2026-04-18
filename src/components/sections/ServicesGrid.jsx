import React from 'react'
import { useNavigate } from 'react-router-dom'
const P = { fontFamily:"'Sora',sans-serif" }
const I = { fontFamily:"'Inter',sans-serif" }

const SERVICES = [
  { icon:<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, color:'#0B3D91', bg:'#dbeafe', title:'Seat Booking', desc:'Real-time seat selection on 14-seater taxis and 67-seater coaches. Guaranteed boarding.', cta:'Book Now', to:'/book' },
  { icon:<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>, color:'#15803d', bg:'#dcfce7', title:'Parcel Delivery', desc:'From envelope to heavy cargo. GPS tracked on every bus. Same-day dispatch to 20+ cities.', cta:'Send Parcel', to:'/parcels' },
  { icon:<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="1" y="3" width="22" height="16" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8h10M7 11h6"/></svg>, color:'#7c3aed', bg:'#ede9fe', title:'Private Hire', desc:'Charter a full bus for groups, corporates, or events. Wedding, school trip, team away day.', cta:'Get Quote', to:'/book?type=hire' },
  { icon:<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, color:'#d97706', bg:'#fef3c7', title:'Group Bookings', desc:'10+ passengers? Lock seats for your whole group at once. One payment, group QR code.', cta:'Book Group', to:'/book?type=group' },
  { icon:<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>, color:'#0891b2', bg:'#e0f2fe', title:'Travel Insurance', desc:'Optional add-on covering accidents, delays, and lost luggage. Underwritten by UAP Old Mutual.', cta:'Add Cover', to:'/book' },
  { icon:<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>, color:'#dc2626', bg:'#fee2e2', title:'Advance Booking', desc:'Book up to 30 days ahead. Flexible cancellation up to 24hrs before departure. Price lock guarantee.', cta:'Advance Book', to:'/book?type=advance' },
]

export default function ServicesGrid() {
  const navigate = useNavigate()
  return (
    <section style={{ background:'var(--surface)', padding:'80px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <div className="section-label" style={{ margin:'0 auto 14px' }}>What We Offer</div>
          <h2 className="section-title">All Your Travel <span>Needs</span></h2>
          <p className="section-sub" style={{ margin:'0 auto' }}>One platform for every journey, parcel, and transport need across Uganda.</p>
        </div>
        <div className="resp-grid">
          {SERVICES.map((s, i) => (
            <div key={i} className="service-card" style={{ cursor:'pointer' }}
              onClick={() => navigate(s.to)}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='var(--sh-lg)'; e.currentTarget.style.borderColor=s.color }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; e.currentTarget.style.borderColor='var(--border)' }}>
              <div style={{ width:52, height:52, borderRadius:14, background:s.bg, color:s.color, display:'flex', alignItems:'center', justifyContent:'center' }}>{s.icon}</div>
              <div>
                <h3 style={{ ...P, fontWeight:700, fontSize:17, marginBottom:6, color:'var(--text-primary)' }}>{s.title}</h3>
                <p style={{ fontSize:13, color:'var(--text-secondary)', ...I, lineHeight:1.7 }}>{s.desc}</p>
              </div>
              <button style={{ marginTop:'auto', display:'inline-flex', alignItems:'center', gap:6, ...P, fontWeight:700, fontSize:13, color:s.color, background:'none', border:'none', cursor:'pointer', padding:0 }}>
                {s.cta}
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

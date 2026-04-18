import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../hooks/useStore'

const P = { fontFamily:"'Sora',sans-serif" }
const I = { fontFamily:"'Inter',sans-serif" }

const AMENITY_ICONS = {
  ac:   <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>,
  wifi: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>,
  usb:  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v14M5 7l7-5 7 5M9 11H5v4l7 4 7-4v-4h-4"/></svg>,
}

function pct(booked, total) { return Math.round(booked / total * 100) }
function left(booked, total) { return total - booked }
function urgency(booked, total) {
  const p = pct(booked, total)
  if (p >= 85) return { text:'Almost Full', color:'#dc2626', bg:'#fee2e2' }
  if (p >= 60) return { text:'Filling Fast', color:'#d97706', bg:'#fef3c7' }
  return { text:'Available', color:'#16a34a', bg:'#dcfce7' }
}

export default function LeavingSoonSection() {
  const navigate = useNavigate()
  const { state } = useAdminStore()
  const trips = (state.trips || []).filter(t => t.status === 'APPROVED').slice(0, 8)

  if (!trips.length) return null

  return (
    <section style={{ background:'var(--off-white)', padding:'64px 0' }}>
      <div className="container">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28, flexWrap:'wrap', gap:12 }}>
          <div>
            <div className="section-label">
              <div className="live-dot"/>
              Leaving Soon
            </div>
            <h2 className="section-title" style={{ margin:0 }}>Today's <span>Departures</span></h2>
          </div>
          <button onClick={() => navigate('/book')} className="btn btn-outline btn-sm">View All Routes</button>
        </div>

        <div className="scroll-x" style={{ display:'flex', gap:14, paddingBottom:8 }}>
          {trips.map(t => {
            const u = urgency(t.seats_booked, t.seats_total)
            return (
              <div key={t.id} className="trip-card" style={{ minWidth:290, flexShrink:0, borderLeft:`4px solid ${u.color}` }}
                onClick={() => navigate(`/book?trip=${t.id}&step=seats`)}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                  <div>
                    <div style={{ ...P, fontWeight:800, fontSize:16, marginBottom:2 }}>{t.from} to {t.to}</div>
                    <div style={{ fontSize:12, color:'var(--text-secondary)', ...I }}>{t.operator_name}</div>
                  </div>
                  <span style={{ background:u.bg, color:u.color, padding:'3px 10px', borderRadius:'var(--r-full)', fontSize:11, ...P, fontWeight:700, flexShrink:0 }}>{u.text}</span>
                </div>

                <div style={{ display:'flex', gap:12, marginBottom:12, alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:10, color:'var(--text-muted)', ...I }}>Departs</div>
                    <div style={{ ...P, fontWeight:700, fontSize:18, color:'var(--blue)' }}>{t.departs}</div>
                  </div>
                  <div style={{ flex:1, display:'flex', alignItems:'center' }}>
                    <div style={{ flex:1, height:1, borderTop:'2px dashed var(--border)' }}/>
                    <svg width="16" height="16" fill="none" stroke="var(--blue)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0, margin:'0 4px' }}><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    <div style={{ flex:1, height:1, borderTop:'2px dashed var(--border)' }}/>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:10, color:'var(--text-muted)', ...I }}>Seats left</div>
                    <div style={{ ...P, fontWeight:700, fontSize:18, color:u.color }}>{left(t.seats_booked, t.seats_total)}</div>
                  </div>
                </div>

                <div style={{ marginBottom:10 }}>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width:`${pct(t.seats_booked, t.seats_total)}%`, background:u.color }}/>
                  </div>
                  <div style={{ fontSize:10, color:'var(--text-muted)', ...I, marginTop:4 }}>{t.seats_booked}/{t.seats_total} seats booked</div>
                </div>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    {(t.amenities || []).slice(0,3).map(a => (
                      <span key={a} style={{ display:'flex', alignItems:'center', gap:3, fontSize:10, color:'var(--text-secondary)', ...I }}>
                        {AMENITY_ICONS[a] || null} {a.toUpperCase()}
                      </span>
                    ))}
                  </div>
                  <div style={{ ...P, fontWeight:800, fontSize:18, color:'var(--blue)' }}>UGX {(t.price||0).toLocaleString()}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

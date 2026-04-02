import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { operators } from '../../data'

const amenityIcon = { wifi:'📶', ac:'❄️', usb:'🔌' }

export default function AvailableTripsSection() {
  const [sortBy, setSortBy] = useState('price')
  const [showAlert, setShowAlert] = useState(true)
  const navigate = useNavigate()

  const sorted = [...operators].sort((a,b) => {
    if(sortBy==='price') return a.price - b.price
    if(sortBy==='rating') return b.rating - a.rating
    if(sortBy==='time') return a.departureTime.localeCompare(b.departureTime)
    return 0
  })

  return (
    <section style={{ background:'var(--gray-light)', padding:'80px 0' }}>
      <div className="container">
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:32, flexWrap:'wrap', gap:16 }}>
          <div>
            <div className="section-label">Live Results</div>
            <h2 className="section-title">Available <span>Trips</span></h2>
            <p className="section-sub">Kampala → Mbale · Fri, 12 May 2026 · 10:00 AM</p>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
            <span style={{ fontSize:13, color:'var(--gray-text)', fontFamily:'var(--font-head)', fontWeight:600 }}>Sort:</span>
            {['price','rating','time'].map(s => (
              <button key={s} onClick={() => setSortBy(s)} style={{
                padding:'7px 16px', borderRadius:20, border:'1.5px solid',
                borderColor: sortBy===s ? 'var(--blue)' : 'var(--gray-mid)',
                background: sortBy===s ? 'var(--blue)' : 'var(--white)',
                color: sortBy===s ? 'var(--white)' : 'var(--dark)',
                fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, cursor:'pointer', textTransform:'capitalize'
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Alert Banner */}
        {showAlert && (
          <div style={{ background:'linear-gradient(135deg,#fff3cd,#ffeaa7)', border:'1px solid #f59e0b', borderRadius:12, padding:'14px 20px', marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:18 }}>🔔</span>
              <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:14, color:'#92400e' }}>High demand! Only 2–5 seats left on most operators for this route.</span>
            </div>
            <button onClick={() => setShowAlert(false)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:'#92400e', lineHeight:1 }}>✕</button>
          </div>
        )}

        {/* Trip Cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {sorted.map(op => (
            <div key={op.id} style={{
              background:'var(--white)', borderRadius:16, padding:20,
              boxShadow:'var(--shadow-sm)', border:'1px solid var(--gray-mid)',
              display:'grid', gridTemplateColumns:'auto 1fr auto auto', gap:20, alignItems:'center',
              transition:'all 0.2s', opacity: op.full ? 0.7 : 1
            }}
            onMouseEnter={e=>{if(!op.full)e.currentTarget.style.boxShadow='var(--shadow-lg)';e.currentTarget.style.transform='translateY(-2px)'}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow-sm)';e.currentTarget.style.transform='none'}}>

              {/* Operator Logo */}
              <div style={{ width:54, height:54, borderRadius:14, background:`${op.color}18`, border:`2px solid ${op.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:900, fontSize:18, color:op.color }}>
                {op.shortName}
              </div>

              {/* Info */}
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16 }}>{op.name}</span>
                  <span style={{ fontSize:11, color:'var(--gray-text)', background:'var(--gray-light)', padding:'2px 8px', borderRadius:10 }}>{op.plate}</span>
                  <span style={{ fontSize:11, color:'var(--gray-text)' }}>{op.type}</span>
                  {op.full && <span style={{ background:'#fee2e2', color:'#dc2626', padding:'3px 10px', borderRadius:10, fontSize:11, fontFamily:'var(--font-head)', fontWeight:700 }}>FULL</span>}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <span style={{ color:'var(--gold)', fontSize:13 }}>★</span>
                    <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>{op.rating}</span>
                    <span style={{ fontSize:12, color:'var(--gray-text)' }}>({op.reviews})</span>
                  </div>
                  <div style={{ display:'flex', gap:4 }}>
                    {op.amenities.map(a => <span key={a} title={a} style={{ fontSize:14 }}>{amenityIcon[a]}</span>)}
                  </div>
                  {op.seatsLeft > 0 && op.seatsLeft <= 5 && (
                    <span style={{ background:'#fff3cd', color:'#92400e', padding:'3px 10px', borderRadius:10, fontSize:11, fontFamily:'var(--font-head)', fontWeight:700 }}>
                      ⚠️ Only {op.seatsLeft} seats left
                    </span>
                  )}
                </div>
              </div>

              {/* Time + Price */}
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:22, color:'var(--blue)' }}>
                  UGX {op.price.toLocaleString()}
                </div>
                <div style={{ color:'var(--gray-text)', fontSize:13 }}>Departs {op.departureTime}</div>
                <div style={{ fontSize:12, color:'var(--gray-text)', marginTop:2 }}>{op.seatsLeft > 0 ? `${op.seatsLeft} seats left` : 'Fully booked'}</div>
              </div>

              {/* CTA */}
              <div>
                {op.full ? (
                  <button onClick={() => navigate('/book')} style={{ padding:'10px 20px', borderRadius:20, background:'var(--gray-light)', color:'var(--gray-text)', border:'none', fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, cursor:'pointer' }}>View</button>
                ) : (
                  <button onClick={() => navigate(`/book?operator=${op.id}`)} style={{ padding:'10px 20px', borderRadius:20, background:'var(--gold)', color:'var(--blue)', border:'none', fontFamily:'var(--font-head)', fontWeight:800, fontSize:13, cursor:'pointer', boxShadow:'0 2px 12px rgba(255,199,44,0.35)', transition:'all 0.2s' }}
                    onMouseEnter={e=>{e.target.style.transform='translateY(-1px)';e.target.style.boxShadow='0 4px 16px rgba(255,199,44,0.5)'}}
                    onMouseLeave={e=>{e.target.style.transform='none';e.target.style.boxShadow='0 2px 12px rgba(255,199,44,0.35)'}}>
                    Select
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', marginTop:32 }}>
          <button onClick={() => navigate('/book')} style={{ padding:'14px 36px', borderRadius:20, background:'var(--blue)', color:'var(--white)', border:'none', fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:'var(--shadow-md)' }}>
            View All Available Trips →
          </button>
        </div>
      </div>
    </section>
  )
}

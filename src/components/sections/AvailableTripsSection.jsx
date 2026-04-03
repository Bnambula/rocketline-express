import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { operators } from '../../data'
import { Pill } from '../ui/SharedComponents'

const amenityIcon = { wifi:'📶', ac:'❄️', usb:'🔌' }

export default function AvailableTripsSection() {
  const [sortBy, setSortBy] = useState('price')
  const [alert, setAlert]   = useState(true)
  const navigate = useNavigate()

  const sorted = [...operators].sort((a,b) =>
    sortBy==='price'  ? a.price-b.price  :
    sortBy==='rating' ? b.rating-a.rating :
    a.departureTime.localeCompare(b.departureTime)
  )

  return (
    <section id="available-trips" style={{ background:'var(--gray-light)', padding:'72px 0' }}>
      <div className="container">
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
          <div>
            <div className="section-label">Live Results</div>
            <h2 className="section-title">Available <span>Trips</span></h2>
            <p style={{ color:'var(--gray-text)', fontSize:14, marginTop:4 }}>Kampala → Mbale · Fri, 12 May 2026</p>
          </div>
          <div style={{ display:'flex', gap:7, alignItems:'center', flexWrap:'wrap' }}>
            <span style={{ fontSize:12, color:'var(--gray-text)', fontFamily:'var(--font-head)', fontWeight:600 }}>Sort:</span>
            {['price','rating','time'].map(s => (
              <button key={s} onClick={() => setSortBy(s)} style={{ padding:'6px 14px', borderRadius:20, border:`1.5px solid ${sortBy===s?'var(--blue)':'var(--gray-mid)'}`, background:sortBy===s?'var(--blue)':'var(--white)', color:sortBy===s?'var(--white)':'var(--dark)', fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, cursor:'pointer', textTransform:'capitalize', transition:'all .18s' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {alert && (
          <div style={{ background:'linear-gradient(135deg,#fff3cd,#ffeaa7)', border:'1px solid #f59e0b', borderRadius:12, padding:'13px 18px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:9 }}>
              <span style={{ fontSize:17 }}>🔔</span>
              <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, color:'#92400e' }}>High demand! Most operators have under 5 seats remaining for this route.</span>
            </div>
            <button onClick={() => setAlert(false)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#92400e', lineHeight:1, flexShrink:0 }}>✕</button>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {sorted.map(op => (
            <div key={op.id}
              style={{ background:'var(--white)', borderRadius:16, padding:'16px 18px', boxShadow:'var(--shadow-sm)', transition:'all .2s', opacity:op.full?.7:1, cursor:'pointer' }}
              onMouseEnter={e => { if(!op.full){e.currentTarget.style.boxShadow='var(--shadow-lg)';e.currentTarget.style.transform='translateY(-2px)'} }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow='var(--shadow-sm)';e.currentTarget.style.transform='none' }}>
              {/* Mobile: stacked, Desktop: row */}
              <div style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', gap:14, alignItems:'center' }}>
                <div style={{ width:48, height:48, borderRadius:13, background:`${op.color}18`, border:`2px solid ${op.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:900, fontSize:15, color:op.color, flexShrink:0 }}>
                  {op.shortName}
                </div>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15 }}>{op.name}</span>
                    <span style={{ fontSize:11, color:'var(--gray-text)', background:'var(--gray-light)', padding:'2px 7px', borderRadius:8 }}>{op.plate}</span>
                    {op.full && <Pill text="FULL" status="rejected"/>}
                    {!op.full && op.seatsLeft <= 5 && <Pill text={`⚠️ ${op.seatsLeft} left`} status="pending"/>}
                  </div>
                  <div style={{ fontSize:12, color:'var(--gray-text)', marginBottom:5 }}>{op.type} · Departs {op.departureTime}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                      <span style={{ color:'var(--gold)', fontSize:12 }}>★</span>
                      <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:12 }}>{op.rating}</span>
                      <span style={{ fontSize:11, color:'var(--gray-text)' }}>({op.reviews})</span>
                    </div>
                    <div style={{ display:'flex', gap:3 }}>
                      {op.amenities.map(a => <span key={a} style={{ fontSize:13 }} title={a}>{amenityIcon[a]}</span>)}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign:'right', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:'clamp(16px,2vw,20px)', color:'var(--blue)' }}>
                    UGX {op.price.toLocaleString()}
                  </div>
                  {op.full
                    ? <button onClick={() => navigate('/book')} style={{ padding:'8px 16px', borderRadius:20, background:'var(--gray-light)', color:'var(--gray-text)', border:'none', fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, cursor:'pointer' }}>View</button>
                    : <button onClick={() => navigate(`/book?operator=${op.id}`)} style={{ padding:'9px 18px', borderRadius:20, background:'var(--gold)', color:'var(--blue)', border:'none', fontFamily:'var(--font-head)', fontWeight:800, fontSize:13, cursor:'pointer', boxShadow:'0 2px 10px rgba(255,199,44,0.35)', transition:'all .18s' }}
                        onMouseEnter={e=>{e.target.style.transform='translateY(-1px)'}}
                        onMouseLeave={e=>{e.target.style.transform='none'}}>
                        Select
                      </button>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', marginTop:28 }}>
          <button onClick={() => navigate('/book')} style={{ padding:'13px 32px', borderRadius:20, background:'var(--blue)', color:'var(--white)', border:'none', fontFamily:'var(--font-head)', fontWeight:800, fontSize:14, cursor:'pointer', boxShadow:'var(--shadow-md)' }}>
            View All Available Trips →
          </button>
        </div>
      </div>
    </section>
  )
}

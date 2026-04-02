import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookedSeats } from '../../data'

export default function SeatSelectionSection() {
  const [selected, setSelected] = useState([2, 5])
  const navigate = useNavigate()

  const totalSeats = 55
  const rows = Math.ceil((totalSeats - 1) / 4)

  const toggleSeat = (n) => {
    if (bookedSeats.includes(n)) return
    setSelected(prev =>
      prev.includes(n) ? prev.filter(s => s !== n) : prev.length < 4 ? [...prev, n] : prev
    )
  }

  const getSeatState = (n) => {
    if (bookedSeats.includes(n)) return 'booked'
    if (selected.includes(n)) return 'selected'
    return 'available'
  }

  const seatColors = {
    available: { bg:'#e8f4fd', border:'#90c8f0', text:'#1a5c8a' },
    booked: { bg:'#fecaca', border:'#f87171', text:'#991b1b' },
    selected: { bg:'#FFC72C', border:'#e6b020', text:'#0B3D91' },
  }

  const total = selected.length * 25000

  return (
    <section style={{ background:'var(--gray-light)', padding:'80px 0' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>

          {/* Left: Info */}
          <div>
            <div className="section-label">Interactive Seats</div>
            <h2 className="section-title">Pick Your <span>Perfect Seat</span></h2>
            <p className="section-sub" style={{ marginBottom:28 }}>Real-time seat availability. What you see is what you get — no double booking, ever.</p>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:28 }}>
              {[['available','Available','#e8f4fd','#90c8f0','#1a5c8a'],['booked','Booked','#fecaca','#f87171','#991b1b'],['selected','Selected','#FFC72C','#e6b020','#0B3D91']].map(([k,l,bg,brd,c]) => (
                <div key={k} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:20, height:20, borderRadius:5, background:bg, border:`2px solid ${brd}` }}/>
                  <span style={{ fontFamily:'var(--font-head)', fontWeight:600, fontSize:13 }}>{l}</span>
                </div>
              ))}
            </div>
            {selected.length > 0 && (
              <div style={{ background:'var(--white)', borderRadius:16, padding:20, boxShadow:'var(--shadow-sm)', marginBottom:20 }}>
                <div style={{ marginBottom:10, fontFamily:'var(--font-head)', fontWeight:700, color:'var(--dark)' }}>Selected Seats: {selected.sort((a,b)=>a-b).join(', ')}</div>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:22, color:'var(--blue)' }}>Total: UGX {total.toLocaleString()}</div>
              </div>
            )}
            {selected.length > 6 && (
              <div style={{ background:'#fff3cd', borderRadius:12, padding:14, marginBottom:16, fontFamily:'var(--font-head)', fontWeight:700, fontSize:14, color:'#92400e', border:'1px solid #f59e0b' }}>
                💡 Booking 7+ seats? Consider a full vehicle charter!
              </div>
            )}
            <button onClick={() => navigate(`/book?seats=${selected.join(',')}`)} style={{ padding:'14px 32px', borderRadius:20, background:'var(--gold)', color:'var(--blue)', border:'none', fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:'0 4px 16px rgba(255,199,44,0.4)' }}>
              Continue to Payment →
            </button>
          </div>

          {/* Right: Bus Layout */}
          <div style={{ background:'var(--white)', borderRadius:20, padding:24, boxShadow:'var(--shadow-lg)' }}>
            {/* Bus front */}
            <div style={{ textAlign:'center', marginBottom:16 }}>
              <div style={{ display:'inline-block', background:'var(--blue)', color:'var(--white)', padding:'6px 20px', borderRadius:'12px 12px 0 0', fontFamily:'var(--font-head)', fontWeight:800, fontSize:12, letterSpacing:2 }}>DRIVER</div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {/* Seat 1 (front single) */}
              <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
                {[1].map(n => {
                  const state = getSeatState(n)
                  const c = seatColors[state]
                  return (
                    <div key={n} onClick={() => toggleSeat(n)} style={{
                      width:38, height:38, borderRadius:8, background:c.bg, border:`2px solid ${c.brd||c.border}`,
                      display:'flex', alignItems:'center', justifyContent:'center', cursor: state==='booked'?'not-allowed':'pointer',
                      fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, color:c.text,
                      transition:'all 0.15s', boxShadow: state==='selected'?'0 3px 10px rgba(255,199,44,0.5)':'none'
                    }}
                    onMouseEnter={e=>{ if(state==='available') { e.currentTarget.style.transform='scale(1.12)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(11,61,145,0.2)' }}}
                    onMouseLeave={e=>{ e.currentTarget.style.transform='none'; if(state!=='selected') e.currentTarget.style.boxShadow='none' }}
                    >{n}</div>
                  )
                })}
              </div>

              {/* Remaining rows 4 across with aisle */}
              {Array.from({ length: rows }, (_, rowIdx) => {
                const seatNums = [rowIdx*4+2, rowIdx*4+3, null, rowIdx*4+4, rowIdx*4+5].filter((n,i) => i===2 || (n && n <= totalSeats))
                return (
                  <div key={rowIdx} style={{ display:'flex', gap:6, justifyContent:'center' }}>
                    {[rowIdx*4+2, rowIdx*4+3].map(n => n <= totalSeats ? (
                      <div key={n} onClick={() => toggleSeat(n)} style={{
                        width:38, height:38, borderRadius:8,
                        background: seatColors[getSeatState(n)].bg,
                        border:`2px solid ${seatColors[getSeatState(n)].border}`,
                        display:'flex', alignItems:'center', justifyContent:'center', cursor: getSeatState(n)==='booked'?'not-allowed':'pointer',
                        fontFamily:'var(--font-head)', fontWeight:700, fontSize:11, color:seatColors[getSeatState(n)].text,
                        transition:'all 0.15s', boxShadow: getSeatState(n)==='selected'?'0 3px 10px rgba(255,199,44,0.5)':'none',
                        flexShrink:0
                      }}
                      onMouseEnter={e=>{ if(getSeatState(n)==='available'){e.currentTarget.style.transform='scale(1.1)'}}}
                      onMouseLeave={e=>{ e.currentTarget.style.transform='none'}}
                      >{n}</div>
                    ) : <div key={n} style={{ width:38, height:38 }}/>)}
                    <div style={{ width:20 }}/>
                    {[rowIdx*4+4, rowIdx*4+5].map(n => n <= totalSeats ? (
                      <div key={n} onClick={() => toggleSeat(n)} style={{
                        width:38, height:38, borderRadius:8,
                        background: seatColors[getSeatState(n)].bg,
                        border:`2px solid ${seatColors[getSeatState(n)].border}`,
                        display:'flex', alignItems:'center', justifyContent:'center', cursor: getSeatState(n)==='booked'?'not-allowed':'pointer',
                        fontFamily:'var(--font-head)', fontWeight:700, fontSize:11, color:seatColors[getSeatState(n)].text,
                        transition:'all 0.15s', boxShadow: getSeatState(n)==='selected'?'0 3px 10px rgba(255,199,44,0.5)':'none',
                        flexShrink:0
                      }}
                      onMouseEnter={e=>{ if(getSeatState(n)==='available'){e.currentTarget.style.transform='scale(1.1)'}}}
                      onMouseLeave={e=>{ e.currentTarget.style.transform='none'}}
                      >{n}</div>
                    ) : <div key={n} style={{ width:38, height:38 }}/>)}
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop:16, paddingTop:16, borderTop:'1px dashed var(--gray-mid)', display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--gray-text)', fontFamily:'var(--font-head)', fontWeight:600 }}>
              <span>Total Seats: {totalSeats}</span>
              <span style={{ color:bookedSeats.length > 40 ? '#dc2626' : 'var(--success)' }}>Available: {totalSeats - bookedSeats.length}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

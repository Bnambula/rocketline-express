import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { operators, bookedSeats } from '../data'
import { useToast } from '../hooks/useToast'
import Footer from '../components/layout/Footer'

const STEPS = ['Search Results', 'Select Seats', 'Payment', 'Ticket']

export default function BookingFlow() {
  const [params] = useSearchParams()
  const [step, setStep] = useState(0)
  const [selectedOp, setSelectedOp] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [payMethod, setPayMethod] = useState('mtn')
  const [phone, setPhone] = useState('')
  const [paying, setPaying] = useState(false)
  const [ticketId] = useState(`RLX-${Date.now().toString().slice(-6)}-MBA-${Math.floor(Math.random()*90000+10000)}`)
  const toast = useToast()
  const navigate = useNavigate()

  const from = params.get('from') || 'Kampala'
  const to = params.get('to') || 'Mbale'
  const date = params.get('date') || 'Fri, 12 May 2026'
  const opId = params.get('operator')

  useEffect(() => {
    if (opId) {
      const op = operators.find(o => o.id === parseInt(opId))
      if (op) { setSelectedOp(op); setStep(1) }
    }
  }, [opId])

  const toggleSeat = (n) => {
    if (bookedSeats.includes(n)) return
    setSelectedSeats(prev => prev.includes(n) ? prev.filter(s=>s!==n) : prev.length < 6 ? [...prev, n] : prev)
  }

  const getSeatState = (n) => {
    if (bookedSeats.includes(n)) return 'booked'
    if (selectedSeats.includes(n)) return 'selected'
    return 'available'
  }

  const seatColors = {
    available:{ bg:'#e8f4fd', border:'#90c8f0', text:'#1a5c8a' },
    booked:{ bg:'#fecaca', border:'#f87171', text:'#991b1b' },
    selected:{ bg:'#FFC72C', border:'#e6b020', text:'#0B3D91' },
  }

  const handlePay = async () => {
    if (!phone || phone.length < 10) { toast('Please enter a valid phone number','warning'); return }
    setPaying(true)
    await new Promise(r => setTimeout(r, 2200))
    setPaying(false)
    setStep(3)
    toast('🎉 Booking confirmed! Ticket sent to ' + phone, 'success')
  }

  const total = (selectedOp?.price || 25000) * Math.max(selectedSeats.length, 1)

  return (
    <div style={{ paddingTop:64, background:'var(--gray-light)', minHeight:'100vh' }}>
      {/* Step header */}
      <div style={{ background:'var(--blue)', padding:'24px 0' }}>
        <div className="container">
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <button onClick={() => navigate('/')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.7)', cursor:'pointer', fontSize:13, fontFamily:'var(--font-head)' }}>← Home</button>
            <span style={{ color:'rgba(255,255,255,0.4)' }}>/</span>
            <span style={{ color:'var(--white)', fontSize:13, fontFamily:'var(--font-head)' }}>{from} → {to}</span>
          </div>
          <div style={{ display:'flex', gap:0 }}>
            {STEPS.map((s,i) => (
              <div key={s} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : 'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background: i<=step ? 'var(--gold)' : 'rgba(255,255,255,0.2)', color: i<=step ? 'var(--blue)' : 'rgba(255,255,255,0.6)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:800, fontSize:13 }}>{i < step ? '✓' : i+1}</div>
                  <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, color: i===step ? 'var(--gold)' : i < step ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)', whiteSpace:'nowrap' }}>{s}</span>
                </div>
                {i < STEPS.length-1 && <div style={{ flex:1, height:2, background: i < step ? 'var(--gold)' : 'rgba(255,255,255,0.15)', margin:'0 12px' }}/>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'32px 20px 80px' }}>

        {/* STEP 0: Search Results */}
        {step === 0 && (
          <div>
            <div style={{ background:'var(--white)', borderRadius:16, padding:20, marginBottom:24, boxShadow:'var(--shadow-sm)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
              <div>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:20 }}>{from} → {to}</div>
                <div style={{ color:'var(--gray-text)', fontSize:14 }}>{date} · Any vehicle</div>
              </div>
              <button onClick={() => navigate('/')} style={{ padding:'10px 20px', borderRadius:20, background:'var(--gray-light)', color:'var(--blue)', border:'1.5px solid var(--blue)', fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, cursor:'pointer' }}>✏️ Modify Search</button>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {operators.filter(o=>!o.full).map(op => (
                <div key={op.id} style={{ background:'var(--white)', borderRadius:16, padding:20, boxShadow:'var(--shadow-sm)', display:'grid', gridTemplateColumns:'auto 1fr auto auto', gap:20, alignItems:'center', cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-lg)';e.currentTarget.style.transform='translateY(-2px)'}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow-sm)';e.currentTarget.style.transform='none'}}
                  onClick={() => { setSelectedOp(op); setStep(1) }}>
                  <div style={{ width:52, height:52, borderRadius:14, background:`${op.color}18`, border:`2px solid ${op.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:900, fontSize:17, color:op.color }}>{op.shortName}</div>
                  <div>
                    <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, marginBottom:4 }}>{op.name} <span style={{ fontSize:12, color:'var(--gray-text)', fontWeight:500 }}>· {op.plate}</span></div>
                    <div style={{ fontSize:13, color:'var(--gray-text)', marginBottom:6 }}>{op.type} · Departs {op.departureTime}</div>
                    <div style={{ display:'flex', gap:3 }}>
                      {[...Array(5)].map((_,i) => <span key={i} style={{ color: i<Math.floor(op.rating)?'var(--gold)':'var(--gray-mid)', fontSize:13 }}>★</span>)}
                      <span style={{ fontSize:12, color:'var(--gray-text)', marginLeft:4 }}>{op.rating} ({op.reviews})</span>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:22, color:'var(--blue)' }}>UGX {op.price.toLocaleString()}</div>
                    {op.seatsLeft <= 5 && <div style={{ color:'#dc2626', fontSize:12, fontWeight:700 }}>⚠️ {op.seatsLeft} left</div>}
                  </div>
                  <button style={{ padding:'11px 22px', borderRadius:20, background:'var(--gold)', color:'var(--blue)', border:'none', fontFamily:'var(--font-head)', fontWeight:800, fontSize:13, cursor:'pointer' }}>Select</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Seat Selection */}
        {step === 1 && selectedOp && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:28, alignItems:'start' }}>
            <div>
              <div style={{ background:'var(--white)', borderRadius:16, padding:20, marginBottom:16, boxShadow:'var(--shadow-sm)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:`${selectedOp.color}18`, border:`2px solid ${selectedOp.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:900, fontSize:16, color:selectedOp.color }}>{selectedOp.shortName}</div>
                  <div>
                    <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16 }}>{selectedOp.name}</div>
                    <div style={{ fontSize:13, color:'var(--gray-text)' }}>{selectedOp.plate} · {from} → {to}</div>
                    <div style={{ fontSize:12, color:'var(--gray-text)' }}>Departs {selectedOp.departureTime}</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:16 }}>
                  {[['available','Available','#e8f4fd','#90c8f0'],['booked','Booked','#fecaca','#f87171'],['selected','Selected','#FFC72C','#e6b020']].map(([k,l,bg,brd]) => (
                    <div key={k} style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:18, height:18, borderRadius:5, background:bg, border:`2px solid ${brd}` }}/>
                      <span style={{ fontSize:12, fontFamily:'var(--font-head)', fontWeight:600 }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div style={{ background:'var(--white)', borderRadius:16, padding:20, marginBottom:16, boxShadow:'var(--shadow-sm)' }}>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:700, marginBottom:8 }}>Selected Seats: {selectedSeats.sort((a,b)=>a-b).join(', ')}</div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:22, color:'var(--blue)' }}>Total: UGX {total.toLocaleString()}</div>
                  <button onClick={() => setStep(2)} style={{ width:'100%', marginTop:14, padding:'13px', borderRadius:12, background:'var(--gold)', color:'var(--blue)', border:'none', fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, cursor:'pointer' }}>
                    Continue to Payment →
                  </button>
                </div>
              )}
              {selectedSeats.length > 6 && (
                <div style={{ background:'#fff3cd', borderRadius:12, padding:14, fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, color:'#92400e' }}>💡 7+ seats? Consider booking the full vehicle!</div>
              )}
            </div>

            {/* Bus seat map */}
            <div style={{ background:'var(--white)', borderRadius:16, padding:24, boxShadow:'var(--shadow-sm)' }}>
              <div style={{ textAlign:'center', marginBottom:14 }}>
                <div style={{ display:'inline-block', background:'var(--blue)', color:'var(--white)', padding:'5px 24px', borderRadius:'12px 12px 0 0', fontFamily:'var(--font-head)', fontWeight:800, fontSize:11, letterSpacing:3 }}>DRIVER</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:5, alignItems:'center' }}>
                {/* Row 1: front seat */}
                <div style={{ display:'flex', gap:6, width:'100%', justifyContent:'flex-end', paddingRight:4 }}>
                  {[1].map(n => {
                    const st = getSeatState(n)
                    const c = seatColors[st]
                    return <div key={n} onClick={()=>toggleSeat(n)} style={{ width:36,height:36,borderRadius:8,background:c.bg,border:`2px solid ${c.border}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:st==='booked'?'not-allowed':'pointer',fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,color:c.text,transition:'all 0.15s',boxShadow:st==='selected'?'0 0 12px rgba(255,199,44,0.6)':'none' }}>{n}</div>
                  })}
                </div>
                {/* Rows 2–14 */}
                {Array.from({length:13},(_,rowIdx) => {
                  const base = rowIdx*4+2
                  const seats = [base,base+1,null,base+2,base+3]
                  return (
                    <div key={rowIdx} style={{ display:'flex', gap:5, alignItems:'center' }}>
                      {seats.map((n,ci) => n===null ? (
                        <div key='aisle' style={{ width:16 }}/>
                      ) : n > 55 ? (
                        <div key={n} style={{ width:36,height:36 }}/>
                      ) : (
                        <div key={n} onClick={()=>toggleSeat(n)} style={{ width:36,height:36,borderRadius:8,background:seatColors[getSeatState(n)].bg,border:`2px solid ${seatColors[getSeatState(n)].border}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:getSeatState(n)==='booked'?'not-allowed':'pointer',fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,color:seatColors[getSeatState(n)].text,transition:'all 0.15s',boxShadow:getSeatState(n)==='selected'?'0 0 12px rgba(255,199,44,0.6)':'none',flexShrink:0 }}
                          onMouseEnter={e=>{if(getSeatState(n)==='available')e.currentTarget.style.transform='scale(1.15)'}}
                          onMouseLeave={e=>{e.currentTarget.style.transform='none'}}
                        >{n}</div>
                      ))}
                    </div>
                  )
                })}
              </div>
              <div style={{ display:'flex',justifyContent:'space-between',marginTop:14,paddingTop:14,borderTop:'1px dashed var(--gray-mid)',fontSize:12,color:'var(--gray-text)',fontFamily:'var(--font-head)',fontWeight:600 }}>
                <span>Total: 55</span><span>Booked: {bookedSeats.length}</span><span>Available: {55-bookedSeats.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Payment */}
        {step === 2 && (
          <div style={{ maxWidth:520, margin:'0 auto' }}>
            <div style={{ background:'var(--white)', borderRadius:20, padding:32, boxShadow:'var(--shadow-lg)' }}>
              <h2 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:22, marginBottom:6 }}>Complete Payment</h2>
              <p style={{ color:'var(--gray-text)', marginBottom:24 }}>Safe & instant mobile money payment</p>

              <div style={{ background:'var(--gray-light)', borderRadius:14, padding:16, marginBottom:24 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ color:'var(--gray-text)', fontSize:14 }}>{from} → {to}</span>
                  <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:14 }}>{date}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ color:'var(--gray-text)', fontSize:14 }}>Seats: {selectedSeats.join(', ') || '2, 5'}</span>
                  <span style={{ fontFamily:'var(--font-head)', fontWeight:700, color:'var(--blue)' }}>{selectedOp?.name}</span>
                </div>
                <div style={{ borderTop:'1px solid var(--gray-mid)', paddingTop:12, display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontFamily:'var(--font-head)', fontWeight:700 }}>Total Amount</span>
                  <span style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:20, color:'var(--blue)' }}>UGX {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment method */}
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:12, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:10 }}>Payment Method</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {[{ id:'mtn', label:'MTN MoMo', color:'#ffc300', bg:'#fff9e6' }, { id:'airtel', label:'Airtel Money', color:'#e4002b', bg:'#fff0f0' }].map(m => (
                    <div key={m.id} onClick={()=>setPayMethod(m.id)} style={{ border:`2px solid ${payMethod===m.id?m.color:'var(--gray-mid)'}`, borderRadius:14, padding:'14px 16px', cursor:'pointer', background: payMethod===m.id ? m.bg : 'var(--white)', transition:'all 0.2s', display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${m.color}`, background:payMethod===m.id?m.color:'transparent', transition:'all 0.2s' }}/>
                      <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:14, color:m.color }}>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:24 }}>
                <label style={{ fontSize:12, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>Mobile Number</label>
                <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder={payMethod==='mtn'?'0771 000 000':'0700 000 000'}
                  style={{ width:'100%', border:'1.5px solid var(--gray-mid)', borderRadius:12, padding:'13px 16px', fontSize:15, fontFamily:'var(--font-head)', fontWeight:600 }}/>
              </div>

              <button onClick={handlePay} disabled={paying} style={{ width:'100%', padding:'15px', borderRadius:14, background: paying ? 'var(--gray-mid)' : 'var(--gold)', color: paying ? 'var(--gray-text)' : 'var(--blue)', border:'none', fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, cursor: paying?'not-allowed':'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                {paying ? <><span style={{ width:18,height:18,border:'3px solid var(--gray-text)',borderTopColor:'var(--blue)',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite' }}/> Processing…</> : '📱 Pay UGX ' + total.toLocaleString() + ' Now'}
              </button>
              <p style={{ fontSize:12, color:'var(--gray-text)', textAlign:'center', marginTop:12 }}>🔒 Secured by Raylane Pay · SSL Encrypted</p>
            </div>
          </div>
        )}

        {/* STEP 3: Digital Ticket */}
        {step === 3 && (
          <div style={{ maxWidth:520, margin:'0 auto', display:'flex', flexDirection:'column', gap:20 }}>
            {/* Success banner */}
            <div style={{ background:'linear-gradient(135deg,#22c55e,#16a34a)', borderRadius:20, padding:28, color:'var(--white)', textAlign:'center' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:32 }}>✅</div>
              <h2 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:22, marginBottom:6 }}>Your Ticket is Confirmed!</h2>
              <p style={{ opacity:0.9 }}>Payment of UGX {total.toLocaleString()} received</p>
              <p style={{ opacity:0.75, fontSize:13, marginTop:4 }}>Booking ID: {ticketId}</p>
            </div>

            {/* Digital Ticket Card */}
            <div style={{ background:'var(--blue)', borderRadius:20, overflow:'hidden', boxShadow:'var(--shadow-xl)' }}>
              <div style={{ padding:'20px 24px', borderBottom:'2px dashed rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:900, fontSize:13, color:'var(--blue)' }}>RLX</div>
                  <div>
                    <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:16, color:'var(--white)' }}>RAYLANE EXPRESS</div>
                    <div style={{ fontSize:11, color:'var(--gold)', letterSpacing:2 }}>DIGITAL TICKET</div>
                  </div>
                </div>
                {/* QR Code placeholder */}
                <div style={{ width:72, height:72, background:'var(--white)', borderRadius:10, display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, padding:6 }}>
                  {Array.from({length:49},(_,i) => (
                    <div key={i} style={{ borderRadius:1, background: Math.random() > 0.5 ? '#0B3D91' : 'white' }}/>
                  ))}
                </div>
              </div>
              <div style={{ padding:24 }}>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:4 }}>Ticket No.</div>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:18, color:'var(--gold)', marginBottom:20 }}>{ticketId}</div>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                  <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:20, color:'var(--white)' }}>{from}</span>
                  <div style={{ flex:1, height:2, background:'rgba(255,255,255,0.2)', position:'relative' }}>
                    <span style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'var(--blue)', padding:'0 8px', color:'var(--gold)', fontSize:16 }}>→</span>
                  </div>
                  <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:20, color:'var(--white)' }}>{to}</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
                  {[['Date',date],['Time',selectedOp?.departureTime||'10:00 AM'],['Vehicle',selectedOp?.plate||'UBF 234K'],['Operator',selectedOp?.name||'Global Coaches'],['Seat(s)',selectedSeats.join(', ')||'2, 5'],['Amount',`UGX ${total.toLocaleString()}`]].map(([l,v]) => (
                    <div key={l}>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', fontFamily:'var(--font-head)', marginBottom:3 }}>{l}</div>
                      <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:14, color: l==='Amount' ? 'var(--gold)' : 'var(--white)' }}>{v} {l==='Amount'&&<span style={{ background:'#22c55e',color:'white',fontSize:10,padding:'2px 8px',borderRadius:6,marginLeft:6 }}>PAID</span>}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:12, padding:'12px 16px', textAlign:'center', fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, color:'rgba(255,255,255,0.8)' }}>
                  Show this QR code at boarding
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[['⬇️ Download PDF','#e8f4fd','#0B3D91'],['🔗 Share Ticket','#dcfce7','#15803d'],['🖨️ Print Ticket','#fef9c3','#92400e'],['📱 Ticket sent to ' + (phone||'0782 123 456'),'#f3e8ff','#7c3aed']].map(([l,bg,c]) => (
                <button key={l} style={{ padding:'14px 16px', borderRadius:14, background:bg, color:c, border:'none', fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='none'}>{l}</button>
              ))}
            </div>

            <button onClick={() => navigate('/')} style={{ padding:'14px', borderRadius:14, background:'var(--blue)', color:'var(--white)', border:'none', fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, cursor:'pointer' }}>
              ← Back to Home
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

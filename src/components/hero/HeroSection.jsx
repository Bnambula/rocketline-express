import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GroupBookingModal } from '../modals/GroupBookingModal'
import { AdvanceBookingModal } from '../modals/GroupBookingModal'

const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka','Kabale','Entebbe']

const HERO_SLIDES = [
  { bg:'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&q=80', headline:'Travel Smarter\nAcross Uganda', sub:'Real-time seat booking. Mobile money payments.\nYour seat confirmed in 60 seconds.' },
  { bg:'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80', headline:'Discover\nBeautiful Uganda', sub:'Bwindi. Murchison Falls. Sipi Falls.\nAll reachable from one platform.' },
  { bg:'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1600&q=80', headline:'Send Parcels\nAnywhere', sub:'Envelopes to heavy cargo.\nGPS-tracked on every Raylane bus.' },
]

const QUICK_LINKS = [
  { icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>, label:'Book Seat', action:'book' },
  { icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>, label:'Send Parcel', action:'parcels' },
  { icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>, label:'Track Parcel', action:'track' },
  { icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, label:'Group Travel', action:'group' },
  { icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, label:'Advance Book', action:'advance' },
  { icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, label:'Private Hire', action:'hire' },
]

export default function HeroSection() {
  const navigate  = useNavigate()
  const [slide,   setSlide]   = useState(0)
  const [from,    setFrom]    = useState('Kampala')
  const [to,      setTo]      = useState('')
  const [date,    setDate]    = useState(new Date().toISOString().split('T')[0])
  const [pax,     setPax]     = useState('1')
  const [groupM,  setGroupM]  = useState(false)
  const [advM,    setAdvM]    = useState(false)

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const handleSearch = e => {
    e.preventDefault()
    if (!to) return
    navigate(`/book?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&pax=${pax}`)
  }

  const handleQuick = action => {
    if (action === 'book')    navigate('/book')
    if (action === 'parcels') navigate('/parcels')
    if (action === 'track')   navigate('/parcels?tab=track')
    if (action === 'group')   setGroupM(true)
    if (action === 'advance') setAdvM(true)
    if (action === 'hire')    navigate('/book?type=hire')
  }

  const hs = HERO_SLIDES[slide]

  return (
    <>
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', overflow:'hidden' }}>

        {/* Background image with parallax effect */}
        <div style={{ position:'absolute', inset:0, zIndex:0 }}>
          {HERO_SLIDES.map((s, i) => (
            <div key={i} style={{ position:'absolute', inset:0, backgroundImage:`url(${s.bg})`, backgroundSize:'cover', backgroundPosition:'center', opacity:i === slide ? 1 : 0, transition:'opacity 1.2s ease', filter:'brightness(.45)' }}/>
          ))}
          {/* Gradient overlay */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(11,61,145,.85) 0%,rgba(11,61,145,.4) 50%,rgba(0,0,0,.3) 100%)' }}/>
        </div>

        {/* Slide indicators */}
        <div style={{ position:'absolute', bottom:220, left:'50%', transform:'translateX(-50%)', display:'flex', gap:6, zIndex:2 }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{ width:i===slide?24:7, height:7, borderRadius:4, background:i===slide?'#FFC72C':'rgba(255,255,255,.4)', border:'none', cursor:'pointer', transition:'all .3s' }}/>
          ))}
        </div>

        <div className="container" style={{ position:'relative', zIndex:2, paddingTop:'var(--nav-h)' }}>

          {/* Hero headline */}
          <div style={{ marginBottom:32, paddingTop:20 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,199,44,.2)', border:'1px solid rgba(255,199,44,.4)', borderRadius:20, padding:'5px 14px', marginBottom:16 }}>
              <div className="live-dot"/>
              <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:11, color:'#FFC72C', letterSpacing:2, textTransform:'uppercase' }}>Live Seat Availability</span>
            </div>
            {hs.headline.split('\n').map((line, i) => (
              <h1 key={i} style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'clamp(2.2rem,6vw,4rem)', color:'#fff', lineHeight:1.1, letterSpacing:'-1px', animation:'fadeIn .5s ease' }}>
                {i === 0 ? line : <span style={{ color:'#FFC72C' }}>{line}</span>}
              </h1>
            ))}
            <p style={{ color:'rgba(255,255,255,.82)', fontSize:'clamp(1rem,2vw,1.2rem)', lineHeight:1.65, marginTop:12, fontFamily:'var(--font-body)', maxWidth:500 }}>
              {hs.sub.split('\n').map((l, i) => <span key={i}>{l}{i < hs.sub.split('\n').length - 1 && <br/>}</span>)}
            </p>
          </div>

          {/* Search box - Brussels Airlines style */}
          <div className="search-box" style={{ maxWidth:820 }}>
            {/* Tab strip */}
            <div style={{ display:'flex', borderBottom:'1px solid var(--border)', padding:'0 20px' }}>
              {[['Bus Seat','bus'],['Parcel','parcel'],['Private Hire','hire']].map(([label, type]) => (
                <button key={type} onClick={() => type !== 'bus' && handleQuick(type === 'parcel' ? 'parcels' : 'hire')}
                  style={{ padding:'14px 20px', fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, color:type==='bus'?'var(--blue)':'var(--text-secondary)', borderBottom:`2.5px solid ${type==='bus'?'var(--blue)':'transparent'}`, background:'none', border:'none', borderBottom:`2.5px solid ${type==='bus'?'var(--blue)':'transparent'}`, cursor:'pointer', transition:'all .2s', whiteSpace:'nowrap' }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Search form */}
            <form onSubmit={handleSearch} style={{ padding:'20px 20px 20px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 160px 120px auto', gap:10, alignItems:'flex-end' }}>
                <div>
                  <label className="form-label" style={{ color:'var(--text-secondary)' }}>From</label>
                  <select value={from} onChange={e => setFrom(e.target.value)} className="form-input" style={{ fontFamily:'var(--font-head)', fontWeight:600 }}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ color:'var(--text-secondary)' }}>To</label>
                  <select value={to} onChange={e => setTo(e.target.value)} className="form-input" style={{ fontFamily:'var(--font-head)', fontWeight:600 }}>
                    <option value="">Select city</option>
                    {CITIES.filter(c => c !== from).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ color:'var(--text-secondary)' }}>Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input" min={new Date().toISOString().split('T')[0]}/>
                </div>
                <div>
                  <label className="form-label" style={{ color:'var(--text-secondary)' }}>Passengers</label>
                  <select value={pax} onChange={e => setPax(e.target.value)} className="form-input">
                    {['1','2','3','4','5','6','7','8','9','10'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <button type="submit"
                  style={{ padding:'13px 28px', borderRadius:'var(--r-full)', background:'var(--blue)', color:'#fff', fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, border:'none', cursor:'pointer', boxShadow:'0 4px 18px rgba(11,61,145,.4)', transition:'all .2s', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:8 }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Quick access buttons - Brussels Airlines style horizontal strip */}
          <div style={{ marginTop:20, display:'flex', gap:8, flexWrap:'wrap' }}>
            {QUICK_LINKS.map(ql => (
              <button key={ql.action} onClick={() => handleQuick(ql.action)} className="quick-btn">
                {ql.icon}
                <span>{ql.label}</span>
              </button>
            ))}
          </div>

          {/* Trust strip */}
          <div style={{ marginTop:28, display:'flex', gap:24, flexWrap:'wrap' }}>
            {[['500K+','Passengers Served'],['150+','Verified Operators'],['99.9%','On-Time Rate'],['60s','Booking Time']].map(([n, l]) => (
              <div key={l} style={{ display:'flex', flexDirection:'column' }}>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:20, color:'#FFC72C' }}>{n}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontFamily:'var(--font-body)', marginTop:1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {groupM && <GroupBookingModal onClose={() => setGroupM(false)}/>}
      {advM   && <AdvanceBookingModal onClose={() => setAdvM(false)}/>}
    </>
  )
}

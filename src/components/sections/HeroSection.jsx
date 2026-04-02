import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const heroImages = [
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1600&q=80',
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80',
  'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1600&q=80',
]

const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka','Kabale','Entebbe']

export default function HeroSection() {
  const [imgIndex, setImgIndex] = useState(0)
  const [fade, setFade] = useState(true)
  const [tripType, setTripType] = useState('oneway')
  const [from, setFrom] = useState('Kampala')
  const [to, setTo] = useState('Mbale')
  const [date, setDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 3)
    return d.toISOString().split('T')[0]
  })
  const [vehicleType, setVehicleType] = useState('Any')
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setImgIndex(i => (i + 1) % heroImages.length)
        setFade(true)
      }, 500)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const swapCities = () => { setFrom(to); setTo(from) }

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/book?from=${from}&to=${to}&date=${date}&type=${vehicleType}`)
  }

  return (
    <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', overflow:'hidden', paddingTop:64 }}>
      {/* Background */}
      <div style={{
        position:'absolute', inset:0, zIndex:0,
        backgroundImage:`url(${heroImages[imgIndex]})`,
        backgroundSize:'cover', backgroundPosition:'center',
        transition:'opacity 0.8s ease',
        opacity: fade ? 1 : 0,
        transform:'scale(1.04)',
        animation:'subtleZoom 12s ease-in-out infinite alternate'
      }}/>
      <style>{`
        @keyframes subtleZoom { from{transform:scale(1)} to{transform:scale(1.06)} }
        .hero-particle { position:absolute; border-radius:50%; background:rgba(255,199,44,0.15); animation:float 4s ease-in-out infinite; }
      `}</style>

      {/* Overlay */}
      <div style={{ position:'absolute', inset:0, zIndex:1, background:'linear-gradient(105deg,rgba(11,61,145,0.88) 0%,rgba(11,61,145,0.55) 55%,rgba(0,0,0,0.3) 100%)' }}/>

      {/* Particles */}
      {[...Array(6)].map((_,i) => (
        <div key={i} className="hero-particle" style={{
          width: 8+i*4, height: 8+i*4,
          left:`${10+i*15}%`, top:`${20+i*10}%`,
          animationDelay:`${i*0.7}s`, zIndex:2
        }}/>
      ))}

      {/* Content */}
      <div className="container" style={{ position:'relative', zIndex:3, width:'100%', padding:'60px 20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>

          {/* Left: Text */}
          <div style={{ color:'var(--white)' }}>
            <div style={{ display:'flex', gap:20, marginBottom:24, flexWrap:'wrap' }}>
              {['✅ No Signup Needed','✅ Mobile Money Only','✅ Instant Ticket'].map(b => (
                <span key={b} style={{ background:'rgba(255,255,255,0.12)', backdropFilter:'blur(8px)', padding:'5px 14px', borderRadius:20, fontSize:12, fontFamily:'var(--font-head)', fontWeight:600, border:'1px solid rgba(255,255,255,0.2)' }}>{b}</span>
              ))}
            </div>

            <h1 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:'clamp(2rem,4.5vw,3.2rem)', lineHeight:1.1, marginBottom:12 }}>
              Smart Travel Across<br/>
              <span style={{ color:'var(--gold)' }}>Uganda & East Africa</span>
            </h1>
            <p style={{ fontSize:'clamp(1rem,1.5vw,1.15rem)', opacity:0.9, marginBottom:32, maxWidth:480, lineHeight:1.7 }}>
              Book buses & taxis instantly. Safe, reliable, and convenient.<br/>
              Powered by real-time seat sync & mobile money.
            </p>

            {/* Stats */}
            <div style={{ display:'flex', gap:32, flexWrap:'wrap' }}>
              {[['500+','Operators'],['2M+','Passengers'],['1,000+','Routes']].map(([n,l]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, background:'rgba(255,199,44,0.2)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>
                    {l==='Operators'?'🚌':l==='Passengers'?'👥':'🗺️'}
                  </div>
                  <div>
                    <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:20, lineHeight:1 }}>{n}</div>
                    <div style={{ fontSize:12, opacity:0.75 }}>{l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Search Box */}
          <div style={{ background:'var(--white)', borderRadius:20, padding:28, boxShadow:'0 24px 64px rgba(0,0,0,0.3)' }}>
            {/* Trip Type */}
            <div style={{ display:'flex', background:'var(--gray-light)', borderRadius:12, padding:4, marginBottom:20, gap:4 }}>
              {['oneway','roundtrip','parcel'].map(t => (
                <button key={t} onClick={() => setTripType(t)} style={{
                  flex:1, padding:'9px 0', borderRadius:10,
                  background: tripType===t ? 'var(--white)' : 'transparent',
                  color: tripType===t ? 'var(--blue)' : 'var(--gray-text)',
                  boxShadow: tripType===t ? 'var(--shadow-sm)' : 'none',
                  fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, transition:'all 0.2s',
                  border:'none', cursor:'pointer'
                }}>
                  {t==='oneway'?'One Way':t==='roundtrip'?'Round Trip':'Parcel'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch}>
              {/* From / To */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 36px 1fr', gap:8, alignItems:'center', marginBottom:16 }}>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1 }}>From</label>
                  <select value={from} onChange={e=>setFrom(e.target.value)} style={{ width:'100%', border:'1.5px solid var(--gray-mid)', borderRadius:10, padding:'10px 12px', fontSize:14, fontFamily:'var(--font-head)', fontWeight:600, color:'var(--dark)', marginTop:4, background:'var(--white)', cursor:'pointer' }}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <button type="button" onClick={swapCities} style={{ width:36, height:36, borderRadius:10, background:'var(--blue)', color:'var(--white)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', marginTop:18, flexShrink:0 }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M8 3l4 4-4 4M16 21l-4-4 4-4"/><path d="M12 7H4M12 17h8"/></svg>
                </button>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1 }}>To</label>
                  <select value={to} onChange={e=>setTo(e.target.value)} style={{ width:'100%', border:'1.5px solid var(--gray-mid)', borderRadius:10, padding:'10px 12px', fontSize:14, fontFamily:'var(--font-head)', fontWeight:600, color:'var(--dark)', marginTop:4, background:'var(--white)', cursor:'pointer' }}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1 }}>Date</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} style={{ width:'100%', border:'1.5px solid var(--gray-mid)', borderRadius:10, padding:'10px 12px', fontSize:14, fontFamily:'var(--font-head)', fontWeight:600, color:'var(--dark)', marginTop:4 }}/>
              </div>

              {/* Vehicle Type */}
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1 }}>Vehicle Type</label>
                <select value={vehicleType} onChange={e=>setVehicleType(e.target.value)} style={{ width:'100%', border:'1.5px solid var(--gray-mid)', borderRadius:10, padding:'10px 12px', fontSize:14, fontFamily:'var(--font-head)', fontWeight:500, color:'var(--dark)', marginTop:4, background:'var(--white)', cursor:'pointer' }}>
                  <option>Any</option>
                  <option>Bus / Coach</option>
                  <option>Taxi / Minivan</option>
                  <option>Special Hire</option>
                </select>
              </div>

              <button type="submit" style={{
                width:'100%', background:'var(--gold)', color:'var(--blue)', border:'none',
                padding:'15px', borderRadius:12, fontFamily:'var(--font-head)', fontWeight:800,
                fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                boxShadow:'0 4px 20px rgba(255,199,44,0.4)', transition:'all 0.2s'
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 6px 24px rgba(255,199,44,0.5)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 4px 20px rgba(255,199,44,0.4)'}}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Search Trips
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', zIndex:3, display:'flex', flexDirection:'column', alignItems:'center', gap:6, color:'rgba(255,255,255,0.6)', fontSize:11, fontFamily:'var(--font-head)' }}>
        <span>SCROLL</span>
        <div style={{ width:2, height:28, background:'rgba(255,255,255,0.3)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ width:'100%', height:'50%', background:'var(--gold)', borderRadius:2, animation:'scrollDot 1.5s ease infinite' }}/>
        </div>
        <style>{`@keyframes scrollDot{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important;}
          .hero-searchbox{display:none!important;}
        }
      `}</style>
    </section>
  )
}

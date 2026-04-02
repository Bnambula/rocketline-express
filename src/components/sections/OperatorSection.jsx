import React from 'react'
import { useNavigate } from 'react-router-dom'

const perks = [
  { icon:'📊', title:'Manage Bookings', desc:'See all reservations, passenger lists, and seat maps in real-time.' },
  { icon:'💰', title:'Increase Revenue', desc:'Reach more travelers digitally. Top operators see 40%+ growth.' },
  { icon:'📱', title:'Digital Operations', desc:'Go paperless. Manage routes, seats, and trips from your phone.' },
  { icon:'✅', title:'Trusted Platform', desc:'Join 500+ verified operators already growing with Raylane.' },
]

export default function OperatorSection() {
  const navigate = useNavigate()
  return (
    <section style={{ background:'linear-gradient(135deg,#0B3D91 0%,#082d6e 60%,#0f4fa8 100%)', padding:'80px 0', color:'var(--white)', position:'relative', overflow:'hidden' }}>
      {/* Decorative elements */}
      <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'rgba(255,199,44,0.07)', zIndex:0 }}/>
      <div style={{ position:'absolute', bottom:-60, left:-60, width:240, height:240, borderRadius:'50%', background:'rgba(255,255,255,0.04)', zIndex:0 }}/>

      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'center' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,199,44,0.15)', padding:'6px 16px', borderRadius:20, marginBottom:16 }}>
              <span style={{ fontSize:14 }}>🚌</span>
              <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)' }}>Operators</span>
            </div>
            <h2 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:'clamp(1.8rem,3vw,2.6rem)', marginBottom:14, lineHeight:1.15 }}>
              Grow Your Transport<br/>Business with <span style={{ color:'var(--gold)' }}>Raylane</span>
            </h2>
            <p style={{ opacity:0.8, fontSize:15, lineHeight:1.8, marginBottom:32, maxWidth:460 }}>
              Join Uganda's fastest-growing travel platform. Digitize your operations, eliminate empty seats, and reach thousands of passengers daily.
            </p>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              <button onClick={() => navigate('/operator')} style={{ padding:'14px 32px', borderRadius:20, background:'var(--gold)', color:'var(--blue)', border:'none', fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:'0 4px 20px rgba(255,199,44,0.4)' }}>
                🚀 Join Raylane Express
              </button>
              <button onClick={() => navigate('/partner')} style={{ padding:'14px 24px', borderRadius:20, background:'transparent', color:'var(--white)', border:'2px solid rgba(255,255,255,0.3)', fontFamily:'var(--font-head)', fontWeight:700, fontSize:15, cursor:'pointer' }}>
                Partner Portal →
              </button>
            </div>

            <div style={{ display:'flex', gap:24, marginTop:36, flexWrap:'wrap' }}>
              {[['Free','Setup & Onboarding'],['24/7','Operator Support'],['0%','Hidden Fees']].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:24, color:'var(--gold)' }}>{n}</div>
                  <div style={{ fontSize:13, opacity:0.75 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {perks.map(p => (
              <div key={p.title} style={{ background:'rgba(255,255,255,0.08)', borderRadius:16, padding:22, backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.1)', transition:'all 0.25s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.14)';e.currentTarget.style.transform='translateY(-3px)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)';e.currentTarget.style.transform='none'}}>
                <div style={{ fontSize:28, marginBottom:12 }}>{p.icon}</div>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, marginBottom:8 }}>{p.title}</div>
                <div style={{ fontSize:13, opacity:0.75, lineHeight:1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

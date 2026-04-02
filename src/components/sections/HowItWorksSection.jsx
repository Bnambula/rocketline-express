import React from 'react'
import { useNavigate } from 'react-router-dom'

const steps = [
  { n:1, icon:'🔍', title:'Search Route', desc:'Enter your origin, destination & travel date. Compare operators by price, rating & departure time.' },
  { n:2, icon:'💺', title:'Select Your Seat', desc:'View the real-time seat map. Choose your preferred window, aisle, or front seat. No surprises.' },
  { n:3, icon:'📱', title:'Pay via Mobile Money', desc:'Instantly pay via MTN MoMo or Airtel Money. Safe, fast, and no bank account needed.' },
  { n:4, icon:'🎫', title:'Travel / Send Parcel', desc:'Receive your QR digital ticket instantly. Board the bus or track your parcel in real-time.' },
]

export default function HowItWorksSection() {
  const navigate = useNavigate()
  return (
    <section style={{ background:'var(--white)', padding:'80px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div className="section-label">Simple Process</div>
          <h2 className="section-title">How It <span>Works</span></h2>
          <p className="section-sub" style={{ margin:'0 auto' }}>Book your trip in under 2 minutes from anywhere in Uganda</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, position:'relative' }}>
          {/* Connector line */}
          <div style={{ position:'absolute', top:52, left:'12%', right:'12%', height:2, background:'linear-gradient(90deg,var(--gold),var(--blue))', zIndex:0, borderRadius:2 }} className="hide-mobile"/>

          {steps.map((step, i) => (
            <div key={step.n} style={{ textAlign:'center', position:'relative', zIndex:1 }}>
              <div style={{ width:80, height:80, borderRadius:20, background:'var(--blue)', color:'var(--white)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 8px 24px rgba(11,61,145,0.2)', position:'relative' }}>
                <span style={{ fontSize:26 }}>{step.icon}</span>
                <div style={{ position:'absolute', top:-10, right:-10, width:26, height:26, background:'var(--gold)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:900, fontSize:12, color:'var(--blue)' }}>{step.n}</div>
              </div>
              <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:17, marginBottom:10 }}>{step.title}</h3>
              <p style={{ color:'var(--gray-text)', fontSize:14, lineHeight:1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', marginTop:48 }}>
          <button onClick={() => navigate('/book')} className="btn btn-primary btn-lg" style={{ fontFamily:'var(--font-head)', fontWeight:800, padding:'16px 40px', borderRadius:40, background:'var(--gold)', color:'var(--blue)', border:'none', cursor:'pointer', fontSize:16, boxShadow:'0 4px 20px rgba(255,199,44,0.4)' }}>
            🚌 Start Booking Now
          </button>
        </div>
      </div>

      <style>{`@media(max-width:768px){.how-it-works-grid{grid-template-columns:1fr 1fr!important;}}`}</style>
    </section>
  )
}

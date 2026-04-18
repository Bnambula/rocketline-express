import React from 'react'
const P = { fontFamily:"'Sora',sans-serif" }
const I = { fontFamily:"'Inter',sans-serif" }

const FEATURES = [
  { icon:<svg width="28" height="28" fill="none" stroke="#0B3D91" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, color:'#dbeafe', title:'Verified Operators', desc:'Every operator on our platform is vetted, licensed, and PSV-compliant. We check insurance, fitness certificates, and driver licences before onboarding.' },
  { icon:<svg width="28" height="28" fill="none" stroke="#7c3aed" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, color:'#ede9fe', title:'Real-Time Seat Lock', desc:'Your seat is locked the moment you hit confirm. No overbooking, no surprises. Pay via MTN MoMo, Airtel, or Visa and get your ticket in 60 seconds.' },
  { icon:<svg width="28" height="28" fill="none" stroke="#15803d" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, color:'#dcfce7', title:'Guaranteed Boarding', desc:'Show your QR ticket at the bay. Our driver scanner confirms your seat instantly. No paper ticket needed -- your phone is your boarding pass.' },
  { icon:<svg width="28" height="28" fill="none" stroke="#d97706" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, color:'#fef3c7', title:'Live Bus Tracker', desc:'Track your bus in real time on a map. Know exactly where the bus is, its ETA, and get SMS alerts for any delays or route changes.' },
  { icon:<svg width="28" height="28" fill="none" stroke="#0B3D91" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, color:'#dbeafe', title:'Loyalty Rewards', desc:'Earn points on every trip and parcel. Bronze, Silver, Gold tiers unlock priority boarding, free seat upgrades, and discounted fares.' },
  { icon:<svg width="28" height="28" fill="none" stroke="#dc2626" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>, color:'#fee2e2', title:'Parcel Delivery', desc:'Send envelopes to heavy cargo on every Raylane bus. GPS-tracked, insured, same-day dispatch from Kampala to any of our 20+ destinations.' },
]

export default function WhyChooseSection() {
  return (
    <section style={{ background:'var(--white)', padding:'80px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div className="section-label" style={{ margin:'0 auto 14px' }}>Why Raylane</div>
          <h2 className="section-title">Travel <span>Smarter</span> Across Uganda</h2>
          <p className="section-sub" style={{ margin:'0 auto' }}>
            We built the infrastructure Uganda's transport sector was missing -- real seats, real payments, real accountability.
          </p>
        </div>
        <div className="resp-grid">
          {FEATURES.map((f, i) => (
            <div key={i} style={{ padding:24, borderRadius:'var(--r-lg)', border:'1px solid var(--border)', background:'var(--white)', transition:'all .25s', cursor:'default', animation:`fadeIn .4s ease ${i*0.08}s both` }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='var(--sh-lg)'; e.currentTarget.style.borderColor='var(--blue)' }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; e.currentTarget.style.borderColor='var(--border)' }}>
              <div style={{ width:52, height:52, borderRadius:14, background:f.color, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ ...P, fontWeight:700, fontSize:17, marginBottom:8, color:'var(--text-primary)' }}>{f.title}</h3>
              <p style={{ fontSize:13.5, color:'var(--text-secondary)', ...I, lineHeight:1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

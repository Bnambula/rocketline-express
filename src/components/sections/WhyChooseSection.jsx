import React from 'react'

const FEATURES = [
  { icon:'⚡', title:'Real-Time Booking',    desc:'Seat availability updates live across all devices. No lag, no overbooking.', color:'#dbeafe' },
  { icon:'🔒', title:'No Double Booking',    desc:'Our Seat Sync Engine locks your seat the instant payment is confirmed.', color:'#dcfce7' },
  { icon:'📱', title:'Mobile Money Pay',     desc:'MTN MoMo & Airtel Money. No bank card needed. Pay in seconds.', color:'#fef9c3' },
  { icon:'🌍', title:'Wide East Africa Coverage', desc:'Kampala to Nairobi, Gulu to Kigali. 1,000+ routes covered.', color:'#fce7f3' },
  { icon:'⭐', title:'Vetted Operators',     desc:'Every bus operator is onboarded, verified, and approved by Raylane.', color:'#ede9fe' },
  { icon:'🎫', title:'Instant QR Ticket',   desc:'Digital ticket via SMS and app. No printing. No queues at the park.', color:'#ffedd5' },
]

export default function WhyChooseSection() {
  return (
    <section id="why-choose" style={{ background:'var(--gray-light)', padding:'72px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <div className="section-label">Why Raylane</div>
          <h2 className="section-title">Travel Smarter with <span>Raylane Express</span></h2>
          <p className="section-sub" style={{ margin:'0 auto' }}>Built for Uganda. Engineered for reliability.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background:'var(--white)', borderRadius:18, padding:24, boxShadow:'var(--shadow-sm)', transition:'all .25s' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='var(--shadow-xl)' }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='var(--shadow-sm)' }}>
              <div style={{ width:52, height:52, borderRadius:14, background:f.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, marginBottom:8 }}>{f.title}</h3>
              <p style={{ color:'var(--gray-text)', fontSize:14, lineHeight:1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
        {/* Trust bar */}
        <div style={{ marginTop:48, background:'var(--blue)', borderRadius:20, padding:'28px 32px', display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:20 }}>
          {[['500+','Verified Operators'],['2M+','Happy Passengers'],['1,000+','Routes Covered'],['99.9%','Uptime']].map(([n,l])=>(
            <div key={l} style={{ textAlign:'center', color:'var(--white)' }}>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:28, color:'var(--gold)' }}>{n}</div>
              <div style={{ fontSize:13, opacity:.8 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:767px){#why-choose .why-grid,#why-choose>div>div:last-child>div{grid-template-columns:1fr 1fr!important;}}`}</style>
    </section>
  )
}

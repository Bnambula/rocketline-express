import React from 'react'

const features = [
  { icon:'⚡', title:'Real-Time Booking', desc:'Seats update live across all devices. No lag, no confusion, no double bookings.', color:'#dbeafe' },
  { icon:'🔒', title:'No Double Booking', desc:'Our Seat Sync Engine guarantees your seat is yours the moment you pay.', color:'#dcfce7' },
  { icon:'📱', title:'Mobile Money Payments', desc:'Pay instantly via MTN MoMo or Airtel Money. No bank card needed.', color:'#fef9c3' },
  { icon:'🌍', title:'Wide Coverage', desc:'Kampala to Nairobi, Gulu to Kigali — we connect Uganda and East Africa.', color:'#fce7f3' },
  { icon:'⭐', title:'Trusted Operators', desc:'Every operator is vetted and approved by Raylane admin before going live.', color:'#ede9fe' },
  { icon:'🎫', title:'Instant QR Tickets', desc:'Your digital ticket arrives by SMS and app. No printing. No queues.', color:'#ffedd5' },
]

export default function WhyChooseSection() {
  return (
    <section style={{ background:'var(--gray-light)', padding:'80px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div className="section-label">Why Raylane</div>
          <h2 className="section-title">Travel Smarter with <span>Raylane Express</span></h2>
          <p className="section-sub" style={{ margin:'0 auto' }}>Built for Uganda. Engineered for reliability. Designed for you.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {features.map(f => (
            <div key={f.title} style={{ background:'var(--white)', borderRadius:18, padding:28, boxShadow:'var(--shadow-sm)', transition:'all 0.25s', cursor:'default' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.boxShadow='var(--shadow-xl)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='var(--shadow-sm)'}}>
              <div style={{ width:56, height:56, borderRadius:14, background:f.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, marginBottom:18 }}>{f.icon}</div>
              <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:17, marginBottom:10 }}>{f.title}</h3>
              <p style={{ color:'var(--gray-text)', fontSize:14, lineHeight:1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div style={{ marginTop:56, background:'var(--blue)', borderRadius:20, padding:'32px 40px', display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:24 }}>
          {[['500+','Verified Operators'],['2M+','Happy Passengers'],['1,000+','Routes Covered'],['99.9%','Uptime Guarantee']].map(([n,l]) => (
            <div key={l} style={{ textAlign:'center', color:'var(--white)' }}>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:32, color:'var(--gold)' }}>{n}</div>
              <div style={{ fontSize:14, opacity:0.8 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){.why-grid{grid-template-columns:1fr 1fr!important;}}`}</style>
    </section>
  )
}

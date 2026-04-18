import React from 'react'
const P = { fontFamily:"'Sora',sans-serif" }
const I = { fontFamily:"'Inter',sans-serif" }

const T = [
  { name:'Aisha Namatovu', role:'Teacher, Kampala', stars:5, text:'I used to wake up at 4am to queue for a seat. Now I book from my bed at midnight and my seat is confirmed. Raylane changed how I travel to Mbale every month.' },
  { name:'Moses Tumusiime', role:'Businessman, Mbarara', stars:5, text:'The route analytics for my operator account showed me Mbarara to Kampala fills 90% every Friday. I added a second bus that route. Revenue up 40% in 3 months.' },
  { name:'Grace Achen', role:'Student, Gulu', stars:5, text:'Sent my laptop from Gulu to my mother in Kampala via Raylane parcel. It arrived same day, tracked the whole way. The insurance gave me peace of mind.' },
  { name:'Patrick Sserunjogi', role:'Tour Operator, Kampala', stars:5, text:'We chartered a bus for 50 tourists to Bwindi. The whole process -- quote, payment, driver confirmation -- happened in one WhatsApp conversation with the Raylane team.' },
]

export default function TestimonialsSection() {
  return (
    <section style={{ background:'var(--off-white)', padding:'80px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <div className="section-label" style={{ margin:'0 auto 14px' }}>Testimonials</div>
          <h2 className="section-title">Passengers <span>Love</span> Raylane</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:18 }}>
          {T.map((t, i) => (
            <div key={i} style={{ background:'#fff', borderRadius:'var(--r-lg)', padding:24, border:'1px solid var(--border)', animation:`fadeIn .4s ease ${i*0.1}s both` }}>
              <div style={{ display:'flex', gap:3, marginBottom:14 }}>
                {Array.from({length:t.stars}).map((_,j)=>(
                  <svg key={j} width="16" height="16" fill="#FFC72C" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <p style={{ fontSize:14, ...I, color:'var(--text-secondary)', lineHeight:1.75, marginBottom:16, fontStyle:'italic' }}>"{t.text}"</p>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', ...P, fontWeight:800, fontSize:14, color:'#FFC72C', flexShrink:0 }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ ...P, fontWeight:700, fontSize:14 }}>{t.name}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)', ...I }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

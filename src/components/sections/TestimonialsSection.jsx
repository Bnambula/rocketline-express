import React, { useState, useEffect } from 'react'
import { testimonials } from '../../data'

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  const colors = ['#0B3D91','#8B1A1A','#1a6b1a','#7c3aed','#c2410c']

  return (
    <section style={{ background:'var(--white)', padding:'80px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">What Travelers <span>Say</span></h2>
          <p className="section-sub" style={{ margin:'0 auto' }}>Join millions of satisfied passengers across Uganda and East Africa</p>
        </div>

        {/* Featured testimonial */}
        <div style={{ background:'var(--blue)', borderRadius:24, padding:'40px 48px', color:'var(--white)', marginBottom:32, position:'relative', overflow:'hidden', minHeight:180 }}>
          <div style={{ position:'absolute', top:-20, right:-20, fontSize:120, opacity:0.06, fontFamily:'Georgia', lineHeight:1 }}>"</div>
          <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:24, alignItems:'center' }}>
            <div style={{ width:72, height:72, borderRadius:20, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:900, fontSize:22, color:'var(--blue)', flexShrink:0 }}>
              {testimonials[active].avatar}
            </div>
            <div>
              <div style={{ fontSize:'1.05rem', lineHeight:1.8, opacity:0.95, marginBottom:16, fontStyle:'italic' }}>
                "{testimonials[active].text}"
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16 }}>{testimonials[active].name}</div>
                  <div style={{ opacity:0.7, fontSize:13 }}>{testimonials[active].role} · {testimonials[active].city}</div>
                </div>
                <div style={{ marginLeft:'auto', display:'flex', gap:3 }}>
                  {[...Array(testimonials[active].rating)].map((_,i) => <span key={i} style={{ color:'var(--gold)', fontSize:16 }}>★</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial dots */}
        <div style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:32 }}>
          {testimonials.map((_,i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              width: i===active ? 28 : 10, height:10, borderRadius:5,
              background: i===active ? 'var(--blue)' : 'var(--gray-mid)',
              border:'none', cursor:'pointer', transition:'all 0.3s'
            }}/>
          ))}
        </div>

        {/* All testimonial cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {testimonials.slice(0,3).map((t,i) => (
            <div key={t.id} onClick={() => setActive(i)} style={{ background:'var(--gray-light)', borderRadius:16, padding:22, cursor:'pointer', transition:'all 0.2s', border: active===i ? '2px solid var(--blue)' : '2px solid transparent' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--shadow-md)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:colors[i], display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:900, fontSize:15, color:'white', flexShrink:0 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:14 }}>{t.name}</div>
                  <div style={{ fontSize:12, color:'var(--gray-text)' }}>{t.city}</div>
                </div>
                <div style={{ marginLeft:'auto', display:'flex' }}>
                  {[...Array(t.rating)].map((_,j)=><span key={j} style={{ color:'var(--gold)', fontSize:12 }}>★</span>)}
                </div>
              </div>
              <p style={{ fontSize:13, color:'var(--gray-text)', lineHeight:1.7, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

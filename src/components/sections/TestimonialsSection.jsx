import React, { useState, useEffect } from 'react'
import { testimonials } from '../../data'

const COLORS = ['#0B3D91','#8B1A1A','#1a6b1a','#7c3aed','#c2410c']

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a+1)%testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{ background:'var(--white)', padding:'72px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">What Travelers <span>Say</span></h2>
        </div>

        {/* Featured */}
        <div style={{ background:'var(--blue)', borderRadius:22, padding:'32px 36px', color:'var(--white)', marginBottom:28, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-16, right:-10, fontSize:100, opacity:.06, fontFamily:'Georgia', lineHeight:1 }}>"</div>
          <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:20, alignItems:'center' }}>
            <div style={{ width:64, height:64, borderRadius:18, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:900, fontSize:20, color:'var(--blue)', flexShrink:0 }}>
              {testimonials[active].avatar}
            </div>
            <div>
              <p style={{ fontSize:'1rem', lineHeight:1.8, opacity:.95, marginBottom:14, fontStyle:'italic' }}>
                "{testimonials[active].text}"
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15 }}>{testimonials[active].name}</div>
                  <div style={{ opacity:.7, fontSize:13 }}>{testimonials[active].role} · {testimonials[active].city}</div>
                </div>
                <div style={{ marginLeft:'auto', display:'flex', gap:2 }}>
                  {[...Array(testimonials[active].rating)].map((_,i) => <span key={i} style={{ color:'var(--gold)', fontSize:15 }}>★</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:28 }}>
          {testimonials.map((_,i) => (
            <button key={i} onClick={() => setActive(i)} style={{ width:i===active?26:8, height:8, borderRadius:4, background:i===active?'var(--blue)':'var(--gray-mid)', border:'none', cursor:'pointer', transition:'all .3s' }}/>
          ))}
        </div>

        {/* Cards grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {testimonials.slice(0,3).map((t,i) => (
            <div key={t.id} onClick={() => setActive(i)} style={{ background:'var(--gray-light)', borderRadius:16, padding:18, cursor:'pointer', transition:'all .2s', border:active===i?'2px solid var(--blue)':'2px solid transparent' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--shadow-md)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <div style={{ width:40, height:40, borderRadius:11, background:COLORS[i], display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:900, fontSize:14, color:'white', flexShrink:0 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>{t.name}</div>
                  <div style={{ fontSize:11, color:'var(--gray-text)' }}>{t.city}</div>
                </div>
                <div style={{ marginLeft:'auto', display:'flex' }}>
                  {[...Array(t.rating)].map((_,j)=><span key={j} style={{ color:'var(--gold)', fontSize:11 }}>★</span>)}
                </div>
              </div>
              <p style={{ fontSize:12, color:'var(--gray-text)', lineHeight:1.7, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:600px){.testimonials-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  )
}

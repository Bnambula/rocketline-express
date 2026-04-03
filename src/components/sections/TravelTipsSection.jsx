import React from 'react'
import { travelTips } from '../../data'

const categoryColors = { Safety:'#dcfce7', Savings:'#fef9c3', Routes:'#dbeafe' }
const categoryText = { Safety:'#15803d', Savings:'#92400e', Routes:'#1d4ed8' }

export default function TravelTipsSection() {
  return (
    <section style={{ background:'var(--gray-light)', padding:'80px 0' }}>
      <div className="container">
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:40, flexWrap:'wrap', gap:16 }}>
          <div>
            <div className="section-label">Knowledge Hub</div>
            <h2 className="section-title">Travel Tips & <span>Insights</span></h2>
            <p className="section-sub">Smart advice to help you travel smarter, safer, and cheaper.</p>
          </div>
          <button style={{ padding:'10px 24px', borderRadius:20, background:'var(--blue)', color:'var(--white)', border:'none', fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, cursor:'pointer' }}>
            View All Articles →
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {travelTips.map(tip => (
            <article key={tip.id} style={{ background:'var(--white)', borderRadius:18, overflow:'hidden', boxShadow:'var(--shadow-sm)', cursor:'pointer', transition:'all 0.25s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-5px)';e.currentTarget.style.boxShadow='var(--shadow-xl)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='var(--shadow-sm)'}}>
              <div style={{ height:180, backgroundImage:`url(${tip.image})`, backgroundSize:'cover', backgroundPosition:'center', position:'relative' }}>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.4),transparent)' }}/>
                <span style={{ position:'absolute', top:14, left:14, background:categoryColors[tip.category], color:categoryText[tip.category], padding:'4px 12px', borderRadius:20, fontSize:11, fontFamily:'var(--font-head)', fontWeight:700 }}>{tip.category}</span>
              </div>
              <div style={{ padding:22 }}>
                <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, marginBottom:10, lineHeight:1.4 }}>{tip.title}</h3>
                <p style={{ color:'var(--gray-text)', fontSize:13, lineHeight:1.7, marginBottom:16 }}>{tip.excerpt}</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:12, color:'var(--gray-text)' }}>⏱ {tip.readTime} read</span>
                  <span style={{ color:'var(--blue)', fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>Read More →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

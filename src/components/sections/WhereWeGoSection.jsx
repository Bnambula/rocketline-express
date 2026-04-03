import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routes } from '../../data'

const TABS = ['Uganda', 'East Africa', 'Popular Routes']

const cityCards = [
  { city:'Kampala', from:'Kampala', to:'Mbale', price:25000, img:'https://images.unsplash.com/photo-1572799532398-7de2b5abad5a?w=400&q=80', popular:true },
  { city:'Mbale', from:'Kampala', to:'Mbale', price:25000, img:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80', popular:true },
  { city:'Gulu', from:'Kampala', to:'Gulu', price:35000, img:'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80', popular:false },
  { city:'Nairobi', from:'Kampala', to:'Nairobi', price:60000, img:'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400&q=80', popular:false },
  { city:'Kigali', from:'Kampala', to:'Kigali', price:55000, img:'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80', popular:false },
  { city:'Juba', from:'Kampala', to:'Juba', price:60000, img:'https://images.unsplash.com/photo-1624463029481-3b25f7831a87?w=400&q=80', popular:false },
  { city:'Arua', from:'Kampala', to:'Arua', price:40000, img:'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80', popular:false },
  { city:'Mbarara', from:'Kampala', to:'Mbarara', price:30000, img:'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400&q=80', popular:false },
]

const mapCities = [
  { name:'Kampala', x:42, y:62, isCapital:true, price:null },
  { name:'Mbale', x:67, y:52, price:25000 },
  { name:'Gulu', x:43, y:20, price:35000 },
  { name:'Arua', x:18, y:18, price:40000 },
  { name:'Mbarara', x:32, y:75, price:30000 },
  { name:'Fort Portal', x:22, y:54, price:35000 },
  { name:'Jinja', x:57, y:60, price:15000 },
  { name:'Masaka', x:33, y:68, price:20000 },
]

export default function WhereWeGoSection() {
  const [tab, setTab] = useState('Uganda')
  const [hoveredCity, setHoveredCity] = useState(null)
  const navigate = useNavigate()

  return (
    <section id="where-we-go" style={{ background:'linear-gradient(180deg,#0B3D91 0%,#082d6e 100%)', color:'var(--white)', padding:'80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,199,44,0.15)', padding:'6px 16px', borderRadius:20, marginBottom:14 }}>
            <span style={{ fontSize:14 }}>🌍</span>
            <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)' }}>Coverage</span>
          </div>
          <h2 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:'clamp(1.8rem,3vw,2.6rem)', marginBottom:10 }}>WHERE WE <span style={{ color:'var(--gold)' }}>GO</span></h2>
          <p style={{ opacity:0.75, fontSize:15, maxWidth:500, margin:'0 auto' }}>Connecting You to All Major Cities in Uganda & East Africa</p>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:40 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:'10px 22px', borderRadius:20, border:'none', cursor:'pointer',
              background: tab===t ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
              color: tab===t ? 'var(--blue)' : 'var(--white)',
              fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, transition:'all 0.2s'
            }}>{t}</button>
          ))}
        </div>

        {/* Map + Cards layout */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:32, alignItems:'start' }}>

          {/* Uganda Map SVG */}
          <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:20, padding:24, backdropFilter:'blur(8px)' }}>
            <div style={{ position:'relative', paddingBottom:'110%' }}>
              <svg viewBox="0 0 100 110" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} xmlns="http://www.w3.org/2000/svg">
                {/* Uganda outline simplified */}
                <path d="M28 10 L45 8 L60 12 L72 22 L78 35 L75 50 L72 65 L68 78 L55 88 L42 90 L30 85 L22 75 L18 62 L15 48 L16 32 L22 18 Z"
                  fill="rgba(255,255,255,0.08)" stroke="rgba(255,199,44,0.4)" strokeWidth="0.8"/>
                {/* Route lines from Kampala */}
                {mapCities.filter(c=>!c.isCapital).map(c => (
                  <line key={c.name} x1="42" y1="62" x2={c.x} y2={c.y}
                    stroke="rgba(255,199,44,0.25)" strokeWidth="0.6" strokeDasharray="2,2"/>
                ))}
                {/* City dots */}
                {mapCities.map(c => (
                  <g key={c.name} style={{ cursor:'pointer' }}
                    onMouseEnter={() => setHoveredCity(c.name)}
                    onMouseLeave={() => setHoveredCity(null)}>
                    <circle cx={c.x} cy={c.y} r={c.isCapital ? 3.5 : 2.5}
                      fill={c.isCapital ? 'var(--gold)' : hoveredCity===c.name ? 'var(--gold)' : 'var(--white)'}
                      stroke={c.isCapital ? 'var(--white)' : 'rgba(255,255,255,0.5)'} strokeWidth="0.8"
                      style={{ transition:'all 0.2s' }}/>
                    {c.isCapital && <circle cx={c.x} cy={c.y} r="6" fill="rgba(255,199,44,0.2)" stroke="rgba(255,199,44,0.5)" strokeWidth="0.5"/>}
                    <text x={c.x + (c.x > 50 ? -2 : 4)} y={c.y - 4} fill="white" fontSize="4" fontFamily="Montserrat,sans-serif" fontWeight="bold" textAnchor={c.x>50?"end":"start"}>{c.name}</text>
                    {hoveredCity === c.name && c.price && (
                      <text x={c.x + (c.x > 50 ? -2 : 4)} y={c.y + 8} fill="var(--gold)" fontSize="3.5" fontFamily="Montserrat,sans-serif" fontWeight="bold" textAnchor={c.x>50?"end":"start"}>
                        UGX {(c.price/1000).toFixed(0)}k
                      </text>
                    )}
                  </g>
                ))}
                {/* East Africa countries hint */}
                <text x="82" y="70" fill="rgba(255,255,255,0.3)" fontSize="3.5" fontFamily="Montserrat,sans-serif">Kenya</text>
                <text x="12" y="88" fill="rgba(255,255,255,0.3)" fontSize="3.5" fontFamily="Montserrat,sans-serif">Rwanda</text>
                <text x="42" y="5" fill="rgba(255,255,255,0.3)" fontSize="3.5" fontFamily="Montserrat,sans-serif">S. Sudan</text>
              </svg>
            </div>
            <p style={{ fontSize:12, opacity:0.6, textAlign:'center', marginTop:8, fontFamily:'var(--font-head)' }}>Click a city to see routes</p>
          </div>

          {/* City Cards Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {cityCards.map(card => (
              <div key={card.city} onClick={() => navigate(`/book?from=${card.from}&to=${card.to}`)}
                style={{ background:'rgba(255,255,255,0.07)', borderRadius:14, overflow:'hidden', cursor:'pointer', border:'1px solid rgba(255,255,255,0.1)', transition:'all 0.25s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.14)';e.currentTarget.style.transform='translateY(-3px)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.transform='none'}}>
                <div style={{ height:80, backgroundImage:`url(${card.img})`, backgroundSize:'cover', backgroundPosition:'center', position:'relative' }}>
                  <div style={{ position:'absolute', inset:0, background:'rgba(11,61,145,0.35)' }}/>
                  {card.popular && (
                    <span style={{ position:'absolute', top:8, left:8, background:'var(--gold)', color:'var(--blue)', padding:'2px 8px', borderRadius:10, fontSize:10, fontFamily:'var(--font-head)', fontWeight:800 }}>⭐ Popular</span>
                  )}
                  <span style={{ position:'absolute', bottom:8, left:8, color:'var(--white)', fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>{card.city}</span>
                </div>
                <div style={{ padding:'10px 12px' }}>
                  <div style={{ fontSize:12, opacity:0.7, marginBottom:3 }}>{card.from} → {card.city}</div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:14, color:'var(--gold)' }}>
                    From UGX {card.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            <div onClick={() => navigate('/book')} style={{ gridColumn:'1/-1', background:'var(--gold)', color:'var(--blue)', borderRadius:14, padding:'14px', display:'flex', alignItems:'center', justifyContent:'center', gap:10, cursor:'pointer', fontFamily:'var(--font-head)', fontWeight:800, fontSize:14, transition:'all 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.background='#e6b020'}
              onMouseLeave={e=>e.currentTarget.style.background='var(--gold)'}>
              View All Routes →
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

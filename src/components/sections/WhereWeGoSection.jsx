import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const P = { fontFamily:"'Sora',sans-serif" }
const I = { fontFamily:"'Inter',sans-serif" }

/* Uganda destinations with real approximate coordinates mapped to a 600x520 SVG viewbox */
const DESTINATIONS = [
  { id:'kampala',    name:'Kampala',     x:285, y:295, hub:true,  routes:12, daily:48, pop:'Capital & main hub' },
  { id:'entebbe',    name:'Entebbe',     x:265, y:315, hub:false, routes:4,  daily:16, pop:'Airport gateway' },
  { id:'jinja',      name:'Jinja',       x:340, y:285, hub:false, routes:5,  daily:14, pop:'Source of the Nile' },
  { id:'mbale',      name:'Mbale',       x:400, y:245, hub:true,  routes:8,  daily:22, pop:'Mt Elgon gateway' },
  { id:'tororo',     name:'Tororo',      x:430, y:270, hub:false, routes:3,  daily:8,  pop:'Eastern border' },
  { id:'soroti',     name:'Soroti',      x:380, y:195, hub:false, routes:4,  daily:10, pop:'Teso sub-region' },
  { id:'lira',       name:'Lira',        x:330, y:165, hub:false, routes:5,  daily:12, pop:'Northern gateway' },
  { id:'gulu',       name:'Gulu',        x:295, y:130, hub:true,  routes:8,  daily:20, pop:'Northern capital' },
  { id:'arua',       name:'Arua',        x:210, y:105, hub:false, routes:4,  daily:8,  pop:'West Nile region' },
  { id:'fortportal', name:'Fort Portal', x:195, y:258, hub:true,  routes:7,  daily:18, pop:'Rwenzori foothills' },
  { id:'kasese',     name:'Kasese',      x:175, y:285, hub:false, routes:3,  daily:8,  pop:'Queen Elizabeth NP' },
  { id:'mbarara',    name:'Mbarara',     x:230, y:355, hub:true,  routes:9,  daily:26, pop:'Western capital' },
  { id:'masaka',     name:'Masaka',      x:250, y:340, hub:false, routes:5,  daily:14, pop:'Lake Victoria shore' },
  { id:'kabale',     name:'Kabale',      x:215, y:390, hub:false, routes:4,  daily:10, pop:'Bwindi gateway' },
  { id:'kisoro',     name:'Kisoro',      x:198, y:408, hub:false, routes:2,  daily:6,  pop:'Gorilla trekking' },
  { id:'nairobi',    name:'Nairobi',     x:470, y:360, hub:false, routes:3,  daily:4,  pop:'Kenya' },
  { id:'kigali',     name:'Kigali',      x:175, y:430, hub:false, routes:2,  daily:4,  pop:'Rwanda' },
  { id:'hoima',      name:'Hoima',       x:235, y:215, hub:false, routes:4,  daily:10, pop:'Oil region' },
  { id:'masindi',    name:'Masindi',     x:245, y:188, hub:false, routes:3,  daily:8,  pop:'Murchison Falls' },
  { id:'kotido',     name:'Kotido',      x:350, y:130, hub:false, routes:2,  daily:4,  pop:'Karamoja' },
  { id:'moroto',     name:'Moroto',      x:410, y:150, hub:false, routes:2,  daily:4,  pop:'Karamoja highland' },
]

/* Route lines between major hubs and destinations */
const ROUTES = [
  ['kampala','gulu'],['kampala','mbale'],['kampala','mbarara'],
  ['kampala','fortportal'],['kampala','masaka'],['kampala','jinja'],
  ['kampala','lira'],['kampala','hoima'],['kampala','entebbe'],
  ['gulu','arua'],['gulu','lira'],['mbarara','kabale'],
  ['mbarara','kisoro'],['mbale','soroti'],['mbale','tororo'],
  ['fortportal','kasese'],['masaka','mbarara'],
  ['kampala','nairobi'],['kabale','kigali'],['kampala','kigali'],
  ['masindi','hoima'],['lira','kotido'],['kotido','moroto'],
]

export default function WhereWeGoSection() {
  const navigate  = useNavigate()
  const [hovered, setHovered] = useState(null)
  const [selected,setSelected]= useState(null)

  const active = selected || hovered

  return (
    <section id="where-we-go" style={{ background:'var(--blue)', padding:'80px 0', overflow:'hidden' }}>
      <div className="container">
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:40, flexWrap:'wrap', gap:16 }}>
          <div>
            <div className="section-label" style={{ background:'rgba(255,199,44,.15)', color:'#FFC72C' }}>
              <svg width="12" height="12" fill="#FFC72C" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              Our Routes
            </div>
            <h2 className="section-title" style={{ color:'#fff' }}>Where We <span>Go</span></h2>
            <p className="section-sub" style={{ color:'rgba(255,255,255,.7)' }}>
              {DESTINATIONS.length} destinations across Uganda and East Africa. Daily departures from Kampala Coach Park.
            </p>
          </div>
          <button onClick={() => navigate('/book')}
            style={{ padding:'13px 28px', borderRadius:'var(--r-full)', background:'#FFC72C', color:'#0B3D91', fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:14, border:'none', cursor:'pointer', flexShrink:0 }}>
            Book Any Route
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:28, alignItems:'start' }}>

          {/* SVG Map of Uganda */}
          <div style={{ position:'relative', background:'rgba(255,255,255,.05)', borderRadius:'var(--r-xl)', overflow:'hidden', border:'1px solid rgba(255,255,255,.1)' }}>
            <svg viewBox="0 0 600 520" style={{ width:'100%', maxHeight:520, display:'block' }}>
              {/* Uganda border shape (simplified) */}
              <path d="M180,80 L240,60 L310,55 L370,65 L430,80 L460,120 L470,170 L475,230 L465,290 L460,360 L440,420 L400,460 L350,480 L290,490 L230,480 L185,455 L160,420 L148,380 L145,330 L150,280 L155,230 L160,170 L165,120 Z"
                fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.25)" strokeWidth="1.5"/>

              {/* Lake Victoria */}
              <ellipse cx="310" cy="380" rx="55" ry="42" fill="rgba(96,165,250,.25)" stroke="rgba(96,165,250,.5)" strokeWidth="1"/>
              <text x="310" y="385" textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="9" fontFamily="Inter,sans-serif">Lake Victoria</text>

              {/* Lake Albert */}
              <ellipse cx="158" cy="198" rx="18" ry="34" fill="rgba(96,165,250,.2)" stroke="rgba(96,165,250,.4)" strokeWidth="1"/>

              {/* Lake Edward */}
              <ellipse cx="165" cy="315" rx="16" ry="22" fill="rgba(96,165,250,.2)" stroke="rgba(96,165,250,.4)" strokeWidth="1"/>

              {/* Nile river suggestion */}
              <path d="M295,130 Q300,200 290,280 Q285,310 280,360" stroke="rgba(96,165,250,.35)" strokeWidth="2" fill="none" strokeDasharray="4,3"/>

              {/* Route lines */}
              {ROUTES.map(([aId, bId]) => {
                const a = DESTINATIONS.find(d => d.id === aId)
                const b = DESTINATIONS.find(d => d.id === bId)
                if (!a || !b) return null
                const isActive = active && (active.id === aId || active.id === bId)
                return (
                  <line key={aId+bId} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={isActive ? '#FFC72C' : 'rgba(255,255,255,.18)'}
                    strokeWidth={isActive ? 2 : 1}
                    strokeDasharray={bId === 'nairobi' || bId === 'kigali' ? '5,4' : undefined}
                    style={{ transition:'all .3s' }}/>
                )
              })}

              {/* Destination pins */}
              {DESTINATIONS.map(d => {
                const isActive = active?.id === d.id
                return (
                  <g key={d.id} style={{ cursor:'pointer' }}
                    onMouseEnter={() => setHovered(d)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(selected?.id === d.id ? null : d)}>
                    {/* Pulse ring on hover */}
                    {isActive && <circle cx={d.x} cy={d.y} r={d.hub?16:11} fill="rgba(255,199,44,.2)" stroke="#FFC72C" strokeWidth="1.5" style={{ animation:'pulse 1.5s ease infinite' }}/>}
                    {/* Main pin */}
                    <circle cx={d.x} cy={d.y}
                      r={d.hub ? 8 : 5}
                      fill={isActive ? '#FFC72C' : d.hub ? '#FFC72C' : 'rgba(255,255,255,.85)'}
                      stroke={isActive ? '#fff' : d.hub ? 'rgba(255,255,255,.6)' : 'rgba(255,255,255,.4)'}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      style={{ transition:'all .2s', filter: isActive ? 'drop-shadow(0 0 6px rgba(255,199,44,.8))' : undefined }}/>
                    {/* City name */}
                    {(d.hub || isActive) && (
                      <text x={d.x} y={d.y - (d.hub ? 14 : 10)} textAnchor="middle"
                        fill={isActive ? '#FFC72C' : '#fff'} fontSize={d.hub ? 10 : 9}
                        fontFamily="'Sora',sans-serif" fontWeight={d.hub ? '700' : '600'}
                        style={{ pointerEvents:'none' }}>
                        {d.name}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* Legend */}
              <g transform="translate(20,460)">
                <circle cx="6" cy="6" r="6" fill="#FFC72C"/><text x="16" y="10" fill="rgba(255,255,255,.7)" fontSize="10" fontFamily="Inter,sans-serif">Hub city</text>
                <circle cx="6" cy="24" r="4" fill="rgba(255,255,255,.85)"/><text x="16" y="28" fill="rgba(255,255,255,.7)" fontSize="10" fontFamily="Inter,sans-serif">Destination</text>
                <line x1="2" y1="42" x2="20" y2="42" stroke="rgba(255,255,255,.4)" strokeWidth="1" strokeDasharray="4,3"/><text x="24" y="46" fill="rgba(255,255,255,.7)" fontSize="10" fontFamily="Inter,sans-serif">International</text>
              </g>

              {/* Uganda label */}
              <text x="308" y="200" textAnchor="middle" fill="rgba(255,255,255,.12)" fontSize="32" fontFamily="'Sora',sans-serif" fontWeight="800" letterSpacing="4">UGANDA</text>
            </svg>
          </div>

          {/* Destination info panel */}
          <div>
            {active ? (
              <div style={{ background:'rgba(255,255,255,.1)', borderRadius:'var(--r-xl)', padding:24, border:'1px solid rgba(255,199,44,.3)', animation:'fadeIn .25s ease' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:16 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:'rgba(255,199,44,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="22" height="22" fill="none" stroke="#FFC72C" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <div style={{ ...P, fontWeight:800, fontSize:20, color:'#fff', marginBottom:3 }}>{active.name}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,.6)', ...I }}>{active.pop}</div>
                  </div>
                  {active.hub && <span className="badge badge-gold" style={{ marginLeft:'auto', flexShrink:0 }}>Hub</span>}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
                  {[['Routes',active.routes],['Daily Trips',active.daily],['From','UGX 18,000'],['Duration','1.5 - 8 hrs']].map(([l,v])=>(
                    <div key={l} style={{ background:'rgba(255,255,255,.08)', borderRadius:10, padding:'10px 12px' }}>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,.5)', ...P, fontWeight:600, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{l}</div>
                      <div style={{ ...P, fontWeight:700, fontSize:15, color:'#fff' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate(`/book?to=${active.name}`)}
                  style={{ width:'100%', padding:'13px', borderRadius:'var(--r-full)', background:'#FFC72C', color:'#0B3D91', ...P, fontWeight:800, fontSize:14, border:'none', cursor:'pointer' }}>
                  Book to {active.name}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ ...P, fontWeight:700, fontSize:14, color:'rgba(255,255,255,.6)', marginBottom:14, textTransform:'uppercase', letterSpacing:1, fontSize:11 }}>All Destinations</div>
                <div style={{ display:'flex', flexDirection:'column', gap:6, maxHeight:460, overflowY:'auto' }} className="no-scroll-bar">
                  {DESTINATIONS.map(d => (
                    <button key={d.id} onClick={() => { setSelected(d); setHovered(null) }}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:12, background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.1)', cursor:'pointer', transition:'all .2s', textAlign:'left' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(255,199,44,.15)'; e.currentTarget.style.borderColor='rgba(255,199,44,.3)' }}
                      onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,.1)' }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:d.hub?'#FFC72C':'rgba(255,255,255,.5)', flexShrink:0 }}/>
                      <div style={{ flex:1 }}>
                        <div style={{ ...P, fontWeight:600, fontSize:13, color:'#fff' }}>{d.name}</div>
                        <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', ...I }}>{d.daily} trips/day</div>
                      </div>
                      <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

const NAV = [
  { icon:'📊', label:'Dashboard',  id:'dashboard' },
  { icon:'🚌', label:'Trips',      id:'trips' },
  { icon:'🎫', label:'Bookings',   id:'bookings' },
  { icon:'📦', label:'Parcels',    id:'parcels' },
  { icon:'📍', label:'Map Pins',   id:'mappins' },
  { icon:'🔔', label:'Alerts',     id:'alerts' },
  { icon:'💰', label:'Sacco',      id:'sacco' },
  { icon:'📈', label:'Reports',    id:'reports' },
  { icon:'⚙️', label:'Settings',   id:'settings' },
]

const MOCK_BOOKINGS = [
  { seat:5,  time:'10:00 AM', paid:25000, status:'confirmed', phone:'0771-xxx' },
  { seat:12, time:'10:00 AM', paid:25000, status:'confirmed', phone:'0700-xxx' },
  { seat:23, time:'10:00 AM', paid:25000, status:'pending',   phone:'0752-xxx' },
  { seat:31, time:'10:00 AM', paid:25000, status:'confirmed', phone:'0781-xxx' },
  { seat:44, time:'10:00 AM', paid:25000, status:'confirmed', phone:'0703-xxx' },
]

const MOCK_ALERTS = [
  { type:'booking', icon:'🎫', msg:'New booking – Seat 47 (UGX 25,000)',  time:'2 min ago' },
  { type:'full',    icon:'⚠️', msg:'Bus almost full – 3 seats left!',      time:'15 min ago' },
  { type:'parcel',  icon:'📦', msg:'New parcel request – Kampala→Gulu',   time:'1 hr ago' },
  { type:'payment', icon:'💳', msg:'Payment confirmed – Seat 5, 12, 31',  time:'2 hrs ago' },
]

const SACCO_DATA = {
  totalMembers:120, totalSavings:45600000, outstandingLoans:12800000,
  members:[
    { name:'John Doe',    loan:1000000, savings:500000,  status:'pending',  repaid:0 },
    { name:'Jane Smith',  loan:500000,  savings:800000,  status:'approved', repaid:150000 },
    { name:'Peter Okello',loan:2000000, savings:1200000, status:'repaid',   repaid:2000000 },
  ],
  savingsChart:[18,22,30,28,35,45],
}

export default function OperatorDashboard() {
  const [active, setActive] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mapPin, setMapPin] = useState({ lat:'0.3476', lng:'32.5825', label:'Kampala Coach Park' })
  const [newNotif, setNewNotif] = useState(3)
  const toast = useToast()
  const navigate = useNavigate()

  // Simulate real-time notifications
  useEffect(() => {
    const t = setTimeout(() => {
      toast('🎫 New booking – Seat 47 confirmed (UGX 25,000)', 'success')
      setNewNotif(n => n + 1)
    }, 8000)
    return () => clearTimeout(t)
  }, [])

  const Pill = ({ color, text }) => (
    <span style={{ background:color+'22', color, padding:'3px 9px', borderRadius:20, fontFamily:'var(--font-head)', fontWeight:700, fontSize:10 }}>{text}</span>
  )

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--gray-light)', paddingTop:64 }}>
      {/* Sidebar */}
      <div style={{ width:collapsed?60:188, background:'var(--blue)', transition:'width 0.28s ease', flexShrink:0, display:'flex', flexDirection:'column', overflowY:'auto', overflowX:'hidden' }}>
        <div style={{ padding:'14px 12px', borderBottom:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {!collapsed && <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:12, color:'var(--gold)', whiteSpace:'nowrap' }}>Global Coaches</div>}
          <button onClick={()=>setCollapsed(!collapsed)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:16, padding:2, flexShrink:0 }}>☰</button>
        </div>
        <nav style={{ flex:1, padding:'8px 0' }}>
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>setActive(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:active===item.id?'rgba(255,199,44,0.15)':'none', border:'none', color:active===item.id?'var(--gold)':'rgba(255,255,255,0.72)', cursor:'pointer', fontFamily:'var(--font-head)', fontWeight:600, fontSize:12, borderLeft:active===item.id?'3px solid var(--gold)':'3px solid transparent', transition:'all 0.18s', whiteSpace:'nowrap', position:'relative' }}>
              <span style={{ fontSize:15, flexShrink:0 }}>{item.icon}</span>
              {!collapsed && item.label}
              {item.id==='alerts' && newNotif > 0 && (
                <span style={{ marginLeft:'auto', background:'#ef4444', color:'white', borderRadius:10, padding:'1px 6px', fontSize:9, fontWeight:700, flexShrink:0 }}>{newNotif}</span>
              )}
            </button>
          ))}
        </nav>
        <div style={{ padding:10, borderTop:'1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={()=>navigate('/')} style={{ width:'100%', padding:'9px', borderRadius:9, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)', border:'none', cursor:'pointer', fontFamily:'var(--font-head)', fontWeight:600, fontSize:11 }}>
            {collapsed ? '←' : '← Back to Site'}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:'auto', padding:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <h1 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:20 }}>
            {NAV.find(n=>n.id===active)?.icon} {active==='dashboard'?'Operator Dashboard':NAV.find(n=>n.id===active)?.label}
          </h1>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button onClick={()=>{setActive('alerts');setNewNotif(0)}} style={{ width:34,height:34,borderRadius:9,background:'var(--white)',border:'none',cursor:'pointer',boxShadow:'var(--shadow-sm)',fontSize:14,position:'relative' }}>
              🔔{newNotif>0&&<span style={{ position:'absolute',top:4,right:4,width:8,height:8,borderRadius:'50%',background:'#ef4444' }}/>}
            </button>
            <div style={{ background:'var(--white)', borderRadius:10, padding:'7px 12px', display:'flex', alignItems:'center', gap:8, boxShadow:'var(--shadow-sm)' }}>
              <div style={{ width:26,height:26,borderRadius:7,background:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--white)',fontFamily:'var(--font-head)',fontWeight:900,fontSize:11 }}>GC</div>
              {!collapsed && <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:12 }}>Global Coaches</div>}
            </div>
          </div>
        </div>

        {/* ══ DASHBOARD ══ */}
        {active==='dashboard' && (<>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
            {[["Today's Revenue",'UGX 900,000','💰','#dcfce7','#15803d'],['Bookings Today','36/65','🎫','#dbeafe','#1d4ed8'],['Active Routes','4','🗺️','#fef9c3','#92400e'],['Rating','4.8 ★','⭐','#f3e8ff','#7c3aed']].map(([l,v,ic,bg,c])=>(
              <div key={l} style={{ background:'var(--white)',borderRadius:14,padding:16,boxShadow:'var(--shadow-sm)' }}>
                <div style={{ width:36,height:36,borderRadius:10,background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,marginBottom:10 }}>{ic}</div>
                <div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:18,color:c,marginBottom:3 }}>{v}</div>
                <div style={{ fontSize:12,color:'var(--gray-text)' }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:18 }}>
            <div style={{ background:'var(--white)',borderRadius:16,padding:20,boxShadow:'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:15,marginBottom:16 }}>Today's Trips</h3>
              {[{route:'Kampala → Mbale',vehicle:'UBF 234K',time:'10:00 AM',seats:'36/65',status:'ON TIME',sc:'#22c55e'},{route:'Mbale → Kampala',vehicle:'UBF 234K',time:'4:00 PM',seats:'12/65',status:'SCHEDULED',sc:'#3b82f6'}].map((t,i)=>(
                <div key={i} style={{ display:'grid',gridTemplateColumns:'auto 1fr auto',gap:12,alignItems:'center',padding:'12px 0',borderBottom:i===0?'1px solid var(--gray-mid)':'' }}>
                  <div style={{ width:40,height:40,borderRadius:10,background:'rgba(11,61,145,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>🚌</div>
                  <div>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{t.route}</div>
                    <div style={{ fontSize:11,color:'var(--gray-text)' }}>{t.vehicle} · {t.time} · 🪑 {t.seats}</div>
                  </div>
                  <span style={{ background:t.sc+'18',color:t.sc,padding:'3px 9px',borderRadius:20,fontFamily:'var(--font-head)',fontWeight:700,fontSize:10 }}>{t.status}</span>
                </div>
              ))}
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:14 }}>
                {[['🪑 Seats','Manage'],['👥 Passengers','View list'],['⚠️ Report','Quick action']].map(([l,s])=>(
                  <button key={l} onClick={()=>toast(`${s} opened`,'success')} style={{ padding:'9px 6px',borderRadius:10,background:'var(--blue)',color:'var(--white)',border:'none',fontFamily:'var(--font-head)',fontWeight:700,fontSize:10,cursor:'pointer',textAlign:'center',lineHeight:1.5 }}>{l}<br/><span style={{ opacity:.75,fontSize:9 }}>{s}</span></button>
                ))}
              </div>
            </div>
            <div style={{ background:'var(--white)',borderRadius:16,padding:20,boxShadow:'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:15,marginBottom:16 }}>Recent Bookings</h3>
              {MOCK_BOOKINGS.map((b,i)=>(
                <div key={i} style={{ display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:i<MOCK_BOOKINGS.length-1?'1px solid var(--gray-mid)':'' }}>
                  <div style={{ width:30,height:30,borderRadius:8,background:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--white)',fontFamily:'var(--font-head)',fontWeight:800,fontSize:11,flexShrink:0 }}>S{b.seat}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:12 }}>Seat {b.seat} · {b.phone}</div>
                    <div style={{ fontSize:11,color:'var(--gray-text)' }}>UGX {b.paid.toLocaleString()}</div>
                  </div>
                  <Pill color={b.status==='confirmed'?'#15803d':'#92400e'} text={b.status}/>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* ══ MAP PINS ══ */}
        {active==='mappins' && (
          <div>
            <div style={{ background:'var(--white)',borderRadius:16,padding:24,boxShadow:'var(--shadow-sm)',marginBottom:20 }}>
              <h3 style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:16,marginBottom:6 }}>📍 Boarding Location Pin</h3>
              <p style={{ color:'var(--gray-text)',fontSize:14,marginBottom:20 }}>Set your exact pickup point. Passengers click to get GPS directions.</p>
              {/* Map placeholder */}
              <div style={{ height:240,background:'linear-gradient(135deg,#e8f4fd,#dbeafe)',borderRadius:14,position:'relative',overflow:'hidden',marginBottom:20,border:'2px solid #bfdbfe' }}>
                <div style={{ position:'absolute',inset:0,backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 24px,rgba(11,61,145,0.06) 24px,rgba(11,61,145,0.06) 25px),repeating-linear-gradient(90deg,transparent,transparent 24px,rgba(11,61,145,0.06) 24px,rgba(11,61,145,0.06) 25px)' }}/>
                <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:8 }}>
                  {/* Pin */}
                  <div style={{ position:'absolute',top:'38%',left:'52%',transform:'translate(-50%,-100%)',display:'flex',flexDirection:'column',alignItems:'center' }}>
                    <div style={{ width:36,height:36,borderRadius:'50% 50% 50% 0',background:'#ef4444',transform:'rotate(-45deg)',boxShadow:'0 4px 12px rgba(239,68,68,0.5)' }}/>
                    <div style={{ width:8,height:8,borderRadius:'50%',background:'#ef4444',marginTop:-4 }}/>
                    <div style={{ background:'var(--white)',borderRadius:8,padding:'4px 10px',marginTop:4,fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,color:'var(--blue)',boxShadow:'var(--shadow-md)',whiteSpace:'nowrap' }}>{mapPin.label}</div>
                  </div>
                  <div style={{ position:'absolute',bottom:14,right:14 }}>
                    <button onClick={()=>toast('Opening Google Maps...','success')} style={{ padding:'8px 16px',borderRadius:20,background:'var(--blue)',color:'var(--white)',border:'none',fontFamily:'var(--font-head)',fontWeight:700,fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',gap:6 }}>
                      🗺️ Open in Google Maps
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14 }}>
                {[['Latitude',mapPin.lat,e=>setMapPin({...mapPin,lat:e.target.value})],['Longitude',mapPin.lng,e=>setMapPin({...mapPin,lng:e.target.value})]].map(([l,v,fn])=>(
                  <div key={l}>
                    <label style={{ fontSize:11,fontWeight:700,color:'var(--gray-text)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:6 }}>{l}</label>
                    <input value={v} onChange={fn} style={{ width:'100%',border:'1.5px solid var(--gray-mid)',borderRadius:10,padding:'10px 12px',fontSize:14,fontFamily:'var(--font-head)',fontWeight:600,boxSizing:'border-box' }}/>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11,fontWeight:700,color:'var(--gray-text)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:6 }}>Location Label</label>
                <input value={mapPin.label} onChange={e=>setMapPin({...mapPin,label:e.target.value})} placeholder="e.g. Kampala Coach Park, Gate 3" style={{ width:'100%',border:'1.5px solid var(--gray-mid)',borderRadius:10,padding:'10px 12px',fontSize:14,fontFamily:'var(--font-head)',fontWeight:600,boxSizing:'border-box' }}/>
              </div>
              <button onClick={()=>toast('📍 Boarding location saved! Passengers can now get directions.','success')} style={{ width:'100%',padding:'13px',borderRadius:14,background:'var(--blue)',color:'var(--white)',border:'none',fontFamily:'var(--font-head)',fontWeight:800,fontSize:15,cursor:'pointer' }}>
                📍 Save Boarding Location
              </button>
            </div>
            <div style={{ background:'#eff6ff',borderRadius:14,padding:16,border:'1px solid #bfdbfe' }}>
              <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:14,color:'#1d4ed8',marginBottom:8 }}>How passengers use this</div>
              <div style={{ fontSize:13,color:'#1d4ed8',lineHeight:1.8 }}>
                1. Passenger books a ticket<br/>
                2. Ticket shows a "Get Directions" button<br/>
                3. Button opens Google Maps to your exact pin<br/>
                4. Passenger uses phone GPS to navigate to your boarding point
              </div>
            </div>
          </div>
        )}

        {/* ══ ALERTS ══ */}
        {active==='alerts' && (
          <div style={{ background:'var(--white)',borderRadius:16,padding:22,boxShadow:'var(--shadow-sm)' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
              <h3 style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:16 }}>🔔 Real-Time Notifications</h3>
              <button onClick={()=>{setNewNotif(0);toast('All marked as read','success')}} style={{ padding:'6px 14px',borderRadius:14,background:'var(--gray-light)',border:'none',fontFamily:'var(--font-head)',fontWeight:700,fontSize:12,cursor:'pointer' }}>Mark all read</button>
            </div>
            {MOCK_ALERTS.map((a,i)=>(
              <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:12,padding:'14px 0',borderBottom:i<MOCK_ALERTS.length-1?'1px solid var(--gray-mid)':'',background:i===0?'#eff6ff':'' }}>
                <div style={{ width:40,height:40,borderRadius:12,background:'var(--gray-light)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0 }}>{a.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13,marginBottom:3 }}>{a.msg}</div>
                  <div style={{ fontSize:11,color:'var(--gray-text)' }}>{a.time}</div>
                </div>
                {i===0&&<span style={{ background:'#dbeafe',color:'#1d4ed8',padding:'2px 8px',borderRadius:10,fontSize:10,fontFamily:'var(--font-head)',fontWeight:700,flexShrink:0 }}>NEW</span>}
              </div>
            ))}
          </div>
        )}

        {/* ══ SACCO ══ */}
        {active==='sacco' && (
          <div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20 }}>
              {[['Total Members',SACCO_DATA.totalMembers,'👥','#dbeafe','#1d4ed8'],['Total Savings','UGX '+Math.round(SACCO_DATA.totalSavings/1e6)+'M','💰','#dcfce7','#15803d'],['Outstanding Loans','UGX '+Math.round(SACCO_DATA.outstandingLoans/1e6)+'M','📋','#fef9c3','#92400e']].map(([l,v,ic,bg,c])=>(
                <div key={l} style={{ background:'var(--white)',borderRadius:14,padding:18,boxShadow:'var(--shadow-sm)',display:'flex',gap:12,alignItems:'center' }}>
                  <div style={{ width:44,height:44,borderRadius:12,background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0 }}>{ic}</div>
                  <div>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:18,color:c }}>{v}</div>
                    <div style={{ fontSize:12,color:'var(--gray-text)' }}>{l}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:18 }}>
              <div style={{ background:'var(--white)',borderRadius:16,padding:22,boxShadow:'var(--shadow-sm)' }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16 }}>
                  <h3 style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:15 }}>Members & Loans</h3>
                  <button onClick={()=>toast('New loan application modal','success')} style={{ padding:'7px 14px',borderRadius:14,background:'var(--blue)',color:'var(--white)',border:'none',fontFamily:'var(--font-head)',fontWeight:700,fontSize:12,cursor:'pointer' }}>+ New Loan</button>
                </div>
                {SACCO_DATA.members.map((m,i)=>(
                  <div key={i} style={{ display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:i<SACCO_DATA.members.length-1?'1px solid var(--gray-mid)':'' }}>
                    <div style={{ width:34,height:34,borderRadius:8,background:'var(--blue)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-head)',fontWeight:800,fontSize:12,flexShrink:0 }}>{m.name[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{m.name}</div>
                      <div style={{ fontSize:11,color:'var(--gray-text)' }}>Loan: UGX {m.loan.toLocaleString()} · Savings: UGX {m.savings.toLocaleString()}</div>
                      {m.repaid > 0 && <div style={{ fontSize:11,color:'#15803d' }}>Repaid: UGX {m.repaid.toLocaleString()}</div>}
                    </div>
                    <Pill color={m.status==='approved'?'#15803d':m.status==='repaid'?'#1d4ed8':'#92400e'} text={m.status}/>
                  </div>
                ))}
              </div>
              <div style={{ background:'var(--white)',borderRadius:16,padding:22,boxShadow:'var(--shadow-sm)' }}>
                <h3 style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:15,marginBottom:16 }}>Savings Growth</h3>
                <div style={{ display:'flex',alignItems:'flex-end',gap:8,height:120,padding:'0 4px' }}>
                  {SACCO_DATA.savingsChart.map((v,i)=>(
                    <div key={i} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4 }}>
                      <div style={{ width:'100%',background:'var(--blue)',borderRadius:'4px 4px 0 0',height:`${(v/50)*100}%`,minHeight:8 }}/>
                      <span style={{ fontSize:9,color:'var(--gray-text)' }}>{['J','F','M','A','M','J'][i]}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:16,background:'var(--gray-light)',borderRadius:12,padding:14 }}>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13,marginBottom:8 }}>E-Passbook</div>
                  <button onClick={()=>toast('E-Passbook PDF generating…','success')} style={{ width:'100%',padding:'10px',borderRadius:10,background:'var(--blue)',color:'var(--white)',border:'none',fontFamily:'var(--font-head)',fontWeight:700,fontSize:13,cursor:'pointer' }}>📋 Download E-Passbook</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generic placeholder */}
        {!['dashboard','mappins','alerts','sacco'].includes(active) && (
          <div style={{ background:'var(--white)',borderRadius:16,padding:36,boxShadow:'var(--shadow-sm)',textAlign:'center' }}>
            <div style={{ fontSize:52,marginBottom:14 }}>{NAV.find(n=>n.id===active)?.icon}</div>
            <h3 style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:20,marginBottom:8 }}>{NAV.find(n=>n.id===active)?.label}</h3>
            <p style={{ color:'var(--gray-text)',maxWidth:380,margin:'0 auto',fontSize:14 }}>Connect to the Raylane backend API to power this module.</p>
          </div>
        )}
      </div>
    </div>
  )
}

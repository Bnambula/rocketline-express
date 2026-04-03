import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

/* ── NAV ITEMS ── */
const NAV = [
  { icon:'📊', label:'Dashboard',    id:'dashboard' },
  { icon:'➕', label:'Add Trip',     id:'addtrip' },
  { icon:'🚌', label:'My Trips',     id:'trips' },
  { icon:'🎫', label:'Bookings',     id:'bookings' },
  { icon:'📦', label:'Parcels',      id:'parcels' },
  { icon:'💳', label:'Payments',     id:'payments' },
  { icon:'👥', label:'Staff/HR',     id:'hr' },
  { icon:'📍', label:'Map Pin',      id:'mappins' },
  { icon:'🔔', label:'Alerts',       id:'alerts', badge:3 },
  { icon:'💰', label:'Sacco',        id:'sacco', locked:true },
  { icon:'📈', label:'Reports',      id:'reports' },
  { icon:'⚙️', label:'Settings',     id:'settings' },
]

/* ── MOCK DATA ── */
const TRIPS = [
  { id:'T001', route:'Kampala → Mbale', vehicle:'UBF 234K', type:'55-Seater Coach', departs:'10:00 AM', date:'2026-05-12', seats:55, booked:36, price:25000, status:'approved', revenue:900000 },
  { id:'T002', route:'Mbale → Kampala', vehicle:'UBF 234K', type:'55-Seater Coach', departs:'4:00 PM',  date:'2026-05-12', seats:55, booked:12, price:25000, status:'approved', revenue:300000 },
  { id:'T003', route:'Kampala → Gulu',  vehicle:'UAR 512B', type:'67-Seater Coach', departs:'7:00 AM',  date:'2026-05-13', seats:67, booked:0,  price:35000, status:'pending',  revenue:0 },
]

const BOOKINGS = [
  { id:'RLX-001', seat:'5',  phone:'0771-xxx-xxx', amount:25000, method:'MTN MoMo',    status:'confirmed', trip:'Kampala→Mbale', time:'10:00 AM' },
  { id:'RLX-002', seat:'12', phone:'0700-xxx-xxx', amount:25000, method:'Airtel Money', status:'confirmed', trip:'Kampala→Mbale', time:'10:00 AM' },
  { id:'RLX-003', seat:'23', phone:'0752-xxx-xxx', amount:25000, method:'MTN MoMo',    status:'pending',   trip:'Kampala→Mbale', time:'10:00 AM' },
  { id:'RLX-004', seat:'31', phone:'0781-xxx-xxx', amount:25000, method:'Airtel Money', status:'confirmed', trip:'Kampala→Mbale', time:'10:00 AM' },
  { id:'RLX-005', seat:'44', phone:'0703-xxx-xxx', amount:25000, method:'MTN MoMo',    status:'confirmed', trip:'Kampala→Mbale', time:'10:00 AM' },
]

const PARCELS_DATA = [
  { id:'PCL-001', type:'Small Parcel', from:'Kampala', to:'Mbale', sender:'0771-xxx', recipient:'0752-xxx', amount:12000, status:'in-transit', scan:'On Board UBF 234K' },
  { id:'PCL-002', type:'Envelope',     from:'Kampala', to:'Gulu',  sender:'0700-xxx', recipient:'0703-xxx', amount:5000,  status:'pending',    scan:'Pickup scheduled' },
]

const STAFF = [
  { name:'James Okello',   role:'Dispatcher',    phone:'0771-111-222', status:'active',   salary:800000 },
  { name:'Sarah Nakato',   role:'Loading Clerk', phone:'0700-333-444', status:'active',   salary:600000 },
  { name:'Peter Mwesiga',  role:'Accountant',    phone:'0752-555-666', status:'on-leave', salary:1000000 },
]

const SACCO_DATA = {
  totalMembers:120, totalSavings:45600000, outstandingLoans:12800000,
  members:[
    { name:'John Doe',     loan:1000000, savings:500000,  status:'pending',  repaid:0 },
    { name:'Jane Smith',   loan:500000,  savings:800000,  status:'approved', repaid:150000 },
    { name:'Peter Okello', loan:2000000, savings:1200000, status:'repaid',   repaid:2000000 },
  ],
  chart:[18,22,30,28,35,45],
}

const ALERTS = [
  { icon:'🎫', type:'booking', msg:'New booking – Seat 47, UGX 25,000',    time:'2 min ago',  trip:'T001' },
  { icon:'⚠️', type:'warning', msg:'Bus almost full – 3 seats remaining',   time:'14 min ago', trip:'T001' },
  { icon:'📦', type:'parcel',  msg:'New parcel request – Kampala→Gulu',    time:'1 hr ago',   trip:null },
  { icon:'✅', type:'success', msg:'Trip T003 pending admin approval',       time:'2 hrs ago',  trip:'T003' },
  { icon:'💳', type:'payment', msg:'Payment confirmed – Seats 5, 12, 31',   time:'3 hrs ago',  trip:'T001' },
]

const VEHICLES = ['UBF 234K – 55-Seater Coach','UAR 512B – 67-Seater Coach','UAK 890C – 65-Seater Coach','UBJ 110X – 14-Seater Taxi']

/* ── HELPERS ── */
const fmt = n => 'UGX ' + n.toLocaleString()
const Pill = ({ color, bg, text }) => (
  <span style={{ background:bg||color+'18', color, padding:'3px 9px', borderRadius:20, fontFamily:'var(--font-head)', fontWeight:700, fontSize:10, whiteSpace:'nowrap' }}>{text}</span>
)
const Card = ({ children, style }) => (
  <div style={{ background:'var(--white)', borderRadius:16, padding:20, boxShadow:'var(--shadow-sm)', ...style }}>{children}</div>
)
const SectionHead = ({ title, action, onAction }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, gap:10, flexWrap:'wrap' }}>
    <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, margin:0 }}>{title}</h3>
    {action && <button onClick={onAction} style={{ padding:'7px 14px', borderRadius:20, background:'var(--blue)', color:'var(--white)', border:'none', fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, cursor:'pointer' }}>{action}</button>}
  </div>
)

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
export default function OperatorDashboard() {
  const [active, setActive] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [trips, setTrips] = useState(TRIPS)
  const [alerts, setAlerts] = useState(ALERTS)
  const [tripForm, setTripForm] = useState({ route_from:'Kampala', route_to:'', vehicle:'', departs:'', date:'', price:'', seats:'', notes:'' })
  const toast = useToast()
  const navigate = useNavigate()

  // Simulate incoming notification
  useEffect(() => {
    const t = setTimeout(() => { toast('🎫 New booking — Seat 47 confirmed (UGX 25,000)', 'success') }, 10000)
    return () => clearTimeout(t)
  }, [])

  const submitTrip = e => {
    e.preventDefault()
    if (!tripForm.route_to || !tripForm.vehicle || !tripForm.departs || !tripForm.price) { toast('Please fill all required fields', 'warning'); return }
    const newTrip = { id:`T00${trips.length+1}`, route:`${tripForm.route_from} → ${tripForm.route_to}`, vehicle:tripForm.vehicle.split('–')[0].trim(), type:tripForm.vehicle.split('–')[1]?.trim()||'Coach', departs:tripForm.departs, date:tripForm.date||'TBD', seats:parseInt(tripForm.seats)||55, booked:0, price:parseInt(tripForm.price.replace(/,/g,'')), status:'pending', revenue:0 }
    setTrips(t => [newTrip, ...t])
    toast('✅ Trip submitted! Awaiting Raylane Admin approval.', 'success')
    setActive('trips')
    setTripForm({ route_from:'Kampala', route_to:'', vehicle:'', departs:'', date:'', price:'', seats:'', notes:'' })
  }

  const Sidebar = () => (
    <div className="dash-sidebar" style={{ width:collapsed?60:180, background:'var(--blue)', flexShrink:0, display:'flex', flexDirection:'column', transition:'width .28s', overflowX:'hidden', overflowY:'auto' }}>
      <div style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'space-between', minHeight:52 }}>
        {!collapsed && <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:11, color:'var(--gold)', whiteSpace:'nowrap', overflow:'hidden' }}>Global Coaches</div>}
        <button onClick={() => setCollapsed(!collapsed)} style={{ color:'rgba(255,255,255,0.7)', flexShrink:0, padding:2 }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
      </div>
      <nav style={{ flex:1, padding:'6px 0', display:'flex', flexDirection:'column' }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => { if(item.locked){toast('Sacco module requires a paid subscription. Contact Raylane to activate.','warning');return}; setActive(item.id) }} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 14px', background:active===item.id?'rgba(255,199,44,0.14)':'none', color:active===item.id?'var(--gold)':'rgba(255,255,255,0.75)', borderLeft:active===item.id?'3px solid var(--gold)':'3px solid transparent', fontFamily:'var(--font-head)', fontWeight:600, fontSize:11, whiteSpace:'nowrap', transition:'all .18s', position:'relative', opacity:item.locked?.6:1 }}>
            <span style={{ fontSize:14, flexShrink:0 }}>{item.icon}</span>
            {!collapsed && <><span>{item.label}</span>{item.locked&&<span style={{ marginLeft:'auto', fontSize:9, opacity:.7 }}>🔒</span>}{item.badge&&<span style={{ marginLeft:'auto', background:'#ef4444', color:'white', borderRadius:10, padding:'1px 5px', fontSize:9 }}>{item.badge}</span>}</>}
          </button>
        ))}
      </nav>
      <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => navigate('/')} style={{ width:'100%', padding:'8px', borderRadius:8, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.65)', fontFamily:'var(--font-head)', fontWeight:600, fontSize:10 }}>
          {collapsed?'←':'← Back to Site'}
        </button>
      </div>
    </div>
  )

  const inputS = { width:'100%', border:'1.5px solid var(--gray-mid)', borderRadius:10, padding:'11px 12px', fontSize:14, fontFamily:'var(--font-head)', fontWeight:500, boxSizing:'border-box', WebkitAppearance:'none' }

  return (
    <div className="dash-wrap" style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--gray-light)', paddingTop:'var(--nav-h)' }}>
      <Sidebar />

      <div className="dash-main" style={{ flex:1, overflowY:'auto', padding:20 }}>
        {/* Header */}
        <div className="dash-header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, gap:12 }}>
          <h1 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:'clamp(16px,2.5vw,20px)', margin:0 }}>
            {NAV.find(n=>n.id===active)?.icon} {active==='dashboard'?'Operator Dashboard':NAV.find(n=>n.id===active)?.label}
          </h1>
          <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
            <button onClick={()=>{setActive('alerts')}} style={{ width:34,height:34,borderRadius:9,background:'var(--white)',boxShadow:'var(--shadow-sm)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,position:'relative' }}>
              🔔<span style={{ position:'absolute',top:4,right:4,width:8,height:8,borderRadius:'50%',background:'#ef4444' }}/>
            </button>
            <div style={{ background:'var(--white)',borderRadius:10,padding:'6px 12px',display:'flex',alignItems:'center',gap:8,boxShadow:'var(--shadow-sm)' }}>
              <div style={{ width:26,height:26,borderRadius:7,background:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--white)',fontFamily:'var(--font-head)',fontWeight:900,fontSize:10,flexShrink:0 }}>GC</div>
              <div className="hide-mobile">
                <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:11 }}>Global Coaches</div>
                <div style={{ fontSize:9,color:'var(--gray-text)' }}>Operator Account</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── DASHBOARD ── */}
        {active==='dashboard' && (<>
          <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
            {[["Today's Revenue",'UGX 1.2M','💰','#dcfce7','#15803d','+8%'],['Bookings Today','48/122','🎫','#dbeafe','#1d4ed8','Live'],['Active Routes','2','🗺️','#fef9c3','#92400e','Running'],['Avg Rating','4.8 ★','⭐','#f3e8ff','#7c3aed','312 reviews']].map(([l,v,ic,bg,c,sub])=>(
              <Card key={l}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10 }}>
                  <div style={{ width:36,height:36,borderRadius:9,background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17 }}>{ic}</div>
                  <Pill color={c} text={sub}/>
                </div>
                <div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:18,color:c }}>{v}</div>
                <div style={{ fontSize:11,color:'var(--gray-text)',marginTop:2 }}>{l}</div>
              </Card>
            ))}
          </div>
          <div className="two-col" style={{ display:'grid',gridTemplateColumns:'1.3fr 1fr',gap:16,marginBottom:16 }}>
            <Card>
              <SectionHead title="Today's Trips" action="+ Add Trip" onAction={()=>setActive('addtrip')}/>
              {trips.filter(t=>t.status==='approved').map((t,i)=>(
                <div key={t.id} style={{ display:'grid',gridTemplateColumns:'auto 1fr auto',gap:12,alignItems:'center',padding:'12px 0',borderBottom:i<1?'1px solid var(--gray-mid)':'' }}>
                  <div style={{ width:40,height:40,borderRadius:10,background:'rgba(11,61,145,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>🚌</div>
                  <div>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{t.route}</div>
                    <div style={{ fontSize:11,color:'var(--gray-text)' }}>{t.vehicle} · {t.departs}</div>
                    <div style={{ fontSize:11,color:'var(--gray-text)',marginTop:2 }}>🪑 {t.booked}/{t.seats} · {fmt(t.revenue)}</div>
                  </div>
                  <Pill color='#15803d' text='ON TIME'/>
                </div>
              ))}
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:14 }}>
                {[['🪑 Seats','Manage'],['👥 Passengers','View'],['⚠️ Report','Flag issue']].map(([l,s])=>(
                  <button key={l} onClick={()=>toast(`${s} — connect to backend`,'success')} style={{ padding:'9px 6px',borderRadius:10,background:'var(--blue)',color:'var(--white)',fontFamily:'var(--font-head)',fontWeight:700,fontSize:10,textAlign:'center',lineHeight:1.5 }}>
                    {l}<br/><span style={{ opacity:.75,fontSize:9 }}>{s}</span>
                  </button>
                ))}
              </div>
            </Card>
            <Card>
              <SectionHead title="Recent Bookings" action="View All" onAction={()=>setActive('bookings')}/>
              {BOOKINGS.slice(0,4).map((b,i)=>(
                <div key={b.id} style={{ display:'flex',alignItems:'center',gap:9,padding:'9px 0',borderBottom:i<3?'1px solid var(--gray-mid)':'' }}>
                  <div style={{ width:30,height:30,borderRadius:8,background:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--white)',fontFamily:'var(--font-head)',fontWeight:800,fontSize:10,flexShrink:0 }}>S{b.seat}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:12,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{b.phone}</div>
                    <div style={{ fontSize:10,color:'var(--gray-text)' }}>{b.method}</div>
                  </div>
                  <Pill color={b.status==='confirmed'?'#15803d':'#92400e'} text={b.status}/>
                </div>
              ))}
            </Card>
          </div>
          {/* Revenue mini chart */}
          <Card>
            <SectionHead title="Weekly Revenue Overview"/>
            <div style={{ display:'flex',alignItems:'flex-end',gap:6,height:100,marginBottom:10 }}>
              {[30,55,40,80,65,90,75].map((v,i)=>(
                <div key={i} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4 }}>
                  <div style={{ width:'100%',background:i===5?'var(--gold)':'var(--blue)',borderRadius:'4px 4px 0 0',height:`${v}%`,transition:'height .4s',opacity:i===5?1:.75 }}/>
                  <span style={{ fontSize:9,color:'var(--gray-text)' }}>{['M','T','W','T','F','S','S'][i]}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--gray-text)' }}>
              <span>Week Total: <strong style={{ color:'var(--blue)' }}>UGX 8.4M</strong></span>
              <span>Commission paid: <strong style={{ color:'#dc2626' }}>UGX 672K</strong></span>
              <span>Net: <strong style={{ color:'#15803d' }}>UGX 7.73M</strong></span>
            </div>
          </Card>
        </>)}

        {/* ── ADD TRIP ── */}
        {active==='addtrip' && (
          <Card>
            <div style={{ background:'#eff6ff',borderRadius:12,padding:'12px 16px',marginBottom:22,fontSize:13,color:'#1d4ed8',fontFamily:'var(--font-head)',fontWeight:600,border:'1px solid #bfdbfe',lineHeight:1.6 }}>
              ℹ️ After submission, <strong>Raylane Admin</strong> will review, approve or edit your trip before it goes live. You'll receive a notification once approved.
            </div>
            <form onSubmit={submitTrip}>
              <div className="two-col" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14 }}>
                {[['Origin City *','route_from','text','e.g. Kampala'],['Destination City *','route_to','text','e.g. Mbale'],['Date of Trip *','date','date',''],['Departure Time *','departs','time','']].map(([l,k,t,ph])=>(
                  <div key={k}>
                    <label style={{ fontSize:10,fontWeight:700,color:'var(--gray-text)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:1.5,display:'block',marginBottom:5 }}>{l}</label>
                    <input type={t} placeholder={ph} value={tripForm[k]} onChange={e=>setTripForm({...tripForm,[k]:e.target.value})} style={inputS}/>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:10,fontWeight:700,color:'var(--gray-text)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:1.5,display:'block',marginBottom:5 }}>Vehicle *</label>
                <select value={tripForm.vehicle} onChange={e=>setTripForm({...tripForm,vehicle:e.target.value})} style={inputS}>
                  <option value="">-- Select your vehicle --</option>
                  {VEHICLES.map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="two-col" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14 }}>
                <div>
                  <label style={{ fontSize:10,fontWeight:700,color:'var(--gray-text)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:1.5,display:'block',marginBottom:5 }}>Ticket Price (UGX) *</label>
                  <input type="number" placeholder="e.g. 25000" value={tripForm.price} onChange={e=>setTripForm({...tripForm,price:e.target.value})} style={inputS}/>
                </div>
                <div>
                  <label style={{ fontSize:10,fontWeight:700,color:'var(--gray-text)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:1.5,display:'block',marginBottom:5 }}>Total Seats</label>
                  <input type="number" placeholder="e.g. 55" value={tripForm.seats} onChange={e=>setTripForm({...tripForm,seats:e.target.value})} style={inputS}/>
                </div>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:10,fontWeight:700,color:'var(--gray-text)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:1.5,display:'block',marginBottom:5 }}>Notes for Admin (optional)</label>
                <textarea rows={3} placeholder="Special instructions, route stops, amenities…" value={tripForm.notes} onChange={e=>setTripForm({...tripForm,notes:e.target.value})} style={{ ...inputS, resize:'none' }}/>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 2fr',gap:12 }}>
                <button type="button" onClick={()=>setActive('trips')} style={{ padding:'13px',borderRadius:14,background:'var(--gray-light)',color:'var(--dark)',fontFamily:'var(--font-head)',fontWeight:700,fontSize:14 }}>Cancel</button>
                <button type="submit" style={{ padding:'13px',borderRadius:14,background:'var(--gold)',color:'var(--blue)',fontFamily:'var(--font-head)',fontWeight:800,fontSize:15 }}>
                  🚀 Submit Trip for Approval
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* ── MY TRIPS ── */}
        {active==='trips' && (
          <div>
            <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:14 }}>
              <button onClick={()=>setActive('addtrip')} style={{ padding:'10px 20px',borderRadius:20,background:'var(--blue)',color:'var(--white)',fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>+ Add New Trip</button>
            </div>
            {trips.map(t=>(
              <Card key={t.id} style={{ marginBottom:12 }}>
                <div style={{ display:'flex',alignItems:'flex-start',gap:14,flexWrap:'wrap' }}>
                  <div style={{ flex:1,minWidth:200 }}>
                    <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:6,flexWrap:'wrap' }}>
                      <span style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:16 }}>{t.route}</span>
                      <Pill color={t.status==='approved'?'#15803d':t.status==='pending'?'#92400e':'#dc2626'} text={t.status==='approved'?'✅ Live':'⏳ Pending Approval'}/>
                    </div>
                    <div style={{ display:'flex',gap:16,flexWrap:'wrap',fontSize:13,color:'var(--gray-text)',marginBottom:8 }}>
                      <span>🚌 {t.vehicle}</span><span>🕐 {t.departs}</span><span>📅 {t.date}</span>
                    </div>
                    <div style={{ display:'flex',gap:16,flexWrap:'wrap',fontSize:13 }}>
                      <span>🪑 <strong>{t.booked}/{t.seats}</strong> booked</span>
                      <span style={{ color:'#15803d',fontFamily:'var(--font-head)',fontWeight:700 }}>{fmt(t.revenue)}</span>
                      <span style={{ color:'var(--gray-text)' }}>@ {fmt(t.price)}/seat</span>
                    </div>
                  </div>
                  {t.status==='approved'&&(
                    <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
                      <button onClick={()=>toast('Opening seat manager…','success')} style={{ padding:'8px 14px',borderRadius:12,background:'var(--blue)',color:'var(--white)',fontFamily:'var(--font-head)',fontWeight:700,fontSize:12 }}>Manage Seats</button>
                      <button onClick={()=>toast('Passenger list downloaded','success')} style={{ padding:'8px 14px',borderRadius:12,background:'var(--gray-light)',color:'var(--dark)',fontFamily:'var(--font-head)',fontWeight:700,fontSize:12 }}>Passengers</button>
                    </div>
                  )}
                  {t.status==='pending'&&<Pill color='#92400e' text='Awaiting admin review'/>}
                </div>
                {/* Capacity bar */}
                <div style={{ marginTop:12 }}>
                  <div style={{ height:6,background:'var(--gray-mid)',borderRadius:3,overflow:'hidden' }}>
                    <div style={{ height:'100%',width:`${(t.booked/t.seats)*100}%`,background:t.booked/t.seats>.9?'#dc2626':t.booked/t.seats>.6?'var(--gold)':'var(--blue)',borderRadius:3,transition:'width .5s' }}/>
                  </div>
                  <div style={{ fontSize:10,color:'var(--gray-text)',marginTop:3 }}>{Math.round((t.booked/t.seats)*100)}% full · {t.seats-t.booked} seats available</div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {active==='bookings' && (
          <Card>
            <SectionHead title="All Bookings"/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%',borderCollapse:'collapse',minWidth:480 }}>
                <thead><tr style={{ borderBottom:'2px solid var(--gray-mid)' }}>
                  {['Booking ID','Seat','Trip','Method','Amount','Status'].map(h=>(
                    <th key={h} style={{ padding:'8px 10px',fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,color:'var(--gray-text)',textAlign:'left',whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{BOOKINGS.map((b,i)=>(
                  <tr key={b.id} style={{ borderBottom:'1px solid var(--gray-mid)' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--gray-light)'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}>
                    <td style={{ padding:'11px 10px',fontFamily:'var(--font-head)',fontWeight:700,fontSize:12,color:'var(--blue)',whiteSpace:'nowrap' }}>{b.id}</td>
                    <td style={{ padding:'11px 10px',fontSize:13 }}>Seat {b.seat}</td>
                    <td style={{ padding:'11px 10px',fontSize:12,color:'var(--gray-text)',whiteSpace:'nowrap' }}>{b.trip}</td>
                    <td style={{ padding:'11px 10px',fontSize:12 }}>{b.method}</td>
                    <td style={{ padding:'11px 10px',fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{fmt(b.amount)}</td>
                    <td style={{ padding:'11px 10px' }}><Pill color={b.status==='confirmed'?'#15803d':'#92400e'} text={b.status}/></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ── PARCELS ── */}
        {active==='parcels' && (
          <div>
            <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:14 }}>
              <button onClick={()=>{ navigate('/parcels') }} style={{ padding:'10px 20px',borderRadius:20,background:'var(--blue)',color:'var(--white)',fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>+ New Parcel</button>
            </div>
            {PARCELS_DATA.map((p,i)=>(
              <Card key={p.id} style={{ marginBottom:12 }}>
                <div style={{ display:'flex',alignItems:'center',gap:14,flexWrap:'wrap' }}>
                  <div style={{ fontSize:28,flexShrink:0 }}>📦</div>
                  <div style={{ flex:1,minWidth:160 }}>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:14,marginBottom:4 }}>{p.type} — {p.from} → {p.to}</div>
                    <div style={{ fontSize:12,color:'var(--gray-text)',marginBottom:4 }}>Sender: {p.sender} · Recipient: {p.recipient}</div>
                    <div style={{ fontSize:12,color:'var(--gray-text)' }}>📍 {p.scan}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:16,color:'var(--blue)' }}>{fmt(p.amount)}</div>
                    <Pill color={p.status==='in-transit'?'#1d4ed8':'#92400e'} text={p.status}/>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {active==='payments' && (
          <div>
            <div className="stat-grid" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:18 }}>
              {[['Total Collected','UGX 1.2M','💰','#dcfce7','#15803d'],['Pending Payout','UGX 900K','⏳','#fef9c3','#92400e'],['Commission Paid','UGX 96K','💎','#dbeafe','#1d4ed8']].map(([l,v,ic,bg,c])=>(
                <Card key={l}>
                  <div style={{ width:36,height:36,borderRadius:9,background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,marginBottom:10 }}>{ic}</div>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:18,color:c }}>{v}</div>
                  <div style={{ fontSize:11,color:'var(--gray-text)',marginTop:2 }}>{l}</div>
                </Card>
              ))}
            </div>
            <Card>
              <SectionHead title="Payment History"/>
              {BOOKINGS.map((b,i)=>(
                <div key={b.id} style={{ display:'flex',alignItems:'center',gap:12,padding:'11px 0',borderBottom:i<BOOKINGS.length-1?'1px solid var(--gray-mid)':'' }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:b.method.includes('MTN')?'#fffbeb':'#fff5f5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>{b.method.includes('MTN')?'📱':'📲'}</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{b.id} — Seat {b.seat}</div>
                    <div style={{ fontSize:11,color:'var(--gray-text)' }}>{b.method} · {b.trip}</div>
                  </div>
                  <div style={{ textAlign:'right',flexShrink:0 }}>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:13,color:'var(--blue)' }}>{fmt(b.amount)}</div>
                    <Pill color={b.status==='confirmed'?'#15803d':'#92400e'} text={b.status}/>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── STAFF / HR ── */}
        {active==='hr' && (
          <div>
            <div style={{ background:'#eff6ff',borderRadius:12,padding:'12px 16px',marginBottom:18,fontSize:13,color:'#1d4ed8',fontFamily:'var(--font-head)',fontWeight:600,border:'1px solid #bfdbfe' }}>
              ℹ️ Staff management is a <strong>premium Raylane feature</strong>. User accounts and permissions are created by Raylane Admin only.
            </div>
            <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:14 }}>
              <button onClick={()=>toast('Contact Raylane to add staff accounts','warning')} style={{ padding:'10px 20px',borderRadius:20,background:'var(--blue)',color:'var(--white)',fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>+ Request Staff Account</button>
            </div>
            {STAFF.map((s,i)=>(
              <Card key={i} style={{ marginBottom:12 }}>
                <div style={{ display:'flex',alignItems:'center',gap:14,flexWrap:'wrap' }}>
                  <div style={{ width:44,height:44,borderRadius:12,background:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--white)',fontFamily:'var(--font-head)',fontWeight:900,fontSize:15,flexShrink:0 }}>{s.name[0]}</div>
                  <div style={{ flex:1,minWidth:140 }}>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:15 }}>{s.name}</div>
                    <div style={{ fontSize:12,color:'var(--gray-text)',marginTop:2 }}>{s.role} · {s.phone}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:14,color:'var(--blue)',marginBottom:4 }}>{fmt(s.salary)}/mo</div>
                    <Pill color={s.status==='active'?'#15803d':'#92400e'} text={s.status}/>
                  </div>
                </div>
              </Card>
            ))}
            <Card style={{ marginTop:14,background:'var(--gray-light)' }}>
              <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:14,marginBottom:12 }}>Role Permissions</div>
              {[['Dispatcher','Trips, seat assignment, boarding management'],['Loading Clerk','Mark passengers boarded, seat updates only'],['Accountant','View payments, reports, and invoices']].map(([r,d])=>(
                <div key={r} style={{ display:'flex',gap:10,marginBottom:10,alignItems:'flex-start' }}>
                  <div style={{ width:8,height:8,borderRadius:'50%',background:'var(--blue)',marginTop:5,flexShrink:0 }}/>
                  <div><strong style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{r}:</strong> <span style={{ fontSize:13,color:'var(--gray-text)' }}>{d}</span></div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── MAP PIN ── */}
        {active==='mappins' && (
          <Card>
            <SectionHead title="📍 Boarding Location Pin"/>
            <p style={{ color:'var(--gray-text)',fontSize:14,marginBottom:20,lineHeight:1.7 }}>Set your exact pickup point. Passengers will see a "Get Directions" button on their digital ticket that opens Google Maps to this pin using their phone GPS.</p>
            <div style={{ height:200,background:'linear-gradient(135deg,#e8f4fd,#dbeafe)',borderRadius:14,border:'2px solid #bfdbfe',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20,position:'relative',overflow:'hidden' }}>
              <div style={{ position:'absolute',inset:0,backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 22px,rgba(11,61,145,0.05) 22px,rgba(11,61,145,0.05) 23px),repeating-linear-gradient(90deg,transparent,transparent 22px,rgba(11,61,145,0.05) 22px,rgba(11,61,145,0.05) 23px)' }}/>
              <div style={{ textAlign:'center',position:'relative',zIndex:1 }}>
                <div style={{ fontSize:36,marginBottom:6 }}>📍</div>
                <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:14,color:'var(--blue)' }}>Kampala Coach Park</div>
                <div style={{ fontSize:12,color:'var(--gray-text)',marginTop:4 }}>0.3476° N, 32.5825° E</div>
              </div>
            </div>
            <div className="two-col" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14 }}>
              {[['Latitude','0.3476'],['Longitude','32.5825'],['Location Label','Kampala Coach Park']].slice(0,2).map(([l,v])=>(
                <div key={l}>
                  <label style={{ fontSize:10,fontWeight:700,color:'var(--gray-text)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:1.5,display:'block',marginBottom:5 }}>{l}</label>
                  <input defaultValue={v} style={{ width:'100%',border:'1.5px solid var(--gray-mid)',borderRadius:10,padding:'11px 12px',fontSize:14,fontFamily:'var(--font-head)',fontWeight:600,boxSizing:'border-box' }}/>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:10,fontWeight:700,color:'var(--gray-text)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:1.5,display:'block',marginBottom:5 }}>Location Label</label>
              <input defaultValue="Kampala Coach Park, Gate 3" style={{ width:'100%',border:'1.5px solid var(--gray-mid)',borderRadius:10,padding:'11px 12px',fontSize:14,fontFamily:'var(--font-head)',fontWeight:600,boxSizing:'border-box' }}/>
            </div>
            <button onClick={()=>toast('📍 Boarding location saved!','success')} style={{ width:'100%',padding:'13px',borderRadius:14,background:'var(--blue)',color:'var(--white)',fontFamily:'var(--font-head)',fontWeight:800,fontSize:15 }}>
              📍 Save Boarding Location
            </button>
          </Card>
        )}

        {/* ── ALERTS ── */}
        {active==='alerts' && (
          <Card>
            <SectionHead title="🔔 Real-Time Notifications" action="Mark all read" onAction={()=>toast('All marked read','success')}/>
            {alerts.map((a,i)=>(
              <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:12,padding:'13px 0',borderBottom:i<alerts.length-1?'1px solid var(--gray-mid)':'',background:i===0?'#eff6ff':'',borderRadius:i===0?8:0,paddingLeft:i===0?8:0 }}>
                <div style={{ width:38,height:38,borderRadius:10,background:'var(--gray-light)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>{a.icon}</div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{a.msg}</div>
                  <div style={{ fontSize:11,color:'var(--gray-text)',marginTop:2 }}>{a.time}</div>
                </div>
                {i===0&&<span style={{ background:'#dbeafe',color:'#1d4ed8',padding:'2px 8px',borderRadius:10,fontSize:9,fontFamily:'var(--font-head)',fontWeight:700,flexShrink:0 }}>NEW</span>}
              </div>
            ))}
          </Card>
        )}

        {/* ── SACCO (locked) ── */}
        {active==='sacco' && (
          <div>
            <Card style={{ marginBottom:16,background:'linear-gradient(135deg,var(--blue),var(--blue-dark))',color:'var(--white)' }}>
              <div style={{ textAlign:'center',padding:'20px 0' }}>
                <div style={{ fontSize:48,marginBottom:12 }}>🏦</div>
                <h3 style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:20,marginBottom:8 }}>Sacco Module</h3>
                <div style={{ background:'rgba(255,199,44,0.2)',borderRadius:12,padding:'12px 16px',marginBottom:16,display:'inline-block' }}>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:14,color:'var(--gold)' }}>🔒 Premium Feature</div>
                  <div style={{ fontSize:12,opacity:.85,marginTop:4 }}>Activate with a monthly subscription</div>
                </div>
                <p style={{ opacity:.85,fontSize:14,lineHeight:1.7,marginBottom:20 }}>
                  The Raylane Sacco module lets you run a complete internal savings & credit cooperative for your staff and members. Raylane provides the platform — your Sacco manages its own funds.
                </p>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20 }}>
                  {[['👥 Member Registration','Onboard & manage members'],['💳 Loan Applications','Apply, approve, track'],['💰 Savings Tracking','Individual e-passbooks'],['📊 Repayment Monitor','Schedules & alerts']].map(([t,d])=>(
                    <div key={t} style={{ background:'rgba(255,255,255,0.1)',borderRadius:12,padding:14,textAlign:'left' }}>
                      <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13,marginBottom:4 }}>{t}</div>
                      <div style={{ fontSize:11,opacity:.8 }}>{d}</div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>toast('Contact Raylane Express to activate your Sacco module: +256 700 000 000','success')} style={{ padding:'14px 32px',borderRadius:20,background:'var(--gold)',color:'var(--blue)',fontFamily:'var(--font-head)',fontWeight:800,fontSize:15 }}>
                  Contact Raylane to Activate
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* ── REPORTS ── */}
        {active==='reports' && (
          <div>
            <div className="stat-grid" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:18 }}>
              {[['This Month Revenue','UGX 8.4M','📈'],['Total Bookings','284','🎫'],['Avg Occupancy','74%','🪑']].map(([l,v,ic])=>(
                <Card key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:28,marginBottom:8 }}>{ic}</div>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:20,color:'var(--blue)' }}>{v}</div>
                  <div style={{ fontSize:12,color:'var(--gray-text)',marginTop:4 }}>{l}</div>
                </Card>
              ))}
            </div>
            <Card>
              <SectionHead title="Monthly Performance" action="Export CSV" onAction={()=>toast('Report exporting…','success')}/>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%',borderCollapse:'collapse',minWidth:400 }}>
                  <thead><tr style={{ borderBottom:'2px solid var(--gray-mid)' }}>
                    {['Month','Trips','Bookings','Revenue','Commission','Net'].map(h=>(
                      <th key={h} style={{ padding:'8px 10px',fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,color:'var(--gray-text)',textAlign:'left',whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {[['Apr 2026',8,284,'8,400,000','672,000','7,728,000'],['Mar 2026',7,241,'7,100,000','568,000','6,532,000'],['Feb 2026',6,198,'5,800,000','464,000','5,336,000']].map(([m,...rest],i)=>(
                      <tr key={m} style={{ borderBottom:'1px solid var(--gray-mid)' }}>
                        <td style={{ padding:'10px',fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{m}</td>
                        {rest.map((v,j)=><td key={j} style={{ padding:'10px',fontSize:13,color:j===4?'#15803d':j===3?'#dc2626':'var(--dark)',fontFamily:j>=2?'var(--font-head)':'' }}>{j>=2?'UGX ':''}{v}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {active==='settings' && (
          <div className="two-col" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:18 }}>
            <Card>
              <SectionHead title="Company Profile"/>
              {[['Company Name','Global Coaches Ltd'],['Registration No.','UG-2019-00123'],['MoMo Number','0771-234-567'],['Contact Email','info@globalcoaches.ug'],['Physical Address','Kampala Coach Park, Booth 14']].map(([l,v])=>(
                <div key={l} style={{ marginBottom:14 }}>
                  <label style={{ fontSize:10,fontWeight:700,color:'var(--gray-text)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:1.5,display:'block',marginBottom:5 }}>{l}</label>
                  <input defaultValue={v} style={{ width:'100%',border:'1.5px solid var(--gray-mid)',borderRadius:10,padding:'10px 12px',fontSize:13,fontFamily:'var(--font-head)',fontWeight:600,boxSizing:'border-box' }}/>
                </div>
              ))}
              <button onClick={()=>toast('Profile saved','success')} style={{ width:'100%',padding:'12px',borderRadius:14,background:'var(--blue)',color:'var(--white)',fontFamily:'var(--font-head)',fontWeight:800,fontSize:14 }}>Save Profile</button>
            </Card>
            <Card>
              <SectionHead title="Premium Features"/>
              {[['Sacco Module','Savings & loans for your staff','🔒 Contact Raylane','#fef9c3','#92400e'],['HR Management','Full staff records & payroll','🔒 Contact Raylane','#fef9c3','#92400e'],['Advanced Analytics','Detailed route & revenue data','✅ Active','#dcfce7','#15803d'],['Priority Support','24/7 dedicated support line','✅ Active','#dcfce7','#15803d']].map(([t,d,s,bg,c])=>(
                <div key={t} style={{ display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid var(--gray-mid)' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{t}</div>
                    <div style={{ fontSize:11,color:'var(--gray-text)' }}>{d}</div>
                  </div>
                  <Pill color={c} text={s}/>
                </div>
              ))}
              <button onClick={()=>toast('Contact Raylane: +256 700 000 000','success')} style={{ width:'100%',marginTop:14,padding:'12px',borderRadius:14,background:'var(--gold)',color:'var(--blue)',fontFamily:'var(--font-head)',fontWeight:800,fontSize:14 }}>
                Upgrade Features
              </button>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

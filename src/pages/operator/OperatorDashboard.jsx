import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOperatorStore } from '../../hooks/useStore'
import { useToast } from '../../hooks/useToast'
import { Card, StatCard, Pill, SectionHead, BarChart, ProgressBar, Banner, Modal, Btn, Input, Select, EmptyState } from '../../components/ui/SharedComponents'
import { BusSeat55, BusSeat65, BusSeat67, TaxiSeat14, SeatLegend } from '../../components/ui/SeatMaps'

// Active operator — in production, from auth context
const ACTIVE_OP_ID = 'op-001'

const SEAT_TYPES = ['55','65','67','14']
const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka','Kabale','Entebbe']
const VEHICLES_MOCK = ['UBF 234K – 55-Seater','UAR 512B – 67-Seater','UAK 890C – 65-Seater','UBJ 110X – 14-Seater Taxi']

const MODULE_LABELS = {
  booking_basic:'Booking',parcel_basic:'Parcels',financial_module:'Financials',
  fuel_module:'Fuel',loan_tracking:'Bank Loans',sacco_module:'Sacco',
  analytics_module:'Analytics',hr_module:'Staff/HR',fleet_module:'Fleet'
}
const MODULE_ICONS = {
  booking_basic:'🎫',parcel_basic:'📦',financial_module:'💰',fuel_module:'⛽',
  loan_tracking:'🏦',sacco_module:'🏛️',analytics_module:'📊',hr_module:'👥',fleet_module:'🔧'
}
const MODULE_PRICES = { financial_module:100000,fuel_module:80000,loan_tracking:150000,sacco_module:200000,analytics_module:100000,hr_module:100000,fleet_module:120000 }
const fmt = n => 'UGX ' + Number(n).toLocaleString()

export default function OperatorDashboard() {
  const { state, store, op, trips, bookings, notifications, unreadCount } = useOperatorStore(ACTIVE_OP_ID)
  const [active, setActive]     = useState('dashboard')
  const [tripForm, setTripForm] = useState({ from:'Kampala', to:'', vehicle:'', seat_type:'55', date:'', departs:'', price:'', notes:'', boarding_label:'', boarding_lat:'', boarding_lng:'' })
  const [tripErrors, setTripErrors] = useState({})
  const [reqModal, setReqModal] = useState(null)
  const [selectedSeatTrip, setSelectedSeatTrip] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const toast = useToast()
  const navigate = useNavigate()

  if (!op) return <div style={{ padding:40, textAlign:'center' }}>Loading operator…</div>

  const activeModules = Object.entries(op.modules||{}).filter(([,v])=>v.status==='ACTIVE').map(([k])=>k)
  const inactiveModules = Object.entries(op.modules||{}).filter(([,v])=>v.status==='INACTIVE').map(([k])=>k)

  const isActive = (mod) => op.modules[mod]?.status==='ACTIVE'

  const validateTrip = () => {
    const e={}
    if(!tripForm.to)       e.to='Destination required'
    if(!tripForm.vehicle)  e.vehicle='Select a vehicle'
    if(!tripForm.date)     e.date='Date required'
    if(!tripForm.departs)  e.departs='Departure time required'
    if(!tripForm.price||isNaN(tripForm.price)) e.price='Valid price required'
    setTripErrors(e)
    return Object.keys(e).length===0
  }

  const submitTrip = () => {
    if(!validateTrip()) { toast('Please fill all required fields','warning'); return }
    const seat_label = tripForm.vehicle.split('–')[1]?.trim()||''
    const seat_type = seat_label.includes('67')?'67':seat_label.includes('65')?'65':seat_label.includes('55')?'55':'14'
    store.createTrip({
      operator_id:op.id, operator_name:op.company_name,
      plate:tripForm.vehicle.split('–')[0].trim(),
      from:tripForm.from, to:tripForm.to,
      date:tripForm.date, departs:tripForm.departs,
      seat_type, price:parseInt(tripForm.price),
      seats_total:parseInt(seat_type)||55, seats_booked:0,
      boarding_pin:{ lat:parseFloat(tripForm.boarding_lat)||op.boarding_pin?.lat||0, lng:parseFloat(tripForm.boarding_lng)||op.boarding_pin?.lng||0, label:tripForm.boarding_label||op.boarding_pin?.label||'' },
      notes:tripForm.notes
    })
    toast('✅ Trip submitted for Raylane Admin approval. You\'ll be notified when it goes live.','success')
    setActive('trips')
    setTripForm({ from:'Kampala', to:'', vehicle:'', seat_type:'55', date:'', departs:'', price:'', notes:'', boarding_label:'', boarding_lat:'', boarding_lng:'' })
  }

  const SeatComp = selectedSeatTrip ? { '55':BusSeat55,'65':BusSeat65,'67':BusSeat67,'14':TaxiSeat14 }[selectedSeatTrip.seat_type]||BusSeat55 : null

  /* ── SIDEBAR ── */
  const NAV_ITEMS = [
    { id:'dashboard', icon:'📊', label:'Dashboard' },
    { id:'addtrip',   icon:'➕', label:'Add Trip' },
    { id:'trips',     icon:'🚌', label:'My Trips' },
    { id:'seats',     icon:'💺', label:'Seat Manager' },
    { id:'bookings',  icon:'🎫', label:'Bookings' },
    { id:'parcels',   icon:'📦', label:'Parcels', mod:'parcel_basic' },
    { id:'payments',  icon:'💳', label:'Payments' },
    { id:'alerts',    icon:'🔔', label:'Alerts', badge:true },
    // Premium modules
    { id:'financial', icon:'💰', label:'Financials', mod:'financial_module', premium:true },
    { id:'fuel',      icon:'⛽', label:'Fuel',        mod:'fuel_module',      premium:true },
    { id:'loans',     icon:'🏦', label:'Bank Loans',  mod:'loan_tracking',    premium:true },
    { id:'sacco',     icon:'🏛️', label:'Sacco',       mod:'sacco_module',     premium:true, sacco:true },
    { id:'analytics', icon:'📊', label:'Analytics',   mod:'analytics_module', premium:true },
    { id:'hr',        icon:'👥', label:'Staff/HR',     mod:'hr_module',        premium:true },
    { id:'fleet',     icon:'🔧', label:'Fleet',        mod:'fleet_module',     premium:true },
    { id:'mappins',   icon:'📍', label:'Map Pin' },
    { id:'reports',   icon:'📈', label:'Reports' },
    { id:'settings',  icon:'⚙️', label:'Settings' },
  ]

  const Sidebar = () => (
    <div className="dash-sidebar" style={{ width:192, background:'var(--blue)', flexShrink:0, display:'flex', flexDirection:'column', overflowY:'auto' }}>
      <div style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.12)', minHeight:52 }}>
        <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:12, color:'var(--gold)', marginBottom:2 }}>{op.company_name}</div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.6)' }}>{op.merchant_code}</div>
      </div>
      <nav style={{ flex:1, padding:'6px 0', display:'flex', flexDirection:'column' }}>
        {NAV_ITEMS.map(item=>{
          if(item.mod && !isActive(item.mod)) {
            return (
              <button key={item.id} onClick={()=>setReqModal({mod:item.mod})}
                style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 14px', background:'none', color:'rgba(255,255,255,0.35)', borderLeft:'3px solid transparent', fontFamily:'var(--font-head)', fontWeight:600, fontSize:11, whiteSpace:'nowrap', border:'none', cursor:'pointer', width:'100%', textAlign:'left' }}>
                <span style={{ fontSize:13, flexShrink:0 }}>{item.icon}</span>
                <span style={{ flex:1 }}>{item.label}</span>
                <span style={{ fontSize:9, opacity:.7, flexShrink:0 }}>🔒</span>
              </button>
            )
          }
          const badge=item.badge?unreadCount:0
          return (
            <button key={item.id} onClick={()=>setActive(item.id)}
              style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 14px', background:active===item.id?'rgba(255,199,44,0.14)':'none', color:active===item.id?'var(--gold)':'rgba(255,255,255,0.78)', borderLeft:`3px solid ${active===item.id?'var(--gold)':'transparent'}`, fontFamily:'var(--font-head)', fontWeight:600, fontSize:11, whiteSpace:'nowrap', transition:'all .18s', border:'none', cursor:'pointer', width:'100%', textAlign:'left' }}>
              <span style={{ fontSize:13, flexShrink:0 }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {badge>0&&<span style={{ background:'#ef4444', color:'white', borderRadius:10, padding:'1px 5px', fontSize:9, fontWeight:700, flexShrink:0 }}>{badge}</span>}
            </button>
          )
        })}
      </nav>
      <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={()=>navigate('/')} style={{ width:'100%', padding:'8px', borderRadius:8, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)', border:'none', cursor:'pointer', fontFamily:'var(--font-head)', fontWeight:600, fontSize:10 }}>← Back to Site</button>
      </div>
    </div>
  )

  const inS = { width:'100%', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'11px 12px', fontSize:14, fontFamily:'var(--font-head)', fontWeight:500, boxSizing:'border-box', WebkitAppearance:'none', outline:'none' }

  return (
    <div className="dash-wrap" style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--gray-light)', paddingTop:'var(--nav-h)' }}>
      <Sidebar />
      <div className="dash-main" style={{ flex:1, overflowY:'auto', padding:20 }}>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, gap:12, flexWrap:'wrap' }}>
          <h1 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:'clamp(15px,2vw,20px)', margin:0 }}>
            {NAV_ITEMS.find(n=>n.id===active)?.icon||'📊'} {active==='dashboard'?'Operator Dashboard':NAV_ITEMS.find(n=>n.id===active)?.label||active}
          </h1>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {unreadCount>0&&<span style={{ background:'#fee2e2', color:'#dc2626', padding:'4px 12px', borderRadius:20, fontFamily:'var(--font-head)', fontWeight:700, fontSize:12 }}>🔔 {unreadCount}</span>}
            <div style={{ background:'var(--white)', borderRadius:10, padding:'6px 12px', display:'flex', alignItems:'center', gap:8, boxShadow:'var(--shadow-sm)' }}>
              <div style={{ width:26, height:26, borderRadius:7, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--white)', fontFamily:'var(--font-head)', fontWeight:900, fontSize:10, flexShrink:0 }}>{op.company_name[0]}</div>
              <span className="hide-mobile" style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:12 }}>{op.company_name}</span>
            </div>
          </div>
        </div>

        {/* ── DASHBOARD ── */}
        {active==='dashboard' && (<>
          <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
            <StatCard icon="💰" label="Revenue Today"  value={fmt(bookings.filter(b=>b.status==='CONFIRMED').length*25000)} sub="+8%" bg="#dcfce7" color="#15803d"/>
            <StatCard icon="🎫" label="Bookings Today" value={bookings.length}                                              sub="Live"  bg="#dbeafe" color="#1d4ed8"/>
            <StatCard icon="🚌" label="Active Trips"   value={trips.filter(t=>t.status==='APPROVED').length}                sub="LIVE"  bg="#fef9c3" color="#92400e"/>
            <StatCard icon="⭐" label="Rating"         value={op.rating+' ★'}                                              sub={op.reviews+' reviews'} bg="#f3e8ff" color="#7c3aed"/>
          </div>

          {/* Active modules bar */}
          <div style={{ background:'var(--white)', borderRadius:14, padding:'12px 16px', marginBottom:14, boxShadow:'var(--shadow-sm)', display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ fontSize:12, color:'var(--gray-text)', fontFamily:'var(--font-head)', fontWeight:600, flexShrink:0 }}>Active modules:</span>
            {activeModules.map(m=>(
              <span key={m} style={{ background:'#dcfce7', color:'#15803d', padding:'3px 10px', borderRadius:10, fontSize:11, fontFamily:'var(--font-head)', fontWeight:700 }}>{MODULE_ICONS[m]} {MODULE_LABELS[m]}</span>
            ))}
            {inactiveModules.length>0&&<span style={{ fontSize:11, color:'var(--gray-text)', fontFamily:'var(--font-head)' }}>+{inactiveModules.length} available to unlock</span>}
          </div>

          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:14, marginBottom:14 }}>
            <Card>
              <SectionHead title="Today's Trips" action="+ Add Trip" onAction={()=>setActive('addtrip')}/>
              {trips.filter(t=>t.status==='APPROVED').length===0
                ? <EmptyState icon="🚌" title="No approved trips yet" desc="Submit a trip and wait for admin approval." action="Add Trip" onAction={()=>setActive('addtrip')}/>
                : trips.filter(t=>t.status==='APPROVED').slice(0,2).map((t,i)=>(
                  <div key={t.id} style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', gap:12, alignItems:'center', padding:'12px 0', borderBottom:i===0?'1px solid var(--gray-mid)':'' }}>
                    <div style={{ width:40,height:40,borderRadius:10,background:'rgba(11,61,145,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>🚌</div>
                    <div>
                      <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{t.from} → {t.to}</div>
                      <div style={{ fontSize:11,color:'var(--gray-text)' }}>{t.plate} · {t.departs} · 🪑 {t.seats_booked}/{t.seats_total}</div>
                    </div>
                    <Pill text="LIVE" color="#15803d"/>
                  </div>
                ))}
              {trips.filter(t=>t.status==='PENDING_APPROVAL').length>0&&(
                <div style={{ marginTop:10, background:'#fff3cd', borderRadius:10, padding:'8px 12px', fontSize:12, color:'#92400e', fontFamily:'var(--font-head)', fontWeight:600 }}>
                  ⏳ {trips.filter(t=>t.status==='PENDING_APPROVAL').length} trip(s) awaiting admin approval
                </div>
              )}
            </Card>
            <Card>
              <SectionHead title="Recent Bookings" action="View All" onAction={()=>setActive('bookings')}/>
              {bookings.length===0
                ? <EmptyState icon="🎫" title="No bookings yet"/>
                : bookings.slice(0,4).map((b,i)=>(
                  <div key={b.id} style={{ display:'flex',alignItems:'center',gap:9,padding:'9px 0',borderBottom:i<3?'1px solid var(--gray-mid)':'' }}>
                    <div style={{ width:30,height:30,borderRadius:8,background:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontFamily:'var(--font-head)',fontWeight:800,fontSize:10,flexShrink:0 }}>S{b.seat}</div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:12,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{b.phone} · {b.method}</div>
                      <div style={{ fontSize:10,color:'var(--gray-text)' }}>{fmt(b.amount)}</div>
                    </div>
                    <Pill text={b.status} color={b.status==='CONFIRMED'?'#15803d':'#92400e'}/>
                  </div>
                ))}
            </Card>
          </div>

          <Card>
            <SectionHead title="Revenue This Week"/>
            <BarChart data={[30,55,40,80,65,90,75]} labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']} height={80} highlightLast/>
          </Card>
        </>)}

        {/* ── ADD TRIP ── */}
        {active==='addtrip' && (
          <Card>
            <Banner type="info">After submitting, <strong>Raylane Admin</strong> reviews and approves your trip before it goes live. You'll get an instant notification when approved. Admin may edit the price or time if needed.</Banner>
            <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:5 }}>Origin City *</label>
                <select value={tripForm.from} onChange={e=>setTripForm({...tripForm,from:e.target.value})} style={inS}>
                  {CITIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:5 }}>Destination City *</label>
                <select value={tripForm.to} onChange={e=>setTripForm({...tripForm,to:e.target.value})} style={{ ...inS, borderColor:tripErrors.to?'#dc2626':undefined }}>
                  <option value="">-- Select destination --</option>
                  {CITIES.filter(c=>c!==tripForm.from).map(c=><option key={c}>{c}</option>)}
                </select>
                {tripErrors.to&&<div style={{ color:'#dc2626',fontSize:11,marginTop:3 }}>{tripErrors.to}</div>}
              </div>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:5 }}>Vehicle (Reg No.) *</label>
                <select value={tripForm.vehicle} onChange={e=>setTripForm({...tripForm,vehicle:e.target.value})} style={{ ...inS, borderColor:tripErrors.vehicle?'#dc2626':undefined }}>
                  <option value="">-- Select vehicle --</option>
                  {VEHICLES_MOCK.map(v=><option key={v}>{v}</option>)}
                </select>
                {tripErrors.vehicle&&<div style={{ color:'#dc2626',fontSize:11,marginTop:3 }}>{tripErrors.vehicle}</div>}
              </div>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:5 }}>Date *</label>
                <input type="date" value={tripForm.date} onChange={e=>setTripForm({...tripForm,date:e.target.value})} min={new Date().toISOString().split('T')[0]} style={{ ...inS, borderColor:tripErrors.date?'#dc2626':undefined }}/>
                {tripErrors.date&&<div style={{ color:'#dc2626',fontSize:11,marginTop:3 }}>{tripErrors.date}</div>}
              </div>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:5 }}>Departure Time *</label>
                <input type="time" value={tripForm.departs} onChange={e=>setTripForm({...tripForm,departs:e.target.value})} style={{ ...inS, borderColor:tripErrors.departs?'#dc2626':undefined }}/>
                {tripErrors.departs&&<div style={{ color:'#dc2626',fontSize:11,marginTop:3 }}>{tripErrors.departs}</div>}
              </div>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:5 }}>Ticket Price (UGX) *</label>
                <input type="number" placeholder="e.g. 25000" value={tripForm.price} onChange={e=>setTripForm({...tripForm,price:e.target.value})} style={{ ...inS, borderColor:tripErrors.price?'#dc2626':undefined }}/>
                {tripErrors.price&&<div style={{ color:'#dc2626',fontSize:11,marginTop:3 }}>{tripErrors.price}</div>}
              </div>
            </div>

            {/* Boarding location */}
            <div style={{ background:'var(--gray-light)', borderRadius:14, padding:16, marginBottom:14 }}>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, marginBottom:10, color:'var(--gray-text)', textTransform:'uppercase', letterSpacing:1 }}>📍 Boarding Location</div>
              <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                {[['Label','boarding_label','Kampala Coach Park Gate 3','text'],['Latitude','boarding_lat','0.3476','number'],['Longitude','boarding_lng','32.5825','number']].map(([l,k,ph,t])=>(
                  <div key={k}>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:5 }}>{l}</label>
                    <input type={t} placeholder={ph} value={tripForm[k]} onChange={e=>setTripForm({...tripForm,[k]:e.target.value})} style={inS}/>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11, color:'var(--gray-text)', marginTop:6 }}>Passengers will see a "Get Directions" button that opens Google Maps to this exact location.</div>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:5 }}>Notes for Admin (optional)</label>
              <textarea rows={2} placeholder="Amenities, stops, special instructions…" value={tripForm.notes} onChange={e=>setTripForm({...tripForm,notes:e.target.value})} style={{ ...inS, resize:'none', lineHeight:1.6 }}/>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10 }}>
              <Btn variant="ghost" full onClick={()=>setActive('trips')}>Cancel</Btn>
              <Btn variant="gold" full size="lg" onClick={submitTrip} icon="🚀">Submit for Admin Approval</Btn>
            </div>
          </Card>
        )}

        {/* ── MY TRIPS ── */}
        {active==='trips' && (<>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
            <Btn variant="blue" icon="➕" onClick={()=>setActive('addtrip')}>Add New Trip</Btn>
          </div>
          {trips.length===0
            ? <EmptyState icon="🚌" title="No trips yet" desc="Submit your first trip for admin approval." action="Add Trip" onAction={()=>setActive('addtrip')}/>
            : trips.map(t=>(
              <Card key={t.id} style={{ marginBottom:12, borderLeft:`4px solid ${t.status==='APPROVED'?'#22c55e':t.status==='PENDING_APPROVAL'?'var(--gold)':'#ef4444'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:10 }}>
                  <div>
                    <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:4 }}>
                      <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16 }}>{t.from} → {t.to}</span>
                      <Pill text={t.status.replace(/_/g,' ')} color={t.status==='APPROVED'?'#15803d':t.status==='PENDING_APPROVAL'?'#92400e':'#dc2626'}/>
                    </div>
                    <div style={{ fontSize:13, color:'var(--gray-text)' }}>{t.plate} · {t.departs} · {t.date} · {t.seat_type}-seater · {fmt(t.price)}/seat</div>
                    {t.rejection_reason&&<div style={{ marginTop:6, background:'#fee2e2', borderRadius:8, padding:'6px 10px', fontSize:12, color:'#dc2626', fontFamily:'var(--font-head)', fontWeight:600 }}>❌ {t.rejection_reason}</div>}
                    {t.admin_note&&<div style={{ marginTop:4, background:'#eff6ff', borderRadius:8, padding:'6px 10px', fontSize:12, color:'#1d4ed8' }}>Admin note: {t.admin_note}</div>}
                  </div>
                  {t.status==='APPROVED'&&(
                    <Btn size="sm" variant="blue" onClick={()=>{setSelectedSeatTrip(t);setActive('seats')}}>Manage Seats</Btn>
                  )}
                  {t.status==='REJECTED'&&(
                    <Btn size="sm" variant="ghost" onClick={()=>{setTripForm({...tripForm,from:t.from,to:t.to,date:t.date,price:t.price.toString()});setActive('addtrip')}}>Edit & Resubmit</Btn>
                  )}
                </div>
                {t.status==='APPROVED'&&(
                  <ProgressBar value={t.seats_booked} max={t.seats_total} label={`${t.seats_booked}/${t.seats_total} seats booked`} showPct/>
                )}
              </Card>
            ))}
        </>)}

        {/* ── SEAT MANAGER ── */}
        {active==='seats' && (<>
          {!selectedSeatTrip
            ? (<>
                <div style={{ fontFamily:'var(--font-head)', color:'var(--gray-text)', marginBottom:14 }}>Select a trip to manage seats:</div>
                {trips.filter(t=>t.status==='APPROVED').map(t=>(
                  <Card key={t.id} hover onClick={()=>setSelectedSeatTrip(t)} style={{ marginBottom:10, cursor:'pointer' }}>
                    <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:15 }}>{t.from} → {t.to} · {t.departs}</div>
                    <div style={{ fontSize:13, color:'var(--gray-text)', marginTop:4 }}>{t.plate} · {t.seats_booked}/{t.seats_total} booked</div>
                  </Card>
                ))}
              </>)
            : (<>
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16, flexWrap:'wrap' }}>
                  <button onClick={()=>{setSelectedSeatTrip(null);setSelectedSeats([])}} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--blue)', fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>← Back</button>
                  <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, margin:0 }}>{selectedSeatTrip.from}→{selectedSeatTrip.to} · {selectedSeatTrip.departs}</h3>
                  <Pill text={`${selectedSeatTrip.seats_booked}/${selectedSeatTrip.seats_total} booked`} color="#1d4ed8"/>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:20, alignItems:'start' }}>
                  <div style={{ background:'var(--gray-light)', borderRadius:16, padding:14, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
                    <div style={{ marginBottom:12 }}><SeatLegend compact/></div>
                    {React.createElement(
                      {55:BusSeat55,65:BusSeat65,67:BusSeat67,14:TaxiSeat14}[selectedSeatTrip.seat_type]||BusSeat55,
                      { booked:[3,7,8,11,14], locked:[], selected:selectedSeats, onToggle:(n)=>setSelectedSeats(p=>p.includes(n)?p.filter(x=>x!==n):[...p,n]) }
                    )}
                  </div>
                  <div style={{ minWidth:220 }}>
                    <Card style={{ marginBottom:12 }}>
                      <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, marginBottom:8 }}>Selected: {selectedSeats.length}</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:10 }}>
                        {selectedSeats.map(s=><span key={s} style={{ background:'var(--gold)', color:'var(--blue)', padding:'3px 9px', borderRadius:7, fontFamily:'var(--font-head)', fontWeight:800, fontSize:12 }}>{s}</span>)}
                      </div>
                      <Btn variant="blue" full size="sm" onClick={()=>toast('Seats marked as reserved','success')}>Mark Reserved</Btn>
                      <div style={{ marginTop:8 }}><Btn variant="danger" full size="sm" onClick={()=>toast('Seats marked as available','warning')}>Mark Available</Btn></div>
                    </Card>
                    <Card>
                      <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, marginBottom:8, color:'var(--gray-text)' }}>Capacity</div>
                      <ProgressBar value={selectedSeatTrip.seats_booked} max={selectedSeatTrip.seats_total} showPct/>
                      <div style={{ fontSize:11, color:'var(--gray-text)', marginTop:6 }}>{selectedSeatTrip.seats_total-selectedSeatTrip.seats_booked} seats remaining</div>
                    </Card>
                  </div>
                </div>
              </>)}
        </>)}

        {/* ── BOOKINGS ── */}
        {active==='bookings' && (
          <Card>
            <SectionHead title="All Bookings" count={bookings.length}/>
            {bookings.length===0
              ? <EmptyState icon="🎫" title="No bookings yet"/>
              : <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', minWidth:480 }}>
                    <thead><tr style={{ borderBottom:'2px solid var(--gray-mid)' }}>
                      {['ID','Trip','Seat','Method','Amount','Status'].map(h=>(
                        <th key={h} style={{ padding:'8px 10px', fontFamily:'var(--font-head)', fontWeight:700, fontSize:11, color:'var(--gray-text)', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>{bookings.map((b,i)=>{
                      const trip=state.trips.find(t=>t.id===b.trip_id)
                      return (
                        <tr key={b.id} style={{ borderBottom:'1px solid var(--gray-mid)' }}
                          onMouseEnter={e=>e.currentTarget.style.background='var(--gray-light)'}
                          onMouseLeave={e=>e.currentTarget.style.background=''}>
                          <td style={{ padding:'10px', fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, color:'var(--blue)' }}>{b.id}</td>
                          <td style={{ padding:'10px', fontSize:12 }}>{trip?.from}→{trip?.to}</td>
                          <td style={{ padding:'10px', fontSize:12 }}>Seat {b.seat}</td>
                          <td style={{ padding:'10px', fontSize:12 }}>{b.method}</td>
                          <td style={{ padding:'10px', fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>{fmt(b.amount)}</td>
                          <td style={{ padding:'10px' }}><Pill text={b.status} color={b.status==='CONFIRMED'?'#15803d':'#92400e'}/></td>
                        </tr>
                      )
                    })}</tbody>
                  </table>
                </div>}
          </Card>
        )}

        {/* ── ALERTS / NOTIFICATIONS ── */}
        {active==='alerts' && (
          <Card>
            <SectionHead title="🔔 Notifications" action="Mark all read" onAction={()=>{store.markOpRead(op.id);toast('All marked read','success')}}/>
            {notifications.length===0
              ? <EmptyState icon="🔔" title="All caught up!" desc="No notifications right now."/>
              : notifications.map((n,i)=>(
                <div key={n.id} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'13px 0', borderBottom:i<notifications.length-1?'1px solid var(--gray-mid)':'', background:!n.read?'#eff6ff':'' }}>
                  <span style={{ fontSize:18, flexShrink:0, marginTop:2 }}>{n.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>{n.msg}</div>
                    <div style={{ fontSize:11, color:'var(--gray-text)', marginTop:2 }}>{n.time}</div>
                  </div>
                  {!n.read&&<span style={{ background:'#dbeafe', color:'#1d4ed8', padding:'2px 8px', borderRadius:10, fontSize:9, fontFamily:'var(--font-head)', fontWeight:700, flexShrink:0 }}>NEW</span>}
                </div>
              ))}
          </Card>
        )}

        {/* ── MAP PIN ── */}
        {active==='mappins' && (
          <Card>
            <SectionHead title="📍 Boarding Location"/>
            <p style={{ color:'var(--gray-text)', fontSize:14, marginBottom:20, lineHeight:1.7 }}>Set your exact pickup location. Passengers tap "Get Directions" on their ticket and your pin opens in Google Maps with their GPS.</p>
            <div style={{ height:180, background:'linear-gradient(135deg,#e8f4fd,#dbeafe)', borderRadius:14, border:'2px solid #bfdbfe', position:'relative', overflow:'hidden', marginBottom:20 }}>
              <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 22px,rgba(11,61,145,0.05) 22px,rgba(11,61,145,0.05) 23px),repeating-linear-gradient(90deg,transparent,transparent 22px,rgba(11,61,145,0.05) 22px,rgba(11,61,145,0.05) 23px)' }}/>
              <div style={{ position:'absolute', top:'38%', left:'50%', transform:'translate(-50%,-100%)', display:'flex', flexDirection:'column', alignItems:'center' }}>
                <div style={{ width:32,height:32,borderRadius:'50% 50% 50% 0',background:'#ef4444',transform:'rotate(-45deg)',boxShadow:'0 4px 12px rgba(239,68,68,0.5)' }}/>
                <div style={{ background:'white', borderRadius:8, padding:'4px 10px', marginTop:6, fontFamily:'var(--font-head)', fontWeight:700, fontSize:11, color:'var(--blue)', boxShadow:'var(--shadow-md)', whiteSpace:'nowrap' }}>{op.boarding_pin?.label||'Set pin location'}</div>
              </div>
            </div>
            <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
              {[['Location Label','text','Kampala Coach Park, Gate 3'],['Latitude','number','0.3476'],['Longitude','number','32.5825']].map(([l,t,ph],i)=>(
                <div key={l} style={{ gridColumn:i===0?'1/-1':undefined }}>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:5 }}>{l}</label>
                  <input type={t} placeholder={ph} defaultValue={i===0?op.boarding_pin?.label:i===1?op.boarding_pin?.lat:op.boarding_pin?.lng} style={inS}/>
                </div>
              ))}
            </div>
            <Btn variant="blue" full size="lg" onClick={()=>toast('📍 Boarding location saved!','success')}>Save Boarding Location</Btn>
          </Card>
        )}

        {/* ── SACCO (locked message) ── */}
        {active==='sacco' && (
          <Card style={{ background:'linear-gradient(135deg,var(--blue),#082d6e)', color:'var(--white)', textAlign:'center', padding:40 }}>
            <div style={{ fontSize:52, marginBottom:16 }}>🏛️</div>
            <h2 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:22, marginBottom:10 }}>Sacco Module</h2>
            <div style={{ background:'rgba(255,199,44,0.15)', borderRadius:14, padding:'14px 20px', marginBottom:20, display:'inline-block' }}>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, color:'var(--gold)' }}>🔒 Requires Subscription: UGX 200,000/month</div>
            </div>
            <p style={{ opacity:.85, fontSize:14, lineHeight:1.8, maxWidth:480, margin:'0 auto 24px' }}>
              Run a full internal savings & loan cooperative for your staff. Raylane provides the platform — your Sacco manages its own funds entirely. Activated on request after payment.
            </p>
            <Btn variant="gold" size="lg" onClick={()=>{ store.requestModuleActivation(op.id,'sacco_module'); toast('Request sent to Raylane Admin. You\'ll be contacted shortly.','success') }}>Request Activation</Btn>
            <div style={{ marginTop:12, fontSize:12, opacity:.7 }}>Raylane does NOT manage Sacco funds</div>
          </Card>
        )}

        {/* ── GENERIC PREMIUM PLACEHOLDER ── */}
        {['financial','fuel','loans','analytics','hr','fleet'].includes(active) && (
          <Card style={{ textAlign:'center', padding:40 }}>
            <div style={{ fontSize:52, marginBottom:14 }}>{NAV_ITEMS.find(n=>n.id===active)?.icon}</div>
            <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:20, marginBottom:8 }}>{NAV_ITEMS.find(n=>n.id===active)?.label} Module</h3>
            <p style={{ color:'var(--gray-text)', maxWidth:380, margin:'0 auto 20px', lineHeight:1.7, fontSize:14 }}>This premium module is active. Connect to the backend API to load live data.</p>
            <Btn variant="blue" onClick={()=>toast('API connection required','success')}>Configure</Btn>
          </Card>
        )}

        {/* ── SETTINGS ── */}
        {active==='settings' && (
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Card>
              <SectionHead title="Company Profile"/>
              {[['Company Name',op.company_name],['Merchant MoMo Code',op.merchant_code],['Contact Phone',op.phone],['Email',op.email],['Fleet Size',op.fleet_size+' vehicles']].map(([l,v])=>(
                <div key={l} style={{ marginBottom:12 }}>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:5 }}>{l}</label>
                  <input defaultValue={v} style={inS}/>
                </div>
              ))}
              <Btn variant="blue" full onClick={()=>toast('Profile saved','success')}>Save Profile</Btn>
            </Card>
            <Card>
              <SectionHead title="My Modules"/>
              {Object.entries(op.modules||{}).map(([k,v])=>(
                <div key={k} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid var(--gray-mid)' }}>
                  <span style={{ fontSize:16 }}>{MODULE_ICONS[k]}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>{MODULE_LABELS[k]}</div>
                    <div style={{ fontSize:11, color:'var(--gray-text)' }}>{MODULE_PRICES[k]?fmt(MODULE_PRICES[k])+'/mo':'Included free'}</div>
                  </div>
                  <Pill text={v.status} color={v.status==='ACTIVE'?'#15803d':'#9ca3af'}/>
                  {v.status==='INACTIVE'&&<button onClick={()=>setReqModal({mod:k})} style={{ padding:'4px 10px', borderRadius:10, background:'#dbeafe', color:'#1d4ed8', border:'none', fontFamily:'var(--font-head)', fontWeight:700, fontSize:10, cursor:'pointer' }}>Request</button>}
                </div>
              ))}
            </Card>
          </div>
        )}

      </div>

      {/* Module request modal */}
      <Modal open={!!reqModal} onClose={()=>setReqModal(null)} title={`Request: ${MODULE_LABELS[reqModal?.mod]||reqModal?.mod}`}>
        {reqModal&&(<>
          <div style={{ background:'var(--gray-light)', borderRadius:12, padding:16, marginBottom:16 }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{MODULE_ICONS[reqModal.mod]||'💎'}</div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, marginBottom:4 }}>{MODULE_LABELS[reqModal.mod]}</div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:18, color:'var(--blue)' }}>{fmt(MODULE_PRICES[reqModal.mod]||0)}<span style={{ fontSize:12, color:'var(--gray-text)', fontWeight:400 }}>/month</span></div>
          </div>
          <Banner type="info">Raylane Admin will contact you to confirm payment and activate the module. Typical activation: within 24 hours of payment confirmation.</Banner>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <Btn variant="ghost" full onClick={()=>setReqModal(null)}>Cancel</Btn>
            <Btn variant="gold" full onClick={()=>{ store.requestModuleActivation(op.id,reqModal.mod); toast('Request sent to Raylane Admin!','success'); setReqModal(null) }}>Send Request</Btn>
          </div>
        </>)}
      </Modal>
    </div>
  )
}

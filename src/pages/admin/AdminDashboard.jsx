import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../hooks/useStore'
import { useToast } from '../../hooks/useToast'
import { Card, StatCard, Pill, SectionHead, BarChart, ProgressBar, Banner, Modal, Btn, Input, EmptyState } from '../../components/ui/SharedComponents'

const NAV = [
  { icon:'📊', label:'Overview',        id:'overview' },
  { icon:'📝', label:'Applications',    id:'applications', badge:true },
  { icon:'🚌', label:'Operators',       id:'operators' },
  { icon:'🗺️', label:'Trips',           id:'trips', badge:true },
  { icon:'🎫', label:'Bookings',        id:'bookings' },
  { icon:'💳', label:'Payments',        id:'payments' },
  { icon:'💸', label:'Payouts',         id:'payouts' },
  { icon:'📦', label:'Parcels',         id:'parcels' },
  { icon:'🏦', label:'Bank Loans',      id:'bankloans' },
  { icon:'🛒', label:'Services',        id:'services' },
  { icon:'👥', label:'Users',           id:'users' },
  { icon:'📂', label:'Documents',       id:'documents' },
  { icon:'🔔', label:'Alerts',          id:'alerts', badge:true },
  { icon:'📋', label:'Audit Log',       id:'audit' },
  { icon:'📈', label:'Reports',         id:'reports' },
  { icon:'⚙️', label:'Settings',        id:'settings' },
]

const MODULE_DEFS = [
  { id:'booking_basic',    name:'Booking System',     price:0,      icon:'🎫', default:true },
  { id:'parcel_basic',     name:'Parcel System',      price:0,      icon:'📦', default:true },
  { id:'financial_module', name:'Financial Module',   price:100000, icon:'💰' },
  { id:'fuel_module',      name:'Fuel Management',    price:80000,  icon:'⛽' },
  { id:'loan_tracking',    name:'Bank Loan Monitor',  price:150000, icon:'🏦' },
  { id:'sacco_module',     name:'Sacco Module',       price:200000, icon:'🏛️' },
  { id:'analytics_module', name:'Analytics',          price:100000, icon:'📊' },
  { id:'hr_module',        name:'Staff / HR',         price:100000, icon:'👥' },
  { id:'fleet_module',     name:'Fleet Maintenance',  price:120000, icon:'🔧' },
]

const fmt = n => 'UGX ' + Number(n).toLocaleString()

export default function AdminDashboard() {
  const { state, store, unreadCount, pendingTrips, pendingApps } = useAdminStore()
  const [active, setActive]   = useState('overview')
  const [tripModal, setTripModal] = useState(null)   // {trip, action:'approve'|'reject'|'edit'}
  const [appModal, setAppModal]   = useState(null)
  const [svcModal, setSvcModal]   = useState(null)   // {op, module}
  const [rejectReason, setRejectReason] = useState('')
  const [editForm, setEditForm]   = useState({})
  const [opFilter, setOpFilter]   = useState('ALL')
  const toast = useToast()
  const navigate = useNavigate()

  /* ── ACTIONS ── */
  const approveTrip = () => {
    if(tripModal.action==='edit') {
      store.editApproveTrip(tripModal.trip.id, editForm)
      toast('✏️ Trip edited & approved — now live','success')
    } else {
      store.approveTrip(tripModal.trip.id)
      toast('✅ Trip approved — now live on website','success')
    }
    setTripModal(null); setRejectReason(''); setEditForm({})
  }
  const rejectTrip = () => {
    if(!rejectReason.trim()){toast('Please enter a rejection reason','warning');return}
    store.rejectTrip(tripModal.trip.id, rejectReason)
    toast('❌ Trip rejected — operator notified','error')
    setTripModal(null); setRejectReason('')
  }
  const handleApp = (approve) => {
    if(approve) {
      store.approveApplication(appModal.id)
      toast(`✅ ${appModal.company_name} approved & onboarded! Credentials sent via SMS.`,'success')
    } else {
      store.rejectApplication(appModal.id, rejectReason)
      toast(`❌ Application rejected`,'error')
    }
    setAppModal(null); setRejectReason('')
  }
  const activateMod = () => {
    store.activateModule(svcModal.op.id, svcModal.module.id)
    toast(`✅ ${svcModal.module.name} activated for ${svcModal.op.company_name}`,'success')
    setSvcModal(null)
  }

  const statusColor = { APPROVED:'#15803d', PENDING_APPROVAL:'#92400e', REJECTED:'#dc2626', ACTIVE:'#15803d', INACTIVE:'#9ca3af', READY:'#92400e', RELEASED:'#1d4ed8', CURRENT:'#15803d', OVERDUE:'#dc2626', REPAID:'#1d4ed8', PENDING_REVIEW:'#92400e' }

  /* ── SIDEBAR ── */
  const Sidebar = () => (
    <div className="dash-sidebar" style={{ width:188, background:'#0a0f1e', flexShrink:0, display:'flex', flexDirection:'column', overflowY:'auto' }}>
      <div style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:9, minHeight:52 }}>
        <div style={{ width:28, height:28, borderRadius:7, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="14" height="12" viewBox="0 0 20 16" fill="none"><path d="M1 13L7 3l5 6 4-6 3 10" stroke="#0B3D91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:12, color:'var(--white)', lineHeight:1 }}>Admin Panel</div>
          <div style={{ fontSize:9, color:'var(--gold)', fontFamily:'var(--font-head)', marginTop:1 }}>Raylane Express</div>
        </div>
      </div>
      <nav style={{ flex:1, padding:'6px 0', display:'flex', flexDirection:'column' }}>
        {NAV.map(item => {
          const badgeCount = item.id==='alerts'?unreadCount : item.id==='trips'?pendingTrips.length : item.id==='applications'?pendingApps.length:0
          return (
            <button key={item.id} onClick={()=>setActive(item.id)} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 14px', background:active===item.id?'rgba(255,199,44,0.12)':'none', color:active===item.id?'var(--gold)':'rgba(255,255,255,0.65)', borderLeft:`3px solid ${active===item.id?'var(--gold)':'transparent'}`, fontFamily:'var(--font-head)', fontWeight:600, fontSize:11, whiteSpace:'nowrap', transition:'all .18s', border:'none', cursor:'pointer', width:'100%', textAlign:'left' }}>
              <span style={{ fontSize:13, flexShrink:0 }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {badgeCount>0 && <span style={{ background:'#ef4444', color:'white', borderRadius:10, padding:'1px 5px', fontSize:9, fontWeight:700, flexShrink:0 }}>{badgeCount}</span>}
            </button>
          )
        })}
      </nav>
      <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', gap:6 }}>
        <button onClick={()=>store.resetToInitial()} style={{ width:'100%', padding:'6px', borderRadius:7, background:'rgba(255,100,100,0.15)', color:'rgba(255,150,150,0.8)', border:'none', cursor:'pointer', fontFamily:'var(--font-head)', fontWeight:600, fontSize:9 }}>Reset Demo</button>
        <button onClick={()=>navigate('/')} style={{ width:'100%', padding:'7px', borderRadius:7, background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.55)', border:'none', cursor:'pointer', fontFamily:'var(--font-head)', fontWeight:600, fontSize:10 }}>← Back to Site</button>
      </div>
    </div>
  )

  return (
    <div className="dash-wrap" style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--gray-light)', paddingTop:'var(--nav-h)' }}>
      <Sidebar />
      <div className="dash-main" style={{ flex:1, overflowY:'auto', padding:20 }}>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, gap:12, flexWrap:'wrap' }}>
          <h1 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:'clamp(15px,2vw,20px)', margin:0 }}>
            {NAV.find(n=>n.id===active)?.icon} {active==='overview'?'Dashboard':NAV.find(n=>n.id===active)?.label}
          </h1>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {unreadCount>0&&<span style={{ background:'#fee2e2', color:'#dc2626', padding:'4px 12px', borderRadius:20, fontFamily:'var(--font-head)', fontWeight:700, fontSize:12 }}>🔔 {unreadCount} new alerts</span>}
            <div style={{ width:32, height:32, borderRadius:9, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--white)', fontFamily:'var(--font-head)', fontWeight:900, fontSize:11 }}>AD</div>
          </div>
        </div>

        {/* ══ OVERVIEW ══ */}
        {active==='overview' && (<>
          <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
            <StatCard icon="🎫" label="Daily Bookings"  value={state.bookings.length.toLocaleString()} sub="+11.5%" bg="#dbeafe" color="#1d4ed8"/>
            <StatCard icon="💰" label="Revenue Today"   value="UGX 74.6M" sub="+6.3%" bg="#dcfce7" color="#15803d"/>
            <StatCard icon="🚌" label="Active Operators" value={state.operators.filter(o=>o.status==='ACTIVE').length} sub="Live" bg="#f3e8ff" color="#7c3aed"/>
            <StatCard icon="⏳" label="Pending Approval" value={pendingTrips.length+pendingApps.length} sub="Action needed" bg="#fef9c3" color="#92400e"/>
          </div>
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Card>
              <SectionHead title="Pending Trip Approvals" count={pendingTrips.length} action="View All" onAction={()=>setActive('trips')}/>
              {pendingTrips.length===0
                ? <EmptyState icon="✅" title="All caught up!" desc="No trips awaiting approval."/>
                : pendingTrips.slice(0,3).map(t=>(
                  <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 0', borderBottom:'1px solid var(--gray-mid)' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>{t.operator_name} — {t.from}→{t.to}</div>
                      <div style={{ fontSize:11, color:'var(--gray-text)' }}>{t.departs} · {t.plate} · {fmt(t.price)}/seat</div>
                    </div>
                    <div style={{ display:'flex', gap:5 }}>
                      <Btn size="sm" variant="success" onClick={()=>{store.approveTrip(t.id);toast('✅ Approved','success')}}>✅</Btn>
                      <Btn size="sm" variant="danger"  onClick={()=>setTripModal({trip:t,action:'reject'})}>❌</Btn>
                    </div>
                  </div>
                ))}
            </Card>
            <Card>
              <SectionHead title="New Applications" count={pendingApps.length} action="View All" onAction={()=>setActive('applications')}/>
              {pendingApps.length===0
                ? <EmptyState icon="✅" title="No pending applications"/>
                : pendingApps.slice(0,3).map(a=>(
                  <div key={a.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 0', borderBottom:'1px solid var(--gray-mid)' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>{a.company_name}</div>
                      <div style={{ fontSize:11, color:'var(--gray-text)' }}>{a.contact_name} · {a.fleet_size} vehicles</div>
                    </div>
                    <Btn size="sm" variant="blue" onClick={()=>setAppModal(a)}>Review</Btn>
                  </div>
                ))}
            </Card>
          </div>
          {/* Live stats bar */}
          <Card style={{ marginTop:16, background:'var(--blue)' }}>
            <div style={{ display:'flex', gap:24, flexWrap:'wrap', justifyContent:'space-around' }}>
              {[['Total Operators',state.operators.length,'var(--gold)'],['Live Trips',state.trips.filter(t=>t.status==='APPROVED').length,'#7dd3fc'],['Bookings Today',state.bookings.length,'#86efac'],['Pending Payouts',state.payouts.filter(p=>p.status==='READY').length,'#fca5a5']].map(([l,v,c])=>(
                <div key={l} style={{ textAlign:'center', color:'var(--white)' }}>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:26, color:c }}>{v}</div>
                  <div style={{ fontSize:12, opacity:.75 }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </>)}

        {/* ══ APPLICATIONS ══ */}
        {active==='applications' && (<>
          <Banner type="info">Applications go through <strong>PENDING → APPROVED/REJECTED</strong>. On approval, operator account is auto-created and credentials sent via SMS.</Banner>
          {state.applications.map(a=>(
            <Card key={a.id} style={{ marginBottom:12, borderLeft:`4px solid ${a.status==='PENDING_REVIEW'?'var(--gold)':a.status==='APPROVED'?'#22c55e':'#ef4444'}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:5, flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16 }}>{a.company_name}</span>
                    <Pill text={a.status.replace(/_/g,' ')} color={statusColor[a.status]||'#64748b'}/>
                  </div>
                  <div style={{ fontSize:13, color:'var(--gray-text)', marginBottom:4 }}>Contact: {a.contact_name} · {a.phone} · {a.email}</div>
                  <div style={{ fontSize:13, color:'var(--gray-text)', marginBottom:4 }}>Fleet: {a.fleet_size} vehicles · Routes: {a.current_routes}</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:6 }}>
                    {a.modules_requested?.map(m=><span key={m} style={{ background:'#dbeafe', color:'#1d4ed8', padding:'2px 8px', borderRadius:10, fontSize:10, fontFamily:'var(--font-head)', fontWeight:600 }}>{m.replace(/_/g,' ')}</span>)}
                  </div>
                </div>
                <div style={{ fontSize:11, color:'var(--gray-text)', textAlign:'right' }}>
                  <div>Submitted: {a.submitted_at}</div>
                  <div style={{ marginTop:4 }}>ID: {a.id}</div>
                </div>
              </div>
              {a.status==='PENDING_REVIEW' && (
                <div style={{ marginTop:14, display:'flex', gap:8, flexWrap:'wrap', paddingTop:12, borderTop:'1px solid var(--gray-mid)' }}>
                  <Btn variant="success" icon="✅" onClick={()=>{store.approveApplication(a.id);toast(`✅ ${a.company_name} approved & onboarded!`,'success')}}>Approve & Create Account</Btn>
                  <Btn variant="danger" onClick={()=>setAppModal({...a,actionType:'reject'})}>❌ Reject</Btn>
                  <Btn variant="ghost" onClick={()=>toast('Requesting more info — connect SMS API','success')}>📞 Request Info</Btn>
                </div>
              )}
              {a.status==='REJECTED' && a.rejection_reason && (
                <div style={{ marginTop:10, background:'#fee2e2', borderRadius:10, padding:'8px 12px', fontSize:12, color:'#dc2626', fontFamily:'var(--font-head)', fontWeight:600 }}>Reason: {a.rejection_reason}</div>
              )}
            </Card>
          ))}
        </>)}

        {/* ══ OPERATORS ══ */}
        {active==='operators' && (<>
          <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
            {['ALL','ACTIVE','SUSPENDED'].map(f=>(
              <button key={f} onClick={()=>setOpFilter(f)} style={{ padding:'6px 16px', borderRadius:20, border:`1.5px solid ${opFilter===f?'var(--blue)':'var(--gray-mid)'}`, background:opFilter===f?'var(--blue)':'var(--white)', color:opFilter===f?'var(--white)':'var(--dark)', fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, cursor:'pointer' }}>{f}</button>
            ))}
          </div>
          {state.operators.filter(op=>opFilter==='ALL'||op.status===opFilter).map(op=>(
            <Card key={op.id} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:14 }}>
                <div>
                  <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:5, flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:17 }}>{op.company_name}</span>
                    <Pill text={op.status} color={op.status==='ACTIVE'?'#15803d':'#dc2626'}/>
                    {op.is_premium&&<Pill text="⭐ Premium" color="#92400e" bg="#fef9c3"/>}
                  </div>
                  <div style={{ fontSize:13, color:'var(--gray-text)', marginBottom:4 }}>{op.contact} · {op.phone} · {op.email}</div>
                  <div style={{ fontSize:13, color:'var(--gray-text)' }}>Fleet: {op.fleet_size} · MoMo: {op.merchant_code} · Joined: {op.created_at?.slice(0,10)}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:12, color:'var(--gray-text)' }}>Trips: {state.trips.filter(t=>t.operator_id===op.id&&t.status==='APPROVED').length} live</div>
                  <div style={{ fontSize:12, color:'var(--gray-text)' }}>Bookings: {state.bookings.filter(b=>b.operator_id===op.id).length}</div>
                </div>
              </div>

              {/* Module management panel */}
              <div style={{ background:'var(--gray-light)', borderRadius:12, padding:14 }}>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, marginBottom:10, color:'var(--gray-text)', textTransform:'uppercase', letterSpacing:1 }}>Module Management</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:8 }}>
                  {MODULE_DEFS.map(mod=>{
                    const modState=op.modules[mod.id]
                    const isActive=modState?.status==='ACTIVE'
                    return (
                      <div key={mod.id} style={{ background:isActive?'#dcfce7':'var(--white)', borderRadius:10, padding:'8px 10px', border:`1px solid ${isActive?'#22c55e':'var(--gray-mid)'}`, display:'flex', alignItems:'center', gap:7 }}>
                        <span style={{ fontSize:14, flexShrink:0 }}>{mod.icon}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:11, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{mod.name}</div>
                          <div style={{ fontSize:9, color:'var(--gray-text)' }}>{isActive?'Active':mod.price?fmt(mod.price)+'/mo':'Free'}</div>
                        </div>
                        <button onClick={()=>{
                          if(isActive){store.deactivateModule(op.id,mod.id);toast(`${mod.name} deactivated`,'warning')}
                          else setSvcModal({op,module:mod})
                        }} style={{ width:22, height:22, borderRadius:6, background:isActive?'#fee2e2':'var(--blue)', color:isActive?'#dc2626':'var(--white)', border:'none', cursor:'pointer', fontSize:11, fontWeight:700, flexShrink:0 }}>
                          {isActive?'✕':'＋'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
                <Btn size="sm" variant="blue" onClick={()=>toast(`Viewing ${op.company_name} full profile`,'success')}>View Profile</Btn>
                <Btn size="sm" variant="ghost" onClick={()=>toast(`Freeze ${op.company_name}?`,'warning')}>Freeze</Btn>
                <Btn size="sm" variant="ghost" onClick={()=>toast(`Documents for ${op.company_name}`,'success')}>Documents</Btn>
              </div>
            </Card>
          ))}
        </>)}

        {/* ══ TRIPS ══ */}
        {active==='trips' && (<>
          <Banner type="info">Only <strong>APPROVED</strong> trips appear on the website. Admin can Approve, Reject, or Edit & Approve. Operator is notified instantly.</Banner>
          {['PENDING_APPROVAL','APPROVED','REJECTED'].map(statusGroup=>{
            const grouped=state.trips.filter(t=>t.status===statusGroup)
            if(!grouped.length) return null
            return (
              <div key={statusGroup} style={{ marginBottom:24 }}>
                <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:14, color:'var(--gray-text)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:12 }}>
                  {statusGroup==='PENDING_APPROVAL'?'⏳ Awaiting Approval':statusGroup==='APPROVED'?'✅ Live on Website':'❌ Rejected'}
                  <span style={{ marginLeft:8, background:'var(--gray-mid)', color:'var(--gray-text)', borderRadius:10, padding:'2px 8px', fontSize:11 }}>{grouped.length}</span>
                </h3>
                {grouped.map(t=>(
                  <Card key={t.id} style={{ marginBottom:10, borderLeft:`4px solid ${statusColor[t.status]||'var(--gray-mid)'}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                      <div>
                        <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, marginBottom:4 }}>{t.operator_name} — {t.from} → {t.to}</div>
                        <div style={{ fontSize:13, color:'var(--gray-text)', marginBottom:4 }}>{t.plate} · {t.departs} · {t.date} · {t.seat_type}-seater</div>
                        <div style={{ fontSize:13, color:'var(--blue)', fontFamily:'var(--font-head)', fontWeight:700 }}>{fmt(t.price)}/seat</div>
                        {t.rejection_reason&&<div style={{ marginTop:6, background:'#fee2e2', borderRadius:8, padding:'6px 10px', fontSize:12, color:'#dc2626' }}>Reason: {t.rejection_reason}</div>}
                        {t.notes&&<div style={{ fontSize:12, color:'var(--gray-text)', marginTop:4 }}>Notes: {t.notes}</div>}
                      </div>
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'flex-start' }}>
                        {t.status==='PENDING_APPROVAL'&&(<>
                          <Btn size="sm" variant="success" onClick={()=>{store.approveTrip(t.id);toast('✅ Trip approved — now live!','success')}}>✅ Approve</Btn>
                          <Btn size="sm" variant="blue"    onClick={()=>{setTripModal({trip:t,action:'edit'});setEditForm({price:t.price,departs:t.departs,notes:t.notes})}}>✏️ Edit & Approve</Btn>
                          <Btn size="sm" variant="danger"  onClick={()=>setTripModal({trip:t,action:'reject'})}>❌ Reject</Btn>
                        </>)}
                        {t.status==='APPROVED'&&(
                          <Btn size="sm" variant="ghost" onClick={()=>toast('Trip removed from live listing','warning')}>Remove</Btn>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )
          })}
        </>)}

        {/* ══ BOOKINGS ══ */}
        {active==='bookings' && (
          <Card>
            <SectionHead title="All Bookings" count={state.bookings.length}/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:520 }}>
                <thead><tr style={{ borderBottom:'2px solid var(--gray-mid)' }}>
                  {['Booking ID','Operator','Trip','Seat','Method','Amount','Status'].map(h=>(
                    <th key={h} style={{ padding:'8px 10px', fontFamily:'var(--font-head)', fontWeight:700, fontSize:11, color:'var(--gray-text)', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{state.bookings.map((b,i)=>(
                  <tr key={b.id} style={{ borderBottom:'1px solid var(--gray-mid)' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--gray-light)'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}>
                    <td style={{ padding:'10px', fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, color:'var(--blue)' }}>{b.id}</td>
                    <td style={{ padding:'10px', fontSize:12 }}>{state.operators.find(o=>o.id===b.operator_id)?.company_name}</td>
                    <td style={{ padding:'10px', fontSize:12, color:'var(--gray-text)' }}>{state.trips.find(t=>t.id===b.trip_id)?.from}→{state.trips.find(t=>t.id===b.trip_id)?.to}</td>
                    <td style={{ padding:'10px', fontSize:12 }}>{b.seat}</td>
                    <td style={{ padding:'10px', fontSize:12 }}>{b.method}</td>
                    <td style={{ padding:'10px', fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>{fmt(b.amount)}</td>
                    <td style={{ padding:'10px' }}><Pill text={b.status} color={statusColor[b.status]||'#64748b'}/></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ══ PAYOUTS ══ */}
        {active==='payouts' && (<>
          <Banner type="info">Release payout to operator <strong>merchant MoMo code</strong>, not a phone number. 8% commission is auto-deducted. Each payout can only be triggered once.</Banner>
          {state.payouts.map(p=>(
            <Card key={p.id} style={{ marginBottom:12, borderLeft:`4px solid ${p.status==='READY'?'var(--gold)':'#22c55e'}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, marginBottom:4 }}>{p.operator_name}</div>
                  <div style={{ fontSize:13, color:'var(--gray-text)', marginBottom:4 }}>Trip: {state.trips.find(t=>t.id===p.trip_id)?.from}→{state.trips.find(t=>t.id===p.trip_id)?.to}</div>
                  <div style={{ fontSize:13, color:'var(--gray-text)' }}>Merchant Code: <strong style={{ color:'var(--blue)' }}>{p.merchant_code}</strong></div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:12, color:'var(--gray-text)' }}>Gross: {fmt(p.gross)}</div>
                  <div style={{ fontSize:12, color:'#dc2626' }}>Commission (8%): −{fmt(p.commission)}</div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:20, color:'#15803d' }}>Net: {fmt(p.net)}</div>
                </div>
              </div>
              <div style={{ marginTop:14, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                {p.status==='READY'
                  ? <Btn variant="success" icon="💸" onClick={()=>{store.releasePayout(p.id);toast(`💸 ${fmt(p.net)} dispatched to ${p.merchant_code}`,'success')}}>Release to {p.merchant_code}</Btn>
                  : <div style={{ fontSize:13, color:'var(--gray-text)' }}>Released: {p.triggered_at}</div>}
                <Pill text={p.status} color={statusColor[p.status]||'#64748b'}/>
              </div>
            </Card>
          ))}
        </>)}

        {/* ══ BANK LOANS ══ */}
        {active==='bankloans' && (<>
          <Banner type="info">Bank Loan Monitor is a <strong>premium service (UGX 150,000/month)</strong>. Operators track their own loans — Raylane provides the platform only.</Banner>
          <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
            <StatCard icon="🏦" label="Monitored Loans"  value={state.bank_loans.length} bg="#dbeafe" color="#1d4ed8"/>
            <StatCard icon="💰" label="Total Principal"  value="UGX 160M" bg="#fef9c3" color="#92400e"/>
            <StatCard icon="✅" label="Total Repaid"     value="UGX 86M"  bg="#dcfce7" color="#15803d"/>
            <StatCard icon="⚠️" label="Overdue" value={state.bank_loans.filter(l=>l.status==='OVERDUE').length} bg="#fee2e2" color="#dc2626"/>
          </div>
          {state.bank_loans.map(l=>(
            <Card key={l.id} style={{ marginBottom:12, borderLeft:`4px solid ${l.status==='OVERDUE'?'#ef4444':l.status==='REPAID'?'#22c55e':'var(--blue)'}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:12 }}>
                <div>
                  <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:4 }}>
                    <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15 }}>{l.operator_name}</span>
                    <Pill text={l.status} color={statusColor[l.status]||'#64748b'}/>
                  </div>
                  <div style={{ fontSize:13, color:'var(--gray-text)' }}>{l.bank} · {l.id}{l.nextDue&&` · Due: ${l.nextDue}`}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:20, color:'var(--blue)' }}>{fmt(l.principal)}</div>
                  <div style={{ fontSize:12, color:'var(--gray-text)' }}>{fmt(l.monthly)}/month</div>
                </div>
              </div>
              <ProgressBar value={l.paid} max={l.principal} showPct label={`Repaid: ${fmt(l.paid)}`}/>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--gray-text)', marginTop:6 }}>
                <span>Months: {l.months_paid}/{l.total_months}</span>
                <span>Remaining: {fmt(l.principal-l.paid)}</span>
              </div>
              {l.status==='OVERDUE'&&(
                <div style={{ marginTop:10, display:'flex', gap:8, flexWrap:'wrap' }}>
                  <Btn size="sm" variant="danger"  onClick={()=>toast(`Reminder sent to ${l.operator_name}`,'warning')} icon="📧">Send Reminder</Btn>
                  <Btn size="sm" variant="ghost"   onClick={()=>toast('Contacting bank…','success')} icon="📞">Contact Bank</Btn>
                </div>
              )}
            </Card>
          ))}
        </>)}

        {/* ══ SERVICES MARKETPLACE ══ */}
        {active==='services' && (<>
          <Banner type="info">All services are activated <strong>per operator, on request only</strong> after payment confirmation. Each activation is logged in the audit trail.</Banner>
          {state.operators.map(op=>(
            <Card key={op.id} style={{ marginBottom:16 }}>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, marginBottom:14 }}>{op.company_name}</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:10 }}>
                {MODULE_DEFS.filter(m=>m.price>0).map(mod=>{
                  const isActive=op.modules[mod.id]?.status==='ACTIVE'
                  return (
                    <div key={mod.id} style={{ border:`1.5px solid ${isActive?'#22c55e':'var(--gray-mid)'}`, borderRadius:12, padding:14, background:isActive?'#dcfce7':'var(--white)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                        <span style={{ fontSize:20 }}>{mod.icon}</span>
                        {isActive?<Pill text="✅ Active" color="#15803d"/>:<Pill text={fmt(mod.price)+'/mo'} color="#1d4ed8" bg="#dbeafe"/>}
                      </div>
                      <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, marginBottom:8 }}>{mod.name}</div>
                      {isActive
                        ? <Btn size="sm" variant="danger" full onClick={()=>{store.deactivateModule(op.id,mod.id);toast(`${mod.name} deactivated for ${op.company_name}`,'warning')}}>Deactivate</Btn>
                        : <Btn size="sm" variant="blue" full onClick={()=>setSvcModal({op,module:mod})}>Activate</Btn>}
                    </div>
                  )
                })}
              </div>
            </Card>
          ))}
        </>)}

        {/* ══ ALERTS ══ */}
        {active==='alerts' && (
          <Card>
            <SectionHead title="Notifications Inbox" count={unreadCount} action="Mark all read" onAction={()=>{store.markAdminRead();toast('All marked read','success')}}/>
            {state.notifications.admin.map((n,i)=>(
              <div key={n.id} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'13px 0', borderBottom:i<state.notifications.admin.length-1?'1px solid var(--gray-mid)':'', background:!n.read?'#eff6ff':'' }}>
                <span style={{ fontSize:18, flexShrink:0, marginTop:2 }}>{n.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>{n.msg}</div>
                  <div style={{ fontSize:11, color:'var(--gray-text)', marginTop:2 }}>{n.time}</div>
                </div>
                {!n.read&&<span style={{ background:'#dbeafe', color:'#1d4ed8', padding:'2px 8px', borderRadius:10, fontSize:9, fontFamily:'var(--font-head)', fontWeight:700, flexShrink:0 }}>NEW</span>}
                {n.link&&<Btn size="sm" variant="ghost" onClick={()=>setActive(n.link)}>View →</Btn>}
              </div>
            ))}
          </Card>
        )}

        {/* ══ AUDIT LOG ══ */}
        {active==='audit' && (
          <Card>
            <SectionHead title="Audit Log — Every Action Tracked"/>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:400 }}>
                <thead><tr style={{ borderBottom:'2px solid var(--gray-mid)' }}>
                  {['Time','Action','Actor','Target','Detail'].map(h=>(
                    <th key={h} style={{ padding:'8px 10px', fontFamily:'var(--font-head)', fontWeight:700, fontSize:11, color:'var(--gray-text)', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{state.audit_log.map((e,i)=>(
                  <tr key={e.id} style={{ borderBottom:'1px solid var(--gray-mid)' }}
                    onMouseEnter={ex=>ex.currentTarget.style.background='var(--gray-light)'}
                    onMouseLeave={ex=>ex.currentTarget.style.background=''}>
                    <td style={{ padding:'9px 10px', fontSize:11, color:'var(--gray-text)', whiteSpace:'nowrap' }}>{e.time}</td>
                    <td style={{ padding:'9px 10px' }}><Pill text={e.action.replace(/_/g,' ')} color="#1d4ed8" bg="#dbeafe"/></td>
                    <td style={{ padding:'9px 10px', fontSize:12, fontFamily:'var(--font-head)', fontWeight:600 }}>{e.actor}</td>
                    <td style={{ padding:'9px 10px', fontSize:11, color:'var(--gray-text)' }}>{e.target}</td>
                    <td style={{ padding:'9px 10px', fontSize:12, color:'var(--gray-text)' }}>{e.detail}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ══ REPORTS ══ */}
        {active==='reports' && (<>
          <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
            <StatCard icon="💰" label="Monthly Revenue"  value="UGX 74.6M" sub="+6.3%"  bg="#dcfce7" color="#15803d"/>
            <StatCard icon="🎫" label="Total Bookings"   value={state.bookings.length}   sub="This month" bg="#dbeafe" color="#1d4ed8"/>
            <StatCard icon="💎" label="Commission Earned" value="UGX 5.97M" sub="8%"     bg="#fef9c3" color="#92400e"/>
            <StatCard icon="📦" label="Parcels"          value={state.parcels.length}    sub="Active"    bg="#f3e8ff" color="#7c3aed"/>
          </div>
          <Card>
            <SectionHead title="Monthly Revenue Trend"/>
            <BarChart data={[42,58,51,73,69,90,75,82,95,88,74,92]} labels={['J','F','M','A','M','J','J','A','S','O','N','D']} height={120} highlightLast/>
          </Card>
        </>)}

        {/* Generic placeholder */}
        {!['overview','applications','operators','trips','bookings','payments','payouts','parcels','bankloans','services','users','documents','alerts','audit','reports','settings'].includes(active)&&(
          <EmptyState icon={NAV.find(n=>n.id===active)?.icon||'📊'} title={NAV.find(n=>n.id===active)?.label} desc="Connect to the backend API to power this module."/>
        )}

        {/* ══ SETTINGS ══ */}
        {active==='settings' && (
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Card><SectionHead title="Commission Rate"/>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:32, color:'var(--blue)', marginBottom:8 }}>8%</div>
              <div style={{ color:'var(--gray-text)', fontSize:14 }}>Applied on all platform bookings. Deducted at payout.</div>
            </Card>
            <Card><SectionHead title="System Status"/>
              {[['Booking Engine','Operational','#15803d'],['Payment Gateway','Operational','#15803d'],['Seat Sync','Live','#15803d'],['SMS API','Active','#15803d']].map(([l,v,c])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--gray-mid)', alignItems:'center' }}>
                  <span style={{ fontFamily:'var(--font-head)', fontWeight:600, fontSize:13 }}>{l}</span>
                  <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, color:c }}>● {v}</span>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>

      {/* ── TRIP ACTION MODAL ── */}
      <Modal open={!!tripModal} onClose={()=>{setTripModal(null);setRejectReason('');setEditForm({})}} title={tripModal?.action==='reject'?'Reject Trip':tripModal?.action==='edit'?'Edit & Approve Trip':'Approve Trip'}>
        {tripModal&&(<>
          <div style={{ background:'var(--gray-light)', borderRadius:12, padding:14, marginBottom:16 }}>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:15 }}>{tripModal.trip.operator_name} — {tripModal.trip.from}→{tripModal.trip.to}</div>
            <div style={{ fontSize:13, color:'var(--gray-text)', marginTop:4 }}>{tripModal.trip.plate} · {tripModal.trip.departs} · {fmt(tripModal.trip.price)}/seat</div>
          </div>
          {tripModal.action==='reject'&&(
            <Input label="Rejection Reason *" value={rejectReason} onChange={e=>setRejectReason(e.target.value)} placeholder="Explain why this trip is being rejected…" required hint="Operator will receive this feedback"/>
          )}
          {tripModal.action==='edit'&&(
            <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
              <Input label="Adjust Price (UGX)" value={editForm.price||''} onChange={e=>setEditForm({...editForm,price:e.target.value})} type="number"/>
              <Input label="Adjust Departure" value={editForm.departs||''} onChange={e=>setEditForm({...editForm,departs:e.target.value})} type="text" placeholder="e.g. 10:30 AM"/>
              <div style={{ gridColumn:'1/-1' }}><Input label="Admin Note" value={editForm.notes||''} onChange={e=>setEditForm({...editForm,notes:e.target.value})}/></div>
            </div>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <Btn variant="ghost" full onClick={()=>{setTripModal(null);setRejectReason('')}}>Cancel</Btn>
            {tripModal.action==='reject'
              ? <Btn variant="danger" full onClick={rejectTrip}>❌ Confirm Rejection</Btn>
              : <Btn variant="success" full onClick={approveTrip}>✅ Approve & Make Live</Btn>}
          </div>
        </>)}
      </Modal>

      {/* ── SERVICE ACTIVATION MODAL ── */}
      <Modal open={!!svcModal} onClose={()=>setSvcModal(null)} title={`Activate: ${svcModal?.module?.name}`}>
        {svcModal&&(<>
          <div style={{ background:'var(--gray-light)', borderRadius:12, padding:16, marginBottom:16 }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{svcModal.module.icon}</div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, marginBottom:4 }}>{svcModal.module.name}</div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:20, color:'var(--blue)' }}>{fmt(svcModal.module.price)}<span style={{ fontSize:13, fontWeight:500, color:'var(--gray-text)' }}>/month</span></div>
          </div>
          <Banner type="warning">Confirm that <strong>{svcModal.op.company_name}</strong> has paid <strong>{fmt(svcModal.module.price)}</strong> before activating. This action is logged.</Banner>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <Btn variant="ghost" full onClick={()=>setSvcModal(null)}>Cancel</Btn>
            <Btn variant="gold" full onClick={activateMod}>✅ Confirm Activation</Btn>
          </div>
        </>)}
      </Modal>
    </div>
  )
}

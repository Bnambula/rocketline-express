import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminStats } from '../../data'
import { useToast } from '../../hooks/useToast'
import { Card, StatCard, Pill, SectionHead, BarChart, ProgressBar, Banner, Toggle, Modal, Btn, Input, EmptyState } from '../../components/ui/SharedComponents'

const NAV = [
  { icon:'📊', label:'Overview',         id:'overview' },
  { icon:'🚌', label:'Operators',        id:'operators' },
  { icon:'🗺️', label:'Routes',           id:'routes' },
  { icon:'🎫', label:'Bookings',         id:'bookings' },
  { icon:'💳', label:'Payments',         id:'payments' },
  { icon:'💸', label:'Payouts',          id:'payouts' },
  { icon:'📦', label:'Parcels',          id:'parcels' },
  { icon:'🏦', label:'Bank Loans',       id:'bankloans' },
  { icon:'💰', label:'Sacco',            id:'sacco' },
  { icon:'🛒', label:'Services Market',  id:'services' },
  { icon:'👥', label:'Users',            id:'users' },
  { icon:'📂', label:'Documents',        id:'documents' },
  { icon:'🔔', label:'Alerts',           id:'alerts', badge:2 },
  { icon:'📈', label:'Reports',          id:'reports' },
  { icon:'⚙️', label:'Settings',         id:'settings' },
]

const PAYOUTS = [
  { id:'PAY-001', operator:'Global Coaches', trip:'Kampala→Mbale 10AM', seats:36, gross:900000, comm:72000, net:828000, status:'ready',    phone:'0771-234-567', date:'2026-05-12' },
  { id:'PAY-002', operator:'YY Coaches',     trip:'Kampala→Gulu 9AM',   seats:24, gross:624000, comm:49920, net:574080, status:'ready',    phone:'0700-345-678', date:'2026-05-12' },
  { id:'PAY-003', operator:'Link Bus',       trip:'Kampala→Nairobi',    seats:18, gross:1080000,comm:86400, net:993600, status:'released', phone:'0752-456-789', date:'2026-05-11' },
]

const DOCS = [
  { name:'Global Coaches – Operating License', operator:'Global Coaches', type:'License',   date:'2026-01-15', size:'2.4 MB', status:'active' },
  { name:'YY Coaches – Operator Agreement',    operator:'YY Coaches',     type:'Agreement', date:'2026-02-01', size:'1.1 MB', status:'active' },
  { name:'Link Bus – Vehicle Inspection',      operator:'Link Bus',       type:'Inspection',date:'2025-12-10', size:'3.8 MB', status:'expired' },
]

const USERS = [
  { name:'James Okello',   role:'Dispatcher',    operator:'Global Coaches', status:'active',   perms:['trips','seats','boarding'] },
  { name:'Sarah Namukasa', role:'Accountant',    operator:'YY Coaches',     status:'active',   perms:['payments','reports'] },
  { name:'Peter Mwangi',   role:'Loading Clerk', operator:'Link Bus',       status:'inactive', perms:['boarding'] },
]

const ALERTS = [
  { type:'urgent', icon:'🔴', title:'Payment failure – MTN MoMo',    detail:'Booking RLX-240512-001 payment timed out.',    time:'2 min ago',  link:'payments' },
  { type:'urgent', icon:'🔴', title:'Bank loan overdue – YY Coaches', detail:'3 months outstanding. Immediate action needed.', time:'1 hr ago',   link:'bankloans' },
  { type:'normal', icon:'🟡', title:'New operator application',       detail:'City Express applied to join Raylane.',         time:'3 hrs ago',  link:'operators' },
  { type:'normal', icon:'🟡', title:'Trip ready for payout',          detail:'Kampala→Mbale 10AM – 36 seats loaded.',        time:'5 hrs ago',  link:'payouts' },
  { type:'normal', icon:'🟡', title:'High demand: Kampala→Nairobi',   detail:'95% booked this weekend. Consider peak pricing.','time':'6 hrs ago', link:'routes' },
]

// Bank loans data
const BANK_LOANS = [
  { id:'BL-001', operator:'Global Coaches',  bank:'Centenary Bank', principal:50000000, paid:32000000, monthly:3200000, nextDue:'2026-06-01', status:'current',  months:10, totalMonths:18 },
  { id:'BL-002', operator:'YY Coaches',      bank:'DFCU Bank',      principal:80000000, paid:24000000, monthly:5000000, nextDue:'2026-05-15', status:'overdue',  months:4,  totalMonths:16 },
  { id:'BL-003', operator:'City Express',    bank:'Stanbic Bank',   principal:30000000, paid:30000000, monthly:2500000, nextDue:null,          status:'repaid',   months:12, totalMonths:12 },
  { id:'BL-004', operator:'Fast Coaches',    bank:'Equity Bank',    principal:45000000, paid:9000000,  monthly:3000000, nextDue:'2026-06-10', status:'current',  months:3,  totalMonths:15 },
]

// Premium services marketplace
const PREMIUM_SERVICES = [
  { id:'sacco',     icon:'🏦', name:'Sacco Module',          price:200000, period:'month', desc:'Run a full internal savings & loan cooperative for your staff. Member registration, loan approvals, e-passbooks, and repayment schedules.', features:['Member registration','Loan management','E-passbooks','Repayment alerts','Savings dashboard'], category:'Financial', active: false },
  { id:'bankloans', icon:'💳', name:'Bank Loan Monitor',     price:150000, period:'month', desc:'Track and service all your bank loans in one dashboard. Never miss a repayment. Get alerts 7 days before due dates.', features:['Multi-bank tracking','Due date alerts','Repayment history','Statement downloads','Overdue notifications'], category:'Financial', active:true },
  { id:'hr',        icon:'👥', name:'Staff / HR Management', price:100000, period:'month', desc:'Full HR suite for transport operators. Payroll, leave management, staff profiles, and disciplinary tracking.', features:['Payroll processing','Leave management','Staff profiles','Disciplinary records','Contract management'], category:'Operations', active:false },
  { id:'fleet',     icon:'🔧', name:'Fleet Maintenance',     price:120000, period:'month', desc:'Track vehicle service schedules, repair costs, and roadworthiness certificates. Get alerts before certificates expire.', features:['Service schedules','Repair cost tracking','Roadworthiness alerts','Fuel monitoring','Driver assignment'], category:'Operations', active:false },
  { id:'fuel',      icon:'⛽', name:'Fuel Management',       price:80000,  period:'month', desc:'Monitor fuel purchases, consumption per route, and driver fuel efficiency. Detect anomalies instantly.', features:['Fuel purchase logs','Consumption analytics','Driver efficiency','Anomaly detection','Supplier management'], category:'Operations', active:false },
  { id:'insurance', icon:'🛡️', name:'Insurance Dashboard',   price:80000,  period:'month', desc:'Track all vehicle insurance policies, renewal dates, and claims in one place. Never drive an uninsured vehicle.', features:['Policy tracking','Renewal reminders','Claims management','Certificate storage','Multi-vehicle support'], category:'Compliance', active:false },
  { id:'revenue',   icon:'📊', name:'Advanced Analytics',    price:100000, period:'month', desc:'Deep revenue analytics, route profitability, peak hour analysis, and passenger trend forecasting.', features:['Route profitability','Passenger trends','Peak hour analysis','Revenue forecasting','Competitor benchmarking'], category:'Analytics', active:false },
  { id:'supplier',  icon:'🤝', name:'Supplier & Vendor Pay', price:60000,  period:'month', desc:'Pay suppliers and vendors directly from the platform. Track payables, schedule payments, and manage vendor relationships.', features:['Vendor management','Scheduled payments','Payment history','Invoice management','Mobile money payouts'], category:'Financial', active:false },
]

const fmt = n => 'UGX ' + Number(n).toLocaleString()

export default function AdminDashboard() {
  const [active, setActive]     = useState('overview')
  const [payouts, setPayouts]   = useState(PAYOUTS)
  const [approvals, setApprovals] = useState(adminStats.pendingApprovals.map((a,i)=>({...a,id:i,status:'pending'})))
  const [loans, setLoans]       = useState(BANK_LOANS)
  const [services, setServices] = useState(PREMIUM_SERVICES)
  const [peakPricing, setPeak]  = useState(false)
  const [markup, setMarkup]     = useState(5)
  const [serviceModal, setServiceModal] = useState(null)
  const [activateModal, setActivateModal] = useState(null)
  const [saccoOn, setSaccoOn]   = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const approve = id => { setApprovals(a=>a.map(x=>x.id===id?{...x,status:'approved'}:x)); toast('✅ Route approved and now live!','success') }
  const reject  = id => { setApprovals(a=>a.map(x=>x.id===id?{...x,status:'rejected'}:x)); toast('❌ Route rejected','error') }

  const releasePayout = payId => {
    const p = payouts.find(x=>x.id===payId)
    setPayouts(prev=>prev.map(x=>x.id===payId?{...x,status:'released'}:x))
    toast(`💸 ${fmt(p.net)} dispatched to ${p.operator} (${p.phone})`, 'success')
  }

  const activateService = svc => {
    setServices(s=>s.map(x=>x.id===svc.id?{...x,active:true}:x))
    setActivateModal(null)
    toast(`✅ ${svc.name} activated for ${svc.operator||'operator'}!`, 'success')
  }

  const Sidebar = () => (
    <div className="dash-sidebar" style={{ width:190, background:'#0a0f1e', flexShrink:0, display:'flex', flexDirection:'column', overflowY:'auto', overflowX:'hidden' }}>
      <div style={{ padding:'13px 15px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:9, minHeight:52 }}>
        <div style={{ width:28, height:28, borderRadius:7, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="14" height="12" viewBox="0 0 20 16" fill="none"><path d="M1 13 L7 3 L12 9 L16 3 L19 13" stroke="#0B3D91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:12, color:'var(--white)', lineHeight:1 }}>Admin Panel</div>
          <div style={{ fontSize:9, color:'var(--gold)', fontFamily:'var(--font-head)', marginTop:1 }}>Raylane Express</div>
        </div>
      </div>
      <nav style={{ flex:1, padding:'6px 0', display:'flex', flexDirection:'column' }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 14px', background:active===item.id?'rgba(255,199,44,0.12)':'none', color:active===item.id?'var(--gold)':'rgba(255,255,255,0.65)', borderLeft:`3px solid ${active===item.id?'var(--gold)':'transparent'}`, fontFamily:'var(--font-head)', fontWeight:600, fontSize:11, whiteSpace:'nowrap', transition:'all .18s', position:'relative', border:'none', cursor:'pointer', width:'100%', textAlign:'left' }}>
            <span style={{ fontSize:13, flexShrink:0 }}>{item.icon}</span>
            <span style={{ flex:1 }}>{item.label}</span>
            {item.badge && <span style={{ background:'#ef4444', color:'white', borderRadius:10, padding:'1px 5px', fontSize:9, fontWeight:700 }}>{item.badge}</span>}
          </button>
        ))}
      </nav>
      <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <button onClick={() => navigate('/')} style={{ width:'100%', padding:'8px', borderRadius:8, background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.55)', border:'none', cursor:'pointer', fontFamily:'var(--font-head)', fontWeight:600, fontSize:10 }}>← Back to Site</button>
      </div>
    </div>
  )

  return (
    <div className="dash-wrap" style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--gray-light)', paddingTop:'var(--nav-h)' }}>
      <Sidebar />
      <div className="dash-main" style={{ flex:1, overflowY:'auto', padding:'20px' }}>
        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, gap:12, flexWrap:'wrap' }}>
          <h1 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:'clamp(15px,2.5vw,20px)', margin:0 }}>
            {NAV.find(n=>n.id===active)?.icon} {active==='overview'?'Dashboard':NAV.find(n=>n.id===active)?.label}
          </h1>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button onClick={()=>setActive('alerts')} style={{ width:34,height:34,borderRadius:9,background:'var(--white)',border:'none',cursor:'pointer',boxShadow:'var(--shadow-sm)',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',position:'relative' }}>
              🔔<span style={{ position:'absolute',top:5,right:5,width:8,height:8,borderRadius:'50%',background:'#ef4444' }}/>
            </button>
            <div style={{ width:32,height:32,borderRadius:9,background:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--white)',fontFamily:'var(--font-head)',fontWeight:900,fontSize:11 }}>AD</div>
          </div>
        </div>

        {/* ══ OVERVIEW ══ */}
        {active==='overview' && (<>
          <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:18 }}>
            <StatCard icon="🎫" label="Daily Bookings"  value={adminStats.dailyBookings.toLocaleString()} sub="+11.5%" bg="#dbeafe" color="#1d4ed8"/>
            <StatCard icon="💰" label="Revenue Today"   value={'UGX '+Math.round(adminStats.revenueTodayUGX/1e6)+'M'} sub="+6.3%" bg="#dcfce7" color="#15803d"/>
            <StatCard icon="💎" label="Commission"       value={'UGX '+Math.round(adminStats.commission/1e6)+'M'} sub="+0.9%" bg="#fef9c3" color="#92400e"/>
            <StatCard icon="🚌" label="Active Operators" value={adminStats.activeOperators} sub="Live" bg="#f3e8ff" color="#7c3aed"/>
          </div>
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
            <Card>
              <SectionHead title="Pending Approvals" count={approvals.filter(a=>a.status==='pending').length}/>
              {approvals.map(a=>(
                <div key={a.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 0', borderBottom:'1px solid var(--gray-mid)' }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:'rgba(11,61,145,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>🚌</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{a.name}</div>
                    <div style={{ fontSize:11,color:'var(--gray-text)' }}>{a.route}</div>
                  </div>
                  {a.status==='pending'
                    ? <div style={{ display:'flex',gap:5,flexShrink:0 }}>
                        <Btn size="sm" variant="success" onClick={()=>approve(a.id)}>✅</Btn>
                        <Btn size="sm" variant="danger"  onClick={()=>reject(a.id)}>❌</Btn>
                      </div>
                    : <Pill status={a.status} text={a.status==='approved'?'✅ Approved':'❌ Rejected'}/>}
                </div>
              ))}
            </Card>
            <Card>
              <SectionHead title="Revenue Breakdown"/>
              <BarChart data={[30,55,40,80,65,90,75]} labels={['M','T','W','T','F','S','S']} height={90} highlightLast={false}/>
              <div style={{ marginTop:14,display:'flex',gap:14,flexWrap:'wrap' }}>
                {[['Bookings','74.6M','var(--blue)'],['Commission','5.97M','var(--gold)'],['Parcels','3.2M','#22c55e']].map(([l,v,c])=>(
                  <div key={l}><div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:15,color:c }}>UGX {v}</div><div style={{ fontSize:11,color:'var(--gray-text)' }}>{l}</div></div>
                ))}
              </div>
            </Card>
          </div>
        </>)}

        {/* ══ PAYOUTS ══ */}
        {active==='payouts' && (<>
          <Banner type="info">Release payments only when trip status = Loading and all seats are paid. <strong>8% commission</strong> is auto-deducted before transfer. Each payout can only be triggered once.</Banner>
          {payouts.map(p=>(
            <Card key={p.id} style={{ marginBottom:14 }}>
              <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:14,flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:15,marginBottom:4 }}>{p.operator}</div>
                  <div style={{ fontSize:13,color:'var(--gray-text)',marginBottom:6 }}>{p.trip} · {p.date}</div>
                  <div style={{ display:'flex',gap:16,fontSize:12,color:'var(--gray-text)' }}>
                    <span>🪑 {p.seats} seats</span><span>📱 {p.phone}</span>
                  </div>
                </div>
                <div style={{ textAlign:'right',minWidth:200 }}>
                  <div style={{ fontSize:12,color:'var(--gray-text)' }}>Gross: {fmt(p.gross)}</div>
                  <div style={{ fontSize:12,color:'#dc2626' }}>Commission (8%): −{fmt(p.comm)}</div>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:20,color:'#15803d',marginTop:4 }}>Net: {fmt(p.net)}</div>
                </div>
              </div>
              <div style={{ marginTop:14,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10 }}>
                {p.status==='ready'
                  ? <Btn variant="success" onClick={()=>releasePayout(p.id)} icon="💸">Release Payment to Operator MoMo</Btn>
                  : <Pill status="released" text="✅ Payment Released"/>}
                <Pill status={p.status} text={p.status==='ready'?'⏳ Ready':'✅ Done'}/>
              </div>
            </Card>
          ))}
        </>)}

        {/* ══ BANK LOANS MODULE ══ */}
        {active==='bankloans' && (<>
          <Banner type="info">
            The <strong>Bank Loan Monitor</strong> is a premium service activated per operator request. Raylane charges <strong>UGX 150,000/month</strong>. Operators monitor their own loans — Raylane does not handle funds.
          </Banner>
          <div className="stat-grid" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:18 }}>
            <StatCard icon="🏦" label="Monitored Loans"  value={loans.length}              bg="#dbeafe" color="#1d4ed8"/>
            <StatCard icon="📋" label="Total Principal"   value="UGX 205M"                  bg="#fef9c3" color="#92400e"/>
            <StatCard icon="✅" label="Total Repaid"      value="UGX 95M"                   bg="#dcfce7" color="#15803d"/>
            <StatCard icon="⚠️" label="Overdue Loans"     value={loans.filter(l=>l.status==='overdue').length} bg="#fee2e2" color="#dc2626" sub="Action needed"/>
          </div>
          {loans.map(l=>(
            <Card key={l.id} style={{ marginBottom:14, borderLeft:l.status==='overdue'?'4px solid #ef4444':l.status==='repaid'?'4px solid #22c55e':'4px solid var(--blue)' }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12,marginBottom:14 }}>
                <div>
                  <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:4,flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:15 }}>{l.operator}</span>
                    <Pill status={l.status} text={l.status==='overdue'?'⚠️ Overdue':l.status==='repaid'?'✅ Fully Repaid':'🟢 Current'}/>
                  </div>
                  <div style={{ fontSize:13,color:'var(--gray-text)' }}>{l.bank} · {l.id}</div>
                  {l.nextDue && <div style={{ fontSize:12,color:l.status==='overdue'?'#dc2626':'var(--gray-text)',marginTop:3,fontFamily:'var(--font-head)',fontWeight:600 }}>Next due: {l.nextDue}</div>}
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:20,color:'var(--blue)' }}>{fmt(l.principal)}</div>
                  <div style={{ fontSize:12,color:'var(--gray-text)',marginTop:2 }}>Monthly: {fmt(l.monthly)}</div>
                </div>
              </div>
              <ProgressBar value={l.paid} max={l.principal} label={`Repaid: ${fmt(l.paid)} of ${fmt(l.principal)}`} showPct height={10}/>
              <div style={{ display:'flex',justifyContent:'space-between',marginTop:10,fontSize:12,color:'var(--gray-text)' }}>
                <span>Months paid: {l.months}/{l.totalMonths}</span>
                <span>Remaining: {fmt(l.principal - l.paid)}</span>
              </div>
              {l.status==='overdue' && (
                <div style={{ marginTop:14,display:'flex',gap:8,flexWrap:'wrap' }}>
                  <Btn size="sm" variant="danger" onClick={()=>toast(`Overdue notice sent to ${l.operator}`,'warning')} icon="📧">Send Reminder</Btn>
                  <Btn size="sm" variant="ghost" onClick={()=>toast(`Contacting ${l.bank}…`,'success')} icon="📞">Contact Bank</Btn>
                  <Btn size="sm" variant="ghost" onClick={()=>toast(`Viewing statement for ${l.operator}`,'success')}>View Statement</Btn>
                </div>
              )}
            </Card>
          ))}
          <Card style={{ background:'#eff6ff', border:'1px solid #bfdbfe' }}>
            <SectionHead title="➕ Add Operator Loan" action="Add Loan" onAction={()=>toast('Connect to backend to add bank loan records','success')}/>
            <div style={{ fontSize:13,color:'#1d4ed8',lineHeight:1.7 }}>
              Add and track bank loans for any operator using the Loan Monitor service. The operator must have an active Bank Loan Monitor subscription (UGX 150,000/month) before their loans are visible here.
            </div>
          </Card>
        </>)}

        {/* ══ PREMIUM SERVICES MARKET ══ */}
        {active==='services' && (<>
          <Banner type="info">
            Premium services are activated <strong>per operator, on request</strong>. Each service is billed monthly. Raylane Admin triggers activation after confirming payment. Services are independent — operators can subscribe to any combination.
          </Banner>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:16 }}>
            {services.map(svc=>(
              <Card key={svc.id} style={{ border:svc.active?'2px solid var(--blue)':'2px solid transparent', position:'relative' }}>
                {svc.active && <div style={{ position:'absolute',top:12,right:12 }}><Pill status="active" text="✅ Active"/></div>}
                <div style={{ fontSize:32,marginBottom:12 }}>{svc.icon}</div>
                <div style={{ display:'flex',alignItems:'flex-start',gap:8,marginBottom:6,flexWrap:'wrap' }}>
                  <h3 style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:16,margin:0,flex:1 }}>{svc.name}</h3>
                  <span style={{ background:'rgba(11,61,145,0.08)',color:'var(--blue)',padding:'2px 8px',borderRadius:10,fontSize:10,fontFamily:'var(--font-head)',fontWeight:700,whiteSpace:'nowrap' }}>{svc.category}</span>
                </div>
                <p style={{ color:'var(--gray-text)',fontSize:13,lineHeight:1.7,marginBottom:12 }}>{svc.desc}</p>
                <div style={{ marginBottom:14 }}>
                  {svc.features.map(f=><div key={f} style={{ display:'flex',gap:6,marginBottom:5,fontSize:12,color:'var(--gray-text)',alignItems:'flex-start' }}><span style={{ color:'#22c55e',fontWeight:700,flexShrink:0,marginTop:1 }}>✓</span>{f}</div>)}
                </div>
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:12,borderTop:'1px solid var(--gray-mid)' }}>
                  <div>
                    <span style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:18,color:'var(--blue)' }}>{fmt(svc.price)}</span>
                    <span style={{ fontSize:12,color:'var(--gray-text)' }}>/{svc.period}/operator</span>
                  </div>
                  {svc.active
                    ? <Btn size="sm" variant="ghost" onClick={()=>toast(`Managing ${svc.name} subscriptions…`,'success')}>Manage</Btn>
                    : <Btn size="sm" variant="blue" onClick={()=>setServiceModal(svc)}>Activate for Operator</Btn>}
                </div>
              </Card>
            ))}
          </div>
        </>)}

        {/* ══ SACCO CONTROL ══ */}
        {active==='sacco' && (<>
          <Banner type="locked">Raylane provides the Sacco platform only. <strong>We do not manage or hold Sacco funds.</strong> Activate only after operator pays the Sacco subscription (UGX 200,000/month).</Banner>
          <Card style={{ marginBottom:16 }}>
            <SectionHead title="🏦 Sacco Module Control"/>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20 }}>
              {[['Global Coaches','active'],['YY Coaches','inactive'],['Link Bus','active'],['City Express','inactive']].map(([op,st])=>(
                <div key={op} style={{ display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:12,background:st==='active'?'#dcfce7':'var(--gray-light)',border:`1px solid ${st==='active'?'#22c55e':'var(--gray-mid)'}` }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{op}</div>
                    <Pill status={st} text={st==='active'?'Sacco Active':'Not Subscribed'}/>
                  </div>
                  <Btn size="sm" variant={st==='active'?'danger':'blue'} onClick={()=>toast(`Sacco ${st==='active'?'disabled':'enabled'} for ${op}`,'success')}>
                    {st==='active'?'Disable':'Enable'}
                  </Btn>
                </div>
              ))}
            </div>
          </Card>
        </>)}

        {/* ══ DOCUMENTS ══ */}
        {active==='documents' && (<>
          <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:14 }}>
            <Btn variant="blue" icon="⬆️" onClick={()=>toast('File upload — connect to cloud storage backend','success')}>Upload Document</Btn>
          </div>
          {DOCS.map((d,i)=>(
            <Card key={i} style={{ marginBottom:12 }}>
              <div style={{ display:'flex',alignItems:'center',gap:14,flexWrap:'wrap' }}>
                <div style={{ width:44,height:44,borderRadius:12,background:'#dbeafe',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0 }}>📄</div>
                <div style={{ flex:1,minWidth:160 }}>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:14 }}>{d.name}</div>
                  <div style={{ fontSize:12,color:'var(--gray-text)' }}>{d.operator} · {d.type} · {d.date} · {d.size}</div>
                </div>
                <Pill status={d.status} text={d.status}/>
                <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
                  <Btn size="sm" variant="ghost" onClick={()=>toast('Viewing '+d.name,'success')}>View</Btn>
                  <Btn size="sm" variant="ghost" onClick={()=>toast('Downloading…','success')}>⬇️</Btn>
                  <Btn size="sm" variant={d.status==='active'?'danger':'success'} onClick={()=>toast('Archived','warning')}>Archive</Btn>
                </div>
              </div>
            </Card>
          ))}
        </>)}

        {/* ══ USERS ══ */}
        {active==='users' && (<>
          <Banner type="warning">Only <strong>Raylane Admins</strong> can create or modify operator staff accounts. Operators cannot self-create users.</Banner>
          <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:14 }}>
            <Btn variant="blue" onClick={()=>toast('Add User — connect to auth backend','success')}>+ Add User</Btn>
          </div>
          <Card>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%',borderCollapse:'collapse',minWidth:500 }}>
                <thead><tr style={{ borderBottom:'2px solid var(--gray-mid)' }}>
                  {['Name','Role','Operator','Permissions','Status','Actions'].map(h=>(
                    <th key={h} style={{ padding:'8px 10px',fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,color:'var(--gray-text)',textAlign:'left',whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{USERS.map((u,i)=>(
                  <tr key={i} style={{ borderBottom:'1px solid var(--gray-mid)' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--gray-light)'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}>
                    <td style={{ padding:'11px 10px',fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{u.name}</td>
                    <td style={{ padding:'11px 10px' }}><Pill status="new" text={u.role} color="#1d4ed8" bg="#dbeafe"/></td>
                    <td style={{ padding:'11px 10px',fontSize:12,color:'var(--gray-text)' }}>{u.operator}</td>
                    <td style={{ padding:'11px 10px' }}>
                      <div style={{ display:'flex',gap:4,flexWrap:'wrap' }}>
                        {u.perms.map(p=><span key={p} style={{ background:'#f1f5f9',color:'#475569',padding:'2px 7px',borderRadius:8,fontSize:9,fontFamily:'var(--font-head)',fontWeight:600 }}>{p}</span>)}
                      </div>
                    </td>
                    <td style={{ padding:'11px 10px' }}><Pill status={u.status} text={u.status}/></td>
                    <td style={{ padding:'11px 10px' }}><Btn size="sm" variant="ghost" onClick={()=>toast('Edit '+u.name,'success')}>Edit</Btn></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </>)}

        {/* ══ ALERTS ══ */}
        {active==='alerts' && (
          <Card>
            <SectionHead title="🔔 Alerts Inbox" action="Mark all read" onAction={()=>toast('All marked read','success')}/>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20 }}>
              {[['🔴 Urgent',ALERTS.filter(a=>a.type==='urgent').length,'#fee2e2','#dc2626'],['🟡 Normal',ALERTS.filter(a=>a.type==='normal').length,'#fef9c3','#92400e']].map(([l,v,bg,c])=>(
                <div key={l} style={{ background:bg,borderRadius:12,padding:'14px 18px',display:'flex',alignItems:'center',gap:14 }}>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:26,color:c }}>{v}</div>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13,color:c }}>{l}</div>
                </div>
              ))}
            </div>
            {ALERTS.map((a,i)=>(
              <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:12,padding:'13px 0',borderBottom:i<ALERTS.length-1?'1px solid var(--gray-mid)':'' }}>
                <span style={{ fontSize:18,flexShrink:0,marginTop:2 }}>{a.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13,marginBottom:3 }}>{a.title}</div>
                  <div style={{ fontSize:12,color:'var(--gray-text)' }}>{a.detail}</div>
                  <div style={{ fontSize:11,color:'var(--gray-text)',marginTop:3 }}>{a.time}</div>
                </div>
                <Btn size="sm" variant="ghost" onClick={()=>setActive(a.link)}>View →</Btn>
              </div>
            ))}
          </Card>
        )}

        {/* ══ REPORTS ══ */}
        {active==='reports' && (<>
          <div className="stat-grid" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:18 }}>
            <StatCard icon="💰" label="Monthly Revenue"  value="UGX 74.6M" sub="+6.3%"  bg="#dcfce7" color="#15803d"/>
            <StatCard icon="🎫" label="Monthly Bookings" value="2,487"      sub="+11.5%" bg="#dbeafe" color="#1d4ed8"/>
            <StatCard icon="📦" label="Parcels Sent"     value="341"        sub="+4.2%"  bg="#fef9c3" color="#92400e"/>
            <StatCard icon="🚌" label="Active Routes"    value="89"         sub="Live"   bg="#f3e8ff" color="#7c3aed"/>
          </div>
          <Card style={{ marginBottom:16 }}>
            <SectionHead title="Monthly Performance" action="Export CSV" onAction={()=>toast('Generating report…','success')}/>
            <BarChart data={[42,58,51,73,69,90,75,82,95,88,74,92]} labels={['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']} height={120}/>
          </Card>
        </>)}

        {/* ══ SETTINGS ══ */}
        {active==='settings' && (
          <div className="two-col" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:18 }}>
            <Card>
              <SectionHead title="Revenue Controls"/>
              <div style={{ marginBottom:16 }}>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:6 }}>
                  <span style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:14 }}>Price Markup ({markup}%)</span>
                  <span style={{ fontFamily:'var(--font-head)',fontWeight:700,color:'var(--blue)' }}>{markup}%</span>
                </div>
                <input type="range" min={0} max={30} value={markup} onChange={e=>setMarkup(e.target.value)} style={{ width:'100%',accentColor:'var(--blue)' }}/>
              </div>
              <Toggle label="Peak Pricing" hint="Auto-raise prices on high-demand days" checked={peakPricing} onChange={()=>{setPeak(!peakPricing);toast(peakPricing?'Peak pricing off':'Peak pricing on','success')}}/>
              <div style={{ background:'var(--gray-light)',borderRadius:12,padding:14,marginTop:14 }}>
                <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13,marginBottom:4 }}>Commission Rate</div>
                <div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:24,color:'var(--blue)' }}>8%</div>
                <div style={{ fontSize:12,color:'var(--gray-text)' }}>Auto-deducted on payout release</div>
              </div>
            </Card>
            <Card>
              <SectionHead title="System Status"/>
              {[['Seat Sync Engine','99.9% uptime','#15803d'],['Payment Gateway','Operational','#15803d'],['SMS Notifications','Active','#15803d'],['Admin Approvals','3 pending','#92400e']].map(([l,v,c])=>(
                <div key={l} style={{ display:'flex',justifyContent:'space-between',padding:'11px 0',borderBottom:'1px solid var(--gray-mid)',alignItems:'center' }}>
                  <span style={{ fontFamily:'var(--font-head)',fontWeight:600,fontSize:13 }}>{l}</span>
                  <span style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:12,color:c }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Generic placeholder */}
        {!['overview','payouts','bankloans','services','sacco','documents','users','alerts','reports','settings'].includes(active) && (
          <EmptyState icon={NAV.find(n=>n.id===active)?.icon||'📊'} title={NAV.find(n=>n.id===active)?.label+' Module'} desc="Connect to the Raylane backend API to power this module with live data." action="View API Docs" onAction={()=>toast('API docs — docs.raylaneexpress.com','success')}/>
        )}
      </div>

      {/* Service activation modal */}
      <Modal open={!!serviceModal} onClose={()=>setServiceModal(null)} title={`Activate: ${serviceModal?.name}`}>
        {serviceModal && (<>
          <div style={{ background:'var(--gray-light)',borderRadius:12,padding:16,marginBottom:16 }}>
            <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:16,marginBottom:4 }}>{serviceModal.icon} {serviceModal.name}</div>
            <div style={{ fontSize:13,color:'var(--gray-text)',marginBottom:10 }}>{serviceModal.desc}</div>
            <div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:20,color:'var(--blue)' }}>{fmt(serviceModal.price)}<span style={{ fontSize:13,fontWeight:500,color:'var(--gray-text)' }}>/{serviceModal.period}</span></div>
          </div>
          <Select label="Select Operator" options={['Global Coaches','YY Coaches','Link Bus','City Express','Fast Coaches']} placeholder="Choose operator…"/>
          <Banner type="warning">Confirm the operator has paid <strong>{fmt(serviceModal.price)}</strong> before activating. Misuse of this trigger may result in access disputes.</Banner>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
            <Btn variant="ghost" full onClick={()=>setServiceModal(null)}>Cancel</Btn>
            <Btn variant="gold" full onClick={()=>activateService(serviceModal)}>✅ Confirm Activation</Btn>
          </div>
        </>)}
      </Modal>
    </div>
  )
}

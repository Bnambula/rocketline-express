import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminStats } from '../../data'
import { useToast } from '../../hooks/useToast'

const NAV = [
  { icon:'📊', label:'Overview',    id:'overview' },
  { icon:'🚌', label:'Operators',   id:'operators' },
  { icon:'🗺️', label:'Routes',      id:'routes' },
  { icon:'🎫', label:'Bookings',    id:'bookings' },
  { icon:'💳', label:'Payments',    id:'payments' },
  { icon:'💸', label:'Payouts',     id:'payouts' },
  { icon:'📦', label:'Parcels',     id:'parcels' },
  { icon:'💰', label:'Sacco',       id:'sacco' },
  { icon:'👥', label:'Users',       id:'users' },
  { icon:'📂', label:'Documents',   id:'documents' },
  { icon:'🔔', label:'Alerts',      id:'alerts' },
  { icon:'📈', label:'Reports',     id:'reports' },
  { icon:'⚙️', label:'Settings',    id:'settings' },
]

const MOCK_PAYOUTS = [
  { id:'PAY-001', operator:'Global Coaches', trip:'Kampala→Mbale 10AM', seats:36, gross:900000, commission:72000, net:828000, status:'ready', phone:'0771-234-567' },
  { id:'PAY-002', operator:'YY Coaches',     trip:'Kampala→Gulu 9AM',   seats:24, gross:624000, commission:49920, net:574080, status:'ready', phone:'0700-345-678' },
  { id:'PAY-003', operator:'Link Bus',       trip:'Kampala→Nairobi',    seats:18, gross:1080000,commission:86400, net:993600, status:'released', phone:'0752-456-789' },
]

const MOCK_DOCS = [
  { name:'Global Coaches – Operating License', operator:'Global Coaches', type:'License', date:'2026-01-15', size:'2.4MB', status:'active' },
  { name:'YY Coaches – Operator Agreement',    operator:'YY Coaches',     type:'Agreement', date:'2026-02-01', size:'1.1MB', status:'active' },
  { name:'Link Bus – Vehicle Inspection',      operator:'Link Bus',       type:'Inspection', date:'2025-12-10', size:'3.8MB', status:'expired' },
]

const MOCK_USERS = [
  { name:'James Okello',   role:'Dispatcher',     operator:'Global Coaches', status:'active',   perms:['trips','seats','boarding'] },
  { name:'Sarah Namukasa', role:'Accountant',     operator:'YY Coaches',     status:'active',   perms:['payments','reports'] },
  { name:'Peter Mwangi',   role:'Loading Clerk',  operator:'Link Bus',       status:'inactive', perms:['boarding','seats'] },
]

const MOCK_ALERTS = [
  { id:1, type:'urgent',  icon:'🔴', title:'Payment failure – MTN MoMo',  detail:'Booking RLX-240512-001 payment timed out', time:'2 min ago',  link:'payments' },
  { id:2, type:'urgent',  icon:'🔴', title:'Loan overdue – Global Coaches',detail:'3 months outstanding. Action required.',   time:'1 hr ago',   link:'sacco' },
  { id:3, type:'normal',  icon:'🟡', title:'New operator application',     detail:'City Express applied. Pending review.',    time:'3 hrs ago',  link:'operators' },
  { id:4, type:'normal',  icon:'🟡', title:'Trip ready for payout',        detail:'Kampala→Mbale 10AM – 36/65 seats loaded.', time:'5 hrs ago',  link:'payouts' },
  { id:5, type:'normal',  icon:'🟡', title:'High demand route',            detail:'Kampala→Nairobi – 95% booked this weekend.','time':'6 hrs ago', link:'routes' },
]

export default function AdminDashboard() {
  const [active, setActive] = useState('overview')
  const [approvals, setApprovals] = useState(adminStats.pendingApprovals.map((a,i)=>({...a,id:i,status:'pending'})))
  const [payouts, setPayouts] = useState(MOCK_PAYOUTS)
  const [saccoEnabled, setSaccoEnabled] = useState(false)
  const [peakPricing, setPeakPricing] = useState(false)
  const [markup, setMarkup] = useState(5)
  const toast = useToast()
  const navigate = useNavigate()

  const approve = (id) => { setApprovals(a=>a.map(x=>x.id===id?{...x,status:'approved'}:x)); toast('✅ Route approved and live!','success') }
  const reject  = (id) => { setApprovals(a=>a.map(x=>x.id===id?{...x,status:'rejected'}:x)); toast('❌ Route rejected','error') }

  const releasePayout = (payId) => {
    setPayouts(p=>p.map(x=>x.id===payId?{...x,status:'released'}:x))
    const p = payouts.find(x=>x.id===payId)
    toast(`💸 UGX ${p.net.toLocaleString()} sent to ${p.operator} (${p.phone})`, 'success')
  }

  const Pill = ({ color, text }) => (
    <span style={{ background:color+'18', color, padding:'3px 10px', borderRadius:20, fontFamily:'var(--font-head)', fontWeight:700, fontSize:11 }}>{text}</span>
  )

  const Section = ({ title, children }) => (
    <div style={{ background:'var(--white)', borderRadius:16, padding:22, boxShadow:'var(--shadow-sm)', marginBottom:20 }}>
      <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, marginBottom:18 }}>{title}</h3>
      {children}
    </div>
  )

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--gray-light)', paddingTop:64 }}>
      {/* ── SIDEBAR ── */}
      <div style={{ width:192, background:'#0a0f1e', flexShrink:0, display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:900, fontSize:10, color:'var(--blue)', flexShrink:0 }}>RLX</div>
          <div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:12, color:'var(--white)', lineHeight:1 }}>Admin Panel</div>
            <div style={{ fontSize:9, color:'var(--gold)', fontFamily:'var(--font-head)', lineHeight:1, marginTop:2 }}>Raylane Express</div>
          </div>
        </div>
        <nav style={{ flex:1, padding:'6px 0' }}>
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>setActive(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:9, padding:'9px 14px', background:active===item.id?'rgba(255,199,44,0.12)':'none', border:'none', color:active===item.id?'var(--gold)':'rgba(255,255,255,0.62)', cursor:'pointer', fontFamily:'var(--font-head)', fontWeight:600, fontSize:12, borderLeft:active===item.id?'3px solid var(--gold)':'3px solid transparent', transition:'all 0.18s', whiteSpace:'nowrap' }}>
              <span style={{ fontSize:14, flexShrink:0 }}>{item.icon}</span>{item.label}
              {item.id==='alerts' && <span style={{ marginLeft:'auto', background:'#ef4444', color:'white', borderRadius:10, padding:'1px 6px', fontSize:10, fontWeight:700 }}>2</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding:10, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={()=>navigate('/')} style={{ width:'100%', padding:'9px', borderRadius:9, background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.55)', border:'none', cursor:'pointer', fontFamily:'var(--font-head)', fontWeight:600, fontSize:11 }}>← Back to Site</button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex:1, overflowY:'auto', padding:22 }}>
        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
          <h1 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:20 }}>
            {NAV.find(n=>n.id===active)?.icon} {active==='overview'?'Dashboard':NAV.find(n=>n.id===active)?.label}
          </h1>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button onClick={()=>setActive('alerts')} style={{ width:34,height:34,borderRadius:9,background:'var(--white)',border:'none',cursor:'pointer',boxShadow:'var(--shadow-sm)',fontSize:14,position:'relative' }}>
              🔔<span style={{ position:'absolute',top:4,right:4,width:8,height:8,borderRadius:'50%',background:'#ef4444' }}/>
            </button>
            <div style={{ width:34,height:34,borderRadius:9,background:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--white)',fontFamily:'var(--font-head)',fontWeight:800,fontSize:11 }}>AD</div>
          </div>
        </div>

        {/* ══ OVERVIEW ══ */}
        {active==='overview' && (<>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
            {[['Daily Bookings',adminStats.dailyBookings.toLocaleString(),'+11.5%','🎫','#dbeafe','#1d4ed8'],['Revenue Today','UGX '+Math.round(adminStats.revenueTodayUGX/1e6)+'M','+6.3%','💰','#dcfce7','#15803d'],['Commission','UGX '+Math.round(adminStats.commission/1e6)+'M','+0.9%','💎','#fef9c3','#92400e'],['Active Ops',adminStats.activeOperators,'Live','🚌','#f3e8ff','#7c3aed']].map(([l,v,sub,ic,bg,c])=>(
              <div key={l} style={{ background:'var(--white)',borderRadius:14,padding:18,boxShadow:'var(--shadow-sm)' }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12 }}>
                  <div style={{ width:38,height:38,borderRadius:10,background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>{ic}</div>
                  <span style={{ background:c+'18',color:c,padding:'2px 8px',borderRadius:20,fontSize:10,fontFamily:'var(--font-head)',fontWeight:700 }}>{sub}</span>
                </div>
                <div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:20,color:c,marginBottom:3 }}>{v}</div>
                <div style={{ fontSize:12,color:'var(--gray-text)' }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:18 }}>
            <Section title="Pending Approvals">
              {approvals.map(a=>(
                <div key={a.id} style={{ display:'flex',alignItems:'center',gap:10,padding:'12px 0',borderBottom:'1px solid var(--gray-mid)' }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:'rgba(11,61,145,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>🚌</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{a.name}</div>
                    <div style={{ fontSize:11,color:'var(--gray-text)' }}>{a.route}</div>
                  </div>
                  {a.status==='pending'?(
                    <div style={{ display:'flex',gap:5 }}>
                      <button onClick={()=>approve(a.id)} style={{ padding:'5px 12px',borderRadius:16,background:'#dcfce7',color:'#15803d',border:'none',fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,cursor:'pointer' }}>Approve</button>
                      <button onClick={()=>reject(a.id)}  style={{ padding:'5px 12px',borderRadius:16,background:'#fee2e2',color:'#dc2626',border:'none',fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,cursor:'pointer' }}>Reject</button>
                    </div>
                  ):<Pill color={a.status==='approved'?'#15803d':'#dc2626'} text={a.status==='approved'?'✅ Approved':'❌ Rejected'}/>}
                </div>
              ))}
            </Section>
            <Section title="Recent Payments">
              {adminStats.recentPayments.map((p,i)=>(
                <div key={i} style={{ display:'flex',alignItems:'center',gap:10,padding:'11px 0',borderBottom:'1px solid var(--gray-mid)' }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:p.method.includes('MTN')?'#fffbeb':'#fff5f5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>{p.method.includes('MTN')?'📱':'📲'}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{p.method}</div>
                    <div style={{ fontSize:11,color:'var(--gray-text)' }}>{p.id}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:13,color:'var(--blue)' }}>UGX {p.amount.toLocaleString()}</div>
                    <Pill color="#15803d" text="PAID"/>
                  </div>
                </div>
              ))}
            </Section>
          </div>
        </>)}

        {/* ══ PAYOUTS ══ */}
        {active==='payouts' && (
          <Section title="💸 Manual Payout Trigger — Operator Payments">
            <div style={{ background:'#eff6ff',borderRadius:12,padding:'12px 16px',marginBottom:20,fontSize:13,color:'#1d4ed8',fontFamily:'var(--font-head)',fontWeight:600,border:'1px solid #bfdbfe' }}>
              ℹ️ Release payment only when trip status = Loading and all seats are confirmed paid. 8% commission is auto-deducted.
            </div>
            {payouts.map(p=>(
              <div key={p.id} style={{ background:'var(--gray-light)',borderRadius:14,padding:18,marginBottom:14 }}>
                <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:14,flexWrap:'wrap' }}>
                  <div>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:15,marginBottom:4 }}>{p.operator}</div>
                    <div style={{ fontSize:13,color:'var(--gray-text)',marginBottom:6 }}>{p.trip}</div>
                    <div style={{ display:'flex',gap:14,flexWrap:'wrap' }}>
                      <span style={{ fontSize:12,color:'var(--gray-text)' }}>🪑 {p.seats} seats</span>
                      <span style={{ fontSize:12,color:'var(--gray-text)' }}>📱 {p.phone}</span>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:12,color:'var(--gray-text)',marginBottom:3 }}>Gross: UGX {p.gross.toLocaleString()}</div>
                    <div style={{ fontSize:12,color:'#dc2626',marginBottom:3 }}>Commission (8%): − UGX {p.commission.toLocaleString()}</div>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:18,color:'#15803d' }}>Net: UGX {p.net.toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ marginTop:14,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10 }}>
                  {p.status==='ready'?(
                    <button onClick={()=>releasePayout(p.id)} style={{ padding:'11px 24px',borderRadius:20,background:'#15803d',color:'var(--white)',border:'none',fontFamily:'var(--font-head)',fontWeight:800,fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',gap:8 }}>
                      💸 Release Payment to Operator
                    </button>
                  ):(
                    <span style={{ background:'#dcfce7',color:'#15803d',padding:'8px 18px',borderRadius:20,fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>✅ Payment Released</span>
                  )}
                  <span style={{ background:p.status==='ready'?'#fef9c3':'#dcfce7',color:p.status==='ready'?'#92400e':'#15803d',padding:'5px 12px',borderRadius:12,fontSize:11,fontFamily:'var(--font-head)',fontWeight:700 }}>
                    {p.status==='ready'?'⏳ Ready to Pay':'✅ Done'}
                  </span>
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* ══ USERS / ROLE MANAGEMENT ══ */}
        {active==='users' && (
          <div>
            <div style={{ background:'#fff3cd',borderRadius:12,padding:'12px 16px',marginBottom:20,fontSize:13,color:'#92400e',fontFamily:'var(--font-head)',fontWeight:600,border:'1px solid #f59e0b' }}>
              ⚠️ Only Raylane Admins can create/modify operator user roles. Operators cannot self-create users.
            </div>
            <Section title="👥 Role-Based User Management">
              <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:16 }}>
                <button onClick={()=>toast('Add User modal — connect to backend','success')} style={{ padding:'10px 20px',borderRadius:20,background:'var(--blue)',color:'var(--white)',border:'none',fontFamily:'var(--font-head)',fontWeight:700,fontSize:13,cursor:'pointer' }}>+ Add User</button>
              </div>
              <table style={{ width:'100%',borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ borderBottom:'2px solid var(--gray-mid)' }}>
                    {['Name','Role','Operator','Permissions','Status','Action'].map(h=>(
                      <th key={h} style={{ padding:'8px 10px',fontFamily:'var(--font-head)',fontWeight:700,fontSize:12,color:'var(--gray-text)',textAlign:'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS.map((u,i)=>(
                    <tr key={i} style={{ borderBottom:'1px solid var(--gray-mid)' }}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--gray-light)'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <td style={{ padding:'12px 10px',fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{u.name}</td>
                      <td style={{ padding:'12px 10px' }}><Pill color="#1d4ed8" text={u.role}/></td>
                      <td style={{ padding:'12px 10px',fontSize:13,color:'var(--gray-text)' }}>{u.operator}</td>
                      <td style={{ padding:'12px 10px' }}>
                        <div style={{ display:'flex',gap:4,flexWrap:'wrap' }}>
                          {u.perms.map(p=><span key={p} style={{ background:'#f1f5f9',color:'#475569',padding:'2px 7px',borderRadius:8,fontSize:10,fontFamily:'var(--font-head)',fontWeight:600 }}>{p}</span>)}
                        </div>
                      </td>
                      <td style={{ padding:'12px 10px' }}><Pill color={u.status==='active'?'#15803d':'#dc2626'} text={u.status}/></td>
                      <td style={{ padding:'12px 10px' }}>
                        <button onClick={()=>toast(`Edit ${u.name}`,'success')} style={{ padding:'5px 12px',borderRadius:12,background:'var(--gray-light)',border:'none',fontFamily:'var(--font-head)',fontWeight:600,fontSize:11,cursor:'pointer' }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop:20,background:'var(--gray-light)',borderRadius:12,padding:16 }}>
                <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13,marginBottom:12 }}>Role Permissions Matrix</div>
                <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10 }}>
                  {[
                    ['Dispatcher',['trips','seats','boarding','notifications'],'#dbeafe','#1d4ed8'],
                    ['Accountant',['payments','reports','invoices'],'#dcfce7','#15803d'],
                    ['Loading Clerk',['boarding','seats'],'#fef9c3','#92400e'],
                    ['Operator Admin',['all modules'],'#f3e8ff','#7c3aed'],
                  ].map(([role,perms,bg,c])=>(
                    <div key={role} style={{ background:'var(--white)',borderRadius:12,padding:14 }}>
                      <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:13,color:c,marginBottom:8 }}>{role}</div>
                      {perms.map(p=><div key={p} style={{ fontSize:11,color:'var(--gray-text)',marginBottom:4 }}>✓ {p}</div>)}
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* ══ DOCUMENTS ══ */}
        {active==='documents' && (
          <Section title="📂 Document Management System">
            <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:16 }}>
              <button onClick={()=>toast('Upload document — connect to file storage','success')} style={{ padding:'10px 20px',borderRadius:20,background:'var(--blue)',color:'var(--white)',border:'none',fontFamily:'var(--font-head)',fontWeight:700,fontSize:13,cursor:'pointer' }}>⬆️ Upload Document</button>
            </div>
            {MOCK_DOCS.map((d,i)=>(
              <div key={i} style={{ display:'flex',alignItems:'center',gap:14,padding:'14px 0',borderBottom:'1px solid var(--gray-mid)' }}>
                <div style={{ width:44,height:44,borderRadius:12,background:'#dbeafe',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0 }}>📄</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:14 }}>{d.name}</div>
                  <div style={{ fontSize:12,color:'var(--gray-text)' }}>{d.operator} · {d.type} · {d.date} · {d.size}</div>
                </div>
                <Pill color={d.status==='active'?'#15803d':'#dc2626'} text={d.status}/>
                <div style={{ display:'flex',gap:6 }}>
                  <button onClick={()=>toast('View: '+d.name,'success')} style={{ padding:'6px 12px',borderRadius:12,background:'#dbeafe',color:'#1d4ed8',border:'none',fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,cursor:'pointer' }}>View</button>
                  <button onClick={()=>toast('Download: '+d.name,'success')} style={{ padding:'6px 12px',borderRadius:12,background:'var(--gray-light)',color:'var(--dark)',border:'none',fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,cursor:'pointer' }}>⬇️</button>
                  <button onClick={()=>toast('Archived: '+d.name,'warning')} style={{ padding:'6px 12px',borderRadius:12,background:'#fef9c3',color:'#92400e',border:'none',fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,cursor:'pointer' }}>Archive</button>
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* ══ ALERTS ══ */}
        {active==='alerts' && (
          <div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:20 }}>
              {[['🔴 Urgent',MOCK_ALERTS.filter(a=>a.type==='urgent').length,'#fee2e2','#dc2626'],['🟡 Normal',MOCK_ALERTS.filter(a=>a.type==='normal').length,'#fef9c3','#92400e']].map(([l,v,bg,c])=>(
                <div key={l} style={{ background:bg,borderRadius:14,padding:18,display:'flex',alignItems:'center',gap:14 }}>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:28,color:c }}>{v}</div>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:15,color:c }}>{l} Alerts</div>
                </div>
              ))}
            </div>
            <Section title="🔔 Alerts Inbox">
              {MOCK_ALERTS.map(a=>(
                <div key={a.id} style={{ display:'flex',alignItems:'flex-start',gap:12,padding:'14px 0',borderBottom:'1px solid var(--gray-mid)' }}>
                  <span style={{ fontSize:20,flexShrink:0,marginTop:2 }}>{a.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:14,marginBottom:3 }}>{a.title}</div>
                    <div style={{ fontSize:13,color:'var(--gray-text)',marginBottom:6 }}>{a.detail}</div>
                    <div style={{ fontSize:11,color:'var(--gray-text)' }}>{a.time}</div>
                  </div>
                  <button onClick={()=>setActive(a.link)} style={{ padding:'6px 14px',borderRadius:14,background:'var(--blue)',color:'var(--white)',border:'none',fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,cursor:'pointer',flexShrink:0 }}>View →</button>
                </div>
              ))}
            </Section>
          </div>
        )}

        {/* ══ SETTINGS ══ */}
        {active==='settings' && (
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:20 }}>
            <Section title="💰 Revenue Controls">
              <div style={{ marginBottom:18 }}>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
                  <span style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:14 }}>Price Markup (%)</span>
                  <span style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:14,color:'var(--blue)' }}>{markup}%</span>
                </div>
                <input type="range" min={0} max={30} value={markup} onChange={e=>setMarkup(e.target.value)} style={{ width:'100%',accentColor:'var(--blue)' }}/>
                <div style={{ fontSize:12,color:'var(--gray-text)',marginTop:4 }}>Applied to base ticket price before display</div>
              </div>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18 }}>
                <div>
                  <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:14 }}>Peak Pricing</div>
                  <div style={{ fontSize:12,color:'var(--gray-text)' }}>Auto-raise prices on high-demand days</div>
                </div>
                <div onClick={()=>{setPeakPricing(!peakPricing);toast(peakPricing?'Peak pricing disabled':'Peak pricing enabled','success')}} style={{ width:44,height:24,borderRadius:12,background:peakPricing?'var(--blue)':'var(--gray-mid)',position:'relative',cursor:'pointer',transition:'all 0.25s' }}>
                  <div style={{ width:20,height:20,borderRadius:'50%',background:'white',position:'absolute',top:2,left:peakPricing?22:2,transition:'all 0.25s',boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }}/>
                </div>
              </div>
              <div style={{ background:'var(--gray-light)',borderRadius:12,padding:14 }}>
                <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13,marginBottom:8 }}>Commission Rate</div>
                <div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:22,color:'var(--blue)' }}>8%</div>
                <div style={{ fontSize:12,color:'var(--gray-text)' }}>Auto-deducted on payout release</div>
              </div>
            </Section>

            <Section title="🏦 Sacco Module Control">
              <div style={{ background:saccoEnabled?'#dcfce7':'#fee2e2',borderRadius:14,padding:18,marginBottom:18,textAlign:'center' }}>
                <div style={{ fontSize:32,marginBottom:8 }}>{saccoEnabled?'✅':'❌'}</div>
                <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:16,color:saccoEnabled?'#15803d':'#dc2626',marginBottom:4 }}>Sacco Module {saccoEnabled?'Active':'Inactive'}</div>
                <div style={{ fontSize:13,color:'var(--gray-text)' }}>{saccoEnabled?'Operators can access Sacco features':'Module disabled for all operators'}</div>
              </div>
              <div style={{ background:'#fff3cd',borderRadius:12,padding:'12px 14px',marginBottom:16,fontSize:12,color:'#92400e',fontFamily:'var(--font-head)',fontWeight:600 }}>
                ⚠️ Raylane provides the system only. We do NOT manage Sacco funds. Activate only after operator pays the Sacco subscription.
              </div>
              <button onClick={()=>{setSaccoEnabled(!saccoEnabled);toast(saccoEnabled?'Sacco module disabled':'Sacco module enabled for all operators','success')}} style={{ width:'100%',padding:'12px',borderRadius:14,background:saccoEnabled?'#fee2e2':'#dcfce7',color:saccoEnabled?'#dc2626':'#15803d',border:'none',fontFamily:'var(--font-head)',fontWeight:800,fontSize:14,cursor:'pointer' }}>
                {saccoEnabled?'❌ Disable Sacco Module':'✅ Enable Sacco Module'}
              </button>
            </Section>
          </div>
        )}

        {/* ══ GENERIC PLACEHOLDER ══ */}
        {!['overview','payouts','users','documents','alerts','settings'].includes(active) && (
          <div style={{ background:'var(--white)',borderRadius:16,padding:40,boxShadow:'var(--shadow-sm)',textAlign:'center' }}>
            <div style={{ fontSize:56,marginBottom:16 }}>{NAV.find(n=>n.id===active)?.icon}</div>
            <h3 style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:22,marginBottom:8 }}>{NAV.find(n=>n.id===active)?.label} Module</h3>
            <p style={{ color:'var(--gray-text)',maxWidth:400,margin:'0 auto' }}>Connect to the Raylane backend API to manage {active} in real-time.</p>
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminStats } from '../../data'
import { useToast } from '../../hooks/useToast'

const navItems = [
  { icon:'📊', label:'Overview', id:'overview' },
  { icon:'🚌', label:'Operators', id:'operators' },
  { icon:'🗺️', label:'Routes', id:'routes' },
  { icon:'🎫', label:'Bookings', id:'bookings' },
  { icon:'💳', label:'Payments', id:'payments' },
  { icon:'📦', label:'Parcels', id:'parcels' },
  { icon:'💰', label:'Sacco', id:'sacco' },
  { icon:'👥', label:'Users', id:'users' },
  { icon:'📈', label:'Reports', id:'reports' },
  { icon:'⚙️', label:'Settings', id:'settings' },
]

export default function AdminDashboard() {
  const [active, setActive] = useState('overview')
  const [approvals, setApprovals] = useState(adminStats.pendingApprovals.map((a,i)=>({...a,id:i,status:'pending'})))
  const toast = useToast()
  const navigate = useNavigate()

  const handleApprove = (id) => {
    setApprovals(a => a.map(x => x.id===id ? {...x,status:'approved'} : x))
    toast('✅ Operator approved and route is now live!', 'success')
  }

  const handleReject = (id) => {
    setApprovals(a => a.map(x => x.id===id ? {...x,status:'rejected'} : x))
    toast('❌ Operator rejected', 'error')
  }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--gray-light)', paddingTop:64 }}>
      {/* Sidebar */}
      <div style={{ width:200, background:'#0a0f1e', flexShrink:0, display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'16px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:900, fontSize:11, color:'var(--blue)' }}>RLX</div>
          <div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:13, color:'var(--white)' }}>Admin Panel</div>
            <div style={{ fontSize:10, color:'var(--gold)', fontFamily:'var(--font-head)' }}>Raylane Express</div>
          </div>
        </div>
        <nav style={{ flex:1, padding:'8px 0', overflowY:'auto' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={()=>setActive(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 16px', background: active===item.id ? 'rgba(255,199,44,0.12)' : 'none', border:'none', color: active===item.id ? 'var(--gold)' : 'rgba(255,255,255,0.65)', cursor:'pointer', fontFamily:'var(--font-head)', fontWeight:600, fontSize:12, borderLeft: active===item.id ? '3px solid var(--gold)' : '3px solid transparent', transition:'all 0.2s', whiteSpace:'nowrap' }}>
              <span style={{ fontSize:15, flexShrink:0 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:12, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={()=>navigate('/')} style={{ width:'100%', padding:'9px', borderRadius:10, background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.6)', border:'none', cursor:'pointer', fontFamily:'var(--font-head)', fontWeight:600, fontSize:11 }}>← Back to Site</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <h1 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:22 }}>
            {active==='overview'?'Raylane Admin Dashboard':navItems.find(n=>n.id===active)?.label}
          </h1>
          <div style={{ display:'flex', gap:10 }}>
            <button style={{ width:36, height:36, borderRadius:10, background:'var(--white)', border:'none', cursor:'pointer', boxShadow:'var(--shadow-sm)', fontSize:16 }}>🔔</button>
            <button style={{ width:36, height:36, borderRadius:10, background:'var(--white)', border:'none', cursor:'pointer', boxShadow:'var(--shadow-sm)', fontSize:16 }}>🔍</button>
            <div style={{ width:36, height:36, borderRadius:10, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--white)', fontFamily:'var(--font-head)', fontWeight:800, fontSize:12 }}>AD</div>
          </div>
        </div>

        {active === 'overview' && (
          <>
            {/* KPI Cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
              {[
                ['Daily Bookings', adminStats.dailyBookings.toLocaleString(), '+11.5%', '🎫', '#dbeafe', '#1d4ed8'],
                ['Revenue Today', 'UGX '+Math.round(adminStats.revenueTodayUGX/1000000)+'M', '+6.3%', '💰', '#dcfce7', '#15803d'],
                ['Commission', 'UGX '+Math.round(adminStats.commission/1000000)+'M', '+0.9%', '💎', '#fef9c3', '#92400e'],
                ['Active Operators', adminStats.activeOperators, 'Live', '🚌', '#f3e8ff', '#7c3aed'],
              ].map(([l,v,sub,ic,bg,c])=>(
                <div key={l} style={{ background:'var(--white)', borderRadius:16, padding:20, boxShadow:'var(--shadow-sm)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                    <div style={{ width:42, height:42, borderRadius:12, background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{ic}</div>
                    <span style={{ background:`${c}18`, color:c, padding:'3px 9px', borderRadius:20, fontSize:11, fontFamily:'var(--font-head)', fontWeight:700 }}>{sub}</span>
                  </div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:22, color:c, marginBottom:4 }}>{v}</div>
                  <div style={{ fontSize:13, color:'var(--gray-text)' }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Main panels */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              {/* Pending Approvals */}
              <div style={{ background:'var(--white)', borderRadius:16, padding:22, boxShadow:'var(--shadow-sm)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                  <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16 }}>Pending Approvals</h3>
                  <span style={{ background:'#fee2e2', color:'#dc2626', padding:'3px 10px', borderRadius:20, fontSize:11, fontFamily:'var(--font-head)', fontWeight:700 }}>{approvals.filter(a=>a.status==='pending').length} pending</span>
                </div>
                {approvals.map((a)=>(
                  <div key={a.id} style={{ padding:'14px 0', borderBottom:'1px solid var(--gray-mid)', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:'rgba(11,61,145,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🚌</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:14 }}>{a.name}</div>
                      <div style={{ fontSize:12, color:'var(--gray-text)' }}>{a.route}</div>
                    </div>
                    {a.status === 'pending' ? (
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={()=>handleApprove(a.id)} style={{ padding:'6px 14px', borderRadius:20, background:'#dcfce7', color:'#15803d', border:'none', fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, cursor:'pointer' }}>Approve</button>
                        <button onClick={()=>handleReject(a.id)} style={{ padding:'6px 14px', borderRadius:20, background:'#fee2e2', color:'#dc2626', border:'none', fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, cursor:'pointer' }}>Reject</button>
                      </div>
                    ) : (
                      <span style={{ padding:'5px 12px', borderRadius:20, background: a.status==='approved'?'#dcfce7':'#fee2e2', color: a.status==='approved'?'#15803d':'#dc2626', fontFamily:'var(--font-head)', fontWeight:700, fontSize:12 }}>{a.status==='approved'?'✅ Approved':'❌ Rejected'}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Recent Payments */}
              <div style={{ background:'var(--white)', borderRadius:16, padding:22, boxShadow:'var(--shadow-sm)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                  <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16 }}>Recent Payments</h3>
                  <button style={{ background:'none', border:'none', color:'var(--blue)', cursor:'pointer', fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>View All</button>
                </div>
                {adminStats.recentPayments.map((p,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom: i<adminStats.recentPayments.length-1?'1px solid var(--gray-mid)':'' }}>
                    <div style={{ width:40, height:40, borderRadius:12, background: p.method.includes('MTN')?'#fff9e6':'#fff0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                      {p.method.includes('MTN') ? '📱' : '📲'}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>{p.method}</div>
                      <div style={{ fontSize:11, color:'var(--gray-text)' }}>{p.id}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:14, color:'var(--blue)' }}>UGX {p.amount.toLocaleString()}</div>
                      <span style={{ background:'#dcfce7', color:'#15803d', padding:'2px 8px', borderRadius:10, fontSize:10, fontFamily:'var(--font-head)', fontWeight:700 }}>PAID</span>
                    </div>
                  </div>
                ))}

                {/* Revenue summary */}
                <div style={{ marginTop:20, background:'var(--gray-light)', borderRadius:14, padding:'16px' }}>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, marginBottom:12, color:'var(--gray-text)' }}>Revenue Breakdown</div>
                  {[['Booking Revenue', 74610000, '#0B3D91'],['Commissions', 5968800, '#FFC72C'],['Parcel Revenue', 3200000, '#22c55e']].map(([l,v,c])=>(
                    <div key={l} style={{ marginBottom:10 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:12 }}>
                        <span style={{ fontFamily:'var(--font-head)', fontWeight:600 }}>{l}</span>
                        <span style={{ fontFamily:'var(--font-head)', fontWeight:700 }}>UGX {(v/1000000).toFixed(1)}M</span>
                      </div>
                      <div style={{ height:6, background:'var(--gray-mid)', borderRadius:3, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${(v/74610000)*100}%`, background:c, borderRadius:3 }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Operators table */}
            <div style={{ background:'var(--white)', borderRadius:16, padding:22, boxShadow:'var(--shadow-sm)', marginTop:20 }}>
              <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, marginBottom:18 }}>Top Performing Operators</h3>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ borderBottom:'2px solid var(--gray-mid)' }}>
                    {['Operator','Route','Bookings Today','Revenue','Rating','Status'].map(h=>(
                      <th key={h} style={{ padding:'8px 12px', fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, color:'var(--gray-text)', textAlign:'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Global Coaches','Kampala→Mbale',36,'UGX 900K',4.8,'active'],
                    ['YY Coaches','Kampala→Gulu',24,'UGX 624K',4.6,'active'],
                    ['Link Bus','Kampala→Nairobi',18,'UGX 1.08M',4.5,'active'],
                    ['City Taxi','Kampala→Entebbe',12,'UGX 240K',4.2,'pending'],
                  ].map(([n,r,b,rev,rat,st],i)=>(
                    <tr key={i} style={{ borderBottom:'1px solid var(--gray-mid)', transition:'background 0.15s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--gray-light)'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <td style={{ padding:'12px', fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>{n}</td>
                      <td style={{ padding:'12px', fontSize:13, color:'var(--gray-text)' }}>{r}</td>
                      <td style={{ padding:'12px', fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>{b}</td>
                      <td style={{ padding:'12px', fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, color:'var(--blue)' }}>{rev}</td>
                      <td style={{ padding:'12px' }}>
                        <div style={{ display:'flex', gap:2 }}>
                          {[...Array(5)].map((_,j)=><span key={j} style={{ color:j<Math.floor(rat)?'var(--gold)':'var(--gray-mid)', fontSize:12 }}>★</span>)}
                        </div>
                      </td>
                      <td style={{ padding:'12px' }}>
                        <span style={{ background:st==='active'?'#dcfce7':'#fef9c3', color:st==='active'?'#15803d':'#92400e', padding:'3px 10px', borderRadius:20, fontSize:11, fontFamily:'var(--font-head)', fontWeight:700 }}>{st}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {active !== 'overview' && (
          <div style={{ background:'var(--white)', borderRadius:16, padding:40, boxShadow:'var(--shadow-sm)', textAlign:'center' }}>
            <div style={{ fontSize:56, marginBottom:16 }}>{navItems.find(n=>n.id===active)?.icon}</div>
            <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:22, marginBottom:8 }}>{navItems.find(n=>n.id===active)?.label} Module</h3>
            <p style={{ color:'var(--gray-text)', maxWidth:400, margin:'0 auto' }}>This admin module is ready for backend integration. Connect to the Raylane API to manage {active} in real-time.</p>
          </div>
        )}
      </div>
    </div>
  )
}

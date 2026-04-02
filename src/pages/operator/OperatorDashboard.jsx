import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

const navItems = [
  { icon:'📊', label:'Dashboard', id:'dashboard' },
  { icon:'🚌', label:'Trips', id:'trips' },
  { icon:'🎫', label:'Bookings', id:'bookings' },
  { icon:'📦', label:'Parcels', id:'parcels' },
  { icon:'💰', label:'Sacco', id:'sacco' },
  { icon:'📈', label:'Reports', id:'reports' },
  { icon:'⚙️', label:'Settings', id:'settings' },
]

const todaysTrips = [
  { route:'Kampala → Mbale', vehicle:'UBF 234K', time:'10:00 AM', seats:'36/65', status:'ON TIME', statusColor:'#22c55e' },
  { route:'Mbale → Kampala', vehicle:'UBF 234K', time:'4:00 PM', seats:'12/65', status:'SCHEDULED', statusColor:'#3b82f6' },
]

const bookings = [
  { name:'Sarah N.', seat:5, phone:'0771-xxx-xxx', paid:'UGX 25,000', status:'confirmed' },
  { name:'David O.', seat:12, phone:'0700-xxx-xxx', paid:'UGX 25,000', status:'confirmed' },
  { name:'Grace A.', seat:23, phone:'0752-xxx-xxx', paid:'UGX 25,000', status:'pending' },
  { name:'Moses B.', seat:31, phone:'0781-xxx-xxx', paid:'UGX 25,000', status:'confirmed' },
  { name:'Prossy N.', seat:44, phone:'0703-xxx-xxx', paid:'UGX 25,000', status:'confirmed' },
]

export default function OperatorDashboard() {
  const [active, setActive] = useState('dashboard')
  const [sideOpen, setSideOpen] = useState(true)
  const toast = useToast()
  const navigate = useNavigate()

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--gray-light)', paddingTop:64 }}>
      {/* Sidebar */}
      <div style={{ width:sideOpen?200:64, background:'var(--blue)', transition:'width 0.3s ease', flexShrink:0, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'20px 16px', borderBottom:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {sideOpen && <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:13, color:'var(--gold)', whiteSpace:'nowrap' }}>Global Coaches</div>}
          <button onClick={()=>setSideOpen(!sideOpen)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:16, padding:4 }}>☰</button>
        </div>
        <nav style={{ flex:1, padding:'12px 0' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={()=>setActive(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'11px 16px', background: active===item.id ? 'rgba(255,199,44,0.15)' : 'none', border:'none', color: active===item.id ? 'var(--gold)' : 'rgba(255,255,255,0.7)', cursor:'pointer', fontFamily:'var(--font-head)', fontWeight:600, fontSize:13, borderLeft: active===item.id ? '3px solid var(--gold)' : '3px solid transparent', transition:'all 0.2s', whiteSpace:'nowrap' }}>
              <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
              {sideOpen && item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:12, borderTop:'1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={()=>navigate('/')} style={{ width:'100%', padding:'10px', borderRadius:10, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.7)', border:'none', cursor:'pointer', fontFamily:'var(--font-head)', fontWeight:600, fontSize:12 }}>
            {sideOpen ? '← Back to Site' : '←'}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflow:'auto', padding:24 }}>
        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <h1 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:22 }}>
            {active==='dashboard'?'Operator Dashboard':active.charAt(0).toUpperCase()+active.slice(1)}
          </h1>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <div style={{ background:'var(--white)', borderRadius:10, padding:'8px 14px', display:'flex', alignItems:'center', gap:8, boxShadow:'var(--shadow-sm)' }}>
              <div style={{ width:28, height:28, borderRadius:8, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--white)', fontFamily:'var(--font-head)', fontWeight:800, fontSize:12 }}>GC</div>
              <div>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:12 }}>Global Coaches</div>
                <div style={{ fontSize:11, color:'var(--gray-text)' }}>Operator</div>
              </div>
            </div>
            <button style={{ width:36, height:36, borderRadius:10, background:'var(--white)', border:'none', cursor:'pointer', boxShadow:'var(--shadow-sm)', fontSize:16 }}>🔔</button>
            <button style={{ width:36, height:36, borderRadius:10, background:'var(--white)', border:'none', cursor:'pointer', boxShadow:'var(--shadow-sm)', fontSize:16 }}>🔍</button>
          </div>
        </div>

        {/* Dashboard content */}
        {active === 'dashboard' && (
          <>
            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
              {[['Today\'s Revenue','UGX 900,000','📈','+12%','#dcfce7','#15803d'],['Total Bookings','36','🎫','Today','#dbeafe','#1d4ed8'],['Active Routes','4','🗺️','Live','#fef9c3','#92400e'],['Rating','4.8 ★','⭐','312 reviews','#f3e8ff','#7c3aed']].map(([l,v,ic,sub,bg,c])=>(
                <div key={l} style={{ background:'var(--white)', borderRadius:16, padding:20, boxShadow:'var(--shadow-sm)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{ic}</div>
                    <span style={{ fontSize:11, color:c, background:bg, padding:'3px 8px', borderRadius:20, fontFamily:'var(--font-head)', fontWeight:700 }}>{sub}</span>
                  </div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:20, marginBottom:4 }}>{v}</div>
                  <div style={{ fontSize:13, color:'var(--gray-text)' }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Today's Trips */}
            <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:20, marginBottom:20 }}>
              <div style={{ background:'var(--white)', borderRadius:16, padding:22, boxShadow:'var(--shadow-sm)' }}>
                <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, marginBottom:18 }}>Today's Trips</h3>
                {todaysTrips.map((t,i)=>(
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', gap:14, alignItems:'center', padding:'14px 0', borderBottom: i<todaysTrips.length-1?'1px solid var(--gray-mid)':'' }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:'rgba(11,61,145,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🚌</div>
                    <div>
                      <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:14 }}>{t.route}</div>
                      <div style={{ fontSize:12, color:'var(--gray-text)' }}>{t.vehicle} · {t.time}</div>
                      <div style={{ fontSize:12, color:'var(--gray-text)', display:'flex', alignItems:'center', gap:8, marginTop:3 }}>
                        <span>🪑 {t.seats}</span>
                      </div>
                    </div>
                    <span style={{ background:`${t.statusColor}18`, color:t.statusColor, padding:'4px 10px', borderRadius:20, fontFamily:'var(--font-head)', fontWeight:700, fontSize:10 }}>{t.status}</span>
                  </div>
                ))}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:16 }}>
                  {[['🪑 Seat Management','Update seats'],['👥 Passenger List','View details'],['⚠️ Report Issue','Quick actions']].map(([l,s])=>(
                    <button key={l} onClick={()=>toast(`${s} opened`,'success')} style={{ padding:'10px', borderRadius:12, background:'var(--blue)', color:'var(--white)', border:'none', fontFamily:'var(--font-head)', fontWeight:700, fontSize:11, cursor:'pointer', textAlign:'center', lineHeight:1.4 }}>
                      {l}<br/><span style={{ fontSize:10, opacity:0.75 }}>{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings list */}
              <div style={{ background:'var(--white)', borderRadius:16, padding:22, boxShadow:'var(--shadow-sm)' }}>
                <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, marginBottom:18 }}>Recent Bookings</h3>
                {bookings.map((b,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom: i<bookings.length-1?'1px solid var(--gray-mid)':'' }}>
                    <div style={{ width:34, height:34, borderRadius:8, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--white)', fontFamily:'var(--font-head)', fontWeight:800, fontSize:11, flexShrink:0 }}>{b.name[0]}{b.name.split(' ')[1]?.[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>{b.name}</div>
                      <div style={{ fontSize:11, color:'var(--gray-text)' }}>Seat {b.seat} · {b.paid}</div>
                    </div>
                    <span style={{ background:b.status==='confirmed'?'#dcfce7':'#fef9c3', color:b.status==='confirmed'?'#15803d':'#92400e', padding:'3px 8px', borderRadius:20, fontSize:10, fontFamily:'var(--font-head)', fontWeight:700 }}>{b.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {active === 'sacco' && <SaccoModule />}
        {active !== 'dashboard' && active !== 'sacco' && (
          <div style={{ background:'var(--white)', borderRadius:16, padding:32, boxShadow:'var(--shadow-sm)', textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>{navItems.find(n=>n.id===active)?.icon}</div>
            <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:20, marginBottom:8 }}>{active.charAt(0).toUpperCase()+active.slice(1)} Module</h3>
            <p style={{ color:'var(--gray-text)' }}>This module is ready for integration with the Raylane backend API.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SaccoModule() {
  const saccoData = { totalMembers:120, totalSavings:45600000, outstandingLoans:12800000, members:[{name:'John Doe',loan:1000000,status:'pending'},{name:'Jane Smith',loan:500000,status:'approved'},{name:'Peter Okello',loan:2000000,status:'repaid'}], savingsChart:[18,22,30,28,35,45] }
  const toast = useToast()
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
        {[['Total Members',saccoData.totalMembers,'👥','#dbeafe','#1d4ed8'],['Total Savings','UGX '+Math.round(saccoData.totalSavings/1000000)+'M','💰','#dcfce7','#15803d'],['Outstanding Loans','UGX '+Math.round(saccoData.outstandingLoans/1000000)+'M','📋','#fef9c3','#92400e']].map(([l,v,ic,bg,c])=>(
          <div key={l} style={{ background:'var(--white)', borderRadius:16, padding:20, boxShadow:'var(--shadow-sm)', display:'flex', gap:14, alignItems:'center' }}>
            <div style={{ width:48, height:48, borderRadius:14, background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{ic}</div>
            <div>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:20, color:c }}>{v}</div>
              <div style={{ fontSize:13, color:'var(--gray-text)' }}>{l}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div style={{ background:'var(--white)', borderRadius:16, padding:22, boxShadow:'var(--shadow-sm)' }}>
          <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, marginBottom:16 }}>Recent Loans</h3>
          {saccoData.members.map((m,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:i<saccoData.members.length-1?'1px solid var(--gray-mid)':'' }}>
              <div style={{ width:34, height:34, borderRadius:8, background:'var(--blue)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:800, fontSize:12, flexShrink:0 }}>{m.name[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>{m.name}</div>
                <div style={{ fontSize:12, color:'var(--gray-text)' }}>UGX {m.loan.toLocaleString()}</div>
              </div>
              <span style={{ background:m.status==='approved'?'#dcfce7':m.status==='repaid'?'#dbeafe':'#fef9c3', color:m.status==='approved'?'#15803d':m.status==='repaid'?'#1d4ed8':'#92400e', padding:'3px 10px', borderRadius:20, fontSize:11, fontFamily:'var(--font-head)', fontWeight:700 }}>{m.status}</span>
            </div>
          ))}
        </div>
        <div style={{ background:'var(--white)', borderRadius:16, padding:22, boxShadow:'var(--shadow-sm)' }}>
          <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, marginBottom:16 }}>Savings Growth</h3>
          <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:120, padding:'0 8px' }}>
            {saccoData.savingsChart.map((v,i)=>(
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{ width:'100%', background:'var(--blue)', borderRadius:'4px 4px 0 0', height:`${(v/50)*100}%`, minHeight:8, transition:'all 0.3s' }}/>
                <span style={{ fontSize:10, color:'var(--gray-text)' }}>{['Jan','Feb','Mar','Apr','May','Jun'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

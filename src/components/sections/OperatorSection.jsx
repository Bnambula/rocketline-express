import React from 'react'
import { useNavigate } from 'react-router-dom'
const P = { fontFamily:"'Sora',sans-serif" }
const I = { fontFamily:"'Inter',sans-serif" }

const BENEFITS = [
  ['Real-time seat sync', 'Your seats update live -- no overbooking ever'],
  ['Instant MoMo payouts', 'Weekly settlement to your merchant code, minus commission'],
  ['Full operator dashboard', 'Trips, drivers, costs, P&L, insurance tracker, QuickBooks export'],
  ['Compliance alerts', 'Auto-alerts 60 days before licence, insurance, and fitness expiry'],
  ['Parcel revenue stream', 'Earn on parcels sent on your buses -- zero extra work'],
  ['Analytics and insights', 'Load factors, peak routes, revenue trends, passenger demographics'],
]

export default function OperatorSection() {
  const navigate = useNavigate()
  return (
    <section style={{ background:'var(--white)', padding:'80px 0', overflow:'hidden' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>
          <div>
            <div className="section-label">For Operators</div>
            <h2 className="section-title">Grow Your Fleet <span>Business</span></h2>
            <p style={{ color:'var(--text-secondary)', fontSize:15, lineHeight:1.75, ...I, marginBottom:28 }}>
              Join 150+ operators already using Raylane to fill more seats, manage compliance, and run a more profitable business. We handle bookings, payments, and passenger comms -- you focus on driving.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:32 }}>
              {BENEFITS.map(([title, desc], i) => (
                <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', background:'var(--success-bg)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                    <svg width="12" height="12" fill="none" stroke="var(--success)" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <div>
                    <div style={{ ...P, fontWeight:700, fontSize:14, marginBottom:2 }}>{title}</div>
                    <div style={{ fontSize:12, color:'var(--text-secondary)', ...I }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <button onClick={() => navigate('/partner')} className="btn btn-blue">Apply to Join</button>
              <button onClick={() => navigate('/partner#how')} className="btn btn-outline btn-sm">How it works</button>
            </div>
          </div>
          <div style={{ background:'linear-gradient(135deg,var(--blue),#1652b8)', borderRadius:'var(--r-xl)', padding:32, color:'#fff' }}>
            <div style={{ ...P, fontWeight:800, fontSize:22, marginBottom:8 }}>Revenue Calculator</div>
            <p style={{ fontSize:13, color:'rgba(255,255,255,.7)', ...I, marginBottom:24 }}>Estimate your monthly earnings on Raylane</p>
            {[['Seats per bus','67'],['Daily departures','2'],['Average occupancy','72%'],['Average fare','UGX 28,000']].map(([l,v])=>(
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,.12)', fontSize:13 }}>
                <span style={{ ...I, color:'rgba(255,255,255,.7)' }}>{l}</span>
                <span style={{ ...P, fontWeight:700, color:'#FFC72C' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:20, background:'rgba(255,199,44,.15)', borderRadius:12, padding:'16px', textAlign:'center' }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.6)', ...I, marginBottom:4 }}>Estimated Monthly Revenue</div>
              <div style={{ ...P, fontWeight:900, fontSize:28, color:'#FFC72C' }}>UGX 81.6M</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', ...I, marginTop:4 }}>after 8% Raylane commission</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import React from 'react'
import { useNavigate } from 'react-router-dom'
const P = { fontFamily:"'Sora',sans-serif" }
const I = { fontFamily:"'Inter',sans-serif" }

export default function Footer() {
  const navigate = useNavigate()
  const year = new Date().getFullYear()
  const cols = [
    { title:'Travel', links:[['Book a Seat','/book'],['Send Parcel','/parcels'],['Private Hire','/book?type=hire'],['Group Booking','/book?type=group'],['Track Parcel','/parcels?tab=track']] },
    { title:'Company', links:[['About Raylane','/#about'],['Partner with Us','/partner'],['Careers','/#careers'],['Press','/#press'],['Contact','/#help']] },
    { title:'Support', links:[['Help Centre','/#help'],['Cancellation Policy','/#policy'],['Insurance','/#insurance'],['Accessibility','/#access'],['Safety','/#safety']] },
    { title:'Operators', links:[['Join as Operator','/partner'],['Operator Login','/admin'],['Operator Dashboard','/admin'],['SaaS Modules','/partner#services'],['API Docs','/#api']] },
  ]
  return (
    <footer style={{ background:'var(--blue-deep)', color:'rgba(255,255,255,.8)', padding:'60px 0 0' }}>
      <div className="container">
        <div className="footer-grid" style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:32, paddingBottom:40, borderBottom:'1px solid rgba(255,255,255,.1)' }}>
          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'#FFC72C', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="22" height="18" viewBox="0 0 20 16" fill="none"><path d="M1 13 L7 3 L12 9 L16 3 L19 13" stroke="#0B3D91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="3" cy="14" r="1.8" fill="#0B3D91"/><circle cx="17" cy="14" r="1.8" fill="#0B3D91"/></svg>
              </div>
              <div>
                <div style={{ ...P, fontWeight:800, fontSize:16, color:'#fff' }}>RAYLANE</div>
                <div style={{ fontSize:9, color:'#FFC72C', letterSpacing:2.5, ...P }}>EXPRESS</div>
              </div>
            </div>
            <p style={{ fontSize:13, lineHeight:1.75, ...I, color:'rgba(255,255,255,.6)', marginBottom:16, maxWidth:260 }}>
              Uganda's first vertically integrated transport technology platform. Real seats. Real payments. Tusimbudde.
            </p>
            <div style={{ display:'flex', gap:8 }}>
              {['MTN','Airtel','Visa','Mastercard'].map(m => (
                <span key={m} style={{ background:'rgba(255,255,255,.1)', borderRadius:6, padding:'4px 8px', fontSize:10, ...P, fontWeight:700, color:'rgba(255,255,255,.7)' }}>{m}</span>
              ))}
            </div>
          </div>
          {cols.map(c => (
            <div key={c.title}>
              <div style={{ ...P, fontWeight:700, fontSize:12, color:'#FFC72C', textTransform:'uppercase', letterSpacing:1.5, marginBottom:14 }}>{c.title}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {c.links.map(([l, to]) => (
                  <button key={l} onClick={() => navigate(to)} style={{ textAlign:'left', fontSize:13, ...I, color:'rgba(255,255,255,.6)', background:'none', border:'none', cursor:'pointer', padding:0, transition:'color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.color='#FFC72C'}
                    onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,.6)'}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding:'20px 0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontSize:12, ...I, color:'rgba(255,255,255,.4)' }}>
            {year} Raylane Express Ltd. Kampala, Uganda. All rights reserved.
          </div>
          <div style={{ display:'flex', gap:16 }}>
            {['Privacy Policy','Terms of Service','Cookie Policy'].map(l => (
              <span key={l} style={{ fontSize:11, ...I, color:'rgba(255,255,255,.35)', cursor:'pointer' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

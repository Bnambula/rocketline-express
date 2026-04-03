import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) { el.scrollIntoView({ behavior:'smooth' }) }
}

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const go = (path, hash) => {
    if (hash) {
      if (location.pathname !== '/') { navigate('/'); setTimeout(() => scrollTo(hash), 350) }
      else scrollTo(hash)
    } else {
      navigate(path)
      window.scrollTo({ top:0, behavior:'smooth' })
    }
  }

  const cols = [
    { title:'Company', links:[
      { l:'About Raylane',   hash:'help' },
      { l:'How It Works',    hash:'how-it-works' },
      { l:'Where We Go',     hash:'where-we-go' },
      { l:'Partner With Us', path:'/partner' },
      { l:'Operator Portal', path:'/operator' },
      { l:'Admin Login',     path:'/admin' },
    ]},
    { title:'Book Travel', links:[
      { l:'Search Routes',   path:'/book' },
      { l:'Book a Bus',      path:'/book?type=bus' },
      { l:'Book a Taxi',     path:'/book?type=taxi' },
      { l:'Popular Routes',  hash:'where-we-go' },
      { l:'Group Booking',   path:'/book' },
      { l:'Special Hire',    path:'/book' },
    ]},
    { title:'Parcels', links:[
      { l:'Send a Parcel',   path:'/parcels' },
      { l:'Track Parcel',    path:'/parcels?tab=track' },
      { l:'Parcel Pricing',  path:'/parcels' },
      { l:'Business Cargo',  path:'/parcels' },
      { l:'Insured Delivery',path:'/parcels' },
      { l:'Pickup Rider',    path:'/parcels' },
    ]},
    { title:'Operators', links:[
      { l:'Join Raylane',      path:'/partner' },
      { l:'Operator Dashboard',path:'/operator' },
      { l:'Add a Trip',        path:'/operator' },
      { l:'Sacco Module',      path:'/operator' },
      { l:'Staff / HR Tools',  path:'/operator' },
      { l:'Revenue Reports',   path:'/operator' },
    ]},
    { title:'Support', links:[
      { l:'Help Center',      hash:'help' },
      { l:'Payment Issues',   hash:'help' },
      { l:'Refund Policy',    hash:'help' },
      { l:'Privacy Policy',   hash:'help' },
      { l:'Terms of Service', hash:'help' },
      { l:'Contact Us',       hash:'help' },
    ]},
  ]

  return (
    <footer id="help" style={{ background:'#0a0f1e', color:'rgba(255,255,255,0.8)', padding:'56px 0 0' }}>
      <div className="container">

        {/* Help banner */}
        <div style={{ background:'linear-gradient(135deg,var(--blue),#0f4fa8)', borderRadius:18, padding:'24px 28px', marginBottom:48, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:18, color:'var(--white)', marginBottom:4 }}>Need Help? We're here 24/7</div>
            <div style={{ fontSize:13, opacity:.8 }}>Call: <strong>+256 700 000 000</strong> · WhatsApp: <strong>+256 752 000 000</strong> · Email: <strong>support@raylaneexpress.com</strong></div>
          </div>
          <button onClick={() => go('/book')} style={{ padding:'12px 24px', borderRadius:20, background:'var(--gold)', color:'var(--blue)', fontFamily:'var(--font-head)', fontWeight:800, fontSize:14, flexShrink:0 }}>
            Book Now →
          </button>
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr repeat(5,1fr)', gap:28, marginBottom:48 }}>
          {/* Brand col */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M1 15 L8 3 L13 10 L17 3 L21 15" stroke="#0B3D91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="3" cy="16" r="2" fill="#0B3D91"/><circle cx="19" cy="16" r="2" fill="#0B3D91"/></svg>
              </div>
              <div>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:16, color:'var(--white)', lineHeight:1 }}>RAYLANE</div>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:600, fontSize:9, color:'var(--gold)', letterSpacing:2.5, marginTop:1 }}>EXPRESS</div>
              </div>
            </div>
            <p style={{ fontSize:12, lineHeight:1.8, opacity:.6, marginBottom:18 }}>Uganda's first real-time bus & taxi booking platform. Connecting cities, transforming travel since 2024.</p>

            {/* Social */}
            <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
              {[['FB','#1877f2'],['TW','#1da1f2'],['IG','#e1306c'],['WA','#25d366'],['YT','#ff0000']].map(([l,c]) => (
                <a key={l} href="#" style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', color:c, fontFamily:'var(--font-head)', fontWeight:800, fontSize:10, border:'1px solid rgba(255,255,255,0.08)', transition:'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background=c; e.currentTarget.style.color='white' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color=c }}>{l}</a>
              ))}
            </div>

            {/* App badges */}
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {[['📱','Google Play','Coming Soon'],['🍎','App Store','Coming Soon']].map(([ic,s,sub]) => (
                <button key={s} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.75)', padding:'8px 12px', borderRadius:9, fontFamily:'var(--font-head)', fontWeight:600, fontSize:11, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span>{ic} {s}</span><span style={{ fontSize:9, opacity:.5 }}>{sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {cols.map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:11, color:'var(--white)', marginBottom:14, textTransform:'uppercase', letterSpacing:1.5 }}>{col.title}</h4>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8 }}>
                {col.links.map(({ l, path, hash }) => (
                  <li key={l}>
                    <button onClick={() => go(path||'/', hash)} style={{ color:'rgba(255,255,255,0.55)', fontSize:12, fontFamily:'var(--font-body)', lineHeight:1.4, transition:'color .2s', background:'none' }}
                      onMouseEnter={e => e.target.style.color='var(--gold)'}
                      onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.55)'}>{l}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payments + bottom */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:20, paddingBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14, marginBottom:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
              <span style={{ fontSize:10, opacity:.4, fontFamily:'var(--font-head)', fontWeight:600, textTransform:'uppercase', letterSpacing:1 }}>Pay via:</span>
              {[['MTN MoMo','#ffc300'],['Airtel Money','#e4002b']].map(([n,c]) => (
                <span key={n} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', color:c, padding:'4px 11px', borderRadius:7, fontFamily:'var(--font-head)', fontWeight:800, fontSize:10 }}>{n}</span>
              ))}
            </div>
            <div style={{ display:'flex', gap:14 }}>
              <span style={{ fontSize:10, opacity:.35 }}>🔐 SSL Secured</span>
              <span style={{ fontSize:10, opacity:.35 }}>🇺🇬 Made in Uganda</span>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
            <span style={{ fontSize:11, opacity:.38 }}>© {new Date().getFullYear()} Raylane Express Ltd. All rights reserved. Kampala, Uganda.</span>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              {['Privacy Policy','Terms of Service','Cookie Policy'].map(l => (
                <button key={l} onClick={() => go('/', 'help')} style={{ color:'rgba(255,255,255,0.35)', fontSize:11, fontFamily:'var(--font-body)', background:'none', transition:'color .2s' }}
                  onMouseEnter={e => e.target.style.color='var(--gold)'}
                  onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.35)'}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile footer — smaller grid */}
      <style>{`
        @media(max-width:767px){
          footer > .container > div:nth-child(2){ grid-template-columns:1fr 1fr !important; gap:20px !important; }
        }
        @media(max-width:480px){
          footer > .container > div:nth-child(2){ grid-template-columns:1fr !important; }
        }
      `}</style>
    </footer>
  )
}

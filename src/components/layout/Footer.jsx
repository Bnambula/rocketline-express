import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()
  const year = new Date().getFullYear()

  const cols = [
    {
      title: 'Company',
      links: [
        { label:'About Raylane', to:'/' },
        { label:'How It Works', to:'/' },
        { label:'Careers', to:'/' },
        { label:'Press & Media', to:'/' },
        { label:'Blog', to:'/' },
        { label:'Contact Us', to:'/' },
      ]
    },
    {
      title: 'Travel',
      links: [
        { label:'Search Routes', to:'/book' },
        { label:'Popular Routes', to:'/book' },
        { label:'Bus Operators', to:'/operator' },
        { label:'Book a Seat', to:'/book' },
        { label:'Group Booking', to:'/book' },
        { label:'Special Hire', to:'/book' },
      ]
    },
    {
      title: 'Parcels',
      links: [
        { label:'Send a Parcel', to:'/parcels' },
        { label:'Track Parcel', to:'/parcels' },
        { label:'Parcel Pricing', to:'/parcels' },
        { label:'Parcel Insurance', to:'/parcels' },
        { label:'Business Cargo', to:'/parcels' },
        { label:'Parcel FAQ', to:'/parcels' },
      ]
    },
    {
      title: 'Operators',
      links: [
        { label:'Join Raylane', to:'/operator' },
        { label:'Operator Dashboard', to:'/operator' },
        { label:'Partner Portal', to:'/partner' },
        { label:'Sacco Module', to:'/operator' },
        { label:'Admin Panel', to:'/admin' },
        { label:'Operator FAQ', to:'/operator' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label:'Help Center', to:'/' },
        { label:'Payment Issues', to:'/' },
        { label:'Report Issue', to:'/' },
        { label:'Privacy Policy', to:'/' },
        { label:'Terms of Service', to:'/' },
        { label:'Refund Policy', to:'/' },
      ]
    },
  ]

  return (
    <footer style={{ background:'#0a0f1e', color:'rgba(255,255,255,0.8)', padding:'64px 0 0' }}>
      <div className="container">
        {/* Top Row */}
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr repeat(5,1fr)', gap:32, marginBottom:48, flexWrap:'wrap' }}>
          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                  <path d="M2 16 L9 4 L15 11 L19 4 L22 16" stroke="#0B3D91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="4" cy="17" r="2.2" fill="#0B3D91"/>
                  <circle cx="20" cy="17" r="2.2" fill="#0B3D91"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:18, color:'var(--white)', lineHeight:1 }}>RAYLANE</div>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:500, fontSize:10, color:'var(--gold)', letterSpacing:2 }}>EXPRESS</div>
              </div>
            </div>
            <p style={{ fontSize:13, lineHeight:1.8, opacity:0.65, marginBottom:20 }}>
              Uganda's first real-time bus & taxi booking platform. Connecting cities, transforming travel.
            </p>
            {/* Social */}
            <div style={{ display:'flex', gap:10, marginBottom:20 }}>
              {[
                { label:'FB', color:'#1877f2' },
                { label:'TW', color:'#1da1f2' },
                { label:'IG', color:'#e1306c' },
                { label:'WA', color:'#25d366' },
                { label:'YT', color:'#ff0000' },
              ].map(s => (
                <a key={s.label} href="#" style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:800, fontSize:11, color:s.color, transition:'all 0.2s', border:'1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e=>{e.currentTarget.style.background=s.color;e.currentTarget.style.color='white'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.color=s.color}}>{s.label}</a>
              ))}
            </div>
            {/* Mobile app buttons */}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[['📱 Google Play','Coming Soon'],['🍎 App Store','Coming Soon']].map(([l,s]) => (
                <button key={l} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.8)', padding:'9px 14px', borderRadius:10, fontFamily:'var(--font-head)', fontWeight:600, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', transition:'all 0.2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.color='var(--gold)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.12)';e.currentTarget.style.color='rgba(255,255,255,0.8)'}}>
                  <span>{l}</span><span style={{ fontSize:10, opacity:0.5 }}>{s}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:13, color:'var(--white)', marginBottom:16, letterSpacing:1, textTransform:'uppercase' }}>{col.title}</h4>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:9 }}>
                {col.links.map(link => (
                  <li key={link.label}>
                    <button onClick={() => navigate(link.to)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:13, padding:0, textAlign:'left', transition:'color 0.2s', lineHeight:1.4 }}
                      onMouseEnter={e=>{e.target.style.color='var(--gold)'}}
                      onMouseLeave={e=>{e.target.style.color='rgba(255,255,255,0.6)'}}>{link.label}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:28, paddingBottom:28, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <span style={{ fontSize:12, opacity:0.5, fontFamily:'var(--font-head)', fontWeight:600 }}>PAYMENT PARTNERS:</span>
            {[
              { label:'MTN MoMo', color:'#ffc300' },
              { label:'Airtel Money', color:'#e4002b' },
              { label:'Visa', color:'#1a1f71' },
            ].map(p => (
              <span key={p.label} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)', color:p.color, padding:'5px 12px', borderRadius:8, fontFamily:'var(--font-head)', fontWeight:800, fontSize:11 }}>{p.label}</span>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ fontSize:11, opacity:0.4 }}>🔐 SSL Secured</span>
            <span style={{ fontSize:11, opacity:0.4 }}>🇺🇬 Made in Uganda</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', padding:'20px 0', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <span style={{ fontSize:12, opacity:0.45 }}>© {year} Raylane Express Ltd. All rights reserved. Kampala, Uganda.</span>
          <div style={{ display:'flex', gap:20 }}>
            {['Privacy Policy','Terms of Service','Cookie Policy','Sitemap'].map(l => (
              <button key={l} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:12, cursor:'pointer', fontFamily:'var(--font-body)', transition:'color 0.2s' }}
                onMouseEnter={e=>{e.target.style.color='var(--gold)'}}
                onMouseLeave={e=>{e.target.style.color='rgba(255,255,255,0.4)'}}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

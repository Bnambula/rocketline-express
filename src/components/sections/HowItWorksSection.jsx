import React from 'react'
import { useNavigate } from 'react-router-dom'
const P = { fontFamily:"'Sora',sans-serif" }
const I = { fontFamily:"'Inter',sans-serif" }

const STEPS = [
  { n:'01', color:'#dbeafe', icon:<svg width="32" height="32" fill="none" stroke="#0B3D91" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>, title:'Search Your Route', desc:'Enter your city, destination, and date. See all available buses, their operators, seat counts, amenities, and prices in real time.' },
  { n:'02', color:'#dcfce7', icon:<svg width="32" height="32" fill="none" stroke="#15803d" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="1" y="3" width="22" height="16" rx="2"/><path d="M1 10h22M7 19v2M17 19v2"/></svg>, title:'Pick Your Seat', desc:'View our exact Uganda-spec seat map. Choose window, aisle, or any seat on a 14-seater or 67-seater coach. Your seat is locked instantly.' },
  { n:'03', color:'#fef3c7', icon:<svg width="32" height="32" fill="none" stroke="#d97706" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, title:'Pay in 60 Seconds', desc:'MTN MoMo, Airtel Money, or Visa/Mastercard. Enter your PIN and your ticket is confirmed. No hidden fees, no service charges.' },
  { n:'04', color:'#ede9fe', icon:<svg width="32" height="32" fill="none" stroke="#7c3aed" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8h10M7 11h6"/></svg>, title:'Show QR, Board & Go', desc:'Your phone is your ticket. Show the QR code to the driver scanner at the bay. Tusimbudde -- off we go! Track your bus live en route.' },
]

export default function HowItWorksSection() {
  const navigate = useNavigate()
  return (
    <section style={{ background:'var(--off-white)', padding:'80px 0' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div className="section-label" style={{ margin:'0 auto 14px' }}>Simple Process</div>
          <h2 className="section-title">Book in <span>4 Steps</span></h2>
          <p className="section-sub" style={{ margin:'0 auto' }}>From search to seated in under two minutes on any smartphone.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:40 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ textAlign:'center', animation:`fadeIn .4s ease ${i*0.1}s both` }}>
              <div style={{ position:'relative', display:'inline-block', marginBottom:20 }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background:s.color, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto' }}>{s.icon}</div>
                <div style={{ position:'absolute', top:-6, right:-6, width:24, height:24, borderRadius:'50%', background:'var(--blue)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, ...P, fontWeight:800 }}>{i+1}</div>
              </div>
              {i < STEPS.length-1 && (
                <div style={{ position:'absolute', top:36, right:-10, width:20 }}>
                  <svg width="20" height="12" viewBox="0 0 20 12"><path d="M0 6h16M12 2l4 4-4 4" stroke="var(--border)" strokeWidth="2" fill="none"/></svg>
                </div>
              )}
              <h3 style={{ ...P, fontWeight:700, fontSize:16, marginBottom:8 }}>{s.title}</h3>
              <p style={{ fontSize:13, color:'var(--text-secondary)', ...I, lineHeight:1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center' }}>
          <button onClick={() => navigate('/book')} className="btn btn-gold btn-lg">Book Your First Trip</button>
        </div>
      </div>
    </section>
  )
}

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parcels } from '../../data'

export default function ParcelSection() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  return (
    <section style={{ background:'var(--white)', padding:'80px 0' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>
          <div>
            <div className="section-label">Parcel Services</div>
            <h2 className="section-title">Send <span>Anything</span><br/>Anywhere</h2>
            <p className="section-sub" style={{ marginBottom:28 }}>From documents to heavy cargo — your parcels travel safely with every Raylane bus. Track in real-time.</p>

            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:32 }}>
              {[
                ['📍 Real-time tracking', 'Know exactly where your parcel is at all times'],
                ['🛡️ Insured delivery', 'Full coverage on all parcel types'],
                ['📲 SMS notifications', 'Sender & recipient get live updates'],
                ['⚡ Same-day dispatch', 'Parcels leave with the next available bus'],
              ].map(([t,d]) => (
                <div key={t} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <span style={{ fontSize:18, marginTop:2 }}>{t.split(' ')[0]}</span>
                  <div>
                    <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:14 }}>{t.slice(2)}</div>
                    <div style={{ color:'var(--gray-text)', fontSize:13 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => navigate('/parcels')} style={{ padding:'14px 32px', borderRadius:20, background:'var(--blue)', color:'var(--white)', border:'none', fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:'var(--shadow-md)' }}>
              📦 Send a Parcel Now
            </button>
          </div>

          {/* Parcel Type Cards */}
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {parcels.map(p => (
                <div key={p.id} onClick={() => setSelected(selected===p.id ? null : p.id)} style={{
                  background: selected===p.id ? 'var(--blue)' : 'var(--white)',
                  color: selected===p.id ? 'var(--white)' : 'var(--dark)',
                  border: `2px solid ${selected===p.id ? 'var(--blue)' : 'var(--gray-mid)'}`,
                  borderRadius:16, padding:20, cursor:'pointer', transition:'all 0.25s',
                  boxShadow: selected===p.id ? '0 8px 24px rgba(11,61,145,0.25)' : 'var(--shadow-sm)',
                  transform: selected===p.id ? 'translateY(-4px)' : 'none'
                }}
                onMouseEnter={e=>{if(selected!==p.id){e.currentTarget.style.borderColor='var(--blue)';e.currentTarget.style.transform='translateY(-2px)'}}}
                onMouseLeave={e=>{if(selected!==p.id){e.currentTarget.style.borderColor='var(--gray-mid)';e.currentTarget.style.transform='none'}}}>
                  <div style={{ fontSize:32, marginBottom:10 }}>{p.icon}</div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:14, marginBottom:6 }}>{p.name}</div>
                  <div style={{ fontSize:12, opacity:0.7, marginBottom:10 }}>{p.desc}</div>
                  <div style={{ background: selected===p.id ? 'rgba(255,199,44,0.2)' : p.color, borderRadius:10, padding:'8px 12px', display:'inline-block' }}>
                    <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, color: selected===p.id ? 'var(--gold)' : 'var(--blue)' }}>UGX {p.price.toLocaleString()}</span>
                    <div style={{ fontSize:11, opacity:0.8, marginTop:2 }}>Up to {p.maxWeight}</div>
                  </div>
                </div>
              ))}
            </div>

            {selected && (
              <button onClick={() => navigate(`/parcels?type=${selected}`)} style={{ width:'100%', marginTop:16, padding:'14px', borderRadius:16, background:'var(--gold)', color:'var(--blue)', border:'none', fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:'0 4px 16px rgba(255,199,44,0.4)' }}>
                Book {parcels.find(p=>p.id===selected)?.name} →
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

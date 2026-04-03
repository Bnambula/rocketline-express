import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parcels } from '../data'
import { useToast } from '../hooks/useToast'
import Footer from '../components/layout/Footer'

const CITIES = ['Kampala','Mbale','Gulu','Arua','Mbarara','Nairobi','Kigali','Juba','Fort Portal','Jinja','Masaka']

const trackingData = {
  id:'PCL-240512-GUL-00991',
  item:'Small Parcel · 2kg',
  status:'In Transit',
  events:[
    { icon:'🏢', label:'Picked Up', detail:'Global Office, Kampala', time:'8:00 AM', done:true },
    { icon:'🚌', label:'On Board', detail:'UBF 234K – Enroute to Gulu', time:'9:00 AM', done:true },
    { icon:'📍', label:'In Transit', detail:'Karuma Highway', time:'Now', done:true, active:true },
    { icon:'🏠', label:'Arrived', detail:'Gulu Office', time:'Expected 2:00 PM', done:false },
  ]
}

export default function ParcelPage() {
  const [tab, setTab] = useState('send')
  const [type, setType] = useState(null)
  const [from, setFrom] = useState('Kampala')
  const [to, setTo] = useState('Gulu')
  const [trackId, setTrackId] = useState('')
  const [tracking, setTracking] = useState(null)
  const toast = useToast()
  const navigate = useNavigate()

  const handleTrack = () => {
    if (!trackId.trim()) { toast('Enter a parcel ID','warning'); return }
    setTracking(trackingData)
  }

  const handleBook = () => {
    if (!type) { toast('Please select a parcel type','warning'); return }
    toast('📦 Parcel booking confirmed! Track ID: PCL-' + Date.now().toString().slice(-8), 'success')
  }

  return (
    <div style={{ paddingTop:64, background:'var(--gray-light)', minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ background:'var(--blue)', padding:'32px 0 28px' }}>
        <div className="container">
          <button onClick={()=>navigate('/')} style={{ background:'none',border:'none',color:'rgba(255,255,255,0.7)',cursor:'pointer',fontSize:13,fontFamily:'var(--font-head)',marginBottom:12 }}>← Back</button>
          <h1 style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:'clamp(1.6rem,3vw,2.2rem)',color:'var(--white)',marginBottom:8 }}>Parcel <span style={{ color:'var(--gold)' }}>Services</span></h1>
          <p style={{ color:'rgba(255,255,255,0.75)',fontSize:15 }}>Send anything across Uganda — with real-time tracking</p>
          <div style={{ display:'flex',gap:8,marginTop:20 }}>
            {['send','track'].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{ padding:'10px 24px',borderRadius:20,border:'none',cursor:'pointer',background:tab===t?'var(--gold)':'rgba(255,255,255,0.12)',color:tab===t?'var(--blue)':'var(--white)',fontFamily:'var(--font-head)',fontWeight:700,fontSize:13 }}>{t==='send'?'📦 Send Parcel':'🔍 Track Parcel'}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'32px 20px 80px' }}>
        {tab === 'send' && (
          <div style={{ display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:28,alignItems:'start' }}>
            {/* Parcel types */}
            <div>
              <h3 style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:18,marginBottom:16 }}>Select Parcel Type</h3>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:24 }}>
                {parcels.map(p=>(
                  <div key={p.id} onClick={()=>setType(p.id)} style={{ background:type===p.id?'var(--blue)':'var(--white)',color:type===p.id?'var(--white)':'var(--dark)',borderRadius:16,padding:20,cursor:'pointer',border:`2px solid ${type===p.id?'var(--blue)':'var(--gray-mid)'}`,transition:'all 0.2s',boxShadow:type===p.id?'0 8px 24px rgba(11,61,145,0.2)':'var(--shadow-sm)' }}
                    onMouseEnter={e=>{if(type!==p.id){e.currentTarget.style.borderColor='var(--blue)';e.currentTarget.style.transform='translateY(-2px)'}}}
                    onMouseLeave={e=>{if(type!==p.id){e.currentTarget.style.borderColor='var(--gray-mid)';e.currentTarget.style.transform='none'}}}>
                    <div style={{ fontSize:30,marginBottom:10 }}>{p.icon}</div>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:14,marginBottom:6 }}>{p.name}</div>
                    <div style={{ fontSize:12,opacity:0.7,marginBottom:10 }}>{p.desc}</div>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:16,color:type===p.id?'var(--gold)':'var(--blue)' }}>UGX {p.price.toLocaleString()}</div>
                    <div style={{ fontSize:11,opacity:0.6,marginTop:2 }}>Max {p.maxWeight}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div style={{ background:'var(--white)',borderRadius:20,padding:28,boxShadow:'var(--shadow-md)' }}>
              <h3 style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:18,marginBottom:20 }}>Parcel Details</h3>
              {[['From',from,setFrom],['To',to,setTo]].map(([l,v,s])=>(
                <div key={l} style={{ marginBottom:16 }}>
                  <label style={{ fontSize:11,fontWeight:700,color:'var(--gray-text)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:6 }}>{l}</label>
                  <select value={v} onChange={e=>s(e.target.value)} style={{ width:'100%',border:'1.5px solid var(--gray-mid)',borderRadius:10,padding:'11px 14px',fontSize:14,fontFamily:'var(--font-head)',fontWeight:600,background:'var(--white)',cursor:'pointer' }}>
                    {CITIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              ))}
              {[["Sender's Name",""],["Sender's Phone","0771 000 000"],["Recipient's Name",""],["Recipient's Phone",""]].map(([l,ph])=>(
                <div key={l} style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11,fontWeight:700,color:'var(--gray-text)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:6 }}>{l}</label>
                  <input placeholder={ph} style={{ width:'100%',border:'1.5px solid var(--gray-mid)',borderRadius:10,padding:'11px 14px',fontSize:14,fontFamily:'var(--font-head)' }}/>
                </div>
              ))}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:11,fontWeight:700,color:'var(--gray-text)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:6 }}>Notes (optional)</label>
                <textarea placeholder="Fragile, handle with care…" rows={2} style={{ width:'100%',border:'1.5px solid var(--gray-mid)',borderRadius:10,padding:'11px 14px',fontSize:14,fontFamily:'var(--font-body)',resize:'none' }}/>
              </div>
              {type && (
                <div style={{ background:'var(--gray-light)',borderRadius:12,padding:'12px 16px',marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                  <span style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:14 }}>Total Cost</span>
                  <span style={{ fontFamily:'var(--font-head)',fontWeight:900,fontSize:20,color:'var(--blue)' }}>UGX {parcels.find(p=>p.id===type)?.price.toLocaleString()}</span>
                </div>
              )}
              <button onClick={handleBook} style={{ width:'100%',padding:'14px',borderRadius:14,background:'var(--gold)',color:'var(--blue)',border:'none',fontFamily:'var(--font-head)',fontWeight:800,fontSize:15,cursor:'pointer' }}>
                📦 Book & Pay via MoMo
              </button>
            </div>
          </div>
        )}

        {tab === 'track' && (
          <div style={{ maxWidth:540,margin:'0 auto' }}>
            <div style={{ background:'var(--white)',borderRadius:20,padding:28,boxShadow:'var(--shadow-md)',marginBottom:24 }}>
              <h3 style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:18,marginBottom:16 }}>Track Your Parcel</h3>
              <div style={{ display:'flex',gap:10 }}>
                <input value={trackId} onChange={e=>setTrackId(e.target.value)} placeholder="Enter Parcel ID (e.g. PCL-240512-GUL-00991)"
                  style={{ flex:1,border:'1.5px solid var(--gray-mid)',borderRadius:12,padding:'12px 16px',fontSize:14,fontFamily:'var(--font-head)' }}
                  onKeyDown={e=>e.key==='Enter'&&handleTrack()}/>
                <button onClick={handleTrack} style={{ padding:'12px 20px',borderRadius:12,background:'var(--blue)',color:'var(--white)',border:'none',fontFamily:'var(--font-head)',fontWeight:800,fontSize:14,cursor:'pointer' }}>Track</button>
              </div>
              <button onClick={()=>{setTrackId('PCL-240512-GUL-00991');setTracking(trackingData)}} style={{ marginTop:10,background:'none',border:'none',color:'var(--blue)',fontSize:12,cursor:'pointer',fontFamily:'var(--font-head)',fontWeight:600 }}>Try demo: PCL-240512-GUL-00991</button>
            </div>

            {tracking && (
              <div style={{ background:'var(--white)',borderRadius:20,overflow:'hidden',boxShadow:'var(--shadow-lg)' }}>
                <div style={{ background:'var(--blue)',padding:'16px 24px',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                  <div>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:15,color:'var(--white)' }}>{tracking.id}</div>
                    <div style={{ fontSize:13,color:'var(--gold)' }}>{tracking.item}</div>
                  </div>
                  <span style={{ background:'#fef3c7',color:'#92400e',padding:'5px 12px',borderRadius:20,fontFamily:'var(--font-head)',fontWeight:700,fontSize:12 }}>🚌 {tracking.status}</span>
                </div>
                {/* Map placeholder */}
                <div style={{ height:160,background:'linear-gradient(135deg,#e8f4fd,#dbeafe)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden' }}>
                  <div style={{ position:'absolute',inset:0,backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(11,61,145,0.05) 20px,rgba(11,61,145,0.05) 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,rgba(11,61,145,0.05) 20px,rgba(11,61,145,0.05) 21px)' }}/>
                  <div style={{ position:'relative',zIndex:1,textAlign:'center' }}>
                    <div style={{ fontSize:32 }}>🗺️</div>
                    <div style={{ fontFamily:'var(--font-head)',fontWeight:700,fontSize:13,color:'var(--blue)',marginTop:6 }}>Live Map · Kampala → Gulu</div>
                    <div style={{ fontSize:12,color:'var(--gray-text)',marginTop:4 }}>Last updated: 10:24 AM</div>
                  </div>
                  {/* Route dot */}
                  <div style={{ position:'absolute',top:'40%',left:'55%',width:14,height:14,borderRadius:'50%',background:'var(--gold)',border:'3px solid var(--blue)',boxShadow:'0 0 0 6px rgba(255,199,44,0.3)',animation:'pulse 1.5s ease infinite' }}/>
                </div>
                {/* Timeline */}
                <div style={{ padding:24 }}>
                  <h4 style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:15,marginBottom:18 }}>Tracking Timeline</h4>
                  {tracking.events.map((ev,i)=>(
                    <div key={i} style={{ display:'flex',gap:16,marginBottom:16,alignItems:'flex-start' }}>
                      <div style={{ display:'flex',flexDirection:'column',alignItems:'center' }}>
                        <div style={{ width:36,height:36,borderRadius:10,background:ev.done?'var(--blue)':'var(--gray-light)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0,boxShadow:ev.active?'0 0 0 4px rgba(11,61,145,0.2)':'' }}>{ev.icon}</div>
                        {i<tracking.events.length-1&&<div style={{ width:2,height:20,background:ev.done?'var(--blue)':'var(--gray-mid)',marginTop:4 }}/>}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:14,color:ev.active?'var(--blue)':ev.done?'var(--dark)':'var(--gray-text)' }}>{ev.label}</div>
                        <div style={{ fontSize:13,color:'var(--gray-text)',marginTop:2 }}>{ev.detail}</div>
                        <div style={{ fontSize:12,color:ev.active?'var(--gold)':'var(--gray-text)',marginTop:2,fontFamily:'var(--font-head)',fontWeight:600 }}>{ev.time}</div>
                      </div>
                    </div>
                  ))}
                  <button style={{ width:'100%',padding:'13px',borderRadius:14,background:'var(--blue)',color:'var(--white)',border:'none',fontFamily:'var(--font-head)',fontWeight:800,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                    🔗 Share Tracking Link
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

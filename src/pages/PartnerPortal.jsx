import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
import Footer from '../components/layout/Footer'

export default function PartnerPortal() {
  const [step, setStep] = useState('form')
  const [form, setForm] = useState({ name:'', company:'', email:'', phone:'', routes:'', fleet:'' })
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) { toast('Please fill all required fields','warning'); return }
    setStep('success')
    toast('🎉 Application submitted! Our team will contact you within 24 hours.', 'success')
  }

  return (
    <div style={{ paddingTop:64, background:'var(--gray-light)', minHeight:'100vh' }}>
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#0B3D91,#082d6e)', padding:'60px 0', color:'var(--white)' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <div style={{ display:'inline-flex', gap:8, alignItems:'center', background:'rgba(255,199,44,0.15)', padding:'6px 16px', borderRadius:20, marginBottom:16 }}>
            <span>🤝</span>
            <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)' }}>Partner Portal</span>
          </div>
          <h1 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:'clamp(1.8rem,3.5vw,2.8rem)', marginBottom:12 }}>
            Join Uganda's #1 Travel Platform
          </h1>
          <p style={{ opacity:0.8, fontSize:16, maxWidth:540, margin:'0 auto 24px' }}>
            Digitize your transport business. Reach thousands of passengers. Grow revenue with Raylane Express.
          </p>
          <div style={{ display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap' }}>
            {[['500+','Active Operators'],['2M+','Monthly Passengers'],['0%','Setup Cost'],['24/7','Support']].map(([n,l])=>(
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:26, color:'var(--gold)' }}>{n}</div>
                <div style={{ fontSize:13, opacity:0.75 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'48px 20px 80px' }}>
        {step === 'form' ? (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'start' }}>
            {/* Benefits */}
            <div>
              <h2 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:24, marginBottom:24 }}>Why Operators <span style={{ color:'var(--gold)' }}>Choose Us</span></h2>
              {[
                ['📊','Smart Dashboard','Manage all routes, bookings, and passengers from one clean interface.'],
                ['💰','Increase Revenue','Digital booking fills more seats. Operators average 40% growth.'],
                ['📱','Mobile-First','Manage your business from your phone, anywhere in Uganda.'],
                ['✅','Admin Support','Your routes go live after quick Raylane admin approval.'],
                ['💳','Instant Payouts','Receive mobile money payouts daily. No delays.'],
                ['🛡️','Fraud Protection','Our system prevents duplicate bookings and ticket fraud.'],
              ].map(([ic,t,d])=>(
                <div key={t} style={{ display:'flex', gap:14, marginBottom:20, alignItems:'flex-start' }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:'rgba(11,61,145,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{ic}</div>
                  <div>
                    <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, marginBottom:4 }}>{t}</div>
                    <div style={{ color:'var(--gray-text)', fontSize:13, lineHeight:1.6 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Application Form */}
            <div style={{ background:'var(--white)', borderRadius:20, padding:32, boxShadow:'var(--shadow-xl)' }}>
              <h3 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:20, marginBottom:6 }}>Apply to Join</h3>
              <p style={{ color:'var(--gray-text)', fontSize:14, marginBottom:24 }}>Free application · Approval in 24–48 hours</p>
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {[
                  ['Full Name *','name','text','e.g. John Ssemakula'],
                  ['Company / Sacco Name *','company','text','e.g. Global Coaches Ltd'],
                  ['Email Address','email','email','john@company.com'],
                  ['Phone Number *','phone','tel','0771 000 000'],
                  ['Current Routes','routes','text','e.g. Kampala → Mbale, Gulu'],
                  ['Fleet Size','fleet','number','e.g. 5'],
                ].map(([l,k,t,ph])=>(
                  <div key={k}>
                    <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:6 }}>{l}</label>
                    <input type={t} placeholder={ph} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
                      style={{ width:'100%', border:'1.5px solid var(--gray-mid)', borderRadius:10, padding:'11px 14px', fontSize:14, fontFamily:'var(--font-head)', fontWeight:500 }}
                      onFocus={e=>e.target.style.borderColor='var(--blue)'}
                      onBlur={e=>e.target.style.borderColor='var(--gray-mid)'}/>
                  </div>
                ))}
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:'var(--gray-text)', fontFamily:'var(--font-head)', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:6 }}>Message (Optional)</label>
                  <textarea rows={3} placeholder="Tell us about your operation…" style={{ width:'100%', border:'1.5px solid var(--gray-mid)', borderRadius:10, padding:'11px 14px', fontSize:14, fontFamily:'var(--font-body)', resize:'none' }}
                    onFocus={e=>e.target.style.borderColor='var(--blue)'}
                    onBlur={e=>e.target.style.borderColor='var(--gray-mid)'}/>
                </div>
                <button type="submit" style={{ padding:'15px', borderRadius:14, background:'var(--gold)', color:'var(--blue)', border:'none', fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, cursor:'pointer', boxShadow:'0 4px 20px rgba(255,199,44,0.4)' }}>
                  🚀 Submit Application
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth:540, margin:'0 auto', background:'var(--white)', borderRadius:24, padding:48, boxShadow:'var(--shadow-xl)', textAlign:'center' }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, margin:'0 auto 20px' }}>✅</div>
            <h2 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:26, marginBottom:12 }}>Application Submitted!</h2>
            <p style={{ color:'var(--gray-text)', fontSize:15, lineHeight:1.8, marginBottom:28 }}>
              Welcome to Raylane Express! Our team will review your application and contact you within 24–48 hours via phone and email.
            </p>
            <div style={{ background:'var(--gray-light)', borderRadius:14, padding:'16px 20px', marginBottom:24, textAlign:'left' }}>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, marginBottom:10 }}>What happens next?</div>
              {['Our team reviews your application','We verify your vehicles & routes','Account is created & approved','You start receiving bookings!'].map((s,i)=>(
                <div key={i} style={{ display:'flex', gap:10, marginBottom:8, alignItems:'center' }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', background:'var(--blue)', color:'var(--white)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:800, fontSize:11, flexShrink:0 }}>{i+1}</div>
                  <span style={{ fontSize:13, color:'var(--gray-text)' }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <button onClick={()=>navigate('/')} style={{ padding:'13px', borderRadius:14, background:'var(--gray-light)', color:'var(--dark)', border:'none', fontFamily:'var(--font-head)', fontWeight:700, fontSize:14, cursor:'pointer' }}>← Home</button>
              <button onClick={()=>navigate('/operator')} style={{ padding:'13px', borderRadius:14, background:'var(--blue)', color:'var(--white)', border:'none', fontFamily:'var(--font-head)', fontWeight:800, fontSize:14, cursor:'pointer' }}>View Dashboard</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

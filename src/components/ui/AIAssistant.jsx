import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const suggestions = [
  { icon:'🕐', text:'Best time to travel to Mbale?', answer:'Weekday mornings (Tue–Thu) are least busy. Depart 7–9 AM for smooth roads and fewer stops. Avoid Friday evenings.' },
  { icon:'💸', text:'Cheapest route today?', answer:'Kampala → Jinja from UGX 12,000. Book now — prices rise by 15% after 2 PM.' },
  { icon:'📦', text:'How do I send a parcel?', answer:'Go to Parcels, choose size, enter recipient details, pay via mobile money, and drop off at our Kampala hub.' },
  { icon:'💺', text:'How do I pick my seat?', answer:'After selecting an operator, tap "Select Seat". Green = available, Red = booked, Yellow = your choice. Confirm & pay.' },
]

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from:'bot', text:'👋 Hi! I\'m Raylane AI. Ask me about routes, prices, parcels, or anything travel-related!' }
  ])
  const [input, setInput] = useState('')
  const navigate = useNavigate()

  const sendMsg = (text) => {
    const q = text || input.trim()
    if (!q) return
    setInput('')
    setMessages(m => [...m, { from:'user', text:q }])

    // Simple smart replies
    setTimeout(() => {
      let reply = 'I can help with routes, seat booking, parcels, and payments. What would you like to know?'
      const lower = q.toLowerCase()
      if (lower.includes('cheap') || lower.includes('price')) reply = '💸 Currently, Kampala → Jinja is the cheapest at UGX 12,000. Kampala → Mbale from UGX 25,000. Prices vary by operator — search to compare!'
      else if (lower.includes('parcel') || lower.includes('send')) reply = '📦 You can send parcels from UGX 5,000 (envelope) to UGX 30,000 (heavy cargo). Each parcel gets real-time GPS tracking!'
      else if (lower.includes('book') || lower.includes('seat')) reply = '🎫 To book: Search your route → Select an operator → Choose your seat → Pay via MTN MoMo or Airtel. Done in 2 minutes!'
      else if (lower.includes('time') || lower.includes('when')) reply = '🕐 Best travel times are 6–9 AM (mornings) and 2–4 PM (afternoons). Avoid Friday 4–8 PM — peak traffic.'
      else if (lower.includes('nairobi') || lower.includes('kigali') || lower.includes('juba')) reply = '🌍 East Africa routes available! Kampala → Nairobi from UGX 60,000, → Kigali from UGX 55,000, → Juba from UGX 60,000.'
      else if (lower.includes('pay') || lower.includes('momo') || lower.includes('money')) reply = '📱 We accept MTN Mobile Money and Airtel Money. After selecting your seat, a prompt is sent to your phone. Confirm & done!'
      setMessages(m => [...m, { from:'bot', text:reply }])
    }, 700)
  }

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(!open)} style={{
        position:'fixed', bottom: open ? 'calc(420px + 24px)' : 84, right:24, zIndex:850,
        width:56, height:56, borderRadius:20, background:'var(--blue)', color:'var(--white)',
        border:'3px solid var(--gold)', boxShadow:'0 8px 24px rgba(11,61,145,0.4)',
        fontSize:22, transition:'all 0.3s', display:'flex', alignItems:'center', justifyContent:'center'
      }}>
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position:'fixed', bottom:84, right:24, zIndex:849, width:340,
          background:'var(--white)', borderRadius:20, boxShadow:'0 16px 48px rgba(0,0,0,0.2)',
          border:'1px solid var(--gray-mid)', overflow:'hidden', display:'flex', flexDirection:'column',
          animation:'fadeIn 0.3s ease'
        }}>
          {/* Header */}
          <div style={{ background:'var(--blue)', padding:'16px 20px', color:'var(--white)', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🤖</div>
            <div>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:14 }}>Raylane AI</div>
              <div style={{ fontSize:11, opacity:0.75 }}>● Online · Instant answers</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:10, maxHeight:260 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display:'flex', justifyContent: msg.from==='user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  background: msg.from==='user' ? 'var(--blue)' : 'var(--gray-light)',
                  color: msg.from==='user' ? 'var(--white)' : 'var(--dark)',
                  padding:'10px 14px', borderRadius: msg.from==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  maxWidth:'82%', fontSize:13, lineHeight:1.6
                }}>{msg.text}</div>
              </div>
            ))}
          </div>

          {/* Quick suggestions */}
          <div style={{ padding:'8px 12px', display:'flex', gap:6, overflowX:'auto', borderTop:'1px solid var(--gray-mid)' }}>
            {suggestions.map(s => (
              <button key={s.text} onClick={() => sendMsg(s.text)} style={{
                background:'var(--gray-light)', border:'1px solid var(--gray-mid)', borderRadius:20, padding:'5px 12px',
                fontSize:11, fontFamily:'var(--font-head)', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0
              }}>{s.icon} {s.text.split(' ').slice(0,3).join(' ')}…</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding:'10px 12px', display:'flex', gap:8, borderTop:'1px solid var(--gray-mid)' }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()}
              placeholder="Ask about routes, prices…" style={{ flex:1, border:'1.5px solid var(--gray-mid)', borderRadius:20, padding:'9px 14px', fontSize:13 }}/>
            <button onClick={()=>sendMsg()} style={{ width:38, height:38, borderRadius:12, background:'var(--gold)', color:'var(--blue)', border:'none', cursor:'pointer', fontWeight:800, fontSize:16 }}>→</button>
          </div>
        </div>
      )}
    </>
  )
}

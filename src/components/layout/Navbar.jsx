import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Where We Go', to: '/#where-we-go' },
    { label: 'Book', to: '/book' },
    { label: 'Parcels', to: '/parcels' },
    { label: 'Operators', to: '/operator' },
    { label: 'Help', to: '/#help' },
  ]

  const handleNavClick = (to) => {
    setMenuOpen(false)
    if (to.includes('#')) {
      const id = to.split('#')[1]
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300)
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(to)
    }
  }

  const isTransparent = isHome && !scrolled

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 800,
      background: isTransparent ? 'transparent' : 'var(--blue)',
      backdropFilter: isTransparent ? 'none' : 'blur(12px)',
      boxShadow: isTransparent ? 'none' : '0 2px 24px rgba(0,0,0,0.18)',
      transition: 'all 0.3s ease',
      borderBottom: isTransparent ? 'none' : '1px solid rgba(255,255,255,0.08)'
    }}>
      <div className="container" style={{ display:'flex', alignItems:'center', height:64, gap:8 }}>
        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
          <div style={{
            width:40, height:40, borderRadius:10,
            background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 2px 10px rgba(255,199,44,0.4)'
          }}>
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
              <path d="M2 14 L8 4 L14 10 L18 4 L20 14" stroke="#0B3D91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="4" cy="15" r="2" fill="#0B3D91"/>
              <circle cx="18" cy="15" r="2" fill="#0B3D91"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:16, color:'var(--white)', lineHeight:1 }}>RAYLANE</div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:500, fontSize:10, color:'var(--gold)', letterSpacing:2, lineHeight:1 }}>EXPRESS</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:4, marginLeft:32, flex:1 }}>
          {navLinks.map(l => (
            <button key={l.label} onClick={() => handleNavClick(l.to)} style={{
              background:'none', border:'none', color:'rgba(255,255,255,0.88)', cursor:'pointer',
              fontFamily:'var(--font-head)', fontWeight:600, fontSize:13, padding:'8px 12px',
              borderRadius:8, transition:'all 0.2s', whiteSpace:'nowrap'
            }}
            onMouseEnter={e => e.target.style.color='var(--gold)'}
            onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.88)'}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:10, marginLeft:'auto', flexShrink:0 }}>
          <button onClick={() => navigate('/admin')} style={{
            background:'none', border:'1px solid rgba(255,255,255,0.3)', color:'var(--white)',
            padding:'8px 16px', borderRadius:20, fontFamily:'var(--font-head)', fontWeight:600, fontSize:13, cursor:'pointer',
            transition:'all 0.2s'
          }}
          onMouseEnter={e=>{e.target.style.borderColor='var(--gold)';e.target.style.color='var(--gold)'}}
          onMouseLeave={e=>{e.target.style.borderColor='rgba(255,255,255,0.3)';e.target.style.color='var(--white)'}}
          >Login</button>
          <button onClick={() => navigate('/partner')} style={{
            background:'none', border:'1px solid rgba(255,255,255,0.3)', color:'var(--white)',
            padding:'8px 16px', borderRadius:20, fontFamily:'var(--font-head)', fontWeight:600, fontSize:13, cursor:'pointer',
            transition:'all 0.2s'
          }}
          onMouseEnter={e=>{e.target.style.borderColor='var(--gold)';e.target.style.color='var(--gold)'}}
          onMouseLeave={e=>{e.target.style.borderColor='rgba(255,255,255,0.3)';e.target.style.color='var(--white)'}}
          >Partner Portal</button>
          <button onClick={() => navigate('/operator')} style={{
            background:'var(--gold)', color:'var(--blue)', border:'none',
            padding:'9px 20px', borderRadius:20, fontFamily:'var(--font-head)', fontWeight:800, fontSize:13, cursor:'pointer',
            boxShadow:'0 2px 12px rgba(255,199,44,0.4)', transition:'all 0.2s'
          }}
          onMouseEnter={e=>{e.target.style.transform='translateY(-1px)';e.target.style.boxShadow='0 4px 20px rgba(255,199,44,0.5)'}}
          onMouseLeave={e=>{e.target.style.transform='none';e.target.style.boxShadow='0 2px 12px rgba(255,199,44,0.4)'}}
          >Join Now</button>
        </div>

        {/* Mobile hamburger */}
        <button className="hide-desktop" onClick={() => setMenuOpen(!menuOpen)} style={{
          marginLeft:'auto', background:'none', border:'none', color:'var(--white)', cursor:'pointer', padding:8
        }}>
          <div style={{ width:22, height:2, background:'currentColor', marginBottom:5, borderRadius:2 }}/>
          <div style={{ width:22, height:2, background:'currentColor', marginBottom:5, borderRadius:2 }}/>
          <div style={{ width:22, height:2, background:'currentColor', borderRadius:2 }}/>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="hide-desktop" style={{
          background:'var(--blue)', borderTop:'1px solid rgba(255,255,255,0.1)',
          padding:'16px 20px 20px', display:'flex', flexDirection:'column', gap:4
        }}>
          {navLinks.map(l => (
            <button key={l.label} onClick={() => handleNavClick(l.to)} style={{
              background:'none', border:'none', color:'rgba(255,255,255,0.9)', cursor:'pointer',
              fontFamily:'var(--font-head)', fontWeight:600, fontSize:15, padding:'10px 0',
              textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.07)'
            }}>{l.label}</button>
          ))}
          <div style={{ display:'flex', gap:10, marginTop:12 }}>
            <button onClick={() => { navigate('/admin'); setMenuOpen(false) }} style={{
              flex:1, background:'transparent', border:'1px solid rgba(255,255,255,0.3)', color:'var(--white)',
              padding:'10px', borderRadius:20, fontFamily:'var(--font-head)', fontWeight:600, fontSize:13, cursor:'pointer'
            }}>Login</button>
            <button onClick={() => { navigate('/operator'); setMenuOpen(false) }} style={{
              flex:1, background:'var(--gold)', color:'var(--blue)', border:'none',
              padding:'10px', borderRadius:20, fontFamily:'var(--font-head)', fontWeight:800, fontSize:13, cursor:'pointer'
            }}>Join Now</button>
          </div>
        </div>
      )}
    </nav>
  )
}

import React from 'react';
import ReactDOM from 'react-dom/client';

// ============================================================
// RAYLANE EXPRESS — Fresh Build v1.0
// Company: Raylane Express | Uganda Intercity Travel
// Stack: React (CDN) + Supabase REST API
// ============================================================

const CONFIG = {
  SUPABASE_URL: "https://xyvijskzgpgauhrxcauw.supabase.co",
  SUPABASE_KEY: "sb_publishable_9Q_u5cpCjjAxOCXrRP_org_Asq67JF8",
  WHATSAPP:     "256701196725",
  TOTAL_SEATS:  14,
};

const ROUTES = [
  { id:"mbale-kampala",   from:"Mbale",   to:"Kampala", price:30000, duration:"4 hrs",  stops:["Iganga","Jinja"] },
  { id:"kampala-mbale",   from:"Kampala", to:"Mbale",   price:30000, duration:"4 hrs",  stops:["Jinja","Iganga"] },
  { id:"kampala-mbarara", from:"Kampala", to:"Mbarara", price:55000, duration:"3 hrs",  stops:["Lukaya","Masaka"] },
  { id:"mbarara-kampala", from:"Mbarara", to:"Kampala", price:55000, duration:"3 hrs",  stops:["Masaka","Lukaya"] },
  { id:"kampala-gulu",    from:"Kampala", to:"Gulu",    price:70000, duration:"5 hrs",  stops:["Karuma"] },
  { id:"gulu-kampala",    from:"Gulu",    to:"Kampala", price:70000, duration:"5 hrs",  stops:["Karuma"] },
  { id:"kampala-soroti",  from:"Kampala", to:"Soroti",  price:40000, duration:"4.5 hrs",stops:["Mbale"] },
  { id:"soroti-kampala",  from:"Soroti",  to:"Kampala", price:40000, duration:"4.5 hrs",stops:["Mbale"] },
];

const PHOTOS = {
  hero:   "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80",
  seats:  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  road:   "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  city:   "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80",
};

// ── Supabase helpers ────────────────────────────────────────
const SB = {
  headers: () => ({
    "Content-Type":  "application/json",
    "apikey":        CONFIG.SUPABASE_KEY,
    "Authorization": "Bearer " + CONFIG.SUPABASE_KEY,
  }),
  url: (table, qs="") => `${CONFIG.SUPABASE_URL}/rest/v1/${table}${qs}`,
  rpc: (fn, qs="") => `${CONFIG.SUPABASE_URL}/rest/v1/rpc/${fn}${qs}`,

  async get(table, qs="") {
    const r = await fetch(SB.url(table, qs), { headers: SB.headers() });
    return r.json();
  },
  async post(table, body) {
    const r = await fetch(SB.url(table), {
      method:"POST", headers:{...SB.headers(),"Prefer":"return=representation"},
      body: JSON.stringify(body),
    });
    return r.json();
  },
  async patch(table, qs, body) {
    const r = await fetch(SB.url(table, qs), {
      method:"PATCH", headers:{...SB.headers(),"Prefer":"return=representation"},
      body: JSON.stringify(body),
    });
    return r.json();
  },
  async delete(table, qs) {
    await fetch(SB.url(table, qs), { method:"DELETE", headers: SB.headers() });
  },
  async call(fn, body={}) {
    const r = await fetch(SB.rpc(fn), {
      method:"POST", headers: SB.headers(),
      body: JSON.stringify(body),
    });
    return r.json();
  },
};

// ── Utilities ───────────────────────────────────────────────
const fmt = n => "UGX " + Number(n).toLocaleString();
const disc = p => Math.round(p * 0.8);
const uid = () => Math.random().toString(36).slice(2,8).toUpperCase();

// ── Icons (inline SVG) ──────────────────────────────────────
const Icon = {
  bus:  ()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="13" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/><path d="M2 17l2 2M20 17l2 2M2 7h20"/></svg>,
  pkg:  ()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  lock: ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  wa:   ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  star: ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  arr:  ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  chk:  ()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
};

// ============================================================
// MAIN APP
// ============================================================
function App() {
  const [page, setPage]           = React.useState("home");
  const [bookings, setBookings]   = React.useState({});
  const [route, setRoute]         = React.useState(null);
  const [seat, setSeat]           = React.useState(null);
  const [form, setForm]           = React.useState({ name:"", phone:"", boarding:"" });
  const [payment, setPayment]     = React.useState("mtn");
  const [paying, setPaying]       = React.useState(false);
  const [confirm, setConfirm]     = React.useState(null);
  const [adminAuth, setAdminAuth] = React.useState(false);
  const [agentAuth, setAgentAuth] = React.useState(null);
  const [toast, setToast]         = React.useState(null);
  const [loading, setLoading]     = React.useState(true);

  // Load bookings from Supabase on mount
  React.useEffect(() => {
    SB.get("bookings", "?select=route_id,seat_number,status&status=neq.cancelled")
      .then(rows => {
        if (!Array.isArray(rows)) return;
        const map = {};
        rows.forEach(r => {
          if (!map[r.route_id]) map[r.route_id] = {};
          map[r.route_id][r.seat_number] = true;
        });
        setBookings(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const go = (p) => { setPage(p); window.scrollTo(0,0); };
  const reset = () => { setRoute(null); setSeat(null); setForm({name:"",phone:"",boarding:""}); go("home"); };

  const takenSeats = route ? (bookings[route.id] || {}) : {};
  const availCount = CONFIG.TOTAL_SEATS - Object.keys(takenSeats).length;
  const finalPrice = route ? disc(route.price) : 0;

  // ── Book a seat ──────────────────────────────────────────
  async function handlePayment() {
    if (!form.name.trim() || !form.phone.trim()) { showToast("Please fill in your name and phone number", "error"); return; }
    if (!form.phone.match(/^(07|256)\d{8,9}$/)) { showToast("Enter a valid Ugandan phone number", "error"); return; }
    setPaying(true);
    try {
      const code = "RL" + uid();
      await SB.post("bookings", {
        booking_code:    code,
        passenger_name:  form.name.trim(),
        passenger_phone: form.phone.trim(),
        route_id:        route.id,
        route_from:      route.from,
        route_to:        route.to,
        seat_number:     seat,
        boarding_point:  form.boarding || route.from,
        amount_paid:     finalPrice,
        base_price:      route.price,
        discount_amount: route.price - finalPrice,
        payment_method:  payment,
        payment_status:  "pending",
        status:          "confirmed",
        booked_by_agent: agentAuth ? agentAuth.id : null,
        agent_name:      agentAuth ? agentAuth.name : null,
      });
      setBookings(prev => ({
        ...prev,
        [route.id]: { ...(prev[route.id]||{}), [seat]: true }
      }));
      const msg = encodeURIComponent(
        `🚐 *Raylane Express — Booking Confirmed!*\n\n` +
        `📋 Code: *${code}*\n` +
        `👤 Name: ${form.name}\n` +
        `🛣️ Route: ${route.from} → ${route.to}\n` +
        `💺 Seat: ${seat}\n` +
        `💰 Paid: ${fmt(finalPrice)} (${payment.toUpperCase()} MoMo)\n\n` +
        `Thank you for choosing Raylane Express! 🚀`
      );
      setConfirm({ code, name: form.name, route, seat, price: finalPrice, payment });
      go("confirm");
      window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${msg}`, "_blank");
    } catch(e) {
      showToast("Booking failed — please try again", "error");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div style={{minHeight:"100vh", fontFamily:"'Plus Jakarta Sans','Segoe UI',sans-serif", background:"#f8fafc", color:"#0f172a"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        :root{
          --navy:#0f2a5e; --blue:#1d4ed8; --sky:#3b82f6; --gold:#f59e0b;
          --green:#16a34a; --red:#dc2626; --mtn:#fbbf24; --airtel:#ef4444;
          --bg:#f8fafc; --card:#ffffff; --border:#e2e8f0; --muted:#64748b;
          --text:#0f172a;
        }
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;cursor:pointer;border-radius:8px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:15px;transition:all .18s;padding:13px 26px;text-decoration:none}
        .btn-primary{background:var(--blue);color:#fff}
        .btn-primary:hover{background:#1e40af;transform:translateY(-1px);box-shadow:0 8px 24px rgba(29,78,216,.3)}
        .btn-navy{background:var(--navy);color:#fff}
        .btn-navy:hover{background:#0a1f4a}
        .btn-gold{background:var(--gold);color:#fff}
        .btn-gold:hover{background:#d97706}
        .btn-outline{background:#fff;color:var(--navy);border:2px solid var(--border)}
        .btn-outline:hover{border-color:var(--blue);color:var(--blue)}
        .btn-ghost{background:transparent;color:var(--muted);padding:10px 16px;font-size:14px}
        .btn-ghost:hover{color:var(--text)}
        .btn:disabled{opacity:.45;cursor:not-allowed;transform:none!important;box-shadow:none!important}
        .card{background:#fff;border:1px solid var(--border);border-radius:12px;padding:24px;box-shadow:0 1px 8px rgba(15,42,94,.06)}
        .input{background:#fff;border:2px solid var(--border);color:var(--text);padding:12px 16px;border-radius:8px;width:100%;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;outline:none;transition:border .15s}
        .input:focus{border-color:var(--blue)}
        .input::placeholder{color:var(--muted)}
        .badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.4px}
        .badge-blue{background:#dbeafe;color:var(--blue)}
        .badge-gold{background:#fef3c7;color:#92400e}
        .badge-green{background:#dcfce7;color:var(--green)}
        .badge-red{background:#fee2e2;color:var(--red)}
        .seat{width:44px;height:44px;border-radius:8px;border:2px solid;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;transition:all .15s;user-select:none}
        .seat-free{background:#f0fdf4;border-color:#86efac;color:#16a34a}
        .seat-free:hover{background:#16a34a;color:#fff;border-color:#16a34a;transform:scale(1.08)}
        .seat-taken{background:#fef2f2;border-color:#fca5a5;color:#dc2626;cursor:not-allowed}
        .seat-sel{background:var(--blue);border-color:#1e40af;color:#fff;box-shadow:0 0 0 3px rgba(29,78,216,.25)}
        .seat-driver{background:#f1f5f9;border-color:#e2e8f0;color:#94a3b8;cursor:default;font-size:9px;font-weight:600}
        .pay-card{background:#fff;border:2px solid var(--border);border-radius:10px;padding:16px 18px;cursor:pointer;transition:all .18s;display:flex;align-items:center;gap:14px}
        .pay-card:hover{border-color:#94a3b8}
        .pay-mtn.active{border-color:var(--mtn);background:#fffbeb}
        .pay-air.active{border-color:var(--airtel);background:#fef2f2}
        .divider{height:1px;background:var(--border);margin:24px 0}
        .fade{animation:fadeUp .3s ease}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        .spin{animation:spin .8s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .pulse{animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
        select.input{cursor:pointer}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px}
      `}</style>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{position:"fixed",top:20,right:20,zIndex:9999,padding:"12px 20px",borderRadius:10,background:toast.type==="error"?"#dc2626":"#16a34a",color:"#fff",fontWeight:600,fontSize:14,boxShadow:"0 8px 32px rgba(0,0,0,.2)",maxWidth:320}}>
          {toast.type==="error" ? "⚠️ " : "✅ "}{toast.msg}
        </div>
      )}

      {/* ── HEADER ── */}
      <header style={{background:["home","routes"].includes(page)?"transparent":"#fff", borderBottom:page==="home"?"none":"1px solid var(--border)", position:"sticky",top:0,zIndex:100, backdropFilter:"blur(12px)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px",height:64,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div onClick={reset} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,background:"linear-gradient(135deg,var(--blue),var(--navy))",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontFamily:"'Fraunces',serif",fontWeight:900,fontSize:18}}>R</div>
            <div>
              <div style={{fontFamily:"'Fraunces',serif",fontWeight:900,fontSize:18,color:page==="home"?"#fff":"var(--navy)",lineHeight:1}}>Raylane Express</div>
              <div style={{fontSize:9,color:page==="home"?"rgba(255,255,255,.6)":"var(--muted)",letterSpacing:"3px",textTransform:"uppercase"}}>Uganda Intercity Travel</div>
            </div>
          </div>
          <nav style={{display:"flex",alignItems:"center",gap:4}}>
            {[
              {label:"Book a Seat", p:"routes"},
              {label:"Courier",     p:"courier"},
              {label:"Feedback",    p:"feedback"},
            ].map(item => (
              <button key={item.p} onClick={()=>go(item.p)} style={{background:"transparent",border:"none",cursor:"pointer",padding:"8px 14px",borderRadius:6,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:14,color:page==="home"?"rgba(255,255,255,.85)":"var(--muted)",transition:"all .15s"}}
                onMouseEnter={e=>e.target.style.color=page==="home"?"#fff":"var(--blue)"}
                onMouseLeave={e=>e.target.style.color=page==="home"?"rgba(255,255,255,.85)":"var(--muted)"}
              >{item.label}</button>
            ))}
            {agentAuth && (
              <span style={{padding:"6px 12px",background:"#dbeafe",borderRadius:6,fontSize:13,fontWeight:600,color:"var(--blue)"}}>👤 {agentAuth.name}</span>
            )}
            <button onClick={()=>go("admin")} style={{display:"flex",alignItems:"center",gap:6,background:page==="home"?"rgba(255,255,255,.15)":"var(--navy)",border:"none",borderRadius:7,color:"#fff",fontSize:13,fontWeight:700,padding:"8px 14px",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              <Icon.lock /> {adminAuth ? "Dashboard" : "Staff"}
            </button>
          </nav>
        </div>
      </header>

      {/* ============================================================ */}
      {/* HOME PAGE */}
      {/* ============================================================ */}
      {page === "home" && (
        <div className="fade">
          {/* Hero */}
          <div style={{position:"relative",minHeight:"90vh",display:"flex",alignItems:"center",background:"linear-gradient(135deg,#0f2a5e 0%,#1d4ed8 60%,#0ea5e9 100%)"}}>
            <img src={PHOTOS.hero} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.18}} />
            <div style={{position:"relative",maxWidth:1100,margin:"0 auto",padding:"80px 20px 60px",width:"100%"}}>
              <div style={{maxWidth:640}}>
                <div className="badge badge-gold" style={{marginBottom:20,fontSize:12,padding:"6px 14px"}}>✨ 20% Early Booking Discount — Limited Seats</div>
                <h1 style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(42px,6vw,72px)",fontWeight:900,color:"#fff",lineHeight:1.05,marginBottom:20}}>
                  Travel Between<br/><span style={{color:"#fbbf24"}}>Uganda's Cities</span><br/>With Confidence
                </h1>
                <p style={{fontSize:18,color:"rgba(255,255,255,.8)",marginBottom:36,lineHeight:1.7,maxWidth:480}}>
                  Real-time seat booking on 14-seater Hiace vans. Pay instantly with MTN MoMo or Airtel Money. WhatsApp confirmation in seconds.
                </p>
                <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                  <button className="btn btn-gold" style={{fontSize:16,padding:"15px 32px"}} onClick={()=>go("routes")}>
                    🎫 Book Your Seat Now
                  </button>
                  <a href={`tel:+${CONFIG.WHATSAPP}`} className="btn btn-outline" style={{fontSize:15,padding:"15px 24px",borderColor:"rgba(255,255,255,.4)",color:"#fff",background:"rgba(255,255,255,.1)"}}>
                    📞 Call Us
                  </a>
                </div>
                <div style={{display:"flex",gap:20,marginTop:32,flexWrap:"wrap"}}>
                  {["✅ No double booking","💳 MTN & Airtel Money","💬 WhatsApp receipt","🍶 Free water"].map(t=>(
                    <span key={t} style={{color:"rgba(255,255,255,.75)",fontSize:13,fontWeight:500}}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Search widget */}
            <div style={{position:"absolute",bottom:-40,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 40px)",maxWidth:900,background:"#fff",borderRadius:14,boxShadow:"0 20px 60px rgba(15,42,94,.2)",padding:"24px 28px",display:"flex",gap:12,alignItems:"flex-end",flexWrap:"wrap",zIndex:10}}>
              <div style={{flex:"1 1 180px"}}>
                <label style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>From</label>
                <select className="input" style={{height:46}} onChange={e=>{const r=ROUTES.find(x=>x.from===e.target.value);if(r)setRoute(r);}}>
                  <option value="">Select city</option>
                  {[...new Set(ROUTES.map(r=>r.from))].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{flex:"1 1 180px"}}>
                <label style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>To</label>
                <select className="input" style={{height:46}} onChange={e=>{const r=ROUTES.find(x=>x.to===e.target.value&&(route?x.from===route.from:true));if(r)setRoute(r);}}>
                  <option value="">Select city</option>
                  {[...new Set(ROUTES.map(r=>r.to))].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{flex:"1 1 140px"}}>
                <label style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Date</label>
                <div className="input" style={{height:46,display:"flex",alignItems:"center",color:"var(--muted)",fontSize:14}}>📅 Today</div>
              </div>
              <button className="btn btn-navy" style={{height:46,padding:"0 28px",flexShrink:0}} onClick={()=>{if(route){go("seats")}else{go("routes")}}}>
                Search →
              </button>
            </div>
          </div>

          {/* Spacer for search widget */}
          <div style={{height:80}} />

          {/* Routes grid */}
          <div style={{maxWidth:1100,margin:"0 auto",padding:"48px 20px"}}>
            <div style={{textAlign:"center",marginBottom:40}}>
              <h2 style={{fontFamily:"'Fraunces',serif",fontSize:36,fontWeight:900,color:"var(--navy)",marginBottom:10}}>Our Routes</h2>
              <p style={{color:"var(--muted)",fontSize:16}}>Choose from 8 routes connecting Uganda's major cities</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}}>
              {[
                {pair:"Mbale ↔ Kampala",   p:30000, icon:"🏔️", desc:"Eastern Uganda · 4 hrs"},
                {pair:"Kampala ↔ Mbarara", p:55000, icon:"🌾", desc:"Western Uganda · 3 hrs"},
                {pair:"Kampala ↔ Gulu",    p:70000, icon:"🌿", desc:"Northern Uganda · 5 hrs"},
                {pair:"Kampala ↔ Soroti",  p:40000, icon:"🌄", desc:"Eastern Uganda · 4.5 hrs"},
              ].map(r=>{
                const avail = CONFIG.TOTAL_SEATS - Object.keys(bookings[r.pair.split(" ↔ ")[0].toLowerCase()+"-"+r.pair.split(" ↔ ")[1].toLowerCase()]||{}).length;
                return (
                  <div key={r.pair} className="card" style={{cursor:"pointer",transition:"all .2s"}}
                    onClick={()=>go("routes")}
                    onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                    <div style={{fontSize:32,marginBottom:12}}>{r.icon}</div>
                    <div style={{fontWeight:800,fontSize:17,color:"var(--navy)",marginBottom:4}}>{r.pair}</div>
                    <div style={{fontSize:13,color:"var(--muted)",marginBottom:16}}>{r.desc}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontWeight:800,fontSize:22,color:"var(--blue)"}}>{fmt(disc(r.p))}</div>
                        <div style={{fontSize:12,color:"var(--muted)",textDecoration:"line-through"}}>{fmt(r.p)}</div>
                      </div>
                      <span className="badge badge-gold">20% OFF</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Why Raylane */}
          <div style={{background:"var(--navy)",padding:"64px 20px"}}>
            <div style={{maxWidth:1100,margin:"0 auto"}}>
              <h2 style={{fontFamily:"'Fraunces',serif",fontSize:34,fontWeight:900,color:"#fff",textAlign:"center",marginBottom:48}}>Why Choose Raylane Express?</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:24}}>
                {[
                  {icon:"💺",title:"Reserved Seats",desc:"Your seat is yours. No standing, no pushing. Book online and board with confidence."},
                  {icon:"💳",title:"Mobile Money",desc:"Pay with MTN MoMo or Airtel Money. Instant confirmation, no cash needed."},
                  {icon:"📱",title:"WhatsApp Receipt",desc:"Get your booking code and travel details delivered to your WhatsApp instantly."},
                  {icon:"🍶",title:"Free Water",desc:"Every passenger gets a complimentary water bottle on every journey."},
                ].map(f=>(
                  <div key={f.title} style={{textAlign:"center",padding:"24px 16px"}}>
                    <div style={{fontSize:40,marginBottom:14}}>{f.icon}</div>
                    <div style={{fontWeight:800,fontSize:17,color:"#fff",marginBottom:10}}>{f.title}</div>
                    <div style={{color:"rgba(255,255,255,.65)",fontSize:14,lineHeight:1.6}}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Courier promo */}
          <div style={{maxWidth:1100,margin:"0 auto",padding:"64px 20px"}}>
            <div style={{background:"linear-gradient(135deg,#fef3c7,#fff7ed)",border:"2px solid #fde68a",borderRadius:16,padding:"40px 36px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:24}}>
              <div>
                <div style={{fontSize:40,marginBottom:12}}>📦</div>
                <h3 style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:900,color:"var(--navy)",marginBottom:8}}>Courier Service</h3>
                <p style={{color:"var(--muted)",fontSize:15,maxWidth:420,lineHeight:1.6}}>Send parcels between cities on our vans. Same-day delivery, tracked and confirmed via WhatsApp. From UGX 5,000.</p>
              </div>
              <button className="btn btn-navy" style={{fontSize:15,padding:"14px 30px"}} onClick={()=>go("courier")}>Send a Parcel →</button>
            </div>
          </div>

          {/* Footer */}
          <footer style={{background:"#0f172a",color:"rgba(255,255,255,.7)",padding:"40px 20px",textAlign:"center"}}>
            <div style={{maxWidth:600,margin:"0 auto"}}>
              <div style={{fontFamily:"'Fraunces',serif",fontSize:24,fontWeight:900,color:"#fff",marginBottom:8}}>Raylane Express</div>
              <div style={{fontSize:13,marginBottom:20}}>Uganda Intercity Travel · Comfortable · Reliable · Affordable</div>
              <div style={{display:"flex",justifyContent:"center",gap:20,flexWrap:"wrap",marginBottom:20,fontSize:14}}>
                <a href={`tel:+${CONFIG.WHATSAPP}`} style={{color:"rgba(255,255,255,.7)",textDecoration:"none"}}>📞 +256 701 196 725</a>
                <a href={`https://wa.me/${CONFIG.WHATSAPP}`} target="_blank" rel="noreferrer" style={{color:"#25D366",textDecoration:"none",display:"flex",alignItems:"center",gap:5}}><Icon.wa /> WhatsApp</a>
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.35)"}}>MTN MoMo & Airtel Money · Free water on every trip · © 2026 Raylane Express</div>
            </div>
          </footer>
        </div>
      )}

      {/* ============================================================ */}
      {/* ROUTES PAGE */}
      {/* ============================================================ */}
      {page === "routes" && (
        <div style={{maxWidth:800,margin:"0 auto",padding:"40px 20px"}} className="fade">
          <button className="btn btn-ghost" onClick={reset}>← Back</button>
          <h2 style={{fontFamily:"'Fraunces',serif",fontSize:32,fontWeight:900,color:"var(--navy)",margin:"20px 0 6px"}}>Choose Your Route</h2>
          <p style={{color:"var(--muted)",marginBottom:28}}>All fares include 20% discount — already applied</p>
          <div style={{display:"grid",gap:12}}>
            {ROUTES.map(r=>{
              const taken = Object.keys(bookings[r.id]||{}).length;
              const avail = CONFIG.TOTAL_SEATS - taken;
              const p = disc(r.price);
              const sel = route?.id === r.id;
              return (
                <div key={r.id} onClick={()=>setRoute(r)} style={{background:"#fff",border:`2px solid ${sel?"var(--blue)":"var(--border)"}`,borderRadius:12,padding:"18px 22px",cursor:"pointer",transition:"all .18s",boxShadow:sel?"0 0 0 3px rgba(29,78,216,.1)":"none"}}
                  onMouseEnter={e=>{if(!sel)e.currentTarget.style.borderColor="#94a3b8"}}
                  onMouseLeave={e=>{if(!sel)e.currentTarget.style.borderColor="var(--border)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:18,color:"var(--navy)",marginBottom:6}}>{r.from} <span style={{color:"var(--blue)"}}>→</span> {r.to}</div>
                      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                        <span style={{fontSize:13,color:"var(--muted)"}}>⏱ {r.duration}</span>
                        <span style={{fontSize:13,fontWeight:600,color:avail>4?"var(--green)":avail>0?"#d97706":"var(--red)"}}>
                          💺 {avail===0?"FULL":`${avail} seats left`}
                        </span>
                        {r.stops.length > 0 && <span style={{fontSize:13,color:"var(--muted)"}}>📍 Via {r.stops.join(", ")}</span>}
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontWeight:800,fontSize:22,color:"var(--blue)"}}>{fmt(p)}</div>
                      <div style={{fontSize:12,color:"var(--muted)",textDecoration:"line-through"}}>{fmt(r.price)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:24}}>
            <button className="btn btn-primary" style={{width:"100%",padding:15,fontSize:16}} disabled={!route} onClick={()=>go("seats")}>
              Choose Seat →
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SEATS PAGE */}
      {/* ============================================================ */}
      {page === "seats" && route && (
        <div style={{maxWidth:600,margin:"0 auto",padding:"40px 20px"}} className="fade">
          <button className="btn btn-ghost" onClick={()=>go("routes")}>← Change Route</button>
          <h2 style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:900,color:"var(--navy)",margin:"20px 0 4px"}}>Pick Your Seat</h2>
          <p style={{color:"var(--muted)",marginBottom:20}}>{route.from} → {route.to} · {fmt(finalPrice)} · <strong style={{color:availCount>0?"var(--green)":"var(--red)"}}>{availCount} seats available</strong></p>

          {/* Legend */}
          <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
            {[{cls:"seat seat-free",label:"Available"},{cls:"seat seat-taken",label:"Booked"},{cls:"seat seat-sel",label:"Your pick"}].map(l=>(
              <div key={l.label} style={{display:"flex",alignItems:"center",gap:6}}>
                <div className={l.cls} style={{width:28,height:28,fontSize:8,borderRadius:4}} />
                <span style={{fontSize:12,color:"var(--muted)"}}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Van diagram */}
          <div className="card" style={{padding:24}}>
            <div style={{textAlign:"center",marginBottom:16,fontSize:12,fontWeight:700,color:"var(--muted)",letterSpacing:"2px",textTransform:"uppercase"}}>← Front of Van</div>
            {/* Row 0: Driver + 2 seats */}
            <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:8}}>
              <div className="seat seat-driver" style={{width:44,height:44}}>DRV</div>
              <div style={{width:44}} />
              {[1,2].map(n=>{
                const taken = takenSeats[n];
                const selected = seat===n;
                return <div key={n} onClick={()=>!taken&&setSeat(selected?null:n)} className={`seat ${taken?"seat-taken":selected?"seat-sel":"seat-free"}`}>{n}</div>;
              })}
            </div>
            {/* Rows 1-4: 3 seats each */}
            {[[3,4,5],[6,7,8],[9,10,11],[12,13,14]].map((row,i)=>(
              <div key={i} style={{display:"flex",gap:8,justifyContent:"center",marginBottom:8}}>
                {row.map(n=>{
                  const taken = takenSeats[n];
                  const selected = seat===n;
                  return <div key={n} onClick={()=>!taken&&setSeat(selected?null:n)} className={`seat ${taken?"seat-taken":selected?"seat-sel":"seat-free"}`}>{n}</div>;
                })}
              </div>
            ))}
            <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"var(--muted)"}}>← Door side &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Right-hand drive van</div>
          </div>

          {seat && (
            <div style={{background:"#dbeafe",border:"2px solid #bfdbfe",borderRadius:10,padding:"14px 18px",marginTop:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:700,color:"var(--blue)"}}>Seat {seat} selected ✓</span>
              <span style={{fontWeight:800,color:"var(--navy)"}}>{fmt(finalPrice)}</span>
            </div>
          )}
          <button className="btn btn-primary" style={{width:"100%",padding:15,fontSize:16,marginTop:16}} disabled={!seat} onClick={()=>go("form")}>
            Continue →
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* PASSENGER FORM PAGE */}
      {/* ============================================================ */}
      {page === "form" && route && (
        <div style={{maxWidth:560,margin:"0 auto",padding:"40px 20px"}} className="fade">
          <button className="btn btn-ghost" onClick={()=>go("seats")}>← Change Seat</button>
          <h2 style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:900,color:"var(--navy)",margin:"20px 0 4px"}}>Your Details</h2>
          <p style={{color:"var(--muted)",marginBottom:28}}>{route.from} → {route.to} · Seat {seat} · {fmt(finalPrice)}</p>

          <div className="card">
            <div style={{display:"flex",flexDirection:"column",gap:18}}>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:8}}>Full Name *</label>
                <input className="input" placeholder="Your full name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:8}}>Phone Number * <span style={{fontWeight:400,textTransform:"none"}}>(for WhatsApp receipt)</span></label>
                <input className="input" placeholder="07XX XXX XXX" type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:8}}>Boarding Point <span style={{fontWeight:400,textTransform:"none"}}>(optional — default: {route.from})</span></label>
                <select className="input" value={form.boarding} onChange={e=>setForm(f=>({...f,boarding:e.target.value}))}>
                  <option value="">Board from {route.from} (main terminal)</option>
                  {route.stops.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card" style={{marginTop:16,background:"#f8fafc"}}>
            <div style={{fontWeight:700,color:"var(--navy)",marginBottom:12}}>Booking Summary</div>
            {[
              ["Route",   `${route.from} → ${route.to}`],
              ["Seat",    `Seat ${seat}`],
              ["Duration",route.duration],
              ["Price",   `${fmt(finalPrice)} (20% off ${fmt(route.price)})`],
            ].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--border)",fontSize:14}}>
                <span style={{color:"var(--muted)"}}>{k}</span>
                <span style={{fontWeight:600,color:"var(--navy)"}}>{v}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" style={{width:"100%",padding:15,fontSize:16,marginTop:16}} disabled={!form.name||!form.phone} onClick={()=>go("payment")}>
            Continue to Payment →
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAYMENT PAGE */}
      {/* ============================================================ */}
      {page === "payment" && route && (
        <div style={{maxWidth:560,margin:"0 auto",padding:"40px 20px"}} className="fade">
          <button className="btn btn-ghost" onClick={()=>go("form")}>← Back</button>
          <h2 style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:900,color:"var(--navy)",margin:"20px 0 4px"}}>Payment</h2>
          <p style={{color:"var(--muted)",marginBottom:28}}>Pay securely with Mobile Money · Amount: <strong>{fmt(finalPrice)}</strong></p>

          {/* Payment method */}
          <div style={{display:"grid",gap:12,marginBottom:24}}>
            <div className={`pay-card pay-mtn ${payment==="mtn"?"active":""}`} onClick={()=>setPayment("mtn")}>
              <div style={{width:44,height:44,background:"#fbbf24",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,color:"#000"}}>MTN</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,color:"var(--navy)"}}>MTN Mobile Money</div>
                <div style={{fontSize:13,color:"var(--muted)"}}>Pay from your MTN MoMo wallet</div>
              </div>
              {payment==="mtn" && <div style={{color:"var(--green)",fontWeight:700,fontSize:18}}>✓</div>}
            </div>
            <div className={`pay-card pay-air ${payment==="airtel"?"active":""}`} onClick={()=>setPayment("airtel")}>
              <div style={{width:44,height:44,background:"#ef4444",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,color:"#fff"}}>AIR</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,color:"var(--navy)"}}>Airtel Money</div>
                <div style={{fontSize:13,color:"var(--muted)"}}>Pay from your Airtel Money wallet</div>
              </div>
              {payment==="airtel" && <div style={{color:"var(--green)",fontWeight:700,fontSize:18}}>✓</div>}
            </div>
          </div>

          {/* Instructions */}
          <div className="card" style={{background:"#f0fdf4",border:"1px solid #86efac",marginBottom:20}}>
            <div style={{fontWeight:700,color:"var(--green)",marginBottom:10}}>📱 How to complete payment:</div>
            {payment==="mtn" ? (
              <ol style={{paddingLeft:18,color:"var(--text)",fontSize:14,lineHeight:2}}>
                <li>Dial <strong>*165#</strong> on your MTN phone</li>
                <li>Select <strong>Transfer Money</strong> → <strong>Merchant Payment</strong></li>
                <li>Enter merchant code: <strong>RAYLANE</strong></li>
                <li>Enter amount: <strong>{fmt(finalPrice)}</strong></li>
                <li>Enter your PIN and confirm</li>
                <li>Click <strong>"I've Paid"</strong> below to confirm your booking</li>
              </ol>
            ) : (
              <ol style={{paddingLeft:18,color:"var(--text)",fontSize:14,lineHeight:2}}>
                <li>Dial <strong>*185#</strong> on your Airtel phone</li>
                <li>Select <strong>Make Payments</strong> → <strong>Pay Merchant</strong></li>
                <li>Enter merchant code: <strong>RAYLANE</strong></li>
                <li>Enter amount: <strong>{fmt(finalPrice)}</strong></li>
                <li>Enter your PIN and confirm</li>
                <li>Click <strong>"I've Paid"</strong> below to confirm your booking</li>
              </ol>
            )}
          </div>

          {/* Amount box */}
          <div style={{background:"var(--navy)",borderRadius:10,padding:"20px 24px",textAlign:"center",marginBottom:20}}>
            <div style={{color:"rgba(255,255,255,.6)",fontSize:13,marginBottom:4}}>Total Amount to Pay</div>
            <div style={{fontFamily:"'Fraunces',serif",fontSize:40,fontWeight:900,color:"#fbbf24"}}>{fmt(finalPrice)}</div>
            <div style={{color:"rgba(255,255,255,.5)",fontSize:12,marginTop:4}}>{route.from} → {route.to} · Seat {seat} · {payment.toUpperCase()}</div>
          </div>

          <button className="btn btn-primary" style={{width:"100%",padding:16,fontSize:16}} onClick={handlePayment} disabled={paying}>
            {paying ? <><span className="spin" style={{display:"inline-block",width:18,height:18,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%"}} /> Processing...</> : "✅ I've Paid — Confirm Booking"}
          </button>
          <p style={{textAlign:"center",fontSize:12,color:"var(--muted)",marginTop:12}}>By confirming, you agree that payment has been completed via Mobile Money</p>
        </div>
      )}

      {/* ============================================================ */}
      {/* CONFIRMATION PAGE */}
      {/* ============================================================ */}
      {page === "confirm" && confirm && (
        <div style={{maxWidth:520,margin:"0 auto",padding:"60px 20px",textAlign:"center"}} className="fade">
          <div style={{width:72,height:72,background:"#dcfce7",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:36}}>✅</div>
          <h2 style={{fontFamily:"'Fraunces',serif",fontSize:32,fontWeight:900,color:"var(--navy)",marginBottom:8}}>Booking Confirmed!</h2>
          <p style={{color:"var(--muted)",marginBottom:28,fontSize:15}}>Your WhatsApp receipt has been sent to {confirm.name}</p>

          <div className="card" style={{textAlign:"left",marginBottom:24}}>
            <div style={{background:"var(--navy)",borderRadius:8,padding:"16px 20px",marginBottom:16,textAlign:"center"}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,.6)",letterSpacing:"2px",textTransform:"uppercase",marginBottom:4}}>Booking Code</div>
              <div style={{fontFamily:"'Fraunces',serif",fontSize:32,fontWeight:900,color:"#fbbf24",letterSpacing:"4px"}}>{confirm.code}</div>
            </div>
            {[
              ["Passenger", confirm.name],
              ["Route",     `${confirm.route.from} → ${confirm.route.to}`],
              ["Seat",      `Seat ${confirm.seat}`],
              ["Amount Paid", fmt(confirm.price)],
              ["Payment",   confirm.payment.toUpperCase() + " MoMo"],
            ].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)",fontSize:14}}>
                <span style={{color:"var(--muted)"}}>{k}</span>
                <span style={{fontWeight:700,color:"var(--navy)"}}>{v}</span>
              </div>
            ))}
          </div>

          <a href={`https://wa.me/${CONFIG.WHATSAPP}`} target="_blank" rel="noreferrer" className="btn btn-gold" style={{width:"100%",justifyContent:"center",marginBottom:12,fontSize:15}}>
            <Icon.wa /> Open WhatsApp Chat
          </a>
          <button className="btn btn-outline" style={{width:"100%",justifyContent:"center"}} onClick={reset}>← Book Another Seat</button>
        </div>
      )}

      {/* ============================================================ */}
      {/* COURIER PAGE */}
      {/* ============================================================ */}
      {page === "courier" && (
        <div style={{maxWidth:800,margin:"0 auto",padding:"40px 20px"}} className="fade">
          <button className="btn btn-ghost" onClick={()=>go("home")}>← Home</button>
          <div style={{display:"flex",alignItems:"center",gap:14,margin:"20px 0 8px"}}>
            <div style={{fontSize:36}}>📦</div>
            <div>
              <h2 style={{fontFamily:"'Fraunces',serif",fontSize:32,fontWeight:900,color:"var(--navy)"}}>Courier Service</h2>
              <p style={{color:"var(--muted)"}}>Send parcels between cities on our vans · From UGX 5,000</p>
            </div>
          </div>

          <div className="divider" />

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {/* Parcel info */}
            <div className="card" style={{gridColumn:"1/-1"}}>
              <div style={{fontWeight:800,fontSize:16,color:"var(--navy)",marginBottom:16}}>📋 Parcel Details</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>From City</label>
                  <select className="input">
                    {[...new Set(ROUTES.map(r=>r.from))].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>To City</label>
                  <select className="input">
                    {[...new Set(ROUTES.map(r=>r.to))].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>What are you sending?</label>
                  <input className="input" placeholder="e.g. Documents, Electronics, Clothes" />
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Weight</label>
                  <select className="input">
                    <option>Under 1 kg — UGX 5,000</option>
                    <option>1–3 kg — UGX 10,000</option>
                    <option>3–5 kg — UGX 18,000</option>
                    <option>5–10 kg — UGX 30,000</option>
                    <option>10–20 kg — UGX 50,000</option>
                    <option>Over 20 kg — Contact us</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sender */}
            <div className="card">
              <div style={{fontWeight:800,fontSize:15,color:"var(--navy)",marginBottom:14}}>👤 Sender</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <input className="input" placeholder="Full name" />
                <input className="input" placeholder="Phone: 07XX XXX XXX" type="tel" />
                <input className="input" placeholder="Drop-off point" />
              </div>
            </div>

            {/* Recipient */}
            <div className="card">
              <div style={{fontWeight:800,fontSize:15,color:"var(--navy)",marginBottom:14}}>📬 Recipient</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <input className="input" placeholder="Full name" />
                <input className="input" placeholder="Phone: 07XX XXX XXX" type="tel" />
                <input className="input" placeholder="Collection point" />
              </div>
            </div>

            {/* Rates */}
            <div className="card" style={{gridColumn:"1/-1",background:"#f8fafc"}}>
              <div style={{fontWeight:800,fontSize:15,color:"var(--navy)",marginBottom:14}}>💰 Courier Rates</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10}}>
                {[
                  {size:"Under 1 kg",price:"UGX 5,000",icon:"✉️"},
                  {size:"1–3 kg",price:"UGX 10,000",icon:"📦"},
                  {size:"3–5 kg",price:"UGX 18,000",icon:"🗃️"},
                  {size:"5–10 kg",price:"UGX 30,000",icon:"📫"},
                  {size:"10–20 kg",price:"UGX 50,000",icon:"🏗️"},
                  {size:"20 kg+",price:"Call us",icon:"📞"},
                ].map(r=>(
                  <div key={r.size} style={{background:"#fff",borderRadius:8,padding:"12px 14px",border:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:20}}>{r.icon}</span>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color:"var(--navy)"}}>{r.size}</div>
                      <div style={{fontSize:12,color:"var(--blue)",fontWeight:700}}>{r.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{marginTop:20,display:"flex",gap:12,justifyContent:"flex-end"}}>
            <button className="btn btn-outline" onClick={()=>go("home")}>Cancel</button>
            <button className="btn btn-primary" style={{padding:"13px 32px"}} onClick={()=>{showToast("Courier request submitted! We will contact you on WhatsApp within 15 minutes.");go("home");}}>
              📦 Submit Courier Request
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* FEEDBACK PAGE */}
      {/* ============================================================ */}
      {page === "feedback" && <FeedbackPage go={go} showToast={showToast} />}

      {/* ============================================================ */}
      {/* ADMIN PAGE */}
      {/* ============================================================ */}
      {page === "admin" && <AdminPage go={go} adminAuth={adminAuth} setAdminAuth={setAdminAuth} agentAuth={agentAuth} setAgentAuth={setAgentAuth} showToast={showToast} bookings={bookings} setBookings={setBookings} />}
    </div>
  );
}

// ============================================================
// FEEDBACK PAGE
// ============================================================
function FeedbackPage({ go, showToast }) {
  const [form, setForm] = React.useState({ name:"", phone:"", route:"", rating:5, message:"" });
  const [sending, setSending] = React.useState(false);

  async function submit() {
    if (!form.message.trim()) { showToast("Please enter your feedback message", "error"); return; }
    setSending(true);
    try {
      await SB.post("feedback", {
        passenger_name:  form.name||"Anonymous",
        passenger_phone: form.phone,
        route:           form.route,
        rating:          form.rating,
        message:         form.message,
        is_visible:      true,
      });
      showToast("Thank you! Your feedback has been submitted.");
      go("home");
    } catch(e) {
      showToast("Failed to submit. Please try again.", "error");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{maxWidth:560,margin:"0 auto",padding:"40px 20px"}} className="fade">
      <button className="btn btn-ghost" onClick={()=>go("home")}>← Home</button>
      <h2 style={{fontFamily:"'Fraunces',serif",fontSize:32,fontWeight:900,color:"var(--navy)",margin:"20px 0 4px"}}>Share Your Experience</h2>
      <p style={{color:"var(--muted)",marginBottom:28}}>Your feedback helps us improve every journey</p>
      <div className="card">
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div>
            <label style={{fontSize:12,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:8}}>Your Name (optional)</label>
            <input className="input" placeholder="Anonymous" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:8}}>Route Travelled</label>
            <select className="input" value={form.route} onChange={e=>setForm(f=>({...f,route:e.target.value}))}>
              <option value="">Select route...</option>
              {ROUTES.map(r=><option key={r.id} value={r.id}>{r.from} → {r.to}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:10}}>Rating</label>
            <div style={{display:"flex",gap:8}}>
              {[1,2,3,4,5].map(n=>(
                <button key={n} onClick={()=>setForm(f=>({...f,rating:n}))} style={{width:44,height:44,borderRadius:8,border:`2px solid ${form.rating>=n?"var(--gold)":"var(--border)"}`,background:form.rating>=n?"#fef3c7":"#fff",cursor:"pointer",fontSize:20}}>⭐</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:8}}>Your Message *</label>
            <textarea className="input" rows={4} placeholder="Tell us about your experience..." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} style={{resize:"vertical"}} />
          </div>
        </div>
      </div>
      <button className="btn btn-primary" style={{width:"100%",padding:15,fontSize:15,marginTop:16}} onClick={submit} disabled={sending}>
        {sending ? "Submitting..." : "⭐ Submit Feedback"}
      </button>
    </div>
  );
}

// ============================================================
// ADMIN PAGE
// ============================================================
function AdminPage({ go, adminAuth, setAdminAuth, agentAuth, setAgentAuth, showToast, bookings, setBookings }) {
  const [pw, setPw]           = React.useState("");
  const [agentPin, setAgentPin] = React.useState("");
  const [tab, setTab]         = React.useState("bookings");
  const [allBookings, setAllBookings] = React.useState([]);
  const [agents, setAgents]   = React.useState([]);
  const [feedback, setFeedback] = React.useState([]);
  const [vans, setVans]       = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [newAgent, setNewAgent] = React.useState({ name:"", phone:"", pin:"" });

  async function adminLogin() {
    if (!pw.trim()) return;
    try {
      const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/users?phone=eq.256700000000&select=password_hash,is_active`, { headers: { apikey: CONFIG.SUPABASE_KEY, Authorization: "Bearer " + CONFIG.SUPABASE_KEY } });
      const rows = await res.json();
      const user = rows[0];
      if (!user) { showToast("Admin account not found", "error"); return; }
      if (user.password_hash === pw) {
        setAdminAuth(true); loadAdminData();
        showToast("Welcome to the Admin Dashboard!");
      } else {
        const vRes = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/rpc/verify_user_password`, { method:"POST", headers:{ "Content-Type":"application/json", apikey:CONFIG.SUPABASE_KEY, Authorization:"Bearer "+CONFIG.SUPABASE_KEY }, body:JSON.stringify({p_phone:"256700000000",p_password:pw}) });
        const ok = await vRes.json();
        if (ok) { setAdminAuth(true); loadAdminData(); showToast("Welcome to the Admin Dashboard!"); }
        else showToast("Incorrect password", "error");
      }
    } catch(e) { showToast("Connection error", "error"); }
    setPw("");
  }

  async function agentLogin() {
    if (!agentPin.trim()) return;
    try {
      const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/rpc/verify_agent_pin`, { method:"POST", headers:{ "Content-Type":"application/json", apikey:CONFIG.SUPABASE_KEY, Authorization:"Bearer "+CONFIG.SUPABASE_KEY }, body:JSON.stringify({p_pin:agentPin}) });
      const agent = await res.json();
      if (agent && agent.id) { setAgentAuth({id:agent.id,name:agent.full_name}); showToast(`Welcome, ${agent.full_name}!`); go("routes"); }
      else showToast("Invalid agent PIN", "error");
    } catch(e) { showToast("Connection error", "error"); }
    setAgentPin("");
  }

  async function loadAdminData() {
    setLoading(true);
    const [bk, ag, fb] = await Promise.all([
      SB.get("bookings","?order=created_at.desc&limit=100"),
      SB.get("users","?role=eq.agent&order=created_at.desc"),
      SB.get("feedback","?order=created_at.desc&limit=50"),
    ]);
    if (Array.isArray(bk)) setAllBookings(bk);
    if (Array.isArray(ag)) setAgents(ag);
    if (Array.isArray(fb)) setFeedback(fb);
    setLoading(false);
  }

  async function cancelBooking(id) {
    if (!confirm("Cancel this booking?")) return;
    await SB.patch("bookings","?id=eq."+id,{status:"cancelled"});
    setAllBookings(prev=>prev.map(b=>b.id===id?{...b,status:"cancelled"}:b));
    showToast("Booking cancelled");
  }

  async function addAgent() {
    if (!newAgent.name||!newAgent.pin) { showToast("Name and PIN required","error"); return; }
    await SB.post("users",{ full_name:newAgent.name, phone:newAgent.phone, password_hash:"PLAIN:"+newAgent.pin, role:"agent", is_active:true });
    setNewAgent({name:"",phone:"",pin:""});
    loadAdminData();
    showToast("Agent added!");
  }

  const totalRev = allBookings.filter(b=>b.status==="confirmed").reduce((s,b)=>s+(b.amount_paid||0),0);
  const confirmedCount = allBookings.filter(b=>b.status==="confirmed").length;

  if (!adminAuth) {
    return (
      <div style={{maxWidth:460,margin:"0 auto",padding:"60px 20px"}} className="fade">
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{width:64,height:64,background:"linear-gradient(135deg,var(--blue),var(--navy))",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:28}}>🔒</div>
          <h2 style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:900,color:"var(--navy)"}}>Raylane Control Centre</h2>
          <p style={{color:"var(--muted)",marginTop:6}}>Admin and agent access</p>
        </div>

        <div className="card" style={{marginBottom:16}}>
          <div style={{fontWeight:700,color:"var(--navy)",marginBottom:14}}>Admin Login</div>
          <input className="input" type="password" placeholder="Admin password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&adminLogin()} style={{marginBottom:12}} />
          <button className="btn btn-navy" style={{width:"100%"}} onClick={adminLogin}>Login to Dashboard →</button>
        </div>

        <div className="card">
          <div style={{fontWeight:700,color:"var(--navy)",marginBottom:14}}>Agent / Call Centre Login</div>
          <input className="input" type="password" placeholder="Agent PIN" value={agentPin} onChange={e=>setAgentPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&agentLogin()} style={{marginBottom:12}} />
          <button className="btn btn-primary" style={{width:"100%"}} onClick={agentLogin}>Agent Login →</button>
        </div>

        <button className="btn btn-ghost" style={{marginTop:16}} onClick={()=>go("home")}>← Back to Home</button>
      </div>
    );
  }

  const TABS = [
    {id:"bookings",label:"📋 Bookings"},
    {id:"revenue", label:"💰 Revenue"},
    {id:"agents",  label:"👥 Agents"},
    {id:"feedback",label:"⭐ Feedback"},
  ];

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"30px 20px"}} className="fade">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28,flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:900,color:"var(--navy)"}}>Admin Dashboard</h2>
          <p style={{color:"var(--muted)",fontSize:14}}>Raylane Express Control Centre</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button className="btn btn-outline" style={{fontSize:13,padding:"8px 16px"}} onClick={loadAdminData}>🔄 Refresh</button>
          <button className="btn btn-ghost" style={{fontSize:13}} onClick={()=>{setAdminAuth(false);go("home");}}>Sign Out</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:28}}>
        {[
          {label:"Total Bookings",value:confirmedCount,icon:"🎫",color:"var(--blue)"},
          {label:"Revenue",value:fmt(totalRev),icon:"💰",color:"var(--green)"},
          {label:"Active Agents",value:agents.filter(a=>a.is_active).length,icon:"👥",color:"var(--navy)"},
          {label:"Feedback",value:feedback.length,icon:"⭐",color:"#d97706"},
        ].map(s=>(
          <div key={s.label} className="card" style={{textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:6}}>{s.icon}</div>
            <div style={{fontWeight:800,fontSize:22,color:s.color}}>{s.value}</div>
            <div style={{fontSize:12,color:"var(--muted)",fontWeight:600}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,marginBottom:20,background:"#f1f5f9",borderRadius:10,padding:4,flexWrap:"wrap"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:"1 1 auto",padding:"10px 16px",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,transition:"all .15s",background:tab===t.id?"#fff":"transparent",color:tab===t.id?"var(--navy)":"var(--muted)",boxShadow:tab===t.id?"0 1px 4px rgba(0,0,0,.1)":"none"}}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && <div style={{textAlign:"center",padding:40,color:"var(--muted)"}}>Loading...</div>}

      {/* BOOKINGS TAB */}
      {!loading && tab==="bookings" && (
        <div className="card" style={{padding:0,overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{background:"#f8fafc",borderBottom:"2px solid var(--border)"}}>
                  {["Code","Passenger","Route","Seat","Amount","Payment","Status","Action"].map(h=>(
                    <th key={h} style={{padding:"12px 16px",textAlign:"left",fontWeight:700,color:"var(--muted)",fontSize:11,textTransform:"uppercase",letterSpacing:".5px",whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allBookings.length===0 && <tr><td colSpan={8} style={{padding:32,textAlign:"center",color:"var(--muted)"}}>No bookings yet</td></tr>}
                {allBookings.map(b=>(
                  <tr key={b.id} style={{borderBottom:"1px solid var(--border)"}}>
                    <td style={{padding:"12px 16px",fontWeight:700,color:"var(--navy)",fontFamily:"monospace"}}>{b.booking_code}</td>
                    <td style={{padding:"12px 16px"}}>{b.passenger_name}<br/><span style={{fontSize:11,color:"var(--muted)"}}>{b.passenger_phone}</span></td>
                    <td style={{padding:"12px 16px",whiteSpace:"nowrap"}}>{b.route_from} → {b.route_to}</td>
                    <td style={{padding:"12px 16px",fontWeight:700}}>Seat {b.seat_number}</td>
                    <td style={{padding:"12px 16px",fontWeight:700,color:"var(--blue)"}}>{fmt(b.amount_paid)}</td>
                    <td style={{padding:"12px 16px",textTransform:"uppercase",fontSize:11,fontWeight:700}}>{b.payment_method}</td>
                    <td style={{padding:"12px 16px"}}>
                      <span className={`badge ${b.status==="confirmed"?"badge-green":b.status==="cancelled"?"badge-red":"badge-blue"}`}>{b.status}</span>
                    </td>
                    <td style={{padding:"12px 16px"}}>
                      {b.status==="confirmed" && <button onClick={()=>cancelBooking(b.id)} style={{background:"none",border:"1px solid #fca5a5",color:"var(--red)",borderRadius:5,padding:"4px 10px",cursor:"pointer",fontSize:12,fontWeight:600}}>Cancel</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REVENUE TAB */}
      {!loading && tab==="revenue" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
          {ROUTES.map(r=>{
            const rb = allBookings.filter(b=>b.route_id===r.id&&b.status==="confirmed");
            const rev = rb.reduce((s,b)=>s+(b.amount_paid||0),0);
            return (
              <div key={r.id} className="card">
                <div style={{fontWeight:800,color:"var(--navy)",marginBottom:4}}>{r.from} → {r.to}</div>
                <div style={{fontSize:12,color:"var(--muted)",marginBottom:12}}>{rb.length} confirmed bookings</div>
                <div style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:900,color:"var(--blue)"}}>{fmt(rev)}</div>
              </div>
            );
          })}
          <div className="card" style={{background:"var(--navy)",gridColumn:"1/-1"}}>
            <div style={{fontWeight:700,color:"rgba(255,255,255,.7)",marginBottom:4}}>Total Revenue (All Routes)</div>
            <div style={{fontFamily:"'Fraunces',serif",fontSize:36,fontWeight:900,color:"#fbbf24"}}>{fmt(totalRev)}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:4}}>{confirmedCount} confirmed bookings</div>
          </div>
        </div>
      )}

      {/* AGENTS TAB */}
      {!loading && tab==="agents" && (
        <div style={{display:"grid",gap:16}}>
          <div className="card">
            <div style={{fontWeight:800,color:"var(--navy)",marginBottom:16}}>Add New Agent</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:10,alignItems:"end"}}>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Full Name</label>
                <input className="input" placeholder="Agent name" value={newAgent.name} onChange={e=>setNewAgent(a=>({...a,name:e.target.value}))} />
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Phone</label>
                <input className="input" placeholder="07XX XXX XXX" value={newAgent.phone} onChange={e=>setNewAgent(a=>({...a,phone:e.target.value}))} />
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>PIN (4-8 digits)</label>
                <input className="input" type="password" placeholder="PIN" value={newAgent.pin} onChange={e=>setNewAgent(a=>({...a,pin:e.target.value}))} />
              </div>
              <button className="btn btn-primary" style={{height:46,padding:"0 20px"}} onClick={addAgent}>Add</button>
            </div>
          </div>
          <div className="card" style={{padding:0,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{background:"#f8fafc",borderBottom:"2px solid var(--border)"}}>
                  {["Name","Phone","Status","Added"].map(h=>(
                    <th key={h} style={{padding:"12px 16px",textAlign:"left",fontWeight:700,color:"var(--muted)",fontSize:11,textTransform:"uppercase",letterSpacing:".5px"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agents.length===0 && <tr><td colSpan={4} style={{padding:32,textAlign:"center",color:"var(--muted)"}}>No agents yet</td></tr>}
                {agents.map(a=>(
                  <tr key={a.id} style={{borderBottom:"1px solid var(--border)"}}>
                    <td style={{padding:"12px 16px",fontWeight:700,color:"var(--navy)"}}>{a.full_name}</td>
                    <td style={{padding:"12px 16px",color:"var(--muted)"}}>{a.phone}</td>
                    <td style={{padding:"12px 16px"}}><span className={`badge ${a.is_active?"badge-green":"badge-red"}`}>{a.is_active?"Active":"Inactive"}</span></td>
                    <td style={{padding:"12px 16px",color:"var(--muted)",fontSize:12}}>{new Date(a.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FEEDBACK TAB */}
      {!loading && tab==="feedback" && (
        <div style={{display:"grid",gap:14}}>
          {feedback.length===0 && <div className="card" style={{textAlign:"center",color:"var(--muted)",padding:40}}>No feedback yet</div>}
          {feedback.map(f=>(
            <div key={f.id} className="card">
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:8}}>
                <div style={{fontWeight:700,color:"var(--navy)"}}>{f.passenger_name||"Anonymous"} <span style={{fontWeight:400,color:"var(--muted)",fontSize:13}}>· {f.route||"General"}</span></div>
                <div>{"⭐".repeat(f.rating||5)}</div>
              </div>
              <p style={{color:"var(--text)",fontSize:14,lineHeight:1.6}}>{f.message}</p>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:8}}>{new Date(f.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);

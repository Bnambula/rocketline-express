import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════
// BRAND COLORS — matching Raylane Express screenshot (navy + amber)
// ═══════════════════════════════════════════════════════════════════════
const C = {
  navy:       "#0D1B3E",
  navyMid:    "#132347",
  navyLight:  "#1A2E5A",
  navyBorder: "#243660",
  amber:      "#F5A623",
  amberLight: "#FFB940",
  amberDark:  "#D4891A",
  white:      "#FFFFFF",
  offWhite:   "#F0F4FF",
  textPrimary:"#FFFFFF",
  textSecondary:"#A8BADA",
  textMuted:  "#5B7299",
  green:      "#22C55E",
  red:        "#EF4444",
  orange:     "#F97316",
  blue:       "#3B82F6",
  surface:    "#111E3A",
  card:       "#162040",
  cardHover:  "#1C2A50",
};

// ═══════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════
const ROUTES = [
  { id:1, origin:"Kampala", destination:"Gulu",      price:35000, duration_minutes:240 },
  { id:2, origin:"Kampala", destination:"Mbarara",   price:25000, duration_minutes:180 },
  { id:3, origin:"Kampala", destination:"Mbale",     price:30000, duration_minutes:210 },
  { id:4, origin:"Kampala", destination:"Fort Portal",price:40000,duration_minutes:270 },
  { id:5, origin:"Kampala", destination:"Arua",      price:50000, duration_minutes:360 },
  { id:6, origin:"Kampala", destination:"Jinja",     price:15000, duration_minutes:90  },
];

// Trips with departure times spread across the current day
const makeToday = (h, m) => {
  const d = new Date(); d.setHours(h, m, 0, 0); return d.toISOString();
};
const TRIPS = [
  { id:1, route_id:6, vehicle_id:1, departure_time: makeToday(6,0),  status:"active",  seats_available:5,  vehicle_reg:"UAA 123B", capacity:14 },
  { id:2, route_id:2, vehicle_id:2, departure_time: makeToday(7,30), status:"active",  seats_available:3,  vehicle_reg:"UAB 456C", capacity:30 },
  { id:3, route_id:3, vehicle_id:3, departure_time: makeToday(9,0),  status:"active",  seats_available:12, vehicle_reg:"UAC 789D", capacity:14 },
  { id:4, route_id:1, vehicle_id:4, departure_time: makeToday(11,0), status:"active",  seats_available:0,  vehicle_reg:"UAD 012E", capacity:14 },
  { id:5, route_id:4, vehicle_id:1, departure_time: makeToday(13,30),status:"active",  seats_available:8,  vehicle_reg:"UAA 123B", capacity:14 },
  { id:6, route_id:5, vehicle_id:2, departure_time: makeToday(15,0), status:"active",  seats_available:14, vehicle_reg:"UAB 456C", capacity:30 },
];

const BOOKINGS_DATA = [
  { id:1, booking_code:"RX-2840", passenger:"Sarah Nakato",  route:"Kampala → Gulu",    seats:2, amount:70000,  status:"confirmed", date:"2026-03-09", phone:"+256 772 123456" },
  { id:2, booking_code:"RX-2841", passenger:"James Okello",  route:"Kampala → Mbarara", seats:1, amount:25000,  status:"confirmed", date:"2026-03-09", phone:"+256 701 234567" },
  { id:3, booking_code:"RX-2842", passenger:"Grace Auma",    route:"Kampala → Mbale",   seats:3, amount:90000,  status:"pending",   date:"2026-03-09", phone:"+256 782 345678" },
  { id:4, booking_code:"RX-2839", passenger:"Peter Mugisha", route:"Kampala → Gulu",    seats:1, amount:35000,  status:"confirmed", date:"2026-03-08", phone:"+256 756 456789" },
  { id:5, booking_code:"RX-2838", passenger:"Agnes Aber",    route:"Kampala → Arua",    seats:2, amount:100000, status:"cancelled", date:"2026-03-08", phone:"+256 714 567890" },
];

const VEHICLES_DATA = [
  { id:1, registration:"UAA 123B", model:"Toyota HiAce",  capacity:14, owner_type:"company", status:"active",      driver:"Moses Kato"    },
  { id:2, registration:"UAB 456C", model:"Toyota Coaster",capacity:30, owner_type:"vendor",  status:"active",      driver:"David Ssebi"   },
  { id:3, registration:"UAC 789D", model:"Isuzu NQR",     capacity:36, owner_type:"vendor",  status:"maintenance", driver:"John Mwesigwa" },
  { id:4, registration:"UAD 012E", model:"Toyota HiAce",  capacity:14, owner_type:"company", status:"active",      driver:"Robert Okech"  },
];

const EXPENSES_DATA = [
  { id:1, category:"Fuel",            amount:450000, description:"Kampala-Gulu route fuel", date:"2026-03-09" },
  { id:2, category:"Maintenance",     amount:320000, description:"UAC 789D service",        date:"2026-03-08" },
  { id:3, category:"Driver Allowance",amount:180000, description:"March allowances",        date:"2026-03-07" },
  { id:4, category:"Terminal Fees",   amount:90000,  description:"Nakasero terminal",       date:"2026-03-06" },
];

// Feedback store: pending + approved
const INITIAL_FEEDBACK = [
  { id:1, name:"Brian Otieno",    rating:5, message:"Excellent service! Driver was professional and on time. Will definitely use again.", route:"Kampala → Jinja",    date:"2026-03-07", status:"approved" },
  { id:2, name:"Patience Akello", rating:4, message:"Comfortable ride and fair pricing. The WhatsApp ticket was very convenient.",        route:"Kampala → Gulu",     date:"2026-03-06", status:"approved" },
  { id:3, name:"Samuel Wasswa",   rating:5, message:"Best transport company in Uganda. Seats are clean and the driver was courteous.",    route:"Kampala → Mbarara",  date:"2026-03-08", status:"approved" },
  { id:4, name:"Test User",       rating:3, message:"This is a pending review waiting for admin approval.",                               route:"Kampala → Mbale",    date:"2026-03-09", status:"pending"  },
];

const FAQ_DATA = [
  { q:"How do I book a seat?",           a:"Select your route on the Schedule or homepage, choose an available trip, pick your seat(s), enter your details, and pay via Mobile Money. Your QR boarding pass is sent instantly via WhatsApp." },
  { q:"What if the van is fully booked?",a:"The system will automatically show the next available departure to your destination and allow you to book that trip directly." },
  { q:"What is the luggage allowance?",  a:"Each passenger is entitled to 10kg of luggage free of charge. Additional luggage may attract extra charges depending on weight and available space." },
  { q:"What happens if luggage is lost?",a:"Report lost luggage immediately to the driver or Raylane Express office. We encourage passengers to label luggage clearly and keep valuables with them during travel." },
  { q:"Can I cancel or reschedule?",     a:"Trip changes may be possible before departure depending on seat availability. Contact Raylane Express support for assistance." },
  { q:"How do I receive my ticket?",     a:"Tickets are sent electronically via WhatsApp after booking confirmation and payment verification, including a QR code for boarding." },
  { q:"What if I miss my trip?",         a:"Contact the Raylane Express office immediately to check availability on the next departure." },
  { q:"Is there special assistance for passengers with disabilities?",a:"Yes. During booking, select the accessibility checkbox and describe the assistance needed (e.g. wheelchair, elderly boarding, visual impairment). Staff will be notified." },
];

// ═══════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════
const formatUGX = n => `UGX ${Number(n).toLocaleString()}`;
const formatTime = dt => new Date(dt).toLocaleTimeString("en-UG",{hour:"2-digit",minute:"2-digit"});
const formatDate = dt => new Date(dt).toLocaleDateString("en-UG",{day:"numeric",month:"short",year:"numeric"});
const getRoute  = id => ROUTES.find(r=>r.id===id) || {};

function useCountdown(target) {
  const [diff, setDiff] = useState(new Date(target)-new Date());
  useEffect(()=>{
    const t=setInterval(()=>setDiff(new Date(target)-new Date()),1000);
    return ()=>clearInterval(t);
  },[target]);
  if(diff<=0) return { str:"Departed", urgent:false, boarding:false };
  const h=Math.floor(diff/3600000);
  const m=Math.floor((diff%3600000)/60000);
  const s=Math.floor((diff%60000)/1000);
  const mins = diff/60000;
  return {
    str: h>0?`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`:`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`,
    urgent: mins<=30,
    boarding: mins<=18,
    mins,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL CSS
// ═══════════════════════════════════════════════════════════════════════
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800;900&family=Nunito:wght@300;400;500;600&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{background:${C.navy};color:${C.white};font-family:'Nunito',sans-serif;overflow-x:hidden;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:${C.navy};}
  ::-webkit-scrollbar-thumb{background:${C.navyBorder};border-radius:3px;}
  .ral{font-family:'Raleway',sans-serif;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
  @keyframes blink{0%,100%{box-shadow:0 0 0 0 ${C.amber}66;}50%{box-shadow:0 0 12px 4px ${C.amber}44;}}
  @keyframes urgentPulse{0%,100%{background:${C.orange}22;}50%{background:${C.orange}44;}}
  @keyframes spin{to{transform:rotate(360deg);}}
  @keyframes slideIn{from{transform:translateX(-12px);opacity:0;}to{transform:translateX(0);opacity:1;}}
  .fade-up{animation:fadeUp .4s ease forwards;}
  .live-dot{width:8px;height:8px;border-radius:50%;background:${C.green};animation:pulse 1.5s infinite;display:inline-block;}
  .urgent-card{animation:urgentPulse 1.5s infinite;}
  .pulse-timer{animation:blink 1s infinite;}
  select option{background:${C.navyMid};}
`;

// ═══════════════════════════════════════════════════════════════════════
// BASE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════
const Badge = ({color=C.amber,children})=>(
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 10px",fontSize:11,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase"}}>{children}</span>
);
const StatusBadge = ({status})=>{
  const map={confirmed:C.green,pending:C.amber,cancelled:C.red,active:C.green,filling:C.amber,maintenance:C.red,company:C.blue,vendor:"#A855F7",approved:C.green};
  return <Badge color={map[status]||C.blue}>{status}</Badge>;
};

const Btn = ({children,onClick,variant="primary",style:s={},disabled})=>(
  <button onClick={onClick} disabled={disabled} style={{
    background: variant==="primary"?`linear-gradient(135deg,${C.amber},${C.amberDark})`:variant==="navy"?C.navyLight:"transparent",
    color: variant==="primary"?"#0D1B3E":C.white,
    border: variant==="outline"?`1px solid ${C.navyBorder}`:"none",
    borderRadius:10,padding:"10px 22px",fontFamily:"'Raleway',sans-serif",fontWeight:800,
    fontSize:13,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.5:1,
    transition:"all .2s",letterSpacing:".3px",...s
  }}
  onMouseEnter={e=>{if(!disabled&&variant==="primary"){e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 6px 20px ${C.amber}44`;}}}
  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}
  >{children}</button>
);

const Input = ({label,type="text",value,onChange,placeholder,style:s={}})=>(
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontSize:11,color:C.textSecondary,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>{label}</label>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{background:C.navyMid,border:`1px solid ${C.navyBorder}`,borderRadius:10,padding:"11px 14px",color:C.white,fontSize:14,outline:"none",transition:"border .2s",...s}}
      onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor=C.navyBorder}/>
  </div>
);

const Textarea = ({label,value,onChange,placeholder,rows=4})=>(
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontSize:11,color:C.textSecondary,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>{label}</label>}
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{background:C.navyMid,border:`1px solid ${C.navyBorder}`,borderRadius:10,padding:"11px 14px",color:C.white,fontSize:14,outline:"none",transition:"border .2s",resize:"vertical",fontFamily:"'Nunito',sans-serif"}}
      onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor=C.navyBorder}/>
  </div>
);

const Select = ({label,value,onChange,options,style:s={}})=>(
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontSize:11,color:C.textSecondary,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>{label}</label>}
    <select value={value} onChange={onChange} style={{background:C.navyMid,border:`1px solid ${C.navyBorder}`,borderRadius:10,padding:"11px 14px",color:C.white,fontSize:14,outline:"none",cursor:"pointer",...s}}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Card = ({children,style:s={}})=>(
  <div style={{background:C.card,border:`1px solid ${C.navyBorder}`,borderRadius:16,padding:24,...s}}>{children}</div>
);

const Modal = ({open,onClose,title,children})=>{
  if(!open) return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"#000b",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.navyMid,border:`1px solid ${C.navyBorder}`,borderRadius:20,padding:32,maxWidth:560,width:"100%",maxHeight:"90vh",overflowY:"auto",animation:"fadeUp .3s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <h2 className="ral" style={{fontSize:20,fontWeight:800}}>{title}</h2>
          <button onClick={onClose} style={{background:C.navyLight,border:"none",color:C.textSecondary,borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// QR CODE (mock SVG)
// ═══════════════════════════════════════════════════════════════════════
const QRCode = ({value,size=120})=>{
  const cells=15, cell=size/cells;
  const seed=value.split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  const grid=Array.from({length:cells},(_,r)=>Array.from({length:cells},(_,c)=>{
    if((r<4&&c<4)||(r<4&&c>cells-5)||(r>cells-5&&c<4)) return true;
    return ((seed*(r*17+c*13+7))%3===0);
  }));
  return(
    <svg width={size} height={size} style={{borderRadius:8,background:"#fff",padding:4}}>
      {grid.map((row,r)=>row.map((on,c)=>on&&<rect key={`${r}-${c}`} x={c*cell} y={r*cell} width={cell} height={cell} fill="#0D1B3E"/>))}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SEAT MAP
// ═══════════════════════════════════════════════════════════════════════
const SeatMap = ({capacity=14,bookedSeats=[],onSelect,selected=[]})=>{
  const rows=Math.ceil((capacity-1)/3);
  return(
    <div style={{background:C.surface,border:`1px solid ${C.navyBorder}`,borderRadius:16,padding:20,maxWidth:280}}>
      <div style={{textAlign:"center",fontSize:11,color:C.textMuted,letterSpacing:1,marginBottom:12,textTransform:"uppercase"}}>Front</div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
        <div style={{width:44,height:36,background:C.navyLight,border:`1px solid ${C.navyBorder}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🚗</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {Array.from({length:rows},(_,r)=>(
          <div key={r} style={{display:"flex",gap:8,justifyContent:"center"}}>
            {[0,1,null,2].map((c,i)=>{
              if(c===null) return <div key="aisle" style={{width:20}}/>;
              const n=r*3+c+1;
              if(n>capacity-1) return <div key={n} style={{width:44}}/>;
              const isBooked=bookedSeats.includes(n), isSel=selected.includes(n);
              return(
                <div key={n} onClick={()=>!isBooked&&onSelect&&onSelect(n)}
                  style={{width:44,height:36,background:isSel?C.amber:isBooked?C.red+"33":C.navyLight,border:`1.5px solid ${isSel?C.amber:isBooked?C.red:C.navyBorder}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:isSel?"#0D1B3E":isBooked?C.red:C.textSecondary,cursor:isBooked?"not-allowed":"pointer",transition:"all .15s"}}>
                  {n}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:14,marginTop:14,fontSize:11,color:C.textMuted,flexWrap:"wrap"}}>
        <span style={{color:C.amber}}>■ Selected</span>
        <span style={{color:C.red}}>■ Booked</span>
        <span style={{color:C.navyBorder}}>■ Free</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// COUNTDOWN TIMER COMPONENT
// ═══════════════════════════════════════════════════════════════════════
const CountdownTimer = ({departure})=>{
  const {str,urgent,boarding,mins}=useCountdown(departure);
  if(str==="Departed") return <span style={{color:C.textMuted,fontSize:13}}>Departed</span>;
  return(
    <div>
      {boarding&&(
        <div style={{fontSize:11,color:C.orange,fontWeight:700,animation:"pulse 1s infinite",marginBottom:2}}>
          🔴 Boarding Soon
        </div>
      )}
      <div className={urgent?"pulse-timer ral":""} style={{
        fontFamily:"'Raleway',sans-serif",fontWeight:800,fontSize:urgent?20:18,
        color:boarding?C.orange:urgent?C.amber:C.white,
        letterSpacing:2,
      }}>
        {str}
      </div>
      <div style={{fontSize:10,color:C.textMuted,marginTop:2}}>until departure</div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// TRIP CARD (homepage)
// ═══════════════════════════════════════════════════════════════════════
const TripCard = ({trip,onBook,i=0})=>{
  const route=getRoute(trip.route_id);
  const {urgent,boarding}=useCountdown(trip.departure_time);
  const pct=Math.round(((trip.capacity-trip.seats_available)/trip.capacity)*100);
  const isFull=trip.seats_available===0;

  return(
    <div className={urgent&&!isFull?"urgent-card":""} style={{
      background:isFull?C.navyLight:C.card,
      border:`1.5px solid ${boarding?C.orange:urgent?C.amber+"66":C.navyBorder}`,
      borderRadius:18,padding:22,animation:`fadeUp ${.25+i*.08}s ease`,
      transition:"all .2s",position:"relative",overflow:"hidden",
    }}
    onMouseEnter={e=>{if(!isFull){e.currentTarget.style.borderColor=C.amber;e.currentTarget.style.transform="translateY(-3px)";}}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor=boarding?C.orange:urgent?C.amber+"66":C.navyBorder;e.currentTarget.style.transform="translateY(0)";}}>
      {boarding&&!isFull&&(
        <div style={{position:"absolute",top:0,right:0,background:`linear-gradient(135deg,${C.orange},${C.amberDark})`,color:"#fff",fontSize:10,fontWeight:800,padding:"4px 12px",borderRadius:"0 16px 0 10px",letterSpacing:".5px"}}>
          BOARDING SOON
        </div>
      )}
      {isFull&&(
        <div style={{position:"absolute",top:0,right:0,background:C.red,color:"#fff",fontSize:10,fontWeight:800,padding:"4px 12px",borderRadius:"0 16px 0 10px"}}>
          FULLY BOOKED
        </div>
      )}
      <div style={{marginBottom:14}}>
        <div className="ral" style={{fontWeight:800,fontSize:20,letterSpacing:"-0.5px"}}>{route.origin} → {route.destination}</div>
        <div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{trip.vehicle_reg} · {Math.floor(route.duration_minutes/60)}h {route.duration_minutes%60}m journey</div>
      </div>
      <div style={{display:"flex",gap:20,alignItems:"flex-start",marginBottom:16,flexWrap:"wrap"}}>
        <div>
          <div style={{fontSize:11,color:C.textMuted,marginBottom:2}}>DEPARTURE</div>
          <div className="ral" style={{fontWeight:800,fontSize:22,color:C.amber}}>{formatTime(trip.departure_time)}</div>
        </div>
        <div>
          <div style={{fontSize:11,color:C.textMuted,marginBottom:2}}>COUNTDOWN</div>
          <CountdownTimer departure={trip.departure_time}/>
        </div>
        <div>
          <div style={{fontSize:11,color:C.textMuted,marginBottom:2}}>FARE</div>
          <div className="ral" style={{fontWeight:800,fontSize:18,color:C.green}}>{formatUGX(route.price)}</div>
        </div>
      </div>
      {/* Seat bar */}
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textMuted,marginBottom:5}}>
          <span>{isFull?"No seats available":`${trip.seats_available} seats remaining`}</span>
          <span>{pct}% full</span>
        </div>
        <div style={{height:5,background:C.navyLight,borderRadius:3}}>
          <div style={{width:`${pct}%`,height:"100%",background:isFull?C.red:pct>80?C.orange:pct>50?C.amber:C.green,borderRadius:3,transition:"width .5s"}}/>
        </div>
      </div>
      {isFull?(
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn onClick={()=>onBook(trip,"next")} style={{flex:1,padding:"9px 12px",fontSize:12}}>Book Next Van</Btn>
          <Btn onClick={()=>onBook(null,"all")} variant="navy" style={{flex:1,padding:"9px 12px",fontSize:12}}>All Trips →</Btn>
        </div>
      ):(
        <Btn onClick={()=>onBook(trip)} style={{width:"100%",padding:"11px",fontSize:14}}>
          🎫 BOOK NOW
        </Btn>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════════════════════════
const StatCard = ({label,value,icon,color=C.amber,sub})=>(
  <div style={{background:C.card,border:`1px solid ${C.navyBorder}`,borderRadius:16,padding:20,flex:1,minWidth:160}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
      <span style={{fontSize:24}}>{icon}</span>
      <span className="ral" style={{fontSize:22,fontWeight:800,color}}>{value}</span>
    </div>
    <div style={{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:".5px"}}>{label}</div>
    {sub&&<div style={{fontSize:11,color:C.green,marginTop:3}}>{sub}</div>}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// STAR RATING
// ═══════════════════════════════════════════════════════════════════════
const Stars = ({rating,onChange,size=18})=>(
  <div style={{display:"flex",gap:3}}>
    {[1,2,3,4,5].map(s=>(
      <span key={s} onClick={()=>onChange&&onChange(s)}
        style={{fontSize:size,cursor:onChange?"pointer":"default",color:s<=rating?C.amber:C.navyBorder,transition:"color .15s"}}>★</span>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════
const Nav = ({page,setPage})=>{
  const links=[
    {id:"home",label:"Home"},
    {id:"schedule",label:"Schedule"},
    {id:"book",label:"Book Now"},
    {id:"parcel",label:"Courier"},
    {id:"safety",label:"Safety"},
    {id:"faq",label:"FAQ"},
  ];
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:C.navy+"ee",backdropFilter:"blur(14px)",borderBottom:`1px solid ${C.navyBorder}`}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div onClick={()=>setPage("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🚐</div>
          <div>
            <div className="ral" style={{fontWeight:900,fontSize:17,letterSpacing:"-0.5px",lineHeight:1}}>
              RAYLANE<span style={{color:C.amber}}>EXPRESS</span>
            </div>
            <div style={{fontSize:9,color:C.textMuted,letterSpacing:2}}>TRANSPORT SERVICES</div>
          </div>
        </div>
        <div style={{display:"flex",gap:2,alignItems:"center",flexWrap:"wrap"}}>
          {links.map(l=>(
            <button key={l.id} onClick={()=>setPage(l.id)}
              style={{background:page===l.id?C.amber+"22":"transparent",color:page===l.id?C.amber:C.textSecondary,border:page===l.id?`1px solid ${C.amber}44`:"1px solid transparent",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:13,fontFamily:"'Nunito',sans-serif",fontWeight:600,transition:"all .2s"}}>
              {l.label}
            </button>
          ))}
          {/* Hidden admin — no button shown in nav; accessed via URL-like state */}
          <div style={{width:1,height:20,background:C.navyBorder,margin:"0 6px"}}/>
          <Btn onClick={()=>setPage("login")} variant="navy" style={{padding:"7px 16px",fontSize:12}}>Login</Btn>
        </div>
      </div>
    </nav>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PAGE: HOME
// ═══════════════════════════════════════════════════════════════════════
const HomePage = ({setPage,setPreselectedTrip})=>{
  const [feedbackList,setFeedbackList]=useState(INITIAL_FEEDBACK);

  const handleBook = (trip,mode)=>{
    if(mode==="all"){ setPage("schedule"); return; }
    if(mode==="next"){
      const route=getRoute(trip.route_id);
      const nextTrip=TRIPS.find(t=>t.route_id===route.id&&t.seats_available>0&&t.id!==trip.id);
      if(nextTrip){ setPreselectedTrip(nextTrip); setPage("book"); return; }
      setPage("schedule"); return;
    }
    setPreselectedTrip(trip);
    setPage("book");
  };

  const approvedFeedback=feedbackList.filter(f=>f.status==="approved");

  return(
    <div style={{minHeight:"100vh",paddingTop:64}}>
      {/* HERO */}
      <div style={{position:"relative",background:`linear-gradient(150deg,${C.navy} 0%,${C.navyMid} 50%,${C.navy} 100%)`,padding:"80px 20px 60px",overflow:"hidden",minHeight:480,display:"flex",alignItems:"center"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle at 15% 50%,${C.amber}0A 0%,transparent 55%),radial-gradient(circle at 85% 30%,${C.blue}0A 0%,transparent 50%)`}}/>
        {/* Decorative circle */}
        <div style={{position:"absolute",right:-100,top:"50%",transform:"translateY(-50%)",width:500,height:500,borderRadius:"50%",border:`2px solid ${C.navyBorder}`,opacity:.4,pointerEvents:"none"}}/>
        <div style={{position:"absolute",right:-50,top:"50%",transform:"translateY(-50%)",width:350,height:350,borderRadius:"50%",border:`2px solid ${C.navyBorder}`,opacity:.3,pointerEvents:"none"}}/>
        <div style={{maxWidth:1200,margin:"0 auto",position:"relative",width:"100%"}}>
          <div style={{maxWidth:640,animation:"fadeUp .5s ease"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:C.green+"22",border:`1px solid ${C.green}44`,borderRadius:20,padding:"5px 14px",marginBottom:20,fontSize:12,color:C.green,fontWeight:700}}>
              <span className="live-dot"/> Live · {TRIPS.filter(t=>t.seats_available>0).length} trips available today
            </div>
            <h1 className="ral" style={{fontSize:"clamp(40px,6vw,72px)",fontWeight:900,lineHeight:1.05,letterSpacing:"-2px",marginBottom:20}}>
              Travel Across<br/>
              <span style={{color:C.amber}}>Uganda</span> With<br/>Confidence
            </h1>
            <p style={{fontSize:15,color:C.textSecondary,maxWidth:460,lineHeight:1.8,marginBottom:32}}>
              Fast, reliable transport from Kampala to every corner of Uganda. Book your seat in under 2 minutes.
            </p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:32}}>
              <Btn onClick={()=>setPage("book")} style={{fontSize:15,padding:"14px 30px"}}>🎫 Book Your Ride</Btn>
              <Btn onClick={()=>setPage("hire")} variant="navy" style={{fontSize:15,padding:"14px 28px",border:`1px solid ${C.navyBorder}`}}>🚐 Hire a Van</Btn>
              <Btn onClick={()=>setPage("schedule")} variant="navy" style={{fontSize:15,padding:"14px 28px",border:`1px solid ${C.navyBorder}`}}>📋 Explore Destinations</Btn>
            </div>
            <div style={{display:"flex",gap:20,fontSize:13,color:C.textMuted,flexWrap:"wrap"}}>
              {[["💳","MTN & Airtel Money"],["💬","WhatsApp receipt"],["📦","Courier service"]].map(([ic,label])=>(
                <span key={label} style={{display:"flex",alignItems:"center",gap:6}}><span>{ic}</span>{label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S DEPARTURES BAR */}
      <div style={{background:C.navyMid,borderBottom:`1px solid ${C.navyBorder}`,padding:"12px 20px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:16}}>🗓️</span>
            <span className="ral" style={{fontWeight:800,color:C.amber,fontSize:15}}>Today's Departures</span>
            <span style={{color:C.textMuted,fontSize:13}}>— {TRIPS.length} trips scheduled</span>
          </div>
          <Btn onClick={()=>setPage("schedule")} variant="navy" style={{padding:"6px 16px",fontSize:12,border:`1px solid ${C.navyBorder}`}}>Full Schedule →</Btn>
        </div>
      </div>

      {/* TRIP CARDS */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"32px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:18}}>
          {TRIPS.map((trip,i)=>(
            <TripCard key={trip.id} trip={trip} i={i} onBook={handleBook}/>
          ))}
        </div>
      </div>

      {/* WHY RAYLANE */}
      <div style={{background:C.navyMid,borderTop:`1px solid ${C.navyBorder}`,borderBottom:`1px solid ${C.navyBorder}`}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"48px 20px"}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <h2 className="ral" style={{fontSize:30,fontWeight:800,marginBottom:8}}>Why Choose Raylane Express?</h2>
            <p style={{color:C.textMuted,fontSize:14}}>Uganda's most trusted intercity transport service</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:20}}>
            {[
              {icon:"🛡️",title:"Safety First",desc:"Every trip follows strict safety protocols. Your well-being is our priority."},
              {icon:"⚡",title:"Fast Booking",desc:"Book your seat in under 2 minutes with instant WhatsApp confirmation."},
              {icon:"💺",title:"Comfortable Rides",desc:"Modern, air-conditioned vehicles for your comfort on every journey."},
              {icon:"💳",title:"Mobile Money",desc:"Pay securely via MTN or Airtel Money. No cash hassles at the terminal."},
            ].map(f=>(
              <Card key={f.title} style={{textAlign:"center"}}>
                <div style={{fontSize:36,marginBottom:12}}>{f.icon}</div>
                <div className="ral" style={{fontWeight:700,fontSize:16,marginBottom:8}}>{f.title}</div>
                <p style={{fontSize:13,color:C.textMuted,lineHeight:1.7}}>{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"48px 20px"}}>
        <h2 className="ral" style={{fontSize:28,fontWeight:800,marginBottom:6}}>Our Routes</h2>
        <p style={{color:C.textMuted,fontSize:13,marginBottom:24}}>Daily departures from Kampala</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12}}>
          {ROUTES.map(r=>(
            <div key={r.id} onClick={()=>setPage("book")} style={{background:C.card,border:`1px solid ${C.navyBorder}`,borderRadius:14,padding:"16px 18px",cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.amber+"66";e.currentTarget.style.background=C.cardHover;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.navyBorder;e.currentTarget.style.background=C.card;}}>
              <div style={{fontSize:12,color:C.textMuted,marginBottom:3}}>Kampala →</div>
              <div className="ral" style={{fontWeight:800,fontSize:18,marginBottom:8}}>{r.destination}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:C.amber,fontWeight:700,fontSize:14}}>{formatUGX(r.price)}</span>
                <span style={{color:C.textMuted,fontSize:11}}>{Math.floor(r.duration_minutes/60)}h {r.duration_minutes%60}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOMER FEEDBACK */}
      <div style={{background:C.navyMid,borderTop:`1px solid ${C.navyBorder}`,borderBottom:`1px solid ${C.navyBorder}`}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"52px 20px"}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <h2 className="ral" style={{fontSize:30,fontWeight:800,marginBottom:8}}>What Passengers Say</h2>
            <p style={{color:C.textMuted,fontSize:14}}>Real experiences from our customers</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:18,marginBottom:36}}>
            {approvedFeedback.map((f,i)=>(
              <Card key={f.id} style={{animation:`fadeUp ${.2+i*.08}s ease`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div>
                    <div className="ral" style={{fontWeight:700,fontSize:15}}>{f.name}</div>
                    <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{f.route} · {f.date}</div>
                  </div>
                  <Stars rating={f.rating} size={14}/>
                </div>
                <p style={{fontSize:13,color:C.textSecondary,lineHeight:1.7,fontStyle:"italic"}}>"{f.message}"</p>
              </Card>
            ))}
          </div>
          {/* Submit feedback */}
          <FeedbackForm/>
        </div>
      </div>

      {/* FAQ PREVIEW */}
      <div style={{maxWidth:800,margin:"0 auto",padding:"52px 20px"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <h2 className="ral" style={{fontSize:28,fontWeight:800,marginBottom:8}}>Frequently Asked Questions</h2>
          <p style={{color:C.textMuted,fontSize:14}}>Quick answers to common questions</p>
        </div>
        {FAQ_DATA.slice(0,4).map((f,i)=><FAQItem key={i} f={f}/>)}
        <div style={{textAlign:"center",marginTop:24}}>
          <Btn onClick={()=>setPage("faq")} variant="navy" style={{border:`1px solid ${C.navyBorder}`,padding:"10px 28px"}}>View All FAQs →</Btn>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:C.navyMid,borderTop:`1px solid ${C.navyBorder}`,padding:"40px 20px 20px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:32,marginBottom:32}}>
            <div>
              <div className="ral" style={{fontWeight:900,fontSize:16,marginBottom:14}}>RAYLANE<span style={{color:C.amber}}>EXPRESS</span></div>
              <p style={{fontSize:13,color:C.textMuted,lineHeight:1.8}}>Safe, reliable transport across Uganda since 2018.</p>
            </div>
            {[
              {title:"Services",links:["Book a Seat","Hire a Van","Courier/Parcel","Plan Journey"]},
              {title:"Support",  links:["Safety Guidelines","FAQ","Contact Us","Lost & Found"]},
              {title:"Contact",  links:["+256 700 000000","info@raylane.ug","Nakasero, Kampala","Mon–Sun 5AM–10PM"]},
            ].map(col=>(
              <div key={col.title}>
                <div className="ral" style={{fontWeight:800,fontSize:12,letterSpacing:".5px",color:C.amber,marginBottom:14}}>{col.title}</div>
                {col.links.map(l=><div key={l} style={{fontSize:13,color:C.textMuted,marginBottom:8,cursor:"pointer"}}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{borderTop:`1px solid ${C.navyBorder}`,paddingTop:18,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,fontSize:12,color:C.textMuted}}>
            <span>© 2026 Raylane Express Ltd. All rights reserved.</span>
            <span>Privacy Policy · Terms of Service · Refund Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// FEEDBACK FORM COMPONENT
// ═══════════════════════════════════════════════════════════════════════
const FeedbackForm = ()=>{
  const [form,setForm]=useState({name:"",route:"",rating:5,message:""});
  const [submitted,setSubmitted]=useState(false);

  const handleSubmit=()=>{
    if(!form.name||!form.message) return;
    setSubmitted(true);
  };

  if(submitted) return(
    <Card style={{maxWidth:560,margin:"0 auto",textAlign:"center",border:`1px solid ${C.green}44`,background:C.green+"11"}}>
      <div style={{fontSize:40,marginBottom:12}}>✅</div>
      <div className="ral" style={{fontWeight:800,fontSize:18,color:C.green,marginBottom:8}}>Thank You for Your Feedback!</div>
      <p style={{fontSize:13,color:C.textMuted,lineHeight:1.7}}>Your review has been submitted and is awaiting approval from our team. Once approved, it will appear on our website.</p>
    </Card>
  );

  return(
    <Card style={{maxWidth:560,margin:"0 auto",border:`1px solid ${C.amber}33`}}>
      <h3 className="ral" style={{fontWeight:800,fontSize:18,marginBottom:4}}>Share Your Experience</h3>
      <p style={{fontSize:13,color:C.textMuted,marginBottom:20}}>Your review will appear after approval from our team.</p>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Input label="Your Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Sarah Nakato"/>
        <Select label="Route Travelled" value={form.route} onChange={e=>setForm({...form,route:e.target.value})} options={[{value:"",label:"Select your route"},{value:"Kampala → Jinja",label:"Kampala → Jinja"},{value:"Kampala → Gulu",label:"Kampala → Gulu"},{value:"Kampala → Mbarara",label:"Kampala → Mbarara"},{value:"Kampala → Mbale",label:"Kampala → Mbale"},{value:"Kampala → Fort Portal",label:"Kampala → Fort Portal"},{value:"Kampala → Arua",label:"Kampala → Arua"}]}/>
        <div>
          <label style={{fontSize:11,color:C.textSecondary,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase",display:"block",marginBottom:8}}>Rating</label>
          <Stars rating={form.rating} onChange={r=>setForm({...form,rating:r})} size={28}/>
        </div>
        <Textarea label="Your Review" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell us about your journey experience..."/>
        <p style={{fontSize:11,color:C.textMuted,background:C.navyLight,borderRadius:8,padding:"8px 12px"}}>
          🔒 Reviews are moderated before publishing to ensure quality.
        </p>
        <Btn onClick={handleSubmit} disabled={!form.name||!form.message} style={{padding:"12px"}}>Submit Review</Btn>
      </div>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// FAQ ITEM
// ═══════════════════════════════════════════════════════════════════════
const FAQItem = ({f})=>{
  const [open,setOpen]=useState(false);
  return(
    <div style={{border:`1px solid ${open?C.amber+"44":C.navyBorder}`,borderRadius:12,marginBottom:10,overflow:"hidden",transition:"all .2s"}}>
      <div onClick={()=>setOpen(!open)} style={{padding:"16px 18px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:open?C.amber+"11":C.card,transition:"background .2s"}}>
        <span style={{fontWeight:600,fontSize:14}}>{f.q}</span>
        <span style={{color:C.amber,fontWeight:800,fontSize:18,transition:"transform .2s",transform:open?"rotate(45deg)":"rotate(0)"}}>{open?"×":"+"}</span>
      </div>
      {open&&(
        <div style={{padding:"0 18px 16px",background:C.card,fontSize:13,color:C.textSecondary,lineHeight:1.8,animation:"fadeUp .2s ease"}}>
          {f.a}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PAGE: SCHEDULE
// ═══════════════════════════════════════════════════════════════════════
const SchedulePage = ({setPage,setPreselectedTrip})=>{
  const [filter,setFilter]=useState("all");
  const destinations=["all",...new Set(ROUTES.map(r=>r.destination))];
  const filtered=TRIPS.filter(t=>filter==="all"||getRoute(t.route_id).destination===filter);
  return(
    <div style={{minHeight:"100vh",paddingTop:80,maxWidth:1000,margin:"0 auto",padding:"80px 20px 40px"}}>
      <div style={{marginBottom:28}}>
        <h1 className="ral" style={{fontSize:32,fontWeight:800}}>Trip Schedule</h1>
        <p style={{color:C.textMuted,marginTop:4}}>All departures from Kampala · Live countdown timers</p>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
        {destinations.map(d=>(
          <button key={d} onClick={()=>setFilter(d)} style={{background:filter===d?C.amber:C.card,color:filter===d?"#0D1B3E":C.textSecondary,border:`1px solid ${filter===d?C.amber:C.navyBorder}`,borderRadius:8,padding:"7px 16px",cursor:"pointer",fontSize:13,fontWeight:filter===d?800:400,fontFamily:"'Raleway',sans-serif",transition:"all .2s"}}>
            {d==="all"?"All Routes":d}
          </button>
        ))}
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:C.navyMid,borderBottom:`1px solid ${C.navyBorder}`}}>
              {["Route","Departure","Countdown","Seats","Fare","Status",""].map(h=>(
                <th key={h} style={{padding:"14px 16px",textAlign:"left",fontSize:11,color:C.textMuted,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(trip=>{
                const route=getRoute(trip.route_id);
                const {str,urgent,boarding}=useCountdown(trip.departure_time);
                const isFull=trip.seats_available===0;
                return(
                  <tr key={trip.id} style={{borderBottom:`1px solid ${C.navyBorder}`,background:boarding&&!isFull?C.orange+"08":"transparent",transition:"background .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.navyMid}
                    onMouseLeave={e=>e.currentTarget.style.background=boarding&&!isFull?C.orange+"08":"transparent"}>
                    <td style={{padding:"14px 16px"}}>
                      <div className="ral" style={{fontWeight:700}}>{route.origin} → {route.destination}</div>
                    </td>
                    <td style={{padding:"14px 16px"}}>
                      <div className="ral" style={{fontWeight:800,color:C.amber,fontSize:18}}>{formatTime(trip.departure_time)}</div>
                    </td>
                    <td style={{padding:"14px 16px"}}>
                      <span className="ral" style={{fontWeight:800,color:boarding?C.orange:urgent?C.amber:C.white,fontSize:15}}>{str}</span>
                      {boarding&&<div style={{fontSize:10,color:C.orange}}>Boarding Soon!</div>}
                    </td>
                    <td style={{padding:"14px 16px"}}>
                      <span style={{color:isFull?C.red:trip.seats_available<5?C.orange:C.green,fontWeight:700}}>{isFull?"FULL":trip.seats_available}</span>
                    </td>
                    <td style={{padding:"14px 16px"}}><span className="ral" style={{fontWeight:700,color:C.amber}}>{formatUGX(route.price)}</span></td>
                    <td style={{padding:"14px 16px"}}><StatusBadge status={trip.status}/></td>
                    <td style={{padding:"14px 16px"}}>
                      {isFull?(
                        <Btn variant="navy" style={{padding:"6px 12px",fontSize:11,border:`1px solid ${C.navyBorder}`}}>Next Van</Btn>
                      ):(
                        <Btn onClick={()=>{setPreselectedTrip(trip);setPage("book");}} style={{padding:"7px 16px",fontSize:12}}>Book</Btn>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PAGE: BOOKING
// ═══════════════════════════════════════════════════════════════════════
const BookingPage = ({preselectedTrip})=>{
  const [step,setStep]=useState(preselectedTrip?2:1);
  const [selectedTrip,setSelectedTrip]=useState(preselectedTrip||null);
  const [selectedSeats,setSelectedSeats]=useState([]);
  const [form,setForm]=useState({name:"",phone:"",email:"",accessibility:false,assistanceDetail:""});
  const [confirmed,setConfirmed]=useState(null);
  const bookedSeats=[2,5,8,11];

  useEffect(()=>{ if(preselectedTrip){ setSelectedTrip(preselectedTrip); setStep(2); } },[preselectedTrip]);

  const handleBook=()=>{
    const code="RX-"+Math.floor(1000+Math.random()*9000);
    const route=getRoute(selectedTrip.route_id);
    setConfirmed({code,passenger:form.name,phone:form.phone,route:`${route.origin} → ${route.destination}`,seats:selectedSeats,departure:formatTime(selectedTrip.departure_time),amount:route.price*selectedSeats.length,vehicle:selectedTrip.vehicle_reg});
    setStep(4);
  };

  const TERMS=[
    "Passengers must arrive at least 20 minutes before departure.",
    "Each passenger is entitled to 10kg of luggage free of charge.",
    "Extra luggage beyond 10kg may incur additional charges.",
    "Raylane Express is not responsible for valuables not declared to staff.",
    "Tickets are valid only for the scheduled trip unless rescheduled through the office.",
  ];

  return(
    <div style={{minHeight:"100vh",paddingTop:80,maxWidth:900,margin:"0 auto",padding:"80px 20px 40px"}}>
      <div style={{marginBottom:32}}>
        <h1 className="ral" style={{fontSize:32,fontWeight:800}}>Book Your Seat</h1>
        <div style={{display:"flex",gap:0,marginTop:20,alignItems:"center",flexWrap:"wrap"}}>
          {["Select Trip","Choose Seats","Your Details","Confirmed"].map((s,i)=>(
            <div key={s} style={{display:"flex",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:step>i+1?C.green:step===i+1?C.amber:C.card,border:`2px solid ${step>i+1?C.green:step===i+1?C.amber:C.navyBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:step>=i+1?"#0D1B3E":C.textMuted,transition:"all .3s"}}>
                  {step>i+1?"✓":i+1}
                </div>
                <span style={{fontSize:13,color:step===i+1?C.white:C.textMuted,fontWeight:step===i+1?700:400}}>{s}</span>
              </div>
              {i<3&&<div style={{width:36,height:1,background:step>i+1?C.green:C.navyBorder,margin:"0 8px",transition:"background .3s"}}/>}
            </div>
          ))}
        </div>
      </div>

      {/* Luggage policy banner */}
      <div style={{background:C.amber+"11",border:`1px solid ${C.amber}44`,borderRadius:10,padding:"10px 16px",marginBottom:24,fontSize:13,color:C.amber,display:"flex",alignItems:"center",gap:8}}>
        🧳 <strong>Luggage Policy:</strong> 10kg free per passenger. Additional weight charges apply.
      </div>

      {step===1&&(
        <div style={{animation:"fadeUp .3s ease"}}>
          <div style={{display:"grid",gap:12}}>
            {TRIPS.map(trip=>{
              const route=getRoute(trip.route_id);
              const isFull=trip.seats_available===0;
              const isSelected=selectedTrip?.id===trip.id;
              return(
                <div key={trip.id} onClick={()=>!isFull&&setSelectedTrip(trip)} style={{background:C.card,border:`2px solid ${isSelected?C.amber:isFull?C.red+"33":C.navyBorder}`,borderRadius:16,padding:"18px 20px",cursor:isFull?"not-allowed":"pointer",transition:"all .2s",opacity:isFull?.6:1,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                  <div>
                    <div className="ral" style={{fontWeight:800,fontSize:18}}>{route.origin} → {route.destination}</div>
                    <div style={{color:C.textMuted,fontSize:12,marginTop:2}}>{trip.vehicle_reg}</div>
                    {isFull&&<span style={{fontSize:11,color:C.red,fontWeight:700}}>● Fully Booked</span>}
                  </div>
                  <div style={{display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:11,color:C.textMuted}}>Departs</div>
                      <div className="ral" style={{fontWeight:800,fontSize:22,color:C.amber}}>{formatTime(trip.departure_time)}</div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:11,color:C.textMuted}}>Seats</div>
                      <div style={{fontWeight:700,fontSize:16,color:isFull?C.red:C.green}}>{isFull?"FULL":trip.seats_available}</div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:11,color:C.textMuted}}>Fare</div>
                      <div className="ral" style={{fontWeight:700,fontSize:16,color:C.amber}}>{formatUGX(route.price)}</div>
                    </div>
                    {isSelected&&<div style={{width:24,height:24,borderRadius:"50%",background:C.amber,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#0D1B3E"}}>✓</div>}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:20}}>
            <Btn onClick={()=>setStep(2)} disabled={!selectedTrip}>Next: Choose Seats →</Btn>
          </div>
        </div>
      )}

      {step===2&&selectedTrip&&(
        <div style={{animation:"fadeUp .3s ease"}}>
          <div style={{display:"flex",gap:28,flexWrap:"wrap"}}>
            <div>
              <h3 className="ral" style={{fontWeight:800,marginBottom:14}}>Select Your Seats</h3>
              <SeatMap capacity={14} bookedSeats={bookedSeats} selected={selectedSeats} onSelect={n=>setSelectedSeats(prev=>prev.includes(n)?prev.filter(s=>s!==n):[...prev,n])}/>
            </div>
            <div style={{flex:1,minWidth:200}}>
              <Card>
                <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Summary</h3>
                {(()=>{const r=getRoute(selectedTrip.route_id);return(
                  <>
                    <div style={{borderBottom:`1px solid ${C.navyBorder}`,paddingBottom:14,marginBottom:14}}>
                      <div className="ral" style={{fontWeight:800,fontSize:17}}>{r.origin} → {r.destination}</div>
                      <div style={{color:C.textMuted,fontSize:13,marginTop:4}}>{formatDate(selectedTrip.departure_time)} · {formatTime(selectedTrip.departure_time)}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                        <span style={{color:C.textMuted}}>Seats selected</span>
                        <span style={{fontWeight:700,color:C.amber}}>{selectedSeats.length>0?selectedSeats.join(", "):"—"}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                        <span style={{color:C.textMuted}}>Per seat</span>
                        <span>{formatUGX(r.price)}</span>
                      </div>
                      <div style={{borderTop:`1px solid ${C.navyBorder}`,paddingTop:8,display:"flex",justifyContent:"space-between"}}>
                        <span className="ral" style={{fontWeight:800}}>Total</span>
                        <span className="ral" style={{fontWeight:800,fontSize:18,color:C.green}}>{formatUGX(r.price*selectedSeats.length)}</span>
                      </div>
                    </div>
                  </>
                );})()}
              </Card>
            </div>
          </div>
          <div style={{display:"flex",gap:12,justifyContent:"flex-end",marginTop:20}}>
            <Btn onClick={()=>setStep(1)} variant="navy" style={{border:`1px solid ${C.navyBorder}`}}>← Back</Btn>
            <Btn onClick={()=>setStep(3)} disabled={selectedSeats.length===0}>Next: Your Details →</Btn>
          </div>
        </div>
      )}

      {step===3&&(
        <div style={{animation:"fadeUp .3s ease"}}>
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <Card>
              <h3 className="ral" style={{fontWeight:800,marginBottom:20}}>Passenger Information</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div style={{gridColumn:"1 / -1"}}><Input label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Sarah Nakato"/></div>
                <Input label="Phone Number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+256 7XX XXX XXX"/>
                <Input label="Email (optional)" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@example.com"/>
              </div>
              {/* Accessibility */}
              <div style={{marginTop:18,padding:16,background:C.navyMid,borderRadius:12,border:`1px solid ${C.navyBorder}`}}>
                <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:14}}>
                  <input type="checkbox" checked={form.accessibility} onChange={e=>setForm({...form,accessibility:e.target.checked})}
                    style={{width:18,height:18,accentColor:C.amber,cursor:"pointer"}}/>
                  <span style={{fontWeight:600}}>I have a disability or require assistance during boarding</span>
                </label>
                {form.accessibility&&(
                  <div style={{marginTop:12,animation:"fadeUp .2s ease"}}>
                    <Input label="Please describe the assistance required" value={form.assistanceDetail} onChange={e=>setForm({...form,assistanceDetail:e.target.value})} placeholder="e.g. Wheelchair assistance, Elderly boarding, Visual impairment support"/>
                  </div>
                )}
              </div>
            </Card>
            <Card>
              <h3 className="ral" style={{fontWeight:800,marginBottom:16}}>Payment Method</h3>
              <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
                {["Mobile Money","Card","Cash at Terminal"].map((m,i)=>(
                  <div key={m} style={{flex:1,minWidth:100,background:i===0?C.amber+"22":C.navyMid,border:`1.5px solid ${i===0?C.amber:C.navyBorder}`,borderRadius:10,padding:12,textAlign:"center",cursor:"pointer",fontSize:13,fontWeight:i===0?700:400,color:i===0?C.amber:C.textMuted}}>{m}</div>
                ))}
              </div>
              <Input label="MTN/Airtel Number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+256 7XX XXX XXX"/>
              <p style={{fontSize:12,color:C.textMuted,marginTop:10}}>Your QR boarding pass will be sent to your WhatsApp after payment confirmation.</p>
            </Card>
            {/* Terms */}
            <Card style={{background:C.navyLight}}>
              <h3 className="ral" style={{fontWeight:700,marginBottom:12,fontSize:14}}>Travel Terms & Conditions</h3>
              {TERMS.map((t,i)=>(
                <div key={i} style={{display:"flex",gap:10,fontSize:12,color:C.textMuted,marginBottom:8}}>
                  <span style={{color:C.amber,fontWeight:800,minWidth:18}}>{i+1}.</span><span>{t}</span>
                </div>
              ))}
            </Card>
          </div>
          <div style={{display:"flex",gap:12,justifyContent:"flex-end",marginTop:20}}>
            <Btn onClick={()=>setStep(2)} variant="navy" style={{border:`1px solid ${C.navyBorder}`}}>← Back</Btn>
            <Btn onClick={handleBook} disabled={!form.name||!form.phone}>Confirm & Pay →</Btn>
          </div>
        </div>
      )}

      {step===4&&confirmed&&(
        <div style={{animation:"fadeUp .4s ease",textAlign:"center"}}>
          <div style={{fontSize:56,marginBottom:14}}>🎉</div>
          <h2 className="ral" style={{fontSize:28,fontWeight:900,marginBottom:8}}>Booking Confirmed!</h2>
          <p style={{color:C.textMuted,marginBottom:32}}>Ticket sent to {confirmed.phone} via WhatsApp</p>
          <div style={{maxWidth:440,margin:"0 auto"}}>
            <Card style={{textAlign:"left",border:`1px solid ${C.amber}44`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:16,marginBottom:16,borderBottom:`2px dashed ${C.navyBorder}`}}>
                <div>
                  <div style={{fontSize:11,color:C.textMuted,letterSpacing:1}}>BOOKING CODE</div>
                  <div className="ral" style={{fontWeight:900,fontSize:26,color:C.amber}}>{confirmed.code}</div>
                </div>
                <QRCode value={confirmed.code}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:16}}>
                {[["Passenger",confirmed.passenger],["Route",confirmed.route],["Departure",confirmed.departure],["Seats",confirmed.seats.join(", ")],["Vehicle",confirmed.vehicle],["Total Paid",formatUGX(confirmed.amount)]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                    <span style={{color:C.textMuted}}>{k}</span>
                    <span style={{fontWeight:700}}>{v}</span>
                  </div>
                ))}
              </div>
              {/* Terms on receipt */}
              <div style={{background:C.navyLight,borderRadius:8,padding:12,marginBottom:14}}>
                <div style={{fontSize:11,color:C.textMuted,fontWeight:700,marginBottom:6,letterSpacing:.5}}>TRAVEL TERMS</div>
                {["Arrive 20 minutes before departure.","10kg luggage free per passenger.","Ticket valid for scheduled trip only.","Keep valuables secured at all times.","QR code required for boarding."].map((t,i)=>(
                  <div key={i} style={{fontSize:11,color:C.textMuted,marginBottom:4}}>• {t}</div>
                ))}
              </div>
              <div style={{background:C.green+"22",border:`1px solid ${C.green}44`,borderRadius:10,padding:12,fontSize:12,color:C.green,textAlign:"center"}}>
                ✓ QR Boarding Pass sent via WhatsApp to {confirmed.phone}
              </div>
            </Card>
            <div style={{display:"flex",gap:12,marginTop:20,justifyContent:"center"}}>
              <Btn variant="navy" style={{fontSize:13,border:`1px solid ${C.navyBorder}`}}>Download PDF</Btn>
              <Btn onClick={()=>{setStep(1);setSelectedTrip(null);setSelectedSeats([]);setForm({name:"",phone:"",email:"",accessibility:false,assistanceDetail:""});setConfirmed(null);}} style={{fontSize:13}}>Book Another Trip</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PAGE: PARCEL
// ═══════════════════════════════════════════════════════════════════════
const ParcelPage = ()=>{
  const [form,setForm]=useState({sender:"",senderPhone:"",receiver:"",receiverPhone:"",destination:"",description:"",weight:""});
  const [tracking,setTracking]=useState("");
  const [trackResult,setTrackResult]=useState(null);
  const mockParcels=[
    {code:"RX-P001",status:"active",location:"Nakasero Terminal",updated:"10:30 AM"},
    {code:"RX-P002",status:"confirmed",location:"Gulu",updated:"Yesterday 3PM"},
  ];
  return(
    <div style={{minHeight:"100vh",paddingTop:80,maxWidth:900,margin:"0 auto",padding:"80px 20px 40px"}}>
      <h1 className="ral" style={{fontSize:32,fontWeight:800,marginBottom:6}}>Parcel & Courier</h1>
      <p style={{color:C.textMuted,marginBottom:28}}>Send parcels across Uganda with every trip</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <Card>
          <h3 className="ral" style={{fontWeight:800,fontSize:18,marginBottom:20}}>Send a Parcel</h3>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Input label="Sender Name" value={form.sender} onChange={e=>setForm({...form,sender:e.target.value})} placeholder="Your full name"/>
            <Input label="Sender Phone" value={form.senderPhone} onChange={e=>setForm({...form,senderPhone:e.target.value})} placeholder="+256 7XX XXX XXX"/>
            <Input label="Receiver Name" value={form.receiver} onChange={e=>setForm({...form,receiver:e.target.value})} placeholder="Receiver's name"/>
            <Input label="Receiver Phone" value={form.receiverPhone} onChange={e=>setForm({...form,receiverPhone:e.target.value})} placeholder="+256 7XX XXX XXX"/>
            <Select label="Destination" value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})} options={[{value:"",label:"Choose destination"},...ROUTES.map(r=>({value:r.destination,label:r.destination}))]}/>
            <Input label="Weight (kg)" type="number" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})} placeholder="e.g. 2.5"/>
            <Input label="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="What's inside?"/>
            <div style={{background:C.navyLight,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.textMuted}}>
              🧳 Up to 10kg free. Extra weight charged per kg.
            </div>
            <Btn style={{marginTop:4}}>Submit Parcel Booking</Btn>
          </div>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card>
            <h3 className="ral" style={{fontWeight:800,fontSize:18,marginBottom:14}}>Track Your Parcel</h3>
            <Input label="Parcel Code" value={tracking} onChange={e=>setTracking(e.target.value)} placeholder="e.g. RX-P001"/>
            <Btn onClick={()=>setTrackResult(mockParcels.find(p=>p.code.toLowerCase()===tracking.toLowerCase())||{code:tracking,status:"cancelled",location:"—",updated:"—"})} style={{marginTop:12,width:"100%"}}>Track →</Btn>
            {trackResult&&(
              <div style={{marginTop:14,background:C.navyMid,borderRadius:10,padding:14,animation:"fadeUp .3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span className="ral" style={{fontWeight:700}}>{trackResult.code}</span>
                  <StatusBadge status={trackResult.status}/>
                </div>
                <div style={{fontSize:13,color:C.textMuted}}>Location: {trackResult.location}</div>
                <div style={{fontSize:12,color:C.textMuted,marginTop:3}}>Updated: {trackResult.updated}</div>
              </div>
            )}
          </Card>
          <Card>
            <h3 className="ral" style={{fontWeight:700,fontSize:16,marginBottom:12}}>Pricing Guide</h3>
            {[["0–2 kg","UGX 5,000"],["2–5 kg","UGX 10,000"],["5–10 kg","UGX 18,000"],["10+ kg","Contact us"]].map(([w,p])=>(
              <div key={w} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.navyBorder}`,fontSize:13}}>
                <span style={{color:C.textMuted}}>{w}</span>
                <span style={{fontWeight:700,color:C.amber}}>{p}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PAGE: SAFETY
// ═══════════════════════════════════════════════════════════════════════
const SafetyPage = ()=>{
  const gs=[
    {icon:"🔒",title:"Protect Your Valuables",body:"Keep personal valuables such as phones, wallets, and documents secure at all times. Avoid displaying large sums of money or expensive items while boarding or during travel."},
    {icon:"🎒",title:"Keep Luggage Identified",body:"Label all luggage clearly with your name and contact details to help prevent confusion or loss. Keep a close eye on your belongings during boarding."},
    {icon:"📋",title:"Follow Boarding Instructions",body:"Follow instructions from the driver or transport staff during boarding and disembarking. This ensures an orderly and safe process for all passengers."},
    {icon:"💺",title:"Remain Seated During Travel",body:"Stay seated with seatbelts fastened where available and avoid distracting the driver while the vehicle is in motion."},
    {icon:"👁️",title:"Report Suspicious Activity",body:"Encourage reporting any suspicious behavior or safety concerns to the driver or Raylane Express staff immediately. Your awareness creates safety."},
    {icon:"🚨",title:"Emergency Situations",body:"In case of emergency: remain calm, follow driver instructions, and exit the vehicle safely when directed. Raylane Express cooperates with authorities to ensure safe operations."},
  ];
  return(
    <div style={{minHeight:"100vh",paddingTop:80,maxWidth:1000,margin:"0 auto",padding:"80px 20px 40px"}}>
      <div style={{textAlign:"center",marginBottom:48}}>
        <div style={{fontSize:52,marginBottom:14}}>🛡️</div>
        <h1 className="ral" style={{fontSize:36,fontWeight:900,marginBottom:10}}>Passenger Safety Guidelines</h1>
        <p style={{color:C.textMuted,maxWidth:500,margin:"0 auto",lineHeight:1.8}}>Your safety is our highest priority. Please read these guidelines before every journey with Raylane Express.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20,marginBottom:32}}>
        {gs.map((g,i)=>(
          <Card key={i} style={{animation:`fadeUp ${.15+i*.08}s ease`}}>
            <div style={{fontSize:34,marginBottom:12}}>{g.icon}</div>
            <h3 className="ral" style={{fontWeight:700,fontSize:16,marginBottom:10}}>{g.title}</h3>
            <p style={{fontSize:13,color:C.textMuted,lineHeight:1.8}}>{g.body}</p>
          </Card>
        ))}
      </div>
      <Card style={{background:C.amber+"11",borderColor:C.amber+"44",textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:8}}>📞</div>
        <h3 className="ral" style={{fontWeight:800,marginBottom:6}}>24/7 Safety Hotline</h3>
        <p style={{color:C.textMuted,fontSize:13}}><strong style={{color:C.amber}}>+256 700 000000</strong> · WhatsApp available · Available around the clock</p>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PAGE: FAQ
// ═══════════════════════════════════════════════════════════════════════
const FAQPage = ()=>(
  <div style={{minHeight:"100vh",paddingTop:80,maxWidth:760,margin:"0 auto",padding:"80px 20px 60px"}}>
    <div style={{textAlign:"center",marginBottom:40}}>
      <h1 className="ral" style={{fontSize:34,fontWeight:900,marginBottom:10}}>Frequently Asked Questions</h1>
      <p style={{color:C.textMuted,fontSize:14}}>Everything you need to know about travelling with Raylane Express</p>
    </div>
    {FAQ_DATA.map((f,i)=><FAQItem key={i} f={f}/>)}
    <Card style={{marginTop:28,textAlign:"center",background:C.amber+"11",border:`1px solid ${C.amber}44`}}>
      <h3 className="ral" style={{fontWeight:700,marginBottom:8}}>Still have questions?</h3>
      <p style={{fontSize:13,color:C.textMuted,marginBottom:14}}>Our support team is available Mon–Sun 5AM–10PM</p>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        <Btn style={{padding:"9px 20px",fontSize:13}}>📞 Call Us</Btn>
        <Btn variant="navy" style={{padding:"9px 20px",fontSize:13,border:`1px solid ${C.navyBorder}`}}>💬 WhatsApp</Btn>
      </div>
    </Card>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// ADMIN LOGIN (hidden — not linked in nav)
// ═══════════════════════════════════════════════════════════════════════
const AdminLogin = ({onLogin})=>{
  const [u,setU]=useState(""); const [p,setP]=useState(""); const [err,setErr]=useState(false);
  const handle=()=>{ if(u==="admin"&&p==="raylane2026"){onLogin();}else{setErr(true);} };
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.navy,padding:20}}>
      <div style={{maxWidth:380,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:52,height:52,background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px"}}>🚐</div>
          <div className="ral" style={{fontWeight:900,fontSize:20}}>RAYLANE<span style={{color:C.amber}}>EXPRESS</span></div>
          <div style={{fontSize:12,color:C.textMuted,marginTop:4,letterSpacing:1}}>ADMIN ACCESS</div>
        </div>
        <Card>
          <h2 className="ral" style={{fontWeight:800,marginBottom:20,textAlign:"center"}}>Sign In</h2>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Input label="Username" value={u} onChange={e=>setU(e.target.value)} placeholder="admin"/>
            <Input label="Password" type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="••••••••"/>
            {err&&<div style={{background:C.red+"22",border:`1px solid ${C.red}44`,borderRadius:8,padding:"9px 14px",fontSize:12,color:C.red}}>Invalid credentials. Please try again.</div>}
            <Btn onClick={handle} style={{padding:"12px",marginTop:4}}>Sign In →</Btn>
          </div>
          <p style={{fontSize:11,color:C.textMuted,textAlign:"center",marginTop:16}}>Restricted access. Authorised personnel only.</p>
        </Card>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
const AdminDashboard = ({onLogout})=>{
  const [section,setSection]=useState("overview");
  const [showAddTrip,setShowAddTrip]=useState(false);
  const [showAddVehicle,setShowAddVehicle]=useState(false);
  const [pendingFeedback,setPendingFeedback]=useState(INITIAL_FEEDBACK.filter(f=>f.status==="pending"));
  const [allFeedback,setAllFeedback]=useState(INITIAL_FEEDBACK);

  const totalRevenue=BOOKINGS_DATA.filter(b=>b.status==="confirmed").reduce((s,b)=>s+b.amount,0);
  const totalExpenses=EXPENSES_DATA.reduce((s,e)=>s+e.amount,0);

  const approveFeedback=(id)=>{
    setAllFeedback(prev=>prev.map(f=>f.id===id?{...f,status:"approved"}:f));
    setPendingFeedback(prev=>prev.filter(f=>f.id!==id));
  };
  const rejectFeedback=(id)=>{
    setAllFeedback(prev=>prev.filter(f=>f.id!==id));
    setPendingFeedback(prev=>prev.filter(f=>f.id!==id));
  };

  const sidebar=[
    {id:"overview",icon:"📊",label:"Overview"},
    {id:"trips",icon:"🗓️",label:"Trips & Schedules"},
    {id:"vehicles",icon:"🚐",label:"Vehicles & Vendors"},
    {id:"bookings",icon:"🎫",label:"Bookings"},
    {id:"parcels",icon:"📦",label:"Parcel Deliveries"},
    {id:"feedback",icon:"⭐",label:"Feedback",badge:pendingFeedback.length},
    {id:"finance",icon:"💰",label:"Finance"},
    {id:"reports",icon:"📈",label:"Reports"},
    {id:"agents",icon:"👤",label:"Agents"},
    {id:"settings",icon:"⚙️",label:"Settings"},
  ];

  return(
    <div style={{display:"flex",minHeight:"100vh",paddingTop:64,background:C.navy}}>
      {/* Admin top bar */}
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:C.navy,borderBottom:`1px solid ${C.navyBorder}`,height:64,display:"flex",alignItems:"center",padding:"0 20px",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🚐</div>
          <span className="ral" style={{fontWeight:900,fontSize:17}}>RAYLANE<span style={{color:C.amber}}>EXPRESS</span> <span style={{color:C.textMuted,fontWeight:400,fontSize:13}}>/ Admin</span></span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {pendingFeedback.length>0&&<div style={{background:C.red,color:"#fff",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700}}>{pendingFeedback.length} pending reviews</div>}
          <div style={{fontSize:12,color:C.textMuted}}>Logged in as <strong style={{color:C.white}}>Admin</strong></div>
          <Btn onClick={onLogout} variant="navy" style={{fontSize:12,padding:"6px 14px",border:`1px solid ${C.navyBorder}`}}>Logout</Btn>
        </div>
      </div>

      {/* Sidebar */}
      <div style={{width:220,background:C.navyMid,borderRight:`1px solid ${C.navyBorder}`,position:"fixed",top:64,bottom:0,overflowY:"auto",padding:"16px 0"}}>
        <div style={{padding:"0 14px 14px",borderBottom:`1px solid ${C.navyBorder}`,marginBottom:6}}>
          <div style={{fontSize:10,color:C.textMuted,letterSpacing:1,textTransform:"uppercase",fontWeight:700}}>Operations Hub</div>
        </div>
        {sidebar.map(item=>(
          <button key={item.id} onClick={()=>setSection(item.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"10px 14px",background:section===item.id?C.amber+"22":"transparent",color:section===item.id?C.amber:C.textSecondary,border:"none",borderRight:section===item.id?`3px solid ${C.amber}`:"3px solid transparent",cursor:"pointer",fontSize:13,fontFamily:"'Nunito',sans-serif",textAlign:"left",transition:"all .15s",fontWeight:section===item.id?700:400}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:15}}>{item.icon}</span>{item.label}
            </div>
            {item.badge>0&&<span style={{background:C.red,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700}}>{item.badge}</span>}
          </button>
        ))}
      </div>

      {/* Main */}
      <div style={{marginLeft:220,flex:1,padding:"28px"}}>

        {/* OVERVIEW */}
        {section==="overview"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{marginBottom:22}}>
              <h1 className="ral" style={{fontSize:26,fontWeight:900}}>Dashboard Overview</h1>
              <p style={{color:C.textMuted,fontSize:13,marginTop:4}}>Monday, 9 March 2026 · Live data</p>
            </div>
            <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:28}}>
              <StatCard label="Today's Revenue" value={formatUGX(totalRevenue)} icon="💵" color={C.green} sub="↑ 12% vs yesterday"/>
              <StatCard label="Seats Sold" value="23" icon="🎫" color={C.amber} sub="of 56 available"/>
              <StatCard label="Active Trips" value="5" icon="🚐" color={C.blue}/>
              <StatCard label="Pending Reviews" value={pendingFeedback.length} icon="⭐" color={C.orange}/>
            </div>
            {pendingFeedback.length>0&&(
              <Card style={{marginBottom:20,border:`1px solid ${C.orange}44`,background:C.orange+"08"}}>
                <h3 className="ral" style={{fontWeight:700,marginBottom:14,color:C.orange}}>⭐ Reviews Awaiting Approval ({pendingFeedback.length})</h3>
                {pendingFeedback.map(f=>(
                  <div key={f.id} style={{background:C.card,borderRadius:12,padding:14,marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div><div className="ral" style={{fontWeight:700}}>{f.name}</div><div style={{fontSize:11,color:C.textMuted}}>{f.route} · {f.date}</div></div>
                      <Stars rating={f.rating} size={13}/>
                    </div>
                    <p style={{fontSize:13,color:C.textSecondary,marginBottom:12,fontStyle:"italic"}}>"{f.message}"</p>
                    <div style={{display:"flex",gap:8}}>
                      <Btn onClick={()=>approveFeedback(f.id)} style={{padding:"6px 16px",fontSize:12}}>✓ Approve</Btn>
                      <Btn onClick={()=>rejectFeedback(f.id)} variant="navy" style={{padding:"6px 16px",fontSize:12,border:`1px solid ${C.red}44`,color:C.red}}>✕ Reject</Btn>
                    </div>
                  </div>
                ))}
              </Card>
            )}
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h2 className="ral" style={{fontWeight:700,fontSize:18}}>Recent Bookings</h2>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{borderBottom:`1px solid ${C.navyBorder}`}}>
                    {["Code","Passenger","Route","Seats","Amount","Status"].map(h=>(
                      <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:11,color:C.textMuted,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {BOOKINGS_DATA.slice(0,5).map(b=>(
                      <tr key={b.id} style={{borderBottom:`1px solid ${C.navyBorder}`}}
                        onMouseEnter={e=>e.currentTarget.style.background=C.navyMid}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{padding:"12px",fontFamily:"'Raleway',sans-serif",fontWeight:700,color:C.amber,fontSize:13}}>{b.booking_code}</td>
                        <td style={{padding:"12px",fontSize:13}}>{b.passenger}</td>
                        <td style={{padding:"12px",fontSize:13,color:C.textSecondary}}>{b.route}</td>
                        <td style={{padding:"12px",fontSize:13}}>{b.seats}</td>
                        <td style={{padding:"12px",fontWeight:700,fontSize:13}}>{formatUGX(b.amount)}</td>
                        <td style={{padding:"12px"}}><StatusBadge status={b.status}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* FEEDBACK MODERATION */}
        {section==="feedback"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h1 className="ral" style={{fontSize:26,fontWeight:900,marginBottom:24}}>Customer Feedback</h1>
            <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:24}}>
              <StatCard label="Approved Reviews" value={allFeedback.filter(f=>f.status==="approved").length} icon="✅" color={C.green}/>
              <StatCard label="Pending Approval" value={pendingFeedback.length} icon="⏳" color={C.orange}/>
              <StatCard label="Avg Rating" value="4.7 ★" icon="⭐" color={C.amber}/>
            </div>
            {pendingFeedback.length>0&&(
              <Card style={{marginBottom:24,border:`1px solid ${C.orange}44`}}>
                <h2 className="ral" style={{fontWeight:800,marginBottom:16,color:C.orange}}>Pending Reviews ({pendingFeedback.length})</h2>
                {pendingFeedback.map(f=>(
                  <div key={f.id} style={{background:C.navyMid,borderRadius:12,padding:16,marginBottom:12,border:`1px solid ${C.navyBorder}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div><div className="ral" style={{fontWeight:700,fontSize:15}}>{f.name}</div><div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{f.route} · {f.date}</div></div>
                      <Stars rating={f.rating} size={14}/>
                    </div>
                    <p style={{fontSize:13,color:C.textSecondary,lineHeight:1.7,marginBottom:14,fontStyle:"italic"}}>"{f.message}"</p>
                    <div style={{display:"flex",gap:10}}>
                      <Btn onClick={()=>approveFeedback(f.id)} style={{padding:"8px 20px",fontSize:13}}>✓ Approve & Publish</Btn>
                      <Btn onClick={()=>rejectFeedback(f.id)} variant="navy" style={{padding:"8px 20px",fontSize:13,border:`1px solid ${C.red}44`,color:C.red}}>✕ Reject</Btn>
                    </div>
                  </div>
                ))}
              </Card>
            )}
            <Card>
              <h2 className="ral" style={{fontWeight:800,marginBottom:16}}>Approved Reviews</h2>
              {allFeedback.filter(f=>f.status==="approved").map(f=>(
                <div key={f.id} style={{background:C.navyMid,borderRadius:12,padding:14,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <div><span className="ral" style={{fontWeight:700}}>{f.name}</span> · <span style={{fontSize:12,color:C.textMuted}}>{f.route}</span></div>
                      <Stars rating={f.rating} size={12}/>
                    </div>
                    <p style={{fontSize:13,color:C.textSecondary,fontStyle:"italic"}}>"{f.message}"</p>
                  </div>
                  <StatusBadge status="approved"/>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* TRIPS */}
        {section==="trips"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <h1 className="ral" style={{fontSize:26,fontWeight:900}}>Trips & Schedules</h1>
              <Btn onClick={()=>setShowAddTrip(true)}>+ Add Trip</Btn>
            </div>
            <Card style={{padding:0,overflow:"hidden"}}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{background:C.navyMid,borderBottom:`1px solid ${C.navyBorder}`}}>
                    {["Trip","Route","Departure","Vehicle","Seats","Status","Actions"].map(h=>(
                      <th key={h} style={{padding:"14px 16px",textAlign:"left",fontSize:11,color:C.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {TRIPS.map(t=>{
                      const r=getRoute(t.route_id);
                      return(
                        <tr key={t.id} style={{borderBottom:`1px solid ${C.navyBorder}`}}
                          onMouseEnter={e=>e.currentTarget.style.background=C.navyMid}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={{padding:"14px 16px",color:C.amber,fontFamily:"'Raleway',sans-serif",fontWeight:700}}>#{t.id}</td>
                          <td style={{padding:"14px 16px",fontWeight:600}}>{r.origin} → {r.destination}</td>
                          <td style={{padding:"14px 16px"}}>
                            <div className="ral" style={{fontWeight:800,color:C.amber}}>{formatTime(t.departure_time)}</div>
                            <div style={{fontSize:11,color:C.textMuted}}>{formatDate(t.departure_time)}</div>
                          </td>
                          <td style={{padding:"14px 16px",color:C.textSecondary,fontSize:13}}>{t.vehicle_reg}</td>
                          <td style={{padding:"14px 16px"}}><span style={{color:t.seats_available===0?C.red:t.seats_available<5?C.orange:C.green,fontWeight:700}}>{t.seats_available===0?"FULL":t.seats_available}</span></td>
                          <td style={{padding:"14px 16px"}}><StatusBadge status={t.status}/></td>
                          <td style={{padding:"14px 16px"}}>
                            <div style={{display:"flex",gap:6}}>
                              <Btn variant="outline" style={{padding:"5px 12px",fontSize:11}}>Edit</Btn>
                              <Btn variant="outline" style={{padding:"5px 12px",fontSize:11,color:C.red}}>Cancel</Btn>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
            <Modal open={showAddTrip} onClose={()=>setShowAddTrip(false)} title="Add New Trip">
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <Select label="Route" value="" onChange={()=>{}} options={[{value:"",label:"Select route"},...ROUTES.map(r=>({value:r.id,label:`${r.origin} → ${r.destination}`}))]}/>
                <Select label="Vehicle" value="" onChange={()=>{}} options={[{value:"",label:"Select vehicle"},...VEHICLES_DATA.map(v=>({value:v.id,label:`${v.registration} (${v.model})`}))]}/>
                <Input label="Departure Date & Time" type="datetime-local" value="" onChange={()=>{}}/>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
                  <Btn variant="navy" onClick={()=>setShowAddTrip(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
                  <Btn onClick={()=>setShowAddTrip(false)}>Create Trip</Btn>
                </div>
              </div>
            </Modal>
          </div>
        )}

        {/* VEHICLES */}
        {section==="vehicles"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <h1 className="ral" style={{fontSize:26,fontWeight:900}}>Vehicles & Vendors</h1>
              <Btn onClick={()=>setShowAddVehicle(true)}>+ Add Vehicle</Btn>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:16}}>
              {VEHICLES_DATA.map(v=>(
                <Card key={v.id}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:30}}>🚐</span><StatusBadge status={v.status}/></div>
                  <div className="ral" style={{fontWeight:800,fontSize:20,marginBottom:3}}>{v.registration}</div>
                  <div style={{color:C.textSecondary,fontSize:13,marginBottom:14}}>{v.model}</div>
                  {[["Capacity",`${v.capacity} seats`],["Owner",v.owner_type],["Driver",v.driver]].map(([k,val])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}>
                      <span style={{color:C.textMuted}}>{k}</span>
                      <span style={{fontWeight:600}}>{val}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",gap:8,marginTop:14}}>
                    <Btn variant="navy" style={{flex:1,padding:"7px",fontSize:12,border:`1px solid ${C.navyBorder}`}}>Edit</Btn>
                    <Btn variant="navy" style={{flex:1,padding:"7px",fontSize:12,border:`1px solid ${C.navyBorder}`}}>Schedule</Btn>
                  </div>
                </Card>
              ))}
            </div>
            <Modal open={showAddVehicle} onClose={()=>setShowAddVehicle(false)} title="Add New Vehicle">
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <Input label="Registration" value="" onChange={()=>{}} placeholder="UAX 000X"/>
                <Input label="Model" value="" onChange={()=>{}} placeholder="e.g. Toyota HiAce"/>
                <Input label="Seat Capacity" type="number" value="" onChange={()=>{}} placeholder="14"/>
                <Select label="Owner Type" value="" onChange={()=>{}} options={[{value:"company",label:"Company Owned"},{value:"vendor",label:"Vendor/Partner"}]}/>
                <Input label="Driver Name" value="" onChange={()=>{}} placeholder="Driver's full name"/>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
                  <Btn variant="navy" onClick={()=>setShowAddVehicle(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
                  <Btn onClick={()=>setShowAddVehicle(false)}>Add Vehicle</Btn>
                </div>
              </div>
            </Modal>
          </div>
        )}

        {/* BOOKINGS */}
        {section==="bookings"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <h1 className="ral" style={{fontSize:26,fontWeight:900}}>Passenger Bookings</h1>
              <div style={{display:"flex",gap:10}}>
                <Input placeholder="Search..." value="" onChange={()=>{}} style={{padding:"8px 14px",width:180}}/>
                <Btn variant="navy" style={{fontSize:12,border:`1px solid ${C.navyBorder}`}}>Export CSV</Btn>
              </div>
            </div>
            <Card style={{padding:0,overflow:"hidden"}}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{background:C.navyMid,borderBottom:`1px solid ${C.navyBorder}`}}>
                    {["Code","Passenger","Phone","Route","Date","Seats","Amount","Status","Actions"].map(h=>(
                      <th key={h} style={{padding:"14px 16px",textAlign:"left",fontSize:11,color:C.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {BOOKINGS_DATA.map(b=>(
                      <tr key={b.id} style={{borderBottom:`1px solid ${C.navyBorder}`}}
                        onMouseEnter={e=>e.currentTarget.style.background=C.navyMid}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{padding:"12px 16px",color:C.amber,fontFamily:"'Raleway',sans-serif",fontWeight:700,fontSize:13}}>{b.booking_code}</td>
                        <td style={{padding:"12px 16px",fontWeight:600,fontSize:13}}>{b.passenger}</td>
                        <td style={{padding:"12px 16px",color:C.textMuted,fontSize:12}}>{b.phone}</td>
                        <td style={{padding:"12px 16px",fontSize:13}}>{b.route}</td>
                        <td style={{padding:"12px 16px",color:C.textMuted,fontSize:12}}>{b.date}</td>
                        <td style={{padding:"12px 16px",fontSize:13}}>{b.seats}</td>
                        <td style={{padding:"12px 16px",fontWeight:700,fontSize:13}}>{formatUGX(b.amount)}</td>
                        <td style={{padding:"12px 16px"}}><StatusBadge status={b.status}/></td>
                        <td style={{padding:"12px 16px"}}>
                          <div style={{display:"flex",gap:6}}>
                            <Btn variant="navy" style={{padding:"5px 10px",fontSize:11,border:`1px solid ${C.navyBorder}`}}>View</Btn>
                            <Btn variant="navy" style={{padding:"5px 10px",fontSize:11,border:`1px solid ${C.navyBorder}`}}>QR</Btn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* FINANCE */}
        {section==="finance"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <h1 className="ral" style={{fontSize:26,fontWeight:900}}>Financial Management</h1>
              <div style={{display:"flex",gap:10}}>
                <Btn variant="navy" style={{fontSize:12,border:`1px solid ${C.navyBorder}`}}>Export PDF</Btn>
                <Btn variant="navy" style={{fontSize:12,border:`1px solid ${C.navyBorder}`}}>Export Excel</Btn>
              </div>
            </div>
            <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:24}}>
              <StatCard label="Total Revenue" value={formatUGX(totalRevenue)} icon="💵" color={C.green}/>
              <StatCard label="Total Expenses" value={formatUGX(totalExpenses)} icon="📉" color={C.red}/>
              <StatCard label="Net Profit" value={formatUGX(totalRevenue-totalExpenses)} icon="📊" color={C.amber}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <Card>
                <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Revenue by Route</h3>
                {ROUTES.slice(0,4).map(r=>{
                  const rev=BOOKINGS_DATA.filter(b=>b.route.includes(r.destination)&&b.status==="confirmed").reduce((s,b)=>s+b.amount,0);
                  return(
                    <div key={r.id} style={{marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                        <span style={{color:C.textSecondary}}>→ {r.destination}</span>
                        <span style={{fontWeight:700,color:C.green}}>{formatUGX(rev)}</span>
                      </div>
                      <div style={{height:5,background:C.navyLight,borderRadius:3}}>
                        <div style={{width:`${Math.min((rev/130000)*100,100)}%`,height:"100%",background:`linear-gradient(90deg,${C.green},${C.amber})`,borderRadius:3}}/>
                      </div>
                    </div>
                  );
                })}
              </Card>
              <Card>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <h3 className="ral" style={{fontWeight:700}}>Expense Log</h3>
                  <Btn style={{padding:"6px 14px",fontSize:12}}>+ Add</Btn>
                </div>
                {EXPENSES_DATA.map(e=>(
                  <div key={e.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.navyBorder}`}}>
                    <div><div style={{fontWeight:600,fontSize:13}}>{e.category}</div><div style={{fontSize:11,color:C.textMuted}}>{e.description}</div></div>
                    <span style={{color:C.red,fontWeight:700,fontSize:13}}>-{formatUGX(e.amount)}</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        )}

        {/* REPORTS */}
        {section==="reports"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h1 className="ral" style={{fontSize:26,fontWeight:900,marginBottom:24}}>Reports & Analytics</h1>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14,marginBottom:24}}>
              {[{title:"Daily Revenue",icon:"📅",color:C.green},{title:"Route Performance",icon:"🗺️",color:C.blue},{title:"Vehicle Utilisation",icon:"🚐",color:C.amber},{title:"Agent Performance",icon:"👤",color:"#A855F7"},{title:"Passenger Report",icon:"👥",color:C.green},{title:"Parcel Report",icon:"📦",color:C.red}].map(r=>(
                <Card key={r.title} style={{cursor:"pointer",transition:"all .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=r.color+"66"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.navyBorder}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <span style={{fontSize:26}}>{r.icon}</span>
                    <Btn variant="navy" style={{padding:"4px 10px",fontSize:11,border:`1px solid ${C.navyBorder}`}}>Export</Btn>
                  </div>
                  <div className="ral" style={{fontWeight:700,fontSize:14}}>{r.title}</div>
                </Card>
              ))}
            </div>
            <Card>
              <h3 className="ral" style={{fontWeight:700,marginBottom:18}}>Weekly Revenue</h3>
              <div style={{display:"flex",gap:6,alignItems:"flex-end",height:120}}>
                {[{d:"Mon",v:85},{d:"Tue",v:62},{d:"Wed",v:94},{d:"Thu",v:78},{d:"Fri",v:110},{d:"Sat",v:130},{d:"Sun",v:70}].map(x=>(
                  <div key={x.d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{width:"100%",background:`linear-gradient(180deg,${C.amber},${C.amberDark})`,borderRadius:"4px 4px 0 0",height:`${x.v}%`,minHeight:4}}/>
                    <span style={{fontSize:11,color:C.textMuted}}>{x.d}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* AGENTS */}
        {section==="agents"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <h1 className="ral" style={{fontSize:26,fontWeight:900}}>Agent Management</h1>
              <Btn>+ Add Agent</Btn>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
              {[{name:"Moses Lubega",code:"AGT-01",bookings:34,revenue:850000,status:"active",location:"Kampala Central"},{name:"Ruth Acen",code:"AGT-02",bookings:21,revenue:525000,status:"active",location:"Gulu Station"},{name:"Paul Waiswa",code:"AGT-03",bookings:15,revenue:375000,status:"active",location:"Jinja Road"}].map(a=>(
                <Card key={a.code}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                    <div style={{width:44,height:44,borderRadius:"50%",background:C.amber+"33",border:`2px solid ${C.amber}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👤</div>
                    <StatusBadge status={a.status}/>
                  </div>
                  <div className="ral" style={{fontWeight:800,fontSize:17}}>{a.name}</div>
                  <div style={{color:C.textMuted,fontSize:12,marginBottom:14}}>{a.code} · {a.location}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div style={{background:C.navyMid,borderRadius:8,padding:10,textAlign:"center"}}>
                      <div className="ral" style={{fontWeight:800,fontSize:18,color:C.amber}}>{a.bookings}</div>
                      <div style={{fontSize:10,color:C.textMuted}}>Bookings</div>
                    </div>
                    <div style={{background:C.navyMid,borderRadius:8,padding:10,textAlign:"center"}}>
                      <div className="ral" style={{fontWeight:800,fontSize:12,color:C.green}}>{formatUGX(a.revenue)}</div>
                      <div style={{fontSize:10,color:C.textMuted}}>Revenue</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {section==="settings"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h1 className="ral" style={{fontSize:26,fontWeight:900,marginBottom:24}}>Settings</h1>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <Card>
                <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Company Info</h3>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <Input label="Company Name" value="Raylane Express Ltd" onChange={()=>{}}/>
                  <Input label="Phone" value="+256 700 000000" onChange={()=>{}}/>
                  <Input label="Email" value="info@raylane.ug" onChange={()=>{}}/>
                  <Input label="Address" value="Nakasero, Kampala" onChange={()=>{}}/>
                  <Btn style={{marginTop:4}}>Save Changes</Btn>
                </div>
              </Card>
              <Card>
                <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Supabase Connection</h3>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <Input label="Supabase URL" value="https://your-project.supabase.co" onChange={()=>{}}/>
                  <Input label="Anon Key" value="••••••••••••••••" onChange={()=>{}}/>
                  <div style={{background:C.green+"22",border:`1px solid ${C.green}44`,borderRadius:10,padding:12,fontSize:12,color:C.green}}>
                    ✓ Schema ready: passengers, routes, vehicles, trips, bookings, parcels, expenses, feedback
                  </div>
                  <Btn>Test Connection</Btn>
                </div>
              </Card>
              <Card>
                <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>WhatsApp Integration</h3>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <Input label="WhatsApp Business API Key" value="" onChange={()=>{}} placeholder="Enter API key"/>
                  <Input label="Sender Number" value="" onChange={()=>{}} placeholder="+256 7XX XXX XXX"/>
                  <Btn>Save & Test</Btn>
                </div>
              </Card>
              <Card>
                <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Booking Rules</h3>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <Input label="Max advance booking (days)" value="30" onChange={()=>{}}/>
                  <Input label="Free luggage allowance (kg)" value="10" onChange={()=>{}}/>
                  <Input label="Max seats per booking" value="5" onChange={()=>{}}/>
                  <Select label="Default payment" value="mobile_money" onChange={()=>{}} options={[{value:"mobile_money",label:"Mobile Money"},{value:"card",label:"Card"},{value:"cash",label:"Cash"}]}/>
                  <Btn>Save Rules</Btn>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* PARCELS */}
        {section==="parcels"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h1 className="ral" style={{fontSize:26,fontWeight:900,marginBottom:24}}>Parcel Deliveries</h1>
            <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:24}}>
              <StatCard label="In Transit" value="5" icon="🚚" color={C.amber}/>
              <StatCard label="Delivered Today" value="3" icon="✅" color={C.green}/>
              <StatCard label="Pending" value="2" icon="⏳" color={C.blue}/>
            </div>
            <Card style={{padding:0,overflow:"hidden"}}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{background:C.navyMid,borderBottom:`1px solid ${C.navyBorder}`}}>
                    {["Code","Sender","Receiver","Destination","Weight","Status",""].map(h=>(
                      <th key={h} style={{padding:"14px 16px",textAlign:"left",fontSize:11,color:C.textMuted,fontWeight:700,textTransform:"uppercase"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {[{code:"RX-P001",sender:"David Ssempa",receiver:"Mary Auma",dest:"Gulu",weight:"2.5kg",status:"active"},{code:"RX-P002",sender:"Peter Okello",receiver:"Grace Nakato",dest:"Mbarara",weight:"4.1kg",status:"confirmed"},{code:"RX-P003",sender:"Agnes Aber",receiver:"John Mwesigwa",dest:"Arua",weight:"7.0kg",status:"pending"}].map(p=>(
                      <tr key={p.code} style={{borderBottom:`1px solid ${C.navyBorder}`}}
                        onMouseEnter={e=>e.currentTarget.style.background=C.navyMid}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{padding:"12px 16px",color:C.amber,fontFamily:"'Raleway',sans-serif",fontWeight:700,fontSize:13}}>{p.code}</td>
                        <td style={{padding:"12px 16px",fontSize:13}}>{p.sender}</td>
                        <td style={{padding:"12px 16px",fontSize:13}}>{p.receiver}</td>
                        <td style={{padding:"12px 16px",color:C.textSecondary,fontSize:13}}>{p.dest}</td>
                        <td style={{padding:"12px 16px",fontSize:13}}>{p.weight}</td>
                        <td style={{padding:"12px 16px"}}><StatusBadge status={p.status}/></td>
                        <td style={{padding:"12px 16px"}}><Btn variant="navy" style={{fontSize:11,padding:"5px 12px",border:`1px solid ${C.navyBorder}`}}>Update</Btn></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════
export default function App(){
  const [page,setPage]=useState("home");
  const [preselectedTrip,setPreselectedTrip]=useState(null);
  const [adminAuthed,setAdminAuthed]=useState(false);

  // Secret admin access: clicking logo 5 times, or going to "login" page
  const [logoClicks,setLogoClicks]=useState(0);
  const handleLogoClick=()=>{
    const next=logoClicks+1;
    setLogoClicks(next);
    if(next>=5){ setPage("login"); setLogoClicks(0); }
  };

  const isAdmin=page==="admin";
  const isLogin=page==="login";

  if(isLogin&&!adminAuthed) return(
    <>
      <style>{globalCSS}</style>
      <AdminLogin onLogin={()=>{setAdminAuthed(true);setPage("admin");}}/>
    </>
  );

  if(isAdmin&&adminAuthed) return(
    <>
      <style>{globalCSS}</style>
      <AdminDashboard onLogout={()=>{setAdminAuthed(false);setPage("home");}}/>
    </>
  );

  return(
    <>
      <style>{globalCSS}</style>
      <Nav page={page} setPage={setPage}/>
      {page==="home"    &&<HomePage     setPage={setPage} setPreselectedTrip={setPreselectedTrip}/>}
      {page==="schedule"&&<SchedulePage setPage={setPage} setPreselectedTrip={setPreselectedTrip}/>}
      {page==="book"    &&<BookingPage  preselectedTrip={preselectedTrip}/>}
      {page==="parcel"  &&<ParcelPage/>}
      {page==="safety"  &&<SafetyPage/>}
      {page==="faq"     &&<FAQPage/>}
    </>
  );
}

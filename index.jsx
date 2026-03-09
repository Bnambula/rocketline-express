// ═══════════════════════════════════════════════════════════════════════
// RAYLANE EXPRESS — Full Platform v3
// ═══════════════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback, useRef } from "react";

// ─── BRAND COLORS ────────────────────────────────────────────────────
const C = {
  navy:"#0D1B3E", navyMid:"#132347", navyLight:"#1A2E5A",
  navyBorder:"#243660", amber:"#F5A623", amberLight:"#FFB940",
  amberDark:"#D4891A", white:"#FFFFFF", offWhite:"#F0F4FF",
  textPrimary:"#FFFFFF", textSecondary:"#A8BADA", textMuted:"#5B7299",
  green:"#22C55E", red:"#EF4444", orange:"#F97316", blue:"#3B82F6",
  purple:"#A855F7", surface:"#111E3A", card:"#162040", cardHover:"#1C2A50",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────
const ROUTES = [
  {id:1,origin:"Kampala",destination:"Gulu",      price:35000,duration_minutes:240},
  {id:2,origin:"Kampala",destination:"Mbarara",   price:25000,duration_minutes:180},
  {id:3,origin:"Kampala",destination:"Mbale",     price:30000,duration_minutes:210},
  {id:4,origin:"Kampala",destination:"Fort Portal",price:40000,duration_minutes:270},
  {id:5,origin:"Kampala",destination:"Arua",      price:50000,duration_minutes:360},
  {id:6,origin:"Kampala",destination:"Jinja",     price:15000,duration_minutes:90},
];

const makeToday=(h,m)=>{const d=new Date();d.setHours(h,m,0,0);return d.toISOString();};

const INIT_TRIPS = [
  {id:1,route_id:6,vehicle_id:1,departure_time:makeToday(6,0),  status:"active",seats_booked:[2,5,8],vehicle_reg:"UAA 123B",capacity:14},
  {id:2,route_id:2,vehicle_id:2,departure_time:makeToday(7,30), status:"active",seats_booked:[1,3,6,9,12],vehicle_reg:"UAB 456C",capacity:14},
  {id:3,route_id:3,vehicle_id:3,departure_time:makeToday(9,0),  status:"active",seats_booked:[],vehicle_reg:"UAC 789D",capacity:14},
  {id:4,route_id:1,vehicle_id:4,departure_time:makeToday(11,0), status:"active",seats_booked:[1,2,3,4,5,6,7,8,9,10,11,12,13],vehicle_reg:"UAD 012E",capacity:14},
  {id:5,route_id:4,vehicle_id:1,departure_time:makeToday(13,30),status:"active",seats_booked:[3,7],vehicle_reg:"UAA 123B",capacity:14},
  {id:6,route_id:5,vehicle_id:2,departure_time:makeToday(15,0), status:"active",seats_booked:[],vehicle_reg:"UAB 456C",capacity:14},
];

const INIT_VEHICLES = [
  {id:1,registration:"UAA 123B",model:"Toyota HiAce",  capacity:14,owner_type:"company",status:"active",     driver:"Moses Kato",    driver_phone:"+256 772 100001"},
  {id:2,registration:"UAB 456C",model:"Toyota Coaster",capacity:30,owner_type:"vendor", status:"active",     driver:"David Ssebi",   driver_phone:"+256 772 100002"},
  {id:3,registration:"UAC 789D",model:"Isuzu NQR",     capacity:36,owner_type:"vendor", status:"maintenance",driver:"John Mwesigwa", driver_phone:"+256 772 100003"},
  {id:4,registration:"UAD 012E",model:"Toyota HiAce",  capacity:14,owner_type:"company",status:"active",     driver:"Robert Okech",  driver_phone:"+256 772 100004"},
];

const INIT_BOOKINGS = [
  {id:1,booking_code:"RX-2840",passenger:"Sarah Nakato", phone:"+256 772 123456",route:"Kampala → Gulu",   route_id:1,seats:[4,5],trip_id:1,amount:70000, payment_status:"confirmed",status:"confirmed",date:"2026-03-09",agent_id:null,is_advance:false},
  {id:2,booking_code:"RX-2841",passenger:"James Okello", phone:"+256 701 234567",route:"Kampala → Mbarara",route_id:2,seats:[2],  trip_id:2,amount:25000, payment_status:"confirmed",status:"confirmed",date:"2026-03-09",agent_id:"AGT-01",is_advance:false},
  {id:3,booking_code:"RX-2842",passenger:"Grace Auma",   phone:"+256 782 345678",route:"Kampala → Mbale",  route_id:3,seats:[1,2,3],trip_id:3,amount:90000, payment_status:"pending",  status:"pending",  date:"2026-03-09",agent_id:null,is_advance:false},
  {id:4,booking_code:"RX-2843",passenger:"Peter Mugisha",phone:"+256 756 456789",route:"Kampala → Gulu",   route_id:1,seats:[6],  trip_id:null,amount:35000,payment_status:"pending",  status:"advance",  date:"2026-03-15",agent_id:null,is_advance:true},
  {id:5,booking_code:"RX-2844",passenger:"Agnes Aber",   phone:"+256 714 567890",route:"Kampala → Arua",   route_id:5,seats:[],   trip_id:null,amount:100000,payment_status:"pending", status:"advance",  date:"2026-03-20",agent_id:"AGT-02",is_advance:true},
];

const INIT_AGENTS = [
  {id:"AGT-01",name:"Moses Lubega",  phone:"+256 772 200001",location:"Kampala Central",username:"moses.lubega",  password:"agent123",status:"active", bookings:34,revenue:850000,created:"2026-01-15"},
  {id:"AGT-02",name:"Ruth Acen",     phone:"+256 782 200002",location:"Gulu Station",   username:"ruth.acen",    password:"agent456",status:"active", bookings:21,revenue:525000,created:"2026-01-20"},
  {id:"AGT-03",name:"Paul Waiswa",   phone:"+256 756 200003",location:"Jinja Road",     username:"paul.waiswa",  password:"agent789",status:"suspended",bookings:15,revenue:375000,created:"2026-02-01"},
];

const INIT_RESERVATIONS = [
  {id:1,seat:9,trip_id:1,passenger:"Kato Brian",phone:"+256 700 999001",reserved_by:"admin",expires_at:new Date(Date.now()+45*60000).toISOString(),status:"reserved"},
];

const INIT_EXPENSES = [
  {id:1,category:"Fuel",            amount:450000,description:"Kampala-Gulu route fuel",date:"2026-03-09"},
  {id:2,category:"Maintenance",     amount:320000,description:"UAC 789D service",       date:"2026-03-08"},
  {id:3,category:"Driver Allowance",amount:180000,description:"March allowances",       date:"2026-03-07"},
  {id:4,category:"Terminal Fees",   amount:90000, description:"Nakasero terminal",      date:"2026-03-06"},
];

const INIT_PROMOTIONS = [
  {id:1,code:"JINJA10",route_id:6,discount:10,type:"percent",description:"10% off Kampala–Jinja",active:true,expires:"2026-04-30"},
  {id:2,code:"STUDENT5",route_id:null,discount:5000,type:"fixed",description:"Student discount all routes",active:true,expires:"2026-12-31"},
];

const INIT_FEEDBACK = [
  {id:1,name:"Brian Otieno",   rating:5,message:"Excellent service! Driver was professional and on time.",route:"Kampala → Jinja",   date:"2026-03-07",status:"approved"},
  {id:2,name:"Patience Akello",rating:4,message:"Comfortable ride. The WhatsApp ticket was very convenient.",route:"Kampala → Gulu",  date:"2026-03-06",status:"approved"},
  {id:3,name:"Samuel Wasswa",  rating:5,message:"Best transport company in Uganda. Seats are clean.",     route:"Kampala → Mbarara",date:"2026-03-08",status:"approved"},
  {id:4,name:"Test User",      rating:3,message:"This review is pending admin approval.",                  route:"Kampala → Mbale",  date:"2026-03-09",status:"pending"},
];

const FAQ_DATA = [
  {q:"How do I book a seat?",            a:"Select your route, choose an available trip, pick your seat(s), enter your details, and pay via Mobile Money. Your QR boarding pass is sent instantly via WhatsApp."},
  {q:"What if the van is fully booked?", a:"The system will show the next available departure and allow you to book that trip directly."},
  {q:"What is the luggage allowance?",   a:"Each passenger is entitled to 10kg of luggage free of charge. Additional luggage may attract extra charges."},
  {q:"What happens if luggage is lost?", a:"Report lost luggage to the driver or Raylane Express office immediately. Label your luggage clearly."},
  {q:"Can I cancel or reschedule?",      a:"Trip changes may be possible before departure. Contact Raylane Express support for assistance."},
  {q:"How do I receive my ticket?",      a:"Tickets are sent via WhatsApp after booking confirmation and payment, including a QR code for boarding."},
  {q:"What if I miss my trip?",          a:"Contact the Raylane Express office immediately to check availability on the next departure."},
  {q:"Is there special assistance available?",a:"Yes. During booking, tick the accessibility checkbox and describe what you need (wheelchair, elderly boarding, visual impairment). Staff will be notified."},
];

// ─── GLOBAL STATE (simple store pattern) ─────────────────────────────
const useStore = () => {
  const [trips,       setTrips]       = useState(INIT_TRIPS);
  const [vehicles,    setVehicles]    = useState(INIT_VEHICLES);
  const [bookings,    setBookings]    = useState(INIT_BOOKINGS);
  const [agents,      setAgents]      = useState(INIT_AGENTS);
  const [reservations,setReservations]= useState(INIT_RESERVATIONS);
  const [expenses,    setExpenses]    = useState(INIT_EXPENSES);
  const [promotions,  setPromotions]  = useState(INIT_PROMOTIONS);
  const [feedback,    setFeedback]    = useState(INIT_FEEDBACK);

  const getRoute  = id => ROUTES.find(r=>r.id===id)||{};
  const getVehicle= id => vehicles.find(v=>v.id===id)||{};
  const getTrip   = id => trips.find(t=>t.id===id)||null;

  const seatsAvailable = trip => {
    const res = reservations.filter(r=>r.trip_id===trip.id&&r.status==="reserved").map(r=>r.seat);
    return trip.capacity - trip.seats_booked.length - res.length;
  };

  const confirmBooking = (id, vehicle_id, trip_id) => {
    setBookings(prev=>prev.map(b=>b.id===id?{...b,status:"confirmed",payment_status:"confirmed",trip_id,vehicle_id}:b));
  };

  const addBooking = bk => setBookings(prev=>[...prev, {...bk, id:prev.length+1}]);

  const addAgent = ag => setAgents(prev=>[...prev, {...ag, id:`AGT-${String(prev.length+1).padStart(2,"0")}`, bookings:0, revenue:0, created:new Date().toISOString().split("T")[0]}]);

  const toggleAgent = id => setAgents(prev=>prev.map(a=>a.id===id?{...a,status:a.status==="active"?"suspended":"active"}:a));

  const addVehicle = v => setVehicles(prev=>[...prev,{...v,id:prev.length+1}]);

  const addTrip = t => setTrips(prev=>[...prev,{...t,id:prev.length+1,seats_booked:[]}]);

  const reserveSeat = res => setReservations(prev=>[...prev,{...res,id:prev.length+1,status:"reserved"}]);

  const approveFeedback = id => setFeedback(prev=>prev.map(f=>f.id===id?{...f,status:"approved"}:f));
  const rejectFeedback  = id => setFeedback(prev=>prev.filter(f=>f.id!==id));

  const addExpense = e => setExpenses(prev=>[...prev,{...e,id:prev.length+1}]);
  const addPromotion = p => setPromotions(prev=>[...prev,{...p,id:prev.length+1}]);

  return {trips,vehicles,bookings,agents,reservations,expenses,promotions,feedback,
    getRoute,getVehicle,getTrip,seatsAvailable,confirmBooking,addBooking,addAgent,
    toggleAgent,addVehicle,addTrip,reserveSeat,approveFeedback,rejectFeedback,addExpense,addPromotion};
};

// ─── UTILITIES ────────────────────────────────────────────────────────
const formatUGX = n=>`UGX ${Number(n).toLocaleString()}`;
const formatTime = dt=>new Date(dt).toLocaleTimeString("en-UG",{hour:"2-digit",minute:"2-digit"});
const formatDate = dt=>new Date(dt).toLocaleDateString("en-UG",{day:"numeric",month:"short",year:"numeric"});
const genCode    = ()=>"RX-"+Math.floor(1000+Math.random()*9000);
const validateReg = reg=>/^UA[A-Z]{1,2}\s?\d{1,3}[A-Z]{1,2}$/.test(reg.toUpperCase().trim());

function useCountdown(target){
  const [diff,setDiff]=useState(new Date(target)-new Date());
  useEffect(()=>{const t=setInterval(()=>setDiff(new Date(target)-new Date()),1000);return()=>clearInterval(t);},[target]);
  if(diff<=0) return{str:"Departed",urgent:false,boarding:false,mins:0};
  const h=Math.floor(diff/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);
  const mins=diff/60000;
  return{str:h>0?`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`:`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`,urgent:mins<=30,boarding:mins<=18,mins};
}

// ─── GLOBAL CSS ───────────────────────────────────────────────────────
const globalCSS=`
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800;900&family=Nunito:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}html{scroll-behavior:smooth;}
body{background:${C.navy};color:${C.white};font-family:'Nunito',sans-serif;overflow-x:hidden;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:${C.navy};}::-webkit-scrollbar-thumb{background:${C.navyBorder};border-radius:3px;}
.ral{font-family:'Raleway',sans-serif;}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
@keyframes blink{0%,100%{box-shadow:0 0 0 0 ${C.amber}66;}50%{box-shadow:0 0 14px 5px ${C.amber}33;}}
@keyframes urgentPulse{0%,100%{background:${C.orange}18;}50%{background:${C.orange}30;}}
@keyframes slideIn{from{transform:translateX(-10px);opacity:0;}to{transform:translateX(0);opacity:1;}}
@keyframes spin{to{transform:rotate(360deg);}}
.fade-up{animation:fadeUp .4s ease forwards;}
.live-dot{width:8px;height:8px;border-radius:50%;background:${C.green};animation:pulse 1.5s infinite;display:inline-block;}
.urgent-card{animation:urgentPulse 1.5s infinite;}
.pulse-timer{animation:blink 1s infinite;}
select option{background:${C.navyMid};}
input[type=checkbox]{accent-color:${C.amber};}
`;

// ─── BASE UI COMPONENTS ───────────────────────────────────────────────
const Badge=({color=C.amber,children})=>(
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 10px",fontSize:11,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase"}}>{children}</span>
);
const StatusBadge=({status})=>{
  const map={confirmed:C.green,pending:C.amber,cancelled:C.red,active:C.green,filling:C.amber,maintenance:C.red,company:C.blue,vendor:C.purple,approved:C.green,suspended:C.red,advance:C.blue,reserved:C.orange};
  return <Badge color={map[status]||C.blue}>{status}</Badge>;
};

const Btn=({children,onClick,variant="primary",style:s={},disabled,full})=>(
  <button onClick={onClick} disabled={disabled} style={{
    background:variant==="primary"?`linear-gradient(135deg,${C.amber},${C.amberDark})`:variant==="navy"?C.navyLight:variant==="danger"?C.red+"22":"transparent",
    color:variant==="primary"?"#0D1B3E":variant==="danger"?C.red:C.white,
    border:variant==="outline"?`1px solid ${C.navyBorder}`:variant==="danger"?`1px solid ${C.red}44`:"none",
    borderRadius:10,padding:"10px 22px",fontFamily:"'Raleway',sans-serif",fontWeight:800,fontSize:13,
    cursor:disabled?"not-allowed":"pointer",opacity:disabled?.5:1,transition:"all .2s",letterSpacing:".3px",
    width:full?"100%":"auto",...s
  }}
  onMouseEnter={e=>{if(!disabled&&variant==="primary"){e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 6px 20px ${C.amber}44`;}}}
  onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}
  >{children}</button>
);

const Input=({label,type="text",value,onChange,placeholder,style:s={},required,error})=>(
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontSize:11,color:error?C.red:C.textSecondary,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>{label}{required&&<span style={{color:C.red}}> *</span>}</label>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{background:C.navyMid,border:`1px solid ${error?C.red:C.navyBorder}`,borderRadius:10,padding:"11px 14px",color:C.white,fontSize:14,outline:"none",transition:"border .2s",...s}}
      onFocus={e=>e.target.style.borderColor=error?C.red:C.amber} onBlur={e=>e.target.style.borderColor=error?C.red:C.navyBorder}/>
    {error&&<span style={{fontSize:11,color:C.red}}>{error}</span>}
  </div>
);

const Textarea=({label,value,onChange,placeholder,rows=4})=>(
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontSize:11,color:C.textSecondary,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>{label}</label>}
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{background:C.navyMid,border:`1px solid ${C.navyBorder}`,borderRadius:10,padding:"11px 14px",color:C.white,fontSize:14,outline:"none",resize:"vertical",fontFamily:"'Nunito',sans-serif"}}
      onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor=C.navyBorder}/>
  </div>
);

const Sel=({label,value,onChange,options,style:s={},required})=>(
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontSize:11,color:C.textSecondary,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>{label}{required&&<span style={{color:C.red}}> *</span>}</label>}
    <select value={value} onChange={onChange} style={{background:C.navyMid,border:`1px solid ${C.navyBorder}`,borderRadius:10,padding:"11px 14px",color:C.white,fontSize:14,outline:"none",cursor:"pointer",...s}}
      onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor=C.navyBorder}>
      {options.map(o=><option key={o.value} value={o.value} style={{background:C.navyMid}}>{o.label}</option>)}
    </select>
  </div>
);

const Card=({children,style:s={}})=>(
  <div style={{background:C.card,border:`1px solid ${C.navyBorder}`,borderRadius:16,padding:24,...s}}>{children}</div>
);

const Modal=({open,onClose,title,children,wide})=>{
  if(!open) return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"#000c",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.navyMid,border:`1px solid ${C.navyBorder}`,borderRadius:20,padding:28,maxWidth:wide?720:520,width:"100%",maxHeight:"90vh",overflowY:"auto",animation:"fadeUp .3s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <h2 className="ral" style={{fontSize:18,fontWeight:800}}>{title}</h2>
          <button onClick={onClose} style={{background:C.navyLight,border:"none",color:C.textSecondary,borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:15}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Tabs=({tabs,active,onChange})=>(
  <div style={{display:"flex",gap:4,background:C.navyMid,borderRadius:12,padding:4,flexWrap:"wrap"}}>
    {tabs.map(t=>(
      <button key={t} onClick={()=>onChange(t)}
        style={{padding:"8px 16px",borderRadius:9,border:"none",background:active===t?C.amber:"transparent",color:active===t?"#0D1B3E":C.textSecondary,cursor:"pointer",fontFamily:"'Raleway',sans-serif",fontWeight:700,fontSize:12,transition:"all .2s"}}>
        {t}
      </button>
    ))}
  </div>
);

const Stars=({rating,onChange,size=18})=>(
  <div style={{display:"flex",gap:3}}>
    {[1,2,3,4,5].map(s=>(
      <span key={s} onClick={()=>onChange&&onChange(s)}
        style={{fontSize:size,cursor:onChange?"pointer":"default",color:s<=rating?C.amber:C.navyBorder,transition:"color .15s"}}>★</span>
    ))}
  </div>
);

const QRCode=({value,size=120})=>{
  const cells=15,cell=size/cells;
  const seed=value.split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  const grid=Array.from({length:cells},(_,r)=>Array.from({length:cells},(_,c)=>{
    if((r<4&&c<4)||(r<4&&c>cells-5)||(r>cells-5&&c<4)) return true;
    return((seed*(r*17+c*13+7))%3===0);
  }));
  return(
    <svg width={size} height={size} style={{borderRadius:8,background:"#fff",padding:4}}>
      {grid.map((row,r)=>row.map((on,c)=>on&&<rect key={`${r}-${c}`} x={c*cell} y={r*cell} width={cell} height={cell} fill="#0D1B3E"/>))}
    </svg>
  );
};

// ─── SEAT MAP ─────────────────────────────────────────────────────────
const SeatMap=({capacity=14,bookedSeats=[],reservedSeats=[],onSelect,selected=[],size="normal"})=>{
  const rows=Math.ceil((capacity-1)/3);
  const cellW=size==="small"?36:44, cellH=size==="small"?30:36;
  const getSeatState=(n)=>{
    if(bookedSeats.includes(n)) return "booked";
    if(reservedSeats.includes(n)) return "reserved";
    if(selected.includes(n)) return "selected";
    return "free";
  };
  const colors={booked:{bg:C.red+"33",border:C.red,color:C.red},reserved:{bg:C.orange+"33",border:C.orange,color:C.orange},selected:{bg:C.amber,border:C.amber,color:"#0D1B3E"},free:{bg:C.navyLight,border:C.navyBorder,color:C.textMuted}};
  return(
    <div style={{background:C.surface,border:`1px solid ${C.navyBorder}`,borderRadius:16,padding:16,display:"inline-block"}}>
      <div style={{textAlign:"center",fontSize:10,color:C.textMuted,letterSpacing:1,marginBottom:10,textTransform:"uppercase"}}>Front / Driver</div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
        <div style={{width:cellW,height:cellH,background:C.navyBorder,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🚗</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {Array.from({length:rows},(_,r)=>(
          <div key={r} style={{display:"flex",gap:6,justifyContent:"center"}}>
            {[0,1,null,2].map((c,i)=>{
              if(c===null) return <div key="aisle" style={{width:18}}/>;
              const n=r*3+c+1;
              if(n>capacity-1) return <div key={n} style={{width:cellW}}/>;
              const st=getSeatState(n);
              const col=colors[st];
              return(
                <div key={n} onClick={()=>st==="free"&&onSelect&&onSelect(n)}
                  style={{width:cellW,height:cellH,background:col.bg,border:`1.5px solid ${col.border}`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:col.color,cursor:st==="free"?"pointer":"not-allowed",transition:"all .15s"}}
                  title={st==="reserved"?"Reserved – pending payment":st==="booked"?"Booked":""}>
                  {n}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10,marginTop:12,fontSize:10,flexWrap:"wrap"}}>
        <span style={{color:C.amber}}>■ Yours</span>
        <span style={{color:C.orange}}>■ Reserved</span>
        <span style={{color:C.red}}>■ Booked</span>
        <span style={{color:C.navyBorder}}>■ Free</span>
      </div>
    </div>
  );
};

// ─── COUNTDOWN ───────────────────────────────────────────────────────
const CountdownTimer=({departure})=>{
  const {str,urgent,boarding}=useCountdown(departure);
  if(str==="Departed") return <span style={{color:C.textMuted,fontSize:13}}>Departed</span>;
  return(
    <div>
      {boarding&&<div style={{fontSize:10,color:C.orange,fontWeight:700,animation:"pulse 1s infinite",marginBottom:2}}>🔴 Boarding Soon</div>}
      <div className={urgent?"pulse-timer ral":"ral"} style={{fontWeight:800,fontSize:urgent?19:17,color:boarding?C.orange:urgent?C.amber:C.white,letterSpacing:2}}>
        {str}
      </div>
      <div style={{fontSize:10,color:C.textMuted,marginTop:1}}>until departure</div>
    </div>
  );
};

// ─── TRIP CARD ────────────────────────────────────────────────────────
const TripCard=({trip,onBook,store,i=0})=>{
  const route=store.getRoute(trip.route_id);
  const {urgent,boarding}=useCountdown(trip.departure_time);
  const avail=store.seatsAvailable(trip);
  const pct=Math.round(((trip.capacity-avail)/trip.capacity)*100);
  const isFull=avail<=0;
  return(
    <div className={urgent&&!isFull?"urgent-card":""} style={{background:isFull?C.navyLight:C.card,border:`1.5px solid ${boarding?C.orange:urgent?C.amber+"66":C.navyBorder}`,borderRadius:18,padding:22,animation:`fadeUp ${.25+i*.08}s ease`,transition:"all .2s",position:"relative",overflow:"hidden"}}
      onMouseEnter={e=>{if(!isFull){e.currentTarget.style.borderColor=C.amber;e.currentTarget.style.transform="translateY(-3px)";}}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=boarding?C.orange:urgent?C.amber+"66":C.navyBorder;e.currentTarget.style.transform="";}}>
      {boarding&&!isFull&&<div style={{position:"absolute",top:0,right:0,background:`linear-gradient(135deg,${C.orange},${C.amberDark})`,color:"#fff",fontSize:10,fontWeight:800,padding:"4px 12px",borderRadius:"0 16px 0 10px"}}>BOARDING SOON</div>}
      {isFull&&<div style={{position:"absolute",top:0,right:0,background:C.red,color:"#fff",fontSize:10,fontWeight:800,padding:"4px 12px",borderRadius:"0 16px 0 10px"}}>FULLY BOOKED</div>}
      <div style={{marginBottom:12}}>
        <div className="ral" style={{fontWeight:800,fontSize:20}}>{route.origin} → {route.destination}</div>
        <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{trip.vehicle_reg} · {Math.floor(route.duration_minutes/60)}h {route.duration_minutes%60}m</div>
      </div>
      <div style={{display:"flex",gap:18,alignItems:"flex-start",marginBottom:14,flexWrap:"wrap"}}>
        <div><div style={{fontSize:10,color:C.textMuted}}>DEPARTURE</div><div className="ral" style={{fontWeight:800,fontSize:22,color:C.amber}}>{formatTime(trip.departure_time)}</div></div>
        <div><div style={{fontSize:10,color:C.textMuted}}>COUNTDOWN</div><CountdownTimer departure={trip.departure_time}/></div>
        <div><div style={{fontSize:10,color:C.textMuted}}>FARE</div><div className="ral" style={{fontWeight:800,fontSize:18,color:C.green}}>{formatUGX(route.price)}</div></div>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textMuted,marginBottom:4}}>
          <span>{isFull?"No seats available":`${avail} seats remaining`}</span><span>{pct}% full</span>
        </div>
        <div style={{height:5,background:C.navyLight,borderRadius:3}}>
          <div style={{width:`${pct}%`,height:"100%",background:isFull?C.red:pct>80?C.orange:pct>50?C.amber:C.green,borderRadius:3}}/>
        </div>
      </div>
      {isFull?(
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>onBook(trip,"next")} style={{flex:1,padding:"9px 10px",fontSize:12}}>Next Van →</Btn>
          <Btn onClick={()=>onBook(null,"all")} variant="navy" style={{flex:1,padding:"9px 10px",fontSize:12,border:`1px solid ${C.navyBorder}`}}>All Trips</Btn>
        </div>
      ):(
        <Btn onClick={()=>onBook(trip)} full style={{padding:"11px",fontSize:14}}>🎫 BOOK NOW</Btn>
      )}
    </div>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────
const StatCard=({label,value,icon,color=C.amber,sub})=>(
  <div style={{background:C.card,border:`1px solid ${C.navyBorder}`,borderRadius:16,padding:18,flex:1,minWidth:140}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
      <span style={{fontSize:22}}>{icon}</span>
      <span className="ral" style={{fontSize:21,fontWeight:800,color}}>{value}</span>
    </div>
    <div style={{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:".5px"}}>{label}</div>
    {sub&&<div style={{fontSize:11,color:C.green,marginTop:3}}>{sub}</div>}
  </div>
);

// ─── NAVIGATION ───────────────────────────────────────────────────────
const Nav=({page,setPage,currentUser})=>{
  const links=[{id:"home",label:"Home"},{id:"schedule",label:"Schedule"},{id:"book",label:"Book Now"},{id:"plan",label:"Plan Journey"},{id:"parcel",label:"Courier"},{id:"safety",label:"Safety"},{id:"faq",label:"FAQ"}];
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:C.navy+"ee",backdropFilter:"blur(14px)",borderBottom:`1px solid ${C.navyBorder}`}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 20px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div onClick={()=>setPage("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🚐</div>
          <div>
            <div className="ral" style={{fontWeight:900,fontSize:17,letterSpacing:"-0.5px",lineHeight:1}}>RAYLANE<span style={{color:C.amber}}>EXPRESS</span></div>
            <div style={{fontSize:9,color:C.textMuted,letterSpacing:2}}>TRANSPORT SERVICES</div>
          </div>
        </div>
        <div style={{display:"flex",gap:2,alignItems:"center",flexWrap:"wrap"}}>
          {links.map(l=>(
            <button key={l.id} onClick={()=>setPage(l.id)} style={{background:page===l.id?C.amber+"22":"transparent",color:page===l.id?C.amber:C.textSecondary,border:page===l.id?`1px solid ${C.amber}44`:"1px solid transparent",borderRadius:8,padding:"6px 11px",cursor:"pointer",fontSize:12,fontFamily:"'Nunito',sans-serif",fontWeight:600,transition:"all .2s"}}>
              {l.label}
            </button>
          ))}
          <div style={{width:1,height:20,background:C.navyBorder,margin:"0 6px"}}/>
          {currentUser?(
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:12,color:C.amber,fontWeight:700}}>👤 {currentUser.name}</span>
              <Btn onClick={()=>setPage("logout")} variant="navy" style={{padding:"6px 14px",fontSize:11,border:`1px solid ${C.navyBorder}`}}>Logout</Btn>
            </div>
          ):(
            <Btn onClick={()=>setPage("login")} variant="navy" style={{padding:"7px 16px",fontSize:12,border:`1px solid ${C.navyBorder}`}}>Login / Register</Btn>
          )}
        </div>
      </div>
    </nav>
  );
};

// ─── FAQ ITEM ─────────────────────────────────────────────────────────
const FAQItem=({f})=>{
  const [open,setOpen]=useState(false);
  return(
    <div style={{border:`1px solid ${open?C.amber+"44":C.navyBorder}`,borderRadius:12,marginBottom:10,overflow:"hidden",transition:"border .2s"}}>
      <div onClick={()=>setOpen(!open)} style={{padding:"14px 18px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:open?C.amber+"11":C.card}}>
        <span style={{fontWeight:600,fontSize:14}}>{f.q}</span>
        <span style={{color:C.amber,fontWeight:800,fontSize:18,transform:open?"rotate(45deg)":"rotate(0)",transition:"transform .2s"}}>+</span>
      </div>
      {open&&<div style={{padding:"0 18px 14px",background:C.card,fontSize:13,color:C.textSecondary,lineHeight:1.8,animation:"fadeUp .2s ease"}}>{f.a}</div>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PAGE: HOME
// ═══════════════════════════════════════════════════════════════════════
const HomePage=({setPage,setPreselectedTrip,store})=>{
  const handleBook=(trip,mode)=>{
    if(mode==="all"){setPage("schedule");return;}
    if(mode==="next"){
      const r=store.getRoute(trip.route_id);
      const next=store.trips.find(t=>t.route_id===r.id&&store.seatsAvailable(t)>0&&t.id!==trip.id);
      if(next){setPreselectedTrip(next);setPage("book");return;}
      setPage("schedule");return;
    }
    setPreselectedTrip(trip);setPage("book");
  };
  const approved=store.feedback.filter(f=>f.status==="approved");

  return(
    <div style={{minHeight:"100vh",paddingTop:64}}>
      {/* HERO */}
      <div style={{position:"relative",background:`linear-gradient(150deg,${C.navy} 0%,${C.navyMid} 60%,${C.navy} 100%)`,padding:"80px 20px 60px",overflow:"hidden",minHeight:480,display:"flex",alignItems:"center"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle at 15% 50%,${C.amber}0A,transparent 55%),radial-gradient(circle at 85% 30%,${C.blue}0A,transparent 50%)`}}/>
        <div style={{position:"absolute",right:-80,top:"50%",transform:"translateY(-50%)",width:480,height:480,borderRadius:"50%",border:`2px solid ${C.navyBorder}`,opacity:.4,pointerEvents:"none"}}/>
        <div style={{position:"absolute",right:20,top:"50%",transform:"translateY(-50%)",width:320,height:320,borderRadius:"50%",border:`2px solid ${C.navyBorder}`,opacity:.25,pointerEvents:"none"}}/>
        <div style={{maxWidth:1200,margin:"0 auto",position:"relative",width:"100%"}}>
          <div style={{maxWidth:640,animation:"fadeUp .5s ease"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:C.green+"22",border:`1px solid ${C.green}44`,borderRadius:20,padding:"5px 14px",marginBottom:20,fontSize:12,color:C.green,fontWeight:700}}>
              <span className="live-dot"/> Live · {store.trips.filter(t=>store.seatsAvailable(t)>0).length} trips available today
            </div>
            <h1 className="ral" style={{fontSize:"clamp(38px,6vw,70px)",fontWeight:900,lineHeight:1.05,letterSpacing:"-2px",marginBottom:18}}>
              Travel Across<br/><span style={{color:C.amber}}>Uganda</span> With<br/>Confidence
            </h1>
            <p style={{fontSize:15,color:C.textSecondary,maxWidth:460,lineHeight:1.8,marginBottom:30}}>
              Fast, reliable transport from Kampala to every corner of Uganda. Book your seat in under 2 minutes.
            </p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:28}}>
              <Btn onClick={()=>setPage("book")} style={{fontSize:14,padding:"13px 28px"}}>🎫 Book Your Ride</Btn>
              <Btn onClick={()=>setPage("plan")} variant="navy" style={{fontSize:14,padding:"13px 24px",border:`1px solid ${C.navyBorder}`}}>📅 Plan Journey</Btn>
              <Btn onClick={()=>setPage("schedule")} variant="navy" style={{fontSize:14,padding:"13px 24px",border:`1px solid ${C.navyBorder}`}}>📋 View Schedule</Btn>
            </div>
            <div style={{display:"flex",gap:18,fontSize:12,color:C.textMuted,flexWrap:"wrap"}}>
              {[["💳","MTN & Airtel Money"],["💬","WhatsApp receipt"],["📦","Courier service"]].map(([ic,l])=>(
                <span key={l} style={{display:"flex",alignItems:"center",gap:5}}>{ic} {l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DEPARTURES BAR */}
      <div style={{background:C.navyMid,borderBottom:`1px solid ${C.navyBorder}`,padding:"11px 20px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span className="live-dot"/><span className="ral" style={{fontWeight:800,color:C.amber,fontSize:14}}>Today's Departures</span>
            <span style={{color:C.textMuted,fontSize:13}}>— {store.trips.length} trips scheduled</span>
          </div>
          <Btn onClick={()=>setPage("schedule")} variant="navy" style={{padding:"6px 14px",fontSize:11,border:`1px solid ${C.navyBorder}`}}>Full Schedule →</Btn>
        </div>
      </div>

      {/* TRIP CARDS */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:16}}>
          {store.trips.map((trip,i)=><TripCard key={trip.id} trip={trip} i={i} onBook={handleBook} store={store}/>)}
        </div>
      </div>

      {/* WHY RAYLANE */}
      <div style={{background:C.navyMid,borderTop:`1px solid ${C.navyBorder}`,borderBottom:`1px solid ${C.navyBorder}`}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"44px 20px"}}>
          <h2 className="ral" style={{fontSize:28,fontWeight:800,textAlign:"center",marginBottom:28}}>Why Choose Raylane Express?</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:18}}>
            {[{icon:"🛡️",title:"Safety First",desc:"Strict safety protocols on every trip."},{icon:"⚡",title:"Fast Booking",desc:"Book in under 2 minutes, ticket on WhatsApp."},{icon:"💺",title:"Comfortable Rides",desc:"Modern, clean vehicles for every journey."},{icon:"💳",title:"Mobile Money",desc:"Pay via MTN or Airtel Money instantly."}].map(f=>(
              <Card key={f.title} style={{textAlign:"center"}}>
                <div style={{fontSize:34,marginBottom:10}}>{f.icon}</div>
                <div className="ral" style={{fontWeight:700,fontSize:15,marginBottom:6}}>{f.title}</div>
                <p style={{fontSize:12,color:C.textMuted,lineHeight:1.7}}>{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ROUTES */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"44px 20px"}}>
        <h2 className="ral" style={{fontSize:26,fontWeight:800,marginBottom:6}}>Our Routes</h2>
        <p style={{color:C.textMuted,fontSize:13,marginBottom:22}}>Daily departures from Kampala</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:11}}>
          {ROUTES.map(r=>(
            <div key={r.id} onClick={()=>setPage("book")} style={{background:C.card,border:`1px solid ${C.navyBorder}`,borderRadius:14,padding:"14px 16px",cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.amber+"66";e.currentTarget.style.background=C.cardHover;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.navyBorder;e.currentTarget.style.background=C.card;}}>
              <div style={{fontSize:11,color:C.textMuted}}>Kampala →</div>
              <div className="ral" style={{fontWeight:800,fontSize:17,margin:"4px 0 8px"}}>{r.destination}</div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{color:C.amber,fontWeight:700,fontSize:13}}>{formatUGX(r.price)}</span>
                <span style={{color:C.textMuted,fontSize:11}}>{Math.floor(r.duration_minutes/60)}h {r.duration_minutes%60}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOMER REVIEWS */}
      <div style={{background:C.navyMid,borderTop:`1px solid ${C.navyBorder}`,borderBottom:`1px solid ${C.navyBorder}`}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"48px 20px"}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <h2 className="ral" style={{fontSize:28,fontWeight:800,marginBottom:6}}>What Passengers Say</h2>
            <p style={{color:C.textMuted,fontSize:13}}>Real reviews from our customers</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:16,marginBottom:32}}>
            {approved.map((f,i)=>(
              <Card key={f.id} style={{animation:`fadeUp ${.15+i*.07}s ease`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <div><div className="ral" style={{fontWeight:700,fontSize:14}}>{f.name}</div><div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{f.route} · {f.date}</div></div>
                  <Stars rating={f.rating} size={13}/>
                </div>
                <p style={{fontSize:13,color:C.textSecondary,lineHeight:1.7,fontStyle:"italic"}}>"{f.message}"</p>
              </Card>
            ))}
          </div>
          <FeedbackForm/>
        </div>
      </div>

      {/* FAQ PREVIEW */}
      <div style={{maxWidth:780,margin:"0 auto",padding:"48px 20px"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <h2 className="ral" style={{fontSize:26,fontWeight:800,marginBottom:6}}>Frequently Asked Questions</h2>
        </div>
        {FAQ_DATA.slice(0,4).map((f,i)=><FAQItem key={i} f={f}/>)}
        <div style={{textAlign:"center",marginTop:20}}>
          <Btn onClick={()=>setPage("faq")} variant="navy" style={{border:`1px solid ${C.navyBorder}`}}>View All FAQs →</Btn>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:C.navyMid,borderTop:`1px solid ${C.navyBorder}`,padding:"36px 20px 18px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:28,marginBottom:28}}>
            <div>
              <div className="ral" style={{fontWeight:900,fontSize:15,marginBottom:12}}>RAYLANE<span style={{color:C.amber}}>EXPRESS</span></div>
              <p style={{fontSize:12,color:C.textMuted,lineHeight:1.8}}>Safe, reliable transport across Uganda since 2018.</p>
            </div>
            {[{title:"Services",links:["Book a Seat","Plan Journey","Hire a Van","Courier/Parcel"]},{title:"Support",links:["Safety Guidelines","FAQ","Contact Us","Lost & Found"]},{title:"Contact",links:["+256 700 000000","info@raylane.ug","Nakasero, Kampala","Mon–Sun 5AM–10PM"]}].map(col=>(
              <div key={col.title}>
                <div className="ral" style={{fontWeight:800,fontSize:11,letterSpacing:".5px",color:C.amber,marginBottom:12}}>{col.title}</div>
                {col.links.map(l=><div key={l} style={{fontSize:12,color:C.textMuted,marginBottom:7,cursor:"pointer"}}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{borderTop:`1px solid ${C.navyBorder}`,paddingTop:16,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,fontSize:11,color:C.textMuted}}>
            <span>© 2026 Raylane Express Ltd. All rights reserved.</span>
            <span>Privacy · Terms · Refunds</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ─── FEEDBACK FORM ────────────────────────────────────────────────────
const FeedbackForm=({store,onSubmit})=>{
  const [form,setForm]=useState({name:"",route:"",rating:5,message:""});
  const [done,setDone]=useState(false);
  const handle=()=>{if(!form.name||!form.message)return;onSubmit&&onSubmit({...form,date:new Date().toISOString().split("T")[0],status:"pending"});setDone(true);};
  if(done) return(
    <Card style={{maxWidth:520,margin:"0 auto",textAlign:"center",border:`1px solid ${C.green}44`,background:C.green+"11"}}>
      <div style={{fontSize:38,marginBottom:10}}>✅</div>
      <div className="ral" style={{fontWeight:800,fontSize:17,color:C.green,marginBottom:6}}>Thank You!</div>
      <p style={{fontSize:13,color:C.textMuted}}>Your review is awaiting admin approval before it appears on the site.</p>
    </Card>
  );
  return(
    <Card style={{maxWidth:520,margin:"0 auto",border:`1px solid ${C.amber}33`}}>
      <h3 className="ral" style={{fontWeight:800,fontSize:17,marginBottom:4}}>Share Your Experience</h3>
      <p style={{fontSize:12,color:C.textMuted,marginBottom:18}}>Reviews appear after admin approval.</p>
      <div style={{display:"flex",flexDirection:"column",gap:13}}>
        <Input label="Your Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Sarah Nakato" required/>
        <Sel label="Route Travelled" value={form.route} onChange={e=>setForm({...form,route:e.target.value})} options={[{value:"",label:"Select your route"},...ROUTES.map(r=>({value:`${r.origin} → ${r.destination}`,label:`${r.origin} → ${r.destination}`}))]}/>
        <div><label style={{fontSize:11,color:C.textSecondary,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase",display:"block",marginBottom:8}}>Rating</label><Stars rating={form.rating} onChange={r=>setForm({...form,rating:r})} size={26}/></div>
        <Textarea label="Your Review" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell us about your journey..."/>
        <div style={{background:C.navyLight,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.textMuted}}>🔒 Reviews are moderated before publishing.</div>
        <Btn onClick={handle} disabled={!form.name||!form.message} full style={{padding:"12px"}}>Submit Review</Btn>
      </div>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PAGE: SCHEDULE
// ═══════════════════════════════════════════════════════════════════════
const SchedulePage=({setPage,setPreselectedTrip,store})=>{
  const [filter,setFilter]=useState("all");
  const filtered=store.trips.filter(t=>filter==="all"||store.getRoute(t.route_id).destination===filter);
  return(
    <div style={{minHeight:"100vh",paddingTop:80,maxWidth:1100,margin:"0 auto",padding:"80px 20px 40px"}}>
      <h1 className="ral" style={{fontSize:30,fontWeight:800,marginBottom:6}}>Trip Schedule</h1>
      <p style={{color:C.textMuted,marginBottom:22,fontSize:13}}>All departures from Kampala · Live countdown timers</p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:22}}>
        {["all",...new Set(ROUTES.map(r=>r.destination))].map(d=>(
          <button key={d} onClick={()=>setFilter(d)} style={{background:filter===d?C.amber:C.card,color:filter===d?"#0D1B3E":C.textSecondary,border:`1px solid ${filter===d?C.amber:C.navyBorder}`,borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:filter===d?800:400,fontFamily:"'Raleway',sans-serif",transition:"all .2s"}}>
            {d==="all"?"All Routes":d}
          </button>
        ))}
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:C.navyMid,borderBottom:`1px solid ${C.navyBorder}`}}>
              {["Route","Departs","Countdown","Seats","Fare","Status",""].map(h=>(
                <th key={h} style={{padding:"13px 16px",textAlign:"left",fontSize:11,color:C.textMuted,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(trip=>{
                const route=store.getRoute(trip.route_id);
                const {str,urgent,boarding}=useCountdown(trip.departure_time);
                const avail=store.seatsAvailable(trip); const isFull=avail<=0;
                return(
                  <tr key={trip.id} style={{borderBottom:`1px solid ${C.navyBorder}`,background:boarding&&!isFull?C.orange+"08":"transparent",transition:"background .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.navyMid}
                    onMouseLeave={e=>e.currentTarget.style.background=boarding&&!isFull?C.orange+"08":"transparent"}>
                    <td style={{padding:"13px 16px"}}><div className="ral" style={{fontWeight:700}}>{route.origin} → {route.destination}</div></td>
                    <td style={{padding:"13px 16px"}}><div className="ral" style={{fontWeight:800,color:C.amber,fontSize:17}}>{formatTime(trip.departure_time)}</div></td>
                    <td style={{padding:"13px 16px"}}><span className="ral" style={{fontWeight:800,color:boarding?C.orange:urgent?C.amber:C.white,fontSize:14}}>{str}</span>{boarding&&<div style={{fontSize:10,color:C.orange}}>Boarding!</div>}</td>
                    <td style={{padding:"13px 16px"}}><span style={{color:isFull?C.red:avail<5?C.orange:C.green,fontWeight:700}}>{isFull?"FULL":avail}</span></td>
                    <td style={{padding:"13px 16px"}}><span className="ral" style={{fontWeight:700,color:C.amber}}>{formatUGX(route.price)}</span></td>
                    <td style={{padding:"13px 16px"}}><StatusBadge status={trip.status}/></td>
                    <td style={{padding:"13px 16px"}}>
                      {isFull?<Btn variant="navy" style={{padding:"6px 12px",fontSize:11,border:`1px solid ${C.navyBorder}`}}>Next Van</Btn>:
                      <Btn onClick={()=>{setPreselectedTrip(trip);setPage("book");}} style={{padding:"6px 14px",fontSize:12}}>Book</Btn>}
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
// PAGE: BOOKING (Today / Same-day)
// ═══════════════════════════════════════════════════════════════════════
const BookingPage=({preselectedTrip,store,currentUser})=>{
  const [step,setStep]=useState(preselectedTrip?2:1);
  const [trip,setTrip]=useState(preselectedTrip||null);
  const [seats,setSeats]=useState([]);
  const [promoCode,setPromoCode]=useState(""); const [promoApplied,setPromoApplied]=useState(null);
  const [payMethod,setPayMethod]=useState("mtn");
  const [payStatus,setPayStatus]=useState("idle"); // idle | submitting | submitted | confirmed
  const [form,setForm]=useState({name:currentUser?.name||"",phone:currentUser?.phone||"",email:"",accessibility:false,assistanceDetail:""});
  const [confirmed,setConfirmed]=useState(null);

  useEffect(()=>{if(preselectedTrip){setTrip(preselectedTrip);setStep(2);}}, [preselectedTrip]);

  const route   = trip?store.getRoute(trip.route_id):{};
  const bookedS = trip?trip.seats_booked:[];
  const reservedS=trip?store.reservations.filter(r=>r.trip_id===trip.id&&r.status==="reserved").map(r=>r.seat):[];

  const applyPromo=()=>{
    const p=store.promotions.find(pr=>pr.code.toUpperCase()===promoCode.toUpperCase()&&pr.active&&(!pr.route_id||pr.route_id===trip?.route_id));
    setPromoApplied(p||null);
  };

  const baseAmount = route.price?route.price*seats.length:0;
  const discount   = promoApplied?promoApplied.type==="percent"?Math.round(baseAmount*promoApplied.discount/100):promoApplied.discount:0;
  const totalAmount= Math.max(0,baseAmount-discount);

  const handlePay=()=>{
    setPayStatus("submitting");
    setTimeout(()=>setPayStatus("submitted"),1500);
  };

  const handleConfirm=()=>{
    const code=genCode();
    store.addBooking({booking_code:code,passenger:form.name,phone:form.phone,route:`${route.origin} → ${route.destination}`,route_id:route.id,seats,trip_id:trip.id,amount:totalAmount,payment_status:"confirmed",status:"confirmed",date:new Date().toISOString().split("T")[0],agent_id:null,is_advance:false});
    setConfirmed({code,passenger:form.name,phone:form.phone,route:`${route.origin} → ${route.destination}`,seats,departure:formatTime(trip.departure_time),amount:totalAmount,vehicle:trip.vehicle_reg});
    setStep(5);
  };

  const TERMS=["Arrive 20 minutes before departure.","10kg luggage free per passenger.","Extra luggage charged by weight.","Ticket valid for scheduled trip only.","QR code required for boarding."];

  return(
    <div style={{minHeight:"100vh",paddingTop:80,maxWidth:900,margin:"0 auto",padding:"80px 20px 40px"}}>
      <h1 className="ral" style={{fontSize:30,fontWeight:800,marginBottom:4}}>Book Your Seat</h1>
      {/* Step indicator */}
      <div style={{display:"flex",alignItems:"center",gap:0,marginTop:18,marginBottom:28,flexWrap:"wrap",gap:4}}>
        {["Trip","Seats","Details","Payment","Done"].map((s,i)=>(
          <div key={s} style={{display:"flex",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:step>i+1?C.green:step===i+1?C.amber:C.card,border:`2px solid ${step>i+1?C.green:step===i+1?C.amber:C.navyBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:step>=i+1?"#0D1B3E":C.textMuted,transition:"all .3s"}}>{step>i+1?"✓":i+1}</div>
              <span style={{fontSize:12,color:step===i+1?C.white:C.textMuted,fontWeight:step===i+1?700:400}}>{s}</span>
            </div>
            {i<4&&<div style={{width:24,height:1,background:step>i+1?C.green:C.navyBorder,margin:"0 6px"}}/>}
          </div>
        ))}
      </div>

      <div style={{background:C.amber+"11",border:`1px solid ${C.amber}44`,borderRadius:10,padding:"9px 14px",marginBottom:20,fontSize:12,color:C.amber}}>
        🧳 <b>Luggage Policy:</b> 10kg free per passenger. Additional weight may be charged.
      </div>

      {/* Step 1 — Trip Selection */}
      {step===1&&(
        <div style={{animation:"fadeUp .3s ease"}}>
          <div style={{display:"grid",gap:11}}>
            {store.trips.map(t=>{
              const r=store.getRoute(t.route_id);
              const avail=store.seatsAvailable(t); const isFull=avail<=0;
              const isSel=trip?.id===t.id;
              return(
                <div key={t.id} onClick={()=>!isFull&&setTrip(t)} style={{background:C.card,border:`2px solid ${isSel?C.amber:isFull?C.red+"33":C.navyBorder}`,borderRadius:15,padding:"16px 18px",cursor:isFull?"not-allowed":"pointer",transition:"all .2s",opacity:isFull?.55:1,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                  <div><div className="ral" style={{fontWeight:800,fontSize:17}}>{r.origin} → {r.destination}</div><div style={{color:C.textMuted,fontSize:11,marginTop:2}}>{t.vehicle_reg}{isFull&&<span style={{color:C.red,marginLeft:8}}>● Fully Booked</span>}</div></div>
                  <div style={{display:"flex",gap:18,alignItems:"center"}}>
                    <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.textMuted}}>Departs</div><div className="ral" style={{fontWeight:800,fontSize:20,color:C.amber}}>{formatTime(t.departure_time)}</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.textMuted}}>Seats</div><div style={{fontWeight:700,color:isFull?C.red:C.green}}>{isFull?"FULL":avail}</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.textMuted}}>Fare</div><div className="ral" style={{fontWeight:700,color:C.amber}}>{formatUGX(r.price)}</div></div>
                    {isSel&&<div style={{width:22,height:22,borderRadius:"50%",background:C.amber,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#0D1B3E"}}>✓</div>}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:18}}><Btn onClick={()=>setStep(2)} disabled={!trip}>Next: Choose Seats →</Btn></div>
        </div>
      )}

      {/* Step 2 — Seat Selection */}
      {step===2&&trip&&(
        <div style={{animation:"fadeUp .3s ease",display:"flex",gap:24,flexWrap:"wrap"}}>
          <div><h3 className="ral" style={{fontWeight:800,marginBottom:14}}>Choose Your Seats</h3><SeatMap capacity={14} bookedSeats={bookedS} reservedSeats={reservedS} selected={seats} onSelect={n=>setSeats(prev=>prev.includes(n)?prev.filter(s=>s!==n):[...prev,n])}/></div>
          <div style={{flex:1,minWidth:190}}>
            <Card>
              <h3 className="ral" style={{fontWeight:700,marginBottom:14}}>Summary</h3>
              <div className="ral" style={{fontWeight:800,fontSize:16,marginBottom:4}}>{route.origin} → {route.destination}</div>
              <div style={{color:C.textMuted,fontSize:12,marginBottom:14}}>{formatDate(trip.departure_time)} · {formatTime(trip.departure_time)}</div>
              {[["Seats selected",seats.length>0?seats.join(", "):"—"],["Per seat",formatUGX(route.price)],].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}><span style={{color:C.textMuted}}>{k}</span><span>{v}</span></div>
              ))}
              <div style={{borderTop:`1px solid ${C.navyBorder}`,paddingTop:8,display:"flex",justifyContent:"space-between"}}>
                <span className="ral" style={{fontWeight:800}}>Total</span>
                <span className="ral" style={{fontWeight:800,fontSize:17,color:C.green}}>{formatUGX(route.price*seats.length)}</span>
              </div>
            </Card>
          </div>
          <div style={{width:"100%",display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn onClick={()=>setStep(1)} variant="navy" style={{border:`1px solid ${C.navyBorder}`}}>← Back</Btn>
            <Btn onClick={()=>setStep(3)} disabled={seats.length===0}>Next: Details →</Btn>
          </div>
        </div>
      )}

      {/* Step 3 — Passenger Details */}
      {step===3&&(
        <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:18}}>
          <Card>
            <h3 className="ral" style={{fontWeight:800,marginBottom:18}}>Passenger Information</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{gridColumn:"1/-1"}}><Input label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Sarah Nakato" required/></div>
              <Input label="Phone Number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+256 7XX XXX XXX" required/>
              <Input label="Email (optional)" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@example.com"/>
            </div>
            <div style={{marginTop:16,padding:14,background:C.navyMid,borderRadius:12,border:`1px solid ${C.navyBorder}`}}>
              <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:14}}>
                <input type="checkbox" checked={form.accessibility} onChange={e=>setForm({...form,accessibility:e.target.checked})} style={{width:17,height:17}}/>
                <span style={{fontWeight:600}}>I require special assistance during boarding</span>
              </label>
              {form.accessibility&&(
                <div style={{marginTop:12,animation:"fadeUp .2s ease"}}>
                  <Input label="Describe assistance needed" value={form.assistanceDetail} onChange={e=>setForm({...form,assistanceDetail:e.target.value})} placeholder="e.g. Wheelchair assistance, elderly boarding, visual impairment"/>
                </div>
              )}
            </div>
          </Card>
          {/* Promo code */}
          <Card style={{padding:16}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
              <div style={{flex:1}}><Input label="Promo Code (optional)" value={promoCode} onChange={e=>setPromoCode(e.target.value.toUpperCase())} placeholder="e.g. JINJA10"/></div>
              <Btn onClick={applyPromo} variant="navy" style={{border:`1px solid ${C.navyBorder}`,padding:"11px 18px"}}>Apply</Btn>
            </div>
            {promoApplied&&<div style={{marginTop:8,fontSize:12,color:C.green}}>✓ "{promoApplied.description}" — saving {promoApplied.type==="percent"?`${promoApplied.discount}%`:formatUGX(promoApplied.discount)}</div>}
            {promoCode&&!promoApplied&&<div style={{marginTop:8,fontSize:12,color:C.red}}>Code not valid for this route.</div>}
          </Card>
          <Card style={{background:C.navyLight}}>
            <h3 className="ral" style={{fontWeight:700,fontSize:13,marginBottom:10}}>Travel Terms & Conditions</h3>
            {TERMS.map((t,i)=><div key={i} style={{fontSize:12,color:C.textMuted,marginBottom:5}}>{i+1}. {t}</div>)}
          </Card>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn onClick={()=>setStep(2)} variant="navy" style={{border:`1px solid ${C.navyBorder}`}}>← Back</Btn>
            <Btn onClick={()=>setStep(4)} disabled={!form.name||!form.phone}>Next: Payment →</Btn>
          </div>
        </div>
      )}

      {/* Step 4 — Payment */}
      {step===4&&(
        <div style={{animation:"fadeUp .3s ease"}}>
          <Card style={{maxWidth:480,margin:"0 auto"}}>
            <h3 className="ral" style={{fontWeight:800,marginBottom:18}}>Payment</h3>
            <div style={{background:C.navyMid,borderRadius:12,padding:16,marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}><span style={{color:C.textMuted}}>Route</span><span style={{fontWeight:700}}>{route.origin} → {route.destination}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}><span style={{color:C.textMuted}}>Seats</span><span>{seats.join(", ")}</span></div>
              {promoApplied&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}><span style={{color:C.textMuted}}>Discount</span><span style={{color:C.green}}>-{formatUGX(discount)}</span></div>}
              <div style={{borderTop:`1px solid ${C.navyBorder}`,paddingTop:8,display:"flex",justifyContent:"space-between"}}>
                <span className="ral" style={{fontWeight:800}}>Total Due</span>
                <span className="ral" style={{fontWeight:800,fontSize:20,color:C.amber}}>{formatUGX(totalAmount)}</span>
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:11,color:C.textSecondary,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase",display:"block",marginBottom:10}}>Payment Method</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                {[{id:"mtn",label:"MTN MoMo",icon:"📱"},{id:"airtel",label:"Airtel Money",icon:"📲"},{id:"cash",label:"Cash (Agent)",icon:"💵"}].map(m=>(
                  <div key={m.id} onClick={()=>setPayMethod(m.id)} style={{background:payMethod===m.id?C.amber+"22":C.navyMid,border:`1.5px solid ${payMethod===m.id?C.amber:C.navyBorder}`,borderRadius:10,padding:"12px 8px",textAlign:"center",cursor:"pointer",transition:"all .2s"}}>
                    <div style={{fontSize:20,marginBottom:4}}>{m.icon}</div>
                    <div style={{fontSize:11,fontWeight:700,color:payMethod===m.id?C.amber:C.textMuted}}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {payStatus==="idle"&&(
              <>
                {(payMethod==="mtn"||payMethod==="airtel")&&(
                  <div style={{background:C.navyMid,borderRadius:10,padding:14,marginBottom:14,fontSize:12,color:C.textMuted}}>
                    <div style={{fontWeight:700,color:C.white,marginBottom:6}}>Payment Instructions:</div>
                    <div>1. Dial {payMethod==="mtn"?"*165#":"*185#"} on your phone</div>
                    <div>2. Select "Pay Bill"</div>
                    <div>3. Enter merchant code: <strong style={{color:C.amber}}>12345</strong></div>
                    <div>4. Enter amount: <strong style={{color:C.amber}}>{formatUGX(totalAmount)}</strong></div>
                    <div>5. Enter your PIN and confirm</div>
                  </div>
                )}
                <Btn onClick={handlePay} full style={{padding:"13px"}}>Submit Payment</Btn>
              </>
            )}
            {payStatus==="submitting"&&<div style={{textAlign:"center",padding:20,color:C.textMuted,fontSize:13}}>⏳ Processing payment...</div>}
            {payStatus==="submitted"&&(
              <div style={{animation:"fadeUp .3s ease"}}>
                <div style={{background:C.amber+"22",border:`1px solid ${C.amber}44`,borderRadius:10,padding:14,marginBottom:14,fontSize:12,color:C.amber,textAlign:"center"}}>
                  ✓ Payment submitted. Awaiting confirmation...
                </div>
                <Btn onClick={handleConfirm} full style={{padding:"13px"}}>✓ Confirm Booking</Btn>
              </div>
            )}
          </Card>
          <div style={{display:"flex",justifyContent:"center",marginTop:14}}>
            <Btn onClick={()=>setStep(3)} variant="navy" style={{border:`1px solid ${C.navyBorder}`}}>← Back</Btn>
          </div>
        </div>
      )}

      {/* Step 5 — Confirmed */}
      {step===5&&confirmed&&(
        <div style={{animation:"fadeUp .4s ease",textAlign:"center"}}>
          <div style={{fontSize:52,marginBottom:12}}>🎉</div>
          <h2 className="ral" style={{fontSize:26,fontWeight:900,marginBottom:6}}>Booking Confirmed!</h2>
          <p style={{color:C.textMuted,marginBottom:28}}>Ticket sent to {confirmed.phone} via WhatsApp</p>
          <div style={{maxWidth:420,margin:"0 auto"}}>
            <Card style={{textAlign:"left",border:`1px solid ${C.amber}44`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:14,marginBottom:14,borderBottom:`2px dashed ${C.navyBorder}`}}>
                <div><div style={{fontSize:10,color:C.textMuted,letterSpacing:1}}>BOOKING CODE</div><div className="ral" style={{fontWeight:900,fontSize:24,color:C.amber}}>{confirmed.code}</div></div>
                <QRCode value={confirmed.code}/>
              </div>
              {[["Passenger",confirmed.passenger],["Route",confirmed.route],["Departure",confirmed.departure],["Seats",confirmed.seats.join(", ")],["Vehicle",confirmed.vehicle],["Total Paid",formatUGX(confirmed.amount)]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:7}}><span style={{color:C.textMuted}}>{k}</span><span style={{fontWeight:700}}>{v}</span></div>
              ))}
              <div style={{background:C.navyLight,borderRadius:8,padding:10,margin:"10px 0",fontSize:11,color:C.textMuted}}>
                <div style={{fontWeight:700,color:C.white,marginBottom:4}}>TRAVEL TERMS</div>
                {TERMS.map((t,i)=><div key={i} style={{marginBottom:3}}>• {t}</div>)}
              </div>
              <div style={{background:C.green+"22",border:`1px solid ${C.green}44`,borderRadius:10,padding:10,fontSize:11,color:C.green,textAlign:"center"}}>
                ✓ QR Boarding Pass sent via WhatsApp to {confirmed.phone}
              </div>
            </Card>
            <div style={{display:"flex",gap:10,marginTop:16,justifyContent:"center"}}>
              <Btn variant="navy" style={{fontSize:12,border:`1px solid ${C.navyBorder}`}}>Download PDF</Btn>
              <Btn onClick={()=>window.location.reload()} style={{fontSize:12}}>Book Another</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PAGE: PLAN YOUR JOURNEY (Advance Booking)
// ═══════════════════════════════════════════════════════════════════════
const PlanJourneyPage=({store,currentUser})=>{
  const [form,setForm]=useState({origin:"Kampala",destination:"",date:"",time:"",passengers:"1",name:currentUser?.name||"",phone:currentUser?.phone||"",email:"",accessibility:false,assistanceDetail:""});
  const [selectedSeats,setSelectedSeats]=useState([]);
  const [promoCode,setPromoCode]=useState(""); const [promoApplied,setPromoApplied]=useState(null);
  const [payMethod,setPayMethod]=useState("mtn");
  const [step,setStep]=useState(1);
  const [submitted,setSubmitted]=useState(null);

  const route=ROUTES.find(r=>r.destination===form.destination)||null;
  const tomorrow=new Date(); tomorrow.setDate(tomorrow.getDate()+1);
  const maxDate=new Date(); maxDate.setDate(maxDate.getDate()+60);
  const minDateStr=tomorrow.toISOString().split("T")[0];
  const maxDateStr=maxDate.toISOString().split("T")[0];

  const baseAmount=route?route.price*parseInt(form.passengers||1):0;
  const discount=promoApplied?promoApplied.type==="percent"?Math.round(baseAmount*promoApplied.discount/100):promoApplied.discount:0;
  const totalAmount=Math.max(0,baseAmount-discount);

  const applyPromo=()=>{
    const p=store.promotions.find(pr=>pr.code.toUpperCase()===promoCode.toUpperCase()&&pr.active&&(!pr.route_id||pr.route_id===route?.id));
    setPromoApplied(p||null);
  };

  const handleSubmit=()=>{
    const code=genCode();
    store.addBooking({booking_code:code,passenger:form.name,phone:form.phone,route:route?`${route.origin} → ${route.destination}`:"",route_id:route?.id,seats:selectedSeats,trip_id:null,amount:totalAmount,payment_status:"pending",status:"advance",date:form.date,agent_id:null,is_advance:true});
    setSubmitted({code,name:form.name,route:route?`${route.origin} → ${route.destination}`:"",date:form.date,seats:selectedSeats,amount:totalAmount});
  };

  if(submitted) return(
    <div style={{minHeight:"100vh",paddingTop:80,maxWidth:560,margin:"0 auto",padding:"80px 20px 40px",textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:14}}>📅</div>
      <h2 className="ral" style={{fontSize:26,fontWeight:900,marginBottom:8}}>Advance Booking Submitted!</h2>
      <p style={{color:C.textMuted,marginBottom:28,lineHeight:1.7}}>Your booking is pending admin confirmation. You will receive a WhatsApp notification once confirmed and a vehicle is assigned.</p>
      <Card style={{textAlign:"left",border:`1px solid ${C.amber}44`}}>
        <div style={{marginBottom:14,paddingBottom:14,borderBottom:`2px dashed ${C.navyBorder}`}}>
          <div style={{fontSize:10,color:C.textMuted}}>BOOKING CODE</div>
          <div className="ral" style={{fontWeight:900,fontSize:24,color:C.amber}}>{submitted.code}</div>
        </div>
        {[["Passenger",submitted.name],["Route",submitted.route],["Travel Date",submitted.date],["Preferred Seats",submitted.seats.join(", ")||"Any available"],["Estimated Fare",formatUGX(submitted.amount)]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:7}}><span style={{color:C.textMuted}}>{k}</span><span style={{fontWeight:700}}>{v}</span></div>
        ))}
        <div style={{background:C.amber+"22",border:`1px solid ${C.amber}44`,borderRadius:10,padding:10,marginTop:12,fontSize:11,color:C.amber,textAlign:"center"}}>
          ⏳ Status: Pending Admin Confirmation
        </div>
      </Card>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",paddingTop:80,maxWidth:860,margin:"0 auto",padding:"80px 20px 40px"}}>
      <div style={{marginBottom:28}}>
        <h1 className="ral" style={{fontSize:30,fontWeight:800}}>Plan Your Journey</h1>
        <p style={{color:C.textMuted,fontSize:13,marginTop:4}}>Book in advance — up to 60 days ahead. Admin confirms and assigns your vehicle.</p>
      </div>
      <div style={{background:C.blue+"22",border:`1px solid ${C.blue}44`,borderRadius:10,padding:"10px 16px",marginBottom:22,fontSize:12,color:C.blue}}>
        📅 Advance bookings are held as <strong>Pending Confirmation</strong> until admin reviews, assigns a vehicle, and verifies payment.
      </div>

      {step===1&&(
        <div style={{animation:"fadeUp .3s ease"}}>
          <Card style={{marginBottom:18}}>
            <h3 className="ral" style={{fontWeight:800,marginBottom:18}}>Journey Details</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Sel label="From" required value={form.origin} onChange={e=>setForm({...form,origin:e.target.value})} options={[{value:"Kampala",label:"Kampala"}]}/>
              <Sel label="To" required value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})} options={[{value:"",label:"Select destination"},...ROUTES.map(r=>({value:r.destination,label:r.destination}))]}/>
              <Input label="Travel Date" type="date" required value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{minDate:minDateStr}} placeholder={minDateStr}/>
              <Sel label="Preferred Time (optional)" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} options={[{value:"",label:"Any time"},{value:"06:00",label:"06:00 AM"},{value:"08:00",label:"08:00 AM"},{value:"10:00",label:"10:00 AM"},{value:"12:00",label:"12:00 PM"},{value:"14:00",label:"02:00 PM"},{value:"16:00",label:"04:00 PM"}]}/>
              <Sel label="Number of Passengers" value={form.passengers} onChange={e=>setForm({...form,passengers:e.target.value})} options={["1","2","3","4","5"].map(v=>({value:v,label:`${v} passenger${v>1?"s":""}`}))}/>
              {route&&<div style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:C.green,fontWeight:700}}><span>💺</span>Estimated fare: {formatUGX(route.price)} per seat</div>}
            </div>
          </Card>
          <div style={{display:"flex",justifyContent:"flex-end"}}>
            <Btn onClick={()=>setStep(2)} disabled={!form.destination||!form.date}>Next: Select Seats →</Btn>
          </div>
        </div>
      )}

      {step===2&&(
        <div style={{animation:"fadeUp .3s ease"}}>
          <div style={{display:"flex",gap:24,flexWrap:"wrap",marginBottom:18}}>
            <div>
              <h3 className="ral" style={{fontWeight:800,marginBottom:14}}>Preferred Seats (optional)</h3>
              <p style={{fontSize:12,color:C.textMuted,marginBottom:12}}>Select preferred seats. Admin will confirm availability.</p>
              <SeatMap capacity={14} bookedSeats={[]} reservedSeats={[]} selected={selectedSeats} onSelect={n=>setSelectedSeats(prev=>prev.includes(n)?prev.filter(s=>s!==n):[...prev,n])}/>
            </div>
            <div style={{flex:1,minWidth:180}}>
              <Card>
                <h3 className="ral" style={{fontWeight:700,marginBottom:14}}>Booking Preview</h3>
                <div className="ral" style={{fontWeight:800,fontSize:16,marginBottom:4}}>{form.origin} → {form.destination}</div>
                <div style={{color:C.textMuted,fontSize:12,marginBottom:14}}>{form.date} · {form.time||"Any time"}</div>
                {[["Passengers",form.passengers],["Seats",selectedSeats.length?selectedSeats.join(", "):"Any available"]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}><span style={{color:C.textMuted}}>{k}</span><span>{v}</span></div>
                ))}
                <div style={{borderTop:`1px solid ${C.navyBorder}`,paddingTop:8,display:"flex",justifyContent:"space-between"}}>
                  <span className="ral" style={{fontWeight:700}}>Est. Total</span>
                  <span className="ral" style={{fontWeight:800,fontSize:17,color:C.green}}>{formatUGX(route?route.price*parseInt(form.passengers):0)}</span>
                </div>
              </Card>
            </div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn onClick={()=>setStep(1)} variant="navy" style={{border:`1px solid ${C.navyBorder}`}}>← Back</Btn>
            <Btn onClick={()=>setStep(3)}>Next: Your Details →</Btn>
          </div>
        </div>
      )}

      {step===3&&(
        <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:16}}>
          <Card>
            <h3 className="ral" style={{fontWeight:800,marginBottom:16}}>Passenger Details</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{gridColumn:"1/-1"}}><Input label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name" required/></div>
              <Input label="Phone Number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+256 7XX XXX XXX" required/>
              <Input label="Email (optional)" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@example.com"/>
            </div>
            <div style={{marginTop:14,padding:12,background:C.navyMid,borderRadius:12,border:`1px solid ${C.navyBorder}`}}>
              <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:13}}>
                <input type="checkbox" checked={form.accessibility} onChange={e=>setForm({...form,accessibility:e.target.checked})} style={{width:16,height:16}}/>
                <span style={{fontWeight:600}}>I require special assistance</span>
              </label>
              {form.accessibility&&(
                <div style={{marginTop:10}}>
                  <Input value={form.assistanceDetail} onChange={e=>setForm({...form,assistanceDetail:e.target.value})} placeholder="e.g. Wheelchair, elderly boarding..."/>
                </div>
              )}
            </div>
          </Card>
          <Card style={{padding:14}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
              <div style={{flex:1}}><Input label="Promo Code (optional)" value={promoCode} onChange={e=>setPromoCode(e.target.value.toUpperCase())} placeholder="e.g. JINJA10"/></div>
              <Btn onClick={applyPromo} variant="navy" style={{border:`1px solid ${C.navyBorder}`,padding:"11px 18px"}}>Apply</Btn>
            </div>
            {promoApplied&&<div style={{marginTop:6,fontSize:12,color:C.green}}>✓ Saving {promoApplied.type==="percent"?`${promoApplied.discount}%`:formatUGX(promoApplied.discount)}</div>}
          </Card>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn onClick={()=>setStep(2)} variant="navy" style={{border:`1px solid ${C.navyBorder}`}}>← Back</Btn>
            <Btn onClick={()=>setStep(4)} disabled={!form.name||!form.phone}>Next: Payment →</Btn>
          </div>
        </div>
      )}

      {step===4&&(
        <div style={{animation:"fadeUp .3s ease"}}>
          <Card style={{maxWidth:460,margin:"0 auto"}}>
            <h3 className="ral" style={{fontWeight:800,marginBottom:16}}>Advance Booking Payment</h3>
            <div style={{background:C.navyMid,borderRadius:10,padding:14,marginBottom:16,fontSize:12,color:C.textMuted,lineHeight:1.7}}>
              💡 For advance bookings, you may pay a deposit or full amount now. Full payment must be confirmed before vehicle assignment.
            </div>
            <div style={{background:C.navyLight,borderRadius:10,padding:14,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{color:C.textMuted}}>Route</span><span style={{fontWeight:700}}>{form.origin} → {form.destination}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{color:C.textMuted}}>Date</span><span>{form.date}</span></div>
              {promoApplied&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{color:C.textMuted}}>Discount</span><span style={{color:C.green}}>-{formatUGX(discount)}</span></div>}
              <div style={{borderTop:`1px solid ${C.navyBorder}`,paddingTop:8,display:"flex",justifyContent:"space-between"}}>
                <span className="ral" style={{fontWeight:800}}>Total</span>
                <span className="ral" style={{fontWeight:800,fontSize:20,color:C.amber}}>{formatUGX(totalAmount)}</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
              {[{id:"mtn",label:"MTN MoMo",icon:"📱"},{id:"airtel",label:"Airtel Money",icon:"📲"},{id:"cash",label:"Pay at Office",icon:"🏢"}].map(m=>(
                <div key={m.id} onClick={()=>setPayMethod(m.id)} style={{background:payMethod===m.id?C.amber+"22":C.navyMid,border:`1.5px solid ${payMethod===m.id?C.amber:C.navyBorder}`,borderRadius:10,padding:"11px 6px",textAlign:"center",cursor:"pointer",transition:"all .2s"}}>
                  <div style={{fontSize:18,marginBottom:4}}>{m.icon}</div>
                  <div style={{fontSize:10,fontWeight:700,color:payMethod===m.id?C.amber:C.textMuted}}>{m.label}</div>
                </div>
              ))}
            </div>
            <Btn onClick={handleSubmit} full style={{padding:"13px"}}>Submit Advance Booking →</Btn>
          </Card>
          <div style={{display:"flex",justifyContent:"center",marginTop:14}}>
            <Btn onClick={()=>setStep(3)} variant="navy" style={{border:`1px solid ${C.navyBorder}`}}>← Back</Btn>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PAGE: PARCEL
// ═══════════════════════════════════════════════════════════════════════
const ParcelPage=()=>{
  const [form,setForm]=useState({sender:"",senderPhone:"",receiver:"",receiverPhone:"",destination:"",description:"",weight:""});
  const [tracking,setTracking]=useState(""); const [trackResult,setTrackResult]=useState(null);
  const mock=[{code:"RX-P001",status:"active",location:"Nakasero Terminal",updated:"10:30 AM"},{code:"RX-P002",status:"confirmed",location:"Gulu",updated:"Yesterday 3PM"}];
  return(
    <div style={{minHeight:"100vh",paddingTop:80,maxWidth:900,margin:"0 auto",padding:"80px 20px 40px"}}>
      <h1 className="ral" style={{fontSize:30,fontWeight:800,marginBottom:6}}>Parcel & Courier</h1>
      <p style={{color:C.textMuted,marginBottom:24}}>Send parcels across Uganda with every trip</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:22}}>
        <Card>
          <h3 className="ral" style={{fontWeight:800,fontSize:17,marginBottom:18}}>Send a Parcel</h3>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            <Input label="Sender Name" value={form.sender} onChange={e=>setForm({...form,sender:e.target.value})} placeholder="Your full name"/>
            <Input label="Sender Phone" value={form.senderPhone} onChange={e=>setForm({...form,senderPhone:e.target.value})} placeholder="+256 7XX XXX XXX"/>
            <Input label="Receiver Name" value={form.receiver} onChange={e=>setForm({...form,receiver:e.target.value})} placeholder="Receiver's name"/>
            <Input label="Receiver Phone" value={form.receiverPhone} onChange={e=>setForm({...form,receiverPhone:e.target.value})} placeholder="+256 7XX XXX XXX"/>
            <Sel label="Destination" value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})} options={[{value:"",label:"Choose destination"},...ROUTES.map(r=>({value:r.destination,label:r.destination}))]}/>
            <Input label="Weight (kg)" type="number" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})} placeholder="e.g. 2.5"/>
            <Input label="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="What's inside?"/>
            <div style={{background:C.navyLight,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.textMuted}}>🧳 Up to 10kg free of charge</div>
            <Btn full style={{marginTop:4}}>Submit Parcel Booking</Btn>
          </div>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card>
            <h3 className="ral" style={{fontWeight:800,fontSize:17,marginBottom:14}}>Track Your Parcel</h3>
            <Input label="Parcel Code" value={tracking} onChange={e=>setTracking(e.target.value)} placeholder="e.g. RX-P001"/>
            <Btn onClick={()=>setTrackResult(mock.find(p=>p.code.toLowerCase()===tracking.toLowerCase())||{code:tracking,status:"cancelled",location:"Not found",updated:"—"})} full style={{marginTop:10}}>Track →</Btn>
            {trackResult&&(
              <div style={{marginTop:12,background:C.navyMid,borderRadius:10,padding:12,animation:"fadeUp .3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span className="ral" style={{fontWeight:700}}>{trackResult.code}</span><StatusBadge status={trackResult.status}/></div>
                <div style={{fontSize:12,color:C.textMuted}}>Location: {trackResult.location}</div>
                <div style={{fontSize:11,color:C.textMuted,marginTop:3}}>Updated: {trackResult.updated}</div>
              </div>
            )}
          </Card>
          <Card>
            <h3 className="ral" style={{fontWeight:700,fontSize:15,marginBottom:12}}>Pricing Guide</h3>
            {[["0–2 kg","UGX 5,000"],["2–5 kg","UGX 10,000"],["5–10 kg","UGX 18,000"],["10+ kg","Contact us"]].map(([w,p])=>(
              <div key={w} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.navyBorder}`,fontSize:13}}>
                <span style={{color:C.textMuted}}>{w}</span><span style={{fontWeight:700,color:C.amber}}>{p}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

const SafetyPage=()=>(
  <div style={{minHeight:"100vh",paddingTop:80,maxWidth:1000,margin:"0 auto",padding:"80px 20px 40px"}}>
    <div style={{textAlign:"center",marginBottom:44}}>
      <div style={{fontSize:50,marginBottom:14}}>🛡️</div>
      <h1 className="ral" style={{fontSize:34,fontWeight:900,marginBottom:10}}>Passenger Safety Guidelines</h1>
      <p style={{color:C.textMuted,maxWidth:480,margin:"0 auto",lineHeight:1.8}}>Your safety is our highest priority. Please read before every journey.</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:18,marginBottom:28}}>
      {[{icon:"🔒",title:"Protect Your Valuables",body:"Keep phones, wallets and documents secure. Avoid displaying cash or expensive items during travel."},{icon:"🎒",title:"Keep Luggage Identified",body:"Label all luggage clearly with name and contact details to prevent confusion or loss."},{icon:"📋",title:"Follow Boarding Instructions",body:"Follow all instructions from the driver or staff during boarding and disembarking."},{icon:"💺",title:"Remain Seated During Travel",body:"Stay seated with seatbelts fastened where available. Do not distract the driver."},{icon:"👁️",title:"Report Suspicious Activity",body:"Notify the driver or staff immediately of any suspicious behavior or safety concerns."},{icon:"🚨",title:"Emergency Situations",body:"Remain calm, follow driver instructions, and exit safely when directed."}].map((g,i)=>(
        <Card key={i} style={{animation:`fadeUp ${.1+i*.07}s ease`}}>
          <div style={{fontSize:32,marginBottom:10}}>{g.icon}</div>
          <h3 className="ral" style={{fontWeight:700,fontSize:15,marginBottom:8}}>{g.title}</h3>
          <p style={{fontSize:12,color:C.textMuted,lineHeight:1.8}}>{g.body}</p>
        </Card>
      ))}
    </div>
    <Card style={{background:C.amber+"11",borderColor:C.amber+"44",textAlign:"center"}}>
      <div style={{fontSize:26,marginBottom:6}}>📞</div>
      <h3 className="ral" style={{fontWeight:800,marginBottom:4}}>24/7 Safety Hotline</h3>
      <p style={{color:C.textMuted,fontSize:13}}><strong style={{color:C.amber}}>+256 700 000000</strong> · WhatsApp available at all times</p>
    </Card>
  </div>
);

const FAQPage=()=>(
  <div style={{minHeight:"100vh",paddingTop:80,maxWidth:760,margin:"0 auto",padding:"80px 20px 60px"}}>
    <div style={{textAlign:"center",marginBottom:36}}>
      <h1 className="ral" style={{fontSize:32,fontWeight:900,marginBottom:8}}>Frequently Asked Questions</h1>
      <p style={{color:C.textMuted,fontSize:14}}>Everything you need to know about travelling with Raylane Express</p>
    </div>
    {FAQ_DATA.map((f,i)=><FAQItem key={i} f={f}/>)}
    <Card style={{marginTop:24,textAlign:"center",background:C.amber+"11",border:`1px solid ${C.amber}44`}}>
      <h3 className="ral" style={{fontWeight:700,marginBottom:6}}>Still have questions?</h3>
      <p style={{fontSize:13,color:C.textMuted,marginBottom:14}}>Our support team is available Mon–Sun 5AM–10PM</p>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}><Btn style={{padding:"9px 20px",fontSize:13}}>📞 Call Us</Btn><Btn variant="navy" style={{padding:"9px 20px",fontSize:13,border:`1px solid ${C.navyBorder}`}}>💬 WhatsApp</Btn></div>
    </Card>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════════════
const LoginPage=({onLogin,agents})=>{
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [role,setRole]=useState("admin");
  const [err,setErr]=useState("");

  const handle=()=>{
    setErr("");
    if(role==="admin"){
      if(username==="admin"&&password==="raylane2026"){onLogin({role:"admin",name:"Administrator",username:"admin"});return;}
      setErr("Invalid admin credentials.");
    } else {
      const ag=agents.find(a=>a.username===username&&a.password===password);
      if(!ag){setErr("Agent not found or wrong password.");return;}
      if(ag.status==="suspended"){setErr("This agent account is suspended. Contact admin.");return;}
      onLogin({role:"agent",name:ag.name,username:ag.username,agentId:ag.id});
    }
  };

  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.navy,padding:20}}>
      <div style={{maxWidth:380,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:52,height:52,background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 12px"}}>🚐</div>
          <div className="ral" style={{fontWeight:900,fontSize:20}}>RAYLANE<span style={{color:C.amber}}>EXPRESS</span></div>
          <div style={{fontSize:11,color:C.textMuted,marginTop:4,letterSpacing:1}}>STAFF PORTAL</div>
        </div>
        <Card>
          <div style={{display:"flex",gap:6,marginBottom:22}}>
            {["admin","agent"].map(r=>(
              <button key={r} onClick={()=>{setRole(r);setErr("");}} style={{flex:1,padding:"9px",borderRadius:9,border:"none",background:role===r?C.amber:"transparent",color:role===r?"#0D1B3E":C.textSecondary,cursor:"pointer",fontFamily:"'Raleway',sans-serif",fontWeight:700,fontSize:13,transition:"all .2s"}}>
                {r==="admin"?"👑 Admin":"🙎 Agent"}
              </button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Input label="Username" value={username} onChange={e=>setUsername(e.target.value)} placeholder={role==="admin"?"admin":"agent.username"}/>
            <Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>
            {err&&<div style={{background:C.red+"22",border:`1px solid ${C.red}44`,borderRadius:8,padding:"9px 14px",fontSize:12,color:C.red}}>{err}</div>}
            <Btn onClick={handle} full style={{padding:"12px",marginTop:2}}>Sign In →</Btn>
          </div>
          <p style={{fontSize:11,color:C.textMuted,textAlign:"center",marginTop:14}}>Authorised personnel only. Not for public access.</p>
          {role==="agent"&&(
            <div style={{marginTop:12,background:C.navyLight,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.textMuted}}>
              Demo agents: <strong style={{color:C.white}}>moses.lubega / agent123</strong> · <strong style={{color:C.white}}>ruth.acen / agent456</strong>
            </div>
          )}
          {role==="admin"&&(
            <div style={{marginTop:12,background:C.navyLight,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.textMuted}}>
              Demo: <strong style={{color:C.white}}>admin / raylane2026</strong>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
const AdminDashboard=({store,currentUser,onLogout})=>{
  const [section,setSection]=useState("overview");
  // Modals
  const [addTripModal,setAddTripModal]=useState(false);
  const [addVehicleModal,setAddVehicleModal]=useState(false);
  const [addAgentModal,setAddAgentModal]=useState(false);
  const [reserveModal,setReserveModal]=useState(false);
  const [assignModal,setAssignModal]=useState(null); // booking to assign
  const [addPromoModal,setAddPromoModal]=useState(false);
  const [addExpenseModal,setAddExpenseModal]=useState(false);

  // Forms
  const [tripForm,setTripForm]=useState({route_id:"",vehicle_id:"",departure_time:""});
  const [vehForm,setVehForm]=useState({registration:"",model:"",capacity:"14",owner_type:"company",driver:"",driver_phone:"",status:"active"});
  const [vehErr,setVehErr]=useState("");
  const [agentForm,setAgentForm]=useState({name:"",phone:"",location:"",username:"",password:""});
  const [resForm,setResForm]=useState({trip_id:"",seat:"",passenger:"",phone:""});
  const [promoForm,setPromoForm]=useState({code:"",route_id:"",discount:"",type:"percent",description:"",expires:""});
  const [expForm,setExpForm]=useState({category:"Fuel",amount:"",description:"",date:new Date().toISOString().split("T")[0]});

  const totalRevenue=store.bookings.filter(b=>b.payment_status==="confirmed").reduce((s,b)=>s+b.amount,0);
  const totalExpenses=store.expenses.reduce((s,e)=>s+e.amount,0);
  const pendingBookings=store.bookings.filter(b=>b.status==="advance"||b.status==="pending");
  const pendingFeedback=store.feedback.filter(f=>f.status==="pending");

  const sidebar=[
    {id:"overview",icon:"📊",label:"Overview"},
    {id:"trips",icon:"🗓️",label:"Trips & Schedules"},
    {id:"bookings",icon:"🎫",label:"Bookings",badge:pendingBookings.length},
    {id:"vehicles",icon:"🚐",label:"Van Fleet"},
    {id:"parcels",icon:"📦",label:"Parcel Deliveries"},
    {id:"reservations",icon:"🪑",label:"Seat Reservations"},
    {id:"finance",icon:"💰",label:"Finance"},
    {id:"promotions",icon:"🎁",label:"Promotions"},
    {id:"reports",icon:"📈",label:"Reports"},
    {id:"agents",icon:"👤",label:"Agents"},
    {id:"feedback",icon:"⭐",label:"Feedback",badge:pendingFeedback.length},
    {id:"settings",icon:"⚙️",label:"Settings"},
  ];

  const handleAddTrip=()=>{
    if(!tripForm.route_id||!tripForm.vehicle_id||!tripForm.departure_time) return;
    const v=store.vehicles.find(v=>v.id===parseInt(tripForm.vehicle_id));
    store.addTrip({route_id:parseInt(tripForm.route_id),vehicle_id:parseInt(tripForm.vehicle_id),departure_time:tripForm.departure_time,status:"active",vehicle_reg:v?.registration||"",capacity:v?.capacity||14});
    setAddTripModal(false); setTripForm({route_id:"",vehicle_id:"",departure_time:""});
  };

  const handleAddVehicle=()=>{
    if(!validateReg(vehForm.registration)){setVehErr("Invalid format. Use: UAA 365D or UAA 465DS");return;}
    store.addVehicle({...vehForm,capacity:parseInt(vehForm.capacity)});
    setAddVehicleModal(false); setVehForm({registration:"",model:"",capacity:"14",owner_type:"company",driver:"",driver_phone:"",status:"active"}); setVehErr("");
  };

  const handleAddAgent=()=>{
    if(!agentForm.name||!agentForm.username||!agentForm.password) return;
    store.addAgent(agentForm);
    setAddAgentModal(false); setAgentForm({name:"",phone:"",location:"",username:"",password:""});
  };

  const handleReserve=()=>{
    if(!resForm.trip_id||!resForm.seat||!resForm.passenger) return;
    store.reserveSeat({trip_id:parseInt(resForm.trip_id),seat:parseInt(resForm.seat),passenger:resForm.passenger,phone:resForm.phone,reserved_by:"admin",expires_at:new Date(Date.now()+60*60000).toISOString()});
    setReserveModal(false); setResForm({trip_id:"",seat:"",passenger:"",phone:""});
  };

  const TH=({children})=><th style={{padding:"12px 14px",textAlign:"left",fontSize:10,color:C.textMuted,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase",background:C.navyMid,borderBottom:`1px solid ${C.navyBorder}`}}>{children}</th>;
  const TD=({children,style:s={}})=><td style={{padding:"11px 14px",fontSize:13,borderBottom:`1px solid ${C.navyBorder}`,...s}}>{children}</td>;

  return(
    <div style={{display:"flex",minHeight:"100vh",paddingTop:64,background:C.navy}}>
      {/* Top bar */}
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:C.navy,borderBottom:`1px solid ${C.navyBorder}`,height:64,display:"flex",alignItems:"center",padding:"0 20px",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🚐</div>
          <span className="ral" style={{fontWeight:900,fontSize:16}}>RAYLANE<span style={{color:C.amber}}>EXPRESS</span> <span style={{color:C.textMuted,fontWeight:400,fontSize:12}}>/ Admin</span></span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {(pendingBookings.length>0||pendingFeedback.length>0)&&<div style={{background:C.red,color:"#fff",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700}}>{pendingBookings.length+pendingFeedback.length} pending</div>}
          <span style={{fontSize:12,color:C.textMuted}}>👑 {currentUser.name}</span>
          <Btn onClick={onLogout} variant="navy" style={{fontSize:11,padding:"5px 12px",border:`1px solid ${C.navyBorder}`}}>Logout</Btn>
        </div>
      </div>

      {/* Sidebar */}
      <div style={{width:210,background:C.navyMid,borderRight:`1px solid ${C.navyBorder}`,position:"fixed",top:64,bottom:0,overflowY:"auto",padding:"14px 0"}}>
        {sidebar.map(item=>(
          <button key={item.id} onClick={()=>setSection(item.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"9px 14px",background:section===item.id?C.amber+"22":"transparent",color:section===item.id?C.amber:C.textSecondary,border:"none",borderRight:section===item.id?`3px solid ${C.amber}`:"3px solid transparent",cursor:"pointer",fontSize:12,fontFamily:"'Nunito',sans-serif",textAlign:"left",transition:"all .15s",fontWeight:section===item.id?700:400}}>
            <span style={{display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:14}}>{item.icon}</span>{item.label}</span>
            {item.badge>0&&<span style={{background:C.red,color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:700}}>{item.badge}</span>}
          </button>
        ))}
      </div>

      {/* Main */}
      <div style={{marginLeft:210,flex:1,padding:"24px"}}>

        {/* ── OVERVIEW ── */}
        {section==="overview"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h1 className="ral" style={{fontSize:24,fontWeight:900,marginBottom:4}}>Dashboard Overview</h1>
            <p style={{color:C.textMuted,fontSize:12,marginBottom:20}}>Monday, 9 March 2026 · Live data</p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:24}}>
              <StatCard label="Today's Revenue" value={formatUGX(totalRevenue)} icon="💵" color={C.green} sub="↑ 12% vs yesterday"/>
              <StatCard label="Seats Sold" value="23" icon="🎫" color={C.amber}/>
              <StatCard label="Active Trips" value={store.trips.length} icon="🚐" color={C.blue}/>
              <StatCard label="Pending Actions" value={pendingBookings.length+pendingFeedback.length} icon="⚠️" color={C.orange}/>
            </div>
            {pendingBookings.length>0&&(
              <Card style={{marginBottom:20,border:`1px solid ${C.orange}44`,background:C.orange+"08"}}>
                <h3 className="ral" style={{fontWeight:700,marginBottom:14,color:C.orange}}>⚠️ Advance Bookings Awaiting Assignment ({pendingBookings.length})</h3>
                {pendingBookings.slice(0,3).map(b=>(
                  <div key={b.id} style={{background:C.card,borderRadius:12,padding:14,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                    <div>
                      <div className="ral" style={{fontWeight:700,fontSize:15,color:C.amber}}>{b.booking_code}</div>
                      <div style={{fontSize:12,color:C.textMuted}}>{b.passenger} · {b.route} · {b.date}</div>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <StatusBadge status={b.status}/>
                      <Btn onClick={()=>setAssignModal(b)} style={{padding:"6px 14px",fontSize:12}}>Assign Vehicle →</Btn>
                    </div>
                  </div>
                ))}
              </Card>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
              <Card>
                <h3 className="ral" style={{fontWeight:700,marginBottom:14}}>Today's Trips</h3>
                {store.trips.map(t=>{const r=store.getRoute(t.route_id);const avail=store.seatsAvailable(t);return(
                  <div key={t.id} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.navyBorder}`}}>
                    <div><div style={{fontWeight:600,fontSize:13}}>{r.origin} → {r.destination}</div><div style={{fontSize:11,color:C.textMuted}}>{formatTime(t.departure_time)} · {t.vehicle_reg}</div></div>
                    <div style={{textAlign:"right"}}><StatusBadge status={t.status}/><div style={{fontSize:11,color:avail===0?C.red:C.green,marginTop:3}}>{avail===0?"FULL":`${avail} seats`}</div></div>
                  </div>
                );})}
              </Card>
              <Card>
                <h3 className="ral" style={{fontWeight:700,marginBottom:14}}>Financials</h3>
                {[["Revenue",formatUGX(totalRevenue),C.green],["Expenses",formatUGX(totalExpenses),C.red],["Net Profit",formatUGX(totalRevenue-totalExpenses),C.amber]].map(([k,v,col])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.navyBorder}`}}>
                    <span style={{fontSize:13,color:C.textMuted}}>{k}</span>
                    <span className="ral" style={{fontWeight:800,fontSize:13,color:col}}>{v}</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        )}

        {/* ── TRIPS ── */}
        {section==="trips"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h1 className="ral" style={{fontSize:24,fontWeight:900}}>Trips & Schedules</h1>
              <Btn onClick={()=>setAddTripModal(true)}>+ Add Trip</Btn>
            </div>
            <Card style={{padding:0,overflow:"hidden"}}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr>{["#","Route","Departure","Vehicle","Driver","Seats","Status","Actions"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                  <tbody>
                    {store.trips.map(t=>{const r=store.getRoute(t.route_id);const avail=store.seatsAvailable(t);return(
                      <tr key={t.id} onMouseEnter={e=>e.currentTarget.style.background=C.navyMid} onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <TD><span style={{color:C.amber,fontFamily:"'Raleway',sans-serif",fontWeight:700}}>#{t.id}</span></TD>
                        <TD><span className="ral" style={{fontWeight:700}}>{r.origin} → {r.destination}</span></TD>
                        <TD><div className="ral" style={{fontWeight:800,color:C.amber}}>{formatTime(t.departure_time)}</div><div style={{fontSize:10,color:C.textMuted}}>{formatDate(t.departure_time)}</div></TD>
                        <TD style={{color:C.textSecondary}}>{t.vehicle_reg}</TD>
                        <TD style={{color:C.textMuted,fontSize:12}}>{store.vehicles.find(v=>v.id===t.vehicle_id)?.driver||"—"}</TD>
                        <TD><span style={{color:avail===0?C.red:avail<5?C.orange:C.green,fontWeight:700}}>{avail===0?"FULL":avail}</span></TD>
                        <TD><StatusBadge status={t.status}/></TD>
                        <TD><div style={{display:"flex",gap:5}}><Btn variant="navy" style={{padding:"4px 10px",fontSize:10,border:`1px solid ${C.navyBorder}`}}>Edit</Btn><Btn variant="danger" style={{padding:"4px 10px",fontSize:10}}>Cancel</Btn></div></TD>
                      </tr>
                    );})}
                  </tbody>
                </table>
              </div>
            </Card>
            <Modal open={addTripModal} onClose={()=>setAddTripModal(false)} title="Schedule New Trip">
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <Sel label="Route" required value={tripForm.route_id} onChange={e=>setTripForm({...tripForm,route_id:e.target.value})} options={[{value:"",label:"Select route"},...ROUTES.map(r=>({value:r.id,label:`${r.origin} → ${r.destination}`}))]}/>
                <Sel label="Vehicle" required value={tripForm.vehicle_id} onChange={e=>setTripForm({...tripForm,vehicle_id:e.target.value})} options={[{value:"",label:"Select vehicle"},...store.vehicles.filter(v=>v.status==="active").map(v=>({value:v.id,label:`${v.registration} — ${v.model} (${v.capacity} seats)`}))]}/>
                <Input label="Departure Date & Time" type="datetime-local" required value={tripForm.departure_time} onChange={e=>setTripForm({...tripForm,departure_time:e.target.value})}/>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:6}}>
                  <Btn variant="navy" onClick={()=>setAddTripModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
                  <Btn onClick={handleAddTrip} disabled={!tripForm.route_id||!tripForm.vehicle_id||!tripForm.departure_time}>Create Trip</Btn>
                </div>
              </div>
            </Modal>
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {section==="bookings"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h1 className="ral" style={{fontSize:24,fontWeight:900}}>Booking Management</h1>
              <div style={{display:"flex",gap:8}}>
                <Input placeholder="Search..." value="" onChange={()=>{}} style={{padding:"7px 12px",width:160}}/>
                <Btn variant="navy" style={{fontSize:11,border:`1px solid ${C.navyBorder}`,padding:"7px 14px"}}>Export CSV</Btn>
              </div>
            </div>
            {pendingBookings.length>0&&(
              <Card style={{marginBottom:18,border:`1px solid ${C.amber}44`}}>
                <h3 className="ral" style={{fontWeight:700,marginBottom:14,color:C.amber}}>📅 Pending Advance Bookings — Assign Vehicles</h3>
                {pendingBookings.map(b=>(
                  <div key={b.id} style={{background:C.navyMid,borderRadius:12,padding:14,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                    <div>
                      <div className="ral" style={{fontWeight:800,fontSize:14,color:C.amber}}>{b.booking_code}</div>
                      <div style={{fontSize:12,color:C.white,marginTop:2}}>{b.passenger} · {b.phone}</div>
                      <div style={{fontSize:11,color:C.textMuted}}>{b.route} · Travel date: {b.date} · {formatUGX(b.amount)}</div>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <StatusBadge status={b.status}/>
                      <StatusBadge status={b.payment_status}/>
                      <Btn onClick={()=>setAssignModal(b)} style={{padding:"7px 14px",fontSize:12}}>Assign & Confirm</Btn>
                    </div>
                  </div>
                ))}
              </Card>
            )}
            <Card style={{padding:0,overflow:"hidden"}}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr>{["Code","Passenger","Route","Date","Seats","Amount","Payment","Status","Agent","Actions"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                  <tbody>
                    {store.bookings.map(b=>(
                      <tr key={b.id} onMouseEnter={e=>e.currentTarget.style.background=C.navyMid} onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <TD><span style={{color:C.amber,fontFamily:"'Raleway',sans-serif",fontWeight:700,fontSize:12}}>{b.booking_code}</span></TD>
                        <TD><div style={{fontWeight:600}}>{b.passenger}</div><div style={{fontSize:10,color:C.textMuted}}>{b.phone}</div></TD>
                        <TD style={{fontSize:12}}>{b.route}</TD>
                        <TD style={{fontSize:11,color:C.textMuted}}>{b.date}</TD>
                        <TD>{b.seats?.join(", ")||"TBD"}</TD>
                        <TD><span style={{fontWeight:700}}>{formatUGX(b.amount)}</span></TD>
                        <TD><StatusBadge status={b.payment_status}/></TD>
                        <TD><StatusBadge status={b.status}/></TD>
                        <TD style={{fontSize:11,color:C.textMuted}}>{b.agent_id||"Direct"}</TD>
                        <TD><div style={{display:"flex",gap:4}}>
                          <Btn variant="navy" style={{padding:"4px 8px",fontSize:10,border:`1px solid ${C.navyBorder}`}}>View</Btn>
                          <Btn variant="navy" style={{padding:"4px 8px",fontSize:10,border:`1px solid ${C.navyBorder}`}}>QR</Btn>
                        </div></TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Modal open={!!assignModal} onClose={()=>setAssignModal(null)} title="Assign Vehicle & Confirm Booking">
              {assignModal&&(
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div style={{background:C.navyLight,borderRadius:10,padding:14,fontSize:13}}>
                    <div className="ral" style={{fontWeight:800,color:C.amber,marginBottom:4}}>{assignModal.booking_code}</div>
                    <div>{assignModal.passenger} · {assignModal.phone}</div>
                    <div style={{color:C.textMuted,marginTop:2}}>{assignModal.route} · {assignModal.date}</div>
                  </div>
                  <Sel label="Assign Vehicle" value="" onChange={()=>{}} options={[{value:"",label:"Select vehicle"},...store.vehicles.filter(v=>v.status==="active").map(v=>({value:v.id,label:`${v.registration} — ${v.model}`}))]}/>
                  <Sel label="Assign Trip" value="" onChange={()=>{}} options={[{value:"",label:"Select or create trip"},...store.trips.map(t=>{const r=store.getRoute(t.route_id);return{value:t.id,label:`${r.origin} → ${r.destination} · ${formatTime(t.departure_time)} · ${formatDate(t.departure_time)}`};})]}/>
                  <Input label="Confirm Seat Numbers (comma separated)" value="" onChange={()=>{}} placeholder="e.g. 3, 7"/>
                  <Sel label="Payment Status" value="confirmed" onChange={()=>{}} options={[{value:"pending",label:"Pending Payment"},{value:"submitted",label:"Payment Submitted"},{value:"confirmed",label:"Payment Confirmed"}]}/>
                  <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                    <Btn variant="navy" onClick={()=>setAssignModal(null)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
                    <Btn onClick={()=>{store.confirmBooking(assignModal.id,1,1);setAssignModal(null);}}>✓ Confirm Booking</Btn>
                  </div>
                </div>
              )}
            </Modal>
          </div>
        )}

        {/* ── VEHICLES ── */}
        {section==="vehicles"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h1 className="ral" style={{fontSize:24,fontWeight:900}}>Van Fleet Management</h1>
              <Btn onClick={()=>setAddVehicleModal(true)}>+ Add Vehicle</Btn>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
              {store.vehicles.map(v=>(
                <Card key={v.id}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:28}}>🚐</span><StatusBadge status={v.status}/></div>
                  <div className="ral" style={{fontWeight:800,fontSize:19,marginBottom:2}}>{v.registration}</div>
                  <div style={{color:C.textSecondary,fontSize:12,marginBottom:14}}>{v.model} · <StatusBadge status={v.owner_type}/></div>
                  {[["Capacity",`${v.capacity} seats`],["Driver",v.driver],["Driver Phone",v.driver_phone]].map(([k,val])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}><span style={{color:C.textMuted}}>{k}</span><span style={{fontWeight:600}}>{val}</span></div>
                  ))}
                  <div style={{display:"flex",gap:8,marginTop:12}}>
                    <Btn variant="navy" style={{flex:1,padding:"7px",fontSize:11,border:`1px solid ${C.navyBorder}`}}>Edit</Btn>
                    <Btn variant="navy" style={{flex:1,padding:"7px",fontSize:11,border:`1px solid ${C.navyBorder}`}}>Schedule</Btn>
                  </div>
                </Card>
              ))}
            </div>
            <Modal open={addVehicleModal} onClose={()=>setAddVehicleModal(false)} title="Add New Vehicle">
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                <Input label="Registration Number" required value={vehForm.registration} onChange={e=>setVehForm({...vehForm,registration:e.target.value.toUpperCase()})} placeholder="UAA 365D" error={vehErr}/>
                <div style={{background:C.navyLight,borderRadius:8,padding:"7px 12px",fontSize:11,color:C.textMuted}}>Format: UAA 365D or UAA 465DS</div>
                <Input label="Vehicle Model" value={vehForm.model} onChange={e=>setVehForm({...vehForm,model:e.target.value})} placeholder="e.g. Toyota HiAce"/>
                <Input label="Seat Capacity" type="number" value={vehForm.capacity} onChange={e=>setVehForm({...vehForm,capacity:e.target.value})} placeholder="14"/>
                <Sel label="Owner Type" value={vehForm.owner_type} onChange={e=>setVehForm({...vehForm,owner_type:e.target.value})} options={[{value:"company",label:"Company Owned"},{value:"vendor",label:"Vendor/Partner"}]}/>
                <Sel label="Status" value={vehForm.status} onChange={e=>setVehForm({...vehForm,status:e.target.value})} options={[{value:"active",label:"Active"},{value:"maintenance",label:"Under Maintenance"}]}/>
                <Input label="Driver Name" value={vehForm.driver} onChange={e=>setVehForm({...vehForm,driver:e.target.value})} placeholder="Driver's full name"/>
                <Input label="Driver Phone" value={vehForm.driver_phone} onChange={e=>setVehForm({...vehForm,driver_phone:e.target.value})} placeholder="+256 7XX XXX XXX"/>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:6}}>
                  <Btn variant="navy" onClick={()=>setAddVehicleModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
                  <Btn onClick={handleAddVehicle}>Add Vehicle</Btn>
                </div>
              </div>
            </Modal>
          </div>
        )}

        {/* ── RESERVATIONS ── */}
        {section==="reservations"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h1 className="ral" style={{fontSize:24,fontWeight:900}}>Seat Reservations</h1>
              <Btn onClick={()=>setReserveModal(true)}>+ Reserve Seat</Btn>
            </div>
            <div style={{background:C.navyLight,borderRadius:10,padding:"10px 16px",marginBottom:18,fontSize:12,color:C.textMuted}}>
              🪑 Reserved seats are held for 1 hour. Unreleased reservations auto-expire and return to available.
              <div style={{display:"flex",gap:16,marginTop:6}}>
                <span style={{color:C.green}}>● Green = Available</span>
                <span style={{color:C.orange}}>● Yellow = Reserved (held)</span>
                <span style={{color:C.red}}>● Red = Booked (confirmed)</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:18,marginBottom:24}}>
              {store.trips.slice(0,4).map(t=>{
                const r=store.getRoute(t.route_id);
                const res=store.reservations.filter(rv=>rv.trip_id===t.id&&rv.status==="reserved");
                return(
                  <Card key={t.id}>
                    <div className="ral" style={{fontWeight:700,marginBottom:4}}>{r.origin} → {r.destination}</div>
                    <div style={{fontSize:11,color:C.textMuted,marginBottom:14}}>{formatTime(t.departure_time)} · {t.vehicle_reg}</div>
                    <SeatMap capacity={14} bookedSeats={t.seats_booked} reservedSeats={res.map(r=>r.seat)} selected={[]} size="small"/>
                    {res.length>0&&(
                      <div style={{marginTop:12}}>
                        {res.map(rv=>(
                          <div key={rv.id} style={{background:C.orange+"22",border:`1px solid ${C.orange}44`,borderRadius:8,padding:"8px 10px",marginBottom:6,fontSize:11}}>
                            <span style={{fontWeight:700,color:C.orange}}>Seat {rv.seat}</span> — {rv.passenger} · {rv.phone}
                            <div style={{color:C.textMuted,marginTop:2}}>Expires: {new Date(rv.expires_at).toLocaleTimeString()}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
            <Modal open={reserveModal} onClose={()=>setReserveModal(false)} title="Reserve a Seat">
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                <Sel label="Trip" required value={resForm.trip_id} onChange={e=>setResForm({...resForm,trip_id:e.target.value})} options={[{value:"",label:"Select trip"},...store.trips.map(t=>{const r=store.getRoute(t.route_id);return{value:t.id,label:`${r.origin} → ${r.destination} · ${formatTime(t.departure_time)}`};})]}/>
                <Input label="Seat Number" type="number" required value={resForm.seat} onChange={e=>setResForm({...resForm,seat:e.target.value})} placeholder="e.g. 5"/>
                <Input label="Passenger Name" required value={resForm.passenger} onChange={e=>setResForm({...resForm,passenger:e.target.value})} placeholder="Passenger full name"/>
                <Input label="Phone Number" value={resForm.phone} onChange={e=>setResForm({...resForm,phone:e.target.value})} placeholder="+256 7XX XXX XXX"/>
                <div style={{background:C.amber+"22",border:`1px solid ${C.amber}44`,borderRadius:8,padding:"9px 12px",fontSize:12,color:C.amber}}>
                  ⏰ Seat will be automatically released after 1 hour if payment is not confirmed.
                </div>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                  <Btn variant="navy" onClick={()=>setReserveModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
                  <Btn onClick={handleReserve} disabled={!resForm.trip_id||!resForm.seat||!resForm.passenger}>Reserve Seat</Btn>
                </div>
              </div>
            </Modal>
          </div>
        )}

        {/* ── FINANCE ── */}
        {section==="finance"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h1 className="ral" style={{fontSize:24,fontWeight:900}}>Financial Management</h1>
              <div style={{display:"flex",gap:8}}>
                <Btn variant="navy" style={{fontSize:11,border:`1px solid ${C.navyBorder}`,padding:"7px 14px"}}>Export PDF</Btn>
                <Btn variant="navy" style={{fontSize:11,border:`1px solid ${C.navyBorder}`,padding:"7px 14px"}}>Export Excel</Btn>
              </div>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:22}}>
              <StatCard label="Total Revenue" value={formatUGX(totalRevenue)} icon="💵" color={C.green}/>
              <StatCard label="Total Expenses" value={formatUGX(totalExpenses)} icon="📉" color={C.red}/>
              <StatCard label="Net Profit" value={formatUGX(totalRevenue-totalExpenses)} icon="📊" color={C.amber}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
              <Card>
                <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Revenue by Route</h3>
                {ROUTES.slice(0,5).map(r=>{
                  const rev=store.bookings.filter(b=>b.route_id===r.id&&b.payment_status==="confirmed").reduce((s,b)=>s+b.amount,0);
                  return(<div key={r.id} style={{marginBottom:11}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:C.textSecondary}}>→ {r.destination}</span><span style={{fontWeight:700,color:C.green}}>{formatUGX(rev)}</span></div>
                    <div style={{height:4,background:C.navyLight,borderRadius:2}}><div style={{width:`${Math.min((rev/130000)*100,100)}%`,height:"100%",background:`linear-gradient(90deg,${C.green},${C.amber})`,borderRadius:2}}/></div>
                  </div>);
                })}
              </Card>
              <Card>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <h3 className="ral" style={{fontWeight:700}}>Expense Log</h3>
                  <Btn onClick={()=>setAddExpenseModal(true)} style={{padding:"5px 12px",fontSize:11}}>+ Add</Btn>
                </div>
                {store.expenses.map(e=>(
                  <div key={e.id} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.navyBorder}`}}>
                    <div><div style={{fontWeight:600,fontSize:12}}>{e.category}</div><div style={{fontSize:10,color:C.textMuted}}>{e.description}</div></div>
                    <span style={{color:C.red,fontWeight:700,fontSize:12}}>-{formatUGX(e.amount)}</span>
                  </div>
                ))}
              </Card>
            </div>
            <Modal open={addExpenseModal} onClose={()=>setAddExpenseModal(false)} title="Add Expense">
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                <Sel label="Category" value={expForm.category} onChange={e=>setExpForm({...expForm,category:e.target.value})} options={["Fuel","Maintenance","Driver Allowance","Terminal Fees","Insurance","Other"].map(v=>({value:v,label:v}))}/>
                <Input label="Amount (UGX)" type="number" value={expForm.amount} onChange={e=>setExpForm({...expForm,amount:e.target.value})} placeholder="e.g. 150000"/>
                <Input label="Description" value={expForm.description} onChange={e=>setExpForm({...expForm,description:e.target.value})} placeholder="Brief description"/>
                <Input label="Date" type="date" value={expForm.date} onChange={e=>setExpForm({...expForm,date:e.target.value})}/>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                  <Btn variant="navy" onClick={()=>setAddExpenseModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
                  <Btn onClick={()=>{store.addExpense({...expForm,amount:parseInt(expForm.amount)});setAddExpenseModal(false);}}>Save Expense</Btn>
                </div>
              </div>
            </Modal>
          </div>
        )}

        {/* ── PROMOTIONS ── */}
        {section==="promotions"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h1 className="ral" style={{fontSize:24,fontWeight:900}}>Promotions & Discounts</h1>
              <Btn onClick={()=>setAddPromoModal(true)}>+ Create Promo</Btn>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
              {store.promotions.map(p=>(
                <Card key={p.id} style={{border:`1px solid ${p.active?C.amber+"44":C.navyBorder}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <div className="ral" style={{fontWeight:900,fontSize:20,color:C.amber}}>{p.code}</div>
                    <StatusBadge status={p.active?"active":"cancelled"}/>
                  </div>
                  <div style={{fontSize:13,marginBottom:8}}>{p.description}</div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}><span style={{color:C.textMuted}}>Discount</span><span style={{fontWeight:700,color:C.green}}>{p.type==="percent"?`${p.discount}%`:formatUGX(p.discount)}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}><span style={{color:C.textMuted}}>Route</span><span>{p.route_id?ROUTES.find(r=>r.id===p.route_id)?.destination:"All routes"}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:C.textMuted}}>Expires</span><span>{p.expires}</span></div>
                </Card>
              ))}
            </div>
            <Modal open={addPromoModal} onClose={()=>setAddPromoModal(false)} title="Create Promotion">
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                <Input label="Promo Code" required value={promoForm.code} onChange={e=>setPromoForm({...promoForm,code:e.target.value.toUpperCase()})} placeholder="e.g. HOLIDAY20"/>
                <Input label="Description" value={promoForm.description} onChange={e=>setPromoForm({...promoForm,description:e.target.value})} placeholder="e.g. Holiday travel promotion"/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <Sel label="Discount Type" value={promoForm.type} onChange={e=>setPromoForm({...promoForm,type:e.target.value})} options={[{value:"percent",label:"Percentage (%)"},{value:"fixed",label:"Fixed Amount (UGX)"}]}/>
                  <Input label={promoForm.type==="percent"?"Discount %":"Discount (UGX)"} type="number" value={promoForm.discount} onChange={e=>setPromoForm({...promoForm,discount:e.target.value})} placeholder={promoForm.type==="percent"?"10":"5000"}/>
                </div>
                <Sel label="Apply to Route (optional)" value={promoForm.route_id} onChange={e=>setPromoForm({...promoForm,route_id:e.target.value})} options={[{value:"",label:"All Routes"},...ROUTES.map(r=>({value:r.id,label:`${r.origin} → ${r.destination}`}))]}/>
                <Input label="Expiry Date" type="date" value={promoForm.expires} onChange={e=>setPromoForm({...promoForm,expires:e.target.value})}/>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                  <Btn variant="navy" onClick={()=>setAddPromoModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
                  <Btn onClick={()=>{store.addPromotion({...promoForm,route_id:promoForm.route_id?parseInt(promoForm.route_id):null,discount:parseInt(promoForm.discount),active:true});setAddPromoModal(false);}}>Create Promo</Btn>
                </div>
              </div>
            </Modal>
          </div>
        )}

        {/* ── REPORTS ── */}
        {section==="reports"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h1 className="ral" style={{fontSize:24,fontWeight:900,marginBottom:20}}>Reports & Analytics</h1>
            <div style={{marginBottom:20}}><Tabs tabs={["Daily","Weekly","Monthly","Yearly"]} active="Daily" onChange={()=>{}}/></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:14,marginBottom:22}}>
              {[{title:"Total Bookings",v:"28",icon:"🎫",col:C.amber},{title:"Revenue",v:formatUGX(totalRevenue),icon:"💵",col:C.green},{title:"Passengers",v:"34",icon:"👥",col:C.blue},{title:"Most Popular",v:"Kampala→Gulu",icon:"🗺️",col:C.purple}].map(r=>(
                <Card key={r.title}><div style={{fontSize:24,marginBottom:8}}>{r.icon}</div><div className="ral" style={{fontWeight:800,fontSize:16,color:r.col,marginBottom:4}}>{r.v}</div><div style={{fontSize:11,color:C.textMuted}}>{r.title}</div></Card>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14,marginBottom:24}}>
              {[{title:"Daily Revenue Report",icon:"📅"},{title:"Route Performance",icon:"🗺️"},{title:"Vehicle Utilisation",icon:"🚐"},{title:"Agent Performance",icon:"👤"},{title:"Passenger Report",icon:"👥"},{title:"Parcel Report",icon:"📦"}].map(r=>(
                <Card key={r.title} style={{cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.amber+"66"} onMouseLeave={e=>e.currentTarget.style.borderColor=C.navyBorder}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:24}}>{r.icon}</span><div style={{display:"flex",gap:5}}><Btn variant="navy" style={{padding:"3px 8px",fontSize:10,border:`1px solid ${C.navyBorder}`}}>PDF</Btn><Btn variant="navy" style={{padding:"3px 8px",fontSize:10,border:`1px solid ${C.navyBorder}`}}>Excel</Btn></div></div>
                  <div className="ral" style={{fontWeight:700,fontSize:13}}>{r.title}</div>
                </Card>
              ))}
            </div>
            <Card>
              <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Weekly Revenue Chart</h3>
              <div style={{display:"flex",gap:6,alignItems:"flex-end",height:110}}>
                {[{d:"Mon",v:85},{d:"Tue",v:62},{d:"Wed",v:94},{d:"Thu",v:78},{d:"Fri",v:110},{d:"Sat",v:130},{d:"Sun",v:70}].map(x=>(
                  <div key={x.d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{width:"100%",background:`linear-gradient(180deg,${C.amber},${C.amberDark})`,borderRadius:"4px 4px 0 0",height:`${x.v}%`,minHeight:4}}/>
                    <span style={{fontSize:10,color:C.textMuted}}>{x.d}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── AGENTS ── */}
        {section==="agents"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h1 className="ral" style={{fontSize:24,fontWeight:900}}>Agent Management</h1>
              <Btn onClick={()=>setAddAgentModal(true)}>+ Add Agent</Btn>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
              {store.agents.map(a=>(
                <Card key={a.id} style={{border:`1px solid ${a.status==="suspended"?C.red+"44":C.navyBorder}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                    <div style={{width:44,height:44,borderRadius:"50%",background:C.amber+"33",border:`2px solid ${C.amber}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👤</div>
                    <StatusBadge status={a.status}/>
                  </div>
                  <div className="ral" style={{fontWeight:800,fontSize:17}}>{a.name}</div>
                  <div style={{color:C.textMuted,fontSize:11,marginBottom:14}}>{a.id} · {a.location}</div>
                  {[["Username",a.username],["Phone",a.phone],["Joined",a.created]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}><span style={{color:C.textMuted}}>{k}</span><span>{v}</span></div>
                  ))}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"12px 0"}}>
                    <div style={{background:C.navyMid,borderRadius:8,padding:8,textAlign:"center"}}><div className="ral" style={{fontWeight:800,fontSize:17,color:C.amber}}>{a.bookings}</div><div style={{fontSize:10,color:C.textMuted}}>Bookings</div></div>
                    <div style={{background:C.navyMid,borderRadius:8,padding:8,textAlign:"center"}}><div className="ral" style={{fontWeight:700,fontSize:12,color:C.green}}>{formatUGX(a.revenue)}</div><div style={{fontSize:10,color:C.textMuted}}>Revenue</div></div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <Btn variant="navy" style={{flex:1,padding:"7px",fontSize:11,border:`1px solid ${C.navyBorder}`}}>Edit</Btn>
                    <Btn onClick={()=>store.toggleAgent(a.id)} variant={a.status==="active"?"danger":"navy"} style={{flex:1,padding:"7px",fontSize:11,border:`1px solid ${a.status==="active"?C.red+"44":C.navyBorder}`}}>
                      {a.status==="active"?"Suspend":"Activate"}
                    </Btn>
                  </div>
                </Card>
              ))}
            </div>
            <Modal open={addAgentModal} onClose={()=>setAddAgentModal(false)} title="Add New Agent">
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                <Input label="Agent Full Name" required value={agentForm.name} onChange={e=>setAgentForm({...agentForm,name:e.target.value})} placeholder="e.g. Moses Lubega"/>
                <Input label="Phone Number" value={agentForm.phone} onChange={e=>setAgentForm({...agentForm,phone:e.target.value})} placeholder="+256 7XX XXX XXX"/>
                <Input label="Location / Station" value={agentForm.location} onChange={e=>setAgentForm({...agentForm,location:e.target.value})} placeholder="e.g. Gulu Station"/>
                <Input label="Login Username" required value={agentForm.username} onChange={e=>setAgentForm({...agentForm,username:e.target.value.toLowerCase()})} placeholder="e.g. moses.lubega"/>
                <Input label="Password" type="password" required value={agentForm.password} onChange={e=>setAgentForm({...agentForm,password:e.target.value})} placeholder="Minimum 6 characters"/>
                <div style={{background:C.navyLight,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.textMuted}}>Agent will login at the Staff Portal with these credentials.</div>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                  <Btn variant="navy" onClick={()=>setAddAgentModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
                  <Btn onClick={handleAddAgent} disabled={!agentForm.name||!agentForm.username||!agentForm.password}>Create Agent</Btn>
                </div>
              </div>
            </Modal>
          </div>
        )}

        {/* ── FEEDBACK ── */}
        {section==="feedback"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h1 className="ral" style={{fontSize:24,fontWeight:900,marginBottom:20}}>Customer Feedback</h1>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:20}}>
              <StatCard label="Approved Reviews" value={store.feedback.filter(f=>f.status==="approved").length} icon="✅" color={C.green}/>
              <StatCard label="Pending Approval" value={pendingFeedback.length} icon="⏳" color={C.orange}/>
            </div>
            {pendingFeedback.length>0&&(
              <Card style={{marginBottom:20,border:`1px solid ${C.orange}44`}}>
                <h3 className="ral" style={{fontWeight:700,marginBottom:14,color:C.orange}}>Awaiting Approval ({pendingFeedback.length})</h3>
                {pendingFeedback.map(f=>(
                  <div key={f.id} style={{background:C.navyMid,borderRadius:12,padding:14,marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <div><div className="ral" style={{fontWeight:700}}>{f.name}</div><div style={{fontSize:11,color:C.textMuted}}>{f.route} · {f.date}</div></div>
                      <Stars rating={f.rating} size={13}/>
                    </div>
                    <p style={{fontSize:13,color:C.textSecondary,fontStyle:"italic",marginBottom:12}}>"{f.message}"</p>
                    <div style={{display:"flex",gap:8}}>
                      <Btn onClick={()=>store.approveFeedback(f.id)} style={{padding:"6px 16px",fontSize:12}}>✓ Approve & Publish</Btn>
                      <Btn onClick={()=>store.rejectFeedback(f.id)} variant="danger" style={{padding:"6px 16px",fontSize:12}}>✕ Reject</Btn>
                    </div>
                  </div>
                ))}
              </Card>
            )}
            <Card>
              <h3 className="ral" style={{fontWeight:700,marginBottom:14}}>Published Reviews</h3>
              {store.feedback.filter(f=>f.status==="approved").map(f=>(
                <div key={f.id} style={{background:C.navyMid,borderRadius:10,padding:12,marginBottom:10,display:"flex",justifyContent:"space-between",gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span className="ral" style={{fontWeight:700,fontSize:13}}>{f.name}</span><Stars rating={f.rating} size={11}/>
                    </div>
                    <div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>{f.route}</div>
                    <p style={{fontSize:12,color:C.textSecondary,fontStyle:"italic"}}>"{f.message}"</p>
                  </div>
                  <StatusBadge status="approved"/>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── PARCELS ── */}
        {section==="parcels"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h1 className="ral" style={{fontSize:24,fontWeight:900,marginBottom:20}}>Parcel Deliveries</h1>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:20}}>
              <StatCard label="In Transit" value="5" icon="🚚" color={C.amber}/>
              <StatCard label="Delivered" value="3" icon="✅" color={C.green}/>
              <StatCard label="Pending" value="2" icon="⏳" color={C.blue}/>
            </div>
            <Card style={{padding:0,overflow:"hidden"}}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr>{["Code","Sender","Receiver","Destination","Weight","Status",""].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                  <tbody>
                    {[{code:"RX-P001",sender:"David Ssempa",receiver:"Mary Auma",dest:"Gulu",weight:"2.5kg",status:"active"},{code:"RX-P002",sender:"Peter Okello",receiver:"Grace Nakato",dest:"Mbarara",weight:"4.1kg",status:"confirmed"},{code:"RX-P003",sender:"Agnes Aber",receiver:"John Mwesigwa",dest:"Arua",weight:"7.0kg",status:"pending"}].map(p=>(
                      <tr key={p.code} onMouseEnter={e=>e.currentTarget.style.background=C.navyMid} onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <TD><span style={{color:C.amber,fontFamily:"'Raleway',sans-serif",fontWeight:700}}>{p.code}</span></TD>
                        <TD>{p.sender}</TD><TD>{p.receiver}</TD>
                        <TD style={{color:C.textSecondary}}>{p.dest}</TD><TD>{p.weight}</TD>
                        <TD><StatusBadge status={p.status}/></TD>
                        <TD><Btn variant="navy" style={{padding:"4px 10px",fontSize:10,border:`1px solid ${C.navyBorder}`}}>Update</Btn></TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {section==="settings"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h1 className="ral" style={{fontSize:24,fontWeight:900,marginBottom:20}}>Settings</h1>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
              <Card><h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Company Info</h3>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <Input label="Company Name" value="Raylane Express Ltd" onChange={()=>{}}/>
                  <Input label="Phone" value="+256 700 000000" onChange={()=>{}}/>
                  <Input label="Email" value="info@raylane.ug" onChange={()=>{}}/>
                  <Input label="Address" value="Nakasero, Kampala" onChange={()=>{}}/>
                  <Btn full style={{marginTop:4}}>Save Changes</Btn>
                </div>
              </Card>
              <Card><h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Supabase Connection</h3>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <Input label="Supabase URL" value="https://your-project.supabase.co" onChange={()=>{}}/>
                  <Input label="Anon Key" value="••••••••••••••••" onChange={()=>{}}/>
                  <div style={{background:C.green+"22",border:`1px solid ${C.green}44`,borderRadius:10,padding:10,fontSize:11,color:C.green}}>✓ Schema ready: passengers, routes, vehicles, trips, bookings, parcels, expenses, agents, promotions, feedback</div>
                  <Btn full>Test Connection</Btn>
                </div>
              </Card>
              <Card><h3 className="ral" style={{fontWeight:700,marginBottom:16}}>WhatsApp Integration</h3>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <Input label="WhatsApp Business API Key" value="" onChange={()=>{}} placeholder="Enter API key"/>
                  <Input label="Sender Number" value="" onChange={()=>{}} placeholder="+256 7XX XXX XXX"/>
                  <Btn full>Save & Test</Btn>
                </div>
              </Card>
              <Card><h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Booking Rules</h3>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <Input label="Max advance booking (days)" value="60" onChange={()=>{}}/>
                  <Input label="Free luggage allowance (kg)" value="10" onChange={()=>{}}/>
                  <Input label="Seat reservation timeout (mins)" value="60" onChange={()=>{}}/>
                  <Sel label="Default payment method" value="mtn" onChange={()=>{}} options={[{value:"mtn",label:"MTN Mobile Money"},{value:"airtel",label:"Airtel Money"},{value:"cash",label:"Cash"}]}/>
                  <Btn full>Save Rules</Btn>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// AGENT DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
const AgentDashboard=({store,currentUser,onLogout})=>{
  const [section,setSection]=useState("book");
  const agentInfo=store.agents.find(a=>a.id===currentUser.agentId)||{};
  const myBookings=store.bookings.filter(b=>b.agent_id===currentUser.agentId);

  // Booking state
  const [step,setStep]=useState(1);
  const [trip,setTrip]=useState(null);
  const [seats,setSeats]=useState([]);
  const [form,setForm]=useState({name:"",phone:"",email:"",accessibility:false,assistanceDetail:""});
  const [payMethod,setPayMethod]=useState("cash");
  const [confirmed,setConfirmed]=useState(null);

  const route=trip?store.getRoute(trip.route_id):{};
  const bookedS=trip?trip.seats_booked:[];
  const reservedS=trip?store.reservations.filter(r=>r.trip_id===trip.id&&r.status==="reserved").map(r=>r.seat):[];

  const handleBook=()=>{
    const code=genCode();
    store.addBooking({booking_code:code,passenger:form.name,phone:form.phone,route:`${route.origin} → ${route.destination}`,route_id:route.id,seats,trip_id:trip.id,amount:route.price*seats.length,payment_status:"confirmed",status:"confirmed",date:new Date().toISOString().split("T")[0],agent_id:currentUser.agentId,is_advance:false});
    setConfirmed({code,passenger:form.name,route:`${route.origin} → ${route.destination}`,seats,departure:formatTime(trip.departure_time),amount:route.price*seats.length});
    setStep(5);
  };

  const resetBooking=()=>{setStep(1);setTrip(null);setSeats([]);setForm({name:"",phone:"",email:"",accessibility:false,assistanceDetail:""});setConfirmed(null);};

  const sidebar=[{id:"book",icon:"🎫",label:"New Booking"},{id:"mybookings",icon:"📋",label:"My Bookings"},{id:"schedule",icon:"🗓️",label:"View Schedule"},{id:"customers",icon:"👥",label:"Register Customer"}];

  return(
    <div style={{display:"flex",minHeight:"100vh",paddingTop:64,background:C.navy}}>
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:C.navy,borderBottom:`1px solid ${C.navyBorder}`,height:64,display:"flex",alignItems:"center",padding:"0 20px",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🚐</div>
          <span className="ral" style={{fontWeight:900,fontSize:16}}>RAYLANE<span style={{color:C.amber}}>EXPRESS</span> <span style={{color:C.textMuted,fontWeight:400,fontSize:12}}>/ Agent Portal</span></span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:C.amber+"22",border:`1px solid ${C.amber}44`,borderRadius:8,padding:"4px 12px",fontSize:12}}>
            🙎 <strong style={{color:C.amber}}>{currentUser.name}</strong> · {agentInfo.id}
          </div>
          <Btn onClick={onLogout} variant="navy" style={{fontSize:11,padding:"5px 12px",border:`1px solid ${C.navyBorder}`}}>Logout</Btn>
        </div>
      </div>
      <div style={{width:200,background:C.navyMid,borderRight:`1px solid ${C.navyBorder}`,position:"fixed",top:64,bottom:0,overflowY:"auto",padding:"14px 0"}}>
        <div style={{padding:"8px 14px 14px",borderBottom:`1px solid ${C.navyBorder}`,marginBottom:6}}>
          <div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:1}}>Agent Portal</div>
          <div style={{fontSize:12,color:C.textSecondary,marginTop:3}}>{agentInfo.location}</div>
        </div>
        {sidebar.map(item=>(
          <button key={item.id} onClick={()=>{setSection(item.id);if(item.id==="book")resetBooking();}} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"9px 14px",background:section===item.id?C.amber+"22":"transparent",color:section===item.id?C.amber:C.textSecondary,border:"none",borderRight:section===item.id?`3px solid ${C.amber}`:"3px solid transparent",cursor:"pointer",fontSize:12,fontFamily:"'Nunito',sans-serif",textAlign:"left",transition:"all .15s",fontWeight:section===item.id?700:400}}>
            <span style={{fontSize:14}}>{item.icon}</span>{item.label}
          </button>
        ))}
        <div style={{margin:"16px 14px",padding:"12px",background:C.navyLight,borderRadius:10}}>
          <div style={{fontSize:10,color:C.textMuted,marginBottom:6}}>MY STATS</div>
          <div className="ral" style={{fontWeight:800,fontSize:18,color:C.amber}}>{agentInfo.bookings||0}</div>
          <div style={{fontSize:10,color:C.textMuted}}>Total bookings</div>
          <div className="ral" style={{fontWeight:700,fontSize:13,color:C.green,marginTop:6}}>{formatUGX(agentInfo.revenue||0)}</div>
          <div style={{fontSize:10,color:C.textMuted}}>Revenue</div>
        </div>
      </div>
      <div style={{marginLeft:200,flex:1,padding:"24px"}}>

        {/* ── AGENT: NEW BOOKING ── */}
        {section==="book"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h1 className="ral" style={{fontSize:22,fontWeight:900,marginBottom:4}}>New Customer Booking</h1>
            <p style={{color:C.textMuted,fontSize:12,marginBottom:18}}>Book on behalf of a customer · ID: {currentUser.agentId}</p>
            <div style={{background:C.amber+"11",border:`1px solid ${C.amber}44`,borderRadius:9,padding:"8px 14px",marginBottom:18,fontSize:12,color:C.amber}}>🧳 Luggage policy: 10kg free per passenger</div>

            {/* Step indicator */}
            <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:22,flexWrap:"wrap"}}>
              {["Trip","Seats","Customer","Payment","Done"].map((s,i)=>(
                <div key={s} style={{display:"flex",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:step>i+1?C.green:step===i+1?C.amber:C.card,border:`2px solid ${step>i+1?C.green:step===i+1?C.amber:C.navyBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:step>=i+1?"#0D1B3E":C.textMuted,transition:"all .3s"}}>{step>i+1?"✓":i+1}</div>
                    <span style={{fontSize:11,color:step===i+1?C.white:C.textMuted,fontWeight:step===i+1?700:400}}>{s}</span>
                  </div>
                  {i<4&&<div style={{width:20,height:1,background:step>i+1?C.green:C.navyBorder,margin:"0 5px"}}/>}
                </div>
              ))}
            </div>

            {step===1&&(
              <div style={{display:"grid",gap:10}}>
                {store.trips.map(t=>{const r=store.getRoute(t.route_id);const avail=store.seatsAvailable(t);const isFull=avail<=0;const isSel=trip?.id===t.id;return(
                  <div key={t.id} onClick={()=>!isFull&&setTrip(t)} style={{background:C.card,border:`2px solid ${isSel?C.amber:isFull?C.red+"33":C.navyBorder}`,borderRadius:14,padding:"14px 16px",cursor:isFull?"not-allowed":"pointer",transition:"all .2s",opacity:isFull?.55:1,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                    <div><div className="ral" style={{fontWeight:800,fontSize:16}}>{r.origin} → {r.destination}</div><div style={{fontSize:11,color:C.textMuted}}>{t.vehicle_reg}{isFull&&<span style={{color:C.red,marginLeft:8}}>FULL</span>}</div></div>
                    <div style={{display:"flex",gap:16,alignItems:"center"}}>
                      <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.textMuted}}>Departs</div><div className="ral" style={{fontWeight:800,fontSize:19,color:C.amber}}>{formatTime(t.departure_time)}</div></div>
                      <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.textMuted}}>Seats</div><div style={{fontWeight:700,color:isFull?C.red:C.green}}>{isFull?"FULL":avail}</div></div>
                      <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.textMuted}}>Fare</div><div className="ral" style={{fontWeight:700,color:C.amber,fontSize:14}}>{formatUGX(r.price)}</div></div>
                      {isSel&&<div style={{width:20,height:20,borderRadius:"50%",background:C.amber,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#0D1B3E"}}>✓</div>}
                    </div>
                  </div>
                );})}
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}><Btn onClick={()=>setStep(2)} disabled={!trip}>Next: Seats →</Btn></div>
              </div>
            )}

            {step===2&&trip&&(
              <div style={{display:"flex",gap:22,flexWrap:"wrap"}}>
                <div><h3 className="ral" style={{fontWeight:700,marginBottom:12}}>Select Customer Seats</h3><SeatMap capacity={14} bookedSeats={bookedS} reservedSeats={reservedS} selected={seats} onSelect={n=>setSeats(prev=>prev.includes(n)?prev.filter(s=>s!==n):[...prev,n])}/></div>
                <div style={{flex:1,minWidth:180}}>
                  <Card><div className="ral" style={{fontWeight:800,fontSize:16,marginBottom:4}}>{route.origin} → {route.destination}</div>
                    <div style={{color:C.textMuted,fontSize:12,marginBottom:12}}>{formatTime(trip.departure_time)}</div>
                    <div style={{display:"flex",justifyContent:"space-between",borderTop:`1px solid ${C.navyBorder}`,paddingTop:10}}><span className="ral" style={{fontWeight:800}}>Total</span><span className="ral" style={{fontWeight:800,fontSize:17,color:C.green}}>{formatUGX(route.price*seats.length)}</span></div>
                  </Card>
                </div>
                <div style={{width:"100%",display:"flex",gap:10,justifyContent:"flex-end"}}><Btn onClick={()=>setStep(1)} variant="navy" style={{border:`1px solid ${C.navyBorder}`}}>← Back</Btn><Btn onClick={()=>setStep(3)} disabled={seats.length===0}>Next: Customer →</Btn></div>
              </div>
            )}

            {step===3&&(
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                <Card><h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Customer Details</h3>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    <div style={{gridColumn:"1/-1"}}><Input label="Customer Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Customer's full name" required/></div>
                    <Input label="Phone Number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+256 7XX XXX XXX" required/>
                    <Input label="Email (optional)" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="customer@email.com"/>
                  </div>
                  <div style={{marginTop:14,padding:12,background:C.navyMid,borderRadius:11,border:`1px solid ${C.navyBorder}`}}>
                    <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:13}}>
                      <input type="checkbox" checked={form.accessibility} onChange={e=>setForm({...form,accessibility:e.target.checked})} style={{width:16,height:16}}/>
                      <span style={{fontWeight:600}}>Customer requires special assistance</span>
                    </label>
                    {form.accessibility&&<div style={{marginTop:10}}><Input value={form.assistanceDetail} onChange={e=>setForm({...form,assistanceDetail:e.target.value})} placeholder="e.g. Wheelchair assistance..."/></div>}
                  </div>
                </Card>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><Btn onClick={()=>setStep(2)} variant="navy" style={{border:`1px solid ${C.navyBorder}`}}>← Back</Btn><Btn onClick={()=>setStep(4)} disabled={!form.name||!form.phone}>Next: Payment →</Btn></div>
              </div>
            )}

            {step===4&&(
              <Card style={{maxWidth:440}}>
                <h3 className="ral" style={{fontWeight:800,marginBottom:16}}>Confirm Payment</h3>
                <div style={{background:C.navyMid,borderRadius:10,padding:14,marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{color:C.textMuted}}>Route</span><span style={{fontWeight:700}}>{route.origin} → {route.destination}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{color:C.textMuted}}>Seats</span><span>{seats.join(", ")}</span></div>
                  <div style={{borderTop:`1px solid ${C.navyBorder}`,paddingTop:8,display:"flex",justifyContent:"space-between"}}>
                    <span className="ral" style={{fontWeight:800}}>Total</span>
                    <span className="ral" style={{fontWeight:800,fontSize:20,color:C.amber}}>{formatUGX(route.price*seats.length)}</span>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                  {[{id:"cash",label:"Cash",icon:"💵"},{id:"mtn",label:"MTN MoMo",icon:"📱"},{id:"airtel",label:"Airtel",icon:"📲"},{id:"receipt",label:"Receipt Only",icon:"🧾"}].map(m=>(
                    <div key={m.id} onClick={()=>setPayMethod(m.id)} style={{background:payMethod===m.id?C.amber+"22":C.navyMid,border:`1.5px solid ${payMethod===m.id?C.amber:C.navyBorder}`,borderRadius:10,padding:"11px",textAlign:"center",cursor:"pointer",transition:"all .2s"}}>
                      <div style={{fontSize:20,marginBottom:4}}>{m.icon}</div>
                      <div style={{fontSize:11,fontWeight:700,color:payMethod===m.id?C.amber:C.textMuted}}>{m.label}</div>
                    </div>
                  ))}
                </div>
                <Btn onClick={handleBook} full style={{padding:"13px"}}>✓ Confirm & Issue Ticket</Btn>
                <div style={{display:"flex",justifyContent:"center",marginTop:10}}><Btn onClick={()=>setStep(3)} variant="navy" style={{border:`1px solid ${C.navyBorder}`,fontSize:12}}>← Back</Btn></div>
              </Card>
            )}

            {step===5&&confirmed&&(
              <div style={{animation:"fadeUp .4s ease",textAlign:"center"}}>
                <div style={{fontSize:48,marginBottom:12}}>✅</div>
                <h2 className="ral" style={{fontSize:24,fontWeight:900,marginBottom:6}}>Booking Issued!</h2>
                <p style={{color:C.textMuted,marginBottom:24}}>Ticket sent to customer's WhatsApp</p>
                <div style={{maxWidth:380,margin:"0 auto"}}>
                  <Card style={{textAlign:"left",border:`1px solid ${C.amber}44`}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,paddingBottom:14,borderBottom:`2px dashed ${C.navyBorder}`}}>
                      <div><div style={{fontSize:10,color:C.textMuted}}>BOOKING CODE</div><div className="ral" style={{fontWeight:900,fontSize:22,color:C.amber}}>{confirmed.code}</div></div>
                      <QRCode value={confirmed.code} size={90}/>
                    </div>
                    {[["Passenger",confirmed.passenger],["Route",confirmed.route],["Departure",confirmed.departure],["Seats",confirmed.seats.join(", ")],["Total",formatUGX(confirmed.amount)],["Agent",currentUser.agentId]].map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}><span style={{color:C.textMuted}}>{k}</span><span style={{fontWeight:700}}>{v}</span></div>
                    ))}
                  </Card>
                  <div style={{display:"flex",gap:10,marginTop:14,justifyContent:"center"}}><Btn variant="navy" style={{fontSize:12,border:`1px solid ${C.navyBorder}`}}>Print Ticket</Btn><Btn onClick={resetBooking} style={{fontSize:12}}>New Booking</Btn></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AGENT: MY BOOKINGS ── */}
        {section==="mybookings"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h1 className="ral" style={{fontSize:22,fontWeight:900,marginBottom:18}}>My Bookings</h1>
            <div style={{display:"flex",gap:12,marginBottom:18}}>
              <StatCard label="Total Bookings" value={myBookings.length} icon="🎫" color={C.amber}/>
              <StatCard label="Revenue Generated" value={formatUGX(myBookings.filter(b=>b.payment_status==="confirmed").reduce((s,b)=>s+b.amount,0))} icon="💵" color={C.green}/>
            </div>
            <Card style={{padding:0,overflow:"hidden"}}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr>{["Code","Customer","Route","Seats","Amount","Status"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:"left",fontSize:10,color:C.textMuted,fontWeight:700,textTransform:"uppercase",background:C.navyMid,borderBottom:`1px solid ${C.navyBorder}`}}>{h}</th>)}</tr></thead>
                  <tbody>
                    {(myBookings.length>0?myBookings:store.bookings.filter(b=>b.agent_id)).map(b=>(
                      <tr key={b.id} onMouseEnter={e=>e.currentTarget.style.background=C.navyMid} onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <td style={{padding:"11px 14px",fontSize:13,borderBottom:`1px solid ${C.navyBorder}`}}><span style={{color:C.amber,fontFamily:"'Raleway',sans-serif",fontWeight:700}}>{b.booking_code}</span></td>
                        <td style={{padding:"11px 14px",fontSize:13,borderBottom:`1px solid ${C.navyBorder}`}}>{b.passenger}</td>
                        <td style={{padding:"11px 14px",fontSize:12,borderBottom:`1px solid ${C.navyBorder}`,color:C.textSecondary}}>{b.route}</td>
                        <td style={{padding:"11px 14px",fontSize:13,borderBottom:`1px solid ${C.navyBorder}`}}>{b.seats?.join(", ")||"—"}</td>
                        <td style={{padding:"11px 14px",fontSize:13,fontWeight:700,borderBottom:`1px solid ${C.navyBorder}`}}>{formatUGX(b.amount)}</td>
                        <td style={{padding:"11px 14px",borderBottom:`1px solid ${C.navyBorder}`}}><StatusBadge status={b.status}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ── AGENT: SCHEDULE VIEW ── */}
        {section==="schedule"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h1 className="ral" style={{fontSize:22,fontWeight:900,marginBottom:18}}>Today's Schedule</h1>
            <div style={{display:"grid",gap:12}}>
              {store.trips.map(t=>{const r=store.getRoute(t.route_id);const avail=store.seatsAvailable(t);return(
                <Card key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                  <div><div className="ral" style={{fontWeight:800,fontSize:17}}>{r.origin} → {r.destination}</div><div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{t.vehicle_reg} · {r.duration_minutes} min journey</div></div>
                  <div style={{display:"flex",gap:18}}>
                    <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.textMuted}}>Departs</div><div className="ral" style={{fontWeight:800,fontSize:20,color:C.amber}}>{formatTime(t.departure_time)}</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.textMuted}}>Seats</div><div style={{fontWeight:700,color:avail===0?C.red:C.green,fontSize:15}}>{avail===0?"FULL":avail}</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.textMuted}}>Fare</div><div className="ral" style={{fontWeight:700,color:C.amber}}>{formatUGX(r.price)}</div></div>
                    <Btn onClick={()=>{setTrip(t);setSection("book");setStep(2);}} disabled={avail===0} style={{padding:"8px 16px",fontSize:12}}>Book</Btn>
                  </div>
                </Card>
              );})}
            </div>
          </div>
        )}

        {/* ── AGENT: REGISTER CUSTOMER ── */}
        {section==="customers"&&(
          <div style={{animation:"fadeUp .3s ease",maxWidth:500}}>
            <h1 className="ral" style={{fontSize:22,fontWeight:900,marginBottom:18}}>Register New Customer</h1>
            <Card>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <Input label="Full Name" value="" onChange={()=>{}} placeholder="Customer's full name" required/>
                <Input label="Phone Number" value="" onChange={()=>{}} placeholder="+256 7XX XXX XXX" required/>
                <Input label="Email (optional)" type="email" value="" onChange={()=>{}} placeholder="email@example.com"/>
                <Sel label="Home District" value="" onChange={()=>{}} options={[{value:"",label:"Select district"},...["Kampala","Gulu","Mbarara","Mbale","Arua","Jinja"].map(d=>({value:d,label:d}))]}/>
                <div style={{background:C.navyLight,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.textMuted}}>Customer profile enables quick rebooking and booking history.</div>
                <Btn full style={{padding:"12px"}}>Register Customer</Btn>
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
  const store=useStore();
  const [page,setPage]=useState("home");
  const [preselectedTrip,setPreselectedTrip]=useState(null);
  const [currentUser,setCurrentUser]=useState(null);

  const handleLogin=(user)=>{
    setCurrentUser(user);
    if(user.role==="admin") setPage("admin");
    else if(user.role==="agent") setPage("agent");
  };
  const handleLogout=()=>{setCurrentUser(null);setPage("home");};

  const handleFeedbackSubmit=(f)=>store.setFeedback?null:null; // using store.feedback setState from parent via prop

  if(page==="login"&&!currentUser) return(
    <>
      <style>{globalCSS}</style>
      <LoginPage onLogin={handleLogin} agents={store.agents}/>
    </>
  );

  if(page==="admin"&&currentUser?.role==="admin") return(
    <>
      <style>{globalCSS}</style>
      <AdminDashboard store={store} currentUser={currentUser} onLogout={handleLogout}/>
    </>
  );

  if(page==="agent"&&currentUser?.role==="agent") return(
    <>
      <style>{globalCSS}</style>
      <AgentDashboard store={store} currentUser={currentUser} onLogout={handleLogout}/>
    </>
  );

  const handleSetPage=(p)=>{
    if(p==="logout"){handleLogout();return;}
    setPage(p);
  };

  return(
    <>
      <style>{globalCSS}</style>
      <Nav page={page} setPage={handleSetPage} currentUser={currentUser}/>
      {page==="home"     &&<HomePage      setPage={handleSetPage} setPreselectedTrip={setPreselectedTrip} store={store}/>}
      {page==="schedule" &&<SchedulePage  setPage={handleSetPage} setPreselectedTrip={setPreselectedTrip} store={store}/>}
      {page==="book"     &&<BookingPage   preselectedTrip={preselectedTrip} store={store} currentUser={currentUser}/>}
      {page==="plan"     &&<PlanJourneyPage store={store} currentUser={currentUser}/>}
      {page==="parcel"   &&<ParcelPage/>}
      {page==="safety"   &&<SafetyPage/>}
      {page==="faq"      &&<FAQPage/>}
    </>
  );
}

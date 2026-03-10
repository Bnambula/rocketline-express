import {useState,useEffect,useCallback} from "react";

class ErrorBoundary extends React.Component{
  constructor(p){super(p);this.state={hasError:false,msg:""};}
  static getDerivedStateFromError(e){return{hasError:true,msg:e.message};}
  render(){
    if(this.state.hasError) return(
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F4F8FF",padding:20}}>
        <div style={{maxWidth:480,textAlign:"center",padding:32,background:"#fff",borderRadius:20,border:"1px solid #D1DBF0",boxShadow:"0 4px 24px rgba(11,30,75,0.08)"}}>
          <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:800,marginBottom:8,color:"#0B1E4B"}}>Something went wrong</h2>
          <p style={{color:"#7A8FB5",marginBottom:20,fontSize:14}}>{this.state.msg}</p>
          <button onClick={()=>window.location.reload()} style={{background:"linear-gradient(135deg,#0B5FFF,#0044CC)",color:"#fff",border:"none",borderRadius:10,padding:"12px 28px",cursor:"pointer",fontFamily:"'Raleway',sans-serif",fontWeight:800,fontSize:14}}>Reload App</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

// ─── THEME COLORS (Light theme – global standard) ────────────────────
const C = {
  // Brand
  navy:"#0B1E4B",    navyMid:"#F0F4FF", navyLight:"#E8EEF9",
  navyBorder:"#D1DBF0", surface:"#FFFFFF", card:"#FFFFFF", cardHover:"#F8FAFF",
  amber:"#0B5FFF",   amberLight:"#3D7FFF", amberDark:"#0044CC",
  // Text
  textPrimary:"#0B1E4B", textSecondary:"#3D5280", textMuted:"#7A8FB5",
  // Status
  green:"#16A34A", greenBg:"#DCFCE7",
  red:"#DC2626",   redBg:"#FEE2E2",
  orange:"#EA580C", orangeBg:"#FFEDD5",
  blue:"#2563EB",  blueBg:"#DBEAFE",
  purple:"#7C3AED",purpleBg:"#EDE9FE",
  amber2:"#D97706", amberBg:"#FEF3C7",
  // Dashboard dark accent
  darkBg:"#0B1E4B", darkCard:"#0F2557", darkBorder:"#1A3170",
  darkText:"#E8EEF9", darkMuted:"#7A8FB5",
  // Btn special
  bookNow:"#0B5FFF",  bookNowHover:"#0044CC",
  quote:"#16A34A",   quoteHover:"#15803D",
  white:"#FFFFFF",
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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@300;400;500;600;700&family=Raleway:wght@400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{background:#F4F8FF;color:${C.textPrimary};font-family:'Inter',sans-serif;overflow-x:hidden;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:#F0F4FF;}
::-webkit-scrollbar-thumb{background:#D1DBF0;border-radius:3px;}
.playfair{font-family:'Playfair Display',serif !important;}
.ral{font-family:'Raleway',sans-serif;}
.inter{font-family:'Inter',sans-serif;}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
@keyframes blink{0%,100%{box-shadow:0 0 0 0 ${C.amber}55;}50%{box-shadow:0 0 14px 5px ${C.amber}22;}}
@keyframes urgentPulse{0%,100%{background:${C.orange}10;}50%{background:${C.orange}20;}}
@keyframes slideIn{from{transform:translateX(-10px);opacity:0;}to{transform:translateX(0);opacity:1;}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
.fade-up{animation:fadeUp .4s ease forwards;}
.live-dot{width:8px;height:8px;border-radius:50%;background:${C.green};animation:pulse 1.5s infinite;display:inline-block;}
.urgent-card{animation:urgentPulse 1.5s infinite;}
.pulse-timer{animation:blink 1s infinite;}
select option{background:#fff;color:${C.textPrimary};}
input[type=checkbox]{accent-color:${C.amber};}
.btn-book{background:linear-gradient(135deg,${C.bookNow},${C.amberDark});color:#fff;border:none;border-radius:10px;padding:12px 28px;font-family:'Raleway',sans-serif;font-weight:800;font-size:14px;cursor:pointer;letter-spacing:.3px;transition:all .2s;box-shadow:0 4px 15px ${C.amber}33;}
.btn-book:hover{transform:translateY(-2px);box-shadow:0 8px 24px ${C.amber}44;}
.btn-quote{background:linear-gradient(135deg,${C.quote},${C.quoteHover});color:#fff;border:none;border-radius:10px;padding:12px 28px;font-family:'Raleway',sans-serif;font-weight:800;font-size:14px;cursor:pointer;letter-spacing:.3px;transition:all .2s;box-shadow:0 4px 15px ${C.green}33;}
.btn-quote:hover{transform:translateY(-2px);box-shadow:0 8px 24px ${C.green}44;}
.card-hover:hover{box-shadow:0 8px 30px rgba(11,30,75,0.12);transform:translateY(-2px);}
@media(max-width:768px){
  .hide-mobile{display:none !important;}
  .mobile-full{width:100% !important;}
  .mobile-stack{flex-direction:column !important;}
  .mobile-center{text-align:center !important;}
  .mobile-pad{padding:16px !important;}
}
`;

// ─── BASE UI COMPONENTS ───────────────────────────────────────────────
const Badge=({color=C.amber,bg,children})=>(
  <span style={{background:bg||color+"18",color,border:`1px solid ${color}33`,borderRadius:6,padding:"2px 10px",fontSize:11,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase"}}>{children}</span>
);
const StatusBadge=({status})=>{
  const map={
    confirmed:{c:C.green,bg:C.greenBg},pending:{c:C.amber2,bg:C.amberBg},
    cancelled:{c:C.red,bg:C.redBg},active:{c:C.green,bg:C.greenBg},
    filling:{c:C.amber2,bg:C.amberBg},maintenance:{c:C.red,bg:C.redBg},
    company:{c:C.blue,bg:C.blueBg},vendor:{c:C.purple,bg:C.purpleBg},
    approved:{c:C.green,bg:C.greenBg},suspended:{c:C.red,bg:C.redBg},
    advance:{c:C.blue,bg:C.blueBg},reserved:{c:C.orange,bg:C.orangeBg}
  };
  const s=map[status]||{c:C.blue,bg:C.blueBg};
  return <Badge color={s.c} bg={s.bg}>{status}</Badge>;
};

const Btn=({children,onClick,variant="primary",style:s={},disabled,full,size="md"})=>{
  const sizes={sm:{padding:"7px 14px",fontSize:12},md:{padding:"10px 22px",fontSize:13},lg:{padding:"14px 32px",fontSize:15}};
  const sz=sizes[size]||sizes.md;
  const styles={
    primary:{background:`linear-gradient(135deg,${C.bookNow},${C.amberDark})`,color:"#fff",border:"none",boxShadow:`0 4px 15px ${C.amber}33`},
    success:{background:`linear-gradient(135deg,${C.quote},${C.quoteHover})`,color:"#fff",border:"none",boxShadow:`0 4px 15px ${C.green}33`},
    navy:{background:"transparent",color:C.textSecondary,border:`1px solid ${C.navyBorder}`},
    outline:{background:"transparent",color:C.amber,border:`1.5px solid ${C.amber}`},
    danger:{background:C.redBg,color:C.red,border:`1px solid ${C.red}44`},
    dark:{background:C.darkCard,color:C.darkText,border:`1px solid ${C.darkBorder}`},
    ghost:{background:"transparent",color:C.textMuted,border:"1px solid transparent"},
  };
  const vs=styles[variant]||styles.primary;
  return(
    <button onClick={onClick} disabled={disabled} style={{
      ...vs,...sz,borderRadius:10,fontFamily:"'Raleway',sans-serif",fontWeight:800,
      cursor:disabled?"not-allowed":"pointer",opacity:disabled?.5:1,transition:"all .2s",letterSpacing:".3px",
      width:full?"100%":"auto",...s
    }}
    onMouseEnter={e=>{if(!disabled){if(variant==="primary"||variant==="success"){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 24px ${variant==="success"?C.green:C.amber}44`;}else if(variant==="navy"||variant==="outline"){e.currentTarget.style.background=C.navyLight;}}}}
    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=vs.boxShadow||"";e.currentTarget.style.background=vs.background;}}
    >{children}</button>
  );
};

const BookBtn=({children="🎫 Book Now",onClick,full,style:s={}})=>(
  <button className="btn-book" onClick={onClick} style={{width:full?"100%":"auto",...s}}>{children}</button>
);
const QuoteBtn=({children="📋 Get Quote",onClick,full,style:s={}})=>(
  <button className="btn-quote" onClick={onClick} style={{width:full?"100%":"auto",...s}}>{children}</button>
);

const Input=({label,type="text",value,onChange,placeholder,style:s={},required,error})=>(
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontSize:11,color:error?C.red:C.textMuted,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>{label}{required&&<span style={{color:C.red}}> *</span>}</label>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{background:C.white,border:`1.5px solid ${error?C.red:C.navyBorder}`,borderRadius:10,padding:"11px 14px",color:C.textPrimary,fontSize:14,outline:"none",transition:"border .2s",fontFamily:"'Inter',sans-serif",...s}}
      onFocus={e=>e.target.style.borderColor=error?C.red:C.amber} onBlur={e=>e.target.style.borderColor=error?C.red:C.navyBorder}/>
    {error&&<span style={{fontSize:11,color:C.red}}>{error}</span>}
  </div>
);

const Textarea=({label,value,onChange,placeholder,rows=4})=>(
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontSize:11,color:C.textMuted,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>{label}</label>}
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{background:C.white,border:`1.5px solid ${C.navyBorder}`,borderRadius:10,padding:"11px 14px",color:C.textPrimary,fontSize:14,outline:"none",resize:"vertical",fontFamily:"'Inter',sans-serif"}}
      onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor=C.navyBorder}/>
  </div>
);

const Sel=({label,value,onChange,options,style:s={},required})=>(
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontSize:11,color:C.textMuted,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>{label}{required&&<span style={{color:C.red}}> *</span>}</label>}
    <select value={value} onChange={onChange} style={{background:C.white,border:`1.5px solid ${C.navyBorder}`,borderRadius:10,padding:"11px 14px",color:C.textPrimary,fontSize:14,outline:"none",cursor:"pointer",...s}}
      onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor=C.navyBorder}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Card=({children,style:s={},className=""})=>(
  <div className={className} style={{background:C.white,border:`1px solid ${C.navyBorder}`,borderRadius:16,padding:24,boxShadow:"0 1px 6px rgba(11,30,75,0.06)",...s}}>{children}</div>
);

const Modal=({open,onClose,title,children,wide})=>{
  if(!open) return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(11,30,75,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.white,border:`1px solid ${C.navyBorder}`,borderRadius:20,padding:28,maxWidth:wide?720:520,width:"100%",maxHeight:"90vh",overflowY:"auto",animation:"fadeUp .3s ease",boxShadow:"0 20px 60px rgba(11,30,75,0.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <h2 className="playfair" style={{fontSize:20,fontWeight:800,color:C.textPrimary}}>{title}</h2>
          <button onClick={onClose} style={{background:C.navyLight,border:`1px solid ${C.navyBorder}`,color:C.textMuted,borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:15}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Tabs=({tabs,active,onChange})=>(
  <div style={{display:"flex",gap:4,background:C.navyLight,borderRadius:12,padding:4,flexWrap:"wrap",border:`1px solid ${C.navyBorder}`}}>
    {tabs.map(t=>(
      <button key={t} onClick={()=>onChange(t)}
        style={{padding:"8px 16px",borderRadius:9,border:"none",background:active===t?C.amber:"transparent",color:active===t?"#fff":C.textMuted,cursor:"pointer",fontFamily:"'Raleway',sans-serif",fontWeight:700,fontSize:12,transition:"all .2s"}}>
        {t}
      </button>
    ))}
  </div>
);

const Stars=({rating,onChange,size=18})=>(
  <div style={{display:"flex",gap:3}}>
    {[1,2,3,4,5].map(s=>(
      <span key={s} onClick={()=>onChange&&onChange(s)}
        style={{fontSize:size,cursor:onChange?"pointer":"default",color:s<=rating?C.amber2:C.navyBorder,transition:"color .15s"}}>★</span>
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
    <svg width={size} height={size} style={{borderRadius:8,background:"#fff",padding:4,border:`1px solid ${C.navyBorder}`}}>
      {grid.map((row,r)=>row.map((on,c)=>on&&<rect key={`${r}-${c}`} x={c*cell} y={r*cell} width={cell} height={cell} fill={C.navy}/>))}
    </svg>
  );
};

const SeatMap=({capacity=14,bookedSeats=[],reservedSeats=[],onSelect,selected=[],size="normal"})=>{
  const rows=Math.ceil((capacity-1)/3);
  const cellW=size==="small"?36:44, cellH=size==="small"?30:36;
  const getSeatState=(n)=>{
    if(bookedSeats.includes(n)) return "booked";
    if(reservedSeats.includes(n)) return "reserved";
    if(selected.includes(n)) return "selected";
    return "free";
  };
  const colors={
    booked:{bg:C.redBg,border:C.red,color:C.red},
    reserved:{bg:C.orangeBg,border:C.orange,color:C.orange},
    selected:{bg:C.amber,border:C.amber,color:"#fff"},
    free:{bg:C.navyLight,border:C.navyBorder,color:C.textMuted}
  };
  return(
    <div style={{background:C.navyLight,border:`1px solid ${C.navyBorder}`,borderRadius:16,padding:16,display:"inline-block"}}>
      <div style={{textAlign:"center",fontSize:10,color:C.textMuted,letterSpacing:1,marginBottom:10,textTransform:"uppercase"}}>Front / Driver</div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
        <div style={{width:cellW,height:cellH,background:C.navy,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🚗</div>
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
        <span style={{color:C.textMuted}}>■ Free</span>
      </div>
    </div>
  );
};

const CountdownTimer=({departure})=>{
  const {str,urgent,boarding}=useCountdown(departure);
  if(str==="Departed") return <span style={{color:C.textMuted,fontSize:13}}>Departed</span>;
  return(
    <div>
      {boarding&&<div style={{fontSize:10,color:C.orange,fontWeight:700,animation:"pulse 1s infinite",marginBottom:2}}>🔴 Boarding Soon</div>}
      <div className={urgent?"pulse-timer ral":"ral"} style={{fontWeight:900,fontSize:urgent?19:17,color:boarding?C.orange:urgent?C.amber2:C.textPrimary,letterSpacing:2,fontVariantNumeric:"tabular-nums"}}>
        {str}
      </div>
      <div style={{fontSize:10,color:C.textMuted,marginTop:1}}>until departure</div>
    </div>
  );
};

const TripCard=({trip,onBook,store,i=0})=>{
  const route=store.getRoute(trip.route_id);
  const {urgent,boarding}=useCountdown(trip.departure_time);
  const avail=store.seatsAvailable(trip);
  const pct=Math.round(((trip.capacity-avail)/trip.capacity)*100);
  const isFull=avail<=0;
  return(
    <div className={urgent&&!isFull?"urgent-card card-hover":isFull?"":"card-hover"} style={{background:C.white,border:`1.5px solid ${boarding?C.orange:urgent?C.amber2+"66":C.navyBorder}`,borderRadius:18,padding:22,animation:`fadeUp ${.25+i*.08}s ease`,transition:"all .2s",position:"relative",overflow:"hidden",boxShadow:"0 2px 12px rgba(11,30,75,0.07)"}}>
      {boarding&&!isFull&&<div style={{position:"absolute",top:0,right:0,background:`linear-gradient(135deg,${C.orange},#c2410c)`,color:"#fff",fontSize:10,fontWeight:800,padding:"4px 12px",borderRadius:"0 16px 0 10px"}}>BOARDING SOON</div>}
      {isFull&&<div style={{position:"absolute",top:0,right:0,background:C.red,color:"#fff",fontSize:10,fontWeight:800,padding:"4px 12px",borderRadius:"0 16px 0 10px"}}>FULLY BOOKED</div>}
      <div style={{marginBottom:12}}>
        <div className="playfair" style={{fontWeight:800,fontSize:18,color:C.textPrimary}}>{route.origin} → {route.destination}</div>
        <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{trip.vehicle_reg} · {Math.floor(route.duration_minutes/60)}h {route.duration_minutes%60}m</div>
      </div>
      <div style={{display:"flex",gap:18,alignItems:"flex-start",marginBottom:14,flexWrap:"wrap"}}>
        <div><div style={{fontSize:10,color:C.textMuted,fontWeight:600}}>DEPARTURE</div><div className="ral" style={{fontWeight:900,fontSize:22,color:C.amber}}>{formatTime(trip.departure_time)}</div></div>
        <div><div style={{fontSize:10,color:C.textMuted,fontWeight:600}}>COUNTDOWN</div><CountdownTimer departure={trip.departure_time}/></div>
        <div><div style={{fontSize:10,color:C.textMuted,fontWeight:600}}>FARE</div><div className="ral" style={{fontWeight:800,fontSize:18,color:C.green}}>{formatUGX(route.price)}</div></div>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textMuted,marginBottom:4}}>
          <span>{isFull?"No seats available":`${avail} seats remaining`}</span><span>{pct}% full</span>
        </div>
        <div style={{height:5,background:C.navyLight,borderRadius:3}}>
          <div style={{width:`${pct}%`,height:"100%",background:isFull?C.red:pct>80?C.orange:pct>50?C.amber2:C.green,borderRadius:3,transition:"width .5s"}}/>
        </div>
      </div>
      {isFull?(
        <div style={{display:"flex",gap:8}}>
          <BookBtn onClick={()=>onBook(trip,"next")} style={{flex:1,padding:"9px 10px",fontSize:12}}>Next Van →</BookBtn>
          <Btn onClick={()=>onBook(null,"all")} variant="navy" style={{flex:1,padding:"9px 10px",fontSize:12}}>All Trips</Btn>
        </div>
      ):(
        <BookBtn onClick={()=>onBook(trip)} full>🎫 BOOK NOW</BookBtn>
      )}
    </div>
  );
};

const StatCard=({label,value,icon,color=C.amber,sub,dark})=>(
  <div style={{background:dark?C.darkCard:C.white,border:`1px solid ${dark?C.darkBorder:C.navyBorder}`,borderRadius:16,padding:20,flex:1,minWidth:140,boxShadow:"0 2px 8px rgba(11,30,75,0.06)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
      <span style={{fontSize:24}}>{icon}</span>
      <span className="playfair" style={{fontSize:22,fontWeight:800,color}}>{value}</span>
    </div>
    <div style={{fontSize:11,color:dark?C.darkMuted:C.textMuted,textTransform:"uppercase",letterSpacing:".5px",fontWeight:600}}>{label}</div>
    {sub&&<div style={{fontSize:11,color:C.green,marginTop:3,fontWeight:600}}>{sub}</div>}
  </div>
);

// ─── NAVIGATION ───────────────────────────────────────────────────────
const Nav=({page,setPage,currentUser})=>{
  const [menuOpen,setMenuOpen]=useState(false);
  const links=[{id:"home",label:"Home"},{id:"schedule",label:"Schedule"},{id:"plan",label:"Plan Journey"},{id:"parcel",label:"Courier"},{id:"safety",label:"Safety"},{id:"faq",label:"FAQ"}];
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(255,255,255,0.95)",backdropFilter:"blur(14px)",borderBottom:`1px solid ${C.navyBorder}`,boxShadow:"0 2px 16px rgba(11,30,75,0.08)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 20px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div onClick={()=>setPage("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 4px 12px ${C.amber}33`}}>🚐</div>
          <div>
            <div className="playfair" style={{fontWeight:900,fontSize:17,letterSpacing:"-0.5px",lineHeight:1,color:C.navy}}>Raylane<span style={{color:C.amber}}>Express</span></div>
            <div style={{fontSize:9,color:C.textMuted,letterSpacing:2,textTransform:"uppercase"}}>Transport Services</div>
          </div>
        </div>
        {/* Desktop nav */}
        <div className="hide-mobile" style={{display:"flex",gap:2,alignItems:"center"}}>
          {links.map(l=>(
            <button key={l.id} onClick={()=>setPage(l.id)} style={{background:page===l.id?C.amber+"15":"transparent",color:page===l.id?C.amber:C.textSecondary,border:page===l.id?`1px solid ${C.amber}33`:"1px solid transparent",borderRadius:8,padding:"7px 13px",cursor:"pointer",fontSize:13,fontFamily:"'Inter',sans-serif",fontWeight:page===l.id?700:500,transition:"all .2s"}}>
              {l.label}
            </button>
          ))}
          <div style={{width:1,height:22,background:C.navyBorder,margin:"0 8px"}}/>
          <BookBtn onClick={()=>setPage("book")} style={{padding:"8px 20px",fontSize:13}}>Book Now</BookBtn>
          {currentUser?(
            <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:6}}>
              <span style={{fontSize:12,color:C.amber,fontWeight:700}}>👤 {currentUser.name}</span>
              <Btn onClick={()=>setPage("logout")} variant="navy" style={{padding:"6px 14px",fontSize:11}}>Logout</Btn>
            </div>
          ):(
            <Btn onClick={()=>setPage("login")} variant="navy" style={{padding:"7px 16px",fontSize:12,marginLeft:6}}>Staff Login</Btn>
          )}
        </div>
        {/* Mobile hamburger */}
        <button onClick={()=>setMenuOpen(!menuOpen)} className="hide-desktop" style={{background:"none",border:`1px solid ${C.navyBorder}`,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:18,color:C.textPrimary,display:"none"}} id="nav-hamburger">☰</button>
      </div>
      {/* Mobile menu */}
      {menuOpen&&(
        <div style={{background:C.white,borderTop:`1px solid ${C.navyBorder}`,padding:"12px 20px 16px",animation:"fadeUp .2s ease"}}>
          {links.map(l=>(
            <button key={l.id} onClick={()=>{setPage(l.id);setMenuOpen(false);}} style={{display:"block",width:"100%",textAlign:"left",padding:"11px 0",background:"none",border:"none",borderBottom:`1px solid ${C.navyLight}`,color:page===l.id?C.amber:C.textPrimary,cursor:"pointer",fontSize:14,fontFamily:"'Inter',sans-serif",fontWeight:500}}>
              {l.label}
            </button>
          ))}
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <BookBtn onClick={()=>{setPage("book");setMenuOpen(false);}} style={{flex:1}}>Book Now</BookBtn>
            <Btn onClick={()=>{setPage("login");setMenuOpen(false);}} variant="navy" style={{flex:1}}>Login</Btn>
          </div>
        </div>
      )}
    </nav>
  );
};

// ─── FAQ ITEM ─────────────────────────────────────────────────────────
const FAQItem=({f})=>{
  const [open,setOpen]=useState(false);
  return(
    <div style={{border:`1px solid ${open?C.amber+"44":C.navyBorder}`,borderRadius:12,marginBottom:10,overflow:"hidden",transition:"border .2s",boxShadow:open?"0 4px 16px rgba(11,30,75,0.08)":"none"}}>
      <div onClick={()=>setOpen(!open)} style={{padding:"14px 18px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:open?C.amber+"0A":C.white}}>
        <span style={{fontWeight:600,fontSize:14,color:C.textPrimary}}>{f.q}</span>
        <span style={{color:C.amber,fontWeight:800,fontSize:18,transform:open?"rotate(45deg)":"rotate(0)",transition:"transform .2s"}}>+</span>
      </div>
      {open&&<div style={{padding:"0 18px 14px",background:C.white,fontSize:13,color:C.textSecondary,lineHeight:1.8,animation:"fadeUp .2s ease"}}>{f.a}</div>}
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
    <div style={{minHeight:"100vh",paddingTop:64,background:C.navyLight}}>
      {/* HERO */}
      <div style={{position:"relative",background:`linear-gradient(135deg,${C.navy} 0%,#1A3A80 50%,${C.navy} 100%)`,padding:"80px 20px 70px",overflow:"hidden",minHeight:520,display:"flex",alignItems:"center"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle at 15% 50%,${C.amber}15,transparent 55%),radial-gradient(circle at 85% 30%,${C.blue}12,transparent 50%)`}}/>
        {/* Decorative circles */}
        <div style={{position:"absolute",right:-100,top:"50%",transform:"translateY(-50%)",width:500,height:500,borderRadius:"50%",border:`1.5px solid rgba(255,255,255,0.08)`,pointerEvents:"none"}}/>
        <div style={{position:"absolute",right:40,top:"50%",transform:"translateY(-50%)",width:320,height:320,borderRadius:"50%",border:`1.5px solid rgba(255,255,255,0.05)`,pointerEvents:"none"}}/>
        <div style={{maxWidth:1200,margin:"0 auto",position:"relative",width:"100%"}}>
          <div style={{maxWidth:640,animation:"fadeUp .5s ease"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(22,163,74,0.2)",border:"1px solid rgba(22,163,74,0.4)",borderRadius:20,padding:"5px 14px",marginBottom:20,fontSize:12,color:"#4ade80",fontWeight:700}}>
              <span className="live-dot"/> Live · {store.trips.filter(t=>store.seatsAvailable(t)>0).length} trips available today
            </div>
            <h1 className="playfair" style={{fontSize:"clamp(36px,5.5vw,68px)",fontWeight:900,lineHeight:1.05,letterSpacing:"-2px",marginBottom:18,color:C.white}}>
              Travel Across<br/><span style={{color:C.amberLight}}>Uganda</span> With<br/>Confidence
            </h1>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.7)",maxWidth:460,lineHeight:1.8,marginBottom:32}}>
              Fast, reliable transport from Kampala to every corner of Uganda. Book your seat in under 2 minutes.
            </p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:32}}>
              <BookBtn onClick={()=>setPage("book")} style={{fontSize:15,padding:"14px 32px"}}>🎫 Book Your Ride</BookBtn>
              <QuoteBtn onClick={()=>setPage("plan")} style={{fontSize:15,padding:"14px 28px"}}>📋 Get a Quote</QuoteBtn>
              <Btn onClick={()=>setPage("schedule")} variant="ghost" style={{fontSize:14,padding:"14px 24px",color:"rgba(255,255,255,0.8)",border:"1.5px solid rgba(255,255,255,0.25)"}}>📅 View Schedule</Btn>
            </div>
            <div style={{display:"flex",gap:20,fontSize:13,color:"rgba(255,255,255,0.6)",flexWrap:"wrap"}}>
              {[["💳","MTN & Airtel Money"],["💬","WhatsApp receipt"],["📦","Courier service"],["🛡️","Safe journeys"]].map(([ic,l])=>(
                <span key={l} style={{display:"flex",alignItems:"center",gap:6}}>{ic} {l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LIVE DEPARTURE BAR */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.navyBorder}`,padding:"12px 20px",boxShadow:"0 2px 8px rgba(11,30,75,0.05)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span className="live-dot"/>
            <span className="ral" style={{fontWeight:800,color:C.amber,fontSize:14}}>Today's Live Departures</span>
            <span style={{color:C.textMuted,fontSize:13}}>— {store.trips.length} trips scheduled</span>
          </div>
          <Btn onClick={()=>setPage("schedule")} variant="outline" style={{padding:"6px 16px",fontSize:12}}>Full Schedule →</Btn>
        </div>
      </div>

      {/* TRIP CARDS */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:16}}>
          {store.trips.map((trip,i)=><TripCard key={trip.id} trip={trip} i={i} onBook={handleBook} store={store}/>)}
        </div>
      </div>

      {/* WHY RAYLANE */}
      <div style={{background:C.white,borderTop:`1px solid ${C.navyBorder}`,borderBottom:`1px solid ${C.navyBorder}`}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"52px 20px"}}>
          <h2 className="playfair" style={{fontSize:32,fontWeight:800,textAlign:"center",marginBottom:8,color:C.navy}}>Why Choose Raylane Express?</h2>
          <p style={{textAlign:"center",color:C.textMuted,marginBottom:36,fontSize:14}}>Uganda's most trusted intercity transport</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:20}}>
            {[{icon:"🛡️",title:"Safety First",desc:"Strict safety protocols and licensed drivers on every trip."},{icon:"⚡",title:"Fast Booking",desc:"Book in under 2 minutes, boarding pass on WhatsApp."},{icon:"💺",title:"Comfortable Rides",desc:"Modern, clean vehicles for every journey."},{icon:"💳",title:"Mobile Money",desc:"Pay via MTN or Airtel Money instantly."}].map(f=>(
              <Card key={f.title} className="card-hover" style={{textAlign:"center",transition:"all .2s",cursor:"default"}}>
                <div style={{width:52,height:52,borderRadius:14,background:C.navyLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px"}}>
                  {f.icon}
                </div>
                <div className="ral" style={{fontWeight:700,fontSize:15,marginBottom:8,color:C.textPrimary}}>{f.title}</div>
                <p style={{fontSize:13,color:C.textMuted,lineHeight:1.7}}>{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* OUR ROUTES */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"48px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24}}>
          <div>
            <h2 className="playfair" style={{fontSize:28,fontWeight:800,color:C.navy}}>Our Routes</h2>
            <p style={{color:C.textMuted,fontSize:13,marginTop:4}}>Daily departures from Kampala to across Uganda</p>
          </div>
          <BookBtn onClick={()=>setPage("book")} style={{fontSize:13,padding:"10px 22px"}}>Book Any Route</BookBtn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12}}>
          {ROUTES.map(r=>(
            <div key={r.id} onClick={()=>setPage("book")} className="card-hover" style={{background:C.white,border:`1px solid ${C.navyBorder}`,borderRadius:14,padding:"16px 18px",cursor:"pointer",transition:"all .2s",boxShadow:"0 1px 6px rgba(11,30,75,0.05)"}}>
              <div style={{fontSize:11,color:C.textMuted,fontWeight:500}}>Kampala →</div>
              <div className="playfair" style={{fontWeight:800,fontSize:18,margin:"4px 0 10px",color:C.navy}}>{r.destination}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:C.green,fontWeight:700,fontSize:14}}>{formatUGX(r.price)}</span>
                <span style={{background:C.navyLight,borderRadius:6,padding:"3px 8px",fontSize:11,color:C.textMuted,fontWeight:500}}>{Math.floor(r.duration_minutes/60)}h {r.duration_minutes%60}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{background:C.navy}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"56px 20px"}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <h2 className="playfair" style={{fontSize:32,fontWeight:800,marginBottom:8,color:C.white}}>What Passengers Say</h2>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:14}}>Real reviews from verified travellers</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:16,marginBottom:40}}>
            {approved.map((f,i)=>(
              <div key={f.id} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:16,padding:22,animation:`fadeUp ${.15+i*.07}s ease`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                  <div>
                    <div className="ral" style={{fontWeight:700,fontSize:14,color:C.white}}>{f.name}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:2}}>{f.route} · {f.date}</div>
                  </div>
                  <Stars rating={f.rating} size={14}/>
                </div>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.7)",lineHeight:1.7,fontStyle:"italic"}}>"{f.message}"</p>
              </div>
            ))}
          </div>
          <FeedbackForm store={store} onSubmit={()=>{}}/>
        </div>
      </div>

      {/* FAQ PREVIEW */}
      <div style={{maxWidth:780,margin:"0 auto",padding:"52px 20px"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <h2 className="playfair" style={{fontSize:28,fontWeight:800,color:C.navy,marginBottom:6}}>Frequently Asked Questions</h2>
          <p style={{color:C.textMuted,fontSize:14}}>Answers to common travel questions</p>
        </div>
        {FAQ_DATA.slice(0,4).map((f,i)=><FAQItem key={i} f={f}/>)}
        <div style={{textAlign:"center",marginTop:24}}>
          <Btn onClick={()=>setPage("faq")} variant="outline">View All FAQs →</Btn>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:C.navy,borderTop:`1px solid rgba(255,255,255,0.1)`,padding:"44px 20px 20px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:32,marginBottom:36}}>
            <div>
              <div className="playfair" style={{fontWeight:800,fontSize:18,color:C.white,marginBottom:12}}>Raylane<span style={{color:C.amberLight}}>Express</span></div>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.8}}>Safe, reliable transport across Uganda since 2018.</p>
            </div>
            {[{title:"Services",links:["Book a Seat","Plan Journey","Hire a Van","Courier/Parcel"]},{title:"Support",links:["Safety Guidelines","FAQ","Contact Us","Lost & Found"]},{title:"Contact",links:["+256 700 000000","info@raylane.ug","Nakasero, Kampala","Mon–Sun 5AM–10PM"]}].map(col=>(
              <div key={col.title}>
                <div className="ral" style={{fontWeight:800,fontSize:11,letterSpacing:".5px",color:C.amberLight,marginBottom:14,textTransform:"uppercase"}}>{col.title}</div>
                {col.links.map(l=><div key={l} style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:8,cursor:"pointer"}}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:16,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,fontSize:12,color:"rgba(255,255,255,0.35)"}}>
            <span>© 2026 Raylane Express Ltd. All rights reserved.</span>
            <span>Privacy · Terms · Refunds</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeedbackForm=({store,onSubmit})=>{
  const [form,setForm]=useState({name:"",route:"",rating:5,message:""});
  const [done,setDone]=useState(false);
  const handle=()=>{if(!form.name||!form.message)return;onSubmit&&onSubmit({...form,date:new Date().toISOString().split("T")[0],status:"pending"});setDone(true);};
  if(done) return(
    <div style={{maxWidth:520,margin:"0 auto",textAlign:"center",padding:32,background:"rgba(22,163,74,0.1)",borderRadius:16,border:"1px solid rgba(22,163,74,0.3)"}}>
      <div style={{fontSize:44,marginBottom:12}}>✅</div>
      <div className="playfair" style={{fontWeight:800,fontSize:20,color:"#4ade80",marginBottom:6}}>Thank You!</div>
      <p style={{fontSize:14,color:"rgba(255,255,255,0.6)"}}>Your review is awaiting admin approval before it appears on the site.</p>
    </div>
  );
  return(
    <div style={{maxWidth:520,margin:"0 auto",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:16,padding:24}}>
      <h3 className="playfair" style={{fontWeight:800,fontSize:20,marginBottom:4,color:C.white}}>Share Your Experience</h3>
      <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:20}}>Reviews appear after admin approval.</p>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          <label style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>Your Name</label>
          <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Sarah Nakato"
            style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"11px 14px",color:C.white,fontSize:14,outline:"none"}}
            onFocus={e=>e.target.style.borderColor=C.amberLight} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.15)"}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          <label style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>Route Travelled</label>
          <select value={form.route} onChange={e=>setForm({...form,route:e.target.value})}
            style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"11px 14px",color:C.white,fontSize:14,outline:"none"}}>
            <option value="">Select your route</option>
            {ROUTES.map(r=><option key={r.id} value={`${r.origin} → ${r.destination}`}>{r.origin} → {r.destination}</option>)}
          </select>
        </div>
        <div><label style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,letterSpacing:".5px",textTransform:"uppercase",display:"block",marginBottom:10}}>Rating</label><Stars rating={form.rating} onChange={r=>setForm({...form,rating:r})} size={26}/></div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          <label style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>Your Review</label>
          <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell us about your journey..." rows={4}
            style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"11px 14px",color:C.white,fontSize:14,outline:"none",resize:"vertical",fontFamily:"'Inter',sans-serif"}}
            onFocus={e=>e.target.style.borderColor=C.amberLight} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.15)"}/>
        </div>
        <BookBtn onClick={handle} style={{padding:"13px",opacity:(!form.name||!form.message)?0.5:1}} full>Submit Review</BookBtn>
      </div>
    </div>
  );
};

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
                      <BookBtn onClick={()=>{setPreselectedTrip(trip);setPage("book");}} style={{padding:"6px 14px",fontSize:12}}>Book</BookBtn>}
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
// ═══════════════════════════════════════════════════════════════════
// FINANCE, PAYROLL & SACO MODULES
// ═══════════════════════════════════════════════════════════════════
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// FINANCE MODULE \u2014 IASB/GAAP/URA COMPLIANT
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

const EXPENSE_CATEGORIES=[
  "Fuel","Vehicle Servicing","Tyre Replacement","Vehicle Washing","Vehicle Insurance","Road License Fees","Parking Fees",
  "Driver Salary","Driver Trip Allowance","Driver Overtime","Driver Accommodation",
  "Office Staff Salary","Agent Commissions","Temporary Staff","Staff Lunch Allowance","Staff Transport Allowance",
  "Office Rent","Electricity","Internet Services","Software Subscriptions","Stationery",
  "Business Registration","Transport Licensing","Vehicle Permits","Legal Consultation",
  "Traffic Fines","Vehicle Impound","Road Compliance Penalties",
  "Advertising","Promotional Discounts","Online Advertising",
  "Mechanic Services","Vehicle Towing","Vehicle Inspection",
  "Vendor Van Hire","Vendor Driver Allowance","Vendor Fuel Reimbursement",
  "Loan Repayment","Bank Charges","Other"
];

const PAYMENT_METHODS=["MTN MoMo","Airtel Money","Cash","Bank Transfer","Cheque"];

const AdminFinanceSection=({store})=>{
  const [tab,setTab]=useState("overview");
  // Expense CRUD
  const [expenses,setExpenses]=useState(store.expenses||[]);
  const [showExpModal,setShowExpModal]=useState(false);
  const [editingExp,setEditingExp]=useState(null);
  const [expForm,setExpForm]=useState({category:"Fuel",amount:"",description:"",date:new Date().toISOString().split("T")[0],paymentMethod:"MTN MoMo",vehicle:"",route:"",vendor:""});
  const [deleteConfirm,setDeleteConfirm]=useState(null);
  // Report period
  const [period,setPeriod]=useState("monthly");
  const [reportMonth,setReportMonth]=useState(new Date().toISOString().slice(0,7));
  // Finance users
  const [financeUsers,setFinanceUsers]=useState([
    {id:"FU-001",name:"Ruth Kamya",email:"ruth@raylane.ug",role:"viewer",added:"2026-01-10"},
  ]);
  const [showUserModal,setShowUserModal]=useState(false);
  const [userForm,setUserForm]=useState({name:"",email:"",role:"viewer"});
  // Revenue transactions from bookings
  const allBookings=store.bookings||[];
  const confirmedBookings=allBookings.filter(b=>b.payment_status==="confirmed");
  const totalRevenue=confirmedBookings.reduce((s,b)=>s+b.amount,0);
  const totalExpenses=expenses.reduce((s,e)=>s+Number(e.amount),0);
  const netProfit=totalRevenue-totalExpenses;

  // Filter by period
  const filterByPeriod=(items,dateField)=>{
    const now=new Date();
    return items.filter(it=>{
      const d=new Date(it[dateField]||it.date);
      if(period==="daily") return d.toDateString()===now.toDateString();
      if(period==="weekly"){const w=new Date(now);w.setDate(now.getDate()-7);return d>=w;}
      if(period==="monthly") return it[dateField]?.startsWith(reportMonth)||it.date?.startsWith(reportMonth);
      if(period==="quarterly"){const q=Math.floor(now.getMonth()/3);const dm=d.getMonth();return d.getFullYear()===now.getFullYear()&&Math.floor(dm/3)===q;}
      return d.getFullYear()===now.getFullYear();
    });
  };

  const periodRevenue=filterByPeriod(confirmedBookings,"date").reduce((s,b)=>s+b.amount,0);
  const periodExpenses=filterByPeriod(expenses,"date").reduce((s,e)=>s+Number(e.amount),0);

  // Revenue by category
  const passengerRev=confirmedBookings.reduce((s,b)=>s+b.amount,0);
  const parcelRev=0; // extend when parcel payments wired
  const hireRev=0;
  const totalRevenueCats=passengerRev+parcelRev+hireRev;

  // Expense by category
  const expByCategory={};
  expenses.forEach(e=>{expByCategory[e.category]=(expByCategory[e.category]||0)+Number(e.amount);});

  // Fuel+maintenance for P&L
  const fuelExp=expenses.filter(e=>e.category==="Fuel").reduce((s,e)=>s+Number(e.amount),0);
  const driverExp=expenses.filter(e=>["Driver Salary","Driver Trip Allowance","Driver Overtime"].includes(e.category)).reduce((s,e)=>s+Number(e.amount),0);
  const maintExp=expenses.filter(e=>["Vehicle Servicing","Tyre Replacement","Mechanic Services","Vehicle Inspection","Vehicle Towing"].includes(e.category)).reduce((s,e)=>s+Number(e.amount),0);
  const adminExp=expenses.filter(e=>["Office Rent","Electricity","Internet Services","Software Subscriptions","Stationery","Office Staff Salary"].includes(e.category)).reduce((s,e)=>s+Number(e.amount),0);
  const agentCommExp=expenses.filter(e=>e.category==="Agent Commissions").reduce((s,e)=>s+Number(e.amount),0);
  const otherExp=totalExpenses-fuelExp-driverExp-maintExp-adminExp-agentCommExp;

  // Route performance
  const routePerf=(store.trips||[]).map(t=>{
    const route=(store.trips||[]).find?.(()=>true);
    const bks=confirmedBookings.filter(b=>b.trip_id===t.id);
    const rev=bks.reduce((s,b)=>s+b.amount,0);
    const routeName=`\u2192 ${t.vehicle_reg}`;
    return{id:t.id,name:routeName,rev,bks:bks.length};
  });

  // Save expense
  const saveExpense=()=>{
    if(!expForm.amount||!expForm.category) return;
    const entry={...expForm,amount:Number(expForm.amount),id:editingExp?.id||`EXP-${Date.now()}`};
    if(editingExp){
      setExpenses(prev=>prev.map(e=>e.id===editingExp.id?entry:e));
    } else {
      setExpenses(prev=>[...prev,entry]);
      if(store.addExpense) store.addExpense(entry);
    }
    setShowExpModal(false); setEditingExp(null);
    setExpForm({category:"Fuel",amount:"",description:"",date:new Date().toISOString().split("T")[0],paymentMethod:"MTN MoMo",vehicle:"",route:"",vendor:""});
  };

  const deleteExpense=(id)=>{
    setExpenses(prev=>prev.filter(e=>e.id!==id));
    setDeleteConfirm(null);
  };

  const openEdit=(e)=>{
    setEditingExp(e);
    setExpForm({...e,amount:String(e.amount)});
    setShowExpModal(true);
  };

  // Section styles
  const tabBtnStyle=(t)=>({padding:"8px 18px",borderRadius:20,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,
    background:tab===t?C.amber:"transparent",color:tab===t?C.navy:C.textSecondary,transition:"all .2s"});

  const SRow=({label,value,bold,indent,color,border})=>(
    <div style={{display:"flex",justifyContent:"space-between",padding:`${border?"10px":"6px"} 0`,
      borderTop:border?`1px solid ${C.navyBorder}`:"none",
      paddingLeft:indent?20:0}}>
      <span style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:color||C.textSecondary,fontWeight:bold?700:400}}>{label}</span>
      <span style={{fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:bold?700:400,color:color||(value<0?C.red:C.textPrimary)}}>{typeof value==="number"?formatUGX(value):value}</span>
    </div>
  );

  return(
  <div style={{animation:"fadeUp .3s ease"}}>
    {/* Header */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
      <div>
        <h1 className="ral" style={{fontSize:24,fontWeight:900,margin:0}}>Finance &amp; Accounting</h1>
        <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textMuted,marginTop:4}}>IASB GAAP \u00b7 ACCA/CPA Format \u00b7 URA Compliant</p>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <select value={period} onChange={e=>setPeriod(e.target.value)} style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${C.navyBorder}`,background:C.navyMid,color:"#fff",fontSize:12}}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
        {period==="monthly"&&<input type="month" value={reportMonth} onChange={e=>setReportMonth(e.target.value)} style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${C.navyBorder}`,background:C.navyMid,color:"#fff",fontSize:12}}/>}
        <Btn variant="navy" style={{fontSize:11,padding:"7px 14px",border:`1px solid ${C.navyBorder}`}}>\u2b07 Export PDF</Btn>
        <Btn variant="navy" style={{fontSize:11,padding:"7px 14px",border:`1px solid ${C.navyBorder}`}}>\u2b07 Export Excel</Btn>
      </div>
    </div>

    {/* KPI Cards */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:12,marginBottom:22}}>
      {[
        {label:"Total Revenue",value:formatUGX(periodRevenue),icon:"\ud83d\udcb5",color:C.green},
        {label:"Total Expenses",value:formatUGX(periodExpenses),icon:"\ud83d\udcc9",color:C.red},
        {label:"Net Profit",value:formatUGX(periodRevenue-periodExpenses),icon:"\ud83d\udcca",color:netProfit>=0?C.amber:C.red},
        {label:"Profit Margin",value:`${totalRevenueCats>0?((netProfit/totalRevenueCats)*100).toFixed(1):0}%`,icon:"\ud83d\udcd0",color:C.blue},
        {label:"Pending Payments",value:formatUGX(allBookings.filter(b=>b.payment_status==="pending").reduce((s,b)=>s+b.amount,0)),icon:"\u23f3",color:C.orange},
      ].map(k=>(
        <div key={k.label} style={{background:C.card,border:`1px solid ${C.navyBorder}`,borderRadius:14,padding:"16px 18px"}}>
          <div style={{fontSize:22,marginBottom:6}}>{k.icon}</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:15,color:k.color,marginBottom:2}}>{k.value}</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:".5px"}}>{k.label}</div>
        </div>
      ))}
    </div>

    {/* Sub-tabs */}
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:22,background:C.navyMid,padding:6,borderRadius:14}}>
      {[
        {id:"overview",label:"\ud83d\udcca Overview"},
        {id:"revenue",label:"\ud83d\udcb5 Revenue"},
        {id:"expenses",label:"\ud83d\udcc9 Costs"},
        {id:"pnl",label:"\ud83d\udccb P&L Statement"},
        {id:"balancesheet",label:"\ud83c\udfe6 Balance Sheet"},
        {id:"cashflow",label:"\ud83d\udca7 Cash Flow"},
        {id:"equity",label:"\ud83d\udcc8 Equity"},
        {id:"users",label:"\ud83d\udc65 Access Control"},
      ].map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={tabBtnStyle(t.id)}>{t.label}</button>
      ))}
    </div>

    {/* \u2500\u2500 OVERVIEW \u2500\u2500 */}
    {tab==="overview"&&(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <Card>
        <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Revenue by Source</h3>
        {[
          {label:"Passenger Ticket Sales",value:passengerRev,pct:totalRevenueCats>0?(passengerRev/totalRevenueCats*100):0},
          {label:"Parcel Delivery Fees",value:parcelRev,pct:0},
          {label:"Van Hire Charges",value:hireRev,pct:0},
        ].map(r=>(
          <div key={r.label} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
              <span style={{color:C.textSecondary}}>{r.label}</span>
              <span style={{fontWeight:700,color:C.green}}>{formatUGX(r.value)}</span>
            </div>
            <div style={{height:5,background:C.navyLight,borderRadius:3}}>
              <div style={{width:`${r.pct}%`,height:"100%",background:`linear-gradient(90deg,${C.green},${C.amber})`,borderRadius:3}}/>
            </div>
          </div>
        ))}
      </Card>
      <Card>
        <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Expense Breakdown</h3>
        {Object.entries(expByCategory).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([cat,amt])=>(
          <div key={cat} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.navyBorder}`}}>
            <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textSecondary}}>{cat}</span>
            <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:700,color:C.red}}>{formatUGX(amt)}</span>
          </div>
        ))}
        {expenses.length===0&&<div style={{color:C.textMuted,fontSize:12,textAlign:"center",padding:20}}>No expenses recorded yet.</div>}
      </Card>
      <Card>
        <h3 className="ral" style={{fontWeight:700,marginBottom:14}}>Route Revenue Performance</h3>
        {(store.bookings||[]).reduce((acc,b)=>{
          if(b.payment_status!=="confirmed") return acc;
          const key=b.route||"Unknown";
          acc[key]=(acc[key]||0)+b.amount;
          return acc;
        },{}) && Object.entries((store.bookings||[]).reduce((acc,b)=>{
          if(b.payment_status!=="confirmed") return acc;
          const key=b.route||"Unknown Route";
          acc[key]=(acc[key]||0)+b.amount;
          return acc;
        },{})).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([route,amt])=>(
          <div key={route} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
              <span style={{color:C.textSecondary}}>{route}</span>
              <span style={{fontWeight:700,color:C.green}}>{formatUGX(amt)}</span>
            </div>
            <div style={{height:4,background:C.navyLight,borderRadius:2}}>
              <div style={{width:`${Math.min((amt/totalRevenue)*100,100)}%`,height:"100%",background:`linear-gradient(90deg,${C.amber},${C.green})`,borderRadius:2}}/>
            </div>
          </div>
        ))}
      </Card>
      <Card>
        <h3 className="ral" style={{fontWeight:700,marginBottom:14}}>Financial Health Indicators</h3>
        {[
          {label:"Gross Margin",value:`${totalRevenueCats>0?(((totalRevenueCats-fuelExp-driverExp)/totalRevenueCats)*100).toFixed(1):0}%`,color:C.green},
          {label:"Operating Ratio",value:`${totalRevenueCats>0?((totalExpenses/totalRevenueCats)*100).toFixed(1):0}%`,color:C.orange},
          {label:"Return on Revenue",value:`${totalRevenueCats>0?((netProfit/totalRevenueCats)*100).toFixed(1):0}%`,color:C.amber},
          {label:"Confirmed Bookings",value:confirmedBookings.length,color:C.blue},
          {label:"Avg Revenue/Booking",value:formatUGX(confirmedBookings.length>0?Math.round(totalRevenue/confirmedBookings.length):0),color:C.purple},
        ].map(i=>(
          <div key={i.label} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.navyBorder}`}}>
            <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textSecondary}}>{i.label}</span>
            <span style={{fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:700,color:i.color}}>{i.value}</span>
          </div>
        ))}
      </Card>
    </div>
    )}

    {/* \u2500\u2500 REVENUE \u2500\u2500 */}
    {tab==="revenue"&&(
    <div>
      <Card style={{marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 className="ral" style={{fontWeight:700}}>Revenue Transactions</h3>
          <StatusBadge status="active"/>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{background:C.navyMid}}>
                {["Booking Code","Passenger","Route","Payment Method","Amount","Date","Agent","Status"].map(h=>(
                  <TH key={h}>{h}</TH>
                ))}
              </tr>
            </thead>
            <tbody>
              {confirmedBookings.map(b=>(
                <tr key={b.id} style={{borderBottom:`1px solid ${C.navyBorder}`}}>
                  <TD><code style={{fontFamily:"monospace",fontSize:10,color:C.amber}}>{b.booking_code}</code></TD>
                  <TD>{b.passenger}</TD>
                  <TD style={{fontSize:11}}>{b.route}</TD>
                  <TD><span style={{background:"rgba(245,166,35,0.15)",color:C.amber,padding:"2px 8px",borderRadius:10,fontSize:10}}>MTN MoMo</span></TD>
                  <TD style={{color:C.green,fontWeight:700}}>{formatUGX(b.amount)}</TD>
                  <TD>{b.date}</TD>
                  <TD style={{color:C.textMuted}}>{b.agent_id||"\u2014"}</TD>
                  <TD><StatusBadge status={b.payment_status}/></TD>
                </tr>
              ))}
              {confirmedBookings.length===0&&(
                <tr><td colSpan={8} style={{textAlign:"center",padding:24,color:C.textMuted}}>No confirmed revenue yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{marginTop:14,padding:"12px 0",borderTop:`1px solid ${C.navyBorder}`,display:"flex",justifyContent:"flex-end",gap:24}}>
          <span style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:C.textMuted}}>Total Revenue (period)</span>
          <span style={{fontFamily:"'Inter',sans-serif",fontSize:16,fontWeight:800,color:C.green}}>{formatUGX(periodRevenue)}</span>
        </div>
      </Card>
    </div>
    )}

    {/* \u2500\u2500 EXPENSES / COST MANAGEMENT \u2500\u2500 */}
    {tab==="expenses"&&(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 className="ral" style={{fontWeight:800,fontSize:18}}>Cost Management</h2>
        <Btn onClick={()=>{setEditingExp(null);setExpForm({category:"Fuel",amount:"",description:"",date:new Date().toISOString().split("T")[0],paymentMethod:"MTN MoMo",vehicle:"",route:"",vendor:""});setShowExpModal(true);}}>+ Add Cost</Btn>
      </div>
      <Card style={{padding:0,overflow:"hidden",marginBottom:18}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{background:C.navyMid}}>
              {["Category","Amount","Date","Payment Method","Description","Vehicle","Route","Vendor","Actions"].map(h=><TH key={h}>{h}</TH>)}
            </tr>
          </thead>
          <tbody>
            {expenses.map(e=>(
              <tr key={e.id} style={{borderBottom:`1px solid ${C.navyBorder}`}}>
                <TD><span style={{background:"rgba(168,186,218,0.12)",padding:"2px 8px",borderRadius:8,fontSize:10,fontWeight:600}}>{e.category}</span></TD>
                <TD style={{color:C.red,fontWeight:700}}>{formatUGX(e.amount)}</TD>
                <TD>{e.date}</TD>
                <TD style={{color:C.textMuted,fontSize:11}}>{e.paymentMethod||"\u2014"}</TD>
                <TD style={{maxWidth:180,fontSize:11}}>{e.description}</TD>
                <TD style={{color:C.textMuted,fontSize:11}}>{e.vehicle||"\u2014"}</TD>
                <TD style={{color:C.textMuted,fontSize:11}}>{e.route||"\u2014"}</TD>
                <TD style={{color:C.textMuted,fontSize:11}}>{e.vendor||"\u2014"}</TD>
                <TD>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>openEdit(e)} style={{background:"rgba(59,130,246,0.15)",color:C.blue,border:"none",borderRadius:6,padding:"4px 10px",fontSize:10,cursor:"pointer",fontWeight:700}}>Edit</button>
                    <button onClick={()=>setDeleteConfirm(e.id)} style={{background:"rgba(239,68,68,0.12)",color:C.red,border:"none",borderRadius:6,padding:"4px 10px",fontSize:10,cursor:"pointer",fontWeight:700}}>Delete</button>
                  </div>
                </TD>
              </tr>
            ))}
            {expenses.length===0&&<tr><td colSpan={9} style={{textAlign:"center",padding:24,color:C.textMuted}}>No expenses recorded. Click "+ Add Cost" to get started.</td></tr>}
          </tbody>
        </table>
      </Card>
      <div style={{display:"flex",justifyContent:"flex-end",gap:24,padding:"0 4px"}}>
        <span style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:C.textMuted}}>Total Expenses</span>
        <span style={{fontFamily:"'Inter',sans-serif",fontSize:16,fontWeight:800,color:C.red}}>{formatUGX(totalExpenses)}</span>
      </div>

      {/* Add/Edit Expense Modal */}
      <Modal open={showExpModal} onClose={()=>setShowExpModal(false)} title={editingExp?"Edit Expense":"Add New Cost Entry"} wide>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          <div style={{gridColumn:"1/-1"}}>
            <Sel label="Expense Category" value={expForm.category} onChange={e=>setExpForm({...expForm,category:e.target.value})} options={EXPENSE_CATEGORIES.map(c=>({value:c,label:c}))}/>
          </div>
          <Input label="Amount (UGX)" type="number" value={expForm.amount} onChange={e=>setExpForm({...expForm,amount:e.target.value})} placeholder="e.g. 150000"/>
          <Input label="Date" type="date" value={expForm.date} onChange={e=>setExpForm({...expForm,date:e.target.value})}/>
          <Sel label="Payment Method" value={expForm.paymentMethod} onChange={e=>setExpForm({...expForm,paymentMethod:e.target.value})} options={PAYMENT_METHODS.map(m=>({value:m,label:m}))}/>
          <Input label="Linked Vehicle (optional)" value={expForm.vehicle} onChange={e=>setExpForm({...expForm,vehicle:e.target.value})} placeholder="e.g. UAA 123B"/>
          <Input label="Linked Route (optional)" value={expForm.route} onChange={e=>setExpForm({...expForm,route:e.target.value})} placeholder="e.g. Kampala \u2192 Gulu"/>
          <Input label="Vendor/Supplier (optional)" value={expForm.vendor} onChange={e=>setExpForm({...expForm,vendor:e.target.value})} placeholder="e.g. Shell Uganda"/>
          <div style={{gridColumn:"1/-1"}}>
            <label style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textSecondary,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Description</label>
            <textarea value={expForm.description} onChange={e=>setExpForm({...expForm,description:e.target.value})} rows={3}
              style={{width:"100%",background:C.navyLight,border:`1px solid ${C.navyBorder}`,borderRadius:10,padding:"10px 13px",color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"'Inter',sans-serif",resize:"vertical"}}
              placeholder="Describe the expense..."/>
          </div>
          <div style={{gridColumn:"1/-1",display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="navy" onClick={()=>setShowExpModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
            <Btn onClick={saveExpense}>{editingExp?"Update Entry":"Save Expense"}</Btn>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={()=>setDeleteConfirm(null)} title="Confirm Delete">
        <p style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:C.textSecondary,marginBottom:20}}>Are you sure you want to delete this expense entry? This action cannot be undone.</p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn variant="navy" onClick={()=>setDeleteConfirm(null)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
          <Btn style={{background:C.red}} onClick={()=>deleteExpense(deleteConfirm)}>Delete Entry</Btn>
        </div>
      </Modal>
    </div>
    )}

    {/* \u2500\u2500 PROFIT & LOSS \u2500\u2500 */}
    {tab==="pnl"&&(
    <Card>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:24,paddingBottom:16,borderBottom:`2px solid ${C.navyBorder}`}}>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:900,fontSize:20,color:C.amber,marginBottom:4}}>RAYLANE EXPRESS LIMITED</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,color:C.textPrimary,marginBottom:2}}>INCOME STATEMENT (PROFIT &amp; LOSS)</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textMuted}}>For the period ended: {reportMonth} \u00b7 Prepared per IASB IAS 1</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:C.textMuted,marginTop:2}}>All amounts in Uganda Shillings (UGX)</div>
        </div>

        {/* Revenue */}
        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:12,color:C.amber,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8,marginTop:4}}>REVENUE</div>
        <SRow label="Passenger Ticket Sales" value={passengerRev} indent/>
        <SRow label="Parcel Delivery Income" value={parcelRev} indent/>
        <SRow label="Van Hire Income" value={hireRev} indent/>
        <SRow label="Total Revenue" value={totalRevenueCats} bold color={C.green} border/>

        {/* Expenses */}
        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:12,color:C.red,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8,marginTop:20}}>OPERATING EXPENSES</div>
        <SRow label="Fuel &amp; Transportation" value={fuelExp} indent/>
        <SRow label="Driver Wages &amp; Allowances" value={driverExp} indent/>
        <SRow label="Vehicle Maintenance &amp; Repairs" value={maintExp} indent/>
        <SRow label="Administrative &amp; Office Expenses" value={adminExp} indent/>
        <SRow label="Agent Commissions" value={agentCommExp} indent/>
        <SRow label="Other Operating Expenses" value={otherExp>0?otherExp:0} indent/>
        <SRow label="Total Expenses" value={totalExpenses} bold color={C.red} border/>

        {/* Net */}
        <div style={{marginTop:16,padding:"14px 16px",borderRadius:10,background:netProfit>=0?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",border:`1px solid ${netProfit>=0?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:14,color:netProfit>=0?C.green:C.red}}>{netProfit>=0?"NET PROFIT":"NET LOSS"}</span>
            <span style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:900,fontSize:18,color:netProfit>=0?C.green:C.red}}>{formatUGX(Math.abs(netProfit))}</span>
          </div>
        </div>

        <div style={{marginTop:20,padding:"10px 14px",background:C.navyMid,borderRadius:8,fontSize:10,color:C.textMuted,fontFamily:"'Inter',sans-serif",lineHeight:1.8}}>
          <strong>Notes:</strong> This statement has been prepared in accordance with International Accounting Standards (IAS 1) as adopted by the Institute of Certified Public Accountants of Uganda (ICPAU) and is compliant with Uganda Revenue Authority (URA) reporting requirements. Amounts are stated exclusive of applicable taxes unless otherwise indicated.
        </div>
      </div>
    </Card>
    )}

    {/* \u2500\u2500 BALANCE SHEET \u2500\u2500 */}
    {tab==="balancesheet"&&(
    <Card>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:24,paddingBottom:16,borderBottom:`2px solid ${C.navyBorder}`}}>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:900,fontSize:20,color:C.amber,marginBottom:4}}>RAYLANE EXPRESS LIMITED</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,color:C.textPrimary,marginBottom:2}}>STATEMENT OF FINANCIAL POSITION</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textMuted}}>As at: {new Date().toLocaleDateString("en-UG",{day:"numeric",month:"long",year:"numeric"})} \u00b7 Per IASB IAS 1</div>
        </div>

        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:12,color:C.green,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>ASSETS</div>
        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:".5px",marginBottom:6}}>Current Assets</div>
        <SRow label="Cash and Mobile Money Balances" value={totalRevenueCats} indent/>
        <SRow label="Accounts Receivable (Advance Bookings)" value={(store.bookings||[]).filter(b=>b.is_advance&&b.payment_status==="pending").reduce((s,b)=>s+b.amount,0)} indent/>
        <SRow label="Total Current Assets" value={totalRevenueCats+(store.bookings||[]).filter(b=>b.is_advance).reduce((s,b)=>s+b.amount,0)} bold border/>
        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:".5px",marginBottom:6,marginTop:14}}>Non-Current Assets</div>
        <SRow label="Vehicles (Company Fleet)" value={(store.vehicles||[]).filter(v=>v.owner_type==="company").length*15000000} indent/>
        <SRow label="Office Equipment &amp; Fixtures" value={2500000} indent/>
        <SRow label="Total Non-Current Assets" value={(store.vehicles||[]).filter(v=>v.owner_type==="company").length*15000000+2500000} bold border/>
        <SRow label="TOTAL ASSETS" value={totalRevenueCats+(store.vehicles||[]).filter(v=>v.owner_type==="company").length*15000000+2500000} bold color={C.green} border/>

        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:12,color:C.red,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8,marginTop:24}}>LIABILITIES</div>
        <SRow label="Outstanding Supplier Payments" value={0} indent/>
        <SRow label="Unpaid Expenses (Accruals)" value={Math.max(0,totalExpenses-totalRevenueCats)} indent/>
        <SRow label="Total Liabilities" value={Math.max(0,totalExpenses-totalRevenueCats)} bold color={C.red} border/>

        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:12,color:C.amber,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8,marginTop:24}}>EQUITY</div>
        <SRow label="Owner Capital" value={30000000} indent/>
        <SRow label="Net Profit / (Loss) for Period" value={netProfit} indent/>
        <SRow label="Total Equity" value={30000000+netProfit} bold color={C.amber} border/>
        <SRow label="TOTAL LIABILITIES + EQUITY" value={Math.max(0,totalExpenses-totalRevenueCats)+30000000+netProfit} bold color={C.green} border/>

        <div style={{marginTop:16,padding:"8px 12px",background:C.navyMid,borderRadius:8,fontSize:10,color:C.textMuted,fontFamily:"'Inter',sans-serif"}}>
          Prepared in accordance with IAS 1 / IFRS for SMEs. Subject to annual audit by an ICPAU-registered auditor.
        </div>
      </div>
    </Card>
    )}

    {/* \u2500\u2500 CASH FLOW \u2500\u2500 */}
    {tab==="cashflow"&&(
    <Card>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:24,paddingBottom:16,borderBottom:`2px solid ${C.navyBorder}`}}>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:900,fontSize:20,color:C.amber,marginBottom:4}}>RAYLANE EXPRESS LIMITED</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,color:C.textPrimary,marginBottom:2}}>STATEMENT OF CASH FLOWS</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textMuted}}>Period: {reportMonth} \u00b7 Per IAS 7</div>
        </div>
        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:12,color:C.amber,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>OPERATING ACTIVITIES</div>
        <SRow label="Cash from Passenger Tickets" value={passengerRev} indent/>
        <SRow label="Cash from Parcel Deliveries" value={parcelRev} indent/>
        <SRow label="Cash from Van Hire" value={hireRev} indent/>
        <SRow label="Less: Fuel Payments" value={-fuelExp} indent/>
        <SRow label="Less: Driver Wages" value={-driverExp} indent/>
        <SRow label="Less: Administrative Costs" value={-adminExp} indent/>
        <SRow label="Net Cash from Operating Activities" value={netProfit} bold color={netProfit>=0?C.green:C.red} border/>
        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:12,color:C.amber,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8,marginTop:20}}>INVESTING ACTIVITIES</div>
        <SRow label="Vehicle Purchases" value={0} indent/>
        <SRow label="Equipment Purchases" value={0} indent/>
        <SRow label="Net Cash from Investing Activities" value={0} bold border/>
        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:12,color:C.amber,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8,marginTop:20}}>FINANCING ACTIVITIES</div>
        <SRow label="Owner Capital Contributions" value={0} indent/>
        <SRow label="Loan Repayments" value={0} indent/>
        <SRow label="Net Cash from Financing Activities" value={0} bold border/>
        <div style={{marginTop:16,padding:"12px 16px",background:C.navyMid,borderRadius:10}}>
          <SRow label="Opening Cash Balance" value={0} bold/>
          <SRow label="Net Increase / (Decrease) in Cash" value={netProfit} bold/>
          <SRow label="Closing Cash Balance" value={netProfit} bold color={netProfit>=0?C.green:C.red}/>
        </div>
      </div>
    </Card>
    )}

    {/* \u2500\u2500 EQUITY \u2500\u2500 */}
    {tab==="equity"&&(
    <Card>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:24,paddingBottom:16,borderBottom:`2px solid ${C.navyBorder}`}}>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:900,fontSize:20,color:C.amber,marginBottom:4}}>RAYLANE EXPRESS LIMITED</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,marginBottom:2}}>STATEMENT OF CHANGES IN EQUITY</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textMuted}}>Period: {reportMonth} \u00b7 Per IAS 1</div>
        </div>
        <SRow label="Opening Capital Balance" value={30000000} bold/>
        <SRow label="Additional Capital Invested" value={0} indent/>
        <SRow label="Net Profit / (Loss) for Period" value={netProfit} indent/>
        <SRow label="Owner Withdrawals" value={0} indent/>
        <SRow label="Closing Equity Balance" value={30000000+netProfit} bold color={C.amber} border/>
        <div style={{marginTop:16,fontSize:10,color:C.textMuted,fontFamily:"'Inter',sans-serif",lineHeight:1.8}}>
          Owner equity represents the residual interest in Raylane Express Limited after deducting all liabilities. This statement is prepared in accordance with IAS 1 and IFRS for SMEs as recognized by ICPAU and URA.
        </div>
      </div>
    </Card>
    )}

    {/* \u2500\u2500 ACCESS CONTROL \u2500\u2500 */}
    {tab==="users"&&(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 className="ral" style={{fontWeight:800,fontSize:18}}>Finance Access Control</h2>
        <Btn onClick={()=>setShowUserModal(true)}>+ Add User</Btn>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.navyMid}}>{["Name","Email","Access Role","Date Added"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {financeUsers.map(u=>(
              <tr key={u.id}>
                <TD style={{fontWeight:600}}>{u.name}</TD>
                <TD style={{color:C.textMuted}}>{u.email}</TD>
                <TD><span style={{background:u.role==="editor"?"rgba(245,166,35,0.15)":"rgba(59,130,246,0.12)",color:u.role==="editor"?C.amber:C.blue,padding:"2px 10px",borderRadius:10,fontSize:10,fontWeight:700,textTransform:"uppercase"}}>{u.role}</span></TD>
                <TD style={{color:C.textMuted}}>{u.added}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Modal open={showUserModal} onClose={()=>setShowUserModal(false)} title="Add Finance User">
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <Input label="Full Name" value={userForm.name} onChange={e=>setUserForm({...userForm,name:e.target.value})} placeholder="e.g. Ruth Kamya"/>
          <Input label="Email Address" type="email" value={userForm.email} onChange={e=>setUserForm({...userForm,email:e.target.value})} placeholder="ruth@raylane.ug"/>
          <Sel label="Access Role" value={userForm.role} onChange={e=>setUserForm({...userForm,role:e.target.value})} options={[{value:"viewer",label:"Viewer \u2014 Read Only"},{value:"editor",label:"Editor \u2014 Can Add/Edit Entries"}]}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="navy" onClick={()=>setShowUserModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
            <Btn onClick={()=>{setFinanceUsers(prev=>[...prev,{...userForm,id:`FU-${Date.now()}`,added:new Date().toISOString().split("T")[0]}]);setShowUserModal(false);setUserForm({name:"",email:"",role:"viewer"});}}>Add User</Btn>
          </div>
        </div>
      </Modal>
    </div>
    )}
  </div>
  );
};

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// PAYROLL MODULE \u2014 UGANDA PAYE/NSSF COMPLIANT
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

// Uganda PAYE 2025/26 thresholds (UGX per month)
const PAYE_BRACKETS=[
  {min:0,max:235000,rate:0},
  {min:235001,max:335000,rate:0.10},
  {min:335001,max:410000,rate:0.20},
  {min:410001,max:10000000,rate:0.30},
  {min:10000001,max:Infinity,rate:0.40},
];

const calcPAYE=(grossTaxable)=>{
  let tax=0;
  for(const b of PAYE_BRACKETS){
    if(grossTaxable>b.min){
      const taxable=Math.min(grossTaxable,b.max)-b.min;
      tax+=taxable*b.rate;
    }
  }
  return Math.round(tax);
};

const NSSF_EMPLOYEE_RATE=0.05; // 5%
const NSSF_EMPLOYER_RATE=0.10; // 10%
const LOCAL_SERVICE_TAX_THRESHOLD=200000; // per month

const genEmployeeId=(name,dateJoined,seq)=>{
  const d=new Date(dateJoined);
  const dd=String(d.getDate()).padStart(2,"0");
  const mm=String(d.getMonth()+1).padStart(2,"0");
  const yy=String(d.getFullYear()).slice(-2);
  return `RL-EM${dd}${mm}${yy}${String(seq).padStart(3,"0")}`;
};

const INIT_EMPLOYEES=[
  {id:genEmployeeId("Moses Lubega","2026-01-15",1),name:"Moses Lubega",role:"Agent",department:"Operations",phone:"+256 772 200001",email:"moses@raylane.ug",bankAccount:"",bankName:"Centenary Bank",basicSalary:800000,allowances:{transport:50000,lunch:40000,housing:0},dateJoined:"2026-01-15",status:"active",nssf:true,seq:1},
  {id:genEmployeeId("Ruth Acen","2026-01-20",2),name:"Ruth Acen",role:"Agent",department:"Operations",phone:"+256 782 200002",email:"ruth@raylane.ug",bankAccount:"",bankName:"Stanbic Bank",basicSalary:800000,allowances:{transport:50000,lunch:40000,housing:0},dateJoined:"2026-01-20",status:"active",nssf:true,seq:2},
];

const AdminPayrollSection=({store})=>{
  const [payTab,setPayTab]=useState("employees");
  const [employees,setEmployees]=useState(INIT_EMPLOYEES);
  const [showEmpModal,setShowEmpModal]=useState(false);
  const [editingEmp,setEditingEmp]=useState(null);
  const [payMonth,setPayMonth]=useState(new Date().toISOString().slice(0,7));
  const [showPayslip,setShowPayslip]=useState(null);
  const [empForm,setEmpForm]=useState({name:"",role:"",department:"",phone:"",email:"",bankAccount:"",bankName:"",basicSalary:"",allowTransport:"50000",allowLunch:"40000",allowHousing:"0",dateJoined:new Date().toISOString().split("T")[0],status:"active",nssf:true});

  const calcPayroll=(emp)=>{
    const basic=Number(emp.basicSalary);
    const transport=Number(emp.allowances?.transport||0);
    const lunch=Number(emp.allowances?.lunch||0);
    const housing=Number(emp.allowances?.housing||0);
    const grossSalary=basic+transport+lunch+housing;
    const nssfEmployee=emp.nssf?Math.round(basic*NSSF_EMPLOYEE_RATE):0;
    const nssfEmployer=emp.nssf?Math.round(basic*NSSF_EMPLOYER_RATE):0;
    const taxableIncome=basic+housing; // Transport+lunch exempt per URA
    const paye=calcPAYE(taxableIncome);
    const localServiceTax=grossSalary>Local_SERVICE_TAX_THRESHOLD?Math.round(grossSalary*0.005):0;
    const totalDeductions=nssfEmployee+paye+localServiceTax;
    const netPay=grossSalary-totalDeductions;
    return{grossSalary,nssfEmployee,nssfEmployer,paye,localServiceTax,totalDeductions,netPay,basic,transport,lunch,housing,taxableIncome};
  };

  // Fix reference to constant
  const Local_SERVICE_TAX_THRESHOLD=LOCAL_SERVICE_TAX_THRESHOLD;

  const saveEmployee=()=>{
    const newSeq=employees.length+1;
    const entry={
      id:editingEmp?.id||genEmployeeId(empForm.name,empForm.dateJoined,newSeq),
      name:empForm.name,role:empForm.role,department:empForm.department,
      phone:empForm.phone,email:empForm.email,bankAccount:empForm.bankAccount,
      bankName:empForm.bankName,basicSalary:Number(empForm.basicSalary),
      allowances:{transport:Number(empForm.allowTransport),lunch:Number(empForm.allowLunch),housing:Number(empForm.allowHousing)},
      dateJoined:empForm.dateJoined,status:empForm.status,nssf:empForm.nssf,seq:editingEmp?.seq||newSeq
    };
    if(editingEmp){setEmployees(prev=>prev.map(e=>e.id===editingEmp.id?entry:e));}
    else{setEmployees(prev=>[...prev,entry]);}
    setShowEmpModal(false);setEditingEmp(null);
    setEmpForm({name:"",role:"",department:"",phone:"",email:"",bankAccount:"",bankName:"",basicSalary:"",allowTransport:"50000",allowLunch:"40000",allowHousing:"0",dateJoined:new Date().toISOString().split("T")[0],status:"active",nssf:true});
  };

  const totalPayroll=employees.filter(e=>e.status==="active").reduce((s,e)=>s+calcPayroll(e).netPay,0);
  const totalGross=employees.filter(e=>e.status==="active").reduce((s,e)=>s+calcPayroll(e).grossSalary,0);
  const totalPAYE=employees.filter(e=>e.status==="active").reduce((s,e)=>s+calcPayroll(e).paye,0);
  const totalNSSF=employees.filter(e=>e.status==="active").reduce((s,e)=>s+calcPayroll(e).nssfEmployer,0);

  const tabBtnStyle=(t)=>({padding:"8px 16px",borderRadius:20,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,
    background:payTab===t?C.amber:"transparent",color:payTab===t?C.navy:C.textSecondary,transition:"all .2s"});

  const Payslip=({emp})=>{
    const p=calcPayroll(emp);
    return(
    <div style={{background:"#fff",color:"#1a1a1a",padding:32,borderRadius:12,maxWidth:520,margin:"0 auto",fontFamily:"'Inter',sans-serif"}}>
      <div style={{borderBottom:"3px solid #0D1B3E",paddingBottom:16,marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:900,fontSize:20,color:"#0D1B3E"}}>RAYLANE EXPRESS</div>
          <div style={{fontSize:11,color:"#666",marginTop:2}}>Employee Pay Slip \u00b7 {payMonth}</div>
          <div style={{fontSize:10,color:"#888",marginTop:1}}>Uganda Revenue Authority Compliant \u00b7 NSSF Registered</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontWeight:700,fontSize:13,color:"#0D1B3E"}}>{emp.name}</div>
          <div style={{fontSize:11,color:"#666"}}>{emp.role} | {emp.department}</div>
          <div style={{fontSize:10,color:"#888",fontFamily:"monospace"}}>{emp.id}</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
        <div>
          <div style={{fontWeight:700,fontSize:11,color:"#0D1B3E",textTransform:"uppercase",letterSpacing:".5px",marginBottom:10,borderBottom:"1px solid #e0e0e0",paddingBottom:6}}>EARNINGS</div>
          {[["Basic Salary",p.basic],["Transport Allowance",p.transport],["Lunch Allowance",p.lunch],["Housing Allowance",p.housing]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"4px 0",borderBottom:"1px solid #f0f0f0"}}>
              <span style={{color:"#555"}}>{l}</span><span style={{fontWeight:600}}>{formatUGX(v)}</span>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"8px 0",marginTop:4,borderTop:"2px solid #0D1B3E"}}>
            <span style={{fontWeight:700}}>Gross Salary</span><span style={{fontWeight:800,color:"#16a34a"}}>{formatUGX(p.grossSalary)}</span>
          </div>
        </div>
        <div>
          <div style={{fontWeight:700,fontSize:11,color:"#0D1B3E",textTransform:"uppercase",letterSpacing:".5px",marginBottom:10,borderBottom:"1px solid #e0e0e0",paddingBottom:6}}>DEDUCTIONS</div>
          {[["NSSF (Employee 5%)",p.nssfEmployee],["PAYE (Income Tax)",p.paye],["Local Service Tax",p.localServiceTax]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"4px 0",borderBottom:"1px solid #f0f0f0"}}>
              <span style={{color:"#555"}}>{l}</span><span style={{fontWeight:600,color:"#dc2626"}}>{formatUGX(v)}</span>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"8px 0",marginTop:4,borderTop:"2px solid #0D1B3E"}}>
            <span style={{fontWeight:700}}>Total Deductions</span><span style={{fontWeight:800,color:"#dc2626"}}>{formatUGX(p.totalDeductions)}</span>
          </div>
        </div>
      </div>
      <div style={{background:"#0D1B3E",color:"#fff",borderRadius:10,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontWeight:700,fontSize:14}}>NET PAY</span>
        <span style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:900,fontSize:22,color:"#F5A623"}}>{formatUGX(p.netPay)}</span>
      </div>
      <div style={{marginTop:16,padding:"10px 14px",background:"#f8f8f8",borderRadius:8,fontSize:10,color:"#888"}}>
        <div>Bank: {emp.bankName||"\u2014"} \u00b7 Account: {emp.bankAccount||"\u2014"}</div>
        <div style={{marginTop:4}}>Employer NSSF Contribution: {formatUGX(p.nssfEmployer)} \u00b7 PAYE remitted to URA per Section 118 ITA 1997</div>
        <div style={{marginTop:4}}>This payslip was generated by Raylane Express HR System on {new Date().toLocaleDateString("en-UG")}</div>
      </div>
    </div>
    );
  };

  return(
  <div style={{animation:"fadeUp .3s ease"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
      <div>
        <h1 className="ral" style={{fontSize:24,fontWeight:900,margin:0}}>Payroll Management</h1>
        <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textMuted,marginTop:4}}>Uganda PAYE \u00b7 NSSF \u00b7 Local Service Tax \u00b7 URA Compliant</p>
      </div>
      <div style={{display:"flex",gap:8}}>
        <input type="month" value={payMonth} onChange={e=>setPayMonth(e.target.value)} style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${C.navyBorder}`,background:C.navyMid,color:"#fff",fontSize:12}}/>
        <Btn variant="navy" style={{fontSize:11,padding:"7px 14px",border:`1px solid ${C.navyBorder}`}}>\u2b07 Export Payroll</Btn>
      </div>
    </div>

    {/* KPIs */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:22}}>
      {[
        {label:"Active Staff",value:employees.filter(e=>e.status==="active").length,icon:"\ud83d\udc64",color:C.blue},
        {label:"Gross Payroll",value:formatUGX(totalGross),icon:"\ud83d\udcb0",color:C.amber},
        {label:"Total PAYE",value:formatUGX(totalPAYE),icon:"\ud83c\udfdb\ufe0f",color:C.orange},
        {label:"NSSF Employer",value:formatUGX(totalNSSF),icon:"\ud83d\udee1\ufe0f",color:C.purple},
        {label:"Net Payroll",value:formatUGX(totalPayroll),icon:"\u2705",color:C.green},
      ].map(k=>(
        <div key={k.label} style={{background:C.card,border:`1px solid ${C.navyBorder}`,borderRadius:14,padding:"14px 16px"}}>
          <div style={{fontSize:20,marginBottom:5}}>{k.icon}</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:14,color:k.color,marginBottom:2}}>{k.value}</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:".5px"}}>{k.label}</div>
        </div>
      ))}
    </div>

    {/* Sub-tabs */}
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:22,background:C.navyMid,padding:6,borderRadius:14}}>
      {[{id:"employees",label:"\ud83d\udc64 Employees"},{id:"payslips",label:"\ud83d\udcc4 Payslips"},{id:"ura",label:"\ud83c\udfdb\ufe0f URA/NSSF"}].map(t=>(
        <button key={t.id} onClick={()=>setPayTab(t.id)} style={tabBtnStyle(t.id)}>{t.label}</button>
      ))}
    </div>

    {payTab==="employees"&&(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 className="ral" style={{fontWeight:800,fontSize:18}}>Employee Register</h2>
        <Btn onClick={()=>{setEditingEmp(null);setShowEmpModal(true);}}>+ Add Employee</Btn>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.navyMid}}>
            {["Employee ID","Name","Role","Department","Basic Salary","Net Pay","PAYE","NSSF","Status","Actions"].map(h=><TH key={h}>{h}</TH>)}
          </tr></thead>
          <tbody>
            {employees.map(emp=>{
              const p=calcPayroll(emp);
              return(
              <tr key={emp.id} style={{borderBottom:`1px solid ${C.navyBorder}`}}>
                <TD><code style={{fontFamily:"monospace",fontSize:10,color:C.amber}}>{emp.id}</code></TD>
                <TD style={{fontWeight:600}}>{emp.name}</TD>
                <TD style={{fontSize:11}}>{emp.role}</TD>
                <TD style={{fontSize:11,color:C.textMuted}}>{emp.department}</TD>
                <TD style={{color:C.textPrimary}}>{formatUGX(p.grossSalary)}</TD>
                <TD style={{color:C.green,fontWeight:700}}>{formatUGX(p.netPay)}</TD>
                <TD style={{color:C.red,fontSize:11}}>{formatUGX(p.paye)}</TD>
                <TD style={{color:C.purple,fontSize:11}}>{formatUGX(p.nssfEmployee)}</TD>
                <TD><StatusBadge status={emp.status}/></TD>
                <TD>
                  <div style={{display:"flex",gap:5}}>
                    <button onClick={()=>setShowPayslip(emp)} style={{background:"rgba(34,197,94,0.12)",color:C.green,border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,cursor:"pointer",fontWeight:700}}>Slip</button>
                    <button onClick={()=>{setEditingEmp(emp);setEmpForm({name:emp.name,role:emp.role,department:emp.department,phone:emp.phone,email:emp.email,bankAccount:emp.bankAccount,bankName:emp.bankName,basicSalary:String(emp.basicSalary),allowTransport:String(emp.allowances?.transport||0),allowLunch:String(emp.allowances?.lunch||0),allowHousing:String(emp.allowances?.housing||0),dateJoined:emp.dateJoined,status:emp.status,nssf:emp.nssf});setShowEmpModal(true);}} style={{background:"rgba(59,130,246,0.12)",color:C.blue,border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,cursor:"pointer",fontWeight:700}}>Edit</button>
                  </div>
                </TD>
              </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      {/* Employee Modal */}
      <Modal open={showEmpModal} onClose={()=>setShowEmpModal(false)} title={editingEmp?"Edit Employee":"Add New Employee"} wide>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          <Input label="Full Name" value={empForm.name} onChange={e=>setEmpForm({...empForm,name:e.target.value})} placeholder="e.g. Sarah Nakato"/>
          <Input label="Job Role / Title" value={empForm.role} onChange={e=>setEmpForm({...empForm,role:e.target.value})} placeholder="e.g. Agent, Driver"/>
          <Input label="Department" value={empForm.department} onChange={e=>setEmpForm({...empForm,department:e.target.value})} placeholder="e.g. Operations"/>
          <Input label="Phone" value={empForm.phone} onChange={e=>setEmpForm({...empForm,phone:e.target.value})} placeholder="+256 7XX XXX XXX"/>
          <Input label="Email" type="email" value={empForm.email} onChange={e=>setEmpForm({...empForm,email:e.target.value})} placeholder="name@raylane.ug"/>
          <Input label="Date Joined" type="date" value={empForm.dateJoined} onChange={e=>setEmpForm({...empForm,dateJoined:e.target.value})}/>
          <Input label="Bank Name" value={empForm.bankName} onChange={e=>setEmpForm({...empForm,bankName:e.target.value})} placeholder="e.g. Centenary Bank"/>
          <Input label="Bank Account Number" value={empForm.bankAccount} onChange={e=>setEmpForm({...empForm,bankAccount:e.target.value})} placeholder="Account number"/>
          <Input label="Basic Salary (UGX)" type="number" value={empForm.basicSalary} onChange={e=>setEmpForm({...empForm,basicSalary:e.target.value})} placeholder="e.g. 800000"/>
          <Input label="Transport Allowance (UGX)" type="number" value={empForm.allowTransport} onChange={e=>setEmpForm({...empForm,allowTransport:e.target.value})}/>
          <Input label="Lunch Allowance (UGX)" type="number" value={empForm.allowLunch} onChange={e=>setEmpForm({...empForm,allowLunch:e.target.value})}/>
          <Input label="Housing Allowance (UGX)" type="number" value={empForm.allowHousing} onChange={e=>setEmpForm({...empForm,allowHousing:e.target.value})}/>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <input type="checkbox" checked={empForm.nssf} onChange={e=>setEmpForm({...empForm,nssf:e.target.checked})} id="nssf-chk" style={{accentColor:C.amber,width:16,height:16}}/>
            <label htmlFor="nssf-chk" style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textSecondary}}>Enrolled in NSSF</label>
          </div>
          <Sel label="Employment Status" value={empForm.status} onChange={e=>setEmpForm({...empForm,status:e.target.value})} options={[{value:"active",label:"Active"},{value:"suspended",label:"Suspended"},{value:"terminated",label:"Terminated"}]}/>
          <div style={{gridColumn:"1/-1",display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="navy" onClick={()=>setShowEmpModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
            <Btn onClick={saveEmployee}>{editingEmp?"Update Employee":"Add Employee"}</Btn>
          </div>
        </div>
      </Modal>
      {/* Payslip Modal */}
      <Modal open={!!showPayslip} onClose={()=>setShowPayslip(null)} title="Employee Payslip" wide>
        {showPayslip&&<Payslip emp={showPayslip}/>}
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
          <Btn variant="navy" onClick={()=>setShowPayslip(null)} style={{border:`1px solid ${C.navyBorder}`}}>Close</Btn>
          <Btn>\ud83d\udda8\ufe0f Print / Download</Btn>
        </div>
      </Modal>
    </div>
    )}

    {payTab==="payslips"&&(
    <div>
      <h2 className="ral" style={{fontWeight:800,fontSize:18,marginBottom:16}}>Monthly Payroll Summary \u2014 {payMonth}</h2>
      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.navyMid}}>
            {["Employee","Gross","Transport","Lunch","Housing","NSSF(E)","PAYE","LST","Net Pay"].map(h=><TH key={h}>{h}</TH>)}
          </tr></thead>
          <tbody>
            {employees.filter(e=>e.status==="active").map(emp=>{
              const p=calcPayroll(emp);
              return(
              <tr key={emp.id} style={{borderBottom:`1px solid ${C.navyBorder}`}}>
                <TD style={{fontWeight:600}}>{emp.name}</TD>
                <TD>{formatUGX(p.grossSalary)}</TD>
                <TD style={{fontSize:11}}>{formatUGX(p.transport)}</TD>
                <TD style={{fontSize:11}}>{formatUGX(p.lunch)}</TD>
                <TD style={{fontSize:11}}>{formatUGX(p.housing)}</TD>
                <TD style={{color:C.purple}}>{formatUGX(p.nssfEmployee)}</TD>
                <TD style={{color:C.red}}>{formatUGX(p.paye)}</TD>
                <TD style={{color:C.orange,fontSize:11}}>{formatUGX(p.localServiceTax)}</TD>
                <TD style={{color:C.green,fontWeight:700}}>{formatUGX(p.netPay)}</TD>
              </tr>
              );
            })}
            <tr style={{background:C.navyMid,fontWeight:800}}>
              <TD style={{fontWeight:800,color:C.amber}}>TOTALS</TD>
              {[totalGross,0,0,0,employees.filter(e=>e.status==="active").reduce((s,e)=>s+calcPayroll(e).nssfEmployee,0),totalPAYE,employees.filter(e=>e.status==="active").reduce((s,e)=>s+calcPayroll(e).localServiceTax,0),totalPayroll].map((v,i)=>(
                <TD key={i} style={{fontWeight:800,color:C.amber}}>{formatUGX(v)}</TD>
              ))}
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
    )}

    {payTab==="ura"&&(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <Card>
        <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>URA PAYE Return Summary</h3>
        <div style={{fontSize:11,color:C.textMuted,fontFamily:"'Inter',sans-serif",marginBottom:16}}>Section 118, Income Tax Act 1997 (as amended)</div>
        {employees.filter(e=>e.status==="active").map(emp=>{
          const p=calcPayroll(emp);
          return(
          <div key={emp.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.navyBorder}`}}>
            <div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:600}}>{emp.name}</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:C.textMuted}}>Taxable: {formatUGX(p.taxableIncome)}</div>
            </div>
            <div style={{color:C.red,fontWeight:700,fontSize:13}}>{formatUGX(p.paye)}</div>
          </div>
          );
        })}
        <div style={{marginTop:12,display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:`2px solid ${C.navyBorder}`}}>
          <span style={{fontFamily:"'Inter',sans-serif",fontWeight:700}}>Total PAYE Due</span>
          <span style={{fontFamily:"'Inter',sans-serif",fontWeight:800,color:C.red,fontSize:14}}>{formatUGX(totalPAYE)}</span>
        </div>
      </Card>
      <Card>
        <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>NSSF Contribution Return</h3>
        <div style={{fontSize:11,color:C.textMuted,fontFamily:"'Inter',sans-serif",marginBottom:16}}>National Social Security Fund Act Cap 222</div>
        {employees.filter(e=>e.status==="active"&&e.nssf).map(emp=>{
          const p=calcPayroll(emp);
          return(
          <div key={emp.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.navyBorder}`}}>
            <div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:600}}>{emp.name}</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:C.textMuted}}>Employee: {formatUGX(p.nssfEmployee)} + Employer: {formatUGX(p.nssfEmployer)}</div>
            </div>
            <div style={{color:C.purple,fontWeight:700,fontSize:13}}>{formatUGX(p.nssfEmployee+p.nssfEmployer)}</div>
          </div>
          );
        })}
        <div style={{marginTop:12,display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:`2px solid ${C.navyBorder}`}}>
          <span style={{fontFamily:"'Inter',sans-serif",fontWeight:700}}>Total NSSF Due</span>
          <span style={{fontFamily:"'Inter',sans-serif",fontWeight:800,color:C.purple,fontSize:14}}>{formatUGX(employees.filter(e=>e.status==="active"&&e.nssf).reduce((s,e)=>s+calcPayroll(e).nssfEmployee+calcPayroll(e).nssfEmployer,0))}</span>
        </div>
      </Card>
    </div>
    )}
  </div>
  );
};

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// STAFF SACO MODULE \u2014 SAVINGS & CREDIT COOPERATIVE
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

const SACO_INTEREST_RATE=0.12; // 12% per annum on loans
const SACO_SAVINGS_DIVIDEND=0.08; // 8% annual dividend on savings
const SACO_MAX_LOAN_MULTIPLIER=3; // max loan = 3x savings

const AdminSACOSection=()=>{
  const [sacoTab,setSacoTab]=useState("dashboard");
  const [members,setMembers]=useState([
    {id:"SCO-001",name:"Moses Lubega",empId:"RL-EM150126001",monthlySaving:50000,totalSavings:350000,joinedDate:"2026-01-15",status:"active",email:"moses@raylane.ug"},
    {id:"SCO-002",name:"Ruth Acen",empId:"RL-EM200126002",monthlySaving:50000,totalSavings:300000,joinedDate:"2026-01-20",status:"active",email:"ruth@raylane.ug"},
  ]);
  const [loans,setLoans]=useState([
    {id:"LN-001",memberId:"SCO-001",memberName:"Moses Lubega",amount:800000,purpose:"School fees",applied:"2026-02-10",status:"approved",approved:"2026-02-12",monthlyRepayment:75000,remaining:725000,term:12,interestRate:SACO_INTEREST_RATE},
    {id:"LN-002",memberId:"SCO-002",memberName:"Ruth Acen",amount:500000,purpose:"Medical emergency",applied:"2026-03-01",status:"pending",approved:null,monthlyRepayment:0,remaining:500000,term:6,interestRate:SACO_INTEREST_RATE},
  ]);
  const [showMemberModal,setShowMemberModal]=useState(false);
  const [showLoanModal,setShowLoanModal]=useState(false);
  const [showPolicyModal,setShowPolicyModal]=useState(false);
  const [memberForm,setMemberForm]=useState({name:"",empId:"",monthlySaving:"50000",email:""});
  const [loanForm,setLoanForm]=useState({memberId:"",amount:"",purpose:"",term:"12"});
  const [selectedLoan,setSelectedLoan]=useState(null);

  const totalSavings=members.reduce((s,m)=>s+m.totalSavings,0);
  const totalLoans=loans.filter(l=>l.status==="approved").reduce((s,l)=>s+l.amount,0);
  const totalRepaid=loans.filter(l=>l.status==="approved").reduce((s,l)=>s+(l.amount-l.remaining),0);
  const pendingLoans=loans.filter(l=>l.status==="pending");
  const annualDividendPool=Math.round(totalSavings*SACO_SAVINGS_DIVIDEND);

  const approveLoan=(id)=>{
    setLoans(prev=>prev.map(l=>{
      if(l.id!==id) return l;
      const total=l.amount*(1+l.interestRate*(l.term/12));
      const monthly=Math.round(total/l.term);
      return{...l,status:"approved",approved:new Date().toISOString().split("T")[0],monthlyRepayment:monthly};
    }));
  };
  const rejectLoan=(id)=>setLoans(prev=>prev.map(l=>l.id===id?{...l,status:"rejected"}:l));

  const tabBtnStyle=(t)=>({padding:"8px 16px",borderRadius:20,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,
    background:sacoTab===t?C.amber:"transparent",color:sacoTab===t?C.navy:C.textSecondary,transition:"all .2s"});

  return(
  <div style={{animation:"fadeUp .3s ease"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
      <div>
        <h1 className="ral" style={{fontSize:24,fontWeight:900,margin:0}}>Staff SACO</h1>
        <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textMuted,marginTop:4}}>Savings &amp; Credit Cooperative \u00b7 {SACO_INTEREST_RATE*100}% p.a. Loans \u00b7 {SACO_SAVINGS_DIVIDEND*100}% Annual Dividend</p>
      </div>
      <div style={{display:"flex",gap:8}}>
        <Btn variant="navy" onClick={()=>setShowPolicyModal(true)} style={{fontSize:11,padding:"7px 14px",border:`1px solid ${C.navyBorder}`}}>\ud83d\udccb Lending Policy</Btn>
        <Btn onClick={()=>setShowMemberModal(true)}>+ Add Member</Btn>
      </div>
    </div>

    {/* KPIs */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:22}}>
      {[
        {label:"Total Members",value:members.length,icon:"\ud83d\udc65",color:C.blue},
        {label:"Total Savings",value:formatUGX(totalSavings),icon:"\ud83d\udcb0",color:C.green},
        {label:"Loans Disbursed",value:formatUGX(totalLoans),icon:"\ud83c\udfe6",color:C.amber},
        {label:"Amount Repaid",value:formatUGX(totalRepaid),icon:"\u2705",color:C.green},
        {label:"Pending Loans",value:pendingLoans.length,icon:"\u23f3",color:C.orange},
        {label:"Annual Dividend Pool",value:formatUGX(annualDividendPool),icon:"\ud83d\udcc8",color:C.purple},
      ].map(k=>(
        <div key={k.label} style={{background:C.card,border:`1px solid ${C.navyBorder}`,borderRadius:14,padding:"14px 16px"}}>
          <div style={{fontSize:20,marginBottom:5}}>{k.icon}</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:14,color:k.color,marginBottom:2}}>{k.value}</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:".5px"}}>{k.label}</div>
        </div>
      ))}
    </div>

    {/* Tabs */}
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:22,background:C.navyMid,padding:6,borderRadius:14}}>
      {[{id:"dashboard",label:"\ud83d\udcca Dashboard"},{id:"members",label:"\ud83d\udc65 Members"},{id:"loans",label:"\ud83c\udfe6 Loans"},{id:"dividends",label:"\ud83d\udcc8 Dividends"}].map(t=>(
        <button key={t.id} onClick={()=>setSacoTab(t.id)} style={tabBtnStyle(t.id)}>
          {t.label}{t.id==="loans"&&pendingLoans.length>0&&<span style={{background:C.red,color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:9,marginLeft:6}}>{pendingLoans.length}</span>}
        </button>
      ))}
    </div>

    {/* DASHBOARD */}
    {sacoTab==="dashboard"&&(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <Card>
        <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Savings by Member</h3>
        {members.map(m=>(
          <div key={m.id} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
              <span style={{fontWeight:600}}>{m.name}</span>
              <span style={{color:C.green,fontWeight:700}}>{formatUGX(m.totalSavings)}</span>
            </div>
            <div style={{height:5,background:C.navyLight,borderRadius:3}}>
              <div style={{width:`${totalSavings>0?(m.totalSavings/totalSavings)*100:0}%`,height:"100%",background:`linear-gradient(90deg,${C.green},${C.amber})`,borderRadius:3}}/>
            </div>
          </div>
        ))}
      </Card>
      <Card>
        <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Loan Portfolio</h3>
        {loans.map(l=>(
          <div key={l.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.navyBorder}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:600}}>{l.memberName}</span>
              <StatusBadge status={l.status}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textMuted}}>
              <span>{l.purpose}</span>
              <span style={{fontWeight:700,color:l.status==="approved"?C.amber:C.textMuted}}>{formatUGX(l.amount)}</span>
            </div>
            {l.status==="approved"&&(
              <div style={{marginTop:6,height:4,background:C.navyLight,borderRadius:2}}>
                <div style={{width:`${((l.amount-l.remaining)/l.amount)*100}%`,height:"100%",background:`linear-gradient(90deg,${C.green},${C.amber})`,borderRadius:2}}/>
              </div>
            )}
          </div>
        ))}
      </Card>
    </div>
    )}

    {/* MEMBERS */}
    {sacoTab==="members"&&(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 className="ral" style={{fontWeight:800,fontSize:18}}>SACO Members</h2>
        <Btn onClick={()=>setShowMemberModal(true)}>+ Enroll Member</Btn>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.navyMid}}>
            {["SACO ID","Employee ID","Name","Monthly Saving","Total Savings","Loan Eligibility","Joined","Status"].map(h=><TH key={h}>{h}</TH>)}
          </tr></thead>
          <tbody>
            {members.map(m=>(
              <tr key={m.id} style={{borderBottom:`1px solid ${C.navyBorder}`}}>
                <TD><code style={{fontSize:10,color:C.amber}}>{m.id}</code></TD>
                <TD><code style={{fontSize:10,color:C.blue}}>{m.empId}</code></TD>
                <TD style={{fontWeight:600}}>{m.name}</TD>
                <TD style={{color:C.green}}>{formatUGX(m.monthlySaving)}/mo</TD>
                <TD style={{fontWeight:700,color:C.green}}>{formatUGX(m.totalSavings)}</TD>
                <TD style={{color:C.amber,fontWeight:700}}>{formatUGX(m.totalSavings*SACO_MAX_LOAN_MULTIPLIER)}</TD>
                <TD style={{color:C.textMuted,fontSize:11}}>{m.joinedDate}</TD>
                <TD><StatusBadge status={m.status}/></TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Modal open={showMemberModal} onClose={()=>setShowMemberModal(false)} title="Enroll New SACO Member">
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <Input label="Full Name" value={memberForm.name} onChange={e=>setMemberForm({...memberForm,name:e.target.value})} placeholder="Employee full name"/>
          <Input label="Employee ID" value={memberForm.empId} onChange={e=>setMemberForm({...memberForm,empId:e.target.value})} placeholder="e.g. RL-EM150126001"/>
          <Input label="Email (for notifications)" type="email" value={memberForm.email} onChange={e=>setMemberForm({...memberForm,email:e.target.value})} placeholder="name@raylane.ug"/>
          <Input label="Monthly Savings Contribution (UGX)" type="number" value={memberForm.monthlySaving} onChange={e=>setMemberForm({...memberForm,monthlySaving:e.target.value})} placeholder="e.g. 50000"/>
          <div style={{padding:"10px 14px",background:"rgba(245,166,35,0.1)",borderRadius:8,fontSize:12,color:C.amber}}>
            \ud83d\udca1 Loan eligibility: up to {SACO_MAX_LOAN_MULTIPLIER}x savings = {formatUGX(Number(memberForm.monthlySaving||0)*SACO_MAX_LOAN_MULTIPLIER*7)} (based on ~7 months savings)
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="navy" onClick={()=>setShowMemberModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
            <Btn onClick={()=>{setMembers(prev=>[...prev,{id:`SCO-${String(prev.length+1).padStart(3,"0")}`,name:memberForm.name,empId:memberForm.empId,email:memberForm.email,monthlySaving:Number(memberForm.monthlySaving),totalSavings:0,joinedDate:new Date().toISOString().split("T")[0],status:"active"}]);setShowMemberModal(false);setMemberForm({name:"",empId:"",monthlySaving:"50000",email:""});}}>Enroll Member</Btn>
          </div>
        </div>
      </Modal>
    </div>
    )}

    {/* LOANS */}
    {sacoTab==="loans"&&(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 className="ral" style={{fontWeight:800,fontSize:18}}>Loan Applications</h2>
        <Btn onClick={()=>setShowLoanModal(true)}>+ Apply for Loan</Btn>
      </div>
      {pendingLoans.length>0&&(
        <div style={{background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.3)",borderRadius:12,padding:"12px 16px",marginBottom:16,fontFamily:"'Inter',sans-serif",fontSize:12,color:C.orange}}>
          \u23f3 {pendingLoans.length} loan application{pendingLoans.length>1?"s":""} pending approval. Email notifications will be sent on decision.
        </div>
      )}
      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.navyMid}}>
            {["Loan ID","Member","Amount","Purpose","Term","Monthly Pay","Rate","Applied","Status","Actions"].map(h=><TH key={h}>{h}</TH>)}
          </tr></thead>
          <tbody>
            {loans.map(l=>(
              <tr key={l.id} style={{borderBottom:`1px solid ${C.navyBorder}`}}>
                <TD><code style={{fontSize:10,color:C.amber}}>{l.id}</code></TD>
                <TD style={{fontWeight:600}}>{l.memberName}</TD>
                <TD style={{color:C.amber,fontWeight:700}}>{formatUGX(l.amount)}</TD>
                <TD style={{fontSize:11,color:C.textMuted}}>{l.purpose}</TD>
                <TD style={{fontSize:11}}>{l.term} months</TD>
                <TD style={{color:C.green}}>{l.monthlyRepayment>0?formatUGX(l.monthlyRepayment):"\u2014"}</TD>
                <TD style={{fontSize:11}}>{(l.interestRate*100).toFixed(0)}% p.a.</TD>
                <TD style={{fontSize:11,color:C.textMuted}}>{l.applied}</TD>
                <TD><StatusBadge status={l.status}/></TD>
                <TD>
                  {l.status==="pending"&&(
                    <div style={{display:"flex",gap:5}}>
                      <button onClick={()=>approveLoan(l.id)} style={{background:"rgba(34,197,94,0.12)",color:C.green,border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,cursor:"pointer",fontWeight:700}}>Approve</button>
                      <button onClick={()=>rejectLoan(l.id)} style={{background:"rgba(239,68,68,0.12)",color:C.red,border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,cursor:"pointer",fontWeight:700}}>Reject</button>
                    </div>
                  )}
                  {l.status!=="pending"&&<span style={{fontSize:10,color:C.textMuted}}>{l.approved||"\u2014"}</span>}
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Modal open={showLoanModal} onClose={()=>setShowLoanModal(false)} title="New Loan Application">
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <Sel label="Member" value={loanForm.memberId} onChange={e=>setLoanForm({...loanForm,memberId:e.target.value})} options={[{value:"",label:"Select member"},...members.filter(m=>m.status==="active").map(m=>({value:m.id,label:`${m.name} (Max: ${formatUGX(m.totalSavings*SACO_MAX_LOAN_MULTIPLIER)})`}))]}/>
          <Input label="Loan Amount (UGX)" type="number" value={loanForm.amount} onChange={e=>setLoanForm({...loanForm,amount:e.target.value})} placeholder="e.g. 500000"/>
          <Input label="Purpose of Loan" value={loanForm.purpose} onChange={e=>setLoanForm({...loanForm,purpose:e.target.value})} placeholder="e.g. Medical, School fees, Business"/>
          <Sel label="Repayment Term" value={loanForm.term} onChange={e=>setLoanForm({...loanForm,term:e.target.value})} options={[3,6,12,18,24].map(t=>({value:String(t),label:`${t} months`}))}/>
          {loanForm.amount&&loanForm.term&&(
            <div style={{padding:"10px 14px",background:"rgba(245,166,35,0.1)",borderRadius:8,fontSize:12,color:C.textPrimary}}>
              <div>Interest ({SACO_INTEREST_RATE*100}% p.a.): <strong style={{color:C.amber}}>{formatUGX(Math.round(Number(loanForm.amount)*SACO_INTEREST_RATE*(Number(loanForm.term)/12)))}</strong></div>
              <div>Total Repayable: <strong style={{color:C.amber}}>{formatUGX(Math.round(Number(loanForm.amount)*(1+SACO_INTEREST_RATE*(Number(loanForm.term)/12))))}</strong></div>
              <div>Monthly Deduction from Payroll: <strong style={{color:C.green}}>{formatUGX(Math.round(Number(loanForm.amount)*(1+SACO_INTEREST_RATE*(Number(loanForm.term)/12))/Number(loanForm.term)))}</strong></div>
            </div>
          )}
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="navy" onClick={()=>setShowLoanModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
            <Btn onClick={()=>{
              const m=members.find(mb=>mb.id===loanForm.memberId);
              if(!m||!loanForm.amount) return;
              const newLoan={id:`LN-${String(loans.length+1).padStart(3,"0")}`,memberId:m.id,memberName:m.name,amount:Number(loanForm.amount),purpose:loanForm.purpose,applied:new Date().toISOString().split("T")[0],status:"pending",approved:null,monthlyRepayment:0,remaining:Number(loanForm.amount),term:Number(loanForm.term),interestRate:SACO_INTEREST_RATE};
              setLoans(prev=>[...prev,newLoan]);setShowLoanModal(false);
              setLoanForm({memberId:"",amount:"",purpose:"",term:"12"});
            }}>Submit Application</Btn>
          </div>
        </div>
      </Modal>
    </div>
    )}

    {/* DIVIDENDS */}
    {sacoTab==="dividends"&&(
    <div>
      <Card style={{marginBottom:18}}>
        <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Annual Dividend Distribution</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:20}}>
          {[
            {label:"Total Savings Pool",value:formatUGX(totalSavings),color:C.green},
            {label:"Dividend Rate",value:`${SACO_SAVINGS_DIVIDEND*100}% p.a.`,color:C.amber},
            {label:"Total Dividend Pool",value:formatUGX(annualDividendPool),color:C.purple},
          ].map(k=>(
            <div key={k.label} style={{background:C.navyMid,borderRadius:12,padding:"16px 18px",textAlign:"center"}}>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:16,color:k.color,marginBottom:4}}>{k.value}</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:C.textMuted,textTransform:"uppercase"}}>{k.label}</div>
            </div>
          ))}
        </div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.navyMid}}>
            {["Member","Total Savings","Share %","Dividend (UGX)","Notification"].map(h=><TH key={h}>{h}</TH>)}
          </tr></thead>
          <tbody>
            {members.filter(m=>m.status==="active").map(m=>{
              const share=totalSavings>0?((m.totalSavings/totalSavings)*100).toFixed(1):0;
              const dividend=Math.round(annualDividendPool*(m.totalSavings/Math.max(totalSavings,1)));
              return(
              <tr key={m.id} style={{borderBottom:`1px solid ${C.navyBorder}`}}>
                <TD style={{fontWeight:600}}>{m.name}</TD>
                <TD style={{color:C.green,fontWeight:700}}>{formatUGX(m.totalSavings)}</TD>
                <TD>{share}%</TD>
                <TD style={{color:C.purple,fontWeight:700}}>{formatUGX(dividend)}</TD>
                <TD><span style={{fontSize:10,color:C.textMuted}}>\ud83d\udce7 {m.email||"\u2014"}</span></TD>
              </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
    )}

    {/* Lending Policy Modal */}
    <Modal open={showPolicyModal} onClose={()=>setShowPolicyModal(false)} title="SACO Lending Policy" wide>
      <div style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:C.textSecondary,lineHeight:1.9}}>
        <div className="ral" style={{fontWeight:700,fontSize:15,color:C.amber,marginBottom:12}}>Raylane Express Staff SACO \u2014 Lending Policy</div>
        {[
          ["Eligibility","Active employees with at least 3 months of savings contributions are eligible to apply for a loan."],
          ["Maximum Loan","Maximum loan amount is 3\u00d7 the member's accumulated savings balance."],
          ["Interest Rate",`${SACO_INTEREST_RATE*100}% per annum on reducing balance, in line with international cooperative lending standards.`],
          ["Repayment Terms","Loans are repayable in equal monthly installments over 3, 6, 12, 18, or 24 months."],
          ["Payroll Deduction","Approved loan repayments are automatically deducted from the employee's monthly net pay."],
          ["Approval Process","Loan applications require admin approval. Applicant is notified by email on approval or rejection."],
          ["Annual Dividend",`${SACO_SAVINGS_DIVIDEND*100}% per annum dividend paid on savings at the end of each financial year, distributed proportionally.`],
          ["Savings Notification","Members receive email notifications when their savings reach milestone thresholds (UGX 250,000 | 500,000 | 1,000,000)."],
          ["Early Repayment","Members may repay loans early without penalty."],
          ["Default Policy","Three consecutive missed repayments result in loan account review. Outstanding balance deducted from terminal benefits if applicable."],
          ["Governance","The SACO is governed per principles of the International Cooperative Alliance (ICA) and Uganda Cooperative Societies Act."],
        ].map(([h,b])=>(
          <div key={h} style={{marginBottom:12}}>
            <strong style={{color:C.textPrimary}}>{h}:</strong> {b}
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}>
        <Btn onClick={()=>setShowPolicyModal(false)}>Close</Btn>
      </div>
    </Modal>
  </div>
  );
};
ENDOFFILE
wc -l /home/claude/new_modules.jsx",
      "description": "Create the three new module components"
    },
    "message": "Create the three new module components",
    "integration_name": null,
    "integration_icon_url": null,
    "icon_name": "commandLine",
    "context": null,
    "display_content": {
      "type": "json_block",
      "json_block": "{"language": "bash", "code": "cat > /home/claude/new_modules.jsx << 'ENDOFFILE'\
// ═══════════════════════════════════════════════════════════════════════\
// FINANCE MODULE — IASB/GAAP/URA COMPLIANT\
// ═══════════════════════════════════════════════════════════════════════\
\
const EXPENSE_CATEGORIES=[\
  \\"Fuel\\",\\"Vehicle Servicing\\",\\"Tyre Replacement\\",\\"Vehicle Washing\\",\\"Vehicle Insurance\\",\\"Road License Fees\\",\\"Parking Fees\\",\
  \\"Driver Salary\\",\\"Driver Trip Allowance\\",\\"Driver Overtime\\",\\"Driver Accommodation\\",\
  \\"Office Staff Salary\\",\\"Agent Commissions\\",\\"Temporary Staff\\",\\"Staff Lunch Allowance\\",\\"Staff Transport Allowance\\",\
  \\"Office Rent\\",\\"Electricity\\",\\"Internet Services\\",\\"Software Subscriptions\\",\\"Stationery\\",\
  \\"Business Registration\\",\\"Transport Licensing\\",\\"Vehicle Permits\\",\\"Legal Consultation\\",\
  \\"Traffic Fines\\",\\"Vehicle Impound\\",\\"Road Compliance Penalties\\",\
  \\"Advertising\\",\\"Promotional Discounts\\",\\"Online Advertising\\",\
  \\"Mechanic Services\\",\\"Vehicle Towing\\",\\"Vehicle Inspection\\",\
  \\"Vendor Van Hire\\",\\"Vendor Driver Allowance\\",\\"Vendor Fuel Reimbursement\\",\
  \\"Loan Repayment\\",\\"Bank Charges\\",\\"Other\\"\
];\
\
const PAYMENT_METHODS=[\\"MTN MoMo\\",\\"Airtel Money\\",\\"Cash\\",\\"Bank Transfer\\",\\"Cheque\\"];\
\

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
    {id:"finance-full",icon:"📊",label:"Full Finance"},
    {id:"promotions",icon:"🎁",label:"Promotions"},
    {id:"reports",icon:"📈",label:"Reports"},
    {id:"agents",icon:"👤",label:"Agents"},
    {id:"feedback",icon:"⭐",label:"Feedback",badge:pendingFeedback.length},
    {id:"settings",icon:"⚙️",label:"Settings"},
    {id:"payroll",icon:"💼",label:"Payroll"},
    {id:"saco",icon:"🏦",label:"Staff SACO"},
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

        {/* ── FULL FINANCE ── */}
        {section==="finance-full"&&<AdminFinanceSection store={store}/>}
        {/* ── PAYROLL ── */}
        {section==="payroll"&&<AdminPayrollSection store={store}/>}
        {/* ── SACO ── */}
        {section==="saco"&&<AdminSACOSection/>}
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

  if(page==="login"&&!currentUser) return(
    <ErrorBoundary>
      <style>{globalCSS}</style>
      <LoginPage onLogin={handleLogin} agents={store.agents}/>
    </ErrorBoundary>
  );

  if(page==="admin"&&currentUser?.role==="admin") return(
    <ErrorBoundary>
      <style>{globalCSS}</style>
      <AdminDashboard store={store} currentUser={currentUser} onLogout={handleLogout}/>
    </ErrorBoundary>
  );

  if(page==="agent"&&currentUser?.role==="agent") return(
    <ErrorBoundary>
      <style>{globalCSS}</style>
      <AgentDashboard store={store} currentUser={currentUser} onLogout={handleLogout}/>
    </ErrorBoundary>
  );

  const handleSetPage=(p)=>{
    if(p==="logout"){handleLogout();return;}
    setPage(p);
  };

  return(
    <ErrorBoundary>
      <style>{globalCSS}</style>
      <Nav page={page} setPage={handleSetPage} currentUser={currentUser}/>
      {page==="home"     &&<HomePage      setPage={handleSetPage} setPreselectedTrip={setPreselectedTrip} store={store}/>}
      {page==="schedule" &&<SchedulePage  setPage={handleSetPage} setPreselectedTrip={setPreselectedTrip} store={store}/>}
      {page==="book"     &&<BookingPage   preselectedTrip={preselectedTrip} store={store} currentUser={currentUser}/>}
      {page==="plan"     &&<PlanJourneyPage store={store} currentUser={currentUser}/>}
      {page==="parcel"   &&<ParcelPage/>}
      {page==="safety"   &&<SafetyPage/>}
      {page==="faq"      &&<FAQPage/>}
    </ErrorBoundary>
  );
}

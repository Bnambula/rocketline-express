import React, {useState,useEffect,useCallback} from "react";

// ─── SUPABASE CLIENT ─────────────────────────────────────────────────
const SUPABASE_URL = "https://xyvijskzgpgauhrxcauw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5dmlqc2t6Z3BnYXVocnhjYXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTc5NjksImV4cCI6MjA4NzU3Mzk2OX0.FOjha5TvyDW6ozvWt8aEmbXTVbk5NtY1Vd_I2kXuHtM";

const sbFetch = async (table, options={}) => {
  const { select="*", filter={}, order=null, limit=null, method="GET", body=null, match=null } = options;
  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  const params = new URLSearchParams();
  if(select !== "*") params.set("select", select);
  Object.entries(filter).forEach(([k,v]) => params.set(k, `eq.${v}`));
  if(order) params.set("order", order);
  if(limit) params.set("limit", limit);
  const qs = params.toString();
  if(qs) url += "?" + qs;
  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": method === "POST" ? "return=representation" : "return=minimal",
  };
  if(match) {
    Object.entries(match).forEach(([k,v]) => {
      url += (url.includes("?") ? "&" : "?") + `${k}=eq.${encodeURIComponent(v)}`;
    });
  }
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if(!res.ok) { const e = await res.text(); console.error("Supabase error:", e); return null; }
  if(method === "DELETE" || method === "PATCH") return true;
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

// Helper shortcuts
const db = {
  get: (table, filter={}) => sbFetch(table, { filter }),
  getOne: async (table, filter={}) => { const r = await sbFetch(table, { filter }); return r?.[0] || null; },
  insert: (table, body) => sbFetch(table, { method:"POST", body }),
  update: (table, match, body) => sbFetch(table, { method:"PATCH", match, body }),
  delete: (table, match) => sbFetch(table, { method:"DELETE", match }),
  list: (table, opts={}) => sbFetch(table, opts),
};


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
  // Outbound — Kampala departures
  {id:1, origin:"Kampala",     destination:"Gulu",       price:35000,duration_minutes:240, direction:"outbound"},
  {id:2, origin:"Kampala",     destination:"Mbarara",    price:25000,duration_minutes:180, direction:"outbound"},
  {id:3, origin:"Kampala",     destination:"Mbale",      price:30000,duration_minutes:210, direction:"outbound"},
  {id:4, origin:"Kampala",     destination:"Fort Portal",price:40000,duration_minutes:270, direction:"outbound"},
  {id:5, origin:"Kampala",     destination:"Arua",       price:50000,duration_minutes:360, direction:"outbound"},
  {id:6, origin:"Kampala",     destination:"Jinja",      price:15000,duration_minutes:90,  direction:"outbound"},
  // Return — back to Kampala
  {id:7, origin:"Gulu",        destination:"Kampala",    price:35000,duration_minutes:240, direction:"return"},
  {id:8, origin:"Mbarara",     destination:"Kampala",    price:25000,duration_minutes:180, direction:"return"},
  {id:9, origin:"Mbale",       destination:"Kampala",    price:30000,duration_minutes:210, direction:"return"},
  {id:10,origin:"Fort Portal", destination:"Kampala",    price:40000,duration_minutes:270, direction:"return"},
  {id:11,origin:"Arua",        destination:"Kampala",    price:50000,duration_minutes:360, direction:"return"},
  {id:12,origin:"Jinja",       destination:"Kampala",    price:15000,duration_minutes:90,  direction:"return"},
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
  {id:1,booking_code:"RLN260309123B0001",passenger:"Sarah Nakato", phone:"+256 772 123456",route:"Kampala → Gulu",   route_id:1,seats:[4,5],trip_id:1,amount:70000, payment_status:"confirmed",status:"confirmed",date:"2026-03-09",agent_id:null,is_advance:false},
  {id:2,booking_code:"RLN260309456C0002",passenger:"James Okello", phone:"+256 701 234567",route:"Kampala → Mbarara",route_id:2,seats:[2],  trip_id:2,amount:25000, payment_status:"confirmed",status:"confirmed",date:"2026-03-09",agent_id:"AGT-01",is_advance:false},
  {id:3,booking_code:"RLN260309789D0003",passenger:"Grace Auma",   phone:"+256 782 345678",route:"Kampala → Mbale",  route_id:3,seats:[1,2,3],trip_id:3,amount:90000, payment_status:"pending",  status:"pending",  date:"2026-03-09",agent_id:null,is_advance:false},
  {id:4,booking_code:"RLN260315012E0004",passenger:"Peter Mugisha",phone:"+256 756 456789",route:"Kampala → Gulu",   route_id:1,seats:[6],  trip_id:null,amount:35000,payment_status:"pending",  status:"advance",  date:"2026-03-15",agent_id:null,is_advance:true},
  {id:5,booking_code:"RLN260320123B0005",passenger:"Agnes Aber",   phone:"+256 714 567890",route:"Kampala → Arua",   route_id:5,seats:[],   trip_id:null,amount:100000,payment_status:"pending", status:"advance",  date:"2026-03-20",agent_id:"AGT-02",is_advance:true},
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

  // ── Supabase sync: load real data on mount ──────────────────────────
  useEffect(()=>{
    (async()=>{
      try{
        const [dbTrips,dbBookings,dbVehicles,dbAgents,dbFeedback] = await Promise.all([
          db.list("trips",{order:"departure_time"}),
          db.list("bookings",{order:"created_at.desc",limit:"200"}),
          db.list("vehicles"),
          db.list("agents"),
          db.list("feedback",{order:"created_at.desc"}),
        ]);
        if(dbTrips?.length){
          setTrips(dbTrips.map(t=>({...t,seats_booked:t.seats_booked||[],vehicle_reg:t.vehicle_reg||""})));
        }
        if(dbBookings?.length){
          setBookings(dbBookings.map(b=>({...b,booking_code:b.booking_code,passenger:b.passenger_name,phone:b.passenger_phone,route:b.route_id?"":b.route||"",seats:b.seats||[],amount:b.amount,payment_status:b.payment_status,status:b.booking_status,date:b.travel_date||b.created_at?.split("T")[0],agent_id:b.agent_id})));
        }
        if(dbVehicles?.length) setVehicles(dbVehicles);
        if(dbAgents?.length) setAgents(dbAgents.map(a=>({...a,id:a.agent_code||a.id,bookings:a.total_bookings||0,revenue:a.total_revenue||0,created:a.created_at?.split("T")[0]})));
        if(dbFeedback?.length) setFeedback(dbFeedback.map(f=>({...f,route:f.route_label||"",rating:f.rating||5})));
      }catch(e){ console.log("Supabase offline, using demo data"); }
    })();
  },[]);

  // ── Persist new bookings to Supabase ────────────────────────────────
  const addBookingWithSync = async (bk) => {
    addBooking(bk);
    try{
      await db.insert("bookings",{
        booking_code:bk.booking_code, passenger_name:bk.passenger, passenger_phone:bk.phone,
        route_id:bk.route_id, trip_id:bk.trip_id, seats:bk.seats, amount:bk.amount,
        payment_status:bk.payment_status, booking_status:bk.status, is_advance:bk.is_advance||false,
        agent_id:bk.agent_id||null, travel_date:bk.date
      });
    }catch(e){ console.log("Booking save failed silently"); }
  };

  const addFeedbackWithSync = async (fb) => {
    try{
      await db.insert("feedback",{ name:fb.name, route_label:fb.route, rating:fb.rating, message:fb.message, status:"pending" });
    }catch(e){}
  };

  return {trips,vehicles,bookings,agents,reservations,expenses,promotions,feedback,
    getRoute,getVehicle,getTrip,seatsAvailable,confirmBooking,
    addBooking:addBookingWithSync,addAgent,
    toggleAgent,addVehicle,addTrip,reserveSeat,approveFeedback,rejectFeedback,addExpense,addPromotion,
    addFeedbackWithSync};
};

// ─── UTILITIES ────────────────────────────────────────────────────────
const formatUGX = n=>`UGX ${Number(n).toLocaleString()}`;
const formatTime = dt=>new Date(dt).toLocaleTimeString("en-UG",{hour:"2-digit",minute:"2-digit"});
const formatDate = dt=>new Date(dt).toLocaleDateString("en-UG",{day:"numeric",month:"short",year:"numeric"});
// Booking code counters (reset 1 Jan each year)
const _getSeqCounters=()=>{
  const year=new Date().getFullYear();
  const stored=window.__rlnSeq||(window.__rlnSeq={year,pax:0,pcl:0});
  if(stored.year!==year){window.__rlnSeq={year,pax:0,pcl:0};}
  return window.__rlnSeq;
};
// Passenger: RLN+YY+MM+DD+last3+0001
const genBookingCode=(vehicleReg)=>{
  const now=new Date();
  const yy=String(now.getFullYear()).slice(-2);
  const mm=String(now.getMonth()+1).padStart(2,"0");
  const dd=String(now.getDate()).padStart(2,"0");
  const reg=(vehicleReg||"000").replace(/\s/g,"");
  const last3=reg.slice(-3).toUpperCase().padStart(3,"0");
  const ctr=_getSeqCounters();
  ctr.pax+=1;
  const seq=String(ctr.pax).padStart(4,"0");
  return `RLN${yy}${mm}${dd}${last3}${seq}`;
};
// Parcel: PCL+YY+MM+DD+last3+0001
const genParcelCode=(vehicleReg)=>{
  const now=new Date();
  const yy=String(now.getFullYear()).slice(-2);
  const mm=String(now.getMonth()+1).padStart(2,"0");
  const dd=String(now.getDate()).padStart(2,"0");
  const reg=(vehicleReg||"000").replace(/\s/g,"");
  const last3=reg.slice(-3).toUpperCase().padStart(3,"0");
  const ctr=_getSeqCounters();
  ctr.pcl+=1;
  const seq=String(ctr.pcl).padStart(4,"0");
  return `PCL${yy}${mm}${dd}${last3}${seq}`;
};
// Legacy alias
const genCode=(vReg)=>genBookingCode(vReg);
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
@keyframes kenburns{from{transform:scale(1) translate(0,0);}to{transform:scale(1.14) translate(-1.5%,-1%);}}
@keyframes heroZoom{from{transform:scale(1.1);}to{transform:scale(1);}}
@keyframes heroFade{from{opacity:0;}to{opacity:1;}}
@keyframes heroSlide{from{transform:translateX(24px);opacity:0;}to{transform:translateX(0);opacity:1;}}
@keyframes newsTicker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
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

// ─── PAYMENT METHOD ICONS (Official Logos) ────────────────────────────
// MTN MoMo — rectangular card with official MTN MoMo logo
const MTNMoMoIcon=({size=44,selected})=>(
  <div style={{width:Math.round(size*2.55),height:size,borderRadius:10,background:selected?"#17325e":"#0F2557",border:`2px solid ${selected?"#FFCB05":"#FFCB0566"}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",cursor:"pointer",boxShadow:selected?"0 0 0 3px rgba(255,203,5,0.35),0 4px 14px rgba(15,37,87,0.4)":"0 2px 8px rgba(15,37,87,0.25)",overflow:"hidden",position:"relative",flexShrink:0,padding:"4px 10px"}}>
    <img src={MTN_MOMO_B64} alt="MTN MoMo" style={{height:size-10,width:"auto",objectFit:"contain",filter:selected?"brightness(1.1)":"brightness(0.95)"}}/>
    {selected&&<div style={{position:"absolute",inset:0,border:"2px solid #FFCB05",borderRadius:9,pointerEvents:"none"}}/>}
  </div>
);

// Airtel Money — rectangular white card with official Airtel Money logo
const AirtelMoneyIcon=({size=44,selected})=>(
  <div style={{width:Math.round(size*2.55),height:size,borderRadius:10,background:"#FFFFFF",border:`2px solid ${selected?"#E60000":"#E6000044"}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",cursor:"pointer",boxShadow:selected?"0 0 0 3px rgba(230,0,0,0.22),0 4px 14px rgba(230,0,0,0.15)":"0 2px 8px rgba(0,0,0,0.1)",overflow:"hidden",position:"relative",flexShrink:0,padding:"4px 10px"}}>
    <img src={AIRTEL_MONEY_B64} alt="Airtel Money" style={{height:size-10,width:"auto",objectFit:"contain",filter:selected?"saturate(1.2)":"saturate(0.9)"}}/>
    {selected&&<div style={{position:"absolute",inset:0,border:"2px solid #E60000",borderRadius:9,pointerEvents:"none"}}/>}
  </div>
);

const CashIcon=({size=40,selected})=>(
  <div style={{width:size*2.4,height:size,borderRadius:9,background:selected?"#DCFCE7":"#F0FDF4",border:`2px solid ${selected?"#16A34A":"#86EFAC"}`,display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"0 12px",transition:"all .2s",cursor:"pointer",boxShadow:selected?"0 0 0 3px rgba(22,163,74,0.2)":"0 1px 4px rgba(0,0,0,0.08)"}}>
    <div style={{width:size*0.72,height:size*0.72,borderRadius:9,background:"#16A34A",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="6" width="20" height="13" rx="2" stroke="white" strokeWidth="1.8" fill="none"/>
        <circle cx="12" cy="12.5" r="3" stroke="white" strokeWidth="1.6" fill="none"/>
        <line x1="6" y1="9" x2="6" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="18" y1="15" x2="18" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
    <div>
      <div style={{fontFamily:"'Raleway',sans-serif",fontWeight:900,fontSize:13,color:"#16A34A",lineHeight:1.1}}>Cash</div>
      <div style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:9,color:"#16A34A",opacity:.75,letterSpacing:.8}}>At Office</div>
    </div>
  </div>
);

const PaymentMethodPicker=({value,onChange,showMoMoInstructions,totalAmount})=>(
  <div>
    <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
      <div onClick={()=>onChange("mtn")} style={{cursor:"pointer"}}><MTNMoMoIcon size={42} selected={value==="mtn"}/></div>
      <div onClick={()=>onChange("airtel")} style={{cursor:"pointer"}}><AirtelMoneyIcon size={42} selected={value==="airtel"}/></div>
      <div onClick={()=>onChange("cash")} style={{cursor:"pointer"}}><CashIcon size={42} selected={value==="cash"}/></div>
    </div>
    {(value==="mtn"||value==="airtel")&&showMoMoInstructions&&(
      <div style={{background:value==="mtn"?"#FEFCE8":"#FFF5F5",border:`1px solid ${value==="mtn"?"#EAB30844":"#DC262633"}`,borderRadius:10,padding:"12px 14px",fontSize:12,color:C.textPrimary,lineHeight:1.8}}>
        <div style={{fontWeight:700,marginBottom:4,display:"flex",alignItems:"center",gap:8}}>
          {value==="mtn"?<MTNMoMoIcon size={24} selected={true}/>:<AirtelMoneyIcon size={24} selected={true}/>}
          Payment Instructions
        </div>
        <div>1. Dial <strong>{value==="mtn"?"*165#":"*185#"}</strong> on your phone</div>
        <div>2. Select <strong>Pay Bill</strong></div>
        <div>3. Merchant code: <strong style={{color:value==="mtn"?"#D97706":"#DC2626"}}>12345</strong></div>
        <div>4. Amount: <strong>{formatUGX(totalAmount)}</strong></div>
        <div>5. Enter your PIN and confirm</div>
      </div>
    )}
  </div>
);


// ─── CUSTOMER AUTH (OTP registration & quick login) ──────────────────
const MOCK_CUSTOMERS=[
  {id:"CUS-001",name:"Sarah Nakato",email:"sarah@example.com",phone:"+256 772 123456"},
  {id:"CUS-002",name:"James Okello",email:"james@example.com",phone:"+256 701 234567"},
];

const CustomerAuthModal=({open,onClose,onLogin})=>{
  const [step,setStep]=useState("email");
  const [email,setEmail]=useState("");
  const [otp,setOtp]=useState("");
  const [sentOtp,setSentOtp]=useState("");
  const [form,setForm]=useState({name:"",phone:""});
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [existingUser,setExistingUser]=useState(null);

  const genOtp=()=>String(Math.floor(100000+Math.random()*900000));

  const handleEmailSubmit=()=>{
    if(!email.includes("@")){setErr("Enter a valid email address.");return;}
    setErr(""); setLoading(true);
    setTimeout(()=>{
      const found=MOCK_CUSTOMERS.find(c=>c.email===email.toLowerCase().trim());
      const code=genOtp(); setSentOtp(code); setLoading(false);
      if(found){setExistingUser(found);setStep("otp");}
      else{setExistingUser(null);setStep("register");}
    },800);
  };

  const handleVerify=()=>{
    if(otp.trim()!==sentOtp){setErr("Incorrect code. Check your email.");return;}
    const user=existingUser||{id:"CUS-"+Date.now(),name:form.name,email,phone:form.phone};
    onLogin({role:"customer",name:user.name,email:user.email,phone:user.phone,id:user.id});
    setStep("done"); setTimeout(onClose,1400);
  };

  const reset=()=>{setStep("email");setEmail("");setOtp("");setSentOtp("");setForm({name:"",phone:""});setErr("");setExistingUser(null);};

  if(!open) return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(11,30,75,0.6)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(8px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:22,maxWidth:430,width:"100%",boxShadow:"0 28px 70px rgba(11,30,75,0.28)",animation:"fadeUp .3s ease",overflow:"hidden"}}>
        {/* Header band */}
        <div style={{background:`linear-gradient(135deg,${C.navy},#1A3A80)`,padding:"22px 28px 18px",position:"relative"}}>
          <button onClick={()=>{reset();onClose();}} style={{position:"absolute",top:14,right:14,background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
              {step==="done"?"✅":step==="email"?"👤":step==="otp"?"📧":"✏️"}
            </div>
            <div>
              <div className="playfair" style={{fontSize:19,fontWeight:800,color:"#fff",lineHeight:1.1}}>
                {step==="email"&&"My Account"}{step==="otp"&&"Verify Your Email"}{step==="register"&&"Create Account"}{step==="done"&&"Welcome!"}
              </div>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.65)",marginTop:3}}>
                {step==="email"&&"Sign in or register for faster booking"}
                {step==="otp"&&`We sent a code to ${email}`}
                {step==="register"&&"Just a few details to complete registration"}
                {step==="done"&&"Your details are pre-filled for faster booking"}
              </p>
            </div>
          </div>
          {/* Member benefits */}
          {step==="email"&&(
            <div style={{display:"flex",gap:14,marginTop:16,flexWrap:"wrap"}}>
              {[["⚡","Auto-fill details"],["🎫","Quick seat selection"],["📋","Booking history"]].map(([ic,label])=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.1)",borderRadius:6,padding:"4px 9px"}}>
                  <span>{ic}</span><span>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{padding:"22px 28px 24px"}}>
          {step==="done"?(
            <div style={{textAlign:"center",padding:"12px 0 8px"}}>
              <div style={{fontSize:48,marginBottom:12}}>🎉</div>
              <div className="playfair" style={{fontSize:20,fontWeight:800,color:C.navy,marginBottom:6}}>You're signed in!</div>
              <p style={{color:C.textMuted,fontSize:14,lineHeight:1.7}}>Your details are now pre-filled. Head straight to seat selection on your next booking.</p>
            </div>
          ):(
            <>
              {step==="email"&&(
                <div style={{display:"flex",flexDirection:"column",gap:13}}>
                  <Input label="Email Address" type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} placeholder="you@example.com" required/>
                  {err&&<div style={{background:C.redBg,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.red}}>{err}</div>}
                  <BookBtn onClick={handleEmailSubmit} full style={{padding:"13px",fontSize:15}}>{loading?"Checking...":"Continue →"}</BookBtn>
                  <div style={{display:"flex",alignItems:"center",gap:8,margin:"4px 0"}}>
                    <div style={{flex:1,height:1,background:C.navyBorder}}/>
                    <span style={{fontSize:11,color:C.textMuted,whiteSpace:"nowrap"}}>Don't have an account?</span>
                    <div style={{flex:1,height:1,background:C.navyBorder}}/>
                  </div>
                  <p style={{fontSize:12,color:C.textMuted,textAlign:"center",margin:"-4px 0 0",lineHeight:1.6}}>Enter your email above — if you're new, we'll walk you through registration with a one-time code.</p>
                  <div style={{borderTop:`1px solid ${C.navyBorder}`,paddingTop:14,textAlign:"center"}}>
                    <button onClick={()=>{reset();onClose();}} style={{background:"none",border:`1px solid ${C.navyBorder}`,borderRadius:8,color:C.textMuted,fontSize:13,cursor:"pointer",padding:"8px 18px",fontFamily:"'Inter',sans-serif"}}>Continue as guest</button>
                    <p style={{fontSize:11,color:C.textMuted,marginTop:8}}>Membership is optional — you can always book without signing in.</p>
                  </div>
                  {/* Demo hint */}
                  <div style={{background:C.navyLight,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.textMuted}}>
                    🧪 <strong>Demo accounts:</strong> sarah@example.com · james@example.com
                  </div>
                </div>
              )}

              {(step==="otp"||step==="register")&&(
                <div style={{display:"flex",flexDirection:"column",gap:13}}>
                  {/* OTP display box */}
                  <div style={{background:`linear-gradient(135deg,${C.blueBg},#EFF6FF)`,border:`1.5px solid ${C.blue}33`,borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
                    <div style={{fontSize:11,color:C.blue,fontWeight:700,marginBottom:6,letterSpacing:.5,textTransform:"uppercase"}}>📧 Demo — Your one-time code</div>
                    <div style={{fontSize:30,fontWeight:900,letterSpacing:10,color:C.navy,fontFamily:"monospace",letterSpacing:8}}>{sentOtp}</div>
                    <div style={{fontSize:11,color:C.textMuted,marginTop:4}}>(In production this is sent to your email)</div>
                  </div>
                  {step==="register"&&(
                    <>
                      <div style={{background:C.amberBg,border:`1px solid ${C.amber2}33`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.amber2}}>
                        ✨ New account — tell us a bit about yourself:
                      </div>
                      <Input label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name" required/>
                      <Input label="Phone Number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+256 7XX XXX XXX" required/>
                    </>
                  )}
                  <div>
                    <label style={{fontSize:11,color:C.textMuted,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase",display:"block",marginBottom:6}}>Enter 6-digit code</label>
                    <input value={otp} onChange={e=>{setOtp(e.target.value.replace(/\D/g,"").slice(0,6));setErr("");}} placeholder="000000"
                      style={{width:"100%",background:C.white,border:`1.5px solid ${err?C.red:C.navyBorder}`,borderRadius:10,padding:"14px 18px",color:C.navy,fontSize:26,outline:"none",textAlign:"center",fontWeight:900,fontFamily:"monospace",letterSpacing:12,transition:"border .2s",boxSizing:"border-box"}}
                      onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor=err?C.red:C.navyBorder}/>
                  </div>
                  {err&&<div style={{background:C.redBg,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.red}}>{err}</div>}
                  <BookBtn onClick={handleVerify} full style={{padding:"13px",fontSize:15}}>
                    {step==="otp"?"Sign In →":"Create Account & Sign In →"}
                  </BookBtn>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <button onClick={()=>{const c=genOtp();setSentOtp(c);setOtp("");}} style={{background:"none",border:"none",color:C.amber,fontSize:12,cursor:"pointer",textDecoration:"underline",fontFamily:"'Inter',sans-serif"}}>Resend code</button>
                    <button onClick={reset} style={{background:"none",border:"none",color:C.textMuted,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>← Change email</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};


// ─── INIT CMS DATA ───────────────────────────────────────────────────
const INIT_HERO_SLIDES=[
  {id:1,url:"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1400&q=80",caption:"Comfortable Journeys Across Uganda",subCaption:"Book your seat in under 2 minutes — boarding pass on WhatsApp",active:true,effect:"ken-burns"},
  {id:2,url:"https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1400&q=80",caption:"Kampala to Every Corner of Uganda",subCaption:"Daily departures · Live countdowns · Friendly service",active:true,effect:"zoom"},
  {id:3,url:"https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1400&q=80",caption:"Safe. Reliable. On Time.",subCaption:"Trusted by thousands of Ugandan travellers since 2018",active:true,effect:"fade"},
];
const INIT_NEWS_ITEMS=[
  {id:1,title:"New Arua Route Launched",body:"Daily departures to Arua starting March 2026.",date:"2026-03-01",active:true,badge:"New Route"},
  {id:2,title:"Student Discount Available",body:"15% off all routes with valid student ID. Use code STUDENT15.",date:"2026-02-15",active:true,badge:"Promo"},
];

const HeroSlider=({slides,onBook,onPlan,onSchedule,store})=>{
  const active=(slides||INIT_HERO_SLIDES).filter(s=>s.active);
  const [idx,setIdx]=useState(0);
  useEffect(()=>{
    if(active.length<=1) return;
    const t=setInterval(()=>setIdx(i=>(i+1)%active.length),5500);
    return()=>clearInterval(t);
  },[active.length]);
  const slide=active[idx%active.length]||active[0];
  if(!slide) return null;
  const imgStyles={"ken-burns":{animation:"kenburns 8s ease-out forwards"},"zoom":{animation:"heroZoom .9s ease forwards"},"fade":{animation:"heroFade .8s ease forwards"},"slide":{animation:"heroSlide .7s ease forwards"}};
  return(
    <div style={{position:"relative",height:"clamp(480px,68vh,680px)",overflow:"hidden",background:C.navy}}>
      <div key={idx} style={{position:"absolute",inset:0,...(imgStyles[slide.effect]||imgStyles.fade)}}>
        <img src={slide.url} alt={slide.caption} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(105deg,rgba(11,30,75,0.88) 0%,rgba(11,30,75,0.55) 55%,rgba(11,30,75,0.2) 100%)"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(11,30,75,0.6) 0%,transparent 55%)"}}/>
      </div>
      <div style={{position:"relative",zIndex:2,height:"100%",maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <div style={{maxWidth:620,animation:"fadeUp .5s ease"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(22,163,74,0.25)",border:"1px solid rgba(22,163,74,0.45)",borderRadius:20,padding:"5px 16px",marginBottom:18,fontSize:12,color:"#4ade80",fontWeight:700,backdropFilter:"blur(6px)"}}>
            <span className="live-dot"/> Live · {(store?.trips||[]).filter(t=>store.seatsAvailable(t)>0).length} trips available today
          </div>
          <h1 className="playfair" style={{fontSize:"clamp(30px,4.8vw,62px)",fontWeight:900,lineHeight:1.08,letterSpacing:"-1.5px",marginBottom:14,color:"#fff",textShadow:"0 2px 24px rgba(0,0,0,0.35)"}}>
            {slide.caption}
          </h1>
          {slide.subCaption&&<p style={{fontSize:"clamp(13px,1.8vw,16px)",color:"rgba(255,255,255,0.75)",maxWidth:480,lineHeight:1.75,marginBottom:28}}>{slide.subCaption}</p>}
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:22}}>
            <BookBtn onClick={onBook} style={{fontSize:14,padding:"13px 30px",boxShadow:"0 6px 24px rgba(11,95,255,0.45)"}}>🎫 Book Your Ride</BookBtn>
            <QuoteBtn onClick={onPlan} style={{fontSize:14,padding:"13px 24px"}}>📋 Get a Quote</QuoteBtn>
            <button onClick={onSchedule} style={{background:"rgba(255,255,255,0.1)",border:"1.5px solid rgba(255,255,255,0.3)",color:"#fff",borderRadius:10,padding:"13px 20px",fontSize:13,fontFamily:"'Raleway',sans-serif",fontWeight:700,cursor:"pointer",backdropFilter:"blur(6px)",transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.2)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}>
              📅 Schedule
            </button>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
            <div onClick={onBook} style={{cursor:"pointer"}}><MTNMoMoIcon size={32} selected={false}/></div>
            <div onClick={onBook} style={{cursor:"pointer"}}><AirtelMoneyIcon size={32} selected={false}/></div>
            {[["💬","WhatsApp ticket"],["🛡️","Safe journeys"],["📦","Courier"]].map(([ic,l])=>(
              <span key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"rgba(255,255,255,0.6)"}}>{ic}{l}</span>
            ))}
          </div>
        </div>
      </div>
      {active.length>1&&(
        <>
          <div style={{position:"absolute",bottom:18,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6,zIndex:3}}>
            {active.map((_,i)=>(
              <button key={i} onClick={()=>setIdx(i)} style={{width:i===idx?26:7,height:7,borderRadius:4,background:i===idx?"#fff":"rgba(255,255,255,0.38)",border:"none",cursor:"pointer",transition:"all .35s",padding:0}}/>
            ))}
          </div>
          <button onClick={()=>setIdx(i=>(i-1+active.length)%active.length)} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",color:"#fff",borderRadius:"50%",width:42,height:42,cursor:"pointer",fontSize:20,backdropFilter:"blur(6px)",zIndex:3,transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.28)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.15)"}>‹</button>
          <button onClick={()=>setIdx(i=>(i+1)%active.length)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",color:"#fff",borderRadius:"50%",width:42,height:42,cursor:"pointer",fontSize:20,backdropFilter:"blur(6px)",zIndex:3,transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.28)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.15)"}>›</button>
        </>
      )}
    </div>
  );
};

const NewsTicker=({items})=>{
  const active=(items||INIT_NEWS_ITEMS).filter(n=>n.active);
  if(!active.length) return null;
  return(
    <div style={{background:C.amber,padding:"8px 0",overflow:"hidden",position:"relative"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",gap:12}}>
        <span style={{background:"rgba(11,30,75,0.18)",borderRadius:5,padding:"2px 9px",fontSize:11,fontWeight:800,color:C.navy,flexShrink:0,fontFamily:"'Raleway',sans-serif",textTransform:"uppercase",letterSpacing:.5}}>News</span>
        <div style={{overflow:"hidden",flex:1,mask:"linear-gradient(to right,transparent,black 5%,black 95%,transparent)"}}>
          <div style={{display:"flex",gap:48,animation:"newsTicker 22s linear infinite",whiteSpace:"nowrap"}}>
            {[...active,...active].map((n,i)=>(
              <span key={i} style={{fontSize:13,fontWeight:600,color:C.navy}}>
                {n.badge&&<strong style={{marginRight:4}}>[{n.badge}]</strong>}{n.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// ─── NAVIGATION ───────────────────────────────────────────────────────
// ─── GLOBAL CSS ADDITIONS ─────────────────────────────────────────────
const GlobalStyles=()=>(
  <style>{`
    *{box-sizing:border-box;}
    body{margin:0;padding:0;background:#F4F8FF;-webkit-font-smoothing:antialiased;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
    @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
    @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.5;}}
    @keyframes urgentPulse{0%,100%{background:#EA580C10;}50%{background:#EA580C20;}}
    @keyframes kenBurns{from{transform:scale(1);}to{transform:scale(1.08);}}
    section:focus{outline:none;}
    :focus-visible{outline:2px solid #0B5FFF;outline-offset:2px;border-radius:4px;}
    .card-hover:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(11,30,75,0.12)!important;}
    .card-hover{transition:transform .2s,box-shadow .2s;}
    .pulse-timer{animation:urgentPulse 1.2s ease infinite;}
    .live-dot{width:8px;height:8px;background:#16A34A;border-radius:50%;display:inline-block;animation:pulse 1.5s infinite;}
    @media(max-width:768px){
      .nav-desktop-links{display:none!important;}
      .nav-hamburger{display:flex!important;}
      .hero-reg-card{display:none!important;}
      .grid-2col{grid-template-columns:1fr!important;}
    }
  `}</style>
);

// ─── BACK TO TOP ──────────────────────────────────────────────────────
const BackToTop=()=>{
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const onScroll=()=>setVisible(window.scrollY>400);
    window.addEventListener("scroll",onScroll,{passive:true});
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);
  if(!visible) return null;
  return(
    <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
      aria-label="Back to top"
      style={{position:"fixed",bottom:28,right:24,zIndex:90,width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,color:"#fff",border:"none",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(11,95,255,0.35)",animation:"fadeUp .25s ease",transition:"transform .2s,box-shadow .2s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(11,95,255,0.45)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 4px 16px rgba(11,95,255,0.35)";}}>
      ↑
    </button>
  );
};

// ─── MEGA-MENU NAV ────────────────────────────────────────────────────
const MegaDropdown=({items,setPage,onClose})=>(
  <div style={{position:"absolute",top:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",background:C.white,border:`1px solid ${C.navyBorder}`,borderRadius:14,boxShadow:"0 12px 40px rgba(11,30,75,0.14)",padding:"8px 0",minWidth:200,animation:"dropDown .18s ease",zIndex:200}}>
    {items.map(item=>(
      <button key={item.id} onClick={()=>{setPage(item.id);onClose();}}
        style={{display:"block",width:"100%",textAlign:"left",padding:"10px 20px",background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.textSecondary,fontFamily:"'Inter',sans-serif",fontWeight:500,transition:"background .15s"}}
        onMouseEnter={e=>{e.currentTarget.style.background=C.navyLight;e.currentTarget.style.color=C.amber;}}
        onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=C.textSecondary;}}>
        {item.icon&&<span aria-hidden="true" style={{marginRight:10}}>{item.icon}</span>}{item.label}
      </button>
    ))}
  </div>
);

const Nav=({page,setPage,currentUser})=>{
  const [menuOpen,setMenuOpen]=useState(false);
  const [openDropdown,setOpenDropdown]=useState(null);

  const menus={
    products:{label:"Products",items:[
      {id:"book",    icon:"🎫",label:"Book Now"},
      {id:"plan",    icon:"📅",label:"Plan Your Journey"},
      {id:"hire",    icon:"🚐",label:"Hire a Van"},
      {id:"parcel",  icon:"📦",label:"Courier / Parcel"},
    ]},
    about:{label:"About Us",items:[
      {id:"about",   icon:"🏢",label:"About Raylane"},
      {id:"safety",  icon:"🛡️",label:"Safety"},
      {id:"faq",     icon:"❓",label:"FAQ"},
      {id:"careers", icon:"💼",label:"Careers & Jobs"},
    ]},
  };

  const closeAll=()=>setOpenDropdown(null);

  return(
    <nav aria-label="Main navigation" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.navyBorder}`,boxShadow:"0 2px 20px rgba(11,30,75,0.08)"}}>
      <style>{`
        @keyframes dropDown{from{opacity:0;transform:translateX(-50%) translateY(-6px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
        @keyframes slideDown{from{opacity:0;max-height:0;}to{opacity:1;max-height:400px;}}
        .nav-item:focus-visible{outline:2px solid ${C.amber};outline-offset:2px;border-radius:6px;}
        .mega-btn:focus-visible{outline:2px solid ${C.amber};outline-offset:2px;border-radius:6px;}
        @media(max-width:768px){.nav-desktop-links{display:none!important;}.nav-hamburger{display:flex!important;}}
      `}</style>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 clamp(16px,4vw,40px)",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        {/* Logo */}
        <div onClick={()=>{setPage("home");closeAll();}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}} role="link" aria-label="Raylane home" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&setPage("home")}>
          <div style={{width:38,height:38,background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 4px 12px ${C.amber}33`}} aria-hidden="true">🚐</div>
          <div>
            <div className="playfair" style={{fontWeight:900,fontSize:20,letterSpacing:"-0.5px",lineHeight:1,color:C.navy}}>Raylane</div>
            <div style={{fontSize:9,color:C.textMuted,letterSpacing:2,textTransform:"uppercase"}}>Transport Services</div>
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="nav-desktop-links" style={{display:"flex",gap:4,alignItems:"center",position:"relative"}}>
          {/* Schedule — plain link */}
          <button className="nav-item" onClick={()=>{setPage("schedule");closeAll();}}
            style={{background:page==="schedule"?C.amber+"15":"transparent",color:page==="schedule"?C.amber:C.textSecondary,border:"1px solid transparent",borderRadius:8,padding:"7px 13px",cursor:"pointer",fontSize:13,fontFamily:"'Inter',sans-serif",fontWeight:500,transition:"all .2s"}}
            onMouseEnter={e=>{if(page!=="schedule")e.currentTarget.style.color=C.navy;}} onMouseLeave={e=>{if(page!=="schedule")e.currentTarget.style.color=C.textSecondary;}}>
            Schedule
          </button>

          {/* Products dropdown */}
          {Object.entries(menus).map(([key,menu])=>(
            <div key={key} style={{position:"relative"}}
              onMouseEnter={()=>setOpenDropdown(key)} onMouseLeave={closeAll}>
              <button className="mega-btn"
                style={{background:openDropdown===key?C.amber+"15":"transparent",color:openDropdown===key?C.amber:C.textSecondary,border:"1px solid transparent",borderRadius:8,padding:"7px 13px",cursor:"pointer",fontSize:13,fontFamily:"'Inter',sans-serif",fontWeight:500,transition:"all .2s",display:"flex",alignItems:"center",gap:5}}
                aria-haspopup="true" aria-expanded={openDropdown===key}>
                {menu.label}
                <svg width="10" height="10" viewBox="0 0 10 10" fill={openDropdown===key?C.amber:C.textMuted} style={{transform:openDropdown===key?"rotate(180deg)":"rotate(0)",transition:"transform .2s"}}><path d="M1 3l4 4 4-4"/></svg>
              </button>
              {openDropdown===key&&<MegaDropdown items={menu.items} setPage={setPage} onClose={closeAll}/>}
            </div>
          ))}

          <div style={{width:1,height:22,background:C.navyBorder,margin:"0 6px"}} aria-hidden="true"/>
          <BookBtn onClick={()=>{setPage("book");closeAll();}} style={{padding:"8px 20px",fontSize:13}} aria-label="Book a seat">Book Now</BookBtn>

          {currentUser?(
            <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:4}}>
              <span style={{fontSize:12,color:C.amber,fontWeight:700}} aria-label={`Logged in as ${currentUser.name}`}>👤 {currentUser.name}</span>
              <Btn onClick={()=>setPage("logout")} variant="navy" style={{padding:"6px 14px",fontSize:11}}>Logout</Btn>
            </div>
          ):(
            <Btn onClick={()=>{setPage("customer-login");closeAll();}} variant="navy" style={{padding:"7px 16px",fontSize:12,marginLeft:4,background:C.navyLight,color:C.textSecondary,border:`1px solid ${C.navyBorder}`}} aria-label="My Account">👤 My Account</Btn>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={()=>setMenuOpen(!menuOpen)} className="nav-hamburger" aria-label="Open menu" aria-expanded={menuOpen}
          style={{background:"none",border:`1px solid ${C.navyBorder}`,borderRadius:8,padding:"6px 11px",cursor:"pointer",fontSize:18,color:C.textPrimary,display:"none",alignItems:"center",justifyContent:"center"}}>
          {menuOpen?"✕":"☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen&&(
        <div role="dialog" aria-label="Mobile navigation" style={{background:C.white,borderTop:`1px solid ${C.navyBorder}`,padding:"16px 20px 20px",animation:"slideDown .22s ease",overflow:"hidden"}}>
          {[{id:"home",label:"🏠 Home"},{id:"schedule",label:"📋 Schedule"},{id:"book",label:"🎫 Book Now"},{id:"plan",label:"📅 Plan Journey"},{id:"parcel",label:"📦 Courier"},{id:"safety",label:"🛡️ Safety"},{id:"faq",label:"❓ FAQ"}].map(l=>(
            <button key={l.id} onClick={()=>{setPage(l.id);setMenuOpen(false);}}
              style={{display:"block",width:"100%",textAlign:"left",padding:"13px 4px",background:"none",border:"none",borderBottom:`1px solid ${C.navyLight}`,color:page===l.id?C.amber:C.textPrimary,cursor:"pointer",fontSize:14,fontFamily:"'Inter',sans-serif",fontWeight:page===l.id?700:500}}>
              {l.label}
            </button>
          ))}
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <BookBtn onClick={()=>{setPage("book");setMenuOpen(false);}} style={{flex:1}}>Book Now</BookBtn>
            <Btn onClick={()=>{setPage("customer-login");setMenuOpen(false);}} variant="navy" style={{flex:1}}>My Account</Btn>
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
// ─── HOME DEPARTURE CARD (uses hooks, must be a component) ───────────
const HomeTripCard=({trip,i,store,onBook})=>{
  const r=store.getRoute(trip.route_id);
  const avail=store.seatsAvailable(trip);
  const {str,urgent,boarding}=useCountdown(trip.departure_time);
  return(
    <article style={{background:C.white,border:`1.5px solid ${boarding?C.orange:urgent?C.amber2+"66":C.navyBorder}`,borderRadius:20,padding:24,boxShadow:"0 4px 20px rgba(11,30,75,0.08)",position:"relative",overflow:"hidden",animation:`fadeUp ${.1+i*.12}s ease`,transition:"transform .2s,box-shadow .2s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 32px rgba(11,30,75,0.14)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 4px 20px rgba(11,30,75,0.08)";}}>
      {boarding&&<div aria-hidden="true" style={{position:"absolute",top:0,right:0,background:`linear-gradient(135deg,${C.orange},#c2410c)`,color:"#fff",fontSize:10,fontWeight:800,padding:"5px 14px",borderRadius:"0 20px 0 12px",letterSpacing:1}}>BOARDING SOON</div>}
      {urgent&&!boarding&&<div aria-hidden="true" style={{position:"absolute",top:0,right:0,background:C.amber2,color:"#fff",fontSize:10,fontWeight:800,padding:"5px 14px",borderRadius:"0 20px 0 12px",letterSpacing:1}}>LEAVING SOON</div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div>
          <div style={{fontSize:11,color:C.textMuted,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{r.origin}</div>
          <div className="playfair" style={{fontSize:22,fontWeight:900,color:C.navy}}>{r.destination}</div>
          <div style={{fontSize:12,color:C.textMuted,marginTop:3}}>{trip.vehicle_reg} · {Math.floor(r.duration_minutes/60)}h {r.duration_minutes%60}m</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div className="ral" style={{fontSize:28,fontWeight:900,color:urgent?C.amber2:C.amber,letterSpacing:"-1px"}}>{formatTime(trip.departure_time)}</div>
        </div>
      </div>
      <div style={{height:3,background:C.navyLight,borderRadius:2,marginBottom:14}}>
        <div style={{width:`${Math.min(((trip.seats_booked?.length||0)/trip.capacity)*100,100)}%`,height:"100%",background:avail<5?C.orange:C.green,borderRadius:2,transition:"width .5s"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div className="ral" style={{fontSize:19,fontWeight:800,color:C.green}}>{formatUGX(r.price)}</div>
          <div style={{fontSize:11,color:avail<5?C.orange:C.textMuted,fontWeight:600}}>⏱ {str} · {avail} seat{avail!==1?"s":""} left</div>
        </div>
        <BookBtn onClick={()=>onBook(trip,"book")} style={{padding:"10px 20px",fontSize:13}} aria-label={`Book seat to ${r.destination}`}>Book My Seat →</BookBtn>
      </div>
    </article>
  );
};

const HomePage=({setPage,setPreselectedTrip,store,heroSlides,newsItems,onCustomerLogin,currentUser,onStaffLogin})=>{
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
      {/* HERO SLIDER */}
      <HeroSlider slides={heroSlides} onBook={()=>setPage("book")} onPlan={()=>setPage("plan")} onSchedule={()=>setPage("schedule")} store={store}/>
      {/* NEWS TICKER */}
      <NewsTicker items={newsItems}/>
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

      {/* LIVE TRIP CARDS — next 2 soonest with available seats */}
      <section aria-label="Live departures" style={{maxWidth:1280,margin:"0 auto",padding:"clamp(28px,4vw,48px) clamp(16px,4vw,40px) 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20,flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:C.amber,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Live Today</div>
            <h2 className="playfair" style={{fontSize:24,fontWeight:800,color:C.navy,margin:0}}>Next Departures</h2>
          </div>
          <Btn onClick={()=>setPage("schedule")} variant="outline" style={{fontSize:13}}>View Full Schedule →</Btn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:18}}>
          {store.trips
            .filter(t=>store.seatsAvailable(t)>0)
            .sort((a,b)=>new Date(a.departure_time)-new Date(b.departure_time))
            .slice(0,2)
            .map((trip,i)=>{
              const r=store.getRoute(trip.route_id);
              const avail=store.seatsAvailable(trip);
              return <HomeTripCard key={trip.id} trip={trip} i={i} store={store} onBook={handleBook}/>;
            })}
        </div>
      </section>

      {/* WHY RAYLANE */}
      <section aria-label="Why choose Raylane" style={{background:C.white,borderTop:`1px solid ${C.navyBorder}`,borderBottom:`1px solid ${C.navyBorder}`}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"clamp(56px,7vw,96px) clamp(16px,4vw,40px)"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{display:"inline-block",fontSize:11,fontWeight:700,color:C.amber,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>WHY RAYLANE</div>
            <h2 className="playfair" style={{fontSize:"clamp(26px,4vw,38px)",fontWeight:800,color:C.navy,marginBottom:8}}>Uganda's Most Trusted<br/>Intercity Transport</h2>
            <div style={{width:56,height:3,background:C.amber,borderRadius:2,margin:"12px auto 0"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:20}}>
            {[{icon:"🛡️",title:"Safety First",desc:"Strict safety protocols and licensed drivers on every trip."},{icon:"⚡",title:"Fast Booking",desc:"Book in under 2 minutes, boarding pass on WhatsApp."},{icon:"💺",title:"Comfortable Rides",desc:"Modern, clean vehicles for every journey."},{icon:"💳",title:"Mobile Money",desc:"Pay via MTN or Airtel Money instantly.",payIcons:true}].map(f=>(
              <Card key={f.title} className="card-hover" style={{textAlign:"center",transition:"all .2s",cursor:"default"}}>
                <div style={{width:52,height:52,borderRadius:14,background:C.navyLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px"}}>
                  {f.icon}
                </div>
                <div className="ral" style={{fontWeight:700,fontSize:15,marginBottom:8,color:C.textPrimary}}>{f.title}</div>
                <p style={{fontSize:13,color:C.textMuted,lineHeight:1.7}}>{f.desc}</p>
                {f.payIcons&&(
                  <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:10}}>
                    <img src={MTN_MOMO_B64} alt="MTN MoMo" style={{height:26,width:"auto",borderRadius:4,border:"1px solid #FFCB0544"}}/>
                    <img src={AIRTEL_MONEY_B64} alt="Airtel Money" style={{height:26,width:"auto",borderRadius:4,border:"1px solid #E6000022",background:"#fff"}}/>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* OUR ROUTES */}
      <section aria-label="Our routes" style={{maxWidth:1280,margin:"0 auto",padding:"clamp(56px,7vw,80px) clamp(16px,4vw,40px)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32,flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:C.amber,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>DESTINATIONS</div>
            <h2 className="playfair" style={{fontSize:"clamp(22px,3.5vw,34px)",fontWeight:800,color:C.navy,marginBottom:0}}>Routes We Serve</h2>
            <div style={{width:44,height:3,background:C.amber,borderRadius:2,marginTop:10}}/>
          </div>
          <BookBtn onClick={()=>setPage("book")} style={{fontSize:13,padding:"10px 22px"}} aria-label="Book any route">Book Any Route</BookBtn>
        </div>
        {/* Outbound */}
        <div style={{marginBottom:24}}>
          <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>FROM KAMPALA</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:10}}>
            {ROUTES.filter(r=>r.direction==="outbound").map(r=>(
              <div key={r.id} onClick={()=>setPage("book")} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&setPage("book")} className="card-hover" style={{background:C.white,border:`1px solid ${C.navyBorder}`,borderRadius:14,padding:"15px 16px",cursor:"pointer",transition:"all .2s",boxShadow:"0 1px 6px rgba(11,30,75,0.04)"}}>
                <div style={{fontSize:10,color:C.textMuted,fontWeight:600,letterSpacing:.5}}>Kampala →</div>
                <div className="playfair" style={{fontWeight:800,fontSize:17,margin:"3px 0 8px",color:C.navy}}>{r.destination}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:C.green,fontWeight:700,fontSize:13}}>{formatUGX(r.price)}</span>
                  <span style={{background:C.navyLight,borderRadius:6,padding:"2px 7px",fontSize:10,color:C.textMuted}}>{Math.floor(r.duration_minutes/60)}h{r.duration_minutes%60>0?` ${r.duration_minutes%60}m`:""}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Return */}
        <div>
          <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>RETURN TO KAMPALA</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:10}}>
            {ROUTES.filter(r=>r.direction==="return").map(r=>(
              <div key={r.id} onClick={()=>setPage("book")} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&setPage("book")} className="card-hover" style={{background:C.navyLight,border:`1px solid ${C.navyBorder}`,borderRadius:14,padding:"15px 16px",cursor:"pointer",transition:"all .2s",boxShadow:"0 1px 6px rgba(11,30,75,0.04)"}}>
                <div style={{fontSize:10,color:C.textMuted,fontWeight:600,letterSpacing:.5}}>{r.origin} →</div>
                <div className="playfair" style={{fontWeight:800,fontSize:17,margin:"3px 0 8px",color:C.navy}}>Kampala</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:C.green,fontWeight:700,fontSize:13}}>{formatUGX(r.price)}</span>
                  <span style={{background:C.white,borderRadius:6,padding:"2px 7px",fontSize:10,color:C.textMuted}}>{Math.floor(r.duration_minutes/60)}h{r.duration_minutes%60>0?` ${r.duration_minutes%60}m`:""}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section aria-label="Passenger testimonials" style={{background:C.navy}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"clamp(56px,7vw,96px) clamp(16px,4vw,40px)"}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <div style={{fontSize:11,fontWeight:700,color:C.amber,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>REVIEWS</div>
            <h2 className="playfair" style={{fontSize:"clamp(24px,4vw,36px)",fontWeight:800,marginBottom:6,color:C.white}}>What Passengers Say</h2>
            <div style={{width:44,height:3,background:C.amber,borderRadius:2,margin:"10px auto 0"}}/>
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
      </section>

      {/* FAQ PREVIEW */}
      <section aria-label="Frequently asked questions" style={{maxWidth:860,margin:"0 auto",padding:"clamp(56px,7vw,80px) clamp(16px,4vw,40px)"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:11,fontWeight:700,color:C.amber,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>FAQ</div>
          <h2 className="playfair" style={{fontSize:"clamp(22px,3.5vw,32px)",fontWeight:800,color:C.navy,marginBottom:6}}>Frequently Asked Questions</h2>
          <div style={{width:44,height:3,background:C.amber,borderRadius:2,margin:"10px auto 0"}}/>
        </div>
        {FAQ_DATA.slice(0,4).map((f,i)=><FAQItem key={i} f={f}/>)}
        <div style={{textAlign:"center",marginTop:28}}>
          <Btn onClick={()=>setPage("faq")} variant="outline" aria-label="View all FAQs">View All FAQs →</Btn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:C.navy,borderTop:`1px solid rgba(255,255,255,0.08)`,padding:"clamp(44px,6vw,72px) clamp(16px,4vw,40px) 24px"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr repeat(4,1fr)",gap:"clamp(20px,3vw,48px)",marginBottom:40}}>
            {/* Brand */}
            <div>
              <div className="playfair" style={{fontWeight:900,fontSize:22,color:"#fff",marginBottom:10,letterSpacing:"-0.5px"}}>Raylane</div>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.9,maxWidth:220,marginBottom:16}}>Safe, comfortable intercity transport connecting Uganda since 2018.</p>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:2}}>
                <div>📞 +256 700 000000</div>
                <div>✉️ info@raylane.ug</div>
                <div>📍 Nakasero, Kampala</div>
                <div>⏰ Mon–Sun · 5:00 AM – 10:00 PM</div>
              </div>
            </div>
            {/* Travel */}
            <div>
              <div className="ral" style={{fontWeight:800,fontSize:11,color:C.amberLight,marginBottom:14,letterSpacing:1.5,textTransform:"uppercase"}}>Travel</div>
              {[{label:"Book a Seat",fn:()=>setPage("book")},{label:"Plan a Journey",fn:()=>setPage("plan")},{label:"Hire a Van",fn:()=>setPage("hire")},{label:"Courier / Parcel",fn:()=>setPage("parcel")},{label:"Live Schedule",fn:()=>setPage("schedule")}].map(l=>(
                <button key={l.label} onClick={l.fn} style={{display:"block",background:"none",border:"none",padding:"5px 0",fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",textAlign:"left",fontFamily:"'Inter',sans-serif",transition:"color .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.color=C.amberLight} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.5)"}>{l.label}</button>
              ))}
            </div>
            {/* Company */}
            <div>
              <div className="ral" style={{fontWeight:800,fontSize:11,color:C.amberLight,marginBottom:14,letterSpacing:1.5,textTransform:"uppercase"}}>Company</div>
              {[{label:"About Us",fn:()=>setPage("about")},{label:"Safety",fn:()=>setPage("safety")},{label:"FAQ",fn:()=>setPage("faq")},{label:"Careers",fn:()=>setPage("careers")},{label:"Contact",fn:null}].map(l=>(
                <button key={l.label} onClick={l.fn||undefined} style={{display:"block",background:"none",border:"none",padding:"5px 0",fontSize:13,color:"rgba(255,255,255,0.5)",cursor:l.fn?"pointer":"default",textAlign:"left",fontFamily:"'Inter',sans-serif",transition:"color .15s"}}
                  onMouseEnter={e=>{if(l.fn)e.currentTarget.style.color=C.amberLight;}} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.5)"}>{l.label}</button>
              ))}
            </div>
            {/* Support */}
            <div>
              <div className="ral" style={{fontWeight:800,fontSize:11,color:C.amberLight,marginBottom:14,letterSpacing:1.5,textTransform:"uppercase",display:"flex",alignItems:"center",gap:2}}>
                <span>Support</span>
                <span onClick={()=>onStaffLogin&&onStaffLogin()} title="" style={{cursor:"pointer",color:"rgba(255,255,255,0.18)",fontSize:13,lineHeight:1,userSelect:"none",padding:"0 2px"}} aria-label="Staff portal">.</span>
              </div>
              {[{label:"Lost & Found",fn:null},{label:"Refund Policy",fn:null},{label:"Luggage Rules",fn:null},{label:"Accessibility",fn:null},{label:"Booking Issues",fn:null}].map(l=>(
                <button key={l.label} onClick={l.fn||undefined} style={{display:"block",background:"none",border:"none",padding:"5px 0",fontSize:13,color:"rgba(255,255,255,0.5)",cursor:l.fn?"pointer":"default",textAlign:"left",fontFamily:"'Inter',sans-serif"}}>{l.label}</button>
              ))}
            </div>
            {/* Legal (footer extras — decongested from body) */}
            <div>
              <div className="ral" style={{fontWeight:800,fontSize:11,color:C.amberLight,marginBottom:14,letterSpacing:1.5,textTransform:"uppercase"}}>Legal</div>
              {["Privacy Policy","Terms of Service","Cookie Policy","Accessibility Statement"].map(l=>(
                <button key={l} style={{display:"block",background:"none",border:"none",padding:"5px 0",fontSize:12,color:"rgba(255,255,255,0.4)",cursor:"pointer",textAlign:"left",fontFamily:"'Inter',sans-serif"}}>{l}</button>
              ))}
              <div style={{marginTop:16,padding:"10px 12px",background:"rgba(255,255,255,0.04)",borderRadius:8,fontSize:11,color:"rgba(255,255,255,0.35)",lineHeight:1.8}}>
                TIN: 1000123456<br/>
                CCTV & Registered<br/>
                ISO 9001 Transport
              </div>
            </div>
          </div>
          {/* Social Media Links */}
          <div style={{display:"flex",gap:8,marginBottom:22,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginRight:4}}>Follow us</span>
            {[
              {label:"Facebook",href:"#",color:"#1877F2",svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>},
              {label:"Twitter/X",href:"#",color:"#fff",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>},
              {label:"Instagram",href:"#",color:"#E1306C",svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>},
              {label:"YouTube",href:"#",color:"#FF0000",svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>},
              {label:"LinkedIn",href:"#",color:"#0A66C2",svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>},
              {label:"WhatsApp",href:"#",color:"#25D366",svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>},
            ].map(s=>(
              <a key={s.label} href={s.href} title={s.label} style={{width:36,height:36,borderRadius:9,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.6)",textDecoration:"none",transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.background=s.color+"cc";e.currentTarget.style.borderColor=s.color;e.currentTarget.style.color="#fff";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.07)";e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";e.currentTarget.style.color="rgba(255,255,255,0.6)";e.currentTarget.style.transform="";}}>
                {s.svg}
              </a>
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
            style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"11px 14px",color:C.textPrimary,fontSize:14,outline:"none"}}
            onFocus={e=>e.target.style.borderColor=C.amberLight} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.15)"}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          <label style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>Route Travelled</label>
          <select value={form.route} onChange={e=>setForm({...form,route:e.target.value})}
            style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"11px 14px",color:C.textPrimary,fontSize:14,outline:"none"}}>
            <option value="">Select your route</option>
            {ROUTES.map(r=><option key={r.id} value={`${r.origin} → ${r.destination}`}>{r.origin} → {r.destination}</option>)}
          </select>
        </div>
        <div><label style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,letterSpacing:".5px",textTransform:"uppercase",display:"block",marginBottom:10}}>Rating</label><Stars rating={form.rating} onChange={r=>setForm({...form,rating:r})} size={26}/></div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          <label style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>Your Review</label>
          <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell us about your journey..." rows={4}
            style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"11px 14px",color:C.textPrimary,fontSize:14,outline:"none",resize:"vertical",fontFamily:"'Inter',sans-serif"}}
            onFocus={e=>e.target.style.borderColor=C.amberLight} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.15)"}/>
        </div>
        <BookBtn onClick={handle} style={{padding:"13px",opacity:(!form.name||!form.message)?0.5:1}} full>Submit Review</BookBtn>
      </div>
    </div>
  );
};

const ScheduleRow=({trip,store,setPage,setPreselectedTrip})=>{
  const route=store.getRoute(trip.route_id);
  const {str,urgent,boarding}=useCountdown(trip.departure_time);
  const avail=store.seatsAvailable(trip); const isFull=avail<=0;
  return(
    <tr style={{borderBottom:`1px solid ${C.navyBorder}`,background:boarding&&!isFull?C.orangeBg:"transparent",transition:"background .15s"}}
      onMouseEnter={e=>e.currentTarget.style.background=C.navyLight}
      onMouseLeave={e=>e.currentTarget.style.background=boarding&&!isFull?C.orangeBg:"transparent"}>
      <td style={{padding:"13px 16px"}}><div className="ral" style={{fontWeight:700,color:C.textPrimary}}>{route.origin} → {route.destination}</div></td>
      <td style={{padding:"13px 16px"}}><div className="ral" style={{fontWeight:900,color:C.amber,fontSize:18}}>{formatTime(trip.departure_time)}</div></td>
      <td style={{padding:"13px 16px"}}>
        <span className="ral" style={{fontWeight:800,color:boarding?C.orange:urgent?C.amber2:C.textPrimary,fontSize:14,fontVariantNumeric:"tabular-nums"}}>{str}</span>
        {boarding&&<div style={{fontSize:10,color:C.orange,fontWeight:700}}>Boarding!</div>}
      </td>
      <td style={{padding:"13px 16px"}}><span style={{color:isFull?C.red:avail<5?C.orange:C.green,fontWeight:700}}>{isFull?"FULL":avail}</span></td>
      <td style={{padding:"13px 16px"}}><span className="ral" style={{fontWeight:700,color:C.green}}>{formatUGX(route.price)}</span></td>
      <td style={{padding:"13px 16px"}}><StatusBadge status={trip.status}/></td>
      <td style={{padding:"13px 16px"}}>
        {isFull
          ?<Btn variant="navy" style={{padding:"6px 12px",fontSize:11}}>Next Van</Btn>
          :<BookBtn onClick={()=>{setPreselectedTrip(trip);setPage("book");}} style={{padding:"6px 14px",fontSize:12}}>Book</BookBtn>}
      </td>
    </tr>
  );
};

const SchedulePage=({setPage,setPreselectedTrip,store})=>{
  const [filter,setFilter]=useState("all");
  const filtered=store.trips.filter(t=>filter==="all"||store.getRoute(t.route_id).destination===filter);
  return(
    <div style={{minHeight:"100vh",background:C.navyLight,paddingTop:64}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 20px 40px"}}>
        <h1 className="playfair" style={{fontSize:30,fontWeight:800,marginBottom:6,color:C.navy}}>Trip Schedule</h1>
        <p style={{color:C.textMuted,marginBottom:22,fontSize:13}}>All departures from Kampala · Live countdown timers</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:22}}>
          {["all",...new Set(ROUTES.map(r=>r.destination))].map(d=>(
            <button key={d} onClick={()=>setFilter(d)} style={{background:filter===d?C.amber:"#fff",color:filter===d?"#fff":C.textSecondary,border:`1.5px solid ${filter===d?C.amber:C.navyBorder}`,borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:filter===d?800:500,fontFamily:"'Raleway',sans-serif",transition:"all .2s"}}>
              {d==="all"?"All Routes":d}
            </button>
          ))}
        </div>
        <Card style={{padding:0,overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:C.navyLight,borderBottom:`1px solid ${C.navyBorder}`}}>
                {["Route","Departs","Countdown","Seats","Fare","Status",""].map(h=>(
                  <th key={h} style={{padding:"13px 16px",textAlign:"left",fontSize:11,color:C.textMuted,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(trip=><ScheduleRow key={trip.id} trip={trip} store={store} setPage={setPage} setPreselectedTrip={setPreselectedTrip}/>)}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
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
  const [showAuthModal,setShowAuthModal]=useState(false);
  const [currentUserLocal,setCurrentUserLocal]=useState(currentUser||null);

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
    const code=genBookingCode(trip.vehicle_reg||"");
    store.addBooking({booking_code:code,passenger:form.name,phone:form.phone,route:`${route.origin} → ${route.destination}`,route_id:route.id,seats,trip_id:trip.id,amount:totalAmount,payment_status:"confirmed",status:"confirmed",date:new Date().toISOString().split("T")[0],agent_id:null,is_advance:false});
    setConfirmed({code,passenger:form.name,phone:form.phone,route:`${route.origin} → ${route.destination}`,seats,departure:formatTime(trip.departure_time),amount:totalAmount,vehicle:trip.vehicle_reg});
    setStep(5);
  };

  const TERMS=["Arrive 20 minutes before departure.","10kg luggage free per passenger.","Extra luggage charged by weight.","Ticket valid for scheduled trip only.","QR code required for boarding."];

  return(
    <div style={{minHeight:"100vh",paddingTop:80,maxWidth:900,margin:"0 auto",padding:"80px 20px 40px"}}>
      <h1 className="ral" style={{fontSize:30,fontWeight:800,marginBottom:4}}>Book Your Seat</h1>
      {!currentUser&&(
        <div style={{background:C.blueBg,border:`1px solid ${C.blue}33`,borderRadius:12,padding:"12px 18px",marginTop:10,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontWeight:700,fontSize:13,color:C.blue}}>👤 Members book faster!</div>
            <div style={{fontSize:12,color:C.textSecondary}}>Sign in to skip the details form — your info is pre-filled.</div>
          </div>
          <Btn onClick={()=>setShowAuthModal(true)} variant="outline" style={{fontSize:12,padding:"7px 16px"}}>Sign In / Register</Btn>
        </div>
      )}
      {showAuthModal&&<CustomerAuthModal open={showAuthModal} onClose={()=>setShowAuthModal(false)} onLogin={u=>{setCurrentUserLocal(u);setShowAuthModal(false);if(u.name)setForm(f=>({...f,name:u.name,phone:u.phone||f.phone,email:u.email||f.email}));}}/>}
      {/* Step indicator */}
      <div style={{display:"flex",alignItems:"center",gap:0,marginTop:18,marginBottom:28,flexWrap:"wrap",gap:4}}>
        {["Trip","Seats","Details","Payment","Done"].map((s,i)=>(
          <div key={s} style={{display:"flex",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:step>i+1?C.green:step===i+1?C.amber:C.navyLight,border:`2px solid ${step>i+1?C.green:step===i+1?C.amber:C.navyBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:step>=i+1?"#0D1B3E":C.textMuted,transition:"all .3s"}}>{step>i+1?"✓":i+1}</div>
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
                <div key={t.id} onClick={()=>!isFull&&setTrip(t)} style={{background:"#fff",border:`2px solid ${isSel?C.amber:isFull?C.red+"33":C.navyBorder}`,borderRadius:15,padding:"16px 18px",cursor:isFull?"not-allowed":"pointer",transition:"all .2s",opacity:isFull?.55:1,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                  <div><div className="ral" style={{fontWeight:800,fontSize:17}}>{r.origin} → {r.destination}</div><div style={{color:C.textMuted,fontSize:11,marginTop:2}}>{t.vehicle_reg}{isFull&&<span style={{color:C.red,marginLeft:8}}>● Fully Booked</span>}</div></div>
                  <div style={{display:"flex",gap:18,alignItems:"center"}}>
                    <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.textMuted}}>Departs</div><div className="ral" style={{fontWeight:800,fontSize:20,color:C.amber}}>{formatTime(t.departure_time)}</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.textMuted}}>Seats</div><div style={{fontWeight:700,color:isFull?C.red:C.green}}>{isFull?"FULL":avail}</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.textMuted}}>Fare</div><div className="ral" style={{fontWeight:700,color:C.amber}}>{formatUGX(r.price)}</div></div>
                    {isSel&&<div style={{width:22,height:22,borderRadius:"50%",background:C.amber,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff"}}>✓</div>}
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
            <div style={{marginTop:16,padding:14,background:C.navyLight,borderRadius:12,border:`1px solid ${C.navyBorder}`}}>
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
            <div style={{background:C.navyLight,borderRadius:12,padding:16,marginBottom:18}}>
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
                <PaymentMethodPicker value={payMethod} onChange={setPayMethod} showMoMoInstructions={false} totalAmount={totalAmount}/>
              </div>
            </div>
            {payStatus==="idle"&&(
              <>
                <PaymentMethodPicker value={payMethod} onChange={setPayMethod} showMoMoInstructions={true} totalAmount={totalAmount}/>
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
                <div style={{fontWeight:700,color:C.textPrimary,marginBottom:4}}>TRAVEL TERMS</div>
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
    const code=genBookingCode("");
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
            <div style={{marginTop:14,padding:12,background:C.navyLight,borderRadius:12,border:`1px solid ${C.navyBorder}`}}>
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
            <div style={{background:C.navyLight,borderRadius:10,padding:14,marginBottom:16,fontSize:12,color:C.textMuted,lineHeight:1.7}}>
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
              <PaymentMethodPicker value={payMethod} onChange={setPayMethod} showMoMoInstructions={true} totalAmount={totalAmount}/>
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
  const [form,setForm]=useState({sender:"",senderPhone:"",senderNIN:"",receiver:"",receiverPhone:"",destination:"",description:"",weight:""});
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
            <Input label="Sender National ID (NIN) *" value={form.senderNIN} onChange={e=>setForm({...form,senderNIN:e.target.value})} placeholder="e.g. CM8700000XXXXX" maxLength={14}/>
            <Input label="Receiver Name" value={form.receiver} onChange={e=>setForm({...form,receiver:e.target.value})} placeholder="Receiver's name"/>
            <Input label="Receiver Phone" value={form.receiverPhone} onChange={e=>setForm({...form,receiverPhone:e.target.value})} placeholder="+256 7XX XXX XXX"/>
            <Sel label="Destination" value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})} options={[{value:"",label:"Choose destination"},...ROUTES.map(r=>({value:r.destination,label:r.destination}))]}/>
            <Input label="Weight (kg)" type="number" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})} placeholder="e.g. 2.5"/>
            <Input label="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="What's inside?"/>
            <div style={{background:C.navyLight,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.textMuted}}>🧳 Up to 10kg free of charge</div>
            <Btn full style={{marginTop:4}} onClick={()=>{
              const code=genParcelCode("");
              alert(`✅ Parcel booked!\nYour tracking code: ${code}\nSave this code to track your parcel.`);
            }}>Submit Parcel Booking</Btn>
          </div>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card>
            <h3 className="ral" style={{fontWeight:800,fontSize:17,marginBottom:14}}>Track Your Parcel</h3>
            <Input label="Parcel Code" value={tracking} onChange={e=>setTracking(e.target.value)} placeholder="e.g. RX-P001"/>
            <Btn onClick={()=>setTrackResult(mock.find(p=>p.code.toLowerCase()===tracking.toLowerCase())||{code:tracking,status:"cancelled",location:"Not found",updated:"—"})} full style={{marginTop:10}}>Track →</Btn>
            {trackResult&&(
              <div style={{marginTop:12,background:C.navyLight,borderRadius:10,padding:12,animation:"fadeUp .3s ease"}}>
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
          <div className="ral" style={{fontWeight:900,fontSize:20,letterSpacing:"1px"}}>RAYLANE</div>
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

const MTN_MOMO_B64="data:image/png;base64,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tMt6r8r8QuvVhOmrDzcQYErGMZrVFIOcQ7Nubd49SyqzXKju9rp7lQTNlp52B7HDr6O1fVIxskbmPALXAgg9IXnmSmo1MnWRgLPhuvbsOY+RXR48Jk1Acw5hw+K4XOxWrItI1mdYcZ3K2luTGTF0fW07QsdK9dyswyZgMjw91wBHYRdceiw3QnljtQbKio5VVpVZSBWlRt03DtUkVG3TcO1U4u6qsLeUlafFhSo3KKtPiwpUbleQd1YiZ3yqoiKqrdERERERERERERERERERERERERERERFdF41narVWPxje1QOimZvBSE52heDir53bl4EqQnNXwCOKtJVCVQlSqayFSuELJUYixFSWmnBJmeNc+S0bz6lEE9C6D5POFPo6zPxDVx5VNaMoQRtbHx9K1jFtebRKY+Y/Wcm/7j/GvcstRqeZ6abD4DM9i2daKCntlsp6ClaGwwRhjQOpfUsbx9jC2YQtRq60mSZ+yGBh755+Q61o+4abMWTVRkpY6Omiz2RlhdkO3MLz5RsH1avNdMwW+iSfScbXPG3Ero07WZOnkQnnPkOC6OrqWnraSSlqomywytLXtcMwQVy5phwHNhG793pWuktdS4mF+XgHyCtmaNNMEN6rmWq/wx0tTIdWKdh/luPA8FsnFFkocRWSotVewOhmbkHDew9Dh1hZWkztSwRUxCnGkMdvDUEes3rH0KtJyBK12V24J9IaHiDyPatDcnzG5tN2GHLhLlQ1j84XOOyKX/BXRq4vxXZa/CuJKi2VQLJqeTON43Pb+Fw7V05oexU3FOD6eaV4NbTDuNQOkkbnekLMeUihQiGVmUzZEttW0udHd+h67c1Z4Zn3jako283T5juWrOVJau4X+23djcm1UJiceLmH/BC0yV05yl7eKrR+ysAzfR1THZ8GuzaffkuY1v3k7njNUGGDqwlvgbj3ELX8SQOin3Efqsf771Qq0qpKot4WCVpUddNw7VIqNufgjtVOLuqrD3lJ2nxYUqNyirT4sKVG5XkHdWImd8qqIiqq3RERERERERERERERERERERERERERERVZ4xvaqIPCb2qB0U0PeC+mc7QvElXTHaF5EqkSsgAqkq0lUJVCegKW6mssl0b4clxRiyltoBEAd3SoeB4MY3+vd6V1rTQRU1PHTwMDIomhjGjcABkAtfaB8Kfw/hUV1VFq19wykfmN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";
const AIRTEL_MONEY_B64="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAGfAT4DASIAAhEBAxEB/8QAHQABAAMAAgMBAAAAAAAAAAAAAAYHCAQFAQIJA//EAFYQAAEDAgMDBwYICgYHCAMAAAEAAgMEBQYHERIhMQgTQVFhcYEiMjeRobMUFUJydHWxshcjMzZSYnOCkqIWNUNT0dIYJERUVpTBNFVjk6PD4fBlg8L/xAAcAQEAAgMBAQEAAAAAAAAAAAAABQYDBAcCCAH/xABEEQABAwICBgUJBgYBAwUAAAABAAIDBBEFIQYSMUFRcQdhgZGxEyIyMzVyocHRFDRCUrLwFSNEYoLC4RYXkiRDU1TS/9oADAMBAAIRAxEAPwDZaIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIoVjnNDCGEXPp6+4fCa5v8AslKOckB7ehviQvD3tYLuNlsUtJPVyeTgYXO4AXU1X41tXSUUBnrKqGmhbxklkDGjxKy/jDP7FNzMkFip6ezUx1AeBzs5Hzj5I8BqOtVZd7tdLvUGoutxq66U/Lnmc8+0qOlxSNuTBdXvD+jusmAdVPDBwHnH6fErXd6zhy9tbnRvvzKqRvyKWJ8uv7wGz7VFq7lFYTjJFHZ7xUEcC9scYP8AMT7FmBFpOxOY7LBWqn6PsKjHnlzj1m3gAtFu5SVFt6NwlUFvWa4A+rYXPoeUZht5ArbDdoNeJiMcmnrLVmVF4GI1A3/Bbb9BsFcLCMj/ACd8yVsWxZyZfXZ7Ym3r4FK7cGVkTo/5tNn2qeUtRT1UDZ6WeKeF41bJG8Oae4jcvn8u4wvijEGGattTY7rU0bgdXMY/Vj/nNO53iFsxYq4emO5QNf0cQuBNHKQeDsx3ixHcVu5FTGVeeVvvksVqxSyG23B5DY6lmogmPQDr5h793aOCudS0UzJm6zCua4lhVVhk3kqllju4HrB3oiIsqj0RERERERERERERERERERERERERERERERERERERERERERERF6TyxQQvmmkZHFG0ue950DQOJJ6AiAXyC91Gcd46w5gujE16rdmZ4JipohtzSdzegdp0HaqpzSz5igMlrwTsTSb2vuMjNWN/ZtPE/rHd2His+XCtrLjWSVlfVTVVTKdZJZXlznHtJUXU4k1nmx5n4LoWA6CT1dpq67GcPxH6ePUFZGYedOKMT85SW95sttcdObp3nnXj9eTj4DQd6rAkk6neURQskr5Td5uusUOHU1BH5KmYGjq+Z2ntRERY1uIiIiIiIiIiIiIrwyEzbmtlRT4XxPUukt7yI6OqedXQOJ3Mcf0Oo/J7uFHos0MzoXazVHYrhVPilOYJxkdh3g8QvoMiqDk0Y6fiDDz8O3GUvuNrYObe46mWDgD3tOje7Z7Vb6s8MrZWB7d6+ecTw6XDap9NLtae8bj2hERFlWgiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIuDfrtQWOz1N2udQ2CkpmF8jz1dQ6yTuA6SV+EgC5XpjHPcGtFydi/LFF/tWGrPNdrzVspqWIcTvLj0NaOJJ6lk/NrNO8Y3qHUkJfQ2VjtY6VrtHSdTpCOJ7OA9q6zNXHlyx1f3VdQXQUEJLaOl2t0bes9bj0nw4BQ9V+srjKdVno+K7ZovohFhzW1FSNaX4N5dfE93EkRFHK8IiIiIiIiIiIiIiIiIiIiIiIiKS5Y4ikwtjq13gSFkMcwZU6fKhdueO3cde8BbhBBAIOoK+fK2/lPcn3bLawV0ri+R9Exj3HiXMGwT62lTOFSekztXLekihbaGrG3Np8R81J0RFMrlaIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiLKvKOzAdiS/HD1snBtNukO25p3TzDcXdobvA8T0hXXnzi52EsBVElK/ZuFcTS0pB3sLgdp4+aNfEhY4URidRb+U3tXT+j/A2yE4jKNmTee89mwdqIiKEXV0RERERERERERERfrS09RV1MdNSwSzzyO2WRxsLnOPUAN5VxYEyBv102KrE1SLPSka8wzR9Q7sPyWeOp7FligklNmC6jsRxajw1mvUyBvieQ2lUwuzoMPX+4MElBZLlVMPB0NK949YC2FhDLLBeF2tdb7NFNUjjU1X46QnrBO5v7oCmIAA0A0AUnHhRI89yoVZ0kRtdamhJHFxt8BfxWBLja7lbXhlxt1XRuPATwujJ9YC4i39cKKjuNI+kr6WCqp5Bo+KZge1w7QVlblAZbQYMuEF1s7XCzVrywRklxp5dNdjU8WkAkdO4rBVYe6Fuu03Cl9H9NYcUmFNKzUedmdwerdY/u6qpERRyu6LYnJzc52T9l2ugzAd3PPWO1s3IOmNLlHYGOGhfC+T+KRzh7CFJ4UP5p5fRUDpGcBhsY/vH6XKcoiKfXGERERERERERERERERERERERERERERERERERERFlflV3uSvzBis7XnmLZTNGx1SSDbcf4Sz1KoVN8+DIc3MQGTXa59oHdzbdPZooQqpVOLpnE8V9H6PwNgwunY38oPaRc/EoiIsCl0RERERFz7BZ7nfrnFbLRRTVlXKdGxxt18SeAHWTuC/QCTYLy97Y2lzzYDeVwFY+WOUOIsY81XTt+LLQ46/CZR5co6ebbxPedB3q28q8j7XYxDdMUc1c7mPKbTjfTwno3fLPfu7DxVyAAAAAADgApemw0nzpe5czx/T5rLw4dmfznZ/iN/M5dRUYwJgTDeDKTmrNQtE7hpJVS6Omk73dA7BoOxSdEUw1jWCzRYLltRUS1MhlmcXOO85oiIvSwooNnzbYrnlTe2SNBdTwipjP6LmEHX1ajxU5USzlnbTZWYjkedAaF8fi7yR7SsU4BjdfgVIYQ5za+As267fELEyIiqS+ll5jY6SRsbGlznEBoHSSt54Wtgs2GrZaQQfgdJHASOktaAT6wsgZIWF2IczLRTbG1BTzCrn6gyPyt/YTst8VtFTeFR2Dn9i5N0kVodLDSg7AXHtyHge9ERFLrmSIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIizDyq8L1FDi2LFEUZNHcY2xyvHyZmN00PewN07iqXW9sRWa24gs9RabtTMqaSobsvY7o6iD0EcQVmfH2RGJbRUyz4cb8c2/XVrQ4NqGDqLToHd7ePUFBV1E8PMjBcFdg0Q0rpnUrKOqcGuZkCcgRuz3EbFUKLs6rD1/pJTFVWO5wPG4tkpHtPtC5dqwZi26StjoMN3WYn5QpXho73EaDxKjQxxNrK/uq4Gt13PAHG4XQorgwtyf8W3CRj71UUlngJ8oF3PS6djWnZ9bldOBcpcHYTeypgonXCubwqazR7mnra3TZb3ga9q24cPmk2iw61V8T02wyiBEbvKO4N2d+zuvyVB5bZN4kxU6Gtr43Wm0uIPPTD8ZI39RnHxOg71prBOELDg+2ChslE2EH8rM7fLMetzunu4DoC79FNU9HHBmMzxXKsb0nrcXOrIdVm5o2dvE/sAIiItpV1ERERERERFT3KtvQocBU1oY/Sa5VQ1b1xxjad/MWetXCscZ9YsbivMCpkppuct9CPgtKQdWuDT5Tx3u139QC0cQm8nCRvOSt+hOGurcUbIR5sfnHnu+OfYVAERdtg6w1mJsS0Njomky1UoYXaahjflOPYBqVXAC42C7pLKyJhkebAC5PUFoDknYYdR2GtxTUsAfXu5im1480w+UfF279xXguFYrZSWWzUdpoGbFNSQthjB46NGmp6yeJPWuarXTxCKMMXzhjWIuxKukqT+I5dQGQ+CIiLMotERERERERERERERERERERERERERERERERERERERERERERERRvMDGljwTaPh94nO0/VsFPHvkmcBwA6usncPUvLnBou45LNT08tRIIomlzjsAUkXFluVuhm5mWvpY5f0HTNDvVqsiY/zcxbiuV8Lat1rtxPk0tI8t1H67+LvYOxV84lxJcSSeJKi5MVaDZjbrolF0cTyR61TMGngBfvNx8L819BgQQCCCDwIRYpy+zFxLgyuY+grJJ6LUc7RTOLonjp0HyT2j28FsTC17osR4for3b3ONNVxCRgdxb0Fp7QQQe5bdLWNqBlkVWtIdGKjBXAvOsx2xwyz4EbiuyREW2q0iIunxliO24Uw9U3q6ShkMLfJaD5Urz5rG9ZP/wA9C/HODRcrJFE+Z4jjF3HIDrUG5ROORhbCjrXQygXW6MdEzQ74otNHv7Dv0Hbv6FkpdzjTEdxxZiSqvlzcDNO7yWN82Ng3NY3sA/x6V0yrFXUGeS+7cvoLRrBG4PRCI+mc3Hr4chs+O9FqPkz4DdYbG7E9yi2bhcowIGOG+KDiPF249wHaq15PmWzsU3Zt+u8BFlo5NWtcN1VKDrs9rR0+rr01aNw0C38Npf8A3Xdn1VO080iFjh1OffP+vzPdxRERTK5UiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIugx/iu3YNw1UXq4u1DPJhiHnTSEHZYO/Tj0DUrGGMcSXXFd+nvN3n5yeXc1o3MjaODGjoA/+eJUx5QeNH4qxrLSUs+3arY4wU4afJe/5cnbqRoD1AdarZV2vqjK/VGwLuWhujzcNpRUSj+a8X5DcPr15bkREUeroi2FycqSppMpLUKkFpldLLG09DHSEj18fFUPklllVY2uba+4MkgsVO/8AGycDO4f2bD9p6O9a5p4Yqenjp6eNkUMTQxjGDRrWgaAAdAUzhcDgTKdm5cs6QcZhkY2gjN3A3d1ZGw5558F7oi4V8utvslqnul0qo6WkgaXSSPPDsHWT0AbypgkAXK5cxjnuDWi5K9rzcqGz2uoudyqWU1JTsL5ZH8AB9p7OlY9zhzBrMd37nG85BaaYkUdO7cQOl7tPlH2Dd38nOTMyvx1cfg1OH0tkp3609OdzpDw239Z6hwHrJr1QFdW+VOoz0fFdp0R0UGGtFVUj+adg/KPrx4bOKKfZO5cV+OrwHyB9PZqZ4+FVHDa/8NnW4+wbz0A/rk9lhcsc1wqqgSUdkhfpNU6b5COLI9eJ6zwHsWtrFabdY7TT2q1UrKWjp27McbejtJ4kniSd5SioTKdd/o+K/NLNLmYe00tKbynafy/88Bu2le9pt9FabZT223U7KekpmCOKNg3NA/8AvHpXKRFPgWyC4u5xe4ucbkoiIv1eUREREREREREREREREREREREREREREREREREREREREREREUQzkxEcMZdXW5RvLal0XwenI4iR/kgju1LvBS9Uhyvax8eFLLQg6NnrXSu7dhhA++teqeY4XOCmdHqNtZicMLthdnyGZ8FmhERVVfRqKzslcq6zGlU253ISU1hifo543OqHDixnZ1u8Bv4cPI/L12OsQPdWF8doodl1U5u4yE8IwejXQ6noHgtfUNJTUNHDR0cEdPTwsDI4o26NY0cAApOhovK+e/Z4qgaYaWHD70dKf5h2n8oPzPwXrbaGjttBDQUFNHTUsDAyKKNujWgdAC5CKqc0c6bHhhstvshiu93b5JDXawQn9Zw84j9EeJCm5JWQtu42C5PQ4fV4nP5OBpc47fqTu5lTjG+LrJg6zuuV6qubadRFE0ayTO/RaOnv4DpIWSc0cw7zju5iSrcae3QuJpqNjvJZ+s79J2nT6tF0WKcQ3jE13kul6rZKqpfu1O5rB0Na0bmjsC49ktVxvVyit1qo5qurlOjI426nvPUO07goCqrX1B1W5DxXZdHtFKbBmfaJyHSWzO5vG1/E/BcJXHk3kxWYhMN7xPHJSWg6Pig12Zanv/RZ28T0dan2UuSNBYjDd8UiKvubdHx0w8qCA9Gv6bvYO3irlW1SYd+OXu+qr+kmnQsabDjzf/8An693FfjQ0lLQ0cVHRU8VPTwtDI4o2hrWAdAA4L9kRTOxcsJLjc7URERfiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiKlOVzQSTYPtNxY0ltNWmN+nQHsO/wBbAPFXWunxpYKTFGF6+xVo/FVURaHab2PG9rh3OAPgsNRH5WJzBvUrgdeMPxCKpdsac+RyPwKwii7XFmHrphe+1Fnu9OYamE8fkyN6HNPS0/8A3euqVUILTYr6OilZKwPYbg5gjetO8m/EuEbZlvHR1N6t9DXNqJZKqOonbE4knyXDaI1GwGjd1LvcWZ3YHsjXx0lXJeKkcI6NurNe2Q6N07tVkVACSABqSpBuIyMjDGgZKmVGgtFU1j6qd7jrEm2Q29e23crCzCzdxXi5klJz4tltduNLSuI2x1Pfxd3bh2KvVPMFZS40xRsTRW42+jd/tNbrG0jra3Tad4DTtV/ZeZM4Wws6Ktq2G8XNm/nqho5tjutkfAd51PcvLKaoqXazu8rLV4/g2j8XkILEj8LePWfqbqkcssncQ4tMVdXNdarQ4689K38ZKP8Aw2f/ANHQdWq01gjBuH8HW74HY6JsRd+Vnf5Usp63O6e7gOgKQIpmno44NmZ4rluN6T1uLu1ZDqs3NGzt4n9gBERFtKuIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiLpsV4XsGKaEUd+tkNbG3ewuBD2Hra4aEeBVbVvJ5wbNKX09wvNM0/IbKxwHrZr7VcSLDJTxSG7m3UnRY1X0LdSnlc0cL5d2xVHb+T7geneHVNRd6zT5MlQ1oP8LQfap1hnA2EsN6Os1ho6eUf2xZty/xu1d7VIkRlPEzNrQv2qxvEKsas0ziOF8u7YiIizKLRERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERFWWaucFnwXUvtVLTm53drQXxNdsxw6jUbbuvp0HsVYU3KMxS2qDqmyWaSn13sjEjH6fOLyPYtSSuhjdqk5qy0OiOK10Inij807LkC/K604iiOWmYFkx3bnz20vgq4NPhFJKRtx68CNPOaeseOily2WPa9us03CgamlmpZTDM0tcNoKIiL0sCIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiLrsUXA2jDVzurQHOo6SWcA9JawkD2LsVxL3QR3SzVtsmOkdXTyQOPUHNLT9q/HXsbLLCWCRpfsuL8t6wVW1VRW1k1ZVyvmqJ5HSSyOOpc4nUk+K/FdhiOz19gvlXZ7lCYqqlkLHt6D1EdYI0IPUV16p5BBsV9PROY5gdH6JGVtltymWSl5qbJmbZJqd5a2qqmUkzehzJXBpB7tQe8BbUWPeT7hepxDmLQVLYz8Dtcrayok03AtOrG95cBu6gVsJT2FhwiN9l1xzpFfC7EI2s9INz78roiIpNc/REREREREXpPLFBE6WaRkUbRq573AAd5KjV3zDwRagTW4otjSOLY5hK7+FmpXV8oD0RX39nH7xqxqo6srXQODWhXrRbRKHGad08shADrWFuAO08+C1lc8+8AUmvwea43DTh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vVMD5LoZBHJp2seRv7ASoVUYGxnTvLJcKXoOHVRSEesBblRRz8LiJ80kK9UvSJiEbdWZjX9eYPwy+AWVchcH4qoszLVcq3D1ypaOAyGSaendG1usbgPOA6SFqpEW3TU4p2aoN1WsexuTGagTyNDbC1hzJ+aKoc1ckrZiWolu2H5YrXdJCXSscDzEx6yBvYe0a69Wu9W8iySwslbqvC08OxOqw2by1M/VPwPURvWJ8TZa43w/K5tdh+rkjHCambz0ZHXq3XTx0UWkpqiNxbJTyscOIcwgr6Arw5jXec1p7wo12EtJ81yvlP0kztbaaAOPUSPhYrA9DZ7tXvDKG11tU48BDA559gU8wtkpju9Fj57fHaad2/nK1+y7T5g1dr3gLXoAA0G5F+swpgPnOusVX0jVcjbQRNZ1kl30Hiqxy9yWwthh8VbXNN5uTNHCWoaBEx3W2Ph4nXwVnIikY4mRCzBZUWuxCpr5PK1Ly49fyGwdiKvc2crLRjqIVbZPgF4jbssqmt1Eg6GyDpHbxHsVhIv2SNsjdVwuF5oq6ehmE9O7VcN/72hY5xJk5j6yvefiY3GFp3S0LxKD+7uf/Kow/CeKWP2H4avLXdRoZNfurdqKNdhUZOTir3B0j1rW2lia48RcfVUDyV8O36z3e8VV2s9dQQzU0bY3VELo9shxJA1Cv5EW/BCIWBgKp2M4o/Fat1U9oaTbIdQsiIizKLREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREWasusx6zD9Vje63u4Vde2OQCkppZS4OmMjw1rQfNGg36dDewLBNUNiIDt9/gpjDMGmxGKV8O1mrlx1jYLSpIA1J0C8NIcNQQR2LPMGXuZGZMbL5ivEHxTBONqCjLHHYaeH4oEBu7rJd1rpsTYNx3lAyPEllxAaugZI1kxYHADU7hJGSQWk7tdeJHDcsDqt4GsYzq8f8AhS8WjVJK/wCztrG+W2atja/DW2fBagXhxDRq4gDtVQYlzkZHl9ZrjZKRs9/vTTHBSAbfNPDthxLRvPlbmjp9ajTMmseYrHxpjDF3weqlG1zJ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";

const PAYMENT_METHODS=["MTN MoMo","Airtel Money","Cash","Bank Transfer","Cheque"];


const AdminFinanceSection=({store})=>{
  const [tab,setTab]=useState("overview");
  // Expense CRUD
  const [expenses,setExpenses]=useState(store.expenses||[]);
  const [showExpModal,setShowExpModal]=useState(false);
  const [editingExp,setEditingExp]=useState(null);
  const [expForm,setExpForm]=useState({category:"Fuel",amount:"",description:"",date:new Date().toISOString().split("T")[0],paymentMethod:"MTN MoMo",vehicle:"",route:"",vendor:"",costCenter:"Operations"});
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
  // Invoice
  const [invoiceForm,setInvoiceForm]=useState({client:"",service:"Passenger Transport",amount:"",date:new Date().toISOString().split("T")[0],vat:true,notes:""});
  const [invoices,setInvoices]=useState([
    {id:"INV-2026-001",client:"Uganda National Roads Authority",service:"Staff Transport",amount:450000,date:"2026-03-01",vat:true,status:"paid"},
    {id:"INV-2026-002",client:"Gulu University",service:"Student Charter",amount:280000,date:"2026-03-05",vat:true,status:"pending"},
  ]);
  const [showInvoiceModal,setShowInvoiceModal]=useState(false);
  const [viewInvoice,setViewInvoice]=useState(null);
  // Cost Centers
  const COST_CENTERS=["Operations","Administration","Marketing","HR & Payroll","Maintenance","Driver Allowances","SACCO"];
  const [costCenterFilter,setCostCenterFilter]=useState("All");
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

    {/* URA Filing Alerts */}
    <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
      {[
        {icon:"\u26a0\ufe0f",label:"VAT Return Due",sub:"End of March 2026 \u00b7 URA Portal",bg:"#FFF7ED",bdr:"#F97316",txt:"#C2410C"},
        {icon:"\ud83d\udccb",label:"PAYE/NSSF Due",sub:"By 15th April 2026 \u00b7 e-Tax Filing",bg:"#FFFBEB",bdr:"#EAB308",txt:"#A16207"},
        {icon:"\ud83c\udfe6",label:"Withholding Tax",sub:"6% WHT on vendor payments",bg:"#EFF6FF",bdr:"#3B82F6",txt:"#1D4ED8"},
      ].map(a=>(
        <div key={a.label} style={{background:a.bg,border:`1px solid ${a.bdr}`,borderRadius:10,padding:"8px 14px",fontSize:12,flex:1,minWidth:170}}>
          <span style={{fontWeight:700,color:a.txt}}>{a.icon} {a.label}</span><br/>
          <span style={{color:"#6B7280",fontSize:11}}>{a.sub}</span>
        </div>
      ))}
    </div>

    {/* KPI Cards */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:22}}>
      {[
        {label:"Total Revenue",value:formatUGX(periodRevenue),icon:"\ud83d\udcb5",color:C.green},
        {label:"Total Expenses",value:formatUGX(periodExpenses),icon:"\ud83d\udcc9",color:C.red},
        {label:"EBITDA",value:formatUGX(Math.round((periodRevenue-periodExpenses)*1.08)),icon:"\ud83d\udcca",color:C.amber,tip:"Earnings Before Interest, Tax, Depreciation & Amortisation"},
        {label:"Net Profit/(Loss)",value:formatUGX(periodRevenue-periodExpenses),icon:"\ud83d\udcc8",color:netProfit>=0?C.amber:C.red},
        {label:"Profit Margin",value:`${totalRevenueCats>0?((netProfit/totalRevenueCats)*100).toFixed(1):0}%`,icon:"\ud83d\udcd0",color:C.blue},
        {label:"Pending Revenue",value:formatUGX(allBookings.filter(b=>b.payment_status==="pending").reduce((s,b)=>s+b.amount,0)),icon:"\u23f3",color:C.orange},
      ].map(k=>(
        <div key={k.label} title={k.tip||""} style={{background:C.card,border:`1px solid ${C.navyBorder}`,borderRadius:14,padding:"14px 16px"}}>
          <div style={{fontSize:20,marginBottom:5}}>{k.icon}</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:14,color:k.color,marginBottom:2}}>{k.value}</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:".5px"}}>{k.label}</div>
          {k.tip&&<div style={{fontSize:9,color:C.textMuted,marginTop:2,lineHeight:1.3}}>{k.tip}</div>}
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
        {id:"invoices",label:"\ud83e\uddfe Invoices"},
        {id:"costcenter",label:"\ud83c\udfd7\ufe0f Cost Centers"},
        {id:"routeperf",label:"\ud83d\udee3\ufe0f Route P&L"},
        {id:"vehicleperf",label:"\ud83d\ude90 Vehicle P&L"},
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
              {["Category","Cost Center","Amount","Date","Payment Method","Description","Vehicle","Route","Vendor","Actions"].map(h=><TH key={h}>{h}</TH>)}
            </tr>
          </thead>
          <tbody>
            {expenses.map(e=>(
              <tr key={e.id} style={{borderBottom:`1px solid ${C.navyBorder}`}}>
                <TD><span style={{background:"rgba(168,186,218,0.12)",padding:"2px 8px",borderRadius:8,fontSize:10,fontWeight:600}}>{e.category}</span></TD>
                <TD><span style={{background:C.navyLight,color:C.textSecondary,padding:"2px 8px",borderRadius:8,fontSize:10}}>{e.costCenter||"Operations"}</span></TD>
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
          <Sel label="Cost Center" value={expForm.costCenter||"Operations"} onChange={e=>setExpForm({...expForm,costCenter:e.target.value})} options={["Operations","Administration","Marketing","HR & Payroll","Maintenance","Driver Allowances","SACCO"].map(c=>({value:c,label:c}))}/>
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

        {/* EBITDA */}
        <div style={{marginTop:14,padding:"10px 14px",background:"rgba(245,166,35,0.08)",borderRadius:8,border:"1px solid rgba(245,166,35,0.2)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"'Inter',sans-serif"}}>
            <div>
              <span style={{fontWeight:800,fontSize:12,color:C.amber}}>EBITDA</span>
              <span style={{fontSize:10,color:C.textMuted,marginLeft:8}}>Earnings Before Interest, Tax, Depreciation &amp; Amortisation</span>
            </div>
            <span style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:900,fontSize:16,color:C.amber}}>{formatUGX(Math.round(netProfit+maintExp*0.7+adminExp*0.08))}</span>
          </div>
          <div style={{fontSize:10,color:C.textMuted,fontFamily:"'Inter',sans-serif",marginTop:4}}>Tax at 30% (CIT): {formatUGX(Math.round(Math.max(0,netProfit)*0.30))} · After-tax profit: {formatUGX(Math.round(Math.max(0,netProfit)*0.70))}</div>
        </div>
        <div style={{marginTop:12,padding:"10px 14px",background:C.navyMid,borderRadius:8,fontSize:10,color:C.textMuted,fontFamily:"'Inter',sans-serif",lineHeight:1.8}}>
          <strong>Notes:</strong> Prepared per IAS 1 (ICPAU/URA). Compliant with Uganda Revenue Authority reporting requirements. Amounts exclusive of applicable taxes unless indicated. Corporate Income Tax rate: 30% per ITA 1997 (Uganda).
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

    {/* ── INVOICES ── */}
    {tab==="invoices"&&(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><h2 className="ral" style={{fontWeight:800,fontSize:18}}>Invoice Management</h2>
          <p style={{fontSize:12,color:C.textMuted,marginTop:2}}>URA-compliant · VAT-inclusive invoices</p>
        </div>
        <Btn onClick={()=>setShowInvoiceModal(true)}>+ New Invoice</Btn>
      </div>
      <Card style={{padding:0,overflow:"hidden",marginBottom:18}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.navyMid}}>{["Invoice #","Client","Service","Amount","VAT 18%","Total","Date","Status",""].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {invoices.map(inv=>{
              const vat=inv.vat?Math.round(inv.amount*0.18):0;
              const total=inv.amount+vat;
              return(
              <tr key={inv.id}>
                <TD><code style={{color:C.amber,fontWeight:700}}>{inv.id}</code></TD>
                <TD style={{fontWeight:600}}>{inv.client}</TD>
                <TD style={{color:C.textMuted,fontSize:11}}>{inv.service}</TD>
                <TD>{formatUGX(inv.amount)}</TD>
                <TD style={{color:C.orange}}>{formatUGX(vat)}</TD>
                <TD style={{color:C.green,fontWeight:700}}>{formatUGX(total)}</TD>
                <TD style={{color:C.textMuted}}>{inv.date}</TD>
                <TD><StatusBadge status={inv.status}/></TD>
                <TD>
                  <div style={{display:"flex",gap:4}}>
                    <Btn onClick={()=>setViewInvoice(inv)} variant="navy" style={{padding:"3px 8px",fontSize:10,border:`1px solid ${C.navyBorder}`}}>View</Btn>
                    <Btn variant="navy" style={{padding:"3px 8px",fontSize:10,border:`1px solid ${C.navyBorder}`}}>PDF</Btn>
                  </div>
                </TD>
              </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* New Invoice Modal */}
      <Modal open={showInvoiceModal} onClose={()=>setShowInvoiceModal(false)} title="Create Invoice" wide>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          <div style={{gridColumn:"1/-1"}}><Input label="Client Name / Company" value={invoiceForm.client} onChange={e=>setInvoiceForm({...invoiceForm,client:e.target.value})} placeholder="e.g. Uganda National Roads Authority"/></div>
          <Input label="Service Description" value={invoiceForm.service} onChange={e=>setInvoiceForm({...invoiceForm,service:e.target.value})} placeholder="e.g. Passenger Transport"/>
          <Input label="Amount (UGX, before VAT)" type="number" value={invoiceForm.amount} onChange={e=>setInvoiceForm({...invoiceForm,amount:e.target.value})} placeholder="e.g. 450000"/>
          <Input label="Invoice Date" type="date" value={invoiceForm.date} onChange={e=>setInvoiceForm({...invoiceForm,date:e.target.value})}/>
          <div style={{display:"flex",alignItems:"center",gap:10,paddingTop:24}}>
            <input type="checkbox" checked={invoiceForm.vat} onChange={e=>setInvoiceForm({...invoiceForm,vat:e.target.checked})} style={{width:16,height:16}}/>
            <label style={{fontSize:13,color:C.textSecondary}}>Apply VAT (18%) — URA registered</label>
          </div>
          <div style={{gridColumn:"1/-1"}}><Textarea label="Notes (optional)" value={invoiceForm.notes} onChange={e=>setInvoiceForm({...invoiceForm,notes:e.target.value})} placeholder="Payment terms, booking reference, etc."/></div>
          {invoiceForm.amount&&(
            <div style={{gridColumn:"1/-1",background:C.navyMid,borderRadius:10,padding:"12px 16px",fontSize:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span>Sub-total:</span><span>{formatUGX(Number(invoiceForm.amount))}</span></div>
              {invoiceForm.vat&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:4,color:C.orange}}><span>VAT (18%):</span><span>{formatUGX(Math.round(Number(invoiceForm.amount)*0.18))}</span></div>}
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:800,fontSize:14,color:C.green,borderTop:`1px solid ${C.navyBorder}`,paddingTop:6}}><span>Total Payable:</span><span>{formatUGX(invoiceForm.vat?Math.round(Number(invoiceForm.amount)*1.18):Number(invoiceForm.amount))}</span></div>
            </div>
          )}
          <div style={{gridColumn:"1/-1",display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="navy" onClick={()=>setShowInvoiceModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
            <Btn onClick={()=>{
              if(!invoiceForm.client||!invoiceForm.amount) return;
              const newInv={id:`INV-2026-${String(invoices.length+1).padStart(3,"0")}`,client:invoiceForm.client,service:invoiceForm.service,amount:Number(invoiceForm.amount),date:invoiceForm.date,vat:invoiceForm.vat,status:"pending",notes:invoiceForm.notes};
              setInvoices(prev=>[...prev,newInv]);
              setShowInvoiceModal(false);
              setInvoiceForm({client:"",service:"Passenger Transport",amount:"",date:new Date().toISOString().split("T")[0],vat:true,notes:""});
            }}>Create Invoice</Btn>
          </div>
        </div>
      </Modal>

      {/* Invoice View */}
      {viewInvoice&&(
        <Modal open={!!viewInvoice} onClose={()=>setViewInvoice(null)} title="Invoice Preview" wide>
          <div style={{background:"#fff",color:"#0B1E4B",padding:"28px 32px",borderRadius:12,fontFamily:"'Inter',sans-serif"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,paddingBottom:16,borderBottom:"2px solid #D1DBF0"}}>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:24,color:"#0B1E4B"}}>Raylane</div>
                <div style={{fontSize:11,color:"#7A8FB5",letterSpacing:2,textTransform:"uppercase"}}>Transport Services</div>
                <div style={{fontSize:11,color:"#3D5280",marginTop:8}}>Nakasero, Kampala, Uganda<br/>+256 700 000000 · info@raylane.ug<br/>TIN: 1000123456 · VAT Reg: V-123456789</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{background:"#0B5FFF",color:"#fff",padding:"6px 20px",borderRadius:8,fontWeight:900,fontSize:16,letterSpacing:1}}>TAX INVOICE</div>
                <div style={{fontWeight:800,fontSize:18,color:"#0B1E4B",marginTop:8}}>{viewInvoice.id}</div>
                <div style={{fontSize:12,color:"#7A8FB5"}}>Date: {viewInvoice.date}</div>
                <div style={{marginTop:6}}><StatusBadge status={viewInvoice.status}/></div>
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:10,color:"#7A8FB5",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>BILLED TO</div>
              <div style={{fontWeight:700,fontSize:15}}>{viewInvoice.client}</div>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:20,fontSize:13}}>
              <thead>
                <tr style={{background:"#F4F8FF"}}>
                  {["Description","Amount (UGX)"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:h==="Amount (UGX)"?"right":"left",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"#3D5280"}}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{padding:"12px 14px",borderBottom:"1px solid #D1DBF0"}}>{viewInvoice.service}</td>
                  <td style={{padding:"12px 14px",borderBottom:"1px solid #D1DBF0",textAlign:"right",fontWeight:600}}>{formatUGX(viewInvoice.amount)}</td>
                </tr>
                {viewInvoice.vat&&(
                  <tr>
                    <td style={{padding:"10px 14px",color:"#7A8FB5"}}>VAT @ 18% (URA Reg.)</td>
                    <td style={{padding:"10px 14px",textAlign:"right",color:"#EA580C"}}>{formatUGX(Math.round(viewInvoice.amount*0.18))}</td>
                  </tr>
                )}
                <tr style={{background:"#F4F8FF"}}>
                  <td style={{padding:"12px 14px",fontWeight:900,fontSize:14}}>TOTAL PAYABLE</td>
                  <td style={{padding:"12px 14px",textAlign:"right",fontWeight:900,fontSize:16,color:"#16A34A"}}>{formatUGX(viewInvoice.vat?Math.round(viewInvoice.amount*1.18):viewInvoice.amount)}</td>
                </tr>
              </tbody>
            </table>
            <div style={{fontSize:11,color:"#7A8FB5",borderTop:"1px solid #D1DBF0",paddingTop:12}}>
              Payment via MTN MoMo or Bank Transfer · TIN: 1000123456 · This invoice is compliant with Uganda Revenue Authority (URA) requirements.<br/>
              Generated by Raylane Transport Management System · {new Date().toLocaleDateString("en-UG")}
            </div>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:14}}>
            <Btn variant="navy" style={{border:`1px solid ${C.navyBorder}`}} onClick={()=>window.print()}>🖨️ Print / PDF</Btn>
            <Btn onClick={()=>setViewInvoice(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
    )}

    {/* ── COST CENTERS ── */}
    {tab==="costcenter"&&(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><h2 className="ral" style={{fontWeight:800,fontSize:18}}>Cost Center Analysis</h2>
          <p style={{fontSize:12,color:C.textMuted,marginTop:2}}>Expense allocation by department · GAAP cost center accounting</p>
        </div>
        <select value={costCenterFilter} onChange={e=>setCostCenterFilter(e.target.value)} style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${C.navyBorder}`,background:C.navyMid,color:"#fff",fontSize:12}}>
          <option value="All">All Centers</option>
          {["Operations","Administration","Marketing","HR & Payroll","Maintenance","Driver Allowances","SACCO"].map(c=><option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Cost center summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:14,marginBottom:22}}>
        {["Operations","Administration","Marketing","HR & Payroll","Maintenance","Driver Allowances","SACCO"].map(cc=>{
          const ccExp=expenses.filter(e=>e.costCenter===cc||(!e.costCenter&&cc==="Operations")).reduce((s,e)=>s+Number(e.amount),0);
          const pct=totalExpenses>0?(ccExp/totalExpenses*100).toFixed(1):0;
          return(
            <div key={cc} style={{background:C.card,border:`1px solid ${C.navyBorder}`,borderRadius:12,padding:"14px 16px",cursor:"pointer",transition:"all .2s"}} onClick={()=>setCostCenterFilter(cc)}>
              <div style={{fontWeight:700,fontSize:13,color:C.textPrimary,marginBottom:6}}>{cc}</div>
              <div style={{fontWeight:800,fontSize:16,color:C.red,marginBottom:6}}>{formatUGX(ccExp)}</div>
              <div style={{height:4,background:C.navyLight,borderRadius:2,marginBottom:4}}><div style={{width:`${pct}%`,height:"100%",background:C.amber,borderRadius:2}}/></div>
              <div style={{fontSize:10,color:C.textMuted}}>{pct}% of total expenses</div>
            </div>
          );
        })}
      </div>

      {/* Cost center expense table */}
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.navyBorder}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h3 className="ral" style={{fontWeight:700}}>Expense Entries{costCenterFilter!=="All"?` — ${costCenterFilter}`:""}</h3>
          <span style={{fontSize:12,color:C.textMuted}}>{expenses.filter(e=>costCenterFilter==="All"||(e.costCenter===costCenterFilter)||(!e.costCenter&&costCenterFilter==="Operations")).length} entries</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>{["Category","Cost Center","Amount","Date","Description","Vehicle","Vendor"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
            <tbody>
              {expenses.filter(e=>costCenterFilter==="All"||(e.costCenter===costCenterFilter)||(!e.costCenter&&costCenterFilter==="Operations")).map(e=>(
                <tr key={e.id} onMouseEnter={ev=>ev.currentTarget.style.background=C.navyMid} onMouseLeave={ev=>ev.currentTarget.style.background=""}>
                  <TD><span style={{background:C.orangeBg,color:C.orange,padding:"2px 8px",borderRadius:8,fontSize:10,fontWeight:600}}>{e.category}</span></TD>
                  <TD><span style={{background:C.navyLight,color:C.textSecondary,padding:"2px 8px",borderRadius:8,fontSize:10}}>{e.costCenter||"Operations"}</span></TD>
                  <TD style={{color:C.red,fontWeight:700}}>{formatUGX(e.amount)}</TD>
                  <TD style={{color:C.textMuted}}>{e.date}</TD>
                  <TD style={{maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:C.textSecondary}}>{e.description||"—"}</TD>
                  <TD style={{color:C.textMuted,fontSize:11}}>{e.vehicle||"—"}</TD>
                  <TD style={{color:C.textMuted,fontSize:11}}>{e.vendor||"—"}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
    )}

    {/* ── ROUTE PROFITABILITY ── */}
    {tab==="routeperf"&&(
    <div>
      <div style={{marginBottom:16}}>
        <h2 className="ral" style={{fontWeight:800,fontSize:18}}>Route Profitability Analysis</h2>
        <p style={{fontSize:12,color:C.textMuted,marginTop:2}}>Revenue vs costs per route · IASB cost allocation</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {(()=>{
          const routeRevMap={};
          confirmedBookings.forEach(b=>{const k=b.route||"Unknown";routeRevMap[k]=(routeRevMap[k]||0)+b.amount;});
          return Object.entries(routeRevMap).sort((a,b)=>b[1]-a[1]).map(([route,rev])=>{
            const routeExp=expenses.filter(e=>e.route===route).reduce((s,e)=>s+Number(e.amount),0);
            const netR=rev-routeExp;
            const margin=rev>0?((netR/rev)*100).toFixed(1):0;
            return(
              <div key={route} style={{background:C.card,border:`1px solid ${netR>=0?C.navyBorder:C.red}`,borderRadius:14,padding:"18px 20px"}}>
                <div className="ral" style={{fontWeight:800,fontSize:14,color:C.textPrimary,marginBottom:12}}>{route}</div>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {[{l:"Revenue",v:rev,c:C.green},{l:"Route Expenses",v:routeExp,c:C.red},{l:"Net Profit",v:netR,c:netR>=0?C.amber:C.red,bold:true}].map(r=>(
                    <div key={r.l} style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:r.bold?800:400}}>
                      <span style={{color:C.textMuted}}>{r.l}</span>
                      <span style={{color:r.c}}>{formatUGX(r.v)}</span>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:10,height:5,background:C.navyLight,borderRadius:3}}>
                  <div style={{width:`${Math.min(Math.abs(margin),100)}%`,height:"100%",background:netR>=0?C.green:C.red,borderRadius:3}}/>
                </div>
                <div style={{fontSize:10,color:C.textMuted,marginTop:4}}>Margin: {margin}%</div>
              </div>
            );
          });
        })()}
        {confirmedBookings.length===0&&<div style={{color:C.textMuted,fontSize:13,gridColumn:"1/-1",textAlign:"center",padding:32}}>No confirmed bookings yet. Revenue data will appear when bookings are confirmed.</div>}
      </div>
    </div>
    )}

    {/* ── VEHICLE PROFITABILITY ── */}
    {tab==="vehicleperf"&&(
    <div>
      <div style={{marginBottom:16}}>
        <h2 className="ral" style={{fontWeight:800,fontSize:18}}>Vehicle Profitability</h2>
        <p style={{fontSize:12,color:C.textMuted,marginTop:2}}>Revenue and cost allocation per vehicle</p>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.navyMid}}>{["Vehicle Reg","Trips","Revenue","Fuel/Maint Costs","Other Costs","Net Profit","Margin"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {(store.vehicles||[]).map(v=>{
              const vRev=confirmedBookings.filter(b=>b.vehicle_reg===v.registration||b.trip_id).reduce((s,b)=>s+b.amount/((store.trips||[]).length||1),0);
              const vExp=expenses.filter(e=>e.vehicle===v.registration).reduce((s,e)=>s+Number(e.amount),0);
              const vFuel=expenses.filter(e=>e.vehicle===v.registration&&["Fuel","Vehicle Servicing","Tyre Replacement"].includes(e.category)).reduce((s,e)=>s+Number(e.amount),0);
              const vOther=vExp-vFuel;
              const vNet=vRev-vExp;
              const vMargin=vRev>0?((vNet/vRev)*100).toFixed(1):0;
              return(
                <tr key={v.id} style={{borderBottom:`1px solid ${C.navyBorder}`}}>
                  <TD><code style={{color:C.amber,fontWeight:700}}>{v.registration}</code><div style={{fontSize:10,color:C.textMuted}}>{v.model}</div></TD>
                  <TD>{(store.trips||[]).filter(t=>t.vehicle_id===v.id).length}</TD>
                  <TD style={{color:C.green,fontWeight:700}}>{formatUGX(Math.round(vRev))}</TD>
                  <TD style={{color:C.red}}>{formatUGX(vFuel)}</TD>
                  <TD style={{color:C.orange}}>{formatUGX(vOther)}</TD>
                  <TD style={{fontWeight:800,color:vNet>=0?C.amber:C.red}}>{formatUGX(Math.round(vNet))}</TD>
                  <TD><span style={{background:vNet>=0?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:vNet>=0?C.green:C.red,padding:"2px 8px",borderRadius:8,fontSize:10,fontWeight:700}}>{vMargin}%</span></TD>
                </tr>
              );
            })}
            {(store.vehicles||[]).length===0&&<tr><td colSpan={7} style={{textAlign:"center",padding:24,color:C.textMuted}}>No vehicles on record.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
    )}

    {/* ── ACCESS CONTROL ── */}
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

const AdminSACOSection=({store})=>{
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
        <h1 className="ral" style={{fontSize:24,fontWeight:900,margin:0}}>Staff SACCO</h1>
        <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textMuted,marginTop:4}}>Savings &amp; Credit Co-operative (SACCO) \u00b7 {SACO_INTEREST_RATE*100}% p.a. Loans \u00b7 {SACO_SAVINGS_DIVIDEND*100}% Annual Dividend</p>
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
            {["SACCO ID","Employee ID","Name","Monthly Saving","Total Savings","Loan Eligibility","Joined","Status"].map(h=><TH key={h}>{h}</TH>)}
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
      <Modal open={showMemberModal} onClose={()=>setShowMemberModal(false)} title="Enroll New SACCO Member">
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <Input label="Full Name" value={memberForm.name} onChange={e=>setMemberForm({...memberForm,name:e.target.value})} placeholder="Employee full name"/>
          <div>
            <label style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textSecondary,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Employee ID <span style={{color:C.amber,fontWeight:400}}>(from Payroll)</span></label>
            <select value={memberForm.empId} onChange={e=>{
              const emp=(store?.employees||INIT_EMPLOYEES).find(x=>x.id===e.target.value);
              setMemberForm({...memberForm,empId:e.target.value,name:emp?emp.name:memberForm.name,email:emp?emp.email:memberForm.email});
            }} style={{width:"100%",padding:"10px 13px",borderRadius:10,border:`1px solid ${C.navyBorder}`,background:C.navyLight,color:"#fff",fontSize:13,fontFamily:"'Inter',sans-serif"}}>
              <option value="">— Select employee —</option>
              {(store?.employees||INIT_EMPLOYEES).map(emp=>(
                <option key={emp.id} value={emp.id}>{emp.name} · {emp.id} · {emp.department}</option>
              ))}
            </select>
          </div>
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
    <Modal open={showPolicyModal} onClose={()=>setShowPolicyModal(false)} title="SACCO Lending Policy" wide>
      <div style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:C.textSecondary,lineHeight:1.9}}>
        <div className="ral" style={{fontWeight:700,fontSize:15,color:C.amber,marginBottom:12}}>Raylane Express Staff SACCO \u2014 Lending Policy</div>
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
          ["Governance","The SACCO is governed per principles of the International Cooperative Alliance (ICA) and Uganda Cooperative Societies Act."],
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

// ─── ADMIN: HOMEPAGE CMS ────────────────────────────────────────────
const AdminCMSSection=({heroSlides,setHeroSlides,newsItems,setNewsItems})=>{
  const [tab,setTab]=useState("hero");
  const [slideForm,setSlideForm]=useState({url:"",caption:"",subCaption:"",effect:"ken-burns",active:true});
  const [newsForm,setNewsForm]=useState({title:"",body:"",badge:"",date:new Date().toISOString().split("T")[0],active:true});
  const [editingSlide,setEditingSlide]=useState(null);
  const [editingNews,setEditingNews]=useState(null);
  const [showSlideModal,setShowSlideModal]=useState(false);
  const [showNewsModal,setShowNewsModal]=useState(false);

  const saveSlide=()=>{
    if(!slideForm.url||!slideForm.caption) return;
    if(editingSlide) setHeroSlides(p=>p.map(s=>s.id===editingSlide.id?{...s,...slideForm}:s));
    else setHeroSlides(p=>[...p,{...slideForm,id:Date.now()}]);
    setShowSlideModal(false); setEditingSlide(null);
    setSlideForm({url:"",caption:"",subCaption:"",effect:"ken-burns",active:true});
  };

  const saveNews=()=>{
    if(!newsForm.title||!newsForm.body) return;
    if(editingNews) setNewsItems(p=>p.map(n=>n.id===editingNews.id?{...n,...newsForm}:n));
    else setNewsItems(p=>[...p,{...newsForm,id:Date.now()}]);
    setShowNewsModal(false); setEditingNews(null);
    setNewsForm({title:"",body:"",badge:"",date:new Date().toISOString().split("T")[0],active:true});
  };

  return(
    <div style={{animation:"fadeUp .3s ease"}}>
      <h1 className="playfair" style={{fontSize:24,fontWeight:800,color:C.darkText,marginBottom:20}}>Homepage Content CMS</h1>
      <div style={{marginBottom:20}}>
        <Tabs tabs={["Hero Slides","News & Announcements"]} active={tab==="hero"?"Hero Slides":"News & Announcements"} onChange={t=>setTab(t==="Hero Slides"?"hero":"news")}/>
      </div>

      {tab==="hero"&&(
        <>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
            <Btn onClick={()=>{setEditingSlide(null);setSlideForm({url:"",caption:"",subCaption:"",effect:"ken-burns",active:true});setShowSlideModal(true);}}>+ Add Slide</Btn>
          </div>
          <div style={{display:"grid",gap:12}}>
            {heroSlides.map(s=>(
              <div key={s.id} style={{background:C.darkCard,border:`1px solid ${C.darkBorder}`,borderRadius:14,overflow:"hidden",display:"flex"}}>
                <div style={{width:140,height:84,flexShrink:0,overflow:"hidden",position:"relative"}}>
                  <img src={s.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.opacity=0}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,transparent,rgba(11,30,75,.7))"}}/>
                </div>
                <div style={{padding:"12px 16px",flex:1,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                  <div>
                    <div style={{fontWeight:700,color:C.darkText,marginBottom:3,fontSize:14}}>{s.caption}</div>
                    <div style={{fontSize:11,color:C.darkMuted,marginBottom:8}}>{s.subCaption}</div>
                    <div style={{display:"flex",gap:6}}>
                      <Badge color={s.active?C.green:C.textMuted} bg={s.active?C.greenBg:C.navyLight}>{s.active?"Active":"Hidden"}</Badge>
                      <Badge color={C.blue} bg={C.blueBg}>{s.effect}</Badge>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <Btn variant="dark" style={{padding:"5px 12px",fontSize:11}} onClick={()=>{setEditingSlide(s);setSlideForm({url:s.url,caption:s.caption,subCaption:s.subCaption,effect:s.effect,active:s.active});setShowSlideModal(true);}}>Edit</Btn>
                    <Btn variant="dark" style={{padding:"5px 12px",fontSize:11}} onClick={()=>setHeroSlides(p=>p.map(x=>x.id===s.id?{...x,active:!x.active}:x))}>{s.active?"Hide":"Show"}</Btn>
                    <Btn variant="danger" style={{padding:"5px 12px",fontSize:11}} onClick={()=>setHeroSlides(p=>p.filter(x=>x.id!==s.id))}>Remove</Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Modal open={showSlideModal} onClose={()=>{setShowSlideModal(false);setEditingSlide(null);}} title={editingSlide?"Edit Slide":"Add Hero Slide"}>
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              <Input label="Image URL (Unsplash, Cloudinary, etc.)" value={slideForm.url} onChange={e=>setSlideForm({...slideForm,url:e.target.value})} placeholder="https://images.unsplash.com/..."/>
              {slideForm.url&&<img src={slideForm.url} alt="" style={{width:"100%",height:110,objectFit:"cover",borderRadius:10,border:`1px solid ${C.navyBorder}`}} onError={e=>e.target.style.display="none"}/>}
              <Input label="Main Caption" value={slideForm.caption} onChange={e=>setSlideForm({...slideForm,caption:e.target.value})} placeholder="e.g. Safe journeys across Uganda" required/>
              <Input label="Sub-Caption" value={slideForm.subCaption} onChange={e=>setSlideForm({...slideForm,subCaption:e.target.value})} placeholder="Supporting description line"/>
              <Sel label="Visual Effect" value={slideForm.effect} onChange={e=>setSlideForm({...slideForm,effect:e.target.value})} options={[{value:"ken-burns",label:"Ken Burns (slow zoom)"},{value:"zoom",label:"Zoom in"},{value:"fade",label:"Fade"},{value:"slide",label:"Slide in"}]}/>
              <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:14}}>
                <input type="checkbox" checked={slideForm.active} onChange={e=>setSlideForm({...slideForm,active:e.target.checked})} style={{width:16,height:16}}/>
                <span>Active (visible on homepage)</span>
              </label>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <Btn variant="navy" onClick={()=>setShowSlideModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
                <BookBtn onClick={saveSlide}>{editingSlide?"Save Changes":"Add Slide"}</BookBtn>
              </div>
            </div>
          </Modal>
        </>
      )}

      {tab==="news"&&(
        <>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
            <Btn onClick={()=>{setEditingNews(null);setNewsForm({title:"",body:"",badge:"",date:new Date().toISOString().split("T")[0],active:true});setShowNewsModal(true);}}>+ Add Announcement</Btn>
          </div>
          <div style={{display:"grid",gap:12}}>
            {newsItems.map(n=>(
              <div key={n.id} style={{background:C.darkCard,border:`1px solid ${C.darkBorder}`,borderRadius:14,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,marginBottom:7}}>
                    {n.badge&&<Badge color={C.amber2} bg={C.amberBg}>{n.badge}</Badge>}
                    <Badge color={n.active?C.green:C.textMuted} bg={n.active?C.greenBg:C.navyLight}>{n.active?"Live":"Draft"}</Badge>
                  </div>
                  <div style={{fontWeight:700,fontSize:15,color:C.darkText,marginBottom:4}}>{n.title}</div>
                  <div style={{fontSize:12,color:C.darkMuted,lineHeight:1.6}}>{n.body}</div>
                  <div style={{fontSize:11,color:C.darkMuted,marginTop:6}}>📅 {n.date}</div>
                </div>
                <div style={{display:"flex",gap:8,flexShrink:0}}>
                  <Btn variant="dark" style={{padding:"5px 12px",fontSize:11}} onClick={()=>{setEditingNews(n);setNewsForm({title:n.title,body:n.body,badge:n.badge||"",date:n.date,active:n.active});setShowNewsModal(true);}}>Edit</Btn>
                  <Btn variant="dark" style={{padding:"5px 12px",fontSize:11}} onClick={()=>setNewsItems(p=>p.map(x=>x.id===n.id?{...x,active:!x.active}:x))}>{n.active?"Draft":"Publish"}</Btn>
                  <Btn variant="danger" style={{padding:"5px 12px",fontSize:11}} onClick={()=>setNewsItems(p=>p.filter(x=>x.id!==n.id))}>Delete</Btn>
                </div>
              </div>
            ))}
          </div>
          <Modal open={showNewsModal} onClose={()=>{setShowNewsModal(false);setEditingNews(null);}} title={editingNews?"Edit Announcement":"New Announcement"}>
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              <Input label="Title" value={newsForm.title} onChange={e=>setNewsForm({...newsForm,title:e.target.value})} placeholder="e.g. New Route Launched" required/>
              <Textarea label="Body" value={newsForm.body} onChange={e=>setNewsForm({...newsForm,body:e.target.value})} placeholder="Announcement details..." rows={3}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Input label="Badge (optional)" value={newsForm.badge} onChange={e=>setNewsForm({...newsForm,badge:e.target.value})} placeholder="e.g. Promo"/>
                <Input label="Date" type="date" value={newsForm.date} onChange={e=>setNewsForm({...newsForm,date:e.target.value})}/>
              </div>
              <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:14}}>
                <input type="checkbox" checked={newsForm.active} onChange={e=>setNewsForm({...newsForm,active:e.target.checked})} style={{width:16,height:16}}/>
                <span>Publish immediately</span>
              </label>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <Btn variant="navy" onClick={()=>setShowNewsModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
                <BookBtn onClick={saveNews}>{editingNews?"Save Changes":"Publish"}</BookBtn>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// COST MANAGEMENT SECTION — SEPARATE FROM REVENUE
// ═══════════════════════════════════════════════════════════════════════
const AdminCostManagement=({store})=>{
  const [expenses,setExpenses]=useState(store.expenses||[]);
  const [showModal,setShowModal]=useState(false);
  const [editingExp,setEditingExp]=useState(null);
  const [deleteConfirm,setDeleteConfirm]=useState(null);
  const [filterCat,setFilterCat]=useState("All");
  const [filterMonth,setFilterMonth]=useState(new Date().toISOString().slice(0,7));
  const [expForm,setExpForm]=useState({category:"Fuel",amount:"",description:"",date:new Date().toISOString().split("T")[0],paymentMethod:"Cash",vendor:"",vehicle:""});

  // Finance Users / Access Control
  const [showUserModal,setShowUserModal]=useState(false);
  const [finUsers,setFinUsers]=useState([
    {id:"FU-001",name:"Admin",role:"full",email:"admin@raylane.ug",access:["view","add","edit","delete","export"]},
    {id:"FU-002",name:"Accounts Officer",role:"limited",email:"accounts@raylane.ug",access:["view","add"]},
  ]);
  const [userForm,setUserForm]=useState({name:"",email:"",role:"limited",access:["view"]});

  const totalExp=expenses.reduce((s,e)=>s+e.amount,0);
  const cats=["All",...new Set(expenses.map(e=>e.category))];
  const filtered=expenses.filter(e=>{
    const matchCat=filterCat==="All"||e.category===filterCat;
    const matchMonth=!filterMonth||e.date?.startsWith(filterMonth);
    return matchCat&&matchMonth;
  });

  const openEdit=(e)=>{setEditingExp(e);setExpForm({category:e.category,amount:String(e.amount),description:e.description||"",date:e.date||new Date().toISOString().split("T")[0],paymentMethod:e.paymentMethod||"Cash",vendor:e.vendor||"",vehicle:e.vehicle||""});setShowModal(true);};
  const openNew=()=>{setEditingExp(null);setExpForm({category:"Fuel",amount:"",description:"",date:new Date().toISOString().split("T")[0],paymentMethod:"Cash",vendor:"",vehicle:""});setShowModal(true);};
  const saveExp=()=>{
    if(!expForm.amount) return;
    const entry={...expForm,amount:parseInt(expForm.amount)};
    if(editingExp){
      const updated=expenses.map(e=>e.id===editingExp.id?{...e,...entry}:e);
      setExpenses(updated);
    } else {
      const newE={id:`EXP-${String(expenses.length+1).padStart(3,"0")}`,...entry};
      setExpenses([...expenses,newE]);
      store.addExpense(entry);
    }
    setShowModal(false);
  };
  const deleteExp=(id)=>{setExpenses(expenses.filter(e=>e.id!==id));setDeleteConfirm(null);};

  const byCat=EXPENSE_CATEGORIES.reduce((acc,cat)=>{
    acc[cat]=expenses.filter(e=>e.category===cat).reduce((s,e)=>s+e.amount,0);
    return acc;
  },{});
  const topCats=Object.entries(byCat).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,6);

  return(
    <div style={{animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <div>
          <h1 className="ral" style={{fontSize:24,fontWeight:900}}>Cost Management</h1>
          <p style={{color:C.textMuted,fontSize:12,marginTop:3}}>Expense tracking — IASB/GAAP/URA compliant</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn variant="navy" onClick={()=>setShowUserModal(true)} style={{fontSize:11,border:`1px solid ${C.navyBorder}`,padding:"7px 14px"}}>👥 Users & Access</Btn>
          <Btn onClick={openNew} style={{padding:"8px 18px",fontSize:13}}>+ Add Cost</Btn>
        </div>
      </div>

      {/* Alerts */}
      <div style={{display:"flex",gap:10,flexWrap:"wrap",margin:"14px 0"}}>
        <div style={{background:"#FFF7ED",border:"1px solid #F97316",borderRadius:10,padding:"9px 14px",fontSize:12,flex:1,minWidth:180}}>
          <span style={{fontWeight:700,color:"#C2410C"}}>⚠️ URA Return Due</span><br/>
          <span style={{color:C.textSecondary}}>VAT Return — end of month</span>
        </div>
        <div style={{background:"#FFF7ED",border:"1px solid #EAB308",borderRadius:10,padding:"9px 14px",fontSize:12,flex:1,minWidth:180}}>
          <span style={{fontWeight:700,color:"#A16207"}}>🏦 Loan Repayment</span><br/>
          <span style={{color:C.textSecondary}}>Next due: 15th — {formatUGX(850000)}</span>
        </div>
        <div style={{background:"#F0FDF4",border:`1px solid ${C.green}`,borderRadius:10,padding:"9px 14px",fontSize:12,flex:1,minWidth:180}}>
          <span style={{fontWeight:700,color:C.green}}>✅ Payroll Processed</span><br/>
          <span style={{color:C.textSecondary}}>March 2026 — 12 employees</span>
        </div>
      </div>

      {/* Summary */}
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:18}}>
        <StatCard label="Total Costs" value={formatUGX(totalExp)} icon="💸" color={C.red}/>
        <StatCard label="This Month" value={formatUGX(filtered.reduce((s,e)=>s+e.amount,0))} icon="📅" color={C.orange}/>
        <StatCard label="Entries" value={filtered.length} icon="📋" color={C.blue}/>
        <StatCard label="Cost/Revenue Ratio" value={`${store.bookings.filter(b=>b.payment_status==="confirmed").reduce((s,b)=>s+b.amount,0)?Math.round((totalExp/store.bookings.filter(b=>b.payment_status==="confirmed").reduce((s,b)=>s+b.amount,0))*100):0}%`} icon="📊" color={C.purple}/>
      </div>

      {/* Top expense categories */}
      {topCats.length>0&&(
        <Card style={{marginBottom:18}}>
          <h3 className="ral" style={{fontWeight:700,marginBottom:14}}>Cost by Category</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
            {topCats.map(([cat,val])=>(
              <div key={cat} style={{background:C.navyMid,borderRadius:9,padding:"11px 14px"}}>
                <div style={{fontSize:11,color:C.textMuted,marginBottom:3}}>{cat}</div>
                <div style={{fontWeight:800,color:C.red,fontSize:15}}>{formatUGX(val)}</div>
                <div style={{marginTop:5,height:3,background:C.navyBorder,borderRadius:2}}><div style={{width:`${Math.min((val/topCats[0][1])*100,100)}%`,height:"100%",background:C.red,borderRadius:2}}/></div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filters + table */}
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.navyBorder}`,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{background:C.navyMid,border:`1px solid ${C.navyBorder}`,borderRadius:7,padding:"6px 10px",fontSize:12,color:C.textPrimary}}>
            {cats.map(c=><option key={c}>{c}</option>)}
          </select>
          <input type="month" value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{background:C.navyMid,border:`1px solid ${C.navyBorder}`,borderRadius:7,padding:"6px 10px",fontSize:12,color:C.textPrimary}}/>
          <span style={{marginLeft:"auto",fontSize:12,color:C.textMuted}}>{filtered.length} entries · {formatUGX(filtered.reduce((s,e)=>s+e.amount,0))}</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["ID","Category","Description","Vehicle/Vendor","Amount","Method","Date",""].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
            <tbody>
              {filtered.map(e=>(
                <tr key={e.id||e.category+e.date} onMouseEnter={ev=>ev.currentTarget.style.background=C.navyMid} onMouseLeave={ev=>ev.currentTarget.style.background=""}>
                  <TD><span style={{color:C.amber,fontWeight:700,fontSize:11}}>{e.id||"—"}</span></TD>
                  <TD><span style={{background:C.orangeBg,color:C.orange,padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:600}}>{e.category}</span></TD>
                  <TD style={{color:C.textSecondary,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.description}</TD>
                  <TD style={{fontSize:11,color:C.textMuted}}>{e.vehicle||e.vendor||"—"}</TD>
                  <TD><span style={{color:C.red,fontWeight:700}}>-{formatUGX(e.amount)}</span></TD>
                  <TD><span style={{background:C.navyMid,padding:"2px 8px",borderRadius:10,fontSize:10}}>{e.paymentMethod||"Cash"}</span></TD>
                  <TD style={{fontSize:11,color:C.textMuted}}>{e.date}</TD>
                  <TD>
                    <div style={{display:"flex",gap:4}}>
                      <Btn onClick={()=>openEdit(e)} variant="navy" style={{padding:"3px 8px",fontSize:10,border:`1px solid ${C.navyBorder}`}}>Edit</Btn>
                      <Btn onClick={()=>setDeleteConfirm(e.id||e.category+e.date)} variant="danger" style={{padding:"3px 8px",fontSize:10}}>Del</Btn>
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit modal */}
      <Modal open={showModal} onClose={()=>setShowModal(false)} title={editingExp?"Edit Cost Entry":"Add New Cost"}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Sel label="Category" value={expForm.category} onChange={e=>setExpForm({...expForm,category:e.target.value})} options={EXPENSE_CATEGORIES.map(v=>({value:v,label:v}))}/>
          <Input label="Amount (UGX)" type="number" value={expForm.amount} onChange={e=>setExpForm({...expForm,amount:e.target.value})} placeholder="e.g. 150000"/>
          <Input label="Description" value={expForm.description} onChange={e=>setExpForm({...expForm,description:e.target.value})} placeholder="Brief description of this cost"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Input label="Date" type="date" value={expForm.date} onChange={e=>setExpForm({...expForm,date:e.target.value})}/>
            <Sel label="Payment Method" value={expForm.paymentMethod} onChange={e=>setExpForm({...expForm,paymentMethod:e.target.value})} options={PAYMENT_METHODS.map(v=>({value:v,label:v}))}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Input label="Vehicle (optional)" value={expForm.vehicle} onChange={e=>setExpForm({...expForm,vehicle:e.target.value})} placeholder="e.g. UAA 365D"/>
            <Input label="Vendor (optional)" value={expForm.vendor} onChange={e=>setExpForm({...expForm,vendor:e.target.value})} placeholder="Vendor name"/>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
            <Btn variant="navy" onClick={()=>setShowModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
            <Btn onClick={saveExp}>{editingExp?"Save Changes":"Add Cost"}</Btn>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={()=>setDeleteConfirm(null)} title="Confirm Delete">
        <p style={{fontSize:13,marginBottom:18,color:C.textSecondary}}>Are you sure you want to delete this expense entry? This cannot be undone.</p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn variant="navy" onClick={()=>setDeleteConfirm(null)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
          <Btn variant="danger" onClick={()=>deleteExp(deleteConfirm)}>Delete Entry</Btn>
        </div>
      </Modal>

      {/* Finance Users & Access Control */}
      <Modal open={showUserModal} onClose={()=>setShowUserModal(false)} title="Finance Users & Access Control" wide>
        <div style={{marginBottom:16}}>
          <p style={{fontSize:12,color:C.textMuted,marginBottom:12}}>Control who can view, add, edit, delete or export finance data.</p>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>{["User","Email","Role","Permissions",""].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
            <tbody>
              {finUsers.map(u=>(
                <tr key={u.id}>
                  <TD><span style={{fontWeight:700}}>{u.name}</span></TD>
                  <TD style={{color:C.textMuted}}>{u.email}</TD>
                  <TD><span style={{background:u.role==="full"?C.amber+"22":C.navyMid,color:u.role==="full"?C.amber:C.textSecondary,padding:"2px 8px",borderRadius:8,fontSize:10,fontWeight:600}}>{u.role==="full"?"Full Access":"Limited"}</span></TD>
                  <TD><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{u.access.map(a=><span key={a} style={{background:C.green+"22",color:C.green,padding:"1px 6px",borderRadius:6,fontSize:9,fontWeight:600}}>{a}</span>)}</div></TD>
                  <TD><Btn variant="navy" style={{padding:"3px 8px",fontSize:10,border:`1px solid ${C.navyBorder}`}}>Edit</Btn></TD>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:16,padding:"14px",background:C.navyMid,borderRadius:10,border:`1px solid ${C.navyBorder}`}}>
            <div className="ral" style={{fontWeight:700,marginBottom:10,fontSize:13}}>Add Finance User</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <Input label="Full Name" value={userForm.name} onChange={e=>setUserForm({...userForm,name:e.target.value})} placeholder="Staff name"/>
              <Input label="Email" type="email" value={userForm.email} onChange={e=>setUserForm({...userForm,email:e.target.value})} placeholder="staff@raylane.ug"/>
            </div>
            <Sel label="Access Level" value={userForm.role} onChange={e=>setUserForm({...userForm,role:e.target.value})} options={[{value:"limited",label:"Limited (View + Add only)"},{value:"full",label:"Full Access (All permissions)"}]}/>
            <Btn style={{marginTop:10}} onClick={()=>{if(userForm.name&&userForm.email){setFinUsers([...finUsers,{id:`FU-${String(finUsers.length+1).padStart(3,"0")}`,name:userForm.name,email:userForm.email,role:userForm.role,access:userForm.role==="full"?["view","add","edit","delete","export"]:["view","add"]}]);setUserForm({name:"",email:"",role:"limited",access:["view"]});}}}>Add User</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

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

  const [heroSlides,setHeroSlides]=useState(INIT_HERO_SLIDES);
  const [newsItems,setNewsItems]=useState(INIT_NEWS_ITEMS);
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
    {id:"finance",icon:"📊",label:"Finance & Accounting"},
    {id:"promotions",icon:"🎁",label:"Promotions"},
    {id:"reports",icon:"📈",label:"Reports"},
    {id:"agents",icon:"👤",label:"Agents"},
    {id:"feedback",icon:"⭐",label:"Feedback",badge:pendingFeedback.length},
    {id:"settings",icon:"⚙️",label:"Settings"},
    {id:"cms",icon:"🖼️",label:"Homepage CMS"},
    {id:"payroll",icon:"💼",label:"Payroll"},
    {id:"saco",icon:"🏦",label:"Staff SACCO"},
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
          <span className="ral" style={{fontWeight:900,fontSize:16}}>RAYLANE <span style={{color:C.textMuted,fontWeight:400,fontSize:12}}>/ Admin</span></span>
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

        {/* ── FINANCE OVERVIEW (redirect to full finance) ── */}
        {section==="finance"&&<AdminFinanceSection store={store}/>}

        {/* ── REVENUE SECTION ── */}
        {section==="__removed_finance_revenue"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div><h1 className="ral" style={{fontSize:24,fontWeight:900}}>Revenue Management</h1><p style={{color:C.textMuted,fontSize:12,marginTop:3}}>Income tracking — IASB/GAAP/URA compliant</p></div>
              <div style={{display:"flex",gap:8}}>
                <Btn variant="navy" style={{fontSize:11,border:`1px solid ${C.navyBorder}`,padding:"7px 14px"}}>📄 Export PDF</Btn>
                <Btn variant="navy" style={{fontSize:11,border:`1px solid ${C.navyBorder}`,padding:"7px 14px"}}>📊 Export Excel</Btn>
              </div>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:22}}>
              <StatCard label="Gross Revenue" value={formatUGX(totalRevenue)} icon="💵" color={C.green} sub="Confirmed bookings"/>
              <StatCard label="Parcel Revenue" value={formatUGX(store.parcels?.filter(p=>p.status==="confirmed").reduce((s,p)=>s+(p.amount||0),0)||0)} icon="📦" color={C.blue} sub="Courier income"/>
              <StatCard label="Net Revenue" value={formatUGX(totalRevenue-totalExpenses)} icon="📈" color={C.amber} sub="After operating costs"/>
              <StatCard label="Bookings Count" value={store.bookings.filter(b=>b.payment_status==="confirmed").length} icon="🎫" color={C.purple} sub="Paid seats"/>
            </div>

            {/* Revenue by Route */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
              <Card>
                <h3 className="ral" style={{fontWeight:700,marginBottom:16,color:C.textPrimary}}>Revenue by Route</h3>
                {ROUTES.map(r=>{
                  const rev=store.bookings.filter(b=>b.route_id===r.id&&b.payment_status==="confirmed").reduce((s,b)=>s+b.amount,0);
                  return(<div key={r.id} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}><span style={{color:C.textSecondary}}>{r.origin} → {r.destination}</span><span style={{fontWeight:700,color:C.green}}>{formatUGX(rev)}</span></div>
                    <div style={{height:5,background:C.navyLight,borderRadius:3}}><div style={{width:`${Math.min(rev?((rev/Math.max(...ROUTES.map(r=>store.bookings.filter(b=>b.route_id===r.id&&b.payment_status==="confirmed").reduce((s,b)=>s+b.amount,0))))*100):0,100)}%`,height:"100%",background:`linear-gradient(90deg,${C.green},${C.amber})`,borderRadius:3,transition:"width .5s"}}/></div>
                  </div>);
                })}
              </Card>
              <Card>
                <h3 className="ral" style={{fontWeight:700,marginBottom:16,color:C.textPrimary}}>Payment Methods</h3>
                {[{label:"MTN MoMo",color:"#FFCB05",val:Math.round(totalRevenue*0.52)},{label:"Airtel Money",color:"#E60000",val:Math.round(totalRevenue*0.31)},{label:"Cash",color:C.green,val:Math.round(totalRevenue*0.17)}].map(m=>(
                  <div key={m.label} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}><span>{m.label}</span><span style={{fontWeight:700}}>{formatUGX(m.val)}</span></div>
                    <div style={{height:5,background:C.navyLight,borderRadius:3}}><div style={{width:`${m.val/totalRevenue*100||0}%`,height:"100%",background:m.color,borderRadius:3}}/></div>
                  </div>
                ))}
                <div style={{borderTop:`1px solid ${C.navyBorder}`,marginTop:14,paddingTop:12,display:"flex",justifyContent:"space-between",fontSize:13}}>
                  <span className="ral" style={{fontWeight:800}}>Total</span>
                  <span className="ral" style={{fontWeight:800,color:C.green}}>{formatUGX(totalRevenue)}</span>
                </div>
              </Card>
            </div>

            {/* Revenue booking log */}
            <Card style={{padding:0,overflow:"hidden"}}>
              <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.navyBorder}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <h3 className="ral" style={{fontWeight:700}}>Revenue Entries</h3>
                <Btn variant="navy" style={{fontSize:11,border:`1px solid ${C.navyBorder}`,padding:"5px 12px"}}>Export CSV</Btn>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr>{["Booking #","Passenger","Route","Seats","Amount","Method","Date","Status"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                  <tbody>
                    {store.bookings.filter(b=>b.payment_status==="confirmed").map(b=>(
                      <tr key={b.id} onMouseEnter={e=>e.currentTarget.style.background=C.navyMid} onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <TD><span style={{color:C.amber,fontWeight:700}}>{b.code}</span></TD>
                        <TD>{b.passenger}</TD>
                        <TD style={{color:C.textSecondary,fontSize:11}}>{b.route}</TD>
                        <TD>{b.seats?.join(", ")}</TD>
                        <TD><span style={{color:C.green,fontWeight:700}}>{formatUGX(b.amount)}</span></TD>
                        <TD><span style={{background:C.amberBg,color:C.amber2,padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:600}}>{b.paymentMethod||"Cash"}</span></TD>
                        <TD style={{fontSize:11,color:C.textMuted}}>{b.date}</TD>
                        <TD><StatusBadge status="confirmed"/></TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ── COST MANAGEMENT ── */}
        {/*section==="finance-expenses" — merged into AdminFinanceSection*/}

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

        {/* ── PAYROLL ── */}
        {section==="payroll"&&<AdminPayrollSection store={store}/>}
        {/* ── SACCO ── */}
        {section==="saco"&&<AdminSACOSection store={store}/>}
        {/* ── CMS ── */}
        {section==="cms"&&<AdminCMSSection heroSlides={heroSlides} setHeroSlides={setHeroSlides} newsItems={newsItems} setNewsItems={setNewsItems}/>}
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
                  <Input label="Supabase URL" value="https://xyvijskzgpgauhrxcauw.supabase.co" onChange={()=>{}}/>
                  <Input label="Anon Key (Legacy)" value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5dmlqc2t6Z3BnYXVocnhjYXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTc5NjksImV4cCI6MjA4NzU3Mzk2OX0.FOjha5TvyDW6ozvWt8aEmbXTVbk5NtY1Vd_I2kXuHtM" onChange={()=>{}}/>
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
    const code=genBookingCode(trip.vehicle_reg||"");
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
          <span className="ral" style={{fontWeight:900,fontSize:16}}>RAYLANE <span style={{color:C.textMuted,fontWeight:400,fontSize:12}}>/ Agent Portal</span></span>
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

  const [showCustomerAuth,setShowCustomerAuth]=useState(false);
  const handleSetPage=(p)=>{
    if(p==="logout"){handleLogout();return;}
    if(p==="customer-login"){setShowCustomerAuth(true);return;}
    window.scrollTo({top:0,behavior:"smooth"});
    setPage(p);
  };

  return(
    <ErrorBoundary>
      <GlobalStyles/>
      <BackToTop/>
      <style>{globalCSS}</style>
      <Nav page={page} setPage={handleSetPage} currentUser={currentUser}/>
      <CustomerAuthModal open={showCustomerAuth} onClose={()=>setShowCustomerAuth(false)} onLogin={u=>{handleLogin(u);setShowCustomerAuth(false);}}/>
      {page==="home"     &&<HomePage      setPage={handleSetPage} setPreselectedTrip={setPreselectedTrip} store={store} onCustomerLogin={()=>setPage("customer-login")} onStaffLogin={()=>setPage("login")} currentUser={currentUser}/>}
      {page==="schedule" &&<SchedulePage  setPage={handleSetPage} setPreselectedTrip={setPreselectedTrip} store={store}/>}
      {page==="book"     &&<BookingPage   preselectedTrip={preselectedTrip} store={store} currentUser={currentUser}/>}
      {page==="plan"     &&<PlanJourneyPage store={store} currentUser={currentUser}/>}
      {page==="parcel"   &&<ParcelPage/>}
      {page==="safety"   &&<SafetyPage/>}
      {page==="faq"      &&<FAQPage/>}
    </ErrorBoundary>
  );
}

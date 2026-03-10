// ═══════════════════════════════════════════════════════════════════════
// RAYLANE EXPRESS — Full Platform v3
// ═══════════════════════════════════════════════════════════════════════
import React, { useState, useEffect, useCallback, useRef } from "react";

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
  // From Kampala
  {id:1, origin:"Kampala",    destination:"Gulu",       price:35000, duration_minutes:240},
  {id:2, origin:"Kampala",    destination:"Mbarara",    price:25000, duration_minutes:180},
  {id:3, origin:"Kampala",    destination:"Mbale",      price:30000, duration_minutes:210},
  {id:4, origin:"Kampala",    destination:"Fort Portal", price:40000, duration_minutes:270},
  {id:5, origin:"Kampala",    destination:"Arua",       price:50000, duration_minutes:360},
  {id:6, origin:"Kampala",    destination:"Jinja",      price:15000, duration_minutes:90},
  // Return routes
  {id:7, origin:"Gulu",       destination:"Kampala",    price:35000, duration_minutes:240},
  {id:8, origin:"Mbarara",    destination:"Kampala",    price:25000, duration_minutes:180},
  {id:9, origin:"Mbale",      destination:"Kampala",    price:30000, duration_minutes:210},
  {id:10,origin:"Fort Portal", destination:"Kampala",   price:40000, duration_minutes:270},
  {id:11,origin:"Arua",       destination:"Kampala",    price:50000, duration_minutes:360},
  {id:12,origin:"Jinja",      destination:"Kampala",    price:15000, duration_minutes:90},
  // Cross-routes
  {id:13,origin:"Mbale",      destination:"Gulu",       price:45000, duration_minutes:300},
  {id:14,origin:"Jinja",      destination:"Mbarara",    price:35000, duration_minutes:240},
  {id:15,origin:"Gulu",       destination:"Arua",       price:30000, duration_minutes:180},
];

const ALL_CITIES=["Kampala","Gulu","Mbarara","Mbale","Fort Portal","Arua","Jinja"];
const POPULAR_DESTINATIONS=[
  {
    city:"Mbale", emoji:"⛰️", price:30000,
    tagline:"Gateway to Mount Elgon",
    desc:"A vibrant city in Eastern Uganda blessed with a cool climate and scenic landscapes at the foothills of Mount Elgon. The main gateway to Sipi Falls and the mountain's celebrated hiking trails, Mbale draws tourists, business travellers, and weekend explorers throughout the year.",
    highlights:["Sipi Falls","Mount Elgon Hike","Cool Highland Climate"],
    photo:null, photoCaption:""
  },
  {
    city:"Gulu", emoji:"🌿", price:35000,
    tagline:"Heart of Northern Uganda",
    desc:"A fast-growing city celebrated for its rich Acholi culture, warm hospitality, and vibrant local life. Gulu is the gateway to Murchison Falls National Park — one of Uganda's most iconic safari destinations — offering a unique blend of adventure, culture, and authentic northern charm.",
    highlights:["Murchison Falls","Acholi Culture","Safari Gateway"],
    photo:null, photoCaption:""
  },
  {
    city:"Fort Portal", emoji:"🏔️", price:40000,
    tagline:"Pearl of Western Uganda",
    desc:"Nestled in the lush foothills of the Rwenzori Mountains, Fort Portal is one of Uganda's most scenic highland towns. A gateway to Queen Elizabeth National Park, Kibale Forest, and the enchanting crater lakes, it captivates with its misty mornings and extraordinary natural beauty.",
    highlights:["Crater Lakes","Kibale Chimps","Rwenzori Views"],
    photo:null, photoCaption:""
  },
  {
    city:"Jinja", emoji:"🌊", price:15000,
    tagline:"Adventure Capital of East Africa",
    desc:"Situated on the shores of Lake Victoria near the legendary Source of the Nile, Jinja is Uganda's adventure capital. White-water rafting, boat cruises, and riverside dining attract visitors from across East Africa. Scenic, lively, and unforgettable — Jinja is never just a destination.",
    highlights:["Source of the Nile","White-water Rafting","Riverside Resorts"],
    photo:null, photoCaption:""
  },
  {
    city:"Mbarara", emoji:"🌄", price:25000,
    tagline:"Commercial Heart of Western Uganda",
    desc:"Mbarara is the commercial and cultural capital of western Uganda, known for its vibrant business environment and strategic position along key trade routes. A gateway to Lake Mburo National Park and the scenic cattle corridor, it attracts business travellers and weekend visitors alike.",
    highlights:["Lake Mburo Park","Cattle Corridor","Modern City Life"],
    photo:null, photoCaption:""
  },
];

const makeToday=(h,m)=>{const d=new Date();d.setHours(h,m,0,0);return d.toISOString();};

const INIT_TRIPS = [
  {id:1, route_id:6, vehicle_id:1,departure_time:makeToday(6,0),  status:"active",seats_booked:[2,5,8],           vehicle_reg:"UAA 123B",capacity:14},
  {id:2, route_id:2, vehicle_id:2,departure_time:makeToday(7,30), status:"active",seats_booked:[1,3,6,9,12],       vehicle_reg:"UAB 456C",capacity:14},
  {id:3, route_id:3, vehicle_id:3,departure_time:makeToday(9,0),  status:"active",seats_booked:[],                 vehicle_reg:"UAC 789D",capacity:14},
  {id:4, route_id:1, vehicle_id:4,departure_time:makeToday(11,0), status:"active",seats_booked:[1,2,3,4,5,6,7,8,9,10,11,12,13],vehicle_reg:"UAD 012E",capacity:14},
  {id:5, route_id:4, vehicle_id:1,departure_time:makeToday(13,30),status:"active",seats_booked:[3,7],              vehicle_reg:"UAA 123B",capacity:14},
  {id:6, route_id:5, vehicle_id:2,departure_time:makeToday(15,0), status:"active",seats_booked:[],                 vehicle_reg:"UAB 456C",capacity:14},
  // Return trips
  {id:7, route_id:7, vehicle_id:3,departure_time:makeToday(5,30), status:"active",seats_booked:[1,4,7],            vehicle_reg:"UAC 789D",capacity:14},
  {id:8, route_id:8, vehicle_id:4,departure_time:makeToday(8,0),  status:"active",seats_booked:[2,5,8,11],         vehicle_reg:"UAD 012E",capacity:14},
  {id:9, route_id:9, vehicle_id:1,departure_time:makeToday(10,0), status:"active",seats_booked:[],                 vehicle_reg:"UAA 123B",capacity:14},
  {id:10,route_id:12,vehicle_id:2,departure_time:makeToday(14,0), status:"active",seats_booked:[3,6],              vehicle_reg:"UAB 456C",capacity:14},
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

  const [heroImages,setHeroImages]=useState([]);
  const addHeroImage=(url,name)=>setHeroImages(prev=>[...prev,{id:Date.now(),url,name}]);
  const removeHeroImage=(id)=>setHeroImages(prev=>prev.filter(h=>h.id!==id));

  // Destination photos (admin-uploaded, per city)
  const [destPhotos,setDestPhotos]=useState({});
  const setDestPhoto=(city,url,caption)=>setDestPhotos(prev=>({...prev,[city]:{url,caption}}));
  const removeDestPhoto=(city)=>setDestPhotos(prev=>{const n={...prev};delete n[city];return n;});

  // Ambassadors & referral system
  const [ambassadors,setAmbassadors]=useState([
    {id:"AMB-001",customerId:"CUS-001",name:"Sarah Nakato",phone:"+256 772 123456",email:"sarah.nakato@example.com",status:"approved",refCode:"SARAH2026",points:420,totalReferrals:14,pendingCommission:63000,paidCommission:105000,appliedAt:"2026-02-01",commissionRate:5},
    {id:"AMB-002",customerId:"CUS-002",name:"James Okello",phone:"+256 701 234567",email:"james.okello@example.com",status:"pending",refCode:"JAMES2026",points:0,totalReferrals:0,pendingCommission:0,paidCommission:0,appliedAt:"2026-03-08",commissionRate:5},
  ]);
  const [commissionRate,setCommissionRate]=useState(5); // % of booking value
  const [pendingCommissions,setPendingCommissions]=useState([
    {id:"COM-001",ambassadorId:"AMB-001",ambassadorName:"Sarah Nakato",bookingCode:"RLN/26/01/03/0007",bookingAmount:35000,commission:1750,status:"pending",date:"2026-03-08"},
    {id:"COM-002",ambassadorId:"AMB-001",ambassadorName:"Sarah Nakato",bookingCode:"RLN/26/03/03/0012",bookingAmount:50000,commission:2500,status:"pending",date:"2026-03-09"},
  ]);
  const applyAmbassador=(data)=>setAmbassadors(prev=>[...prev,{...data,id:`AMB-${String(prev.length+1).padStart(3,"0")}`,status:"pending",points:0,totalReferrals:0,pendingCommission:0,paidCommission:0,appliedAt:new Date().toISOString().split("T")[0],commissionRate}]);
  const approveAmbassador=(id)=>setAmbassadors(prev=>prev.map(a=>a.id===id?{...a,status:"approved"}:a));
  const rejectAmbassador=(id)=>setAmbassadors(prev=>prev.map(a=>a.id===id?{...a,status:"rejected"}:a));
  const approveCommission=(id)=>setPendingCommissions(prev=>prev.map(c=>c.id===id?{...c,status:"paid"}:c));

  // Coupons
  const [coupons,setCoupons]=useState([
    {id:"CPN-001",code:"WELCOME15",type:"percent",value:15,description:"15% off for new members",minAmount:20000,active:true,usageLimit:100,usedCount:23,expires:"2026-12-31"},
    {id:"CPN-002",code:"JINJA10K",type:"fixed",value:10000,description:"UGX 10,000 off any Jinja route",minAmount:15000,active:true,usageLimit:50,usedCount:8,expires:"2026-06-30"},
    {id:"CPN-003",code:"GULU20",type:"percent",value:20,description:"20% off Gulu routes — limited time",minAmount:35000,active:false,usageLimit:30,usedCount:30,expires:"2026-02-28"},
  ]);
  const addCoupon=(c)=>setCoupons(prev=>[...prev,{...c,id:`CPN-${String(prev.length+1).padStart(3,"0")}`,usedCount:0}]);
  const toggleCoupon=(id)=>setCoupons(prev=>prev.map(c=>c.id===id?{...c,active:!c.active}:c));
  const validateCoupon=(code,amount)=>{
    const c=coupons.find(cp=>cp.code.toUpperCase()===code.toUpperCase()&&cp.active&&new Date(cp.expires)>new Date()&&cp.usedCount<cp.usageLimit&&amount>=cp.minAmount);
    if(!c) return null;
    const discount=c.type==="percent"?Math.floor(amount*(c.value/100)):c.value;
    return{coupon:c,discount,finalAmount:amount-discount};
  };

  // Customer accounts (registered public users)
  const [customers,setCustomers]=useState([
    {id:"CUS-001",name:"Sarah Nakato",phone:"+256 772 123456",email:"sarah.nakato@example.com",district:"Kampala",joined:"2026-01-10",bookings:3,verified:true},
    {id:"CUS-002",name:"James Okello",phone:"+256 701 234567",email:"james.okello@example.com",district:"Gulu",joined:"2026-02-14",bookings:1,verified:true},
  ]);
  const addCustomer = c => setCustomers(prev=>[...prev,{...c,id:`CUS-${String(prev.length+1).padStart(3,"0")}`,joined:new Date().toISOString().split("T")[0],bookings:0,verified:true}]);
  const findCustomer = (email) => customers.find(c=>c.email.toLowerCase()===email.toLowerCase())||null;
  const findCustomerByPhone = (phone) => customers.find(c=>c.phone===phone)||null;

  // Social media handles (admin-configurable)
  const [socialLinks,setSocialLinks]=useState({
    facebook:{url:"https://facebook.com/raylaneexpress",handle:"@raylaneexpress",active:true},
    instagram:{url:"https://instagram.com/raylaneexpress",handle:"@raylaneexpress",active:true},
    x:{url:"https://x.com/raylaneexpress",handle:"@raylaneexpress",active:true},
    tiktok:{url:"https://tiktok.com/@raylaneexpress",handle:"@raylaneexpress",active:true},
  });
  const updateSocialLink=(platform,data)=>setSocialLinks(prev=>({...prev,[platform]:{...prev[platform],...data}}));

  // Dispatch system — revenue only posts after dispatch officer releases
  const [dispatches,setDispatches]=useState([
    {id:"DSP-001",tripId:1,vehicleReg:"UAA 365D",route:"Kampala → Gulu",departureTime:"06:00",dispatchedAt:"2026-03-08 06:05",dispatchOfficer:"Admin",status:"dispatched",passengersCount:12,revenuePosted:true},
  ]);
  const dispatchTrip=(tripId,vehicleReg,route,officer,passengersCount,revenue)=>{
    const entry={id:`DSP-${String(dispatches.length+1).padStart(3,"0")}`,tripId,vehicleReg,route,departureTime:new Date().toLocaleTimeString("en-UG",{hour:"2-digit",minute:"2-digit"}),dispatchedAt:new Date().toLocaleString("en-UG"),dispatchOfficer:officer,status:"dispatched",passengersCount,revenuePosted:true,revenue};
    setDispatches(prev=>[...prev,entry]);
    // Mark bookings for that trip as revenue-posted
    setBookings(prev=>prev.map(b=>b.trip_id===tripId?{...b,payment_status:"confirmed",revenue_posted:true}:b));
  };

  // Bank loans management
  const [bankLoans,setBankLoans]=useState([
    {id:"BLN-001",bank:"Centenary Bank",purpose:"Fleet Expansion",principal:50000000,balance:38000000,monthlyInstalment:2500000,interestRate:18,disbursedDate:"2025-10-01",nextDueDate:"2026-04-01",status:"active",notes:"Commercial vehicle loan"},
    {id:"BLN-002",bank:"Stanbic Bank",purpose:"Office Renovation",principal:15000000,balance:9000000,monthlyInstalment:900000,interestRate:21,disbursedDate:"2025-07-15",nextDueDate:"2026-04-15",status:"active",notes:"SME loan"},
  ]);
  const addBankLoan=(loan)=>setBankLoans(prev=>[...prev,{...loan,id:`BLN-${String(prev.length+1).padStart(3,"0")}`}]);
  const recordLoanPayment=(id,amount)=>setBankLoans(prev=>prev.map(l=>{
    if(l.id!==id) return l;
    const newBal=Math.max(0,l.balance-amount);
    const d=new Date(l.nextDueDate);d.setMonth(d.getMonth()+1);
    return{...l,balance:newBal,nextDueDate:newBal===0?"Paid":d.toISOString().split("T")[0],status:newBal===0?"settled":"active"};
  }));

  // Loan alert inbox
  const [loanAlerts,setLoanAlerts]=useState([
    {id:"ALT-001",loanId:"BLN-001",bank:"Centenary Bank",dueDate:"2026-04-01",amount:2500000,daysUntilDue:22,urgency:"low",read:false,message:"Upcoming loan instalment of UGX 2,500,000 due on 01 April 2026."},
    {id:"ALT-002",loanId:"BLN-002",bank:"Stanbic Bank",dueDate:"2026-04-15",amount:900000,daysUntilDue:36,urgency:"low",read:false,message:"Upcoming loan instalment of UGX 900,000 due on 15 April 2026."},
  ]);
  const markAlertRead=(id)=>setLoanAlerts(prev=>prev.map(a=>a.id===id?{...a,read:true}:a));

  // To-Do list (auto + manual)
  const [todos,setTodos]=useState([
    {id:"TD-001",text:"Review 2 pending bookings",category:"bookings",auto:true,done:false,priority:"high",createdAt:"2026-03-10"},
    {id:"TD-002",text:"Approve 1 ambassador application",category:"ambassadors",auto:true,done:false,priority:"medium",createdAt:"2026-03-10"},
    {id:"TD-003",text:"Centenary Bank loan payment due in 22 days",category:"finance",auto:true,done:false,priority:"medium",createdAt:"2026-03-10"},
    {id:"TD-004",text:"Process March payroll",category:"payroll",auto:true,done:false,priority:"high",createdAt:"2026-03-10"},
    {id:"TD-005",text:"Review pending loan application: Ruth Acen",category:"saco",auto:true,done:false,priority:"medium",createdAt:"2026-03-10"},
  ]);
  const addTodo=(text,category,priority)=>setTodos(prev=>[...prev,{id:`TD-${String(prev.length+1).padStart(3,"0")}`,text,category,auto:false,done:false,priority:priority||"medium",createdAt:new Date().toISOString().split("T")[0]}]);
  const toggleTodo=(id)=>setTodos(prev=>prev.map(t=>t.id===id?{...t,done:!t.done}:t));
  const deleteTodo=(id)=>setTodos(prev=>prev.filter(t=>t.id!==id));

  // Vendor payments tracking
  const [vendorPayments,setVendorPayments]=useState([
    {id:"VP-001",vendorName:"John Transport Services",vehicle:"UBD 214A",tripDate:"2026-03-07",route:"Kampala→Mbale",amountPayable:120000,status:"paid",paidDate:"2026-03-08",notes:""},
    {id:"VP-002",vendorName:"Grace Coaches",vehicle:"UBE 987B",tripDate:"2026-03-09",route:"Kampala→Gulu",amountPayable:180000,status:"pending",paidDate:"",notes:"Awaiting invoice"},
    {id:"VP-003",vendorName:"John Transport Services",vehicle:"UBD 214A",tripDate:"2026-03-05",route:"Kampala→Mbarara",amountPayable:100000,status:"overdue",paidDate:"",notes:"Past due 5 days"},
  ]);
  const addVendorPayment=(vp)=>setVendorPayments(prev=>[...prev,{...vp,id:`VP-${String(prev.length+1).padStart(3,"0")}`}]);
  const updateVendorPaymentStatus=(id,status,paidDate)=>setVendorPayments(prev=>prev.map(v=>v.id===id?{...v,status,paidDate:paidDate||v.paidDate}:v));

  // Staff expense claims
  const [expenseClaims,setExpenseClaims]=useState([
    {id:"EC-001",employeeId:"RL-EM150126001",employeeName:"Moses Lubega",category:"Transport Reimbursement",amount:15000,date:"2026-03-08",description:"Matatu to Kampala office",status:"approved",approvedBy:"Admin",receipts:[]},
    {id:"EC-002",employeeId:"RL-EM200126002",employeeName:"Ruth Acen",category:"Fuel Advance",amount:50000,date:"2026-03-09",description:"Field trip fuel",status:"pending",approvedBy:"",receipts:[]},
  ]);
  const addExpenseClaim=(claim)=>setExpenseClaims(prev=>[...prev,{...claim,id:`EC-${String(prev.length+1).padStart(3,"0")}`,status:"pending",approvedBy:"",receipts:[]}]);
  const approveExpenseClaim=(id)=>setExpenseClaims(prev=>prev.map(e=>e.id===id?{...e,status:"approved",approvedBy:"Admin"}:e));
  const rejectExpenseClaim=(id)=>setExpenseClaims(prev=>prev.map(e=>e.id===id?{...e,status:"rejected"}:e));

  return {trips,vehicles,bookings,agents,reservations,expenses,promotions,feedback,heroImages,customers,
    destPhotos,setDestPhoto,removeDestPhoto,
    ambassadors,commissionRate,setCommissionRate,pendingCommissions,
    applyAmbassador,approveAmbassador,rejectAmbassador,approveCommission,
    coupons,addCoupon,toggleCoupon,validateCoupon,
    getRoute,getVehicle,getTrip,seatsAvailable,confirmBooking,addBooking,addAgent,
    toggleAgent,addVehicle,addTrip,reserveSeat,approveFeedback,rejectFeedback,addExpense,addPromotion,
    addHeroImage,removeHeroImage,addCustomer,findCustomer,findCustomerByPhone,
    socialLinks,updateSocialLink,
    dispatches,dispatchTrip,
    bankLoans,addBankLoan,recordLoanPayment,loanAlerts,markAlertRead,
    todos,addTodo,toggleTodo,deleteTodo,
    vendorPayments,addVendorPayment,updateVendorPaymentStatus,
    expenseClaims,addExpenseClaim,approveExpenseClaim,rejectExpenseClaim};
};

// ─── UTILITIES ────────────────────────────────────────────────────────
const formatUGX = n=>`UGX ${Number(n).toLocaleString()}`;
const formatTime = dt=>new Date(dt).toLocaleTimeString("en-UG",{hour:"2-digit",minute:"2-digit"});
const formatDate = dt=>new Date(dt).toLocaleDateString("en-UG",{day:"numeric",month:"short",year:"numeric"});
const validateReg = reg=>/^UA[A-Z]{1,2}\s?\d{1,3}[A-Z]{1,2}$/.test(reg.toUpperCase().trim());

// ─── BOOKING CODE: RLN/YY/DD/MM/NNNN ─────────────────────────────────
// RLN / year(2-digit) / day-of-week(Sun=00,Mon=01…Sat=06) / month(01-12) / 4-digit serial
const _bookingSerial = {count:1};
const genPassengerCode = ()=>{
  const now = new Date();
  const yy  = String(now.getFullYear()).slice(-2);          // "26"
  const dow = String(now.getDay()).padStart(2,"0");          // "03" = Wed
  const mm  = String(now.getMonth()+1).padStart(2,"0");     // "03" = March
  const nn  = String(_bookingSerial.count++).padStart(4,"0");
  return `RLN/${yy}/${dow}/${mm}/${nn}`;
};

// ─── PARCEL CODE: PCL/DDMMYY/VVV/NNNNN ──────────────────────────────
// PCL / day(2)+month(2)+year(2) / last-3-of-vehicle-reg / 5-digit serial
const _parcelSerial = {count:1};
const genParcelCode = (vehicleReg="")=>{
  const now = new Date();
  const dd  = String(now.getDate()).padStart(2,"0");
  const mm  = String(now.getMonth()+1).padStart(2,"0");
  const yy  = String(now.getFullYear()).slice(-2);
  const date= `${dd}${mm}${yy}`;
  // Extract last 3 alphanumeric chars from vehicle reg
  const suffix = (vehicleReg.replace(/\s/g,"").slice(-3)||"000").toUpperCase();
  const nn  = String(_parcelSerial.count++).padStart(5,"0");
  return `PCL/${date}/${suffix}/${nn}`;
};

function useCountdown(target){
  const [diff,setDiff]=useState(new Date(target)-new Date());
  useEffect(()=>{const t=setInterval(()=>setDiff(new Date(target)-new Date()),1000);return()=>clearInterval(t);},[target]);
  if(diff<=0) return{str:"Departed",urgent:false,boarding:false,mins:0};
  const h=Math.floor(diff/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);
  const mins=diff/60000;
  return{str:h>0?`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`:`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`,urgent:mins<=30,boarding:mins<=18,mins};
}

// ─── RAYLANE LOGO SVG ────────────────────────────────────────────────
const RaylaneLogo=({height=38,light=false})=>{
  const txt=light?"#0D1B3E":"#FFFFFF";
  const glow=light?"#3B82F6":"#7BB8FF";
  return(
    <svg height={height} viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Swoosh rings */}
      <ellipse cx="52" cy="32" rx="30" ry="30" stroke="url(#sw1)" strokeWidth="4" fill="none" strokeLinecap="round"
        strokeDasharray="120 60" transform="rotate(-30 52 32)"/>
      <ellipse cx="52" cy="32" rx="22" ry="22" stroke="url(#sw2)" strokeWidth="3.5" fill="none" strokeLinecap="round"
        strokeDasharray="90 50" transform="rotate(15 52 32)"/>
      <ellipse cx="52" cy="32" rx="13" ry="13" stroke="url(#sw3)" strokeWidth="3" fill="none" strokeLinecap="round"
        strokeDasharray="55 35" transform="rotate(60 52 32)"/>
      {/* Speed line */}
      <line x1="22" y1="55" x2="82" y2="55" stroke={glow} strokeWidth="2" strokeLinecap="round" opacity=".6"/>
      {/* Glow dot */}
      <circle cx="82" cy="55" r="3" fill={glow} opacity=".8"/>
      {/* RAYLANE text */}
      <text x="95" y="46" fontFamily="'Raleway',Arial,sans-serif" fontWeight="900" fontSize="28"
        letterSpacing="1" fill={txt}>RAYLANE</text>
      <defs>
        <linearGradient id="sw1" x1="22" y1="2" x2="82" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF"/><stop offset="1" stopColor={glow}/>
        </linearGradient>
        <linearGradient id="sw2" x1="30" y1="10" x2="74" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor={glow}/><stop offset="1" stopColor="#FFFFFF" stopOpacity=".7"/>
        </linearGradient>
        <linearGradient id="sw3" x1="39" y1="19" x2="65" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity=".9"/><stop offset="1" stopColor={glow} stopOpacity=".5"/>
        </linearGradient>
      </defs>
    </svg>
  );
};


// ── Payment method pill badges (rectangular, not square) ──────────────
const MTNLogo=({size=36,pill=false})=>{
  // Faithful MTN MoMo logo: teal bg, yellow chevron/person icon, bold yellow "MoMo from MTN"
  if(pill) return(
    <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"#1A6B7A",borderRadius:9,padding:"5px 13px",height:34,boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}>
      <svg width="22" height="22" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="14" fill="#1A6B7A"/>
        <polygon points="50,10 80,42 50,35 20,42" fill="#FFCC00"/>
        <circle cx="50" cy="55" r="11" fill="#FFCC00"/>
        <rect x="34" y="72" width="32" height="8" rx="4" fill="#FFCC00"/>
      </svg>
      <div style={{display:"flex",flexDirection:"column",lineHeight:1.1}}>
        <span style={{fontFamily:"'Arial Black',sans-serif",fontWeight:900,fontSize:11,color:"#FFCC00",letterSpacing:"0.5px"}}>MoMo</span>
        <span style={{fontFamily:"Arial,sans-serif",fontWeight:600,fontSize:8,color:"rgba(255,204,0,0.75)",letterSpacing:"0.3px"}}>from MTN</span>
      </div>
    </div>
  );
  return(
    <div style={{width:size,height:size,borderRadius:12,background:"#1A6B7A",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>
      <svg width={size*0.55} height={size*0.55} viewBox="0 0 100 100">
        <polygon points="50,8 82,44 50,36 18,44" fill="#FFCC00"/>
        <circle cx="50" cy="58" r="13" fill="#FFCC00"/>
        <rect x="32" y="76" width="36" height="9" rx="4" fill="#FFCC00"/>
      </svg>
      <span style={{fontFamily:"'Arial Black',sans-serif",fontWeight:900,fontSize:Math.max(7,size*0.17),color:"#FFCC00",letterSpacing:"0.3px",marginTop:2}}>MoMo</span>
    </div>
  );
};
const AirtelLogo=({size=36,pill=false})=>{
  // Faithful Airtel Money logo: white bg, bold red spiral/swirl, "airtel money" in red
  if(pill) return(
    <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"#fff",border:"1.5px solid #EE1C25",borderRadius:9,padding:"5px 13px",height:34,boxShadow:"0 1px 4px rgba(238,28,37,0.12)"}}>
      <svg width="22" height="22" viewBox="0 0 100 100">
        <path d="M50 12 C72 8 90 24 87 50 C85 68 68 75 57 64 C46 53 53 38 68 38 C76 38 80 44 77 52" stroke="#EE1C25" strokeWidth="11" fill="none" strokeLinecap="round"/>
        <circle cx="50" cy="50" r="6" fill="#EE1C25"/>
      </svg>
      <div style={{display:"flex",flexDirection:"column",lineHeight:1.1}}>
        <span style={{fontFamily:"Arial,sans-serif",fontWeight:900,fontSize:11,color:"#EE1C25",letterSpacing:"-0.3px"}}>airtel</span>
        <span style={{fontFamily:"Arial,sans-serif",fontWeight:600,fontSize:8,color:"#EE1C25",letterSpacing:"0.2px"}}>money</span>
      </div>
    </div>
  );
  return(
    <div style={{width:size,height:size,borderRadius:12,background:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,0.1)",border:"1px solid #EE1C2520"}}>
      <svg width={size*0.55} height={size*0.52} viewBox="0 0 100 95">
        <path d="M50 10 C72 6 90 22 87 48 C85 66 68 73 57 62 C46 51 53 36 68 36 C76 36 80 42 77 50" stroke="#EE1C25" strokeWidth="11" fill="none" strokeLinecap="round"/>
        <circle cx="50" cy="50" r="6" fill="#EE1C25"/>
      </svg>
      <span style={{fontFamily:"Arial,sans-serif",fontWeight:900,fontSize:Math.max(6,size*0.145),color:"#EE1C25",letterSpacing:"-0.2px",marginTop:1}}>airtel</span>
      <span style={{fontFamily:"Arial,sans-serif",fontWeight:600,fontSize:Math.max(5,size*0.11),color:"#EE1C25",letterSpacing:"0.2px"}}>money</span>
    </div>
  );
};
// WhatsApp icon SVG component
const WhatsAppIcon=({size=20})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#25D366"/>
    <path d="M17.5 14.5c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.4.1-.2.2-.3.2-.5 0-.2-.7-1.7-.9-2.3-.2-.5-.5-.5-.7-.5-.2 0-.4 0-.6 0s-.6.1-.9.4c-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.8.6.8.2 1.5.2 2 .1.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.3z" fill="white"/>
  </svg>
);
const WhatsAppBadge=()=>(
  <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#25D36615",border:"1.5px solid #25D36633",borderRadius:10,padding:"8px 14px"}}>
    <WhatsAppIcon size={22}/>
    <div>
      <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:12,color:"#128C7E",lineHeight:1.2}}>Instant Receipt on WhatsApp</div>
      <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:"#075E54",opacity:.8,lineHeight:1.2}}>Presentable at boarding</div>
    </div>
  </div>
);


const globalCSS=`
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,300;0,400;0,600;0,700;0,900;1,300;1,400&family=Inter:wght@300;400;500;600;700;800&family=Raleway:wght@600;700;800;900&display=swap');

/* ── Reset & Base ── */
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;font-size:16px;-webkit-text-size-adjust:100%;}
body{
  background:#F4F6FA;
  color:${C.navy};
  font-family:'Inter',system-ui,-apple-system,sans-serif;
  line-height:1.6;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
}

/* ── Typography scale (Qatar-inspired: Source Serif for display, Inter for body) ── */
.t-display{font-family:'Source Serif 4',Georgia,serif;font-weight:700;line-height:1.05;letter-spacing:-0.02em;}
.t-headline{font-family:'Source Serif 4',Georgia,serif;font-weight:600;line-height:1.15;}
.t-label{font-family:'Inter',sans-serif;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;font-size:11px;}
.t-body{font-family:'Inter',sans-serif;font-weight:400;line-height:1.75;}
.ral{font-family:'Raleway',sans-serif;}

/* ── Scrollbar ── */
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:#EEF1F8;}
::-webkit-scrollbar-thumb{background:#B8C6DC;border-radius:99px;}
::-webkit-scrollbar-thumb:hover{background:#8899BB;}

/* ── Focus accessibility ── */
:focus-visible{outline:2px solid ${C.amber};outline-offset:3px;border-radius:4px;}
button:focus-visible,a:focus-visible{outline:2px solid ${C.amber};outline-offset:3px;}

/* ── Utility classes ── */
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
.container{max-width:1200px;margin:0 auto;padding:0 clamp(16px,5vw,40px);}
.section{padding:clamp(48px,7vw,96px) 0;}
.section-sm{padding:clamp(32px,4vw,56px) 0;}
.text-center{text-align:center;}

/* ── Animations ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes slideInLeft{from{opacity:0;transform:translateX(-32px);}to{opacity:1;transform:translateX(0);}}
@keyframes slideInRight{from{opacity:0;transform:translateX(32px);}to{opacity:1;transform:translateX(0);}}
@keyframes scaleIn{from{opacity:0;transform:scale(.94);}to{opacity:1;transform:scale(1);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
@keyframes blink{0%,100%{box-shadow:0 0 0 0 ${C.amber}55;}50%{box-shadow:0 0 18px 6px ${C.amber}28;}}
@keyframes urgentPulse{0%,100%{background:${C.orange}15;}50%{background:${C.orange}28;}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes heroFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
@keyframes amberGlow{0%,100%{text-shadow:0 0 30px ${C.amber}44;}50%{text-shadow:0 0 60px ${C.amber}77,0 0 100px ${C.amber}22;}}
@keyframes particleDrift{0%{transform:translateY(0) translateX(0);opacity:0;}20%{opacity:.5;}80%{opacity:.3;}100%{transform:translateY(-140px) translateX(28px);opacity:0;}}
@keyframes kenBurns{0%{transform:scale(1.08) translate(0,0);}100%{transform:scale(1.02) translate(-1%,-0.5%);}}
@keyframes slideNext{from{opacity:0;transform:translateX(40px);}to{opacity:1;transform:translateX(0);}}
@keyframes slidePrev{from{opacity:0;transform:translateX(-40px);}to{opacity:1;transform:translateX(0);}}
@keyframes dotPulse{0%,100%{transform:scaleX(1);}50%{transform:scaleX(1.3);}}

/* ── Reusable helpers ── */
.fade-up{animation:fadeUp .5s ease both;}
.scale-in{animation:scaleIn .4s ease both;}
.live-dot{width:8px;height:8px;border-radius:50%;background:${C.green};animation:pulse 1.8s ease-in-out infinite;display:inline-block;vertical-align:middle;}
.urgent-card{animation:urgentPulse 2s infinite;}
.pulse-timer{animation:blink 1.2s infinite;}
.hero-float{animation:heroFloat 7s ease-in-out infinite;}
.amber-glow{animation:amberGlow 4s ease-in-out infinite;}
.spin{animation:spin .8s linear infinite;}

/* ── Interactive states ── */
select option{background:${C.navyMid};}
input[type=checkbox]{accent-color:${C.amber};}
input[type=radio]{accent-color:${C.amber};}
button{-webkit-tap-highlight-color:transparent;}

/* ── Card styles ── */
.card-light{
  background:#FFFFFF;
  border:1px solid #E4EAF5;
  border-radius:16px;
  transition:box-shadow .25s ease,transform .25s ease,border-color .2s;
}
.card-light:hover{box-shadow:0 12px 40px rgba(13,27,62,.1);transform:translateY(-3px);border-color:#C8D5EC;}

/* ── Dropdown animation ── */
.dropdown-enter{animation:fadeUp .18s ease both;}

/* ── Nav link active ── */
.nav-link{position:relative;transition:color .2s;}
.nav-link::after{content:'';position:absolute;bottom:-2px;left:50%;right:50%;height:2px;background:${C.amber};transition:left .2s,right .2s;border-radius:2px;}
.nav-link:hover::after,.nav-link.active::after{left:0;right:0;}

/* ── Section dividers ── */
.divider{width:48px;height:3px;background:linear-gradient(90deg,${C.amber},${C.amberLight});border-radius:2px;margin:12px auto 0;}
.divider-left{margin:12px 0 0;}

/* ── Responsive grid helpers ── */
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:clamp(16px,3vw,32px);}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(14px,2.5vw,28px);}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(12px,2vw,24px);}
.grid-auto{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:clamp(14px,2.5vw,24px);}
.flex-center{display:flex;align-items:center;justify-content:center;}
.flex-between{display:flex;align-items:center;justify-content:space-between;}

/* ── Mobile responsive ── */
@media(max-width:768px){
  .grid-2,.grid-3,.grid-4{grid-template-columns:1fr;}
  .hide-mobile{display:none!important;}
  .hero-reg-card{display:none!important;}
  .nav-desktop-links{display:none!important;}
  .mobile-menu-btn{display:flex!important;}
  body{font-size:15px;}
}
@media(max-width:1024px){
  .grid-4{grid-template-columns:repeat(2,1fr);}
  .grid-3{grid-template-columns:repeat(2,1fr);}
}
@media(min-width:769px){
  .mobile-menu-btn{display:none!important;}
  .mobile-menu{display:none!important;}
}

/* ── Photo slider ── */
.slider-img{
  position:absolute;inset:0;
  background-size:cover;background-position:center;
  transition:opacity .8s cubic-bezier(.4,0,.2,1);
}
.slider-img.active{opacity:1;animation:kenBurns 7s ease-out both;}
.slider-img.inactive{opacity:0;}

/* ── Back to top ── */
.back-top{
  position:fixed;bottom:96px;left:24px;z-index:998;
  width:44px;height:44px;border-radius:50%;
  background:${C.navy};border:2px solid rgba(255,255,255,.15);
  color:#fff;font-size:18px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:all .25s;box-shadow:0 4px 20px rgba(13,27,62,.4);
}
.back-top:hover{background:${C.amber};color:${C.navy};border-color:${C.amber};}

/* ── Brussels Airlines-inspired homepage enhancements ── */
/* Clean white section separators with generous vertical rhythm */
.home-section{
  padding:clamp(64px,8vw,104px) clamp(16px,5vw,80px);
  position:relative;
}
/* Overline labels above section headings (Brussels Airlines style) */
.section-overline{
  font-family:'Inter',sans-serif;
  font-weight:700;
  font-size:10px;
  letter-spacing:0.14em;
  text-transform:uppercase;
  color:${C.amber};
  display:block;
  margin-bottom:12px;
}
/* Editorial section headings — Source Serif for gravitas */
.section-headline{
  font-family:'Source Serif 4',Georgia,serif;
  font-weight:700;
  font-size:clamp(26px,3.8vw,42px);
  line-height:1.1;
  letter-spacing:-0.02em;
  color:${C.navy};
}
.section-headline.light{color:#fff;}
/* Card hover lift (Brussels-style card interaction) */
.lift-card{
  transition:transform .22s cubic-bezier(.4,0,.2,1),box-shadow .22s;
}
.lift-card:hover{
  transform:translateY(-4px);
  box-shadow:0 16px 40px rgba(13,27,62,.15);
}
/* Quick-access bar (Brussels Airlines shortcut row style) */
.quick-bar{
  display:flex;
  border-top:1px solid rgba(13,27,62,0.09);
  border-bottom:1px solid rgba(13,27,62,0.09);
  background:#fff;
}
.quick-bar-item{
  flex:1;
  display:flex;
  align-items:center;
  gap:10px;
  padding:18px 24px;
  cursor:pointer;
  border-right:1px solid rgba(13,27,62,0.09);
  transition:background .18s;
  font-family:'Inter',sans-serif;
  font-size:13px;
  font-weight:500;
  color:${C.navy};
}
.quick-bar-item:last-child{border-right:none;}
.quick-bar-item:hover{background:#F4F6FA;}
/* Destination card – Brussels-style full bleed image card */
.dest-card{
  position:relative;
  border-radius:12px;
  overflow:hidden;
  cursor:pointer;
  aspect-ratio:4/3;
  background:${C.navy};
}
.dest-card-overlay{
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(13,27,62,0.85) 0%,rgba(13,27,62,0.2) 55%,transparent 100%);
  transition:opacity .3s;
}
.dest-card:hover .dest-card-overlay{opacity:0.7;}
/* Payment badges row */
.payment-row{
  display:flex;
  align-items:center;
  gap:10px;
  flex-wrap:wrap;
  padding:16px 0;
  border-top:1px solid rgba(13,27,62,0.08);
  margin-top:16px;
}
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

// ─── SEAT MAP (Ugandan Matatu — front-facing van) ─────────────────────
// Layout: Front view. Row 0 = driver + 2 passengers. Rows 1-4 = 3 seats each = 12. Total = 14.
// Seat numbering: P1=1, P2=2, then rows 1-4 left-to-right = 3,4,5 / 6,7,8 / 9,10,11 / 12,13,14
const SeatMap=({capacity=14,bookedSeats=[],reservedSeats=[],onSelect,selected=[],size="normal"})=>{
  const cellW=size==="small"?34:42, cellH=size==="small"?28:34, gap=size==="small"?5:7;
  const getSeatState=(n)=>{
    if(bookedSeats.includes(n)) return "booked";
    if(reservedSeats.includes(n)) return "reserved";
    if(selected.includes(n)) return "selected";
    return "free";
  };
  const colors={
    booked:{bg:C.red+"33",border:C.red,color:C.red,cursor:"not-allowed"},
    reserved:{bg:C.orange+"33",border:C.orange,color:C.orange,cursor:"not-allowed"},
    selected:{bg:C.amber,border:C.amberDark,color:"#0D1B3E",cursor:"pointer"},
    free:{bg:C.navyLight,border:C.navyBorder,color:C.textMuted,cursor:"pointer"}
  };
  const Seat=({n,label})=>{
    const st=getSeatState(n);
    const col=colors[st];
    return(
      <div onClick={()=>st==="free"&&onSelect&&onSelect(n)} title={st==="reserved"?"Reserved":st==="booked"?"Booked":"Seat "+n}
        style={{width:cellW,height:cellH,background:col.bg,border:`1.5px solid ${col.border}`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size==="small"?9:11,fontWeight:700,color:col.color,cursor:col.cursor,transition:"all .15s",position:"relative",flexShrink:0}}>
        {label||n}
        {/* seat back arc */}
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"70%",height:4,background:col.border+"66",borderRadius:"0 0 4px 4px"}}/>
      </div>
    );
  };
  const vanW=(cellW*3+gap*2)+80;
  return(
    <div style={{background:C.surface,border:`1px solid ${C.navyBorder}`,borderRadius:16,padding:16,display:"inline-block",userSelect:"none"}}>
      {/* Van outline — front facing */}
      <div style={{position:"relative",width:vanW,margin:"0 auto"}}>
        {/* Van body */}
        <svg width={vanW} height={26} viewBox={`0 0 ${vanW} 26`} style={{display:"block",marginBottom:4}}>
          {/* windshield */}
          <rect x="10" y="4" width={vanW-20} height="18" rx="6" fill={C.navyLight} stroke={C.navyBorder} strokeWidth="1.5"/>
          {/* windshield glare */}
          <rect x="18" y="7" width={vanW-60} height="10" rx="3" fill={C.amber+"18"}/>
          {/* headlights */}
          <rect x="12" y="8" width="16" height="10" rx="3" fill={C.amber+"88"}/>
          <rect x={vanW-28} y="8" width="16" height="10" rx="3" fill={C.amber+"88"}/>
          {/* grille */}
          <rect x={vanW/2-14} y="11" width="28" height="7" rx="2" fill={C.navyBorder}/>
          {[0,1,2,3].map(i=><line key={i} x1={vanW/2-12+i*8} y1="11" x2={vanW/2-12+i*8} y2="18" stroke={C.navy} strokeWidth="1.5"/>)}
        </svg>
        <div style={{fontSize:9,color:C.textMuted,textAlign:"center",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>↑ Front / Driver End</div>

        {/* FRONT ROW: Driver + 2 passengers */}
        <div style={{display:"flex",alignItems:"center",gap:gap,marginBottom:gap+2,justifyContent:"center"}}>
          {/* Driver */}
          <div style={{width:cellW,height:cellH,background:C.navyBorder+"66",border:`1.5px solid ${C.navyBorder}`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textMuted,flexShrink:0}}>🚗</div>
          {/* Aisle between driver and passengers */}
          <div style={{width:18}}/>
          {/* 2 front passenger seats */}
          {[1,2].map(n=><Seat key={n} n={n}/>)}
        </div>

        {/* DOOR LINE */}
        <div style={{borderTop:`1px dashed ${C.navyBorder}`,margin:`${gap}px 0`,position:"relative"}}>
          <span style={{position:"absolute",top:-8,right:0,fontSize:9,color:C.textMuted,background:C.surface,paddingLeft:4}}>door</span>
        </div>

        {/* ROWS 1–4: 3 passengers each */}
        {[[3,4,5],[6,7,8],[9,10,11],[12,13,14]].map((row,ri)=>(
          <div key={ri} style={{display:"flex",gap:gap,marginBottom:gap,justifyContent:"center"}}>
            {row.map((n,ci)=>{
              if(n>capacity) return <div key={n} style={{width:cellW,height:cellH}}/>;
              return(
                <React.Fragment key={n}>
                  {ci===2&&<div style={{width:14}}/>}
                  <Seat n={n}/>
                </React.Fragment>
              );
            })}
          </div>
        ))}

        {/* Rear */}
        <div style={{borderTop:`1px dashed ${C.navyBorder}`,marginTop:4,paddingTop:4,fontSize:9,color:C.textMuted,textAlign:"center",letterSpacing:1,textTransform:"uppercase"}}>↓ Rear</div>
      </div>

      {/* Legend */}
      <div style={{display:"flex",gap:10,marginTop:10,fontSize:10,flexWrap:"wrap",justifyContent:"center"}}>
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

// ─── HERO REGISTRATION CARD ──────────────────────────────────────────
const HeroRegCard=({store,setPage})=>{
  const [mode,setMode]=useState("choice"); // choice | login | register | otp | done
  const [form,setForm]=useState({name:"",phone:"",email:"",password:""});
  const [loginEmail,setLoginEmail]=useState("");
  const [otp,setOtp]=useState("");
  const [sentOtp,setSentOtp]=useState("");
  const [otpFor,setOtpFor]=useState(null);
  const [err,setErr]=useState("");
  const [loggedIn,setLoggedIn]=useState(null);

  const sendOtp=(cust)=>{
    const code=String(Math.floor(100000+Math.random()*900000));
    setSentOtp(code); setOtpFor(cust); setErr("");
    setMode("otp");
  };

  const handleLoginLookup=()=>{
    setErr("");
    const cust=store.findCustomer(loginEmail);
    if(!cust){setErr("No account found. Please register.");return;}
    sendOtp(cust);
  };

  const handleVerify=()=>{
    if(otp.trim()!==sentOtp){setErr("Incorrect OTP. Try again.");return;}
    if(!store.findCustomer(otpFor.email)) store.addCustomer({...otpFor,verified:true});
    const final=store.findCustomer(otpFor.email)||{...otpFor,verified:true};
    setLoggedIn(final); setMode("done"); setErr("");
  };

  if(loggedIn&&mode==="done") return(
    <div style={{background:"rgba(255,255,255,0.07)",backdropFilter:"blur(20px)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:20,padding:"24px 22px",width:300,animation:"fadeUp .4s ease",flexShrink:0}}>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>👤</div>
        <div className="ral" style={{fontWeight:900,fontSize:16,color:"#fff",marginBottom:2}}>Welcome, {loggedIn.name.split(" ")[0]}!</div>
        <div style={{fontSize:11,color:"rgba(168,186,218,0.7)"}}>You're logged in</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <Btn onClick={()=>setPage("book")} full style={{fontSize:12,padding:"11px"}}>🎫 Book a Seat</Btn>
        <Btn onClick={()=>setPage("plan")} full variant="navy" style={{fontSize:12,padding:"11px",border:"1px solid rgba(255,255,255,0.2)"}}>📅 Plan Journey</Btn>
        <button onClick={()=>{setLoggedIn(null);setMode("choice");setForm({name:"",phone:"",email:"",password:""});}}
          style={{background:"none",border:"none",color:"rgba(168,186,218,0.6)",fontSize:11,cursor:"pointer",marginTop:4,textDecoration:"underline",fontFamily:"'Nunito',sans-serif"}}>Switch account</button>
      </div>
    </div>
  );

  return(
    <div style={{background:"rgba(255,255,255,0.07)",backdropFilter:"blur(20px)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:20,padding:"22px 20px",width:300,animation:"fadeUp .5s ease",flexShrink:0}}>
      <div style={{marginBottom:16}}>
        <div className="ral" style={{fontWeight:900,fontSize:16,color:"#fff",marginBottom:3}}>
          {mode==="choice"&&"Create your account"}
          {mode==="register"&&"Register Free"}
          {mode==="login"&&"Sign In"}
          {mode==="otp"&&"Verify your email"}
        </div>
        <div style={{fontSize:11,color:"rgba(168,186,218,0.65)"}}>
          {mode==="choice"&&"Save your bookings & get faster checkout"}
          {mode==="register"&&"Fill in your details below"}
          {mode==="login"&&"Enter your email to continue"}
          {mode==="otp"&&`OTP sent to ${otpFor?.email}`}
        </div>
      </div>

      {err&&<div style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:8,padding:"7px 11px",fontSize:11,color:"#FCA5A5",marginBottom:10}}>{err}</div>}

      {mode==="choice"&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <Btn onClick={()=>{setMode("register");setErr("");}} full style={{fontSize:13,padding:"12px",boxShadow:`0 4px 16px ${C.amber}44`}}>✨ Register Free</Btn>
          <Btn onClick={()=>{setMode("login");setErr("");}} full variant="navy" style={{fontSize:13,padding:"12px",border:"1px solid rgba(255,255,255,0.2)"}}>🔑 Sign In</Btn>
          <button onClick={()=>setPage("book")} style={{background:"none",border:"none",color:"rgba(168,186,218,0.55)",fontSize:11,cursor:"pointer",marginTop:4,fontFamily:"'Nunito',sans-serif",textAlign:"center"}}>
            Continue as guest →
          </button>
        </div>
      )}

      {mode==="register"&&(
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {[["Full Name","name","text","Sarah Nakato"],["Phone","phone","tel","+256 7XX XXX XXX"],["Email","email","email","your@email.com"]].map(([label,key,type,ph])=>(
            <div key={key}>
              <div style={{fontSize:10,color:"rgba(168,186,218,0.7)",fontWeight:700,letterSpacing:.5,textTransform:"uppercase",marginBottom:4}}>{label}</div>
              <input type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={ph}
                style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:9,padding:"9px 12px",color:"#fff",fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"'Nunito',sans-serif"}}
                onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.15)"}/>
            </div>
          ))}
          <Btn onClick={()=>{
            setErr("");
            if(!form.name||!form.phone||!form.email){setErr("All fields required.");return;}
            if(store.findCustomer(form.email)){setErr("Account exists. Sign in instead.");return;}
            sendOtp({name:form.name,phone:form.phone,email:form.email});
          }} full style={{fontSize:13,padding:"11px",marginTop:4}}>Send OTP →</Btn>
          <button onClick={()=>{setMode("choice");setErr("");}} style={{background:"none",border:"none",color:"rgba(168,186,218,0.5)",fontSize:11,cursor:"pointer",fontFamily:"'Nunito',sans-serif",textAlign:"center"}}>← Back</button>
        </div>
      )}

      {mode==="login"&&(
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          <div>
            <div style={{fontSize:10,color:"rgba(168,186,218,0.7)",fontWeight:700,letterSpacing:.5,textTransform:"uppercase",marginBottom:4}}>Email</div>
            <input type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} placeholder="your@email.com"
              style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:9,padding:"9px 12px",color:"#fff",fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"'Nunito',sans-serif"}}
              onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.15)"}/>
          </div>
          <Btn onClick={handleLoginLookup} disabled={!loginEmail} full style={{fontSize:13,padding:"11px"}}>Send OTP →</Btn>
          <button onClick={()=>{setMode("choice");setErr("");}} style={{background:"none",border:"none",color:"rgba(168,186,218,0.5)",fontSize:11,cursor:"pointer",fontFamily:"'Nunito',sans-serif",textAlign:"center"}}>← Back</button>
        </div>
      )}

      {mode==="otp"&&(
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          <div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:8,padding:"8px 11px",fontSize:11,color:"rgba(134,239,172,0.9)"}}>
            Demo OTP: <strong style={{letterSpacing:2}}>{sentOtp}</strong>
          </div>
          <div>
            <div style={{fontSize:10,color:"rgba(168,186,218,0.7)",fontWeight:700,letterSpacing:.5,textTransform:"uppercase",marginBottom:4}}>Enter OTP</div>
            <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="6-digit code" maxLength={6}
              style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:9,padding:"9px 12px",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Raleway',sans-serif",fontWeight:700,letterSpacing:4,textAlign:"center"}}
              onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.15)"}/>
          </div>
          <Btn onClick={handleVerify} disabled={otp.length<6} full style={{fontSize:13,padding:"11px"}}>✓ Verify &amp; Continue</Btn>
          <button onClick={()=>setMode("choice")} style={{background:"none",border:"none",color:"rgba(168,186,218,0.5)",fontSize:11,cursor:"pointer",fontFamily:"'Nunito',sans-serif",textAlign:"center"}}>← Start over</button>
        </div>
      )}
    </div>
  );
};

// ─── BACK TO TOP ─────────────────────────────────────────────────────
const BackToTop=()=>{
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const onScroll=()=>setVisible(window.scrollY>400);
    window.addEventListener("scroll",onScroll,{passive:true});
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);
  const scrollTop=()=>window.scrollTo({top:0,behavior:"smooth"});
  if(!visible) return null;
  return(
    <button onClick={scrollTop} aria-label="Back to top" title="Back to top" className="back-top" style={{opacity:visible?1:0,transition:"opacity .3s,background .2s,transform .2s"}}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
      onMouseLeave={e=>e.currentTarget.style.transform=""}>
      ↑
    </button>
  );
};

// ─── RAY CHATBOT ─────────────────────────────────────────────────────
const RAY_RESPONSES={
  greet:["Hi! I'm Ray 👋 Your Raylane Express assistant. How can I help you today?"],
  book:["To book a seat, click **Book Now** in the menu or tap the button on the homepage. You can choose your route, seat, and pay via MTN MoMo or Airtel Money."],
  schedule:["You can view all departures on our **Schedule** page. Trips run daily from multiple cities across Uganda."],
  routes:["We connect Kampala, Gulu, Mbarara, Mbale, Fort Portal, Arua, Jinja and more — in both directions! Check the Schedule page for live availability."],
  price:["Fares start from UGX 15,000 (Kampala ↔ Jinja) up to UGX 50,000 (Kampala ↔ Arua). Check the Schedule for exact fares per route."],
  hire:["You can hire a van for private groups, religious events, school transport, corporate travel, and airport transfers. Go to **Hire a Van** in the Products menu to get a quote."],
  parcel:["Send parcels on any of our trips! Visit the **Courier** section to book and track your parcel. Pricing starts from UGX 5,000 for up to 2kg."],
  payment:["We accept MTN Mobile Money, Airtel Money, and cash. You'll receive your ticket via WhatsApp once payment is confirmed."],
  safety:["Safety is our #1 priority. All drivers are vetted, vehicles are maintained, and we share driver details with passengers before every trip."],
  cancel:["For cancellations or changes, please call us directly on +256 700 000000 or WhatsApp us. Refunds depend on how far in advance you cancel."],
  contact:["📞 +256 700 000000\n📧 info@raylane.ug\n📍 Nakasero, Kampala\n🕐 Mon–Sun 5AM–10PM"],
  default:["I'm not sure about that — could you rephrase? You can also call us on +256 700 000000 or check our FAQ page for more help."],
};

const getResponse=(msg)=>{
  const m=msg.toLowerCase();
  if(/hi|hello|hey|good|greet|morning|evening|afternoon/.test(m)) return RAY_RESPONSES.greet[0];
  if(/book|seat|ticket|reserve/.test(m)) return RAY_RESPONSES.book[0];
  if(/schedule|depart|time|when/.test(m)) return RAY_RESPONSES.schedule[0];
  if(/route|city|go|travel|kampala|gulu|mbale|mbarara|jinja|arua|fort/.test(m)) return RAY_RESPONSES.routes[0];
  if(/price|cost|fare|how much|cheap/.test(m)) return RAY_RESPONSES.price[0];
  if(/hire|van|group|church|school|corporate|airport/.test(m)) return RAY_RESPONSES.hire[0];
  if(/parcel|courier|send|package|deliver/.test(m)) return RAY_RESPONSES.parcel[0];
  if(/pay|mtn|airtel|money|mobile/.test(m)) return RAY_RESPONSES.payment[0];
  if(/safe|safety|driver|secure/.test(m)) return RAY_RESPONSES.safety[0];
  if(/cancel|refund|change|reschedule/.test(m)) return RAY_RESPONSES.cancel[0];
  if(/contact|phone|email|address|reach/.test(m)) return RAY_RESPONSES.contact[0];
  return RAY_RESPONSES.default[0];
};

const RayChatbot=({setPage})=>{
  const [open,setOpen]=useState(false);
  const [msgs,setMsgs]=useState([{from:"ray",text:"Hi! I'm **Ray** 👋 Your Raylane Express assistant. Ask me about routes, bookings, fares, or anything else!"}]);
  const [input,setInput]=useState("");
  const [typing,setTyping]=useState(false);
  const bottomRef=useRef(null);

  useEffect(()=>{
    if(open&&bottomRef.current) bottomRef.current.scrollIntoView({behavior:"smooth"});
  },[msgs,open]);

  const QUICK=[{label:"📋 Routes",q:"What routes do you have?"},{label:"💰 Fares",q:"How much does it cost?"},{label:"🚐 Hire a Van",q:"I want to hire a van"},{label:"📞 Contact",q:"How do I contact you?"}];

  const send=(text)=>{
    const msg=text||input.trim();
    if(!msg) return;
    setInput("");
    setMsgs(prev=>[...prev,{from:"user",text:msg}]);
    setTyping(true);
    setTimeout(()=>{
      const resp=getResponse(msg);
      setMsgs(prev=>[...prev,{from:"ray",text:resp}]);
      setTyping(false);
    },700+Math.random()*400);
  };

  const renderText=(t)=>t.split(/\*\*(.+?)\*\*/g).map((part,i)=>i%2===1?<strong key={i}>{part}</strong>:<span key={i}>{part.split("\n").map((line,j)=><span key={j}>{line}{j<part.split("\n").length-1&&<br/>}</span>)}</span>);

  return(
    <>
      {/* Floating button */}
      <div onClick={()=>setOpen(o=>!o)} style={{position:"fixed",bottom:24,right:24,zIndex:999,width:58,height:58,borderRadius:"50%",background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,boxShadow:`0 8px 30px ${C.amber}55`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .2s",animation:"blink 3s ease-in-out infinite"}}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        {open
          ? <span style={{fontSize:22,color:"#0D1B3E",fontWeight:900}}>✕</span>
          : <span style={{fontSize:26}}>💬</span>
        }
        {!open&&<div style={{position:"absolute",top:-2,right:-2,width:16,height:16,borderRadius:"50%",background:C.green,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",fontWeight:900}}>●</div>}
      </div>

      {/* Chat window */}
      {open&&(
        <div style={{position:"fixed",bottom:96,right:24,zIndex:998,width:340,maxHeight:500,borderRadius:20,background:C.navy,border:"1.5px solid rgba(255,255,255,0.12)",boxShadow:"0 24px 80px rgba(0,0,0,0.5)",display:"flex",flexDirection:"column",overflow:"hidden",animation:"fadeUp .2s ease"}}>
          {/* Header */}
          <div style={{background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,padding:"14px 18px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🤖</div>
            <div>
              <div className="ral" style={{fontWeight:900,fontSize:15,color:"#0D1B3E"}}>Ray</div>
              <div style={{fontSize:10,color:"rgba(13,27,62,0.7)",display:"flex",alignItems:"center",gap:4}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#15803D",display:"inline-block"}}/>Online · Raylane Express Assistant
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{flex:1,overflowY:"auto",padding:"14px 14px 8px",display:"flex",flexDirection:"column",gap:10,maxHeight:280}}>
            {msgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start"}}>
                {m.from==="ray"&&<div style={{width:26,height:26,borderRadius:"50%",background:C.amber,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0,marginRight:7,alignSelf:"flex-end"}}>R</div>}
                <div style={{background:m.from==="user"?C.amber:C.card,color:m.from==="user"?"#0D1B3E":"#fff",borderRadius:m.from==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"9px 13px",maxWidth:"78%",fontSize:12,lineHeight:1.6}}>
                  {renderText(m.text)}
                </div>
              </div>
            ))}
            {typing&&(
              <div style={{display:"flex",alignItems:"flex-end",gap:7}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:C.amber,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>R</div>
                <div style={{background:C.card,borderRadius:"16px 16px 16px 4px",padding:"10px 14px",display:"flex",gap:4,alignItems:"center"}}>
                  {[0,1,2].map(d=><div key={d} style={{width:6,height:6,borderRadius:"50%",background:C.amber,animation:`pulse 1s ${d*0.2}s infinite`}}/>)}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Quick replies */}
          <div style={{padding:"0 12px 8px",display:"flex",gap:6,flexWrap:"wrap"}}>
            {QUICK.map(q=>(
              <button key={q.label} onClick={()=>send(q.q)} style={{background:"rgba(245,166,35,0.12)",border:"1px solid rgba(245,166,35,0.3)",color:C.amber,borderRadius:20,padding:"4px 10px",fontSize:10,cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:700,transition:"background .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(245,166,35,0.22)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(245,166,35,0.12)"}>
                {q.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{padding:"8px 12px 12px",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",gap:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send();}}
              placeholder="Ask Ray anything..." style={{flex:1,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,padding:"9px 13px",color:"#fff",fontSize:12,outline:"none",fontFamily:"'Nunito',sans-serif"}}
              onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"}/>
            <button onClick={()=>send()} style={{width:38,height:38,borderRadius:"50%",background:C.amber,border:"none",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

// ─── NAVIGATION ───────────────────────────────────────────────────────
const Nav=({page,setPage,currentUser})=>{
  const [openMenu,setOpenMenu]=useState(null);
  const navRef=useRef(null);

  useEffect(()=>{
    const handler=(e)=>{if(navRef.current&&!navRef.current.contains(e.target))setOpenMenu(null);};
    document.addEventListener("mousedown",handler);
    return()=>document.removeEventListener("mousedown",handler);
  },[]);

  const go=(id)=>{setPage(id);setOpenMenu(null);};

  const DD=({id,label,children})=>(
    <div style={{position:"relative"}} onMouseEnter={()=>setOpenMenu(id)} onMouseLeave={()=>setOpenMenu(null)}>
      <button style={{background:openMenu===id||page===id?"rgba(245,166,35,0.15)":"transparent",color:openMenu===id||page===id?C.amber:"rgba(255,255,255,0.8)",border:openMenu===id?"1px solid rgba(245,166,35,0.3)":"1px solid transparent",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif",fontWeight:600,transition:"all .2s",letterSpacing:"0.02em",display:"flex",alignItems:"center",gap:5}}>
        {label}<span style={{fontSize:8,opacity:.7,marginTop:1}}>▼</span>
      </button>
      {openMenu===id&&(
        <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,background:"#0D1B3E",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"8px 0",minWidth:200,boxShadow:"0 20px 60px rgba(0,0,0,0.5)",zIndex:200,animation:"fadeUp .15s ease"}}>
          {children}
        </div>
      )}
    </div>
  );

  const DItem=({icon,label,sub,onClick,danger})=>(
    <div onClick={onClick} style={{padding:"10px 18px",cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start",transition:"background .15s"}}
      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <span style={{fontSize:16,flexShrink:0,marginTop:1}}>{icon}</span>
      <div>
        <div style={{fontSize:13,fontWeight:700,color:danger?"#F87171":"#fff"}}>{label}</div>
        {sub&&<div style={{fontSize:11,color:"rgba(168,186,218,0.6)",marginTop:1,lineHeight:1.4}}>{sub}</div>}
      </div>
    </div>
  );

  const Divider=()=><div style={{height:1,background:"rgba(255,255,255,0.07)",margin:"4px 0"}}/>;

  return(
    <nav ref={navRef} style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"#0D1B3Eee",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 20px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div onClick={()=>go("home")} style={{cursor:"pointer",display:"flex",alignItems:"center"}}>
          <RaylaneLogo height={36}/>
        </div>

        <div style={{display:"flex",gap:2,alignItems:"center"}}>
          {/* Home */}
          <button onClick={()=>go("home")} style={{background:page==="home"?"rgba(245,166,35,0.15)":"transparent",color:page==="home"?C.amber:"rgba(255,255,255,0.8)",border:page==="home"?"1px solid rgba(245,166,35,0.3)":"1px solid transparent",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontFamily:"'Nunito',sans-serif",fontWeight:700,transition:"all .2s"}}>Home</button>

          {/* Schedule */}
          <button onClick={()=>go("schedule")} style={{background:page==="schedule"?"rgba(245,166,35,0.15)":"transparent",color:page==="schedule"?C.amber:"rgba(255,255,255,0.8)",border:page==="schedule"?"1px solid rgba(245,166,35,0.3)":"1px solid transparent",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontFamily:"'Nunito',sans-serif",fontWeight:700,transition:"all .2s"}}>Schedule</button>

          {/* Products dropdown */}
          <DD id="products" label="Products">
            <DItem icon="🎫" label="Book Now" sub="Reserve your seat instantly" onClick={()=>go("book")}/>
            <DItem icon="📅" label="Plan Your Journey" sub="Advance booking up to 60 days" onClick={()=>go("plan")}/>
            <DItem icon="🚐" label="Hire a Van" sub="Private & group transport" onClick={()=>go("hire")}/>
            <DItem icon="📦" label="Courier / Parcel" sub="Send parcels across Uganda" onClick={()=>go("parcel")}/>
          </DD>

          {/* About Us dropdown */}
          <DD id="about" label="About Us">
            <DItem icon="🏢" label="About Raylane" sub="Our story, mission & values" onClick={()=>go("about")}/>
            <Divider/>
            <DItem icon="🛡️" label="Safety" sub="Passenger safety guidelines" onClick={()=>go("safety")}/>
            <DItem icon="❓" label="FAQ" sub="Frequently asked questions" onClick={()=>go("faq")}/>
            <DItem icon="💼" label="Careers & Jobs" sub="Join our growing team" onClick={()=>go("careers")}/>
          </DD>

          <div style={{width:1,height:20,background:"rgba(255,255,255,0.12)",margin:"0 6px"}}/>

          {currentUser?(
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:12,color:C.amber,fontWeight:700}}>👤 {currentUser.name}</span>
              <Btn onClick={()=>go("customer-portal")} variant="navy" style={{padding:"6px 14px",fontSize:11,border:"1px solid rgba(255,255,255,0.15)"}}>My Account</Btn>
              <Btn onClick={()=>go("logout")} variant="navy" style={{padding:"6px 12px",fontSize:11,border:"1px solid rgba(255,255,255,0.15)"}}>Logout</Btn>
            </div>
          ):(
            <Btn onClick={()=>go("customer-portal")} style={{padding:"7px 16px",fontSize:12,background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,color:C.navy,border:"none",boxShadow:`0 3px 12px ${C.amber}44`}}>Login / Register</Btn>
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
// ─── HERO PHOTO SLIDER ───────────────────────────────────────────────
const HeroSlider=({images,store})=>{
  const [idx,setIdx]=useState(0);
  const [paused,setPaused]=useState(false);
  const timerRef=useRef(null);
  const defaultSlides=[
    {id:"d1",url:"",gradient:`linear-gradient(135deg,#0D1B3E 0%,#1A2E5A 60%,#0D1B3E 100%)`,caption:"Safe Journeys Across Uganda",sub:"Connecting families, businesses and communities every day"},
    {id:"d2",url:"",gradient:`linear-gradient(135deg,#0D1B3E 0%,#132347 50%,#243660 100%)`,caption:"Comfort You Can Count On",sub:"Modern vehicles · Verified drivers · On-time departures"},
    {id:"d3",url:"",gradient:`linear-gradient(135deg,#132347 0%,#0D1B3E 60%,#1A2E5A 100%)`,caption:"Book in Under 2 Minutes",sub:"MTN MoMo · Airtel Money · WhatsApp ticket delivery"},
  ];
  const slides=(images&&images.length>0)?images.map(img=>({...img,caption:img.caption||"",sub:img.subcaption||""})):defaultSlides;
  const total=slides.length;
  const startTimer=useCallback(()=>{clearInterval(timerRef.current);timerRef.current=setInterval(()=>setIdx(i=>(i+1)%total),6000);},[total]);
  useEffect(()=>{if(!paused)startTimer();return()=>clearInterval(timerRef.current);},[paused,startTimer]);
  const go=(n)=>{setIdx((n+total)%total);startTimer();};
  return(
    <div style={{position:"absolute",inset:0,overflow:"hidden"}} onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
      {slides.map((s,i)=>(
        <div key={s.id||i} style={{position:"absolute",inset:0,backgroundImage:s.url?`url(${s.url})`:s.gradient,backgroundSize:"cover",backgroundPosition:"center",opacity:i===idx?1:0,transition:"opacity .9s cubic-bezier(.4,0,.2,1)",animation:i===idx?"kenBurns 8s ease-out both":"none",zIndex:i===idx?1:0}}/>
      ))}
      <div style={{position:"absolute",inset:0,zIndex:2,background:`linear-gradient(108deg,#0D1B3EF5 0%,#0D1B3ECC 42%,#0D1B3E66 70%,transparent 100%)`}}/>
      {slides[idx]?.caption&&(
        <div style={{position:"absolute",bottom:84,left:0,right:0,zIndex:4,pointerEvents:"none",padding:"0 clamp(20px,5vw,48px)",maxWidth:1280,margin:"0 auto"}}>
          <div key={idx} style={{animation:"fadeUp .5s ease both",maxWidth:500}}>
            <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(245,166,35,0.9)",marginBottom:8}}>Raylane Express</div>
            <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:"clamp(17px,2.2vw,24px)",color:"rgba(255,255,255,0.95)",lineHeight:1.3,marginBottom:5}}>{slides[idx].caption}</div>
            {slides[idx].sub&&<div style={{fontSize:"clamp(11px,1.3vw,13px)",color:"rgba(168,186,218,0.8)",fontFamily:"'Inter',sans-serif"}}>{slides[idx].sub}</div>}
          </div>
        </div>
      )}
      {total>1&&<>
        <button aria-label="Previous slide" onClick={()=>go(idx-1)} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",zIndex:5,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.1)",backdropFilter:"blur(6px)",border:"1px solid rgba(255,255,255,0.18)",color:"#fff",cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",lineHeight:1}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(245,166,35,0.85)";e.currentTarget.style.color="#0D1B3E";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.color="#fff";}}>‹</button>
        <button aria-label="Next slide" onClick={()=>go(idx+1)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",zIndex:5,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.1)",backdropFilter:"blur(6px)",border:"1px solid rgba(255,255,255,0.18)",color:"#fff",cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",lineHeight:1}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(245,166,35,0.85)";e.currentTarget.style.color="#0D1B3E";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.color="#fff";}}>›</button>
      </>}
      <div style={{position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:5,display:"flex",alignItems:"center",gap:7}}>
        {slides.map((_,i)=>(
          <button key={i} aria-label={`Slide ${i+1}`} onClick={()=>go(i)} style={{padding:0,border:"none",background:"transparent",cursor:"pointer"}}>
            <div style={{height:3,borderRadius:4,transition:"all .4s ease",background:i===idx?"rgba(245,166,35,0.95)":"rgba(255,255,255,0.35)",width:i===idx?28:10,boxShadow:i===idx?"0 0 8px rgba(245,166,35,0.7)":"none"}}/>
          </button>
        ))}
        <span style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginLeft:4,fontFamily:"'Inter',sans-serif"}}>{idx+1}/{total}</span>
      </div>
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:3}}>
        {[...Array(10)].map((_,i)=>(<div key={i} style={{position:"absolute",left:`${8+i*9}%`,bottom:`${(i*27)%75}%`,width:i%3===0?3:2,height:i%3===0?3:2,borderRadius:"50%",background:i%3===0?"rgba(245,166,35,0.6)":i%3===1?"rgba(59,130,246,0.5)":"rgba(255,255,255,0.4)",animation:`particleDrift ${7+i*1.1}s ease-in-out ${i*.5}s infinite`}}/>))}
      </div>
    </div>
  );
};

const AdminSlideManager=({store})=>(
  <div>
    <p style={{fontSize:12,color:C.textMuted,marginBottom:14,lineHeight:1.7}}>Upload up to 4 photos for the homepage hero slideshow. Add captions and sub-captions for each slide. Slides transition sideways every 6 seconds with Ken Burns effect.</p>
    {store.heroImages.length<4&&(
      <label style={{display:"flex",alignItems:"center",gap:12,background:C.amber+"18",border:`1.5px dashed ${C.amber}66`,borderRadius:12,padding:"14px 16px",cursor:"pointer",marginBottom:14,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background=C.amber+"28"} onMouseLeave={e=>e.currentTarget.style.background=C.amber+"18"}>
        <span style={{fontSize:24}}>🖼️</span>
        <div><div style={{fontWeight:700,fontSize:13,color:C.amber}}>Upload slide {store.heroImages.length+1} of 4</div><div style={{fontSize:11,color:C.textMuted}}>JPG, PNG, WebP</div></div>
        <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>store.addHeroImage(ev.target.result,file.name);reader.readAsDataURL(file);e.target.value="";}}/>
      </label>
    )}
    {store.heroImages.length===0?(
      <div style={{textAlign:"center",padding:"18px",color:C.textMuted,fontSize:12,border:`1px dashed ${C.navyBorder}`,borderRadius:10}}>No slides uploaded. Default gradient slides with built-in captions will show.</div>
    ):(
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {store.heroImages.map((img,i)=>(
          <div key={img.id} style={{background:C.navyMid,borderRadius:12,padding:"12px 14px",border:`1px solid ${C.navyBorder}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{background:C.amber,borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:C.navy,flexShrink:0}}>{i+1}</div>
              <img src={img.url} alt="" style={{width:56,height:38,objectFit:"cover",borderRadius:6,border:`1px solid ${C.navyBorder}`}}/>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:C.white}}>{img.name}</div><div style={{fontSize:10,color:C.textMuted}}>Slide {i+1} · 6s · Ken Burns</div></div>
              <button onClick={()=>store.removeHeroImage(img.id)} style={{background:"none",border:`1px solid ${C.red}44`,color:C.red,borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:11,flexShrink:0}}>✕</button>
            </div>
          </div>
        ))}
        <div style={{fontSize:11,color:C.green,marginTop:2}}>✓ {store.heroImages.length}/4 slides · Slideshow active</div>
      </div>
    )}
  </div>
);

const FloatingParticles=()=>(
  <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:1}}>
    {[...Array(14)].map((_,i)=>(
      <div key={i} style={{position:"absolute",left:`${10+i*6.5}%`,bottom:`${(i*23)%80}%`,width:i%3===0?3:2,height:i%3===0?3:2,borderRadius:"50%",background:i%4===0?C.amber:i%4===1?C.blue:C.white,opacity:.25+i*.02,animation:`particleDrift ${6+i*1.2}s ease-in-out ${i*.4}s infinite`}}/>
    ))}
  </div>
);

const HomePage=({setPage,setPreselectedTrip,store,setLoginRole=()=>{}})=>{
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

  // Sort trips by departure, pick the 2 soonest non-departed
  const urgentTrips=store.trips
    .filter(t=>new Date(t.departure_time)>new Date())
    .sort((a,b)=>new Date(a.departure_time)-new Date(b.departure_time))
    .slice(0,2);

  return(
    <div style={{minHeight:"100vh",paddingTop:64,background:"#F4F6FA"}}>
      {/* ── HERO with Photo Slider ── */}
      <section aria-label="Hero" style={{position:"relative",minHeight:"clamp(520px,80vh,780px)",display:"flex",alignItems:"center",overflow:"hidden",background:C.navy}}>
        {/* Photo slider — uses uploaded images or defaults */}
        <HeroSlider images={store.heroImages}/>

        {/* Subtle mesh overlay */}
        <div style={{position:"absolute",inset:0,zIndex:3,pointerEvents:"none",opacity:.04}}>
          <svg style={{width:"100%",height:"100%"}} preserveAspectRatio="none">
            <defs><pattern id="mesh" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 0L0 0 0 56" fill="none" stroke="#fff" strokeWidth=".5"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#mesh)"/>
          </svg>
        </div>

        {/* Hero content */}
        <div style={{maxWidth:1280,margin:"0 auto",position:"relative",width:"100%",padding:"clamp(72px,10vw,120px) clamp(20px,5vw,48px) clamp(96px,12vw,140px)",zIndex:5}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr minmax(0,320px)",gap:"clamp(24px,4vw,56px)",alignItems:"center"}}>

            {/* Left — copy + CTAs */}
            <div style={{animation:"fadeUp .5s ease both"}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(34,197,94,0.14)",border:"1px solid rgba(34,197,94,0.28)",borderRadius:99,padding:"5px 16px",marginBottom:24,fontSize:11,color:C.green,fontWeight:700,letterSpacing:"0.04em"}}>
                <span className="live-dot" style={{marginRight:2}}/> Live &nbsp;·&nbsp; {store.trips.filter(t=>store.seatsAvailable(t)>0).length} trips available today
              </div>
              <h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:"clamp(32px,5vw,62px)",lineHeight:1.04,letterSpacing:"-0.02em",marginBottom:18,color:"#FFFFFF"}}>
                Connecting Uganda<br/><span style={{color:C.amber}} className="amber-glow">in a Safe, Reliable</span><br/>& Timely Manner
              </h1>
              <p style={{fontFamily:"'Inter',sans-serif",fontSize:"clamp(14px,1.8vw,16px)",color:"rgba(168,186,218,0.92)",maxWidth:500,lineHeight:1.85,marginBottom:32}}>
                Whether it's business, a family getaway, or just anything — opportunities await you. <strong style={{color:"rgba(255,255,255,0.95)"}}>We take you wherever life takes you.</strong>
              </p>
              <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:28}}>
                <Btn onClick={()=>setPage("book")} style={{fontSize:14,padding:"14px 28px",boxShadow:`0 8px 28px ${C.amber}55`,borderRadius:12}}>Book Your Seat</Btn>
                <Btn onClick={()=>setPage("hire")} style={{fontSize:14,padding:"14px 24px",background:"transparent",color:C.amber,border:`1.5px solid rgba(245,166,35,0.6)`,boxShadow:"none",borderRadius:12}}>Hire a Van</Btn>
                <Btn onClick={()=>setPage("schedule")} variant="navy" style={{fontSize:14,padding:"14px 22px",border:"1px solid rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",borderRadius:12}}>Schedule</Btn>
              </div>
              <div role="list" style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                <MTNLogo pill/>
                <AirtelLogo pill/>
                <WhatsAppBadge/>
              </div>
            </div>



          </div>
        </div>

        {/* Bottom fade */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:60,background:`linear-gradient(to bottom,transparent,#F4F6FA)`,zIndex:6,pointerEvents:"none"}}/>
      </section>

      {/* DEPARTURES TICKER BAR */}
      <div role="complementary" aria-label="Live departures" style={{background:C.navy,borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"0 clamp(16px,4vw,40px)"}}>
        <div style={{maxWidth:1280,margin:"0 auto",height:48,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span className="live-dot" aria-hidden="true"/>
            <span style={{fontFamily:"'Inter',sans-serif",fontWeight:700,color:C.amber,fontSize:12,letterSpacing:"0.06em",whiteSpace:"nowrap",textTransform:"uppercase"}}>Live Departures</span>
            <span style={{color:"rgba(255,255,255,0.45)",fontSize:12,fontFamily:"'Inter',sans-serif",whiteSpace:"nowrap"}}>— {store.trips.length} trips today</span>
          </div>
          <button onClick={()=>setPage("schedule")} style={{background:"rgba(245,166,35,0.12)",border:"1px solid rgba(245,166,35,0.3)",color:C.amber,borderRadius:8,padding:"7px 16px",cursor:"pointer",fontSize:11,fontFamily:"'Inter',sans-serif",fontWeight:700,whiteSpace:"nowrap",transition:"all .2s",letterSpacing:"0.04em",flexShrink:0}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(245,166,35,0.22)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(245,166,35,0.12)";}}>Full Schedule →</button>
        </div>
      </div>

      {/* NEXT DEPARTURES */}
      <section aria-label="Next departures" style={{background:"#F4F6FA",padding:"clamp(40px,5vw,72px) clamp(16px,4vw,40px)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"clamp(24px,3vw,36px)",flexWrap:"wrap",gap:12}}>
            <div>
              <p style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:C.amber,marginBottom:8}}>Available Now</p>
              <h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:"clamp(22px,3vw,34px)",color:C.navy,lineHeight:1.15}}>Next Departures</h2>
            </div>
            <button onClick={()=>setPage("schedule")} style={{background:"transparent",border:`1.5px solid ${C.navyBorder}`,color:C.textMuted,borderRadius:10,padding:"9px 20px",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:12,transition:"all .2s",whiteSpace:"nowrap"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.navy;e.currentTarget.style.color=C.navy;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.navyBorder;e.currentTarget.style.color=C.textMuted;}}>View all {store.trips.length} trips →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"clamp(14px,2vw,24px)"}}>
            {urgentTrips.length>0
              ? urgentTrips.map((trip,i)=><TripCard key={trip.id} trip={trip} i={i} onBook={handleBook} store={store}/>)
              : <div style={{color:C.textMuted,fontSize:14,padding:"32px 0",gridColumn:"1/-1",textAlign:"center",fontFamily:"'Inter',sans-serif"}}>No upcoming trips right now. <button onClick={()=>setPage("schedule")} style={{color:C.amber,background:"none",border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700}}>View full schedule →</button></div>
            }
          </div>
        </div>
      </section>

      {/* QUICK ACCESS BAR — Brussels Airlines style */}
      <div className="quick-bar" style={{maxWidth:"100%",overflowX:"auto"}}>
        {[
          {icon:"🎫",label:"Book a Seat",sub:"Select & pay instantly",action:()=>setPage("book")},
          {icon:"📋",label:"View Schedule",sub:"All routes & times",action:()=>setPage("schedule")},
          {icon:"🚐",label:"Hire a Van",sub:"Private & group hire",action:()=>setPage("hire")},
          {icon:"📦",label:"Send a Parcel",sub:"Door-to-door delivery",action:()=>setPage("parcel")},
          {icon:"📞",label:"Contact Us",sub:"+256 700 000000",action:()=>{}},
        ].map((item,i)=>(
          <div key={i} className="quick-bar-item" onClick={item.action}>
            <span style={{fontSize:20}}>{item.icon}</span>
            <div>
              <div style={{fontWeight:600,fontSize:13,color:"#0D1B3E"}}>{item.label}</div>
              <div style={{fontSize:11,color:"#8899BB",marginTop:1}}>{item.sub}</div>
            </div>
            <span style={{marginLeft:"auto",color:"#B8C6DC",fontSize:16}}>›</span>
          </div>
        ))}
      </div>

      {/* WHY RAYLANE */}
      <section aria-label="Why choose Raylane" style={{background:`linear-gradient(135deg,${C.navy} 0%,#1A2E5A 50%,${C.navy} 100%)`,padding:"clamp(72px,9vw,112px) clamp(16px,4vw,40px)",position:"relative",overflow:"hidden"}}>
        {/* Amber accent line top */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:`linear-gradient(90deg,transparent,${C.amber},transparent)`}}/>
        <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.amber,marginBottom:16}}>Why Travel with Us</p>
          <h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:"clamp(28px,4.5vw,48px)",color:"#fff",lineHeight:1.08,marginBottom:"clamp(48px,6vw,80px)"}}>Three Reasons the Road<br/><em style={{color:C.amber,fontStyle:"italic"}}>Feels Different with Raylane</em></h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"clamp(24px,4vw,56px)"}}>
            {[
              {
                num:"01",
                icon:"🛡️",
                title:"A Promise Kept at Every Mile",
                desc:"From Kampala to the far corners of Uganda, your safety is not a feature — it is our foundation. Every driver is vetted, every vehicle inspected, every journey insured. You board with confidence; we carry the rest."
              },
              {
                num:"02",
                icon:"⚡",
                title:"Two Minutes. One Ticket. Infinite Freedom.",
                desc:"Life moves fast. So does Raylane. Select your seat, pay with Mobile Money, and receive your boarding pass on WhatsApp — before you can finish your cup of tea. No queues. No uncertainty. Just the open road."
              },
              {
                num:"03",
                icon:"💺",
                title:"The Comfort You Deserve on Every Route",
                desc:"Whether you travel for business or simply for the love of Uganda's landscapes, our modern fleet offers you space, cleanliness, and punctuality. Every departure is a commitment — to honour your time and elevate your journey."
              }
            ].map((p,i)=>(
              <div key={p.num} style={{textAlign:"center",padding:"clamp(24px,3vw,40px) clamp(16px,2vw,24px)",borderRadius:24,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",transition:"all .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(245,166,35,0.08)";e.currentTarget.style.borderColor="rgba(245,166,35,0.28)";e.currentTarget.style.transform="translateY(-4px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.transform="";}}>
                <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontSize:"clamp(48px,6vw,72px)",fontWeight:900,color:C.amber,opacity:.15,lineHeight:1,marginBottom:4,letterSpacing:"-2px"}}>{p.num}</div>
                <div style={{fontSize:32,marginBottom:16,marginTop:-8}} aria-hidden="true">{p.icon}</div>
                <h3 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:"clamp(16px,2vw,20px)",color:"#fff",lineHeight:1.25,marginBottom:16}}>{p.title}</h3>
                <p style={{fontFamily:"'Inter',sans-serif",fontSize:"clamp(12px,1.3vw,14px)",color:"rgba(168,186,218,0.8)",lineHeight:1.85}}>{p.desc}</p>
              </div>
            ))}
          </div>
          <div style={{marginTop:"clamp(40px,5vw,64px)"}}>
            <button onClick={()=>setPage("book")} style={{background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,color:C.navy,border:"none",borderRadius:14,padding:"clamp(14px,1.8vw,18px) clamp(36px,5vw,56px)",fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:"clamp(14px,1.6vw,17px)",cursor:"pointer",boxShadow:`0 10px 36px ${C.amber}44`,transition:"all .3s",letterSpacing:"0.01em"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 16px 48px ${C.amber}55`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 10px 36px ${C.amber}44`;}}>
              Reserve Your Seat Today
            </button>
          </div>
        </div>
        {/* Amber accent line bottom */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:4,background:`linear-gradient(90deg,transparent,${C.amber},transparent)`}}/>
      </section>

      {/* HIRE A VAN */}
      <section aria-label="Hire a van" style={{background:C.navy,padding:"clamp(56px,7vw,96px) clamp(16px,4vw,40px)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",gap:"clamp(32px,5vw,72px)",alignItems:"center"}}>
            <div>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(245,166,35,0.14)",border:"1px solid rgba(245,166,35,0.28)",borderRadius:99,padding:"5px 16px",marginBottom:20,fontSize:11,color:C.amber,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase"}}>Private &amp; Group Transport</div>
              <h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:"clamp(26px,4vw,44px)",color:"#fff",lineHeight:1.08,marginBottom:18}}>Need a Van for Your<br/><span style={{color:C.amber}}>Event or Organisation?</span></h2>
              <p style={{fontFamily:"'Inter',sans-serif",color:"rgba(168,186,218,0.85)",fontSize:"clamp(13px,1.5vw,15px)",lineHeight:1.9,marginBottom:28,maxWidth:460}}>From church crusades and school term transport to corporate travel and airport transfers — tailored solutions for every group.</p>
              <div role="list" style={{display:"flex",flexDirection:"column",gap:12,marginBottom:32}}>
                {[{icon:"⛪",text:"Religious events — Phaneroo, crusades, prayer retreats"},{icon:"🏫",text:"Schools — term transport, trips & Safe Haven drop-off"},{icon:"💼",text:"Corporate & institutional group travel"},{icon:"✈️",text:"Airport transfers — Entebbe pickup & drop-off"}].map(item=>(
                  <div role="listitem" key={item.text} style={{display:"flex",alignItems:"center",gap:14,fontFamily:"'Inter',sans-serif",fontSize:"clamp(12px,1.4vw,14px)",color:"rgba(168,186,218,0.82)"}}>
                    <span style={{fontSize:20,flexShrink:0,width:32,textAlign:"center"}} aria-hidden="true">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <button onClick={()=>setPage("hire")} style={{background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,color:C.navy,border:"none",borderRadius:14,padding:"clamp(13px,1.5vw,16px) clamp(28px,3vw,40px)",fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:"clamp(13px,1.5vw,15px)",cursor:"pointer",boxShadow:`0 8px 28px ${C.amber}44`,transition:"all .25s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";}}>Get a Quote</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(10px,1.5vw,16px)"}}>
              {[{icon:"🔔",title:"Auto Driver Notification",desc:"Driver name, phone & vehicle reg sent via WhatsApp automatically on confirmation."},{icon:"🔒",title:"PTA Safety System",desc:"Authorised PTA pickup person for school bookings. Students never released to unknowns."},{icon:"📋",title:"Flexible Scheduling",desc:"One-way, return or multi-day transport. Multiple vans for large groups."},{icon:"💬",title:"Quote in 2 Hours",desc:"Our team confirms with a final quote within 2 hours of your request."}].map(f=>(
                <div key={f.title} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"clamp(16px,2vw,22px)",transition:"background .2s,border .2s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.09)";e.currentTarget.style.borderColor="rgba(245,166,35,0.25)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
                  <div style={{fontSize:22,marginBottom:10}} aria-hidden="true">{f.icon}</div>
                  <h3 style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,color:"#fff",marginBottom:6,lineHeight:1.3}}>{f.title}</h3>
                  <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"rgba(168,186,218,0.65)",lineHeight:1.75}}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS + ROUTES */}
      <section aria-label="Destinations and routes" style={{background:"#F4F6FA",padding:"clamp(56px,7vw,96px) clamp(16px,4vw,40px)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"clamp(32px,4vw,56px)"}}>
            <p style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.amber,marginBottom:12}}>Discover Uganda</p>
            <h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:"clamp(28px,4vw,46px)",color:C.navy,lineHeight:1.08,marginBottom:16}}>Popular Destinations</h2>
            <p style={{fontFamily:"'Inter',sans-serif",color:"#5B7299",fontSize:"clamp(13px,1.5vw,15px)",maxWidth:540,margin:"0 auto",lineHeight:1.8}}>Every road tells a story. Choose your destination and let Raylane Express write the chapter.</p>
            <div style={{width:48,height:3,background:`linear-gradient(90deg,${C.amber},#FFB940)`,borderRadius:2,margin:"20px auto 0"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(280px,28vw,360px),1fr))",gap:"clamp(16px,2.5vw,28px)",marginBottom:"clamp(28px,4vw,56px)"}}>
            {POPULAR_DESTINATIONS.map((d,i)=>{
              const uploadedPhoto=store.destPhotos?.[d.city];
              const photoUrl=uploadedPhoto?.url||null;
              const photoCaption=uploadedPhoto?.caption||"";
              return(
              <div key={d.city} style={{background:"#FFFFFF",border:"1px solid #E4EAF5",borderRadius:24,overflow:"hidden",boxShadow:"0 2px 12px rgba(13,27,62,0.05)",transition:"all .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 20px 52px rgba(13,27,62,0.13)";e.currentTarget.style.borderColor=C.amber+"44";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(13,27,62,0.05)";e.currentTarget.style.borderColor="#E4EAF5";}}>
                {/* Photo / gradient header */}
                <div style={{height:160,background:photoUrl?`url(${photoUrl}) center/cover`:`linear-gradient(135deg,${C.navy} 0%,${C.navyLight} 60%,${C.navyMid} 100%)`,position:"relative",display:"flex",alignItems:"flex-end"}}>
                  {photoUrl&&<div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(13,27,62,0.7))"}}/>}
                  <div style={{position:"relative",zIndex:1,padding:"14px 18px",width:"100%"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                      <div>
                        <div style={{fontSize:24,marginBottom:4}} aria-hidden="true">{d.emoji}</div>
                        <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:22,color:"#fff",lineHeight:1.1}}>{d.city}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:"rgba(255,255,255,0.6)",marginBottom:2}}>from</div>
                        <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:17,color:C.amber}}>{formatUGX(d.price)}</div>
                      </div>
                    </div>
                    {photoCaption&&<div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:"rgba(255,255,255,0.6)",marginTop:4,fontStyle:"italic"}}>{photoCaption}</div>}
                  </div>
                  {!photoUrl&&<div style={{position:"absolute",top:16,right:18,fontFamily:"'Inter',sans-serif",fontSize:10,color:"rgba(255,255,255,0.35)",fontStyle:"italic"}}>Photo coming soon</div>}
                </div>
                {/* Card body */}
                <div style={{padding:"clamp(16px,2vw,22px)"}}>
                  <p style={{fontFamily:"'Inter',sans-serif",fontSize:11,fontWeight:700,color:C.amber,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{d.tagline}</p>
                  <p style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"#5B7299",lineHeight:1.8,marginBottom:16}}>{d.desc}</p>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
                    {d.highlights.map(h=>(
                      <span key={h} style={{fontFamily:"'Inter',sans-serif",fontSize:11,background:C.amber+"15",color:C.amberDark,border:`1px solid ${C.amber}33`,borderRadius:99,padding:"3px 10px",fontWeight:600}}>{h}</span>
                    ))}
                  </div>
                  <button onClick={()=>setPage("book")} style={{width:"100%",background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:"#fff",border:"none",borderRadius:12,padding:"11px 0",fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",transition:"opacity .2s",letterSpacing:"0.02em"}}
                    onMouseEnter={e=>e.currentTarget.style.opacity="0.88"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                    Book to {d.city} →
                  </button>
                </div>
              </div>
              );
            })}
          </div>
          <div style={{background:"#FFFFFF",border:"1px solid #E4EAF5",borderRadius:20,overflow:"hidden",boxShadow:"0 4px 20px rgba(13,27,62,0.06)"}}>
            <div style={{padding:"clamp(18px,2.5vw,28px) clamp(20px,3vw,32px)",borderBottom:"1px solid #EEF1F8",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
              <h3 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:"clamp(17px,2vw,22px)",color:C.navy}}>All Routes</h3>
              <button onClick={()=>setPage("schedule")} style={{background:C.navy,color:"#fff",border:"none",borderRadius:10,padding:"9px 20px",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:12,transition:"opacity .2s"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>View Full Schedule →</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(180px,20vw,240px),1fr))"}}>
              {ROUTES.slice(0,12).map((r,i)=>(
                <button key={r.id} onClick={()=>setPage("book")} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"clamp(11px,1.5vw,15px) clamp(16px,2vw,22px)",background:"transparent",border:"none",borderRight:i%2===0?"1px solid #EEF1F8":"none",borderBottom:"1px solid #EEF1F8",cursor:"pointer",textAlign:"left",width:"100%",transition:"background .18s",fontFamily:"inherit"}} onMouseEnter={e=>e.currentTarget.style.background="#F8FAFF"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div>
                    <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"#8899BB",fontWeight:500,marginBottom:2}}>{r.origin}</div>
                    <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:15,color:C.navy}}>→ {r.destination}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:14,color:C.amber}}>{formatUGX(r.price)}</div>
                    <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:"#8899BB",marginTop:1}}>{Math.floor(r.duration_minutes/60)}h{r.duration_minutes%60>0?` ${r.duration_minutes%60}m`:""}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section aria-label="Customer reviews" style={{background:"#FFFFFF",padding:"clamp(56px,7vw,96px) clamp(16px,4vw,40px)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"clamp(32px,4vw,52px)"}}>
            <p style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:C.amber,marginBottom:10}}>Passenger Voices</p>
            <h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:"clamp(26px,4vw,42px)",color:C.navy,lineHeight:1.1,marginBottom:10}}>What Our Passengers Say</h2>
            <p style={{fontFamily:"'Inter',sans-serif",color:"#5B7299",fontSize:"clamp(13px,1.5vw,15px)"}}>Verified reviews from real travellers</p>
            <div style={{width:48,height:3,background:`linear-gradient(90deg,${C.amber},#FFB940)`,borderRadius:2,margin:"16px auto 0"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(260px,28vw,340px),1fr))",gap:"clamp(14px,2vw,24px)",marginBottom:"clamp(40px,5vw,64px)"}}>
            {approved.map((f,i)=>(
              <article key={f.id} style={{background:"#F8FAFF",border:"1px solid #E4EAF5",borderRadius:20,padding:"clamp(20px,2.5vw,28px)",transition:"box-shadow .25s,transform .25s"}} onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 10px 36px rgba(13,27,62,0.09)";e.currentTarget.style.transform="translateY(-3px)";}} onMouseLeave={e=>{e.currentTarget.style.boxShadow="";e.currentTarget.style.transform="";}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,gap:10}}>
                  <div>
                    <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:15,color:C.navy,marginBottom:3}}>{f.name}</div>
                    <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"#8899BB"}}>{f.route} · {f.date}</div>
                  </div>
                  <Stars rating={f.rating} size={13}/>
                </div>
                <p style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"#4B5E80",lineHeight:1.8,fontStyle:"italic"}}>"{f.message}"</p>
              </article>
            ))}
          </div>
          <FeedbackForm/>
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <section aria-label="FAQ" style={{background:"#F4F6FA",padding:"clamp(56px,6vw,88px) clamp(16px,4vw,40px)"}}>
        <div style={{maxWidth:760,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"clamp(28px,4vw,44px)"}}>
            <p style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:C.amber,marginBottom:10}}>Got Questions?</p>
            <h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:"clamp(24px,3.5vw,38px)",color:C.navy,lineHeight:1.1,marginBottom:8}}>Frequently Asked Questions</h2>
            <div style={{width:48,height:3,background:`linear-gradient(90deg,${C.amber},#FFB940)`,borderRadius:2,margin:"12px auto 0"}}/>
          </div>
          {FAQ_DATA.slice(0,4).map((f,i)=><FAQItem key={i} f={f} light/>)}
          <div style={{textAlign:"center",marginTop:28}}>
            <button onClick={()=>setPage("faq")} style={{background:C.navy,color:"#fff",border:"none",borderRadius:12,padding:"13px 32px",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,transition:"opacity .2s,transform .2s"}} onMouseEnter={e=>{e.currentTarget.style.opacity="0.85";e.currentTarget.style.transform="translateY(-1px)";}} onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="";}}>View All FAQs</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:C.navy}} role="contentinfo">
        <div style={{maxWidth:1280,margin:"0 auto",padding:"clamp(48px,6vw,80px) clamp(16px,4vw,40px) clamp(24px,3vw,36px)"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"clamp(24px,4vw,48px)",marginBottom:"clamp(36px,5vw,56px)"}}>
            <div>
              <RaylaneLogo height={34}/>
              <p style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"rgba(168,186,218,0.7)",lineHeight:1.85,marginTop:16,maxWidth:280}}>Uganda's trusted intercity transport network. Safe, reliable journeys connecting families, businesses and communities since 2018.</p>
              <div style={{display:"flex",gap:8,marginTop:20,flexWrap:"wrap"}}>
                {[
                  {key:"facebook",icon:"f",label:"Facebook",color:"#1877F2"},
                  {key:"x",icon:"𝕏",label:"X / Twitter",color:"#fff"},
                  {key:"instagram",icon:"▣",label:"Instagram",color:"#E1306C"},
                  {key:"tiktok",icon:"♪",label:"TikTok",color:"#69C9D0"},
                ].filter(s=>socialLinks?.[s.key]?.active!==false).map(s=>(
                  <a key={s.key} href={socialLinks?.[s.key]?.url||"#"} target="_blank" rel="noopener noreferrer"
                    title={`${s.label}: ${socialLinks?.[s.key]?.handle||""}`}
                    style={{width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"rgba(255,255,255,0.6)",cursor:"pointer",transition:"all .2s",textDecoration:"none"}}
                    onMouseEnter={e=>{e.currentTarget.style.background=s.color;e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor=s.color;}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.07)";e.currentTarget.style.color="rgba(255,255,255,0.6)";e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";}}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:C.amber,marginBottom:20}}>Products</div>
              {[{l:"Book a Seat",p:"book"},{l:"Plan Journey",p:"plan"},{l:"Hire a Van",p:"hire"},{l:"Courier",p:"parcel"}].map(item=>(
                <div key={item.l} onClick={()=>setPage(item.p)} style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"rgba(168,186,218,0.65)",marginBottom:10,cursor:"pointer",transition:"color .15s"}} onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(168,186,218,0.65)"}>{item.l}</div>
              ))}
            </div>
            <div>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:C.amber,marginBottom:20}}>
                Support<span onClick={()=>{setLoginRole("admin");setPage("login");}} style={{cursor:"default",userSelect:"none",color:"transparent",fontSize:1}}>.</span>
              </div>
              {[{l:"Safety",p:"safety"},{l:"FAQ",p:"faq"},{l:"About Us",p:"about"},{l:"Careers",p:"careers"}].map(item=>(
                <div key={item.l} onClick={()=>setPage(item.p)} style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"rgba(168,186,218,0.65)",marginBottom:10,cursor:"pointer",transition:"color .15s"}} onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(168,186,218,0.65)"}>{item.l}</div>
              ))}
            </div>
            <div>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:C.amber,marginBottom:20}}>Contact</div>
              {["+256 700 000000","info@raylane.ug","Nakasero, Kampala","Mon–Sun 5AM–10PM"].map(item=>(
                <div key={item} style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"rgba(168,186,218,0.65)",marginBottom:10,lineHeight:1.5}}>{item}</div>
              ))}
            </div>
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"rgba(168,186,218,0.4)"}}>© 2026 Raylane Express Ltd. All rights reserved.</p>
              <div style={{display:"flex",alignItems:"center",gap:8,opacity:.65}}>
                <MTNLogo size={22}/><AirtelLogo size={22}/>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:"rgba(168,186,218,0.5)"}}>Mobile Money Accepted</span>
              </div>
            </div>
            <div style={{display:"flex",gap:20,alignItems:"center"}}>
              <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"rgba(168,186,218,0.4)"}}>Privacy · Terms · Refund Policy</span>
              <span onClick={()=>{setLoginRole("agent");setPage("login");}} title="Staff login" style={{cursor:"pointer",fontSize:14,opacity:0.22,transition:"opacity .2s",userSelect:"none"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.65"} onMouseLeave={e=>e.currentTarget.style.opacity="0.22"}>🔒</span>
            </div>
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
// CUSTOMER AUTH — Register / Login / OTP
// ═══════════════════════════════════════════════════════════════════════
const OTP_MOCK = {}; // email -> otp (simulated)

const CustomerAuthPanel=({store,onAuth,onSkip})=>{
  const [mode,setMode]=useState("choice"); // choice | login | register | otp
  const [form,setForm]=useState({name:"",phone:"",email:"",district:""});
  const [loginEmail,setLoginEmail]=useState("");
  const [otp,setOtp]=useState(""); const [sentOtp,setSentOtp]=useState("");
  const [otpFor,setOtpFor]=useState(null); // customer object awaiting verification
  const [err,setErr]=useState(""); const [info,setInfo]=useState("");

  const sendOtp=(customer)=>{
    const code=String(Math.floor(100000+Math.random()*900000));
    OTP_MOCK[customer.email]=code;
    setSentOtp(code);
    setOtpFor(customer);
    setInfo(`OTP sent to ${customer.email} — for demo the code is: ${code}`);
    setMode("otp");
  };

  const handleLoginLookup=()=>{
    setErr("");
    const c=store.findCustomer(loginEmail.trim());
    if(!c){setErr("No account found with that email. Please register.");return;}
    sendOtp(c);
  };

  const handleRegister=()=>{
    setErr("");
    if(!form.name||!form.phone||!form.email){setErr("Name, phone and email are required.");return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){setErr("Please enter a valid email address.");return;}
    if(store.findCustomer(form.email)){setErr("An account with this email already exists. Please log in.");return;}
    const newCust={name:form.name,phone:form.phone,email:form.email,district:form.district,verified:false};
    sendOtp(newCust);
  };

  const handleVerifyOtp=()=>{
    setErr("");
    if(otp.trim()!==sentOtp){setErr("Incorrect OTP. Please try again.");return;}
    // If new registration, save to store
    if(!store.findCustomer(otpFor.email)){
      store.addCustomer({...otpFor,verified:true});
    }
    const finalCustomer=store.findCustomer(otpFor.email)||{...otpFor,verified:true};
    onAuth(finalCustomer);
  };

  const districts=["Kampala","Gulu","Mbarara","Mbale","Fort Portal","Arua","Jinja","Masaka","Lira","Soroti"];

  return(
    <div style={{background:C.card,border:`1px solid ${C.amber}44`,borderRadius:16,padding:22,marginBottom:22,animation:"fadeUp .3s ease"}}>
      {mode==="choice"&&(
        <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 className="ral" style={{fontWeight:800,fontSize:16}}>👤 Your Account</h3>
            <button onClick={onSkip} style={{background:"none",border:"none",color:C.textMuted,fontSize:12,cursor:"pointer",textDecoration:"underline"}}>Continue as guest →</button>
          </div>
          <p style={{fontSize:12,color:C.textMuted,marginBottom:16,lineHeight:1.7}}>Log in or register so your details auto-fill and your booking history is saved.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Btn onClick={()=>{setMode("login");setErr("");}} style={{padding:"12px"}}>🔑 Log In</Btn>
            <Btn onClick={()=>{setMode("register");setErr("");}} variant="navy" style={{border:`1px solid ${C.navyBorder}`,padding:"12px"}}>✨ Register Free</Btn>
          </div>
        </>
      )}

      {mode==="login"&&(
        <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 className="ral" style={{fontWeight:800,fontSize:16}}>Log In</h3>
            <button onClick={()=>setMode("choice")} style={{background:"none",border:"none",color:C.amber,fontSize:12,cursor:"pointer"}}>← Back</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Input label="Email Address" type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} placeholder="your@email.com" required/>
            {err&&<div style={{background:C.red+"22",border:`1px solid ${C.red}44`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.red}}>{err}</div>}
            <Btn onClick={handleLoginLookup} disabled={!loginEmail} full style={{padding:"12px"}}>Send OTP to Email →</Btn>
            <div style={{fontSize:11,color:C.textMuted,textAlign:"center"}}>An OTP will be emailed to verify your identity.</div>
            <button onClick={onSkip} style={{background:"none",border:"none",color:C.textMuted,fontSize:11,cursor:"pointer",textDecoration:"underline",marginTop:4}}>Skip — continue as guest</button>
          </div>
        </>
      )}

      {mode==="register"&&(
        <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 className="ral" style={{fontWeight:800,fontSize:16}}>Create Account</h3>
            <button onClick={()=>setMode("choice")} style={{background:"none",border:"none",color:C.amber,fontSize:12,cursor:"pointer"}}>← Back</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Input label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name" required/>
            <Input label="Phone Number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+256 7XX XXX XXX" required/>
            <Input label="Email Address" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" required/>
            <Sel label="Home District" value={form.district} onChange={e=>setForm({...form,district:e.target.value})} options={[{value:"",label:"Select district (optional)"},...districts.map(d=>({value:d,label:d}))]}/>
            {err&&<div style={{background:C.red+"22",border:`1px solid ${C.red}44`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.red}}>{err}</div>}
            <Btn onClick={handleRegister} disabled={!form.name||!form.phone||!form.email} full style={{padding:"12px"}}>Register &amp; Send OTP →</Btn>
            <div style={{fontSize:11,color:C.textMuted,textAlign:"center",lineHeight:1.6}}>An OTP will be sent to your email to confirm registration.</div>
            <button onClick={onSkip} style={{background:"none",border:"none",color:C.textMuted,fontSize:11,cursor:"pointer",textDecoration:"underline"}}>Skip — continue as guest</button>
          </div>
        </>
      )}

      {mode==="otp"&&(
        <>
          <h3 className="ral" style={{fontWeight:800,fontSize:16,marginBottom:6}}>📧 Enter OTP</h3>
          <div style={{background:C.green+"11",border:`1px solid ${C.green}33`,borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:12,color:C.textSecondary,lineHeight:1.7}}>
            {info}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Input label="6-Digit OTP" value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="••••••" style={{fontSize:22,letterSpacing:6,textAlign:"center",fontFamily:"'Raleway',sans-serif",fontWeight:800}}/>
            {err&&<div style={{background:C.red+"22",border:`1px solid ${C.red}44`,borderRadius:8,padding:"8px 12px",fontSize:12,color:C.red}}>{err}</div>}
            <Btn onClick={handleVerifyOtp} disabled={otp.length!==6} full style={{padding:"12px"}}>✓ Verify &amp; Continue</Btn>
            <button onClick={()=>{sendOtp(otpFor);setOtp("");}} style={{background:"none",border:"none",color:C.amber,fontSize:12,cursor:"pointer",textDecoration:"underline"}}>Resend OTP</button>
            <button onClick={onSkip} style={{background:"none",border:"none",color:C.textMuted,fontSize:11,cursor:"pointer",textDecoration:"underline"}}>Skip — continue as guest</button>
          </div>
        </>
      )}
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
  const [payStatus,setPayStatus]=useState("idle");
  const [form,setForm]=useState({name:currentUser?.name||"",phone:currentUser?.phone||"",email:currentUser?.email||"",accessibility:false,assistanceDetail:""});
  const [confirmed,setConfirmed]=useState(null);
  const [loggedInCustomer,setLoggedInCustomer]=useState(null);
  const [showAuth,setShowAuth]=useState(!currentUser);
  const [filterOrigin,setFilterOrigin]=useState("");
  const [filterDest,setFilterDest]=useState("");

  useEffect(()=>{if(preselectedTrip){setTrip(preselectedTrip);setStep(2);}}, [preselectedTrip]);

  const handleCustomerAuth=(customer)=>{
    setLoggedInCustomer(customer);
    setForm(f=>({...f,name:customer.name||f.name,phone:customer.phone||f.phone,email:customer.email||f.email}));
    setShowAuth(false);
  };

  const route   = trip?store.getRoute(trip.route_id):{};
  const bookedS = trip?trip.seats_booked:[];
  const reservedS=trip?store.reservations.filter(r=>r.trip_id===trip.id&&r.status==="reserved").map(r=>r.seat):[];

  // Filter trips by origin/destination
  const filteredTrips=store.trips.filter(t=>{
    const r=store.getRoute(t.route_id);
    if(filterOrigin&&r.origin!==filterOrigin) return false;
    if(filterDest&&r.destination!==filterDest) return false;
    return true;
  });

  const applyPromo=()=>{
    const p=store.promotions.find(pr=>pr.code.toUpperCase()===promoCode.toUpperCase()&&pr.active&&(!pr.route_id||pr.route_id===trip?.route_id));
    setPromoApplied(p||null);
  };

  const baseAmount = route.price?route.price*seats.length:0;
  const discount   = promoApplied?promoApplied.type==="percent"?Math.round(baseAmount*promoApplied.discount/100):promoApplied.discount:0;
  const totalAmount= Math.max(0,baseAmount-discount);

  const handlePay=()=>{setPayStatus("submitting");setTimeout(()=>setPayStatus("submitted"),1500);};

  const handleConfirm=()=>{
    const code=genPassengerCode();
    store.addBooking({booking_code:code,passenger:form.name,phone:form.phone,email:form.email,route:`${route.origin} → ${route.destination}`,route_id:route.id,seats,trip_id:trip.id,amount:totalAmount,payment_status:"confirmed",status:"confirmed",date:new Date().toISOString().split("T")[0],agent_id:null,is_advance:false,customer_id:loggedInCustomer?.id||null});
    setConfirmed({code,passenger:form.name,phone:form.phone,route:`${route.origin} → ${route.destination}`,seats,departure:formatTime(trip.departure_time),amount:totalAmount,vehicle:trip.vehicle_reg});
    setStep(5);
  };

  const TERMS=["Arrive 20 minutes before departure.","10kg luggage free per passenger.","Extra luggage charged by weight.","Ticket valid for scheduled trip only.","QR code required for boarding."];

  return(
    <div style={{minHeight:"100vh",background:"#F0F4FF",paddingTop:80}}>
    <div style={{maxWidth:900,margin:"0 auto",padding:"24px 20px 40px"}}>
      <h1 className="ral" style={{fontSize:30,fontWeight:900,marginBottom:4,color:C.navy}}>Book Your Seat</h1>

      {/* Logged-in customer badge */}
      {loggedInCustomer&&(
        <div style={{background:C.green+"11",border:`1px solid ${C.green}33`,borderRadius:10,padding:"9px 14px",marginBottom:16,fontSize:12,color:C.green,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span>✓ Logged in as <strong>{loggedInCustomer.name}</strong> — details auto-filled</span>
          <button onClick={()=>{setLoggedInCustomer(null);}} style={{background:"none",border:"none",color:C.textMuted,fontSize:11,cursor:"pointer",textDecoration:"underline"}}>Switch</button>
        </div>
      )}

      {/* Step indicator */}
      <div style={{display:"flex",alignItems:"center",gap:4,marginTop:8,marginBottom:28,flexWrap:"wrap"}}>
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
          {/* Route filter */}
          <div style={{background:"#FFFFFF",border:"1.5px solid #D8E2F5",borderRadius:14,padding:"14px 16px",marginBottom:16,display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
            <div style={{flex:1,minWidth:150}}>
              <label style={{fontSize:11,color:C.navy,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase",display:"block",marginBottom:5}}>From</label>
              <select value={filterOrigin} onChange={e=>{setFilterOrigin(e.target.value);setTrip(null);}} style={{width:"100%",background:"#F0F4FF",border:"1.5px solid #D8E2F5",borderRadius:9,padding:"9px 12px",color:C.navy,fontSize:13,outline:"none",cursor:"pointer"}}>
                <option value="">Any origin</option>
                {ALL_CITIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{fontSize:20,paddingBottom:8,color:C.amber,fontWeight:900}}>→</div>
            <div style={{flex:1,minWidth:150}}>
              <label style={{fontSize:11,color:C.navy,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase",display:"block",marginBottom:5}}>To</label>
              <select value={filterDest} onChange={e=>{setFilterDest(e.target.value);setTrip(null);}} style={{width:"100%",background:"#F0F4FF",border:"1.5px solid #D8E2F5",borderRadius:9,padding:"9px 12px",color:C.navy,fontSize:13,outline:"none",cursor:"pointer"}}>
                <option value="">Any destination</option>
                {ALL_CITIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {(filterOrigin||filterDest)&&(
              <button onClick={()=>{setFilterOrigin("");setFilterDest("");setTrip(null);}} style={{background:"none",border:"1px solid #D8E2F5",color:"#8899BB",borderRadius:8,padding:"9px 14px",cursor:"pointer",fontSize:12,fontFamily:"'Nunito',sans-serif",whiteSpace:"nowrap"}}>Clear ✕</button>
            )}
          </div>
          <div style={{fontSize:12,color:"#8899BB",marginBottom:12}}>{filteredTrips.length} trip{filteredTrips.length!==1?"s":""} found{filterOrigin||filterDest?" for selected route":""}</div>
          <div style={{display:"grid",gap:11}}>
            {filteredTrips.length===0?(
              <div style={{background:"#FFFFFF",border:"1.5px solid #D8E2F5",borderRadius:14,padding:"24px",textAlign:"center",color:"#8899BB",fontSize:13}}>
                No trips found for this route. <button onClick={()=>{setFilterOrigin("");setFilterDest("");}} style={{color:C.amber,background:"none",border:"none",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:700}}>Show all trips</button>
              </div>
            ):filteredTrips.map(t=>{
              const r=store.getRoute(t.route_id);
              const avail=store.seatsAvailable(t); const isFull=avail<=0;
              const isSel=trip?.id===t.id;
              return(
                <div key={t.id} onClick={()=>!isFull&&setTrip(t)} style={{background:"#FFFFFF",border:`2px solid ${isSel?C.amber:isFull?"#EF444433":"#D8E2F5"}`,borderRadius:15,padding:"16px 18px",cursor:isFull?"not-allowed":"pointer",transition:"all .2s",opacity:isFull?.6:1,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}
                  onMouseEnter={e=>{if(!isFull)e.currentTarget.style.borderColor=C.amber+"88";}}
                  onMouseLeave={e=>{if(!isFull)e.currentTarget.style.borderColor=isSel?C.amber:"#D8E2F5";}}>
                  <div>
                    <div className="ral" style={{fontWeight:800,fontSize:17,color:C.navy}}>{r.origin} → {r.destination}</div>
                    <div style={{color:"#8899BB",fontSize:11,marginTop:2}}>{t.vehicle_reg}{isFull&&<span style={{color:"#EF4444",marginLeft:8}}>● Fully Booked</span>}</div>
                  </div>
                  <div style={{display:"flex",gap:18,alignItems:"center"}}>
                    <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#8899BB"}}>Departs</div><div className="ral" style={{fontWeight:800,fontSize:20,color:C.amber}}>{formatTime(t.departure_time)}</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#8899BB"}}>Seats</div><div style={{fontWeight:700,color:isFull?"#EF4444":C.green}}>{isFull?"FULL":avail}</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#8899BB"}}>Fare</div><div className="ral" style={{fontWeight:700,color:C.amber}}>{formatUGX(r.price)}</div></div>
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
            <h3 className="ral" style={{fontWeight:700,fontSize:13,marginBottom:10}}>Travel Terms &amp; Conditions</h3>
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
                <div style={{background:"rgba(168,186,218,0.06)",borderRadius:12,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:".5px"}}>Accepted:</span>
                <MTNLogo pill/><AirtelLogo pill/>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textMuted}}>· Cash at agent offices</span>
              </div>
              {[{id:"mtn",label:"MTN MoMo",logo:<MTNLogo size={32}/>},{id:"airtel",label:"Airtel Money",logo:<AirtelLogo size={32}/>},{id:"cash",label:"Cash (Agent)",icon:"💵"}].map(m=>(
                  <div key={m.id} onClick={()=>setPayMethod(m.id)} style={{background:payMethod===m.id?C.amber+"22":C.navyMid,border:`1.5px solid ${payMethod===m.id?C.amber:C.navyBorder}`,borderRadius:10,padding:"12px 8px",textAlign:"center",cursor:"pointer",transition:"all .2s"}}>
                    <div style={{fontSize:20,marginBottom:4,display:"flex",justifyContent:"center"}}>{m.logo||m.icon}</div>
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
              <Sel label="From" required value={form.origin} onChange={e=>setForm({...form,origin:e.target.value,destination:""})} options={ALL_CITIES.map(c=>({value:c,label:c}))}/>
              <Sel label="To" required value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})} options={[{value:"",label:"Select destination"},...ALL_CITIES.filter(c=>c!==form.origin).map(c=>({value:c,label:c}))]}/>
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
              <div style={{background:"rgba(168,186,218,0.06)",borderRadius:12,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:".5px"}}>Pay via:</span>
                <MTNLogo pill/><AirtelLogo pill/>
              </div>
              {[{id:"mtn",label:"MTN MoMo",logo:<MTNLogo size={28}/>},{id:"airtel",label:"Airtel Money",logo:<AirtelLogo size={28}/>},{id:"cash",label:"Pay at Office",icon:"🏢"}].map(m=>(
                <div key={m.id} onClick={()=>setPayMethod(m.id)} style={{background:payMethod===m.id?C.amber+"22":C.navyMid,border:`1.5px solid ${payMethod===m.id?C.amber:C.navyBorder}`,borderRadius:10,padding:"11px 6px",textAlign:"center",cursor:"pointer",transition:"all .2s"}}>
                  <div style={{fontSize:18,marginBottom:4,display:"flex",justifyContent:"center"}}>{m.logo||m.icon}</div>
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
const ParcelPage=({store})=>{
  const st=store||{trips:[],vehicles:[],heroImages:[],customers:[]};
  const [form,setForm]=useState({sender:"",senderPhone:"",receiver:"",receiverPhone:"",destination:"",description:"",weight:"",vehicleId:""});
  const [tracking,setTracking]=useState("");
  const [trackResult,setTrackResult]=useState(null);
  const [submitted,setSubmitted]=useState(null);
  const [loggedInCustomer,setLoggedInCustomer]=useState(null);
  const [showAuth,setShowAuth]=useState(true);

  const handleCustomerAuth=(customer)=>{
    setLoggedInCustomer(customer);
    setForm(f=>({...f,sender:customer.name||f.sender,senderPhone:customer.phone||f.senderPhone}));
    setShowAuth(false);
  };

  // Get active trips going to selected destination for vehicle selection
  const matchingTrips=st.trips?st.trips.filter(t=>{
    const r=st.getRoute?st.getRoute(t.route_id):{};
    return r.destination===form.destination;
  }):[];

  const selectedVehicle=form.vehicleId
    ? (st.vehicles||[]).find(v=>String(v.id)===String(form.vehicleId))
    : matchingTrips.length>0
    ? (st.vehicles||[]).find(v=>v.registration===matchingTrips[0]?.vehicle_reg)
    : null;

  const handleSubmit=()=>{
    if(!form.sender||!form.receiver||!form.destination) return;
    const vReg=selectedVehicle?.registration||"";
    const code=genParcelCode(vReg);
    setSubmitted({code,sender:form.sender,receiver:form.receiver,destination:form.destination,weight:form.weight,vehicle:vReg||"TBD"});
  };

  const mockParcels=[
    {code:"PCL/090326/23B/00001",status:"active",location:"Nakasero Terminal",updated:"10:30 AM"},
    {code:"PCL/080326/56C/00002",status:"confirmed",location:"Gulu",updated:"Yesterday 3PM"}
  ];

  return(
    <div style={{minHeight:"100vh",paddingTop:80,maxWidth:900,margin:"0 auto",padding:"80px 20px 40px"}}>
      <h1 className="ral" style={{fontSize:30,fontWeight:800,marginBottom:6}}>Parcel &amp; Courier</h1>
      <p style={{color:C.textMuted,marginBottom:20}}>Send parcels across Uganda with every trip</p>

      {/* Logged-in customer badge */}
      {loggedInCustomer&&(
        <div style={{background:C.green+"11",border:`1px solid ${C.green}33`,borderRadius:10,padding:"9px 14px",marginBottom:16,fontSize:12,color:C.green}}>
          ✓ Logged in as <strong>{loggedInCustomer.name}</strong> — sender details auto-filled
        </div>
      )}

      {submitted?(
        <Card style={{maxWidth:520,margin:"0 auto",border:`1px solid ${C.green}44`,textAlign:"center",animation:"fadeUp .4s ease"}}>
          <div style={{fontSize:44,marginBottom:12}}>📦</div>
          <h2 className="ral" style={{fontWeight:900,fontSize:22,color:C.green,marginBottom:6}}>Parcel Booked!</h2>
          <div style={{background:C.navyMid,borderRadius:12,padding:14,margin:"16px 0",textAlign:"left"}}>
            <div style={{fontSize:10,color:C.textMuted,letterSpacing:1,marginBottom:4}}>PARCEL CODE</div>
            <div className="ral" style={{fontWeight:900,fontSize:18,color:C.amber,letterSpacing:1,wordBreak:"break-all"}}>{submitted.code}</div>
          </div>
          {[["Sender",submitted.sender],["Receiver",submitted.receiver],["Destination",submitted.destination],["Weight",submitted.weight?`${submitted.weight} kg`:"Not specified"],["Assigned Vehicle",submitted.vehicle]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"6px 0",borderBottom:`1px solid ${C.navyBorder}`}}>
              <span style={{color:C.textMuted}}>{k}</span><span style={{fontWeight:700}}>{v}</span>
            </div>
          ))}
          <div style={{marginTop:16,fontSize:11,color:C.textMuted,background:C.navyLight,borderRadius:8,padding:"8px 12px"}}>
            Use the parcel code to track your delivery. A confirmation will be sent via WhatsApp.
          </div>
          <Btn onClick={()=>{setSubmitted(null);setForm({sender:"",senderPhone:"",receiver:"",receiverPhone:"",destination:"",description:"",weight:"",vehicleId:""});}} full style={{marginTop:14}}>Send Another Parcel</Btn>
        </Card>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:22}}>
          <Card>
            <h3 className="ral" style={{fontWeight:800,fontSize:17,marginBottom:18}}>Send a Parcel</h3>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              <Input label="Sender Name" value={form.sender} onChange={e=>setForm({...form,sender:e.target.value})} placeholder="Your full name"/>
              <Input label="Sender Phone" value={form.senderPhone} onChange={e=>setForm({...form,senderPhone:e.target.value})} placeholder="+256 7XX XXX XXX"/>
              <Input label="Receiver Name" value={form.receiver} onChange={e=>setForm({...form,receiver:e.target.value})} placeholder="Receiver's name"/>
              <Input label="Receiver Phone" value={form.receiverPhone} onChange={e=>setForm({...form,receiverPhone:e.target.value})} placeholder="+256 7XX XXX XXX"/>
              <Sel label="Destination" value={form.destination} onChange={e=>setForm({...form,destination:e.target.value,vehicleId:""})} options={[{value:"",label:"Choose destination"},...ROUTES.map(r=>({value:r.destination,label:r.destination}))]}/>
              {/* Vehicle assignment */}
              {form.destination&&matchingTrips.length>0&&(
                <Sel label="Assign to Trip / Vehicle" value={form.vehicleId} onChange={e=>setForm({...form,vehicleId:e.target.value})}
                  options={[{value:"",label:"Auto-assign to next trip"},...matchingTrips.map(t=>{
                    const v=(st.vehicles||[]).find(v=>v.registration===t.vehicle_reg);
                    return{value:String(t.id),label:`${formatTime(t.departure_time)} · ${t.vehicle_reg}${v?` (${v.model})`:""}`};
                  })]}/>
              )}
              {selectedVehicle&&(
                <div style={{background:C.navyLight,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.textMuted}}>
                  🚐 Vehicle: <strong style={{color:C.amber}}>{selectedVehicle.registration}</strong> · {selectedVehicle.model} · Driver: {selectedVehicle.driver}
                  <div style={{marginTop:3,color:C.textMuted,fontSize:10}}>Parcel code suffix: <strong style={{color:C.white}}>…/{selectedVehicle.registration.replace(/\s/g,"").slice(-3).toUpperCase()}/NNNNN</strong></div>
                </div>
              )}
              <Input label="Weight (kg)" type="number" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})} placeholder="e.g. 2.5"/>
              <Input label="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="What's inside?"/>
              <div style={{background:C.navyLight,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.textMuted}}>🧳 Up to 10kg free of charge</div>
              <Btn onClick={handleSubmit} disabled={!form.sender||!form.receiver||!form.destination} full style={{marginTop:4}}>📦 Book Parcel</Btn>
            </div>
          </Card>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <Card>
              <h3 className="ral" style={{fontWeight:800,fontSize:17,marginBottom:14}}>Track Your Parcel</h3>
              <Input label="Parcel Code" value={tracking} onChange={e=>setTracking(e.target.value)} placeholder="e.g. PCL/090326/23B/00001"/>
              <Btn onClick={()=>setTrackResult(mockParcels.find(p=>p.code.toLowerCase()===tracking.toLowerCase())||{code:tracking,status:"cancelled",location:"Not found",updated:"—"})} full style={{marginTop:10}}>Track →</Btn>
              {trackResult&&(
                <div style={{marginTop:12,background:C.navyMid,borderRadius:10,padding:12,animation:"fadeUp .3s ease"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,flexWrap:"wrap",gap:6}}><span className="ral" style={{fontWeight:700,fontSize:12,wordBreak:"break-all"}}>{trackResult.code}</span><StatusBadge status={trackResult.status}/></div>
                  <div style={{fontSize:12,color:C.textMuted}}>Location: {trackResult.location}</div>
                  <div style={{fontSize:11,color:C.textMuted,marginTop:3}}>Updated: {trackResult.updated}</div>
                </div>
              )}
            </Card>
            <Card>
              <h3 className="ral" style={{fontWeight:700,fontSize:15,marginBottom:8}}>Parcel Code Format</h3>
              <div style={{background:C.navyMid,borderRadius:8,padding:"10px 12px",fontSize:11,color:C.textMuted,marginBottom:12,lineHeight:1.8}}>
                <strong style={{color:C.amber}}>PCL</strong> / <strong style={{color:C.white}}>DDMMYY</strong> / <strong style={{color:C.white}}>VVV</strong> / <strong style={{color:C.white}}>NNNNN</strong><br/>
                <span style={{color:C.textMuted}}>e.g. PCL/090326/23B/00001</span><br/>
                VVV = last 3 chars of assigned vehicle reg
              </div>
              <h3 className="ral" style={{fontWeight:700,fontSize:15,marginBottom:10}}>Pricing Guide</h3>
              {[["0–2 kg","UGX 5,000"],["2–5 kg","UGX 10,000"],["5–10 kg","UGX 18,000"],["10+ kg","Contact us"]].map(([w,p])=>(
                <div key={w} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.navyBorder}`,fontSize:13}}>
                  <span style={{color:C.textMuted}}>{w}</span><span style={{fontWeight:700,color:C.amber}}>{p}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PAGE: HIRE A VAN
// ═══════════════════════════════════════════════════════════════════════
const HIRE_CATEGORIES=[
  {id:"private",  label:"Private Group Transport", icon:"👥", desc:"Families, friends, or personal group travel"},
  {id:"religious",label:"Religious Event Transport",icon:"⛪", desc:"Churches, ministries, crusades & prayer events"},
  {id:"school",   label:"School Transport",         icon:"🏫", desc:"Term transport, trips & student welfare"},
  {id:"corporate",label:"Corporate Transport",      icon:"💼", desc:"Staff, meetings & business travel"},
  {id:"airport",  label:"Airport Transfer",          icon:"✈️", desc:"Pick-up or drop-off at Entebbe Airport"},
  {id:"longterm", label:"Long-Term / Contract Hire",icon:"📋", desc:"Annual contracts for NGOs, embassies & institutions"},
];
const LONGTERM_VEHICLE_TYPES=[
  "Toyota HiAce (14 seats)","Toyota Coaster (30 seats)","Toyota Land Cruiser (5 seats)",
  "Toyota Prado (5-7 seats)","Isuzu NQR Bus (36 seats)","Toyota Noah / Voxy (7 seats)",
  "Multiple Vehicles (fleet contract)","Other (specify in notes)",
];
const LONGTERM_SECTORS=["NGO / Non-Profit","Embassy / Diplomatic Mission","UN / International Organisation","Government Ministry","University / Research Institution","Private Company","Hospital / Health Facility","Other"];
const RELIGIOUS_EVENTS=["Men Gather Conference","My Great Price","Phaneroo Anniversary","Evangelical Crusade","Prayer Retreat","Church Camp","Sunday Service Transport","Other"];
const SCHOOL_TRIP_TYPES=["Term Opening Transport","Holiday Transport","Study / Educational Trip","Recreation Trip","Sports Competition","Other"];
const VEHICLE_TYPES=["Toyota HiAce (14 seats)","Toyota Coaster (30 seats)","Isuzu NQR (36 seats)","Multiple Vans (large group)"];
const SAFE_HAVENS=["Kampala City Taxi Park","Gulu Taxi Park","Mbarara Bus Terminal","Mbale Main Stage","Jinja Taxi Park","Fort Portal Stage","Arua Station","Other (specify below)"];

const HirePage=({store,setPage})=>{
  const [category,setCategory]=useState("");
  const [step,setStep]=useState(1); // 1=category, 2=details, 3=confirm, 4=done
  const [form,setForm]=useState({
    // Trip
    pickup:"", destination:"", date:"", returnDate:"", passengers:"",
    vehicleType:"", multipleVans:false, overnightHire:false, multiStop:false,
    driverOption:"raylane", // raylane | own
    luggage:"", specialRequests:"",
    // Contact
    name:"", phone:"", email:"", orgName:"",
    // Religious
    eventType:"", ministryName:"",
    // School
    schoolName:"", tripType:"", safeHaven:"", safeHavenOther:"",
    ptaName:"", ptaPhone:"", ptaId:"", ptaRelation:"",
    // Scheduling
    tripMode:"one-way", // one-way | return | multi-day
  });
  const [submitted,setSubmitted]=useState(null);
  const [quoteRef,setQuoteRef]=useState("");

  const selectedCat=HIRE_CATEGORIES.find(c=>c.id===category);

  const genHireRef=()=>{
    const now=new Date();
    const yy=String(now.getFullYear()).slice(-2);
    const mm=String(now.getMonth()+1).padStart(2,"0");
    const dd=String(now.getDate()).padStart(2,"0");
    const nn=String(Math.floor(1000+Math.random()*9000));
    return `HRN/${yy}${mm}${dd}/${nn}`;
  };

  const handleSubmit=()=>{
    const ref=genHireRef();
    setQuoteRef(ref);
    setSubmitted({...form,category,ref,categoryLabel:selectedCat?.label});
    setStep(4);
  };

  const F=(label,key,type="text",placeholder="",required=false)=>(
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      <label style={{fontSize:11,color:C.navy,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase"}}>{label}{required&&<span style={{color:C.red}}> *</span>}</label>
      <input type={type} value={form[key]||""} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={placeholder}
        style={{background:"#F8FAFF",border:"1.5px solid #D8E2F5",borderRadius:9,padding:"10px 13px",color:C.navy,fontSize:13,outline:"none",transition:"border .2s"}}
        onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor="#D8E2F5"}/>
    </div>
  );
  const S=(label,key,options,required=false)=>(
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      <label style={{fontSize:11,color:C.navy,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase"}}>{label}{required&&<span style={{color:C.red}}> *</span>}</label>
      <select value={form[key]||""} onChange={e=>setForm({...form,[key]:e.target.value})}
        style={{background:"#F8FAFF",border:"1.5px solid #D8E2F5",borderRadius:9,padding:"10px 13px",color:C.navy,fontSize:13,outline:"none",cursor:"pointer"}}
        onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor="#D8E2F5"}>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
  const Check=(label,key)=>(
    <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:13,color:C.navy,fontWeight:600}}>
      <input type="checkbox" checked={!!form[key]} onChange={e=>setForm({...form,[key]:e.target.checked})} style={{width:16,height:16,accentColor:C.amber}}/>
      {label}
    </label>
  );

  return(
    <div style={{minHeight:"100vh",background:"#F0F4FF",paddingTop:64}}>

      {/* Hero banner */}
      <div style={{background:C.navy,padding:"52px 20px 44px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 70% 80% at 20% 50%,${C.amber}0C,transparent 60%),radial-gradient(ellipse 50% 60% at 80% 30%,${C.blue}0A,transparent 55%)`}}/>
        <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:1}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(245,166,35,0.15)",border:"1px solid rgba(245,166,35,0.3)",borderRadius:20,padding:"4px 14px",marginBottom:16,fontSize:11,color:C.amber,fontWeight:700}}>🚐 Private &amp; Group Transport</div>
          <h1 className="ral" style={{fontSize:"clamp(28px,4.5vw,52px)",fontWeight:900,color:"#fff",lineHeight:1.08,marginBottom:12}}>Hire a Van</h1>
          <p style={{color:"rgba(168,186,218,0.9)",fontSize:15,maxWidth:540,lineHeight:1.8,marginBottom:24}}>Private transport for religious events, school trips, corporate travel, and more. Get a quote instantly — we'll confirm within 2 hours.</p>
          <div style={{display:"flex",gap:18,flexWrap:"wrap",fontSize:12,color:"rgba(168,186,218,0.7)"}}>
            {["⛪ Religious Events","🏫 School Transport","💼 Corporate","👨‍👩‍👧 Private Groups","✈️ Airport Transfers"].map(t=>(
              <span key={t} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"4px 12px"}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"32px 20px 52px"}}>

        {/* ── STEP 1: Category ── */}
        {step===1&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h2 className="ral" style={{fontSize:22,fontWeight:900,color:C.navy,marginBottom:6}}>What type of hire do you need?</h2>
            <p style={{color:"#5B7299",fontSize:13,marginBottom:24}}>Select the category that best describes your trip.</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14,marginBottom:28}}>
              {HIRE_CATEGORIES.map(cat=>(
                <div key={cat.id} onClick={()=>setCategory(cat.id)}
                  style={{background:category===cat.id?C.navy:"#FFFFFF",border:`2px solid ${category===cat.id?C.amber:"#D8E2F5"}`,borderRadius:16,padding:"20px 18px",cursor:"pointer",transition:"all .2s"}}>
                  <div style={{fontSize:30,marginBottom:10}}>{cat.icon}</div>
                  <div className="ral" style={{fontWeight:800,fontSize:15,color:category===cat.id?"#fff":C.navy,marginBottom:5}}>{cat.label}</div>
                  <p style={{fontSize:12,color:category===cat.id?"rgba(255,255,255,0.65)":"#5B7299",lineHeight:1.6}}>{cat.desc}</p>
                  {category===cat.id&&<div style={{marginTop:10,width:18,height:18,borderRadius:"50%",background:C.amber,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:C.navy}}>✓</div>}
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"flex-end"}}>
              <Btn onClick={()=>setStep(2)} disabled={!category} style={{padding:"13px 32px",fontSize:14}}>Continue →</Btn>
            </div>
          </div>
        )}

        {/* ── STEP 2: Details ── */}
        {step===2&&selectedCat&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
              <button onClick={()=>setStep(1)} style={{background:"none",border:"1px solid #D8E2F5",color:"#5B7299",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontFamily:"'Nunito',sans-serif"}}>← Back</button>
              <div style={{fontSize:20}}>{selectedCat.icon}</div>
              <div>
                <div className="ral" style={{fontWeight:800,fontSize:18,color:C.navy}}>{selectedCat.label}</div>
                <div style={{fontSize:12,color:"#5B7299"}}>Fill in your trip details to receive a quote</div>
              </div>
            </div>

            <div style={{display:"grid",gap:18}}>

              {/* Contact Info */}
              <div style={{background:"#FFFFFF",border:"1.5px solid #D8E2F5",borderRadius:16,padding:"22px 20px"}}>
                <h3 className="ral" style={{fontWeight:800,fontSize:16,color:C.navy,marginBottom:16}}>👤 Contact Information</h3>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  {F("Full Name","name","text","Your full name",true)}
                  {F("Phone Number","phone","tel","+256 7XX XXX XXX",true)}
                  {F("Email Address","email","email","your@email.com")}
                  {(category==="religious"||category==="school"||category==="corporate")&&F("Organisation / Ministry / School","orgName","text","Organisation name")}
                  {category==="longterm"&&(<>
                    <div style={{background:"rgba(245,166,35,0.08)",border:"1px solid rgba(245,166,35,0.2)",borderRadius:10,padding:"14px 16px",marginBottom:4}}>
                      <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:15,color:C.amber,marginBottom:8}}>Long-Term Contract Hire</div>
                      <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textSecondary,lineHeight:1.7}}>For NGOs, embassies, UN agencies, universities and companies requiring dedicated vehicle(s) for extended periods. We offer flexible contracts from 3 months to 3 years.</div>
                    </div>
                    {F("Organisation Name","orgName","text","Full legal name of organisation")}
                    {F("Sector / Type","sector","text","e.g. NGO, Embassy, University")}
                    {F("Contract Duration","contractDuration","text","e.g. 1 year, 6 months")}
                    {F("Number of Vehicles","numVehicles","number","e.g. 2")}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div>
                        <label style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textSecondary,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Vehicle Type(s) Required</label>
                        <select value={form.vehicleType||""} onChange={e=>setForm({...form,vehicleType:e.target.value})} style={{width:"100%",background:"rgba(168,186,218,0.07)",border:"1px solid rgba(168,186,218,0.18)",borderRadius:10,padding:"11px 14px",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Inter',sans-serif"}}>
                          <option value="">Select vehicle type</option>
                          {LONGTERM_VEHICLE_TYPES.map(v=><option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textSecondary,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Operating Zone / Route</label>
                        <input value={form.destination||""} onChange={e=>setForm({...form,destination:e.target.value})} placeholder="e.g. Kampala, upcountry, national" style={{width:"100%",background:"rgba(168,186,218,0.07)",border:"1px solid rgba(168,186,218,0.18)",borderRadius:10,padding:"11px 14px",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Inter',sans-serif",boxSizing:"border-box"}}/>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div>
                        <label style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textSecondary,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:10}}>Driver Arrangement</label>
                        <div style={{display:"flex",gap:10}}>
                          {["Raylane provides driver","Client has own driver"].map(opt=>(
                            <label key={opt} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textSecondary}}>
                              <input type="radio" name="driverArrangement" value={opt} checked={form.driverArrangement===opt} onChange={e=>setForm({...form,driverArrangement:e.target.value})} style={{accentColor:C.amber}}/>{opt}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textSecondary,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Contract Start Date</label>
                        <input type="date" value={form.date||""} onChange={e=>setForm({...form,date:e.target.value})} style={{width:"100%",background:"rgba(168,186,218,0.07)",border:"1px solid rgba(168,186,218,0.18)",borderRadius:10,padding:"11px 14px",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Inter',sans-serif",boxSizing:"border-box"}}/>
                      </div>
                    </div>
                    {F("Annual / Monthly Budget Estimate (UGX, optional)","budgetEst","text","e.g. UGX 5,000,000/month")}
                  </>)}
                </div>
              </div>

              {/* Religious-specific */}
              {category==="religious"&&(
                <div style={{background:"#FFFFFF",border:"1.5px solid #D8E2F5",borderRadius:16,padding:"22px 20px"}}>
                  <h3 className="ral" style={{fontWeight:800,fontSize:16,color:C.navy,marginBottom:16}}>⛪ Religious Event Details</h3>
                  <div style={{background:"rgba(245,166,35,0.08)",border:"1px solid rgba(245,166,35,0.25)",borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:12,color:"#7A5500"}}>
                    🌟 Special discounted group rates available for churches and ministries. Mention your event during confirmation.
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    {F("Ministry / Church Name","ministryName","text","e.g. Phaneroo Ministries")}
                    {S("Event Type","eventType",[{value:"",label:"Select event type"},...RELIGIOUS_EVENTS.map(e=>({value:e,label:e}))])}
                  </div>
                </div>
              )}

              {/* School-specific */}
              {category==="school"&&(
                <div style={{background:"#FFFFFF",border:"1.5px solid #D8E2F5",borderRadius:16,padding:"22px 20px"}}>
                  <h3 className="ral" style={{fontWeight:800,fontSize:16,color:C.navy,marginBottom:16}}>🏫 School Transport Details</h3>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                    {F("School Name","schoolName","text","Full school name",true)}
                    {S("Type of Trip","tripType",[{value:"",label:"Select trip type"},...SCHOOL_TRIP_TYPES.map(t=>({value:t,label:t}))])}
                    {S("Safe Haven Drop-off Location","safeHaven",[{value:"",label:"Select Safe Haven"},...SAFE_HAVENS.map(s=>({value:s,label:s}))])}
                    {form.safeHaven==="Other (specify below)"&&F("Specify Safe Haven Location","safeHavenOther","text","Describe drop-off point")}
                  </div>
                  <div style={{background:"rgba(59,130,246,0.06)",border:"1px solid rgba(59,130,246,0.2)",borderRadius:12,padding:"16px 18px"}}>
                    <h4 className="ral" style={{fontWeight:800,fontSize:14,color:C.navy,marginBottom:4}}>🔒 PTA Authorized Pickup Person</h4>
                    <p style={{fontSize:11,color:"#5B7299",marginBottom:14,lineHeight:1.6}}>For student safety, provide details of the PTA representative or authorized adult who will receive the students. Driver details will be shared with them before the trip.</p>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      {F("Authorized Person Name","ptaName","text","Full name",true)}
                      {F("Phone Number","ptaPhone","tel","+256 7XX XXX XXX",true)}
                      {F("National ID Number","ptaId","text","ID / Passport number",true)}
                      {F("Relationship to School","ptaRelation","text","e.g. PTA Chair, Teacher Rep")}
                    </div>
                    <div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:8,padding:"9px 12px",marginTop:12,fontSize:11,color:"#15803D"}}>
                      ✓ Driver name, phone, vehicle registration and ETA will be sent to the authorized person via WhatsApp before departure.
                    </div>
                  </div>
                </div>
              )}

              {/* Trip Details */}
              <div style={{background:"#FFFFFF",border:"1.5px solid #D8E2F5",borderRadius:16,padding:"22px 20px"}}>
                <h3 className="ral" style={{fontWeight:800,fontSize:16,color:C.navy,marginBottom:16}}>🗺️ Trip Details</h3>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                  {F("Pickup Location","pickup","text","Where should we collect you?",true)}
                  {F("Destination","destination","text","Where are you going?",true)}
                  {F("Date of Travel","date","date","",true)}
                  {S("Trip Type","tripMode",[{value:"one-way",label:"One-way"},{value:"return",label:"Return trip"},{value:"multi-day",label:"Multi-day event"}])}
                  {(form.tripMode==="return"||form.tripMode==="multi-day")&&F("Return / End Date","returnDate","date","")}
                  {F("Number of Passengers","passengers","number","e.g. 14",true)}
                  {S("Vehicle Type Required","vehicleType",[{value:"",label:"Select vehicle type"},...VEHICLE_TYPES.map(v=>({value:v,label:v}))])}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {Check("I need multiple vans (large group)","multipleVans")}
                  {Check("Overnight hire required","overnightHire")}
                  {Check("Multiple stops required","multiStop")}
                </div>
              </div>

              {/* Driver & Special Requests */}
              <div style={{background:"#FFFFFF",border:"1.5px solid #D8E2F5",borderRadius:16,padding:"22px 20px"}}>
                <h3 className="ral" style={{fontWeight:800,fontSize:16,color:C.navy,marginBottom:14}}>⚙️ Driver &amp; Special Requests</h3>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  {S("Driver","driverOption",[{value:"raylane",label:"Raylane provides driver (recommended)"},{value:"own",label:"We will provide our own driver"}])}
                  {F("Luggage Requirements","luggage","text","Describe luggage or cargo")}
                </div>
                <div style={{marginTop:14}}>
                  <label style={{fontSize:11,color:C.navy,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase",display:"block",marginBottom:5}}>Special Requests / Notes</label>
                  <textarea value={form.specialRequests||""} onChange={e=>setForm({...form,specialRequests:e.target.value})} rows={3} placeholder="Any other requirements, accessibility needs, or instructions for this hire..."
                    style={{width:"100%",background:"#F8FAFF",border:"1.5px solid #D8E2F5",borderRadius:9,padding:"10px 13px",color:C.navy,fontSize:13,outline:"none",resize:"vertical",fontFamily:"'Nunito',sans-serif",boxSizing:"border-box"}}
                    onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor="#D8E2F5"}/>
                </div>
              </div>

              {/* Driver Transparency Notice */}
              <div style={{background:"rgba(13,27,62,0.04)",border:"1.5px solid #D8E2F5",borderRadius:14,padding:"16px 18px",display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{fontSize:24,flexShrink:0}}>🔔</div>
                <div>
                  <div className="ral" style={{fontWeight:800,fontSize:14,color:C.navy,marginBottom:4}}>Driver Transparency — Auto Notification</div>
                  <p style={{fontSize:12,color:"#5B7299",lineHeight:1.7}}>Once your booking is confirmed, we automatically send driver details via <strong>WhatsApp &amp; SMS</strong> to your contact (and PTA person for school trips). You'll receive: driver name, phone number, vehicle registration, vehicle type, and estimated arrival time.</p>
                </div>
              </div>

              <div style={{display:"flex",gap:10,justifyContent:"flex-end",flexWrap:"wrap"}}>
                <button onClick={()=>setStep(1)} style={{background:"none",border:"1px solid #D8E2F5",color:"#5B7299",borderRadius:10,padding:"11px 22px",cursor:"pointer",fontSize:13,fontFamily:"'Nunito',sans-serif",fontWeight:600}}>← Back</button>
                <Btn onClick={()=>setStep(3)} disabled={!form.name||!form.phone||!form.pickup||!form.destination||!form.date||!form.passengers} style={{padding:"13px 32px",fontSize:14}}>Review Quote →</Btn>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Review ── */}
        {step===3&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
              <button onClick={()=>setStep(2)} style={{background:"none",border:"1px solid #D8E2F5",color:"#5B7299",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontFamily:"'Nunito',sans-serif"}}>← Edit</button>
              <div><div className="ral" style={{fontWeight:900,fontSize:20,color:C.navy}}>Review Your Hire Request</div><div style={{fontSize:12,color:"#5B7299"}}>Please confirm all details before submitting</div></div>
            </div>
            <div style={{background:"#FFFFFF",border:"1.5px solid #D8E2F5",borderRadius:18,padding:"24px 22px",marginBottom:18}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,paddingBottom:14,borderBottom:"1px solid #E8EDF8"}}>
                <span style={{fontSize:26}}>{selectedCat?.icon}</span>
                <div>
                  <div className="ral" style={{fontWeight:800,fontSize:17,color:C.navy}}>{selectedCat?.label}</div>
                  {form.orgName&&<div style={{fontSize:12,color:"#5B7299"}}>{form.orgName}</div>}
                </div>
                <div style={{marginLeft:"auto",background:"rgba(245,166,35,0.1)",border:"1px solid rgba(245,166,35,0.3)",borderRadius:10,padding:"6px 14px",fontSize:12,fontWeight:700,color:"#7A5500"}}>Quote Request</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 24px"}}>
                {[
                  ["Contact",form.name],["Phone",form.phone],form.email&&["Email",form.email],
                  ["Pickup",form.pickup],["Destination",form.destination],
                  ["Date",form.date],["Trip Type",form.tripMode],
                  form.returnDate&&["Return Date",form.returnDate],
                  ["Passengers",form.passengers],form.vehicleType&&["Vehicle",form.vehicleType],
                  form.driverOption&&["Driver",form.driverOption==="raylane"?"Raylane provides":"Client provides"],
                  category==="religious"&&form.ministryName&&["Ministry",form.ministryName],
                  category==="religious"&&form.eventType&&["Event",form.eventType],
                  category==="school"&&form.schoolName&&["School",form.schoolName],
                  category==="school"&&form.tripType&&["Trip Type",form.tripType],
                  category==="school"&&form.safeHaven&&["Safe Haven",form.safeHaven],
                  category==="school"&&form.ptaName&&["PTA Contact",`${form.ptaName} · ${form.ptaPhone}`],
                  form.multipleVans&&["Multiple Vans","Yes"],
                  form.overnightHire&&["Overnight Hire","Yes"],
                  form.multiStop&&["Multiple Stops","Yes"],
                ].filter(Boolean).map(([k,v])=>v&&(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #F0F4FF",fontSize:13}}>
                    <span style={{color:"#8899BB",fontWeight:600}}>{k}</span>
                    <span style={{fontWeight:700,color:C.navy,textAlign:"right",maxWidth:"55%"}}>{v}</span>
                  </div>
                ))}
              </div>
              {form.specialRequests&&(
                <div style={{marginTop:14,background:"#F8FAFF",border:"1px solid #E8EDF8",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#5B7299"}}>
                  <strong style={{color:C.navy}}>Notes:</strong> {form.specialRequests}
                </div>
              )}
            </div>
            <div style={{background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:12,padding:"14px 18px",marginBottom:20,fontSize:12,color:"#15803D",display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:18,flexShrink:0}}>📋</span>
              <span>Your quote request will be reviewed by our team. We'll confirm availability, assign a vehicle, and send you a final quote within <strong>2 hours</strong> via WhatsApp.</span>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button onClick={()=>setStep(2)} style={{background:"none",border:"1px solid #D8E2F5",color:"#5B7299",borderRadius:10,padding:"11px 22px",cursor:"pointer",fontSize:13,fontFamily:"'Nunito',sans-serif",fontWeight:600}}>← Edit</button>
              <Btn onClick={handleSubmit} style={{padding:"13px 32px",fontSize:14}}>✅ Submit Hire Request</Btn>
            </div>
          </div>
        )}

        {/* ── STEP 4: Confirmation ── */}
        {step===4&&submitted&&(
          <div style={{animation:"fadeUp .4s ease",maxWidth:560,margin:"0 auto",textAlign:"center"}}>
            <div style={{fontSize:56,marginBottom:14}}>🎉</div>
            <h2 className="ral" style={{fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Hire Request Submitted!</h2>
            <p style={{color:"#5B7299",marginBottom:28,fontSize:14}}>Our team will review your request and confirm within 2 hours via WhatsApp.</p>
            <div style={{background:"#FFFFFF",border:"1.5px solid #D8E2F5",borderRadius:18,padding:"24px 22px",marginBottom:20,textAlign:"left"}}>
              <div style={{textAlign:"center",marginBottom:18,paddingBottom:14,borderBottom:"1px solid #E8EDF8"}}>
                <div style={{fontSize:11,color:"#8899BB",letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Reference Number</div>
                <div className="ral" style={{fontWeight:900,fontSize:26,color:C.amber,letterSpacing:1}}>{submitted.ref}</div>
              </div>
              {[
                ["Category",submitted.categoryLabel],
                ["Contact",submitted.name],
                ["Phone",submitted.phone],
                ["Route",`${submitted.pickup} → ${submitted.destination}`],
                ["Date",submitted.date],
                submitted.passengers&&["Passengers",submitted.passengers],
                submitted.vehicleType&&["Vehicle Requested",submitted.vehicleType],
              ].filter(Boolean).map(([k,v])=>v&&(
                <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"7px 0",borderBottom:"1px solid #F4F7FF"}}>
                  <span style={{color:"#8899BB"}}>{k}</span><span style={{fontWeight:700,color:C.navy}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{background:"rgba(59,130,246,0.06)",border:"1px solid rgba(59,130,246,0.2)",borderRadius:12,padding:"14px 18px",fontSize:12,color:"#1D4ED8",marginBottom:24,textAlign:"left",display:"flex",gap:10}}>
              <span style={{fontSize:18}}>🔔</span>
              <span>Driver details (name, phone, vehicle registration &amp; ETA) will be sent to <strong>{submitted.phone}</strong> via WhatsApp once confirmed.{category==="school"&&submitted.ptaName&&<> PTA contact <strong>{submitted.ptaName}</strong> will also be notified.</>}</span>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={()=>{setStep(1);setCategory("");setForm({pickup:"",destination:"",date:"",returnDate:"",passengers:"",vehicleType:"",multipleVans:false,overnightHire:false,multiStop:false,driverOption:"raylane",luggage:"",specialRequests:"",name:"",phone:"",email:"",orgName:"",eventType:"",ministryName:"",schoolName:"",tripType:"",safeHaven:"",safeHavenOther:"",ptaName:"",ptaPhone:"",ptaId:"",ptaRelation:"",tripMode:"one-way"});setSubmitted(null);}}
                style={{background:C.navy,color:"#fff",border:"none",borderRadius:10,padding:"12px 24px",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:13}}>Make Another Booking</button>
              <button onClick={()=>setPage&&setPage("home")} style={{background:"none",border:"1.5px solid #D8E2F5",color:"#5B7299",borderRadius:10,padding:"12px 24px",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:600,fontSize:13}}>Back to Home</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PAGE: SAFETY
// ═══════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════
// PAGE: ABOUT US
// ═══════════════════════════════════════════════════════════════════════
const AboutPage=()=>(
  <div style={{minHeight:"100vh",background:"#F0F4FF",paddingTop:64}}>
    <div style={{background:C.navy,padding:"60px 20px 50px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 70% 80% at 20% 50%,${C.amber}0C,transparent 60%)`}}/>
      <div style={{maxWidth:900,margin:"0 auto",position:"relative",zIndex:1,textAlign:"center"}}>
        <div style={{fontSize:50,marginBottom:14}}>🚐</div>
        <h1 className="ral" style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:900,color:"#fff",marginBottom:12}}>About Raylane Express</h1>
        <p style={{color:"rgba(168,186,218,0.85)",fontSize:15,maxWidth:520,margin:"0 auto",lineHeight:1.9}}>Uganda's most trusted intercity transport network — connecting families, businesses, and communities since 2018.</p>
      </div>
    </div>
    <div style={{maxWidth:900,margin:"0 auto",padding:"48px 20px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:18,marginBottom:36}}>
        {[
          {icon:"🎯",title:"Our Mission",body:"To provide safe, reliable, and timely transport across Uganda — ensuring every passenger reaches their destination comfortably and on time."},
          {icon:"👁️",title:"Our Vision",body:"To be Uganda's leading transport provider, connecting every corner of the country with dignity, technology, and care."},
          {icon:"💡",title:"Our Values",body:"Safety first. Integrity in every trip. Community above profit. Innovation in transport. Accountability to every passenger."},
        ].map(item=>(
          <div key={item.title} style={{background:"#FFFFFF",border:"1.5px solid #D8E2F5",borderRadius:18,padding:"24px 20px"}}>
            <div style={{fontSize:32,marginBottom:10}}>{item.icon}</div>
            <div className="ral" style={{fontWeight:800,fontSize:16,color:C.navy,marginBottom:8}}>{item.title}</div>
            <p style={{fontSize:13,color:"#5B7299",lineHeight:1.8}}>{item.body}</p>
          </div>
        ))}
      </div>
      <div style={{background:"#FFFFFF",border:"1.5px solid #D8E2F5",borderRadius:18,padding:"28px 24px",marginBottom:20}}>
        <h2 className="ral" style={{fontSize:22,fontWeight:900,color:C.navy,marginBottom:16}}>Our Story</h2>
        <p style={{fontSize:14,color:"#4B5E80",lineHeight:2,marginBottom:14}}>Raylane Express was founded in 2018 with a single van and a mission: to make intercity travel in Uganda safe, affordable, and dignified. What started as a Kampala–Gulu route has grown into a multi-route network serving hundreds of passengers daily.</p>
        <p style={{fontSize:14,color:"#4B5E80",lineHeight:2}}>Today, Raylane operates across Uganda's major cities and towns, offering standard passenger transport, advance booking, private van hire, and a parcel courier service. We are proud to serve religious organizations, schools, businesses, and everyday Ugandans who deserve better transport.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:14}}>
        {[["500+","Passengers daily"],["10+","Routes covered"],["2018","Founded"],["4.8★","Average rating"]].map(([v,l])=>(
          <div key={l} style={{background:C.navy,borderRadius:14,padding:"20px 16px",textAlign:"center"}}>
            <div className="ral" style={{fontSize:28,fontWeight:900,color:C.amber}}>{v}</div>
            <div style={{fontSize:11,color:"rgba(168,186,218,0.7)",marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// PAGE: CAREERS
// ═══════════════════════════════════════════════════════════════════════
const CareersPage=()=>{
  const jobs=[
    {title:"Intercity Driver",type:"Full-time",location:"Kampala & Upcountry",desc:"Experienced, licensed drivers for daily intercity routes. Clean record required.",reqs:["Valid driving permit (Class D/DL)","2+ years intercity experience","Good communication skills","No criminal record"]},
    {title:"Booking Agent",type:"Full-time",location:"Kampala",desc:"Handle customer bookings, payments, and schedules at our Nakasero terminal.",reqs:["Certificate in business or IT","Strong customer service skills","Proficiency in basic computer use","Honest and reliable"]},
    {title:"Terminal Coordinator",type:"Full-time",location:"Gulu / Mbarara",desc:"Oversee departures, passenger boarding, and van scheduling at upcountry terminals.",reqs:["Diploma in logistics or management","Leadership qualities","Knowledge of the local area","Good communication"]},
    {title:"Parcel Handler",type:"Part-time",location:"Multiple Locations",desc:"Sort, handle, and deliver parcels for our growing courier service.",reqs:["Physical fitness","Attention to detail","Honesty and integrity","Smartphone literacy"]},
  ];
  return(
    <div style={{minHeight:"100vh",background:"#F0F4FF",paddingTop:64}}>
      <div style={{background:C.navy,padding:"60px 20px 50px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 60% 70% at 80% 50%,${C.blue}0A,transparent 55%)`}}/>
        <div style={{maxWidth:900,margin:"0 auto",position:"relative",zIndex:1}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(245,166,35,0.15)",border:"1px solid rgba(245,166,35,0.3)",borderRadius:20,padding:"4px 14px",marginBottom:16,fontSize:11,color:C.amber,fontWeight:700}}>💼 Join Our Team</div>
          <h1 className="ral" style={{fontSize:"clamp(26px,4vw,46px)",fontWeight:900,color:"#fff",marginBottom:12}}>Careers at Raylane Express</h1>
          <p style={{color:"rgba(168,186,218,0.85)",fontSize:14,maxWidth:500,lineHeight:1.8}}>We're growing fast and looking for passionate people to help us connect Uganda. Join a team that values safety, service, and people.</p>
        </div>
      </div>
      <div style={{maxWidth:900,margin:"0 auto",padding:"40px 20px"}}>
        <h2 className="ral" style={{fontSize:20,fontWeight:900,color:C.navy,marginBottom:20}}>Open Positions</h2>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {jobs.map((job,i)=>(
            <div key={i} style={{background:"#FFFFFF",border:"1.5px solid #D8E2F5",borderRadius:18,padding:"22px 22px",animation:`fadeUp ${.1+i*.07}s ease`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:10}}>
                <div>
                  <div className="ral" style={{fontWeight:900,fontSize:18,color:C.navy}}>{job.title}</div>
                  <div style={{display:"flex",gap:10,marginTop:5,flexWrap:"wrap"}}>
                    <span style={{background:"rgba(245,166,35,0.12)",border:"1px solid rgba(245,166,35,0.3)",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700,color:"#7A5500"}}>{job.type}</span>
                    <span style={{background:"rgba(13,27,62,0.07)",border:"1px solid #D8E2F5",borderRadius:20,padding:"2px 10px",fontSize:11,color:"#5B7299"}}>📍 {job.location}</span>
                  </div>
                </div>
                <button style={{background:C.navy,color:"#fff",border:"none",borderRadius:10,padding:"9px 20px",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:12}}>Apply Now →</button>
              </div>
              <p style={{fontSize:13,color:"#5B7299",lineHeight:1.7,marginBottom:12}}>{job.desc}</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {job.reqs.map(r=>(
                  <span key={r} style={{background:"#F0F4FF",border:"1px solid #D8E2F5",borderRadius:8,padding:"3px 10px",fontSize:11,color:"#4B5E80"}}>✓ {r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{background:C.amber,borderRadius:18,padding:"28px 24px",marginTop:28,textAlign:"center"}}>
          <div className="ral" style={{fontSize:20,fontWeight:900,color:"#0D1B3E",marginBottom:8}}>Don't see your role?</div>
          <p style={{fontSize:13,color:"rgba(13,27,62,0.75)",marginBottom:16}}>We're always open to talented people. Send your CV to <strong>careers@raylane.ug</strong> and we'll be in touch.</p>
          <button style={{background:"#0D1B3E",color:"#fff",border:"none",borderRadius:10,padding:"11px 28px",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:13}}>📧 Send Open Application</button>
        </div>
      </div>
    </div>
  );
};

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
const LoginPage=({onLogin,agents,defaultRole="agent"})=>{
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [role,setRole]=useState(defaultRole);
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
// ── Table helpers (used by admin sections) ───────────────────────────────
const TH=({children})=><th style={{padding:"12px 14px",textAlign:"left",fontSize:10,color:C.textMuted,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase",background:C.navyMid,borderBottom:`1px solid ${C.navyBorder}`}}>{children}</th>;
const TD=({children,style:s={}})=><td style={{padding:"11px 14px",fontSize:13,borderBottom:`1px solid ${C.navyBorder}`,...s}}>{children}</td>;

// ── Admin sub-sections (extracted as proper components to avoid IIFE hook issues) ──
const AdminCouponsSection=({store})=>{
  const [showAdd,setShowAdd]=useState(false);
  const [cpForm,setCpForm]=useState({code:"",type:"percent",value:"",description:"",minAmount:"",usageLimit:"100",expires:""});
  return(
<div style={{animation:"fadeUp .3s ease"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
    <h1 className="ral" style={{fontSize:24,fontWeight:900}}>Coupons &amp; Discount Codes</h1>
    <Btn onClick={()=>setShowAdd(!showAdd)} style={{fontSize:12,padding:"8px 18px"}}>+ New Coupon</Btn>
  </div>
  {showAdd&&(
    <Card style={{marginBottom:20,border:`1px solid ${C.amber}33`}}>
      <h3 className="ral" style={{fontWeight:700,marginBottom:16,color:C.amber}}>Create Coupon</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Input label="Coupon Code" value={cpForm.code} onChange={e=>setCpForm({...cpForm,code:e.target.value.toUpperCase()})} placeholder="e.g. JINJA20"/>
        <Sel label="Discount Type" value={cpForm.type} onChange={e=>setCpForm({...cpForm,type:e.target.value})} options={[{value:"percent",label:"Percentage (%)"},{value:"fixed",label:"Fixed Amount (UGX)"}]}/>
        <Input label={cpForm.type==="percent"?"Discount %":"Discount Amount (UGX)"} value={cpForm.value} onChange={e=>setCpForm({...cpForm,value:e.target.value})} type="number" placeholder={cpForm.type==="percent"?"15":"10000"}/>
        <Input label="Min Booking Amount (UGX)" value={cpForm.minAmount} onChange={e=>setCpForm({...cpForm,minAmount:e.target.value})} type="number" placeholder="20000"/>
        <Input label="Usage Limit" value={cpForm.usageLimit} onChange={e=>setCpForm({...cpForm,usageLimit:e.target.value})} type="number" placeholder="100"/>
        <Input label="Expiry Date" value={cpForm.expires} onChange={e=>setCpForm({...cpForm,expires:e.target.value})} type="date"/>
        <div style={{gridColumn:"1/-1"}}><Input label="Description" value={cpForm.description} onChange={e=>setCpForm({...cpForm,description:e.target.value})} placeholder="e.g. 20% off all Jinja routes"/></div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:14}}>
        <Btn onClick={()=>{
          if(!cpForm.code||!cpForm.value||!cpForm.expires) return;
          store.addCoupon({code:cpForm.code,type:cpForm.type,value:Number(cpForm.value),description:cpForm.description,minAmount:Number(cpForm.minAmount)||0,usageLimit:Number(cpForm.usageLimit)||100,active:true,expires:cpForm.expires});
          setShowAdd(false); setCpForm({code:"",type:"percent",value:"",description:"",minAmount:"",usageLimit:"100",expires:""});
        }} style={{fontSize:12,padding:"9px 20px"}}>Create Coupon</Btn>
        <Btn onClick={()=>setShowAdd(false)} variant="navy" style={{fontSize:12,padding:"9px 20px",border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
      </div>
    </Card>
  )}
  <Card style={{padding:0,overflow:"hidden"}}>
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr>{["Code","Type","Discount","Min Amount","Used","Limit","Expires","Status",""].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
      <tbody>
        {(store.coupons||[]).map(c=>(
          <tr key={c.id} onMouseEnter={e=>e.currentTarget.style.background=C.navyMid} onMouseLeave={e=>e.currentTarget.style.background=""}>
            <TD><span style={{fontFamily:"'Raleway',sans-serif",fontWeight:800,color:C.amber,fontSize:13,letterSpacing:1}}>{c.code}</span></TD>
            <TD style={{color:C.textSecondary,fontSize:11}}>{c.type==="percent"?"Percent":"Fixed"}</TD>
            <TD style={{fontWeight:700,color:C.green}}>{c.type==="percent"?`${c.value}%`:formatUGX(c.value)}</TD>
            <TD style={{color:C.textSecondary}}>{formatUGX(c.minAmount)}</TD>
            <TD>{c.usedCount}</TD>
            <TD>{c.usageLimit}</TD>
            <TD style={{color:C.textSecondary,fontSize:11}}>{c.expires}</TD>
            <TD><StatusBadge status={c.active?"confirmed":"pending"}/></TD>
            <TD><Btn onClick={()=>store.toggleCoupon(c.id)} variant="navy" style={{padding:"4px 10px",fontSize:10,border:`1px solid ${C.navyBorder}`}}>{c.active?"Disable":"Enable"}</Btn></TD>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
</div>
  );
};

const AdminAmbassadorsSection=({store})=>{
  const [ambTab,setAmbTab]=useState("applications");
  return(
<div style={{animation:"fadeUp .3s ease"}}>
  <h1 className="ral" style={{fontSize:24,fontWeight:900,marginBottom:4}}>Brand Ambassadors</h1>
  <p style={{color:C.textMuted,fontSize:13,marginBottom:20}}>Manage ambassador applications, referrals, and commission payouts.</p>
  <div style={{display:"flex",gap:0,marginBottom:20,background:C.navyMid,borderRadius:12,padding:4,width:"fit-content"}}>
    {[{id:"applications",label:"Applications"},{id:"commissions",label:"Commission Payouts"},{id:"settings",label:"Rate Settings"}].map(t=>(
      <button key={t.id} onClick={()=>setAmbTab(t.id)} style={{padding:"8px 18px",background:ambTab===t.id?C.amber:"transparent",color:ambTab===t.id?C.navy:C.textSecondary,border:"none",borderRadius:9,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>{t.label}</button>
    ))}
  </div>

  {ambTab==="applications"&&(
    <div>
      {(store.ambassadors||[]).filter(a=>a.status==="pending").length>0&&(
        <div style={{background:"rgba(245,166,35,0.1)",border:`1px solid ${C.amber}33`,borderRadius:12,padding:"10px 16px",marginBottom:16,fontSize:12,color:C.amber,fontWeight:600}}>
          ⏳ {(store.ambassadors||[]).filter(a=>a.status==="pending").length} application(s) awaiting review
        </div>
      )}
      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Name","Email","Phone","Applied","Referral Code","Referrals","Status","Actions"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {(store.ambassadors||[]).map(a=>(
              <tr key={a.id} onMouseEnter={e=>e.currentTarget.style.background=C.navyMid} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <TD><span style={{fontWeight:700}}>{a.name}</span></TD>
                <TD style={{color:C.textSecondary,fontSize:11}}>{a.email}</TD>
                <TD style={{color:C.textSecondary,fontSize:11}}>{a.phone}</TD>
                <TD style={{color:C.textSecondary,fontSize:11}}>{a.appliedAt}</TD>
                <TD><span style={{fontFamily:"'Raleway',sans-serif",fontWeight:800,color:C.amber,fontSize:12}}>{a.refCode}</span></TD>
                <TD style={{textAlign:"center"}}>{a.totalReferrals}</TD>
                <TD><StatusBadge status={a.status}/></TD>
                <TD>
                  {a.status==="pending"&&(
                    <div style={{display:"flex",gap:6}}>
                      <Btn onClick={()=>store.approveAmbassador(a.id)} style={{padding:"4px 10px",fontSize:10}}>Approve</Btn>
                      <Btn onClick={()=>store.rejectAmbassador(a.id)} variant="navy" style={{padding:"4px 10px",fontSize:10,border:`1px solid ${C.red}55`,color:C.red}}>Reject</Btn>
                    </div>
                  )}
                  {a.status==="approved"&&<StatusBadge status="confirmed"/>}
                  {a.status==="rejected"&&<StatusBadge status="cancelled"/>}
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )}

  {ambTab==="commissions"&&(
    <div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:20}}>
        <StatCard label="Pending Payouts" value={(store.pendingCommissions||[]).filter(c=>c.status==="pending").length} icon="⏳" color={C.orange}/>
        <StatCard label="Total Paid" value={formatUGX((store.pendingCommissions||[]).filter(c=>c.status==="paid").reduce((s,c)=>s+c.commission,0))} icon="✅" color={C.green}/>
        <StatCard label="Outstanding" value={formatUGX((store.pendingCommissions||[]).filter(c=>c.status==="pending").reduce((s,c)=>s+c.commission,0))} icon="💰" color={C.amber}/>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Commission ID","Ambassador","Booking","Amount","Commission","Date","Status","Action"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {(store.pendingCommissions||[]).map(c=>(
              <tr key={c.id} onMouseEnter={e=>e.currentTarget.style.background=C.navyMid} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <TD><span style={{color:C.textMuted,fontSize:11}}>{c.id}</span></TD>
                <TD style={{fontWeight:700}}>{c.ambassadorName}</TD>
                <TD><span style={{color:C.amber,fontFamily:"'Raleway',sans-serif",fontWeight:700,fontSize:12}}>{c.bookingCode}</span></TD>
                <TD>{formatUGX(c.bookingAmount)}</TD>
                <TD><span style={{fontWeight:700,color:C.green}}>{formatUGX(c.commission)}</span></TD>
                <TD style={{color:C.textSecondary,fontSize:11}}>{c.date}</TD>
                <TD><StatusBadge status={c.status}/></TD>
                <TD>
                  {c.status==="pending"&&(
                    <Btn onClick={()=>store.approveCommission(c.id)} style={{padding:"4px 12px",fontSize:11}}>Approve Payout</Btn>
                  )}
                  {c.status==="paid"&&<span style={{fontSize:11,color:C.green}}>✓ Paid</span>}
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )}

  {ambTab==="settings"&&(
    <Card style={{maxWidth:500}}>
      <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Commission Settings</h3>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{background:C.amber+"18",border:`1px solid ${C.amber}33`,borderRadius:10,padding:"12px 16px"}}>
          <div style={{fontWeight:700,fontSize:14,color:C.amber,marginBottom:4}}>Current Rate: {store.commissionRate}% per referral booking</div>
          <div style={{fontSize:12,color:C.textSecondary}}>Ambassadors earn this percentage on every booking placed through their referral link.</div>
        </div>
        <Input label="Commission Rate (%)" value={String(store.commissionRate)} onChange={e=>store.setCommissionRate(Number(e.target.value))} type="number" placeholder="5"/>
        <div style={{fontSize:11,color:C.textMuted}}>⚠️ Changing this rate affects all future commissions. Past approved commissions are unaffected.</div>
        <Btn full style={{padding:"12px"}}>Save Commission Rate</Btn>
      </div>
    </Card>
  )}
</div>
  );
};

const AdminDestinationsSection=({store})=>{
  const [selCity,setSelCity]=useState(null);
  const [caption,setCaption]=useState("");
  const [previewUrl,setPreviewUrl]=useState("");
  const handleFile=(e)=>{
  const file=e.target.files?.[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=(ev)=>setPreviewUrl(ev.target.result);
  reader.readAsDataURL(file);
  };
  const handleSave=()=>{
  if(!selCity||!previewUrl) return;
  store.setDestPhoto(selCity,previewUrl,caption);
  setSelCity(null); setPreviewUrl(""); setCaption("");
  };
  return(
<div style={{animation:"fadeUp .3s ease"}}>
  <h1 className="ral" style={{fontSize:24,fontWeight:900,marginBottom:4}}>Destination Photos</h1>
  <p style={{color:C.textMuted,fontSize:13,marginBottom:20}}>Upload photos and captions for each popular destination shown on the homepage.</p>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20,marginBottom:28}}>
    {POPULAR_DESTINATIONS.map(d=>{
      const photo=store.destPhotos?.[d.city];
      return(
        <Card key={d.city} style={{padding:0,overflow:"hidden"}}>
          <div style={{height:140,background:photo?`url(${photo.url}) center/cover`:`linear-gradient(135deg,${C.navyMid},${C.navy})`,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {!photo&&<div style={{textAlign:"center"}}><div style={{fontSize:28,marginBottom:4}}>{d.emoji}</div><div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"rgba(255,255,255,0.4)"}}>No photo yet</div></div>}
            {photo&&<div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(13,27,62,0.8))",display:"flex",alignItems:"flex-end",padding:"12px 14px"}}><span style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:"rgba(255,255,255,0.7)",fontStyle:"italic"}}>{photo.caption||"No caption"}</span></div>}
          </div>
          <div style={{padding:"14px 16px"}}>
            <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:16,color:"#fff",marginBottom:10}}>{d.city}</div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={()=>{setSelCity(d.city);setCaption(photo?.caption||"");setPreviewUrl(photo?.url||"");}} style={{flex:1,padding:"7px",fontSize:11}}>{photo?"Change Photo":"Upload Photo"}</Btn>
              {photo&&<Btn onClick={()=>store.removeDestPhoto(d.city)} variant="navy" style={{padding:"7px 12px",fontSize:11,border:`1px solid ${C.red}55`,color:C.red}}>Remove</Btn>}
            </div>
          </div>
        </Card>
      );
    })}
  </div>
  {selCity&&(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.navyMid,border:`1px solid ${C.navyBorder}`,borderRadius:20,padding:28,width:"100%",maxWidth:460}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h3 className="ral" style={{fontWeight:700,fontSize:18}}>Upload Photo — {selCity}</h3>
          <button onClick={()=>{setSelCity(null);setPreviewUrl("");setCaption("");}} style={{background:"none",border:"none",color:C.textMuted,fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        {previewUrl&&<div style={{height:160,background:`url(${previewUrl}) center/cover`,borderRadius:12,marginBottom:16,border:`1px solid ${C.navyBorder}`}}/>}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:10,color:C.textMuted,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase",display:"block",marginBottom:6}}>Photo File</label>
          <input type="file" accept="image/*" onChange={handleFile} style={{color:C.textSecondary,fontSize:12,width:"100%"}}/>
        </div>
        <Input label="Caption (optional)" value={caption} onChange={e=>setCaption(e.target.value)} placeholder={`e.g. ${selCity} at golden hour`}/>
        <div style={{display:"flex",gap:10,marginTop:16}}>
          <Btn onClick={handleSave} disabled={!previewUrl} full style={{padding:"11px"}}>Save Photo</Btn>
          <Btn onClick={()=>{setSelCity(null);setPreviewUrl("");setCaption("");}} variant="navy" style={{padding:"11px 18px",border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
        </div>
      </div>
    </div>
  )}
</div>
  );
};


// ═══════════════════════════════════════════════════════════════════════
// FINANCE MODULE — IASB/GAAP/URA COMPLIANT
// ═══════════════════════════════════════════════════════════════════════

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
  // New tab states
  const [projYear,setProjYear]=useState(new Date().getFullYear());
  const [projGrowthRate,setProjGrowthRate]=useState(15);
  const [projExpenseGrowth,setProjExpenseGrowth]=useState(10);
  const [showLoanModal,setShowLoanModal]=useState(false);
  const [loanForm,setLoanForm]=useState({bank:"Centenary Bank",purpose:"",principal:"",monthlyInstalment:"",interestRate:"18",disbursedDate:new Date().toISOString().split("T")[0],nextDueDate:"",notes:""});
  const [showVPModal,setShowVPModal]=useState(false);
  const [vpForm,setVpForm]=useState({vendorName:"",vehicle:"",tripDate:"",route:"",amountPayable:"",status:"pending",notes:""});
  const [showClaimModal,setShowClaimModal]=useState(false);
  const [claimForm,setClaimForm]=useState({employeeName:"",employeeId:"",category:"Transport Reimbursement",amount:"",date:new Date().toISOString().split("T")[0],description:""});
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
    const routeName=`→ ${t.vehicle_reg}`;
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
        <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textMuted,marginTop:4}}>IASB GAAP · ACCA/CPA Format · URA Compliant</p>
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
        <Btn variant="navy" style={{fontSize:11,padding:"7px 14px",border:`1px solid ${C.navyBorder}`}}>⬇ Export PDF</Btn>
        <Btn variant="navy" style={{fontSize:11,padding:"7px 14px",border:`1px solid ${C.navyBorder}`}}>⬇ Export Excel</Btn>
      </div>
    </div>

    {/* KPI Cards */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:12,marginBottom:22}}>
      {[
        {label:"Total Revenue",value:formatUGX(periodRevenue),icon:"💵",color:C.green},
        {label:"Total Expenses",value:formatUGX(periodExpenses),icon:"📉",color:C.red},
        {label:"Net Profit",value:formatUGX(periodRevenue-periodExpenses),icon:"📊",color:netProfit>=0?C.amber:C.red},
        {label:"Profit Margin",value:`${totalRevenueCats>0?((netProfit/totalRevenueCats)*100).toFixed(1):0}%`,icon:"📐",color:C.blue},
        {label:"Pending Payments",value:formatUGX(allBookings.filter(b=>b.payment_status==="pending").reduce((s,b)=>s+b.amount,0)),icon:"⏳",color:C.orange},
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
        {id:"overview",label:"📊 Overview"},
        {id:"revenue",label:"💵 Revenue"},
        {id:"expenses",label:"📉 Costs"},
        {id:"dispatch",label:"🚐 Dispatch"},
        {id:"vendor",label:"🏭 Vendors"},
        {id:"claims",label:"📄 Claims"},
        {id:"profitability",label:"📐 Profitability"},
        {id:"projections",label:"🔭 Projections"},
        {id:"loans",label:"🏛️ Bank Loans"},
        {id:"pnl",label:"📋 P&L"},
        {id:"balancesheet",label:"🏦 Balance Sheet"},
        {id:"cashflow",label:"💧 Cash Flow"},
        {id:"equity",label:"📈 Equity"},
        {id:"users",label:"👥 Access"},
      ].map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={tabBtnStyle(t.id)}>{t.label}</button>
      ))}
    </div>

    {/* ── OVERVIEW ── */}
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

    {/* ── REVENUE ── */}
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
                  <TD style={{color:C.textMuted}}>{b.agent_id||"—"}</TD>
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

    {/* ── EXPENSES / COST MANAGEMENT ── */}
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
                <TD style={{color:C.textMuted,fontSize:11}}>{e.paymentMethod||"—"}</TD>
                <TD style={{maxWidth:180,fontSize:11}}>{e.description}</TD>
                <TD style={{color:C.textMuted,fontSize:11}}>{e.vehicle||"—"}</TD>
                <TD style={{color:C.textMuted,fontSize:11}}>{e.route||"—"}</TD>
                <TD style={{color:C.textMuted,fontSize:11}}>{e.vendor||"—"}</TD>
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
          <Input label="Linked Route (optional)" value={expForm.route} onChange={e=>setExpForm({...expForm,route:e.target.value})} placeholder="e.g. Kampala → Gulu"/>
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

    {/* ── PROFIT & LOSS ── */}
    {tab==="pnl"&&(
    <Card>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:24,paddingBottom:16,borderBottom:`2px solid ${C.navyBorder}`}}>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:900,fontSize:20,color:C.amber,marginBottom:4}}>RAYLANE EXPRESS LIMITED</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,color:C.textPrimary,marginBottom:2}}>INCOME STATEMENT (PROFIT &amp; LOSS)</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textMuted}}>For the period ended: {reportMonth} · Prepared per IASB IAS 1</div>
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

    {/* ── BALANCE SHEET ── */}
    {tab==="balancesheet"&&(
    <Card>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:24,paddingBottom:16,borderBottom:`2px solid ${C.navyBorder}`}}>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:900,fontSize:20,color:C.amber,marginBottom:4}}>RAYLANE EXPRESS LIMITED</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,color:C.textPrimary,marginBottom:2}}>STATEMENT OF FINANCIAL POSITION</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textMuted}}>As at: {new Date().toLocaleDateString("en-UG",{day:"numeric",month:"long",year:"numeric"})} · Per IASB IAS 1</div>
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

    {/* ── CASH FLOW ── */}
    {tab==="cashflow"&&(
    <Card>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:24,paddingBottom:16,borderBottom:`2px solid ${C.navyBorder}`}}>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:900,fontSize:20,color:C.amber,marginBottom:4}}>RAYLANE EXPRESS LIMITED</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,color:C.textPrimary,marginBottom:2}}>STATEMENT OF CASH FLOWS</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textMuted}}>Period: {reportMonth} · Per IAS 7</div>
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

    {/* ── EQUITY ── */}
    {tab==="equity"&&(
    <Card>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:24,paddingBottom:16,borderBottom:`2px solid ${C.navyBorder}`}}>
          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:900,fontSize:20,color:C.amber,marginBottom:4}}>RAYLANE EXPRESS LIMITED</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,marginBottom:2}}>STATEMENT OF CHANGES IN EQUITY</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textMuted}}>Period: {reportMonth} · Per IAS 1</div>
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

    {/* ── DISPATCH ── */}
    {tab==="dispatch"&&(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <h2 className="ral" style={{fontWeight:800,fontSize:18}}>Dispatch Log</h2>
          <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textMuted,marginTop:2}}>Revenue is posted to financial statements only after dispatch officer releases vehicle</p>
        </div>
      </div>
      <div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:10,padding:"12px 16px",marginBottom:16,fontFamily:"'Inter',sans-serif",fontSize:12,color:C.green}}>
        ✅ Revenue Recognition Policy: Under IFRS 15, revenue from passenger transport is recognised at the point of service delivery — when the vehicle departs. Only dispatched trips appear in financial statements.
      </div>
      <Card style={{padding:0,overflow:"hidden",marginBottom:16}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.navyMid}}>
            {["Dispatch ID","Vehicle","Route","Departure","Dispatched At","Officer","Passengers","Revenue","Status"].map(h=><TH key={h}>{h}</TH>)}
          </tr></thead>
          <tbody>
            {(store.dispatches||[]).map(d=>(
              <tr key={d.id} style={{borderBottom:`1px solid ${C.navyBorder}`}}>
                <TD><code style={{fontSize:10,color:C.amber}}>{d.id}</code></TD>
                <TD style={{fontWeight:600}}>{d.vehicleReg}</TD>
                <TD style={{fontSize:11}}>{d.route}</TD>
                <TD>{d.departureTime}</TD>
                <TD style={{fontSize:11,color:C.textMuted}}>{d.dispatchedAt}</TD>
                <TD style={{fontSize:11}}>{d.dispatchOfficer}</TD>
                <TD style={{color:C.blue,fontWeight:700}}>{d.passengersCount}</TD>
                <TD style={{color:C.green,fontWeight:700}}>{formatUGX(d.revenue||0)}</TD>
                <TD><StatusBadge status={d.status}/></TD>
              </tr>
            ))}
            {(store.dispatches||[]).length===0&&<tr><td colSpan={9} style={{textAlign:"center",padding:24,color:C.textMuted}}>No dispatches recorded yet.</td></tr>}
          </tbody>
        </table>
      </Card>
      {/* Quick Dispatch */}
      <Card>
        <h3 className="ral" style={{fontWeight:700,marginBottom:14}}>Release Vehicle for Departure</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {(store.trips||[]).filter(t=>t.status==="active").slice(0,6).map(t=>(
            <div key={t.id} style={{background:C.navyMid,borderRadius:10,padding:"12px 14px",border:`1px solid ${C.navyBorder}`}}>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,marginBottom:4}}>{t.vehicle_reg}</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textMuted,marginBottom:8}}>{t.departure_time}</div>
              <Btn style={{padding:"6px 14px",fontSize:11,width:"100%"}} onClick={()=>store.dispatchTrip(t.id,t.vehicle_reg,"Route",currentUser?.name||"Admin",t.seats_booked?.length||0,t.seats_booked?.length*35000||0)}>
                🚐 Dispatch
              </Btn>
            </div>
          ))}
          {(store.trips||[]).filter(t=>t.status==="active").length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:20,color:C.textMuted,fontSize:12}}>No active trips to dispatch.</div>}
        </div>
      </Card>
    </div>
    )}

    {/* ── VENDOR PAYMENTS ── */}
    {tab==="vendor"&&(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 className="ral" style={{fontWeight:800,fontSize:18}}>Vendor Payment Tracking</h2>
        <Btn onClick={()=>setShowVPModal(true)}>+ Add Payment</Btn>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        {["all","pending","paid","overdue"].map(s=>(
          <button key={s} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${s==="overdue"?C.red:s==="paid"?C.green:C.navyBorder}`,background:"transparent",color:s==="overdue"?C.red:s==="paid"?C.green:C.textSecondary,fontSize:11,fontWeight:700,cursor:"pointer",textTransform:"capitalize"}}
            onClick={()=>{}}>{s==="all"?"All Vendors":s.charAt(0).toUpperCase()+s.slice(1)}</button>
        ))}
      </div>
      <Card style={{padding:0,overflow:"hidden",marginBottom:16}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.navyMid}}>
            {["ID","Vendor Name","Vehicle","Route","Trip Date","Amount","Status","Paid Date","Actions"].map(h=><TH key={h}>{h}</TH>)}
          </tr></thead>
          <tbody>
            {(store.vendorPayments||[]).map(v=>(
              <tr key={v.id} style={{borderBottom:`1px solid ${C.navyBorder}`,background:v.status==="overdue"?"rgba(239,68,68,0.05)":"transparent"}}>
                <TD><code style={{fontSize:10,color:C.amber}}>{v.id}</code></TD>
                <TD style={{fontWeight:600}}>{v.vendorName}</TD>
                <TD style={{fontSize:11}}>{v.vehicle}</TD>
                <TD style={{fontSize:11,color:C.textMuted}}>{v.route}</TD>
                <TD style={{fontSize:11}}>{v.tripDate}</TD>
                <TD style={{color:C.amber,fontWeight:700}}>{formatUGX(v.amountPayable)}</TD>
                <TD><StatusBadge status={v.status}/></TD>
                <TD style={{fontSize:11,color:C.textMuted}}>{v.paidDate||"—"}</TD>
                <TD>
                  {v.status!=="paid"&&<button onClick={()=>store.updateVendorPaymentStatus(v.id,"paid",new Date().toISOString().split("T")[0])} style={{background:"rgba(34,197,94,0.12)",color:C.green,border:"none",borderRadius:6,padding:"4px 10px",fontSize:10,cursor:"pointer",fontWeight:700}}>Mark Paid</button>}
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Modal open={showVPModal} onClose={()=>setShowVPModal(false)} title="Add Vendor Payment">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          <Input label="Vendor Name" value={vpForm.vendorName} onChange={e=>setVpForm({...vpForm,vendorName:e.target.value})} placeholder="e.g. John Transport Services"/>
          <Input label="Vehicle Registration" value={vpForm.vehicle} onChange={e=>setVpForm({...vpForm,vehicle:e.target.value})} placeholder="e.g. UBD 214A"/>
          <Input label="Trip Date" type="date" value={vpForm.tripDate} onChange={e=>setVpForm({...vpForm,tripDate:e.target.value})}/>
          <Input label="Route" value={vpForm.route} onChange={e=>setVpForm({...vpForm,route:e.target.value})} placeholder="e.g. Kampala→Gulu"/>
          <Input label="Amount Payable (UGX)" type="number" value={vpForm.amountPayable} onChange={e=>setVpForm({...vpForm,amountPayable:e.target.value})}/>
          <Sel label="Status" value={vpForm.status} onChange={e=>setVpForm({...vpForm,status:e.target.value})} options={[{value:"pending",label:"Pending"},{value:"paid",label:"Paid"},{value:"overdue",label:"Overdue"}]}/>
          <div style={{gridColumn:"1/-1",display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="navy" onClick={()=>setShowVPModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
            <Btn onClick={()=>{store.addVendorPayment({...vpForm,amountPayable:Number(vpForm.amountPayable)});setShowVPModal(false);}}>Save</Btn>
          </div>
        </div>
      </Modal>
    </div>
    )}

    {/* ── STAFF EXPENSE CLAIMS ── */}
    {tab==="claims"&&(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 className="ral" style={{fontWeight:800,fontSize:18}}>Staff Expense Claims</h2>
        <Btn onClick={()=>setShowClaimModal(true)}>+ Submit Claim</Btn>
      </div>
      <Card style={{padding:0,overflow:"hidden",marginBottom:16}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.navyMid}}>
            {["Claim ID","Employee","Category","Amount","Date","Description","Status","Actions"].map(h=><TH key={h}>{h}</TH>)}
          </tr></thead>
          <tbody>
            {(store.expenseClaims||[]).map(ec=>(
              <tr key={ec.id} style={{borderBottom:`1px solid ${C.navyBorder}`}}>
                <TD><code style={{fontSize:10,color:C.amber}}>{ec.id}</code></TD>
                <TD style={{fontWeight:600}}>{ec.employeeName}</TD>
                <TD><span style={{background:"rgba(168,186,218,0.1)",padding:"2px 8px",borderRadius:8,fontSize:10}}>{ec.category}</span></TD>
                <TD style={{color:C.amber,fontWeight:700}}>{formatUGX(ec.amount)}</TD>
                <TD style={{fontSize:11}}>{ec.date}</TD>
                <TD style={{fontSize:11,color:C.textMuted,maxWidth:160}}>{ec.description}</TD>
                <TD><StatusBadge status={ec.status}/></TD>
                <TD>
                  {ec.status==="pending"&&(
                    <div style={{display:"flex",gap:5}}>
                      <button onClick={()=>store.approveExpenseClaim(ec.id)} style={{background:"rgba(34,197,94,0.12)",color:C.green,border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,cursor:"pointer",fontWeight:700}}>Approve</button>
                      <button onClick={()=>store.rejectExpenseClaim(ec.id)} style={{background:"rgba(239,68,68,0.12)",color:C.red,border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,cursor:"pointer",fontWeight:700}}>Reject</button>
                    </div>
                  )}
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Modal open={showClaimModal} onClose={()=>setShowClaimModal(false)} title="Submit Expense Claim">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          <Input label="Employee Name" value={claimForm.employeeName} onChange={e=>setClaimForm({...claimForm,employeeName:e.target.value})} placeholder="Full name"/>
          <Input label="Employee ID" value={claimForm.employeeId} onChange={e=>setClaimForm({...claimForm,employeeId:e.target.value})} placeholder="RL-EM..."/>
          <Sel label="Category" value={claimForm.category} onChange={e=>setClaimForm({...claimForm,category:e.target.value})} options={["Transport Reimbursement","Lunch Allowance","Accommodation","Fuel Advance","Medical","Stationery","Other"].map(c=>({value:c,label:c}))}/>
          <Input label="Amount (UGX)" type="number" value={claimForm.amount} onChange={e=>setClaimForm({...claimForm,amount:e.target.value})} placeholder="e.g. 25000"/>
          <Input label="Date" type="date" value={claimForm.date} onChange={e=>setClaimForm({...claimForm,date:e.target.value})}/>
          <div style={{gridColumn:"1/-1"}}>
            <label style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textSecondary,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Description</label>
            <textarea value={claimForm.description} onChange={e=>setClaimForm({...claimForm,description:e.target.value})} rows={3} style={{width:"100%",background:C.navyLight,border:`1px solid ${C.navyBorder}`,borderRadius:10,padding:"10px 13px",color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"'Inter',sans-serif",resize:"vertical"}} placeholder="Describe the expense..."/>
          </div>
          <div style={{gridColumn:"1/-1",display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="navy" onClick={()=>setShowClaimModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
            <Btn onClick={()=>{store.addExpenseClaim({...claimForm,amount:Number(claimForm.amount)});setShowClaimModal(false);}}>Submit Claim</Btn>
          </div>
        </div>
      </Modal>
    </div>
    )}

    {/* ── PROFITABILITY ANALYSIS ── */}
    {tab==="profitability"&&(
    <div>
      <h2 className="ral" style={{fontWeight:800,fontSize:18,marginBottom:16}}>Profitability Analysis</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
        <Card>
          <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Route Profitability</h3>
          {Object.entries((store.bookings||[]).filter(b=>b.payment_status==="confirmed"&&b.revenue_posted!==false).reduce((acc,b)=>{
            const key=b.route||"Unknown Route";
            if(!acc[key]) acc[key]={rev:0,bookings:0};
            acc[key].rev+=b.amount; acc[key].bookings+=1;
            return acc;
          },{})).sort((a,b)=>b[1].rev-a[1].rev).slice(0,8).map(([route,data])=>{
            const routeExpenses=(store.expenses||[]).filter(e=>e.route===route).reduce((s,e)=>s+Number(e.amount),0);
            const profit=data.rev-routeExpenses;
            return(
              <div key={route} style={{marginBottom:14,padding:"10px 0",borderBottom:`1px solid ${C.navyBorder}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:600}}>{route}</span>
                  <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:700,color:profit>=0?C.green:C.red}}>{formatUGX(profit)}</span>
                </div>
                <div style={{display:"flex",gap:16,fontSize:11,color:C.textMuted}}>
                  <span>Revenue: <strong style={{color:C.green}}>{formatUGX(data.rev)}</strong></span>
                  <span>Bookings: <strong style={{color:C.blue}}>{data.bookings}</strong></span>
                  <span>Margin: <strong style={{color:profit>=0?C.amber:C.red}}>{data.rev>0?((profit/data.rev)*100).toFixed(1):0}%</strong></span>
                </div>
              </div>
            );
          })}
          {(store.bookings||[]).filter(b=>b.payment_status==="confirmed").length===0&&<div style={{color:C.textMuted,fontSize:12,textAlign:"center",padding:20}}>No confirmed bookings yet.</div>}
        </Card>
        <Card>
          <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Vehicle Profitability</h3>
          {(store.vehicles||[]).map(v=>{
            const vRev=(store.bookings||[]).filter(b=>b.vehicle_id===v.id&&b.payment_status==="confirmed").reduce((s,b)=>s+b.amount,0);
            const vExp=(store.expenses||[]).filter(e=>e.vehicle===v.registration).reduce((s,e)=>s+Number(e.amount),0);
            const vProfit=vRev-vExp;
            return(
              <div key={v.id} style={{marginBottom:12,padding:"10px 0",borderBottom:`1px solid ${C.navyBorder}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:700}}>{v.registration}</span>
                  <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:700,color:vProfit>=0?C.green:C.red}}>{formatUGX(vProfit)}</span>
                </div>
                <div style={{fontSize:11,color:C.textMuted}}>{v.model} · Rev: {formatUGX(vRev)} · Exp: {formatUGX(vExp)}</div>
                <div style={{marginTop:6,height:4,background:C.navyLight,borderRadius:2}}>
                  <div style={{width:`${vRev>0?Math.min((vProfit/vRev)*100,100):0}%`,height:"100%",background:vProfit>=0?C.green:C.red,borderRadius:2}}/>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
      {/* Cost Per Seat Analysis */}
      <Card>
        <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Cost Per Seat Analysis</h3>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:C.navyMid}}>
              {["Route","Avg Ticket","Fuel/Trip","Driver Allow.","Vendor Hire","Total Cost","Profit/Seat","Margin"].map(h=><TH key={h}>{h}</TH>)}
            </tr></thead>
            <tbody>
              {Object.entries((store.bookings||[]).filter(b=>b.payment_status==="confirmed").reduce((acc,b)=>{
                const key=b.route||"Unknown Route";
                if(!acc[key]) acc[key]={rev:0,count:0};
                acc[key].rev+=b.amount; acc[key].count+=1;
                return acc;
              },{})).slice(0,6).map(([route,data])=>{
                const avgTicket=data.count>0?Math.round(data.rev/data.count):0;
                const fuel=Math.round(avgTicket*0.34); // illustrative
                const driver=Math.round(avgTicket*0.11);
                const vendor=0;
                const totalCost=fuel+driver+vendor;
                const profitPerSeat=avgTicket-totalCost;
                return(
                  <tr key={route} style={{borderBottom:`1px solid ${C.navyBorder}`}}>
                    <TD style={{fontSize:11}}>{route}</TD>
                    <TD style={{color:C.green,fontWeight:700}}>{formatUGX(avgTicket)}</TD>
                    <TD style={{color:C.red}}>{formatUGX(fuel)}</TD>
                    <TD style={{color:C.orange}}>{formatUGX(driver)}</TD>
                    <TD style={{color:C.purple}}>{formatUGX(vendor)}</TD>
                    <TD>{formatUGX(totalCost)}</TD>
                    <TD style={{color:profitPerSeat>=0?C.green:C.red,fontWeight:700}}>{formatUGX(profitPerSeat)}</TD>
                    <TD style={{color:profitPerSeat>=0?C.amber:C.red}}>{avgTicket>0?((profitPerSeat/avgTicket)*100).toFixed(1):0}%</TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
    )}

    {/* ── PROJECTIONS ── */}
    {tab==="projections"&&(()=>{
      const baseRevenue=totalRevenueCats||2400000;
      const baseExpenses=totalExpenses||1600000;
      const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const currentMonth=new Date().getMonth();
      const projData=months.map((m,i)=>{
        const monthFactor=1+((i-currentMonth)*projGrowthRate/100/12);
        const projRev=Math.round(baseRevenue*(1+(projGrowthRate/100))*Math.max(0.7,monthFactor));
        const projExp=Math.round(baseExpenses*(1+(projExpenseGrowth/100))*Math.max(0.8,1+((i-currentMonth)*projExpenseGrowth/100/12)));
        return{month:m,revenue:projRev,expenses:projExp,profit:projRev-projExp};
      });
      const annualProjectedRevenue=projData.reduce((s,d)=>s+d.revenue,0);
      const annualProjectedExpenses=projData.reduce((s,d)=>s+d.expenses,0);
      const annualProjectedProfit=annualProjectedRevenue-annualProjectedExpenses;
      return(
      <div>
        <h2 className="ral" style={{fontWeight:800,fontSize:18,marginBottom:4}}>Financial Projections &amp; Pro Forma Statements</h2>
        <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textMuted,marginBottom:20}}>Forward-looking estimates based on current performance and growth assumptions. For planning purposes only.</p>
        {/* Controls */}
        <Card style={{marginBottom:18}}>
          <h3 className="ral" style={{fontWeight:700,marginBottom:14}}>Projection Parameters</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16}}>
            <div>
              <label style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textSecondary,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Projection Year</label>
              <input type="number" value={projYear} onChange={e=>setProjYear(Number(e.target.value))} style={{width:"100%",background:C.navyLight,border:`1px solid ${C.navyBorder}`,borderRadius:10,padding:"10px 13px",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Inter',sans-serif",boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textSecondary,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Revenue Growth Rate (%)</label>
              <input type="number" value={projGrowthRate} onChange={e=>setProjGrowthRate(Number(e.target.value))} min={-50} max={200} style={{width:"100%",background:C.navyLight,border:`1px solid ${C.navyBorder}`,borderRadius:10,padding:"10px 13px",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Inter',sans-serif",boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textSecondary,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Expense Growth Rate (%)</label>
              <input type="number" value={projExpenseGrowth} onChange={e=>setProjExpenseGrowth(Number(e.target.value))} min={0} max={100} style={{width:"100%",background:C.navyLight,border:`1px solid ${C.navyBorder}`,borderRadius:10,padding:"10px 13px",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Inter',sans-serif",boxSizing:"border-box"}}/>
            </div>
          </div>
        </Card>
        {/* Annual summary */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
          {[
            {label:`Projected Revenue ${projYear}`,value:formatUGX(annualProjectedRevenue),color:C.green,icon:"💵"},
            {label:`Projected Expenses ${projYear}`,value:formatUGX(annualProjectedExpenses),color:C.red,icon:"📉"},
            {label:`Projected Net Profit ${projYear}`,value:formatUGX(annualProjectedProfit),color:annualProjectedProfit>=0?C.amber:C.red,icon:"📊"},
          ].map(k=>(
            <div key={k.label} style={{background:C.card,border:`1px solid ${C.navyBorder}`,borderRadius:14,padding:"16px 18px",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:6}}>{k.icon}</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:14,color:k.color,marginBottom:4}}>{k.value}</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:C.textMuted}}>{k.label}</div>
            </div>
          ))}
        </div>
        {/* Monthly projection table */}
        <Card style={{marginBottom:18,padding:0,overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.navyBorder}`}}>
            <h3 className="ral" style={{fontWeight:700}}>Monthly Pro Forma — {projYear}</h3>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:C.navyMid}}>
              {["Month","Proj. Revenue","Proj. Expenses","Proj. Net Profit","Margin"].map(h=><TH key={h}>{h}</TH>)}
            </tr></thead>
            <tbody>
              {projData.map((d,i)=>(
                <tr key={d.month} style={{borderBottom:`1px solid ${C.navyBorder}`,background:i===currentMonth?"rgba(245,166,35,0.06)":"transparent"}}>
                  <TD style={{fontWeight:i===currentMonth?700:400,color:i===currentMonth?C.amber:C.textPrimary}}>{d.month} {i===currentMonth?"★":""}</TD>
                  <TD style={{color:C.green,fontWeight:600}}>{formatUGX(d.revenue)}</TD>
                  <TD style={{color:C.red}}>{formatUGX(d.expenses)}</TD>
                  <TD style={{color:d.profit>=0?C.green:C.red,fontWeight:700}}>{formatUGX(d.profit)}</TD>
                  <TD style={{color:d.profit>=0?C.amber:C.red}}>{d.revenue>0?((d.profit/d.revenue)*100).toFixed(1):0}%</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        {/* Pro Forma P&L */}
        <Card>
          <div style={{maxWidth:540,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:20,paddingBottom:14,borderBottom:`1px solid ${C.navyBorder}`}}>
              <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:900,fontSize:18,color:C.amber}}>RAYLANE EXPRESS LIMITED</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:700,marginBottom:2}}>PRO FORMA INCOME STATEMENT</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textMuted}}>Projected Year: {projYear} · Based on {projGrowthRate}% growth assumption</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:C.orange,marginTop:4}}>⚠️ Forward-looking statement — actual results may vary</div>
            </div>
            {[
              {label:"Projected Passenger Revenue",value:annualProjectedRevenue*0.85,indent:true},
              {label:"Projected Parcel Revenue",value:annualProjectedRevenue*0.08,indent:true},
              {label:"Projected Hire Revenue",value:annualProjectedRevenue*0.07,indent:true},
              {label:"Total Projected Revenue",value:annualProjectedRevenue,bold:true,color:C.green,border:true},
              {label:"Fuel & Operations",value:-(annualProjectedExpenses*0.35),indent:true},
              {label:"Driver & Staff Wages",value:-(annualProjectedExpenses*0.28),indent:true},
              {label:"Maintenance & Vehicle Costs",value:-(annualProjectedExpenses*0.15),indent:true},
              {label:"Administrative & Office",value:-(annualProjectedExpenses*0.12),indent:true},
              {label:"Marketing & Other",value:-(annualProjectedExpenses*0.10),indent:true},
              {label:"Total Projected Expenses",value:-annualProjectedExpenses,bold:true,color:C.red,border:true},
            ].map((row,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:`${row.border?"10px":"6px"} 0`,borderTop:row.border?`1px solid ${C.navyBorder}`:"none",paddingLeft:row.indent?20:0}}>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:row.color||C.textSecondary,fontWeight:row.bold?700:400}}>{row.label}</span>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:row.bold?700:400,color:row.color||(row.value<0?C.red:C.textPrimary)}}>{formatUGX(Math.abs(row.value))}</span>
              </div>
            ))}
            <div style={{marginTop:14,padding:"12px 16px",borderRadius:10,background:annualProjectedProfit>=0?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",border:`1px solid ${annualProjectedProfit>=0?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:13,color:annualProjectedProfit>=0?C.green:C.red}}>PROJECTED NET PROFIT / (LOSS)</span>
                <span style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:900,fontSize:16,color:annualProjectedProfit>=0?C.green:C.red}}>{formatUGX(Math.abs(annualProjectedProfit))}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      );
    })()}

    {/* ── BANK LOANS ── */}
    {tab==="loans"&&(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <h2 className="ral" style={{fontWeight:800,fontSize:18}}>Bank Loan Management</h2>
          <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textMuted,marginTop:2}}>Track repayments · Due date alerts · Inbox notifications</p>
        </div>
        <Btn onClick={()=>setShowLoanModal(true)}>+ Add Loan</Btn>
      </div>
      {/* Alert Inbox */}
      <div style={{marginBottom:18}}>
        <h3 className="ral" style={{fontWeight:700,fontSize:14,marginBottom:12}}>🔔 Loan Alert Inbox</h3>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {(store.loanAlerts||[]).map(alert=>{
            const urgency=alert.daysUntilDue<=7?"critical":alert.daysUntilDue<=14?"high":alert.daysUntilDue<=30?"medium":"low";
            const urgencyColors={critical:{bg:"rgba(239,68,68,0.12)",border:"rgba(239,68,68,0.4)",color:C.red,icon:"🚨"},high:{bg:"rgba(249,115,22,0.10)",border:"rgba(249,115,22,0.3)",color:C.orange,icon:"⚠️"},medium:{bg:"rgba(245,166,35,0.08)",border:"rgba(245,166,35,0.2)",color:C.amber,icon:"📅"},low:{bg:"rgba(59,130,246,0.07)",border:"rgba(59,130,246,0.2)",color:C.blue,icon:"ℹ️"}};
            const uc=urgencyColors[urgency];
            return(
              <div key={alert.id} style={{background:uc.bg,border:`1px solid ${uc.border}`,borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:14,opacity:alert.read?0.55:1}}>
                <div style={{fontSize:20,flexShrink:0}}>{uc.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,color:uc.color,marginBottom:2}}>{alert.bank} — Due {alert.dueDate}</div>
                  <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textSecondary}}>{alert.message}</div>
                  <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textMuted,marginTop:4}}>
                    {alert.daysUntilDue<=0?"OVERDUE":alert.daysUntilDue===0?"DUE TODAY":`${alert.daysUntilDue} days until due`} · {formatUGX(alert.amount)}
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"center",flexShrink:0}}>
                  <span style={{background:uc.color+"22",color:uc.color,borderRadius:8,padding:"3px 10px",fontSize:10,fontWeight:800,textTransform:"uppercase"}}>{urgency}</span>
                  {!alert.read&&<button onClick={()=>store.markAlertRead(alert.id)} style={{background:"transparent",border:`1px solid ${C.navyBorder}`,color:C.textMuted,borderRadius:6,padding:"3px 8px",fontSize:9,cursor:"pointer"}}>Mark Read</button>}
                </div>
              </div>
            );
          })}
          {(store.loanAlerts||[]).length===0&&<div style={{padding:20,textAlign:"center",color:C.textMuted,fontSize:12}}>No alerts. All loans are up to date. ✅</div>}
        </div>
      </div>
      {/* Loan portfolio */}
      <Card style={{padding:0,overflow:"hidden",marginBottom:16}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.navyBorder}`,fontFamily:"'Raleway',sans-serif",fontWeight:700,fontSize:14}}>Active Loan Portfolio</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.navyMid}}>
            {["Loan ID","Bank","Purpose","Principal","Balance","Monthly Inst.","Rate","Disbursed","Next Due","Status","Actions"].map(h=><TH key={h}>{h}</TH>)}
          </tr></thead>
          <tbody>
            {(store.bankLoans||[]).map(loan=>{
              const daysLeft=Math.ceil((new Date(loan.nextDueDate)-new Date())/(1000*60*60*24));
              const dueColor=daysLeft<=7?C.red:daysLeft<=14?C.orange:daysLeft<=30?C.amber:C.green;
              return(
              <tr key={loan.id} style={{borderBottom:`1px solid ${C.navyBorder}`}}>
                <TD><code style={{fontSize:10,color:C.amber}}>{loan.id}</code></TD>
                <TD style={{fontWeight:600}}>{loan.bank}</TD>
                <TD style={{fontSize:11,color:C.textMuted}}>{loan.purpose}</TD>
                <TD>{formatUGX(loan.principal)}</TD>
                <TD style={{color:C.red,fontWeight:700}}>{formatUGX(loan.balance)}</TD>
                <TD style={{color:C.amber}}>{formatUGX(loan.monthlyInstalment)}</TD>
                <TD>{loan.interestRate}% p.a.</TD>
                <TD style={{fontSize:11}}>{loan.disbursedDate}</TD>
                <TD style={{color:dueColor,fontWeight:700,fontSize:11}}>{loan.nextDueDate}<br/><span style={{fontSize:9,opacity:.75}}>{isNaN(daysLeft)?"":`${daysLeft}d`}</span></TD>
                <TD><StatusBadge status={loan.status}/></TD>
                <TD><button onClick={()=>store.recordLoanPayment(loan.id,loan.monthlyInstalment)} style={{background:"rgba(34,197,94,0.12)",color:C.green,border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,cursor:"pointer",fontWeight:700}}>Pay</button></TD>
              </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      {/* Add loan modal */}
      <Modal open={showLoanModal} onClose={()=>setShowLoanModal(false)} title="Add Bank Loan" wide>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          <Sel label="Bank" value={loanForm.bank} onChange={e=>setLoanForm({...loanForm,bank:e.target.value})} options={["Centenary Bank","Stanbic Bank","Equity Bank Uganda","DFCU Bank","Absa Bank Uganda","Post Bank Uganda","Finance Trust Bank","Other"].map(b=>({value:b,label:b}))}/>
          <Input label="Loan Purpose" value={loanForm.purpose} onChange={e=>setLoanForm({...loanForm,purpose:e.target.value})} placeholder="e.g. Fleet Expansion"/>
          <Input label="Principal Amount (UGX)" type="number" value={loanForm.principal} onChange={e=>setLoanForm({...loanForm,principal:e.target.value})}/>
          <Input label="Monthly Instalment (UGX)" type="number" value={loanForm.monthlyInstalment} onChange={e=>setLoanForm({...loanForm,monthlyInstalment:e.target.value})}/>
          <Input label="Interest Rate (% p.a.)" type="number" value={loanForm.interestRate} onChange={e=>setLoanForm({...loanForm,interestRate:e.target.value})}/>
          <Input label="Disbursement Date" type="date" value={loanForm.disbursedDate} onChange={e=>setLoanForm({...loanForm,disbursedDate:e.target.value})}/>
          <Input label="First Payment Due Date" type="date" value={loanForm.nextDueDate} onChange={e=>setLoanForm({...loanForm,nextDueDate:e.target.value})}/>
          <Input label="Notes (optional)" value={loanForm.notes} onChange={e=>setLoanForm({...loanForm,notes:e.target.value})} placeholder="Any additional notes"/>
          <div style={{gridColumn:"1/-1",display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="navy" onClick={()=>setShowLoanModal(false)} style={{border:`1px solid ${C.navyBorder}`}}>Cancel</Btn>
            <Btn onClick={()=>{store.addBankLoan({...loanForm,principal:Number(loanForm.principal),monthlyInstalment:Number(loanForm.monthlyInstalment),interestRate:Number(loanForm.interestRate),balance:Number(loanForm.principal),status:"active"});setShowLoanModal(false);}}>Add Loan</Btn>
          </div>
        </div>
      </Modal>
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
          <Sel label="Access Role" value={userForm.role} onChange={e=>setUserForm({...userForm,role:e.target.value})} options={[{value:"viewer",label:"Viewer — Read Only"},{value:"editor",label:"Editor — Can Add/Edit Entries"}]}/>
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

// ═══════════════════════════════════════════════════════════════════════
// PAYROLL MODULE — UGANDA PAYE/NSSF COMPLIANT
// ═══════════════════════════════════════════════════════════════════════

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
          <div style={{fontSize:11,color:"#666",marginTop:2}}>Employee Pay Slip · {payMonth}</div>
          <div style={{fontSize:10,color:"#888",marginTop:1}}>Uganda Revenue Authority Compliant · NSSF Registered</div>
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
        <div>Bank: {emp.bankName||"—"} · Account: {emp.bankAccount||"—"}</div>
        <div style={{marginTop:4}}>Employer NSSF Contribution: {formatUGX(p.nssfEmployer)} · PAYE remitted to URA per Section 118 ITA 1997</div>
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
        <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textMuted,marginTop:4}}>Uganda PAYE · NSSF · Local Service Tax · URA Compliant</p>
      </div>
      <div style={{display:"flex",gap:8}}>
        <input type="month" value={payMonth} onChange={e=>setPayMonth(e.target.value)} style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${C.navyBorder}`,background:C.navyMid,color:"#fff",fontSize:12}}/>
        <Btn variant="navy" style={{fontSize:11,padding:"7px 14px",border:`1px solid ${C.navyBorder}`}}>⬇ Export Payroll</Btn>
      </div>
    </div>

    {/* KPIs */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:22}}>
      {[
        {label:"Active Staff",value:employees.filter(e=>e.status==="active").length,icon:"👤",color:C.blue},
        {label:"Gross Payroll",value:formatUGX(totalGross),icon:"💰",color:C.amber},
        {label:"Total PAYE",value:formatUGX(totalPAYE),icon:"🏛️",color:C.orange},
        {label:"NSSF Employer",value:formatUGX(totalNSSF),icon:"🛡️",color:C.purple},
        {label:"Net Payroll",value:formatUGX(totalPayroll),icon:"✅",color:C.green},
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
      {[{id:"employees",label:"👤 Employees"},{id:"payslips",label:"📄 Payslips"},{id:"ura",label:"🏛️ URA/NSSF"}].map(t=>(
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
          <Btn>🖨️ Print / Download</Btn>
        </div>
      </Modal>
    </div>
    )}

    {payTab==="payslips"&&(
    <div>
      <h2 className="ral" style={{fontWeight:800,fontSize:18,marginBottom:16}}>Monthly Payroll Summary — {payMonth}</h2>
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

// ═══════════════════════════════════════════════════════════════════════
// STAFF SACO MODULE — SAVINGS & CREDIT COOPERATIVE
// ═══════════════════════════════════════════════════════════════════════

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
        <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textMuted,marginTop:4}}>Savings &amp; Credit Cooperative · {SACO_INTEREST_RATE*100}% p.a. Loans · {SACO_SAVINGS_DIVIDEND*100}% Annual Dividend</p>
      </div>
      <div style={{display:"flex",gap:8}}>
        <Btn variant="navy" onClick={()=>setShowPolicyModal(true)} style={{fontSize:11,padding:"7px 14px",border:`1px solid ${C.navyBorder}`}}>📋 Lending Policy</Btn>
        <Btn onClick={()=>setShowMemberModal(true)}>+ Add Member</Btn>
      </div>
    </div>

    {/* KPIs */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:22}}>
      {[
        {label:"Total Members",value:members.length,icon:"👥",color:C.blue},
        {label:"Total Savings",value:formatUGX(totalSavings),icon:"💰",color:C.green},
        {label:"Loans Disbursed",value:formatUGX(totalLoans),icon:"🏦",color:C.amber},
        {label:"Amount Repaid",value:formatUGX(totalRepaid),icon:"✅",color:C.green},
        {label:"Pending Loans",value:pendingLoans.length,icon:"⏳",color:C.orange},
        {label:"Annual Dividend Pool",value:formatUGX(annualDividendPool),icon:"📈",color:C.purple},
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
      {[{id:"dashboard",label:"📊 Dashboard"},{id:"members",label:"👥 Members"},{id:"loans",label:"🏦 Loans"},{id:"dividends",label:"📈 Dividends"}].map(t=>(
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
            💡 Loan eligibility: up to {SACO_MAX_LOAN_MULTIPLIER}x savings = {formatUGX(Number(memberForm.monthlySaving||0)*SACO_MAX_LOAN_MULTIPLIER*7)} (based on ~7 months savings)
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
          ⏳ {pendingLoans.length} loan application{pendingLoans.length>1?"s":""} pending approval. Email notifications will be sent on decision.
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
                <TD style={{color:C.green}}>{l.monthlyRepayment>0?formatUGX(l.monthlyRepayment):"—"}</TD>
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
                  {l.status!=="pending"&&<span style={{fontSize:10,color:C.textMuted}}>{l.approved||"—"}</span>}
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
                <TD><span style={{fontSize:10,color:C.textMuted}}>📧 {m.email||"—"}</span></TD>
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
        <div className="ral" style={{fontWeight:700,fontSize:15,color:C.amber,marginBottom:12}}>Raylane Express Staff SACO — Lending Policy</div>
        {[
          ["Eligibility","Active employees with at least 3 months of savings contributions are eligible to apply for a loan."],
          ["Maximum Loan","Maximum loan amount is 3× the member's accumulated savings balance."],
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


// ─── GLOBAL TODO LIST WIDGET ─────────────────────────────────────────
const TodoWidget=({store,isAdmin=false})=>{
  const [newTodo,setNewTodo]=useState("");
  const [newPriority,setNewPriority]=useState("medium");
  const {todos,addTodo,toggleTodo,deleteTodo}=store;
  const pending=(todos||[]).filter(t=>!t.done);
  const done=(todos||[]).filter(t=>t.done);
  const pColors={high:C.red,medium:C.amber,low:C.blue};
  const pIcons={high:"🔴",medium:"🟡",low:"🔵"};
  return(
  <div style={{background:C.card,border:`1px solid ${C.navyBorder}`,borderRadius:14,padding:"18px 20px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <h3 className="ral" style={{fontWeight:800,fontSize:15,margin:0}}>📋 To-Do List</h3>
      <span style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textMuted}}>{pending.length} pending</span>
    </div>
    {isAdmin&&(
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        <input value={newTodo} onChange={e=>setNewTodo(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newTodo.trim()){addTodo(newTodo.trim(),"manual",newPriority);setNewTodo("");}}} placeholder="Add a task..." style={{flex:1,background:C.navyLight,border:`1px solid ${C.navyBorder}`,borderRadius:8,padding:"8px 12px",color:"#fff",fontSize:12,outline:"none",fontFamily:"'Inter',sans-serif"}}/>
        <select value={newPriority} onChange={e=>setNewPriority(e.target.value)} style={{background:C.navyLight,border:`1px solid ${C.navyBorder}`,borderRadius:8,padding:"8px 10px",color:"#fff",fontSize:11,outline:"none"}}>
          <option value="high">High</option>
          <option value="medium">Med</option>
          <option value="low">Low</option>
        </select>
        <button onClick={()=>{if(newTodo.trim()){addTodo(newTodo.trim(),"manual",newPriority);setNewTodo("");}}} style={{background:C.amber,color:C.navy,border:"none",borderRadius:8,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>+</button>
      </div>
    )}
    <div style={{maxHeight:320,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
      {(todos||[]).sort((a,b)=>{const po={high:0,medium:1,low:2};return (po[a.priority]||1)-(po[b.priority]||1);}).map(t=>(
        <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,background:t.done?"transparent":t.priority==="high"?"rgba(239,68,68,0.07)":"rgba(168,186,218,0.05)",border:`1px solid ${t.done?"transparent":t.priority==="high"?"rgba(239,68,68,0.2)":C.navyBorder}`,opacity:t.done?0.45:1,transition:"all .2s"}}>
          <input type="checkbox" checked={t.done} onChange={()=>toggleTodo(t.id)} style={{accentColor:C.amber,width:15,height:15,flexShrink:0,cursor:"pointer"}}/>
          <span style={{flex:1,fontFamily:"'Inter',sans-serif",fontSize:12,color:t.done?C.textMuted:C.textPrimary,textDecoration:t.done?"line-through":"none"}}>{t.text}</span>
          <span style={{fontSize:10}}>{pIcons[t.priority]||"🟡"}</span>
          {!t.auto&&isAdmin&&<button onClick={()=>deleteTodo(t.id)} style={{background:"transparent",border:"none",color:C.red,fontSize:11,cursor:"pointer",padding:"0 2px",opacity:.6}} title="Delete">✕</button>}
          <span style={{fontFamily:"'Inter',sans-serif",fontSize:9,color:C.textMuted,whiteSpace:"nowrap"}}>{t.category}</span>
        </div>
      ))}
      {(todos||[]).length===0&&<div style={{color:C.textMuted,fontSize:12,textAlign:"center",padding:16}}>All tasks completed! 🎉</div>}
    </div>
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

  const totalRevenue=store.bookings.filter(b=>b.payment_status==="confirmed").reduce((s,b)=>s+b.amount,0);
  const totalExpenses=store.expenses.reduce((s,e)=>s+e.amount,0);
  const pendingBookings=store.bookings.filter(b=>b.status==="advance"||b.status==="pending");
  const pendingFeedback=store.feedback.filter(f=>f.status==="pending");

  const pendingAmbassadors=(store.ambassadors||[]).filter(a=>a.status==="pending");
  const pendingCommissions=(store.pendingCommissions||[]).filter(c=>c.status==="pending");

  const sidebar=[
    {id:"overview",icon:"📊",label:"Overview"},
    {id:"trips",icon:"🗓️",label:"Trips &amp; Schedules"},
    {id:"bookings",icon:"🎫",label:"Bookings",badge:pendingBookings.length},
    {id:"vehicles",icon:"🚐",label:"Van Fleet"},
    {id:"parcels",icon:"📦",label:"Parcel Deliveries"},
    {id:"reservations",icon:"🪑",label:"Seat Reservations"},
    {id:"finance",icon:"💰",label:"Finance"},
    {id:"payroll",icon:"💼",label:"Payroll"},
    {id:"saco",icon:"🏦",label:"Staff SACO"},
    {id:"promotions",icon:"🎁",label:"Promotions"},
    {id:"coupons",icon:"🏷️",label:"Coupons"},
    {id:"ambassadors",icon:"🤝",label:"Ambassadors",badge:pendingAmbassadors.length+pendingCommissions.length},
    {id:"destinations",icon:"🗺️",label:"Destinations"},
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
            <div style={{marginTop:18}}>
              <TodoWidget store={store} isAdmin={true}/>
            </div>
          </div>
        )}

        {/* ── TRIPS ── */}
        {section==="trips"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h1 className="ral" style={{fontSize:24,fontWeight:900}}>Trips &amp; Schedules</h1>
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
                      <Btn onClick={()=>setAssignModal(b)} style={{padding:"7px 14px",fontSize:12}}>Assign &amp; Confirm</Btn>
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

        {section==="finance"&&<AdminFinanceSection store={store}/>}

        {section==="payroll"&&<AdminPayrollSection store={store}/>}

        {section==="saco"&&<AdminSACOSection/>}

{/* ── PROMOTIONS ── */}
        {section==="promotions"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h1 className="ral" style={{fontSize:24,fontWeight:900}}>Promotions &amp; Discounts</h1>
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
            <h1 className="ral" style={{fontSize:24,fontWeight:900,marginBottom:20}}>Reports &amp; Analytics</h1>
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
                      <Btn onClick={()=>store.approveFeedback(f.id)} style={{padding:"6px 16px",fontSize:12}}>✓ Approve &amp; Publish</Btn>
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
              <Card style={{border:`1px solid ${C.amber}33`}}>
                <h3 className="ral" style={{fontWeight:700,marginBottom:6}}>Hero Photo Slideshow</h3>
                <AdminSlideManager store={store}/>
              </Card>
              <Card><h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Supabase Connection</h3>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <Input label="Supabase URL" value="https://your-project.supabase.co" onChange={()=>{}}/>
                  <Input label="Anon Key" value="••••••••••••••••" onChange={()=>{}}/>
                  <div style={{background:C.green+"22",border:`1px solid ${C.green}44`,borderRadius:10,padding:10,fontSize:11,color:C.green}}>✓ Schema ready: passengers, routes, vehicles, trips, bookings, parcels, expenses, agents, promotions, feedback</div>
                  <Btn full>Test Connection</Btn>
                </div>
              </Card>
              <Card style={{gridColumn:"1/-1"}}>
                <h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Social Media Handles</h3>
                <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textMuted,marginBottom:16}}>Configure official social media links shown in the footer and website. These are publicly visible.</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  {[
                    {key:"facebook",label:"Facebook",placeholder:"https://facebook.com/raylaneexpress",icon:"🔵"},
                    {key:"x",label:"X (Twitter)",placeholder:"https://x.com/raylaneexpress",icon:"⬛"},
                    {key:"instagram",label:"Instagram",placeholder:"https://instagram.com/raylaneexpress",icon:"🟣"},
                    {key:"tiktok",label:"TikTok",placeholder:"https://tiktok.com/@raylaneexpress",icon:"⚫"},
                  ].map(sm=>(
                    <div key={sm.key} style={{display:"flex",flexDirection:"column",gap:6}}>
                      <label style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.textSecondary,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>{sm.icon} {sm.label}</label>
                      <input value={store.socialLinks?.[sm.key]?.url||""} onChange={e=>store.updateSocialLink(sm.key,{url:e.target.value})} placeholder={sm.placeholder} style={{background:C.navyLight,border:`1px solid ${C.navyBorder}`,borderRadius:10,padding:"10px 13px",color:"#fff",fontSize:12,outline:"none",fontFamily:"'Inter',sans-serif"}}/>
                      <input value={store.socialLinks?.[sm.key]?.handle||""} onChange={e=>store.updateSocialLink(sm.key,{handle:e.target.value})} placeholder="@handle" style={{background:C.navyLight,border:`1px solid ${C.navyBorder}`,borderRadius:10,padding:"8px 13px",color:"#fff",fontSize:12,outline:"none",fontFamily:"'Inter',sans-serif"}}/>
                      <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                        <input type="checkbox" checked={store.socialLinks?.[sm.key]?.active!==false} onChange={e=>store.updateSocialLink(sm.key,{active:e.target.checked})} style={{accentColor:C.amber}}/>
                        <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.textSecondary}}>Show in footer</span>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
              <Card><h3 className="ral" style={{fontWeight:700,marginBottom:16}}>WhatsApp Integration</h3>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <Input label="WhatsApp Business API Key" value="" onChange={()=>{}} placeholder="Enter API key"/>
                  <Input label="Sender Number" value="" onChange={()=>{}} placeholder="+256 7XX XXX XXX"/>
                  <Btn full>Save &amp; Test</Btn>
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
              <Card><h3 className="ral" style={{fontWeight:700,marginBottom:16}}>Commission Rate</h3>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div style={{background:C.amber+"18",border:`1px solid ${C.amber}33`,borderRadius:10,padding:"10px 14px",fontSize:12,color:C.amberDark}}>Current rate: <strong>{store.commissionRate}%</strong> of booking value per referral</div>
                  <Input label="New commission rate (%)" value={String(store.commissionRate)} onChange={e=>store.setCommissionRate(Number(e.target.value))} type="number" placeholder="5"/>
                  <Btn full>Update Rate</Btn>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ── COUPONS ── */}
        {section==="coupons"&&<AdminCouponsSection store={store}/>}

        {/* ── AMBASSADORS ── */}
        {section==="ambassadors"&&<AdminAmbassadorsSection store={store}/>}

        {/* ── DESTINATIONS PHOTO MANAGER ── */}
        {section==="destinations"&&<AdminDestinationsSection store={store}/>}

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
                <Btn onClick={handleBook} full style={{padding:"13px"}}>✓ Confirm &amp; Issue Ticket</Btn>
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
// CUSTOMER PORTAL — Register / Login / Loyalty / Ambassador
// ═══════════════════════════════════════════════════════════════════════
const CustomerPortal=({store,setPage,currentUser,setCurrentUser})=>{
  const [mode,setMode]=useState(currentUser?"dashboard":"choice");
  const [form,setForm]=useState({name:"",phone:"",email:"",district:"Kampala"});
  const [loginEmail,setLoginEmail]=useState("");
  const [otp,setOtp]=useState("");
  const [sentOtp,setSentOtp]=useState("");
  const [otpFor,setOtpFor]=useState(null);
  const [err,setErr]=useState("");
  const [tab,setTab]=useState("overview");
  const [ambassadorForm,setAmbassadorForm]=useState({motivation:""});
  const [appliedAmb,setAppliedAmb]=useState(false);

  const user = currentUser || (mode==="dashboard"&&otpFor);

  const sendOtp=(cust)=>{
    const code=String(Math.floor(100000+Math.random()*900000));
    setSentOtp(code); setOtpFor(cust); setErr(""); setMode("otp");
  };

  const handleVerify=()=>{
    if(otp.trim()!==sentOtp){setErr("Incorrect OTP. Please try again.");return;}
    let cust=store.findCustomer(otpFor.email);
    if(!cust){store.addCustomer({name:otpFor.name,phone:otpFor.phone,email:otpFor.email,district:otpFor.district||"Kampala",verified:true});cust=otpFor;}
    setCurrentUser({...cust,role:"customer"});
    setMode("dashboard"); setErr("");
  };

  const myBookings=(store.bookings||[]).filter(b=>user&&(b.passenger===user.name||b.email===user.email));
  const myAmbassador=(store.ambassadors||[]).find(a=>a.email===user?.email);
  const myCommissions=(store.pendingCommissions||[]).filter(c=>c.ambassadorId===myAmbassador?.id);
  const loyaltyPoints=myBookings.length*50+(myAmbassador?.points||0);

  const TABS=[
    {id:"overview",label:"Overview",icon:"🏠"},
    {id:"bookings",label:"My Bookings",icon:"🎫"},
    {id:"loyalty",label:"Loyalty Points",icon:"⭐"},
    {id:"ambassador",label:"Ambassador",icon:"🤝"},
  ];

  if(mode==="choice") return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0D1B3E 0%,#1A2E5A 50%,#0D1B3E 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 16px",paddingTop:100}}>
      <div style={{width:"100%",maxWidth:440}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:64,height:64,background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 16px"}}>🚐</div>
          <h1 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:28,color:"#fff",marginBottom:8}}>Your Raylane Account</h1>
          <p style={{fontFamily:"'Inter',sans-serif",fontSize:14,color:"rgba(168,186,218,0.7)",lineHeight:1.7}}>Register free to save bookings, earn loyalty points,<br/>and unlock member discounts.</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.06)",backdropFilter:"blur(20px)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:24,padding:32,display:"flex",flexDirection:"column",gap:12}}>
          <Btn onClick={()=>setMode("register")} full style={{padding:"14px",fontSize:14,boxShadow:`0 6px 20px ${C.amber}44`}}>✨ Create Free Account</Btn>
          <Btn onClick={()=>setMode("login")} full variant="navy" style={{padding:"14px",fontSize:14,border:"1px solid rgba(255,255,255,0.2)"}}>🔑 Sign In</Btn>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:12,display:"flex",justifyContent:"center",gap:16}}>
            <button onClick={()=>setPage("book")} style={{background:"none",border:"none",color:"rgba(168,186,218,0.6)",fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Continue as guest →</button>
          </div>
          <div style={{background:"rgba(245,166,35,0.08)",border:"1px solid rgba(245,166,35,0.2)",borderRadius:12,padding:"12px 14px",marginTop:4}}>
            <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.amber,fontWeight:700,marginBottom:6}}>✦ Member Benefits</div>
            {["Earn 50 loyalty points per trip","Exclusive member-only discounts","Fast checkout with saved details","Become a Brand Ambassador &amp; earn commission"].map(b=>(
              <div key={b} style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"rgba(168,186,218,0.75)",marginBottom:3}}>· {b}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if(mode==="register") return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0D1B3E 0%,#1A2E5A 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 16px",paddingTop:100}}>
      <div style={{width:"100%",maxWidth:440}}>
        <button onClick={()=>setMode("choice")} style={{background:"none",border:"none",color:C.amber,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:13,marginBottom:20,display:"flex",alignItems:"center",gap:6}}>← Back</button>
        <div style={{background:"rgba(255,255,255,0.06)",backdropFilter:"blur(20px)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:24,padding:32}}>
          <h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:22,color:"#fff",marginBottom:4}}>Create your account</h2>
          <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"rgba(168,186,218,0.65)",marginBottom:20}}>Free forever · No card needed</p>
          {err&&<div style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#FCA5A5",marginBottom:14}}>{err}</div>}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[["Full Name","name","text","Sarah Nakato"],["Phone","phone","tel","+256 7XX XXX XXX"],["Email","email","email","your@email.com"]].map(([label,key,type,ph])=>(
              <div key={key}>
                <div style={{fontSize:10,color:"rgba(168,186,218,0.7)",fontWeight:700,letterSpacing:.5,textTransform:"uppercase",marginBottom:5}}>{label}</div>
                <input type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={ph}
                  style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"11px 14px",color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"'Inter',sans-serif"}}
                  onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.15)"}/>
              </div>
            ))}
            <Btn onClick={()=>{
              setErr("");
              if(!form.name||!form.phone||!form.email){setErr("All fields are required.");return;}
              if(store.findCustomer(form.email)){setErr("Account already exists. Sign in instead.");return;}
              sendOtp(form);
            }} full style={{padding:"13px",fontSize:14,marginTop:4}}>Send Verification Code →</Btn>
          </div>
        </div>
      </div>
    </div>
  );

  if(mode==="login") return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0D1B3E 0%,#1A2E5A 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 16px",paddingTop:100}}>
      <div style={{width:"100%",maxWidth:400}}>
        <button onClick={()=>setMode("choice")} style={{background:"none",border:"none",color:C.amber,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:13,marginBottom:20}}>← Back</button>
        <div style={{background:"rgba(255,255,255,0.06)",backdropFilter:"blur(20px)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:24,padding:32}}>
          <h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:22,color:"#fff",marginBottom:20}}>Welcome back</h2>
          {err&&<div style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#FCA5A5",marginBottom:14}}>{err}</div>}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,color:"rgba(168,186,218,0.7)",fontWeight:700,letterSpacing:.5,textTransform:"uppercase",marginBottom:5}}>Email address</div>
            <input type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} placeholder="your@email.com"
              style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"11px 14px",color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"'Inter',sans-serif"}}
              onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.15)"}/>
          </div>
          <Btn onClick={()=>{
            setErr("");
            const cust=store.findCustomer(loginEmail);
            if(!cust){setErr("No account found with this email. Please register.");return;}
            sendOtp(cust);
          }} disabled={!loginEmail} full style={{padding:"13px",fontSize:14}}>Send OTP →</Btn>
        </div>
      </div>
    </div>
  );

  if(mode==="otp") return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0D1B3E 0%,#1A2E5A 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 16px",paddingTop:100}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{background:"rgba(255,255,255,0.06)",backdropFilter:"blur(20px)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:24,padding:32}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontSize:40,marginBottom:8}}>✉️</div>
            <h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:22,color:"#fff",marginBottom:6}}>Verify your email</h2>
            <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"rgba(168,186,218,0.65)"}}>Code sent to <strong style={{color:C.amber}}>{otpFor?.email}</strong></p>
          </div>
          <div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"rgba(134,239,172,0.9)",textAlign:"center",marginBottom:16}}>
            Demo OTP: <strong style={{letterSpacing:3,fontSize:15}}>{sentOtp}</strong>
          </div>
          {err&&<div style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#FCA5A5",marginBottom:14}}>{err}</div>}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,color:"rgba(168,186,218,0.7)",fontWeight:700,letterSpacing:.5,textTransform:"uppercase",marginBottom:5}}>Enter 6-digit code</div>
            <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="000000" maxLength={6}
              style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"14px",color:"#fff",fontSize:22,outline:"none",boxSizing:"border-box",fontFamily:"'Raleway',sans-serif",fontWeight:800,letterSpacing:6,textAlign:"center"}}
              onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.15)"}/>
          </div>
          <Btn onClick={handleVerify} disabled={otp.length<6} full style={{padding:"13px",fontSize:14}}>✓ Verify &amp; Continue</Btn>
          <button onClick={()=>setMode("choice")} style={{width:"100%",background:"none",border:"none",color:"rgba(168,186,218,0.5)",fontSize:12,cursor:"pointer",marginTop:12,fontFamily:"'Inter',sans-serif"}}>← Start over</button>
        </div>
      </div>
    </div>
  );

  // Dashboard
  const ambStatus=myAmbassador?.status;
  return(
    <div style={{minHeight:"100vh",background:"#F4F6FA",paddingTop:72}}>
      {/* Header bar */}
      <div style={{background:C.navy,borderBottom:`1px solid ${C.navyBorder}`,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${C.amber},${C.amberDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,color:C.navy,flexShrink:0}}>
            {user?.name?.charAt(0)||"?"}
          </div>
          <div>
            <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:16,color:"#fff"}}>{user?.name}</div>
            <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"rgba(168,186,218,0.65)"}}>{user?.email} · Member</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>setPage("book")} style={{padding:"7px 16px",fontSize:12}}>Book a Seat</Btn>
          <Btn onClick={()=>{setCurrentUser(null);setPage("home");}} variant="navy" style={{padding:"7px 14px",fontSize:12,border:"1px solid rgba(255,255,255,0.2)"}}>Logout</Btn>
        </div>
      </div>
      {/* Tabs */}
      <div style={{background:"#fff",borderBottom:"1px solid #E4EAF5",display:"flex",gap:0,overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"14px 24px",background:"none",border:"none",borderBottom:tab===t.id?`3px solid ${C.amber}`:"3px solid transparent",color:tab===t.id?C.navy:"#8899BB",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div style={{maxWidth:900,margin:"0 auto",padding:"clamp(20px,3vw,36px) clamp(16px,3vw,24px)"}}>

        {/* OVERVIEW TAB */}
        {tab==="overview"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:16,marginBottom:28}}>
              {[
                {icon:"🎫",label:"Total Bookings",value:myBookings.length,color:C.amber},
                {icon:"⭐",label:"Loyalty Points",value:loyaltyPoints,color:"#7C3AED"},
                {icon:"🤝",label:"Ambassador",value:ambStatus?ambStatus.charAt(0).toUpperCase()+ambStatus.slice(1):"Not Applied",color:ambStatus==="approved"?C.green:C.textMuted},
                {icon:"💰",label:"Commissions Paid",value:formatUGX(myAmbassador?.paidCommission||0),color:C.green},
              ].map(s=>(
                <div key={s.label} style={{background:"#fff",border:"1px solid #E4EAF5",borderRadius:18,padding:"20px 18px",boxShadow:"0 2px 8px rgba(13,27,62,0.04)"}}>
                  <div style={{fontSize:24,marginBottom:8}}>{s.icon}</div>
                  <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:20,color:s.color,marginBottom:4}}>{s.value}</div>
                  <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"#8899BB",textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{background:C.navy,borderRadius:20,padding:"24px 28px",color:"#fff"}}>
              <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:18,marginBottom:6}}>Welcome back, {user?.name?.split(" ")[0]}!</div>
              <p style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"rgba(168,186,218,0.8)",lineHeight:1.8,marginBottom:18}}>You have <strong style={{color:C.amber}}>{loyaltyPoints} loyalty points</strong>. Earn 50 more with each journey. Points unlock exclusive member discounts and special promotions.</p>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <Btn onClick={()=>setPage("book")} style={{fontSize:12,padding:"10px 20px"}}>Book Now →</Btn>
                <Btn onClick={()=>setTab("ambassador")} variant="navy" style={{fontSize:12,padding:"10px 20px",border:"1px solid rgba(255,255,255,0.2)"}}>Become an Ambassador →</Btn>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {tab==="bookings"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:22,color:C.navy,marginBottom:20}}>My Bookings</h2>
            {myBookings.length===0?(
              <div style={{background:"#fff",border:"1px solid #E4EAF5",borderRadius:20,padding:"40px 24px",textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:12}}>🎫</div>
                <div style={{fontFamily:"'Inter',sans-serif",fontWeight:600,color:C.navy,marginBottom:8}}>No bookings yet</div>
                <p style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"#8899BB",marginBottom:20}}>Book your first trip and earn 50 loyalty points!</p>
                <Btn onClick={()=>setPage("book")}>Book a Seat →</Btn>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {myBookings.map(b=>(
                  <div key={b.id} style={{background:"#fff",border:"1px solid #E4EAF5",borderRadius:16,padding:"18px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                    <div>
                      <div style={{fontFamily:"'Raleway',sans-serif",fontWeight:800,fontSize:15,color:C.amber,marginBottom:2}}>{b.booking_code}</div>
                      <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:16,color:C.navy,marginBottom:2}}>{b.route}</div>
                      <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"#8899BB"}}>{b.date} · Seats: {b.seats?.join(", ")||"–"}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:17,color:C.green,marginBottom:4}}>{formatUGX(b.amount)}</div>
                      <StatusBadge status={b.status}/>
                      <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:C.amber,marginTop:4}}>+50 pts</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LOYALTY TAB */}
        {tab==="loyalty"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:22,color:C.navy,marginBottom:6}}>Loyalty Points</h2>
            <p style={{fontFamily:"'Inter',sans-serif",fontSize:14,color:"#5B7299",marginBottom:24}}>Earn points with every journey. Redeem them for discounts on future bookings.</p>
            <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,borderRadius:24,padding:"28px 32px",color:"#fff",marginBottom:24,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-20,right:-20,width:140,height:140,borderRadius:"50%",background:C.amber+"15"}}/>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"rgba(168,186,218,0.65)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Your Balance</div>
              <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:52,color:C.amber,lineHeight:1}}>{loyaltyPoints}</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"rgba(168,186,218,0.7)",marginTop:4}}>Loyalty Points</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
              {[
                {label:"Points per trip",value:"50 pts",icon:"🚐"},
                {label:"Points per referral",value:"100 pts",icon:"🤝"},
                {label:"Points to redeem (min)",value:"200 pts",icon:"🎁"},
                {label:"Redemption value",value:"UGX 1,000 / 100pts",icon:"💰"},
              ].map(s=>(
                <div key={s.label} style={{background:"#fff",border:"1px solid #E4EAF5",borderRadius:14,padding:"16px 18px",display:"flex",gap:12,alignItems:"center"}}>
                  <span style={{fontSize:22}}>{s.icon}</span>
                  <div>
                    <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:15,color:C.navy}}>{s.value}</div>
                    <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"#8899BB"}}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:"rgba(245,166,35,0.08)",border:"1px solid rgba(245,166,35,0.25)",borderRadius:16,padding:"18px 20px"}}>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,color:C.amberDark,marginBottom:8}}>✦ How to earn more points</div>
              {["Book a seat: +50 points","Successful referral signup: +100 points","First booking after referral: +200 points","Monthly active member bonus: +25 points"].map(t=>(
                <div key={t} style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"#5B7299",marginBottom:4}}>· {t}</div>
              ))}
            </div>
          </div>
        )}

        {/* AMBASSADOR TAB */}
        {tab==="ambassador"&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <h2 style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:22,color:C.navy,marginBottom:6}}>Brand Ambassador</h2>
            <p style={{fontFamily:"'Inter',sans-serif",fontSize:14,color:"#5B7299",marginBottom:24}}>Earn commissions by referring travellers to Raylane Express.</p>

            {!myAmbassador&&!appliedAmb&&(
              <div>
                <div style={{background:"#fff",border:"1px solid #E4EAF5",borderRadius:20,padding:"28px",marginBottom:20}}>
                  <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:18,color:C.navy,marginBottom:16}}>Apply to Become an Ambassador</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
                    {[{icon:"🔗",title:"Your Referral Link",desc:"Share your unique link. When someone books via your link, you earn commission instantly."},{icon:"💰",title:"Earn Commission",desc:`Earn ${store.commissionRate}% commission on every booking made through your referral link.`},{icon:"📊",title:"Track Progress",desc:"See all your referrals, earnings, and payouts in real-time from your dashboard."},{icon:"🏆",title:"Tiered Rewards",desc:"The more referrals you drive, the higher your tier and commission rate becomes."}].map(f=>(
                      <div key={f.title} style={{background:"#F4F6FA",borderRadius:14,padding:"16px 16px",display:"flex",gap:12}}>
                        <span style={{fontSize:22,flexShrink:0}}>{f.icon}</span>
                        <div>
                          <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,color:C.navy,marginBottom:4}}>{f.title}</div>
                          <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"#5B7299",lineHeight:1.6}}>{f.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:16}}>
                    <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"#8899BB",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Why do you want to be an ambassador? (optional)</div>
                    <textarea value={ambassadorForm.motivation} onChange={e=>setAmbassadorForm({...ambassadorForm,motivation:e.target.value})} placeholder="Tell us a bit about yourself and your network..."
                      style={{width:"100%",background:"#F4F6FA",border:"1px solid #E4EAF5",borderRadius:10,padding:"11px 14px",color:C.navy,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"'Inter',sans-serif",resize:"vertical",minHeight:80}}
                      onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor="#E4EAF5"}/>
                  </div>
                  <Btn onClick={()=>{
                    store.applyAmbassador({customerId:user.id||"CUS-NEW",name:user.name,phone:user.phone,email:user.email,refCode:(user.name.split(" ")[0]+new Date().getFullYear()).toUpperCase(),motivation:ambassadorForm.motivation});
                    setAppliedAmb(true);
                  }} full style={{padding:"13px",fontSize:14}}>Submit Application →</Btn>
                </div>
              </div>
            )}

            {(appliedAmb&&!myAmbassador||myAmbassador?.status==="pending")&&(
              <div style={{background:"rgba(245,166,35,0.08)",border:"1px solid rgba(245,166,35,0.25)",borderRadius:20,padding:"28px",textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:12}}>⏳</div>
                <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:20,color:C.navy,marginBottom:8}}>Application Under Review</div>
                <p style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"#5B7299",lineHeight:1.8}}>Thank you for applying! Our team will review your application and get back to you within 24 hours. You'll be notified once approved.</p>
              </div>
            )}

            {myAmbassador?.status==="approved"&&(
              <div>
                <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,borderRadius:20,padding:"24px 28px",color:"#fff",marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                    <div>
                      <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.amber,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Your Referral Link</div>
                      <div style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"rgba(168,186,218,0.8)",marginBottom:6}}>raylane.ug/book?ref={myAmbassador.refCode}</div>
                      <div style={{fontFamily:"'Raleway',sans-serif",fontWeight:900,fontSize:22,color:C.amber,letterSpacing:1}}>{myAmbassador.refCode}</div>
                    </div>
                    <div style={{background:"rgba(255,255,255,0.08)",borderRadius:14,padding:"14px 18px",textAlign:"center"}}>
                      <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:28,color:C.amber}}>{myAmbassador.commissionRate}%</div>
                      <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"rgba(168,186,218,0.65)"}}>Commission Rate</div>
                    </div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
                  {[
                    {label:"Total Referrals",value:myAmbassador.totalReferrals,icon:"👥",color:C.amber},
                    {label:"Pending Commission",value:formatUGX(myAmbassador.pendingCommission),icon:"⏳",color:C.orange},
                    {label:"Paid Commission",value:formatUGX(myAmbassador.paidCommission),icon:"✅",color:C.green},
                  ].map(s=>(
                    <div key={s.label} style={{background:"#fff",border:"1px solid #E4EAF5",borderRadius:16,padding:"16px"}}>
                      <div style={{fontSize:20,marginBottom:6}}>{s.icon}</div>
                      <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:18,color:s.color,marginBottom:2}}>{s.value}</div>
                      <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:"#8899BB",textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {myCommissions.length>0&&(
                  <div style={{background:"#fff",border:"1px solid #E4EAF5",borderRadius:16,overflow:"hidden"}}>
                    <div style={{padding:"14px 18px",borderBottom:"1px solid #E4EAF5",fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:15,color:C.navy}}>Commission History</div>
                    {myCommissions.map(c=>(
                      <div key={c.id} style={{padding:"12px 18px",borderBottom:"1px solid #F4F6FA",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:C.navy,fontWeight:600}}>{c.bookingCode}</div>
                          <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"#8899BB"}}>{c.date}</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:14,color:c.status==="paid"?C.green:C.orange}}>{formatUGX(c.commission)}</div>
                          <StatusBadge status={c.status}/>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {myAmbassador?.status==="rejected"&&(
              <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:20,padding:"28px",textAlign:"center"}}>
                <div style={{fontSize:36,marginBottom:12}}>❌</div>
                <div style={{fontFamily:"'Source Serif 4',Georgia,serif",fontWeight:700,fontSize:18,color:C.navy,marginBottom:8}}>Application Not Approved</div>
                <p style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"#5B7299"}}>Unfortunately your application was not approved at this time. Contact support for more information.</p>
              </div>
            )}
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
  const [loginRole,setLoginRole]=useState("agent");

  const handleLogin=(user)=>{
    setCurrentUser(user);
    if(user.role==="admin") setPage("admin");
    else if(user.role==="agent") setPage("agent");
    else if(user.role==="customer") setPage("customer-portal");
  };
  const handleLogout=()=>{setCurrentUser(null);setPage("home");};

  if(page==="login"&&!currentUser) return(
    <>
      <style>{globalCSS}</style>
      <LoginPage onLogin={handleLogin} agents={store.agents} defaultRole={loginRole}/>
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
    window.scrollTo({top:0,behavior:"smooth"});
  };

  return(
    <>
      <style>{globalCSS}</style>
      <Nav page={page} setPage={handleSetPage} currentUser={currentUser}/>
      {page==="home"           &&<HomePage      setPage={handleSetPage} setPreselectedTrip={setPreselectedTrip} store={store} setLoginRole={setLoginRole}/>}
      {page==="schedule"       &&<SchedulePage  setPage={handleSetPage} setPreselectedTrip={setPreselectedTrip} store={store}/>}
      {page==="book"           &&<BookingPage   preselectedTrip={preselectedTrip} store={store} currentUser={currentUser}/>}
      {page==="plan"           &&<PlanJourneyPage store={store} currentUser={currentUser}/>}
      {page==="hire"           &&<HirePage store={store} setPage={handleSetPage}/>}
      {page==="parcel"         &&<ParcelPage store={store}/>}
      {page==="about"          &&<AboutPage/>}
      {page==="careers"        &&<CareersPage/>}
      {page==="safety"         &&<SafetyPage/>}
      {page==="faq"            &&<FAQPage/>}
      {page==="customer-portal"&&<CustomerPortal store={store} setPage={handleSetPage} currentUser={currentUser} setCurrentUser={(u)=>{setCurrentUser(u);}}/>}
      {(page==="register"||page==="login")&&<div style={{minHeight:"100vh",background:"#F4F6FA",paddingTop:80,display:"flex",alignItems:"center",justifyContent:"center"}}><LoginPage onLogin={handleLogin} agents={store.agents} defaultRole={loginRole}/></div>}
      <RayChatbot setPage={handleSetPage}/>
      <BackToTop/>
    </>
  );
}

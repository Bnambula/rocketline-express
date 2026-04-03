/**
 * RAYLANE EXPRESS — CENTRAL APP STORE
 * Single source of truth linking Operator Portal <-> Admin Portal <-> Website
 */

export const INITIAL_STATE = {
  operators: [
    { id:'op-001', company_name:'Global Coaches', contact:'John Ssemakula', phone:'0771-234-567',
      email:'info@globalcoaches.ug', fleet_size:5, status:'ACTIVE', is_premium:true,
      merchant_code:'GLOBAL_UG', momo_number:'0771-234-567', rating:4.8, reviews:312,
      boarding_pin:{ lat:0.3476, lng:32.5825, label:'Kampala Coach Park, Gate 3' }, created_at:'2024-01-15',
      modules:{ booking_basic:{status:'ACTIVE'}, parcel_basic:{status:'ACTIVE'}, financial_module:{status:'ACTIVE'}, fuel_module:{status:'INACTIVE'}, loan_tracking:{status:'ACTIVE'}, sacco_module:{status:'INACTIVE'}, analytics_module:{status:'ACTIVE'}, hr_module:{status:'INACTIVE'}, fleet_module:{status:'INACTIVE'} } },
    { id:'op-002', company_name:'YY Coaches', contact:'Yusuf Yasiin', phone:'0700-345-678',
      email:'yy@yycoaches.ug', fleet_size:3, status:'ACTIVE', is_premium:false,
      merchant_code:'YY_COACHES', momo_number:'0700-345-678', rating:4.6, reviews:208,
      boarding_pin:{ lat:0.3489, lng:32.5814, label:'New Taxi Park, Stand 7' }, created_at:'2024-03-10',
      modules:{ booking_basic:{status:'ACTIVE'}, parcel_basic:{status:'ACTIVE'}, financial_module:{status:'INACTIVE'}, fuel_module:{status:'INACTIVE'}, loan_tracking:{status:'INACTIVE'}, sacco_module:{status:'INACTIVE'}, analytics_module:{status:'INACTIVE'}, hr_module:{status:'INACTIVE'}, fleet_module:{status:'INACTIVE'} } },
    { id:'op-003', company_name:'Link Bus', contact:'Peter Ochieng', phone:'0752-456-789',
      email:'ops@linkbus.ug', fleet_size:8, status:'ACTIVE', is_premium:true,
      merchant_code:'LINK_BUS_UG', momo_number:'0752-456-789', rating:4.5, reviews:189,
      boarding_pin:{ lat:0.3501, lng:32.5798, label:'Namirembe Road Bus Park' }, created_at:'2024-02-20',
      modules:{ booking_basic:{status:'ACTIVE'}, parcel_basic:{status:'ACTIVE'}, financial_module:{status:'ACTIVE'}, fuel_module:{status:'ACTIVE'}, loan_tracking:{status:'INACTIVE'}, sacco_module:{status:'INACTIVE'}, analytics_module:{status:'ACTIVE'}, hr_module:{status:'ACTIVE'}, fleet_module:{status:'ACTIVE'} } },
  ],
  trips: [
    { id:'T-001', operator_id:'op-001', operator_name:'Global Coaches', plate:'UBF 234K',
      from:'Kampala', to:'Mbale', date:'2026-05-12', departs:'10:00 AM', seat_type:'55', price:25000,
      seats_total:55, seats_booked:36, status:'APPROVED', created_at:'2026-05-10',
      boarding_pin:{ lat:0.3476, lng:32.5825, label:'Kampala Coach Park, Gate 3' }, notes:'AC available' },
    { id:'T-002', operator_id:'op-001', operator_name:'Global Coaches', plate:'UBF 234K',
      from:'Mbale', to:'Kampala', date:'2026-05-12', departs:'4:00 PM', seat_type:'55', price:25000,
      seats_total:55, seats_booked:12, status:'APPROVED', created_at:'2026-05-10',
      boarding_pin:{ lat:1.0754, lng:34.1736, label:'Mbale Bus Terminal' }, notes:'' },
    { id:'T-003', operator_id:'op-002', operator_name:'YY Coaches', plate:'UAR 512B',
      from:'Kampala', to:'Gulu', date:'2026-05-13', departs:'7:00 AM', seat_type:'67', price:35000,
      seats_total:67, seats_booked:0, status:'PENDING_APPROVAL', created_at:'2026-05-11',
      boarding_pin:{ lat:0.3489, lng:32.5814, label:'New Taxi Park, Stand 7' }, notes:'Direct route' },
    { id:'T-004', operator_id:'op-003', operator_name:'Link Bus', plate:'UAK 890C',
      from:'Kampala', to:'Nairobi', date:'2026-05-14', departs:'6:00 AM', seat_type:'65', price:60000,
      seats_total:65, seats_booked:18, status:'APPROVED', created_at:'2026-05-11',
      boarding_pin:{ lat:0.3501, lng:32.5798, label:'Namirembe Road Bus Park' }, notes:'Passport required' },
    { id:'T-005', operator_id:'op-002', operator_name:'YY Coaches', plate:'UAR 512B',
      from:'Kampala', to:'Arua', date:'2026-05-12', departs:'8:00 AM', seat_type:'67', price:40000,
      seats_total:67, seats_booked:0, status:'REJECTED',
      rejection_reason:'Departure time conflicts with an existing approved trip on this route.',
      created_at:'2026-05-09', boarding_pin:{ lat:0.3489, lng:32.5814, label:'New Taxi Park, Stand 7' }, notes:'' },
  ],
  bookings: [
    { id:'RLX-001', trip_id:'T-001', operator_id:'op-001', seat:'5',  phone:'0771-xxx', pay_phone:null, amount:25000, method:'MTN MoMo',    status:'CONFIRMED', created_at:'2026-05-10 09:14' },
    { id:'RLX-002', trip_id:'T-001', operator_id:'op-001', seat:'12', phone:'0700-xxx', pay_phone:null, amount:25000, method:'Airtel Money', status:'CONFIRMED', created_at:'2026-05-10 10:02' },
    { id:'RLX-003', trip_id:'T-001', operator_id:'op-001', seat:'23', phone:'0752-xxx', pay_phone:'0781-xxx', amount:25000, method:'MTN MoMo', status:'PENDING', created_at:'2026-05-11 08:30' },
    { id:'RLX-004', trip_id:'T-004', operator_id:'op-003', seat:'7',  phone:'0703-xxx', pay_phone:null, amount:60000, method:'MTN MoMo',    status:'CONFIRMED', created_at:'2026-05-11 11:20' },
  ],
  payouts: [
    { id:'PAY-001', trip_id:'T-001', operator_id:'op-001', operator_name:'Global Coaches', merchant_code:'GLOBAL_UG', gross:900000, commission:72000, net:828000, status:'READY', triggered_at:null },
    { id:'PAY-002', trip_id:'T-004', operator_id:'op-003', operator_name:'Link Bus', merchant_code:'LINK_BUS_UG', gross:1080000, commission:86400, net:993600, status:'RELEASED', triggered_at:'2026-05-11 16:00' },
  ],
  applications: [
    { id:'APP-001', status:'PENDING_REVIEW', contact_name:'David Kamya', company_name:'City Express', phone:'0781-567-890', email:'david@cityexpress.ug', fleet_size:4, current_routes:'Kampala–Fort Portal', modules_requested:['booking_basic','parcel_basic'], terms_accepted:true, signature_name:'David Kamya', submitted_at:'2026-05-11 14:22' },
    { id:'APP-002', status:'PENDING_REVIEW', contact_name:'Grace Auma', company_name:'Fast Coaches Ltd', phone:'0752-678-901', email:'grace@fastcoaches.ug', fleet_size:6, current_routes:'Kampala–Gulu, Gulu–Juba', modules_requested:['booking_basic','parcel_basic','financial_module','analytics_module'], terms_accepted:true, signature_name:'Grace Auma', submitted_at:'2026-05-12 09:05' },
  ],
  notifications: {
    admin: [
      { id:'N-001', type:'TRIP_PENDING',  icon:'🚌', msg:'YY Coaches submitted Kampala→Gulu 7AM',      time:'2 hrs ago', read:false, link:'trips' },
      { id:'N-002', type:'APP_SUBMITTED', icon:'📝', msg:'New application: City Express (David Kamya)', time:'4 hrs ago', read:false, link:'applications' },
      { id:'N-003', type:'TRIP_PENDING',  icon:'🚌', msg:'Fast Coaches submitted Kampala→Masaka 9AM',  time:'5 hrs ago', read:false, link:'trips' },
      { id:'N-004', type:'LOAN_OVERDUE',  icon:'🔴', msg:'YY Coaches bank loan overdue 3 months',      time:'1 day ago', read:true,  link:'bankloans' },
    ],
    operator: {
      'op-001': [
        { id:'N-101', type:'BOOKING',    icon:'🎫', msg:'New booking – Seat 47 (UGX 25,000) MTN MoMo', time:'2 min ago', read:false },
        { id:'N-102', type:'PAYOUT',     icon:'💸', msg:'UGX 828,000 sent to GLOBAL_UG merchant',     time:'2 hrs ago', read:true },
        { id:'N-103', type:'TRIP_LIVE',  icon:'✅', msg:'Kampala→Mbale 10AM is now LIVE',              time:'1 day ago', read:true },
      ],
      'op-002': [
        { id:'N-201', type:'TRIP_PENDING', icon:'⏳', msg:'Kampala→Gulu awaiting admin approval',        time:'2 hrs ago', read:false },
        { id:'N-202', type:'TRIP_REJECTED',icon:'❌', msg:'Kampala→Arua rejected. Check feedback.',      time:'2 days ago', read:false },
      ],
    }
  },
  bank_loans: [
    { id:'BL-001', operator_id:'op-001', operator_name:'Global Coaches', bank:'Centenary Bank', principal:50000000, paid:32000000, monthly:3200000, nextDue:'2026-06-01', status:'CURRENT', months_paid:10, total_months:18 },
    { id:'BL-002', operator_id:'op-002', operator_name:'YY Coaches',     bank:'DFCU Bank',      principal:80000000, paid:24000000, monthly:5000000, nextDue:'2026-05-15', status:'OVERDUE', months_paid:4,  total_months:16 },
    { id:'BL-003', operator_id:'op-003', operator_name:'Link Bus',       bank:'Stanbic Bank',   principal:30000000, paid:30000000, monthly:2500000, nextDue:null,         status:'REPAID',  months_paid:12, total_months:12 },
  ],
  audit_log: [
    { id:'AUD-001', action:'TRIP_APPROVED',   actor:'Admin', target:'T-001', time:'2026-05-10 08:00', detail:'Global Coaches Kampala→Mbale approved' },
    { id:'AUD-002', action:'MODULE_ACTIVATED',actor:'Admin', target:'op-001',time:'2026-03-01 10:00', detail:'Financial Module activated for Global Coaches' },
    { id:'AUD-003', action:'PAYOUT_RELEASED', actor:'Admin', target:'PAY-002',time:'2026-05-11 16:00',detail:'UGX 993,600 released to Link Bus' },
  ],
  parcels: [
    { id:'PCL-001', operator_id:'op-001', type:'Small Parcel', from:'Kampala', to:'Mbale', sender:'0771-xxx', recipient:'0752-xxx', amount:12000, status:'IN_TRANSIT', scan:'On Board UBF 234K', insured:false, created_at:'2026-05-11' },
    { id:'PCL-002', operator_id:'op-002', type:'Envelope',     from:'Kampala', to:'Gulu',  sender:'0700-xxx', recipient:'0703-xxx', amount:5000,  status:'PENDING',    scan:'Pickup scheduled',   insured:false, created_at:'2026-05-12' },
  ],
  module_requests: [],
}

class RaylaneStore {
  constructor() {
    this._listeners = []
    this._state = this._load()
  }
  _load() {
    try { const s=sessionStorage.getItem('rlx_v4'); if(s) return {...INITIAL_STATE,...JSON.parse(s)} } catch {}
    return {...INITIAL_STATE}
  }
  _save() {
    try { sessionStorage.setItem('rlx_v4', JSON.stringify(this._state)) } catch {}
    this._listeners.forEach(fn=>fn({...this._state}))
  }
  subscribe(fn) { this._listeners.push(fn); return ()=>{ this._listeners=this._listeners.filter(l=>l!==fn) } }
  getState() { return {...this._state} }

  // TRIPS
  getTrips(f={}) {
    let t=this._state.trips
    if(f.operator_id) t=t.filter(x=>x.operator_id===f.operator_id)
    if(f.status)      t=t.filter(x=>x.status===f.status)
    if(f.live)        t=t.filter(x=>x.status==='APPROVED')
    if(f.from&&f.to)  t=t.filter(x=>x.from===f.from&&x.to===f.to)
    return t
  }
  createTrip(data) {
    const trip={...data,id:`T-${Date.now()}`,status:'PENDING_APPROVAL',created_at:new Date().toISOString()}
    this._state={...this._state,trips:[trip,...this._state.trips]}
    this._adminNotif({type:'TRIP_PENDING',icon:'🚌',msg:`${data.operator_name} submitted ${data.from}→${data.to} ${data.departs}`,link:'trips',trip_id:trip.id})
    this._audit('TRIP_SUBMITTED','Operator',trip.id,`${data.operator_name} submitted trip`)
    this._save(); return trip
  }
  approveTrip(id,note='') {
    this._state={...this._state,trips:this._state.trips.map(t=>t.id===id?{...t,status:'APPROVED',admin_note:note,approved_at:new Date().toISOString()}:t)}
    const t=this._state.trips.find(x=>x.id===id)
    this._opNotif(t.operator_id,{type:'TRIP_LIVE',icon:'✅',msg:`Your trip ${t.from}→${t.to} ${t.departs} is now LIVE`})
    this._audit('TRIP_APPROVED','Admin',id,`${t.operator_name} ${t.from}→${t.to} approved`)
    this._save()
  }
  rejectTrip(id,reason='') {
    this._state={...this._state,trips:this._state.trips.map(t=>t.id===id?{...t,status:'REJECTED',rejection_reason:reason}:t)}
    const t=this._state.trips.find(x=>x.id===id)
    this._opNotif(t.operator_id,{type:'TRIP_REJECTED',icon:'❌',msg:`Trip ${t.from}→${t.to} rejected: ${reason}`})
    this._audit('TRIP_REJECTED','Admin',id,reason)
    this._save()
  }
  editApproveTrip(id,edits) {
    this._state={...this._state,trips:this._state.trips.map(t=>t.id===id?{...t,...edits,status:'APPROVED',approved_at:new Date().toISOString()}:t)}
    const t=this._state.trips.find(x=>x.id===id)
    this._opNotif(t.operator_id,{type:'TRIP_EDITED',icon:'✏️',msg:`Admin edited & approved your trip ${t.from}→${t.to}`})
    this._save()
  }

  // MODULES
  activateModule(opId,mod) {
    this._state={...this._state,operators:this._state.operators.map(op=>op.id!==opId?op:{...op,modules:{...op.modules,[mod]:{status:'ACTIVE',activated_at:new Date().toISOString()}}})}
    const op=this._state.operators.find(o=>o.id===opId)
    this._opNotif(opId,{type:'MODULE_ACTIVATED',icon:'🔓',msg:`${mod.replace(/_/g,' ')} is now active on your dashboard`})
    this._audit('MODULE_ACTIVATED','Admin',opId,`${mod} activated for ${op.company_name}`)
    this._save()
  }
  deactivateModule(opId,mod) {
    this._state={...this._state,operators:this._state.operators.map(op=>op.id!==opId?op:{...op,modules:{...op.modules,[mod]:{status:'INACTIVE',activated_at:null}}})}
    this._audit('MODULE_DEACTIVATED','Admin',opId,`${mod} deactivated`)
    this._save()
  }

  // APPLICATIONS
  submitApplication(data) {
    const app={...data,id:`APP-${Date.now()}`,status:'PENDING_REVIEW',submitted_at:new Date().toISOString()}
    this._state={...this._state,applications:[app,...this._state.applications]}
    this._adminNotif({type:'APP_SUBMITTED',icon:'📝',msg:`New application: ${data.company_name} (${data.contact_name})`,link:'applications'})
    this._save(); return app
  }
  approveApplication(appId) {
    const app=this._state.applications.find(a=>a.id===appId)
    const modules={}
    ;['booking_basic','parcel_basic','financial_module','fuel_module','loan_tracking','sacco_module','analytics_module','hr_module','fleet_module'].forEach(m=>{
      modules[m]={status:['booking_basic','parcel_basic'].includes(m)?'ACTIVE':'INACTIVE',activated_at:null}
    })
    const op={id:`op-${Date.now()}`,company_name:app.company_name,contact:app.contact_name,phone:app.phone,email:app.email,fleet_size:app.fleet_size,status:'ACTIVE',is_premium:false,merchant_code:app.company_name.replace(/\s/g,'_').toUpperCase(),momo_number:app.phone,rating:0,reviews:0,boarding_pin:null,created_at:new Date().toISOString(),modules}
    this._state={...this._state,operators:[...this._state.operators,op],applications:this._state.applications.map(a=>a.id===appId?{...a,status:'APPROVED'}:a)}
    this._audit('OPERATOR_APPROVED','Admin',op.id,`${app.company_name} onboarded`)
    this._save(); return op
  }
  rejectApplication(appId,reason='') {
    this._state={...this._state,applications:this._state.applications.map(a=>a.id===appId?{...a,status:'REJECTED',rejection_reason:reason}:a)}
    this._save()
  }

  // PAYOUTS
  releasePayout(payId) {
    const p=this._state.payouts.find(x=>x.id===payId)
    this._state={...this._state,payouts:this._state.payouts.map(x=>x.id===payId?{...x,status:'RELEASED',triggered_at:new Date().toISOString()}:x)}
    this._opNotif(p.operator_id,{type:'PAYOUT',icon:'💸',msg:`UGX ${p.net.toLocaleString()} sent to ${p.merchant_code} merchant account`})
    this._audit('PAYOUT_RELEASED','Admin',payId,`UGX ${p.net.toLocaleString()} released to ${p.operator_name}`)
    this._save()
  }

  // NOTIFICATIONS
  _adminNotif(n) {
    const notif={...n,id:`N-${Date.now()}`,read:false,time:'Just now'}
    this._state={...this._state,notifications:{...this._state.notifications,admin:[notif,...this._state.notifications.admin]}}
  }
  _opNotif(opId,n) {
    const notif={...n,id:`N-${Date.now()}`,read:false,time:'Just now'}
    const cur=this._state.notifications.operator[opId]||[]
    this._state={...this._state,notifications:{...this._state.notifications,operator:{...this._state.notifications.operator,[opId]:[notif,...cur]}}}
  }
  markAdminRead() { this._state={...this._state,notifications:{...this._state.notifications,admin:this._state.notifications.admin.map(n=>({...n,read:true}))}}; this._save() }
  markOpRead(opId) { this._state={...this._state,notifications:{...this._state.notifications,operator:{...this._state.notifications.operator,[opId]:(this._state.notifications.operator[opId]||[]).map(n=>({...n,read:true}))}}}; this._save() }

  // HELPERS
  _audit(action,actor,target,detail) {
    const e={id:`AUD-${Date.now()}`,action,actor,target,detail,time:new Date().toLocaleString()}
    this._state={...this._state,audit_log:[e,...this._state.audit_log]}
  }
  getOperator(id) { return this._state.operators.find(o=>o.id===id) }
  isModuleActive(opId,mod) { return this.getOperator(opId)?.modules?.[mod]?.status==='ACTIVE' }
  getLiveTrips(from,to) { return this._state.trips.filter(t=>t.status==='APPROVED'&&(!from||t.from===from)&&(!to||t.to===to)) }
  getBookings(f={}) {
    let b=this._state.bookings
    if(f.operator_id) b=b.filter(x=>x.operator_id===f.operator_id)
    if(f.trip_id) b=b.filter(x=>x.trip_id===f.trip_id)
    return b
  }
  requestModuleActivation(opId,mod) {
    const req={id:`REQ-${Date.now()}`,operator_id:opId,module:mod,status:'PENDING',submitted_at:new Date().toISOString()}
    this._state={...this._state,module_requests:[req,...(this._state.module_requests||[])]}
    const op=this.getOperator(opId)
    this._adminNotif({type:'MODULE_REQUEST',icon:'💎',msg:`${op.company_name} requested ${mod.replace(/_/g,' ')}`,link:'services'})
    this._save(); return req
  }
  resetToInitial() { this._state={...INITIAL_STATE}; sessionStorage.removeItem('rlx_v4'); this._save() }
}

export const store = new RaylaneStore()
export default store

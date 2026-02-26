import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";

// ─────────────────────────────────────────────
// CONFIGURATION — replace with your live credentials
// ─────────────────────────────────────────────
const CONFIG = {
  // ── SUPABASE ──
  SUPABASE_URL:      "https://xyvijskzgpgauhrxcauw.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_9Q_u5cpCjjAxOCXrRP_org_Asq67JF8",

  // ── MTN MoMo Collections API (momodeveloper.mtn.com) ──
  MTN_SUBSCRIPTION_KEY: "YOUR_MTN_SUBSCRIPTION_KEY",
  MTN_API_USER_ID:      "YOUR_MTN_API_USER_ID",
  MTN_API_KEY:          "YOUR_MTN_API_KEY",
  MTN_TARGET_ENV:       "sandbox",                 // → "mtnuganda" for production
  MTN_BASE_URL:         "https://sandbox.momodeveloper.mtn.com",

  // ── Airtel Money Uganda (developers.airtel.africa) ──
  AIRTEL_CLIENT_ID:     "YOUR_AIRTEL_CLIENT_ID",
  AIRTEL_CLIENT_SECRET: "YOUR_AIRTEL_CLIENT_SECRET",
  AIRTEL_BASE_URL:      "https://openapiuat.airtel.africa",

  // ── WhatsApp Business number (digits only) ──
  WHATSAPP_NUMBER: "256700000000",

  CURRENCY:    "UGX",
  DISCOUNT:    0.2,
  TOTAL_SEATS: 14,
};

// ─────────────────────────────────────────────
// SUPABASE CLIENT — lightweight fetch wrapper
// No npm package needed — uses REST API directly
// ─────────────────────────────────────────────
const sb = {
  _url: () => CONFIG.SUPABASE_URL,
  _headers: () => ({
    "Content-Type":  "application/json",
    "apikey":        CONFIG.SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
    "Prefer":        "return=representation",
  }),

  // SELECT rows — table, optional filters object, optional columns string
  async select(table, filters = {}, columns = "*") {
    let url = `${this._url()}/rest/v1/${table}?select=${columns}`;
    Object.entries(filters).forEach(([k, v]) => {
      url += `&${k}=eq.${encodeURIComponent(v)}`;
    });
    const res = await fetch(url, { headers: this._headers() });
    if (!res.ok) throw new Error(`sb.select ${table}: ${await res.text()}`);
    return res.json();
  },

  // INSERT a row
  async insert(table, data) {
    const res = await fetch(`${this._url()}/rest/v1/${table}`, {
      method:  "POST",
      headers: this._headers(),
      body:    JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`sb.insert ${table}: ${await res.text()}`);
    return res.json();
  },

  // UPDATE rows matching filters
  async update(table, filters, data) {
    let url = `${this._url()}/rest/v1/${table}?`;
    Object.entries(filters).forEach(([k, v]) => {
      url += `${k}=eq.${encodeURIComponent(v)}&`;
    });
    const res = await fetch(url, {
      method:  "PATCH",
      headers: this._headers(),
      body:    JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`sb.update ${table}: ${await res.text()}`);
    return res.json();
  },

  // DELETE rows matching filters
  async delete(table, filters) {
    let url = `${this._url()}/rest/v1/${table}?`;
    Object.entries(filters).forEach(([k, v]) => {
      url += `${k}=eq.${encodeURIComponent(v)}&`;
    });
    const res = await fetch(url, {
      method:  "DELETE",
      headers: this._headers(),
    });
    if (!res.ok) throw new Error(`sb.delete ${table}: ${await res.text()}`);
    return true;
  },

  // RPC — call a stored function
  async rpc(fn, params = {}) {
    const res = await fetch(`${this._url()}/rest/v1/rpc/${fn}`, {
      method:  "POST",
      headers: this._headers(),
      body:    JSON.stringify(params),
    });
    if (!res.ok) throw new Error(`sb.rpc ${fn}: ${await res.text()}`);
    return res.json();
  },

  // Verify password using pgcrypto crypt — calls a helper view
  async verifyPassword(phone, plainPassword) {
    const res = await fetch(
      `${this._url()}/rest/v1/users?phone=eq.${encodeURIComponent(phone)}&select=id,full_name,role,is_active,password_hash`,
      { headers: this._headers() }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    if (!rows.length) return null;
    const user = rows[0];
    if (!user.is_active) return null;
    // Verify hash using Supabase RPC
    const checkRes = await fetch(`${this._url()}/rest/v1/rpc/verify_user_password`, {
      method:  "POST",
      headers: this._headers(),
      body:    JSON.stringify({ p_phone: phone, p_password: plainPassword }),
    });
    if (!checkRes.ok) return null;
    const valid = await checkRes.json();
    return valid ? user : null;
  },
};

const ROUTES = [
  { id: "mbale-kampala",    from: "Mbale",    to: "Kampala", price: 30000, duration: "3h 30m" },
  { id: "kampala-mbale",    from: "Kampala",  to: "Mbale",   price: 30000, duration: "3h 30m" },
  { id: "kampala-mbarara",  from: "Kampala",  to: "Mbarara", price: 55000, duration: "4h" },
  { id: "mbarara-kampala",  from: "Mbarara",  to: "Kampala", price: 55000, duration: "4h" },
  { id: "kampala-gulu",     from: "Kampala",  to: "Gulu",    price: 70000, duration: "5h" },
  { id: "gulu-kampala",     from: "Gulu",     to: "Kampala", price: 70000, duration: "5h" },
  { id: "kampala-soroti",   from: "Kampala",  to: "Soroti",  price: 40000, duration: "4h 30m" },
  { id: "soroti-kampala",   from: "Soroti",   to: "Kampala", price: 40000, duration: "4h 30m" },
];

// ─── Booking Code Generator (Supabase counter) ─
async function getNextBookingCode(plateSuffix = "XXXX") {
  const now    = new Date();
  const year2  = String(now.getFullYear()).slice(-2);
  const month2 = String(now.getMonth() + 1).padStart(2, "0");
  let counter  = 1;
  try {
    // Atomically increment counter in Supabase
    const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/rpc/increment_booking_counter`, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "apikey":        CONFIG.SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({}),
    });
    if (res.ok) counter = await res.json();
  } catch (_) {
    // Fallback to timestamp-based counter if DB unavailable
    counter = Date.now() % 9999;
  }
  const seq = String(counter).padStart(4, "0");
  return `REX${year2}${month2}${seq}${plateSuffix}`;
}

// ─── Formatting ──────────────────────────────
const fmt = (n) => "UGX " + Number(n).toLocaleString();
const disc = (p) => Math.round(p * (1 - CONFIG.DISCOUNT));

// ─── MTN MoMo API Helpers ────────────────────
async function mtnGetToken() {
  const creds = btoa(`${CONFIG.MTN_API_USER_ID}:${CONFIG.MTN_API_KEY}`);
  const res = await fetch(`${CONFIG.MTN_BASE_URL}/collection/token/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Ocp-Apim-Subscription-Key": CONFIG.MTN_SUBSCRIPTION_KEY,
    },
  });
  if (!res.ok) throw new Error("MTN token error");
  return (await res.json()).access_token;
}

async function mtnRequestToPay({ amount, phone, externalId, note }) {
  const token = await mtnGetToken();
  const referenceId = crypto.randomUUID();
  const res = await fetch(`${CONFIG.MTN_BASE_URL}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Reference-Id": referenceId,
      "X-Target-Environment": CONFIG.MTN_TARGET_ENV,
      "Ocp-Apim-Subscription-Key": CONFIG.MTN_SUBSCRIPTION_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: String(amount),
      currency: CONFIG.CURRENCY,
      externalId,
      payer: { partyIdType: "MSISDN", partyId: phone.replace(/^0/, "256") },
      payerMessage: note,
      payeeNote: note,
    }),
  });
  if (res.status !== 202) throw new Error("MTN payment initiation failed");
  return referenceId;
}

async function mtnCheckStatus(referenceId) {
  const token = await mtnGetToken();
  const res = await fetch(
    `${CONFIG.MTN_BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Target-Environment": CONFIG.MTN_TARGET_ENV,
        "Ocp-Apim-Subscription-Key": CONFIG.MTN_SUBSCRIPTION_KEY,
      },
    }
  );
  const data = await res.json();
  return data.status; // PENDING | SUCCESSFUL | FAILED
}

// ─── Airtel Money API Helpers ─────────────────
async function airtelGetToken() {
  const res = await fetch(`${CONFIG.AIRTEL_BASE_URL}/auth/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: CONFIG.AIRTEL_CLIENT_ID,
      client_secret: CONFIG.AIRTEL_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });
  if (!res.ok) throw new Error("Airtel token error");
  return (await res.json()).access_token;
}

async function airtelRequestToPay({ amount, phone, transactionId, note }) {
  const token = await airtelGetToken();
  const res = await fetch(`${CONFIG.AIRTEL_BASE_URL}/merchant/v2/payments/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Country": "UG",
      "X-Currency": "UGX",
    },
    body: JSON.stringify({
      reference: note,
      subscriber: { country: "UG", currency: "UGX", msisdn: phone.replace(/^0/, "") },
      transaction: { amount, country: "UG", currency: "UGX", id: transactionId },
    }),
  });
  if (!res.ok) throw new Error("Airtel payment initiation failed");
  return transactionId;
}

async function airtelCheckStatus(transactionId) {
  const token = await airtelGetToken();
  const res = await fetch(
    `${CONFIG.AIRTEL_BASE_URL}/standard/v1/payments/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Country": "UG",
        "X-Currency": "UGX",
      },
    }
  );
  const data = await res.json();
  return data?.data?.transaction?.status; // TS=successful, TF=failed, TIP=pending
}

// ─── Network Detection ────────────────────────
function detectNetwork(phone) {
  const n = phone.replace(/\s/g, "").replace(/^\+256/, "0").replace(/^256/, "0");
  if (/^0(76|77|78|39)\d/.test(n)) return "mtn";
  if (/^0(70|75|74)\d/.test(n)) return "airtel";
  return null;
}

// ─── Storage keys ─────────────────────────────
const SK = (routeId) => `rex_bookings_${routeId}`;

// ─────────────────────────────────────────────────────────
// ROCKETLINE EXPRESS LOGO — Circle with winding road
// Top half: cream/dawn sky  |  Bottom half: deep indigo
// White S-curve road rises from bottom to horizon vanishing pt
// Faithful SVG recreation of the chosen Fiverr concept
// ─────────────────────────────────────────────────────────
function RocketlineLogo({ size = 56 }) {
  const cx = 50, cy = 50, r = 46; // circle centre & radius within 100×100 viewBox
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <defs>
        {/* Sky gradient — cream at horizon fading to warm off-white at top */}
        <linearGradient id="skyG" x1="50" y1="4" x2="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#F0EFE6"/>
          <stop offset="100%" stopColor="#D8D5C0"/>
        </linearGradient>
        {/* Land/road-bed gradient — deep indigo-navy */}
        <linearGradient id="landG" x1="50" y1="50" x2="50" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#2E3170"/>
          <stop offset="100%" stopColor="#1A1B4B"/>
        </linearGradient>
        {/* Road gradient — bright at vanishing point, wider/darker at base */}
        <linearGradient id="roadG" x1="50" y1="50" x2="50" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.95)"/>
          <stop offset="100%" stopColor="rgba(220,220,220,0.85)"/>
        </linearGradient>
        {/* Clip to circle */}
        <clipPath id="circleClip">
          <circle cx={cx} cy={cy} r={r}/>
        </clipPath>
        {/* Subtle vignette overlay for depth */}
        <radialGradient id="vigG" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="transparent"/>
          <stop offset="100%" stopColor="rgba(10,10,30,0.35)"/>
        </radialGradient>
      </defs>

      {/* ── DROP SHADOW ── */}
      <circle cx={cx} cy={cy + 2} r={r} fill="rgba(0,0,0,0.28)" />

      {/* ── CIRCLE BORDER (subtle rim) ── */}
      <circle cx={cx} cy={cy} r={r + 1} fill="rgba(255,255,255,0.12)"/>

      {/* Everything clipped to the circle */}
      <g clipPath="url(#circleClip)">

        {/* ── TOP HALF — cream dawn sky ── */}
        <rect x={cx - r} y={cy - r} width={r * 2} height={r} fill="url(#skyG)"/>

        {/* ── BOTTOM HALF — deep indigo landscape ── */}
        <rect x={cx - r} y={cy} width={r * 2} height={r} fill="url(#landG)"/>

        {/* ── HORIZON LINE — thin pale stripe where sky meets land ── */}
        <line x1={cx - r} y1={cy} x2={cx + r} y2={cy}
          stroke="rgba(255,255,255,0.18)" strokeWidth="0.8"/>

        {/* ── DISTANT HILLS silhouette on horizon ── */}
        <path
          d="M 4 50 Q 18 44 28 50 Q 38 44 50 47 Q 62 44 72 50 Q 82 45 96 50"
          fill="rgba(22,24,60,0.55)"
        />

        {/* ── WINDING ROAD ──
            Starts wide at the bottom of the circle,
            winds in an S-curve up to a vanishing point
            just below the horizon centre.
            Left-bank (road edge): outer left path
            Right-bank: outer right path
            Filled as a solid white shape for realism          ── */}

        {/* Road body — filled white S shape */}
        <path
          d="
            M 35 96
            C 34 85  28 78  32 70
            C 36 62  46 62  48 55
            C 49 52  50 51  50 50
            C 50 51  51 52  52 55
            C 54 62  64 62  68 70
            C 72 78  66 85  65 96
            Z
          "
          fill="url(#roadG)"
          opacity="0.92"
        />

        {/* Road — darker tarmac base underneath for depth */}
        <path
          d="
            M 36 96
            C 35 85  29 78  33 70
            C 37 63  47 62  49 55.5
            L 50 50.5
            L 51 55.5
            C 53 62  63 63  67 70
            C 71 78  65 85  64 96
            Z
          "
          fill="rgba(180,180,190,0.3)"
        />

        {/* Road — centre dashed line (perspective: tiny at top, larger at bottom) */}
        {/* We draw individual dashes shrinking toward vanishing point */}
        {[
          { x1: 49.4, y1: 52.5, x2: 50.6, y2: 54 },
          { x1: 49,   y1: 56,   x2: 51,   y2: 58.5 },
          { x1: 48.5, y1: 61,   x2: 51.5, y2: 64 },
          { x1: 47.5, y1: 67,   x2: 52.5, y2: 71 },
          { x1: 46,   y1: 74.5, x2: 54,   y2: 79.5 },
          { x1: 44,   y1: 83,   x2: 56,   y2: 89 },
        ].map((d, i) => (
          <line key={i}
            x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2}
            stroke="rgba(100,100,120,0.55)"
            strokeWidth={0.6 + i * 0.18}
            strokeLinecap="round"
          />
        ))}

        {/* Road edge lines — perspective lines from vanishing point */}
        <line x1="50" y1="50.5" x2="35" y2="96"
          stroke="rgba(150,150,170,0.25)" strokeWidth="0.5"/>
        <line x1="50" y1="50.5" x2="65" y2="96"
          stroke="rgba(150,150,170,0.25)" strokeWidth="0.5"/>

        {/* ── SUBTLE LIGHT RAYS from vanishing point (speed/hope feel) ── */}
        {[
          { x2: 4,  y2: 46 },
          { x2: 10, y2: 38 },
          { x2: 30, y2: 32 },
          { x2: 70, y2: 32 },
          { x2: 90, y2: 38 },
          { x2: 96, y2: 46 },
        ].map((ray, i) => (
          <line key={i}
            x1="50" y1="50"
            x2={ray.x2} y2={ray.y2}
            stroke="rgba(255,255,230,0.07)"
            strokeWidth="1.5"
          />
        ))}

        {/* ── VIGNETTE overlay ── */}
        <circle cx={cx} cy={cy} r={r} fill="url(#vigG)"/>

      </g>

      {/* ── CIRCLE STROKE — clean white rim ── */}
      <circle cx={cx} cy={cy} r={r}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// WATER BOTTLE — realistic PET plastic bottle SVG icon
// ─────────────────────────────────────────────────────────
function WaterBottle({ size = 22, style: extraStyle = {} }) {
  return (
    <svg width={size} height={Math.round(size * 1.75)} viewBox="0 0 24 42" fill="none" xmlns="http://www.w3.org/2000/svg" style={extraStyle}>
      <defs>
        <linearGradient id="btlG" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#A8DAFF" stopOpacity="0.5"/>
          <stop offset="40%"  stopColor="#D6EEFF" stopOpacity="0.95"/>
          <stop offset="70%"  stopColor="#B8E0FF" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#7EC8E3" stopOpacity="0.5"/>
        </linearGradient>
        <linearGradient id="lblG" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#E5261A" stopOpacity="0.7"/>
          <stop offset="50%"  stopColor="#FF3526"/>
          <stop offset="100%" stopColor="#C01E14" stopOpacity="0.7"/>
        </linearGradient>
        <linearGradient id="capG" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#2196F3"/>
          <stop offset="100%" stopColor="#0D47A1"/>
        </linearGradient>
      </defs>
      {/* Cap */}
      <rect x="8" y="1" width="8" height="5" rx="2" fill="url(#capG)"/>
      <rect x="7.5" y="5.5" width="9" height="2" rx="1" fill="#1565C0"/>
      <line x1="9.5"  y1="1.5" x2="9.5"  y2="5.5" stroke="white" strokeWidth="0.6" opacity="0.4"/>
      <line x1="12"   y1="1.5" x2="12"   y2="5.5" stroke="white" strokeWidth="0.6" opacity="0.4"/>
      <line x1="14.5" y1="1.5" x2="14.5" y2="5.5" stroke="white" strokeWidth="0.6" opacity="0.4"/>
      {/* Neck */}
      <path d="M 8.5 7.5 Q 7.5 9.5 7 11.5 L 17 11.5 Q 16.5 9.5 15.5 7.5 Z" fill="url(#btlG)" stroke="#90CAF9" strokeWidth="0.4"/>
      {/* Body */}
      <rect x="5.5" y="11.5" width="13" height="26.5" rx="2.8" fill="url(#btlG)" stroke="#90CAF9" strokeWidth="0.5"/>
      {/* Water fill */}
      <rect x="6" y="13" width="12" height="23" rx="2.2" fill="#B3D9F7" opacity="0.3"/>
      {/* Gloss */}
      <rect x="7" y="12.5" width="2.5" height="24" rx="1.2" fill="white" opacity="0.28"/>
      <rect x="7.5" y="13" width="1" height="21" rx="0.5" fill="white" opacity="0.2"/>
      {/* Grip rings top */}
      <line x1="6" y1="15"   x2="18" y2="15"   stroke="#90CAF9" strokeWidth="0.8" opacity="0.55"/>
      <line x1="6" y1="17"   x2="18" y2="17"   stroke="#90CAF9" strokeWidth="0.8" opacity="0.55"/>
      {/* Label */}
      <rect x="5.5" y="19.5" width="13" height="11" fill="url(#lblG)" opacity="0.92"/>
      <line x1="5.5" y1="21" x2="18.5" y2="21" stroke="white" strokeWidth="0.5" opacity="0.45"/>
      <line x1="5.5" y1="29.5" x2="18.5" y2="29.5" stroke="white" strokeWidth="0.5" opacity="0.45"/>
      <text x="12" y="26.8" textAnchor="middle" fill="white" fontSize="4.2" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="1.2">REX</text>
      {/* Grip rings bottom */}
      <line x1="6" y1="33"   x2="18" y2="33"   stroke="#90CAF9" strokeWidth="0.8" opacity="0.55"/>
      <line x1="6" y1="35"   x2="18" y2="35"   stroke="#90CAF9" strokeWidth="0.8" opacity="0.55"/>
      {/* Base */}
      <rect x="5.5" y="36.5" width="13" height="1.5" rx="0.8" fill="#7EC8E3" opacity="0.4"/>
      <ellipse cx="12" cy="38.5" rx="5.5" ry="1.2" fill="#7EC8E3" opacity="0.25"/>
    </svg>
  );
}

// ─── Van Photos (base64, plates blurred) ─────────────────
const VAN_PHOTOS = {
  van_front:    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
  seats_inside: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  van_side:     "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&q=80",
  van_door:     "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80",
  dashboard:    "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80",
  // ⚠️ Replace these with your real van photos later
};

// ─── Company Logos ────────────────────────────
const LOGO_MAIN = "https://placehold.co/320x160/1a2540/F5A623?text=Rocketline+Express";
const LOGO_R    = "https://placehold.co/200x200/1a2540/F5A623?text=R";

// ─── Supabase Data Helpers ────────────────────

// Load all booked seats per route from Supabase bookings table
async function loadRouteBookings() {
  try {
    const rows = await sb.select("bookings", {}, "route_id,seat_number,passenger_name,passenger_phone,booking_code,booked_at");
    const map  = {};
    ROUTES.forEach(r => { map[r.id] = {}; });
    rows.filter(b => b.status !== "cancelled").forEach(b => {
      if (!map[b.route_id]) map[b.route_id] = {};
      map[b.route_id][b.seat_number] = {
        name: b.passenger_name, phone: b.passenger_phone,
        code: b.booking_code,   time: b.booked_at,
      };
    });
    return map;
  } catch (_) {
    const map = {}; ROUTES.forEach(r => { map[r.id] = {}; }); return map;
  }
}

function validatePlate(raw) {
  const p = raw.trim().toUpperCase().replace(/\s+/g, " ");
  const newFmt = /^[A-Z]{2}\s?\d{3}[A-Z]{2}$/;
  const oldFmt = /^[A-Z]{3}\s?\d{3}[A-Z]{1}$/;
  if (!newFmt.test(p) && !oldFmt.test(p)) return { valid: false, suffix: "" };
  const clean = p.replace(/\s/g, "");
  return { valid: true, suffix: clean.slice(-4), clean };
}

function downloadCSV(records, label) {
  const headers = ["Booking Code","Passenger","Phone","Route","Seat","Boarding","Amount (UGX)","Vehicle","Agent","Date","Status"];
  const rows = records.map(b => [
    b.booking_code || b.code,
    b.passenger_name || b.name,
    b.passenger_phone || b.phone,
    b.route_label || `${b.route_from||b.routeFrom} → ${b.route_to||b.routeTo}`,
    b.seat_number || b.seat,
    b.boarding_point || b.boarding,
    b.net_amount || b.amount_paid || b.price,
    b.plate_suffix ? `...${b.plate_suffix}` : "N/A",
    b.agent_name || "Direct",
    new Date(b.recorded_at||b.booked_at||b.time).toLocaleDateString("en-UG"),
    b.status || "confirmed"
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c||"").replace(/"/g,'""')}"`).join(",")).join("\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], {type:"text/csv"})),
    download: `REX_${label}_${new Date().toISOString().slice(0,10)}.csv`
  });
  a.click();
}

function filterByWindow(records, w) {
  const days = {daily:1,weekly:7,monthly:30,quarterly:91,semi:183,annual:365}[w] || 9999;
  const cutoff = Date.now() - days * 86400000;
  return records.filter(b => new Date(b.recorded_at||b.booked_at||b.time).getTime() >= cutoff);
}

function revenueByKey(records, keyFn) {
  return records.reduce((acc, b) => {
    const k = keyFn(b);
    if (!k) return acc;
    acc[k] = (acc[k] || 0) + Number(b.net_amount || b.amount_paid || b.price || 0);
    return acc;
  }, {});
}



// ─── Main App ─────────────────────────────────
export default function App() {
  const [step, setStep] = useState("home");
  const [route, setRoute] = useState(null);
  const [seat, setSeat] = useState(null);
  const [bookings, setBookings] = useState({});
  const [form, setForm] = useState({ name: "", phone: "", boarding: "" });
  const [payMethod, setPayMethod] = useState(null);
  const [payState, setPayState] = useState("idle");
  const [payMsg, setPayMsg] = useState("");
  const [booking, setBooking] = useState(null);
  const [heroSlide, setHeroSlide] = useState(0);

  // ── Admin / Agent auth ──
  const [adminStep, setAdminStep]       = useState("locked");
  const [adminPin, setAdminPin]         = useState("");
  const [adminPinInput, setAdminPinInput]     = useState("");
  const [adminPinConfirm, setAdminPinConfirm] = useState("");
  const [adminPinError, setAdminPinError]     = useState("");
  const [adminTab, setAdminTab]         = useState("ops");  // ops|routes|vehicles|schedules|revenue|agents|feedback|logs
  const [agentSession, setAgentSession] = useState(null);  // {id,name} when agent logged in
  const [agentPinInput, setAgentPinInput] = useState("");
  const [agentLoginError, setAgentLoginError] = useState("");

  // ── System data ──
  const [activeVans, setActiveVans]     = useState({});
  const [vehicles, setVehicles]         = useState([]);
  const [schedules, setSchedules]       = useState([]);
  const [routePrices, setRoutePrices]   = useState({});
  const [agents, setAgents]             = useState([]);
  const [allBookings, setAllBookings]   = useState([]);
  const [feedback, setFeedback]         = useState([]);
  const [agentLogs, setAgentLogs]       = useState([]);

  // ── UI state ──
  const [plateInputs, setPlateInputs]   = useState({});
  const [plateErrors, setPlateErrors]   = useState({});
  const [plateSaved, setPlateSaved]     = useState({});
  const [revenueWindow, setRevenueWindow] = useState("monthly");
  const [newVehicle, setNewVehicle]     = useState({ plate:"", driver:"" });
  const [newAgent, setNewAgent]         = useState({ name:"", phone:"", pin:"" });
  const [newSchedule, setNewSchedule]   = useState({ routeId:"", vehicleId:"", dep:"", arr:"", days:"Mon-Fri" });
  const [editPrice, setEditPrice]       = useState({});
  const [feedbackForm, setFeedbackForm] = useState({ name:"", route:"", rating:5, comment:"" });
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [adminMsg, setAdminMsg]         = useState("");

  const pollRef  = useRef(null);
  const slideRef = useRef(null);

  // Hero slideshow — cycles through van exterior shots
  const heroSlides = [
    { img: VAN_PHOTOS.van_front,    label: "Your ride awaits",            sub: "White Toyota Hiace · Comfortable & Clean" },
    { img: VAN_PHOTOS.van_side,     label: "Spacious & Ready",             sub: "Silver Hiace with roof rack · 14 seats" },
    { img: VAN_PHOTOS.van_door,     label: "Board with ease",              sub: "Wide sliding door · Easy luggage access" },
    { img: VAN_PHOTOS.seats_inside, label: "Travel in comfort",            sub: "Premium black leather seats · Air-conditioned" },
    { img: VAN_PHOTOS.dashboard,    label: "Right-hand drive, right-hand service", sub: "Professional drivers · Safe journeys" },
  ];

  useEffect(() => {
    slideRef.current = setInterval(() => {
      setHeroSlide(s => (s + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(slideRef.current);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // Load booked seats per route
        const bMap = await loadRouteBookings();
        setBookings(bMap);

        // Load active vans
        const vans = await sb.select("active_vans");
        const vanMap = {};
        vans.forEach(v => { vanMap[v.route_id] = { plate: v.plate, suffix: v.plate_suffix, setAt: v.set_at }; });
        setActiveVans(vanMap);

        // Load vehicles
        const vRows = await sb.select("vehicles");
        setVehicles(vRows.map(v => ({ id: v.id, plate: v.plate, suffix: v.plate_suffix, driver: v.driver_name, phone: v.driver_phone, active: v.is_active })));

        // Load schedules
        const sRows = await sb.select("schedules");
        setSchedules(sRows.map(s => ({ id: s.id, routeId: s.route_id, vehicleId: s.vehicle_id, dep: s.departure_time, arr: s.arrival_time, days: s.operating_days })));

        // Load route prices
        const rRows = await sb.select("routes");
        const priceMap = {};
        rRows.forEach(r => { priceMap[r.id] = r.base_price; });
        setRoutePrices(priceMap);

        // Load agents
        const aRows = await sb.select("users", { role: "agent" }, "id,full_name,phone,is_active");
        setAgents(aRows.map(a => ({ id: a.id, name: a.full_name, phone: a.phone, active: a.is_active })));

        // Load all bookings for admin
        const bRows = await sb.select("bookings", {}, "booking_code,passenger_name,passenger_phone,route_id,route_from,route_to,seat_number,boarding_point,amount_paid,plate_suffix,agent_name,status,booked_at");
        setAllBookings(bRows);

        // Load feedback
        const fRows = await sb.select("feedback", {}, "id,passenger_name,route_label,rating,comment,submitted_at,is_visible");
        setFeedback(fRows.map(f => ({ id: f.id, name: f.passenger_name, route: f.route_label, rating: f.rating, comment: f.comment, time: f.submitted_at, visible: f.is_visible })));

        // Load agent logs
        const lRows = await sb.select("agent_logs", {}, "id,agent_name,client_name,client_phone,route_id,action,booking_code,logged_at");
        setAgentLogs(lRows.map(l => ({ agentName: l.agent_name, clientName: l.client_name, phone: l.client_phone, routeId: l.route_id, action: l.action, code: l.booking_code, time: l.logged_at })));

      } catch (err) {
        console.warn("Supabase load error:", err.message);
      }
    })();
  }, []);

  const routeBookings = route ? (bookings[route.id] || {}) : {};
  const bookedSeats = Object.keys(routeBookings).map(Number);
  const availCount = CONFIG.TOTAL_SEATS - bookedSeats.length;
  const price = route ? disc(route.price) : 0;
  const network = detectNetwork(form.phone);

  function reset() {
    clearInterval(pollRef.current);
    setStep("home"); setRoute(null); setSeat(null);
    setForm({ name: "", phone: "", boarding: "" });
    setPayMethod(null); setPayState("idle"); setPayMsg(""); setBooking(null);
  }

  async function initiatePayment() {
    if (!payMethod) return;
    setPayState("waiting");
    setPayMsg(`📲 Check your phone for a ${payMethod === "mtn" ? "MTN MoMo" : "Airtel Money"} payment prompt of ${fmt(price)}. Enter your PIN to confirm.`);

    const vanInfo = activeVans[route.id];
    const plateSuffix = vanInfo ? vanInfo.suffix : "XXXX";
    const code = await getNextBookingCode(plateSuffix);
    const txId = crypto.randomUUID();
    const note = `Rocketline Express | ${route.from}-${route.to} | Seat ${seat} | ${code}`;

    try {
      let referenceId;
      if (payMethod === "mtn") {
        referenceId = await mtnRequestToPay({ amount: price, phone: form.phone, externalId: txId, note });
      } else {
        referenceId = await airtelRequestToPay({ amount: price, phone: form.phone, transactionId: txId, note });
      }

      setPayState("polling");
      let attempts = 0;
      pollRef.current = setInterval(async () => {
        attempts++;
        try {
          let status;
          if (payMethod === "mtn") {
            status = await mtnCheckStatus(referenceId);
            if (status === "SUCCESSFUL") { clearInterval(pollRef.current); await finalizeBooking(code); return; }
            if (status === "FAILED") { clearInterval(pollRef.current); setPayState("failed"); setPayMsg("❌ Payment declined or timed out. Please try again."); return; }
          } else {
            status = await airtelCheckStatus(referenceId);
            if (status === "TS") { clearInterval(pollRef.current); await finalizeBooking(code); return; }
            if (status === "TF") { clearInterval(pollRef.current); setPayState("failed"); setPayMsg("❌ Payment declined or timed out. Please try again."); return; }
          }
        } catch (_) {}
        if (attempts >= 24) { // 2 min timeout
          clearInterval(pollRef.current);
          setPayState("failed");
          setPayMsg("⏱️ Payment verification timed out. Contact us if you were charged.");
        }
      }, 5000);

    } catch (err) {
      setPayState("failed");
      setPayMsg("⚠️ Could not connect to payment service. Please check your internet and try again. Error: " + err.message);
    }
  }

  async function finalizeBooking(code) {
    try {
      // Race condition guard — re-check seat in Supabase
      const existing = await sb.select("bookings", { route_id: route.id, seat_number: seat, status: "confirmed" });
      if (existing.length > 0) {
        setPayState("failed");
        setPayMsg("⚠️ Seat was just taken while your payment processed. Please contact us immediately.");
        return;
      }

      const vanInfo = activeVans[route.id];
      const basePrice = routePrices[route.id] || route.price;
      const discountAmt = basePrice - price;

      // Insert booking into Supabase
      await sb.insert("bookings", {
        booking_code:     code,
        passenger_name:   form.name,
        passenger_phone:  form.phone,
        route_id:         route.id,
        route_from:       route.from,
        route_to:         route.to,
        seat_number:      seat,
        boarding_point:   form.boarding,
        amount_paid:      price,
        base_price:       basePrice,
        discount_amount:  discountAmt,
        plate_suffix:     vanInfo ? vanInfo.suffix : null,
        payment_method:   payMethod === "mtn" ? "mtn_momo" : "airtel_money",
        payment_status:   "confirmed",
        booked_by_agent:  agentSession ? agentSession.id : null,
        agent_name:       agentSession ? agentSession.name : null,
        status:           "confirmed",
        travel_date:      new Date().toISOString().slice(0, 10),
      });

      // Log agent activity if applicable
      if (agentSession) {
        await sb.insert("agent_logs", {
          agent_id:    agentSession.id,
          agent_name:  agentSession.name,
          action:      "booking",
          client_name: form.name,
          client_phone: form.phone,
          booking_code: code,
          route_id:    route.id,
          route_label: `${route.from} → ${route.to}`,
        });
        setAgentLogs(prev => [...prev, { agentName: agentSession.name, clientName: form.name, phone: form.phone, routeId: route.id, action: "booking", code, time: new Date().toISOString() }]);
      }

      // Update local seat map so UI reflects instantly
      setBookings(prev => ({
        ...prev,
        [route.id]: { ...prev[route.id], [seat]: { name: form.name, phone: form.phone, code, time: new Date().toISOString() } }
      }));

      // Update local bookings list
      setAllBookings(prev => [...prev, {
        booking_code: code, passenger_name: form.name, passenger_phone: form.phone,
        route_from: route.from, route_to: route.to, seat_number: seat,
        boarding_point: form.boarding, amount_paid: price,
        plate_suffix: vanInfo ? vanInfo.suffix : null,
        agent_name: agentSession ? agentSession.name : null,
        status: "confirmed", booked_at: new Date().toISOString(),
      }]);

      const b = { code, name: form.name, phone: form.phone, boarding: form.boarding, route, seat, price, time: new Date(), plateSuffix: vanInfo ? vanInfo.suffix : null };
      setBooking(b);
      setPayState("success");
      setStep("success");
    } catch (err) {
      setPayState("failed");
      setPayMsg("Booking save failed after payment. Please contact us with your payment reference immediately. Error: " + err.message);
    }
  }

  // ── Admin login ──────────────────────────────
  async function handleAdminLogin() {
    setAdminPinError("");
    if (!adminPinInput.trim()) { setAdminPinError("Enter your password."); return; }
    try {
      // Fetch admin user by phone number (primary key in DB)
      const res = await fetch(
        `${CONFIG.SUPABASE_URL}/rest/v1/users?phone=eq.256700000000&select=id,full_name,role,is_active,password_hash`,
        { headers: { "apikey": CONFIG.SUPABASE_ANON_KEY, "Authorization": `Bearer ${CONFIG.SUPABASE_ANON_KEY}` } }
      );
      const rows = await res.json();
      const user = rows[0];

      if (!user || !user.is_active) { setAdminPinError("Admin account not found or inactive."); return; }

      const storedHash = user.password_hash;
      let authenticated = false;

      // Case 1: password stored as plain text (before hashing was set up)
      if (storedHash === adminPinInput) {
        authenticated = true;
        // Auto-upgrade to hashed password now
        await sb.rpc("update_user_password", { p_phone: "256700000000", p_new_password: adminPinInput }).catch(() => {});
      }
      // Case 2: password properly hashed — verify via RPC
      else {
        try {
          const vRes = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/rpc/verify_user_password`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "apikey": CONFIG.SUPABASE_ANON_KEY, "Authorization": `Bearer ${CONFIG.SUPABASE_ANON_KEY}` },
            body: JSON.stringify({ p_phone: "256700000000", p_password: adminPinInput }),
          });
          authenticated = await vRes.json();
        } catch (_) {}
      }

      if (authenticated) {
        setAdminStep("dashboard");
        setAdminPinInput("");
        sb.update("users", { id: user.id }, { last_login: new Date().toISOString() }).catch(() => {});
      } else {
        setAdminPinError("Incorrect password. Try again.");
      }
    } catch (err) {
      // Fallback if Supabase not yet configured — allow any 4+ char password to enter
      if (CONFIG.SUPABASE_URL.includes("YOUR_")) {
        if (adminPinInput.length >= 4) { setAdminStep("dashboard"); setAdminPinInput(""); }
        else setAdminPinError("Configure your Supabase URL in CONFIG first.");
      } else {
        setAdminPinError("Connection error: " + err.message);
      }
    }
  }

  async function handleSetPin() {
    // Now handled in Supabase — update user password
    setAdminPinError("");
    if (adminPinInput.length < 6) { setAdminPinError("Password must be at least 6 characters."); return; }
    if (adminPinInput !== adminPinConfirm) { setAdminPinError("Passwords do not match."); return; }
    try {
      await sb.rpc("update_user_password", { p_phone: "admin@rocketlineexpress.com", p_new_password: adminPinInput });
      setAdminPin(adminPinInput); setAdminStep("dashboard");
      setAdminPinInput(""); setAdminPinConfirm("");
    } catch (_) {
      // Store locally as fallback
      setAdminPin(adminPinInput); setAdminStep("dashboard");
      setAdminPinInput(""); setAdminPinConfirm("");
    }
  }

  async function handleAgentLogin() {
    setAgentLoginError("");
    if (!agentPinInput.trim()) return;
    try {
      // Agents log in with their phone number as username, PIN as password
      const rows = await sb.select("users", {}, "id,full_name,phone,role,is_active,password_hash");
      const agentRow = rows.find(u => u.role === "agent" && u.is_active);
      // Verify via Supabase RPC
      const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/rpc/verify_agent_pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": CONFIG.SUPABASE_ANON_KEY, "Authorization": `Bearer ${CONFIG.SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ p_pin: agentPinInput }),
      });
      const matched = await res.json();
      if (matched && matched.id) {
        setAgentSession({ id: matched.id, name: matched.full_name });
        setAgentPinInput(""); setStep("home");
        await sb.insert("agent_logs", { agent_id: matched.id, agent_name: matched.full_name, action: "login" });
        await sb.update("users", { id: matched.id }, { last_login: new Date().toISOString() });
      } else {
        setAgentLoginError("Invalid PIN or account inactive.");
      }
    } catch (_) {
      // Fallback: check local agents list
      const agent = agents.find(a => a.pin === agentPinInput && a.active);
      if (agent) { setAgentSession(agent); setAgentPinInput(""); setStep("home"); }
      else setAgentLoginError("Invalid PIN or account inactive.");
    }
  }

  // ── Plate / Van ops ──────────────────────────
  async function handleSetPlate(routeId) {
    const { valid, suffix, clean } = validatePlate(plateInputs[routeId] || "");
    if (!valid) { setPlateErrors(e => ({ ...e, [routeId]: "Invalid plate. Use UA 001AA or UAA 001A" })); return; }
    try {
      // Upsert into active_vans table
      await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/active_vans`, {
        method: "POST",
        headers: { ...sb._headers(), "Prefer": "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({ route_id: routeId, plate: clean, plate_suffix: suffix, set_at: new Date().toISOString() }),
      });
      setActiveVans(prev => ({ ...prev, [routeId]: { plate: clean, suffix, setAt: new Date().toISOString() } }));
      setPlateErrors(e => ({ ...e, [routeId]: "" }));
      setPlateSaved(s => ({ ...s, [routeId]: true }));
      setTimeout(() => setPlateSaved(s => ({ ...s, [routeId]: false })), 3000);
    } catch (err) { setPlateErrors(e => ({ ...e, [routeId]: "Save failed: " + err.message })); }
  }

  async function handleClearPlate(routeId) {
    try {
      await sb.delete("active_vans", { route_id: routeId });
      setActiveVans(prev => { const u = { ...prev }; delete u[routeId]; return u; });
      setPlateInputs(p => ({ ...p, [routeId]: "" }));
    } catch (_) {}
  }

  // ── Vehicle management ───────────────────────
  async function addVehicle() {
    const { valid, suffix, clean } = validatePlate(newVehicle.plate);
    if (!valid || !newVehicle.driver.trim()) { setAdminMsg("Please enter a valid plate and driver name."); return; }
    try {
      const rows = await sb.insert("vehicles", { plate: clean, plate_suffix: suffix, driver_name: newVehicle.driver.trim(), driver_phone: newVehicle.phone || null, is_active: true });
      const v = rows[0];
      setVehicles(prev => [...prev, { id: v.id, plate: v.plate, suffix: v.plate_suffix, driver: v.driver_name, active: true }]);
      setNewVehicle({ plate: "", driver: "" });
      setAdminMsg("Vehicle added ✅");
      setTimeout(() => setAdminMsg(""), 3000);
    } catch (err) { setAdminMsg("Error: " + err.message); }
  }

  async function toggleVehicle(id) {
    const v = vehicles.find(v => v.id === id);
    try {
      await sb.update("vehicles", { id }, { is_active: !v.active });
      setVehicles(prev => prev.map(v => v.id === id ? { ...v, active: !v.active } : v));
    } catch (_) {}
  }

  async function removeVehicle(id) {
    try {
      await sb.delete("vehicles", { id });
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (_) {}
  }

  // ── Schedule management ──────────────────────
  async function addSchedule() {
    if (!newSchedule.routeId || !newSchedule.vehicleId || !newSchedule.dep) { setAdminMsg("Fill all schedule fields."); return; }
    try {
      const rows = await sb.insert("schedules", {
        route_id: newSchedule.routeId, vehicle_id: newSchedule.vehicleId,
        departure_time: newSchedule.dep, arrival_time: newSchedule.arr || null,
        operating_days: newSchedule.days, is_active: true,
      });
      const s = rows[0];
      setSchedules(prev => [...prev, { id: s.id, routeId: s.route_id, vehicleId: s.vehicle_id, dep: s.departure_time, arr: s.arrival_time, days: s.operating_days }]);
      setNewSchedule({ routeId: "", vehicleId: "", dep: "", arr: "", days: "Mon-Fri" });
      setAdminMsg("Schedule added ✅");
      setTimeout(() => setAdminMsg(""), 3000);
    } catch (err) { setAdminMsg("Error: " + err.message); }
  }

  async function removeSchedule(id) {
    try {
      await sb.delete("schedules", { id });
      setSchedules(prev => prev.filter(s => s.id !== id));
    } catch (_) {}
  }

  // ── Pricing management ───────────────────────
  async function savePrice(routeId) {
    const p = parseInt(editPrice[routeId]);
    if (!p || p < 1000) { setAdminMsg("Enter a valid price (min UGX 1,000)."); return; }
    try {
      await sb.update("routes", { id: routeId }, { base_price: p });
      setRoutePrices(prev => ({ ...prev, [routeId]: p }));
      setAdminMsg("Price updated ✅");
      setTimeout(() => setAdminMsg(""), 3000);
    } catch (err) { setAdminMsg("Error: " + err.message); }
  }

  // ── Cancel booking ───────────────────────────
  async function cancelBooking(code) {
    if (!window.confirm(`Cancel booking ${code}? This cannot be undone.`)) return;
    try {
      await sb.update("bookings", { booking_code: code }, { status: "cancelled", cancelled_at: new Date().toISOString() });
      setAllBookings(prev => prev.map(b => (b.booking_code || b.code) === code ? { ...b, status: "cancelled" } : b));
      // Remove from local seat map
      setBookings(prev => {
        const updated = { ...prev };
        for (const rid of Object.keys(updated)) {
          const rb = { ...updated[rid] };
          const seatKey = Object.keys(rb).find(k => rb[k].code === code);
          if (seatKey) { delete rb[seatKey]; updated[rid] = rb; break; }
        }
        return updated;
      });
      setAdminMsg(`Booking ${code} cancelled.`);
      setTimeout(() => setAdminMsg(""), 4000);
    } catch (err) { setAdminMsg("Cancel failed: " + err.message); }
  }

  // ── Agent management ─────────────────────────
  async function addAgent() {
    if (!newAgent.name.trim() || !newAgent.phone.trim() || newAgent.pin.length < 4) { setAdminMsg("Fill all agent fields (PIN min 4 digits)."); return; }
    try {
      const rows = await sb.insert("users", {
        full_name:     newAgent.name.trim(),
        phone:         newAgent.phone.trim(),
        password_hash: `PLAIN:${newAgent.pin}`, // Supabase trigger will hash it
        role:          "agent",
        is_active:     true,
      });
      const a = rows[0];
      setAgents(prev => [...prev, { id: a.id, name: a.full_name, phone: a.phone, active: true }]);
      setNewAgent({ name: "", phone: "", pin: "" });
      setAdminMsg("Agent added ✅ — they can now log in with their PIN");
      setTimeout(() => setAdminMsg(""), 4000);
    } catch (err) { setAdminMsg("Error adding agent: " + err.message); }
  }

  async function toggleAgent(id) {
    const a = agents.find(a => a.id === id);
    try {
      await sb.update("users", { id }, { is_active: !a.active });
      setAgents(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
    } catch (_) {}
  }

  async function removeAgent(id) {
    try {
      await sb.delete("users", { id });
      setAgents(prev => prev.filter(a => a.id !== id));
    } catch (_) {}
  }

  // ── Feedback ─────────────────────────────────
  async function submitFeedback() {
    if (!feedbackForm.comment.trim()) return;
    try {
      await sb.insert("feedback", {
        passenger_name: feedbackForm.name || null,
        route_label:    feedbackForm.route || null,
        rating:         feedbackForm.rating,
        comment:        feedbackForm.comment,
        is_visible:     true,
      });
      setFeedbackSent(true);
      setTimeout(() => { setFeedbackSent(false); setFeedbackForm({ name: "", route: "", rating: 5, comment: "" }); }, 3500);
    } catch (err) { console.warn("Feedback error:", err.message); }
  }

  async function deleteFeedback(id) {
    try {
      await sb.update("feedback", { id }, { is_visible: false });
      setFeedback(prev => prev.filter(f => f.id !== id));
    } catch (_) {}
  }


  function openWhatsApp(b) {
    const d = new Date(b.time);
    const dateStr = d.toLocaleDateString("en-UG", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    const vehicleLine = b.plateSuffix ? `🚐 *Vehicle Plate (last 4):* ...${b.plateSuffix}\n` : "";
    const msg = encodeURIComponent(
      `🚀 *ROCKETLINE EXPRESS*\n*Booking Confirmation*\n${"─".repeat(28)}\n\n` +
      `📋 *Booking Code:* ${b.code}\n` +
      `👤 *Passenger:* ${b.name}\n` +
      `📱 *Phone:* ${b.phone}\n` +
      `🛣️ *Route:* ${b.route.from} → ${b.route.to}\n` +
      `📍 *Boarding Point:* ${b.boarding}\n` +
      `💺 *Seat Number:* ${b.seat}\n` +
      vehicleLine +
      `📅 *Booked:* ${dateStr}\n` +
      `💰 *Amount Paid:* ${fmt(b.price)} ✅\n` +
      `🎁 *Discount Applied:* 20% OFF saved ${fmt(b.route.price - b.price)}\n\n` +
      `🍶 *FREE water bottle* awaits you at boarding!\n\n` +
      `Thank you for choosing Rocketline Express! 🚀\n_Safe travels!_`
    );
    window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  }

  // ─── RENDER ───────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fa", color: "#1a2540", fontFamily: "'Nunito Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800;900&family=Nunito:wght@700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        :root{
          --red:#E5261A;--red2:#FF4438;--gold:#F5A623;--navy:#1a2540;--navy2:#0f1a35;
          --blue:#2356a8;--blue2:#1a4a9e;--light:#f4f6fa;--white:#ffffff;
          --card:#ffffff;--border:#dde3ef;--text:#1a2540;--muted:#6b7a9a;
          --green:#1DB954;--mtn:#FFC300;--airtel:#E5261A;
        }
        body{font-family:'Nunito Sans','Segoe UI',sans-serif}
        .nunito{font-family:'Nunito',sans-serif}
        .sora{font-family:'Nunito',sans-serif;font-weight:800}
        .script{font-family:'Nunito',sans-serif;font-weight:700;font-style:italic}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;
          border:none;cursor:pointer;border-radius:6px;font-family:'Nunito Sans',sans-serif;
          font-weight:700;font-size:15px;transition:all .18s;padding:13px 28px;letter-spacing:.3px}
        .btn-red{background:var(--red);color:#fff}
        .btn-red:hover{background:var(--red2);transform:translateY(-1px);box-shadow:0 6px 20px rgba(229,38,26,.3)}
        .btn-navy{background:var(--navy);color:#fff}
        .btn-navy:hover{background:var(--navy2)}
        .btn-blue{background:var(--blue);color:#fff}
        .btn-blue:hover{background:var(--blue2)}
        .btn-outline{background:transparent;color:var(--navy);border:2px solid var(--navy)}
        .btn-outline:hover{background:var(--navy);color:#fff}
        .btn-ghost{background:rgba(26,37,64,.06);color:var(--muted);border:1px solid var(--border)}
        .btn-ghost:hover{background:rgba(26,37,64,.1);color:var(--text)}
        .btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important}
        .card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:20px;box-shadow:0 2px 12px rgba(26,37,64,.06)}
        .route-card{background:var(--card);border:2px solid var(--border);border-radius:10px;
          padding:18px 20px;cursor:pointer;transition:all .18s;box-shadow:0 2px 8px rgba(26,37,64,.05)}
        .route-card:hover{border-color:var(--blue);transform:translateY(-2px);box-shadow:0 6px 20px rgba(35,86,168,.12)}
        .route-card.sel{border-color:var(--blue);background:#f0f4ff}
        .input{background:#fff;border:2px solid var(--border);color:var(--text);
          padding:13px 16px;border-radius:8px;width:100%;font-family:'Nunito Sans',sans-serif;
          font-size:14px;outline:none;transition:border .18s}
        .input:focus{border-color:var(--blue)}
        .input::placeholder{color:var(--muted)}
        .badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;
          border-radius:20px;font-size:12px;font-weight:700;letter-spacing:.3px}
        .badge-red{background:rgba(229,38,26,.1);color:var(--red)}
        .badge-gold{background:rgba(245,166,35,.15);color:#c47d00}
        .badge-green{background:rgba(29,185,84,.12);color:#0e8c3a}
        .badge-blue{background:rgba(35,86,168,.1);color:var(--blue)}
        .badge-muted{background:rgba(107,122,154,.1);color:var(--muted)}
        .seat-btn{width:46px;height:46px;border-radius:8px;border:2px solid;
          cursor:pointer;display:flex;align-items:center;justify-content:center;
          font-size:13px;font-weight:700;transition:all .15s;user-select:none}
        .seat-avail{background:#f0fff4;border-color:#a3d9b0;color:#0e8c3a}
        .seat-avail:hover{background:#0e8c3a;color:#fff;border-color:#0e8c3a;transform:scale(1.06)}
        .seat-booked{background:#fff0f0;border-color:#f4b8b8;color:#c44;cursor:not-allowed}
        .seat-sel{background:var(--blue);border-color:var(--blue2);color:#fff;box-shadow:0 0 16px rgba(35,86,168,.4)}
        .seat-driver{background:#f0f2f8;border-color:#dde3ef;color:var(--muted);cursor:default;font-size:10px}
        .pay-option{background:#fff;border:2px solid var(--border);border-radius:10px;
          padding:16px;cursor:pointer;transition:all .18s;display:flex;align-items:center;gap:14px}
        .pay-option:hover{border-color:var(--blue)}
        .pay-option.sel-mtn{border-color:var(--mtn);background:#fffdf0}
        .pay-option.sel-airtel{border-color:var(--airtel);background:#fff5f5}
        .divider{height:1px;background:var(--border);margin:28px 0}
        .step-dot{width:8px;height:8px;border-radius:50%;background:var(--border)}
        .step-dot.active{background:var(--blue)}
        .step-dot.done{background:var(--green)}
        .tag{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;
          border-radius:20px;border:1px solid var(--border);font-size:12.5px;color:var(--muted);background:#fff}
        .pulse{animation:pulse 1.5s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .spin{animation:spin 1s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fade-in{animation:fadeIn .35s ease}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .nav-link{color:rgba(255,255,255,.85);font-size:14px;font-weight:600;text-decoration:none;
          padding:6px 14px;border-radius:4px;transition:all .15s}
        .nav-link:hover{color:#fff;background:rgba(255,255,255,.12)}
        .courier-card{background:#fff;border:2px solid var(--border);border-radius:10px;
          padding:20px;cursor:pointer;transition:all .18s;box-shadow:0 2px 8px rgba(26,37,64,.05)}
        .courier-card:hover{border-color:var(--gold);box-shadow:0 6px 20px rgba(245,166,35,.15);transform:translateY(-2px)}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
      `}</style>

      {/* ── HEADER — Two-tier Megabus style ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 100 }}>
        {/* Top bar — logo + social + auth */}
        <div style={{ background: "#1a2540", padding: "0 20px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", height: 60, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div onClick={reset} style={{ cursor: "pointer" }}>
              <img src={LOGO_MAIN} alt="Rocketline Express" style={{ height: 44, width: "auto", objectFit: "contain" }} />
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              {/* Social icons */}
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <a href="https://wa.me/256701196725" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,.7)", textDecoration: "none", fontSize: 18 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a href="tel:+256701196725" style={{ color: "rgba(255,255,255,.7)", textDecoration: "none", fontSize: 13, fontWeight: 600, fontFamily: "'Nunito Sans', sans-serif" }}>📞 +256 701 196 725</a>
              </div>
              {/* Auth buttons */}
              {agentSession ? (
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ color:"#a8c8ff", fontSize:13, fontFamily:"'Nunito Sans',sans-serif", fontWeight:600 }}>👤 {agentSession.name}</span>
                  <button onClick={() => setAgentSession(null)} style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.2)", borderRadius:5, color:"rgba(255,255,255,.7)", fontSize:12, padding:"5px 10px", cursor:"pointer", fontFamily:"'Nunito Sans',sans-serif" }}>Sign out</button>
                </div>
              ) : (
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => { setStep("admin"); setAdminStep("locked"); }} style={{ background:"transparent", border:"1.5px solid rgba(255,255,255,.3)", borderRadius:5, color:"rgba(255,255,255,.85)", fontSize:13, padding:"7px 16px", cursor:"pointer", fontFamily:"'Nunito Sans',sans-serif", fontWeight:600 }}>🔒 Staff Login</button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Nav bar — links + Buy tickets */}
        <div style={{ background: "#233a6e", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <nav style={{ display: "flex", alignItems: "center" }}>
              {[
                { label: "Book a Seat", action: () => setStep("select-route") },
                { label: "Courier Service", action: () => setStep("courier") },
                { label: "Our Routes", action: () => setStep("select-route") },
                { label: "Track My Van", action: () => setStep("admin") },
                { label: "Help", action: () => setStep("feedback") },
                { label: "⭐ Feedback", action: () => setStep("feedback") },
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{
                  background: "transparent", border: "none", color: "rgba(255,255,255,.85)",
                  fontSize: 14, fontWeight: 600, padding: "16px 18px", cursor: "pointer",
                  fontFamily: "'Nunito Sans', sans-serif", borderBottom: "3px solid transparent",
                  transition: "all .15s", whiteSpace: "nowrap"
                }}
                  onMouseEnter={e => { e.target.style.color="#fff"; e.target.style.borderBottom="3px solid #F5A623"; }}
                  onMouseLeave={e => { e.target.style.color="rgba(255,255,255,.85)"; e.target.style.borderBottom="3px solid transparent"; }}
                >{item.label}</button>
              ))}
            </nav>
            <button className="btn btn-red" style={{ margin: "8px 0 8px 0", padding: "10px 22px", fontSize: 14, borderRadius: 5, flexShrink: 0 }}
              onClick={() => setStep("select-route")}>
              🎫 Buy Tickets
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px 60px" }} className="fade-in">

        {/* ── HOME ── */}
        {step === "home" && (
          <div>
            {/* ── MEGABUS-STYLE HERO — photo bg + search bar ── */}
            <div style={{ position: "relative", minHeight: 380, overflow: "hidden", borderRadius: 0, marginLeft: -16, marginRight: -16, marginTop: -24 }}>
              {/* Background photo */}
              <img src={VAN_PHOTOS.seats_inside} alt="Travel" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,37,64,.82) 0%, rgba(35,58,110,.65) 100%)" }} />

              {/* Hero content */}
              <div style={{ position: "relative", zIndex: 2, padding: "48px 20px 40px", maxWidth: 1100, margin: "0 auto" }}>
                <div style={{ marginBottom: 10 }}>
                  <span className="badge badge-gold" style={{ marginBottom: 12, display: "inline-flex" }}>🎉 20% OFF — Limited Time</span>
                </div>
                <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: 42, fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 8, textShadow: "0 2px 12px rgba(0,0,0,.3)" }}>
                  Travel Smarter<br /><span style={{ color: "#F5A623" }}>Across Uganda</span>
                </h1>
                <p style={{ color: "rgba(255,255,255,.8)", fontSize: 16, marginBottom: 28, fontWeight: 400, maxWidth: 480 }}>
                  Real-time seat booking · 14-seater Hiace vans · Pay with MTN MoMo or Airtel Money
                </p>

                {/* ── SEARCH BAR ── */}
                <div style={{ background: "#fff", borderRadius: 8, display: "flex", flexWrap: "wrap", boxShadow: "0 8px 32px rgba(0,0,0,.25)", overflow: "hidden", maxWidth: 860 }}>
                  {/* Trip type */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: "2px solid #f0f4ff", width: "100%" }}>
                    {["Single", "Return"].map(t => (
                      <label key={t} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "var(--navy)", fontFamily: "'Nunito Sans', sans-serif" }}>
                        <input type="radio" name="triptype" defaultChecked={t==="Single"} style={{ accentColor: "var(--blue)" }} /> {t}
                      </label>
                    ))}
                  </div>
                  {/* Fields row */}
                  <div style={{ display: "flex", flex: 1, flexWrap: "wrap", alignItems: "stretch" }}>
                    <div style={{ flex: "1 1 180px", display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderRight: "1px solid var(--border)" }}>
                      <span style={{ fontSize: 18 }}>📍</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>From</div>
                        <select style={{ border: "none", outline: "none", fontSize: 15, fontFamily: "'Nunito Sans',sans-serif", color: "var(--text)", fontWeight: 600, background: "transparent", width: "100%", cursor: "pointer" }} onChange={e => { const r = ROUTES.find(r2 => r2.from === e.target.value); if(r) setRoute(r); }}>
                          <option value="">Select city</option>
                          {[...new Set(ROUTES.map(r=>r.from))].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", padding: "0 10px", borderRight: "1px solid var(--border)" }}>
                      <button onClick={() => setStep("select-route")} style={{ background: "var(--blue)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>⇄</button>
                    </div>
                    <div style={{ flex: "1 1 180px", display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderRight: "1px solid var(--border)" }}>
                      <span style={{ fontSize: 18 }}>🗺️</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>To</div>
                        <select style={{ border: "none", outline: "none", fontSize: 15, fontFamily: "'Nunito Sans',sans-serif", color: "var(--text)", fontWeight: 600, background: "transparent", width: "100%", cursor: "pointer" }}>
                          <option value="">Select city</option>
                          {[...new Set(ROUTES.map(r=>r.to))].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ flex: "1 1 150px", display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderRight: "1px solid var(--border)" }}>
                      <span style={{ fontSize: 18 }}>📅</span>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Date</div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", fontFamily: "'Nunito Sans',sans-serif" }}>Today</div>
                      </div>
                    </div>
                    <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", padding: "10px 12px" }}>
                      <button className="btn btn-navy" style={{ padding: "12px 28px", fontSize: 15, borderRadius: 6, whiteSpace: "nowrap" }} onClick={() => setStep("select-route")}>
                        Search →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Trust badges */}
                <div style={{ display: "flex", gap: 16, marginTop: 18, flexWrap: "wrap" }}>
                  {["✅ No double booking", "💳 MTN & Airtel Money", "💬 WhatsApp confirmation", "🍶 Free water bottle"].map(t => (
                    <span key={t} style={{ background: "rgba(255,255,255,.15)", color: "#fff", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, fontFamily: "'Nunito Sans',sans-serif", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,.2)" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* ── COMFORT GALLERY — 2×2 photo grid with captions ── */}
            <div className="divider" />
            <div style={{ fontFamily:"'Nunito',sans-serif", fontSize: 26, fontWeight: 800, color: "var(--navy)", textAlign: "center", marginBottom: 6 }}>
              See what's waiting for you
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", marginBottom: 18, fontFamily: "'Nunito Sans',sans-serif" }}>
              Every seat booked through Rocketline Express is in one of these vans
            </div>

            {/* Photo grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              {/* Large feature — leather seats interior */}
              <div style={{ gridColumn: "1 / -1", borderRadius: 12, overflow: "hidden", position: "relative", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                <img src={VAN_PHOTOS.seats_inside} alt="Premium leather seats" style={{ width: "100%", height: 220, objectFit: "cover", objectPosition: "center 30%", display: "block" }}/>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(3,11,24,0.88) 100%)" }}/>
                <div style={{ position: "absolute", bottom: 14, left: 16 }}>
                  <div style={{ fontFamily:"'Nunito',sans-serif", fontSize: 20, fontWeight: 800, color: "#fff" }}>Premium Leather Seats</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "'Nunito Sans',sans-serif" }}>Quilted headliner · Individual headrests · Your own space</div>
                </div>
                <div style={{ position: "absolute", top: 12, right: 12, background: "var(--red)", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, fontFamily: "'Nunito Sans',sans-serif", color: "#fff" }}>
                  YOUR SEAT →
                </div>
              </div>

              {/* White van front */}
              <div style={{ borderRadius: 12, overflow: "hidden", position: "relative", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                <img src={VAN_PHOTOS.van_front} alt="Toyota Hiace" style={{ width: "100%", height: 160, objectFit: "cover", objectPosition: "center", display: "block" }}/>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 35%, rgba(3,11,24,0.9) 100%)" }}/>
                <div style={{ position: "absolute", bottom: 10, left: 12 }}>
                  <div style={{ fontFamily:"'Nunito',sans-serif", fontSize: 15, fontWeight: 800, color: "#fff" }}>Clean & Comfortable</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", fontFamily: "'Nunito Sans',sans-serif" }}>Toyota Hiace · Uganda plates</div>
                </div>
              </div>

              {/* Open door showing seats */}
              <div style={{ borderRadius: 12, overflow: "hidden", position: "relative", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                <img src={VAN_PHOTOS.van_door} alt="Board with ease" style={{ width: "100%", height: 160, objectFit: "cover", objectPosition: "left center", display: "block" }}/>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 35%, rgba(3,11,24,0.9) 100%)" }}/>
                <div style={{ position: "absolute", bottom: 10, left: 12 }}>
                  <div style={{ fontFamily:"'Nunito',sans-serif", fontSize: 15, fontWeight: 800, color: "#fff" }}>Easy Boarding</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", fontFamily: "'Nunito Sans',sans-serif" }}>Wide sliding door · Step-in access</div>
                </div>
              </div>

              {/* Dashboard / side — full width bottom */}
              <div style={{ gridColumn: "1 / -1", borderRadius: 12, overflow: "hidden", position: "relative", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                <img src={VAN_PHOTOS.dashboard} alt="RHD Dashboard" style={{ width: "100%", height: 160, objectFit: "cover", objectPosition: "center top", display: "block" }}/>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, rgba(3,11,24,0.88) 100%)" }}/>
                <div style={{ position: "absolute", bottom: 14, left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ fontFamily:"'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: "#fff" }}>Professional Drivers</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontFamily: "'Nunito Sans',sans-serif" }}>Right-hand drive · Air conditioned · Safe journeys</div>
                  </div>
                  <button className="btn btn-red" onClick={() => setStep("select-route")} style={{ fontSize: 12, padding: "8px 16px", flexShrink: 0 }}>
                    Book a Seat
                  </button>
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* Route cards preview */}
            {/* Line 1 — script: section invitation */}
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontFamily:"'Nunito',sans-serif",
                fontSize: 28, color: "var(--navy)", fontWeight: 900,
                display: "block", textAlign: "center", lineHeight: 1.2
              }}>
                Where are you headed today?
              </span>
            </div>

            {/* Line 2 — script: sub-invitation */}
            <div style={{ marginBottom: 4, textAlign: "center" }}>
              <span style={{ fontFamily:"'Nunito Sans',sans-serif",
                fontSize: 16, color: "var(--muted)", fontWeight: 600
              }}>
                Choose a route and we'll take care of the rest
              </span>
            </div>

            {/* Line 3 — script: comfort promise */}
            <div style={{ marginBottom: 22, textAlign: "center" }}>
              <span style={{ fontFamily:"'Nunito Sans',sans-serif",
                fontSize: 14, color: "var(--red)", fontWeight: 700
              }}>
                Comfortable seats, on time, every time — Ishendaaa!
              </span>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {[
                { pair: "Mbale ↔ Kampala",   price: 30000, icon: "🏔️", desc: "Eastern Uganda" },
                { pair: "Kampala ↔ Mbarara", price: 55000, icon: "🌾", desc: "Western Uganda" },
                { pair: "Kampala ↔ Gulu",    price: 70000, icon: "🌿", desc: "Northern Uganda" },
                { pair: "Kampala ↔ Soroti",  price: 40000, icon: "🌄", desc: "Eastern Uganda" },
              ].map(r => (
                <div key={r.pair} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 22 }}>{r.icon}</span>
                    <div>
                      <div className="nunito" style={{ fontWeight: 600, fontSize: 15 }}>{r.pair}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{r.desc}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "var(--red)", fontWeight: 700, fontSize: 16 }}>{fmt(disc(r.price))}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", textDecoration: "line-through" }}>{fmt(r.price)}</div>
                  </div>
                </div>
              ))}
            {/* ── COURIER SERVICE SECTION on home ── */}
            <div className="divider" />
            <div style={{ background: "linear-gradient(135deg, #1a2540 0%, #233a6e 100%)", borderRadius: 12, padding: "28px 24px", marginBottom: 24, color: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 28 }}>📦</span>
                    <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 900, color: "#F5A623" }}>Courier Service</span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,.8)", fontSize: 14, maxWidth: 440, lineHeight: 1.6 }}>
                    Send parcels and packages between cities on our vans. Same-day delivery on morning departures. Tracked, insured, and confirmed via WhatsApp.
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    {["📍 Door-to-terminal delivery", "⚡ Same-day available", "🔒 Insured parcels", "📲 WhatsApp tracking"].map(t => (
                      <span key={t} style={{ background: "rgba(255,255,255,.12)", color: "rgba(255,255,255,.9)", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, fontFamily: "'Nunito Sans',sans-serif" }}>{t}</span>
                    ))}
                  </div>
                </div>
                <button className="btn" style={{ background: "#F5A623", color: "#1a2540", padding: "13px 28px", fontSize: 15, borderRadius: 6, whiteSpace: "nowrap", flexShrink: 0 }} onClick={() => setStep("courier")}>
                  Send a Parcel →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── COURIER BOOKING ── */}
        {step === "courier" && (
          <div className="fade-in">
            <button className="btn btn-ghost" style={{ marginBottom: 24, fontSize: 13, padding: "8px 16px" }} onClick={reset}>← Home</button>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: 32 }}>📦</span>
              <div>
                <h2 className="nunito" style={{ fontSize: 28, fontWeight: 900, color: "var(--navy)" }}>Courier Service</h2>
                <p style={{ color: "var(--muted)", fontSize: 14 }}>Send parcels between cities on our vans · Same-day available</p>
              </div>
            </div>

            <div className="divider" />

            {/* Courier form */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Left: Parcel details */}
              <div className="card" style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "var(--navy)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>📋</span> Parcel Details
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>From City</label>
                    <select className="input">
                      {[...new Set(ROUTES.map(r=>r.from))].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>To City</label>
                    <select className="input">
                      {[...new Set(ROUTES.map(r=>r.to))].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Parcel Description</label>
                    <input className="input" placeholder="e.g. Documents, Electronics, Clothes" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Weight (kg)</label>
                    <select className="input">
                      <option>Under 1 kg — UGX 5,000</option>
                      <option>1–3 kg — UGX 10,000</option>
                      <option>3–5 kg — UGX 18,000</option>
                      <option>5–10 kg — UGX 30,000</option>
                      <option>10–20 kg — UGX 50,000</option>
                      <option>Over 20 kg — Contact us</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Declared Value (UGX)</label>
                    <input className="input" placeholder="e.g. 50000 — for insurance" type="number" min="0" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Preferred Departure</label>
                    <select className="input">
                      <option>Next available van</option>
                      <option>Morning (before 10am)</option>
                      <option>Afternoon (10am–2pm)</option>
                      <option>Evening (after 2pm)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sender */}
              <div className="card">
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "var(--navy)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>👤</span> Sender
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Full Name</label>
                    <input className="input" placeholder="Sender name" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Phone Number</label>
                    <input className="input" placeholder="07XX XXX XXX" type="tel" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Boarding Point</label>
                    <input className="input" placeholder="Where to drop off parcel" />
                  </div>
                </div>
              </div>

              {/* Recipient */}
              <div className="card">
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "var(--navy)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>📬</span> Recipient
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Full Name</label>
                    <input className="input" placeholder="Recipient name" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Phone Number</label>
                    <input className="input" placeholder="07XX XXX XXX" type="tel" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Collection Point</label>
                    <input className="input" placeholder="Where recipient will collect" />
                  </div>
                </div>
              </div>

              {/* Pricing guide */}
              <div className="card" style={{ gridColumn: "1 / -1", background: "#f8f9fc", border: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "var(--navy)", marginBottom: 14 }}>💰 Courier Rates</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
                  {[
                    { size: "Under 1 kg", price: "UGX 5,000", icon: "✉️" },
                    { size: "1–3 kg", price: "UGX 10,000", icon: "📦" },
                    { size: "3–5 kg", price: "UGX 18,000", icon: "🗃️" },
                    { size: "5–10 kg", price: "UGX 30,000", icon: "📫" },
                    { size: "10–20 kg", price: "UGX 50,000", icon: "🏗️" },
                    { size: "20 kg+", price: "Call us", icon: "📞" },
                  ].map(r => (
                    <div key={r.size} style={{ background: "#fff", borderRadius: 8, padding: "12px 14px", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{r.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "var(--navy)", fontFamily: "'Nunito Sans',sans-serif" }}>{r.size}</div>
                        <div style={{ fontSize: 12, color: "var(--blue)", fontWeight: 700 }}>{r.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>* Rates are per trip. Fragile / high-value items may attract additional insurance fee. Same-day delivery only available on departures before 12pm.</p>
              </div>
            </div>

            {/* Submit */}
            <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={reset}>Cancel</button>
              <button className="btn btn-navy" style={{ padding: "13px 32px" }}
                onClick={() => {
                  alert("📦 Courier booking submitted! Our team will contact you on WhatsApp within 15 minutes to confirm pickup details and payment.");
                  reset();
                }}>
                📦 Submit Courier Booking
              </button>
            </div>
          </div>
        )}

        {/* ── SELECT ROUTE ── */}
        {step === "select-route" && (
          <div>
            <button className="btn btn-ghost" style={{ marginBottom: 24, fontSize: 13, padding: "8px 16px" }} onClick={reset}>← Home</button>
            <div className="nunito" style={{ fontSize: 11, letterSpacing: "3px", color: "var(--blue)", marginBottom: 8, textTransform: "uppercase" }}>Step 1 of 4</div>
            <h2 className="nunito" style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Choose Route</h2>
            <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: 14 }}>All fares include 20% discount — automatically applied</p>
            <div style={{ display: "grid", gap: 10 }}>
              {ROUTES.map(r => {
                const rb = bookings[r.id] || {};
                const taken = Object.keys(rb).length;
                const avail = CONFIG.TOTAL_SEATS - taken;
                const p = disc(r.price);
                return (
                  <div key={r.id} className={`route-card ${route?.id === r.id ? "sel" : ""}`} onClick={() => setRoute(r)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div className="nunito" style={{ fontWeight: 700, fontSize: 17 }}>{r.from} <span style={{ color: "var(--red)" }}>→</span> {r.to}</div>
                        <div style={{ marginTop: 6, display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 12, color: "var(--muted)" }}>⏱ {r.duration}</span>
                          <span style={{ fontSize: 12, color: avail > 3 ? "var(--green)" : avail > 0 ? "var(--gold)" : "var(--red2)" }}>
                            💺 {avail === 0 ? "FULL" : `${avail}/${CONFIG.TOTAL_SEATS} available`}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div className="nunito" style={{ fontSize: 20, fontWeight: 700, color: "var(--red)" }}>{fmt(p)}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", textDecoration: "line-through" }}>{fmt(r.price)}</div>
                        <span className="badge badge-gold" style={{ marginTop: 4 }}>20% OFF</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 24 }}>
              <button className="btn btn-red" style={{ width: "100%", padding: 16 }} disabled={!route}
                onClick={() => setStep("select-seat")}>
                Select Seat →
              </button>
            </div>
          </div>
        )}

        {/* ── SELECT SEAT ── */}
        {step === "select-seat" && (
          <div>
            <button className="btn btn-ghost" style={{ marginBottom: 24, fontSize: 13, padding: "8px 16px" }} onClick={() => setStep("select-route")}>← Change Route</button>
            <div className="nunito" style={{ fontSize: 11, letterSpacing: "3px", color: "var(--blue)", marginBottom: 8, textTransform: "uppercase" }}>Step 2 of 4</div>
            <h2 className="nunito" style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Choose Your Seat</h2>
            <div style={{ marginBottom: 16, color: "var(--muted)", fontSize: 14 }}>
              <span style={{ color: "var(--red)", fontWeight: 600 }}>{route.from} → {route.to}</span>
              &nbsp;·&nbsp;{fmt(price)}&nbsp;·&nbsp;
              <span style={{ color: availCount > 3 ? "var(--green)" : availCount > 0 ? "var(--gold)" : "var(--red2)" }}>
                {availCount === 0 ? "FULL" : `${availCount} seats left`}
              </span>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { cls: "seat-avail", label: "Available" },
                { cls: "seat-booked", label: "Booked" },
                { cls: "seat-sel", label: "Your pick" },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div className={`seat-btn ${l.cls}`} style={{ width: 20, height: 20, fontSize: 8, borderRadius: 4 }} />
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{l.label}</span>
                </div>
              ))}
            </div>

            {/* ── REALISTIC RHD MATATU DIAGRAM ── */}
            {(() => {
              // RIGHT-HAND DRIVE layout (driver on RIGHT side, door on LEFT)
              // Seat numbering: 1=front-left-passenger, 2=middle-front, DRIVER on far right
              // Rows behind: each row has 3 seats [left, middle, right]
              // Seat map (as viewed from above, front at top):
              // Row 0 (front): [1] [2] [DRV]   — door side is LEFT
              // Row 1: [3] [4] [5]
              // Row 2: [6] [7] [8]
              // Row 3: [9] [10] [11]
              // Row 4: [12] [13] [14]  (back bench)

              const SeatBtn = ({ num, isDriver }) => {
                if (isDriver) return (
                  <div style={{
                    width: 48, height: 48, borderRadius: 8,
                    background: "#f8f9fc", border: "2px solid #1E3A5F",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    color: "#4A7A9B", fontSize: 9, fontWeight: 700, letterSpacing: ".5px", fontFamily: "'Sora',sans-serif"
                  }}>
                    <span style={{ fontSize: 16 }}>🧑‍✈️</span>
                    <span style={{ fontSize: 8, marginTop: 2 }}>DRV</span>
                  </div>
                );
                const booked = bookedSeats.includes(num);
                const selected = seat === num;
                return (
                  <div
                    className={`seat-btn ${selected ? "seat-sel" : booked ? "seat-booked" : "seat-avail"}`}
                    style={{ width: 48, height: 48, borderRadius: 8, fontSize: 14, fontWeight: 700, flexShrink: 0, position: "relative" }}
                    onClick={() => !booked && !isDriver && setSeat(num)}
                  >
                    {booked ? <span style={{ fontSize: 16 }}>✕</span> : num}
                    {selected && <div style={{ position: "absolute", top: -4, right: -4, width: 12, height: 12, background: "var(--green)", borderRadius: "50%", border: "2px solid #030B18" }} />}
                  </div>
                );
              };

              return (
                <div style={{ position: "relative" }}>
                  {/* Van outer shell */}
                  <div style={{
                    background: "linear-gradient(180deg, #0C1E35 0%, #071628 100%)",
                    border: "2px solid #1E3A5F",
                    borderRadius: 20,
                    padding: "0 0 16px",
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.05)"
                  }}>

                    {/* ── WINDSCREEN / FRONT CAB ── */}
                    <div style={{
                      background: "linear-gradient(180deg, #E5261A 0%, #C01E14 100%)",
                      padding: "12px 20px 14px",
                      position: "relative", overflow: "hidden"
                    }}>
                      {/* decorative speed lines */}
                      {[0,1,2,3].map(i => (
                        <div key={i} style={{
                          position: "absolute", left: `${15 + i*18}%`, top: 0, bottom: 0,
                          width: 1, background: "rgba(255,255,255,.07)"
                        }} />
                      ))}
                      {/* Rocketline branding strip */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <RocketlineLogo size={20} />
                          <span style={{ fontFamily: "'Georgia','Times New Roman',serif", fontWeight: 700, fontSize: 12, color: "#fff", letterSpacing: "0.3px" }}>RocketLine Express</span>
                        </div>
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,.6)", fontFamily: "'Nunito Sans',sans-serif", letterSpacing: "2px" }}>ISHENDAAA</span>
                      </div>
                      {/* Windscreen */}
                      <div style={{
                        marginTop: 10,
                        background: "linear-gradient(180deg, rgba(135,200,255,0.18) 0%, rgba(135,200,255,0.06) 100%)",
                        border: "1px solid rgba(135,200,255,0.2)",
                        borderRadius: "12px 12px 4px 4px",
                        height: 36, display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          {/* Wiper */}
                          <div style={{ width: 40, height: 2, background: "rgba(255,255,255,.25)", borderRadius: 2, transform: "rotate(-15deg)", transformOrigin: "left center" }} />
                          <div style={{ width: 35, height: 2, background: "rgba(255,255,255,.15)", borderRadius: 2, transform: "rotate(15deg)", transformOrigin: "right center" }} />
                        </div>
                      </div>
                    </div>

                    {/* ── DOOR SIDE LABEL (LEFT = passenger door for RHD) ── */}
                    <div style={{ display: "flex", alignItems: "center", padding: "6px 16px 4px", gap: 8 }}>
                      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                      <span style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "2px", textTransform: "uppercase", whiteSpace: "nowrap" }}>← Passenger Door &nbsp;&nbsp;&nbsp; Driver →</span>
                      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                    </div>

                    {/* ── SEAT ROWS ── */}
                    <div style={{ padding: "4px 16px 0" }}>

                      {/* Row 0: Front — [Seat 1] [Seat 2] [DRIVER] */}
                      {/* RHD: driver is on the RIGHT */}
                      <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                        {/* Door indicator on left */}
                        <div style={{
                          width: 14, alignSelf: "stretch", background: "rgba(229,38,26,.12)",
                          border: "1px solid rgba(229,38,26,.2)", borderRadius: 4,
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          <span style={{ fontSize: 8, color: "var(--red)", writingMode: "vertical-rl", letterSpacing: "1px" }}>DOOR</span>
                        </div>
                        <SeatBtn num={1} />
                        <SeatBtn num={2} />
                        {/* Aisle gap between front seats and driver */}
                        <div style={{ flex: 1 }} />
                        <SeatBtn isDriver />
                        {/* Right wall */}
                        <div style={{ width: 14, background: "rgba(30,58,95,.4)", border: "1px solid rgba(30,58,95,.6)", borderRadius: 4 }} />
                      </div>

                      {/* Aisle divider */}
                      <div style={{ display: "flex", alignItems: "center", margin: "4px 0 8px", gap: 8 }}>
                        <div style={{ width: 14 }} />
                        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(229,38,26,.3), transparent)" }} />
                        <span style={{ fontSize: 9, color: "#2a4060", letterSpacing: "1px", textTransform: "uppercase" }}>AISLE</span>
                        <div style={{ flex: 1, height: 1, background: "linear-gradient(270deg, rgba(30,58,95,.5), transparent)" }} />
                        <div style={{ width: 14 }} />
                      </div>

                      {/* Rows 1–4: 3 seats per row [left] [mid] [right] */}
                      {[[3,4,5], [6,7,8], [9,10,11], [12,13,14]].map((row, ri) => (
                        <div key={ri} style={{ display: "flex", gap: 8, marginBottom: ri < 3 ? 8 : 0, alignItems: "center" }}>
                          {/* Left wall */}
                          <div style={{
                            width: 14, alignSelf: "stretch",
                            background: "rgba(30,58,95,.3)", border: "1px solid rgba(30,58,95,.5)", borderRadius: 4,
                            display: "flex", alignItems: "center", justifyContent: "center"
                          }}>
                            <span style={{ fontSize: 7, color: "#2a4060", writingMode: "vertical-rl" }}>│</span>
                          </div>
                          {/* Left seat */}
                          <SeatBtn num={row[0]} />
                          {/* Centre aisle gap */}
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
                            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#1E3A5F" }} />
                            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#1E3A5F" }} />
                          </div>
                          {/* Middle seat */}
                          <SeatBtn num={row[1]} />
                          {/* Right seat */}
                          <SeatBtn num={row[2]} />
                          {/* Right wall */}
                          <div style={{
                            width: 14, alignSelf: "stretch",
                            background: "rgba(30,58,95,.3)", border: "1px solid rgba(30,58,95,.5)", borderRadius: 4,
                            display: "flex", alignItems: "center", justifyContent: "center"
                          }}>
                            <span style={{ fontSize: 7, color: "#2a4060", writingMode: "vertical-rl" }}>│</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ── REAR BUMPER ── */}
                    <div style={{
                      margin: "14px 16px 0",
                      background: "linear-gradient(180deg, #0C1E35, #E5261A)",
                      borderRadius: "4px 4px 14px 14px",
                      height: 20,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <div style={{ width: 60, height: 6, background: "rgba(255,255,255,.15)", borderRadius: 3 }} />
                    </div>
                  </div>

                  {/* Side mirror indicators */}
                  <div style={{ position: "absolute", top: 58, left: -12, width: 12, height: 20, background: "#1E3A5F", borderRadius: "4px 0 0 4px", border: "1px solid #2a5080" }} />
                  <div style={{ position: "absolute", top: 58, right: -12, width: 12, height: 20, background: "#1E3A5F", borderRadius: "0 4px 4px 0", border: "1px solid #2a5080" }} />

                  {/* Wheels */}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px", marginTop: 6 }}>
                    {[0,1].map(i => (
                      <div key={i} style={{ display: "flex", gap: 6 }}>
                        <div style={{ width: 28, height: 14, background: "#111", borderRadius: "0 0 8px 8px", border: "2px solid #333", borderTop: "none" }} />
                        <div style={{ width: 28, height: 14, background: "#111", borderRadius: "0 0 8px 8px", border: "2px solid #333", borderTop: "none" }} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Selection confirmation */}
            {seat && (
              <div className="card" style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", borderColor: "var(--red)", background: "#120508" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>Selected Seat</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <strong style={{ color: "var(--red)", fontSize: 22, fontFamily: "'Sora',sans-serif", fontWeight: 800 }}>#{seat}</strong>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>
                      {seat <= 2 ? "Front row" : seat <= 5 ? "Row 1" : seat <= 8 ? "Row 2" : seat <= 11 ? "Row 3" : "Back row"}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="nunito" style={{ fontWeight: 700, fontSize: 20, color: "var(--red)" }}>{fmt(price)}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", textDecoration: "line-through" }}>{fmt(route.price)}</div>
                </div>
              </div>
            )}

            <button className="btn btn-red" style={{ width: "100%", marginTop: 14, padding: 16 }}
              disabled={!seat} onClick={() => setStep("form")}>Continue to Details →</button>
          </div>
        )}

        {/* ── FORM ── */}
        {step === "form" && (
          <div>
            <button className="btn btn-ghost" style={{ marginBottom: 24, fontSize: 13, padding: "8px 16px" }} onClick={() => setStep("select-seat")}>← Back</button>
            <div className="nunito" style={{ fontSize: 11, letterSpacing: "3px", color: "var(--blue)", marginBottom: 8, textTransform: "uppercase" }}>Step 3 of 4</div>
            <h2 className="nunito" style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Passenger Details</h2>
            <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: 14 }}>Your WhatsApp confirmation will be sent to the number you provide</p>

            {/* Booking summary */}
            <div className="card" style={{ marginBottom: 20 }}>
              {[
                ["Route", `${route.from} → ${route.to}`],
                ["Seat", `#${seat}`],
                ["Duration", route.duration],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>{k}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0" }}>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>Total</span>
                <div style={{ textAlign: "right" }}>
                  <div className="nunito" style={{ fontWeight: 700, fontSize: 20, color: "var(--red)" }}>{fmt(price)}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", textDecoration: "line-through" }}>{fmt(route.price)}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              {/* Full Name */}
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, letterSpacing: ".5px" }}>FULL NAME *</label>
                <input className="input" placeholder="e.g. Amina Nakato" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>

              {/* Phone Number */}
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, letterSpacing: ".5px" }}>
                  WHATSAPP PHONE NUMBER *
                  {network && (
                    <span style={{ marginLeft: 8, color: network === "mtn" ? "var(--mtn)" : "var(--red2)", fontWeight: 600 }}>
                      {network === "mtn" ? "✓ MTN" : "✓ Airtel"} detected
                    </span>
                  )}
                </label>
                <input className="input" placeholder="e.g. 0771234567 or 0701234567" value={form.phone} type="tel"
                  onChange={e => setForm({ ...form, phone: e.target.value })} />
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 5 }}>
                  Booking confirmation will be sent to this number on WhatsApp
                </div>
              </div>

              {/* Boarding Point */}
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, letterSpacing: ".5px" }}>BOARDING POINT *</label>
                <input className="input" placeholder={`e.g. ${route.from} Main Park, Taxi Stage...`} value={form.boarding}
                  onChange={e => setForm({ ...form, boarding: e.target.value })} />
              </div>

              {/* Payment Method — explicit selection */}
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 10, letterSpacing: ".5px" }}>SELECT PAYMENT METHOD *</label>

                {/* MTN */}
                <div className={`pay-option ${payMethod === "mtn" ? "sel-mtn" : ""}`}
                  style={{ marginBottom: 10, cursor: "pointer" }}
                  onClick={() => setPayMethod("mtn")}>
                  <div style={{ width: 44, height: 44, background: "#1a1200", border: "2px solid var(--mtn)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 900, color: "var(--mtn)", fontFamily: "'Sora',sans-serif", letterSpacing: ".5px" }}>MTN</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="nunito" style={{ fontWeight: 700, color: "#FFC300", fontSize: 15 }}>MTN Mobile Money</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Numbers: 076, 077, 078, 039</div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    border: `2px solid ${payMethod === "mtn" ? "#FFC300" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    {payMethod === "mtn" && <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFC300" }} />}
                  </div>
                </div>

                {/* Airtel */}
                <div className={`pay-option ${payMethod === "airtel" ? "sel-airtel" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setPayMethod("airtel")}>
                  <div style={{ width: 44, height: 44, background: "#180400", border: "2px solid var(--red)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 8, fontWeight: 900, color: "var(--red2)", fontFamily: "'Sora',sans-serif", letterSpacing: ".5px", textAlign: "center", lineHeight: 1.2 }}>AIR<br/>TEL</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="nunito" style={{ fontWeight: 700, color: "var(--red2)", fontSize: 15 }}>Airtel Money</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Numbers: 070, 074, 075</div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    border: `2px solid ${payMethod === "airtel" ? "var(--red2)" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    {payMethod === "airtel" && <div style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--red2)" }} />}
                  </div>
                </div>

                {/* Mismatch warning */}
                {network && payMethod && payMethod !== network && (
                  <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(245,166,35,.08)", border: "1px solid rgba(245,166,35,.25)", borderRadius: 8, fontSize: 13, color: "var(--gold)" }}>
                    ⚠️ Your phone number looks like <strong>{network === "mtn" ? "MTN" : "Airtel"}</strong> but you selected <strong>{payMethod === "mtn" ? "MTN" : "Airtel"}</strong>. Please confirm this is correct before proceeding.
                  </div>
                )}
              </div>
            </div>

            <div className="card" style={{ marginTop: 18, background: "#050E1A", borderColor: "#1A3A20", display: "flex", gap: 12, alignItems: "center" }}>
              <WaterBottle size={26} />
              <div style={{ fontSize: 14, color: "#3CB871" }}>
                <strong>Complimentary Perk:</strong> 1 free bottle of water included with every booking!
              </div>
            </div>

            <button className="btn btn-red" style={{ width: "100%", marginTop: 18, padding: 16 }}
              disabled={!form.name || !form.phone || !form.boarding || !payMethod}
              onClick={() => setStep("payment")}>
              Proceed to Payment →
            </button>
          </div>
        )}

        {/* ── PAYMENT ── */}
        {step === "payment" && (
          <div>
            {payState === "idle" && (
              <button className="btn btn-ghost" style={{ marginBottom: 24, fontSize: 13, padding: "8px 16px" }} onClick={() => setStep("form")}>← Back</button>
            )}
            <div className="nunito" style={{ fontSize: 11, letterSpacing: "3px", color: "var(--blue)", marginBottom: 8, textTransform: "uppercase" }}>Step 4 of 4</div>
            <h2 className="nunito" style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Payment</h2>
            <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: 14 }}>Secure mobile money payment — no hidden charges</p>

            {/* Amount */}
            <div className="card" style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>{route.from} → {route.to} · Seat #{seat}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Passenger: {form.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="nunito" style={{ fontWeight: 800, fontSize: 24, color: "var(--red)" }}>{fmt(price)}</div>
                <span className="badge badge-gold">20% DISC</span>
              </div>
            </div>

            {payState === "idle" && (
              <>
                {/* Payment method confirmation banner */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                  background: payMethod === "mtn" ? "rgba(255,195,0,.07)" : "rgba(229,38,26,.07)",
                  border: `1.5px solid ${payMethod === "mtn" ? "rgba(255,195,0,.3)" : "rgba(229,38,26,.3)"}`,
                  borderRadius: 10, marginBottom: 18
                }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 10, flexShrink: 0,
                    background: payMethod === "mtn" ? "#1a1200" : "#180400",
                    border: `2px solid ${payMethod === "mtn" ? "var(--mtn)" : "var(--red)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <span style={{ fontSize: payMethod === "mtn" ? 10 : 8, fontWeight: 900, color: payMethod === "mtn" ? "var(--mtn)" : "var(--red2)", fontFamily: "'Sora',sans-serif", letterSpacing: ".5px", textAlign: "center", lineHeight: 1.2 }}>
                      {payMethod === "mtn" ? "MTN" : "AIR\nTEL"}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="nunito" style={{ fontWeight: 700, fontSize: 15, color: payMethod === "mtn" ? "var(--mtn)" : "var(--red2)" }}>
                      {payMethod === "mtn" ? "MTN Mobile Money" : "Airtel Money"}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Paying from: {form.phone}</div>
                  </div>
                  <button className="btn btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }}
                    onClick={() => setStep("form")}>Change</button>
                </div>

                <div style={{ padding: "12px 14px", background: "#040C1A", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--muted)", lineHeight: 1.7, marginBottom: 18 }}>
                  🔒 <strong style={{ color: "var(--text)" }}>How it works:</strong> After clicking "Pay Now", you'll receive a USSD push prompt on your phone. Enter your mobile money PIN to approve. Your seat is reserved the moment payment confirms.
                </div>

                <button className="btn btn-red" style={{ width: "100%", padding: 17, fontSize: 16 }} onClick={initiatePayment}>
                  {payMethod === "mtn" ? "📱" : "📲"} Pay {fmt(price)} with {payMethod === "mtn" ? "MTN MoMo" : "Airtel Money"}
                </button>
              </>
            )}

            {(payState === "waiting" || payState === "polling") && (
              <div className="card" style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{payMethod === "mtn" ? "📱" : "📲"}</div>
                <div className="nunito" style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
                  {payState === "waiting" ? "Sending Payment Request..." : "Awaiting Your Confirmation..."}
                </div>
                <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>{payMsg}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                  {[0,1,2].map(i => (
                    <div key={i} className="pulse" style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--red)", animationDelay: `${i * .3}s` }} />
                  ))}
                </div>
                <div style={{ marginTop: 20, fontSize: 12, color: "var(--muted)" }}>
                  This may take up to 2 minutes. Please do not close this page.
                </div>
              </div>
            )}

            {payState === "failed" && (
              <div className="card" style={{ textAlign: "center", padding: 36 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>❌</div>
                <div className="nunito" style={{ fontSize: 20, fontWeight: 700, color: "var(--red2)", marginBottom: 12 }}>Payment Failed</div>
                <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>{payMsg}</div>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="btn btn-red" onClick={() => { setPayState("idle"); setPayMsg(""); }}>Try Again</button>
                  <button className="btn btn-ghost" onClick={() => setStep("form")}>Edit Details</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SUCCESS ── */}
        {step === "success" && booking && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
              <h2 className="nunito" style={{ fontSize: 32, fontWeight: 800, color: "var(--green)", marginBottom: 8 }}>Booking Confirmed!</h2>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>Your seat is secured. Click below to receive your full confirmation on WhatsApp.</p>
            </div>

            <div className="card" style={{ marginBottom: 18, borderColor: "rgba(29,185,84,.3)", background: "#030F08" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "1px", textTransform: "uppercase" }}>Booking Code</div>
                  <div className="nunito" style={{ fontSize: 22, fontWeight: 800, color: "var(--green)", letterSpacing: "1px", marginTop: 2 }}>{booking.code}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="badge badge-green">✓ PAID</span>
                </div>
              </div>
              {[
                ["Passenger",      booking.name],
                ["Route",          `${booking.route.from} → ${booking.route.to}`],
                ["Boarding Point", booking.boarding],
                ["Phone",          booking.phone],
                ["Seat",           `#${booking.seat}`],
                ["Amount Paid",    fmt(booking.price)],
                ["Discount Saved", fmt(booking.route.price - booking.price)],
                ...(booking.plateSuffix ? [["Vehicle (last 4)", `...${booking.plateSuffix}`]] : []),
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #0A1A10" }}>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>{k}</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: k === "Amount Paid" ? "var(--green)" : k === "Vehicle (last 4)" ? "var(--gold)" : "var(--text)" }}>{v}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ marginBottom: 18, background: "#050E1A", borderColor: "#1A3A20", display: "flex", gap: 14, alignItems: "center" }}>
              <WaterBottle size={34} />
              <div>
                <div className="nunito" style={{ fontWeight: 700, marginBottom: 2 }}>Free Water Bottle!</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>Claim your complimentary bottled water when you board the van.</div>
              </div>
            </div>

            <button className="btn btn-red" style={{ width: "100%", padding: 16, marginBottom: 12, fontSize: 16 }} onClick={() => openWhatsApp(booking)}>
              💬 Send Confirmation to WhatsApp
            </button>
            <button className="btn btn-ghost" style={{ width: "100%" }} onClick={reset}>
              Book Another Seat
            </button>
          </div>
        )}

        {/* ── FULL ADMIN / MANAGEMENT SYSTEM ── */}
        {step === "admin" && (
          <div>
            <button className="btn btn-ghost" style={{ marginBottom: 20, fontSize: 13, padding: "8px 16px" }}
              onClick={() => { setStep("home"); setAdminStep("locked"); setAdminPinInput(""); setAdminPinConfirm(""); setAdminPinError(""); }}>
              ← Back to Site
            </button>

            {/* ── LOCKED ── */}
            {adminStep === "locked" && (
              <div style={{ maxWidth: 380, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <div style={{ fontSize: 52, marginBottom: 10 }}>🔐</div>
                  <h2 className="nunito" style={{ fontSize: 26, fontWeight: 800 }}>Rocketline Control Centre</h2>
                  <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>{adminPin ? "Enter your admin password to access the full management system" : "First time — set your admin password"}</p>
                </div>
                <div className="card">
                  <label style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Admin Password</label>
                  <input className="input" type="password" placeholder="Enter password" value={adminPinInput}
                    onChange={e => { setAdminPinInput(e.target.value); setAdminPinError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleAdminLogin()} style={{ marginBottom: 12 }}/>
                  {adminPinError && <div style={{ color:"var(--red2)", fontSize:13, marginBottom:10 }}>⚠️ {adminPinError}</div>}
                  <button className="btn btn-red" style={{ width:"100%", padding:14 }} onClick={handleAdminLogin}>
                    {adminPin ? "Login to Dashboard →" : "Create Admin Password →"}
                  </button>
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>Call Centre Agent Login</div>
                    <input className="input" type="password" placeholder="Enter your agent PIN" value={agentPinInput}
                      onChange={e => { setAgentPinInput(e.target.value.replace(/\D/g,"").slice(0,8)); setAgentLoginError(""); }}
                      onKeyDown={e => e.key === "Enter" && handleAgentLogin()} style={{ marginBottom: 8 }}/>
                    {agentLoginError && <div style={{ color:"var(--red2)", fontSize:12, marginBottom:6 }}>⚠️ {agentLoginError}</div>}
                    <button className="btn btn-ghost" style={{ width:"100%", padding:12, fontSize:13 }} onClick={handleAgentLogin}>
                      Agent Login →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── PIN SETUP ── */}
            {adminStep === "pin-setup" && (
              <div style={{ maxWidth: 380, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 44, marginBottom: 10 }}>🛡️</div>
                  <h2 className="nunito" style={{ fontSize: 22, fontWeight: 800 }}>Create Admin PIN</h2>
                  <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>Choose a secure 4–8 digit PIN. Only share with authorised personnel.</p>
                </div>
                <div className="card">
                  <label style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>New PIN</label>
                  <input className="input" type="password" placeholder="4–8 digits" value={adminPinInput}
                    onChange={e => { setAdminPinInput(e.target.value.replace(/\D/g,"").slice(0,8)); setAdminPinError(""); }} style={{ marginBottom: 12 }}/>
                  <label style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Confirm PIN</label>
                  <input className="input" type="password" placeholder="Repeat PIN" value={adminPinConfirm}
                    onChange={e => { setAdminPinConfirm(e.target.value.replace(/\D/g,"").slice(0,8)); setAdminPinError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleSetPin()} style={{ marginBottom: 12 }}/>
                  {adminPinError && <div style={{ color:"var(--red2)", fontSize:13, marginBottom:10 }}>⚠️ {adminPinError}</div>}
                  <button className="btn btn-red" style={{ width:"100%", padding:14 }} onClick={handleSetPin}>Save PIN & Enter →</button>
                </div>
              </div>
            )}

            {/* ── FULL DASHBOARD ── */}
            {adminStep === "dashboard" && (() => {
              const filtered = filterByWindow(allBookings.filter(b => b.status !== "cancelled"), revenueWindow);
              const totalRev = filtered.reduce((s, b) => s + Number(b.price), 0);
              const byRoute  = revenueByKey(filtered, b => `${b.routeFrom} → ${b.routeTo}`);
              const byVehicle= revenueByKey(filtered, b => b.plateSuffix ? `...${b.plateSuffix}` : "N/A");
              const byDriver = revenueByKey(filtered, b => {
                const v = vehicles.find(v => v.suffix === b.plateSuffix);
                return v ? v.driver : "Unknown";
              });
              const cancelledCount = allBookings.filter(b => b.status === "cancelled").length;
              return (
                <div>
                  {/* Top bar */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                    <div>
                      <h2 className="nunito" style={{ fontSize:22, fontWeight:800 }}>🚐 Control Centre</h2>
                      <div style={{ fontSize:12, color:"var(--muted)", marginTop:3 }}>Rocketline Express Management System</div>
                    </div>
                    <button onClick={() => setAdminStep("locked")} style={{ background:"rgba(229,38,26,0.1)", border:"1px solid rgba(229,38,26,0.3)", borderRadius:8, color:"var(--red2)", fontSize:12, padding:"7px 14px", cursor:"pointer", fontFamily:"'Nunito Sans',sans-serif" }}>🔒 Lock</button>
                  </div>

                  {/* System message */}
                  {adminMsg && <div style={{ background:"rgba(29,185,84,0.1)", border:"1px solid rgba(29,185,84,0.3)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"var(--green)", marginBottom:16 }}>{adminMsg}</div>}

                  {/* KPI summary row */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:20 }}>
                    {[
                      { label:"Total Bookings", value: allBookings.filter(b=>b.status!=="cancelled").length, color:"var(--gold)" },
                      { label:"Revenue (period)", value: `UGX ${totalRev.toLocaleString()}`, color:"var(--green)" },
                      { label:"Active Agents", value: agents.filter(a=>a.active).length, color:"#4A9EFF" },
                      { label:"Cancellations", value: cancelledCount, color:"var(--red2)" },
                    ].map(k => (
                      <div key={k.label} style={{ background:"#fff", borderRadius:10, padding:"12px 14px", border:"1px solid var(--border)" }}>
                        <div style={{ fontSize:18, fontWeight:800, color:k.color, fontFamily:"'Sora',sans-serif" }}>{k.value}</div>
                        <div style={{ fontSize:10, color:"var(--muted)", marginTop:3 }}>{k.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Nav tabs */}
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
                    {[
                      {key:"ops",      label:"🚐 Live Ops"},
                      {key:"routes",   label:"🛣️ Routes & Pricing"},
                      {key:"vehicles", label:"🚌 Vehicles"},
                      {key:"schedules",label:"🗓️ Schedules"},
                      {key:"bookings", label:"📋 Bookings"},
                      {key:"revenue",  label:"📊 Revenue"},
                      {key:"agents",   label:"👥 Agents"},
                      {key:"logs",     label:"📡 Live Logs"},
                      {key:"feedback", label:"⭐ Feedback"},
                    ].map(t => (
                      <button key={t.key} onClick={() => setAdminTab(t.key)} style={{
                        background: adminTab===t.key ? "var(--red)" : "rgba(255,255,255,0.05)",
                        border: adminTab===t.key ? "none" : "1px solid var(--border)",
                        color: adminTab===t.key ? "#fff" : "var(--muted)",
                        borderRadius:8, padding:"8px 14px", fontSize:12, cursor:"pointer", fontFamily:"'Nunito Sans',sans-serif", fontWeight:600
                      }}>{t.label}</button>
                    ))}
                  </div>

                  {/* ── TAB: LIVE OPS ── */}
                  {adminTab === "ops" && (
                    <div>
                      <div style={{ fontSize:13, color:"var(--muted)", marginBottom:14 }}>Set the loading van plate for each route. Last 4 chars appear on passenger receipts and booking codes.</div>
                      <div style={{ display:"grid", gap:10 }}>
                        {ROUTES.map(r => {
                          const van = activeVans[r.id];
                          const taken = Object.keys(bookings[r.id]||{}).length;
                          const avail = CONFIG.TOTAL_SEATS - taken;
                          return (
                            <div key={r.id} className="card" style={{ borderColor: van ? "rgba(245,166,35,0.4)" : "var(--border)" }}>
                              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                                <div>
                                  <div className="nunito" style={{ fontWeight:700, fontSize:14 }}>{r.from} → {r.to}</div>
                                  <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>
                                    ⏱ {r.duration} · <span style={{ color: avail>3?"var(--green)":avail>0?"var(--gold)":"var(--red2)" }}>💺 {avail===0?"FULL":`${avail}/${CONFIG.TOTAL_SEATS} seats`}</span>
                                    {routePrices[r.id] && <span style={{ color:"var(--gold)" }}> · UGX {disc(routePrices[r.id]).toLocaleString()}</span>}
                                  </div>
                                </div>
                                {van && <div style={{ textAlign:"right" }}>
                                  <div style={{ fontSize:9, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px" }}>Active Van</div>
                                  <div className="nunito" style={{ fontWeight:800, fontSize:20, color:"var(--gold)", letterSpacing:"2px" }}>...{van.suffix}</div>
                                  <div style={{ fontSize:9, color:"var(--muted)" }}>{van.plate}</div>
                                </div>}
                              </div>
                              <div style={{ display:"flex", gap:8 }}>
                                <input className="input" placeholder="Enter plate e.g. UA 001AA"
                                  value={plateInputs[r.id]||""} style={{ flex:1, fontSize:13, letterSpacing:"1px", fontWeight:600 }}
                                  onChange={e => { setPlateInputs(p=>({...p,[r.id]:e.target.value.toUpperCase()})); setPlateErrors(er=>({...er,[r.id]:""})); }}/>
                                <button className="btn btn-red" style={{ padding:"12px 16px", fontSize:12 }} onClick={() => handleSetPlate(r.id)}>Set</button>
                                {van && <button onClick={()=>handleClearPlate(r.id)} style={{ background:"rgba(229,38,26,0.08)", border:"1px solid rgba(229,38,26,0.25)", borderRadius:8, color:"var(--red2)", fontSize:11, padding:"12px 12px", cursor:"pointer", fontFamily:"'Nunito Sans',sans-serif" }}>Clear</button>}
                              </div>
                              {plateErrors[r.id] && <div style={{ color:"var(--red2)", fontSize:11, marginTop:5 }}>⚠️ {plateErrors[r.id]}</div>}
                              {plateSaved[r.id] && <div style={{ color:"var(--green)", fontSize:11, marginTop:5 }}>✅ Saved! Booking code suffix: <strong>...{activeVans[r.id]?.suffix}</strong></div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── TAB: ROUTES & PRICING ── */}
                  {adminTab === "routes" && (
                    <div>
                      <div style={{ fontSize:13, color:"var(--muted)", marginBottom:14 }}>Adjust pricing per route. 20% discount is applied automatically on all fares.</div>
                      <div style={{ display:"grid", gap:10 }}>
                        {ROUTES.map(r => {
                          const basePrice = routePrices[r.id] || r.price;
                          return (
                            <div key={r.id} className="card">
                              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                                <div>
                                  <div className="nunito" style={{ fontWeight:700, fontSize:14 }}>{r.from} → {r.to}</div>
                                  <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>⏱ {r.duration}</div>
                                </div>
                                <div style={{ textAlign:"right" }}>
                                  <div style={{ color:"var(--green)", fontWeight:700 }}>UGX {disc(basePrice).toLocaleString()}</div>
                                  <div style={{ fontSize:11, color:"var(--muted)", textDecoration:"line-through" }}>UGX {basePrice.toLocaleString()}</div>
                                </div>
                              </div>
                              <div style={{ display:"flex", gap:8 }}>
                                <input className="input" type="number" placeholder={`New base price (current: ${basePrice.toLocaleString()})`}
                                  value={editPrice[r.id]||""} style={{ flex:1, fontSize:13 }}
                                  onChange={e => setEditPrice(p => ({...p,[r.id]:e.target.value}))}/>
                                <button className="btn btn-red" style={{ padding:"12px 16px", fontSize:12 }} onClick={() => savePrice(r.id)}>Save</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── TAB: VEHICLES ── */}
                  {adminTab === "vehicles" && (
                    <div>
                      <div className="card" style={{ marginBottom:16 }}>
                        <div className="nunito" style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Add New Vehicle</div>
                        <div style={{ display:"grid", gap:8 }}>
                          <input className="input" placeholder="Registration plate (e.g. UA 001AA)" value={newVehicle.plate}
                            onChange={e => setNewVehicle(v=>({...v,plate:e.target.value.toUpperCase()}))}/>
                          <input className="input" placeholder="Driver name" value={newVehicle.driver}
                            onChange={e => setNewVehicle(v=>({...v,driver:e.target.value}))}/>
                          <button className="btn btn-red" onClick={addVehicle}>Add Vehicle</button>
                        </div>
                      </div>
                      <div style={{ display:"grid", gap:8 }}>
                        {vehicles.length === 0 && <div style={{ color:"var(--muted)", fontSize:13, textAlign:"center", padding:20 }}>No vehicles registered yet.</div>}
                        {vehicles.map(v => (
                          <div key={v.id} className="card" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderColor: v.active?"rgba(29,185,84,0.3)":"var(--border)" }}>
                            <div>
                              <div className="nunito" style={{ fontWeight:700, fontSize:15, color:"var(--gold)", letterSpacing:"1px" }}>{v.plate}</div>
                              <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>Driver: {v.driver} · Suffix: <strong style={{color:"var(--gold)"}}>...{v.suffix}</strong></div>
                            </div>
                            <div style={{ display:"flex", gap:6 }}>
                              <button onClick={()=>toggleVehicle(v.id)} style={{ background: v.active?"rgba(29,185,84,0.1)":"rgba(229,38,26,0.08)", border:`1px solid ${v.active?"rgba(29,185,84,0.3)":"rgba(229,38,26,0.3)"}`, borderRadius:6, color: v.active?"var(--green)":"var(--red2)", fontSize:11, padding:"6px 10px", cursor:"pointer", fontFamily:"'Nunito Sans',sans-serif" }}>
                                {v.active ? "Active" : "Inactive"}
                              </button>
                              <button onClick={()=>removeVehicle(v.id)} style={{ background:"transparent", border:"1px solid var(--border)", borderRadius:6, color:"var(--muted)", fontSize:11, padding:"6px 10px", cursor:"pointer", fontFamily:"'Nunito Sans',sans-serif" }}>Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── TAB: SCHEDULES ── */}
                  {adminTab === "schedules" && (
                    <div>
                      <div className="card" style={{ marginBottom:16 }}>
                        <div className="nunito" style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Add Schedule</div>
                        <div style={{ display:"grid", gap:8 }}>
                          <select className="input" value={newSchedule.routeId} onChange={e=>setNewSchedule(s=>({...s,routeId:e.target.value}))}>
                            <option value="">Select Route</option>
                            {ROUTES.map(r=><option key={r.id} value={r.id}>{r.from} → {r.to}</option>)}
                          </select>
                          <select className="input" value={newSchedule.vehicleId} onChange={e=>setNewSchedule(s=>({...s,vehicleId:e.target.value}))}>
                            <option value="">Select Vehicle</option>
                            {vehicles.filter(v=>v.active).map(v=><option key={v.id} value={v.id}>{v.plate} — {v.driver}</option>)}
                          </select>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                            <div><label style={{ fontSize:11, color:"var(--muted)", display:"block", marginBottom:4 }}>Departure</label>
                              <input className="input" type="time" value={newSchedule.dep} onChange={e=>setNewSchedule(s=>({...s,dep:e.target.value}))}/></div>
                            <div><label style={{ fontSize:11, color:"var(--muted)", display:"block", marginBottom:4 }}>Arrival (est.)</label>
                              <input className="input" type="time" value={newSchedule.arr} onChange={e=>setNewSchedule(s=>({...s,arr:e.target.value}))}/></div>
                          </div>
                          <select className="input" value={newSchedule.days} onChange={e=>setNewSchedule(s=>({...s,days:e.target.value}))}>
                            {["Daily","Mon-Fri","Mon-Sat","Weekends","Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><option key={d}>{d}</option>)}
                          </select>
                          <button className="btn btn-red" onClick={addSchedule}>Save Schedule</button>
                        </div>
                      </div>
                      <div style={{ display:"grid", gap:8 }}>
                        {schedules.length===0 && <div style={{ color:"var(--muted)", fontSize:13, textAlign:"center", padding:20 }}>No schedules yet.</div>}
                        {schedules.map(s => {
                          const r = ROUTES.find(r=>r.id===s.routeId);
                          const v = vehicles.find(v=>v.id===s.vehicleId);
                          return (
                            <div key={s.id} className="card" style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                              <div>
                                <div className="nunito" style={{ fontWeight:700, fontSize:13 }}>{r ? `${r.from} → ${r.to}` : s.routeId}</div>
                                <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>🕐 {s.dep}{s.arr ? ` → ${s.arr}` : ""} · {s.days} · {v ? v.plate : "No vehicle"}</div>
                              </div>
                              <button onClick={()=>removeSchedule(s.id)} style={{ background:"transparent", border:"1px solid var(--border)", borderRadius:6, color:"var(--red2)", fontSize:11, padding:"6px 10px", cursor:"pointer", fontFamily:"'Nunito Sans',sans-serif" }}>Remove</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── TAB: ALL BOOKINGS ── */}
                  {adminTab === "bookings" && (
                    <div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                        <div style={{ fontSize:13, color:"var(--muted)" }}>{allBookings.length} total bookings · {cancelledCount} cancelled</div>
                        <button className="btn btn-ghost" style={{ fontSize:12, padding:"8px 14px" }} onClick={() => downloadCSV(allBookings.filter(b=>b.status!=="cancelled"), "AllBookings")}>⬇ Export CSV</button>
                      </div>
                      <div style={{ display:"grid", gap:8, maxHeight:500, overflowY:"auto" }}>
                        {allBookings.length===0 && <div style={{ color:"var(--muted)", fontSize:13, textAlign:"center", padding:20 }}>No bookings yet.</div>}
                        {[...allBookings].reverse().map(b => (
                          <div key={b.code} className="card" style={{ borderColor: b.status==="cancelled"?"rgba(229,38,26,0.3)":"var(--border)", opacity: b.status==="cancelled"?0.6:1 }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                              <div>
                                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                                  <span className="nunito" style={{ fontWeight:800, fontSize:13, color:"var(--gold)", letterSpacing:"1px" }}>{b.code}</span>
                                  {b.status==="cancelled" && <span style={{ background:"rgba(229,38,26,0.2)", color:"var(--red2)", fontSize:10, padding:"2px 6px", borderRadius:4, fontWeight:700 }}>CANCELLED</span>}
                                </div>
                                <div style={{ fontSize:12, color:"var(--text)" }}>{b.name} · {b.routeFrom} → {b.routeTo} · Seat {b.seat}</div>
                                <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>
                                  {b.phone} · UGX {Number(b.price).toLocaleString()} · {b.agentName ? `Agent: ${b.agentName}` : "Direct"} · {new Date(b.time).toLocaleDateString("en-UG")}
                                </div>
                              </div>
                              {b.status !== "cancelled" && (
                                <button onClick={() => cancelBooking(b.code)} style={{ background:"rgba(229,38,26,0.08)", border:"1px solid rgba(229,38,26,0.25)", borderRadius:6, color:"var(--red2)", fontSize:11, padding:"6px 10px", cursor:"pointer", fontFamily:"'Nunito Sans',sans-serif", flexShrink:0 }}>Cancel</button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── TAB: REVENUE ── */}
                  {adminTab === "revenue" && (
                    <div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
                        {[["daily","Daily"],["weekly","Weekly"],["monthly","Monthly"],["quarterly","Quarterly"],["semi","6 Months"],["annual","Annual"]].map(([k,l]) => (
                          <button key={k} onClick={() => setRevenueWindow(k)} style={{
                            background: revenueWindow===k?"var(--red)":"rgba(255,255,255,0.05)",
                            border: revenueWindow===k?"none":"1px solid var(--border)",
                            color: revenueWindow===k?"#fff":"var(--muted)",
                            borderRadius:8, padding:"7px 14px", fontSize:12, cursor:"pointer", fontFamily:"'Nunito Sans',sans-serif"
                          }}>{l}</button>
                        ))}
                      </div>
                      <div style={{ background:"#fff", borderRadius:10, padding:"16px", marginBottom:16, border:"1px solid var(--border)" }}>
                        <div style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px" }}>Total Revenue ({revenueWindow})</div>
                        <div className="nunito" style={{ fontSize:32, fontWeight:800, color:"var(--green)", marginTop:4 }}>UGX {totalRev.toLocaleString()}</div>
                        <div style={{ fontSize:12, color:"var(--muted)", marginTop:4 }}>{filtered.length} bookings in this period</div>
                      </div>
                      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
                        <button className="btn btn-ghost" style={{ fontSize:12, padding:"8px 14px" }} onClick={() => downloadCSV(filtered, `Revenue_${revenueWindow}`)}>⬇ Export to CSV / Excel</button>
                      </div>
                      {/* By Route */}
                      <div className="nunito" style={{ fontWeight:700, fontSize:13, marginBottom:8, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px" }}>By Route</div>
                      <div style={{ display:"grid", gap:6, marginBottom:16 }}>
                        {Object.entries(byRoute).sort((a,b)=>b[1]-a[1]).map(([route, rev]) => (
                          <div key={route} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#fff", borderRadius:8, padding:"10px 14px", border:"1px solid var(--border)" }}>
                            <span style={{ fontSize:13 }}>{route}</span>
                            <span style={{ fontWeight:700, color:"var(--green)", fontFamily:"'Sora',sans-serif" }}>UGX {rev.toLocaleString()}</span>
                          </div>
                        ))}
                        {Object.keys(byRoute).length===0 && <div style={{ color:"var(--muted)", fontSize:13, padding:12 }}>No data for this period.</div>}
                      </div>
                      {/* By Vehicle */}
                      <div className="nunito" style={{ fontWeight:700, fontSize:13, marginBottom:8, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px" }}>By Vehicle</div>
                      <div style={{ display:"grid", gap:6, marginBottom:16 }}>
                        {Object.entries(byVehicle).sort((a,b)=>b[1]-a[1]).map(([plate, rev]) => (
                          <div key={plate} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#fff", borderRadius:8, padding:"10px 14px", border:"1px solid var(--border)" }}>
                            <span style={{ fontSize:13, fontFamily:"'Sora',sans-serif", fontWeight:600, color:"var(--gold)" }}>{plate}</span>
                            <span style={{ fontWeight:700, color:"var(--green)", fontFamily:"'Sora',sans-serif" }}>UGX {rev.toLocaleString()}</span>
                          </div>
                        ))}
                        {Object.keys(byVehicle).length===0 && <div style={{ color:"var(--muted)", fontSize:13, padding:12 }}>No data for this period.</div>}
                      </div>
                      {/* By Driver */}
                      <div className="nunito" style={{ fontWeight:700, fontSize:13, marginBottom:8, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px" }}>By Driver</div>
                      <div style={{ display:"grid", gap:6 }}>
                        {Object.entries(byDriver).sort((a,b)=>b[1]-a[1]).map(([driver, rev]) => (
                          <div key={driver} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#fff", borderRadius:8, padding:"10px 14px", border:"1px solid var(--border)" }}>
                            <span style={{ fontSize:13 }}>👨‍✈️ {driver}</span>
                            <span style={{ fontWeight:700, color:"var(--green)", fontFamily:"'Sora',sans-serif" }}>UGX {rev.toLocaleString()}</span>
                          </div>
                        ))}
                        {Object.keys(byDriver).length===0 && <div style={{ color:"var(--muted)", fontSize:13, padding:12 }}>No driver data yet.</div>}
                      </div>
                    </div>
                  )}

                  {/* ── TAB: AGENTS ── */}
                  {adminTab === "agents" && (
                    <div>
                      <div className="card" style={{ marginBottom:16 }}>
                        <div className="nunito" style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Add Call Centre Agent</div>
                        <div style={{ display:"grid", gap:8 }}>
                          <input className="input" placeholder="Agent full name" value={newAgent.name} onChange={e=>setNewAgent(a=>({...a,name:e.target.value}))}/>
                          <input className="input" placeholder="Phone number" value={newAgent.phone} onChange={e=>setNewAgent(a=>({...a,phone:e.target.value}))}/>
                          <input className="input" type="password" placeholder="Agent PIN (4–8 digits)" value={newAgent.pin} onChange={e=>setNewAgent(a=>({...a,pin:e.target.value.replace(/\D/g,"").slice(0,8)}))}/>
                          <button className="btn btn-red" onClick={addAgent}>Add Agent</button>
                        </div>
                      </div>
                      <div style={{ display:"grid", gap:8 }}>
                        {agents.length===0 && <div style={{ color:"var(--muted)", fontSize:13, textAlign:"center", padding:20 }}>No agents registered yet.</div>}
                        {agents.map(a => {
                          const agentBookings = allBookings.filter(b=>b.agentId===a.id && b.status!=="cancelled");
                          const agentRev = agentBookings.reduce((s,b)=>s+Number(b.price),0);
                          return (
                            <div key={a.id} className="card" style={{ borderColor: a.active?"rgba(74,158,255,0.3)":"var(--border)" }}>
                              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                                <div>
                                  <div className="nunito" style={{ fontWeight:700, fontSize:14 }}>👤 {a.name}</div>
                                  <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{a.phone} · PIN: {"•".repeat(a.pin.length)}</div>
                                  <div style={{ fontSize:11, color:"var(--green)", marginTop:4 }}>{agentBookings.length} bookings · UGX {agentRev.toLocaleString()}</div>
                                </div>
                                <div style={{ display:"flex", gap:6 }}>
                                  <button onClick={()=>toggleAgent(a.id)} style={{ background: a.active?"rgba(29,185,84,0.1)":"rgba(229,38,26,0.08)", border:`1px solid ${a.active?"rgba(29,185,84,0.3)":"rgba(229,38,26,0.3)"}`, borderRadius:6, color: a.active?"var(--green)":"var(--red2)", fontSize:11, padding:"6px 10px", cursor:"pointer", fontFamily:"'Nunito Sans',sans-serif" }}>
                                    {a.active?"Active":"Inactive"}
                                  </button>
                                  <button onClick={()=>removeAgent(a.id)} style={{ background:"transparent", border:"1px solid var(--border)", borderRadius:6, color:"var(--muted)", fontSize:11, padding:"6px 10px", cursor:"pointer", fontFamily:"'Nunito Sans',sans-serif" }}>Remove</button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── TAB: LIVE LOGS ── */}
                  {adminTab === "logs" && (
                    <div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                        <div style={{ fontSize:13, color:"var(--muted)" }}>Real-time agent activity log · {agentLogs.length} actions recorded</div>
                        <button className="btn btn-ghost" style={{ fontSize:12, padding:"8px 14px" }} onClick={() => {
                          const csv = [["Agent","Client","Phone","Route","Action","Booking Code","Time"],...agentLogs.map(l=>[l.agentName,l.clientName,l.phone,l.routeId,l.action,l.code||"",new Date(l.time).toLocaleString("en-UG")])].map(r=>r.map(c=>`"${c}"`).join(",")).join("\n");
                          const a = Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([csv],{type:"text/csv"})),download:`REX_AgentLogs_${new Date().toISOString().slice(0,10)}.csv`}); a.click();
                        }}>⬇ Export Logs</button>
                      </div>
                      <div style={{ display:"grid", gap:6, maxHeight:500, overflowY:"auto" }}>
                        {agentLogs.length===0 && <div style={{ color:"var(--muted)", fontSize:13, textAlign:"center", padding:20 }}>No agent activity recorded yet.</div>}
                        {[...agentLogs].reverse().map((l, i) => (
                          <div key={i} style={{ background:"#fff", borderRadius:8, padding:"10px 14px", border:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <div>
                              <span style={{ fontWeight:700, color:"#4A9EFF", fontSize:13 }}>👤 {l.agentName}</span>
                              <span style={{ color:"var(--muted)", fontSize:12 }}> → {l.action} for </span>
                              <span style={{ fontWeight:600, fontSize:13 }}>{l.clientName}</span>
                              {l.code && <span style={{ color:"var(--gold)", fontSize:11, marginLeft:8 }}>[{l.code}]</span>}
                              <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{l.phone} · Route: {l.routeId}</div>
                            </div>
                            <div style={{ fontSize:11, color:"var(--muted)", textAlign:"right", flexShrink:0 }}>{new Date(l.time).toLocaleString("en-UG",{hour:"2-digit",minute:"2-digit",day:"numeric",month:"short"})}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── TAB: FEEDBACK ── */}
                  {adminTab === "feedback" && (
                    <div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                        <div style={{ fontSize:13, color:"var(--muted)" }}>{feedback.length} customer reviews</div>
                        <div style={{ fontSize:14, color:"var(--gold)" }}>
                          {feedback.length > 0 ? `⭐ Avg: ${(feedback.reduce((s,f)=>s+f.rating,0)/feedback.length).toFixed(1)} / 5` : "No reviews yet"}
                        </div>
                      </div>
                      <div style={{ display:"grid", gap:8, maxHeight:500, overflowY:"auto" }}>
                        {feedback.length===0 && <div style={{ color:"var(--muted)", fontSize:13, textAlign:"center", padding:20 }}>No customer feedback yet.</div>}
                        {[...feedback].reverse().map(f => (
                          <div key={f.id} className="card">
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                              <div>
                                <span style={{ fontWeight:700, fontSize:13 }}>{f.name || "Anonymous"}</span>
                                <span style={{ marginLeft:10, color:"var(--gold)", fontSize:13 }}>{"⭐".repeat(f.rating)}</span>
                                {f.route && <span style={{ marginLeft:8, fontSize:11, color:"var(--muted)" }}>· {f.route}</span>}
                              </div>
                              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                <span style={{ fontSize:11, color:"var(--muted)" }}>{new Date(f.time).toLocaleDateString("en-UG")}</span>
                                <button onClick={()=>deleteFeedback(f.id)} style={{ background:"transparent", border:"none", color:"var(--red2)", fontSize:13, cursor:"pointer" }}>✕</button>
                              </div>
                            </div>
                            <div style={{ fontSize:13, color:"var(--text)", lineHeight:1.5 }}>{f.comment}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })()}
          </div>
        )}

        {/* ── CUSTOMER FEEDBACK PAGE ── */}
        {step === "feedback" && (
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <button className="btn btn-ghost" style={{ marginBottom:20, fontSize:13, padding:"8px 16px" }} onClick={() => setStep("home")}>← Back</button>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:48, marginBottom:10 }}>⭐</div>
              <h2 className="nunito" style={{ fontSize:26, fontWeight:800 }}>Share Your Experience</h2>
              <p style={{ color:"var(--muted)", fontSize:13, marginTop:6 }}>Your feedback helps us improve every journey.</p>
            </div>
            {feedbackSent ? (
              <div className="card" style={{ textAlign:"center", borderColor:"rgba(29,185,84,0.3)", background:"#030F08" }}>
                <div style={{ fontSize:52, marginBottom:12 }}>🙏</div>
                <div className="nunito" style={{ fontWeight:800, fontSize:22, color:"var(--green)" }}>Thank you!</div>
                <div style={{ color:"var(--muted)", fontSize:13, marginTop:8 }}>Your feedback has been recorded. We appreciate it!</div>
              </div>
            ) : (
              <div className="card">
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, color:"var(--muted)", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:6 }}>Your Name (optional)</label>
                  <input className="input" placeholder="Enter your name" value={feedbackForm.name} onChange={e=>setFeedbackForm(f=>({...f,name:e.target.value}))}/>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, color:"var(--muted)", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:6 }}>Route Travelled</label>
                  <select className="input" value={feedbackForm.route} onChange={e=>setFeedbackForm(f=>({...f,route:e.target.value}))}>
                    <option value="">Select a route (optional)</option>
                    {ROUTES.map(r=><option key={r.id} value={`${r.from} → ${r.to}`}>{r.from} → {r.to}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, color:"var(--muted)", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:8 }}>Rating</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={()=>setFeedbackForm(f=>({...f,rating:n}))} style={{
                        fontSize:28, background:"transparent", border:"none", cursor:"pointer",
                        opacity: feedbackForm.rating >= n ? 1 : 0.3, transition:"opacity .15s"
                      }}>⭐</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom:18 }}>
                  <label style={{ fontSize:11, color:"var(--muted)", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:6 }}>Your Comment</label>
                  <textarea className="input" rows={4} placeholder="Tell us about your experience — comfort, punctuality, driver, anything!" value={feedbackForm.comment}
                    onChange={e=>setFeedbackForm(f=>({...f,comment:e.target.value}))} style={{ resize:"vertical", minHeight:90 }}/>
                </div>
                <button className="btn btn-red" style={{ width:"100%", padding:14 }} onClick={submitFeedback} disabled={!feedbackForm.comment.trim()}>
                  Submit Feedback →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step indicators */}
        {["select-route", "select-seat", "form", "payment"].includes(step) && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
            {["select-route", "select-seat", "form", "payment"].map((s, i) => (
              <div key={s} className={`step-dot ${step === s ? "active" : ["select-route","select-seat","form","payment"].indexOf(step) > i ? "done" : ""}`} />
            ))}
          </div>
        )}
      </div>

        <div style={{ borderTop: "1px solid var(--border)", padding: "20px 16px", background: "#060F20" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => { setStep("admin"); setAdminStep("locked"); }}
            style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(229,38,26,0.08)", border:"1px solid rgba(229,38,26,0.3)", borderRadius:10, color:"#FF6B5B", fontSize:13, padding:"12px 22px", cursor:"pointer", fontFamily:"'Nunito Sans',sans-serif", fontWeight:700 }}
          >
            🔒 Admin / Staff Login
          </button>
          <button
            onClick={() => setStep("feedback")}
            style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(245,166,35,0.08)", border:"1px solid rgba(245,166,35,0.3)", borderRadius:10, color:"var(--gold)", fontSize:13, padding:"12px 22px", cursor:"pointer", fontFamily:"'Nunito Sans',sans-serif", fontWeight:700 }}
          >
            ⭐ Leave Feedback
          </button>
        </div>
      </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid var(--border)", padding: "36px 16px", textAlign: "center", background: "var(--navy)", color: "#fff", marginLeft: -16, marginRight: -16 }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          {/* Footer logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <img src={LOGO_R} alt="Rocketline R" style={{ height: 56, width: "auto", objectFit: "contain", opacity: 0.85 }} />
              <div style={{ textAlign: "left" }}>
                <img src={LOGO_MAIN} alt="Rocketline Express" style={{ height: 52, width: "auto", objectFit: "contain" }} />
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "5px", marginTop: 3, fontFamily: "'Nunito Sans',sans-serif", textTransform: "uppercase" }}>ISHENDAAA · Premier Travel, Linking Cities</div>
              </div>
            </div>
          </div>

          {/* Customer care */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <a href="tel:+256701196725" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 13, textDecoration: "none", fontFamily: "'Nunito Sans',sans-serif" }}>
              📞 +256 701 196 725
            </a>
            <a href="https://wa.me/256701196725" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#25D366", fontSize: 13, textDecoration: "none", fontFamily: "'Nunito Sans',sans-serif" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Customer Care
            </a>
          </div>

          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
            Payments secured by MTN MoMo & Airtel Money · <WaterBottle size={12} style={{ display: "inline-block", verticalAlign: "middle" }} /> Free water on every trip
          </div>
          <div style={{ fontSize: 11, color: "#2a3a50" }}>
            To go live: Register at momodeveloper.mtn.com & developers.airtel.africa, then update credentials in CONFIG at the top of this file.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

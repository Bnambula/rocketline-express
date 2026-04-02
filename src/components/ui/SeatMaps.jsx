import React from 'react'

/* ─────────────────────────────────────────────
   SEAT COLORS
───────────────────────────────────────────── */
export const SEAT_COLORS = {
  available: { bg:'#5b8dd9', border:'#3a6fc4', text:'#ffffff' },
  booked:    { bg:'#d1d5db', border:'#9ca3af', text:'#6b7280' },
  selected:  { bg:'#FFC72C', border:'#e6a800', text:'#0B3D91' },
  locked:    { bg:'#fca5a5', border:'#ef4444', text:'#991b1b' },
}

/* ─────────────────────────────────────────────
   SINGLE SEAT CELL
───────────────────────────────────────────── */
export function Seat({ n, state = 'available', onClick, size = 32 }) {
  const c = SEAT_COLORS[state] || SEAT_COLORS.available
  const isDisabled = state === 'booked' || state === 'locked'
  return (
    <div
      onClick={() => !isDisabled && onClick && onClick(n)}
      title={`Seat ${n}${state !== 'available' ? ' – ' + state : ''}`}
      style={{
        width: size, height: size + 4,
        borderRadius: 6,
        background: c.bg,
        border: `2px solid ${c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-head)', fontWeight: 700,
        fontSize: size < 30 ? 9 : 11,
        color: c.text,
        flexShrink: 0,
        transition: 'transform 0.12s, box-shadow 0.12s',
        boxShadow: state === 'selected' ? '0 0 10px rgba(255,199,44,0.6)' : 'none',
        userSelect: 'none',
        position: 'relative',
      }}
      onMouseEnter={e => { if (!isDisabled) { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.zIndex = 2 } }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.zIndex = 1 }}
    >
      {n}
    </div>
  )
}

/* blank spacer */
export function Blank({ size = 32 }) {
  return <div style={{ width: size, height: size + 4, flexShrink: 0 }} />
}

/* aisle gap */
export function Aisle({ width = 18 }) {
  return <div style={{ width, flexShrink: 0 }} />
}

/* ─────────────────────────────────────────────
   DRIVER / GUIDE BOX
───────────────────────────────────────────── */
function CabBox({ label, size = 32 }) {
  return (
    <div style={{
      width: size + 8, minHeight: size * 2 + 12,
      borderRadius: 8, background: '#374151',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#d1d5db', fontSize: 9, fontFamily: 'var(--font-head)',
      fontWeight: 700, letterSpacing: 1, writingMode: 'vertical-rl',
      transform: 'rotate(180deg)', flexShrink: 0,
    }}>{label}</div>
  )
}

function SeatBox({ label, n, size = 32 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
      <div style={{ width: size + 8, background: '#374151', borderRadius: 6, padding: '3px 4px', textAlign: 'center', color: '#d1d5db', fontSize: 9, fontFamily: 'var(--font-head)', fontWeight: 700 }}>{label}</div>
      <div style={{ width: size + 8, height: size + 4, background: '#4b5563', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 11, fontFamily: 'var(--font-head)', fontWeight: 700 }}>{n}</div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   ROW BUILDER HELPER
───────────────────────────────────────────── */
function Row({ seats, booked, selected, onToggle, size, gap = 4 }) {
  return (
    <div style={{ display: 'flex', gap, alignItems: 'center' }}>
      {seats.map((cell, i) => {
        if (cell === null) return <Aisle key={`a${i}`} width={18} />
        if (cell === 0)   return <Blank key={`b${i}`} size={size} />
        const st = booked.includes(cell) ? 'booked' : selected.includes(cell) ? 'selected' : 'available'
        return <Seat key={cell} n={cell} state={st} onClick={onToggle} size={size} />
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════
   55-SEATER COACH  (matches bottom diagram)
   Layout: upper deck 3-across, lower 3-across
   Upper: rows of [1,2,3] + [4,5,6] style
   Actual: mirroring the wireframe image exactly
═══════════════════════════════════════════ */
export function Coach55({ booked = [], selected = [], onToggle }) {
  const sz = 30, g = 3

  // Upper section: seats 1–19 area (3 rows of varying)
  // From image: top deck has col groups [1][1,2,3][3,4,5][5,6,7][7,8][8,9][10]  (approx)
  // Matching wireframe: horizontal bus, seats go row by row across
  // Row structure per the image (read top-to-bottom, left-to-right in bus view):
  // Col 1   | 1  | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  |
  // Col 2   | 1  | 3  | 8  | 9  |10  |    |    |    |    |
  // Col 3(v)| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 |
  // Aisle
  // Col 4   | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 |
  // Col 5   | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 99 |
  // Col 6   | 31 | 32 | 33 | 34 | 38 | 36 | 37 | 38 | 62 |

  // Simplified clean 55-seater matching the wireframe pattern:
  // Top half: 3 rows × 10 cols  = 30 seats (front cabin)
  // Bottom half: 3 rows × 9 cols = 25 seats (rear cabin)

  const topSection = [
    [1,  2,  3,  4,  5,  6,  7,  8,  9,  null, 10],
    [11, 12, 13, 14, 15, 16, 17, 18, 19, null, 20],
    [0,   0,  0,  0,  0,  0,  0,  0,  0,  null,  0], // visual gap row
  ]
  const bottomSection = [
    [21, 22, 23, 24, 25, 26, 27, 28, 29],
    [30, 31, 32, 33, 34, 35, 36, 37, 38],
    [39, 40, 41, 42, 43, 44, 45, 46, 47],
    // last partial row
    [48, 49, 50, 51, 52, 53, 54, 55, 0],
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Bus body */}
      <div style={{ background: '#f9fafb', border: '3px solid #d1d5db', borderRadius: 16, padding: 12, position: 'relative', overflow: 'hidden' }}>
        {/* Bus outline decoration */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: '#e5e7eb', borderRight: '2px dashed #d1d5db', borderRadius: '14px 0 0 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 11, color: '#374151', letterSpacing: 2 }}>DRIVER</div>
          <div style={{ width: 44, height: 44, background: '#9ca3af', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#6b7280', border: '3px solid #4b5563' }} />
          </div>
        </div>

        <div style={{ marginLeft: 88 }}>
          {/* Upper rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: g }}>
            <Row seats={[1, 2, 3, 4, 5, null, 6, 7, 8, 9, 10]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
            <Row seats={[11, 12, 13, 14, 15, null, 16, 17, 18, 19, 20]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
          </div>

          {/* Visual separator + guide seat */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
            <SeatBox label="GUIDE" n="G" size={sz} />
            <div style={{ flex: 1, height: 2, background: '#e5e7eb', borderRadius: 1 }} />
          </div>

          {/* Lower rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: g }}>
            <Row seats={[21, 22, 23, 24, 25, null, 26, 27, 28, 29, 30]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
            <Row seats={[31, 32, 33, 34, 35, null, 36, 37, 38, 39, 40]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
            <Row seats={[41, 42, 43, 44, 45, null, 46, 47, 48, 49, 50]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
            <Row seats={[51, 52, 53, 54, 55, null, 0, 0, 0, 0, 0]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   65-SEATER COACH (matches middle diagram)
   3 rows upper + guide row + 3 rows lower
═══════════════════════════════════════════ */
export function Coach65({ booked = [], selected = [], onToggle }) {
  const sz = 28, g = 3

  return (
    <div style={{ background: '#f9fafb', border: '3px solid #d1d5db', borderRadius: 16, padding: 12, position: 'relative' }}>
      {/* Driver + Guide cab */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <CabBox label="DRIVER" size={sz} />
          <CabBox label="GUIDE" size={sz} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: g }}>
          {/* Upper 3 rows */}
          <Row seats={[1, 2, 3, 4, 5, null, 6, 7, 8, 9, 10, null, 11]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
          <Row seats={[12, 13, 14, 15, 16, null, 17, 18, 19, 20, 21, null, 22]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
          <Row seats={[23, 24, 25, 26, 27, null, 28, 29, 30, 31, 32, null, 33]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
          {/* Separator */}
          <div style={{ height: 6 }} />
          {/* Lower 3 rows */}
          <Row seats={[34, 35, 36, 37, 38, null, 39, 40, 41, 42, 43, null, 44]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
          <Row seats={[45, 46, 47, 48, 49, null, 50, 51, 52, 53, 54, null, 55]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
          <Row seats={[56, 57, 58, 59, 60, null, 61, 62, 63, 64, 65, null, 0]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   67-SEATER COACH (matches top diagram)
   Similar to 65 but slightly wider
═══════════════════════════════════════════ */
export function Coach67({ booked = [], selected = [], onToggle }) {
  const sz = 27, g = 3

  return (
    <div style={{ background: '#f9fafb', border: '3px solid #d1d5db', borderRadius: 16, padding: 12, position: 'relative' }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <CabBox label="DRIVER" size={sz} />
          <div style={{ height: 4 }} />
          <SeatBox label="GUIDE" n="1" size={sz} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: g }}>
          <Row seats={[1, 2, 3, null, 4, 5, 6, null, 7, 8, 9]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
          <Row seats={[10, 11, 12, null, 13, 14, 15, null, 16, 17, 18]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
          <Row seats={[19, 20, 21, null, 22, 23, 24, null, 25, 26, 27]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
          <div style={{ height: 6 }} />
          <Row seats={[28, 29, 30, null, 31, 32, 33, null, 34, 35, 36]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
          <Row seats={[37, 38, 39, null, 40, 41, 42, null, 43, 44, 45]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
          <Row seats={[46, 47, 48, null, 49, 50, 51, null, 52, 53, 54]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
          <Row seats={[55, 56, 57, null, 58, 59, 60, null, 61, 62, 63]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
          <Row seats={[64, 65, 66, null, 67, 0, 0, null, 0, 0, 0]} booked={booked} selected={selected} onToggle={onToggle} size={sz} gap={g} />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   14-SEATER TAXI / MATATU
   2+1 layout, 5 rows + driver
═══════════════════════════════════════════ */
export function TaxiMatatu({ booked = [], selected = [], onToggle }) {
  const sz = 34, g = 4

  return (
    <div style={{ background: '#f9fafb', border: '3px solid #d1d5db', borderRadius: 14, padding: 14, maxWidth: 260 }}>
      {/* Driver row */}
      <div style={{ display: 'flex', gap: g, marginBottom: 10, alignItems: 'center' }}>
        <CabBox label="DRV" size={sz} />
        <Seat n={1} state={booked.includes(1) ? 'booked' : selected.includes(1) ? 'selected' : 'available'} onClick={onToggle} size={sz} />
        <Seat n={2} state={booked.includes(2) ? 'booked' : selected.includes(2) ? 'selected' : 'available'} onClick={onToggle} size={sz} />
      </div>
      <div style={{ height: 1, background: '#e5e7eb', marginBottom: 10 }} />
      {/* Passenger rows: 2+1 */}
      {[[3,4,5],[6,7,8],[9,10,11],[12,13,14]].map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: g, marginBottom: i < 3 ? g : 0 }}>
          <Seat n={row[0]} state={booked.includes(row[0]) ? 'booked' : selected.includes(row[0]) ? 'selected' : 'available'} onClick={onToggle} size={sz} />
          <Seat n={row[1]} state={booked.includes(row[1]) ? 'booked' : selected.includes(row[1]) ? 'selected' : 'available'} onClick={onToggle} size={sz} />
          <Aisle width={14} />
          <Seat n={row[2]} state={booked.includes(row[2]) ? 'booked' : selected.includes(row[2]) ? 'selected' : 'available'} onClick={onToggle} size={sz} />
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════
   LEGEND COMPONENT
═══════════════════════════════════════════ */
export function SeatLegend() {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
      {[
        ['available', 'Available'],
        ['booked',    'Booked'],
        ['selected',  'Selected'],
        ['locked',    'Locked'],
      ].map(([state, label]) => {
        const c = SEAT_COLORS[state]
        return (
          <div key={state} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 22, borderRadius: 5, background: c.bg, border: `2px solid ${c.border}` }} />
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 12, color: 'var(--gray-text)' }}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Coach55, Coach65, Coach67, TaxiMatatu, SeatLegend } from '../ui/SeatMaps'

const BOOKED_55 = [3, 7, 8, 11, 14, 20, 21, 22, 31, 35]
const BOOKED_65 = [1, 5, 12, 20, 34, 40, 50]
const BOOKED_67 = [2, 9, 17, 28, 39]
const BOOKED_TAXI = [1, 3, 6]

const VEHICLE_TYPES = [
  { id: 'bus55',  label: '55-Seater', icon: '🚌', seats: 55, price: 25000, Component: Coach55, booked: BOOKED_55 },
  { id: 'bus65',  label: '65-Seater', icon: '🚌', seats: 65, price: 24000, Component: Coach65, booked: BOOKED_65 },
  { id: 'bus67',  label: '67-Seater', icon: '🚌', seats: 67, price: 26000, Component: Coach67, booked: BOOKED_67 },
  { id: 'taxi',   label: 'Taxi/Matatu',  icon: '🚐', seats: 14, price: 18000, Component: TaxiMatatu, booked: BOOKED_TAXI },
]

export default function SeatSelectionSection() {
  const [vehicleType, setVehicleType] = useState('bus55')
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  const vehicle = VEHICLE_TYPES.find(v => v.id === vehicleType)
  useEffect(() => setSelected([]), [vehicleType])

  const toggleSeat = (n) => {
    if (vehicle.booked.includes(n)) return
    setSelected(prev =>
      prev.includes(n) ? prev.filter(s => s !== n) : prev.length < 6 ? [...prev, n] : prev
    )
  }

  const total = vehicle.price * Math.max(selected.length, 1)
  const { Component } = vehicle

  return (
    <section style={{ background: 'var(--white)', padding: '80px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-label">Real-Time Seats</div>
          <h2 className="section-title">Pick Your <span>Perfect Seat</span></h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>Live seat availability. No double booking, ever.</p>
        </div>

        {/* Vehicle Type Selector */}
        <div style={{ background: 'var(--gray-light)', borderRadius: 20, padding: 20, marginBottom: 32 }}>
          <p style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 12, color: 'var(--gray-text)', marginBottom: 12, textAlign: 'center', letterSpacing: 1.5, textTransform: 'uppercase' }}>Select Vehicle Type</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {VEHICLE_TYPES.map(v => (
              <button key={v.id} onClick={() => setVehicleType(v.id)} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 20,
                border: '2px solid', borderColor: vehicleType === v.id ? 'var(--blue)' : 'var(--gray-mid)',
                background: vehicleType === v.id ? 'var(--blue)' : 'var(--white)',
                color: vehicleType === v.id ? 'var(--white)' : 'var(--dark)',
                fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: vehicleType === v.id ? '0 4px 14px rgba(11,61,145,0.25)' : 'none',
              }}>
                <span style={{ fontSize: 16 }}>{v.icon}</span>{v.label}
                {vehicleType === v.id && <span style={{ background: 'var(--gold)', color: 'var(--blue)', borderRadius: 10, padding: '1px 8px', fontSize: 10, fontWeight: 900 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Info Panel */}
          <div>
            <div style={{ background: 'var(--blue)', borderRadius: 18, padding: 20, color: 'var(--white)', marginBottom: 14 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{vehicle.icon}</div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 17, marginBottom: 4 }}>{vehicle.label} Coach</div>
              <div style={{ opacity: 0.75, fontSize: 13 }}>Global Coaches · UBF 234K</div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ opacity: 0.75, fontSize: 13 }}>Per seat</span>
                  <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, color: 'var(--gold)' }}>UGX {vehicle.price.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.75, fontSize: 13 }}>Available</span>
                  <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800 }}>{vehicle.seats - vehicle.booked.length}/{vehicle.seats}</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--gray-light)', borderRadius: 14, padding: 14, marginBottom: 14 }}>
              <SeatLegend />
            </div>

            {selected.length > 0 ? (
              <div style={{ background: 'var(--white)', borderRadius: 16, padding: 20, boxShadow: 'var(--shadow-md)', border: '2px solid var(--gold)' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 11, color: 'var(--gray-text)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Selected Seats</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                  {selected.sort((a, b) => a - b).map(s => (
                    <span key={s} style={{ background: 'var(--gold)', color: 'var(--blue)', padding: '4px 10px', borderRadius: 8, fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 13 }}>{s}</span>
                  ))}
                </div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 22, color: 'var(--blue)', marginBottom: 14 }}>UGX {total.toLocaleString()}</div>
                {selected.length >= 6 && (
                  <div style={{ background: '#fff3cd', borderRadius: 10, padding: '9px 12px', marginBottom: 12, fontSize: 12, fontFamily: 'var(--font-head)', fontWeight: 700, color: '#92400e' }}>💡 7+ seats? Consider a full charter!</div>
                )}
                <button onClick={() => navigate(`/book?seats=${selected.join(',')}&vehicle=${vehicleType}`)}
                  style={{ width: '100%', padding: '13px', borderRadius: 14, background: 'var(--gold)', color: 'var(--blue)', border: 'none', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
                  Continue to Payment →
                </button>
              </div>
            ) : (
              <div style={{ background: 'var(--gray-light)', borderRadius: 16, padding: 20, textAlign: 'center', color: 'var(--gray-text)' }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>👆</div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14 }}>Tap a seat to select</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Up to 6 seats at once</div>
              </div>
            )}
          </div>

          {/* Bus Diagram */}
          <div>
            <div style={{ background: 'var(--gray-light)', borderRadius: 20, padding: 16, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <div style={{ minWidth: vehicleType === 'taxi' ? 220 : 480 }}>
                <Component booked={vehicle.booked} selected={selected} onToggle={toggleSeat} />
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[['Total', vehicle.seats, '#1d4ed8'],['Booked', vehicle.booked.length, '#dc2626'],['Available', vehicle.seats - vehicle.booked.length, '#15803d'],['Selected', selected.length, '#92400e']].map(([l, v, c]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                  <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 12, color: 'var(--gray-text)' }}>{l}: <strong style={{ color: c }}>{v}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.seat-main{grid-template-columns:1fr!important;}}`}</style>
    </section>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { reservationApi } from '../api.js'

const STATUS_CONFIG = {
  BOOKED:      { color: '#2563eb', bg: '#eff6ff', label: 'Confirmed' },
  CHECKED_IN:  { color: '#16a34a', bg: '#f0fdf4', label: 'Checked In' },
  CHECKED_OUT: { color: '#7c3aed', bg: '#f5f3ff', label: 'Completed' },
  CANCELLED:   { color: '#dc2626', bg: '#fef2f2', label: 'Cancelled' },
}

export default function Reservations() {
  const guestId = localStorage.getItem('userId') || ''
  const [reservations, setReservations] = useState([])
  const [loaded, setLoaded]             = useState(false)
  const [error, setError]               = useState('')
  const [acting, setActing]             = useState(null)

  const load = () => {
    setError('')
    reservationApi.get('/api/reservations/my', { headers: { 'X-Guest-Id': guestId } })
      .then(res => { setReservations(Array.isArray(res.data) ? res.data : []); setLoaded(true) })
      .catch(err => {
        setError('Could not load reservations. Is the Reservation Service running on port 8082?')
        setLoaded(true)
      })
  }

  useEffect(() => { load() }, [])

  const action = async (fn) => {
    setActing(true)
    try { await fn(); load() } catch { load() } finally { setActing(null) }
  }

  const cancel   = (id) => action(() => reservationApi.put(`/api/reservations/cancel/${id}`, {}, { headers: { 'X-Guest-Id': guestId } }))
  const checkin  = (id) => action(() => reservationApi.put(`/api/reservations/checkin/${id}`))
  const checkout = (id) => action(() => reservationApi.put(`/api/reservations/checkout/${id}`))

  const nights = (checkIn, checkOut) =>
    Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000))

  return (
    <div style={{ background: '#F8F5F0', minHeight: 'calc(100vh - 70px)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #112240 100%)',
        padding: '48px 40px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        <div style={{ color: '#C9A84C', fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>
          ✦ &nbsp; Your Journey
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          color: '#fff', fontSize: '36px', fontWeight: '700', marginBottom: '0'
        }}>My Reservations</h2>
      </div>

      <div style={{ padding: '40px' }}>
        {error && (
          <div style={{
            padding: '14px 20px', borderRadius: '10px',
            background: '#fff0f0', border: '1px solid #ffcccc',
            borderLeft: '4px solid #e74c3c',
            color: '#c0392b', fontSize: '14px', marginBottom: '24px'
          }}>{error}</div>
        )}

        {loaded && reservations.length === 0 && !error && (
          <div style={{
            textAlign: 'center', padding: '80px 40px',
            background: '#fff', borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏨</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#0A1628', marginBottom: '8px' }}>No Reservations Yet</h3>
            <p style={{ color: '#7a8599', marginBottom: '24px' }}>Your luxury experience awaits — browse our rooms and make your first booking.</p>
            <Link to="/rooms" style={{
              display: 'inline-block', padding: '12px 28px',
              background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
              borderRadius: '8px', color: '#0A1628',
              textDecoration: 'none', fontWeight: '700',
              fontSize: '14px', letterSpacing: '0.5px',
              boxShadow: '0 4px 15px rgba(201,168,76,0.3)'
            }}>Browse Rooms</Link>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reservations.map(r => {
            const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.BOOKED
            const n   = nights(r.checkIn, r.checkOut)
            return (
              <div key={r.id} style={{
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s'
              }}>
                {/* Top colored bar */}
                <div style={{
                  height: '4px',
                  background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)`
                }} />

                <div style={{ padding: '24px 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    {/* Left info */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <h4 style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: '20px', color: '#0A1628', margin: 0
                        }}>Reservation #{r.id}</h4>
                        <span style={{
                          background: cfg.bg,
                          color: cfg.color,
                          border: `1px solid ${cfg.color}33`,
                          borderRadius: '20px',
                          padding: '3px 12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>{cfg.label}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
                        <InfoItem icon="🏠" label="Room" value={`Room ${r.roomId}`} />
                        <InfoItem icon="📅" label="Check-in" value={formatDate(r.checkIn)} />
                        <InfoItem icon="📅" label="Check-out" value={formatDate(r.checkOut)} />
                        <InfoItem icon="🌙" label="Duration" value={`${n} ${n === 1 ? 'Night' : 'Nights'}`} />
                      </div>
                    </div>

                    {/* Right actions */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {r.status === 'BOOKED' && (
                        <>
                          <ActionBtn
                            onClick={() => checkin(r.id)}
                            disabled={!!acting}
                            color="#16a34a" bg="#f0fdf4"
                          >Check In</ActionBtn>
                          <ActionBtn
                            onClick={() => cancel(r.id)}
                            disabled={!!acting}
                            color="#dc2626" bg="#fef2f2"
                          >Cancel</ActionBtn>
                        </>
                      )}
                      {r.status === 'CHECKED_IN' && (
                        <ActionBtn
                          onClick={() => checkout(r.id)}
                          disabled={!!acting}
                          color="#7c3aed" bg="#f5f3ff"
                        >Check Out</ActionBtn>
                      )}
                      <Link to={`/invoice/${r.id}`} style={{
                        padding: '9px 18px',
                        background: '#f8f5f0',
                        border: '1px solid #e0dbd0',
                        borderRadius: '8px',
                        color: '#5a6478',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>View Invoice</Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div>
      <div style={{ color: '#a0aab8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>
        {icon} {label}
      </div>
      <div style={{ color: '#0A1628', fontSize: '14px', fontWeight: '600' }}>{value}</div>
    </div>
  )
}

function ActionBtn({ onClick, disabled, color, bg, children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '9px 18px',
      background: bg,
      border: `1px solid ${color}33`,
      borderRadius: '8px',
      color: color,
      fontSize: '13px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.2s'
    }}>{children}</button>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch { return dateStr }
}

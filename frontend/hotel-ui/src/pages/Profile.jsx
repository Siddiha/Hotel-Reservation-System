import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '@asgardeo/auth-react'
import { reservationApi } from '../api.js'

const STATUS_CONFIG = {
  BOOKED:      { color: '#2563eb', bg: '#eff6ff', label: 'Confirmed' },
  CHECKED_IN:  { color: '#16a34a', bg: '#f0fdf4', label: 'Checked In' },
  CHECKED_OUT: { color: '#7c3aed', bg: '#f5f3ff', label: 'Completed' },
  CANCELLED:   { color: '#dc2626', bg: '#fef2f2', label: 'Cancelled' },
}

const MEMBER_COLORS = {
  Platinum: { bg: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', accent: '#E8E8F0', badge: '#b0b8d0' },
  Gold:     { bg: 'linear-gradient(135deg, #4a2800, #0A1628)', accent: '#C9A84C', badge: '#E8C96A' },
  Silver:   { bg: 'linear-gradient(135deg, #1a3a5c, #0A1628)', accent: '#a0b8d0', badge: '#c0d8f0' },
  Bronze:   { bg: 'linear-gradient(135deg, #2d1b00, #0A1628)', accent: '#cd7f32', badge: '#e8a060' },
}

export default function Profile() {
  const { state } = useAuthContext()
  const username  = state.username || state.displayName || 'Guest'
  const role      = state.roles?.[0] || 'Guest'
  const userId    = localStorage.getItem('userId') || ''
  const initials  = username.slice(0, 2).toUpperCase()

  const [reservations, setReservations] = useState([])
  const [loaded, setLoaded]             = useState(false)

  useEffect(() => {
    reservationApi.get('/api/reservations/my', { headers: { 'X-Guest-Id': userId } })
      .then(res => { setReservations(Array.isArray(res.data) ? res.data : []); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [userId])

  const nights = r => Math.max(0, Math.round((new Date(r.checkOut) - new Date(r.checkIn)) / 86400000))

  const total       = reservations.length
  const completed   = reservations.filter(r => r.status === 'CHECKED_OUT').length
  const active      = reservations.filter(r => r.status === 'BOOKED' || r.status === 'CHECKED_IN').length
  const totalNights = reservations.reduce((sum, r) => sum + nights(r), 0)

  const memberLevel = total >= 10 ? 'Platinum' : total >= 5 ? 'Gold' : total >= 2 ? 'Silver' : 'Bronze'
  const mc = MEMBER_COLORS[memberLevel]

  const recent = [...reservations].reverse().slice(0, 3)

  return (
    <div style={{ background: '#F8F5F0', minHeight: 'calc(100vh - 70px)' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #112240 100%)',
        padding: '60px 60px 0',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '36px', position: 'relative' }}>
          <div style={{
            width: '100px', height: '100px', flexShrink: 0,
            background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px', fontWeight: '700', color: '#0A1628',
            fontFamily: "'Playfair Display', serif",
            boxShadow: '0 0 0 4px rgba(201,168,76,0.2)',
            marginBottom: '24px'
          }}>{initials}</div>

          <div style={{ paddingBottom: '28px' }}>
            <div style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
              ✦ &nbsp; Member Profile
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              color: '#fff', fontSize: '36px', fontWeight: '700', marginBottom: '10px'
            }}>{username}</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{
                background: 'rgba(201,168,76,0.15)',
                border: '1px solid rgba(201,168,76,0.4)',
                borderRadius: '20px', padding: '4px 14px',
                color: '#C9A84C', fontSize: '12px', fontWeight: '600'
              }}>{role}</span>
              <span style={{
                background: mc.bg,
                border: `1px solid ${mc.accent}44`,
                borderRadius: '20px', padding: '4px 14px',
                color: mc.badge, fontSize: '12px', fontWeight: '600'
              }}>{memberLevel} Member</span>
            </div>
          </div>
        </div>

        <div style={{ height: '4px', background: 'linear-gradient(90deg, #C9A84C, #E8C96A, transparent)', marginTop: '8px' }} />
      </div>

      <div style={{ padding: '40px 60px', maxWidth: '1100px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {[
            { label: 'Total Bookings', value: total,       icon: '🏨', color: '#2563eb' },
            { label: 'Nights Stayed',  value: totalNights, icon: '🌙', color: '#7c3aed' },
            { label: 'Active',         value: active,      icon: '✅', color: '#16a34a' },
            { label: 'Completed',      value: completed,   icon: '⭐', color: '#C9A84C' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#fff', borderRadius: '16px', padding: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              border: '1px solid #ede8df',
            }}>
              <span style={{ fontSize: '28px' }}>{s.icon}</span>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '34px', fontWeight: '700', color: '#0A1628', lineHeight: 1, margin: '8px 0 4px'
              }}>{loaded ? s.value : '—'}</div>
              <div style={{ color: '#7a8599', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', alignItems: 'start' }}>

          {/* Recent reservations */}
          <div style={{
            background: '#fff', borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            border: '1px solid #ede8df', overflow: 'hidden'
          }}>
            <div style={{
              padding: '24px 28px', borderBottom: '1px solid #f0ebe0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ color: '#C9A84C', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>History</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#0A1628', fontSize: '20px', margin: 0 }}>Recent Reservations</h3>
              </div>
              <Link to="/reservations" style={{
                padding: '8px 16px',
                background: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '8px',
                color: '#C9A84C', textDecoration: 'none',
                fontSize: '13px', fontWeight: '600'
              }}>View All</Link>
            </div>

            {!loaded && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#7a8599', fontSize: '14px' }}>Loading...</div>
            )}

            {loaded && recent.length === 0 && (
              <div style={{ padding: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏨</div>
                <p style={{ color: '#7a8599', margin: '0 0 16px' }}>No reservations yet.</p>
                <Link to="/rooms" style={{
                  display: 'inline-block', padding: '10px 24px',
                  background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
                  borderRadius: '8px', color: '#0A1628',
                  textDecoration: 'none', fontWeight: '700', fontSize: '13px'
                }}>Book Your First Stay</Link>
              </div>
            )}

            {recent.map((r, idx) => {
              const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.BOOKED
              const n   = nights(r)
              return (
                <div key={r.id} style={{
                  padding: '20px 28px',
                  borderBottom: idx < recent.length - 1 ? '1px solid #f5f0e8' : 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px'
                }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{
                      width: '44px', height: '44px', flexShrink: 0,
                      background: 'linear-gradient(135deg, #0A1628, #112240)',
                      borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px'
                    }}>🛏</div>
                    <div>
                      <div style={{ color: '#0A1628', fontWeight: '600', fontSize: '14px' }}>Room {r.roomId}</div>
                      <div style={{ color: '#7a8599', fontSize: '12px', marginTop: '2px' }}>
                        {formatDate(r.checkIn)} → {formatDate(r.checkOut)} · {n} {n === 1 ? 'night' : 'nights'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                    <span style={{
                      background: cfg.bg, color: cfg.color,
                      border: `1px solid ${cfg.color}33`,
                      borderRadius: '20px', padding: '3px 10px',
                      fontSize: '11px', fontWeight: '600'
                    }}>{cfg.label}</span>
                    <Link to={`/invoice/${r.id}`} style={{
                      color: '#C9A84C', fontSize: '12px', fontWeight: '600', textDecoration: 'none'
                    }}>Invoice →</Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Membership card */}
            <div style={{
              background: mc.bg,
              border: `1px solid ${mc.accent}33`,
              borderRadius: '20px', padding: '28px',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', right: '-20px', top: '-20px',
                width: '120px', height: '120px',
                border: `2px solid ${mc.accent}22`, borderRadius: '50%'
              }} />
              <div style={{
                position: 'absolute', right: '10px', top: '10px',
                width: '70px', height: '70px',
                border: `2px solid ${mc.accent}15`, borderRadius: '50%'
              }} />
              <div style={{ color: mc.accent, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>
                The Grand Hotel
              </div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                color: mc.badge, fontSize: '24px', fontWeight: '700', marginBottom: '16px'
              }}>{memberLevel} Membership</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '2px' }}>Member</div>
              <div style={{ color: '#fff', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>{username}</div>
              <div style={{
                borderTop: `1px solid ${mc.accent}22`, paddingTop: '16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '2px' }}>Stays</div>
                  <div style={{ color: mc.badge, fontSize: '20px', fontWeight: '700', fontFamily: "'Playfair Display', serif" }}>{total}</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '2px' }}>Nights</div>
                  <div style={{ color: mc.badge, fontSize: '20px', fontWeight: '700', fontFamily: "'Playfair Display', serif" }}>{totalNights}</div>
                </div>
                <div style={{ fontSize: '36px', opacity: 0.2, color: mc.badge }}>✦</div>
              </div>
            </div>

            {/* Account details */}
            <div style={{
              background: '#fff', borderRadius: '16px', padding: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #ede8df'
            }}>
              <div style={{ color: '#C9A84C', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
                Account Details
              </div>
              {[
                { label: 'Username', value: username },
                { label: 'Role',     value: role },
                { label: 'Guest ID', value: userId || '—' },
                { label: 'Status',   value: 'Active', color: '#16a34a' },
              ].map((f, i, arr) => (
                <div key={f.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid #f5f0e8' : 'none'
                }}>
                  <span style={{ color: '#7a8599', fontSize: '13px' }}>{f.label}</span>
                  <span style={{ color: f.color || '#0A1628', fontSize: '13px', fontWeight: '600' }}>{f.value}</span>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={{
              background: '#fff', borderRadius: '16px', padding: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #ede8df'
            }}>
              <div style={{ color: '#C9A84C', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
                Quick Actions
              </div>
              {[
                { label: 'Browse Rooms',     to: '/rooms',        icon: '🏨' },
                { label: 'My Reservations',  to: '/reservations', icon: '📋' },
              ].map(l => (
                <Link key={l.to} to={l.to} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', marginBottom: '8px',
                  background: '#f8f5f0', borderRadius: '10px',
                  textDecoration: 'none', color: '#0A1628',
                  fontSize: '14px', fontWeight: '500', transition: 'all 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; e.currentTarget.style.color = '#C9A84C' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f8f5f0'; e.currentTarget.style.color = '#0A1628' }}
                >
                  <span>{l.icon}</span>
                  {l.label}
                  <span style={{ marginLeft: 'auto', opacity: 0.4 }}>→</span>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  try { return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }
  catch { return dateStr }
}

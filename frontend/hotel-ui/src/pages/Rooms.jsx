import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { roomApi, reservationApi } from '../api.js'

const ROOM_GRADIENTS = {
  Single: 'linear-gradient(135deg, #1a3a5c 0%, #0A1628 100%)',
  Double: 'linear-gradient(135deg, #2d1b4e 0%, #1a0a2e 100%)',
  Suite:  'linear-gradient(135deg, #4a2800 0%, #2a1500 100%)',
}
const ROOM_ICONS = { Single: '🛏', Double: '🛏🛏', Suite: '👑' }
const ROOM_FEATURES = {
  Single: ['King Bed', 'City View', 'Free Wi-Fi', 'Mini Bar'],
  Double: ['2 Queen Beds', 'Garden View', 'Free Wi-Fi', 'Breakfast Included'],
  Suite:  ['King Bed', 'Ocean View', 'Butler Service', 'Private Jacuzzi'],
}

export default function Rooms() {
  const [rooms, setRooms]     = useState([])
  const [dates, setDates]     = useState({ checkIn: '', checkOut: '' })
  const [message, setMessage] = useState({ text: '', type: '' })
  const [booking, setBooking] = useState(null)
  const navigate = useNavigate()

  const guestId = localStorage.getItem('userId') || ''

  useEffect(() => {
    roomApi.get('/api/rooms/available')
      .then(res => setRooms(res.data))
      .catch(() => setMessage({ text: 'Could not load rooms. Is the Room Service running on port 8083?', type: 'error' }))
  }, [])

  const handleBook = async (room) => {
    if (!dates.checkIn || !dates.checkOut) {
      setMessage({ text: 'Please select check-in and check-out dates first.', type: 'error' })
      return
    }
    setBooking(room.id)
    setMessage({ text: '', type: '' })
    try {
      await reservationApi.post(
        '/api/reservations/book',
        { roomId: room.id, checkIn: dates.checkIn, checkOut: dates.checkOut },
        { headers: { 'X-Guest-Id': guestId } }
      )
      setMessage({ text: `${room.type} Room booked successfully! Redirecting...`, type: 'success' })
      setTimeout(() => navigate('/reservations'), 1800)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Booking failed.'
      setMessage({ text: `Booking failed: ${msg}. Is the Reservation Service running on port 8082?`, type: 'error' })
    } finally {
      setBooking(null)
    }
  }

  const today     = new Date().toISOString().split('T')[0]
  const canBook   = dates.checkIn && dates.checkOut
  const nights    = canBook
    ? Math.max(0, Math.round((new Date(dates.checkOut) - new Date(dates.checkIn)) / 86400000))
    : 0

  return (
    <div style={{ background: '#F8F5F0', minHeight: 'calc(100vh - 70px)' }}>
      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #112240 100%)',
        padding: '60px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.1) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        <div style={{ color: '#C9A84C', fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>
          ✦ &nbsp; Luxury Accommodations &nbsp; ✦
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          color: '#fff', fontSize: '42px', fontWeight: '700', marginBottom: '16px'
        }}>Choose Your Perfect Room</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '36px' }}>
          Each room is thoughtfully designed for your comfort and pleasure
        </p>

        {/* Date picker */}
        <div style={{
          display: 'inline-flex', gap: '16px', alignItems: 'flex-end',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: '12px', padding: '20px 28px'
        }}>
          <DateField label="Check-in" value={dates.checkIn} min={today}
            onChange={v => setDates({ ...dates, checkIn: v })} />
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '20px', paddingBottom: '10px' }}>→</div>
          <DateField label="Check-out" value={dates.checkOut} min={dates.checkIn || today}
            onChange={v => setDates({ ...dates, checkOut: v })} />
          {nights > 0 && (
            <div style={{ paddingBottom: '8px', textAlign: 'center' }}>
              <div style={{ color: '#C9A84C', fontSize: '22px', fontWeight: '700', fontFamily: "'Playfair Display', serif" }}>{nights}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {nights === 1 ? 'Night' : 'Nights'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div style={{
          margin: '24px 40px 0',
          padding: '14px 20px',
          borderRadius: '10px',
          background: message.type === 'success' ? '#f0fff4' : '#fff0f0',
          border: `1px solid ${message.type === 'success' ? '#9ae6b4' : '#ffcccc'}`,
          borderLeft: `4px solid ${message.type === 'success' ? '#38a169' : '#e74c3c'}`,
          color: message.type === 'success' ? '#276749' : '#c0392b',
          fontSize: '14px'
        }}>{message.text}</div>
      )}

      {/* Room cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '28px',
        padding: '40px'
      }}>
        {rooms.map(room => {
          const type     = room.type || 'Single'
          const features = ROOM_FEATURES[type] || ROOM_FEATURES.Single
          const total    = nights > 0 ? (room.price * nights).toFixed(0) : null

          return (
            <div key={room.id} style={{
              background: '#fff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              display: 'flex',
              flexDirection: 'column'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)' }}
            >
              {/* Room image area */}
              <div style={{
                height: '200px',
                background: ROOM_GRADIENTS[type] || ROOM_GRADIENTS.Single,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{ fontSize: '52px', marginBottom: '8px' }}>{ROOM_ICONS[type] || '🛏'}</div>
                <div style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '22px',
                  fontWeight: '600'
                }}>{type} Room</div>
                <div style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'rgba(201,168,76,0.15)',
                  border: '1px solid rgba(201,168,76,0.4)',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  color: '#C9A84C',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>Available</div>
              </div>

              {/* Room details */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ color: '#7a8599', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
                  {room.description}
                </p>

                {/* Features */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {features.map(f => (
                    <span key={f} style={{
                      background: '#f8f5f0',
                      border: '1px solid #e8e0d0',
                      borderRadius: '20px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      color: '#5a6478',
                      fontWeight: '500'
                    }}>✓ {f}</span>
                  ))}
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '16px' }}>
                    <span style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '32px', fontWeight: '700', color: '#0A1628'
                    }}>${room.price}</span>
                    <span style={{ color: '#7a8599', fontSize: '14px' }}>/ night</span>
                    {total && (
                      <span style={{
                        marginLeft: 'auto',
                        background: 'rgba(201,168,76,0.1)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        borderRadius: '8px',
                        padding: '4px 10px',
                        color: '#8a6820',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>Total: ${total}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleBook(room)}
                    disabled={booking === room.id}
                    style={{
                      width: '100%',
                      padding: '13px',
                      background: canBook
                        ? 'linear-gradient(135deg, #C9A84C, #E8C96A)'
                        : '#e8e0d0',
                      border: 'none',
                      borderRadius: '8px',
                      color: canBook ? '#0A1628' : '#a09080',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: canBook ? 'pointer' : 'default',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      boxShadow: canBook ? '0 4px 15px rgba(201,168,76,0.3)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    {booking === room.id ? 'Booking...' : canBook ? `Book Now` : 'Select Dates to Book'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DateField({ label, value, min, onChange }) {
  return (
    <div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
        {label}
      </div>
      <input
        type="date"
        value={value}
        min={min}
        onChange={e => onChange(e.target.value)}
        style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          color: '#fff',
          padding: '10px 14px',
          fontSize: '15px',
          outline: 'none',
          fontFamily: "'Inter', sans-serif",
          colorScheme: 'dark'
        }}
      />
    </div>
  )
}

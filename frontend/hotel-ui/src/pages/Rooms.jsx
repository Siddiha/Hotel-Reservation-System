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

const OFFERS = [
  { icon: '🌅', tag: 'LIMITED TIME', title: 'Early Bird Special', desc: 'Book 30 days in advance and save up to 25% on any room type.', badge: '25% OFF', color: '#1a3a5c' },
  { icon: '💑', tag: 'ROMANTIC ESCAPE', title: 'Honeymoon Package', desc: 'Complimentary champagne, rose petals, and couples spa treatment.', badge: 'POPULAR', color: '#2d1b4e' },
  { icon: '🏢', tag: 'CORPORATE RATE', title: 'Business Traveller', desc: 'Free airport transfer, daily breakfast and express check-in/out.', badge: 'NEW', color: '#1a3520' },
  { icon: '👨‍👩‍👧‍👦', tag: 'FAMILY FUN', title: 'Family Getaway', desc: 'Kids stay and eat free. Adjoining rooms available on request.', badge: 'BEST VALUE', color: '#3d1a00' },
]

const PACKAGES = [
  {
    name: 'Silver',
    price: '$199',
    per: '/ night',
    icon: '🥈',
    features: ['Standard Room', 'Daily Breakfast', 'Free Wi-Fi', 'Gym Access', 'Late Check-out'],
    highlight: false,
  },
  {
    name: 'Gold',
    price: '$349',
    per: '/ night',
    icon: '🥇',
    features: ['Deluxe Room', 'Breakfast & Dinner', 'Free Wi-Fi', 'Spa Credit $50', 'Airport Transfer', 'Welcome Drink'],
    highlight: true,
  },
  {
    name: 'Platinum',
    price: '$599',
    per: '/ night',
    icon: '💎',
    features: ['Suite Room', 'All Meals Included', 'Unlimited Mini Bar', 'Private Butler', 'Spa Unlimited', 'Limo Transfer', 'Pillow Menu'],
    highlight: false,
  },
]

const AMENITIES = [
  { icon: '🏊', title: 'Infinity Pool', desc: 'Rooftop pool with panoramic city views open 6am–10pm' },
  { icon: '💆', title: 'Luxury Spa', desc: 'Full-service spa with 12 treatment rooms and sauna' },
  { icon: '🍽️', title: 'Fine Dining', desc: '3 restaurants including a Michelin-starred rooftop venue' },
  { icon: '🏋️', title: 'Fitness Centre', desc: 'State-of-the-art gym open 24 hours with personal trainers' },
  { icon: '🎰', title: 'Casino Lounge', desc: 'Members-only lounge with live entertainment nightly' },
  { icon: '🚗', title: 'Valet Parking', desc: 'Complimentary valet service and electric car charging' },
]

const REVIEWS = [
  { name: 'Sarah M.', role: 'Verified Guest', rating: 5, text: 'Absolutely breathtaking. The suite was immaculate and the butler service was beyond anything I have experienced. Will definitely return!', date: 'March 2025' },
  { name: 'James T.', role: 'Business Traveller', rating: 5, text: 'The corporate package was perfect for my week-long stay. Express check-in, daily breakfast and the fastest Wi-Fi I have had in any hotel.', date: 'February 2025' },
  { name: 'Priya K.', role: 'Honeymoon Guest', rating: 5, text: 'The honeymoon package exceeded all expectations. Rose petals, champagne on arrival — they thought of everything. Pure magic.', date: 'January 2025' },
]

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

  const today   = new Date().toISOString().split('T')[0]
  const canBook = dates.checkIn && dates.checkOut
  const nights  = canBook
    ? Math.max(0, Math.round((new Date(dates.checkOut) - new Date(dates.checkIn)) / 86400000))
    : 0

  return (
    <div style={{ background: '#F8F5F0' }}>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #112240 100%)',
        padding: '80px 40px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />
        <div style={{ color: '#C9A84C', fontSize: '13px', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '14px' }}>
          ✦ &nbsp; Award-Winning Luxury Since 1987 &nbsp; ✦
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          color: '#fff', fontSize: '52px', fontWeight: '700',
          marginBottom: '16px', lineHeight: 1.15
        }}>Your Perfect Stay<br /><em style={{ color: '#C9A84C' }}>Awaits You</em></h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '17px', marginBottom: '44px', maxWidth: '500px', margin: '0 auto 44px' }}>
          Each room is thoughtfully curated for your comfort, pleasure, and lasting memories.
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginBottom: '48px' }}>
          {[['500+', 'Luxury Rooms'], ['98%', 'Guest Satisfaction'], ['24/7', 'Concierge'], ['15+', 'Awards Won']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ color: '#C9A84C', fontSize: '26px', fontWeight: '700', fontFamily: "'Playfair Display', serif" }}>{v}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Date picker */}
        <div style={{
          display: 'inline-flex', gap: '16px', alignItems: 'flex-end',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: '14px', padding: '22px 32px'
        }}>
          <DateField label="Check-in"  value={dates.checkIn}  min={today}
            onChange={v => setDates({ ...dates, checkIn: v })} />
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '22px', paddingBottom: '10px' }}>→</div>
          <DateField label="Check-out" value={dates.checkOut} min={dates.checkIn || today}
            onChange={v => setDates({ ...dates, checkOut: v })} />
          {nights > 0 && (
            <div style={{ paddingBottom: '8px', textAlign: 'center' }}>
              <div style={{ color: '#C9A84C', fontSize: '24px', fontWeight: '700', fontFamily: "'Playfair Display', serif" }}>{nights}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {nights === 1 ? 'Night' : 'Nights'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MESSAGE ── */}
      {message.text && (
        <div style={{
          margin: '24px 40px 0', padding: '14px 20px', borderRadius: '10px',
          background: message.type === 'success' ? '#f0fff4' : '#fff0f0',
          border: `1px solid ${message.type === 'success' ? '#9ae6b4' : '#ffcccc'}`,
          borderLeft: `4px solid ${message.type === 'success' ? '#38a169' : '#e74c3c'}`,
          color: message.type === 'success' ? '#276749' : '#c0392b', fontSize: '14px'
        }}>{message.text}</div>
      )}

      {/* ── SPECIAL OFFERS ── */}
      <div style={{ padding: '72px 60px 0' }}>
        <SectionHeader tag="Exclusive Deals" title="Special Offers & Promotions" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '36px' }}>
          {OFFERS.map(o => (
            <div key={o.title} style={{
              background: `linear-gradient(135deg, ${o.color} 0%, #0A1628 100%)`,
              borderRadius: '16px', padding: '28px 24px',
              border: '1px solid rgba(201,168,76,0.15)',
              cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s',
              position: 'relative', overflow: 'hidden'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.5)',
                borderRadius: '20px', padding: '3px 10px',
                color: '#C9A84C', fontSize: '10px', fontWeight: '700', letterSpacing: '1px'
              }}>{o.badge}</div>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{o.icon}</div>
              <div style={{ color: 'rgba(201,168,76,0.7)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>{o.tag}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '18px', marginBottom: '10px' }}>{o.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>{o.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── AVAILABLE ROOMS ── */}
      <div style={{ padding: '72px 60px 0' }}>
        <SectionHeader tag="Our Accommodations" title="Available Rooms" />
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '28px', marginTop: '36px'
        }}>
          {rooms.map(room => {
            const type     = room.type || 'Single'
            const features = ROOM_FEATURES[type] || ROOM_FEATURES.Single
            const total    = nights > 0 ? (room.price * nights).toFixed(0) : null

            return (
              <div key={room.id} style={{
                background: '#fff', borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s', display: 'flex', flexDirection: 'column'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)' }}
              >
                <div style={{
                  height: '200px', background: ROOM_GRADIENTS[type] || ROOM_GRADIENTS.Single,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', position: 'relative'
                }}>
                  <div style={{ fontSize: '52px', marginBottom: '8px' }}>{ROOM_ICONS[type] || '🛏'}</div>
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: '600' }}>{type} Room</div>
                  <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)',
                    borderRadius: '20px', padding: '4px 12px', color: '#C9A84C', fontSize: '12px', fontWeight: '600'
                  }}>Available</div>
                </div>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ color: '#7a8599', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>{room.description}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                    {features.map(f => (
                      <span key={f} style={{
                        background: '#f8f5f0', border: '1px solid #e8e0d0',
                        borderRadius: '20px', padding: '4px 12px',
                        fontSize: '12px', color: '#5a6478', fontWeight: '500'
                      }}>✓ {f}</span>
                    ))}
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '16px' }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: '700', color: '#0A1628' }}>${room.price}</span>
                      <span style={{ color: '#7a8599', fontSize: '14px' }}>/ night</span>
                      {total && (
                        <span style={{
                          marginLeft: 'auto', background: 'rgba(201,168,76,0.1)',
                          border: '1px solid rgba(201,168,76,0.3)', borderRadius: '8px',
                          padding: '4px 10px', color: '#8a6820', fontSize: '13px', fontWeight: '600'
                        }}>Total: ${total}</span>
                      )}
                    </div>
                    <button onClick={() => handleBook(room)} disabled={booking === room.id} style={{
                      width: '100%', padding: '13px',
                      background: canBook ? 'linear-gradient(135deg, #C9A84C, #E8C96A)' : '#e8e0d0',
                      border: 'none', borderRadius: '8px',
                      color: canBook ? '#0A1628' : '#a09080',
                      fontSize: '14px', fontWeight: '700',
                      cursor: canBook ? 'pointer' : 'default',
                      letterSpacing: '0.5px', textTransform: 'uppercase',
                      boxShadow: canBook ? '0 4px 15px rgba(201,168,76,0.3)' : 'none',
                      transition: 'all 0.2s'
                    }}>
                      {booking === room.id ? 'Booking...' : canBook ? 'Book Now' : 'Select Dates to Book'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── PACKAGES ── */}
      <div style={{ padding: '72px 60px 0' }}>
        <SectionHeader tag="Curated Experiences" title="Stay Packages" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '36px' }}>
          {PACKAGES.map(pkg => (
            <div key={pkg.name} style={{
              background: pkg.highlight ? 'linear-gradient(135deg, #0A1628 0%, #112240 100%)' : '#fff',
              border: pkg.highlight ? '2px solid rgba(201,168,76,0.5)' : '1px solid #e8e0d0',
              borderRadius: '20px', padding: '36px 32px',
              position: 'relative', overflow: 'hidden',
              boxShadow: pkg.highlight ? '0 20px 60px rgba(10,22,40,0.3)' : '0 4px 20px rgba(0,0,0,0.06)',
              transition: 'transform 0.3s'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {pkg.highlight && (
                <div style={{
                  position: 'absolute', top: '20px', right: '20px',
                  background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
                  borderRadius: '20px', padding: '4px 14px',
                  color: '#0A1628', fontSize: '11px', fontWeight: '700', letterSpacing: '1px'
                }}>MOST POPULAR</div>
              )}
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{pkg.icon}</div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                color: pkg.highlight ? '#C9A84C' : '#0A1628',
                fontSize: '26px', marginBottom: '4px'
              }}>{pkg.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                <span style={{ color: pkg.highlight ? '#fff' : '#0A1628', fontSize: '36px', fontWeight: '700', fontFamily: "'Playfair Display', serif" }}>{pkg.price}</span>
                <span style={{ color: pkg.highlight ? 'rgba(255,255,255,0.5)' : '#7a8599', fontSize: '14px' }}>{pkg.per}</span>
              </div>
              <div style={{ borderTop: `1px solid ${pkg.highlight ? 'rgba(255,255,255,0.1)' : '#f0ebe0'}`, paddingTop: '24px' }}>
                {pkg.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ color: '#C9A84C', fontSize: '14px', fontWeight: '700' }}>✓</span>
                    <span style={{ color: pkg.highlight ? 'rgba(255,255,255,0.75)' : '#5a6478', fontSize: '14px' }}>{f}</span>
                  </div>
                ))}
              </div>
              <button style={{
                width: '100%', padding: '13px', marginTop: '24px',
                background: pkg.highlight ? 'linear-gradient(135deg, #C9A84C, #E8C96A)' : 'transparent',
                border: pkg.highlight ? 'none' : '1.5px solid #C9A84C',
                borderRadius: '8px',
                color: pkg.highlight ? '#0A1628' : '#C9A84C',
                fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                letterSpacing: '1px', textTransform: 'uppercase',
                transition: 'all 0.2s'
              }}>Select Package</button>
            </div>
          ))}
        </div>
      </div>

      {/* ── AMENITIES ── */}
      <div style={{ padding: '72px 60px 0' }}>
        <SectionHeader tag="World-Class Facilities" title="Hotel Amenities" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '36px' }}>
          {AMENITIES.map(a => (
            <div key={a.title} style={{
              background: '#fff', borderRadius: '14px', padding: '28px 24px',
              border: '1px solid #ede8df',
              display: 'flex', gap: '18px', alignItems: 'flex-start',
              transition: 'box-shadow 0.3s, transform 0.3s'
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{
                width: '52px', height: '52px', flexShrink: 0,
                background: 'linear-gradient(135deg, #0A1628, #112240)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px'
              }}>{a.icon}</div>
              <div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#0A1628', fontSize: '17px', marginBottom: '6px' }}>{a.title}</h4>
                <p style={{ color: '#7a8599', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── REVIEWS ── */}
      <div style={{ padding: '72px 60px 0' }}>
        <SectionHeader tag="Guest Experiences" title="What Our Guests Say" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '36px' }}>
          {REVIEWS.map(r => (
            <div key={r.name} style={{
              background: '#fff', borderRadius: '16px', padding: '32px 28px',
              border: '1px solid #ede8df',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {'★★★★★'.split('').map((s, i) => (
                  <span key={i} style={{ color: '#C9A84C', fontSize: '18px' }}>{s}</span>
                ))}
              </div>
              <p style={{ color: '#4a5568', fontSize: '14px', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '24px' }}>
                "{r.text}"
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#0A1628', fontSize: '14px' }}>{r.name}</div>
                  <div style={{ color: '#C9A84C', fontSize: '12px', fontWeight: '500' }}>{r.role}</div>
                </div>
                <div style={{ color: '#b0bac9', fontSize: '12px' }}>{r.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── NEWSLETTER BANNER ── */}
      <div style={{ padding: '72px 60px 80px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #112240 100%)',
          borderRadius: '24px', padding: '60px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
          border: '1px solid rgba(201,168,76,0.2)'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 65%)',
            pointerEvents: 'none'
          }} />
          <div style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>
            ✦ &nbsp; Stay in the Know &nbsp; ✦
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '36px', marginBottom: '12px' }}>
            Exclusive Offers Delivered to You
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', marginBottom: '32px' }}>
            Subscribe to receive early access to special rates, seasonal packages and member-only events.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', maxWidth: '480px', margin: '0 auto' }}>
            <input placeholder="Enter your email address" style={{
              flex: 1, padding: '14px 18px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none',
              fontFamily: "'Inter', sans-serif"
            }} />
            <button style={{
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
              border: 'none', borderRadius: '8px',
              color: '#0A1628', fontWeight: '700', fontSize: '13px',
              cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>Subscribe</button>
          </div>
        </div>
      </div>

    </div>
  )
}

function SectionHeader({ tag, title }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>
        ✦ &nbsp; {tag} &nbsp; ✦
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#0A1628', fontSize: '36px', fontWeight: '700', margin: 0 }}>
        {title}
      </h2>
      <div style={{ width: '50px', height: '2px', background: 'linear-gradient(90deg, #C9A84C, #E8C96A)', margin: '16px auto 0' }} />
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
          borderRadius: '8px', color: '#fff',
          padding: '10px 14px', fontSize: '15px',
          outline: 'none', fontFamily: "'Inter', sans-serif", colorScheme: 'dark'
        }}
      />
    </div>
  )
}

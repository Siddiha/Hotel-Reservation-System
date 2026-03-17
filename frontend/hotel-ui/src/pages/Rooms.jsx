import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { roomApi, reservationApi } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' })
  const [message, setMessage] = useState({ text: '', type: '' })
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    roomApi.get('/api/rooms/available').then(res => setRooms(res.data))
  }, [])

  const handleBook = async (roomId) => {
    setMessage({ text: '', type: '' })
    try {
      await reservationApi.post(
        '/api/reservations/book',
        { roomId, checkIn: dates.checkIn, checkOut: dates.checkOut },
        { headers: { 'X-Guest-Id': user.userId } }
      )
      setMessage({ text: 'Room booked successfully!', type: 'success' })
      setTimeout(() => navigate('/reservations'), 1500)
    } catch {
      setMessage({ text: 'Booking failed. Please try again.', type: 'danger' })
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <h4 className="mb-4">Available Rooms</h4>

      <div className="card mb-4 bg-light border-0">
        <div className="card-body">
          <h6 className="mb-3">Select your dates to book</h6>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Check-in</label>
              <input
                type="date"
                className="form-control"
                min={today}
                value={dates.checkIn}
                onChange={e => setDates({ ...dates, checkIn: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Check-out</label>
              <input
                type="date"
                className="form-control"
                min={dates.checkIn || today}
                value={dates.checkOut}
                onChange={e => setDates({ ...dates, checkOut: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} py-2`}>{message.text}</div>
      )}

      <div className="row">
        {rooms.map(room => (
          <div key={room.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{room.type} Room</h5>
                <p className="card-text text-muted flex-grow-1">{room.description}</p>
                <p className="fw-bold fs-5 mb-3">${room.price} <span className="text-muted fw-normal fs-6">/ night</span></p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleBook(room.id)}
                  disabled={!dates.checkIn || !dates.checkOut}
                >
                  Book Now
                </button>
                {(!dates.checkIn || !dates.checkOut) && (
                  <small className="text-muted mt-2 text-center">Select dates above to book</small>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

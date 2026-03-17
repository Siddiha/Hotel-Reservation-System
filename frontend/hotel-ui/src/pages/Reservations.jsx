import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { reservationApi } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

const STATUS_BADGE = {
  BOOKED: 'primary',
  CHECKED_IN: 'success',
  CHECKED_OUT: 'secondary',
  CANCELLED: 'danger',
}

export default function Reservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const load = () => {
    setLoading(true)
    reservationApi
      .get('/api/reservations/my', { headers: { 'X-Guest-Id': user.userId } })
      .then(res => setReservations(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const cancel = async (id) => {
    await reservationApi.put(
      `/api/reservations/cancel/${id}`,
      {},
      { headers: { 'X-Guest-Id': user.userId } }
    )
    load()
  }

  const checkin = async (id) => {
    await reservationApi.put(`/api/reservations/checkin/${id}`)
    load()
  }

  const checkout = async (id) => {
    await reservationApi.put(`/api/reservations/checkout/${id}`)
    load()
  }

  if (loading) return <p className="text-muted">Loading reservations...</p>

  return (
    <div>
      <h4 className="mb-4">My Reservations</h4>

      {reservations.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>No reservations found.</p>
          <Link to="/rooms" className="btn btn-primary">Browse Rooms</Link>
        </div>
      ) : (
        reservations.map(r => (
          <div key={r.id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">
                    Reservation #{r.id}
                    <span className={`badge bg-${STATUS_BADGE[r.status] || 'secondary'} ms-2`}>
                      {r.status}
                    </span>
                  </h6>
                  <small className="text-muted">
                    Room {r.roomId} &nbsp;|&nbsp; {r.checkIn} → {r.checkOut}
                  </small>
                </div>
                <div className="d-flex gap-2 flex-wrap justify-content-end">
                  {r.status === 'BOOKED' && (
                    <>
                      <button className="btn btn-sm btn-success" onClick={() => checkin(r.id)}>
                        Check In
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => cancel(r.id)}>
                        Cancel
                      </button>
                    </>
                  )}
                  {r.status === 'CHECKED_IN' && (
                    <button className="btn btn-sm btn-warning" onClick={() => checkout(r.id)}>
                      Check Out
                    </button>
                  )}
                  <Link to={`/invoice/${r.id}`} className="btn btn-sm btn-outline-secondary">
                    Invoice
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

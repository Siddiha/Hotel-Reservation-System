import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { billingApi } from '../api.js'

export default function Invoice() {
  const { id } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    billingApi
      .get(`/api/billing/reservation/${id}`)
      .then(res => setInvoice(res.data))
      .catch(() => setError('Invoice not found for this reservation.'))
  }, [id])

  if (error) {
    return (
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 text-center">
          <div className="alert alert-warning">{error}</div>
          <Link to="/reservations" className="btn btn-outline-secondary">Back to Reservations</Link>
        </div>
      </div>
    )
  }

  if (!invoice) return <p className="text-muted">Loading invoice...</p>

  const statusColor = { PENDING: 'warning', PAID: 'success', CANCELLED: 'danger' }

  return (
    <div className="row justify-content-center mt-4">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Invoice #{invoice.id}</h5>
            <span className={`badge bg-${statusColor[invoice.status] || 'secondary'}`}>
              {invoice.status}
            </span>
          </div>
          <div className="card-body">
            <table className="table table-borderless mb-0">
              <tbody>
                <tr>
                  <th className="text-muted fw-normal">Reservation ID</th>
                  <td>#{invoice.reservationId}</td>
                </tr>
                <tr>
                  <th className="text-muted fw-normal">Guest ID</th>
                  <td>{invoice.guestId}</td>
                </tr>
                <tr>
                  <th className="text-muted fw-normal">Amount</th>
                  <td className="fw-bold fs-5">${invoice.amount?.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card-footer text-end">
            <Link to="/reservations" className="btn btn-outline-secondary btn-sm">
              Back to Reservations
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { billingApi } from '../api.js'

export default function Invoice() {
  const { id } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [error, setError]     = useState('')

  useEffect(() => {
    billingApi.get(`/api/billing/reservation/${id}`)
      .then(res => setInvoice(res.data))
      .catch(() => setError('Invoice not found. It may not have been generated yet for this reservation.'))
  }, [id])

  const STATUS_CONFIG = {
    PENDING:   { color: '#d97706', bg: '#fffbeb', label: 'Pending Payment' },
    PAID:      { color: '#16a34a', bg: '#f0fdf4', label: 'Paid' },
    CANCELLED: { color: '#dc2626', bg: '#fef2f2', label: 'Cancelled' },
  }

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
          background: 'radial-gradient(ellipse at 80% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        <div style={{ color: '#C9A84C', fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>
          ✦ &nbsp; Billing
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          color: '#fff', fontSize: '36px', fontWeight: '700', margin: 0
        }}>Invoice Details</h2>
      </div>

      <div style={{ padding: '40px', maxWidth: '680px', margin: '0 auto' }}>
        {error && (
          <div style={{
            padding: '20px 24px', borderRadius: '12px',
            background: '#fff0f0', border: '1px solid #ffcccc',
            borderLeft: '4px solid #e74c3c',
            color: '#c0392b', fontSize: '14px', marginBottom: '24px'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>Invoice Not Available</div>
            {error}
          </div>
        )}

        {!invoice && !error && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#7a8599' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
            Loading invoice...
          </div>
        )}

        {invoice && (() => {
          const cfg = STATUS_CONFIG[invoice.status] || STATUS_CONFIG.PENDING
          return (
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              {/* Invoice header */}
              <div style={{
                background: 'linear-gradient(135deg, #0A1628, #112240)',
                padding: '32px 36px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ color: '#C9A84C', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
                    The Grand Hotel
                  </div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    color: '#fff', fontSize: '26px', fontWeight: '700'
                  }}>Invoice #{invoice.id}</div>
                </div>
                <span style={{
                  background: cfg.bg,
                  color: cfg.color,
                  border: `1px solid ${cfg.color}44`,
                  borderRadius: '20px',
                  padding: '6px 16px',
                  fontSize: '13px',
                  fontWeight: '700'
                }}>{cfg.label}</span>
              </div>

              {/* Gold divider */}
              <div style={{
                height: '3px',
                background: 'linear-gradient(90deg, #C9A84C, #E8C96A, #C9A84C)'
              }} />

              {/* Invoice body */}
              <div style={{ padding: '36px' }}>
                {/* Details grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  marginBottom: '32px'
                }}>
                  <InvoiceField label="Reservation ID" value={`#${invoice.reservationId}`} />
                  <InvoiceField label="Guest ID" value={invoice.guestId} />
                  <InvoiceField label="Invoice Date" value={new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
                  <InvoiceField label="Payment Status" value={cfg.label} color={cfg.color} />
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px dashed #e0dbd0', margin: '24px 0' }} />

                {/* Amount section */}
                <div style={{
                  background: 'linear-gradient(135deg, #0A1628, #112240)',
                  borderRadius: '12px',
                  padding: '24px 28px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '28px'
                }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                      Total Amount Due
                    </div>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      color: '#C9A84C', fontSize: '40px', fontWeight: '700'
                    }}>${invoice.amount?.toFixed(2)}</div>
                  </div>
                  <div style={{ color: '#C9A84C', fontSize: '48px', opacity: 0.3 }}>✦</div>
                </div>

                {/* Note */}
                <div style={{
                  background: '#f8f5f0', borderRadius: '10px',
                  padding: '16px 20px', marginBottom: '28px',
                  fontSize: '13px', color: '#7a8599', lineHeight: 1.6
                }}>
                  <strong style={{ color: '#0A1628' }}>Thank you for choosing The Grand Hotel.</strong><br />
                  We hope you enjoyed your stay. For any billing enquiries, please contact our front desk.
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link to="/reservations" style={{
                    flex: 1, padding: '13px',
                    background: '#f8f5f0',
                    border: '1px solid #e0dbd0',
                    borderRadius: '8px',
                    color: '#5a6478',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>← Back to Reservations</Link>
                  <button
                    onClick={() => window.print()}
                    style={{
                      flex: 1, padding: '13px',
                      background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#0A1628',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      letterSpacing: '0.3px',
                      boxShadow: '0 4px 15px rgba(201,168,76,0.3)'
                    }}
                  >🖨 Print Invoice</button>
                </div>
              </div>
            </div>
          )
        })()}

        {error && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to="/reservations" style={{
              display: 'inline-block', padding: '12px 28px',
              background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
              borderRadius: '8px', color: '#0A1628',
              textDecoration: 'none', fontWeight: '700', fontSize: '14px'
            }}>← Back to Reservations</Link>
          </div>
        )}
      </div>
    </div>
  )
}

function InvoiceField({ label, value, color }) {
  return (
    <div style={{
      background: '#f8f5f0', borderRadius: '10px', padding: '16px'
    }}>
      <div style={{ color: '#a0aab8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ color: color || '#0A1628', fontSize: '15px', fontWeight: '600' }}>{value}</div>
    </div>
  )
}

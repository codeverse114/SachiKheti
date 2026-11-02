import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle } from 'lucide-react';

export default function OrderTrackModal({ onClose }) {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch(`/api/orders/track/${orderNumber.trim()}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        setErrorMsg(data.message || 'No order found with this tracking ID');
        setOrder(null);
      }
    } catch (err) {
      setErrorMsg('Failed to check order status. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="badge badge-green">Delivered</span>;
      case 'SHIPPED':
        return <span className="badge badge-gold">In Transit / Shipped</span>;
      case 'PROCESSING':
        return <span className="badge badge-gold">Packing & Verification</span>;
      case 'CONFIRMED':
        return <span className="badge badge-green">Confirmed</span>;
      default:
        return <span className="badge" style={{ background: '#F3F4F6', color: '#4B5563' }}>Pending Confirmation</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#7A8B80' }}
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Truck size={24} color="#15733E" />
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Track Your Farm Order</h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#7A8B80', marginBottom: '20px' }}>
          Enter the order reference number received during checkout (e.g. <code>SK-2026-7841</code>).
        </p>

        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            required
            placeholder="e.g. SK-2026-7841"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            className="form-input"
            style={{ textTransform: 'uppercase' }}
          />
          <button type="submit" disabled={loading} className="btn btn-primary">
            <Search size={16} />
            <span>Track</span>
          </button>
        </form>

        {errorMsg && (
          <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', color: '#B91C1C', padding: '10px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {order && (
          <div style={{ background: '#FAF9F3', border: '1px solid #E7E3D4', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#7A8B80' }}>Order ID:</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0A3E22' }}>
                  {order.orderNumber}
                </div>
              </div>
              {getStatusBadge(order.orderStatus)}
            </div>

            <div style={{ fontSize: '0.88rem', color: '#4A5B50', marginBottom: '8px' }}>
              <strong>Customer:</strong> {order.customerName} ({order.customerPhone})
            </div>
            <div style={{ fontSize: '0.88rem', color: '#4A5B50', marginBottom: '8px' }}>
              <strong>Delivery To:</strong> {order.address}, {order.city}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#4A5B50', marginBottom: '14px' }}>
              <strong>Payment Method:</strong> {order.paymentMethod} ({order.paymentStatus})
            </div>

            <div style={{ borderTop: '1px dashed #E7E3D4', paddingTop: '12px', marginTop: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Items Summary:</div>
              {Array.isArray(order.items) && order.items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '3px 0' }}>
                  <span>{it.title} x {it.quantity}</span>
                  <strong>₹ {(it.price * it.quantity).toLocaleString('en-IN')}</strong>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #E7E3D4', fontSize: '1rem', fontWeight: 800, color: '#0A3E22' }}>
                <span>Total Bill:</span>
                <span>₹ {order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

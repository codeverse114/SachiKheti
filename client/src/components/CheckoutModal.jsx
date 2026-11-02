import React, { useState } from 'react';
import { X, MessageCircle, CreditCard, CheckCircle2, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CheckoutModal({ onClose }) {
  const { cartItems, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    city: 'Fatehabad',
    pincode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('WHATSAPP');
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppCheckout = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.address) {
      setErrorMsg('Please enter your Name, Phone Number, and Delivery Address.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      // 1. Post order to backend API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cartItems.map(item => ({
            productId: item.id,
            title: item.title,
            titlePunjabi: item.titlePunjabi,
            price: item.price,
            quantity: item.quantity,
            unit: item.unit,
          })),
          totalAmount: subtotal,
          paymentMethod: 'WHATSAPP',
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to register order');
      }

      const orderNumber = data.data.orderNumber;

      // 2. Format detailed WhatsApp message
      const itemsList = cartItems
        .map((item, idx) => `${idx + 1}. *${item.title}* (${item.titlePunjabi}) x ${item.quantity} [₹${(item.price * item.quantity).toLocaleString('en-IN')}]`)
        .join('\n');

      const message = 
`🌾 *NEW SACHIKHETI FARM ORDER*
🆔 *Order Reference:* ${orderNumber}
👤 *Customer:* ${formData.customerName}
📞 *Phone:* ${formData.customerPhone}
📍 *Address:* ${formData.address}, ${formData.city} (PIN: ${formData.pincode || 'N/A'})

🛒 *Ordered Items:*
${itemsList}

💰 *Total Amount:* ₹${subtotal.toLocaleString('en-IN')}
📝 *Notes:* ${formData.notes || 'None'}

Please confirm my order and share estimated dispatch timing. Thanks!`;

      // Open WhatsApp
      window.open(`https://wa.me/918295886832?text=${encodeURIComponent(message)}`, '_blank');

      setCompletedOrder({ ...data.data, orderNumber });
      clearCart();
    } catch (err) {
      setErrorMsg(err.message || 'Error processing order');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayCheckout = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.address) {
      setErrorMsg('Please enter your Name, Phone Number, and Delivery Address.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      // 1. Create order on backend
      const res = await fetch('/api/payment/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: subtotal }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Unable to initiate online payment');
      }

      // Check if real Razorpay checkout is available on window
      if (typeof window.Razorpay === 'function' && !data.mock) {
        const options = {
          key: data.key,
          amount: data.order.amount,
          currency: data.order.currency,
          name: 'SachiKheti (LFPC)',
          description: 'Payment for Agricultural & Farm Products',
          image: '/assets/brand/sachi-kheti-emblem.jpg',
          order_id: data.order.id,
          handler: async function (response) {
            // Verify payment on server
            const verifyRes = await fetch('/api/payment/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.verified) {
              // Create finalized order in DB
              const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...formData,
                  items: cartItems,
                  totalAmount: subtotal,
                  paymentMethod: 'RAZORPAY',
                  razorpayId: response.razorpay_payment_id,
                }),
              });
              const orderData = await orderRes.json();
              setCompletedOrder(orderData.data);
              clearCart();
            } else {
              setErrorMsg('Payment verification failed.');
            }
          },
          prefill: {
            name: formData.customerName,
            contact: formData.customerPhone,
          },
          theme: {
            color: '#15733E',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Simulated / Sandbox payment verification
        setTimeout(async () => {
          const orderRes = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...formData,
              items: cartItems,
              totalAmount: subtotal,
              paymentMethod: 'RAZORPAY',
              razorpayId: `pay_test_${Date.now()}`,
            }),
          });
          const orderData = await orderRes.json();
          setCompletedOrder(orderData.data);
          clearCart();
          setLoading(false);
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error processing online payment');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#7A8B80' }}
        >
          <X size={22} />
        </button>

        {completedOrder ? (
          /* Success Screen */
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#F0FAF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={40} color="#15733E" />
            </div>
            <h3 style={{ fontSize: '1.6rem', color: '#0A3E22', marginBottom: '8px' }}>
              Order Placed Successfully!
            </h3>
            <p className="font-gurmukhi" style={{ color: '#C67C00', fontSize: '1.1rem', marginBottom: '16px' }}>
              ਧੰਨਵਾਦ! ਤੁਹਾਡਾ ਆਰਡਰ ਦਰਜ ਹੋ ਗਿਆ ਹੈ।
            </p>
            <div style={{ background: '#FAF9F3', border: '1px solid #E7E3D4', borderRadius: '12px', padding: '16px', maxWidth: '380px', margin: '0 auto 24px' }}>
              <div style={{ fontSize: '0.85rem', color: '#7A8B80' }}>Your Order Tracking Reference:</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0A3E22', letterSpacing: '0.05em' }}>
                {completedOrder.orderNumber}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#4A5B50', marginTop: '6px' }}>
                Payment Method: <strong>{completedOrder.paymentMethod}</strong>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#4A5B50', marginBottom: '24px' }}>
              Our LFPC farm representative will connect with you shortly for packaging and delivery updates.
            </p>
            <button onClick={onClose} className="btn btn-primary">
              Return to Farm Store
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-green">LFPC Direct Delivery</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>
              Complete Your Order
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#7A8B80', marginBottom: '24px' }}>
              Please provide your delivery details below to confirm dispatch.
            </p>

            {errorMsg && (
              <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', color: '#B91C1C', padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={paymentMethod === 'WHATSAPP' ? handleWhatsAppCheckout : handleRazorpayCheckout}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    placeholder="e.g. Jaspreet Singh"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  placeholder="House/Plot no., Street, Village/Colony"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">City / District</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="e.g. 125050"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Order Notes / Landmark (Optional)</label>
                <input
                  type="text"
                  name="notes"
                  placeholder="e.g. Deliver before 10 AM, near Gurdwara"
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* Payment Method Selector */}
              <div style={{ marginTop: '20px', marginBottom: '24px' }}>
                <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>
                  Select Checkout Method:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {/* WhatsApp Option */}
                  <div
                    onClick={() => setPaymentMethod('WHATSAPP')}
                    style={{
                      border: paymentMethod === 'WHATSAPP' ? '2px solid #1EBE5D' : '1px solid #E7E3D4',
                      background: paymentMethod === 'WHATSAPP' ? '#F0FAF4' : '#FFFFFF',
                      borderRadius: '12px',
                      padding: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MessageCircle size={20} color="#1EBE5D" />
                      <strong style={{ fontSize: '0.92rem', color: '#122117' }}>1-Click WhatsApp</strong>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#7A8B80' }}>
                      Fastest order with direct support from LFPC
                    </span>
                  </div>

                  {/* Razorpay Option */}
                  <div
                    onClick={() => setPaymentMethod('RAZORPAY')}
                    style={{
                      border: paymentMethod === 'RAZORPAY' ? '2px solid #E59800' : '1px solid #E7E3D4',
                      background: paymentMethod === 'RAZORPAY' ? '#FEF9EE' : '#FFFFFF',
                      borderRadius: '12px',
                      padding: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CreditCard size={20} color="#E59800" />
                      <strong style={{ fontSize: '0.92rem', color: '#122117' }}>Pay via Razorpay</strong>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#7A8B80' }}>
                      UPI, Cards, NetBanking (Instant Confirmation)
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Total & Submit */}
              <div style={{ background: '#FAF9F3', border: '1px solid #E7E3D4', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#7A8B80' }}>Total Amount to Pay:</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0A3E22' }}>
                    ₹ {subtotal.toLocaleString('en-IN')}
                  </div>
                </div>
                <span className="badge badge-gold">Zero Convenience Fee</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={paymentMethod === 'WHATSAPP' ? 'btn btn-whatsapp' : 'btn btn-gold'}
                style={{ width: '100%', fontSize: '1rem', padding: '14px' }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing Order...</span>
                  </div>
                ) : paymentMethod === 'WHATSAPP' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageCircle size={18} />
                    <span>Send Order to WhatsApp (₹ {subtotal.toLocaleString('en-IN')})</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={18} />
                    <span>Pay Online via Razorpay (₹ {subtotal.toLocaleString('en-IN')})</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

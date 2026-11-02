import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="cart-backdrop" onClick={() => setIsCartOpen(false)} />

      {/* Drawer */}
      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="#15733E" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Your Farm Basket</h3>
            <span className="badge badge-green">{totalItems} items</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A8B80' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#F0FAF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShoppingBag size={32} color="#15733E" />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Your basket is empty</h4>
              <p style={{ fontSize: '0.9rem', color: '#7A8B80', marginBottom: '20px' }}>
                Explore our pure Desi Ghee, Pinnis, or organic manure to fill it up.
              </p>
              <button onClick={() => setIsCartOpen(false)} className="btn btn-secondary btn-sm">
                Continue Browsing
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.imageUrl} alt={item.title} className="cart-item-img" />
                <div style={{ flexGrow: 1 }}>
                  <div className="font-gurmukhi" style={{ fontSize: '0.78rem', color: '#15733E' }}>
                    {item.titlePunjabi}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#122117', marginBottom: '4px' }}>
                    {item.title}
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: '#7A8B80', marginBottom: '8px' }}>
                    ₹ {item.price.toLocaleString('en-IN')} / {item.unit}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E7E3D4', borderRadius: '20px', background: '#FFFFFF' }}>
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '24px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '1rem', color: '#4A5B50' }}>Total Estimated Amount:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0A3E22' }}>
                ₹ {subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button onClick={handleCheckoutClick} className="btn btn-gold" style={{ width: '100%', fontSize: '1.05rem' }}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

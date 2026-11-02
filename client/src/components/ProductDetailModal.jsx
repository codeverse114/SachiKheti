import React, { useState } from 'react';
import { X, ShoppingBag, MessageCircle, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ product, onClose }) {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  let parsedSpecs = {};
  try {
    if (product.specs) {
      parsedSpecs = typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs;
    }
  } catch (e) {
    parsedSpecs = {};
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleWhatsAppOrder = () => {
    const total = product.price * quantity;
    const msg = encodeURIComponent(
      `Hello SachiKheti (LFPC) Team!\nI would like to order:\n- *${product.title}* (${product.titlePunjabi})\n- Quantity: ${quantity} x ${product.unit}\n- Estimated Price: ₹${total.toLocaleString('en-IN')}\n\nPlease let me know the delivery timeframe to my address.`
    );
    window.open(`https://wa.me/918295886832?text=${msg}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#7A8B80',
          }}
        >
          <X size={22} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
          {/* Image */}
          <div>
            <img
              src={product.imageUrl}
              alt={product.title}
              style={{
                width: '100%',
                height: '320px',
                objectFit: 'cover',
                borderRadius: '16px',
                border: '1px solid #E7E3D4',
              }}
            />
          </div>

          {/* Details */}
          <div>
            <div className="font-gurmukhi" style={{ fontSize: '1.1rem', color: '#15733E', marginBottom: '6px' }}>
              {product.titlePunjabi}
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px' }}>
              {product.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <span className="badge badge-green">In Stock ({product.stockCount} available)</span>
              <span className="badge badge-gold">LFPC Guaranteed</span>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <span style={{ fontSize: '0.85rem', color: '#7A8B80' }}>Price per {product.unit}:</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0A3E22' }}>
                ₹ {product.price.toLocaleString('en-IN')}
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#4A5B50', marginBottom: '20px', lineHeight: 1.5 }}>
              {product.description}
            </p>

            {/* Specs Table */}
            {Object.keys(parsedSpecs).length > 0 && (
              <div style={{ background: '#FAF9F3', borderRadius: '12px', padding: '14px', marginBottom: '24px', border: '1px solid #E7E3D4' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#B46F00', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Specifications & Purity
                </div>
                {Object.entries(parsedSpecs).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '4px 0', borderBottom: '1px dashed #E7E3D4' }}>
                    <span style={{ color: '#7A8B80' }}>{key}:</span>
                    <strong style={{ color: '#122117' }}>{String(val)}</strong>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Stepper & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E7E3D4', borderRadius: '30px', background: '#FFFFFF' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '36px', height: '36px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  -
                </button>
                <span style={{ width: '36px', textAlign: 'center', fontWeight: 'bold' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '36px', height: '36px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  +
                </button>
              </div>

              <button onClick={handleAddToCart} className="btn btn-primary" style={{ flexGrow: 1 }}>
                <ShoppingBag size={18} />
                <span>Add to Cart (₹ {(product.price * quantity).toLocaleString('en-IN')})</span>
              </button>
            </div>

            <button onClick={handleWhatsAppOrder} className="btn btn-whatsapp" style={{ width: '100%' }}>
              <MessageCircle size={18} />
              <span>Instant Order via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

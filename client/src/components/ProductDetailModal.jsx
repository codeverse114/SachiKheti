import React, { useState } from 'react';
import { X, ShoppingBag, MessageCircle, ShieldCheck, Check } from 'lucide-react';
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
      <div className="modal-content product-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close modal"
        >
          <X size={22} />
        </button>

        <div className="product-detail-grid">
          {/* Image */}
          <div className="product-detail-img-col">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="product-detail-img"
            />
          </div>

          {/* Details */}
          <div className="product-detail-info-col">
            <div className="font-gurmukhi product-detail-punjabi">
              {product.titlePunjabi}
            </div>
            <h2 className="product-detail-title">
              {product.title}
            </h2>

            <div className="product-detail-badges">
              <span className="badge badge-green">In Stock ({product.stockCount} available)</span>
              <span className="badge badge-gold">LFPC Guaranteed</span>
            </div>

            <div className="product-detail-price-box">
              <span className="product-detail-unit-label">Price per {product.unit}:</span>
              <div className="product-detail-price">
                ₹ {product.price.toLocaleString('en-IN')}
              </div>
            </div>

            <p className="product-detail-desc">
              {product.description}
            </p>

            {/* Specs Table */}
            {Object.keys(parsedSpecs).length > 0 && (
              <div className="product-specs-box">
                <div className="product-specs-title">
                  Specifications & Purity
                </div>
                {Object.entries(parsedSpecs).map(([key, val]) => (
                  <div key={key} className="product-specs-row">
                    <span className="product-specs-key">{key}:</span>
                    <strong className="product-specs-val">{String(val)}</strong>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Stepper & Actions */}
            <div className="product-detail-actions-row">
              <div className="product-quantity-stepper">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="product-stepper-btn"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="product-stepper-val">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="product-stepper-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button onClick={handleAddToCart} className="btn btn-primary product-detail-cart-btn">
                <ShoppingBag size={18} />
                <span>Add to Cart (₹ {(product.price * quantity).toLocaleString('en-IN')})</span>
              </button>
            </div>

            <button onClick={handleWhatsAppOrder} className="btn btn-whatsapp product-detail-whatsapp-btn">
              <MessageCircle size={18} />
              <span>Instant Order via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

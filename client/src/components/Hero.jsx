import React from 'react';
import { ArrowRight, MessageCircle, CheckCircle2, Leaf } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  const openDirectWhatsApp = () => {
    const text = encodeURIComponent("Hello SachiKheti (LFPC) Team! I would like to inquire about your pure farm products and place an order.");
    window.open(`https://wa.me/918295886832?text=${text}`, '_blank');
  };

  return (
    <section className="hero-section">
      <div className="container hero-grid">
        {/* Left Column: Brand Story & CTAs */}
        <div>
          <div className="hero-tagline-pill">
            <Leaf size={16} color="#15733E" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0A3E22' }}>
              LAMMA FARMER PRODUCER CO. LTD.
            </span>
            <span className="badge badge-gold" style={{ marginLeft: '4px' }}>100% PURE</span>
          </div>

          <h1 className="hero-h1">
            Pure From Soil to Soul.{' '}
            <span className="text-gradient-gold">ਸੱਚੀ ਖੇਤੀ</span> Direct to Your Home.
          </h1>

          <div className="hero-punjabi-quote font-gurmukhi">
            "ਚੰਗੀ ਸੋਚ ਸਖ਼ਤ ਮਿਹਨਤ, ਫਿਰ ਹੁੰਦੀ ਰੱਬ ਦੀ ਰਹਿਮਤ"
          </div>

          <p className="hero-desc">
            Directly empowered by the farmers of <strong>Lamma Farmer Producer Co. Ltd. (LFPC)</strong>. 
            Enjoy authentic Vedic Bilona cow ghee, fresh A2 dairy, pure desi ghee pinnis, nutrient-dense organic 
            vermicompost, and certified agricultural machinery — free from chemicals and middleman markups.
          </p>

          <div className="hero-cta-group">
            <button onClick={onExploreClick} className="btn btn-primary">
              <span>Explore Products</span>
              <ArrowRight size={18} />
            </button>

            <button onClick={openDirectWhatsApp} className="btn btn-whatsapp">
              <MessageCircle size={18} />
              <span>Order on WhatsApp</span>
            </button>

            <a href="#story" className="btn btn-secondary">
              <span>LFPC Story</span>
            </a>
          </div>

          {/* Value Badges */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '36px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#15733E" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4A5B50' }}>Vedic Bilona Churned</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#15733E" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4A5B50' }}>100% Chemical-Free</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#15733E" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4A5B50' }}>Fair Farmer Prosperity</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Brand Card */}
        <div className="hero-image-wrapper">
          <div className="hero-logo-card">
            <img
              src="/assets/brand/sachi-kheti-logo-full.jpg"
              alt="Sachi Kheti Official Brand Logo"
              className="hero-logo-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

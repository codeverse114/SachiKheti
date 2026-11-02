import React, { useState, useEffect } from 'react';
import { ShoppingBag, ShieldCheck, Truck, Menu, X, MessageCircle, ChevronRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

const BRAND_NAMES = [
  { text: 'SachiKheti', lang: 'English', className: 'font-main' },
  { text: 'ਸੱਚੀ ਖੇਤੀ', lang: 'ਪੰਜਾਬੀ', className: 'font-gurmukhi' },
  { text: 'सच्ची खेती', lang: 'हिन्दी', className: 'font-hindi' },
];

export default function Navbar({ currentPath = '/', onNavigate, onOpenAdmin, onOpenTracker, onSelectCategory }) {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);

  // Circular loop interval cycling every 2.4 seconds: English -> Punjabi -> Hindi
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBrandIndex((prevIndex) => (prevIndex + 1) % BRAND_NAMES.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (categorySlug) => {
    onSelectCategory(categorySlug);
    setMobileMenuOpen(false);
    const catalogElem = document.getElementById('catalog');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentBrand = BRAND_NAMES[currentBrandIndex];

  return (
    <>
      <header className="navbar">
        <div className="container nav-container">
          {/* Brand Lockup with Circular Rolling Loop */}
          <a
            href="/"
            className="nav-logo-group"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('/');
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src="/assets/brand/sachi-kheti-emblem.jpg"
              alt="SachiKheti Emblem"
              className="nav-logo-img"
            />
            <div className="nav-title-box">
              <span
                key={currentBrandIndex}
                className={`nav-rotating-title ${currentBrand.className}`}
              >
                {currentBrand.text}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              <li>
                <a href="#catalog" className="nav-link" onClick={() => handleNavClick('all')}>
                  All Products
                </a>
              </li>
              <li>
                <a href="#catalog" className="nav-link" onClick={() => handleNavClick('dairy')}>
                  Pure Dairy
                </a>
              </li>
              <li>
                <a href="#catalog" className="nav-link" onClick={() => handleNavClick('sweets')}>
                  Desi Sweets
                </a>
              </li>
              <li>
                <a href="#catalog" className="nav-link" onClick={() => handleNavClick('manure')}>
                  Organic Manure
                </a>
              </li>
              <li>
                <a href="#catalog" className="nav-link" onClick={() => handleNavClick('machinery')}>
                  Machinery
                </a>
              </li>
              <li>
                <a
                  href="/story"
                  className={`nav-link ${currentPath === '/story' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('/story');
                  }}
                >
                  Our Story
                </a>
              </li>
            </ul>
          </nav>

          {/* Action Controls */}
          <div className="nav-actions">
            {/* Order Tracker Button (Desktop & Tablet) */}
            <button
              onClick={onOpenTracker}
              className="btn btn-secondary btn-sm nav-hide-mobile"
              title="Track Order by Order ID"
            >
              <Truck size={16} color="#15733E" />
              <span>Track Order</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="cart-btn"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag size={18} />
              <span className="cart-text">Cart</span>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>

            {/* Superadmin Button (Desktop & Tablet) */}
            <button
              onClick={onOpenAdmin}
              className="btn btn-gold btn-sm nav-hide-mobile"
              title="Superadmin Login"
            >
              <ShieldCheck size={16} />
              <span>Admin</span>
            </button>

            {/* Mobile menu hamburger (Mobile & Tablet) */}
            <button
              className="nav-mobile-toggle"
              aria-label="Toggle Mobile Navigation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`mobile-nav-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Drawer Header */}
        <div className="mobile-nav-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/assets/brand/sachi-kheti-emblem.jpg"
              alt="SachiKheti Emblem"
              style={{ width: '38px', height: '38px', borderRadius: '8px' }}
            />
            <div>
              <div className="font-gurmukhi" style={{ fontSize: '1.15rem', color: '#15733E', lineHeight: 1.1 }}>
                ਸੱਚੀ ਖੇਤੀ
              </div>
              <div style={{ fontSize: '0.72rem', color: '#7A8B80', letterSpacing: '0.04em' }}>
                LFPC Agricultural Store
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-close-btn"
            aria-label="Close Menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer Body: Category Navigation */}
        <div className="mobile-nav-body">
          <div className="mobile-nav-section-title">Product Categories</div>
          <ul className="mobile-nav-list">
            <li>
              <button onClick={() => handleNavClick('all')} className="mobile-nav-item">
                <span>🌾 All Farm Products</span>
                <ChevronRight size={16} color="#7A8B80" />
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('dairy')} className="mobile-nav-item">
                <span>🥛 Pure Desi Cow Dairy & A2 Milk</span>
                <ChevronRight size={16} color="#7A8B80" />
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('sweets')} className="mobile-nav-item">
                <span>🍯 Traditional Desi Sweets & Pinnis</span>
                <ChevronRight size={16} color="#7A8B80" />
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('manure')} className="mobile-nav-item">
                <span>🌱 Organic Vermicompost & Fertilizers</span>
                <ChevronRight size={16} color="#7A8B80" />
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('machinery')} className="mobile-nav-item">
                <span>🚜 Farming Machinery & Tools</span>
                <ChevronRight size={16} color="#7A8B80" />
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('produce')} className="mobile-nav-item">
                <span>🌻 Raw Mustard Oil & Forest Honey</span>
                <ChevronRight size={16} color="#7A8B80" />
              </button>
            </li>
            <li>
              <button
                className={`mobile-nav-item ${currentPath === '/story' ? 'active' : ''}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigate) onNavigate('/story');
                }}
              >
                <span>📖 Our Heritage & Story</span>
                <ChevronRight size={16} color="#7A8B80" />
              </button>
            </li>
          </ul>

          <div className="mobile-nav-section-title" style={{ marginTop: '20px' }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracker();
              }}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Truck size={17} color="#15733E" />
              <span>Track Your Order</span>
            </button>

            <a
              href="https://wa.me/918295886832?text=Hello%20SachiKheti!%20I%20would%20like%20to%20inquire%20about%20your%20products."
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageCircle size={17} />
              <span>Direct WhatsApp Order</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <ShieldCheck size={17} />
              <span>Superadmin Portal</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="mobile-nav-footer">
          <p className="font-gurmukhi" style={{ color: '#0A3E22', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', marginBottom: '4px' }}>
            "ਚੰਗੀ ਸੋਚ ਸਖ਼ਤ ਮਿਹਨਤ, ਫਿਰ ਹੁੰਦੀ ਰੱਬ ਦੀ ਰਹਿਮਤ"
          </p>
          <div style={{ fontSize: '0.72rem', color: '#7A8B80', textAlign: 'center' }}>
            LFPC Ltd. • Fatehabad, Haryana
          </div>
        </div>
      </aside>
    </>
  );
}

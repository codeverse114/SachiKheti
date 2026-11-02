import React, { useState, useEffect } from 'react';
import { ShoppingBag, ShieldCheck, Search, Truck, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

const BRAND_NAMES = [
  { text: 'SachiKheti', lang: 'English', className: 'font-main' },
  { text: 'ਸੱਚੀ ਖੇਤੀ', lang: 'ਪੰਜਾਬੀ', className: 'font-gurmukhi' },
  { text: 'सच्ची खेती', lang: 'हिन्दी', className: 'font-hindi' },
];

export default function Navbar({ onOpenAdmin, onOpenTracker, onSelectCategory }) {
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
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand Lockup with Circular Rolling Loop */}
        <a href="#" className="nav-logo-group" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
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
        <nav>
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
              <a href="#story" className="nav-link">
                Our Story
              </a>
            </li>
          </ul>
        </nav>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Order Tracker Button */}
          <button
            onClick={onOpenTracker}
            className="btn btn-secondary btn-sm"
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
            <ShoppingBag size={19} />
            <span>Cart</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          {/* Superadmin Button */}
          <button
            onClick={onOpenAdmin}
            className="btn btn-gold btn-sm"
            title="Superadmin Login"
          >
            <ShieldCheck size={16} />
            <span>Admin</span>
          </button>

          {/* Mobile menu hamburger */}
          <button
            className="btn btn-secondary btn-sm"
            style={{ display: 'none' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

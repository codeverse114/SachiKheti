import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer({ onNavigate, onSelectCategory }) {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col">
            <div className="footer-brand-header">
              <img
                src="/assets/brand/sachi-kheti-emblem.jpg"
                alt="SachiKheti"
                className="footer-brand-logo"
              />
              <div>
                <div className="font-gurmukhi footer-brand-name">
                  ਸੱਚੀ ਖੇਤੀ
                </div>
                <div className="footer-brand-sub">
                  by LFPC (Lamma Farmer Producer Co. Ltd.)
                </div>
              </div>
            </div>

            <p className="font-gurmukhi footer-slogan">
              "ਚੰਗੀ ਸੋਚ ਸਖ਼ਤ ਮਿਹਨਤ, ਫਿਰ ਹੁੰਦੀ ਰੱਬ ਦੀ ਰਹਿਮਤ"
            </p>

            <p className="footer-desc">
              An authentic agricultural producer company initiative empowering 400+ farmer families to deliver
              chemical-free Vedic Bilona cow ghee, pure sweets, and certified farming tools.
            </p>

            <a
              href="https://wa.me/918295886832"
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp btn-sm footer-whatsapp-btn"
            >
              <MessageCircle size={15} />
              <span>Connect on WhatsApp</span>
            </a>
          </div>

          {/* Catalog Categories */}
          <div className="footer-col">
            <h4 className="footer-col-title">
              Product Catalog
            </h4>
            <ul className="footer-links-list">
              <li>
                <a href="#catalog" onClick={() => onSelectCategory('dairy')} className="footer-link">
                  Pure Cow Ghee & A2 Dairy
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={() => onSelectCategory('sweets')} className="footer-link">
                  Desi Ghee Atta Pinnis & Sweets
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={() => onSelectCategory('manure')} className="footer-link">
                  Organic Vermicompost & Fertilizers
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={() => onSelectCategory('machinery')} className="footer-link">
                  Tractor Rotavators & Sprayers
                </a>
              </li>
              <li>
                <a
                  href="/story"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('/story');
                    else window.location.href = '/story';
                  }}
                  className="footer-link"
                >
                  Our Heritage & Cooperative Story
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={() => onSelectCategory('produce')} className="footer-link">
                  Raw Mustard Oil & Forest Honey
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="footer-col">
            <h4 className="footer-col-title">
              Farmer Producer Office
            </h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <MapPin size={18} color="#FBBF24" className="footer-contact-icon" />
                <span>1st Floor, Aggerwal Colony, Fatehabad, Haryana, India - 125050</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={18} color="#FBBF24" className="footer-contact-icon" />
                <a href="tel:+918295886832" className="footer-link-active">+91-8295886832</a>
              </div>
              <div className="footer-contact-item">
                <Mail size={18} color="#FBBF24" className="footer-contact-icon" />
                <a href="mailto:codeverse114@gmail.com" className="footer-link-active">codeverse114@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} SachiKheti (LFPC Ltd.). All rights reserved.
          </div>
          <div className="footer-bottom-links">
            <span style={{ color: '#FBBF24' }}>100% Direct Farmer Produce</span>
            <span>•</span>
            <span>FSSAI Certified Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { Phone, Mail, MapPin, Heart, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';

export default function Footer({ onSelectCategory }) {
  return (
    <footer style={{ backgroundColor: '#052112', color: '#E3F5EA', paddingTop: '70px', paddingBottom: '40px', borderTop: '4px solid #E59800' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '50px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src="/assets/brand/sachi-kheti-emblem.jpg"
                alt="SachiKheti"
                style={{ width: '50px', height: '50px', borderRadius: '10px' }}
              />
              <div>
                <div className="font-gurmukhi" style={{ fontSize: '1.4rem', color: '#FBBF24', lineHeight: 1.1 }}>
                  ਸੱਚੀ ਖੇਤੀ
                </div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.06em', color: '#81C784' }}>
                  by LFPC (Lamma Farmer Producer Co. Ltd.)
                </div>
              </div>
            </div>

            <p className="font-gurmukhi" style={{ fontSize: '1.05rem', color: '#FCD34D', marginBottom: '14px' }}>
              "ਚੰਗੀ ਸੋਚ ਸਖ਼ਤ ਮਿਹਨਤ, ਫਿਰ ਹੁੰਦੀ ਰੱਬ ਦੀ ਰਹਿਮਤ"
            </p>

            <p style={{ fontSize: '0.88rem', color: '#A5D6A7', lineHeight: 1.6, marginBottom: '20px' }}>
              An authentic agricultural producer company initiative empowering 400+ farmer families to deliver
              chemical-free Vedic Bilona cow ghee, pure sweets, and certified farming tools.
            </p>

            <a
              href="https://wa.me/918295886832"
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp btn-sm"
            >
              <MessageCircle size={15} />
              <span>Connect on WhatsApp</span>
            </a>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '18px', borderBottom: '2px solid #15733E', paddingBottom: '8px', display: 'inline-block' }}>
              Product Catalog
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li>
                <a href="#catalog" onClick={() => onSelectCategory('dairy')} style={{ color: '#A5D6A7' }} onMouseEnter={(e) => e.target.style.color = '#FBBF24'} onMouseLeave={(e) => e.target.style.color = '#A5D6A7'}>
                  Pure Cow Ghee & A2 Dairy
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={() => onSelectCategory('sweets')} style={{ color: '#A5D6A7' }} onMouseEnter={(e) => e.target.style.color = '#FBBF24'} onMouseLeave={(e) => e.target.style.color = '#A5D6A7'}>
                  Desi Ghee Atta Pinnis & Sweets
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={() => onSelectCategory('manure')} style={{ color: '#A5D6A7' }} onMouseEnter={(e) => e.target.style.color = '#FBBF24'} onMouseLeave={(e) => e.target.style.color = '#A5D6A7'}>
                  Organic Vermicompost & Fertilizers
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={() => onSelectCategory('machinery')} style={{ color: '#A5D6A7' }} onMouseEnter={(e) => e.target.style.color = '#FBBF24'} onMouseLeave={(e) => e.target.style.color = '#A5D6A7'}>
                  Tractor Rotavators & Sprayers
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={() => onSelectCategory('produce')} style={{ color: '#A5D6A7' }} onMouseEnter={(e) => e.target.style.color = '#FBBF24'} onMouseLeave={(e) => e.target.style.color = '#A5D6A7'}>
                  Raw Mustard Oil & Forest Honey
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '18px', borderBottom: '2px solid #15733E', paddingBottom: '8px', display: 'inline-block' }}>
              Farmer Producer Office
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: '#A5D6A7' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="#FBBF24" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>1st Floor, Aggerwal Colony, Fatehabad, Haryana, India - 125050</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#FBBF24" style={{ flexShrink: 0 }} />
                <span>+91-8295886832</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#FBBF24" style={{ flexShrink: 0 }} />
                <span>codeverse114@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits Bar */}
        <div style={{ borderTop: '1px solid rgba(227, 245, 234, 0.15)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.82rem', color: '#81C784' }}>
          <div>
            © {new Date().getFullYear()} <strong>SachiKheti</strong> (Lamma Farmer Producer Co. Ltd.). All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Crafted with pride by</span>
            <strong style={{ color: '#FBBF24' }}>CodeVerse</strong>
          </div>
        </div>
      </div>
    </footer>
  );
}

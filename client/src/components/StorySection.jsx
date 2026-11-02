import React from 'react';
import { ShieldCheck, Users, Sun, Heart, Check, Sparkles } from 'lucide-react';

export default function StorySection() {
  return (
    <section id="story" style={{ padding: '80px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid #E7E3D4' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
          <span className="badge badge-green" style={{ marginBottom: '12px' }}>
            <Sparkles size={14} color="#15733E" />
            Our Heritage & Roots
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px' }}>
            The Story Behind <span className="text-gradient-green font-gurmukhi">ਸੱਚੀ</span>{' '}
            <span className="text-gradient-gold font-gurmukhi">ਖੇਤੀ</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#4A5B50' }}>
            Founded under <strong>Lamma Farmer Producer Co. Ltd. (LFPC)</strong>, SachiKheti was born out of a collective
            promise: bringing uncompromised purity to Indian households while delivering fair value back to the farmers who till the land.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginBottom: '60px' }}>
          <div className="card-glass" style={{ padding: '32px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(21, 115, 62, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Sun size={28} color="#15733E" />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', color: '#0A3E22' }}>
              Authentic Vedic Traditions
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#4A5B50' }}>
              We reject industrial chemical shortcuts. Our pure cow ghee is slow-churned using the ancestral 
              <strong> Bilona method</strong> (curd-to-butter-to-ghee), preserving natural micro-nutrients, omega fatty acids, and divine golden aroma.
            </p>
          </div>

          <div className="card-glass" style={{ padding: '32px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(229, 152, 0, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Users size={28} color="#B46F00" />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', color: '#0A3E22' }}>
              Farmer-Owned Cooperative
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#4A5B50' }}>
              LFPC unites over 400 dedicated farming families across rural Punjab and Haryana. Every rupee spent supports organic soil enrichment,
              fair dairy pricing, and sustainable local village economies.
            </p>
          </div>

          <div className="card-glass" style={{ padding: '32px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(21, 115, 62, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <ShieldCheck size={28} color="#15733E" />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', color: '#0A3E22' }}>
              Guaranteed Zero Adulteration
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#4A5B50' }}>
              From lab-tested raw organic mustard oil to chemical-free vermicompost and fresh A2 milk, our produce undergoes strict batch testing.
              True farming means complete honesty in every harvest.
            </p>
          </div>
        </div>

        {/* LFPC Metric Bar */}
        <div style={{
          background: 'var(--gradient-forest)',
          borderRadius: '24px',
          padding: '40px',
          color: '#FFFFFF',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          textAlign: 'center',
          boxShadow: '0 20px 40px -10px rgba(10, 62, 34, 0.35)',
        }}>
          <div>
            <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FBBF24' }}>400+</div>
            <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>Registered LFPC Farmers</div>
          </div>
          <div>
            <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FBBF24' }}>100%</div>
            <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>Pure & Chemical-Free</div>
          </div>
          <div>
            <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FBBF24' }}>25k+</div>
            <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>Litres Bilona Ghee Delivered</div>
          </div>
          <div>
            <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FBBF24' }}>15+</div>
            <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>Rural Villages Empowered</div>
          </div>
        </div>
      </div>
    </section>
  );
}

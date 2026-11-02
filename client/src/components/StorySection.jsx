import React from 'react';
import { ShieldCheck, Users, Sun } from 'lucide-react';

export default function StorySection() {
  return (
    <section id="story" className="story-section">
      <div className="container">
        {/* Section Header */}
        <div className="story-header">
          <h2 className="story-h2">
            The Story Behind <span className="text-gradient-green font-gurmukhi">ਸੱਚੀ</span>{' '}
            <span className="text-gradient-gold font-gurmukhi">ਖੇਤੀ</span>
          </h2>
          <p className="story-subtitle">
            Founded under <strong>Lamma Farmer Producer Co. Ltd. (LFPC)</strong>, SachiKheti was born out of a collective
            promise: bringing uncompromised purity to Indian households while delivering fair value back to the farmers who till the land.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="story-pillars-grid">
          <div className="card-glass story-pillar-card">
            <div className="story-pillar-icon green">
              <Sun size={28} color="#15733E" />
            </div>
            <h3 className="story-pillar-title">
              Authentic Vedic Traditions
            </h3>
            <p className="story-pillar-desc">
              We reject industrial chemical shortcuts. Our pure cow ghee is slow-churned using the ancestral 
              <strong> Bilona method</strong> (curd-to-butter-to-ghee), preserving natural micro-nutrients, omega fatty acids, and divine golden aroma.
            </p>
          </div>

          <div className="card-glass story-pillar-card">
            <div className="story-pillar-icon gold">
              <Users size={28} color="#B46F00" />
            </div>
            <h3 className="story-pillar-title">
              Farmer-Owned Cooperative
            </h3>
            <p className="story-pillar-desc">
              LFPC unites over 400 dedicated farming families across rural Punjab and Haryana. Every rupee spent supports organic soil enrichment,
              fair dairy pricing, and sustainable local village economies.
            </p>
          </div>

          <div className="card-glass story-pillar-card">
            <div className="story-pillar-icon green">
              <ShieldCheck size={28} color="#15733E" />
            </div>
            <h3 className="story-pillar-title">
              Guaranteed Zero Adulteration
            </h3>
            <p className="story-pillar-desc">
              From lab-tested raw organic mustard oil to chemical-free vermicompost and fresh A2 milk, our produce undergoes strict batch testing.
              True farming means complete honesty in every harvest.
            </p>
          </div>
        </div>

        {/* LFPC Metric Bar */}
        <div className="story-metrics-bar">
          <div className="story-metric-item">
            <div className="story-metric-number">400+</div>
            <div className="story-metric-label">Registered LFPC Farmers</div>
          </div>
          <div className="story-metric-item">
            <div className="story-metric-number">100%</div>
            <div className="story-metric-label">Pure & Chemical-Free</div>
          </div>
          <div className="story-metric-item">
            <div className="story-metric-number">25k+</div>
            <div className="story-metric-label">Litres Bilona Ghee Delivered</div>
          </div>
          <div className="story-metric-item">
            <div className="story-metric-number">15+</div>
            <div className="story-metric-label">Rural Villages Empowered</div>
          </div>
        </div>
      </div>
    </section>
  );
}

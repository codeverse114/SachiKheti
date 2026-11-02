import React, { useEffect } from 'react';
import { ShieldCheck, Users, Sun, ArrowRight, MessageCircle, Heart, Award, CheckCircle2 } from 'lucide-react';

export default function StoryPage({ onExploreClick }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openDirectWhatsApp = () => {
    const text = encodeURIComponent("Hello SachiKheti (LFPC) Team! I read your inspiring story and would like to order pure farm produce.");
    window.open(`https://wa.me/918295886832?text=${text}`, '_blank');
  };

  return (
    <div className="story-page-wrapper">
      {/* Story Hero Header */}
      <section className="story-hero-section">
        <div className="container">
          <div className="story-hero-header">
            <h1 className="story-page-h1">
              The Story Behind <span className="text-gradient-green font-gurmukhi">ਸੱਚੀ</span>{' '}
              <span className="text-gradient-gold font-gurmukhi">ਖੇਤੀ</span>
            </h1>

            <div className="story-page-quote font-gurmukhi">
              "ਚੰਗੀ ਸੋਚ ਸਖ਼ਤ ਮਿਹਨਤ, ਫਿਰ ਹੁੰਦੀ ਰੱਬ ਦੀ ਰਹਿਮਤ"
            </div>

            <p className="story-page-lead">
              Founded under <strong>Lamma Farmer Producer Co. Ltd. (LFPC)</strong>, SachiKheti is a farmer-owned mission 
              to restore complete purity and trust to Indian kitchens while delivering dignity and fair earnings back 
              to the farming families of rural Punjab and Haryana.
            </p>
          </div>
        </div>
      </section>

      {/* Main Narrative & 3 Core Pillars */}
      <section className="story-content-section">
        <div className="container">
          <div className="story-pillars-grid">
            <div className="card-glass story-pillar-card">
              <div className="story-pillar-icon green">
                <Sun size={28} color="#15733E" />
              </div>
              <h3 className="story-pillar-title">
                Authentic Vedic Traditions
              </h3>
              <p className="story-pillar-desc">
                We reject modern industrial chemical shortcuts. Our pure cow ghee is slow-churned using the ancestral 
                <strong> Bilona method</strong> (whole milk curd churned to makkhan, then slow-simmered into liquid gold), 
                preserving natural vitamins, omega fatty acids, and divine aroma.
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
                LFPC unites over 400 dedicated farming families. Every rupee spent directly supports regenerative organic farming,
                chemical-free dairy cultivation, and sustainable local village employment.
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
                From cold-pressed wood-churned mustard oil to high-potency organic vermicompost and fresh whole A2 cow milk, 
                every single batch undergoes rigorous lab tests for zero chemicals, zero palm oil, and zero preservatives.
              </p>
            </div>
          </div>

          {/* Deep Story Blocks */}
          <div className="story-deep-block">
            <div className="story-deep-text">
              <h2 className="story-section-title">
                Why We Started SachiKheti (ਸੱਚੀ ਖੇਤੀ)
              </h2>
              <p className="story-section-p">
                For decades, Indian families have struggled with market adulteration: synthetic ghee mixed with hydrogenated 
                palm oils, pesticide-laden produce, and ultra-processed dairy stripped of natural nutrition. Simultaneously, 
                the hardworking farmers who toil under the scorching sun were exploited by layers of middlemen.
              </p>
              <p className="story-section-p">
                In 2026, the farmers of <strong>Lamma Farmer Producer Co. Ltd. (LFPC)</strong> decided to take matters into their own hands. 
                We created <strong>SachiKheti</strong> — which literally translates to <em>"True & Honest Farming"</em>. 
                By connecting our farm gates directly to your dining table via digital commerce and WhatsApp dispatch, we ensure 
                you receive unadulterated nutrition while our rural growers receive fair, honorable prosperity.
              </p>

              <div className="story-highlights-list">
                <div className="story-highlight-item">
                  <CheckCircle2 size={18} color="#15733E" className="story-highlight-icon" />
                  <span>100% Desi Cow Breed Milk (Grass-fed, ethically raised)</span>
                </div>
                <div className="story-highlight-item">
                  <CheckCircle2 size={18} color="#15733E" className="story-highlight-icon" />
                  <span>Traditional Wooden Kolhu (Cold-Pressed) Seed Extraction</span>
                </div>
                <div className="story-highlight-item">
                  <CheckCircle2 size={18} color="#15733E" className="story-highlight-icon" />
                  <span>Certified High-Nutrient Organic Manure for Superior Soil Health</span>
                </div>
              </div>
            </div>

            <div className="story-deep-media">
              <div className="story-brand-badge-card">
                <img
                  src="/assets/brand/sachi-kheti-logo-full.jpg"
                  alt="SachiKheti LFPC Seal of Authenticity"
                  className="story-badge-img"
                />
                <div className="story-badge-caption">
                  Official Seal of Lamma Farmer Producer Co. Ltd.
                </div>
              </div>
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

          {/* Bottom Call to Action */}
          <div className="story-cta-box">
            <h3 className="story-cta-title">
              Taste the Truth in Every Bite
            </h3>
            <p className="story-cta-sub">
              Experience the authentic taste of pure Vedic Desi Ghee, handmade Pinnis, and natural produce.
            </p>
            <div className="story-cta-buttons">
              <button onClick={onExploreClick} className="btn btn-primary btn-lg">
                <span>Explore Farm Products</span>
                <ArrowRight size={18} />
              </button>
              <button onClick={openDirectWhatsApp} className="btn btn-whatsapp btn-lg">
                <MessageCircle size={18} />
                <span>Order Direct on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


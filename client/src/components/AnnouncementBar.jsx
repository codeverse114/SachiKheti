import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

export default function AnnouncementBar() {
  const [banner, setBanner] = useState({
    title: '🌾 SachiKheti Festive Harvest Offer',
    message: 'Get 10% off on Pure Desi Ghee & Pinnis using code SACHI10! WhatsApp Direct Delivery available.',
  });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setBanner(data.data[0]);
        }
      })
      .catch(() => {});
  }, []);

  if (!visible) return null;

  return (
    <aside className="announcement-bar" role="banner" aria-label="Festive Announcement">
      <div className="announcement-content">
        <Sparkles size={13} color="#FBBF24" className="announcement-sparkle" />
        
        {/* Full text for Desktop & Tablet */}
        <span className="announcement-text-desktop">
          <strong>{banner.title}:</strong> {banner.message}
        </span>

        {/* Compact Single-line text for Mobile screens */}
        <span className="announcement-text-mobile">
          🌾 <strong>10% OFF:</strong> Use code <span className="announcement-code">SACHI10</span> • Pure Ghee & Sweets!
        </span>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="announcement-close-btn"
        aria-label="Dismiss announcement banner"
      >
        <X size={13} />
      </button>
    </aside>
  );
}

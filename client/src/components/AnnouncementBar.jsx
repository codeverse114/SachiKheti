import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

export default function AnnouncementBar() {
  const [banner, setBanner] = useState({
    title: '🌾 SachiKheti Harvest Offer',
    message: '100% Pure Vedic Desi Ghee & Pinnis | Direct Farmer Pricing & 1-Click WhatsApp Ordering!',
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
    <div className="announcement-bar">
      <Sparkles size={16} color="#FBBF24" />
      <span>
        <strong>{banner.title}:</strong> {banner.message}
      </span>
      <button
        onClick={() => setVisible(false)}
        style={{
          background: 'none',
          border: 'none',
          color: '#FFFFFF',
          cursor: 'pointer',
          marginLeft: '12px',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.8,
        }}
        title="Dismiss announcement"
      >
        <X size={15} />
      </button>
    </div>
  );
}

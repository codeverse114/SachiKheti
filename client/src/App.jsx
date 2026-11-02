import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StorySection from './components/StorySection';
import ProductCatalog from './components/ProductCatalog';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackModal from './components/OrderTrackModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

function MainApp() {
  const { isCheckoutOpen, setIsCheckoutOpen } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeProductDetail, setActiveProductDetail] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  const handleExploreClick = () => {
    const catalogElem = document.getElementById('catalog');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-root">
      {/* Top Promotional Announcement Ribbon */}
      <AnnouncementBar />

      {/* Main Navigation Header */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Hero Showcase with Logo & Punjabi Slogan */}
      <Hero onExploreClick={handleExploreClick} />

      {/* Brand Heritage & Cooperative Story */}
      <StorySection />

      {/* Dynamic Product Catalog across 5 Agricultural Categories */}
      <ProductCatalog
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenProductDetail={(prod) => setActiveProductDetail(prod)}
      />

      {/* Footer */}
      <Footer onSelectCategory={(cat) => setSelectedCategory(cat)} />

      {/* Modals & Drawers */}
      <CartDrawer />

      {isCheckoutOpen && (
        <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />
      )}

      {activeProductDetail && (
        <ProductDetailModal
          product={activeProductDetail}
          onClose={() => setActiveProductDetail(null)}
        />
      )}

      {isTrackerOpen && (
        <OrderTrackModal onClose={() => setIsTrackerOpen(false)} />
      )}

      {isAdminOpen && (
        <AdminDashboard onClose={() => setIsAdminOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StoryPage from './components/StoryPage';
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
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // Client-side URL route state for '/', '/story', and '/adminlog'
  const getInitialPath = () => {
    if (typeof window === 'undefined') return '/';
    const p = window.location.pathname.toLowerCase();
    if (p === '/adminlog') return '/adminlog';
    if (p === '/story' || p === '/our-story') return '/story';
    return '/';
  };

  const [currentPath, setCurrentPath] = useState(getInitialPath);
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname.toLowerCase() === '/adminlog';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = getInitialPath();
      setCurrentPath(path);
      if (path === '/adminlog') {
        setIsAdminOpen(true);
      } else {
        setIsAdminOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    setCurrentPath(path);
    if (path === '/adminlog') {
      setIsAdminOpen(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (currentPath === '/adminlog') {
      navigateTo('/');
    }
  };

  const handleExploreClick = () => {
    if (currentPath !== '/') {
      navigateTo('/');
      setTimeout(() => {
        const catalogElem = document.getElementById('catalog');
        if (catalogElem) {
          catalogElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const catalogElem = document.getElementById('catalog');
      if (catalogElem) {
        catalogElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    if (currentPath !== '/') {
      navigateTo('/');
      setTimeout(() => {
        const catalogElem = document.getElementById('catalog');
        if (catalogElem) {
          catalogElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const catalogElem = document.getElementById('catalog');
      if (catalogElem) {
        catalogElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="app-root">
      {/* Top Promotional Announcement Ribbon */}
      <AnnouncementBar />

      {/* Main Glass Navigation Header */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onSelectCategory={handleSelectCategory}
      />

      {/* Dedicated Page Routing */}
      {currentPath === '/story' ? (
        <StoryPage onExploreClick={handleExploreClick} />
      ) : (
        <>
          {/* Home Showcase */}
          <Hero
            onExploreClick={handleExploreClick}
            onNavigateStory={() => navigateTo('/story')}
          />

          {/* Dynamic Product Catalog across Agricultural Categories */}
          <ProductCatalog
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onOpenProductDetail={(prod) => setActiveProductDetail(prod)}
          />
        </>
      )}

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
        onSelectCategory={handleSelectCategory}
      />

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

      {/* Superadmin Portal - Hidden from public UI, accessible only via /adminlog */}
      {isAdminOpen && (
        <AdminDashboard onClose={handleCloseAdmin} />
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

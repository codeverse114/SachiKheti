import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, MessageCircle, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCatalog({ selectedCategory, onSelectCategory, onOpenProductDetail }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  const categories = [
    { id: 'all', label: 'All Products', punjabi: 'ਸਾਰੇ ਉਤਪਾਦ' },
    { id: 'dairy', label: 'Fresh Dairy', punjabi: 'ਤਾਜ਼ਾ ਡੇਅਰੀ' },
    { id: 'sweets', label: 'Traditional Sweets', punjabi: 'ਦੇਸੀ ਮਿਠਾਈਆਂ' },
    { id: 'manure', label: 'Organic Manure', punjabi: 'ਜੈਵਿਕ ਖਾਦ' },
    { id: 'machinery', label: 'Farming Machinery', punjabi: 'ਖੇਤੀ ਸੰਦ' },
    { id: 'produce', label: 'Oils & Honey', punjabi: 'ਸ਼ੁੱਧ ਤੇਲ ਤੇ ਸ਼ਹਿਦ' },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = '/api/products';
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleQuickWhatsApp = (product, e) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Hello SachiKheti! I want to order:\n- *${product.title}* (${product.titlePunjabi})\n- Price: ₹${product.price.toLocaleString('en-IN')} / ${product.unit}\n\nPlease confirm availability and delivery to my address.`
    );
    window.open(`https://wa.me/918295886832?text=${msg}`, '_blank');
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <section id="catalog" className="catalog-section">
      <div className="container">
        {/* Title & Search Bar */}
        <div className="catalog-header">
          <div className="catalog-title-col">
            <span className="badge badge-gold" style={{ marginBottom: '8px', display: 'inline-flex' }}>
              <Sparkles size={14} /> LFPC Certified Catalog
            </span>
            <h2 className="catalog-h2">
              Direct From Farm To Table
            </h2>
            <p className="catalog-subtitle">
              Handcrafted pure dairy, farm-grade fertilizers, and reliable agricultural machinery.
            </p>
          </div>

          {/* Search Box */}
          <div className="catalog-search-wrapper">
            <Search
              size={18}
              color="#7A8B80"
              className="catalog-search-icon"
            />
            <input
              type="text"
              placeholder="Search products or Punjabi names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input catalog-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="catalog-search-clear"
                aria-label="Clear Search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="catalog-filters-scroll">
          <div className="catalog-filters">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                <span>{cat.label}</span>
                <span className="filter-chip-punjabi font-gurmukhi">
                  ({cat.punjabi})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="catalog-state-box">
            <div className="catalog-loading-text">Loading fresh farm produce...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="catalog-empty-box">
            <h3 style={{ fontSize: '1.3rem', color: '#0A3E22', marginBottom: '8px' }}>No products found</h3>
            <p style={{ color: '#7A8B80' }}>Try adjusting your search query or switching categories.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => onOpenProductDetail(product)}
              >
                {/* Image */}
                <div className="product-image-container">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="product-image"
                    loading="lazy"
                  />
                  <div className="product-category-tag">
                    {product.category?.name || 'Produce'}
                  </div>
                  {product.featured && (
                    <div className="product-featured-tag">
                      ★ LFPC Choice
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="product-content">
                  <div className="product-title-punjabi font-gurmukhi">
                    {product.titlePunjabi}
                  </div>
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-desc">{product.description}</p>

                  <div className="product-footer">
                    <div className="product-price-box">
                      <span className="product-unit">{product.unit}</span>
                      <span className="product-price">₹ {product.price.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="product-actions">
                      <button
                        onClick={(e) => handleQuickWhatsApp(product, e)}
                        className="btn btn-whatsapp btn-sm product-action-btn"
                        title="Instant Order on WhatsApp"
                        aria-label="Order on WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </button>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="btn btn-primary btn-sm product-action-btn"
                        title="Add to Cart"
                        aria-label="Add to Cart"
                      >
                        <ShoppingBag size={16} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

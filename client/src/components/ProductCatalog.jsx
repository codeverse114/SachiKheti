import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, MessageCircle, Eye, Sparkles, Filter } from 'lucide-react';
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
    <section id="catalog" style={{ padding: '80px 0', backgroundColor: 'var(--bg-cream)' }}>
      <div className="container">
        {/* Title & Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
              <Sparkles size={14} /> LFPC Certified Catalog
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
              Direct From Farm To Table
            </h2>
            <p style={{ fontSize: '1rem', color: '#4A5B50' }}>
              Handcrafted pure dairy, farm-grade fertilizers, and reliable agricultural machinery.
            </p>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <Search
              size={18}
              color="#7A8B80"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search products or Punjabi names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '42px', borderRadius: 'var(--radius-full)' }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="catalog-filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              <span>{cat.label}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }} className="font-gurmukhi">
                ({cat.punjabi})
              </span>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '1.2rem', color: '#15733E', fontWeight: 600 }}>Loading fresh farm produce...</div>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#FFFFFF', borderRadius: '16px', border: '1px dashed #C67C00' }}>
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
                style={{ cursor: 'pointer' }}
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
                        className="btn btn-whatsapp btn-sm"
                        title="Instant Order on WhatsApp"
                      >
                        <MessageCircle size={15} />
                      </button>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="btn btn-primary btn-sm"
                        title="Add to Cart"
                      >
                        <ShoppingBag size={15} />
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

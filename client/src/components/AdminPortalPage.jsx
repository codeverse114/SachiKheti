import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  TrendingUp,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  Sparkles,
  X,
  AlertCircle,
  Search,
  Filter,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  Eye,
  Check,
  Layers,
  Megaphone,
  Menu,
  Phone,
  Truck,
  MapPin,
  Calendar
} from 'lucide-react';

export default function AdminPortalPage({ onNavigateHome }) {
  const [token, setToken] = useState(() => localStorage.getItem('sachikheti_admin_token') || '');
  const [adminUser, setAdminUser] = useState(null);

  // Login form state
  const [username, setUsername] = useState('SachiKhetiAdmin');
  const [password, setPassword] = useState('Sachi@Kheti123');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Navigation tab state: 'overview' | 'products' | 'orders' | 'categories' | 'banner'
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Live database state
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banner, setBanner] = useState({ id: 'welcome-banner-1', title: '', message: '', isActive: true });
  const [loadingData, setLoadingData] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Search & Filter controls
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Product Add / Edit Modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    title: '',
    titlePunjabi: '',
    categoryId: '',
    price: '',
    unit: '1 Litre',
    imageUrl: 'https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?auto=format&fit=crop&w=800&q=80',
    description: '',
    inStock: true,
    stockCount: 50,
    featured: false,
    specs: '',
  });

  // Verify token on mount
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAdminUser(data.admin);
            loadAllData();
          } else {
            handleLogout();
          }
        })
        .catch(() => handleLogout());
    }
  }, [token]);

  const loadAllData = async () => {
    try {
      setLoadingData(true);
      const headers = { Authorization: `Bearer ${token}` };

      const [ordersRes, productsRes, categoriesRes, bannerRes] = await Promise.all([
        fetch('/api/orders', { headers }).then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
        fetch('/api/banners').then(r => r.json()),
      ]);

      if (ordersRes.success) setOrders(ordersRes.data);
      if (productsRes.success) setProducts(productsRes.data);
      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (bannerRes.success && bannerRes.data.length > 0) {
        setBanner(bannerRes.data[0]);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoggingIn(true);
      setLoginError('');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('sachikheti_admin_token', data.token);
        setToken(data.token);
        setAdminUser(data.admin);
        loadAllData();
      } else {
        setLoginError(data.message || 'Invalid administrator credentials');
      }
    } catch (err) {
      setLoginError('Server connection failed. Please ensure backend is running.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sachikheti_admin_token');
    setToken('');
    setAdminUser(null);
  };

  const triggerSuccess = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  // Order status update
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
        triggerSuccess(`Order status updated to ${newStatus}`);
      }
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  // Save product (Create or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setSavingProduct(true);
      const method = editingProduct ? 'PUT' : 'POST';
      const endpoint = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productForm),
      });
      const data = await res.json();

      if (data.success) {
        setShowProductModal(false);
        setEditingProduct(null);
        loadAllData();
        triggerSuccess(editingProduct ? 'Product updated successfully!' : 'New product published to catalog!');
      } else {
        alert(data.message || 'Failed to save product');
      }
    } catch (err) {
      alert('Error communicating with database');
    } finally {
      setSavingProduct(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from the store catalog?`)) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        triggerSuccess(`Product "${title}" removed.`);
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  // Quick toggle product stock
  const handleToggleStock = async (product) => {
    try {
      const updatedStock = !product.inStock;
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inStock: updatedStock }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, inStock: updatedStock } : p));
        triggerSuccess(`Stock availability updated for "${product.title}"`);
      }
    } catch (err) {
      alert('Failed to toggle stock status');
    }
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      titlePunjabi: '',
      categoryId: categories.length > 0 ? categories[0].id : '',
      price: '',
      unit: '1 Litre',
      imageUrl: 'https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?auto=format&fit=crop&w=800&q=80',
      description: '',
      inStock: true,
      stockCount: 50,
      featured: false,
      specs: '',
    });
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      titlePunjabi: product.titlePunjabi || '',
      categoryId: product.categoryId,
      price: product.price,
      unit: product.unit,
      imageUrl: product.imageUrl,
      description: product.description || '',
      inStock: product.inStock,
      stockCount: product.stockCount,
      featured: product.featured,
      specs: typeof product.specs === 'string' ? product.specs : JSON.stringify(product.specs || {}),
    });
    setShowProductModal(true);
  };

  // Update festive banner
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/banners/${banner.id || 'welcome-banner-1'}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(banner),
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Announcement banner saved live!');
      } else {
        alert('Failed to update banner');
      }
    } catch (err) {
      alert('Error updating banner');
    }
  };

  // Metrics calculations
  const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'COMPLETED' ? o.totalAmount : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'PENDING').length;
  const deliveredOrdersCount = orders.filter(o => o.orderStatus === 'DELIVERED').length;
  const inStockProductsCount = products.filter(p => p.inStock).length;

  // Filtered lists
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedProductCategory === 'all' || p.category?.slug === selectedProductCategory;
    const matchesSearch = !productSearch.trim() ||
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.titlePunjabi && p.titlePunjabi.includes(productSearch));
    return matchesCategory && matchesSearch;
  });

  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    const matchesSearch = !orderSearch.trim() ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  // ==========================================
  // 1. UNAUTHENTICATED: Full-page Login Portal
  // ==========================================
  if (!token || !adminUser) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-brand">
            <img
              src="/assets/brand/sachi-kheti-emblem.jpg"
              alt="SachiKheti Emblem"
              className="admin-login-logo"
            />
            <div>
              <div className="font-gurmukhi admin-login-title-punjabi">ਸੱਚੀ ਖੇਤੀ</div>
              <div className="admin-login-title">Control Portal</div>
            </div>
          </div>

          <div className="admin-login-badge">
            <ShieldCheck size={16} color="#15733E" />
            <span>Authorized LFPC Superadmin Access</span>
          </div>

          {loginError && (
            <div className="admin-login-error">
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="Enter admin username"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="btn btn-primary admin-login-btn"
            >
              {loggingIn ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Secure Login</span>
                </>
              )}
            </button>
          </form>

          <div className="admin-login-credentials-box">
            <div style={{ fontWeight: 700, color: '#0A3E22', marginBottom: '4px' }}>
              Default Superadmin Credentials:
            </div>
            <div>Username: <code>SachiKhetiAdmin</code></div>
            <div>Password: <code>Sachi@Kheti123</code></div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={onNavigateHome}
              className="admin-back-link"
            >
              <ArrowLeft size={16} />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. AUTHENTICATED: Standalone Admin Web App
  // ==========================================
  return (
    <div className="admin-portal-app">
      {/* Admin Top Navigation Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="admin-sidebar-toggle"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu size={22} />
          </button>
          <div className="admin-brand-lockup">
            <img
              src="/assets/brand/sachi-kheti-emblem.jpg"
              alt="SachiKheti Emblem"
              className="admin-brand-icon"
            />
            <div>
              <div className="admin-brand-name">
                <span className="font-gurmukhi" style={{ color: '#15733E', marginRight: '6px' }}>ਸੱਚੀ ਖੇਤੀ</span>
                Admin Portal
              </div>
              <div className="admin-brand-sub">LFPC Central Management System</div>
            </div>
          </div>
        </div>

        <div className="admin-topbar-right">
          <button
            onClick={loadAllData}
            className="btn btn-secondary btn-sm admin-refresh-btn"
            title="Refresh Live Database"
          >
            <RefreshCw size={15} className={loadingData ? 'spin' : ''} />
            <span className="hide-on-mobile">Sync Data</span>
          </button>

          <button
            onClick={onNavigateHome}
            className="btn btn-secondary btn-sm"
            title="View Live Customer Store"
          >
            <ExternalLink size={15} />
            <span className="hide-on-mobile">Live Store</span>
          </button>

          <div className="admin-user-pill">
            <ShieldCheck size={16} color="#15733E" />
            <span className="admin-user-name">{adminUser.username}</span>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm admin-logout-btn"
            title="Log Out of Admin Portal"
          >
            <LogOut size={16} />
            <span className="hide-on-mobile">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="admin-portal-layout">
        {/* Sidebar Backdrop (Mobile) */}
        <div
          className={`admin-sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar Navigation */}
        <aside className={`admin-portal-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-nav">
            <button
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <TrendingUp size={18} />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            >
              <ShoppingBag size={18} />
              <span>Orders Fulfillment</span>
              {pendingOrdersCount > 0 && (
                <span className="admin-nav-badge-pill">{pendingOrdersCount}</span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('products'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            >
              <Package size={18} />
              <span>Catalog Products</span>
              <span className="admin-nav-count">({products.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('categories'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            >
              <Layers size={18} />
              <span>Categories</span>
              <span className="admin-nav-count">({categories.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('banner'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'banner' ? 'active' : ''}`}
            >
              <Megaphone size={18} />
              <span>Announcement Ribbon</span>
            </button>
          </div>

          <div className="admin-sidebar-footer">
            <div className="font-gurmukhi" style={{ color: '#0A3E22', fontSize: '0.84rem', fontWeight: 700, marginBottom: '2px' }}>
              ਸੱਚੀ ਖੇਤੀ • LFPC
            </div>
            <div style={{ fontSize: '0.74rem', color: '#7A8B80' }}>
              Database: PostgreSQL (Render)
            </div>
          </div>
        </aside>

        {/* Primary Content View */}
        <main className="admin-portal-main">
          {actionSuccess && (
            <div className="admin-toast-banner">
              <CheckCircle size={18} />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 1: OVERVIEW METRICS                              */}
          {/* ==================================================== */}
          {activeTab === 'overview' && (
            <div className="admin-tab-view">
              <div className="admin-view-header">
                <div>
                  <h1 className="admin-view-title">Performance & Revenue Overview</h1>
                  <p className="admin-view-sub">Real-time agricultural orders and fulfillment statistics</p>
                </div>
                <button onClick={openNewProductModal} className="btn btn-primary">
                  <Plus size={17} />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* KPI Cards Grid */}
              <div className="admin-kpi-grid">
                <div className="admin-kpi-card gold-border">
                  <div className="admin-kpi-icon gold">
                    <TrendingUp size={26} />
                  </div>
                  <div>
                    <div className="admin-kpi-label">Confirmed Revenue</div>
                    <div className="admin-kpi-val">₹ {totalRevenue.toLocaleString('en-IN')}</div>
                    <div className="admin-kpi-detail">Prepaid verified transactions</div>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-icon green">
                    <ShoppingBag size={26} />
                  </div>
                  <div>
                    <div className="admin-kpi-label">Total Customer Orders</div>
                    <div className="admin-kpi-val">{totalOrdersCount}</div>
                    <div className="admin-kpi-detail">All checkout channels</div>
                  </div>
                </div>

                <div className="admin-kpi-card alert-border">
                  <div className="admin-kpi-icon amber">
                    <Clock size={26} />
                  </div>
                  <div>
                    <div className="admin-kpi-label">Pending Verification</div>
                    <div className="admin-kpi-val">{pendingOrdersCount}</div>
                    <div className="admin-kpi-detail">Awaiting packaging or dispatch</div>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-icon green">
                    <Package size={26} />
                  </div>
                  <div>
                    <div className="admin-kpi-label">Active Catalog Items</div>
                    <div className="admin-kpi-val">{inStockProductsCount} / {products.length}</div>
                    <div className="admin-kpi-detail">In-stock agricultural products</div>
                  </div>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="admin-panel-card">
                <div className="admin-card-header">
                  <div>
                    <h3 className="admin-card-title">Recent Customer Orders</h3>
                    <p className="admin-card-sub">Latest 5 orders received from customers</p>
                  </div>
                  <button onClick={() => setActiveTab('orders')} className="btn btn-secondary btn-sm">
                    <span>View All Orders</span>
                  </button>
                </div>

                <div className="admin-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id}>
                          <td><strong>{o.orderNumber}</strong></td>
                          <td>{o.customerName}</td>
                          <td>{o.customerPhone}</td>
                          <td><strong>₹ {o.totalAmount.toLocaleString('en-IN')}</strong></td>
                          <td>
                            <span className={`badge ${o.paymentMethod === 'WHATSAPP' ? 'badge-green' : 'badge-gold'}`}>
                              {o.paymentMethod}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${o.orderStatus === 'DELIVERED' ? 'badge-green' : 'badge-gold'}`}>
                              {o.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#7A8B80' }}>
                            No orders placed yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: PRODUCT CATALOG MANAGEMENT                    */}
          {/* ==================================================== */}
          {activeTab === 'products' && (
            <div className="admin-tab-view">
              <div className="admin-view-header">
                <div>
                  <h1 className="admin-view-title">Product Catalog Manager</h1>
                  <p className="admin-view-sub">Upload, edit pricing, manage inventory stock, and feature products live</p>
                </div>
                <button onClick={openNewProductModal} className="btn btn-primary">
                  <Plus size={17} />
                  <span>Add Farm Product</span>
                </button>
              </div>

              {/* Filters Bar */}
              <div className="admin-filter-bar">
                <div className="admin-search-box">
                  <Search size={17} color="#7A8B80" className="admin-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by English or Punjabi title..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="form-input admin-search-input"
                  />
                  {productSearch && (
                    <button onClick={() => setProductSearch('')} className="admin-search-clear">×</button>
                  )}
                </div>

                <div className="admin-filter-select-wrap">
                  <select
                    value={selectedProductCategory}
                    onChange={(e) => setSelectedProductCategory(e.target.value)}
                    className="form-select admin-filter-select"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>
                        {c.name} ({c.namePunjabi})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="admin-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Image</th>
                      <th>Product Details</th>
                      <th>Category</th>
                      <th>Price & Unit</th>
                      <th>Stock Status</th>
                      <th>Featured</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="admin-table-product-thumb"
                          />
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#122117' }}>{p.title}</div>
                          <div className="font-gurmukhi" style={{ fontSize: '0.8rem', color: '#15733E' }}>
                            {p.titlePunjabi}
                          </div>
                        </td>
                        <td>
                          <span className="badge" style={{ background: '#F0FAF4', color: '#0A3E22' }}>
                            {p.category?.name || 'Produce'}
                          </span>
                        </td>
                        <td>
                          <strong>₹ {p.price.toLocaleString('en-IN')}</strong>
                          <div style={{ fontSize: '0.78rem', color: '#7A8B80' }}>/ {p.unit}</div>
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleStock(p)}
                            className={`badge ${p.inStock ? 'badge-green' : 'badge-gold'}`}
                            style={{ cursor: 'pointer', border: 'none' }}
                            title="Click to toggle in-stock / out-of-stock"
                          >
                            {p.inStock ? `In Stock (${p.stockCount})` : 'Out of Stock'}
                          </button>
                        </td>
                        <td>
                          {p.featured ? (
                            <span className="badge badge-gold">★ Featured</span>
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: '#7A8B80' }}>Standard</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => openEditProductModal(p)}
                              className="btn btn-secondary btn-sm"
                              title="Edit product"
                            >
                              <Edit size={15} />
                              <span className="hide-on-mobile">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.title)}
                              className="btn btn-secondary btn-sm text-red"
                              title="Delete product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#7A8B80' }}>
                          No products found matching criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: ORDERS FULFILLMENT CENTER                     */}
          {/* ==================================================== */}
          {activeTab === 'orders' && (
            <div className="admin-tab-view">
              <div className="admin-view-header">
                <div>
                  <h1 className="admin-view-title">Order Fulfillment Center</h1>
                  <p className="admin-view-sub">Manage live customer orders, update delivery dispatch, and communicate directly</p>
                </div>
              </div>

              {/* Order Search & Filters */}
              <div className="admin-filter-bar">
                <div className="admin-search-box">
                  <Search size={17} color="#7A8B80" className="admin-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by Order ID (SK-...), Customer, or Phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="form-input admin-search-input"
                  />
                  {orderSearch && (
                    <button onClick={() => setOrderSearch('')} className="admin-search-clear">×</button>
                  )}
                </div>

                <div className="admin-filter-select-wrap">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="form-select admin-filter-select"
                  >
                    <option value="all">All Statuses ({orders.length})</option>
                    <option value="PENDING">Pending Confirmation</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing & Packing</option>
                    <option value="SHIPPED">Shipped / In Transit</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders List */}
              <div className="admin-orders-grid">
                {filteredOrders.map(o => (
                  <div key={o.id} className="admin-order-card">
                    <div className="admin-order-card-header">
                      <div>
                        <div className="admin-order-id">{o.orderNumber}</div>
                        <div className="admin-order-date">
                          <Calendar size={13} />
                          <span>{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="admin-order-amount">₹ {o.totalAmount.toLocaleString('en-IN')}</div>
                        <span className={`badge ${o.paymentMethod === 'WHATSAPP' ? 'badge-green' : 'badge-gold'}`}>
                          {o.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="admin-order-customer-box">
                      <div className="admin-order-customer-name">{o.customerName}</div>
                      <div className="admin-order-customer-detail">
                        <Phone size={14} color="#15733E" />
                        <a href={`tel:${o.customerPhone}`} style={{ color: '#0A3E22', fontWeight: 600 }}>{o.customerPhone}</a>
                        <a
                          href={`https://wa.me/${o.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(o.customerName)},%20this%20is%20SachiKheti%20regarding%20your%20order%20${o.orderNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-wa-icon-link"
                          title="Message on WhatsApp"
                        >
                          Chat on WhatsApp
                        </a>
                      </div>
                      <div className="admin-order-customer-detail">
                        <MapPin size={14} color="#B46F00" />
                        <span>{o.address}, {o.city} {o.pincode ? `(${o.pincode})` : ''}</span>
                      </div>
                      {o.notes && (
                        <div style={{ fontSize: '0.8rem', color: '#7A8B80', fontStyle: 'italic', marginTop: '4px' }}>
                          Note: "{o.notes}"
                        </div>
                      )}
                    </div>

                    {/* Ordered Items Breakdown */}
                    <div className="admin-order-items-box">
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0A3E22', marginBottom: '6px' }}>
                        Ordered Items ({Array.isArray(o.items) ? o.items.length : 1}):
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {Array.isArray(o.items) ? o.items.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span>{it.title} <span style={{ color: '#7A8B80' }}>x {it.quantity}</span></span>
                            <strong>₹ {(it.price * it.quantity).toLocaleString('en-IN')}</strong>
                          </div>
                        )) : (
                          <div style={{ fontSize: '0.85rem' }}>{String(o.items)}</div>
                        )}
                      </div>
                    </div>

                    {/* Status Update Dropdown */}
                    <div className="admin-order-status-row">
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4A5B50' }}>Fulfillment Status:</span>
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                        className="form-select admin-status-select"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                ))}

                {filteredOrders.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '16px', gridColumn: '1 / -1', border: '1px solid var(--border-light)' }}>
                    <ShoppingBag size={40} color="#7A8B80" style={{ margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '1.2rem', color: '#0A3E22' }}>No orders found</h3>
                    <p style={{ color: '#7A8B80', fontSize: '0.9rem' }}>Try adjusting your search query or filter.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: CATEGORIES MANAGEMENT                         */}
          {/* ==================================================== */}
          {activeTab === 'categories' && (
            <div className="admin-tab-view">
              <div className="admin-view-header">
                <div>
                  <h1 className="admin-view-title">Agricultural Categories</h1>
                  <p className="admin-view-sub">All database categories configured for product organization</p>
                </div>
              </div>

              <div className="admin-categories-grid">
                {categories.map(c => (
                  <div key={c.id} className="admin-category-card">
                    <div className="admin-category-icon-box">
                      <Layers size={24} color="#15733E" />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div className="font-gurmukhi" style={{ fontSize: '1.1rem', color: '#15733E', fontWeight: 700 }}>
                        {c.namePunjabi}
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#122117' }}>{c.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#4A5B50', margin: '4px 0 10px' }}>{c.description}</p>
                      <span className="badge badge-green">
                        Slug: {c.slug} • {c._count?.products || 0} Products
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: ANNOUNCEMENT RIBBON                           */}
          {/* ==================================================== */}
          {activeTab === 'banner' && (
            <div className="admin-tab-view" style={{ maxWidth: '720px' }}>
              <div className="admin-view-header">
                <div>
                  <h1 className="admin-view-title">Top Announcement Ribbon</h1>
                  <p className="admin-view-sub">Live promotional banner displayed across the header</p>
                </div>
              </div>

              <div className="admin-panel-card">
                <form onSubmit={handleSaveBanner}>
                  <div className="form-group">
                    <label className="form-label">Banner Title</label>
                    <input
                      type="text"
                      required
                      value={banner.title}
                      onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                      className="form-input"
                      placeholder="e.g. 🌾 SachiKheti Festive Harvest Offer"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Banner Message</label>
                    <textarea
                      rows={3}
                      required
                      value={banner.message}
                      onChange={(e) => setBanner({ ...banner, message: e.target.value })}
                      className="form-textarea"
                      placeholder="e.g. Get 10% off on Pure Desi Ghee & Pinnis using code SACHI10! WhatsApp Direct Delivery available."
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0 24px' }}>
                    <input
                      type="checkbox"
                      id="bannerActive"
                      checked={banner.isActive}
                      onChange={(e) => setBanner({ ...banner, isActive: e.target.checked })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <label htmlFor="bannerActive" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#122117', cursor: 'pointer' }}>
                      Publish Banner Active on Live Site
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <CheckCircle size={17} />
                    <span>Save Announcement Live</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==================================================== */}
      {/* ADD / EDIT PRODUCT MODAL                             */}
      {/* ==================================================== */}
      {showProductModal && (
        <div className="modal-overlay" style={{ zIndex: 600 }}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Agricultural Product'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#7A8B80' }}>
                  Product will be visible on the store catalog immediately.
                </p>
              </div>
              <button onClick={() => setShowProductModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="checkout-grid-2col">
                <div className="form-group">
                  <label className="form-label">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Pure Desi Cow Ghee"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Title (ਪੰਜਾਬੀ / Gurmukhi) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.titlePunjabi}
                    onChange={(e) => setProductForm({ ...productForm, titlePunjabi: e.target.value })}
                    className="form-input"
                    placeholder="e.g. ਸ਼ੁੱਧ ਦੇਸੀ ਗਾਂ ਦਾ ਘਿਓ"
                  />
                </div>
              </div>

              <div className="checkout-grid-2col">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="form-select"
                    required
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.namePunjabi})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹ INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="form-input"
                    placeholder="e.g. 1450"
                  />
                </div>
              </div>

              <div className="checkout-grid-2col">
                <div className="form-group">
                  <label className="form-label">Packaging Unit *</label>
                  <input
                    type="text"
                    required
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="form-input"
                    placeholder="e.g. 1 Litre Glass Jar, 50 kg Bag"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Inventory Quantity</label>
                  <input
                    type="number"
                    value={productForm.stockCount}
                    onChange={(e) => setProductForm({ ...productForm, stockCount: e.target.value })}
                    className="form-input"
                    placeholder="e.g. 50"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Image URL</label>
                <input
                  type="url"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="form-textarea"
                  placeholder="Detailed artisanal process and farm origins..."
                />
              </div>

              <div style={{ display: 'flex', gap: '24px', margin: '14px 0 20px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Available In Stock</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>★ LFPC Choice (Featured)</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="btn btn-primary"
                >
                  {savingProduct ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


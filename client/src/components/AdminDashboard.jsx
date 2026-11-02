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
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard({ onClose }) {
  const [token, setToken] = useState(() => localStorage.getItem('sachikheti_admin_token') || '');
  const [adminUser, setAdminUser] = useState(null);

  // Login form state
  const [username, setUsername] = useState('SachiKhetiAdmin');
  const [password, setPassword] = useState('Sachi@Kheti123');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Dashboard tab state
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Product modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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
            loadDashboardData();
          } else {
            handleLogout();
          }
        })
        .catch(() => handleLogout());
    }
  }, [token]);

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
        loadDashboardData();
      } else {
        setLoginError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Server connection failed');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sachikheti_admin_token');
    setToken('');
    setAdminUser(null);
  };

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch orders
      const ordersRes = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();
      if (ordersData.success) setOrders(ordersData.data);

      // 2. Fetch products
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      if (prodData.success) setProducts(prodData.data);

      // 3. Fetch categories
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (catData.success) {
        setCategories(catData.data);
        if (catData.data.length > 0 && !productForm.categoryId) {
          setProductForm(prev => ({ ...prev, categoryId: catData.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
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
        setOrders(prev =>
          prev.map(ord => (ord.id === orderId ? { ...ord, orderStatus: newStatus } : ord))
        );
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
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
        loadDashboardData();
      } else {
        alert(data.message || 'Failed to save product');
      }
    } catch (err) {
      alert('Server error saving product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      }
    } catch (err) {
      alert('Error deleting product');
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
    });
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      titlePunjabi: product.titlePunjabi,
      categoryId: product.categoryId,
      price: product.price,
      unit: product.unit,
      imageUrl: product.imageUrl,
      description: product.description,
      inStock: product.inStock,
      stockCount: product.stockCount,
      featured: product.featured,
    });
    setShowProductModal(true);
  };

  // KPIs
  const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'COMPLETED' ? o.totalAmount : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'PENDING').length;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 400 }}>
      <div
        className="modal-content admin-dashboard-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close Admin Modal"
        >
          <X size={22} />
        </button>

        {!token || !adminUser ? (
          /* Admin Login Screen */
          <div style={{ maxWidth: '420px', margin: '40px auto', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#F0FAF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <ShieldCheck size={36} color="#15733E" />
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0A3E22', marginBottom: '8px' }}>
              Superadmin Portal
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#7A8B80', marginBottom: '24px' }}>
              Secure administrative access for SachiKheti (LFPC)
            </p>

            {loginError && (
              <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', color: '#B91C1C', padding: '10px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '16px' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label className="form-label">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ textAlign: 'left' }}>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ background: '#FAF9F3', border: '1px solid #E7E3D4', borderRadius: '8px', padding: '10px', fontSize: '0.8rem', color: '#7A8B80', marginBottom: '20px', textAlign: 'left' }}>
                🔑 <strong>Configured Credentials:</strong><br />
                Username: <code>SachiKhetiAdmin</code><br />
                Password: <code>Sachi@Kheti123</code>
              </div>

              <button type="submit" disabled={loggingIn} className="btn btn-gold" style={{ width: '100%' }}>
                {loggingIn ? 'Authenticating...' : 'Log In to Superadmin'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E7E3D4' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={22} color="#15733E" />
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0A3E22' }}>
                    SachiKheti Superadmin CMS
                  </h2>
                </div>
                <span style={{ fontSize: '0.82rem', color: '#7A8B80' }}>
                  Logged in as <strong>{adminUser.username}</strong> ({adminUser.role})
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* KPI Stat Cards */}
            <div className="stats-grid" style={{ marginBottom: '24px' }}>
              <div className="stat-card">
                <div className="stat-icon">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#7A8B80' }}>Total Orders</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#122117' }}>{totalOrdersCount}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon gold">
                  <Clock size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#7A8B80' }}>Pending Orders</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#B46F00' }}>{pendingOrdersCount}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Package size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#7A8B80' }}>Catalog Products</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#122117' }}>{products.length}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon gold">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#7A8B80' }}>Confirmed Revenue</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0A3E22' }}>
                    ₹ {totalRevenue.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Tab navigation */}
            <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #E7E3D4', marginBottom: '20px' }}>
              <button
                onClick={() => setActiveTab('orders')}
                className={`filter-chip ${activeTab === 'orders' ? 'active' : ''}`}
                style={{ borderRadius: '8px 8px 0 0' }}
              >
                Orders Fulfillment ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`filter-chip ${activeTab === 'products' ? 'active' : ''}`}
                style={{ borderRadius: '8px 8px 0 0' }}
              >
                Product Catalog ({products.length})
              </button>
            </div>

            {/* Content Area */}
            <div style={{ flexGrow: 1, overflowY: 'auto' }}>
              {activeTab === 'orders' ? (
                /* Orders Table */
                orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#7A8B80' }}>No customer orders placed yet.</div>
                ) : (
                  <div className="admin-table-container">
                    <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Address</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
                        <tr key={ord.id}>
                          <td><strong>{ord.orderNumber}</strong></td>
                          <td>
                            <div>{ord.customerName}</div>
                            <div style={{ fontSize: '0.78rem', color: '#7A8B80' }}>{ord.customerPhone}</div>
                          </td>
                          <td style={{ maxWidth: '180px', fontSize: '0.82rem' }}>
                            {ord.address}, {ord.city}
                          </td>
                          <td style={{ fontSize: '0.82rem' }}>
                            {Array.isArray(ord.items) && ord.items.map((it, idx) => (
                              <div key={idx}>{it.title} x {it.quantity}</div>
                            ))}
                          </td>
                          <td><strong>₹ {ord.totalAmount.toLocaleString('en-IN')}</strong></td>
                          <td>
                            <span className={`badge ${ord.paymentMethod === 'WHATSAPP' ? 'badge-green' : 'badge-gold'}`}>
                              {ord.paymentMethod}
                            </span>
                          </td>
                          <td>
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                              className="form-select"
                              style={{ padding: '6px 10px', fontSize: '0.82rem', fontWeight: 600 }}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="PROCESSING">PROCESSING</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )
              ) : (
                /* Products Table */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <button onClick={openNewProductModal} className="btn btn-primary btn-sm">
                      <Plus size={16} />
                      <span>Add New Farm Product</span>
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="data-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Title</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <img
                              src={p.imageUrl}
                              alt={p.title}
                              style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                          </td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{p.title}</div>
                            <div className="font-gurmukhi" style={{ fontSize: '0.78rem', color: '#15733E' }}>
                              {p.titlePunjabi}
                            </div>
                          </td>
                          <td>{p.category?.name || 'Produce'}</td>
                          <td><strong>₹ {p.price.toLocaleString('en-IN')}</strong> / {p.unit}</td>
                          <td>
                            <span className={`badge ${p.inStock ? 'badge-green' : 'badge-gold'}`}>
                              {p.inStock ? `${p.stockCount} in stock` : 'Out of stock'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => openEditProductModal(p)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15733E' }}
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showProductModal && (
          <div className="modal-overlay" style={{ zIndex: 500 }}>
            <div className="modal-content" style={{ maxWidth: '540px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                  {editingProduct ? 'Edit Product' : 'Add New Farm Product'}
                </h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A8B80' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct}>
                <div className="form-group">
                  <label className="form-label">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Title (Punjabi / Gurmukhi) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.titlePunjabi}
                    onChange={(e) => setProductForm({ ...productForm, titlePunjabi: e.target.value })}
                    className="form-input font-gurmukhi"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                      className="form-select"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Unit *</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Litre, 1 kg, Unit"
                      value={productForm.unit}
                      onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stock Count</label>
                    <input
                      type="number"
                      value={productForm.stockCount}
                      onChange={(e) => setProductForm({ ...productForm, stockCount: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    />
                    In Stock
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    />
                    Featured on Homepage
                  </label>
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: '100%' }}>
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

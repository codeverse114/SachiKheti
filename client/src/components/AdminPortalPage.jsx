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
  Calendar,
  FolderPlus
} from 'lucide-react';

export default function AdminPortalPage({ onNavigateHome }) {
  const [token, setToken] = useState(() => localStorage.getItem('sachikheti_admin_token') || '');
  const [adminUser, setAdminUser] = useState(null);

  // Login form state
  const [username, setUsername] = useState('SachiKhetiAdmin');
  const [password, setPassword] = useState('Sachi@Kheti123');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Navigation tab state: 'overview' | 'products' | 'categories' | 'orders' | 'banner'
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

  // Category Add / Edit Modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'package',
  });

  // Helper to auto-generate slug from name
  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

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

      const [ordersRes, productsRes, categoriesRes, bannersRes] = await Promise.all([
        fetch('/api/orders', { headers }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/products').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/categories').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/banners').then(r => r.json()).catch(() => ({ data: [] })),
      ]);

      if (ordersRes.success) setOrders(ordersRes.data || []);
      if (productsRes.success) setProducts(productsRes.data || []);
      if (categoriesRes.success) setCategories(categoriesRes.data || []);
      if (bannersRes.success && bannersRes.data && bannersRes.data.length > 0) {
        setBanner(bannersRes.data[0]);
      }
    } catch (err) {
      console.error('Error refreshing admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
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
        setActionSuccess('Welcome back, Superadmin! Live database connected.');
        setTimeout(() => setActionSuccess(''), 4000);
      } else {
        setLoginError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      setLoginError('Cannot connect to authentication service.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sachikheti_admin_token');
    setToken('');
    setAdminUser(null);
  };

  // ==========================================
  // PRODUCT MANAGEMENT HANDLERS
  // ==========================================
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      categoryId: categories[0]?.id || '',
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
      categoryId: product.categoryId,
      price: product.price.toString(),
      unit: product.unit,
      imageUrl: product.imageUrl,
      description: product.description,
      inStock: product.inStock,
      stockCount: product.stockCount,
      featured: product.featured,
      specs: product.specs || '',
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const payload = {
        title: productForm.title,
        titlePunjabi: productForm.title, // Graceful fallback for backend schema
        categoryId: productForm.categoryId,
        price: parseFloat(productForm.price),
        unit: productForm.unit,
        imageUrl: productForm.imageUrl,
        description: productForm.description,
        inStock: Boolean(productForm.inStock),
        stockCount: parseInt(productForm.stockCount, 10) || 0,
        featured: Boolean(productForm.featured),
        specs: productForm.specs,
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowProductModal(false);
        setActionSuccess(editingProduct ? 'Product updated successfully!' : 'New product created and live in catalog!');
        setTimeout(() => setActionSuccess(''), 4000);
        loadAllData();
      } else {
        alert(data.message || 'Error saving product');
      }
    } catch (err) {
      alert('Network error while saving product');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`"${title}" deleted from catalog.`);
        setTimeout(() => setActionSuccess(''), 4000);
        loadAllData();
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const handleToggleStock = async (product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ inStock: !product.inStock })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Stock status for "${product.title}" updated.`);
        setTimeout(() => setActionSuccess(''), 3000);
        loadAllData();
      }
    } catch (err) {
      alert('Error updating stock status');
    }
  };

  // ==========================================
  // CATEGORY MANAGEMENT HANDLERS
  // ==========================================
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      icon: 'package',
    });
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || 'package',
    });
    setShowCategoryModal(true);
  };

  const handleCategoryNameChange = (e) => {
    const name = e.target.value;
    if (!editingCategory) {
      // Auto-generate slug when creating new
      setCategoryForm({
        ...categoryForm,
        name,
        slug: slugify(name),
      });
    } else {
      setCategoryForm({
        ...categoryForm,
        name,
      });
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      alert('Please enter a category name');
      return;
    }
    setSavingCategory(true);
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const payload = {
        name: categoryForm.name.trim(),
        namePunjabi: categoryForm.name.trim(), // Keep DB consistent in simple English
        slug: categoryForm.slug.trim() || slugify(categoryForm.name),
        description: categoryForm.description.trim(),
        icon: categoryForm.icon,
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowCategoryModal(false);
        setActionSuccess(editingCategory ? 'Category updated successfully!' : 'New category created! Visible across the entire store.');
        setTimeout(() => setActionSuccess(''), 4000);
        loadAllData();
      } else {
        alert(data.message || 'Error saving category');
      }
    } catch (err) {
      alert('Network error while saving category');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id, name, productCount) => {
    if (productCount > 0) {
      if (!window.confirm(`Warning: Category "${name}" contains ${productCount} active products. Deleting it may impact these products. Proceed anyway?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Category "${name}" deleted.`);
        setTimeout(() => setActionSuccess(''), 4000);
        loadAllData();
      } else {
        alert(data.message || 'Failed to delete category');
      }
    } catch (err) {
      alert('Error deleting category');
    }
  };

  // ==========================================
  // ORDER STATUS UPDATE HANDLER
  // ==========================================
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Order status updated to "${newStatus}"`);
        setTimeout(() => setActionSuccess(''), 3000);
        loadAllData();
      } else {
        alert(data.message || 'Failed to update order status');
      }
    } catch (err) {
      alert('Error updating order');
    }
  };

  // ==========================================
  // BANNER UPDATE HANDLER
  // ==========================================
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: banner.title,
          message: banner.message,
          isActive: banner.isActive,
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess('Announcement ribbon updated live!');
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (err) {
      alert('Error updating banner');
    }
  };

  // Filter calculations
  const filteredProducts = products.filter(p => {
    const matchesSearch = !productSearch ||
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCat = selectedProductCategory === 'all' || p.categoryId === selectedProductCategory;
    return matchesSearch && matchesCat;
  });

  const filteredOrders = orders.filter(o => {
    const matchesSearch = !orderSearch ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Metrics & Analytics Calculations
  const totalRevenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;
  const inStockProductsCount = products.filter(p => p.inStock).length;

  // 1. Order Fulfillment Funnel Calculations
  const totalOrdersCount = orders.length;
  const confirmedCount = orders.filter(o => ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status)).length;
  const processingCount = orders.filter(o => ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status)).length;
  const shippedCount = orders.filter(o => ['SHIPPED', 'DELIVERED'].includes(o.status)).length;
  const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;
  const cancelledCount = orders.filter(o => o.status === 'CANCELLED').length;

  const funnelSteps = [
    {
      stage: '1. Received',
      count: totalOrdersCount,
      color: '#3B82F6',
      bg: '#EFF6FF',
      pct: 100,
      desc: 'All customer checkouts'
    },
    {
      stage: '2. Confirmed',
      count: confirmedCount,
      color: '#059669',
      bg: '#ECFDF5',
      pct: totalOrdersCount > 0 ? Math.round((confirmedCount / totalOrdersCount) * 100) : 0,
      desc: 'Approved & verified'
    },
    {
      stage: '3. Processing',
      count: processingCount,
      color: '#D97706',
      bg: '#FFFBEB',
      pct: totalOrdersCount > 0 ? Math.round((processingCount / totalOrdersCount) * 100) : 0,
      desc: 'Packaged at farm facility'
    },
    {
      stage: '4. Shipped',
      count: shippedCount,
      color: '#7C3AED',
      bg: '#F5F3FF',
      pct: totalOrdersCount > 0 ? Math.round((shippedCount / totalOrdersCount) * 100) : 0,
      desc: 'In transit to address'
    },
    {
      stage: '5. Delivered',
      count: deliveredCount,
      color: '#15733E',
      bg: '#EBF7EE',
      pct: totalOrdersCount > 0 ? Math.round((deliveredCount / totalOrdersCount) * 100) : 0,
      desc: 'Successfully completed'
    },
  ];

  // 2. Sales by Category Bar Graph Calculations
  const categorySalesMap = {};
  categories.forEach(c => {
    categorySalesMap[c.id] = {
      id: c.id,
      name: c.name,
      sales: 0,
      units: 0,
      productCount: c._count?.products || 0,
    };
  });

  orders.forEach(o => {
    if (o.status === 'CANCELLED') return;
    try {
      const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
      (items || []).forEach(item => {
        const prod = products.find(p => p.id === item.productId || p.title === item.title);
        const catId = prod?.categoryId || (categories.length > 0 ? categories[0].id : null);
        if (catId && categorySalesMap[catId]) {
          categorySalesMap[catId].sales += (item.price || 0) * (item.quantity || 1);
          categorySalesMap[catId].units += (item.quantity || 1);
        }
      });
    } catch (e) {}
  });

  const categorySalesList = Object.values(categorySalesMap);
  const maxCategorySales = Math.max(...categorySalesList.map(c => c.sales), 1);

  // 3. Revenue Breakdown by Payment Method
  const whatsappRevenue = orders
    .filter(o => o.paymentMethod === 'WHATSAPP' && o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const onlineRevenue = orders
    .filter(o => o.paymentMethod !== 'WHATSAPP' && o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalValidRevenue = (whatsappRevenue + onlineRevenue) || 1;
  const whatsappRatio = Math.round((whatsappRevenue / totalValidRevenue) * 100) || 50;
  const onlineRatio = 100 - whatsappRatio;

  // Circumference for SVG Donut (r=45 => 2 * PI * 45 ≈ 282.74)
  const donutCircumference = 282.74;
  const whatsappDash = (whatsappRatio / 100) * donutCircumference;
  const onlineDash = donutCircumference - whatsappDash;

  // Timeline points for Dotted Graph
  const timelinePoints = orders.slice(0, 7).map((o, idx) => ({
    label: new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    amount: o.totalAmount || 0,
    orderNumber: o.orderNumber,
    status: o.status
  })).reverse();


  // ==========================================
  // RENDER: LOGIN VIEW (IF NOT AUTHENTICATED)
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
              <div className="admin-login-title">SachiKheti Superadmin</div>
              <div style={{ fontSize: '0.82rem', color: '#7A8B80' }}>Platform Administration Portal</div>
            </div>
          </div>

          <div className="admin-login-badge">
            <ShieldCheck size={16} color="#15733E" />
            <span>Authorized LFPC Management Access</span>
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
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
            >
              {loggingIn ? (
                <>
                  <RefreshCw size={17} className="spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Sign In to Superadmin</span>
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              onClick={onNavigateHome}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <ArrowLeft size={15} />
              <span>Return to Customer Store</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: FULL SUPERADMIN PORTAL APPLICATION
  // ==========================================
  return (
    <div className="admin-portal-app">
      {/* Top Application Header */}
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
                <span style={{ color: '#15733E', marginRight: '6px' }}>SachiKheti</span>
                Superadmin
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

          <div className="admin-user-badge hide-on-mobile">
            <ShieldCheck size={14} color="#15733E" />
            <span>{adminUser.username}</span>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm admin-logout-btn"
            title="Log Out of Admin"
          >
            <LogOut size={15} />
            <span className="hide-on-mobile">Logout</span>
          </button>
        </div>
      </header>

      {/* Floating Action Success Alert */}
      {actionSuccess && (
        <div className="admin-toast-banner">
          <CheckCircle size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Workspace Layout (Sidebar + Content View) */}
      <div className="admin-portal-body">
        {/* Navigation Sidebar */}
        <aside className={`admin-portal-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-nav">
            <div className="admin-nav-section-title">Operations</div>

            <button
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <TrendingUp size={18} />
              <span>Overview Metrics</span>
            </button>

            <button
              onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            >
              <ShoppingBag size={18} />
              <span>Orders Fulfillment</span>
              {pendingOrdersCount > 0 && (
                <span className="admin-nav-badge-alert">{pendingOrdersCount}</span>
              )}
            </button>

            <div className="admin-nav-section-title" style={{ marginTop: '16px' }}>Catalog & Store</div>

            <button
              onClick={() => { setActiveTab('products'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            >
              <Package size={18} />
              <span>Products Catalog</span>
              <span className="admin-nav-badge">{products.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('categories'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            >
              <Layers size={18} />
              <span>Categories</span>
              <span className="admin-nav-badge">{categories.length}</span>
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
            <div style={{ color: '#0A3E22', fontSize: '0.85rem', fontWeight: 700, marginBottom: '2px' }}>
              SachiKheti Admin Platform
            </div>
            <div style={{ fontSize: '0.74rem', color: '#7A8B80' }}>
              Direct Farmer Prosperity • LFPC Ltd.
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="admin-sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content View Area */}
        <main className="admin-portal-content">
          {/* ==================================================== */}
          {/* TAB 1: OVERVIEW METRICS                              */}
          {/* ==================================================== */}
          {activeTab === 'overview' && (
            <div className="admin-tab-view">
              <div className="admin-view-header">
                <div>
                  <h1 className="admin-view-title">Executive Operations Overview</h1>
                  <p className="admin-view-sub">Real-time performance metrics and live fulfillment queue</p>
                </div>
                <button onClick={openAddProductModal} className="btn btn-primary">
                  <Plus size={16} />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* KPI Cards Grid */}
              <div className="admin-kpi-grid">
                <div className="admin-kpi-card">
                  <div className="admin-kpi-icon-wrap" style={{ background: '#EBF7EE', color: '#15733E' }}>
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <div className="admin-kpi-label">Confirmed Revenue</div>
                    <div className="admin-kpi-value">₹ {totalRevenue.toLocaleString('en-IN')}</div>
                    <div className="admin-kpi-meta">{orders.length} Total orders recorded</div>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-icon-wrap" style={{ background: '#FFF7E6', color: '#D97706' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <div className="admin-kpi-label">Pending Verification</div>
                    <div className="admin-kpi-value">{pendingOrdersCount}</div>
                    <div className="admin-kpi-meta">Awaiting dispatch confirmation</div>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-icon-wrap" style={{ background: '#E6F4EA', color: '#0A3E22' }}>
                    <Package size={22} />
                  </div>
                  <div>
                    <div className="admin-kpi-label">Active Catalog Items</div>
                    <div className="admin-kpi-value">{inStockProductsCount} / {products.length}</div>
                    <div className="admin-kpi-meta">Items ready for direct dispatch</div>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-icon-wrap" style={{ background: '#F3E8FF', color: '#7E22CE' }}>
                    <Layers size={22} />
                  </div>
                  <div>
                    <div className="admin-kpi-label">Product Categories</div>
                    <div className="admin-kpi-value">{categories.length}</div>
                    <div className="admin-kpi-meta">Configured product groupings</div>
                  </div>
                </div>
              </div>

              {/* 1. ORDER FULFILLMENT FUNNEL */}
              <div className="admin-funnel-card" style={{ marginTop: '28px' }}>
                <div className="admin-funnel-header">
                  <div>
                    <h3 className="admin-panel-title">Order Fulfillment Funnel</h3>
                    <p className="admin-panel-sub">
                      Stage-by-stage conversion from customer checkout to doorstep delivery
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="badge badge-green">
                      Success Rate: {totalOrdersCount > 0 ? Math.round((deliveredCount / totalOrdersCount) * 100) : 0}%
                    </span>
                    {cancelledCount > 0 && (
                      <span className="badge badge-gold">
                        Cancelled: {cancelledCount}
                      </span>
                    )}
                  </div>
                </div>

                <div className="admin-funnel-steps-grid">
                  {funnelSteps.map((step, idx) => (
                    <div key={idx} className="admin-funnel-step-item">
                      <span
                        className="admin-funnel-step-badge"
                        style={{ background: step.bg, color: step.color }}
                      >
                        {step.stage}
                      </span>
                      <div className="admin-funnel-step-count">{step.count}</div>
                      <div className="admin-funnel-step-label">{step.desc}</div>
                      <div className="admin-funnel-step-pct">
                        {step.pct}% of total checkouts
                      </div>
                      <div className="admin-funnel-progress-bar">
                        <div
                          className="admin-funnel-progress-fill"
                          style={{
                            width: `${step.pct}%`,
                            background: step.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. ANALYTICS GRID: CATEGORY BAR GRAPH & REVENUE CHARTS */}
              <div className="admin-analytics-grid">
                {/* Left: Category Sales Bar Graph */}
                <div className="admin-bar-card">
                  <div className="admin-panel-card-header">
                    <div>
                      <h3 className="admin-panel-title">Sales by Category</h3>
                      <p className="admin-panel-sub">Revenue and volume distribution across product categories</p>
                    </div>
                    <button onClick={() => setActiveTab('categories')} className="btn btn-secondary btn-sm">
                      <span>View Categories</span>
                      <ExternalLink size={14} />
                    </button>
                  </div>

                  <div className="admin-bar-list">
                    {categorySalesList.map((cat) => {
                      const pct = Math.round((cat.sales / maxCategorySales) * 100) || (cat.productCount > 0 ? 15 : 5);
                      return (
                        <div key={cat.id} className="admin-bar-row">
                          <div className="admin-bar-row-header">
                            <span className="admin-bar-row-title">
                              <span>{cat.name}</span>
                              <span className="badge" style={{ fontSize: '0.7rem', padding: '1px 6px', background: '#F0F4F1' }}>
                                {cat.productCount} items
                              </span>
                            </span>
                            <span className="admin-bar-row-value">
                              ₹ {cat.sales.toLocaleString('en-IN')}{' '}
                              <span style={{ fontSize: '0.74rem', color: '#7A8B80', fontWeight: 500 }}>
                                ({cat.units} sold)
                              </span>
                            </span>
                          </div>
                          <div className="admin-bar-track">
                            <div
                              className="admin-bar-fill"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {categorySalesList.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#7A8B80' }}>
                        No categories found.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Revenue Channel Donut & Activity Dotted Graph */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Donut Chart: Revenue Breakdown */}
                  <div className="admin-panel-card">
                    <div className="admin-panel-card-header">
                      <div>
                        <h3 className="admin-panel-title">Revenue Channels</h3>
                        <p className="admin-panel-sub">WhatsApp Direct Orders vs. Online / UPI</p>
                      </div>
                    </div>

                    <div className="admin-donut-box">
                      <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
                        <svg width="130" height="130" viewBox="0 0 130 130">
                          {/* Background Ring */}
                          <circle
                            cx="65"
                            cy="65"
                            r="45"
                            fill="transparent"
                            stroke="#F0F4F1"
                            strokeWidth="16"
                          />
                          {/* Online Slice */}
                          <circle
                            cx="65"
                            cy="65"
                            r="45"
                            fill="transparent"
                            stroke="#D97706"
                            strokeWidth="16"
                            strokeDasharray={donutCircumference}
                            strokeDashoffset="0"
                            transform="rotate(-90 65 65)"
                          />
                          {/* WhatsApp Direct Slice */}
                          <circle
                            cx="65"
                            cy="65"
                            r="45"
                            fill="transparent"
                            stroke="#15733E"
                            strokeWidth="16"
                            strokeDasharray={`${whatsappDash} ${onlineDash}`}
                            strokeDashoffset="0"
                            transform="rotate(-90 65 65)"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          pointerEvents: 'none'
                        }}>
                          <div style={{ fontSize: '0.68rem', color: '#7A8B80', textTransform: 'uppercase', fontWeight: 700 }}>Total</div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#122117' }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
                        </div>
                      </div>

                      <div className="admin-donut-legend">
                        <div className="admin-donut-legend-item">
                          <span className="admin-donut-legend-dot" style={{ background: '#15733E' }} />
                          <div>
                            <div style={{ fontWeight: 700, color: '#122117' }}>
                              WhatsApp Orders ({whatsappRatio}%)
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#7A8B80' }}>
                              ₹ {whatsappRevenue.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>

                        <div className="admin-donut-legend-item">
                          <span className="admin-donut-legend-dot" style={{ background: '#D97706' }} />
                          <div>
                            <div style={{ fontWeight: 700, color: '#122117' }}>
                              Online / UPI ({onlineRatio}%)
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#7A8B80' }}>
                              ₹ {onlineRevenue.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dotted Trend Graph */}
                  <div className="admin-panel-card">
                    <div className="admin-panel-card-header">
                      <div>
                        <h3 className="admin-panel-title">Order Activity Timeline</h3>
                        <p className="admin-panel-sub">Volume & dispatch value per transaction</p>
                      </div>
                      <button onClick={() => setActiveTab('orders')} className="btn btn-secondary btn-sm">
                        <span>Fulfillment</span>
                      </button>
                    </div>

                    <div className="admin-dotted-chart-wrap">
                      <svg width="100%" height="110" viewBox="0 0 340 110" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#15733E" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#15733E" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Baseline Grid */}
                        <line x1="10" y1="90" x2="330" y2="90" stroke="#E8ECE9" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="10" y1="50" x2="330" y2="50" stroke="#E8ECE9" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="10" y1="15" x2="330" y2="15" stroke="#E8ECE9" strokeWidth="1" strokeDasharray="3 3" />

                        {(() => {
                          const pts = timelinePoints.length > 0 ? timelinePoints : [
                            { label: 'Start', amount: 490 },
                            { label: 'Mid', amount: 1450 },
                            { label: 'Latest', amount: 980 }
                          ];
                          const maxAmt = Math.max(...pts.map(p => p.amount), 500);
                          const stepX = pts.length > 1 ? 300 / (pts.length - 1) : 150;

                          const coords = pts.map((p, i) => {
                            const x = 20 + i * stepX;
                            const y = 85 - (p.amount / maxAmt) * 65;
                            return { ...p, x, y };
                          });

                          const pathData = coords.reduce((acc, c, i) => {
                            return i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`;
                          }, '');

                          const areaData = coords.length > 0
                            ? `${pathData} L ${coords[coords.length - 1].x} 90 L ${coords[0].x} 90 Z`
                            : '';

                          return (
                            <>
                              {areaData && <path d={areaData} fill="url(#chartGradient)" />}
                              {pathData && <path d={pathData} fill="none" stroke="#15733E" strokeWidth="2.5" strokeLinecap="round" />}
                              {coords.map((c, i) => (
                                <g key={i}>
                                  <circle cx={c.x} cy={c.y} r="5" fill="#FFFFFF" stroke="#15733E" strokeWidth="2.5" />
                                  <circle cx={c.x} cy={c.y} r="2.5" fill="#15733E" />
                                  <text x={c.x} y="104" textAnchor="middle" fontSize="9" fill="#7A8B80" fontWeight="600">
                                    {c.label}
                                  </text>
                                </g>
                              ))}
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: PRODUCTS CATALOG MANAGER                      */}
          {/* ==================================================== */}
          {activeTab === 'products' && (
            <div className="admin-tab-view">
              <div className="admin-view-header">
                <div>
                  <h1 className="admin-view-title">Products Catalog</h1>
                  <p className="admin-view-sub">Manage your products, pricing, stock levels, and store visibility</p>
                </div>
                <button onClick={openAddProductModal} className="btn btn-primary">
                  <Plus size={16} />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="admin-filter-bar">
                <div className="admin-search-box">
                  <Search size={17} color="#7A8B80" className="admin-search-icon" />
                  <input
                    type="text"
                    placeholder="Search products by title, category, or description..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="form-input admin-search-input"
                  />
                  {productSearch && (
                    <button onClick={() => setProductSearch('')} className="admin-search-clear">×</button>
                  )}
                </div>

                <div className="admin-filter-select-wrap">
                  <Filter size={15} color="#7A8B80" />
                  <select
                    value={selectedProductCategory}
                    onChange={(e) => setSelectedProductCategory(e.target.value)}
                    className="form-select admin-filter-select"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Image</th>
                      <th>Product Title</th>
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
                          {p.description && (
                            <div style={{ fontSize: '0.78rem', color: '#7A8B80', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.description}
                            </div>
                          )}
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
          {/* TAB 3: CATEGORIES MANAGEMENT (FULL CRUD)             */}
          {/* ==================================================== */}
          {activeTab === 'categories' && (
            <div className="admin-tab-view">
              <div className="admin-view-header">
                <div>
                  <h1 className="admin-view-title">Product Categories</h1>
                  <p className="admin-view-sub">
                    Create and manage product groupings. New categories immediately appear across storefront navigation and filters.
                  </p>
                </div>
                <button onClick={openAddCategoryModal} className="btn btn-primary">
                  <FolderPlus size={16} />
                  <span>Add New Category</span>
                </button>
              </div>

              <div className="admin-categories-grid">
                {categories.map(c => (
                  <div key={c.id} className="admin-category-card">
                    <div className="admin-category-icon-box">
                      <Layers size={24} color="#15733E" />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#122117' }}>{c.name}</h3>
                      <p style={{ fontSize: '0.86rem', color: '#4A5B50', margin: '4px 0 10px' }}>
                        {c.description || 'No description provided.'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                        <span className="badge badge-green">
                          Slug: <strong>{c.slug}</strong>
                        </span>
                        <span className="badge" style={{ background: '#EBF7EE', color: '#15733E' }}>
                          {c._count?.products || 0} Products
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openEditCategoryModal(c)}
                          className="btn btn-secondary btn-sm"
                          style={{ flexGrow: 1, justifyContent: 'center' }}
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(c.id, c.name, c._count?.products || 0)}
                          className="btn btn-secondary btn-sm text-red"
                          title="Delete category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E8ECE9' }}>
                    <Layers size={36} color="#7A8B80" style={{ margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '1.2rem', color: '#122117', marginBottom: '6px' }}>No Categories Configured</h3>
                    <p style={{ color: '#7A8B80', marginBottom: '18px' }}>Create your first category to organize catalog products.</p>
                    <button onClick={openAddCategoryModal} className="btn btn-primary">
                      <Plus size={16} />
                      <span>Create First Category</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: ORDERS FULFILLMENT CENTER                     */}
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
                        <a href={`tel:${o.customerPhone}`} style={{ color: '#15733E', textDecoration: 'underline' }}>
                          {o.customerPhone}
                        </a>
                        <a
                          href={`https://wa.me/91${o.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${o.customerName}! Regarding your SachiKheti order #${o.orderNumber}...`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.75rem', marginLeft: 'auto' }}
                        >
                          WhatsApp Customer
                        </a>
                      </div>
                      <div className="admin-order-customer-detail">
                        <MapPin size={14} color="#7A8B80" />
                        <span>{o.address}, {o.city} {o.pincode ? `(${o.pincode})` : ''}</span>
                      </div>
                    </div>

                    <div className="admin-order-items-list">
                      <div className="admin-order-items-title">Ordered Products:</div>
                      {(() => {
                        try {
                          const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                          return (items || []).map((item, idx) => (
                            <div key={idx} className="admin-order-item-row">
                              <span><strong>{item.quantity}x</strong> {item.title}</span>
                              <span>₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                            </div>
                          ));
                        } catch (e) {
                          return <div style={{ fontSize: '0.8rem', color: '#7A8B80' }}>Items detail encoded</div>;
                        }
                      })()}
                    </div>

                    <div className="admin-order-status-bar">
                      <span className="admin-order-status-label">Fulfillment Status:</span>
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="form-select admin-order-status-select"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
                {filteredOrders.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E8ECE9' }}>
                    <ShoppingBag size={36} color="#7A8B80" style={{ margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '1.2rem', color: '#122117', marginBottom: '6px' }}>No Orders Found</h3>
                    <p style={{ color: '#7A8B80' }}>No customer orders match the current status and search filters.</p>
                  </div>
                )}
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
              <div className="form-group">
                <label className="form-label">Product Name (English US) *</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Pure Vedic Bilona A2 Desi Cow Ghee"
                />
              </div>

              <div className="checkout-grid-2col">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    required
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Select Category...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Unit Specification *</label>
                  <input
                    type="text"
                    required
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="form-input"
                    placeholder="e.g. 1 Litre, 1 Kg, 50 Kg Bag"
                  />
                </div>
              </div>

              <div className="checkout-grid-2col">
                <div className="form-group">
                  <label className="form-label">Price in ₹ (INR) *</label>
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
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
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
                <label className="form-label">Image URL *</label>
                <input
                  type="url"
                  required
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="form-input"
                  placeholder="https://..."
                />
                {productForm.imageUrl && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={productForm.imageUrl}
                      alt="Preview"
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E8ECE9' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span style={{ fontSize: '0.78rem', color: '#7A8B80' }}>Live Image Preview</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Product Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="form-textarea"
                  placeholder="Detailed description of the product, farm origin, purity certifications..."
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
                  <span>Mark as In-Stock</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Mark as Featured Product</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
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
                  {savingProduct ? (
                    <>
                      <RefreshCw size={16} className="spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ADD / EDIT CATEGORY MODAL                            */}
      {/* ==================================================== */}
      {showCategoryModal && (
        <div className="modal-overlay" style={{ zIndex: 600 }}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#7A8B80' }}>
                  Categories automatically appear in the storefront navbar and product filters.
                </p>
              </div>
              <button onClick={() => setShowCategoryModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div className="form-group">
                <label className="form-label">Category Name (English US) *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={handleCategoryNameChange}
                  className="form-input"
                  placeholder="e.g. Cold Pressed Oils, Organic Pulses"
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: slugify(e.target.value) })}
                  className="form-input"
                  placeholder="e.g. cold-pressed-oils"
                />
                <span style={{ fontSize: '0.78rem', color: '#7A8B80', display: 'block', marginTop: '4px' }}>
                  Used in URL navigation, e.g. /#catalog?category={categoryForm.slug || 'category-name'}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="form-textarea"
                  placeholder="Short description of this product grouping..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="btn btn-primary"
                >
                  {savingCategory ? (
                    <>
                      <RefreshCw size={16} className="spin" />
                      <span>Saving Category...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span>{editingCategory ? 'Update Category' : 'Save Category'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

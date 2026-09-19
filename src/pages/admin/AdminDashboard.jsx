import { useState, useEffect } from 'react';
import { useNavigate, Link, Routes, Route, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  getProducts, saveProduct, deleteProduct,
  getOrders, updateOrderStatus,
  getUsers, getReviews, updateReviewStatus, deleteReview,
  getContacts, markContactRead,
  getCategories, saveCategory, deleteCategory,
  getWebsiteSettings, saveWebsiteSettings,
  getShippingRules, saveShippingRule,
  getHeroSlides, saveHeroSlide
} from '../../lib/services';
import { DEMO_PRODUCTS, DEFAULT_SETTINGS, DEFAULT_SHIPPING_RULES, DEMO_CATEGORIES, DEMO_HERO_SLIDES } from '../../lib/demoData';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Star, Mail,
  Truck, Globe, Settings, ChevronRight, Plus, Edit, Trash2,
  Eye, Check, X, Image, LogOut
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminLayout() {
  const { currentUser, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!currentUser || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [currentUser, isAdmin, loading, navigate]);

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>Four Sisters</h2>
          <span>Admin Panel</span>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end><LayoutDashboard size={18} /> Dashboard</NavLink>
          <NavLink to="/admin/products"><Package size={18} /> Products</NavLink>
          <NavLink to="/admin/orders"><ShoppingCart size={18} /> Orders</NavLink>
          <NavLink to="/admin/customers"><Users size={18} /> Customers</NavLink>
          <NavLink to="/admin/reviews"><Star size={18} /> Reviews</NavLink>
          <NavLink to="/admin/contacts"><Mail size={18} /> Messages</NavLink>
          <NavLink to="/admin/shipping"><Truck size={18} /> Shipping</NavLink>
          <NavLink to="/admin/website"><Globe size={18} /> Website</NavLink>
          <NavLink to="/admin/settings"><Settings size={18} /> Settings</NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-view-site">View Site</Link>
          <button onClick={() => { logout(); navigate('/admin/login'); }} className="admin-logout"><LogOut size={16} /> Logout</button>
        </div>
      </aside>
      <main className="admin-main">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<ProductsManager />} />
          <Route path="orders" element={<OrdersManager />} />
          <Route path="customers" element={<CustomersManager />} />
          <Route path="reviews" element={<ReviewsManager />} />
          <Route path="contacts" element={<ContactsManager />} />
          <Route path="shipping" element={<ShippingManager />} />
          <Route path="website" element={<WebsiteManager />} />
          <Route path="settings" element={<SettingsManager />} />
        </Routes>
      </main>
    </div>
  );
}

function DashboardHome() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getOrders().then(setOrders);
    getProducts().then(setProducts);
    getUsers().then(setUsers);
  }, []);

  const totalSales = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter(p => p.stock <= 0).length;

  return (
    <div className="admin-page">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        {[
          { label: 'Total Sales', value: `₹${totalSales.toLocaleString()}`, color: '#D4AF37' },
          { label: 'Total Orders', value: orders.length, color: '#6366f1' },
          { label: 'Pending Orders', value: pendingOrders, color: '#f59e0b' },
          { label: 'Total Products', value: products.length, color: '#10b981' },
          { label: 'Low Stock', value: lowStock, color: '#ef4444' },
          { label: 'Out of Stock', value: outOfStock, color: '#dc2626' },
          { label: 'Customers', value: users.length, color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ borderLeftColor: s.color }}>
            <p className="stat-label">{s.label}</p>
            <p className="stat-value">{s.value}</p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: '2rem' }}>Recent Orders</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {orders.slice(0, 10).map(o => (
              <tr key={o.id}>
                <td>#{o.id?.slice(-8)}</td>
                <td>{o.customerName}</td>
                <td>₹{o.total}</td>
                <td><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
                <td>{o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan="5" style={{textAlign:'center',padding:'2rem'}}>No orders yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', description:'', price:'', salePrice:'', category:'', sku:'', stock:'', featured:false, status:'active', images:[''] });

  useEffect(() => { getProducts().then(setProducts); }, []);

  const resetForm = () => { setEditing(null); setForm({ name:'', description:'', price:'', salePrice:'', category:'', sku:'', stock:'', featured:false, status:'active', images:[''] }); };

  const handleSave = async () => {
    const data = { ...form, price: Number(form.price), salePrice: form.salePrice ? Number(form.salePrice) : null, stock: Number(form.stock) };
    if (editing) data.id = editing;
    await saveProduct(data);
    const updated = await getProducts();
    setProducts(updated);
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    setProducts(products.filter(p => p.id !== id));
  };

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, description: p.description, price: p.price, salePrice: p.salePrice || '', category: p.category, sku: p.sku, stock: p.stock, featured: p.featured, status: p.status, images: p.images || [''] });
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setEditing('new'); }}><Plus size={16} /> Add Product</button>
      </div>

      {editing !== null && (
        <div className="admin-form-card">
          <h2>{editing === 'new' ? 'Add Product' : 'Edit Product'}</h2>
          <div className="admin-form-grid">
            <div className="input-group"><label className="input-label">Name</label><input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div className="input-group"><label className="input-label">SKU</label><input className="input-field" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} /></div>
            <div className="input-group"><label className="input-label">Price (₹)</label><input className="input-field" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} /></div>
            <div className="input-group"><label className="input-label">Sale Price (₹)</label><input className="input-field" type="number" value={form.salePrice} onChange={e => setForm({...form, salePrice: e.target.value})} /></div>
            <div className="input-group"><label className="input-label">Category</label><input className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
            <div className="input-group"><label className="input-label">Stock</label><input className="input-field" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} /></div>
          </div>
          <div className="input-group"><label className="input-label">Description</label><textarea className="input-field" rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div className="input-group"><label className="input-label">Image URL</label><input className="input-field" value={form.images[0]} onChange={e => setForm({...form, images: [e.target.value]})} /></div>
          <div style={{display:'flex', gap:'1rem', alignItems:'center', marginTop:'1rem'}}>
            <label><input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /> Featured</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-field" style={{width:'auto'}}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="admin-form-actions">
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
            <button className="btn btn-outline" onClick={resetForm}>Cancel</button>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td><img src={p.images?.[0]} alt="" className="table-thumb" /></td>
                <td><strong>{p.name}</strong><br/><small>{p.category}</small></td>
                <td>₹{p.salePrice || p.price}{p.salePrice && <small style={{textDecoration:'line-through',marginLeft:'4px'}}>₹{p.price}</small>}</td>
                <td className={p.stock <= 0 ? 'text-danger' : p.stock <= 5 ? 'text-warning' : ''}>{p.stock}</td>
                <td><span className={`status-badge status-${p.status === 'active' ? 'delivered' : 'cancelled'}`}>{p.status}</span></td>
                <td className="table-actions">
                  <button onClick={() => startEdit(p)} title="Edit"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} title="Delete"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => { getOrders().then(setOrders); }, []);

  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  const handleStatus = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <div className="admin-page">
      <h1>Orders</h1>
      {selected ? (
        <div className="admin-form-card">
          <button className="btn btn-outline" onClick={() => setSelected(null)} style={{marginBottom:'1rem'}}>← Back</button>
          <h2>Order #{selected.id?.slice(-8)}</h2>
          <p><strong>Customer:</strong> {selected.customerName} ({selected.customerEmail})</p>
          <p><strong>Phone:</strong> {selected.customerPhone}</p>
          {selected.shippingAddress && <p><strong>Address:</strong> {selected.shippingAddress.address}, {selected.shippingAddress.city}, {selected.shippingAddress.state} {selected.shippingAddress.pincode}</p>}
          <div style={{margin:'1rem 0'}}>
            <strong>Status: </strong>
            <select value={selected.status} onChange={e => { handleStatus(selected.id, e.target.value); setSelected({...selected, status: e.target.value}); }} className="input-field" style={{width:'auto',display:'inline'}}>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <h3 style={{marginTop:'1rem'}}>Items</h3>
          {selected.items?.map((item, i) => (
            <div key={i} style={{display:'flex',gap:'1rem',alignItems:'center',padding:'0.75rem 0',borderBottom:'1px solid var(--color-border-light)'}}>
              <img src={item.image} alt="" style={{width:'50px',height:'50px',borderRadius:'6px',objectFit:'cover'}} />
              <div style={{flex:1}}><strong>{item.name}</strong><br/><small>Qty: {item.quantity}</small></div>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div style={{marginTop:'1rem',textAlign:'right'}}>
            <p>Subtotal: ₹{selected.subtotal}</p>
            <p>Shipping: {selected.shippingFee === 0 ? 'Free' : `₹${selected.shippingFee}`}</p>
            <p><strong>Total: ₹{selected.total}</strong></p>
          </div>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id?.slice(-8)}</td>
                  <td>{o.customerName}</td>
                  <td>{o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString() : 'N/A'}</td>
                  <td>₹{o.total}</td>
                  <td><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
                  <td><button onClick={() => setSelected(o)} className="btn btn-outline" style={{padding:'4px 12px',fontSize:'0.8rem'}}>View</button></td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan="6" style={{textAlign:'center',padding:'2rem'}}>No orders yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CustomersManager() {
  const [users, setUsers] = useState([]);
  useEffect(() => { getUsers().then(setUsers); }, []);
  return (
    <div className="admin-page">
      <h1>Customers</h1>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone || '—'}</td>
                <td><span className={`status-badge ${u.role === 'admin' ? 'status-delivered' : 'status-confirmed'}`}>{u.role}</span></td>
                <td>{u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan="5" style={{textAlign:'center',padding:'2rem'}}>No customers yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => { getReviews().then(setReviews); }, []);

  const handleApprove = async (id) => { await updateReviewStatus(id, 'approved'); setReviews(reviews.map(r => r.id === id ? {...r, status:'approved'} : r)); };
  const handleHide = async (id) => { await updateReviewStatus(id, 'hidden'); setReviews(reviews.map(r => r.id === id ? {...r, status:'hidden'} : r)); };
  const handleDelete = async (id) => { await deleteReview(id); setReviews(reviews.filter(r => r.id !== id)); };

  return (
    <div className="admin-page">
      <h1>Reviews</h1>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Customer</th><th>Product</th><th>Rating</th><th>Review</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r.id}>
                <td>{r.userName}</td>
                <td>{r.productName}</td>
                <td>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</td>
                <td style={{maxWidth:'300px'}}>{r.text}</td>
                <td><span className={`status-badge status-${r.status === 'approved' ? 'delivered' : r.status === 'hidden' ? 'cancelled' : 'pending'}`}>{r.status}</span></td>
                <td className="table-actions">
                  <button onClick={() => handleApprove(r.id)} title="Approve"><Check size={16} /></button>
                  <button onClick={() => handleHide(r.id)} title="Hide"><X size={16} /></button>
                  <button onClick={() => handleDelete(r.id)} title="Delete"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && <tr><td colSpan="6" style={{textAlign:'center',padding:'2rem'}}>No reviews yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContactsManager() {
  const [contacts, setContacts] = useState([]);
  useEffect(() => { getContacts().then(setContacts); }, []);

  return (
    <div className="admin-page">
      <h1>Contact Messages</h1>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c.id} className={!c.read ? 'unread' : ''}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone || '—'}</td>
                <td style={{maxWidth:'300px'}}>{c.message}</td>
                <td>{c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString() : 'N/A'}</td>
                <td>
                  {c.read ? <span className="status-badge status-delivered">Read</span> :
                  <button className="btn btn-outline" style={{padding:'4px 12px',fontSize:'0.8rem'}} onClick={() => { markContactRead(c.id); setContacts(contacts.map(x => x.id === c.id ? {...x, read:true} : x)); }}>Mark Read</button>}
                </td>
              </tr>
            ))}
            {contacts.length === 0 && <tr><td colSpan="6" style={{textAlign:'center',padding:'2rem'}}>No messages yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ShippingManager() {
  const [rules, setRules] = useState([]);
  useEffect(() => { getShippingRules().then(setRules); }, []);

  const updateRule = async (rule) => {
    await saveShippingRule(rule);
    setRules(rules.map(r => r.id === rule.id ? rule : r));
  };

  return (
    <div className="admin-page">
      <h1>Shipping Settings</h1>
      <div className="shipping-rules">
        {rules.map(rule => (
          <div key={rule.id} className="admin-form-card" style={{marginBottom:'1rem'}}>
            <h3>{rule.region}</h3>
            <div className="admin-form-grid">
              <div className="input-group"><label className="input-label">Fee (₹)</label>
                <input className="input-field" type="number" value={rule.fee} onChange={e => updateRule({...rule, fee: Number(e.target.value)})} />
              </div>
              <div className="input-group"><label className="input-label">Free above (₹)</label>
                <input className="input-field" type="number" value={rule.freeAbove} onChange={e => updateRule({...rule, freeAbove: Number(e.target.value)})} />
              </div>
            </div>
            <label><input type="checkbox" checked={rule.active} onChange={e => updateRule({...rule, active: e.target.checked})} /> Active</label>
          </div>
        ))}
      </div>
    </div>
  );
}

function WebsiteManager() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getWebsiteSettings().then(setSettings); }, []);

  const update = (path, value) => {
    const keys = path.split('.');
    const newSettings = JSON.parse(JSON.stringify(settings));
    let obj = newSettings;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = value;
    setSettings(newSettings);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleSave = async () => {
    await saveWebsiteSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Website Settings</h1>
        <button className="btn btn-primary" onClick={handleSave}>{saved ? '✓ Saved!' : 'Save All Changes'}</button>
      </div>

      <div className="admin-form-card">
        <h2>Brand</h2>
        <div className="admin-form-grid">
          <div className="input-group"><label className="input-label">Brand Name</label>
            <input className="input-field" value={settings.brand?.name || ''} onChange={e => update('brand.name', e.target.value)} />
          </div>
          <div className="input-group"><label className="input-label">Tagline</label>
            <input className="input-field" value={settings.brand?.tagline || ''} onChange={e => update('brand.tagline', e.target.value)} />
          </div>
        </div>
        <div className="input-group"><label className="input-label">Brand Description</label>
          <textarea className="input-field" rows="2" value={settings.brand?.description || ''} onChange={e => update('brand.description', e.target.value)} />
        </div>
      </div>

      <div className="admin-form-card">
        <h2>Announcement Bar</h2>
        <div className="input-group"><label className="input-label">Text</label>
          <input className="input-field" value={settings.announcement?.text || ''} onChange={e => update('announcement.text', e.target.value)} />
        </div>
        <label><input type="checkbox" checked={settings.announcement?.active || false} onChange={e => update('announcement.active', e.target.checked)} /> Active</label>
      </div>

      <div className="admin-form-card">
        <h2>About</h2>
        <div className="input-group"><label className="input-label">Story Title</label>
          <input className="input-field" value={settings.about?.title || ''} onChange={e => update('about.title', e.target.value)} />
        </div>
        <div className="input-group"><label className="input-label">Story Content</label>
          <textarea className="input-field" rows="6" value={settings.about?.story || ''} onChange={e => update('about.story', e.target.value)} />
        </div>
        <div className="input-group"><label className="input-label">Mission</label>
          <textarea className="input-field" rows="2" value={settings.about?.mission || ''} onChange={e => update('about.mission', e.target.value)} />
        </div>
        <div className="input-group"><label className="input-label">Philosophy</label>
          <textarea className="input-field" rows="2" value={settings.about?.philosophy || ''} onChange={e => update('about.philosophy', e.target.value)} />
        </div>
        <div className="input-group"><label className="input-label">Story Image URL</label>
          <input className="input-field" value={settings.about?.image || ''} onChange={e => update('about.image', e.target.value)} />
          {settings.about?.image && <img src={settings.about.image} alt="Preview" style={{width:'200px',marginTop:'8px',borderRadius:'8px'}} />}
        </div>

        <h3 style={{marginTop:'1.5rem'}}>Sisters</h3>
        {settings.about?.sisters?.map((s, i) => (
          <div key={i} className="admin-form-card" style={{marginTop:'0.75rem', padding:'1rem'}}>
            <div className="admin-form-grid">
              <div className="input-group"><label className="input-label">Name</label>
                <input className="input-field" value={s.name} onChange={e => { const sisters = [...settings.about.sisters]; sisters[i] = {...s, name: e.target.value}; update('about.sisters', sisters); }} />
              </div>
              <div className="input-group"><label className="input-label">Role</label>
                <input className="input-field" value={s.role} onChange={e => { const sisters = [...settings.about.sisters]; sisters[i] = {...s, role: e.target.value}; update('about.sisters', sisters); }} />
              </div>
            </div>
            <div className="input-group"><label className="input-label">Description</label>
              <input className="input-field" value={s.description} onChange={e => { const sisters = [...settings.about.sisters]; sisters[i] = {...s, description: e.target.value}; update('about.sisters', sisters); }} />
            </div>
            <div className="input-group"><label className="input-label">Image URL</label>
              <input className="input-field" value={s.image || ''} onChange={e => { const sisters = [...settings.about.sisters]; sisters[i] = {...s, image: e.target.value}; update('about.sisters', sisters); }} />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-form-card">
        <h2>Contact Info</h2>
        <div className="admin-form-grid">
          <div className="input-group"><label className="input-label">Email</label>
            <input className="input-field" value={settings.contact?.email || ''} onChange={e => update('contact.email', e.target.value)} />
          </div>
          <div className="input-group"><label className="input-label">Phone</label>
            <input className="input-field" value={settings.contact?.phone || ''} onChange={e => update('contact.phone', e.target.value)} />
          </div>
        </div>
        <div className="input-group"><label className="input-label">Address</label>
          <input className="input-field" value={settings.contact?.address || ''} onChange={e => update('contact.address', e.target.value)} />
        </div>
        <div className="input-group"><label className="input-label">Business Hours</label>
          <textarea className="input-field" rows="2" value={settings.contact?.hours || ''} onChange={e => update('contact.hours', e.target.value)} />
        </div>
      </div>

      <div className="admin-form-card">
        <h2>SEO</h2>
        <div className="input-group"><label className="input-label">Site Title</label>
          <input className="input-field" value={settings.seo?.siteTitle || ''} onChange={e => update('seo.siteTitle', e.target.value)} />
        </div>
        <div className="input-group"><label className="input-label">Meta Description</label>
          <textarea className="input-field" rows="2" value={settings.seo?.metaDescription || ''} onChange={e => update('seo.metaDescription', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function SettingsManager() {
  return (
    <div className="admin-page">
      <h1>Settings</h1>
      <div className="admin-form-card">
        <h2>Admin Account</h2>
        <p style={{color:'var(--color-text-secondary)',marginBottom:'1rem'}}>
          To make a user an admin, update their <code>role</code> field to <code>"admin"</code> in Firestore under the <code>users</code> collection.
        </p>
        <p style={{color:'var(--color-text-secondary)'}}>
          <strong>Firebase Console:</strong> <a href="https://console.firebase.google.com/project/ymp2-76be2" target="_blank" rel="noopener noreferrer" style={{color:'var(--color-accent-gold)'}}>Open Firebase Console →</a>
        </p>
      </div>
      <div className="admin-form-card">
        <h2>Firebase Services Required</h2>
        <ul style={{color:'var(--color-text-secondary)', paddingLeft:'1.5rem', lineHeight:'2'}}>
          <li>Authentication → Email/Password (Enabled)</li>
          <li>Cloud Firestore → Database created</li>
          <li>Storage → Default bucket</li>
        </ul>
      </div>
    </div>
  );
}

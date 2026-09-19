import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getOrders } from '../lib/services';
import { Package, Heart, User, LogOut } from 'lucide-react';
import './Account.css';

export default function Account() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return; }
    getOrders(currentUser.uid).then(setOrders).catch(() => {});
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-header">
          <h1>My Account</h1>
          <button onClick={handleLogout} className="btn btn-outline"><LogOut size={16} /> Sign Out</button>
        </div>

        <div className="account-grid">
          <div className="account-card">
            <User size={24} />
            <h3>Profile</h3>
            <p><strong>{currentUser.displayName || userData?.name}</strong></p>
            <p>{currentUser.email}</p>
            {userData?.phone && <p>{userData.phone}</p>}
          </div>
          <Link to="/orders" className="account-card">
            <Package size={24} />
            <h3>My Orders</h3>
            <p>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
          </Link>
          <Link to="/wishlist" className="account-card">
            <Heart size={24} />
            <h3>Wishlist</h3>
            <p>View saved items</p>
          </Link>
        </div>

        {orders.length > 0 && (
          <section className="recent-orders">
            <h2>Recent Orders</h2>
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id}>
                      <td className="order-id">#{order.id.slice(-8)}</td>
                      <td>{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}</td>
                      <td>{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</td>
                      <td className="order-total">₹{order.total}</td>
                      <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                      <td><Link to={`/order/${order.id}`} className="btn btn-outline" style={{padding:'6px 14px',fontSize:'0.85rem'}}>View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

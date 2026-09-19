import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, User, Heart, Search, Menu, X, LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { cartCount } = useCart();
  const { currentUser, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <button className="icon-btn mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="navbar-brand">
          <Link to="/">
            <h1>Four Sisters</h1>
          </Link>
        </div>

        <div className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <NavLink to="/" end onClick={() => setMobileOpen(false)}>Home</NavLink>
          <NavLink to="/shop" onClick={() => setMobileOpen(false)}>Shop</NavLink>
          <NavLink to="/about" onClick={() => setMobileOpen(false)}>About</NavLink>
          <NavLink to="/contact" onClick={() => setMobileOpen(false)}>Contact</NavLink>

        </div>

        <div className="navbar-actions">
          <Link to="/wishlist" className="icon-btn desktop-only"><Heart size={20} /></Link>
          {currentUser ? (
            <Link to="/account" className="icon-btn"><User size={20} /></Link>
          ) : (
            <Link to="/login" className="icon-btn"><User size={20} /></Link>
          )}
          <Link to="/cart" className="icon-btn cart-btn">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

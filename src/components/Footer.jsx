import { Link } from 'react-router-dom';
import { Globe, AtSign, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <h2>Four Sisters</h2>
            <p className="footer-desc">
              Beautiful handmade creations, thoughtfully crafted by four sisters. Made by Hand. Made with Heart.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link"><MessageCircle size={20} /></a>
              <a href="#" className="social-link"><Globe size={20} /></a>
              <a href="#" className="social-link"><AtSign size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links-group">
            <h3>Explore</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop Collection</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-group">
            <h3>Help & Account</h3>
            <ul>
              <li><Link to="/account">My Account</Link></li>
              <li><Link to="/orders">Order History</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/shipping">Shipping Policy</Link></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Contact</h3>
            <ul>
              <li><Mail size={16} /> hello@foursisters.com</li>
              <li><Phone size={16} /> +91 98765 43210</li>
              <li><MapPin size={16} /> 123 Artisan Lane, Craft City</li>
            </ul>
          </div>
          
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Four Sisters Handmade Boutique. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

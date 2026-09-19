import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder, getShippingRules, calculateShipping } from '../lib/services';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [shippingRules, setShippingRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    shippingRegion: 'national'
  });

  useEffect(() => {
    getShippingRules().then(setShippingRules);
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="container page-section text-center">
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Continue Shopping</Link>
      </div>
    );
  }

  const shippingFee = calculateShipping(cartSubtotal, shippingRules, form.shippingRegion);
  const total = cartSubtotal + shippingFee;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderId = await createOrder({
        customerId: currentUser?.uid || 'guest',
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.salePrice || item.price,
          quantity: item.quantity,
          image: item.images?.[0]
        })),
        shippingAddress: {
          address: form.address,
          apartment: form.apartment,
          city: form.city,
          state: form.state,
          country: form.country,
          pincode: form.pincode
        },
        shippingRegion: form.shippingRegion,
        subtotal: cartSubtotal,
        shippingFee,
        total,
        paymentMethod: 'cod'
      });
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      console.error('Error creating order:', err);
      alert('There was an error placing your order. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>
        <form onSubmit={handleSubmit} className="checkout-layout">
          <div className="checkout-form">
            <section className="checkout-section">
              <h2>Customer Information</h2>
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">Full Name *</label>
                  <input className="input-field" name="name" value={form.name} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row two-col">
                <div className="input-group">
                  <label className="input-label">Email *</label>
                  <input className="input-field" type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone *</label>
                  <input className="input-field" type="tel" name="phone" value={form.phone} onChange={handleChange} required />
                </div>
              </div>
            </section>

            <section className="checkout-section">
              <h2>Delivery Address</h2>
              <div className="input-group">
                <label className="input-label">Street Address *</label>
                <input className="input-field" name="address" value={form.address} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label className="input-label">Apartment / House Number</label>
                <input className="input-field" name="apartment" value={form.apartment} onChange={handleChange} />
              </div>
              <div className="form-row two-col">
                <div className="input-group">
                  <label className="input-label">City *</label>
                  <input className="input-field" name="city" value={form.city} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label className="input-label">State *</label>
                  <input className="input-field" name="state" value={form.state} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row two-col">
                <div className="input-group">
                  <label className="input-label">Country</label>
                  <input className="input-field" name="country" value={form.country} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label className="input-label">PIN / ZIP Code *</label>
                  <input className="input-field" name="pincode" value={form.pincode} onChange={handleChange} required />
                </div>
              </div>
            </section>

            <section className="checkout-section">
              <h2>Shipping</h2>
              <div className="shipping-options">
                {shippingRules.filter(r => r.active).map(rule => (
                  <label key={rule.id} className={`shipping-option ${form.shippingRegion === rule.id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="shippingRegion"
                      value={rule.id}
                      checked={form.shippingRegion === rule.id}
                      onChange={handleChange}
                    />
                    <div>
                      <strong>{rule.region}</strong>
                      <span>{cartSubtotal >= rule.freeAbove ? 'Free' : `₹${rule.fee}`}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className="checkout-section">
              <h2>Payment</h2>
              <div className="payment-placeholder">
                <p>💳 Payment integration ready (Razorpay can be connected)</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Currently processing as Cash on Delivery for demo purposes.</p>
              </div>
            </section>
          </div>

          <div className="checkout-summary">
            <h3>Order Summary</h3>
            {cartItems.map(item => (
              <div key={item.id} className="checkout-item">
                <img src={item.images?.[0]} alt={item.name} />
                <div>
                  <p className="checkout-item-name">{item.name}</p>
                  <p className="checkout-item-qty">Qty: {item.quantity}</p>
                </div>
                <span>₹{(item.salePrice || item.price) * item.quantity}</span>
              </div>
            ))}
            <div className="summary-divider"></div>
            <div className="summary-row"><span>Subtotal</span><span>₹{cartSubtotal}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span></div>
            <div className="summary-row total"><span>Total</span><span>₹{total}</span></div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import './Cart.css';

export default function Cart() {
  const { cartItems, cartCount, cartSubtotal, removeFromCart, updateQuantity } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container page-section text-center">
          <ShoppingBag size={64} strokeWidth={1} style={{ color: 'var(--color-border)', marginBottom: '1.5rem' }} />
          <h2>Your Cart is Empty</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Shopping Cart</h1>
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map(item => {
              const price = item.salePrice || item.price;
              return (
                <div key={item.id} className="cart-item">
                  <Link to={`/product/${item.id}`} className="cart-item-image">
                    <img src={item.images?.[0]} alt={item.name} />
                  </Link>
                  <div className="cart-item-details">
                    <Link to={`/product/${item.id}`}><h3>{item.name}</h3></Link>
                    <p className="cart-item-price">₹{price}</p>
                  </div>
                  <div className="cart-item-quantity">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                  </div>
                  <p className="cart-item-subtotal">₹{price * item.quantity}</p>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({cartCount} items)</span>
              <span>₹{cartSubtotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="shipping-note">Calculated at checkout</span>
            </div>
            <div className="summary-row total">
              <span>Estimated Total</span>
              <span>₹{cartSubtotal}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="btn btn-outline" style={{ width: '100%', marginTop: '0.75rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

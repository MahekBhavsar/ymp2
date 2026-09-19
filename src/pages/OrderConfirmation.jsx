import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../lib/services';
import { CheckCircle } from 'lucide-react';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (id) getOrder(id).then(setOrder).catch(() => {});
  }, [id]);

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-card text-center">
          <CheckCircle size={64} strokeWidth={1.5} className="confirm-icon" />
          <h1>Thank You for Supporting Handmade</h1>
          <p className="confirm-subtitle">Your order has been placed successfully! 💕</p>

          {order && (
            <div className="confirm-details">
              <div className="confirm-row">
                <span>Order Number</span>
                <strong>#{order.id?.slice(-8)}</strong>
              </div>
              <div className="confirm-row">
                <span>Items</span>
                <strong>{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</strong>
              </div>
              <div className="confirm-row">
                <span>Subtotal</span>
                <strong>₹{order.subtotal}</strong>
              </div>
              <div className="confirm-row">
                <span>Shipping</span>
                <strong>{order.shippingFee === 0 ? 'Free' : `₹${order.shippingFee}`}</strong>
              </div>
              <div className="confirm-row total">
                <span>Total</span>
                <strong>₹{order.total}</strong>
              </div>
              {order.shippingAddress && (
                <div className="confirm-address">
                  <h3>Delivery Address</h3>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.pincode}</p>
                </div>
              )}
              <div className="confirm-status">
                <span className="status-badge status-pending">{order.status || 'Pending'}</span>
              </div>
            </div>
          )}

          <div className="confirm-actions">
            <Link to="/account" className="btn btn-primary">View My Orders</Link>
            <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

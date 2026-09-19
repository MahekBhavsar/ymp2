import { useState, useEffect } from 'react';
import { getShippingRules } from '../lib/services';
import './Policy.css';

export default function ShippingPolicy() {
  const [shippingRules, setShippingRules] = useState([]);

  useEffect(() => {
    getShippingRules().then(setShippingRules).catch(() => {});
  }, []);

  return (
    <div className="policy-page">
      <div className="policy-hero">
        <div className="container text-center">
          <h1>Shipping Policy</h1>
          <p>Everything you need to know about getting your handmade art delivered.</p>
        </div>
      </div>

      <div className="container page-section">
        <div className="policy-content">
          <section className="policy-section">
            <h2>Order Processing Time</h2>
            <p>
              Because each of our pieces is handmade with love and care, processing times may vary. 
              <strong> Standard orders are typically processed and shipped within 3-5 business days.</strong>
            </p>
            <p>
              Custom orders or larger decorative sets may take up to 7-10 business days. We will communicate with you directly if your order requires additional time.
            </p>
          </section>

          <section className="policy-section">
            <h2>Shipping Rates & Estimates</h2>
            <p>We offer shipping across India. Shipping charges for your order will be calculated and displayed at checkout based on your region.</p>
            
            <div className="shipping-rates-table">
              <table>
                <thead>
                  <tr>
                    <th>Region</th>
                    <th>Standard Fee</th>
                    <th>Free Shipping Over</th>
                  </tr>
                </thead>
                <tbody>
                  {shippingRules.filter(r => r.active).map(rule => (
                    <tr key={rule.id}>
                      <td>{rule.region}</td>
                      <td>₹{rule.fee}</td>
                      <td>₹{rule.freeAbove}</td>
                    </tr>
                  ))}
                  {shippingRules.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center">Loading rates...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="policy-note">
              * Delivery delays can occasionally occur due to public holidays, weather conditions, or unforeseen courier circumstances.
            </p>
          </section>

          <section className="policy-section">
            <h2>Packaging</h2>
            <p>
              We take great pride in our packaging! Your handmade diyas and stones are carefully wrapped in sustainable, eco-friendly materials to ensure they arrive safely without any damage. Delicate items are bubble-wrapped and placed in sturdy corrugated boxes.
            </p>
          </section>

          <section className="policy-section">
            <h2>Damages during Transit</h2>
            <p>
              While we pack everything as securely as possible, if your item arrives damaged, please contact us at <strong>hello@foursisters.com</strong> within 48 hours of delivery. 
              Please include your order number and photos of the damaged item and packaging, and we will arrange a replacement or refund for you.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

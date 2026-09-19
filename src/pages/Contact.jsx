import { useState, useEffect } from 'react';
import { submitContact, getWebsiteSettings } from '../lib/services';
import { DEFAULT_SETTINGS } from '../lib/demoData';
import { Mail, Phone, MapPin, Clock, MessageCircle, Globe, AtSign } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => { getWebsiteSettings().then(setSettings).catch(() => {}); }, []);
  const { contact } = settings;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await submitContact(form); } catch {}
    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container text-center">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you</p>
        </div>
      </div>

      <div className="container page-section">
        <div className="contact-grid">
          <div className="contact-form-wrap">
            <h2>Send Us a Message</h2>
            {sent ? (
              <div className="contact-thanks">
                <h3>Thank you! 💕</h3>
                <p>We've received your message and will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label className="input-label">Name *</label>
                  <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-row two-col">
                  <div className="input-group">
                    <label className="input-label">Email *</label>
                    <input className="input-field" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Phone</label>
                    <input className="input-field" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Message *</label>
                  <textarea className="input-field" rows="5" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            )}
          </div>

          <div className="contact-info-wrap">
            <h2>Contact Info</h2>
            <div className="contact-info-items">
              <div className="contact-info-item">
                <Mail size={20} />
                <div><h4>Email</h4><p>{contact.email}</p></div>
              </div>
              <div className="contact-info-item">
                <Phone size={20} />
                <div><h4>Phone</h4><p>{contact.phone}</p></div>
              </div>
              <div className="contact-info-item">
                <MapPin size={20} />
                <div><h4>Address</h4><p>{contact.address}</p></div>
              </div>
              <div className="contact-info-item">
                <Clock size={20} />
                <div><h4>Business Hours</h4><p style={{whiteSpace:'pre-line'}}>{contact.hours}</p></div>
              </div>
            </div>
            <div className="contact-socials">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <a href={contact.social?.instagram || '#'}><MessageCircle size={22} /></a>
                <a href={contact.social?.facebook || '#'}><Globe size={22} /></a>
                <a href={contact.social?.twitter || '#'}><AtSign size={22} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

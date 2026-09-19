import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories, getHeroSlides, getWebsiteSettings, subscribeNewsletter } from '../lib/services';
import { DEMO_PRODUCTS, DEMO_CATEGORIES, DEMO_HERO_SLIDES, DEFAULT_SETTINGS } from '../lib/demoData';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [categories, setCategories] = useState(DEMO_CATEGORIES);
  const [slides, setSlides] = useState(DEMO_HERO_SLIDES);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    getProducts({ featured: true }).then(setProducts).catch(() => {});
    getCategories().then(setCategories).catch(() => {});
    getHeroSlides().then(setSlides).catch(() => {});
    getWebsiteSettings().then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch { setSubscribed(true); }
  };

  const featuredProducts = products.filter(p => p.featured).slice(0, 6);

  return (
    <div className="home-page">
      {/* Announcement Bar */}
      {settings.announcement?.active && (
        <div className="announcement-bar">
          <p>{settings.announcement.text}</p>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`hero-slide ${index === currentSlide ? 'active' : ''}`}>
            <div className="hero-image-container">
              <img src={slide.image} alt={slide.title} className="hero-image" />
              <div className="hero-overlay"></div>
            </div>
            <div className="hero-content">
              <h2 className="hero-title">{slide.title?.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}</h2>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <Link to={slide.buttonLink || '/shop'} className="btn btn-primary hero-btn">
                {slide.buttonText || 'Shop Now'}
              </Link>
            </div>
          </div>
        ))}
        <button className="hero-nav hero-prev" onClick={prevSlide}><ChevronLeft size={24} /></button>
        <button className="hero-nav hero-next" onClick={nextSlide}><ChevronRight size={24} /></button>
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button key={i} className={`hero-dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="page-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Collection</h2>
            <p className="section-subtitle">Handpicked favorites from our studio</p>
          </div>
          <div className="grid grid-cols-3 product-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/shop" className="btn btn-outline">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="page-section bg-alternate">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Discover our unique collections</p>
          </div>
          <div className="grid grid-cols-3 category-grid">
            {categories.slice(0, 6).map(cat => (
              <Link to={`/shop?category=${cat.id}`} key={cat.id} className="category-card">
                <div className="category-image-wrap">
                  <img src={cat.image} alt={cat.name} />
                </div>
                <h3>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="page-section story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-image">
              <img src={settings.about?.image || '/assets/images/story_sisters.jpg'} alt="Four Sisters" />
            </div>
            <div className="story-content">
              <h2 className="section-title" style={{ textAlign: 'left' }}>Four Sisters, One Beautiful Journey</h2>
              <p className="mb-4">{settings.about?.story?.substring(0, 300) || 'It started at a small kitchen table — four sisters, a handful of paintbrushes, and a shared love for creating beautiful things by hand. What began as a simple hobby quickly grew into something more.'}...</p>
              <Link to="/about" className="btn btn-outline">Read Our Story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="page-section bg-alternate">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-4 features-grid">
            {[
              { icon: '✨', title: 'Made With Love', desc: 'Every creation carries a personal touch.' },
              { icon: '🤲', title: 'Handcrafted', desc: 'Made with care instead of mass production.' },
              { icon: '🎨', title: 'Unique Designs', desc: 'Every collection has its own personality.' },
              { icon: '💝', title: 'Packed With Care', desc: 'Orders are prepared thoughtfully.' }
            ].map((f, i) => (
              <div key={i} className="feature-card text-center">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="page-section newsletter-section">
        <div className="container">
          <div className="newsletter-content text-center">
            <h2 className="section-title">Stay Connected</h2>
            <p className="section-subtitle">Subscribe for new arrivals, behind-the-scenes stories, and exclusive offers.</p>
            {subscribed ? (
              <p className="newsletter-thanks">Thank you for subscribing! 💕</p>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="input-field newsletter-input"
                />
                <button type="submit" className="btn btn-primary">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

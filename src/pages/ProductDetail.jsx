import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { getProduct, getProducts, getReviews, submitReview } from '../lib/services';
import { DEMO_PRODUCTS } from '../lib/demoData';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import { Star, Heart, Minus, Plus, ShoppingCart, ChevronRight } from 'lucide-react';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    setSelectedImage(0);
    getProduct(id).then(p => {
      if (!p) p = DEMO_PRODUCTS.find(dp => dp.id === id || dp.slug === id);
      setProduct(p);
      setLoading(false);
      if (p) {
        getProducts({ category: p.category }).then(prods => {
          setRelated(prods.filter(rp => rp.id !== p.id).slice(0, 4));
        });
        getReviews(p.id, 'approved').then(setReviews).catch(() => {});
      }
    });
  }, [id]);

  if (loading) return <div className="container page-section"><div className="loading-skeleton"></div></div>;
  if (!product) return (
    <div className="container page-section text-center">
      <h2>Product not found</h2>
      <p>The product you're looking for doesn't exist.</p>
      <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Shop</Link>
    </div>
  );

  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    await submitReview({
      productId: product.id,
      productName: product.name,
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Customer',
      rating: reviewRating,
      text: reviewText
    });
    setReviewText('');
    setReviewRating(5);
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> <ChevronRight size={14} />
          <Link to="/shop">Shop</Link> <ChevronRight size={14} />
          <span>{product.name}</span>
        </div>

        <div className="product-detail-grid">
          <div className="product-gallery">
            <div className="gallery-main">
              <img src={product.images?.[selectedImage] || product.images?.[0]} alt={product.name} />
            </div>
            {product.images?.length > 1 && (
              <div className="gallery-thumbs">
                {product.images.map((img, i) => (
                  <button key={i} className={`thumb ${i === selectedImage ? 'active' : ''}`} onClick={() => setSelectedImage(i)}>
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <p className="product-detail-category">{product.categoryName || product.category}</p>
            <h1>{product.name}</h1>

            <div className="product-detail-rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.round(product.rating || 0) ? '#D4AF37' : 'none'} stroke="#D4AF37" />
              ))}
              <span>({product.reviewCount || 0} reviews)</span>
            </div>

            <div className="product-detail-price">
              {hasDiscount ? (
                <>
                  <span className="detail-price-current">₹{product.salePrice}</span>
                  <span className="detail-price-original">₹{product.price}</span>
                  <span className="detail-discount">Save ₹{product.price - product.salePrice}</span>
                </>
              ) : (
                <span className="detail-price-current">₹{product.price}</span>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            <div className="product-meta">
              <p><strong>SKU:</strong> {product.sku}</p>
              <p><strong>Availability:</strong> {isOutOfStock ? <span className="out">Out of Stock</span> : <span className="in">In Stock ({product.stock} available)</span>}</p>
            </div>

            {!isOutOfStock && (
              <div className="product-actions-detail">
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus size={16} /></button>
                </div>
                <button className="btn btn-primary" onClick={handleAddToCart}>
                  <ShoppingCart size={18} />
                  {added ? 'Added!' : 'Add to Cart'}
                </button>
                <Link to="/cart" className="btn btn-outline" onClick={handleAddToCart}>Buy Now</Link>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <section className="reviews-section page-section">
          <h2 className="section-title">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-center" style={{ color: 'var(--color-text-secondary)' }}>No reviews yet. Be the first to review!</p>
          ) : (
            <div className="reviews-list">
              {reviews.map(r => (
                <div key={r.id} className="review-card">
                  <div className="review-header">
                    <strong>{r.userName}</strong>
                    <div className="review-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < r.rating ? '#D4AF37' : 'none'} stroke="#D4AF37" />
                      ))}
                    </div>
                  </div>
                  <p>{r.text}</p>
                </div>
              ))}
            </div>
          )}

          {currentUser && (
            <form onSubmit={handleReview} className="review-form">
              <h3>Write a Review</h3>
              <div className="review-rating-input">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setReviewRating(n)}>
                    <Star size={20} fill={n <= reviewRating ? '#D4AF37' : 'none'} stroke="#D4AF37" />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this product..."
                required
                className="input-field"
                rows="4"
              />
              <button type="submit" className="btn btn-primary">Submit Review</button>
            </form>
          )}
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="page-section">
            <h2 className="section-title text-center">You May Also Like</h2>
            <div className="grid grid-cols-4 product-grid" style={{ marginTop: '2rem' }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

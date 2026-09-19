import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [animatingWishlist, setAnimatingWishlist] = useState(false);
  const [animatingCart, setAnimatingCart] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

  return (
    <div className="product-card">
      <div className="product-card-image">
        <Link to={`/product/${product.id}`}>
          {!imageLoaded && <div className="image-skeleton"></div>}
          <img
            src={product.images?.[0] || '/assets/images/product_floral_diya.jpg'}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        </Link>
        
        {hasDiscount && <span className="product-badge sale">-{discountPercent}%</span>}
        {isOutOfStock && <span className="product-badge out-of-stock">Out of Stock</span>}
        {product.featured && !isOutOfStock && !hasDiscount && <span className="product-badge featured">Featured</span>}
        
        <div className="product-actions-overlay">
          <button
            className={`action-btn ${isWishlisted ? 'wishlisted' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
              setAnimatingWishlist(true);
              setTimeout(() => setAnimatingWishlist(false), 400);
            }}
            title="Add to Wishlist"
          >
            <Heart size={18} fill={isWishlisted ? '#e07070' : 'none'} className={animatingWishlist ? 'anim-heartbeat' : ''} />
          </button>
          <Link to={`/product/${product.id}`} className="action-btn" title="Quick View">
            <Eye size={18} />
          </Link>
        </div>
      </div>
      
      <div className="product-card-info">
        <p className="product-category">{product.categoryName || product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < Math.round(product.rating || 0) ? '#D4AF37' : 'none'} stroke="#D4AF37" />
          ))}
          <span>({product.reviewCount || 0})</span>
        </div>
        
        <div className="product-price">
          {hasDiscount ? (
            <>
              <span className="price-current">₹{product.salePrice}</span>
              <span className="price-original">₹{product.price}</span>
            </>
          ) : (
            <span className="price-current">₹{product.price}</span>
          )}
        </div>
        
        <button
          className={`btn btn-primary product-add-cart ${animatingCart ? 'anim-popIn' : ''}`}
          disabled={isOutOfStock}
          onClick={(e) => {
            e.preventDefault();
            if (isOutOfStock) return;
            addToCart(product);
            setAnimatingCart(true);
            setTimeout(() => setAnimatingCart(false), 300);
          }}
        >
          {isOutOfStock ? 'Out of Stock' : (animatingCart ? 'Added!' : 'Add to Cart')}
        </button>
      </div>
    </div>
  );
}

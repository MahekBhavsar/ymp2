import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../lib/services';
import { DEMO_PRODUCTS, DEMO_CATEGORIES } from '../lib/demoData';
import { Search, SlidersHorizontal } from 'lucide-react';
import './Shop.css';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [categories, setCategories] = useState(DEMO_CATEGORIES);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => {});
    getCategories().then(setCategories).catch(() => {});
  }, []);

  let filtered = [...products].filter(p => p.status === 'active' || !p.status);
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (selectedCategory) filtered = filtered.filter(p => p.category === selectedCategory);

  if (sort === 'price-asc') filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  else if (sort === 'price-desc') filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  else if (sort === 'popular') filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));

  return (
    <div className="shop-page">
      <div className="shop-hero">
        <div className="container">
          <h1>Our Collection</h1>
          <p>Discover handmade art pieces crafted with love</p>
        </div>
      </div>

      <div className="container">
        <div className="shop-toolbar">
          <div className="shop-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="shop-controls">
            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={18} /> Filters
            </button>
            <select value={sort} onChange={e => setSort(e.target.value)} className="shop-sort">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="popular">Popular</option>
            </select>
          </div>
        </div>

        <div className="shop-layout">
          <aside className={`shop-sidebar ${showFilters ? 'show' : ''}`}>
            <h3>Categories</h3>
            <ul className="category-filter-list">
              <li>
                <button className={!selectedCategory ? 'active' : ''} onClick={() => setSelectedCategory('')}>
                  All Products
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    className={selectedCategory === cat.id ? 'active' : ''}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="shop-products">
            {filtered.length === 0 ? (
              <div className="empty-state text-center">
                <h3>No products found</h3>
                <p>Try adjusting your search or filters.</p>
              </div>
            ) : (
              <>
                <p className="results-count">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
                <div className="grid grid-cols-3 product-grid">
                  {filtered.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

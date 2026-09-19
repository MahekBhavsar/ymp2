// Demo products data used for initial display before Firestore loads
export const DEMO_PRODUCTS = [
  {
    id: 'prod_001',
    name: 'Floral Hand-Painted Diya',
    slug: 'floral-hand-painted-diya',
    description: 'A beautifully hand-painted terracotta diya adorned with intricate floral patterns in vibrant colors. Each diya is a unique piece of art, perfect for Diwali celebrations or as an everyday decorative accent.',
    price: 299,
    salePrice: null,
    category: 'diyas',
    categoryName: 'Diyas',
    sku: 'FS-DY-001',
    images: ['/assets/images/product_floral_diya.jpg'],
    stock: 25,
    status: 'active',
    featured: true,
    rating: 4.8,
    reviewCount: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod_002',
    name: 'Lavender Diya Set',
    slug: 'lavender-diya-set',
    description: 'An elegant set of hand-painted lavender-toned diyas with delicate gold accents. These calming pieces bring serenity and beauty to any space. Set includes 4 diyas of varying sizes.',
    price: 499,
    salePrice: 449,
    category: 'diyas',
    categoryName: 'Diyas',
    sku: 'FS-DY-002',
    images: ['/assets/images/product_lavender_set.jpg'],
    stock: 15,
    status: 'active',
    featured: true,
    rating: 4.9,
    reviewCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod_003',
    name: 'Mandala Painted Stone',
    slug: 'mandala-painted-stone',
    description: 'A stunning hand-painted mandala stone featuring intricate blue and gold dot-work patterns. Each stone is carefully selected and painted by hand, making every piece truly one-of-a-kind.',
    price: 349,
    salePrice: null,
    category: 'stones',
    categoryName: 'Hand-Painted Stones',
    sku: 'FS-ST-001',
    images: ['/assets/images/product_mandala_stone.jpg'],
    stock: 20,
    status: 'active',
    featured: true,
    rating: 4.7,
    reviewCount: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod_004',
    name: 'Floral Art Stone',
    slug: 'floral-art-stone',
    description: 'A beautifully painted river stone featuring delicate pink roses and green foliage. This charming piece of art makes a perfect desk accessory or a thoughtful handmade gift.',
    price: 399,
    salePrice: 349,
    category: 'stones',
    categoryName: 'Hand-Painted Stones',
    sku: 'FS-ST-002',
    images: ['/assets/images/product_floral_stone.jpg'],
    stock: 18,
    status: 'active',
    featured: true,
    rating: 4.6,
    reviewCount: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod_005',
    name: 'Handmade Festive Gift Set',
    slug: 'handmade-festive-gift-set',
    description: 'A curated gift set featuring a selection of our finest handmade pieces — mini diyas, painted stones, and decorative elements — beautifully wrapped in natural linen with dried flowers.',
    price: 799,
    salePrice: null,
    category: 'gifts',
    categoryName: 'Gifts',
    sku: 'FS-GF-001',
    images: ['/assets/images/product_gift_set.jpg'],
    stock: 10,
    status: 'active',
    featured: true,
    rating: 5.0,
    reviewCount: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod_006',
    name: 'Decorative Hand-Painted Set',
    slug: 'decorative-hand-painted-set',
    description: 'A comprehensive set of hand-painted terracotta decorative pieces featuring matching mandala patterns. Includes plates, bowls, and wall hangings for a cohesive handmade home decor look.',
    price: 599,
    salePrice: 549,
    category: 'decor',
    categoryName: 'Home Decor',
    sku: 'FS-DC-001',
    images: ['/assets/images/product_decorative_set.jpg'],
    stock: 8,
    status: 'active',
    featured: false,
    rating: 4.5,
    reviewCount: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const DEMO_CATEGORIES = [
  { id: 'diyas', name: 'Diyas', slug: 'diyas', image: '/assets/images/product_floral_diya.jpg', order: 1, active: true },
  { id: 'stones', name: 'Hand-Painted Stones', slug: 'hand-painted-stones', image: '/assets/images/product_mandala_stone.jpg', order: 2, active: true },
  { id: 'decor', name: 'Home Decor', slug: 'home-decor', image: '/assets/images/product_decorative_set.jpg', order: 3, active: true },
  { id: 'gifts', name: 'Gifts', slug: 'gifts', image: '/assets/images/product_gift_set.jpg', order: 4, active: true },
  { id: 'new-arrivals', name: 'New Arrivals', slug: 'new-arrivals', image: '/assets/images/hero_2.jpg', order: 5, active: true },
  { id: 'seasonal', name: 'Seasonal Collection', slug: 'seasonal-collection', image: '/assets/images/hero_3.jpg', order: 6, active: true }
];

export const DEMO_HERO_SLIDES = [
  {
    id: 'slide_1',
    title: 'Made by Hand.\nMade with Heart.',
    subtitle: 'Beautiful handmade creations, thoughtfully crafted by four sisters.',
    buttonText: 'Shop Collection',
    buttonLink: '/shop',
    image: '/assets/images/hero_1.jpg',
    order: 1,
    active: true
  },
  {
    id: 'slide_2',
    title: 'Little Pieces of Art\nfor Your Home',
    subtitle: 'Hand-painted details, thoughtful designs and handmade charm.',
    buttonText: 'Explore Products',
    buttonLink: '/shop',
    image: '/assets/images/hero_2.jpg',
    order: 2,
    active: true
  },
  {
    id: 'slide_3',
    title: 'Four Sisters.\nOne Creative Journey.',
    subtitle: 'From a small idea to handmade creations made with love.',
    buttonText: 'Our Story',
    buttonLink: '/about',
    image: '/assets/images/hero_3.jpg',
    order: 3,
    active: true
  }
];

export const DEFAULT_SETTINGS = {
  brand: {
    name: 'Four Sisters',
    tagline: 'Made by Hand. Made with Heart.',
    description: 'Beautiful handmade creations, thoughtfully crafted by four sisters.',
    logo: ''
  },
  about: {
    title: 'Four Sisters. One Dream. Made by Hand.',
    story: 'It started at a small kitchen table — four sisters, a handful of paintbrushes, and a shared love for creating beautiful things by hand. What began as a simple hobby quickly grew into something more. We found joy in painting intricate mandalas on river stones, shaping clay into elegant diyas, and crafting thoughtful gifts for the people we love.\n\nEach piece we create carries a story — of late-night painting sessions, of colors chosen with care, of hands that shape every curve with intention. We believe that handmade things have a soul. They carry the warmth of the hands that made them and the love of the hearts behind them.\n\nFour Sisters is more than a brand. It is our creative journey — from a small idea born out of love to a growing collection of handmade art for your home.',
    sisters: [
      { name: 'Ananya', role: 'Creative Direction', description: 'The visionary who sees beauty in everything and transforms ideas into stunning collections.', image: '' },
      { name: 'Priya', role: 'Product Design', description: 'The designer who sketches every pattern and ensures each piece tells a story.', image: '' },
      { name: 'Meera', role: 'Craft & Painting', description: 'The artist whose steady hands bring intricate mandalas and florals to life.', image: '' },
      { name: 'Diya', role: 'Operations & Packaging', description: 'The organizer who makes sure every order is packed with love and delivered with care.', image: '' }
    ],
    mission: 'To create beautiful, meaningful handmade art that brings warmth and personality to every home.',
    philosophy: 'We believe in slow craft, thoughtful design, and the beauty of imperfection that makes handmade art truly special.',
    image: '/assets/images/story_sisters.jpg'
  },
  contact: {
    email: 'hello@foursisters.com',
    phone: '+91 98765 43210',
    address: '123 Artisan Lane, Craft City, India',
    hours: 'Monday - Saturday: 10:00 AM - 7:00 PM\nSunday: Closed',
    social: {
      instagram: '#',
      facebook: '#',
      twitter: '#',
      pinterest: '#'
    }
  },
  footer: {
    description: 'Beautiful handmade creations, thoughtfully crafted by four sisters. Made by Hand. Made with Heart.',
    links: []
  },
  seo: {
    siteTitle: 'Four Sisters Handmade Boutique | Made by Hand. Made with Heart.',
    metaDescription: 'Discover unique handmade diyas, hand-painted stones, home decor and gifts crafted with love by four sisters. Premium handmade art for your home.',
    socialImage: '/assets/images/hero_1.jpg'
  },
  announcement: {
    text: '✨ Free shipping on orders above ₹999! ✨',
    active: true
  }
};

export const DEFAULT_SHIPPING_RULES = [
  { id: 'local', region: 'Local (Same City)', fee: 50, minOrder: 0, freeAbove: 499, active: true },
  { id: 'state', region: 'Same State', fee: 80, minOrder: 0, freeAbove: 799, active: true },
  { id: 'national', region: 'Other States', fee: 120, minOrder: 0, freeAbove: 999, active: true },
  { id: 'remote', region: 'Remote Areas', fee: 180, minOrder: 0, freeAbove: 1499, active: true }
];

import { db } from './firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, where, orderBy, limit, addDoc, updateDoc, deleteDoc, serverTimestamp, increment, writeBatch } from 'firebase/firestore';
import { DEMO_PRODUCTS, DEMO_CATEGORIES, DEMO_HERO_SLIDES, DEFAULT_SETTINGS, DEFAULT_SHIPPING_RULES } from './demoData';

// ===== PRODUCTS =====
export async function getProducts(filters = {}) {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    if (snapshot.empty) {
      // Return demo products if Firestore is empty
      let products = [...DEMO_PRODUCTS];
      if (filters.category) products = products.filter(p => p.category === filters.category);
      if (filters.featured) products = products.filter(p => p.featured);
      return products;
    }
    
    let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (filters.category) products = products.filter(p => p.category === filters.category);
    if (filters.featured) products = products.filter(p => p.featured);
    if (filters.status) products = products.filter(p => p.status === filters.status);
    
    // Sorting
    if (filters.sort === 'price-asc') products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    else if (filters.sort === 'price-desc') products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    else if (filters.sort === 'popular') products.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    else products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return DEMO_PRODUCTS;
  }
}

export async function getProduct(id) {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    return DEMO_PRODUCTS.find(p => p.id === id || p.slug === id) || null;
  } catch {
    return DEMO_PRODUCTS.find(p => p.id === id || p.slug === id) || null;
  }
}

export async function saveProduct(product) {
  if (product.id && !product.id.startsWith('prod_')) {
    const docRef = doc(db, 'products', product.id);
    await updateDoc(docRef, { ...product, updatedAt: serverTimestamp() });
    return product.id;
  }
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, 'products', id));
}

// ===== CATEGORIES =====
export async function getCategories() {
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    if (snapshot.empty) return DEMO_CATEGORIES;
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.order - b.order);
  } catch {
    return DEMO_CATEGORIES;
  }
}

export async function saveCategory(category) {
  if (category.id) {
    await setDoc(doc(db, 'categories', category.id), category, { merge: true });
    return category.id;
  }
  const docRef = await addDoc(collection(db, 'categories'), category);
  return docRef.id;
}

export async function deleteCategory(id) {
  await deleteDoc(doc(db, 'categories', id));
}

// ===== ORDERS =====
export async function createOrder(orderData) {
  const batch = writeBatch(db);
  
  // Create the order
  const orderRef = doc(collection(db, 'orders'));
  const order = {
    ...orderData,
    orderId: orderRef.id,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  batch.set(orderRef, order);
  
  // Decrease stock for each product
  for (const item of orderData.items) {
    if (!item.id.startsWith('prod_')) {
      const productRef = doc(db, 'products', item.id);
      batch.update(productRef, { stock: increment(-item.quantity) });
    }
  }
  
  await batch.commit();
  return orderRef.id;
}

export async function getOrders(userId = null) {
  try {
    const ordersRef = collection(db, 'orders');
    const snapshot = userId
      ? await getDocs(query(ordersRef, where('customerId', '==', userId), orderBy('createdAt', 'desc')))
      : await getDocs(query(ordersRef, orderBy('createdAt', 'desc')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

export async function getOrder(orderId) {
  const docSnap = await getDoc(doc(db, 'orders', orderId));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: serverTimestamp() });
}

// ===== REVIEWS =====
export async function getReviews(productId = null, status = null) {
  try {
    const reviewsRef = collection(db, 'reviews');
    const snapshot = await getDocs(reviewsRef);
    let reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (productId) reviews = reviews.filter(r => r.productId === productId);
    if (status) reviews = reviews.filter(r => r.status === status);
    return reviews;
  } catch {
    return [];
  }
}

export async function submitReview(review) {
  return addDoc(collection(db, 'reviews'), {
    ...review,
    status: 'pending',
    createdAt: serverTimestamp()
  });
}

export async function updateReviewStatus(reviewId, status) {
  await updateDoc(doc(db, 'reviews', reviewId), { status });
}

export async function deleteReview(reviewId) {
  await deleteDoc(doc(db, 'reviews', reviewId));
}

// ===== CONTACTS =====
export async function submitContact(contact) {
  return addDoc(collection(db, 'contacts'), {
    ...contact,
    read: false,
    createdAt: serverTimestamp()
  });
}

export async function getContacts() {
  try {
    const snapshot = await getDocs(query(collection(db, 'contacts'), orderBy('createdAt', 'desc')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

export async function markContactRead(id) {
  await updateDoc(doc(db, 'contacts', id), { read: true });
}

// ===== WEBSITE SETTINGS =====
export async function getWebsiteSettings() {
  try {
    const docSnap = await getDoc(doc(db, 'websiteSettings', 'main'));
    return docSnap.exists() ? docSnap.data() : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveWebsiteSettings(settings) {
  await setDoc(doc(db, 'websiteSettings', 'main'), settings, { merge: true });
}

// ===== HERO SLIDES =====
export async function getHeroSlides() {
  try {
    const snapshot = await getDocs(collection(db, 'heroSlides'));
    if (snapshot.empty) return DEMO_HERO_SLIDES;
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.order - b.order);
  } catch {
    return DEMO_HERO_SLIDES;
  }
}

export async function saveHeroSlide(slide) {
  if (slide.id) {
    await setDoc(doc(db, 'heroSlides', slide.id), slide, { merge: true });
    return slide.id;
  }
  const docRef = await addDoc(collection(db, 'heroSlides'), slide);
  return docRef.id;
}

// ===== SHIPPING =====
export async function getShippingRules() {
  try {
    const snapshot = await getDocs(collection(db, 'shippingRules'));
    if (snapshot.empty) return DEFAULT_SHIPPING_RULES;
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch {
    return DEFAULT_SHIPPING_RULES;
  }
}

export async function saveShippingRule(rule) {
  if (rule.id) {
    await setDoc(doc(db, 'shippingRules', rule.id), rule, { merge: true });
    return rule.id;
  }
  const docRef = await addDoc(collection(db, 'shippingRules'), rule);
  return docRef.id;
}

export function calculateShipping(subtotal, shippingRules, region = 'national') {
  const rule = shippingRules.find(r => r.id === region && r.active);
  if (!rule) return 120; // Default fallback
  if (subtotal >= rule.freeAbove) return 0;
  return rule.fee;
}

// ===== NEWSLETTER =====
export async function subscribeNewsletter(email) {
  return addDoc(collection(db, 'newsletterSubscribers'), {
    email,
    createdAt: serverTimestamp()
  });
}

// ===== USERS (Admin) =====
export async function getUsers() {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

export async function getUserById(userId) {
  const docSnap = await getDoc(doc(db, 'users', userId));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

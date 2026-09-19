/**
 * Seed Script for Four Sisters Handmade Boutique
 * 
 * This script populates your Firestore database with demo products,
 * categories, hero slides, website settings, and shipping rules.
 * 
 * HOW TO RUN:
 * 1. Open the app in your browser
 * 2. Open the browser console (F12 → Console)
 * 3. Copy and paste the content of this file
 * 4. OR: Import and call seedDatabase() from any component
 * 
 * NOTE: This uses the same Firebase instance as the app.
 */

import { db } from './firebase.js';
import { doc, setDoc, collection, writeBatch, serverTimestamp } from 'firebase/firestore';
import { DEMO_PRODUCTS, DEMO_CATEGORIES, DEMO_HERO_SLIDES, DEFAULT_SETTINGS, DEFAULT_SHIPPING_RULES } from './demoData.js';

export async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  try {
    const batch = writeBatch(db);

    // Seed Products
    for (const product of DEMO_PRODUCTS) {
      const ref = doc(db, 'products', product.id);
      batch.set(ref, {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    console.log(`📦 ${DEMO_PRODUCTS.length} products queued`);

    // Seed Categories
    for (const category of DEMO_CATEGORIES) {
      const ref = doc(db, 'categories', category.id);
      batch.set(ref, category);
    }
    console.log(`🏷️  ${DEMO_CATEGORIES.length} categories queued`);

    // Seed Hero Slides
    for (const slide of DEMO_HERO_SLIDES) {
      const ref = doc(db, 'heroSlides', slide.id);
      batch.set(ref, slide);
    }
    console.log(`🎠 ${DEMO_HERO_SLIDES.length} hero slides queued`);

    // Seed Website Settings
    batch.set(doc(db, 'websiteSettings', 'main'), DEFAULT_SETTINGS);
    console.log('⚙️  Website settings queued');

    // Seed Shipping Rules
    for (const rule of DEFAULT_SHIPPING_RULES) {
      const ref = doc(db, 'shippingRules', rule.id);
      batch.set(ref, rule);
    }
    console.log(`🚚 ${DEFAULT_SHIPPING_RULES.length} shipping rules queued`);

    // Commit all
    await batch.commit();
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📝 NEXT STEP: Create your first admin account:');
    console.log('   1. Register a new account on the website');
    console.log('   2. Go to Firebase Console → Firestore');
    console.log('   3. Find your user document in the "users" collection');
    console.log('   4. Change the "role" field from "customer" to "admin"');
    console.log('   5. Refresh the website and visit /admin');

  } catch (error) {
    console.error('❌ Seed error:', error);
  }
}

// Auto-run if loaded directly in browser console
if (typeof window !== 'undefined') {
  window.seedDatabase = seedDatabase;
}

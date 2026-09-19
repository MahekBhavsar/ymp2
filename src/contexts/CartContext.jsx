import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('foursisters_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('foursisters_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product, quantity = 1) {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { ...product, quantity: Math.min(quantity, product.stock) }];
    });
  }

  function removeFromCart(productId) {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => {
    const price = item.salePrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  const value = {
    cartItems,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

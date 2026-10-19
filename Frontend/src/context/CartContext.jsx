import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('craftlanka_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  });

  // Save cart items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('craftlanka_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cartItems]);

  // Add product to cart
  const addToCart = (product, quantity = 1) => {
    if (!product || product.id === undefined || product.id === null) {
      console.error('Invalid product:', product);
      return;
    }

    if (quantity < 1) return;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => String(item.id) === String(product.id)
      );

      if (existingItem) {
        return currentItems.map((item) =>
          String(item.id) === String(product.id)
            ? {
                ...item,
                quantity: Number(item.quantity || 0) + Number(quantity),
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          id: String(product.id),
          price: Number(product.price) || 0,
          quantity: Number(quantity),
        },
      ];
    });
  };

  // Update product quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        String(item.id) === String(id)
          ? { ...item, quantity: Number(quantity) }
          : item
      )
    );
  };

  // Remove product from cart
  const removeFromCart = (id) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => String(item.id) !== String(id)
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Total number of items
  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  // Total price
  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * Number(item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
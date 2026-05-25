import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const refreshCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const items = await cartService.getCart();
      setCart(items);
    } catch (error) {
      console.error("Error fetching cart from database", error);
    } finally {
      setLoading(false);
    }
  };

  // Sync cart state when user state changes
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const addToCart = async (plantId, quantity) => {
    try {
      const addedItem = await cartService.addToCart(plantId, quantity);
      await refreshCart();
      return addedItem;
    } catch (error) {
      throw error;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const updatedItem = await cartService.updateQuantity(cartItemId, quantity);
      await refreshCart();
      return updatedItem;
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await cartService.removeCartItem(cartItemId);
      await refreshCart();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartService.clearCart();
      setCart([]);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Calculate total items count in cart
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Calculate total checkout cost
  const cartTotal = cart.reduce((total, item) => total + (item.plant.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

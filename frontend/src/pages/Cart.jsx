import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, MapPin, AlertCircle, Sparkles } from 'lucide-react';
import orderService from '../services/orderService';

export const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, cartTotal, refreshCart } = useCart();
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  // Pricing computations
  const shippingFee = cartTotal > 50 ? 0 : 5.99; // Free shipping on orders above $50
  const salesTax = cartTotal * 0.08; // 8% estimated sales tax
  const checkoutTotal = cartTotal + shippingFee + salesTax;

  const handleQuantityDecrease = async (item) => {
    if (item.quantity <= 1) return;
    try {
      setError('');
      await updateQuantity(item.id, item.quantity - 1);
    } catch (err) {
      console.error(err);
      setError('Could not update quantity. Check stock availability.');
    }
  };

  const handleQuantityIncrease = async (item) => {
    try {
      setError('');
      await updateQuantity(item.id, item.quantity + 1);
    } catch (err) {
      console.error(err);
      setError('Could not increase quantity. Maximum greenhouse stock reached.');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      setError('');
      await removeFromCart(itemId);
    } catch (err) {
      console.error(err);
      setError('Failed to remove item from cart.');
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('A valid shipping address is required for dispatch.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await orderService.checkout(address);
      setSuccess(true);
      
      // Refresh the context to flush cart state
      await refreshCart();

      // Redirect to user orders after 2 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Checkout failed. Please inspect stock levels or try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full glass-panel p-8 text-center border border-nature-500/20 bg-emerald-500/5 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-nature-500"></div>
          
          <div className="h-16 w-16 bg-nature-500/10 border border-nature-500/20 rounded-full flex items-center justify-center mx-auto text-nature-450 animate-bounce">
            <Sparkles className="h-8 w-8 text-nature-500" />
          </div>

          <div className="space-y-2">
            <h2 className="font-outfit font-extrabold text-2xl text-slate-100">Order Placed Securely!</h2>
            <p className="text-sm text-slate-400">
              Your shipping label has been created. Redirecting you to your delivery timeline...
            </p>
          </div>

          <div className="w-12 h-12 rounded-full border-4 border-slate-900 border-t-nature-500 animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="border-b border-slate-900 pb-4">
        <h1 className="font-outfit font-extrabold text-3xl text-slate-100">Your Botanical Basket</h1>
        <p className="text-xs text-slate-400 mt-1">Review your greenhouse selections and checkout securely.</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {cart.length === 0 ? (
        // Empty Cart State
        <div className="glass-panel p-16 text-center border border-slate-900 bg-slate-900/10 flex flex-col items-center justify-center space-y-5 max-w-lg mx-auto">
          <div className="h-16 w-16 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-500">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="font-outfit font-bold text-xl text-slate-200">Your Basket is Empty</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              You haven't added any gorgeous plants to your catalog basket yet. Let's find some gorgeous green spaces!
            </p>
          </div>
          <Link
            to="/shop"
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-nature-600 font-bold font-outfit text-xs text-slate-950 rounded-xl hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            Explore Catalog Catalog
          </Link>
        </div>
      ) : (
        // Grid layout
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Cart items list */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="glass-panel p-5 border border-slate-900/80 bg-slate-900/10 flex flex-col sm:flex-row items-center gap-5 hover:border-slate-800 transition-colors duration-300"
              >
                {/* Image */}
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-900 flex-shrink-0">
                  <img
                    src={item.plant.imageUrl}
                    alt={item.plant.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info details */}
                <div className="flex-grow text-center sm:text-left space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    {item.plant.category?.name}
                  </span>
                  <h3 className="font-outfit font-bold text-lg text-slate-200 leading-tight">
                    {item.plant.name}
                  </h3>
                  <p className="text-xs text-nature-400 font-bold">
                    ${item.plant.price.toFixed(2)} each
                  </p>
                </div>

                {/* Quantity adjustments */}
                <div className="flex items-center space-x-2 bg-slate-950 border border-slate-850 p-1.5 rounded-xl">
                  <button
                    onClick={() => handleQuantityDecrease(item)}
                    disabled={item.quantity <= 1}
                    className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-bold text-slate-200 w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityIncrease(item)}
                    className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Subtotal & Remove */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto border-t sm:border-t-0 border-slate-900 pt-4 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-550 block">Subtotal</span>
                    <span className="font-outfit text-base font-extrabold text-slate-100">
                      ${(item.plant.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-all duration-300"
                    title="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Checkout form & receipts */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 border border-slate-900 bg-slate-900/10 space-y-6">
              <h2 className="font-outfit font-bold text-lg text-slate-200 flex items-center space-x-2 border-b border-slate-900 pb-3">
                <CreditCard className="h-5 w-5 text-nature-500" />
                <span>Checkout Sheet</span>
              </h2>

              {/* Price summary sheet */}
              <div className="space-y-3.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-bold text-slate-200">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span>Climate Shipping</span>
                    {shippingFee === 0 && (
                      <span className="text-[9px] text-emerald-450 font-bold">Free above $50!</span>
                    )}
                  </div>
                  <span className="font-bold text-slate-200">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Greenhouse Sales Tax (8%)</span>
                  <span className="font-bold text-slate-200">${salesTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-900 pt-3.5 text-sm">
                  <span className="font-bold text-slate-300">Checkout Total</span>
                  <span className="font-outfit font-black text-lg text-nature-400">
                    ${checkoutTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Shipping Form */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 flex items-center space-x-1 pl-1">
                    <MapPin className="h-3.5 w-3.5 text-nature-500" />
                    <span>Shipping Address</span>
                  </label>
                  <textarea
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-850 focus:border-nature-500/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-650 outline-none transition-all duration-300 resize-none"
                    placeholder="Enter street, apartment, city, state, zip..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-nature-600 hover:brightness-110 active:scale-98 disabled:brightness-50 text-slate-950 font-bold font-outfit text-sm rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-glass"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CreditCard className="h-4.5 w-4.5" />
                      <span>Place Secure Order</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

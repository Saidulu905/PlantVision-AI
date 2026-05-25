import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Leaf,
  ShoppingCart,
  LogOut,
  Cpu,
  Settings,
  Menu,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="glass-navbar border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-nature-500/10 p-2 rounded-xl border border-nature-500/20 group-hover:border-nature-500/50 transition-all duration-300">
              <Leaf className="h-6 w-6 text-nature-500 group-hover:rotate-12 transition-transform duration-300" />
            </div>

            <span className="font-outfit font-bold text-xl tracking-tight text-slate-100">
              PlantVision <span className="text-nature-500 font-extrabold">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">

            <Link
              to="/shop"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive('/shop')
                  ? 'text-nature-500 bg-nature-500/5 font-semibold border border-nature-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
              }`}
            >
              Shop Catalog
            </Link>

            <Link
              to="/ai-detect"
              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-1.5 transition-all duration-300 ${
                isActive('/ai-detect')
                  ? 'text-nature-500 bg-nature-500/5 font-semibold border border-nature-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>AI Identify</span>
            </Link>

            {user && (
              <Link
                to="/orders"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive('/orders')
                    ? 'text-nature-500 bg-nature-500/5 font-semibold border border-nature-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                My Orders
              </Link>
            )}

            {user && user.role === 'ROLE_ADMIN' && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-1.5 transition-all duration-300 ${
                  isActive('/admin')
                    ? 'text-amber-500 bg-amber-500/5 font-semibold border border-amber-500/10'
                    : 'text-slate-400 hover:text-amber-400 hover:bg-slate-900'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-400 hover:text-nature-400 hover:bg-slate-900 rounded-xl transition-all duration-300"
            >
              <ShoppingCart className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-nature-500 text-slate-950 font-bold text-xs h-5 w-5 rounded-full flex items-center justify-center border border-slate-950 animate-fade-in-up">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="flex items-center space-x-3 bg-slate-900/60 border border-slate-800 py-1.5 pl-3 pr-2 rounded-xl">

                <div className="flex flex-col text-right">
                  <span className="text-xs text-slate-400">
                    Welcome,
                  </span>

                  <span className="text-xs font-bold text-slate-200 leading-tight">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">

                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-slate-300 hover:text-slate-100 font-medium transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-nature-500 font-bold rounded-xl shadow-glass hover:brightness-110 active:scale-95 transition-all duration-200"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">

            <Link
              to="/cart"
              className="relative p-2 text-slate-400 hover:text-nature-400 rounded-xl"
            >
              <ShoppingCart className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-nature-500 text-slate-950 font-bold text-xs h-4.5 w-4.5 rounded-full flex items-center justify-center border border-slate-950">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-xl"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
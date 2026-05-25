import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Eye, Check, AlertCircle } from 'lucide-react';

export const PlantCard = ({ plant }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const handleAddToCart = async (e) => {
    e.preventDefault(); // prevent navigation if wrapped in a Link
    if (!user) {
      setError('Please login to purchase');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setAdding(true);
    try {
      await addToCart(plant.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Inventory limit exceeded');
      setTimeout(() => setError(''), 3000);
    } finally {
      setAdding(false);
    }
  };

  // Safe fallback placeholder for plant graphics
  const defaultImage = "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="glass-card group flex flex-col h-full overflow-hidden relative border border-slate-900 bg-slate-900/20 rounded-2xl transition-all duration-300">
      {/* Plant Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-slate-950">
        <img
          src={plant.imageUrl || defaultImage}
          alt={plant.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />

        {/* Category Badge overlay */}
        <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-slate-300 text-xs px-2.5 py-1 rounded-full font-medium border border-slate-800">
          {plant.category?.name || 'Plant'}
        </span>

        {/* Out of Stock overlay */}
        {plant.stock === 0 && (
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5">
              <AlertCircle className="h-4 w-4" />
              <span>Sold Out</span>
            </span>
          </div>
        )}
      </div>

      {/* Plant Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/plants/${plant.id}`} className="hover:text-nature-400 transition-colors">
            <h3 className="font-outfit font-bold text-lg text-slate-200 line-clamp-1 group-hover:text-slate-100">
              {plant.name}
            </h3>
          </Link>
          <span className="font-outfit font-extrabold text-lg text-nature-400 leading-none">
            ${plant.price.toFixed(2)}
          </span>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-grow">
          {plant.description || 'No description provided. Click details to learn care guidelines.'}
        </p>

        {/* Action Tray */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-900/60">
          {/* Stock state indicator */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            {plant.stock > 0 ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{plant.stock} available</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                <span>Unavailable</span>
              </>
            )}
          </div>

          <div className="flex space-x-2">
            <Link
              to={`/plants/${plant.id}`}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-slate-800 rounded-xl transition-all duration-200"
              title="View Details"
            >
              <Eye className="h-4.5 w-4.5" />
            </Link>
            
            <button
              onClick={handleAddToCart}
              disabled={plant.stock === 0 || adding || added}
              className={`p-2 rounded-xl border flex items-center justify-center transition-all duration-200 ${
                added
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : plant.stock === 0
                  ? 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed'
                  : 'bg-nature-500 text-slate-950 border-nature-500 hover:brightness-110 active:scale-90 font-bold'
              }`}
              title="Add to Cart"
            >
              {added ? (
                <Check className="h-4.5 w-4.5" />
              ) : (
                <ShoppingBag className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
        </div>

        {/* Contextual Errors (such as auth issues or stock exhaustion) */}
        {error && (
          <div className="absolute bottom-16 left-4 right-4 bg-rose-500/90 text-slate-950 text-xs font-bold px-3 py-2 rounded-lg text-center animate-fade-in-up border border-rose-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantCard;

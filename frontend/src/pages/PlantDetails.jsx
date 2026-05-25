import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import plantService from '../services/plantService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ShoppingBag, Check, Heart, Shield, Sparkles, Sun, Droplets, Thermometer } from 'lucide-react';

export const PlantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchPlant = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await plantService.getPlantById(id);
        setPlant(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch details for this plant.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlant();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      setError('Please login to complete purchase.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setAdding(true);
    try {
      await addToCart(plant.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Inventory limit exceeded');
      setTimeout(() => setError(''), 3000);
    } finally {
      setAdding(false);
    }
  };

  const incrementQty = () => {
    if (quantity < plant.stock) setQuantity(quantity + 1);
  };

  const decrementQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin"></div>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-rose-500 text-3xl font-bold font-outfit">Botanical Error</div>
        <p className="text-slate-400 text-sm">{error || 'This plant listing does not exist.'}</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300">
          Back to Shop Catalog
        </Link>
      </div>
    );
  }

  const defaultImage = "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in-up">
      {/* Navigation header */}
      <div>
        <Link to="/shop" className="inline-flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-semibold">Back to catalog shop</span>
        </Link>
      </div>

      {/* Main split details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left column: Image Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel overflow-hidden border border-slate-900 bg-slate-950 p-2.5 rounded-3xl">
            <img
              src={plant.imageUrl || defaultImage}
              alt={plant.name}
              className="w-full aspect-square object-cover rounded-2xl border border-slate-900 shadow-premium"
              onError={(e) => e.target.src = defaultImage}
            />
          </div>
        </div>

        {/* Right column: Info & actions details */}
        <div className="lg:col-span-7 space-y-8 flex flex-col justify-center">
          <div className="space-y-4">
            {/* Category tag */}
            <div className="flex items-center space-x-2">
              <span className="bg-nature-500/10 border border-nature-500/20 text-nature-400 font-semibold text-xs px-3 py-1 rounded-full">
                {plant.category?.name}
              </span>
              <span className="text-xs text-slate-500">• Botanical classification</span>
            </div>

            <div className="flex justify-between items-baseline flex-wrap gap-4">
              <h1 className="font-outfit font-extrabold text-4xl md:text-5xl text-slate-100">
                {plant.name}
              </h1>
              <span className="font-outfit font-extrabold text-3xl text-nature-400">
                ${plant.price.toFixed(2)}
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
              {plant.description || 'This premium botanical sapling is hand-nurtured in our climate-controlled greenhouse to guarantee maximum freshness, pest immunity, and visual glow at shipping dispatch.'}
            </p>
          </div>

          {/* Pricing counter and quick add tray */}
          <div className="glass-panel p-6 bg-slate-900/10 border border-slate-900/60 flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block pl-1">Order Quantity</span>
              <div className="flex items-center bg-slate-950 border border-slate-850 rounded-xl px-2 py-1">
                <button
                  onClick={decrementQty}
                  disabled={plant.stock === 0}
                  className="px-3 py-1.5 text-slate-400 hover:text-slate-200 disabled:opacity-30 text-lg font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-slate-200">{plant.stock === 0 ? 0 : quantity}</span>
                <button
                  onClick={incrementQty}
                  disabled={plant.stock === 0 || quantity >= plant.stock}
                  className="px-3 py-1.5 text-slate-400 hover:text-slate-200 disabled:opacity-30 text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex-grow sm:flex-grow-0 pt-4 sm:pt-0">
              <button
                onClick={handleAddToCart}
                disabled={plant.stock === 0 || adding || added}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl flex items-center justify-center space-x-2 font-bold font-outfit text-sm shadow-glass transition-all duration-200 ${
                  added
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : plant.stock === 0
                    ? 'bg-slate-950 text-slate-650 border border-slate-900 cursor-not-allowed'
                    : 'bg-nature-500 text-slate-950 border border-nature-500 hover:brightness-110 active:scale-[0.98]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Added to Space</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    <span>Add to Cart — ${(plant.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Error indicators */}
            {error && (
              <div className="w-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs py-2.5 px-4 rounded-lg text-center font-bold">
                {error}
              </div>
            )}
          </div>

          {/* Plant stock availability */}
          <div className="flex items-center space-x-1.5 pl-1">
            {plant.stock > 0 ? (
              <span className="text-xs text-slate-400 flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Sapling is in Stock ({plant.stock} units remain)</span>
              </span>
            ) : (
              <span className="text-xs text-rose-400 flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                <span>Sold out! We are currently breeding fresh saplings.</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. DETAILED CARE AND BENEFIT STATS SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-900">
        {/* Care parameters panel */}
        <div className="space-y-6">
          <h3 className="font-outfit font-bold text-2xl text-slate-200">Green Care Guidelines</h3>
          <p className="text-slate-400 text-xs">Recommended environmental settings for {plant.name}:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-4 flex flex-col items-center text-center space-y-2 border-slate-900">
              <Sun className="h-5 w-5 text-amber-400" />
              <span className="text-xs font-bold text-slate-350 font-outfit">Sunlight</span>
              <span className="text-[10px] text-slate-450 leading-relaxed">Bright, Indirect (5-6h daily)</span>
            </div>
            <div className="glass-panel p-4 flex flex-col items-center text-center space-y-2 border-slate-900">
              <Droplets className="h-5 w-5 text-blue-400" />
              <span className="text-xs font-bold text-slate-350 font-outfit">Watering</span>
              <span className="text-[10px] text-slate-450 leading-relaxed">Moderately once dry</span>
            </div>
            <div className="glass-panel p-4 flex flex-col items-center text-center space-y-2 border-slate-900">
              <Thermometer className="h-5 w-5 text-teal-400" />
              <span className="text-xs font-bold text-slate-350 font-outfit">Temp</span>
              <span className="text-[10px] text-slate-450 leading-relaxed">Average room (18-28°C)</span>
            </div>
          </div>
        </div>

        {/* Botanical Benefits Panel */}
        <div className="space-y-6">
          <h3 className="font-outfit font-bold text-2xl text-slate-200 flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-nature-500" />
            <span>Environmental & Healing Benefits</span>
          </h3>
          
          <div className="glass-panel p-6 bg-emerald-500/5 border-emerald-500/10 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-emerald-500/5 blur-[35px]"></div>
            
            {plant.benefits ? (
              <ul className="space-y-3.5 relative z-10">
                {plant.benefits.split('\n').filter(b => b.trim() !== '').map((benefit, index) => (
                  <li key={index} className="flex items-start text-xs text-slate-300 leading-relaxed">
                    <Shield className="h-4 w-4 text-nature-500 mr-2.5 mt-0.5 flex-shrink-0" />
                    <span>{benefit.replace(/^-\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-3.5 relative z-10">
                <li className="flex items-start text-xs text-slate-300 leading-relaxed">
                  <Shield className="h-4 w-4 text-nature-500 mr-2.5 mt-0.5 flex-shrink-0" />
                  <span>Cleans carbon dioxide and filters volatile indoor toxins.</span>
                </li>
                <li className="flex items-start text-xs text-slate-300 leading-relaxed">
                  <Shield className="h-4 w-4 text-nature-500 mr-2.5 mt-0.5 flex-shrink-0" />
                  <span>Increases air humidity to support healthy respiration.</span>
                </li>
                <li className="flex items-start text-xs text-slate-300 leading-relaxed">
                  <Shield className="h-4 w-4 text-nature-500 mr-2.5 mt-0.5 flex-shrink-0" />
                  <span>Lowers physiological stress levels and boosts concentration.</span>
                </li>
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlantDetails;

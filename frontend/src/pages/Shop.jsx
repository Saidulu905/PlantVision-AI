import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import plantService from '../services/plantService';
import PlantCard from '../components/PlantCard';
import { Search, SlidersHorizontal, AlertCircle, Sparkles } from 'lucide-react';

export const Shop = () => {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const location = useLocation();

  // Load plants and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [plantsData, categoriesData] = await Promise.all([
          plantService.getAllPlants(),
          plantService.getCategories(),
        ]);
        setPlants(plantsData);
        setCategories(categoriesData);

        // Parse search query parameter from deep-linking URLs (?category=X)
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        if (categoryParam) {
          setSelectedCategory(Number(categoryParam));
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch botanical collections. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.search]);

  // Client-side filtering logic based on Search and Categories
  const filteredPlants = plants.filter((plant) => {
    const matchesCategory =
      selectedCategory === 'ALL' || plant.category?.id === selectedCategory;
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plant.description &&
        plant.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in-up">
      {/* Search Header Banner */}
      <div className="glass-panel p-8 md:p-12 relative overflow-hidden bg-slate-900/10 border border-slate-900">
        <div className="absolute top-1/2 left-3/4 w-48 h-48 rounded-full bg-emerald-500/5 blur-[80px]"></div>
        
        <div className="max-w-xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-1.5 bg-nature-500/10 border border-nature-500/20 px-3 py-1 rounded-full text-xs font-semibold text-nature-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Green Life, Beautiful Spaces</span>
          </div>
          <h1 className="font-outfit font-extrabold text-3xl md:text-4xl text-slate-100">
            Find Your Next Sapling
          </h1>
          <p className="text-slate-400 text-xs md:text-sm">
            Browse our curated botanical collection. Add high-quality saplings to your cart and kickstart healthy indoor environments.
          </p>

          {/* Search bar wrapper */}
          <div className="flex items-center bg-slate-950/80 border border-slate-850 focus-within:border-nature-500/40 rounded-2xl px-4 py-3.5 transition-all duration-300 w-full mt-4">
            <Search className="h-5 w-5 text-slate-500 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-slate-100 placeholder-slate-650 text-sm outline-none w-full"
              placeholder="Search plants by name, descriptions or medical care tips..."
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Content */}
      <div className="space-y-6">
        {/* Categories filters bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <SlidersHorizontal className="h-4.5 w-4.5 text-nature-500" />
            <span className="font-outfit text-sm font-semibold tracking-wide">Category Filters</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                selectedCategory === 'ALL'
                  ? 'bg-nature-500 text-slate-950 shadow-glass border border-nature-500'
                  : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              All Plants
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-nature-500 text-slate-950 shadow-glass border border-nature-500'
                    : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Errors display */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Botanical Grid Showcase */}
        {loading ? (
          // Skeletons pulse loading state
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="glass-card animate-pulse border border-slate-900 min-h-[360px] rounded-2xl flex flex-col justify-between p-5">
                <div className="w-full aspect-square bg-slate-900 rounded-xl mb-4"></div>
                <div className="h-5 bg-slate-900 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-slate-900 rounded w-full mb-4"></div>
                <div className="h-10 bg-slate-900 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredPlants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPlants.map((plant) => (
              <div key={plant.id} className="animate-fade-in-up">
                <PlantCard plant={plant} />
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="glass-panel p-16 text-center border border-slate-900 bg-slate-900/10 flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-850">
              <SlidersHorizontal className="h-5 w-5 text-slate-500" />
            </div>
            <h3 className="font-outfit font-bold text-lg text-slate-200">No Botanical Discoveries</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              We couldn't find any plants matching "{searchQuery}" in this category. Try adjusting your filters!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;

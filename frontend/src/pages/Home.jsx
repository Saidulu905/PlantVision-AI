import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Cpu, ShieldCheck, Truck, Sparkles, ArrowRight } from 'lucide-react';

export const Home = () => {
  const categories = [
    { id: 1, name: 'Flower Plants', count: 'Fascinating Blooms', desc: 'Roses, Tulips & floral marvels', url: '/shop?category=1', color: 'from-pink-500/10 to-rose-500/10 hover:border-pink-500/30' },
    { id: 2, name: 'Fruit Plants', count: 'Edible Harvests', desc: 'Tomatoes, berries & dwarf fruits', url: '/shop?category=2', color: 'from-amber-500/10 to-orange-500/10 hover:border-amber-500/30' },
    { id: 3, name: 'Decoration Plants', count: 'Aesthetic Greens', desc: 'Monstera, Snake plants & ferns', url: '/shop?category=3', color: 'from-emerald-500/10 to-nature-500/10 hover:border-emerald-500/30' },
    { id: 4, name: 'Medicinal Plants', count: 'Natural Remedies', desc: 'Aloe Vera, Mint & therapeutic herbs', url: '/shop?category=4', color: 'from-teal-500/10 to-cyan-500/10 hover:border-teal-500/30' }
  ];

  return (
    <div className="space-y-24 pb-20 animate-fade-in-up">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-emerald-500/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-nature-700/5 blur-[150px]"></div>

        <div className="max-w-5xl text-center z-10 space-y-8">
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-full py-1.5 px-4 animate-bounce">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Next-Generation AI Plant Identification Engine</span>
          </div>

          <h1 className="font-outfit font-extrabold text-5xl md:text-7xl text-slate-100 leading-tight">
            Nurture Your Space With <br />
            <span className="text-gradient-emerald">PlantVision AI</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-base md:text-lg">
            Discover a curated collection of gorgeous flowers, delicious fruits, and healing medicinal flora. Identify plants instantly using our advanced AI scanner and track deliveries straight to your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/ai-detect"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-nature-600 text-slate-950 font-bold font-outfit rounded-2xl flex items-center justify-center space-x-2 shadow-premium hover:brightness-110 active:scale-98 transition-all duration-200"
            >
              <Cpu className="h-5 w-5" />
              <span>Identify Plant Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 text-slate-200 font-semibold font-outfit rounded-2xl flex items-center justify-center space-x-2 hover:bg-slate-850 transition-all duration-300"
            >
              <span>Explore Catalog</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-outfit font-bold text-3xl md:text-4xl text-slate-200">
            Engineered For Modern Green Spaces
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
            We marry natural agricultural practices with modern machine learning utilities to make home gardening completely seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: AI Identifier */}
          <div className="glass-panel p-8 space-y-5 transition-all duration-350 hover:-translate-y-1 hover:border-emerald-500/25">
            <div className="bg-nature-500/10 border border-nature-500/20 p-3 rounded-2xl w-fit">
              <Cpu className="h-6 w-6 text-nature-500" />
            </div>
            <h3 className="font-outfit font-bold text-xl text-slate-200">Instant AI Diagnosis</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload a picture of any foliage. Our neural engine recognizes the taxonomy, identifies health issues, and serves bespoke biological care guides.
            </p>
          </div>

          {/* Card 2: Secure Logistics */}
          <div className="glass-panel p-8 space-y-5 transition-all duration-350 hover:-translate-y-1 hover:border-emerald-500/25">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl w-fit">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="font-outfit font-bold text-xl text-slate-200">Guaranteed Fresh Delivery</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every sample is carefully wrapped in climate-isolated boxes. If a sapling experiences distress in transit, we replace it instantly.
            </p>
          </div>

          {/* Card 3: Live Tracking */}
          <div className="glass-panel p-8 space-y-5 transition-all duration-350 hover:-translate-y-1 hover:border-emerald-500/25">
            <div className="bg-teal-500/10 border border-teal-500/20 p-3 rounded-2xl w-fit">
              <Truck className="h-6 w-6 text-teal-400" />
            </div>
            <h3 className="font-outfit font-bold text-xl text-slate-200">Automated Dispatch Tracking</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Follow every packaging milestone. From packing in our greenhouse to loading on shipping trucks, track Estimated Arrival Times in real time.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY SHOWCASE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-outfit font-bold text-3xl md:text-4xl text-slate-200">
            Browse Our Botanical Families
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Choose from four meticulously configured sapling sets tailored to your domestic, aesthetic, or therapeutic needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.url}
              className={`glass-card p-6 border border-slate-900 bg-gradient-to-br ${cat.color} flex flex-col justify-between h-48`}
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest leading-none block">
                  {cat.count}
                </span>
                <h3 className="font-outfit font-bold text-xl text-slate-200 group-hover:text-nature-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 leading-normal">
                  {cat.desc}
                </p>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-nature-400 font-bold group-hover:translate-x-1.5 transition-transform duration-200 mt-4">
                <span>Browse Category</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

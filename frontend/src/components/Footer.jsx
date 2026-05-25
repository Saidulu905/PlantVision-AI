import React from 'react';
import { Leaf } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo Brand */}
          <div className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-nature-500" />
            <span className="font-outfit font-bold text-lg text-slate-100">
              AL PLANTS <span className="text-nature-500 font-extrabold">AI</span>
            </span>
          </div>

          {/* Core Footer Linkages */}
          <div className="flex flex-wrap justify-center space-x-6 text-sm text-slate-400">
            <a href="/shop" className="hover:text-nature-400 transition-colors">Catalog</a>
            <a href="/ai-detect" className="hover:text-nature-400 transition-colors">Identify AI</a>
            <a href="/orders" className="hover:text-nature-400 transition-colors">Track Orders</a>
            <a href="#" className="hover:text-nature-400 transition-colors">Privacy Policy</a>
          </div>
        </div>

        {/* Footnote Copyrights */}
        <div className="mt-8 pt-8 border-t border-slate-900/60 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 space-y-4 md:space-y-0">
          <span>&copy; {new Date().getFullYear()} AL Plants Collection AI. All rights reserved.</span>
          <span>Crafted with extreme dedication for beautiful green living.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

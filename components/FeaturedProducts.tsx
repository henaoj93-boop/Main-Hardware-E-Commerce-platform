import React from 'react';
import { Star, ArrowRight, TrendingUp } from 'lucide-react';

const FeaturedProducts: React.FC = () => {
  const products = [
    {
      title: "DeWalt 20V Drill Kit",
      category: "Power Tools",
      price: "$99.00",
      image: "https://picsum.photos/200/200?random=10",
      accent: "bg-yellow-500"
    },
    {
      title: "12ft Inflatable Santa",
      category: "Christmasland",
      price: "$129.99",
      image: "https://picsum.photos/200/200?random=11",
      accent: "bg-red-500"
    },
    {
      title: "50lb Chlorine Tabs",
      category: "Pool Care",
      price: "$149.50",
      image: "https://picsum.photos/200/200?random=12",
      accent: "bg-blue-500"
    }
  ];

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-4 px-2">
        <TrendingUp size={18} className="text-orange-500" />
        <h3 className="font-bold text-slate-700 text-lg">Featured & Trending</h3>
      </div>
      
      <div className="space-y-4">
        {products.map((product, idx) => (
          <div key={idx} className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:bg-white/60 transition-colors cursor-pointer group">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-0.5">{product.category}</p>
              <h4 className="font-bold text-slate-800 text-sm truncate">{product.title}</h4>
              <p className="text-sm font-semibold text-slate-500">{product.price}</p>
            </div>
            
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
              <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 text-white flex items-center justify-between shadow-lg shadow-orange-500/20">
         <div>
           <p className="font-bold text-sm">Pre-Order Now</p>
           <p className="text-xs text-orange-100">Skip the line, pick up in store.</p>
         </div>
         <button className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold hover:bg-white/30 transition-colors">
           Start Order
         </button>
      </div>
    </div>
  );
};

export default FeaturedProducts;
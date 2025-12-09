import React from 'react';
import { DepartmentType } from '../types';
import { departments } from '../data';
import { Wrench, Anchor, Gift, Factory, Search, ChevronRight } from 'lucide-react';

interface Props {
  onNavigate: (dept: DepartmentType) => void;
}

const Departments: React.FC<Props> = ({ onNavigate }) => {
  
  const renderIcon = (name: string) => {
    const size = 20;
    switch(name) {
      case 'wrench': return <Wrench size={size} />;
      case 'anchor': return <Anchor size={size} />;
      case 'gift': return <Gift size={size} />;
      case 'factory': return <Factory size={size} />;
      default: return <Wrench size={size} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar - Mimics "Find a doctor" */}
      <div className="mb-8">
        <h3 className="font-bold text-slate-800 text-lg mb-4">Find Products</h3>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search for items..." 
            className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-medium shadow-sm border border-transparent focus:border-orange-300 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
        </div>
      </div>

      {/* Categories Grid - Mimics the icon grid */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
           <h3 className="font-bold text-slate-800 text-lg">Departments</h3>
           <button className="p-2 rounded-full hover:bg-slate-200 transition-colors">
             <ChevronRight size={16} />
           </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => onNavigate(dept.id)}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-[24px] shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-slate-100 group"
            >
              <div className={`p-3 rounded-2xl mb-3 transition-colors duration-300 ${dept.colorClass.replace('bg-', 'bg-opacity-10 text-').replace('text-white', '')} bg-opacity-10 text-slate-600 group-hover:text-white group-hover:${dept.colorClass}`}>
                {renderIcon(dept.iconName)}
              </div>
              <span className="font-bold text-slate-700 text-sm">{dept.title.split(' ')[0]}</span>
              <span className="text-[10px] text-slate-400 mt-1 font-medium uppercase tracking-wide">
                {dept.id === 'CHRISTMAS' ? 'Seasonal' : 'Shop'}
              </span>
            </button>
          ))}
          
          {/* Add a generic "All" button to fill grid */}
           <button
              onClick={() => {}}
              className="flex flex-col items-center justify-center p-6 bg-slate-100 rounded-[24px] shadow-inner hover:bg-slate-200 transition-all duration-300"
            >
              <span className="font-bold text-slate-500 text-sm">View All</span>
            </button>
        </div>
      </div>

      {/* Appointment/Queue Widget -> Recent Activity */}
      <div className="mt-8 bg-slate-800 rounded-[28px] p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-orange-500 rounded-full blur-2xl opacity-30"></div>
        <h4 className="font-bold text-sm mb-1 opacity-80">Store Updates</h4>
        <h3 className="font-bold text-lg mb-4">New Winter Gear Arrived</h3>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-center justify-between">
           <div>
             <p className="text-xs text-slate-300 font-bold uppercase">Stock Status</p>
             <p className="text-sm font-bold text-white">High Supply</p>
           </div>
           <div className="text-right">
             <p className="text-xs text-slate-300 font-bold uppercase">ETA</p>
             <p className="text-sm font-bold text-white">In Store</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Departments;
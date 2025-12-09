import React from 'react';
import { Key, FlaskConical, Wrench, Calendar, Scissors, Truck } from 'lucide-react';

const QuickAccess: React.FC = () => {
  const actions = [
    { label: 'Key Copy', icon: Key, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Pool Test', icon: FlaskConical, color: 'bg-blue-100 text-blue-600' },
    { label: 'Screen Repair', icon: Wrench, color: 'bg-slate-200 text-slate-700' },
    { label: 'Sharpening', icon: Scissors, color: 'bg-orange-100 text-orange-600' },
    { label: 'Delivery', icon: Truck, color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="py-6">
      <div className="flex justify-between items-center px-2 mb-4">
         <h3 className="font-bold text-slate-700">Quick Services</h3>
         <button className="text-xs font-bold text-orange-500 hover:text-orange-600">View All</button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
        {actions.map((action, idx) => (
          <button 
            key={idx}
            className="flex flex-col items-center gap-3 min-w-[80px] group"
          >
            <div className={`w-16 h-16 rounded-[24px] ${action.color} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
              <action.icon size={28} strokeWidth={1.5} />
            </div>
            <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
              {action.label}
            </span>
          </button>
        ))}
        <button className="flex flex-col items-center gap-3 min-w-[80px] group">
            <div className="w-16 h-16 rounded-[24px] bg-white border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-orange-400 group-hover:text-orange-500 transition-all">
              <span className="text-2xl pb-1">...</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">More</span>
        </button>
      </div>
    </div>
  );
};

export default QuickAccess;
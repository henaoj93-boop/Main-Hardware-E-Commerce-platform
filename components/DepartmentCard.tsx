import React from 'react';
import { DepartmentContent } from '../types';
import { Wrench, Anchor, Gift, Factory, CreditCard } from 'lucide-react';

interface Props {
  department: DepartmentContent;
  isReversed?: boolean;
}

const DepartmentCard: React.FC<Props> = ({ department, isReversed = false }) => {
  
  const renderIcon = (name: string) => {
    const size = 32;
    const className = "text-white";
    switch(name) {
      case 'wrench': return <Wrench size={size} className={className} />;
      case 'anchor': return <Anchor size={size} className={className} />; // Using Anchor as proxy for Pool/Heavy
      case 'gift': return <Gift size={size} className={className} />;
      case 'factory': return <Factory size={size} className={className} />;
      default: return <Wrench size={size} className={className} />;
    }
  };

  return (
    <div id={department.id.toLowerCase()} className="py-16 md:py-24 scroll-mt-20 overflow-hidden">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row ${isReversed ? 'md:flex-row-reverse' : ''} gap-12 items-center`}>
        
        {/* Text Content */}
        <div className="flex-1">
          <div className={`inline-flex items-center justify-center p-3 rounded-xl shadow-lg mb-6 ${department.colorClass}`}>
            {renderIcon(department.iconName)}
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl serif mb-2">
            {department.title}
          </h2>
          <p className="text-lg text-slate-600 font-medium mb-6">
            {department.subtitle}
          </p>
          
          <ul className="space-y-4">
            {department.description.map((item, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 border border-slate-200 mt-0.5">
                  <span className={`h-2 w-2 rounded-full ${department.colorClass.split(' ')[0].replace('bg-', 'bg-')}`}></span>
                </div>
                <span className="ml-4 text-base text-slate-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          {department.highlight && (
            <div className="mt-8 p-5 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg shadow-sm flex items-start relative overflow-hidden group">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-yellow-200 rounded-full opacity-50 mix-blend-multiply"></div>
              
              <div className="flex-shrink-0 text-yellow-600 relative z-10">
                <CreditCard size={32} />
              </div>
              <div className="ml-4 relative z-10">
                <h4 className="text-base font-bold text-yellow-800 uppercase tracking-wide mb-1">Payment Options</h4>
                <p className="text-sm font-medium text-yellow-900/80 leading-tight">{department.highlight}</p>
              </div>
            </div>
          )}
        </div>

        {/* Image Content */}
        <div className="flex-1 w-full">
          <div className="relative rounded-2xl shadow-2xl overflow-hidden group">
            <div className={`absolute inset-0 opacity-10 group-hover:opacity-0 transition-opacity duration-500 ${department.colorClass}`}></div>
            <img 
              src={department.image} 
              alt={department.title} 
              className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            {/* Decorative Border */}
            <div className="absolute inset-0 border-4 border-white/20 rounded-2xl pointer-events-none"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DepartmentCard;
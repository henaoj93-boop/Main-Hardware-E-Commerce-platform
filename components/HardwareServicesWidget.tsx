import React, { useState } from 'react';
import ScreenRepairCalculator from './ScreenRepairCalculator';
import { Scissors, Grid, Settings, Layers, Ruler } from 'lucide-react';

type ServiceTab = 'screen' | 'knife' | 'pipe' | 'glass';

const HardwareServicesWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ServiceTab>('screen');

  const tabs: { id: ServiceTab; label: string; icon: React.FC<any> }[] = [
    { id: 'screen', label: 'Screen Repair', icon: Grid },
    { id: 'knife', label: 'Knife Sharpening', icon: Scissors },
    { id: 'pipe', label: 'Pipe Threading', icon: Settings },
    { id: 'glass', label: 'Glass & Plexi', icon: Layers },
  ];

  return (
    <div className="mb-12 scroll-mt-24" id="services-widget">
      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
        <Ruler className="mr-3 text-slate-400" />
        Services Counter
      </h3>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 border ${
                isActive
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Icon size={18} className={`mr-2 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="animate-fade-in">
        {activeTab === 'screen' && <ScreenRepairCalculator />}

        {activeTab === 'knife' && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
             <div className="bg-slate-800 text-white p-4 flex items-center gap-2">
                <Scissors size={20} className="text-orange-400" />
                <h3 className="font-bold text-lg">Professional Sharpening</h3>
             </div>
             <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                   <div className="flex-1">
                      <p className="text-slate-600 mb-6 text-lg">
                        Dull blades are dangerous. Bring in your kitchen knives, scissors, and garden tools. 
                        We use professional-grade grinding and honing wheels to restore a razor-sharp edge.
                      </p>
                      <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                         <h4 className="font-bold text-orange-900 mb-4 uppercase text-sm tracking-wide">Standard Pricing</h4>
                         <ul className="space-y-3">
                            <li className="flex justify-between items-center border-b border-orange-200/50 pb-2">
                               <span className="font-medium text-slate-700">Straight Edge Knife</span>
                               <span className="font-bold text-slate-900">$4.00</span>
                            </li>
                            <li className="flex justify-between items-center border-b border-orange-200/50 pb-2">
                               <span className="font-medium text-slate-700">Serrated Knife</span>
                               <span className="font-bold text-slate-900">$5.00</span>
                            </li>
                            <li className="flex justify-between items-center border-b border-orange-200/50 pb-2">
                               <span className="font-medium text-slate-700">Scissors / Shears</span>
                               <span className="font-bold text-slate-900">$6.00</span>
                            </li>
                            <li className="flex justify-between items-center pt-1">
                               <span className="font-medium text-slate-700">Garden Tools (Axes, Mower Blades)</span>
                               <span className="font-bold text-slate-900">$8.00+</span>
                            </li>
                         </ul>
                      </div>
                   </div>
                   <div className="w-full md:w-1/3 flex justify-center">
                      <div className="bg-slate-100 rounded-full p-8">
                         <Scissors size={80} className="text-slate-300" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'pipe' && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
             <div className="bg-slate-800 text-white p-4 flex items-center gap-2">
                <Settings size={20} className="text-gray-400" />
                <h3 className="font-bold text-lg">Pipe Cutting & Threading</h3>
             </div>
             <div className="p-8">
                <p className="text-slate-600 mb-6 text-lg">
                   We custom cut and thread Black Iron and Galvanized pipe to your exact specifications. 
                   Perfect for gas lines, steam heat, or custom industrial shelving projects.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">Available Sizes</h4>
                      <div className="flex gap-2 flex-wrap">
                         <span className="px-3 py-1 bg-white border border-slate-300 rounded-md text-sm font-medium">1/2"</span>
                         <span className="px-3 py-1 bg-white border border-slate-300 rounded-md text-sm font-medium">3/4"</span>
                         <span className="px-3 py-1 bg-white border border-slate-300 rounded-md text-sm font-medium">1"</span>
                         <span className="px-3 py-1 bg-white border border-slate-300 rounded-md text-sm font-medium">1-1/4"</span>
                         <span className="px-3 py-1 bg-white border border-slate-300 rounded-md text-sm font-medium">1-1/2"</span>
                         <span className="px-3 py-1 bg-white border border-slate-300 rounded-md text-sm font-medium">2"</span>
                      </div>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">Service Fees</h4>
                      <ul className="text-sm text-slate-600 space-y-2">
                         <li className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            First 2 cuts/threads free with pipe purchase.
                         </li>
                         <li className="flex items-center">
                            <span className="w-2 h-2 bg-slate-400 rounded-full mr-2"></span>
                            $2.00 per thread for additional cuts.
                         </li>
                      </ul>
                   </div>
                </div>
                <div className="mt-6 text-xs text-slate-500 italic">
                   *We cannot thread existing used pipe due to potential machine damage. New pipe only.
                </div>
             </div>
          </div>
        )}

        {activeTab === 'glass' && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
             <div className="bg-slate-800 text-white p-4 flex items-center gap-2">
                <Layers size={20} className="text-blue-300" />
                <h3 className="font-bold text-lg">Glass & Plexi Cutting</h3>
             </div>
             <div className="p-8">
                <p className="text-slate-600 mb-6 text-lg">
                   Broken window? Picture frame? We cut single strength glass, double strength glass, and acrylic plexiglass to size while you shop.
                </p>
                
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                      <tr>
                         <th className="px-4 py-3 rounded-tl-lg">Material</th>
                         <th className="px-4 py-3">Thickness</th>
                         <th className="px-4 py-3 rounded-tr-lg text-right">Starting Price</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      <tr>
                         <td className="px-4 py-3 font-medium text-slate-900">Single Strength Glass</td>
                         <td className="px-4 py-3 text-slate-500">3/32" (2.5mm)</td>
                         <td className="px-4 py-3 text-right font-bold">$5.00 / sq ft</td>
                      </tr>
                      <tr>
                         <td className="px-4 py-3 font-medium text-slate-900">Double Strength Glass</td>
                         <td className="px-4 py-3 text-slate-500">1/8" (3mm)</td>
                         <td className="px-4 py-3 text-right font-bold">$7.00 / sq ft</td>
                      </tr>
                      <tr>
                         <td className="px-4 py-3 font-medium text-slate-900">Plexiglass (Acrylic)</td>
                         <td className="px-4 py-3 text-slate-500">.080" - .100"</td>
                         <td className="px-4 py-3 text-right font-bold">$12.00 / sq ft</td>
                      </tr>
                   </tbody>
                </table>
                <div className="mt-6 flex items-start p-4 bg-blue-50 rounded-lg border border-blue-100">
                   <div className="mr-3 mt-1 text-blue-500 font-bold text-xl">i</div>
                   <p className="text-sm text-blue-800">
                      <strong>Tip:</strong> Measure your frame opening exactly. We recommend subtracting 1/8" from both width and height to ensure a proper fit without binding.
                   </p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HardwareServicesWidget;
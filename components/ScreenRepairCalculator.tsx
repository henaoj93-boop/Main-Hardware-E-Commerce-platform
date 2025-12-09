import React, { useState } from 'react';
import { Calculator, RefreshCw } from 'lucide-react';

const ScreenRepairCalculator: React.FC = () => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [material, setMaterial] = useState<'standard' | 'pet' | 'aluminum'>('standard');
  const [newFrame, setNewFrame] = useState<boolean>(false);
  const [total, setTotal] = useState<number | null>(null);

  const calculatePrice = () => {
    if (width <= 0 || height <= 0) return;

    // Pricing Logic (Estimates)
    const areaSqFt = (width * height) / 144;
    
    let materialRate = 0;
    switch (material) {
      case 'standard': materialRate = 3.00; break; // $3.00 per sq ft
      case 'pet': materialRate = 5.50; break; // $5.50 per sq ft
      case 'aluminum': materialRate = 6.00; break; // $6.00 per sq ft
    }

    const labor = 15.00; // Base labor charge
    const frameCost = newFrame ? 18.00 : 0; // New frame material + extra labor

    // Calculation: Material Cost + Labor + Frame Cost
    // Ensure minimum pricing logic if needed, here we just sum it up
    const estimatedPrice = (areaSqFt * materialRate) + labor + frameCost;
    
    // Minimum charge check (e.g., $20 minimum for any repair)
    setTotal(Math.max(estimatedPrice, 20.00));
  };

  const reset = () => {
    setWidth(0);
    setHeight(0);
    setTotal(null);
    setNewFrame(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator size={20} className="text-blue-400" />
          <h3 className="font-bold text-lg">Screen Repair Estimator</h3>
        </div>
        <div className="text-xs bg-blue-600 px-2 py-1 rounded text-white font-medium">
          Instant Quote
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Width (inches)</label>
                <input 
                  type="number" 
                  min="0"
                  value={width || ''} 
                  onChange={(e) => setWidth(parseFloat(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. 24"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Height (inches)</label>
                <input 
                  type="number" 
                  min="0"
                  value={height || ''} 
                  onChange={(e) => setHeight(parseFloat(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. 36"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Screen Material</label>
              <select 
                value={material} 
                onChange={(e) => setMaterial(e.target.value as any)}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="standard">Standard Fiberglass (Charcoal)</option>
                <option value="pet">Pet Screen (Heavy Duty)</option>
                <option value="aluminum">Aluminum Wire</option>
              </select>
              <p className="text-xs text-slate-500 mt-1 italic">
                {material === 'standard' && "Common choice for windows. Good visibility."}
                {material === 'pet' && "7x stronger than standard. Resists claws."}
                {material === 'aluminum' && "Traditional look, durable and rigid."}
              </p>
            </div>

            <div className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
              <input 
                type="checkbox" 
                id="frame"
                checked={newFrame}
                onChange={(e) => setNewFrame(e.target.checked)}
                className="h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <div className="ml-3">
                <label htmlFor="frame" className="text-sm text-slate-900 font-bold cursor-pointer">Build New Frame?</label>
                <p className="text-xs text-slate-500">Select if your existing frame is bent or missing.</p>
              </div>
            </div>

            <button 
              onClick={calculatePrice}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 shadow-md transform active:scale-95 transition-all"
            >
              Calculate Estimate
            </button>
          </div>

          {/* Results */}
          <div className="bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 relative">
            {total !== null ? (
              <div className="animate-fade-in">
                <p className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-2">Estimated Total</p>
                <div className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  ${total.toFixed(2)}
                </div>
                
                <div className="text-xs text-left bg-white p-3 rounded border border-slate-200 shadow-sm space-y-1 w-full max-w-[200px] mx-auto mb-4">
                  <div className="flex justify-between"><span>Labor:</span> <span>$15.00</span></div>
                  <div className="flex justify-between"><span>Material:</span> <span>${(total - 15 - (newFrame ? 18 : 0)).toFixed(2)}</span></div>
                  {newFrame && <div className="flex justify-between text-blue-600"><span>New Frame:</span> <span>$18.00</span></div>}
                </div>

                <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">
                  *Estimate only. Final price determined upon physical inspection at the counter. Spline replacement included.
                </p>
                
                <button onClick={reset} className="flex items-center justify-center text-sm font-medium text-slate-600 hover:text-red-500 transition-colors mx-auto">
                  <RefreshCw size={14} className="mr-1" /> Start Over
                </button>
              </div>
            ) : (
              <div className="text-slate-400">
                <Calculator size={64} className="mx-auto mb-4 opacity-10" />
                <p className="font-medium text-lg text-slate-500">Ready to calculate</p>
                <p className="text-sm mt-1">Enter your window dimensions to see pricing instantly.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenRepairCalculator;
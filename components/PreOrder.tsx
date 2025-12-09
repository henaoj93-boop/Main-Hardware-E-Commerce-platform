import React, { useState } from 'react';
import { Truck, Store, CheckCircle, AlertCircle, Clock, FileUp, Send } from 'lucide-react';

const PreOrder: React.FC = () => {
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLayaway, setIsLayaway] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(false);
      setIsLayaway(false);
      // In a real app, clear form here
    }, 5000);
  };

  return (
    <section id="preorder" className="bg-slate-800 py-16 md:py-24 border-t border-slate-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 rounded-full bg-red-500/20 text-red-300 text-xs font-bold tracking-wider uppercase mb-4 border border-red-500/30">
            Fast Track Ordering
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white serif mb-4">
            Pre-Order Drop Zone
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Skip the browsing. Submit your list directly to our floor team. We'll pull it, pack it, and have it ready.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setOrderType('pickup')}
              className={`flex-1 py-4 px-6 text-sm md:text-base font-bold flex items-center justify-center transition-colors ${
                orderType === 'pickup'
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <Store size={18} className="mr-2" />
              In-Store Pickup
            </button>
            <button
              onClick={() => setOrderType('delivery')}
              className={`flex-1 py-4 px-6 text-sm md:text-base font-bold flex items-center justify-center transition-colors ${
                orderType === 'delivery'
                  ? 'bg-white text-orange-600 border-b-2 border-orange-600'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <Truck size={18} className="mr-2" />
              Commercial Delivery
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Order Received!</h3>
                <p className="text-slate-600">
                  Thanks for submitting your order. Our team is reviewing it now and will contact you shortly to confirm details and payment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Dynamic Banner based on type */}
                {orderType === 'delivery' && (
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-md flex items-start">
                    <AlertCircle size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <h4 className="text-sm font-bold text-orange-800">Commercial Accounts Only</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        Minimum order <strong>$200.00</strong> required for delivery. 
                        Orders placed before 2 PM eligible for <strong>Next Day Delivery</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {orderType === 'pickup' && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md flex items-start">
                    <Clock size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <h4 className="text-sm font-bold text-blue-800">Ready in 2 Hours</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        We'll text you when your order is pulled and ready at the counter.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input required type="text" className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input required type="tel" className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="(570) 555-0123" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input required type="email" className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="john@example.com" />
                  </div>

                  {orderType === 'delivery' && (
                     <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Company / Account Name</label>
                     <input required type="text" className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Main Street Construction LLC" />
                   </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Order List</label>
                  <p className="text-xs text-slate-500 mb-2">Type your items here or paste a list.</p>
                  <textarea 
                    required 
                    rows={5} 
                    className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
                    placeholder={`1x DeWalt Drill Kit\n5x Bags of Concrete\n2x Gallons of Chlorine...`} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Upload File (Optional)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-blue-400 transition-colors cursor-pointer bg-slate-50">
                    <div className="space-y-1 text-center">
                      <FileUp className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-600">
                        <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">
                        CSV, PDF, or IMG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Layaway Option */}
                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                  <label className="flex items-start cursor-pointer">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={isLayaway}
                        onChange={(e) => setIsLayaway(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <span className="font-bold text-slate-900">Request Layaway Plan</span>
                      <span className="block text-slate-500 text-xs mt-0.5">
                        Available for pool orders. Secure your items now, pay over time.
                      </span>
                    </div>
                  </label>
                </div>

                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-lg shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center">
                  <Send size={20} className="mr-2" />
                  Submit Order Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreOrder;
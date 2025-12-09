import React from 'react';
import { Home, ShoppingBag, MessageSquare, Truck, Settings, Menu, X, Lock } from 'lucide-react';
import { DepartmentType } from '../types';

interface Props {
  activeView: string;
  onNavigate: (view: any) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<Props> = ({ activeView, onNavigate, isOpen, onToggle }) => {
  const menuItems = [
    { id: 'HOME', label: 'Dashboard', icon: Home },
    { id: 'DEPARTMENTS', label: 'Departments', icon: ShoppingBag },
    { id: 'SERVICES', label: 'Services', icon: Settings },
    { id: 'PREORDER', label: 'Orders', icon: Truck },
  ];

  const logoSrc = "f8183d07"; // Fallback/Winter logo

  return (
    <>
      {/* Mobile Header / Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-50 flex items-center justify-between px-4 border-b border-white/50">
        <div className="flex items-center">
          <img src={logoSrc} alt="Logo" className="h-8 w-auto mr-2" />
          <span className="font-bold text-slate-800 serif">Main Hardware</span>
        </div>
        <button onClick={onToggle} className="p-2 text-slate-600">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)] lg:my-8 lg:ml-8 lg:rounded-[32px]
        glass-panel flex flex-col py-8 px-6
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => onNavigate('HOME')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 text-white">
            <Home size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-slate-800">Main<br/>Hardware</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if(onToggle) onToggle(); // Close mobile menu on click
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-slate-800 text-white shadow-lg shadow-slate-900/20' 
                    : 'text-slate-500 hover:bg-white/60 hover:text-orange-600'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-orange-400' : 'group-hover:text-orange-500 transition-colors'} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto space-y-4 pt-8 border-t border-slate-200/50">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <MessageSquare size={14} />
              </div>
              <span className="font-bold text-sm text-slate-800">Need Help?</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">Hank is ready to answer your questions.</p>
            <button className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors shadow-md shadow-orange-500/20">
              Ask Hank
            </button>
          </div>
          
          <button 
            onClick={() => {
              onNavigate('ADMIN');
              if(onToggle) onToggle();
            }}
            className="flex items-center gap-3 px-4 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors w-full"
          >
            <Lock size={16} />
            <span>Admin Access</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
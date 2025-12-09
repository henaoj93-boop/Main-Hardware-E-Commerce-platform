import React, { useState, useMemo } from 'react';
import { Menu, X, Phone, Facebook, Search } from 'lucide-react';
import { DepartmentType } from '../types';

interface Props {
  onNavigate: (dept: DepartmentType) => void;
  onHome: () => void;
}

const Navbar: React.FC<Props> = ({ onNavigate, onHome }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    // Placeholder for search functionality
  };

  const navLinks = [
    { label: 'Hardware', type: DepartmentType.HARDWARE, color: 'hover:text-red-400' },
    { label: 'Christmasland', type: DepartmentType.CHRISTMAS, color: 'hover:text-green-400' },
    { label: 'Pool Supply', type: DepartmentType.POOL, color: 'hover:text-blue-400' },
    { label: 'Commercial', type: DepartmentType.COMMERCIAL, color: 'hover:text-yellow-400' },
  ];

  // Logic to determine seasonal logo
  // Spring/Summer: March 20 - Sept 22
  // Fall/Winter: Sept 23 - March 19
  const logoSrc = useMemo(() => {
    const now = new Date();
    const month = now.getMonth(); // 0-indexed (0 = Jan)
    const day = now.getDate();
    
    // Check if within Spring/Summer range
    // March (2) 20 or later, up to September (8) 22
    const isSpringSummer = (
      (month === 2 && day >= 20) || // Late March
      (month > 2 && month < 8) ||   // April - August
      (month === 8 && day <= 22)    // Early September
    );

    return isSpringSummer 
      ? "c8b2e7ce"  // Spring/Summer Logo
      : "f8183d07"; // Fall/Winter Logo
  }, []);

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Area */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={onHome}>
            {/* Seasonal Logo Image */}
            <img 
              src={logoSrc} 
              alt="Main Hardware & Pool Discount Supply" 
              className="h-14 md:h-16 w-auto object-contain transition-all duration-500 hover:scale-105"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.type}
                  onClick={() => onNavigate(link.type)}
                  className={`${link.color} transition-colors text-sm font-semibold uppercase tracking-wide focus:outline-none`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 text-slate-200 text-sm rounded-full pl-10 pr-4 py-1.5 border border-slate-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all w-32 focus:w-60 placeholder-slate-500"
                placeholder="Search..."
              />
            </form>
            
            <div className="border-l border-slate-700 pl-6 flex items-center space-x-4">
              <a href="https://www.facebook.com/MainHardwarePoolSupply" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400" title="Follow us on Facebook">
                <Facebook size={20} />
              </a>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-bold text-sm flex items-center transition-colors">
                <Phone size={16} className="mr-2" />
                Call Us
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 text-sm rounded-md pl-10 pr-4 py-2 border border-slate-600 focus:outline-none focus:border-red-500 placeholder-slate-500"
                placeholder="Search products..."
              />
            </form>
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.type}
                onClick={() => {
                  onNavigate(link.type);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 ${link.color.replace('hover:', '')}`}
              >
                {link.label}
              </button>
            ))}
            <a href="https://www.facebook.com/MainHardwarePoolSupply" target="_blank" className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:bg-slate-700">Facebook Page</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
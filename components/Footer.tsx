import React from 'react';
import { Facebook, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { DepartmentType } from '../types';

interface Props {
  onNavigate: (dept: DepartmentType) => void;
}

const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white serif">Main Hardware</h3>
            <p className="text-sm text-slate-400 max-w-xs">
              We’re the hometown powerhouse mixing old-school charm with modern convenience. Serving the community with tools, pools, and Christmas cheer.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://www.facebook.com/MainHardwarePoolSupply" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors flex items-center">
                <Facebook size={24} />
                <span className="ml-2 text-sm font-medium">Main Hardware & Pool Supply</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Departments</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate(DepartmentType.HARDWARE)} className="hover:text-red-400 transition-colors">Hardware & Tools</button></li>
              <li><button onClick={() => onNavigate(DepartmentType.CHRISTMAS)} className="hover:text-green-400 transition-colors">Christmasland</button></li>
              <li><button onClick={() => onNavigate(DepartmentType.POOL)} className="hover:text-blue-400 transition-colors">Pool Discount Supply</button></li>
              <li><button onClick={() => onNavigate(DepartmentType.COMMERCIAL)} className="hover:text-yellow-400 transition-colors">Commercial Supply</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Visit Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 text-red-500" />
                <span>642 South Main St.<br />Wilkes-Barre, PA 18701</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-red-500" />
                <span>570-823-3938</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-red-500" />
                <span>MainHardwaredps@Gmail.com</span>
              </li>
              <li className="flex items-start">
                <Clock size={18} className="mr-2 mt-0.5 text-red-500" />
                <span>
                  Mon-Sat: 8am - 6pm<br />
                  Sun: 9am - 4pm
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Main Hardware & Pool Discount Supply. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

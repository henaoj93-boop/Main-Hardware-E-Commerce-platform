

import React from 'react';
import { DepartmentType, HeroConfig } from '../types';
import { Calendar, MapPin, Sparkles } from 'lucide-react';

interface Props {
  onNavigate: (dept: DepartmentType) => void;
  config: HeroConfig;
}

const Hero: React.FC<Props> = ({ onNavigate, config }) => {
  
  // determine height class
  const getHeight = () => {
    switch(config.height) {
      case 'small': return 'h-[250px]';
      case 'medium': return 'h-[360px]';
      case 'large': return 'h-[480px]';
      default: return 'h-[320px]';
    }
  };

  // determine font size class
  const getTitleSize = () => {
    switch(config.titleSize) {
      case 'normal': return 'text-4xl md:text-5xl';
      case 'large': return 'text-5xl md:text-6xl';
      case 'huge': return 'text-6xl md:text-7xl';
      default: return 'text-4xl md:text-5xl';
    }
  };

  // determine alignment class
  const getAlignment = () => {
    switch(config.alignment) {
      case 'center': return 'items-center text-center mx-auto';
      case 'right': return 'items-end text-right ml-auto';
      case 'left': return 'items-start text-left mr-auto';
      default: return 'items-start text-left';
    }
  };

  // determine font family
  const getFontFamily = () => {
    switch(config.fontFamily) {
      case 'sans': return 'font-sans';
      case 'serif': return 'serif';
      case 'mono': return 'font-mono';
      default: return 'serif'; // Default to existing look
    }
  };

  // determine button style
  const getButtonClasses = () => {
    let classes = "rounded-xl font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 ";
    
    // Size
    switch(config.buttonSize) {
      case 'small': classes += "px-4 py-2 text-sm "; break;
      case 'medium': classes += "px-6 py-3 text-base "; break;
      case 'large': classes += "px-8 py-4 text-lg "; break;
      default: classes += "px-6 py-3 ";
    }

    // Color
    if (config.buttonColor !== 'gradient') {
      switch(config.buttonColor) {
        case 'red': classes += "bg-red-600 hover:bg-red-700"; break;
        case 'blue': classes += "bg-blue-600 hover:bg-blue-700"; break;
        case 'green': classes += "bg-green-600 hover:bg-green-700"; break;
        case 'orange': classes += "bg-orange-600 hover:bg-orange-700"; break;
        case 'slate': classes += "bg-slate-700 hover:bg-slate-800"; break;
      }
    }
    // Note: If gradient, we apply style prop instead of bg class

    return classes;
  };

  // determine default department action (fallback to Christmas for now if custom)
  const handleClick = () => {
    if (config.title.toLowerCase().includes('pool')) {
      onNavigate(DepartmentType.POOL);
    } else {
      onNavigate(DepartmentType.CHRISTMAS);
    }
  };

  // Simple check for video data or file extension
  const isVideo = config.backgroundImage?.startsWith('data:video') || config.backgroundImage?.match(/\.(mp4|webm|mov)$/i);

  const gradientStyle = config.buttonColor === 'gradient' ? {
    background: `linear-gradient(to right, ${config.buttonGradientStart || '#dc2626'}, ${config.buttonGradientEnd || '#15803d'})`
  } : {};

  // Image positioning styles
  const imageStyle: React.CSSProperties = {
    objectPosition: config.backgroundImagePosition || 'center',
    transform: `scale(${config.backgroundImageScale ? config.backgroundImageScale / 100 : 1})`,
    transformOrigin: 'center',
  };

  return (
    <div className={`relative w-full ${getHeight()} rounded-[32px] overflow-hidden shadow-2xl group transition-all duration-500 hover:shadow-orange-500/10`}>
      {/* Background Media */}
      <div className="absolute inset-0 overflow-hidden">
        {isVideo ? (
           <video
            className="w-full h-full object-cover"
            style={imageStyle}
            src={config.backgroundImage}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            className="w-full h-full object-cover transition-transform duration-700"
            style={imageStyle}
            src={config.backgroundImage}
            alt="Banner"
          />
        )}
        {/* Dynamic Glass Overlay */}
        <div 
          className="absolute inset-0 bg-slate-900 transition-all duration-300"
          style={{ opacity: config.overlayOpacity / 100 }}
        />
        {/* Additional Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className={`relative h-full flex flex-col justify-center px-8 md:px-12 max-w-4xl ${getAlignment()}`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 backdrop-blur-md">
            Welcome Back
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-lg shadow-orange-500/40 animate-pulse">
            Open Today until 6pm
          </span>
        </div>

        <h2 className={`${getTitleSize()} font-bold text-white mb-2 ${getFontFamily()} tracking-tight drop-shadow-md`}>
          {config.title}
        </h2>
        <p className="text-slate-200 text-lg mb-8 font-light drop-shadow-sm">
          {config.subtitle}
        </p>

        {/* Action Button */}
        <button 
          onClick={handleClick}
          className={getButtonClasses()}
          style={gradientStyle}
        >
          <Sparkles size={config.buttonSize === 'large' ? 24 : config.buttonSize === 'small' ? 14 : 18} />
          {config.buttonText}
        </button>

        {/* Floating Info Bar - Only show if Left or Right aligned to prevent clutter in Center */}
        {config.alignment !== 'center' && (
          <div className={`glass-card p-3 rounded-2xl flex items-center gap-4 mt-8 transform transition-transform hover:-translate-y-1 ${config.alignment === 'right' ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2 text-slate-800">
               <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600">
                 <Calendar size={16} />
               </div>
               <div>
                 <p className="text-[10px] text-slate-500 font-bold uppercase">Date</p>
                 <p className="text-xs font-bold text-white/90">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
               </div>
            </div>
            
            <div className="w-px h-6 bg-white/30" />

            <div className="flex items-center gap-2 text-slate-800">
               <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                 <MapPin size={16} />
               </div>
               <div>
                 <p className="text-[10px] text-slate-500 font-bold uppercase">Location</p>
                 <p className="text-xs font-bold text-white/90">Wilkes-Barre, PA</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;

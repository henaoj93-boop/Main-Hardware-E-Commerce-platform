
import React from 'react';
import { PageWidget, DepartmentType } from '../types';
import { ShoppingCart, Star, ImageIcon, Layout, Type, Sliders, Film, MoveVertical, ShoppingBag, Maximize2 } from 'lucide-react';
import QuickAccess from './QuickAccess';
import FeaturedProducts from './FeaturedProducts';

interface Props {
  layout: PageWidget[];
  onNavigate?: (view: any) => void;
  customClass?: string;
}

const DynamicPage: React.FC<Props> = ({ layout, onNavigate, customClass = '' }) => {

  const renderWidget = (widget: PageWidget) => {
    // Basic Style Mapper
    const style: React.CSSProperties = {
      backgroundColor: widget.style.backgroundColor,
      color: widget.style.textColor,
      textAlign: widget.style.alignment || 'left',
      backgroundImage: widget.style.backgroundImage ? `url(${widget.style.backgroundImage})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };

    const containerClass = `w-full relative ${
      widget.style.padding === 'none' ? 'p-0' :
      widget.style.padding === 'small' ? 'p-4' :
      widget.style.padding === 'large' ? 'p-16' : 'p-8'
    }`;

    const textClass = `
      ${widget.style.fontFamily === 'serif' ? 'serif' : widget.style.fontFamily === 'mono' ? 'font-mono' : 'font-sans'}
      ${widget.style.fontSize === 'sm' ? 'text-sm' : 
        widget.style.fontSize === 'lg' ? 'text-lg' : 
        widget.style.fontSize === 'xl' ? 'text-xl' : 
        widget.style.fontSize === '2xl' ? 'text-2xl' : 
        widget.style.fontSize === '4xl' ? 'text-4xl' : 'text-base'}
    `;

    switch (widget.type) {
      case 'HERO':
        return (
          <div key={widget.id} className={`${containerClass} min-h-[400px] flex flex-col justify-center text-white`} style={style}>
            {widget.style.backgroundImage && <div className="absolute inset-0 bg-black/40" />}
            <div className="relative z-10 max-w-4xl mx-auto w-full">
              <h1 className={`${textClass} font-bold mb-4`}>{widget.content.title}</h1>
              <p className="text-xl opacity-90">{widget.content.subtitle}</p>
              {widget.content.buttonText && (
                 <button 
                  className="mt-6 px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                  onClick={() => onNavigate && onNavigate(DepartmentType.CHRISTMAS)} // Default action
                 >
                   {widget.content.buttonText}
                 </button>
              )}
            </div>
          </div>
        );
      
      case 'TEXT_BLOCK':
        return (
          <div key={widget.id} className={containerClass} style={style}>
             <div className="max-w-4xl mx-auto">
                {widget.content.title && <h2 className="text-2xl font-bold mb-4">{widget.content.title}</h2>}
                <div className={`${textClass} whitespace-pre-wrap`}>{widget.content.text}</div>
             </div>
          </div>
        );

      case 'IMAGE_FULL':
        // Handle alignment and width for images
        const widthClass = 
          widget.style.width === 'small' ? 'w-full md:w-1/4' : 
          widget.style.width === 'medium' ? 'w-full md:w-1/2' : 
          widget.style.width === 'large' ? 'w-full md:w-3/4' : 'w-full';
        
        const alignmentClass = 
          widget.style.alignment === 'center' ? 'justify-center' : 
          widget.style.alignment === 'right' ? 'justify-end' : 'justify-start';

        return (
          <div key={widget.id} className={`${containerClass} flex ${alignmentClass}`} style={{ backgroundColor: widget.style.backgroundColor, padding: widget.style.padding === 'none' ? 0 : undefined }}>
             <img 
               src={widget.content.image} 
               alt={widget.content.title} 
               className={`${widthClass} h-auto rounded-xl shadow-lg`} 
             />
          </div>
        );
      
      case 'SPLIT_CONTENT':
        return (
          <div key={widget.id} className={`${containerClass} flex flex-col md:flex-row gap-8 items-center`} style={style}>
             <div className="flex-1">
                <img src={widget.content.image} alt="Split" className="w-full h-64 object-cover rounded-xl shadow-md" />
             </div>
             <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">{widget.content.title}</h2>
                <p className={textClass}>{widget.content.text}</p>
             </div>
          </div>
        );

      case 'PRODUCT_SPOTLIGHT':
        return (
          <div key={widget.id} className={containerClass} style={style}>
             <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2 relative bg-slate-100 min-h-[300px]">
                   {widget.content.image ? (
                     <img src={widget.content.image} className="w-full h-full object-cover absolute inset-0" alt={widget.content.title} />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={48} /></div>
                   )}
                   {widget.content.badgeText && (
                      <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg animate-pulse">
                        {widget.content.badgeText}
                      </span>
                   )}
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-center text-left">
                   <div className="flex items-center gap-1 mb-2 text-yellow-400">
                      {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                      <span className="text-slate-400 text-xs ml-2 font-bold">(Top Rated)</span>
                   </div>
                   <h2 className="text-3xl font-bold text-slate-900 mb-2">{widget.content.title}</h2>
                   <div className="flex items-baseline gap-3 mb-4">
                      {widget.content.salePrice ? (
                        <>
                           <span className="text-3xl font-bold text-red-600">{widget.content.salePrice}</span>
                           <span className="text-lg text-slate-400 line-through decoration-slate-400/50">{widget.content.price}</span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-slate-900">{widget.content.price}</span>
                      )}
                   </div>
                   <p className="text-slate-600 mb-8 leading-relaxed">{widget.content.text}</p>
                   <button className="bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      <ShoppingCart size={20} />
                      {widget.content.buttonText || "Add to Cart"}
                   </button>
                   <p className="text-center text-xs text-slate-400 mt-4">In stock at Wilkes-Barre location.</p>
                </div>
             </div>
          </div>
        );

      case 'VIDEO_EMBED':
        return (
          <div key={widget.id} className={containerClass} style={style}>
             <div className="max-w-4xl mx-auto bg-black rounded-xl overflow-hidden aspect-video shadow-2xl">
                {widget.content.videoUrl ? (
                  <video src={widget.content.videoUrl} controls className="w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">No Video URL</div>
                )}
             </div>
          </div>
        );
      
      case 'SPACER':
        return <div key={widget.id} style={{ height: widget.style.height === 'large' ? '100px' : widget.style.height === 'medium' ? '50px' : '20px' }} />;

      case 'QUICK_ACCESS':
        return (
          <div key={widget.id} className={containerClass} style={style}>
            <div className="max-w-6xl mx-auto">
              <QuickAccess />
            </div>
          </div>
        );

      case 'FEATURED_PRODUCTS':
        return (
          <div key={widget.id} className={containerClass} style={style}>
            <div className="max-w-6xl mx-auto">
              <FeaturedProducts />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`animate-fade-in ${customClass}`}>
      {layout.map(widget => renderWidget(widget))}
    </div>
  );
};

export default DynamicPage;

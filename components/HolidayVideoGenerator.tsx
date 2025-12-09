import React, { useState, useRef } from 'react';
import { Video, Sparkles, Loader2, Download, Play } from 'lucide-react';
import { generateHolidayVideo } from '../services/geminiService';

const HolidayVideoGenerator: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for preview interaction
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setHasInteracted(false);
    try {
      const url = await generateHolidayVideo();
      setVideoUrl(url);
    } catch (err: any) {
      setError(err.message || "Failed to generate video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = () => {
    if (hasInteracted) return;
    setIsHovering(true);
    if (videoRef.current) {
      // Play a short preview (muted)
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked by browser policy until interaction
      });
    }
  };

  const handleMouseLeave = () => {
    if (hasInteracted) return;
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset to start
    }
  };

  const handleClick = () => {
    if (hasInteracted) return;
    if (videoRef.current) {
      setHasInteracted(true);
      videoRef.current.muted = false; // Unmute
      videoRef.current.play();
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-8 mb-12 relative overflow-hidden text-white shadow-2xl border border-slate-700">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-red-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-green-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      
      <div className="relative z-10 text-center">
        <h3 className="text-2xl md:text-3xl font-bold serif mb-4 flex items-center justify-center">
          <Sparkles className="mr-3 text-yellow-400" />
          Watch Santa Visit Main Hardware
          <Sparkles className="ml-3 text-yellow-400" />
        </h3>
        <p className="text-slate-300 mb-8 max-w-lg mx-auto">
          Experience the magic! See Santa land on our roof, explore Christmasland, and grab a coffee at Quick Joe in this AI-generated cartoon special.
        </p>

        {!videoUrl && !loading && (
          <button
            onClick={handleGenerate}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 shadow-lg hover:shadow-red-500/50"
          >
            <Video className="mr-2 group-hover:animate-bounce" />
            Generate Santa's Visit Video
          </button>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 size={48} className="text-white animate-spin mb-4" />
            <p className="text-lg font-medium animate-pulse">Creating holiday magic...</p>
            <p className="text-sm text-slate-400 mt-2">Santa is making his way to the roof...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-4 mt-4 text-red-200">
            {error}
          </div>
        )}

        {videoUrl && (
          <div 
            className={`mt-8 rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-black aspect-video max-w-3xl mx-auto relative group ${!hasInteracted ? 'cursor-pointer' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            <video 
              ref={videoRef}
              className="w-full h-full object-contain"
              src={videoUrl}
              playsInline
              muted={!hasInteracted}
              loop={!hasInteracted}
              controls={hasInteracted}
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>

            {!hasInteracted && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors duration-300 group-hover:bg-black/20">
                <div className={`transform transition-all duration-300 ${isHovering ? 'scale-110' : 'scale-100'}`}>
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl">
                     <Play className="text-white fill-white ml-2" size={32} />
                  </div>
                </div>
                
                <div className={`absolute bottom-6 left-0 right-0 text-center transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10 shadow-lg">
                      Click to Unmute & Watch
                    </span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {videoUrl && (
          <div className="flex flex-col items-center gap-4 mt-6">
            <a 
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="MainHardware_SantaStory.mp4"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-slate-900 bg-white rounded-full hover:bg-slate-200 transition-colors shadow-lg"
            >
              <Download size={18} className="mr-2" />
              Download Video
            </a>
            
            <button 
               onClick={handleGenerate} 
               className="text-sm text-slate-400 hover:text-white underline"
            >
              Generate New Story
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidayVideoGenerator;
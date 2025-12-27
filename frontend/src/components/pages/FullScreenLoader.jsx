import React from 'react';

const FullScreenLoader = () => {
  const winkGreen = "#0C831F";
  const itBlue = "#3F51B5";

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      
      {/* 1. Slim Top Progress Bar (Fixed to top) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-50">
        <div 
          className="h-full bg-gradient-to-r from-[#0C831F] to-[#3F51B5] animate-[loading_2s_ease-in-out_infinite]"
          style={{ width: '40%' }}
        ></div>
      </div>

      {/* 2. Main Logo Animation */}
      <div className="relative group">
        {/* Soft Glow Background */}
        <div 
          className="absolute -inset-4 bg-gray-50 rounded-full blur-2xl opacity-50 animate-pulse"
          style={{ backgroundColor: `${winkGreen}20` }}
        ></div>

        <h2 className="relative text-5xl font-black tracking-tighter flex items-center">
          <span style={{ color: winkGreen }} className="animate-[bounce_2s_infinite]">W</span>
          <span style={{ color: winkGreen }}>ink</span>
          <span style={{ color: itBlue }} className="ml-px">it</span>
          
          {/* The "Wink" Indicator - A small dot that blinks */}
          <span 
            className="ml-2 w-3 h-3 rounded-full animate-ping"
            style={{ backgroundColor: winkGreen }}
          ></span>
        </h2>
      </div>

      {/* 3. Minimalist Loader Text */}
      <div className="mt-8 flex flex-col items-center">
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-[bounce_1s_infinite_100ms]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-[bounce_1s_infinite_200ms]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-[bounce_1s_infinite_300ms]"></div>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-400 tracking-[0.2em] uppercase">
          Optimizing for you
        </p>
      </div>

      {/* Custom Keyframes for Tailwind (Add these to your global CSS or Tailwind Config) */}
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default FullScreenLoader;
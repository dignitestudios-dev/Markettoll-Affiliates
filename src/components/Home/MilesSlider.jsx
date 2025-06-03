import React, { useState } from 'react';

export default function DistanceSlider({setMile}) {
  const [distance, setDistance] = useState(0); // Starting at 100 miles (2nd position)
  
  const handleSliderChange = (e) => {
    setDistance(parseInt(e.target.value));
    setMile(e.target.value)
  };

  return (
    <div className="w-full max-w-2xl mx-auto  mt-4 bg-white">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">Distance (Miles)</h2>
      
      <div className="relative">
        {/* Slider container */}
        <div className="relative">
          {/* Slider input */}
          <input
            type="range"
            min="50"
            max="250"
            step="50"
            value={distance}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(distance - 50) / 200 * 100}%, #d1d5db ${(distance - 50) / 200 * 100}%, #d1d5db 100%)`
            }}
          />
          
          {/* Custom slider thumb */}
          <div 
            className="absolute top-1/2 w-5 h-5 bg-cyan-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 border-2 border-white shadow-lg pointer-events-none"
            style={{
              left: `${(distance - 47) / 206 * 100}%`
            }}
          ></div>
        </div>
        
        {/* Distance markers */}
        <div className="flex justify-between mt-4 text-gray-600">
          <span className="text-sm">50miles</span>
          <span className="text-sm">100miles</span>
          <span className="text-sm">150miles</span>
          <span className="text-sm">200miles</span>
          <span className="text-sm">250miles</span>
        </div>
      </div>

    </div>
  );
}
import React, { useState } from "react";

export default function DistanceSlider({ setMile }) {
  const [distance, setDistance] = useState(0); // Starting at 100 miles (2nd position)

  const handleSliderChange = (e) => {
    setDistance(parseInt(e.target.value));
    setMile(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto  mt-4 bg-white">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Distance (Miles)
      </h2>

      <div className="relative">
        {/* Slider input */}
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={distance}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${
              ((distance - 50) / 950) * 100
            }%, #d1d5db ${((distance - 50) / 950) * 100}%, #d1d5db 100%)`,
          }}
        />

        {/* Distance markers */}
        <div className="flex justify-between mt-4 text-gray-600 text-xs">
          {[...Array(20)].map((_, i) => {
            const val = 50 + i * 50;
            return <span key={val}>{val}</span>;
          })}
        </div>
      </div>
    </div>
  );
}

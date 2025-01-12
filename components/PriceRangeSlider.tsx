import React from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export default function PriceRangeSlider({
  min,
  max,
  value,
  onChange
}: PriceRangeSliderProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), value[1] - 1);
    onChange([newMin, value[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), value[0] + 1);
    onChange([value[0], newMax]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-24">
          <label className="block text-sm font-medium text-gray-700">Min</label>
          <input
            type="number"
            min={min}
            max={value[1] - 1}
            value={value[0]}
            onChange={handleMinChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="w-24">
          <label className="block text-sm font-medium text-gray-700">Max</label>
          <input
            type="number"
            min={value[0] + 1}
            max={max}
            value={value[1]}
            onChange={handleMaxChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="h-1 w-full bg-gray-200 rounded"></div>
        </div>
        <div
          className="absolute inset-0 flex items-center"
          style={{
            left: `${(value[0] / max) * 100}%`,
            right: `${100 - (value[1] / max) * 100}%`
          }}
        >
          <div className="h-1 w-full bg-blue-500 rounded"></div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={handleMinChange}
          className="absolute w-full appearance-none bg-transparent pointer-events-none"
          style={{ height: '1.25rem' }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={handleMaxChange}
          className="absolute w-full appearance-none bg-transparent pointer-events-none"
          style={{ height: '1.25rem' }}
        />
      </div>
    </div>
  );
} 
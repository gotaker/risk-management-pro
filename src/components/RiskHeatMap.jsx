import React, { useMemo } from 'react';
import { RISK_LEVELS } from '../types/constants';

const RiskHeatMap = ({ risks, title, type }) => {
  // Create 4x4 grid with risk counts and highest category markers
  const heatmapData = useMemo(() => {
    const grid = Array(4).fill(null).map(() => 
      Array(4).fill(null).map(() => ({ count: 0, categories: {} }))
    );

    risks.forEach(risk => {
      if (risk.type !== type) return;
      
      const impact = risk.impact;
      const probability = risk.probability;
      
      // Map to 4x4 grid (combining values 1-5 into 1-4)
      const gridImpact = Math.min(4, Math.ceil(impact * 0.8));
      const gridProb = Math.min(4, Math.ceil(probability * 0.8));
      
      if (gridImpact >= 1 && gridImpact <= 4 && gridProb >= 1 && gridProb <= 4) {
        const cell = grid[4 - gridImpact][gridProb - 1];
        cell.count++;
        
        // Track categories for "highest per category"
        const catKey = risk.category.substring(0, 2).toUpperCase();
        if (!cell.categories[catKey]) {
          cell.categories[catKey] = { count: 0, category: risk.category };
        }
        cell.categories[catKey].count++;
      }
    });

    return grid;
  }, [risks, type]);

  // Find highest category per cell
  const getCellColor = (rowIndex, colIndex) => {
    const impact = 4 - rowIndex;
    const probability = colIndex + 1;
    const score = impact * probability;

    if (score >= 13) return { bg: '#dc2626', border: '#991b1b' }; // Red - Critical
    if (score >= 9) return { bg: '#ef4444', border: '#b91c1c' }; // Red - High
    if (score >= 6) return { bg: '#fbbf24', border: '#d97706' }; // Yellow - Medium
    if (score >= 3) return { bg: '#60a5fa', border: '#2563eb' }; // Blue - Low-Medium
    return { bg: '#3b82f6', border: '#1d4ed8' }; // Blue - Low
  };

  const getHighestCategory = (cell) => {
    const categories = Object.values(cell.categories);
    if (categories.length === 0) return null;
    return categories.reduce((max, cat) => cat.count > max.count ? cat : max);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="bg-teal-700 text-white text-center py-3 rounded-t-lg font-semibold text-lg">
          Highest per category
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center mt-4 mb-2">{title}</h3>
      </div>

      <div className="relative">
        {/* Y-axis label */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 font-semibold text-gray-700">
          Impact
        </div>

        {/* Grid */}
        <div className="border-4 border-gray-800 rounded-lg overflow-hidden">
          {heatmapData.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {/* Y-axis numbers */}
              <div className="w-12 flex items-center justify-center bg-white border-r-2 border-gray-800 font-bold text-gray-700">
                {4 - rowIndex}
              </div>
              
              {/* Grid cells */}
              {row.map((cell, colIndex) => {
                const colors = getCellColor(rowIndex, colIndex);
                const highestCat = getHighestCategory(cell);
                
                return (
                  <div
                    key={colIndex}
                    className="flex-1 aspect-square flex items-center justify-center relative border border-gray-800 transition-all duration-200 hover:scale-105 hover:z-10"
                    style={{ 
                      backgroundColor: colors.bg,
                      borderColor: colors.border,
                      borderWidth: '2px'
                    }}
                  >
                    {highestCat && (
                      <div className="relative group">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-gray-800 shadow-lg cursor-pointer">
                          {highestCat.category.substring(0, 2).toUpperCase()}
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
                            <div className="font-semibold">{highestCat.category}</div>
                            <div className="text-gray-300">{cell.count} risk{cell.count > 1 ? 's' : ''}</div>
                            <div className="text-gray-400 text-xs">Impact: {4 - rowIndex}, Prob: {colIndex + 1}</div>
                          </div>
                          <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute top-full left-1/2 -translate-x-1/2 -mt-1"></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Risk count badge */}
                    {cell.count > 0 && (
                      <div className="absolute top-1 right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-800 shadow">
                        {cell.count}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          
          {/* X-axis */}
          <div className="flex bg-white border-t-2 border-gray-800">
            <div className="w-12"></div>
            {[1, 2, 3, 4].map(num => (
              <div key={num} className="flex-1 text-center py-2 font-bold text-gray-700">
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* X-axis label */}
        <div className="text-center font-semibold text-gray-700 mt-3">
          Probability
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
          <span className="text-sm text-gray-600">Low (1-5)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
          <span className="text-sm text-gray-600">Medium (6-9)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: '#ef4444' }}></div>
          <span className="text-sm text-gray-600">High (10-15)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: '#dc2626' }}></div>
          <span className="text-sm text-gray-600">Critical (16+)</span>
        </div>
      </div>
    </div>
  );
};

export default RiskHeatMap;

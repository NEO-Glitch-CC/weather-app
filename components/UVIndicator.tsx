"use client";

import React from 'react';

interface UVIndicatorProps {
  uvIndex?: number | null;
}

export default function UVIndicator({ uvIndex }: UVIndicatorProps) {
  if (uvIndex == null) {
    return <p className="text-sm text-gray-500">UV: —</p>;
  }

  const value = Math.round(uvIndex);
  let level = 'Low';
  let color = 'text-emerald-600';
  let advice = 'Low risk. No protection needed.';

  if (value >= 3 && value <= 5) {
    level = 'Moderate';
    color = 'text-amber-500';
    advice = 'Take precautions: cover up and use sunscreen.';
  } else if (value >= 6 && value <= 7) {
    level = 'High';
    color = 'text-orange-500';
    advice = 'Reduce time in the sun between 10 a.m. and 4 p.m.';
  } else if (value >= 8 && value <= 10) {
    level = 'Very High';
    color = 'text-red-600';
    advice = 'Extra protection required. Avoid midday sun.';
  } else if (value >= 11) {
    level = 'Extreme';
    color = 'text-violet-700';
    advice = 'Take all precautions. Unprotected skin can burn quickly.';
  }

  return (
    <div className="p-3 rounded border border-gray-200 bg-white/40">
      <p className={`font-semibold ${color}`}>UV Index: {value} — {level}</p>
      <p className="text-xs text-gray-600 mt-1">{advice}</p>
    </div>
  );
}

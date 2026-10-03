import React from 'react';
import { Sparkles } from 'lucide-react';

export default function MatchBadge({ score = 70, size = 'md', showLabel = true }) {
  let colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let badgeText = 'High Match';

  if (score >= 85) {
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-sm shadow-emerald-100';
    badgeText = 'Top Match';
  } else if (score >= 70) {
    colorStyles = 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
    badgeText = 'Good Match';
  } else {
    colorStyles = 'bg-amber-50 text-amber-800 border-amber-200/80';
    badgeText = 'Fair Match';
  }

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-base px-3.5 py-1.5 gap-2 font-bold'
  }[size] || 'text-sm px-2.5 py-1 gap-1.5 font-semibold';

  return (
    <div
      className={`inline-flex items-center rounded-full border ${colorStyles} ${sizeStyles} transition-transform hover:scale-[1.02]`}
      title={`AI Match score calculated based on your profile skills, location, availability and education`}
    >
      <Sparkles className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{score}%</span>
      {showLabel && <span className="opacity-80 font-medium text-[0.85em]">Match</span>}
    </div>
  );
}

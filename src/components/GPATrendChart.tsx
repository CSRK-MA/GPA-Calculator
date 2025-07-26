import React from 'react';
import { Semester } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface GPATrendChartProps {
  semesters: Semester[];
}

export function GPATrendChart({ semesters }: GPATrendChartProps) {
  const completedSemesters = semesters.filter(s => s.subjects.length > 0);
  
  if (completedSemesters.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">GPA Trend</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">📊</div>
          <p className="text-gray-500 dark:text-gray-400">No data available yet</p>
        </div>
      </div>
    );
  }

  const maxGPA = 4.0;
  const chartHeight = 200;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">GPA Trend Analysis</h3>
      
      <div className="relative" style={{ height: chartHeight + 40 }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
          {[4.0, 3.0, 2.0, 1.0, 0.0].map(value => (
            <span key={value}>{value.toFixed(1)}</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-8 relative" style={{ height: chartHeight }}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(percent => (
            <div
              key={percent}
              className="absolute w-full border-t border-gray-200 dark:border-gray-700"
              style={{ top: `${percent}%` }}
            />
          ))}

          {/* Data points and lines */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="gpaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            {/* Area under curve */}
            <path
              d={`M 0,${chartHeight} ${completedSemesters.map((sem, index) => {
                const x = (index / (completedSemesters.length - 1)) * 100;
                const y = chartHeight - (sem.gpa / maxGPA) * chartHeight;
                return `L ${x}%,${y}`;
              }).join(' ')} L 100%,${chartHeight} Z`}
              fill="url(#gpaGradient)"
              className="animate-pulse"
            />
            
            {/* Line */}
            <path
              d={`M ${completedSemesters.map((sem, index) => {
                const x = (index / (completedSemesters.length - 1)) * 100;
                const y = chartHeight - (sem.gpa / maxGPA) * chartHeight;
                return `${index === 0 ? 'M' : 'L'} ${x}%,${y}`;
              }).join(' ')}`}
              stroke="rgb(59, 130, 246)"
              strokeWidth="3"
              fill="none"
              className="drop-shadow-sm"
            />
            
            {/* Data points */}
            {completedSemesters.map((sem, index) => {
              const x = (index / (completedSemesters.length - 1)) * 100;
              const y = chartHeight - (sem.gpa / maxGPA) * chartHeight;
              return (
                <g key={sem.id}>
                  <circle
                    cx={`${x}%`}
                    cy={y}
                    r="6"
                    fill="white"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="3"
                    className="hover:r-8 transition-all duration-200 cursor-pointer drop-shadow-md"
                  />
                  <circle
                    cx={`${x}%`}
                    cy={y}
                    r="3"
                    fill="rgb(59, 130, 246)"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="ml-8 mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          {completedSemesters.map(sem => (
            <span key={sem.id} className="transform -rotate-45 origin-left">
              {sem.name.split(' ').slice(-2).join(' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Trend indicators */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {completedSemesters.length > 1 && (
          <>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                {completedSemesters[completedSemesters.length - 1].gpa > completedSemesters[completedSemesters.length - 2].gpa ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : completedSemesters[completedSemesters.length - 1].gpa < completedSemesters[completedSemesters.length - 2].gpa ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <Minus className="h-4 w-4 text-gray-500" />
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Recent Trend</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {Math.max(...completedSemesters.map(s => s.gpa)).toFixed(2)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Peak GPA</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {(completedSemesters.reduce((sum, s) => sum + s.gpa, 0) / completedSemesters.length).toFixed(2)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Average</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
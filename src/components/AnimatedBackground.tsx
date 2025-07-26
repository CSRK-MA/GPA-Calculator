import React from 'react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900" />
      
      {/* Animated shapes */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Large floating circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-yellow-200 dark:bg-yellow-800 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-r from-blue-300 to-purple-300 dark:from-blue-700 dark:to-purple-700 opacity-10 rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-gradient-to-r from-green-300 to-blue-300 dark:from-green-700 dark:to-blue-700 opacity-10 rotate-12 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-gray-300 dark:border-gray-600" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
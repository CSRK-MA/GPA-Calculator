import React from 'react';
import { GraduationCap, BookOpen, Award, TrendingUp } from 'lucide-react';

export function PreloadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center z-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="text-center z-10">
        {/* Main logo with animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6 animate-bounce">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
          
          {/* Floating icons around main logo */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400/80 rounded-full flex items-center justify-center animate-ping">
            <Award className="h-4 w-4 text-white" />
          </div>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400/80 rounded-full flex items-center justify-center animate-ping" style={{ animationDelay: '0.5s' }}>
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-400/80 rounded-full flex items-center justify-center animate-ping" style={{ animationDelay: '1s' }}>
            <BookOpen className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* App title with gradient text */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fadeIn">
          GPA Calculator Pro
        </h1>
        <p className="text-xl text-white/80 mb-8 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          Academic Excellence Tracker
        </p>

        {/* Loading animation */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Progress bar */}
        <div className="w-64 mx-auto bg-white/20 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse" 
               style={{ 
                 width: '100%',
                 animation: 'loadingProgress 2s ease-in-out infinite'
               }} />
        </div>

        <p className="text-white/60 mt-4 text-sm animate-fadeIn" style={{ animationDelay: '1s' }}>
          Loading your academic data...
        </p>
      </div>

      <style jsx>{`
        @keyframes loadingProgress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
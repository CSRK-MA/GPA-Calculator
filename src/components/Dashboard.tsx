import React from 'react';
import { Semester } from '../types';
import { calculateCGPA } from '../utils/gradeCalculations';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { QuickStats } from './QuickStats';
import { GPATrendChart } from './GPATrendChart';
import { GradeDistributionChart } from './GradeDistributionChart';

interface DashboardProps {
  semesters: Semester[];
}

export function Dashboard({ semesters }: DashboardProps) {
  const cgpa = calculateCGPA(semesters);
  const isLowGPA = cgpa < 2.0 && cgpa > 0;
  const isExcellent = cgpa >= 3.5;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-yellow-500 mr-3 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Academic Dashboard
          </h1>
          <Sparkles className="h-8 w-8 text-yellow-500 ml-3 animate-pulse" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Track your academic journey with precision and style
        </p>
      </div>

      {/* Success celebration */}
      {isExcellent && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                🏆
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                Outstanding Performance!
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                Your CGPA of {cgpa.toFixed(2)} demonstrates excellent academic achievement. Keep up the great work!
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Alert for low GPA */}
      {isLowGPA && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 shadow-lg animate-pulse">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                GPA Warning
              </h3>
              <p className="text-red-700 dark:text-red-300 mt-1">
                Your CGPA ({cgpa.toFixed(2)}) is below the recommended threshold of 2.0. Consider seeking academic support.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <QuickStats semesters={semesters} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GPATrendChart semesters={semesters} />
        <GradeDistributionChart semesters={semesters} />
      </div>

      {/* Detailed Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          📊 Detailed Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Academic Performance</h4>
            <div className="space-y-4">
              {['A+/A', 'B+/B', 'C+/C', 'D+/D', 'F'].map((gradeGroup) => {
                const grades = gradeGroup.split('/');
                const count = semesters.reduce((acc, sem) => 
                  acc + sem.subjects.filter(sub => grades.includes(sub.grade)).length, 0
                );
                const total = semesters.reduce((acc, sem) => acc + sem.subjects.length, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={gradeGroup} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{gradeGroup}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {count}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Progress by Year</h4>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((year) => {
                const yearSemesters = semesters.filter(s => s.year === year);
                const yearCredits = yearSemesters.reduce((acc, sem) => 
                  acc + sem.subjects.reduce((sum, sub) => sum + sub.creditHours, 0), 0
                );
                const yearGPA = yearSemesters.length > 0 ? 
                  yearSemesters.reduce((sum, sem) => sum + sem.gpa, 0) / yearSemesters.filter(s => s.subjects.length > 0).length : 0;
                
                return (
                  <div key={year} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Level {year}</span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {yearCredits} credits
                        </div>
                        {yearGPA > 0 && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            GPA: {yearGPA.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((yearCredits / 40) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
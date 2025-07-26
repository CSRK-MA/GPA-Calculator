import React from 'react';
import { Semester } from '../types';
import { calculateCGPA } from '../utils/gradeCalculations';
import { Trophy, Target, BookOpen, Calendar, TrendingUp, Award } from 'lucide-react';

interface QuickStatsProps {
  semesters: Semester[];
}

export function QuickStats({ semesters }: QuickStatsProps) {
  const cgpa = calculateCGPA(semesters);
  const completedSemesters = semesters.filter(s => s.subjects.length > 0);
  const totalSubjects = semesters.reduce((acc, sem) => acc + sem.subjects.length, 0);
  const totalCredits = semesters.reduce((acc, sem) => acc + sem.subjects.reduce((sum, sub) => sum + sub.creditHours, 0), 0);
  
  const excellentGrades = semesters.reduce((acc, sem) => 
    acc + sem.subjects.filter(sub => ['A+', 'A', 'A-'].includes(sub.grade)).length, 0
  );
  
  const completionRate = (completedSemesters.length / 8) * 100;

  const stats = [
    {
      icon: Trophy,
      label: 'CGPA',
      value: cgpa.toFixed(2),
      subtext: cgpa >= 3.5 ? 'Excellent' : cgpa >= 3.0 ? 'Good' : cgpa >= 2.5 ? 'Average' : 'Needs Improvement',
      color: cgpa >= 3.5 ? 'text-yellow-600' : cgpa >= 3.0 ? 'text-blue-600' : cgpa >= 2.5 ? 'text-green-600' : 'text-red-600',
      bgColor: cgpa >= 3.5 ? 'bg-yellow-100 dark:bg-yellow-900/30' : cgpa >= 3.0 ? 'bg-blue-100 dark:bg-blue-900/30' : cgpa >= 2.5 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30',
    },
    {
      icon: BookOpen,
      label: 'Total Credits',
      value: totalCredits.toString(),
      subtext: `${totalSubjects} subjects`,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      icon: Award,
      label: 'Excellent Grades',
      value: excellentGrades.toString(),
      subtext: totalSubjects > 0 ? `${((excellentGrades / totalSubjects) * 100).toFixed(1)}%` : '0%',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      icon: Calendar,
      label: 'Progress',
      value: `${completedSemesters.length}/8`,
      subtext: `${completionRate.toFixed(0)}% complete`,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${stat.color} group-hover:scale-105 transition-transform duration-300`}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.subtext}
              </p>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {stat.label}
          </h3>
          
          {/* Progress bar for completion rate */}
          {stat.label === 'Progress' && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
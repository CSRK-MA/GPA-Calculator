import React from 'react';
import { Semester } from '../types';
import { GRADE_SCALE } from '../utils/gradeCalculations';

interface GradeDistributionChartProps {
  semesters: Semester[];
}

export function GradeDistributionChart({ semesters }: GradeDistributionChartProps) {
  const allSubjects = semesters.flatMap(s => s.subjects);
  const gradeDistribution = Object.keys(GRADE_SCALE).map(grade => {
    const count = allSubjects.filter(s => s.grade === grade).length;
    const percentage = allSubjects.length > 0 ? (count / allSubjects.length) * 100 : 0;
    return { grade, count, percentage };
  }).filter(item => item.count > 0);

  const maxCount = Math.max(...gradeDistribution.map(item => item.count), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Grade Distribution</h3>
      <div className="space-y-4">
        {gradeDistribution.map((item, index) => (
          <div key={item.grade} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Grade {item.grade}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.count} subjects
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
                  GRADE_SCALE[item.grade] >= 3.5
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : GRADE_SCALE[item.grade] >= 3.0
                    ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                    : GRADE_SCALE[item.grade] >= 2.5
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                    : GRADE_SCALE[item.grade] >= 2.0
                    ? 'bg-gradient-to-r from-orange-400 to-orange-600'
                    : 'bg-gradient-to-r from-red-400 to-red-600'
                } group-hover:shadow-lg group-hover:scale-y-110 transform origin-left`}
                style={{ 
                  width: `${(item.count / maxCount) * 100}%`,
                  animationDelay: `${index * 100}ms`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
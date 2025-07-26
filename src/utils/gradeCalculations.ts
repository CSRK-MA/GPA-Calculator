import { Subject, Semester, GradeScale } from '../types';

export const GRADE_SCALE: GradeScale = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

export const GRADES = Object.keys(GRADE_SCALE);

export function calculateSemesterGPA(subjects: Subject[]): number {
  if (subjects.length === 0) return 0;
  
  let totalQualityPoints = 0;
  let totalCredits = 0;
  
  subjects.forEach(subject => {
    const gradePoint = GRADE_SCALE[subject.grade] || 0;
    totalQualityPoints += gradePoint * subject.creditHours;
    totalCredits += subject.creditHours;
  });
  
  return totalCredits > 0 ? totalQualityPoints / totalCredits : 0;
}

export function calculateCGPA(semesters: Semester[]): number {
  let totalQualityPoints = 0;
  let totalCredits = 0;
  
  semesters.forEach(semester => {
    semester.subjects.forEach(subject => {
      const gradePoint = GRADE_SCALE[subject.grade] || 0;
      totalQualityPoints += gradePoint * subject.creditHours;
      totalCredits += subject.creditHours;
    });
  });
  
  return totalCredits > 0 ? totalQualityPoints / totalCredits : 0;
}

export function getGPAStatus(gpa: number): { status: string; color: string } {
  if (gpa >= 3.5) return { status: 'Excellent', color: 'text-green-600 dark:text-green-400' };
  if (gpa >= 3.0) return { status: 'Good', color: 'text-blue-600 dark:text-blue-400' };
  if (gpa >= 2.5) return { status: 'Satisfactory', color: 'text-yellow-600 dark:text-yellow-400' };
  if (gpa >= 2.0) return { status: 'Warning', color: 'text-orange-600 dark:text-orange-400' };
  return { status: 'Critical', color: 'text-red-600 dark:text-red-400' };
}